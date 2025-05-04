const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

// Select a round by difficulty
router.get('/select-by-difficulty', async (req, res) => {
    console.log('Params in select-by-difficulty:', req.query);
    try {
        const response = await axios.get(`${process.env.API_BASE_URL}/round/select-by-difficulty`,{
                params: req.query,
                headers: { Authorization: req.headers.authorization },
            });

        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error fetching round by difficulty from API:', error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error fetching round' });
    }
});


// Retrieve question bank by QBankID
router.get('/retrieve-qBank', async (req, res) => {
    const { QBankID } = req.query;

    if (!QBankID) {
        console.error('QBankID is required');
        return res.status(400).json({ message: 'QBankID is required' });
    }

    try {
        const response = await axios.get(`${process.env.API_BASE_URL}/api/round/retrieve-qBank`,
            { params: { QBankID } }
        );

        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error fetching question bank from API:', error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error fetching question bank' });
    }
});

// Get a specific question by QBankID and questionIndex
router.get('/get-question', async (req, res) => {
    const { qBankID, questionIndex, token } = req.query;

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
        console.log('Response from hosted backend for new question:', response.data);

        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error fetching question from API:', error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error fetching question' });
    }
});


// Validate an answer
router.post('/validate-answer', async (req, res) => {
    const { questionID, selectedAnswer, token } = req.body;

    console.log('Proxying request to /round/validate-answer with: ');
    console.log('Received questionID:', questionID);
    console.log('Received selectedAnswer:', selectedAnswer);

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

        console.log('Response from hosted backend for answer validation:', response.data);

        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error validating answer from API:', error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error validating answer' });
    }
});

router.get('/get-total-questions', async (req, res) => {
    console.log('Entered get-total-questions proxy with: ', req.query);
    console.log('req.headers:', req.headers);
    try {
        const response = await axios.get(`${process.env.API_BASE_URL}/round/get-total-questions`, {
                params: req.query,
                headers: { Authorization: req.headers.authorization },
            });
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error fetching completed rounds from API:', error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error fetching completed rounds' });
    }
});


module.exports = router;
