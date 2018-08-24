//punto de inicio de la aplicación 


'use strict'//esto permite que pueda usar estandar nuevos de javascript ecma6

//creamos variable para moongoso,para trabajar la base de datos
var _mongoose = require('mongoose');
var _app =require('./app');//el modulo app.js
var _port =process.env.PORT || 3789;//el puerto

_mongoose.Promise = global.Promise;
//nos conectamos a la base de datos
//recibe dos parametros , erro y la respuesta
_mongoose.connect('mongodb://localhost:27017/zoo', { useNewUrlParser: true })
    .then(() => {//promesa then
        console.log('conexion a la base de datos , realizado correctamente');
         //creamos el servidor
         _app.listen(_port,()=>{
              console.log('el servidor local con node y express está corriendo correctamente ...');
         })



    })
    .catch(err => console.log(err));//recibimos el parametro de error con un callbacks








