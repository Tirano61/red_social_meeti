
const Categorias = require('../models/Categorias');
const Grupos = require('../models/Grupos');
const { body, validationResult } = require('express-validator')



exports.formNuevoGrupo = async(req, res) =>{

    const categorias = await Categorias.findAll();

    res.render('nuevo-grupo', {
        nombrePagina: 'Crea un nuevo grupo',
        categorias
    });
};

//! Almacena los grupos en la base de datos
exports.crearGrupo = async (req, res) => {
    //! sanitizar
    const rules = [
        body('nombre').notEmpty(),
        body('descripcion').notEmpty(),
    ]
    await Promise.all(rules.map(validation => validation.run(req)));
    const erroresExpress = validationResult(req);

    const grupo = req.body;
    grupo.usuarioId = req.user.id;

    try {
        //! Almacenar en base de datos
        await Grupos.create(grupo);
        req.flash('exito', 'Se ha creado el grupo correctamente' );
        res.redirect('/administracion');
    } catch (error) {
        console.log(error); 
        //! Extraer el message de los errores
        const erroresSequelize = error.errors.map((err) =>  err.message );

        req.flash('error', erroresSequelize);
        res.redirect('/nuevo-grupo');
    }
    
}