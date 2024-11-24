//backend/api/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';


module.exports = (pool) => {
    // Register endpoint
    router.post('/register', async (req, res) => {
        try {
            const { name, email, password, role, schoolCode } = req.body;

            if (!name || !email || !password || !role || !schoolCode) {
                return res.status(400).json({ message: 'All fields are required.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const schoolResult = await pool.query('SELECT schoolID FROM Schools WHERE schoolCode = $1', [schoolCode]);
            if (schoolResult.rows.length === 0) {
                return res.status(400).json({ message: 'Invalid school code.' });
            }
            const schoolID = schoolResult.rows[0].schoolid;

            let roleResult = await pool.query('SELECT roleID FROM Roles WHERE Role = $1', [role]);
            let roleID;

            if (roleResult.rows.length > 0) {
                roleID = roleResult.rows[0].roleid;
            } else {
                await pool.query('INSERT INTO Roles (Role) VALUES ($1)', [role]);
                roleResult = await pool.query('SELECT roleID FROM Roles WHERE Role = $1', [role]);
                roleID = roleResult.rows[0].roleid;
            }

            await pool.query(
                'INSERT INTO Users (Name, Email, UserPassword, roleID, schoolID) VALUES ($1, $2, $3, $4, $5)',
                [name, email, hashedPassword, roleID, schoolID]
            );
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
            const result = await pool.query(
                `SELECT u.*, r.Role 
                 FROM Users u
                 JOIN Roles r ON u.roleID = r.roleID
                 WHERE u.Email = $1`,
                [email]
            );

            if (result.rows.length === 0) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            const user = result.rows[0];
            const passwordMatch = await bcrypt.compare(password, user.userpassword);
            if (!passwordMatch) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Generate JWT token
            const token = jwt.sign({ userId: user.userid, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
            const name = user.name;
            res.json({ token, name });

            // Update user's login status
            await pool.query('UPDATE Users SET loggedIn = TRUE WHERE Email = $1', [email]);
        } catch (err) {
            console.error('Error during login:', err);
            res.status(500).json({ message: 'Error logging in user' });
        }
    });

    // Logout Endpoint
    router.post('/logout', async (req, res) => {
        const { email } = req.body;
        try {
            await pool.query('UPDATE Users SET loggedIn = FALSE WHERE Email = $1', [email]);
            res.json({ message: 'User logged out successfully' });
        } catch (err) {
            console.error('Error during logout:', err);
            res.status(500).json({ message: 'Error logging out user' });
        }
    });
    return router;
};
