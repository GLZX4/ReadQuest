// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sql = require('mssql');
const { connectToDatabase } = require('../middleware/dbConfig');
const { code } = require('framer-motion/client');
require('dotenv').config();

const router = express.Router();
connectToDatabase();

// Secret key for JWT
const JWT_SECRET = 'your_jwt_secret_here';

// Register endpoint
router.post('/register', async (req, res) => {
    console.log('Received registration request:', req.body); // Debug log
    try {
        // Extract request body
        const { name, email, password, role, schoolCode } = req.body;

        // Validate request
        if (!name || !email || !password || !role || !schoolCode) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Fetch school ID
        const schoolResult = await sql.query`SELECT schoolID FROM Schools WHERE schoolCode = ${schoolCode}`;
        if (schoolResult.recordset.length === 0) {
            return res.status(400).json({ message: 'Invalid school code.' });
        }
        const schoolID = schoolResult.recordset[0].schoolID;

        // Fetch or insert role ID
        let roleResult = await sql.query`SELECT roleID FROM Roles WHERE Role = ${role}`;
        let roleID;

        if (roleResult.recordset.length > 0) {
            roleID = roleResult.recordset[0].roleID;
        } else {
            await sql.query`INSERT INTO Roles (Role) VALUES (${role})`;
            roleResult = await sql.query`SELECT roleID FROM Roles WHERE Role = ${role}`;
            roleID = roleResult.recordset[0].roleID;
        }

        // Insert user into database
        await sql.query`
            INSERT INTO Users (Name, Email, UserPassword, roleID, schoolID) 
            VALUES (${name}, ${email}, ${hashedPassword}, ${roleID}, ${schoolID})
        `;
        res.status(201).json({ message: 'User registered successfully.' });

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Login Endpoint
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await sql.query`
            SELECT u.*, r.Role 
            FROM Users u
            JOIN Roles r ON u.roleID = r.roleID
            WHERE u.Email = ${email}
        `;

        if (result.recordset.length === 0) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }

        const user = result.recordset[0];
        const passwordMatch = await bcrypt.compare(password, user.UserPassword);
        if (!passwordMatch) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.userID, role: user.Role }, JWT_SECRET, { expiresIn: '1h' });
        res.send({ token });

        // Update user's login status
        await sql.query`UPDATE Users SET loggedIn = 1 WHERE Email = ${email}`;

    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send({ message: 'Error logging in user' });
    }
});

// Logout Endpoint
router.post('/logout', async (req, res) => {
    const { email } = req.body;
    try {
        await sql.query`UPDATE Users SET loggedIn = 0 WHERE Email = ${email}`;
        res.send({ message: 'User logged out successfully' });
    } catch (err) {
        console.error('Error during logout:', err);
        res.status(500).send({ message: 'Error logging out user' });
    }
});

// Register endpoint for tutors with verification code
router.post('/register-tutor', async (req, res) => {
    const { name, email, password, verificationCode } = req.body;
    const role = 'tutor';

    console.log("Received tutor registration request:", req.body); // Debug log
    let trueCode;
    try {
        const codeFind = await sql.query`SELECT * FROM VerificationCode WHERE code = ${verificationCode}`;
        trueCode = codeFind;
        console.log("True code:", trueCode);
    } catch (error) {
        console.error('Error during tutor registration:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }

    if (verificationCode !== trueCode.recordset[0].code) {
        return res.status(401).json({ message: 'Invalid verification code' });
    } else if (trueCode.recordset[0].used === true) {
        return res.status(401).json({ message: 'Verification code already used' });
    } else if (trueCode.recordset[0].expirationAt < new Date()) {
        return res.status(401).json({ message: 'Verification code expired' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        let roleResult = await sql.query`SELECT roleID FROM Roles WHERE Role = ${role}`;
        let roleID;

        if (roleResult.recordset.length > 0) {
            roleID = roleResult.recordset[0].roleID;
        } else {
            await sql.query`INSERT INTO Roles (Role) VALUES (${role})`;
            roleResult = await sql.query`SELECT roleID FROM Roles WHERE Role = ${role}`;
            roleID = roleResult.recordset[0].roleID;
        }

        const schoolID = trueCode.recordset[0].schoolID;    

        await sql.query`
            INSERT INTO Users (Name, Email, UserPassword, roleID, schoolID) 
            VALUES (${name}, ${email}, ${hashedPassword}, ${roleID}, ${schoolID})
        `;
        await sql.query`UPDATE VerificationCode SET used = 1 WHERE code = ${verificationCode}`;
        console.log('Tutor registered successfully.');
        res.status(201).json({ message: 'Tutor registered successfully.' });
    } catch (error) {
        console.error('Error during tutor registration:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Temporary admin registration endpoint (restricted)
router.post('/register-admin', async (req, res) => {
    const { name, email, password } = req.body;
    const role = 'admin';

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        let roleResult = await sql.query`SELECT roleID FROM Roles WHERE Role = ${role}`;
        let roleID;

        if (roleResult.recordset.length > 0) {
            roleID = roleResult.recordset[0].roleID;
        } else {
            await sql.query`INSERT INTO Roles (Role) VALUES (${role})`;
            roleResult = await sql.query`SELECT roleID FROM Roles WHERE Role = ${role}`;
            roleID = roleResult.recordset[0].roleID;
        }

        await sql.query`
            INSERT INTO Users (Name, Email, UserPassword, roleID) 
            VALUES (${name}, ${email}, ${hashedPassword}, ${roleID})
        `;
        res.status(201).json({ message: 'Admin registered successfully.' });
    } catch (error) {
        console.error('Error during admin registration:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;
