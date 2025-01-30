const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

// Proxy: Select a round by difficulty
router.get('/select-by-difficulty', async (req, res) => {
    const { difficulty, token } = req.query; // Extract difficulty and token from the query params

    if (!difficulty) {
        console.error('Difficulty is required');
        return res.status(400).json({ message: 'Difficulty is required' });
    }

    if (!token) {
        console.error('Token is required');
        return res.status(400).json({ message: 'Token is required' });
    }

    try {
        console.log('Proxying request to hosted backend /api/round/select-by-difficulty');
        console.log('Difficulty:', difficulty);
        console.log('Token:', token);

        const response = await axios.get(
            `${process.env.API_BASE_URL}/round/select-by-difficulty`,
            {
                params: { difficulty },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error fetching round by difficulty from API:', error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error fetching round' });
    }
});


// Proxy: Retrieve question bank by QBankID
router.get('/retrieve-qBank', async (req, res) => {
    const { QBankID } = req.query;

    if (!QBankID) {
        console.error('QBankID is required');
        return res.status(400).json({ message: 'QBankID is required' });
    }

    try {
        const response = await axios.get(
            `${process.env.API_BASE_URL}/api/round/retrieve-qBank`,
            { params: { QBankID } }
        );

        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error fetching question bank from API:', error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error fetching question bank' });
    }
});

// Proxy: Get a specific question by QBankID and questionIndex
router.get('/get-question', async (req, res) => {
    const { qBankID, questionIndex, token } = req.query;

    console.log('Proxying request to /round/get-question with: ');
    console.log('Received qBankID:', qBankID);
    console.log('Received questionIndex:', questionIndex);
    console.log('Received token:', token);

    if (!qBankID || questionIndex === undefined) {
        console.error('qBankID and questionIndex are required');
        return res.status(400).json({ message: 'qBankID and questionIndex are required' });
    }

    try {
        const response = await axios.get(
            `${process.env.API_BASE_URL}/round/get-question`,
            { 
                params: { qBankID, questionIndex }, 
                headers: { 
                    Authorization: `Bearer ${token}` 
                },
            }
        );

        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error fetching question from API:', error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error fetching question' });
    }
});


// Proxy: Validate an answer
router.post('/validate-answer', async (req, res) => {
    const { questionID, selectedAnswer, token } = req.body;

    console.log('Proxying request to /round/validate-answer with: ');
    console.log('Received questionID:', questionID);
    console.log('Received selectedAnswer:', selectedAnswer);
    console.log('Received token:', token);

    if (!questionID || !selectedAnswer) {
        console.error('questionID and selectedAnswer are required');
        return res.status(400).json({ message: 'questionID and selectedAnswer are required' });
    }

    try {
        const response = await axios.post(
            `${process.env.API_BASE_URL}/round/validate-answer`,
            { questionID, selectedAnswer },
            {
                headers: { 
                    Authorization: `Bearer ${token}` 
                },
            }
        );

        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error validating answer from API:', error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error validating answer' });
    }
});


module.exports = router;
