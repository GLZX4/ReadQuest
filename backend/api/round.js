// backend/api/round.js
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


router.get('/select-by-difficulty', async (req, res) => {
    const difficulty = req.query.difficulty;  // Get difficulty as a simple value
    console.log('Difficulty in select-by-difficulty:', difficulty, typeof difficulty);

    if (typeof difficulty !== 'string') {
        return res.status(400).json({ message: 'Invalid difficulty parameter type' });
    }

    try {
        const rounds = await sql.query`SELECT * FROM Rounds WHERE DifficultyLevel = ${difficulty}`;

        if (rounds.recordset.length === 0) {
            return res.status(404).json({ message: 'No rounds found for this difficulty level' });
        }

        const shuffledRounds = rounds.recordset.sort(() => Math.random() - 0.5);

        // Sending only the first item in the shuffled array
        res.json(shuffledRounds[0]);
    } catch (error) {
        console.error('Error fetching round:', error);
        res.status(500).json({ message: 'Error fetching round' });
    }
});

// Retrieve question bank by qBankID
router.get('/retrieve-qBank', async (req, res) => {
    const QBankID = req.query.QBankID;
    console.log('qBank in retrieve-qBank:', QBankID, typeof QBankID);

    try {
        // Fetch all questions that match the specified QBankID
        const questionBank = await sql.query`SELECT * FROM QuestionBank WHERE QBankID = ${QBankID}`;

        if (questionBank.recordset.length === 0) {
            return res.status(404).json({ message: 'No question bank found for this round' });
        }

        res.json(questionBank.recordset); // Return all questions in the response
    } catch (error) {
        console.error('Error fetching question bank:', error);
        res.status(500).json({ message: 'Error fetching question bank' });
    }
});



module.exports = router;