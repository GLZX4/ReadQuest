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

module.exports = router;