
'use strict'



//cargar libreria bcrypt
var _bcrypt = require('bcrypt-nodejs');
//cargar modelos
var _User = require('../models/users');

//servicio JWT
var _jwt = require('../services/jwt');

//usamos  uso de ficheros del nucleo de node js
var _fs = require('fs');
var _path = require('path');



//acciones
function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando controlador de usuarios y laaccion pruebas',
        user: req.usexx//esta contraseña es recibida desde la autenticación por token  del meddleware
    });
}
//petición y respuesta
function saveUser(req, res) {
    //crear una variable user y creamos un objeto usuario
    //creo instancia de ese modelo
    var _user = new _User();
    //recoger el body de la petición
    var _params = req.body;

    //validamos si el parametro password llega 
    //se pueden ingresar muchas validaciones mail,nombre etc..
    if (_params.password && _params.name && _params.surname && _params.email) {//si es verdadero
        //asignamos valores al usuario
        _user.name = _params.name;
        _user.surname = _params.surname;
        _user.email = _params.email;
        _user.role = 'ROLE_USER';
        _user.image = null;


        //ciframos la contraseña
        _bcrypt.hash(_params.password, null, null, function (err, hash) {
            _user.password = hash;//entregamos la contraseña cifrada 
        });



        //buscamos si el email existe en la base de datos mongodb
        //busca en el modelo de user 
        //si en esa collection existe ese email 
        _User.findOne({ email: _user.email.toLowerCase() }, (err, x) => {
            if (err) {
                res.status(500).send({
                    message: 'error al comprobar usuario'
                });
            } else {
                if (!x) {//sino existe ,si se puede guardar
                    //guardado en la bd  
                    _user.save((err, userStored) => {//guardamos el usuario  en la bd 
                        if (err) {
                            res.status(500).send({
                                message: 'error al guardar usuario'
                            });
                        } else {
                            res.status(200).send({
                                message: 'usuario registrado',
                                _user: userStored
                            });
                        }
                    });
                } else {
                    //si existe , no se puede guardar
                    res.status(500).send({
                        message: 'usuario con ese mail ya existe'
                    })
                }
            }
        });





    } else {
        res.status(200).send({
            message: 'ingresa los datos correctamente '
        })
    }
    console.log(_params);


}

//creamos un login
//buscar si el usuario existe 
//y contraseña correcta 
//devolver los datos del usuario o regresar un token con jwt //enviarlo en cada una de las peticiones 
//asi se podrá logear 
function login(req, res) {
    var _params = req.body;//obtiene todos los datos que se obtinen por post



    var _email = _params.email;
    var _password = _params.password;
   
    if (_email && _password) {
        //validamos datos con la bd
        _User.findOne({ email: _email.toLowerCase() }, (err, userBD) => { //el callbac retorna err:desde la bd  y el objeto de la collecion si lo encuentra
            if (err) {
                res.status(500).send({ message: 'error al comprobar email' });
            } else {
                if (userBD) {//si existe el usuario(si el find retorna una collecion en ese schema )

                    //validamos contraseña 
                    _bcrypt.compare(_password, userBD.password, (err, check) => {//(password ingresado,password en la bd,(err,si es correcta o no))
                        if (check) {
                            //comporbar y generar token
                            if (_params.gettoken) {//si oken existe
                                //devolver el token
                                res.status(200).send({
                                    token: _jwt.createToken(userBD)
                                })
                            } else {
                                var _x=userBD;
                                _x.password='';
                                console.log(_x);
                                res.status(200).send({
                                    _x 
                                });
                            }

                        } else {
                            res.status(404).send({
                                message: 'password ingresado incorrecto'
                            });
                        }
                    });

                } else {
                    res.status(500).send({
                        message: 'El correo ingresado no existe '
                    });
                }
            }
        });

    } else {
        res.status(500).send({
            message: 'ingresa mail y password para ingresar'
        });
    }



}

/**
 * para metodos  de ingreso y manejo de roles  se utilizan token de validacion en la cabecera de la petición http 
 * por ende cada vez que es llamado el metodo por una ruta se entrega el key de autorización para poder usar el método.
 * esto lo escribo para recordar que cosas hacen los métodos y donde son implementados.
 * 
 * para probar este metodo en postman , hay que entregar en el body la informacion que se actualizará 
 * @param {*} req 
 * @param {*} res 
 */
