-- Use this SQL script to initialize the chat_sessions and messages tables

-- Create the chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  chat_session_id TEXT PRIMARY KEY,                     -- Unique identifier for each chat session
  user_uuid TEXT NOT NULL,                              -- Firebase user UUID of the user associated with the session
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP        -- Timestamp of when the chat session was started
);

-- Create the messages table
CREATE TABLE IF NOT EXISTS messages (
  message_id INTEGER PRIMARY KEY AUTOINCREMENT,         -- Unique identifier for each message
  chat_session_id TEXT NOT NULL,                        -- Reference to a specific chat session
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'assistant', 'system')),
  message_text TEXT,                                    -- The text content of the message
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,       -- Timestamp of when the message was created/sent
  FOREIGN KEY (chat_session_id) REFERENCES chat_sessions(chat_session_id)
);
