import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup (tạo file database.sqlite)
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initDb();
  }
});

// Khởi tạo bảng (không seed dữ liệu)
function initDb() {
  db.run(`CREATE TABLE IF NOT EXISTS mentors (
    id TEXT PRIMARY KEY,
    name TEXT,
    role TEXT,
    company TEXT,
    imageUrl TEXT,
    bio TEXT,
    topics TEXT,
    isVisible INTEGER,
    featured INTEGER,
    price TEXT,
    experience TEXT,
    reviews INTEGER
  )`, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Mentors table ready.');
    }
  });
}

// API Routes

// Get all mentors
app.get('/api/mentors', (req, res) => {
  db.all("SELECT * FROM mentors", [], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    // Parse topics from JSON string back to array
    const mentors = rows.map(row => ({
      ...row,
      topics: JSON.parse(row.topics),
      isVisible: Boolean(row.isVisible),
      featured: Boolean(row.featured)
    }));
    res.json(mentors);
  });
});

// Create mentor
app.post('/api/mentors', (req, res) => {
  const m = req.body;
  const id = Math.random().toString(36).substr(2, 9);
  const sql = `INSERT INTO mentors (id, name, role, company, imageUrl, bio, topics, isVisible, featured, price, experience, reviews) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [id, m.name, m.role, m.company, m.imageUrl, m.bio, JSON.stringify(m.topics), m.isVisible ? 1 : 0, m.featured ? 1 : 0, m.price, m.experience, m.reviews];
  
  db.run(sql, params, function(err) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({ id, ...m });
  });
});

// Update mentor
app.put('/api/mentors/:id', (req, res) => {
  const m = req.body;
  const sql = `UPDATE mentors SET name = ?, role = ?, company = ?, imageUrl = ?, bio = ?, topics = ?, isVisible = ?, featured = ?, price = ?, experience = ?, reviews = ? WHERE id = ?`;
  const params = [m.name, m.role, m.company, m.imageUrl, m.bio, JSON.stringify(m.topics), m.isVisible ? 1 : 0, m.featured ? 1 : 0, m.price, m.experience, m.reviews, req.params.id];

  db.run(sql, params, function(err) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({ message: "Updated", changes: this.changes });
  });
});

// Delete mentor
app.delete('/api/mentors/:id', (req, res) => {
  db.run("DELETE FROM mentors WHERE id = ?", req.params.id, function(err) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({ message: "Deleted", changes: this.changes });
  });
});

// Toggle visibility
app.patch('/api/mentors/:id/toggle', (req, res) => {
  // First get current status
  db.get("SELECT isVisible FROM mentors WHERE id = ?", req.params.id, (err, row) => {
    if (err || !row) {
      res.status(400).json({ "error": "Mentor not found" });
      return;
    }
    const newValue = row.isVisible ? 0 : 1;
    db.run("UPDATE mentors SET isVisible = ? WHERE id = ?", [newValue, req.params.id], function(err) {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }
      res.json({ message: "Toggled", isVisible: Boolean(newValue) });
    });
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

