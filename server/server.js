
require('./config/config');


const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: false }));

//parse aplication/json
app.use(bodyParser.json());

//Habilitar la carpeta public como publica
app.use(express.static(path.resolve(__dirname, '../public')));


//configuracion global de rutas
app.use( require('./config/routes/index') );



mongoose.connect(process.env.URLDB,
                       {useNewUrlParser:true, useUnifiedTopology: true, useCreateIndex: true}, 
                       (err, resp)=>{



    if (err) throw err;

    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, ()=>{
    console.log('Escuchando el puerto', process.env.PORT);
});