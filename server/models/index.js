const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

let sequelize;

// Use SQLite for simplicity and offline capability
sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database/QL_PhongHCM.db', // Database file path
    logging: false
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import Models
db.User = require('./User')(sequelize);
db.Book = require('./Book')(sequelize);
db.Equipment = require('./Equipment')(sequelize);
db.BorrowReturn = require('./BorrowReturn')(sequelize);
db.Registration = require('./Registration')(sequelize);
db.Schedule = require('./Schedule')(sequelize);
db.ActivityPlan = require('./ActivityPlan')(sequelize);
db.Broadcast = require('./Broadcast')(sequelize);

// Define Associations
// 1. BorrowReturn
db.User.hasMany(db.BorrowReturn, { foreignKey: 'userId' });
db.BorrowReturn.belongsTo(db.User, { foreignKey: 'userId' });

db.Book.hasMany(db.BorrowReturn, { foreignKey: 'bookId' });
db.BorrowReturn.belongsTo(db.Book, { foreignKey: 'bookId' });

// 2. Registration
db.User.hasMany(db.Registration, { foreignKey: 'userId' });
db.Registration.belongsTo(db.User, { foreignKey: 'userId' });

module.exports = db;
