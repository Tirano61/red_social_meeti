
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuarios = require('../models/Usuarios');



passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField:  'password'
    },
    async (email, password, next)=>{
        //! Este codigo se ejecuta al llenar el formulario
        const usuario = await Usuarios.findOne({ where: { email, activo: 1 }});
        //! Revisar si existe
        if(!usuario) return next(null, false, {
            message : 'Ese usuario no existe'
        });
        //! Si el usuario existe camparar los password
        const verificarPassword = usuario.validarPassword(password);
        //! Si el opassword es incorrecto
        if(!verificarPassword) return next(null, false, {
            message: 'Credenciales incorrectas'
        });
        //! Todo bien
        return next(null, usuario);

    }
))

passport.serializeUser(function(usuario, cb) {
    cb(null, usuario)
});

passport.deserializeUser(function(usuario, cb) {
    cb(null, usuario)
});

module.exports = passport;