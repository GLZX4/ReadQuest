require('dotenv').config();
const express = require('express');
const axios = require('axios');

const router = express.Router();

// Fetch Admin Data
router.get('/fetchAdminData', async (req, res) => {
  console.log('Entered fetchAdminData proxy');
  try {
    const response = await axios.get(`${process.env.API_BASE_URL}/admin/fetchAdminData`, {
      headers: { Authorization: req.headers.authorization },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error in /fetchAdminData:', error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error fetching admin data' });
  }
});

// Tutor Account Code Generation
router.post('/tutorAccountCode', async (req, res) => {
  console.log('Entered tutorAccountCode proxy');
  try {
    const response = await axios.post(`${process.env.API_BASE_URL}/admin/tutorAccountCode`, req.body, {
      headers: { Authorization: req.headers.authorization },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error in /tutorAccountCode:', error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error generating tutor account code' });
  }
});

// Fetch Schools
router.get('/schoolsFetch', async (req, res) => {
  console.log('Entered schoolsFetch proxy');
  try {
    const response = await axios.get(`${process.env.API_BASE_URL}/admin/schoolsFetch`, {
      headers: { Authorization: req.headers.authorization },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error in /schoolsFetch:', error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error fetching schools' });
  }
});

// Add School
router.post('/addSchool', async (req, res) => {
  console.log('Entered addSchool proxy');
  try {
    const response = await axios.post(`${process.env.API_BASE_URL}/admin/addSchool`, req.body, {
      headers: { Authorization: req.headers.authorization },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error in /addSchool:', error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error adding school' });
  }
});

// Test Endpoint
router.post('/test', async (req, res) => {
  res.status(200).json({ message: 'Test successful' });
});

module.exports = router;
