#include <cstdlib>
#include <iostream>
#include <vector>
#include <boost/asio.hpp>
#include <boost/beast.hpp>

namespace net = boost::asio;
namespace beast = boost::beast;
namespace websocket = beast::websocket;
namespace http = beast::http;
using tcp = boost::asio::ip::tcp;

void fail(beast::error_code ec, char const *what) {
    std::cerr << what << ": " << ec.message() << "\n";
}

// Echoes back all received WebSocket messages
class session : public std::enable_shared_from_this<session> {
    websocket::stream<beast::tcp_stream> ws_;
    beast::flat_buffer buffer_;

public:
    // Take ownership of the socket
    explicit session(tcp::socket &&socket) : ws_(std::move(socket)) {
    }

    // Get on the correct executor
    void run() {
        // We need to be executing within a strand to perform async operations
        // on the I/O objects in this session. Although not strictly necessary
        // for single-threaded contexts, this example code is written to be
        // thread-safe by default.
        net::dispatch(ws_.get_executor(), beast::bind_front_handler(&session::on_run, shared_from_this()));
    }

    // Start the asynchronous operation
    void on_run() {
        // Set suggested timeout settings for the websocket
        ws_.set_option(websocket::stream_base::timeout::suggested(beast::role_type::server));

        // Set a decorator to change the Server of the handshake
        ws_.set_option(websocket::stream_base::decorator([](websocket::response_type &res) {
            res.set(http::field::server, std::string(BOOST_BEAST_VERSION_STRING) + " websocket-server-async");
        }));
        // Accept the websocket handshake
        ws_.async_accept(beast::bind_front_handler(&session::on_accept, shared_from_this()));
    }

    void on_accept(beast::error_code ec) {
        if (ec)
            return fail(ec, "accept");

        // Read a message
        do_read();
    }

    void do_read() {
        // Read a message into our buffer
        ws_.async_read(buffer_, beast::bind_front_handler(&session::on_read, shared_from_this()));
    }

    void on_read(beast::error_code ec, std::size_t bytes_transferred) {
        boost::ignore_unused(bytes_transferred);

        // This indicates that the session was closed
        if (ec == websocket::error::closed)
            return;

        if (ec)
            fail(ec, "read");

        // Echo the message
        ws_.text(ws_.got_text());
        ws_.async_write(buffer_.data(), beast::bind_front_handler(&session::on_write, shared_from_this()));
    }

    void on_write(beast::error_code ec, std::size_t bytes_transferred) {
        boost::ignore_unused(bytes_transferred);

        if (ec)
            return fail(ec, "write");

        // Clear the buffer
        buffer_.consume(buffer_.size());

        // Do another read
        do_read();
    }
};

class listener : public std::enable_shared_from_this<listener> {
    net::io_context &ioc_;
    tcp::acceptor acceptor_;

public:
    listener(net::io_context &ioc, tcp::endpoint endpoint) : ioc_(ioc), acceptor_(ioc) {
        beast::error_code ec;

        // Open the acceptor
        acceptor_.open(endpoint.protocol(), ec);
        if (ec) {
            fail(ec, "open");
            return;
        }

        // Allow address reuse
        acceptor_.set_option(net::socket_base::reuse_address(true), ec);
        if (ec) {
            fail(ec, "set_option");
            return;
        }

        // Bind to the server address
        acceptor_.bind(endpoint, ec);
        if (ec) {
            fail(ec, "bind");
            return;
        }

        // Start listening for connections
        acceptor_.listen(net::socket_base::max_listen_connections, ec);
        if (ec) {
            fail(ec, "listen");
            return;
        }
    }

    // Start accepting incoming connections
    void run() {
        do_accept();
    }

private:
    void do_accept() {
        // The new connection gets its own strand
        acceptor_.async_accept(net::make_strand(ioc_),
                               beast::bind_front_handler(&listener::on_accept, shared_from_this()));
    }

    void on_accept(beast::error_code ec, tcp::socket socket) {
        if (ec) {
            fail(ec, "accept");
        } else {
            // Create the session and run it
            std::make_shared<session>(std::move(socket))->run();
        }

        // Accept another connection
        do_accept();
    }
};

auto checkCommandLineArguments(int argc) {
    if (argc != 4) {
        std::cerr << "Usage: websocket-server-async <address> <port> <threads>\n" << "Example:\n"
                  << "    websocket-server-async 127.0.0.1 8080 1\n";
        return EXIT_FAILURE;
    }
    return EXIT_SUCCESS;
}

auto createAnIOContext(int threads) {
    return net::io_context{threads};
}

void createAndLaunchListeningPort(net::io_context &ioc, const net::ip::address address, const unsigned short port) {
    std::make_shared<listener>(ioc, tcp::endpoint{address, port})->run();
}

void runIOService(const int threads, net::io_context &ioc) {
    std::vector<std::thread> v;
    v.reserve(threads - 1);
    for (auto i = threads - 1; i > 0; --i)
        v.emplace_back([&ioc] {
            ioc.run();
        });
    ioc.run();
}

int main(int argc, char *argv[]) {
    if (checkCommandLineArguments(argc) == EXIT_FAILURE) {
        return EXIT_FAILURE;
    }

    auto const address = net::ip::make_address(argv[1]);
    auto const port = static_cast<unsigned short>(std::atoi(argv[2]));
    auto const threads = std::max<int>(1, std::atoi(argv[3]));

    auto ioc = createAnIOContext(threads);
    createAndLaunchListeningPort(ioc, address, port);
    runIOService(threads, ioc);

    return EXIT_SUCCESS;
}