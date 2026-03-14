import express from 'express';
import cors from 'cors';
import pool from './db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateToken } from './middleware/auth.js'; // Import the guard

// --- IMPORTS FOR WEBSOCKETS ---
import { createServer } from 'http';
import { Server } from 'socket.io';

const allowedOrigins = [
  'http://localhost:5173', 
  'https://zen-board-chi.vercel.app', 
  'https://zen-board-p4d60twun-harjot2022s-projects.vercel.app'
];

const app = express();

// Middleware
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

const SECRET = process.env.JWT_SECRET || 'secretkey123';

// --- SOCKET.IO SETUP ---
const server = createServer(app); // Wrap Express inside standard HTTP
const io = new Server(server, {
  cors: {
    origin: allowedOrigins, // Allow your React frontend to connect
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// --- WEBSOCKET CONNECTION LOGIC ---
io.on('connection', (socket) => {
  console.log(`🟢 User connected via WebSocket: ${socket.id}`);

  // When a user opens a specific board on the frontend, they will "join" this room
  socket.on('join-board', (boardId) => {
    socket.join(`board-${boardId}`);
    console.log(`👤 User joined room: board-${boardId}`);
  });

  // When they leave the board or close the tab
  socket.on('leave-board', (boardId) => {
    socket.leave(`board-${boardId}`);
    console.log(`👋 User left room: board-${boardId}`);
  });

  socket.on('disconnect', () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
  });
});

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
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
      [username, hashedPassword]
    );

    // 4. Generate Token
    const token = jwt.sign({ 
      id: newUser.rows[0].id,
      username: newUser.rows[0].username },
      process.env.JWT_SECRET || 'secretkey123'
    );

    res.json({ token, user: { id: newUser.rows[0].id, username: newUser.rows[0].username } });

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
    const token = jwt.sign({ 
      id: user.rows[0].id, 
      username: user.rows[0].username },
       process.env.JWT_SECRET || 'secretkey123'
      );
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
app.post('/boards',authenticateToken, async (req, res) => {
  try {
    const { title } = req.body;

    console.log("1. Who is the user?", req.user);
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "req.user.id is undefined! Check your token payload." });
    }

    const newBoard = await pool.query(
      "INSERT INTO boards (title) VALUES($1) RETURNING *",
      [title]
    );
    
    // --- DEBUG LOGS ---
    console.log("2. Did the board create?", newBoard.rows[0]);
    if (!newBoard.rows[0]) {
       return res.status(500).json({ error: "Board creation failed. Missing RETURNING * ?" });
    }

    const boardId = newBoard.rows[0].id;

    // 2. Add the creator to board_members as an 'admin'
    await pool.query(
      "INSERT INTO board_members (user_id, board_id, role) VALUES ($1, $2, $3)",
      [req.user.id, boardId, 'admin']
    );
    
    res.json(newBoard.rows[0]);
  } catch (err) {
    console.error("Board Creation Error:", err.message);
    res.status(500).send("Server Error");
  }
});

// --- PROTECTED ROUTES (Add authenticateToken) ---

