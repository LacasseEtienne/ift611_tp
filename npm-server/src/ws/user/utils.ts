import { wss } from "../server";
import { My_ws } from "../types";

export function getUsers() {
    return [...wss.clients].map((c: My_ws) => c.readyState === c.OPEN && c.name);
}
