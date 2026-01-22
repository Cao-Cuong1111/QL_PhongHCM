const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const db = require('./models');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Routes Imports
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/book');
const borrowRoutes = require('./routes/borrowReturn');
const equipmentRoutes = require('./routes/equipment');
const registrationRoutes = require('./routes/registration');
const scheduleRoutes = require('./routes/schedule');
const activityPlanRoutes = require('./routes/activityPlan');
const broadcastRoutes = require('./routes/broadcast');
const userRoutes = require('./routes/user');
const reportRoutes = require('./routes/report');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'public/app')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/activity-plans', activityPlanRoutes);
app.use('/api/broadcasts', broadcastRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);

const seedAdmin = require('./utils/seed');
const logToFile = require('./utils/logger');
const ensureDatabaseExists = require('./utils/initDb');

// Database Sync & Start Server
logToFile('Starting server initialization with SQLite...');

db.sequelize.sync({ alter: true }) // alter: true updates schema without dropping data
    .then(async () => {
        logToFile('Database synced.');

        try {
            await seedAdmin();
            logToFile('Admin seeded.');
        } catch (err) {
            logToFile('Seeding error: ' + err.message);
        }

        app.listen(PORT, () => {
            const msg = `🚀 Server is running on http://localhost:${PORT}`;
            console.log(msg);
            logToFile(msg);
        });
    })
    .catch((err) => {
        console.error('❌ Failed to sync database:', err);
        logToFile('❌ Failed to sync database: ' + err.message);
    });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/app/index.html'));
});

app.get('/api', (req, res) => {
    res.send('QL_PhongHCM API is running...');
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.use((req, res, next) => {
    // Only handle GET requests that don't match API or static files
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
        return res.sendFile(path.join(__dirname, 'public/app/index.html'));
    }
    next();
});

// Helper route to check DB status
app.get('/health', async (req, res) => {
    try {
        await db.sequelize.authenticate();
        res.json({ status: 'OK', message: 'Database connected' });
    } catch (err) {
        res.status(500).json({ status: 'Error', message: err.message });
    }
});
