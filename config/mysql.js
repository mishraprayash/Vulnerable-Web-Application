const mysql = require('mysql2/promise');

let pool;

function getDBPool() {
    if (!pool) {
        pool = mysql.createPool({
            host: process.env.MYSQL_DB_HOST,
            user: process.env.MYSQL_DB_USER,
            password: process.env.MYSQL_DB_PASSWORD,
            database: process.env.MYSQL_DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            multipleStatements: true // Intentionally allowing multiple statements for demonstration
        });

        console.log('MySQL Pool Created');
    }
    return pool;
}

module.exports = { getDBPool };