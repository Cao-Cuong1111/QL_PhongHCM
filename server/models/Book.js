const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Book = sequelize.define('Book', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        code: { // Mã sách
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        category: { // Loại: Sách chính trị, Báo, Tạp chí...
            type: DataTypes.STRING,
        },
        author: {
            type: DataTypes.STRING,
        },
        publishYear: {
            type: DataTypes.INTEGER,
        },
        quantity: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        status: { // Tình trạng: Mới, cũ, rách...
            type: DataTypes.STRING,
            defaultValue: 'Good',
        },
    });

    return Book;
};
