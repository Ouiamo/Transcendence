const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();
const backendUrl = process.env.BACKEND_URL || '';

const path = require('path');

const dbPath = path.join(__dirname, '../data/pong.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err)
        console.error('DB connection error:', err);
    else
        console.log('🗄️  ✅ Database connected successfully!');
});

db.serialize(() => {
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    provider TEXT NOT NULL,
    provider_id TEXT UNIQUE,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    firstname TEXT,
    lastname TEXT,
    avatar_url TEXT DEFAULT 'default.png',
    twofa_enabled BOOLEAN DEFAULT false,
    twofa_method TEXT,
    twofa_secret TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS friends (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      friend_id INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
});


module.exports = db;