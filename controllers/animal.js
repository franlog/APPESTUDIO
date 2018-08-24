'use strict'
//usa:
//controlador animal
var _express = require('express');
//cargamos el controlador
var _userController = require('../controllers/user');
//usamos el router de express
var _api = _express.Router();
//cargamos el middleware de securidad token
var _md_auth = require('../middleware/authenticated');
//cargamos modelos 
var _User = require('../models/users');
var _Animal = require('../models/animal');

//usamos  uso de ficheros del nucleo de node js
var _fs = require('fs');
var _path = require('path');

//funciones animal controlador

function pruebas(req, res) {
    res.status(200).send({
        message: 'prueba de metodo controlador animal',
        usuario: req.usexx
    });
}

function saveAnimal(req, res) {

    var _animal = new _Animal();
    var _params = req.body;



    //validamos datos 
    if (_params.name) {//si ingresar el name
        _animal.name = _params.name;
        _animal.description = _params.description;
        _animal.year = _params.year;
        _animal.image = null;
        _animal.user = req.usexx.sub;//datos recividos desde el middleware de autenticación
        console.log(_animal);
        //llamo el metodo save de mongoose
        _animal.save((err, animalStored) => {



            if (err) {
                res.status(500).send({
                    message: 'error al ingresar el animal'
                });
            } else {
                if (!animalStored) {
                    res.status(404).send({
                        message: 'no se a guardado el animal'
                    });
                } else {
                     
                    res.status(200).send({
                        animal: animalStored
                    });
                }
            }
        });
    } else {
        res.status(500).send({
            message: 'tiene que ingresar  nombre '
        });
    }

}


//listar todos los animales
function getAnimals(req, res) {
    //el path user es el "campo" del documento User de la Base de Dato mongo DB
    _Animal.find({}).populate({ path: 'user' }).exec((err, animals) => {
        if (err) {
            res.status(500).send({
                message: 'error en la petición'
            });
        } else {
            if (!animals) {
                res.status(404).send({
                    message: 'no se encontraron animales'
                });
            } else {
                res.status(200).send({
                    animals
                });
            }
        }
    })
}

function getAnimal(req, res) {

    var _animalId = req.params.id;
    //ORM MOONGOOSE
    //con el TATH USER permite regresar en el json los datos del usuario vinculado al animal
    _Animal.findById(_animalId).populate({ path: 'user' }).exec((err, animal) => {
        if (err) {
            res.status(500).send({
                message: 'error en la petición'
            });
        } else {
            if (!animal) {
                res.status(404).send({
                    message: 'no existe'
                });
            } else {
                res.status(200).send({
                    animal
                });
            }
        }
    })

}

//actualizar animal

function updateAnimal(req, res) {
    var _animalId = req.params.id;
    var _update = req.body;//los datos recibidos por el body en el PUT
    console.log(_update);

    _Animal.findByIdAndUpdate(_animalId, _update, { new: true }, (err, animalUpdated) => {
        if (err) {
            res.status(500).send({
                message: 'error al actualizar'
            });
        } else {
            if (!animalUpdated) {
                res.status(500).send({
                    message: 'no se actualizado el animal'
                });
            } else {
                res.status(200).send({
                    animal: animalUpdated
                });
            }
        }
    })
}


function uploadImagen(req, res) {
    var _animalId = req.params.id;
    var _file_name = 'no subido ..';//texto por defecto


    //comprobamos si recibimos archivo
    if (req.files) {//files existe gracias a connect-multiparty
        var _file_path = req.files.image.path;//tipo fichero que subimos , tipo de archivo obtine la ruta,nombre de la cabecera entregada por el postman
        var _file_split = _file_path.split('/');//para sacar unicamente el nombre del fichero
        var _file_name = _file_split[2];///toma la posición 3 del json devuelto
        var _ext_split = _file_name.split('\.');//quitar la extencion del archivo
        var _file_ext = _ext_split[1];//tomamos la extención del json

        if (_file_ext == 'jpg' || _file_ext == 'png' || _file_ext == 'jpeg') {

            //ahora utilizamos el modelo, que actualiza el "campo image" del documento usuario
            _Animal.findByIdAndUpdate(_animalId, { image: _file_name }, { new: true/*devuelve el nuevo documento actualizado*/ }, (err, animalUpdated) => {
                if (err) {
                    res.status(500).send({
                        message: 'error al actualizar usuario'
                    });
                } else {
                    if (!animalUpdated) {//si no tiene el usuario
                        res.status(404).send({ message: 'no tienes permiso para actualizar el usuario' });
                    } else {
                        //sino ocurre error y retorna la colleción de ese usuario
                        res.status(200).send({ user: animalUpdated, image: _file_name });
                    }
                }
            });

        } else {
            //como el fichero no es compatible hay que eliminarlo
            _fs.unlink(_file_path, (err) => {
                if (err) {
                    res.status(500).send({
                        message: 'surgido error y no ha podido eliminar el archivo'
                    });
                } else {
                    res.status(500).send({
                        message: 'archivo no permitido'
                    });
                }
            });

        }

    } else {
        res.status(500).send({
            message: 'no se han subido archivos'
        });
    }

}

function getImagenFile(req, res) {
    var _imageFile = req.params.imageFile;// guarda la imagen recibida por la url para buscar
    var _path_file = './uploads/animals/' + _imageFile;//donde está guargado el fichero en el servidor

    _fs.exists(_path_file, function (exists) {
        if (exists) {
            res.sendFile(_path.resolve(_path_file));//esto saca el fichero en si. regresa el archivo en la respuesta.
        } else {
            res.status(404).send({
                message: 'fichero no existe'
            })
        }
    })
}

//eliminar un animal
function deleteAnimal(req, res) {

    var _animalId = req.params.id;

    _Animal.findByIdAndRemove(_animalId, (err, animalRemove) => {
        if (err) {
            res.status(500).send({
                message: 'error en la petición'
            })
        } else {
            if (!animalRemove) {
                res.status(404).send({
                    message: 'no se realizó la eliminación'
                })
            } else {
                res.status(200).send({
                    animal: animalRemove
                })
            }
        }
    })

}
module.exports = {
    pruebas,
    saveAnimal,
    getAnimals,
    getAnimal,
    updateAnimal,
    uploadImagen,
    getImagenFile,
    deleteAnimal
}