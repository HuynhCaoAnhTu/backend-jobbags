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

// Khởi tạo bảng và dữ liệu mẫu
function initDb() {
  db.serialize(() => {
    // Tạo bảng trước, đợi callback để đảm bảo bảng đã được tạo xong
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
        return;
      }
      
      // Chỉ kiểm tra và seed data sau khi bảng đã được tạo xong
      db.get("SELECT count(*) as count FROM mentors", (err, row) => {
        if (err) {
          console.error('Error checking mentors count:', err.message);
          return;
        }
        
        // Chỉ seed data nếu database hoàn toàn trống (chưa có dữ liệu)
        if (row && row.count === 0) {
          console.log("Database is empty. Seeding initial data...");
          const initialMentors = [
          {
            id: '1',
            name: 'Nguyễn Văn An',
            role: 'Senior Product Manager',
            company: 'Momo',
            imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            bio: '7 năm kinh nghiệm làm Product tại các công ty Fintech hàng đầu. Chuyên gia về Product Strategy và Growth.',
            topics: JSON.stringify(['Product Management', 'Strategy', 'Fintech', 'Startup']),
            isVisible: 1,
            featured: 1,
            price: '500.000đ',
            experience: '7 năm',
            reviews: 124
          },
          {
            id: '2',
            name: 'Trần Thị Bích',
            role: 'Head of Marketing',
            company: 'VinGroup',
            imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            bio: 'Dẫn dắt đội ngũ Marketing 50+ người. Có kinh nghiệm sâu sắc về Branding và Digital Marketing cho các tập đoàn lớn.',
            topics: JSON.stringify(['Marketing', 'Branding', 'Leadership']),
            isVisible: 1,
            featured: 0,
            price: 'Miễn phí',
            experience: '10 năm',
            reviews: 89
          },
          {
            id: '3',
            name: 'Lê Hoàng Nam',
            role: 'Senior Software Engineer',
            company: 'Grab',
            imageUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            bio: 'Chuyên về Backend và System Design. Từng làm việc tại Singapore. Sẵn sàng chia sẻ về quy trình phỏng vấn Big Tech.',
            topics: JSON.stringify(['Software Engineering', 'System Design', 'Backend', 'Career Growth']),
            isVisible: 1,
            featured: 1,
            price: '200.000đ',
            experience: '5 năm',
            reviews: 45
          },
          {
            id: '4',
            name: 'Phạm Minh Tú',
            role: 'UX/UI Design Lead',
            company: 'Zalo',
            imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            bio: 'Đam mê tạo ra trải nghiệm người dùng tuyệt vời. Mentor về tư duy thiết kế và xây dựng Portfolio.',
            topics: JSON.stringify(['UX/UI Design', 'Figma', 'Portfolio Review']),
            isVisible: 1,
            featured: 0,
            price: '300.000đ',
            experience: '6 năm',
            reviews: 67
          },
          {
            id: '5',
            name: 'Đặng Thảo Chi',
            role: 'Data Scientist',
            company: 'Shopee',
            imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            bio: 'Kinh nghiệm xây dựng các mô hình Recommendation System. Thạc sĩ Khoa học Dữ liệu tại Pháp.',
            topics: JSON.stringify(['Data Science', 'Machine Learning', 'Python', 'AI']),
            isVisible: 1,
            featured: 0,
            price: '400.000đ',
            experience: '4 năm',
            reviews: 32
          },
          {
            id: '6',
            name: 'Vũ Quốc Hưng',
            role: 'Investment Manager',
            company: 'Mekong Capital',
            imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            bio: 'Hỗ trợ các startup gọi vốn và xây dựng mô hình tài chính. Tư vấn đầu tư cá nhân.',
            topics: JSON.stringify(['Investment', 'Finance', 'Startup Fundraising']),
            isVisible: 1,
            featured: 1,
            price: '1.000.000đ',
            experience: '12 năm',
            reviews: 156
          }
        ];

          const stmt = db.prepare(`INSERT INTO mentors (id, name, role, company, imageUrl, bio, topics, isVisible, featured, price, experience, reviews) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
          initialMentors.forEach(m => {
            stmt.run(m.id, m.name, m.role, m.company, m.imageUrl, m.bio, m.topics, m.isVisible, m.featured, m.price, m.experience, m.reviews);
          });
          stmt.finalize((err) => {
            if (err) {
              console.error('Error finalizing statement:', err.message);
            } else {
              console.log(`Successfully seeded ${initialMentors.length} mentors.`);
            }
          });
        } else {
          console.log(`Database already has ${row.count} mentor(s). Skipping seed.`);
        }
      });
    });
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

