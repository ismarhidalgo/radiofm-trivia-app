const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '00000000',
  database: "mysql"
});

connection.connect(err => {
  if (err) throw err;
  console.log('Connected!');
});
connection.end();
