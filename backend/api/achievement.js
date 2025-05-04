const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

// express api routing code adapted from: https://expressjs.com/en/guide/routing.html

// Proxy: Update progress for a student's achievements
router.post('/update-progress', async (req, res) => {
    console.log('Entered update-progress proxy with: ', req.query);
    console.log('req.headers:', req.headers);
    try {
        const response = await axios.post(
            `${process.env.API_BASE_URL}/achievement/update-progress`,
            req.body,
            {
                headers: { Authorization: req.headers.authorization },
                params: req.query
            }
        );
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error updating achievements:', error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error updating achievements' });
    }
});


router.get('/fetch-achievements', async (req, res) => {
    try {
        const response = await axios.get(`${process.env.API_BASE_URL}/achievement/fetch-achievements`, {
            params: req.query,
            headers: { Authorization: req.headers.authorization },
        });

        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error fetching achievements from API:', error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error fetching achievements' });
    }
});


module.exports = router;
