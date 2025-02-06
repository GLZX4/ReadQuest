const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/fetch-Tutor-Data', async (req, res) => {
  console.log('Entered fetch-tutor-date proxy');
  try {
    const response = await axios.get(`${process.env.API_BASE_URL}/tutor/fetch-Tutor-Data`, {
      params: req.query, // Forward query parameters
      headers: { Authorization: req.headers.authorization }, // Forward token in headers
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error in /tutor/fetch-tutor-date proxy:', error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error fetching tutor data' });
  }
});


router.get('/studentsList', async (req, res) => {
  try {
    console.log('req.query:', req.query);
    console.log('req.headers:', req.headers);

    const response = await axios.get(`${process.env.API_BASE_URL}/tutor/studentsList`, {
      params: req.query, // Forward query parameters
      headers: { Authorization: req.headers.authorization }, // Forward token in headers
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error in /tutor/studentsList proxy:', error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error fetching students list' });
  }
});



module.exports = router;

