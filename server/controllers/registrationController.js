const db = require('../models');
const Registration = db.Registration;
const User = db.User;
const { Op } = require('sequelize');

// Create Registration
exports.create = async (req, res) => {
    try {
        const { type, date, shift, purpose, participants } = req.body;
        const userId = req.userId; // From authMiddleware

        const registration = await Registration.create({
            userId,
            type,
            date,
            shift,
            purpose,
            participants,
            status: 'Pending' // Default
        });

        res.status(201).json({ message: "Đăng ký thành công!", data: registration });
    } catch (err) {
        res.status(500).json({ message: err.message || "Lỗi khi tạo đăng ký." });
    }
};

// Find All (Admin sees all, User sees own)
exports.findAll = async (req, res) => {
    try {
        const condition = {};
        const { type, status } = req.query;

        if (req.userRole !== 'admin') {
            condition.userId = req.userId;
        }

        if (type) condition.type = type;
        if (status) condition.status = status;

        const data = await Registration.findAll({
            where: condition,
            include: [{
                model: User,
                attributes: ['fullName', 'unit']
            }],
            order: [['date', 'DESC']]
        });

        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message || "Lỗi khi lấy danh sách." });
    }
};

// Approve/Reject (Admin only)
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Approved or Rejected

        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: "Trạng thái không hợp lệ." });
        }

        const registration = await Registration.findByPk(id);
        if (!registration) {
            return res.status(404).json({ message: "Không tìm thấy phiếu đăng ký." });
        }

        registration.status = status;
        await registration.save();

        res.json({ message: "Cập nhật trạng thái thành công!", data: registration });
    } catch (err) {
        res.status(500).json({ message: err.message || "Lỗi khi cập nhật." });
    }
};

// Delete (User can delete Pending, Admin can delete any)
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const registration = await Registration.findByPk(id);

        if (!registration) {
            return res.status(404).json({ message: "Không tìm thấy phiếu đăng ký." });
        }

        // Check permission
        if (req.userRole !== 'admin' && registration.userId !== req.userId) {
            return res.status(403).json({ message: "Không có quyền xóa." });
        }

        // User can only delete if Pending
        if (req.userRole !== 'admin' && registration.status !== 'Pending') {
            return res.status(400).json({ message: "Chỉ có thể xóa phiếu đang chờ duyệt." });
        }

        await registration.destroy();
        res.json({ message: "Xóa thành công!" });
    } catch (err) {
        res.status(500).json({ message: err.message || "Lỗi khi xóa." });
    }
};
