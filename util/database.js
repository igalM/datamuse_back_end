const mysql = require('mysql2');

const con = mysql.createConnection({
    multipleStatements: true,
    host: 'localhost',
    user: 'root',
    password: 'admin',
});

con.connect(err => {
    if (err) throw err;
    console.log("Connected!");
});

con.query("CREATE DATABASE IF NOT EXISTS words", (err, result) => {
    if (err) throw err;
});

const sql = `CREATE TABLE IF NOT EXISTS words.affiliate (word VARCHAR(255));
CREATE TABLE IF NOT EXISTS words.marketing (word VARCHAR(255));
CREATE TABLE IF NOT EXISTS words.influencer (word VARCHAR(255))`

con.query(sql, (err, result) => {
    if (err) throw err;
});

module.exports = con.promise();