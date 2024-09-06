const flash = require("connect-flash/lib/flash");
const Grupos = require("../models/Grupos");
const Meeti = require("../models/Meeti");
const { body, validationResult } = require('express-validator');




exports.formNuevoMeeti = async(req,res) =>{
    const grupos = await Grupos.findAll({where: {usuarioId: req.user.id}});

    res.render('nuevo-meeti',{
        nombrePagina: 'Crear Nuevo Meeti',
        grupos
    });
}

//! Inserta nuevos meetis en la base de datos
exports.crearMeeti = async(req,res) =>{
    const meeti = req.body;

    //! asignar el usuario
    meeti.usuarioId = req.user.id;

    //! Almacena la ubicacion con un point
    const point = {type: 'Point', coordinates: [parseFloat(req.body.lat), parseFloat(req.body.lng)]};
    meeti.ubicacion = point;

    //! cupo opcional
    if(req.body.cupo === ''){
        meeti.cupo = 0;
    }

    //! Almacenar en la base de datos
    try {
        await Meeti.create(meeti);
        req.flash('exito', 'Se aha creado el Meeti correctamente');
        res.redirect('/administracion');
    } catch (error) {
        const errores = error.errors.map(err=> err.message);

        req.flash('error', errores);
        res.redirect('/nuevo-meeti')
    }

}

exports.sanitizarMeeti = async (req,res,next)=>{
    const rules = [
        body('titulo').notEmpty(),
        body('invitado').notEmpty(),
        body('cupo').notEmpty(),
        body('hora').notEmpty(),
        body('ciudad').notEmpty(),
        body('direccion').notEmpty(),
        body('ciudad').notEmpty(),
        body('estado').notEmpty(),
        body('pais').notEmpty(),
        body('lat').notEmpty(),
        body('lng').notEmpty(),
        body('grupoId').notEmpty()
    ]
    await Promise.all(rules.map(validation => validation.run(req)));
    const erroresExpress = validationResult(req);
    


    next();

}