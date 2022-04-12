import { wss } from '../server';
import { My_ws } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { handleMessage } from './message';
import { handleClose } from './close';
import { clients } from '../../client';

export function handleConnection() {
    wss.on('connection', function connection(ws: My_ws) {
        const clientId = uuidv4();

        ws.uuid = uuidv4();
        ws.clientId = clientId;

        clients[clientId] = {
            uuid: clientId,
            name: '',
            connected: false,
            writing: false,
            socket: ws,
            perf: 0,
        };

        handleMessage(ws);
        handleClose(ws);
    });
}

