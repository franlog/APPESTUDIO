'use strict'

exports.isAdmin =function  (req,res,next){
   if(req.usexx.role != 'ROLE_ADMIN'){
       return res.status(200).send({
           message:'no tiene permiso para realizar ésta accion'
       });
   }

   next();
}