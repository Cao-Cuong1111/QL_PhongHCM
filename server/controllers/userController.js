const db = require('../models');
const User = db.User;
const bcrypt = require('bcryptjs'); // Ensure bcryptjs is installed or reused from auth

// Get All Users
exports.findAll = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] } // Don't return passwords
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create User (Admin)
exports.create = async (req, res) => {
    try {
        const { username, password, fullName, role, unit, rank } = req.body;

        // Check if username exists
        const existing = await User.findOne({ where: { username } });
        if (existing) return res.status(400).json({ message: "Username already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            password: hashedPassword,
            fullName,
            role: role || 'user',
            unit,
            rank
        });

        res.status(201).json({ message: "User created successfully", userId: user.id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update User
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, role, unit, rank, password } = req.body;

        const updateData = { fullName, role, unit, rank };

        // If password is provided, hash it
        if (password && password.trim() !== "") {
            updateData.password = await bcrypt.hash(password, 10);
        }

        await User.update(updateData, { where: { id } });
        res.json({ message: "User updated successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete User
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await User.destroy({ where: { id } });
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get Single User
exports.findOne = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
