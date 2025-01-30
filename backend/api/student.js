const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

// Proxy: Get all student rounds completed
router.get('/completed-rounds', async (req, res) => {
    const { userID } = req.query;

    if (!userID) {
        console.log('userID is required for completed rounds');
        return res.status(400).json({ message: 'userID is required' });
    }

    try {
        const response = await axios.get(
            `${process.env.API_BASE_URL}/api/student/completed-rounds`,
            { params: { userID } }
        );

        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error fetching completed rounds from API:', error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error fetching completed rounds' });
    }
});

// Proxy: Fetch achievements for a specific student
router.get('/fetch-achievements', async (req, res) => {
    const { studentId, token } = req.query;
    console.log('entered fetch achievements');

    if (!studentId) {
        return res.status(400).json({ message: 'Student ID is required' });
    }

    console.log('Fetching achievements for student ID:', studentId);
    console.log('Token:', token);

    try {
        const response = await axios.get(
            `${process.env.API_BASE_URL}/student/fetch-achievements`,
            {
                params: { studentId },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error fetching achievements from API:', error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error fetching achievements' });
    }
});

module.exports = router;
