// backend/api/performance.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sql = require('mssql');
const { connectToDatabase } = require('../middleware/dbConfig');
const { code } = require('framer-motion/client');
const { route } = require('./auth');
require('dotenv').config();

const router = express.Router();
connectToDatabase();

const { calculateDifficultyLevel } = require('../services/DifficultyService');

// Get performance metrics for round Selection
router.get('/students/get-difficulty', async (req, res) => {
    const { userID } = req.query;

    try {
        const result = await sql.query`SELECT * FROM PerformanceMetrics WHERE userID = ${userID}`;
        const metrics = result.recordset[0];

        if (!metrics) {
            return res.status(404).json({ message: 'Metrics not found for the specified user' });
        }

        const difficulty = calculateDifficultyLevel(metrics);

        // Ensure `difficulty` is sent as a string in the response
        res.json({ difficulty: String(difficulty) });
    } catch (error) {
        console.error('Error getting difficulty level:', error);
        res.status(500).json({ message: 'Error getting difficulty level' });
    }
});


// Get current performance metrics for a specific student
router.get('/tutor/current-specific-metric', async (req, res) => {
    const { userID } = req.params;
    try {
        const result = await sql.query` SELECT * FROM PerformanceMetrics WHERE userID = ${userID}`;
        res.json(result.recordset[0]);
    } catch (error) {
        console.error('Error getting performance metrics:', error);
    }
});

module.exports = router;