const db = require('../models');
const { User, Book, Equipment, BorrowReturn, Registration } = db;
const { Op } = require('sequelize');

exports.getSummary = async (req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // 1. Total Counts
        const totalUsers = await User.count();
        const totalBooks = await Book.count();
        const totalEquipment = await Equipment.count();

        // 2. Borrow Stats (Current Month)
        const totalBorrows = await BorrowReturn.count();
        const monthBorrows = await BorrowReturn.count({
            where: {
                borrowDate: {
                    [Op.between]: [startOfMonth, endOfMonth]
                }
            }
        });
        const overdueBooks = await BorrowReturn.count({
            where: {
                status: 'Overdue'
            }
        });

        // 3. Equipment Issues (Broken/Maintenance)
        const brokenEquipment = await Equipment.count({
            where: {
                status: {
                    [Op.or]: ['Hỏng', 'Bảo trì', 'Broken', 'Maintenance']
                }
            }
        });

        // 4. Registrations (Pending)
        const pendingRegistrations = await Registration.count({
            where: { status: 'Pending' }
        });

        res.json({
            totalUsers,
            totalBooks,
            totalEquipment,
            totalBorrows,
            monthBorrows,
            overdueBooks,
            brokenEquipment,
            pendingRegistrations
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
