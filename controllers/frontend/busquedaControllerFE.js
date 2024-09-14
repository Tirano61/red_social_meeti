const Sequelize = require("sequelize");
const Grupos = require("../../models/Grupos");
const Meeti = require("../../models/Meeti");
const Usuarios = require("../../models/Usuarios");
const moment = require("moment");
const Op = Sequelize.Op;



exports.resultadosBusqueda = async(req,res)=>{
    //! Leer datos de la Url
    const { categoria, titulo, ciudad, pais} = req.query;
   
    let meetis;
    //! Filtrar los meeti potr la busquedad
    if(!categoria){
        meetis = await Meeti.findAll({
            where: {
                titulo: {[Op.iLike] : '%' + titulo + '%' },
                ciudad: {[Op.iLike] : '%' + ciudad + '%' },
                pais:   {[Op.iLike] : '%' + pais + '%' },  
            },
            include: [
                {
                    model: Grupos,
                },
                {
                    model: Usuarios,
                    attributes: ['id', 'nombre', 'imagen']
                }
            ]
        });
    }else{
        meetis = await Meeti.findAll({
            where: {
                titulo: {[Op.iLike] : '%' + titulo + '%' },
                ciudad: {[Op.iLike] : '%' + ciudad + '%' },
                pais:   {[Op.iLike] : '%' + pais + '%' },  
            },
            include: [
                {
                    model: Grupos,
                    where: { categoriaId: {[Op.eq]: categoria}},
                },
                {
                    model: Usuarios,
                    attributes: ['id', 'nombre', 'imagen']
                }
            ]
        });
    }
 
    
    
    //! Pasar los resultados a la vista
    res.render('busqueda',{
        nombrePagina: 'Resultados Búsqueda',
        meetis,
        moment
    });
}