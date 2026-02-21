import express from 'express';
import cors from 'cors';
import pool from './db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateToken } from './middleware/auth.js'; // Import the guard

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const SECRET = process.env.JWT_SECRET || 'secretkey123';

// --- AUTH ROUTES ---

// Register
app.post('/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Check if user already exists
    const userCheck = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: "Username already taken" });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Insert User
    const newUser = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
      [username, hashedPassword]
    );

    // 4. Generate Token
    const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET || 'secretkey123');

    res.json({ token, user: newUser.rows[0] });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Login
app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 1. Check if user exists
    const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (user.rows.length === 0) return res.status(401).json({ error: "Invalid Credentials" });

    // 2. Check password
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) return res.status(401).json({ error: "Invalid Credentials" });

    // 3. Give Token
    const token = jwt.sign({ id: user.rows[0].id }, SECRET);
    res.json({ token, user: { id: user.rows[0].id, username: user.rows[0].username } });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Test Route
app.get('/', (req, res) => {
    res.send({ message: "Hello from the Backend!" });
});

// Create a Board
app.post('/boards', async (req, res) => {
  try {
    const { title } = req.body;
    const newBoard = await pool.query(
      "INSERT INTO boards (title) VALUES($1) RETURNING *",
      [title]
    );
    res.json(newBoard.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// --- PROTECTED ROUTES (Add authenticateToken) ---

// Get Boards (Protected)
app.get('/boards', authenticateToken , async (req, res) => {
  try {
    const allBoards = await pool.query("SELECT * FROM boards");
    res.json(allBoards.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// --- LIST ROUTES ---

// Get all lists for a specific board
app.get('/boards/:boardId/lists', async (req, res) => {
  try {
    const { boardId } = req.params;
    const lists = await pool.query(
      "SELECT * FROM lists WHERE board_id = $1 ORDER BY position ASC",
      [boardId]
    );
    res.json(lists.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Create a new list
app.post('/lists', async (req, res) => {
  try {
    const { title, board_id } = req.body;
    
    // 1. Find the current last position so we can add this to the end
    const lastList = await pool.query(
      "SELECT MAX(position) as max_pos FROM lists WHERE board_id = $1",
      [board_id]
    );
    const newPosition = (lastList.rows[0].max_pos === null) ? 0 : lastList.rows[0].max_pos + 1;

    // 2. Insert the new list
    const newList = await pool.query(
      "INSERT INTO lists (title, board_id, position) VALUES($1, $2, $3) RETURNING *",
      [title, board_id, newPosition]
    );
    
    res.json(newList.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- CARD ROUTES ---

// Create a new card
app.post('/cards', async (req, res) => {
  try {
    const { title, list_id } = req.body;

    // 1. Get current max position for cards in this specific list
    const lastCard = await pool.query(
      "SELECT MAX(position) as max_pos FROM cards WHERE list_id = $1",
      [list_id]
    );
    const newPosition = (lastCard.rows[0].max_pos === null) ? 0 : lastCard.rows[0].max_pos + 1;

    // 2. Insert card
    const newCard = await pool.query(
      "INSERT INTO cards (title, list_id, position) VALUES($1, $2, $3) RETURNING *",
      [title, list_id, newPosition]
    );

    res.json(newCard.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get all cards for a specific board
// We join with lists to make sure we only get cards for THIS board
app.get('/boards/:boardId/cards', async (req, res) => {
  try {
    const { boardId } = req.params;
    const cards = await pool.query(
      `SELECT cards.* FROM cards 
       JOIN lists ON cards.list_id = lists.id 
       WHERE lists.board_id = $1 
       ORDER BY cards.position ASC`,
      [boardId]
    );
    res.json(cards.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Move a card (Update list and position)
app.put('/cards/:id/move', async (req, res) => {
  try {
    const { id } = req.params;
    const { newListId } = req.body; 
    // Note: A production app would also handle 'position' re-indexing here.
    // For this clone, we will just update the List ID to keep it simple.
    
    await pool.query(
      "UPDATE cards SET list_id = $1 WHERE id = $2",
      [newListId, id]
    );
    
    res.json({ message: "Card moved" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});