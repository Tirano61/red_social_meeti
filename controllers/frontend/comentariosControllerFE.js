const Comentarios = require('../../models/Comentarios');
const Meeti = require('../../models/Meeti');



exports.agregarComentario = async(req, res, next) =>{
    //! Obtener el comentario
    const { comentario } = req.body;
    //! Crear comentario en la base de datos
    await Comentarios.create({
        mensaje: comentario,
        usuarioId: req.user.id,
        meetiId: req.params.id
    });

    //! Redireccionar
    res.redirect('back');
    next();
}

exports.eliminarComentario = async(req, res, next)=>{
    //! Tomar el id del comentario
    const { comentarioId } = req.body;
    
    //! Consultar el comentario
    const comentario = await Comentarios.findOne({where: { id: comentarioId }});

    
    //! Verificar si existe el comentario
    if(!comentario){
        res.status(404).send('Acción no válida...')
        return next();
    }
    //! Consultar el Meeti del comentario
    const meeti = await Meeti.findOne({ where: { id: comentario.meetiId }});

    //! verificar que el que borra es el creador
    if( comentario.usuarioId === req.user.id || meeti.usuarioId === req.user.id ){
        await Comentarios.destroy({
            where: { id: comentario.id },
        });
        res.status(200).send('Eliminado correctamente!!!');
        return next();
    }else{

        res.status(403).send('Acción no válida...')
        return next();
    }
}