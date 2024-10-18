// routes/admin.js
const express = require('express');
const router = express.Router();
const sql = require('mssql');
const cors = require('cors');
const { connectToDatabase } = require('../middleware/dbConfig');
require('dotenv').config();

// Mock admin data
const mockAdminData = {
    totalUsers: 150,
    activeUsers: 120,
    systemStatus: 'All systems operational',
};

// Get admin data
router.get('/', (req, res) => {
    // In a real app, fetch this data from the database
    res.json(mockAdminData);
});

// tutor account code generation submission
router.post('/tutorAccountCode', async (req, res) => {
    console.log('entered tutorAccountCode');
    const { verificationCode, schoolID, expirationAt, used, createdAt } = req.body;

    console.log("Code to submit: " + req.body);
   
    if (!verificationCode || !schoolID || !createdAt) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try{
        await sql.query`
        INSERT INTO VerificationCode (code, schoolID, expirationAt, used, createdAt) 
        VALUES (${verificationCode}, ${schoolID}, ${expirationAt}, ${used}, ${createdAt})
    `;
        res.status(201).json({ message: 'Verification Code Submitted successfully.' });
    } catch(error) {
        console.error('Error during code generation:', error);
    }
});

// Fetch schools endpoint
router.get('/schoolsFetch', async (req, res) => {
    console.log('Fetching schools...');
  
    try {
      const result = await sql.query`SELECT * FROM Schools`;
      res.status(200).json(result.recordset);
    } catch (error) {
      console.error('Error fetching schools:', error);
      return res.status(500).json({ message: 'Error fetching schools' });
    }
  });


// Add a School endpoint
router.post('/addSchool', async (req, res) => {
    console.log('entered addSchool');
    const { schoolName, schoolCode, address, contactEmail, contactPhone } = req.body;

    if (!schoolName || !schoolCode || !address || !contactEmail || !contact) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try{
        await sql.query`
        INSERT INTO schools (schoolName, schoolCode, address, contactEmail, contactPhone)
        VALUES (${schoolName}, ${schoolCode}, ${address}, ${contactEmail}, ${contactPhone})
    `;
        res.status(201).json({ message: 'School Added successfully.' });
    } catch(error) {
        console.error('Error during school addition:', error);
    }
});

module.exports = router;
