const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('pong.db',  (err) => {
    if (err)
        console.error('DB connection error:', err);
    else
        console.log('🗄️  ✅ Database connected successfully!');
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      -- AUTH
      provider TEXT NOT NULL,
      provider_id TEXT UNIQUE,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,

      -- PROFILE
      username TEXT UNIQUE NOT NULL,
      firstname TEXT,
      lastname TEXT,
      avatar_url TEXT DEFAULT 'default-avatar.png',

      -- 2FA
      twofa_enabled BOOLEAN DEFAULT 0,
      twofa_method TEXT,
      twofa_secret TEXT,
      twofa_email_code TEXT,
      twofa_email_expires INTEGER,

      -- META
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

// Export DB so other files can use it
module.exports = db;