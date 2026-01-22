const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Registration = sequelize.define('Registration', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: { // Add userId foreign key reference explicitly if not auto-added
            type: DataTypes.INTEGER,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('Room', 'Computer'),
            allowNull: false,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        shift: { // Ca sử dụng (Sáng/Chiều/Tối) hoặc Giờ cụ thể
            type: DataTypes.STRING,
        },
        purpose: { // Mục đích: Học tập, Sinh hoạt...
            type: DataTypes.STRING,
        },
        participants: { // Thành phần tham gia / Đơn vị
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
            defaultValue: 'Pending',
        },
    });

    return Registration;
};
