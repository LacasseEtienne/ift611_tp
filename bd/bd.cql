-- Create a keyspace
CREATE KEYSPACE IF NOT EXISTS chatroom WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : '1' };

-- Create a table
CREATE TABLE IF NOT EXISTS chatroom.messages (
sent_time timeuuid PRIMARY KEY,
author text,
message text,
delay_exceeded boolean
);

-- Insert some data
INSERT INTO chatroom.messages (sent_time, author, message, delay_exceeded) 
VALUES (now(), 'Étienne', 'Hello, world!', false);
INSERT INTO chatroom.messages (sent_time, author, message, delay_exceeded)
VALUES (now(), 'Benjamin', 'Goodbye', false);