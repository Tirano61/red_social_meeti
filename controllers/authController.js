const passport = require('passport');


exports.autentificarUsuario = passport.authenticate('local', {
    successRedirect : '/administracion',
    failureRedirect : '/iniciar-sesion',
    failureFlash : true,
    badRequestMessage : 'Ambos campos son obligatorios'
});

//! Revisa si el usuario esta autenticado
exports.usuarioAutenticado = (req, res, next) => {
    //! Si está autenticado 
    if(req.isAuthenticated()){
        return next();
    }
    //! Si No
    return res.redirect('/iniciar-sesion');
}