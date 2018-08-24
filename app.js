//configurar todo la aplicacion para el servidor

'use strict'

var _express = require('express');
var _bodyParser = require('body-parser');
var _path =require('path');

var _app = _express();//carga el framework de express directamente
//cargar rutas 
var _user_routes = require('./routes/user')
var _animal_routes = require('./routes/animal');


//middleware de body parser := es una funcion que se ejecuta primero que todo en un http
_app.use(_bodyParser.urlencoded({extended:false}));
//transformar lo que viene en el body a un jason
_app.use(_bodyParser.json());

//configuramos cabeceras y cors
//son necesarias para  que funciones las comunicaciones desde  origenes remotos 
_app.use(( req,res,next)=>{
                  
         res.header('Access-Control-Allow-Origin','*');// cualquiera pueda acceder a este origen 
         //
         res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY,Origin,X-Requested-With,Content-Type,Accept, Access-Control-Allow-Request-Method');
        //son los metodos http permitidos 
         res.header('Access-Control-Allow-Methods','GET,POST,OPTIONS,PUT,DELETE');
         res.header('Allow','GET,POST,OPTIONS,PUT,DELETE');
         next();
});



//rutas  base
//esto es para agregar un prefijo al api 
_app.use('/',_express.static('client',{redirect:false}));//carga un fichero estatico , y le indicamos que cargue la carpeta client y carga el index que tenga. en el json que no redireccione a nada
_app.use('/api',_user_routes);
_app.use('/api',_animal_routes);
 
 
//en cualquier ruta que nos venga por get 
//nos envie a el index de la carpeta client
_app.get('*',function(req,res,next){
    res.sendFile(_path.resolve('client/index.html'))
})

module.exports = _app;
