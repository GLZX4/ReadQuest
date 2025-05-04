const express = require('express');
const axios = require('axios');

const router = express.Router();

// Process metrics
router.post('/process-metrics', async (req, res) => {
    try {
        const response = await axios.post(`${process.env.API_BASE_URL}/metric/process-metrics`,
            req.body, {
            headers: { Authorization: req.headers.authorization },
        });

        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error in local proxy /process-metrics:', error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error processing metrics' });
    }
});

module.exports = router;
