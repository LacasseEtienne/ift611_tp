import { client } from './client';

const serverId = '85ad6edb-fdef-4636-aed7-7cd32acef06d';

export function insertIntoMessages(id: string, timeSent: number, author: string, message: string) {
    const insertStatement = 'INSERT INTO messages(server_id, id, time_sent, author, message, delay_exceeded) VALUES (?, ?, ?, ?, ?, ?)';
    client.execute(
        insertStatement,
        [serverId, id, timeSent, author, message, false],
        { prepare: true }
    );
}

export function updateMessageDelayExceeded(id: string, timeSent: number) {
    const updateStatement = 'UPDATE messages SET delay_exceeded = true WHERE server_id = ? AND id = ? AND time_sent = ?';
    return client.execute(
        updateStatement,
        [serverId, id, timeSent],
        { prepare: true }
    );
}

export function getLastMessages(limit: number) {
    const selectStatement = 'SELECT * FROM messages WHERE server_id = ? ORDER BY time_sent DESC LIMIT ?';
    return client.execute(
        selectStatement,
        [serverId, limit],
        { prepare: true }
    );
}
