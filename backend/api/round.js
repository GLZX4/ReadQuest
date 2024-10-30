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

// Select a round by difficulty and return roundID and qBankID
router.get('/select-by-difficulty', async (req, res) => {
    const { difficulty } = req.query;
    console.log('Difficulty in select-by-difficulty:', difficulty, typeof difficulty);

    if (typeof difficulty !== 'string') {
        return res.status(400).json({ message: 'Invalid difficulty parameter type' });
    }

    try {
        const rounds = await sql.query`SELECT roundID, QBankID FROM Rounds WHERE DifficultyLevel = ${difficulty}`;

        if (rounds.recordset.length === 0) {
            return res.status(404).json({ message: 'No rounds found for this difficulty level' });
        }

        const selectedRound = rounds.recordset[Math.floor(Math.random() * rounds.recordset.length)];
        res.json(selectedRound);
    } catch (error) {
        console.error('Error fetching round:', error);
        res.status(500).json({ message: 'Error fetching round' });
    }
});


// Retrieve question bank by qBankID - obsolete!
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


// Get a specific question by QBankID and questionIndex
router.get('/get-question', async (req, res) => {
    const { qBankID, questionIndex } = req.query;
    console.log("Entered get-question");
    console.log('qBankID in get-question:', qBankID, typeof qBankID);
    console.log('questionIndex in get-question:', questionIndex, typeof questionIndex);

    if (!qBankID || questionIndex === undefined) {
        return res.status(400).json({ message: 'qBankID and questionIndex are required' });
    }

    try {
        // Convert questionIndex to an integer to ensure it's passed correctly in the SQL query
        const questionIdx = parseInt(questionIndex, 10);
        const result = await sql.query`
            SELECT *
            FROM QuestionBank
            WHERE QBankID = ${qBankID}
            ORDER BY QuestionID
            OFFSET ${questionIdx} ROWS
            FETCH NEXT 1 ROWS ONLY;
        `;

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error('Error fetching question:', error);
        res.status(500).json({ message: 'Error fetching question' });
    }
});


// Route to validate an answer
router.post('/validate-answer', async (req, res) => {
    const { questionID, selectedAnswer } = req.body;

    try {
        const result = await sql.query`SELECT CorrectAnswer FROM QuestionBank WHERE QuestionID = ${questionID}`;
        const correctAnswer = result.recordset[0]?.CorrectAnswer;

        if (!correctAnswer) {
            return res.status(404).json({ message: 'Question not found' });
        }

        const isCorrect = selectedAnswer === correctAnswer;

        res.json({
            isCorrect,
            correctAnswer, // Optionally include this if you want the frontend to display it
        });
    } catch (error) {
        console.error('Error validating answer:', error);
        res.status(500).json({ message: 'Error validating answer' });
    }
});



module.exports = router;