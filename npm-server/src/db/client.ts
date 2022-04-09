import { Client } from 'cassandra-driver';

export const client = new Client({
    contactPoints: ['0.0.0.0'],
    keyspace: 'chatroom',
    localDataCenter: 'datacenter1',
});

client.connect();
