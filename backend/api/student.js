const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

// Proxy: Get all student rounds completed
router.get('/completed-rounds', async (req, res) => {
    console.log('Entered completed-rounds proxy');
    console.log('req.query:', req.query);
    console.log('req.headers:', req.headers);
    try {
        const response = await axios.get(`${process.env.API_BASE_URL}/student/completed-rounds`, {
                params: req.query,
                headers: { Authorization: req.query.Authorization },
            });
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error fetching completed rounds from API:', error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error fetching completed rounds' });
    }
});

// Proxy: Fetch achievements for a specific student
router.get('/fetch-achievements', async (req, res) => {
    try {
        const response = await axios.get(`${process.env.API_BASE_URL}/student/fetch-achievements`, {
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
