// routes/admin.js
const express = require('express');
const router = express.Router();
const sql = require('mssql');
const cors = require('cors');
const { connectToDatabase } = require('../middleware/dbConfig');
require('dotenv').config();

// Mock admin data
const AdminData = {
    totalUsers: 0,
    activeUsers: 0,
    systemStatus: '',
};

// Get admin data
router.get('/fetchAdminData', async (req, res) => {
    try {
        // Fetch active users count
        const activeUsersResult = await sql.query`SELECT COUNT(*) as activeUsersCount FROM Users WHERE loggedIn = 1`;
        AdminData.activeUsers = activeUsersResult.recordset[0].activeUsersCount;

        // Fetch total users count
        const totalUsersResult = await sql.query`SELECT COUNT(*) as totalUsersCount FROM Users`;
        AdminData.totalUsers = totalUsersResult.recordset[0].totalUsersCount;

        // Check system status
        const databaseConnected = await sql.connect();
        AdminData.systemStatus = databaseConnected ? 'All systems operational' : 'Database connection error';

        console.log('AdminData:', AdminData); // Debugging log
    } catch (error) {
        console.error('Error fetching admin data:', error);
        return res.status(500).json({ message: 'Error fetching data' });
    }
    res.json(AdminData);
});


// tutor account code generation submission
router.post('/tutorAccountCode', async (req, res) => {
    console.log('entered tutorAccountCode');
    const { verificationCode, schoolID, expirationAt, used, createdAt } = req.body;

    try {
        const lastGen = await sql.query`SELECT lastGeneratedAt FROM VerificationCode WHERE schoolID = ${schoolID}`;
        const lastGenDate = lastGen.recordset[0].lastGeneratedAt;
        const currentDate = new Date();
        const diff = Math.abs(currentDate - lastGenDate);

        if (lastGenDate) {
            const timeDifference = currentTime - new Date(lastGeneratedAt);
            const minutesSinceLast = timeDifference / (1000 * 60);

            if (minutesSinceLast < 30) { // 30 minutes
                return res.status(429).json({ message: 'You can only generate a new code every 30 minutes.' });
            }
        }
    } catch (error) {
        console.error('You cannot generate a new code this quickly: ', error);
        return res.status(500).json({ message: 'Error generating code' });
    }

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

    if (!schoolName || !schoolCode || !address || !contactEmail || !contactPhone) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        await sql.query`
            INSERT INTO Schools (schoolName, schoolCode, address, contactEmail, contactPhone)
            VALUES (${schoolName}, ${schoolCode}, ${address}, ${contactEmail}, ${contactPhone})
        `;
        res.status(201).json({ message: 'School Added successfully.' });
    } catch (error) {
        console.error('Error during school addition:', error);
        res.status(500).json({ message: 'Error adding school' });
    }
});


module.exports = router;
