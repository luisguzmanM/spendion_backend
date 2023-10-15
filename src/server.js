const express = require('express');
const path = require('path');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const homeRouter = require('./routes/homeRoutes');
const cors = require('cors');

const app = express();

const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/home', homeRouter);

// Configuración para servir archivos estáticos de Angular
app.use(express.static(path.join(__dirname, '../dist/spendion')));


// Configuración para manejar rutas de Angular
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../dist/spendion', 'index.html'));
});

console.log('__dirname: ', __dirname)
console.log('__filename: ', __filename)

app.listen(port, () => console.log(`Server running in port ${port} :D`));
