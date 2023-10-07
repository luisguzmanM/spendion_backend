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

// Manejar las rutas no encontradas
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'spendion-frontend.onrender.com/index.html'));
});


app.use('/auth', authRoutes);

app.use('/home', homeRouter);

app.listen(port, () => console.log(`Server running in port ${port} :D`));