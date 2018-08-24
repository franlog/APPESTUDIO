'use strict'
/**
 * un middleware se ejecutantes que todo . antes que una petición http
 */
var _jwt = require('jwt-simple');//el jwt token
var _moment = require('moment');//para fechas
var _secret = 'clave_secreta_para_el_token';
//con next pasa a la siguiente paso de la petición de http 
exports.ensureAuth = function (req, res, next) {
    //si nos llega la cabecera de la autenticación
    //si en la cabecera no llega un headers autoritacion
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'la petición no tiene la cabecera de autenticación' });
    }

    var _token = req.headers.authorization.replace(/['"]+/g, '');

    //decodificar el token 
    try {
        var _payLoad = _jwt.decode(_token, _secret);//comprobando si token es valido

        //si existe  y comprobamos si el token no está caducado
        if (_payLoad.sub && (_payLoad.exp <= _moment().unix())) {
            return res.status(401).send({//es para 401 no autorización de acceso
                message: 'el token está caducado'
            });
        }3
    } catch (ex) {
        return res.status(404).send({
            message: 'el token no es valido'
        });
    }

    //con esto puedo acceder desde todos los controladores a la autenticación del usuario
    //esto se envia para poder ser usado en difierentes partes , tiene los datos del usuario 
    //
    req.usexx = _payLoad; //se entrega la petición 
    //pasa al siguiente metodo
    next();
    //**>>esto es usado en rutas.js  */
}