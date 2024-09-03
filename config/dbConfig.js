const { Sequelize } = require("sequelize");


module.exports = new Sequelize('meeti', 'postgres', '180774', {
    host: '127.0.0.1',
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