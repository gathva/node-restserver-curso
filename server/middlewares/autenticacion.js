
const jwt = require('jsonwebtoken');

//=========================
// Verificar TOKEN
//=========================

let verificaToken = (req, res, next)=>{

    let token = req.get('token');// o autorization si estan usando esa palabra en vez de TOKEN

    console.log(token);

    jwt.verify(token,process.env.SEED, (err, encoded)=>{

        if(err){
            return res.status(401).json({
                ok: false,
                err:  {
                    message: 'Token NO valido'
                }
            });
        }

        req.usuario = encoded.usuario;
        next();
    });
    
    //next();
    // res.json({
    //     token:token
    // });
};

//=========================
// Verifica AdminRole
//=========================

let verificaAdmin_Role = (req, res, next)=>{

    let usuario = req.usuario;

    if(usuario.role ==='ADMIN_ROLE'){
        next();

    }else{

        return res.json({
            ok:false,
            err: {
                message: "El usuario NO es Administrador"
            }
        });
    } 


};

//=========================
// Verifica la imagen en el HTML con TOKEN
//=========================
let verificaTokenImg = (req, res, next)=>{

    let token = req.query.token;

    jwt.verify(token,process.env.SEED, (err, encoded)=>{

        if(err){
            return res.status(401).json({
                ok: false,
                err:  {
                    message: 'Token NO valido'
                }
            });
        }

        req.usuario = encoded.usuario;
        next();
    });
};


module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}