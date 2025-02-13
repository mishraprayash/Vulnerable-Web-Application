const mysql = require('mysql2/promise');

let pool;

// use the proper value as per the datbase confis
function getDBPool() {
    if (!pool) {
        pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'Logging',
            waitForConnections: true,
            connectionLimit: 10, // Max connections
            queueLimit: 0,
            multipleStatements:true
        });

        console.log('MySQL Pool Created');
    }
    return pool;
}
module.exports = {getDBPool}