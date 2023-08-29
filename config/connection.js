//Import MySQL2 package to connect MySQL database and perform queries
const mysql = require("mysql2")

//Call createConnection method to define connection to MySQL
const connection = mysql.createConnection({
    host: '127.0.0.1', //localhost
     // Your port; if not 3306
    port: 3306,
    //Your username
    user: 'root',
    //Your password
    password: 'server1234',
    database: 'employeesDB'
});

module.exports= connection;