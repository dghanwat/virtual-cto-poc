import * as winston from "winston";

// Define the custom settings for each transport (file, console)
const options = {
  console: {
    handleExceptions: true,
    level: "debug",
  },
  file: {
    filename: "server.log",
    handleExceptions: true,
    level: "info",
    maxFiles: 10,
    maxsize: 1024 * 1024 * 10, // 10MB
  },
};

// Instantiate a new Winston Logger with the settings defined above.
const logger = winston.createLogger({
  exitOnError: false, // Do not exit on handled exceptions.
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.timestamp(),
    winston.format.printf(info => {
      return `[${info.level.toUpperCase()}] - [${info.timestamp}] : ${info.message}`;
    }),
  ),
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console),
  ],
});

// Export the logger instance so that it can be used in other files.
export default function() {
  return logger;
}
