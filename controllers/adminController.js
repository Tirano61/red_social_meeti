
const moment = require('moment/moment');
const Grupos = require('../models/Grupos');
const Meeti = require('../models/Meeti');
const { Sequelize } = require('sequelize');
const Op =Sequelize.Op;

exports.panelAdministracion = async (req, res)=>{
    console.log();

    const peticiones = []

    peticiones.push(Grupos.findAll({where: {usuarioId: req.user.id}}));
    peticiones.push(Meeti.findAll({where: {
        usuarioId: req.user.id,
        fecha : { [Op.gte ] : moment(new Date()).format("YYYY-MM-DD") }
    },
        order: [['fecha', 'ASC']]
    }));

    peticiones.push(Meeti.findAll({where: {
        usuarioId: req.user.id,
        fecha : { [Op.lt ] : moment(new Date()).format("YYYY-MM-DD") }
    }}));

    const [ grupos, meetis, anteriores ] = await Promise.all(peticiones);
    

    res.render('administracion', {
        nombrePagina: 'Panel de Administracion',
        grupos,
        meetis,
        moment,
        anteriores
    })
}

