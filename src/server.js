const express = require('express');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');

const app = express();

const port = process.env.PORT;

app.use(express.json()); // Middleware to parse JSON requests

app.use('/auth', authRoutes);

app.listen(port, () => console.log(`Server running in port ${port} :D`));