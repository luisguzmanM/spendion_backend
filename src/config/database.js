const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.CONNECTIONSTRING,
  ssl: true,
})

module.exports = pool;