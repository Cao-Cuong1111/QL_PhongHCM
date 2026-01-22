const db = require('../models');
const User = db.User;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, password, fullName, role, unit, rank } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists!' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 8);

        // Create user
        const user = await User.create({
            username,
            password: hashedPassword,
            fullName,
            role: role || 'user',
            unit,
            rank
        });

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const passwordIsValid = await bcrypt.compare(password, user.password);

        if (!passwordIsValid) {
            return res.status(401).json({
                accessToken: null,
                message: 'Invalid Password!'
            });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: 86400 // 24 hours
        });

        res.status(200).json({
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            role: user.role,
            accessToken: token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
