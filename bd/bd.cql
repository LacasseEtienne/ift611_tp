-- Create a keyspace
CREATE KEYSPACE IF NOT EXISTS chatroom WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : '1' };

-- Create a table
CREATE TABLE IF NOT EXISTS chatroom.messages (
id uuid PRIMARY KEY,
time_sent timestamp,
author text,
message text,
delay_exceeded boolean
);

-- Insert some data
INSERT INTO chatroom.messages (id, time_sent, author, message, delay_exceeded) 
VALUES (uuid(), toTimestamp(now()), 'Étienne', 'Hello, world!', false);
INSERT INTO chatroom.messages (id, time_sent, author, message, delay_exceeded)
VALUES (uuid(), toTimestamp(now()), 'Benjamin', 'Goodbye', false);