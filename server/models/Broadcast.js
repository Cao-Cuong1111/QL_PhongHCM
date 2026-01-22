const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Broadcast = sequelize.define('Broadcast', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        audioFile: {
            type: DataTypes.STRING, // Path to file
            allowNull: false,
        },
        startTime: {
            type: DataTypes.TIME, // 'HH:mm:ss'
            allowNull: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        days: {
            type: DataTypes.STRING, // "Daily", "Monday,Tuesday", etc.
            defaultValue: "Daily",
        },
    });

    return Broadcast;
};
