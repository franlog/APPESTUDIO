'use strict'
//usa:
//controlador usuario

var _express = require('express');
//cargamos el controlador
var _userController = require('../controllers/user');

//usamos el router de express
var _api = _express.Router();

//cargamos el middleware de securidad token
var _md_auth = require('../middleware/authenticated');

//multiparty para subir archivos 
var _multipart=require('connect-multiparty');
var _md_upload= _multipart({uploadDir:'./uploads/users'})//carpeta actual ./


//creo una ruta personalizada 
_api.get('/pruebas-del-controlador',_md_auth.ensureAuth,_userController.pruebas);
_api.post('/register',_userController.saveUser);
_api.post('/login',_userController.login);
_api.put('/updateUser/:id',_md_auth.ensureAuth,_userController.updateUser);//recibe un id de usuario a modificar
_api.post('/uploadImagenUser/:id',[_md_auth.ensureAuth,_md_upload],_userController.uploadImagen);//usamos mas de un middleware
_api.get('/imageAvatar/:imageFile',_userController.getImagenFile);//obtenemos la ruta de la imágen
_api.get('/keepers',[_md_auth.ensureAuth],_userController.getKeepers);//obtenemos los cuidadadores con role admin
_api.get('/allKeepers',_userController.getAllKeepers);

//este fichero de configuración  se tiene que implementar en 
//el primcipal del proyecto  app.js
//_app.use('/api',_user_routes); en esa parte
module.exports = _api;
