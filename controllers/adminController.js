
const Grupos = require('../models/Grupos');
const Meeti = require('../models/Meeti');

exports.panelAdministracion = async (req, res)=>{

    const peticiones = [

    ]
    peticiones.push(Grupos.findAll({where: {usuarioId: req.user.id}}));
    peticiones.push(Meeti.findAll({where: {usuarioId: req.user.id}}));

    const [ grupos, meetis ] = await Promise.all(peticiones);
    

    res.render('administracion', {
        nombrePagina: 'Panel de Administracion',
        grupos,
        meetis
    })
}

