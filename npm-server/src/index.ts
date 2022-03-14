import WebSocket, { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
type My_ws = WebSocket.WebSocket & { name: string, uuid: string };
import Cassandra from 'cassandra-driver';

const cassandra = require('cassandra-driver');
const client:Cassandra.Client = new cassandra.Client({
  contactPoints: ['0.0.0.0'],
  keyspace: 'chatroom',
  localDataCenter: 'datacenter1',
})

client.connect();
const insertStatement = 'INSERT INTO messages(sent_time, author, message, delay_exceeded) VALUES (now(), ?, ?, ?)';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws: My_ws) {
  ws.uuid = uuidv4();

  ws.on('message', function echo(data: Buffer) {
    const payload = getJsonFromData(data);

    if (payload.type == "connect") {
      ws.name = payload.user;
      ws.send(JSON.stringify({ type: 'init', uuid: ws.uuid, users: getUsers() }));
      broadcastUpdateUsers();
    }

    if (payload.type == "message") {
      const { text, perf } = payload;
      // Add msg to db
      client.execute(insertStatement, [ws.name, text, false], {prepare: true});      

      // Send msg to all
      broadcastMessage(ws.name, ws.uuid, perf, text);
    }
  });
  ws.on('close', function disconnect() {
    //Notify all of the update of the users
    broadcastUpdateUsers();
  })
});

function getUsers() {
  return [...wss.clients].map((c: My_ws) => c.readyState === c.OPEN && c.name);
}

function broadcastUpdateUsers() {
  wss.clients.forEach((connection: My_ws) => {
    connection.send(JSON.stringify({ type: 'updateUsers', users: getUsers() }));
  });
}

function broadcastMessage(name: string, uuid: string, perf: number, text: string) {
  wss.clients.forEach((connection: My_ws) => {
    connection.send(JSON.stringify({ type: 'message', name, uuid, perf, text: text }))
  })
}

function getJsonFromData(data: Buffer) {
  return JSON.parse(data.toString())
}
