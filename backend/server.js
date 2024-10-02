const express = require('express');
const cors = require('cors');
const app = express();
const studentRoutes = require('./api/student'); // Update to correct path
const tutorRoutes = require('./api/tutor');     // Update to correct path
const adminRoutes = require('./api/admin');     // Update to correct path

// Middleware
app.use(cors());
app.use(express.json());

// Define routes
app.use('/api/student', studentRoutes);
app.use('/api/tutor', tutorRoutes);
app.use('/api/admin', adminRoutes);

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
