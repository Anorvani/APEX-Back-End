const {Pool, Client} = require ('pg');
require('dotenv').config()

const pool = new Pool ({
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER,
  database: process.env.DATABASE,
  password: process.env.PASSWORD
})

module.exports = pool;