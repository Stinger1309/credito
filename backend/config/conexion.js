const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',        // reemplaza con tus datos
  host: 'localhost',
  database: 'siccee', // reemplaza con tu base
<<<<<<< HEAD
  password: '13092003',   // reemplaza con tu password
=======
  password: 'Yeisnardo06',   // reemplaza con tu password
>>>>>>> 26255468f7dcd8d721106b43296d3c19c5e58628
  port: 5432,
});

const query = (text, params) => pool.query(text, params);

module.exports = { query };