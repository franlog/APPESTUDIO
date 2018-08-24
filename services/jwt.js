'use strict'

var _jwt = require('jwt-simple');//para manipular los token
var _moment = require('moment');//permite trabajar con fechas , horas y más
var _secret ='clave_secreta_para_el_token';

exports.createToken = function (user) {//recibe el usuario que quiere legear
    //es una variable para manejar , generar y mas cosas sobre cifrado
    //generar mi token 
    //que esta´ra codificado
    var _payLoad = {
        //que es un a propiedad que identifica el id del usuario dentro de jwt
        sub: user._id,
        name :user.name,
        surname: user.surname,
        email:user.email,
        role:user.role,
        image:user.image,
        //fecha creación del token y expiración 
        iat: _moment().unix(),
        exp:_moment().add('30','days').unix//30 dias

    }

    return _jwt.encode(_payLoad,_secret,'HS512');
}