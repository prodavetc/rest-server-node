

const express = require('express');

let {verificaToken,verificaAdmin_Role} = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

// ==============================
// Mostrar todas las categorias
// ==============================
app.get('/categoria', verificaToken, (req,res) => {
    Categoria.find({})
            .sort('descripcion')
            .populate('usuario', 'nombre email')
            .exec((err, categorias) =>{
                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                };

                res.json({
                    ok: true,
                    categorias
                });
            })
});

// ==============================
// Mostrar una categoria por ID
// ==============================
app.get('/categoria/:id', verificaToken, (req,res) => {
    // Categoria.findById(.....);
    let id = req.params.id;

    Categoria.findById( id, (err, categoriaDB) =>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if(!categoriaDB){
            return res.status(500).json({
                ok: false,
                err : {
                    message: 'El ID no es valido'
                }
            });
        };

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});

// ==============================
// Crear nueva categoria
// ==============================
app.post('/categoria', verificaToken, (req,res) => {
    // regresa nueva categoria
    // req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });
    categoria.save( (err, categoriaDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            });
        };
        
        res.json({
            ok: true,
            categoria: categoriaDB
        });


    });

});

// ==============================
// Actualizar categoria
// ==============================
app.put('/categoria/:id', verificaToken, (req,res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };
 
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            });
        };
        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});

// ==============================
// Borrar categoria
// ==============================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req,res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id no existe'
                }
            });
        };
        res.json({
            ok: true,
            message: 'Categoria borrada'
        });
    });
});








module.exports = app;