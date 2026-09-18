import express from 'express';
import cors from 'cors';
import usuarioRoutes from './routes/usuarioRoutes.js';
import especialidadRoutes from './routes/especialidadRoutes.js';

const app = express();

// Configuración de CORS permitiendo peticiones desde React
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Puertos comunes de Vite y CRA
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/especialidades', especialidadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});