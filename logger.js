// logger.js
const fs = require('fs');
const path = require('path');

// Define the path to the log file
const logFilePath = path.resolve(__dirname, 'app.log');

// Ensure the directory exists
const logDir = path.dirname(logFilePath);
if (!fs.existsSync(logDir)) {
  try {
    fs.mkdirSync(logDir, { recursive: true });
  } catch (err) {
    console.error('Error creating directory:', err);
  }
}

// Create the log file and prepare the write stream
let logStream;
try {
  logStream = fs.createWriteStream(logFilePath, { flags: 'a' });
} catch (err) {
  console.error('Error creating log file:', err);
}

function logToFile(message) {
  if (logStream) {
    const formattedMessage = `${new Date().toISOString()} - ${message}\n`;
    logStream.write(formattedMessage);
  }
}

const originalConsoleLog = console.log;
const originalConsoleError = console.error;

console.log = function(...args) {
  originalConsoleLog.apply(console, args);
  logToFile(args.join(' '));
};

console.error = function(...args) {
  originalConsoleError.apply(console, args);
  logToFile(args.join(' '));
};
