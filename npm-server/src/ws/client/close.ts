import { removeClient } from "../../client";
import { broadcastUpdateUsers, broadcastWritingUsers } from "../broadcast";
import { My_ws } from "../types";

export function handleClose(ws: My_ws) {
    ws.on('close', function disconnect() {
        removeClient(ws.clientId);
        broadcastUpdateUsers();
        broadcastWritingUsers();
    });
}
