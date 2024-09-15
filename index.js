const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
require('dotenv').config({path: '.env'});
const passport = require('./config/passport');

const router = require('./routes');

console.log(`Esto es lo que obtuvo :  ${process.env.DBHOST}`);
//! Conexión a postgresql
const db = require('./config/dbConfig');
require('./models/Usuarios');
require('./models/Categorias');
require('./models/Grupos');
require('./models/Meeti');
require('./models/Comentarios');

db.sync().then(() =>{
    console.log('DB COnectada !!!') ;
}).catch( (error) => console.log(error));

//! Variables de entorno

//! Aplicacion principal
const app = express();

//! Body parcer, leer formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//! Habilitar Ejs como template engine
app.use(expressLayouts);
app.set('view engine', 'ejs');

//! Definir la ubicación de las vistas
app.set('views', path.join(__dirname, './views')); 

//! Archivos estaticos
app.use(express.static('public'));

//! Habilitar cookie parser
app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false
}));

//! Inicializar passport
app.use(passport.initialize());
app.use(passport.session());

//! Agrega flash messages
app.use(flash());

//! Middleware (usuario, logueado, flash message, fecha actual)
app.use((req, res, next) =>{
    res.locals.usuario = {...req.user} || null;
    res.locals.mensajes = req.flash();
    
    const fecha = new Date();
    res.locals.year = fecha.getFullYear();
    next();    
})

//! Routing
app.use('/', router());

//! Leer el host y el puerto
//const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 5000;



//! Agrega el puerto
app.listen(port, () =>{
    console.log('El servidor esta funcionando');
})
