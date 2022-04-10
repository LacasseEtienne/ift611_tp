import { My_ws } from '../ws';

type Client = {
    uuid: string,
    name: string,
    connected: boolean,
    writing: boolean,
    socket: My_ws,
};

export const clients: { [id: string]: Client } = {};

export function removeClient(uuid: string) {
    delete clients[uuid];
}

export function getWritingClients(): Client[] {
    return Object.values(clients).filter(c => c.writing);
}

export function getUsersName(): string[] {
    return Object.values(clients).map(c => c.name);
}
