const db = require('../models');
const Book = db.Book;
const { Op } = require('sequelize');

// Create and Save a new Book
exports.create = async (req, res) => {
    try {
        const { code, title, category, author, publishYear, quantity, status } = req.body;

        const book = await Book.create({
            code,
            title,
            category,
            author,
            publishYear,
            quantity,
            status
        });

        res.status(201).json(book);
    } catch (err) {
        res.status(500).json({
            message: err.message || "Some error occurred while creating the Book."
        });
    }
};

// Retrieve all Books from the database.
exports.findAll = async (req, res) => {
    const { title, category } = req.query;
    const condition = {};

    if (title) {
        condition.title = { [Op.like]: `%${title}%` };
    }
    if (category) {
        condition.category = category;
    }

    try {
        const data = await Book.findAll({ where: condition });
        res.json(data);
    } catch (err) {
        res.status(500).json({
            message: err.message || "Some error occurred while retrieving books."
        });
    }
};

// Find a single Book with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;

    try {
        const data = await Book.findByPk(id);
        if (data) {
            res.json(data);
        } else {
            res.status(404).json({ message: `Cannot find Book with id=${id}.` });
        }
    } catch (err) {
        res.status(500).json({
            message: "Error retrieving Book with id=" + id
        });
    }
};

// Update a Book by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id;

    try {
        const [num] = await Book.update(req.body, {
            where: { id: id }
        });

        if (num == 1) {
            res.json({ message: "Book was updated successfully." });
        } else {
            res.json({
                message: `Cannot update Book with id=${id}. Maybe Book was not found or req.body is empty!`
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "Error updating Book with id=" + id
        });
    }
};

// Delete a Book with the specified id in the request
exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        const num = await Book.destroy({
            where: { id: id }
        });

        if (num == 1) {
            res.json({ message: "Book was deleted successfully!" });
        } else {
            res.json({
                message: `Cannot delete Book with id=${id}. Maybe Book was not found!`
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "Could not delete Book with id=" + id
        });
    }
};
