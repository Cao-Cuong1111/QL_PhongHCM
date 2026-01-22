const db = require('../models');
const bcrypt = require('bcryptjs');

async function seedAdmin() {
    try {
        // Check if any admin exists
        const adminCount = await db.User.count({ where: { role: 'admin' } });

        if (adminCount === 0) {
            console.log('⚠️ No admin account found. Creating default admin...');

            const hashedPassword = await bcrypt.hash('123456', 10);

            await db.User.create({
                username: 'admin',
                password: hashedPassword,
                fullName: 'Quản trị viên',
                role: 'admin',
                unit: 'Hệ thống',
                rank: 'Admin'
            });

            console.log('✅ Default Admin created successfully.');
            console.log('👉 Username: admin');
            console.log('👉 Password: 123456');
        } else {
            console.log('ℹ️ Admin account already exists. Skipping seed.');
        }
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
    }
}

module.exports = seedAdmin;
