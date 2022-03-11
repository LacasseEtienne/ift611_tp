-- Create a keyspace
CREATE KEYSPACE IF NOT EXISTS chatroom WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : '1' };

-- Create a table
CREATE TABLE IF NOT EXISTS chatroom.messages (
temps_envoi timeuuid PRIMARY KEY,
auteur text,
message text,
);

-- Insert some data
INSERT INTO chatroom.messages (temps_envoi, auteur, message) 
VALUES (now(), 'Étienne', 'Hello, world!');
INSERT INTO chatroom.messages (temps_envoi, auteur, message)
VALUES (now(), 'Benjamin', 'Goodbye');