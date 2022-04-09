import { broadcastUpdateUsers } from "../broadcast";
import { My_ws } from "../types";

export function handleClose(ws: My_ws) {
    ws.on('close', function disconnect() {
        //Notify all of the update of the users
        broadcastUpdateUsers();
    })
}
