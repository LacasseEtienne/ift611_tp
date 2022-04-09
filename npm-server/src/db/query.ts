import { client } from './client';

export function insertIntoMessages(id: string, timeSent: number, author: string, message: string) {
    const insertStatement = 'INSERT INTO messages(id, time_sent, author, message, delay_exceeded) VALUES (?, ?, ?, ?, ?)';
    client.execute(
        insertStatement,
        [id, timeSent, author, message, false],
        { prepare: true }
    );
}
