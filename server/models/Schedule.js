const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Schedule = sequelize.define('Schedule', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        weekNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false, // "Ngày" in image (combined with Day)
        },
        dayOfWeek: { // "Thứ" in image (e.g., "Thứ hai") - can be derived from date but storing for explicit display/sorting if needed, or just derive. Let's derive.
            type: DataTypes.VIRTUAL,
            get() {
                // Return Vietnamese day name
                const date = new Date(this.date);
                const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
                return days[date.getDay()];
            }
        },
        time: { // "Thời gian" in image (e.g., "07h00 - 07h30")
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: { // "Nội dung, biện pháp" in image
            type: DataTypes.TEXT, // Could be long
            allowNull: false,
        },
        participants: { // "Thành phần đối tượng" in image
            type: DataTypes.STRING,
        },
        location: { // "Địa điểm" in image
            type: DataTypes.STRING,
        },
        personInCharge: { // "Phụ trách" in image
            type: DataTypes.STRING,
        },
        note: { // "Ghi chú" in image
            type: DataTypes.STRING,
        },
        // Old fields I might keep or discard?
        // category: DataTypes.STRING, // Maybe keep for filtering?
        // hostUnit: DataTypes.STRING, // Overlap with personInCharge? Let's keep for "Unit" vs "Person".
    });

    return Schedule;
};
