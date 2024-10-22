'use strict';

const express = require('express');

const app = express();
app.use(express.json());

const routes = require('./rutes/project'); // Ajusta la ruta según sea necesario

// CARGAR ARCHIVOS DE RUTAS
const project_routes = require('./rutes/project');

// MIDLEWARES
//* CORS
// Configurar cabeceras y cors
const cors = require('cors');
const allowedOrigins = ['https://storum.com.ar', 'http://localhost:4200'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Authorization', 'X-API-KEY', 'Origin', 'X-Requested-With', 'Content-Type', 'Accept']
}));



// RUTAS
app.use('/api', project_routes);



// Exportar
module.exports = app;