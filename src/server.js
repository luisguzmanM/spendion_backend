const express = require('express');
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

app.listen(port, () => console.log(`Server running in port ${port} :D`));
