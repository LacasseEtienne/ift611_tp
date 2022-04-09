import { wss } from "../server";
import { My_ws } from "../types";

export function getUsers() {
    return [...wss.clients].filter((c: My_ws) => {
        return c.readyState === c.OPEN && c.name
    });
}

export function getUsersName() {
    return getUsers().map((u: My_ws) => u.name);
}
