const express = require('express');

class HealthCheckController {
  constructor({ }) {
    this.router = express.Router();
    this.router.get('/', this.healthCheck.bind(this));
}

  async healthCheck(req, res) {
    try {
      // Realiza una comprobación simple para determinar si el servicio está en funcionamiento
      // Puedes personalizar esta lógica según tus necesidades
      const status = 'OK';
      return res.status(200).json({ status });
    } catch (error) {
      console.error('Error en el health check:', error);
      return res.status(500).json({ error: 'Error en el health check' });
    }
  }


}

module.exports = HealthCheckController;