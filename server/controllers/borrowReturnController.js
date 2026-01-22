const db = require('../models');
const BorrowReturn = db.BorrowReturn;
const Book = db.Book;
const User = db.User;
const { Op } = require('sequelize');

// Borrow a Book
exports.borrowBook = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const { userId, bookId, dueDate, note } = req.body;

        // 1. Check if Book exists and has quantity > 0
        const book = await Book.findByPk(bookId, { transaction: t });
        if (!book) {
            await t.rollback();
            return res.status(404).json({ message: "Sách không tồn tại!" });
        }
        if (book.quantity < 1) {
            await t.rollback();
            return res.status(400).json({ message: "Sách đã hết, không thể mượn!" });
        }

        // 2. Check if User exists
        const user = await User.findByPk(userId, { transaction: t });
        if (!user) {
            await t.rollback();
            return res.status(404).json({ message: "Người dùng không tồn tại!" });
        }

        // 3. Create Borrow Record
        const borrowRecord = await BorrowReturn.create({
            userId,
            bookId,
            dueDate,
            note,
            status: 'Borrowing',
            borrowDate: new Date()
        }, { transaction: t });

        // 4. Decrement Book Quantity
        await book.decrement('quantity', { transaction: t });

        await t.commit();
        res.status(201).json({ message: "Mượn sách thành công!", data: borrowRecord });

    } catch (err) {
        await t.rollback();
        res.status(500).json({ message: err.message || "Lỗi khi mượn sách." });
    }
};

// Return a Book
exports.returnBook = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const { id } = req.params; // BorrowRecord ID
        const { status, note } = req.body; // status can be Returned, Lost...

        const record = await BorrowReturn.findByPk(id, { transaction: t });
        if (!record) {
            await t.rollback();
            return res.status(404).json({ message: "Phiếu mượn không tồn tại!" });
        }

        if (record.status === 'Returned') {
            await t.rollback();
            return res.status(400).json({ message: "Sách này đã được trả rồi!" });
        }

        // Update Record
        record.returnDate = new Date();
        record.status = status || 'Returned';
        if (note) record.note = note;
        await record.save({ transaction: t });

        // Increment Book Quantity if returned allowed (e.g., not lost)
        if (status !== 'Lost') {
            await Book.increment('quantity', { by: 1, where: { id: record.bookId }, transaction: t });
        }

        await t.commit();
        res.json({ message: "Trả sách thành công!", data: record });

    } catch (err) {
        await t.rollback();
        res.status(500).json({ message: err.message || "Lỗi khi trả sách." });
    }
};

// List Borrowings
exports.findAll = async (req, res) => {
    try {
        const { userId, status } = req.query;
        const condition = {};

        if (userId) condition.userId = userId;
        if (status) condition.status = status;

        // If User role, only see own records
        if (req.userRole !== 'admin') {
            condition.userId = req.userId;
        }

        const data = await BorrowReturn.findAll({
            where: condition,
            include: [
                { model: Book, attributes: ['code', 'title'] },
                { model: User, attributes: ['username', 'fullName', 'unit'] }
            ],
            order: [['borrowDate', 'DESC']]
        });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
