

const express = require('express');

const bcrypt = require('bcrypt');

const _ = require('underscore');


const Usuario = require('../../models/usuario');
const {verificaToken} = require('./../../middlewares/autenticacion');//llamando al middleware verifiaToken

const {verificaAdmin_Role} = require('./../../middlewares/autenticacion');//llamando al middleware verifiaToken


const app = express();



app.get('/usuario',[verificaToken] , (req, res)=>{

    // return res.json({
    //     usuario: req.usuario,
    //     nombre: req.usuario.nombre,
    //     email: req.usuario.email
    // });

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({estado: true}, 'nombre email role estado google img')
           .skip(desde)
           .limit(limite)
           .exec((err, usuarios)=>{

             if(err){
                return res.status(400).json({
                    ok:false,
                    err 
                });
             }

             Usuario.count({estado:true}, (err, conteo)=>{
                res.json({
                    ok:true,
                    usuarios,
                    cuantos: conteo
                });
             });


           });

    //res.json('GET Usuario LOCAL');
});

app.post('/usuario',[verificaToken, verificaAdmin_Role], (req, res)=>{

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password,10),
        role: body.role
    });

    usuario.save( (err, usuarioBD)=>{


        if(err){
            return res.status(400).json({
                ok:false,
                err 
            });
        }

        //forma basica para no mostrar el pasword en una respuesta.asi se muestra k si existe un campo llamado password en la BD
        //usuarioBD.password = null;

        res.json({
            ok:true,
            usuario:usuarioBD
        });
    });



    // if(body.nombre === undefined){
    //     res.status(400).json({
    //         ok: false,
    //         mensaje: 'El nombre es necesario'
    //     });
    // }else{
    //     res.json({
    //         persona: body
    //     });
    // }


});

app.put('/usuario/:id',[verificaToken, verificaAdmin_Role], (req, res)=>{

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre','email','img','role','estado']);

    Usuario.findByIdAndUpdate(id, body,{new: true, runValidators: true} , (err, usuarioBD)=>{

        if(err){
            return res.status(400).json({
                ok:false,
                err 
            });
        }

        res.json({
           ok: true, 
           usuario: usuarioBD
        });
    });

    // res.json({
    //     id
    // });
});

app.delete('/usuario/:id',[verificaToken, verificaAdmin_Role], (req, res)=>{

    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    }

    

    Usuario.findByIdAndUpdate(id, cambiaEstado,{new: true}, (err, usuarioBD)=>{

        if(err){
            return res.status(400).json({
                ok:false,
                err 
            });
        }

        res.json({
           ok: true, 
           usuario: usuarioBD
        });
    });

    //let id = req.params.id;
    //eliminando fisiamente
    // Usuario.findByIdAndRemove(id,(err, usuarioBorrado)=>{

    //     if(err){
    //         return res.status(400).json({
    //             ok:false,
    //             err 
    //         });
    //     }

    //     if(!usuarioBorrado){
    //         return res.status(400).json({
    //             ok:false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             } 
    //         });
    //     }

        // res.json({
        //     ok:true,
        //     usuario: usuarioBorrado
        // });
    //});
    

});


module.exports = app;