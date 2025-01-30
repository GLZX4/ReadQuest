const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

// Proxy: Get performance metrics for round selection
router.get('/students/get-difficulty', async (req, res) => {
    console.log('Proxying request to /performance/students/get-difficulty');
    const { userID } = req.query;
    const token = req.query.token; 
    
    console.log('User ID:', userID);
    console.log('Token:', token);

    try {
        const response = await axios.get(
            `${process.env.API_BASE_URL}/performance/students/get-difficulty`,
            {
                params: { userID }, // Send userID as a query parameter
                headers: {
                    Authorization: `Bearer ${token}`, // Pass the token in headers
                },
            }
        );
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error proxying /performance/students/get-difficulty:', error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error getting difficulty level' });
    }
});

// Proxy: Get current performance metrics for a specific student
router.get('/tutor/current-specific-metric/:userID', async (req, res) => {
    const { userID } = req.params;
    const token = req.query.token; // Extract token from the query
    console.log('Proxying request to /performance/tutor/current-specific-metric with userID:', userID);

    try {
        const response = await axios.get(
            `${process.env.API_BASE_URL}/performance/tutor/current-specific-metric/${userID}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Pass the token in headers
                },
            }
        );
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error proxying /performance/tutor/current-specific-metric:', error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error getting performance metrics' });
    }
});

// Proxy: Update student performance metrics
router.post('/students/update-metrics', async (req, res) => {
    const token = req.query.token; // Extract token from the query
    console.log('Proxying request to /performance/students/update-metrics with body:', req.body);

    try {
        const response = await axios.post(
            `${process.env.API_BASE_URL}/performance/students/update-metrics`,
            req.body,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Pass the token in headers
                },
            }
        );
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error proxying /performance/students/update-metrics:', error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error updating performance metrics' });
    }
});

module.exports = router;
