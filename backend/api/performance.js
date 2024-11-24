// backend/api/performance.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

const { calculateDifficultyLevel } = require('../services/MetricsService');

module.exports = (pool) => {
    // Get performance metrics for round Selection
    router.get('/students/get-difficulty', async (req, res) => {
        const { userID } = req.query;

        try {
            const result = await pool.query`SELECT * FROM PerformanceMetrics WHERE userID = ${userID}`;
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
            const result = await pool.query` SELECT * FROM PerformanceMetrics WHERE userID = ${userID}`;
            res.json(result.recordset[0]);
        } catch (error) {
            console.error('Error getting performance metrics:', error);
        }
    });
    

    router.post('/students/update-metrics', async (req, res) => {
        console.log("entered update metrics");
        console.log("updateMetrics req body: " + req.body);
        const { accuracyRate, averageAnswerTime, attemptsPerQuestion, consistency, completionRate, userID } = req.body;
        console.log("extracted values: " + accuracyRate + " " + averageAnswerTime + " " + attemptsPerQuestion + " " + consistency + " " + completionRate + " " + userID);

        if (
            accuracyRate < 0 || accuracyRate > 100 ||
            averageAnswerTime < 0 ||
            attemptsPerQuestion < 0 ||
            completionRate < 0 || completionRate > 100
        ) {
            return res.status(400).json({ message: 'Invalid performance metrics' });
        }
        
        try {
            // Calculate the new difficulty level
            const difficultyLevel = calculateDifficultyLevel({
                accuracyRate,
                averageAnswerTime,
                attemptsPerQuestion,
                consistency,
                completionRate,
            });

            // Update performance metrics in the database
            await pool.query`
            IF NOT EXISTS (
                SELECT 1 FROM PerformanceMetrics WHERE userID = ${userID}
            )
            BEGIN
                INSERT INTO PerformanceMetrics (
                    userID, totalRoundsPlayed, averageAnswerTime, accuracyRate, 
                    attemptsPerQuestion, difficultyLevel, consistencyScore, 
                    completionRate, lastUpdated
                )
                VALUES (
                    ${userID}, 1, ${averageAnswerTime}, ${accuracyRate}, 
                    ${attemptsPerQuestion}, ${difficultyLevel}, ${consistency}, 
                    ${completionRate}, GETDATE()
                )
            END
            ELSE
            BEGIN
                UPDATE PerformanceMetrics
                SET accuracyRate = ${accuracyRate},
                    averageAnswerTime = ${averageAnswerTime},
                    attemptsPerQuestion = ${attemptsPerQuestion},
                    consistencyScore = ${consistency},
                    completionRate = ${completionRate},
                    difficultyLevel = ${difficultyLevel},
                    totalRoundsPlayed = totalRoundsPlayed + 1,
                    lastUpdated = GETDATE()
                WHERE userID = ${userID}
            END
        `;
        

            res.status(200).json({ message: 'Metrics updated successfully' });
        } catch (error) {
            console.error('Error updating performance metrics:', error);
            res.status(500).json({ message: 'Error updating performance metrics' });
        }
    });
    return router;
}