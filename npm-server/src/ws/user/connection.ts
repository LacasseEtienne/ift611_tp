import { wss } from '../server';
import { My_ws } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { handleMessage } from './message';
import { handleClose } from './close';

export function handleConnection() {
    wss.on('connection', function connection(ws: My_ws) {
        ws.uuid = uuidv4();

        handleMessage(ws);
        handleClose(ws);
    });
}

