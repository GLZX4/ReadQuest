const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

// Proxy: Get all student rounds completed
router.get('/completed-rounds', async (req, res) => {
    try {
        const response = await axios.get(`${process.env.API_BASE_URL}/student/completed-rounds`, {
                params: req.query,
                headers: { Authorization: req.headers.authorization },
            });
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error fetching completed rounds from API:', error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error fetching completed rounds' });
    }
});

router.get('/get-streak', async (req, res) => {
    console.log('Entered get-streak proxy with: ', req.query);
    console.log('req.headers:', req.headers);
    try {
        const response = await axios.get(`${process.env.API_BASE_URL}/student/get-streak`, {
                params: req.query,
                headers: { Authorization: req.headers.authorization },
            });
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error fetching completed rounds from API:', error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error fetching completed rounds' });
    }
});

router.post('/update-streak', async (req, res) => {
    console.log('Entered update Streak for: ', req.body);

    try {
        const response = await axios.post(`${process.env.API_BASE_URL}/student/update-streak`,
            req.body, {
            headers: { Authorization: req.headers.authorization },
        });

        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error in local proxy /process-metrics:', error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error processing metrics' });
    }
});

router.get('/get-level', async (req, res) => {
    console.log('Entered get-level proxy with: ', req.query);
    console.log('req.headers:', req.headers);
    try {
        const response = await axios.get(`${process.env.API_BASE_URL}/student/get-level`, {
                params: req.query,
                headers: { Authorization: req.headers.authorization },
            });
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error fetching level from API:', error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error fetching completed rounds' });
    }
});

module.exports = router;
