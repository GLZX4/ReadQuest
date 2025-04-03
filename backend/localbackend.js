const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');

const authRoutes = require('./api/auth');
const studentRoutes = require('./api/student');
const tutorRoutes = require('./api/tutor');
const adminRoutes = require('./api/admin');
const performanceRoutes = require('./api/performance');
const roundRoutes = require('./api/round');
const achievementRoutes = require('./api/achievement.js');
const metricRoutes = require('./api/metric.js');

const app = express();
const PORT = 5000;

const envPath = process.env.NODE_ENV === "production"
  ? path.join(__dirname, ".env")  // In packaged Electron app
  : path.join(__dirname, "../backend/.env"); // In development mode

dotenv.config({ path: envPath });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization'
}));

// Routes
app.use('/api/student', studentRoutes);
app.use('/api/tutor', tutorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/round', roundRoutes);
app.use('/api/achievement', achievementRoutes);
app.use('/api/metric', metricRoutes);

// Catch-all for unmatched routes
app.use((req, res, next) => {
  console.log(`Unmatched request: ${req.method} ${req.url}`);
  res.status(404).json({ message: "Route not found" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Local backend running on port ${PORT}`);
});
