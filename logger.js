// logger.js
const fs = require('fs');
const path = require('path');

const logFilePath = path.resolve(__dirname, 'app.log');
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

function logToFile(message) {
  const formattedMessage = `${new Date().toISOString()} - ${message}\n`;
  logStream.write(formattedMessage);
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
