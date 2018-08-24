'use strict'

//modulo de mongoose 
var _mongoose = require('mongoose');
var _schema =  _mongoose.Schema;


//modelo user
var _animalSchema = _schema({//una instancia de schema
    name :String,
    description :String,
    year :String,
    image:String,
    user :{type: _schema.ObjectId, ref: 'User'}//con esto le indicamos que se guardará un id de otro documento /de que coleccion
    
})

//exportar el modelo

module.exports = _mongoose.model('Animal',_animalSchema); // la "coleccion" de mongodb