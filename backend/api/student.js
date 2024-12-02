// backend/api/student.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

module.exports = (pool) => {
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

    router.get('/completed-rounds', async (req, res) => {
        const {userID} = req.query;
        console.log('Received request for completed rounds for student ID:', userID);
        if (!userID) {
            console.log('userID is required for completed rounds');
            return res.status(400).json({ message: 'userID is required' });
        }

        try {
            const result = await pool.query(
                `SELECT RoundID, Status, DifficultyLevel, assignedAt, completedAt
                    FROM Rounds
                    WHERE userID = $1 AND Status = 'completed'
                    ORDER BY completedAt DESC`,
                [userID]
            )
            console.log('Completed rounds:', result.rows);
            res.status(200).json(result.rows);
        } catch(e) {
            console.error("Error fetching completed rounds:", e);
            res.status(500).json({ message: 'Error fetching completed rounds' });
        }

    });
    return router;
}

