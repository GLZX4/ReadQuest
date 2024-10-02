// routes/student.js
const express = require('express');
const router = express.Router();

// Mock student data
const mockStudentData = {
    progress: 75,
    tasks: [
        { id: 1, task: 'Complete Reading Task 1', status: 'completed' },
        { id: 2, task: 'Complete Reading Task 2', status: 'pending' },
    ],
};

// Get student data
router.get('/', (req, res) => {
    res.json({ message: 'Student dashboard data' });
});


module.exports = router;
