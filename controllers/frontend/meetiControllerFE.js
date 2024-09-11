const moment = require("moment")
const Grupos = require("../../models/Grupos")
const Meeti = require("../../models/Meeti")
const Usuarios = require("../../models/Usuarios")



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
    console.log('object');
}