const mysql = require('mysql');

// Създаваме MySQL connection pool за възможност за множество връзки
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '4H7SdzqNEdms4NS',
    database: 'users'
});

// Проверка дали успешно сме се свързали с базата данни
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database');
    connection.release(); 
});

module.exports = pool;