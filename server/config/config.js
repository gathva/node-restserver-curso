

//=========================
// Puerto
//=========================

process.env.PORT = process.env.PORT || 3000;

//=========================
// Entorno
//=========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//=========================
// Base de Datos
//=========================

let urlDB;

if(process.env.NODE_ENV === 'dev'){

  urlDB = 'mongodb://localhost:27017/cafe';

}else{
  
    urlDB = 'mongodb+srv://strider:0QwtSjuHSB1cNotd@cluster0-rfvae.mongodb.net/cafe';
}

process.env.URLDB = urlDB;

