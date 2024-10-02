// routes/admin.js
const express = require('express');
const router = express.Router();

// Mock admin data
const mockAdminData = {
    totalUsers: 150,
    activeUsers: 120,
    systemStatus: 'All systems operational',
};

// Get admin data
router.get('/', (req, res) => {
    // In a real app, fetch this data from the database
    res.json(mockAdminData);
});

module.exports = router;
