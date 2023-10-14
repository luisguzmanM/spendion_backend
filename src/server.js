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

// Servir archivos estáticos desde la carpeta 'dist'
app.use(express.static(path.join(__dirname, 'https://spendion-frontend.onrender.com/dist/side_project01_frontend')));

// Enrutamiento para todas las rutas (cualquier ruta) que envía el archivo index.html
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'https://spendion-frontend.onrender.com/dist/side_project01_frontend/index.html'));
});

app.listen(port, () => console.log(`Server running in port ${port} :D`));