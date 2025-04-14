const mysql = require('mysql2/promise');

const pool = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rutas1', 
  database: 'albiweb'
});

connection.connect((err) => {
  if (err) {
      console.error('Error al conectar con la base de datos:', err);
  } else {
      console.log('Conectado a la base de datos');
  }
});

module.exports = connection;
