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

/**ARCHIVOS ESTATICOS**/
app
  .use('/public/', express.static('public', { redirect: false }))
  .use('/', express.static('dist', { redirect: false }))
  .get('*', function (req, res, next) {
    res.sendFile(path.resolve('dist/index.html'));
  });


app.listen(port, () => console.log(`Server running in port ${port} :D`));