function updateUser(req, res) {
    var _userId = req.params.id;//parametros que llegan desde una url de forma directa 
    var _update = req.body;//los datos a actualizar
    delete _update.password;//bora la prpiedad password3
    console.log(req.usexx.sub);

    if (_userId != req.usexx.sub) {
        return res.status(500).send({ message: 'no tienes permiso para actualizar el usuario' });
    }

    //ahora utilizamos el modelo, que actualiza
    _User.findByIdAndUpdate(_userId, _update, { new: true/*devuelve el nuevo documento actualizado*/ }, (err, userUpdated) => {
        if (err) {
            res.status(500).send({
                message: 'error al actualizar usuario'
            });
        } else {
            if (!userUpdated) {//si no tiene el usuario
                res.status(404).send({ message: 'no tienes permiso para actualizar el usuario' });
            } else {
                //sino ocurre error y retorna la colleción de ese usuario
                res.status(200).send({ user: userUpdated });
            }
        }
    })

}

function uploadImagen(req, res) {
    var _userId = req.params.id;
    var _file_name = 'no subido ..';//texto por defecto


    //comprobamos si recibimos archivo
    if (req.files) {//files existe gracias a connect-multiparty
        var _file_path = req.files.image.path;//tipo fichero que subimos , tipo de archivo obtine la ruta,nombre de la cabecera entregada por el postman
        var _file_split = _file_path.split('/');//para sacar unicamente el nombre del fichero
        var _file_name = _file_split[2];///toma la posición 3 del json devuelto
        var _ext_split = _file_name.split('\.');//quitar la extencion del archivo
        var _file_ext = _ext_split[1];//tomamos la extención del json

        if (_file_ext == 'jpg' || _file_ext == 'png'||_file_ext == 'PNG' || _file_ext == 'jpeg' || _file_ext == 'gif') {
            //verificamos que el usuario iniciado sea igual al token
            if (_userId != req.usexx.sub) {
                return res.status(500).send({ message: 'no tienes permiso para actualizar el usuario' });
            }

            //ahora utilizamos el modelo, que actualiza el "campo image" del documento usuario
            _User.findByIdAndUpdate(_userId, { image: _file_name }, { new: true/*devuelve el nuevo documento actualizado*/ }, (err, userUpdated) => {
                if (err) {
                    res.status(500).send({
                        message: 'error al actualizar usuario'
                    });
                } else {
                    if (!userUpdated) {//si no tiene el usuario
                        res.status(404).send({ message: 'no tienes permiso para actualizar el usuario' });
                    } else {
                        //sino ocurre error y retorna la colleción de ese usuario
                        res.status(200).send({ user: userUpdated, image: _file_name });
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
                        message: 'se ha eliminado la imagen subida'
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
    var _path_file = './uploads/users/' + _imageFile;//donde está guargado el fichero en el servidor

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

function getKeepers(req, res) {
    //llamamos al modelo  //exec para ejecutar  el callback y el find
    _User.find({ role: 'ROLE_ADMIN' }).exec((err, userx) => {
        if (err) {
            res.status(500).send({
                message: 'error en la petición'
            })
        } else {
            if (!userx) {
                res.status(404).send({
                    message: 'no hay cuidadores '
                })
            } else {
                res.status(200).send({
                    userx
                })
            }
        }
    })

}
function getAllKeepers(req, res) {
    //llamamos al modelo  //exec para ejecutar  el callback y el find
    _User.find({}).exec((err, userx) => {
        if (err) {
            res.status(500).send({
                message: 'error en la petición'
            })
        } else {
            if (!userx) {
                res.status(404).send({
                    message: 'no hay cuidadores '
                })
            } else {
                res.status(200).send({
                    userx
                })
            }
        }
    })

}


module.exports = {
    pruebas,
    saveUser,
    login,
    updateUser,
    uploadImagen,
    getImagenFile,
    getKeepers,
    getAllKeepers
}