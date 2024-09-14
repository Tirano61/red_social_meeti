const { Sequelize } = require("sequelize");


module.exports = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: 5432,
    dialect: "postgres",
    pool:{
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    //! para que no este escribiendo todo lo que hace en consola asi se deshabilita
    logging: false
});