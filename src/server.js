const express = require('express');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const homeRouter = require('./routes/homeRoutes');
const cors = require('cors');
const path = require('path');

const app = express();

const port = process.env.PORT;

app.use(cors());

app.use(express.json());

app.use('/auth', authRoutes);

app.use('/home', homeRouter);

// Configuración para servir archivos estáticos desde la carpeta 'dist/side_project01_frontend' del frontend
app.use(express.static(path.join(__dirname, 'dist', 'side_project01_frontend')));

// Middleware para redirigir todas las solicitudes al archivo index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'side_project01_frontend', 'index.html'));
});


app.listen(port, () => console.log(`Server running in port ${port} :D`));