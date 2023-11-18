// Dependencies
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const path = require('path');

// Routes
const authRoutes = require('./routes/authRoutes');
const homeRoutes = require('./routes/homeRoutes');
const paymentsRoutes = require('./routes/paymentsRoutes');

const app = express();

const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/home', homeRoutes);
app.use('/payment', paymentsRoutes)

app.listen(port, () => console.log(`Comencemos a generar dinero en el puerto ---> ${port} :D`));
