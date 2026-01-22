const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ActivityPlan = sequelize.define('ActivityPlan', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        month: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        group: {
            // Grouping: I, II, III, IV, V...
            // Storing as Integer 1, 2, 3... or String title?
            // Let's store the full Title of the group for flexibility, or an Enum.
            // For simplicity and matching the image exactly, let's use a standard list of groups,
            // but store the string name so they can be grouped in UI.
            type: DataTypes.STRING,
            allowNull: false,
            // Ex: "I. Hoạt động thông tin, tuyên truyền cổ động"
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        time: {
            // "Sáng thứ 2 hàng tuần", "Thường xuyên"
            type: DataTypes.STRING,
        },
        participants: {
            type: DataTypes.STRING,
        },
        location: {
            type: DataTypes.STRING,
        },
        personInCharge: {
            type: DataTypes.STRING,
        },
        note: {
            type: DataTypes.STRING,
        }
    });

    return ActivityPlan;
};
