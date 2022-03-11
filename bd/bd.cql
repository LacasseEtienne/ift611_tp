-- Create a keyspace
CREATE KEYSPACE IF NOT EXISTS chatroom WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : '1' };

-- Create a table
CREATE TABLE IF NOT EXISTS chatroom.messages (
message_id text PRIMARY KEY,
auteur text,
message text,
envoi timestamp
);

-- Insert some data
INSERT INTO chatroom.messages (message_id, auteur, message, envoi) 
VALUES ('1', 'Étienne', 'Hello, world!', '2022-03-10 12:30:00');
INSERT INTO chatroom.messages (message_id, auteur, message, envoi)
VALUES ('2', 'Benjamin', 'Goodbye', toTimeStamp(now()));