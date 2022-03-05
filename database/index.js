const {Pool, Client} = require ('pg');
require('dotenv').config()

const pool = new Pool ({
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER,
  database: process.env.DATABASE,
  password: process.env.PASSWORD
})

// ;(async function() {
//   const client = await pool.connect()
//   await client.query('SELECT NOW()')
//   client.release()
  // try {
  //   const res = await client.query('SELECT * FROM reviews')
  //   console.log(res.rows)
  // }
  // finally {
  //   client.release()
  // }
// })().catch(err => console.log(err.stack))

module.exports = pool;

// const {Client} = require ('pg');

// ;(async () => {
//   const client = new Client({
//     host: 'localhost',
//     port: 5432,
//     user: 'alexnorvani',
//     database: 'reviews',
//     ssl: true
//   });
//   await client.connect();
//   const res = await client.query('SELECT $1::text as connected', ['Connection to postgres successful!'] );
//   console.log(res.rows[0].connected);
//   await client.end()
// })();