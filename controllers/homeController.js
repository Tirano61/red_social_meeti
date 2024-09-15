const moment = require("moment/moment");
const Categorias = require("../models/Categorias");
const Meeti = require("../models/Meeti");
const { Sequelize } = require("sequelize");
const Grupos = require("../models/Grupos");
const Usuarios = require("../models/Usuarios");
const Op = Sequelize.Op;

exports.home = async (req, res) =>{
    const consultas = [];
    
    consultas.push(Categorias.findAll());
    consultas.push( Meeti.findAll({ 
        attributes: ['slug', 'fecha', 'hora', 'titulo'],
        where:{ fecha:{ [Op.gte] : moment(new Date()).format('YYYY-MM-DD') } },
        order:[['fecha', 'ASC']], 
        limit: 3,
        include: [ 
            { model: Grupos, attributes: ['imagen'] }, 
            { model: Usuarios, attributes: ['nombre','imagen'] } 
        ] 
    }));

    const [ categorias, meeti ] = await Promise.all(consultas);

    res.render('home', {
        nombrePagina: 'Inicio',
        categorias,
        meetis : meeti,
        moment
    });
}