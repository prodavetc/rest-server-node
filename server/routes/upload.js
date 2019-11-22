const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');


app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningun archivo'
                }
            });
    }

    // validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if( tiposValidos.indexOf( tipo ) <0 ){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Tipos validas son: ' + tiposValidos.join(', '),
                tipo
            }
        })
    }


        let archivo = req.files.archivo;
        let nombreCortado = archivo.name.split('.');
        let extencion = nombreCortado[nombreCortado.length -1];

        
        

        // Extenciones permitidas
        let extencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

        if( extencionesValidas.indexOf(extencion) <0 ){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Extenciiones validas son: ' + extencionesValidas.join(', '),
                    ext: extencion
                }
            })
        }

        // Cambiar nombre al archivo
        let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extencion }`;



        archivo.mv(`./uploads/${ tipo }/${ nombreArchivo }`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });
        if ( tipo === 'usuarios'){
            imagenUsuario(id, res, nombreArchivo);
        }else{
            imagenProducto(id, res, nombreArchivo);
        }
    });

});

function imagenUsuario(id, res, nombreArchivo){

    Usuario.findById(id, (err, usuarioDB) => {
        if( err ){
            borraArchivo(nombreArchivo,'usuarios');
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error usuario'
                }
            });
        }

        if ( !usuarioDB ){
            borraArchivo(nombreArchivo,'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: `El usuario no existe ${id}`
                }
            });
        }


        borraArchivo(usuarioDB.img,'usuarios');


        usuarioDB.img = nombreArchivo;

        usuarioDB.save( (err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });

    });

}

function imagenProducto(id, res, nombreArchivo){
    Producto.findById(id, (err, prodductoDB) => {
        if( err ){
            borraArchivo(nombreArchivo,'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !prodductoDB ){
            borraArchivo(nombreArchivo,'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }


        borraArchivo(prodductoDB.img,'productos');


        prodductoDB.img = nombreArchivo;

        prodductoDB.save( (err, productoGuardado) => {

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });

    });

}

function borraArchivo(nombreImagen, tipo){
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen}`);
        if( fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        }
}


module.exports = app;