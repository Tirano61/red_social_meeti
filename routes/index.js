

const express = require('express');

const homeController = require('../controllers/homeController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const gruposController = require('../controllers/gruposController');
const meetiController = require('../controllers/meetiController');

const router = express.Router();



module.exports = function(){
    router.get('/', homeController.home );

    //! Crear y confirmar cuenta
    router.get('/crear-cuenta', usuariosController.crearCuenta);
    router.post('/crear-cuenta', usuariosController.crearNuevaCuenta);
    router.get('/confirmar-cuenta/:correo', usuariosController.confirmarCuenta);

    //! Iniciar Sesion
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autentificarUsuario);

    //! Panel de administracion
    router.get('/administracion', 
        authController.usuarioAutenticado,
        adminController.panelAdministracion
    );

    //! Nuevos Grupos
    router.get('/nuevo-grupo',
        authController.usuarioAutenticado,
        gruposController.formNuevoGrupo
    );
    router.post('/nuevo-grupo', 
        authController.usuarioAutenticado,
        gruposController.subirImagen,
        gruposController.crearGrupo
    );
    //! Editar grupos
    router.get('/editar-grupo/:grupoId',
        authController.usuarioAutenticado,
        gruposController.formEditarGrupo
    );
    router.post('/editar-grupo/:grupoId',
        authController.usuarioAutenticado,
        gruposController.editarGrupo
    );
    //! Editar la imagen del grupo
    router.get('/imagen-grupo/:grupoId',
        authController.usuarioAutenticado,
        gruposController.formEditarImagen
    );
    router.post('/imagen-grupo/:grupoId',
        authController.usuarioAutenticado,
        gruposController.subirImagen,
        gruposController.editarImagen
    );  
    
    //! Eliminar grupo
    router.get('/eliminar-grupo/:grupoId', 
        authController.usuarioAutenticado,
        gruposController.formEliminarGrupo
    );
    router.post('/eliminar-grupo/:grupoId', 
        authController.usuarioAutenticado,
        gruposController.eliminarGrupo
    );

    //! Crear nuevo meeti
    router.get('/nuevo-meeti',
        authController.usuarioAutenticado,
        meetiController.formNuevoMeeti
    );
    router.post('/nuevo-meeti',
        authController.usuarioAutenticado,
        meetiController.sanitizarMeeti,
        meetiController.crearMeeti
    );

    //! Editar Meeti
    router.get('/editar-meeti/:id',
        authController.usuarioAutenticado,
        meetiController.formEditarMeeti
    );
    router.post('/editar-meeti/:id',
        authController.usuarioAutenticado,
        meetiController.editarMeeti
    );

    //! Eliminar Meeti
    router.get('/eliminar-meeti/:id',
        authController.usuarioAutenticado,
        meetiController.formEliminarMeeti
    );
    router.post('/eliminar-meeti/:id',
        authController.usuarioAutenticado,
        meetiController.eliminarMeeti
    );

    //! Editar la informacion de perfil
    router.get('/editar-perfil',
        authController.usuarioAutenticado,
        usuariosController.formEditarPerfil
    );
    router.post('/editar-perfil',
        authController.usuarioAutenticado,
        usuariosController.editarPerfil
    );

    //! Modifica el password
    router.get('/cambiar-password',
        authController.usuarioAutenticado,
        usuariosController.formCambiarPassword
    );
    router.post('/cambiar-password',
        authController.usuarioAutenticado,
        usuariosController.cambiarPassword
    );

    return router;
}
