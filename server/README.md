# Install Boost (1.78.0)
## Windows
1. Download Boost from [Boost Downloads](https://www.boost.org/users/download/)
2. Extract the folder where you want the Boost to reside. Ex: C:/Program Files/boost/
3. Create an environment variable named **BOOST_ROOT** pointing to the root of Boost. Ex: C:/Program Files/boost/boost_1_78_0

# Test connection
```shell
curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" -H "Host: 127.0.0.1" -H "Origin: 127.0.0.1" http://127.0.0.1:8080
```