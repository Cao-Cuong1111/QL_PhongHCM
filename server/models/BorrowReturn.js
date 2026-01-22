const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const BorrowReturn = sequelize.define('BorrowReturn', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        borrowDate: {
            type: DataTypes.DATEONLY,
            defaultValue: DataTypes.NOW,
        },
        dueDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        returnDate: {
            type: DataTypes.DATEONLY,
        },
        status: {
            type: DataTypes.ENUM('Borrowing', 'Returned', 'Overdue', 'Lost'),
            defaultValue: 'Borrowing',
        },
        note: {
            type: DataTypes.STRING,
        },
    });

    return BorrowReturn;
};
