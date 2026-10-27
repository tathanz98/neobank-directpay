// src/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// Ruta de prueba del estado del servidor
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ONLINE', 
    service: 'NeoBank DirectPay API REST',
    timestamp: new Date().toISOString()
  });
});

// Importar Rutas (Las crearemos en los siguientes pasos)
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/account', require('./routes/accountRoutes'));
// app.use('/api/credit', require('./routes/creditRoutes'));
// app.use('/api/transfers', require('./routes/transferRoutes'));

app.listen(PORT, () => {
  console.log(`🚀 Servidor de NeoBank DirectPay corriendo en el puerto ${PORT}`);
});