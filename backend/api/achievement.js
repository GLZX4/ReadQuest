const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

// Proxy: Update progress for a student's achievements
router.post('/update-progress', async (req, res) => {
    const { studentId, metric, value } = req.body;

    // Basic validation
    if (!studentId || !metric || value === undefined) {
        console.error('Invalid input: Student ID, metric, and value are required');
        return res.status(400).json({ message: 'Student ID, metric, and value are required' });
    }
    console.log('Proxying request to /update-progress with body:', req.body);
    try {
        const response = await axios.post(
            `${process.env.API_BASE_URL}/achievements/update-progress`,
            req.body,
            {
                headers: {
                    Authorization: req.headers.authorization, // Forward authorization token
                },
            }
        );
        console.log('Response from hosted backend:', response.data);
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error proxying /update-progress:', error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error updating progress' });
    }
});

module.exports = router;
