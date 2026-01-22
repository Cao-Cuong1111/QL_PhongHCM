const db = require('../models');
const Equipment = db.Equipment;
const { Op } = require('sequelize');

// Create Equipment
exports.create = async (req, res) => {
    try {
        const { code, name, quantity, status, description } = req.body;
        const item = await Equipment.create({ code, name, quantity, status, description });
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Find All
exports.findAll = async (req, res) => {
    const { name, status } = req.query;
    const condition = {};

    if (name) condition.name = { [Op.like]: `%${name}%` };
    if (status) condition.status = status;

    try {
        const data = await Equipment.findAll({ where: condition });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Find One
exports.findOne = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await Equipment.findByPk(id);
        if (data) res.json(data);
        else res.status(404).json({ message: "Equipment not found" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update
exports.update = async (req, res) => {
    const id = req.params.id;
    try {
        const [num] = await Equipment.update(req.body, { where: { id: id } });
        if (num == 1) res.json({ message: "Updated successfully." });
        else res.json({ message: "Cannot update. Maybe not found!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete
exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
        const num = await Equipment.destroy({ where: { id: id } });
        if (num == 1) res.json({ message: "Deleted successfully!" });
        else res.json({ message: "Cannot delete. Maybe not found!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
