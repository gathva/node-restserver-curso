

const express = require('express');

const {verificaToken} = require('../../middlewares/autenticacion');

let app = express();

let Producto = require('../../models/producto');



//=============================
//Obtener todos los productos
//=============================
app.get('/productos', verificaToken, (req,res)=>{
    //Traer todos los productos
    //Populate: usuario categoria
    //paginado


    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({disponible: true})
           .skip(desde)
           .limit(limite)
           .populate('usuario', 'nombre email')
           .populate('categoria', 'descripcion')
           .exec((err, producosDB)=>{

             if(err){
                return res.status(400).json({
                    ok:false,
                    err 
                });
             }

             Producto.count({}, (err, conteo)=>{
                res.json({
                    ok:true,
                    producosDB,
                    cuantos: conteo
                });
             });


           });
});

//=============================
//Obtener un Producto por ID
//=============================
app.get('/productos/:id', verificaToken, (req,res)=>{
    //Populate: usuario categoria
        //Categoria.findById(...);
    //return categoria;
    let id = req.params.id;

    Producto.findById({_id:id})
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err,productos)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err 
            });
        }
        if(!productos){
            return res.status(500).json({
                ok:false,
                err: {
                    message: 'El ID No es correcto'
                } 
            });
        }
        Producto.count({}, (err, conteo)=>{
            res.json({
                ok:true,
                productos,
                cuantos: conteo
            });
         });
    });
});
//=============================
//Buscar Producto
//=============================
app.get('/productos/busqueda/:termino', verificaToken, (req, res)=>{

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({nombre: regex})
            .populate('categoria', 'nombre')
            .exec((err,productos)=>{

                if(err){
                    return res.status(400).json({
                        ok:false,
                        err 
                    });
                }

                res.json({
                    ok:true,
                    productos
                });

            });


});




//=============================
//Crear un nuevo Producto
//=============================
app.post('/productos', verificaToken, (req,res)=>{
    //grabar el usuario
    //graba una categoria del listado

    let body = req.body;

     let producto = new Producto({
         nombre: body.nombre,
         precioUni: body.precio,
         descripcion: body.descripcion,
         disponible: body.disponible,
         categoria: body.categoria,
         usuario: req.usuario._id,

     });

    producto.save( (err, productoDB)=>{


        if(err){
            return res.status(500).json({
                ok:false,
                message: 'Error al crear el producto en la BD',
                err 
            });
        }
        if(!productoDB){
            return res.status(400).json({
                ok:false,
                message: 'Error al crear el Producto',
                err 
            });
        }

        res.json({
            ok:true,
            producto:productoDB
        });
    });
});

//=============================
//Actualizar un Producto
//=============================
app.put('/productos/:id', verificaToken, (req,res)=>{
    //grabar el usuario
    //graba una categoria del listado
    let id = req.params.id;
    let body = req.body;

    Producto.findByIdAndUpdate(id, body,{new: true, runValidators: true} , (err, producosDB)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                err 
            });
        }
        if(!producosDB){
            return res.status(400).json({
                ok:false,
                err 
            });
        }

        res.json({
           ok: true, 
           usuario: producosDB
        });
    });
});

//=============================
//Borrar un Producto
//=============================
app.delete('/productos/:id', verificaToken, (req,res)=>{
    //grabar el usuario
    //graba una categoria del listado
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, {disponible: false},{new: true, runValidators: true} , (err, producosDB)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                err 
            });
        }
        if(!producosDB){
            return res.status(400).json({
                ok:false,
                err 
            });
        }

        res.json({
           ok: true, 
           message: 'Producto eliminado DISPONIBLE = FALSE',
           producosDB
        });
    });
});


module.exports = app;