// Get Boards (Protected)
app.get('/boards', authenticateToken , async (req, res) => {
  try {
    // join the boards table with the board_members table to filter by req.user.id
    const userBoards = await pool.query(`
      SELECT boards.*, board_members.role 
      FROM boards 
      JOIN board_members ON boards.id = board_members.board_id 
      WHERE board_members.user_id = $1
    `, [req.user.id]);
    
    res.json(userBoards.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Get a specific board by ID
app.get('/boards/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if the board exists AND if the user has permission to view it
    const boardQuery = await pool.query(`
      SELECT boards.*, board_members.role 
      FROM boards 
      JOIN board_members ON boards.id = board_members.board_id 
      WHERE boards.id = $1 AND board_members.user_id = $2
    `, [id, req.user.id]);
    
    if (boardQuery.rows.length === 0) {
      return res.status(404).json({ error: "Board not found or unauthorized access." });
    }
    
    res.json(boardQuery.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    
    io.to(`board-${board_id}`).emit('board-updated');

    res.json(newList.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Delete a list (and all its cards)
app.delete('/lists/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { boardId } = req.query; // For WebSockets

    // 1. Delete all cards inside this list first (Database relationship cleanup)
    await pool.query("DELETE FROM cards WHERE list_id = $1", [id]);
    
    // 2. Delete the list itself
    await pool.query("DELETE FROM lists WHERE id = $1", [id]);

    // 3. Broadcast to the room
    if (boardId) {
      io.to(`board-${boardId}`).emit('board-updated');
    }

    res.json({ message: "List deleted successfully." });
  } catch (err) {
    console.error("List Delete Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Delete an entire board
app.delete('/boards/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Security Check: Is this user the Admin of the board?
    const authCheck = await pool.query(
      "SELECT role FROM board_members WHERE board_id = $1 AND user_id = $2",
      [id, req.user.id]
    );

    if (authCheck.rows.length === 0 || authCheck.rows[0].role !== 'admin') {
      return res.status(403).json({ error: "Only the board owner can delete this project." });
    }

    // 2. Cleanup: Delete all connected data to prevent database errors
    // (We delete from the bottom up: Cards -> Lists -> Members -> Board)
    await pool.query("DELETE FROM cards WHERE list_id IN (SELECT id FROM lists WHERE board_id = $1)", [id]);
    await pool.query("DELETE FROM lists WHERE board_id = $1", [id]);
    await pool.query("DELETE FROM board_members WHERE board_id = $1", [id]);
    
    // 3. Finally, delete the board itself
    await pool.query("DELETE FROM boards WHERE id = $1", [id]);

    res.json({ message: "Project deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- CARD ROUTES ---

// Create a new card
app.post('/cards', authenticateToken, async (req, res) => {
  try {
    const { title, list_id, boardId } = req.body;

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
    
    if (boardId) io.to(`board-${boardId}`).emit('board-updated');

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

// Delete a specific card
app.delete('/cards/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // We need the boardId to broadcast the WebSocket event
    // In Axios, DELETE requests send data differently, so we'll grab it from the query URL
    const { boardId } = req.query; 

    await pool.query("DELETE FROM cards WHERE id = $1", [id]);

    // Broadcast the real-time update to everyone else looking at the board!
    if (boardId) {
      io.to(`board-${boardId}`).emit('board-updated');
    }

    res.json({ message: "Card deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Invite a user to a board via username
app.post('/boards/:boardId/invite', authenticateToken, async (req, res) => {
  try {
    const { boardId } = req.params;
    const { username } = req.body; // <-- Changed to username

    // 1. Find the user we want to invite by their username
    const userToInvite = await pool.query("SELECT id FROM users WHERE username = $1", [username]);
    
    if (userToInvite.rows.length === 0) {
      return res.status(404).json({ error: "No user found with that username." });
    }
    
    const newMemberId = userToInvite.rows[0].id;

    // 2. Security Check: Is the person sending the invite actually a member of this board?
    const authCheck = await pool.query(
      "SELECT * FROM board_members WHERE board_id = $1 AND user_id = $2",
      [boardId, req.user.id] 
    );

    if (authCheck.rows.length === 0) {
      return res.status(403).json({ error: "You don't have permission to invite users to this board." });
    }

    // 3. Duplicate Check: Are they already in the board?
    const existingMember = await pool.query(
      "SELECT * FROM board_members WHERE board_id = $1 AND user_id = $2",
      [boardId, newMemberId]
    );

    if (existingMember.rows.length > 0) {
      return res.status(400).json({ error: "This user is already a member of the board." });
    }

    // 4. Success! Add them to the board as a 'member'
    await pool.query(
      "INSERT INTO board_members (user_id, board_id, role) VALUES ($1, $2, $3)",
      [newMemberId, boardId, 'member']
    );

    res.json({ message: "User successfully added to the board!" });

  } catch (err) {
    console.error("Invite Error:", err.message);
    res.status(500).json({ error: "Server error while inviting user." });
  }
});

// Move a card (Update list and position)
app.put('/cards/:id/move', async (req, res) => {
  try {
    const { id } = req.params;
    const { newListId , boardId} = req.body; 
    // Note: A production app would also handle 'position' re-indexing here.
    // For this clone, we will just update the List ID to keep it simple.
    
    await pool.query(
      "UPDATE cards SET list_id = $1 WHERE id = $2",
      [newListId, id]
    );
    
    io.to(`board-${boardId}`).emit('board-updated');

    res.json({ message: "Card moved" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Update a card's details (like description)
app.put('/cards/:id',authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { description , due_date , boardId} = req.body;
    
    // Update the description and return the updated card
    const updatedCard = await pool.query(
      "UPDATE cards SET description = $1, due_date = $2 WHERE id = $3 RETURNING *",
      [description, due_date, id]
    );
    
    if (boardId) io.to(`board-${boardId}`).emit('board-updated');

    res.json(updatedCard.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});
// Start Server
const PORT = 5000;
server.listen(5000, () => 
  console.log(`🚀 Server & WebSockets running on port 5000`));