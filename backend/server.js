// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const bodyparser = require('body-parser');
const { connectToDatabase, sql } = require('./middleware/dbConfig');
const authRoutes = require('./api/auth');       // Update to correct path
const studentRoutes = require('./api/student'); // Update to correct path
const tutorRoutes = require('./api/tutor');     // Update to correct path
const adminRoutes = require('./api/admin');     // Update to correct path
const performanceRoutes = require('./api/performance'); // Update to correct path
const roundRoutes = require('./api/round');     // Update to correct path
const metricRoutes = require('./api/metric');

// Middleware
app.use(cors());
app.use(bodyparser.json());
app.use(express.json());

// Routes
app.use('/api/student', studentRoutes)
app.use('/api/tutor', tutorRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/performance', performanceRoutes)
app.use('/api/round', roundRoutes)
app.use('/api/metric', metricRoutes)

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
