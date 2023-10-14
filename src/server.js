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

app.use(express.static(path.join(__dirname, 'https://www.spendion.app/dist')));

app.use('/auth', authRoutes);

app.use('/home', homeRouter);

// Configurar la ruta para el archivo index.html
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'https://www.spendion.app/dist', 'index.html'));
});

app.listen(port, () => console.log(`Server running in port ${port} :D`));