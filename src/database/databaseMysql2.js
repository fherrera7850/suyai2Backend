import mysql from "mysql2";
import config from "./../config";

const parameters = {
    host: config.host,
    database: config.database,
    user: config.user,
    password: config.password,
    port: config.port,
    connectionLimit: 10,
    multipleStatements: true
}
console.log("🚀 ~ file: databaseMysql2.js:12 ~ parameters:", parameters)
const connection = mysql.createPool(parameters);

const getConnectionMysql2 = () => {
    return connection;
};

module.exports = {
    getConnectionMysql2
};
