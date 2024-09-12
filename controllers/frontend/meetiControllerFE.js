const moment = require("moment")
const Grupos = require("../../models/Grupos")
const Meeti = require("../../models/Meeti")
const Usuarios = require("../../models/Usuarios")
const { Sequelize } = require("sequelize")



exports.mostrarMeeti = async (req, res)=>{
    const meeti = await Meeti.findOne({
        where:{ slug: req.params.slug },
        include: [
            { model: Grupos },
            { model: Usuarios, attributes: [ 'id', 'nombre', 'imagen' ] },
        ]
    });

    //! Si no existe 
    if(!meeti){
        res.redirect('/');
    }

    res.render('mostrar-meeti',{
        nombrePagina: meeti.titulo,
        meeti,
        moment
    })
}

exports.confirmarAsistencia = async (req,res) =>{
    const { accion } = req.body;
    if(accion === 'confirmar'){
        Meeti.update(
            {'interesados': Sequelize.fn('array_append', Sequelize.col('interesados'), req.user.id)},
            {where: { 'slug': req.params.slug }}
        );
        res.send('Has confirmado tu asistencia');
    }else{
        Meeti.update(
            {'interesados': Sequelize.fn('array_remove', Sequelize.col('interesados'), req.user.id)},
            {where: { 'slug': req.params.slug }}
        );
        res.send('Asistencia Cancelada');
    }
    
}

//! Muestra el listado de asistentes

exports.mostrarAsistentes = async(req, res) => {
    const meeti = await Meeti.findOne({
        where:{slug: req.params.slug},
        attributes: ['interesados']
    });

    //! Extraer interesados    
    const { interesados } = meeti;
    const asistentes =  await Usuarios.findAll({
        attributes: ['nombre', 'imagen'],
        where:{ id: interesados }
    });

    res.render('asistentes-meeti',{
        nombrePagina: 'Listado de Asistentes',
        asistentes
    })
}