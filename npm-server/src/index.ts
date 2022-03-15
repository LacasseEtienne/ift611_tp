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
const insertStatement = 'INSERT INTO messages(id, time_sent, author, message, delay_exceeded) VALUES (?, ?, ?, ?, ?)';
const writingUsers: string[] = [];

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws: My_ws) {
  ws.uuid = uuidv4();

  ws.on('message', function echo(data: Buffer) {
    const payload = getObjectFromJsonData(data);

    if (payload.type == "connect") {
      ws.name = payload.user;
      ws.send(JSON.stringify({ type: 'init', uuid: ws.uuid, users: getUsers() }));
      broadcastUpdateUsers();
    }

    if (payload.type == "message") {
      const { text, perf } = payload;
      // Add msg to db
      const messageID = uuidv4();
      const messageTime = Date.now();
      client.execute(insertStatement, [messageID, messageTime, ws.name, text, false], {prepare: true});
      broadcastMessage(ws.name, messageID, perf, text, messageTime);
    }

    if (payload.type == "writing") {
      if (writingUsers.includes(ws.name)) {
        return;
      }
      writingUsers.push(ws.name);
      broadcastWritingUsers();
    }

    if (payload.type == "stopWriting") {
      const index = writingUsers.indexOf(ws.name);
      if (index > -1) {
        writingUsers.splice(index, 1);
        broadcastWritingUsers();
      }
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

function broadcastMessage(name: string, uuid: string, perf: number, text: string, messageTime:number) {
  wss.clients.forEach((connection: My_ws) => {
    connection.send(JSON.stringify({ type: 'message', name, uuid, perf, text, messageTime }));
  })
}

function broadcastWritingUsers() {
  wss.clients.forEach((connection: My_ws) => {
    connection.send(JSON.stringify({ type: 'updateWriting', message: generateWritingMessage(connection.name) }));
  });
}

function generateWritingMessage(name:string) {
  const otherUsers = writingUsers.filter(u => u !== name);
  if (otherUsers.length == 0) {
    return "";
  } else if (otherUsers.length == 1) {
    return `${otherUsers[0]} is typing...`;
  } else if (otherUsers.length == 2) {
    return `${otherUsers[0]} and ${otherUsers[1]} are typing...`;
  } else {
    return `${otherUsers.length} people are typing...`;
  }
}

function getObjectFromJsonData(data: Buffer) {
  return JSON.parse(data.toString())
}
