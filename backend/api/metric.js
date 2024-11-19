// backend/api/metric.js
const express = require('express');
const { calculateMetrics, calculateDifficultyLevel } = require('../services/MetricsService');

const router = express.Router();

router.post('/calculateMetrics', (req, res) => {
    try {
        const metrics = calculateMetrics(req.body); // Pass round stats for metrics
        const difficulty = calculateDifficultyLevel(metrics); // Calculate difficulty
        res.json({ metrics, difficulty });
    } catch (error) {
        console.error('Error calculating metrics:', error);
        res.status(500).json({ message: 'Error calculating metrics' });
    }
});

module.exports = router;
