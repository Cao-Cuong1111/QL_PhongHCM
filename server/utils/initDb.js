const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const logToFile = require('./logger');

dotenv.config();

async function ensureDatabaseExists() {
    const dbName = process.env.DB_NAME || 'QL_PhongHCM';
    const host = process.env.DB_HOST;
    const isWindowsAuth = process.env.DB_AUTH_TYPE === 'windows';

    logToFile(`Checking database '${dbName}' on host '${host}' (WindowsAuth: ${isWindowsAuth})...`);

    if (isWindowsAuth) {
        // Use raw msnodesqlv8 because Sequelize has issues with it in some versions
        const sql = require('msnodesqlv8');
        const connectionString = `Driver={ODBC Driver 17 for SQL Server};Server=${host};Database=master;Trusted_Connection=yes;`;

        return new Promise((resolve, reject) => {
            const query = `SELECT name FROM sys.databases WHERE name = '${dbName}'`;

            sql.query(connectionString, query, (err, rows) => {
                if (err) {
                    logToFile('Error checking DB (msnodesqlv8): ' + err.message);
                    return reject(err);
                }

                if (rows && rows.length > 0) {
                    logToFile(`Database '${dbName}' already exists.`);
                    resolve();
                } else {
                    logToFile(`Database '${dbName}' does not exist. Creating...`);
                    const createQuery = `CREATE DATABASE [${dbName}]`;
                    sql.query(connectionString, createQuery, (err2) => {
                        if (err2) {
                            logToFile('Error creating DB: ' + err2.message);
                            return reject(err2);
                        }
                        logToFile(`Database '${dbName}' created successfully.`);
                        resolve();
                    });
                }
            });
        });
    }

    let masterSequelize;

    // This block is for SQL Auth
    masterSequelize = new Sequelize(
        'master',
        process.env.DB_USER,
        process.env.DB_PASS,
        {
            host: host,
            dialect: 'mssql',
            logging: false,
            dialectOptions: {
                options: {
                    encrypt: false,
                    trustServerCertificate: true,
                },
            },
        }
    );

    try {
        await masterSequelize.authenticate();
        const [results] = await masterSequelize.query(`SELECT name FROM sys.databases WHERE name = '${dbName}'`);

        if (results.length === 0) {
            console.log(`Database '${dbName}' does not exist. Creating...`);
            logToFile(`Database '${dbName}' does not exist. Creating...`);
            await masterSequelize.query(`CREATE DATABASE [${dbName}]`);
            console.log(`Database '${dbName}' created successfully.`);
            logToFile(`Database '${dbName}' created successfully.`);
        } else {
            console.log(`Database '${dbName}' already exists.`);
            logToFile(`Database '${dbName}' already exists.`);
        }
    } catch (error) {
        console.error('Error checking/creating database:', error);
        logToFile('Error checking/creating database: ' + error.message);
        throw error;
    } finally {
        if (masterSequelize) await masterSequelize.close();
    }
}

module.exports = ensureDatabaseExists;
