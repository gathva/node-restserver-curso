const express = require('express');
const fileupload = require('express-fileupload');
const app = express();

const Usuario = require('../../models/usuario');
const Producto = require('../../models/producto');


const fs = require('fs');
const path = require('path');


//default options
app.use(fileupload( {useTempFiles: true} ));

app.put('/upload/:tipo/:id', (req, res)=>{

    let tipo = req.params.tipo;
    let id = req.params.id;

    if(!req.files){
        return res.status(400)
                  .json({
                      ok: false,
                      err: {
                          message: 'No se ha seleccionado ningun archivo'
                      }
                  });
    }

    //validar tipo 
    let tiposValidos = ['productos', 'usuarios'];

    if(tiposValidos.indexOf(tipo)<0){
        return res.status(400)
        .json({
            ok: false,
            err: {
                message: 'Los tipos validos son ' + tiposValidos.join(',')
            }
        });
    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    console.log(extension);

    

    //Extensiones validas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if(extensionesValidas.indexOf(extension) < 0 ){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' +  extensionesValidas.join(','),
                ext: extension
            }
        });
    }

    //cambiando el nombre del archivo(debe ser unico)
    let nombreArchivo = `${ id }-${new Date().getMilliseconds()}.${ extension }`;


    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                message: 'Error en el movimiento',
                err
            });
        }

        //desde aqui se cargan de forma correcta y validada las imagenes

        //se envia el validador si es un usuario
        if(tipo ==='usuarios'){
            imagenUsuario(id, res, nombreArchivo);
        }else{
            imagenProducto(id, res, nombreArchivo);
        }

        // res.json({
        //     ok: true,
        //     message: 'Imagen subida correctamente'
        // });
    });
});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB)=>{

        if(err){
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!usuarioDB){
            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok:false,
                err: {
                    message: 'El Usuario NO existe'
                }
            });
        }

        //  let pathImagen = path.resolve(__dirname, `../../../uploads/usuarios/${usuarioDB.img}`);

        //  console.log(pathImagen);
        //  if(fs.existsSync(pathImagen)){
        //      fs.unlinkSync(pathImagen);
        //  }

        borraArchivo(usuarioDB.img, 'usuarios');


        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err,usuarioGuardado)=>{

            res.json({
                ok:true,
                usuario: usuarioGuardado,
                img: nombreArchivo,
                
            });
        });


    });
}

function imagenProducto(id, res, nombreArchivo){

    Producto.findById(id, (err, productoDB)=>{
        if(err){
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!productoDB){
            borraArchivo(nombreArchivo, 'productos');

            return res.status(500).json({
                ok:false,
                err: {
                    message: 'El Producto NO existe'
                }
            });
        }

        //  let pathImagen = path.resolve(__dirname, `../../../uploads/usuarios/${usuarioDB.img}`);

        //  console.log(pathImagen);
        //  if(fs.existsSync(pathImagen)){
        //      fs.unlinkSync(pathImagen);
        //  }

        borraArchivo(productoDB.img, 'productos');


        productoDB.img = nombreArchivo;

        productoDB.save((err,productoGuardado)=>{

            res.json({
                ok:true,
                usuario: productoGuardado,
                img: nombreArchivo,
                
            });
        });
    });
}

function borraArchivo(nombreImagen, tipo){

    let pathImagen = path.resolve(__dirname, `../../../uploads/${tipo}/${nombreImagen}`);

    console.log(pathImagen);
    if(fs.existsSync(pathImagen)){
       fs.unlinkSync(pathImagen);
    }
}


module.exports = app;