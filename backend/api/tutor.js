const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/fetchTutorData', async (req, res) => {
  try {
    const response = await axios.get(`${process.env.API_BASE_URL}/fetchTutorData`);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error in /tutor proxy:', error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error fetching tutor data' });
  }
});


router.get('/studentsList', async (req, res) => {
  try {
    console.log('req.body:', req.body);
    console.log('req.headers:', req.headers);

    // Forward the data to the hosted backend
    const response = await axios.post(`${process.env.API_BASE_URL}/tutor/studentsList`, req.body, {
      headers: { Authorization: req.headers.authorization }, // Forward token in headers
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error in /tutor/studentsList proxy:', error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error fetching students list' });
  }
});


module.exports = router;

