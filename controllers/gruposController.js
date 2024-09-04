
const Categorias = require('../models/Categorias');
const Grupos = require('../models/Grupos');
const { body, validationResult } = require('express-validator')
const multer = require('multer');
const shortid = require('shortid');


const configMulter = {
    limits: {fileSize : 100000},
    storage: fileStorage = multer.diskStorage({
        destination: (req, res, next) =>{
            next(null, __dirname+'/../public/uploads/grupos/');
        },
        filename: (req, file, next) =>{
            const extencion = file.mimetype.split('/')[1];
            next(null, `${shortid.generate()}.${extencion}`);
        }
    }),
    fileFilter (req, file, next) {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
            //! El formato es válido
            next(null, true);
        }else{
            //! El formato no es válido
            next(new Error('Formato no válido'), false);
        }
    }

}

const uploads = multer(configMulter).single('imagen');

//! Sube una imagen en el servidor
exports.subirImagen = async (req, res, next) =>{
    uploads(req, res, function(error){
        if(error){
            if(error instanceof multer.MulterError){
                if(error.code === 'LIMIT_FILE_SIZE'){
                    req.flash('error',  'El archivo es muy grande')
                }else{
                    req.flash('error',  error.message);
                }
            }else if(error.hasOwnProperty('message')){
                req.flash('error', error.message);
            }
            res.redirect('back');
            return;
        }else{
            next();
        }
            
    });
}

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

    //! Leer la imagen
    if (req.file) {
        grupo.imagen = req.file.filename;
    }

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

exports.formEditarGrupo = async(req,res) =>{
 
    const consultas = [];
    consultas.push( Grupos.findByPk(req.params.grupoId));
    consultas.push(Categorias.findAll());

    const [ grupo, categorias ] = await Promise.all(consultas);

    res.render('editar-grupo', {
        nombrePagina: `Editar Grupo - ${ grupo.nombre}`,
        grupo,
        categorias
    });
}

//! Guardar los cambios en la base de datos
exports.editarGrupo = async (req, res, next) =>{
    const grupo = await Grupos.findOne({ where: {id: req.params.grupoId, usuarioId: req.user.id }});

    //! Si no existe ese grupo o no es el dueño
    if (!grupo) {
        req.flash('error', 'Operación no válida');
        res.redirect('/administracion');
        return next();
    }

    //! Todo bien, leer los valores
    const { nombre, descripcion,categoriaId, url } = req.body;

    //! Asignar los valores
    grupo.nombre = nombre;
    grupo.descripcion = descripcion;
    grupo.categoriaId = categoriaId;
    grupo.url = url;

    //! Guardar en la base de datos
    await grupo.save();

    req.flash('exito', 'Cambios almacenados correctamente');
    res.redirect('/administracion');
}

//! Muestra el formulario para editar una imagen de grupo
exports.formEditarImagen = async (req, res) =>{
    const grupo = await Grupos.findOne({ where: {id: req.params.grupoId, usuarioId: req.user.id }});
    
    res.render('imagen-grupo', {
        nombrePagina: `Editar Imagen de Grupo - ${grupo.nombre}`,
        grupo
    })
}

//! Modifica la imagen en la base de datos y elimina la anterior

exports.editarImagen = async (req, res, next) => {
    const grupo = await Grupos.findOne({ where: {id: req.params.grupoId, usuarioId: req.user.id }});

    if(!grupo){
        req.flash('error', 'Operación no válidda');
        res.redirect('/iniciar-sesion');
        return next();
    } 

    //! Verificar que el archivo sea nuevo
    if(req.file){
        console.log(req.file.filename);
    }
    //! Revisar si exiiste un archivo anterior
    if(grupo.imagen){
        console.log(grupo.imagen);
    }

}