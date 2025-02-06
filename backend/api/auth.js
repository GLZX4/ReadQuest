require('dotenv').config();
const express = require('express');
const axios = require('axios');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    console.log('req.body:', req.body);
    const response = await axios.post(`${process.env.API_BASE_URL}/auth/login`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error in /auth/login proxy:', error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error logging in user' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const response = await axios.post(`${process.env.API_BASE_URL}/auth/register`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error in /auth/register proxy:', error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error registering user' });
  }
});

router.post('/logout', async (req, res) => {
  const { email, token } = req.body;
  try {
    const response = await axios.post(`${process.env.API_BASE_URL}/auth/logout`, { email, token });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error in /auth/logout proxy:', error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error logging out user' });
  }
});

router.post('/register-tutor', async (req, res) => {
  try {
    const response = await axios.post(`${process.env.API_BASE_URL}/auth/register-tutor`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error in /auth/register proxy:', error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error registering user' });
  }
});

router.post('/register-admin', async (req, res) => {
  try {
    const response = await axios.post(`${process.env.API_BASE_URL}/auth/register-admin`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error in /auth/register proxy:', error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error registering user' });
  }
});

router.post('/test', async (req, res) => {
  res.status(200).json({ message: 'Test successful' });
});

module.exports = router;
