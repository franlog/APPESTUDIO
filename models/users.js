'use strict'

//modulo de mongoose 
var _mongoose = require('mongoose');
var _schema =  _mongoose.Schema;

//modelo user
var _userSchema = _schema({//una instancia de schema
    name :String,
    surname :String,
    email :String,
    password :String,
    role : String,
    image:String
  

})

//exportar el modelo

module.exports = _mongoose.model('User',_userSchema); // la "coleccion" de mongodb