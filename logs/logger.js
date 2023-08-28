const fs = require('fs');
const path = require('path');

class Logger {
  static async logResponseTime(req, res, next) {
    const start = Date.now();
    res.on('finish', async () => {
      const end = Date.now();
      const responseTime = end - start;
      const logMessage = `[${new Date().toISOString()}] ${req.method} ${req.url} - Response Time: ${responseTime} ms`;

      await Logger.writeLog(logMessage);
    });
    next();
  }

  static async writeLog(message) {
    const logDirectory = path.join(__dirname, '../tmp/logs');
    const logFilePath = path.join(logDirectory, 'access.log');

    try {
      // Verificar si el directorio existe, si no, crearlo
      if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory, { recursive: true });
      }

      await fs.promises.appendFile(logFilePath, message + '\n');
    } catch (error) {
      console.error('Error al escribir en el archivo de registro:', error);
    }
  }
}

module.exports = Logger;
