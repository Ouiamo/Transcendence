const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();
const backendUrl = process.env.BACKEND_URL || 'https://10.13.249.23:3010';

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
    provider TEXT NOT NULL,
    provider_id TEXT UNIQUE,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    firstname TEXT,
    lastname TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);
   // Check existing columns
  db.all(`PRAGMA table_info(users);`, (err, columns) => {
    if (err) throw err;
    const columnNames = columns.map(c => c.name);
    if(!columnNames.includes('avatar_url')) {
      db.run(`ALTER TABLE users ADD COLUMN avatar_url TEXT DEFAULT '${backendUrl}/api/avatar/default.png';`);
    }
    if (!columnNames.includes('twofa_enabled')) {
      db.run(`ALTER TABLE users ADD COLUMN twofa_enabled BOOLEAN DEFAULT false;`);
    }
    if (!columnNames.includes('twofa_method')) {
      db.run(`ALTER TABLE users ADD COLUMN twofa_method TEXT;`);
    }
    if (!columnNames.includes('twofa_secret')) {
      db.run(`ALTER TABLE users ADD COLUMN twofa_secret TEXT;`);
    }
    // if (!columnNames.includes('twofa_email_code')) {
    //   db.run(`ALTER TABLE users ADD COLUMN twofa_email_code TEXT;`);
    // }
    // if (!columnNames.includes('twofa_email_expires')) {
    //   db.run(`ALTER TABLE users ADD COLUMN twofa_email_expires INTEGER;`);
    // }
  });
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