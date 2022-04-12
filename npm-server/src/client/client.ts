import { My_ws } from '../ws';

type Client = {
    uuid: string,
    name: string,
    connected: boolean,
    writing: boolean,
    socket: My_ws,
    perf: number,
};

export const clients: { [id: string]: Client } = {};

export function removeClient(uuid: string) {
    delete clients[uuid];
}

export function getWritingClients(): Client[] {
    return Object.values(clients).filter(c => c.writing);
}

export function getUsersInfo() {
    return Object.values(clients).map(c => ({
        uuid: c.uuid,
        name: c.name,
        connected: c.connected,
        writing: c.writing,
        perf: c.perf,
    }));
}

export function getUsersName(): string[] {
    return Object.values(clients).map(c => c.name);
}
