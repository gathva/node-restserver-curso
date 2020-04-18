

//=========================
// Puerto
//=========================

process.env.PORT = process.env.PORT || 3000;

//=========================
// Entorno
//=========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=========================
// Fecha de venciminento del Token
//=========================
//60 segundos
//60 minutos
//24 horas
//30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//=========================
// Seed de autentificacion
//=========================
process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo';


//=========================
// Base de Datos
//=========================

let urlDB;

if(process.env.NODE_ENV === 'dev'){

  urlDB = 'mongodb://localhost:27017/cafe';

}else{
  
   // urlDB = 'mongodb+srv://strider:0QwtSjuHSB1cNotd@cluster0-rfvae.mongodb.net/cafe';
   urlDB = process.env.MONGO_URI;//MONGO_URI es una variable de entorno creada en heroku k almacena el string de conexion a la BD para k no sea vista al subir el codigo al repositorio
}

process.env.URLDB = urlDB;

