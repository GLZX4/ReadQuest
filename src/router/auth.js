const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User model (assuming it's set up)
const User = require('../models/user');

// Register Route
router.post('/register', async (req, res) => {
    const { name, username, email, password, role } = req.body;

    try {
        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'Username already taken' });

        // Create a new user
        const newUser = new User({ name, username, email, password, role });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


// Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists by username
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check if password matches
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        // Generate a JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            'secretKey',
            { expiresIn: '1h' }
        );

        // Return token to client
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
