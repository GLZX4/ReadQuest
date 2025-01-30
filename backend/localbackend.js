const express = require('express');
require('dotenv').config();
const authRoutes = require('./api/auth');
const studentRoutes = require('./api/student');
const tutorRoutes = require('./api/tutor');
const adminRoutes = require('./api/admin');
const performanceRoutes = require('./api/performance');
const roundRoutes = require('./api/round');
const achievementRoutes = require('./api/achievement.js');

const app = express();
const PORT = 5000;

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use('/api/student', studentRoutes);
app.use('/api/tutor', tutorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/round', roundRoutes);
app.use('/api/achievement', achievementRoutes);

// Middleware to parse JSON requests
app.use(express.json());

// Start the server
app.listen(PORT, () => {
  console.log(`Local backend running on port ${PORT}`);
});