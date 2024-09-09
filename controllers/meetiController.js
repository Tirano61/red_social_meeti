const flash = require("connect-flash/lib/flash");
const Grupos = require("../models/Grupos");
const Meeti = require("../models/Meeti");
const { body, validationResult } = require('express-validator');
const { parse } = require("dotenv");




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

//! Muestra un formulario para edityar el meeti
exports.formEditarMeeti = async(req, res) =>{
    const consultas = [];
    consultas.push( Grupos.findAll( {where:{ usuarioId: req.user.id }}));
    consultas.push( Meeti.findByPk( req.params.id ));

    const [ grupos, meeti ] = await Promise.all(consultas);

    
    if( !grupos || !meeti ){
        req.flash('error', 'Operación no valida');
        res.redirect('/administracion');
        return next();
    }

    //! Mostramos la vista
    res.render('editar-meeti',{
        nombrePagina: `Editar Meeti - ${meeti.titulo}`,
        grupos,
        meeti
    })
}

//! Almacena los cambios en el Meeti
exports.editarMeeti = async (req,res, next) =>{
    const meeti = await Meeti.findOne({where:{id: req.params.id, usuarioId: req.user.id}});

    if(!meeti){
        req.flash('error', 'Operación no valida');
        res.redirect('/administracion');
        return next();
    }
    //console.log(meeti);
    //! asignar los valores
    const {grupoId, titulo, invitado, fecha,hora,cupo, 
    descripcion, direccion, ciudad, estado, pais, lat, lng} = req.body;

    meeti.grupoId   = grupoId; 
    meeti.titulo    = titulo;
    meeti.invitado  = invitado;
    meeti.fecha     = fecha;
    meeti.hora      = hora;
    meeti.cupo      = cupo;
    meeti.descripcion = descripcion;
    meeti.direccion = direccion;
    meeti.ciudad    = ciudad;
    meeti.estado    = estado;
    meeti.pais      = pais;
    //! Asignar el point
    const point = {type: 'Point', coordinates:[ parseFloat(lat), parseFloat(lng)]};
    meeti.ubicacion = point;
    try {
        //! almacenar
        await meeti.save();

        req.flash('exito', 'Cambios guardados correctamente' );
        res.redirect('/administracion');
    } catch (error) {
        console.log(error);
    }    
    

}

//! Muestra el formulario para eliminar Meeti
exports.formEliminarMeeti = async(req, res, next) =>{
    const meeti = await Meeti.findOne({where: {
        id: req.params.id, usuarioId: req.user.id
    }});

    if(!meeti){
        req.flash('error', 'Operación no valida');
        res.redirect('/administracion');
        return next();
    }

    //! Mostrar la vista
    res.render('eliminar-meeti', {
        nombrePagina: `Eliminar Meeti - ${meeti.titulo}`,
    });
}

//! Elimia el meeti 
exports.eliminarMeeti = async(req,res) =>{
    await Meeti.destroy({
        where:{
            id: req.params.id
        }
    });

    req.flash('exito', 'Meeti eliminado');
    res.redirect('/administracion');
}