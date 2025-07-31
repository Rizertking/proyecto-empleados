const express = require('express');
const cors = require('cors');
const createAdminUser = require('./initAdmin');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 Crear usuario admin si no existe
createAdminUser();

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/requests', require('./routes/requests'));

module.exports = app;
