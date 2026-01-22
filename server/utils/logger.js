const fs = require('fs');
const path = require('path');

function logToFile(message) {
    const logPath = path.join(__dirname, '..', 'server_log.txt');
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`);
}

module.exports = logToFile;
