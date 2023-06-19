const { request, response } = require('express');
const nodeMailer = require('nodemailer');

const envioCorreo = (req=request, resp=response) =>{
    let body = req.body;

    let config = nodeMailer.createTransport({
        host:'smtp.gmail.com',
        post:587,
        auth:{
            user:'wichotl64@gmail.com',
            pass:'aifswcxrdiymkrgp'
        }
    });

    const opciones = {
        from: 'Programación',
        subject: body.asunto,
        to:body.email,
        text:body.mensaje
    };

    config.sendMail(opciones, function(error, result){
        console.log(opciones)
        if (error) {
            return resp.json({ok:false,msg:error});
        }

        return resp.json()({
            ok:true,
            msg:result
            
        });
       
    })
}

module.exports = {
    envioCorreo
}