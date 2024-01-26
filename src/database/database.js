import mysql from "promise-mysql";
import config from "./../config";

const parameters = {
    host: config.host,
    database: config.database,
    user: config.user,
    password: config.password,
    port: config.port,
    connectTimeout: 100000
}
console.log("🚀 ~ file: database.js ~ line 11 ~ parameters", parameters)
const connection = mysql.createPool(parameters);

const getConnection = () => {
    return connection;
};

module.exports = {
    getConnection
};
