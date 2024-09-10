const { body, validationResult } = require("express-validator");
const Usuarios = require("../models/Usuarios");
const  enviarEmail = require('../handlers/emails');
const email = require("../config/email");
const flash = require("connect-flash/lib/flash");





exports.crearCuenta = (req, res) =>{
    res.render('crear-cuenta',{
        nombrePagina: 'crea tu cuenta'
    });
};

exports.crearNuevaCuenta = async(req, res)=> {
    const user = req.body;
    const rules = [
        body('confirmar').notEmpty().withMessage('Se debe repetir el password'),
        body('confirmar').equals(req.body.password).withMessage('El password es diferente'),
    ]

    await Promise.all(rules.map(validation => validation.run(req)));
    const erroresExpress = validationResult(req);
   
    try {
        const usuario = await Usuarios.create(user);

        //! url de confirmacion
        const url = `http://${req.headers.host}/confirmar-cuenta/${usuario.email}`;

        //! enviar email de confirmación
        await enviarEmail.enviarEmail({
            usuario,
            url,
            subject: 'Confirma tu cuenta de Meeti',
            archivo: 'confirmar-cuenta'
        });

        //! Flash message y redireccionar
        req.flash('exito', 'Emos enviado un email, confirma tu cuenta');

        res.redirect('/iniciar-sesion');

    } catch (error) {
        console.log(error);
        //! Extraer el message de los errores
        const erroresSequelize = error.errors.map((err) =>  err.message );
        //! extraer unicamente el msg de los errores
        const errExp = erroresExpress.array().map((err) => err.msg);
        //! Unirlos en un solo arreglo
        const listaErrores = [...erroresSequelize, ...errExp];

        req.flash('error', listaErrores);
        res.redirect('/crear-cuenta');
    }
}

//! formulario para iniciar sesion
exports.formIniciarSesion = async (req, res) =>{
    res.render('iniciar-sesion', {
        nombrePagina: 'Iniciar Sesión',
    })
}

//! Confirma la subscribcion del usuario
exports.confirmarCuenta = async(req, res, next) =>{
    //! Verificar que le usuario existe
    const usuario = await Usuarios.findOne({ where: { email: req.params.correo }});
    console.log(req.params.correo);
    if(!usuario){
        req.flash('error', 'No existe esa cuenta' );
        res.redirect('/crear-cuenta');
        return next();
    }

    //! Si existe confirmar suscripcion y redireccionar
    usuario.activo = 1;
    await usuario.save();
    req.flash('exito', 'La cuenta se a confirmado ya puedes iniciar sesion' );
    res.redirect('/iniciar-sesion');
}


exports.formEditarPerfil = async (req, res) =>{
    const usuario = await Usuarios.findByPk(req.user.id);

    res.render('editar-perfil',{
        nombrePagina: 'Editar Perfil',
        usuario
    })
}
//! Almacena en la base de datos 
exports.editarPerfil = async(req, res) =>{
    const usuario = await Usuarios.findByPk(req.user.id);
    
    const rules = [
        body('nombre').notEmpty().withMessage('Se debe repetir el password'),
        body('descripcion').notEmpty().withMessage('No puede quedar la descripción vacia'),
        body('email').notEmpty().withMessage('El email no puede estar vacio'),
    ]

    await Promise.all(rules.map(validation => validation.run(req)));
    const erroresExpress = validationResult(req); 
    try {
        const { nombre, descripcion, email } = req.body;
        
        usuario.nombre = nombre;
        usuario.descripcion = descripcion;
        usuario.email = email;

        await usuario.save();

        req.flash('exito', 'Cambios guardados correctamente' );
        res.redirect('/administracion');

    } catch (error) {
        //! Extraer el message de los errores
        const erroresSequelize = error.errors.map((err) =>  err.message );
        //! extraer unicamente el msg de los errores
        const errExp = erroresExpress.array().map((err) => err.msg);
        //! Unirlos en un solo arreglo
        const listaErrores = [...erroresSequelize, ...errExp];
        req.flash('error', listaErrores );
        res.redirect('/editar-perfil')
    }
    
}
//! Muestra el formulario para modificar el password
exports.formCambiarPassword = async (req, res) =>{
    res.render('cambiar-password', {
        nombrePagina: 'Cambiar Password'
    })
}
//! Verifica si el password anterios es correcto y lo modifica
exports.cambiarPassword = async (req, res, next) =>{
    const usuario = await  Usuarios.findByPk(req.user.id);
    //! Verificar password
    if(!usuario.validarPassword( req.body.anterior )){
        req.flash('error', 'El password ingresado no es correcto');
        res.redirect('/administracion');
        return next();
    }

    //! Si el password es correcto hashear el nuevo
    const hash = usuario.hashPassword(req.body.password);
    //! Asignar el password hasheado
    usuario.password = hash;
    //! Guardar en la base de datos
    await usuario.save();

    req.logout(req.user, err =>{
        if(err) return next();
    });
    req.flash('exito', 'Password modificado correctamente, vuelve a iniciar sesión');
    res.redirect('/iniciar-sesion')
}