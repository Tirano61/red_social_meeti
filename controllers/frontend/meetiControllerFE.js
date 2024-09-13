const moment = require("moment")
const Grupos = require("../../models/Grupos")
const Meeti = require("../../models/Meeti")
const Usuarios = require("../../models/Usuarios")
const { Sequelize } = require("sequelize")
const Categorias = require("../../models/Categorias")
const Comentarios = require("../../models/Comentarios")
const Op = Sequelize.Op;



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
    //! Consultar por meetis cercanos
    const ubicacion = Sequelize.literal(
        `ST_GeomFromText( 'POINT( ${meeti.ubucacion.coordinates[0]} ${meeti.ubucacion.coordinates[1]})')`);

    //! ST_DISTANCE_Sphere = Retorna una linea en metros
    const distancia = Sequelize.fn('ST_Distance_Sphere', Sequelize.col('ubicacion'), ubicacion);

    //! Encontrar meetis cercanos, los ordena del mas cercao al lejano
    const cercanos = await Meeti.findAll({ 
        order: distancia, 
        where: Sequelize.where(distancia, { [Op.lte]: 2000 }),
        limit: 3,
        include: [
            { model: Grupos },
            { model: Usuarios, attributes: [ 'id', 'nombre', 'imagen' ] },
        ]
    });
    
    //! Consultar despues de verificar que existe el Meeti
    const comentarios = await Comentarios.findAll({
        where: { meetiId: meeti.id },
        include: [
            { 
                model: Usuarios,
                attributes:['id', 'nombre', 'imagen'],
            }
        ]   
    })

    res.render('mostrar-meeti',{
        nombrePagina: meeti.titulo,
        meeti,
        moment,
        comentarios,
        cercanos
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

exports.motrarCategoria = async (req, res, next) =>{
    const categoria = await Categorias.findOne({ 
        attributes: ['id'],
        where: { slug: req.params.categoria},
    });

    const meetis = await Meeti.findAll({
        order:[
            ['fecha', 'ASC']
        ],
        include: [
            { 
                model: Grupos, 
                where: { categoriaId: categoria.id }
            },
            {
                model: Usuarios,
            }
        ]
    });

    res.render('categoria', {
        nombrePagina: `Categoría : ${categoria.nombre}`,
        meetis,
        moment
    })
}