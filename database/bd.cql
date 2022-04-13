-- Create a keyspace
CREATE KEYSPACE IF NOT EXISTS chatroom WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : '1' };

-- Create a table
CREATE TABLE IF NOT EXISTS chatroom.messages (
server_id uuid,
id uuid,
time_sent timestamp,
author text,
message text,
delay_exceeded boolean,
PRIMARY KEY (server_id, time_sent, id)
) WITH CLUSTERING ORDER BY (time_sent DESC);
