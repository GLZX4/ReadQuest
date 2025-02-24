const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

// Proxy: Update progress for a student's achievements
router.post('/update-progress', async (req, res) => {
    
    console.log('Proxying request to /update-progress with body:', req.body);
    try {
        const response = await axios.post(`${process.env.API_BASE_URL}/achievement/update-progress`,
            req.body, {
            headers: { Authorization: req.headers.authorization },
        });

        console.log('Response from hosted backend:', response.data);
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error proxying /update-progress:', error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error updating progress' });
    }
});


// Proxy: Fetch achievements for a specific student
router.get('/fetch-achievements', async (req, res) => {
    try {
        const response = await axios.get(`${process.env.API_BASE_URL}/achievement/fetch-achievements`, {
                params: req.query,
                headers: { Authorization: req.query.Authorization },
            });

        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error fetching achievements from API:', error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error fetching achievements' });
    }
});

module.exports = router;
