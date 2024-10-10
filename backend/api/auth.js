// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sql = require('mssql');
const { connectToDatabase } = require('../middleware/dbConfig');
require('dotenv').config();

const router = express.Router();
connectToDatabase();

// Secret key for JWT
const JWT_SECRET = 'your_jwt_secret_here';

// Register endpoint
router.post('/register', async (req, res) => {
    console.log('Received registration request:', req.body); // Debug log
    try {
        console.log('Received registration request:', req.body); // Debug log
        
        // Extract request body
        const { name, email, password, role, schoolCode } = req.body;

        // Validate request
        if (!name || !email || !password || !role || !schoolCode) {
            console.error('Missing required fields:', req.body); // Debug log
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Fetch school ID
        console.log('Fetching school with code:', schoolCode); // Debug log
        let schoolResult;
        
        try{
            schoolResult = await sql.query`SELECT schoolID FROM Schools WHERE schoolCode = ${schoolCode}`;
            if (schoolResult.length === 0) {
                console.error('Invalid school code:', schoolCode); // Debug log
                return res.status(400).json({ message: 'Invalid school code.' });
            }
        } catch (error) {
            console.error('Error fetching school:', error); // Full error details
            return res.status(500).json({ message: 'Internal server error', error: error.message });
        }


        console.log('School found:', schoolResult); // Debug log

        // Insert user into database
        const schoolID = schoolResult.recordset[0].schoolID;
        console.log(`Inserting new user: ${name}, ${email}, role: ${role}, schoolID: ${schoolID}`); // Debug log
        await sql.query`INSERT INTO Users (Name, Email, UserPassword, Role, schoolID) VALUES (${name}, ${email}, ${hashedPassword}, ${role}, ${schoolID})`;

        // Success response
        console.log('User registered successfully:', email); // Debug log
        res.status(201).json({ message: 'User registered successfully.' });

    } catch (error) {
        console.error('Error during registration:', error); // Full error details
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});


// Login Endpoint
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Received login request:', req.body); // Debug log
  
    try {
      console.log(`Looking for user with email: ${email}`); // Debug log
      const result = await sql.query`
        SELECT * FROM Users WHERE Email = ${email}
      `;
  
      if (result.recordset.length === 0) {
        console.error(`No user found with email: ${email}`); // Debug log
        return res.status(401).send({ message: 'Invalid email or password' });
      }
  
      const user = result.recordset[0];
      console.log('User found:', user); // Debug log
  
      // Compare the provided password with the stored hashed password
      const passwordMatch = await bcrypt.compare(password, user.UserPassword);
      if (!passwordMatch) {
        console.error(`Password mismatch for email: ${email}`); // Debug log
        return res.status(401).send({ message: 'Invalid email or password' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ userId: user.userID, role: user.Role }, JWT_SECRET, { expiresIn: '1h' });
      console.log(`Login successful for user: ${email}, generated token.`); // Debug log
      res.send({ token });
  
    } catch (err) {
      console.error('Error during login:', err); // Debug log with full error details
      res.status(500).send({ message: 'Error logging in user' });
    }
  });


module.exports = router;
