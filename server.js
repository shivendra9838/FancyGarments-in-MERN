// server.js
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import userRouter from './database/routes/userRoute.js';
import cartRouter from './database/routes/cartRoute.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());

// Mount API routers
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);

// Example users array for login (replace with real DB in production)
const users = [
  { email: 'user@example.com', password: 'password' }
];

// Login route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
});

// Serve uploads folder for profile/product images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend (React build)
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
