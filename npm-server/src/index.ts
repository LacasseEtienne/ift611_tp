import WebSocket, { WebSocketServer } from 'ws';
type My_ws = WebSocket.WebSocket & { name: string };

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws: My_ws) {

  ws.on('message', function echo(data: Buffer) {
    const payload = getJsonFromData(data);

    if (payload.type == "connect") {
      ws.name = payload.user;
      broadcastUpdateUsers();
    }
    if (payload.type == "message") {
      const user = payload.user;
      const text = payload.text;
      // Add msg to db

      // Send msg to all
      broadcastMessage(user, text);
    }
  });

  ws.on('close', function disconnect() {
    //Notify all of the update of the users
    //broadcastUpdateUsers();
  })
});

function broadcastUpdateUsers() {
  wss.clients.forEach((connection: My_ws) => {
    connection.send(JSON.stringify({ type: 'updateUsers', users: [...wss.clients].map((c: My_ws) => c.name) }));
  });
}

function broadcastMessage(user: string, text: string) {
  wss.clients.forEach((connection: My_ws) => {
    connection.send(JSON.stringify({ type: 'message', user: user, text: text }))
  })
}

function getJsonFromData(data: Buffer) {
  return JSON.parse(data.toString())
}
