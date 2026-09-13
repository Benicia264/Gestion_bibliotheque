const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const {Pool} = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Test pour afficher la connexion dans le terminal
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Erreur de connexion PostgreSQL :', err.message);
  }
  console.log('Connecté à la base de données avec succès !');
  release();
});
module.exports = pool;