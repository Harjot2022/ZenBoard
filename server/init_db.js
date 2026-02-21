import pool from './db.js';

const createTables = async () => {
  try {
    // 1. Create Boards Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS boards (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Boards table created");

    // 2. Create Lists Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS lists (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        position INTEGER NOT NULL DEFAULT 0,
        board_id INTEGER REFERENCES boards(id) ON DELETE CASCADE
      );
    `);
    console.log("✅ Lists table created");

    // 3. Create Cards Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cards (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        position INTEGER NOT NULL DEFAULT 0,
        list_id INTEGER REFERENCES lists(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Cards table created");

    // 4. Create Users Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `);
    console.log("✅ Users table created");

  } catch (err) {
    console.error("❌ Error creating tables:", err.message);
  } finally {
    pool.end(); // Close connection
  }
};

createTables();