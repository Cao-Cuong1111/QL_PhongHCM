const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Equipment = sequelize.define('Equipment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        code: { // Mã vật chất
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
        status: { // Tình trạng: Tốt, Hỏng, Đang bảo trì
            type: DataTypes.STRING,
            defaultValue: 'Good',
        },
        description: {
            type: DataTypes.STRING,
        },
    });

    return Equipment;
};
