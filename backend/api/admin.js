require('dotenv').config();
const express = require('express');
const axios = require('axios');

const router = express.Router();

// Fetch Admin Data
router.get('/fetchAdminData', async (req, res) => {
  console.log('Entered fetchAdminData proxy with req.body:', req.body);
  console.log('headers: ', req.headers);

  try {
    const response = await axios.post(`${process.env.API_BASE_URL}/admin/fetchAdminData`, req.headers);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error in /fetchAdminData proxy:', error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error fetching admin data' });
  }
});

// Tutor Account Code Generation
router.post('/tutorAccountCode', async (req, res) => {
  console.log('Entered tutorAccountCode proxy with req.body:', req.body);
  console.log('headers: ', req.headers);

  try {
    const response = await axios.post(`${process.env.API_BASE_URL}/admin/tutorAccountCode`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error in /tutorAccountCode proxy:', error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error generating tutor account code' });
  }
});

// Fetch Schools
router.get('/schoolsFetch', async (req, res) => {
  console.log('Entered schoolsFetch proxy with req.body:', req.body);
  console.log('headers: ', req.headers);
  console.log('url to submit to: ', `${process.env.API_BASE_URL}/admin/schoolsFetch`);
  try {
    const response = await axios.post(`${process.env.API_BASE_URL}/admin/schoolsFetch`, req.headers);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error in /schoolsFetch proxy:', error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error fetching schools' });
  }
});

// Add School
router.post('/addSchool', async (req, res) => {
  console.log('Entered addSchool proxy with req.body:', req.body);
  console.log('headers: ', req.headers);

  try {
    const response = await axios.post(`${process.env.API_BASE_URL}/admin/addSchool`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error in /addSchool proxy:', error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error adding school' });
  }
});

router.post('/test', async (req, res) => {
  res.status(200).json({ message: 'Test successful' });
});

module.exports = router;
