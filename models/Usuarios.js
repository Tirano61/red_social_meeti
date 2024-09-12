const Sequelize = require("sequelize");
const db= require("../config/dbConfig");
const bcrypt = require('bcrypt-nodejs');



const Usuarios = db.define('usuarios', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: Sequelize.STRING(60),
    imagen: Sequelize.STRING(60),
    descripcion:{
        type: Sequelize.TEXT,
    },
    email: {
        type: Sequelize.STRING(30),
        allowNull: false,
        validate: {
            isEmail: { msg: 'Agrega un correo válido'}
        },
        unique: {
            args : true,
            msg: 'El usuario ya está registrado'
        },
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty:{
                msg: 'El password no puede estar vacio'
            }
        }
    },
    activo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }, 
    tokenPassword: Sequelize.STRING,
    expiraToken: Sequelize.DATE
}, {
    hooks: {
        beforeCreate(usuario) {
            usuario.password = Usuarios.prototype.hashPassword(usuario.password);
        }
    }
});

//! Metodo para comparar los passwords
Usuarios.prototype.validarPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

Usuarios.prototype.hashPassword = function(password){
    return bcrypt.hashSync( password, bcrypt.genSaltSync(10), null );
};

module.exports = Usuarios;




