
'use strict'
//routes animal

var _express = require('express');

var _animalController = require('../controllers/animal');

//cargamos el middleware de securidad token
var _md_auth = require('../middleware/authenticated');
//middleware para validar rol de add
var _md_role = require('../middleware/isAdmin');

var _api =_express.Router();

//multiparty para subir archivos 
var _multipart=require('connect-multiparty');
var _md_upload= _multipart({uploadDir:'./uploads/animals'})//carpeta actual ./



//ruta
_api.get('/pruebas_control_animal',[_md_auth.ensureAuth],_animalController.pruebas);
_api.post('/agregarAnimal',[_md_auth.ensureAuth,_md_role.isAdmin],_animalController.saveAnimal);//agrega animal
_api.get('/getanimals',_animalController.getAnimals);//obtiene todos los animales
_api.get('/getOneAnimal/:id',_animalController.getAnimal);//obtiene un solo animal
_api.put('/updateAnimal/:id',[_md_auth.ensureAuth,_md_role.isAdmin],_animalController.updateAnimal);//actualiza un animal
_api.post('/updloadAnimalImage/:id',[_md_auth.ensureAuth,_md_role.isAdmin,_md_upload],_animalController.uploadImagen);//usamos mas de un middleware
_api.get('/imageAnimal/:imageFile',_animalController.getImagenFile);//obtenemos la ruta de la imágen
_api.delete('/deleteAnimal/:id',[_md_auth.ensureAuth,_md_role.isAdmin,_md_upload],_animalController.deleteAnimal)//eliminar animal


//cargamos el middleware de securidad token
var _md_auth = require('../middleware/authenticated');


module.exports = _api;