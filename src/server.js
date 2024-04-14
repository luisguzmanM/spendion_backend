const express = require('express');
require('dotenv').config();
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const homeRoutes = require('./routes/homeRoutes');
const paymentsRoutes = require('./routes/paymentsRoutes');
const settingRoutes = require('./routes/settingRoutes');

const app = express();

const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/home', homeRoutes);
app.use('/payment', paymentsRoutes)
app.use('/setting', settingRoutes)

app.listen(port, () => console.log(`🚀 Server running in the port ---> ${port} 🚀`));
