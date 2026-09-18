import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import db from './models/index.js';

// Importar rutas
import mediaRoutes from './routes/mediaRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import especialidadRoutes from './routes/especialidadRoutes.js'; // 1. Importar

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Montar rutas principales
app.use('/api', mediaRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/especialidades', especialidadRoutes); // 2. Montar ruta

const PORT = process.env.PORT || 5000;

db.sequelize
  .sync()
  .then(() => {
    console.log('Base de datos MySQL sincronizada correctamente.');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor activo en http://127.0.0.1:${PORT}`);
    });
  })
  .catch((err) => console.error('Error al conectar con la base de datos:', err));