

const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../../middlewares/autenticacion');

let app = express();

let Categoria = require('../../models/categoria');

//=============================
//Mostrar todas las categorias
//=============================
app.get('/categoria', verificaToken , (req, res)=>{

    Categoria.find({})
            .sort('descripcion')
            .populate('usuario', 'nombre email')
            .exec((err,categorias)=>{
                if(err){
                    return res.status(400).json({
                        ok:false,
                        err 
                    });
                }
                Categoria.count({}, (err, conteo)=>{
                    res.json({
                        ok:true,
                        categorias,
                        cuantos: conteo
                    });
                 });
            });
});


//=============================
//Mostrar categoria por ID
//=============================
app.get('/categoria/:id', (req, res)=>{

    //Categoria.findById(...);
    //return categoria;
    let id = req.params.id;

    Categoria.findById({_id:id})
    .exec((err,categorias)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err 
            });
        }
        if(!categorias){
            return res.status(500).json({
                ok:false,
                err: {
                    message: 'El ID No es correcto'
                } 
            });
        }
        Categoria.count({}, (err, conteo)=>{
            res.json({
                ok:true,
                categorias,
                cuantos: conteo
            });
         });
    });
});

//=============================
//crear nueva categoriaa
//=============================
app.post('/categoria',verificaToken, (req, res)=>{
    //regresa la nueva categoria
    //req.usuario._id (este el id de la persona k esta haciendo la categoria)
    let body = req.body;

     let categoria = new Categoria({
         descripcion: body.descripcion,
         usuario: req.usuario._id,

     });

    categoria.save( (err, categoriaDB)=>{


        if(err){
            return res.status(500).json({
                ok:false,
                message: 'Error al crear la categoria en la BD',
                err 
            });
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                message: 'Error al crear la categoria',
                err 
            });
        }

        //forma basica para no mostrar el pasword en una respuesta.asi se muestra k si existe un campo llamado password en la BD
        //usuarioBD.password = null;

        res.json({
            ok:true,
            categoria:categoriaDB
        });
    });
});


//=============================
//Modificar las categorias. Solo la decripcion
//=============================
app.put('/categoria/:id',verificaToken, (req, res)=>{

    let id = req.params.id;
    let body = req.body;

    Categoria.findByIdAndUpdate(id, body,{new: true, runValidators: true} , (err, categoriaDB)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                err 
            });
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err 
            });
        }

        res.json({
           ok: true, 
           usuario: categoriaDB
        });
    });
});


//=============================
//BORRAR una categoria. 
//=============================
app.delete('/categoria/:id', [verificaToken,verificaAdmin_Role], (req, res)=>{
    //Solo la puede borrar un administrador,
    //se debe borrar de la base de datos
    //Categoria.findAndRemove

    let id = req.params.id;


    Categoria.findByIdAndDelete(id, (err, categoriaDB)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                err 
            });
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err : {
                    message: 'El id NO existe'
                }
            });
        }

        res.json({
           ok: true, 
           message: 'Categoria Borrada',
           usuario: categoriaDB
        });
    
    });    
});




module.exports = app;