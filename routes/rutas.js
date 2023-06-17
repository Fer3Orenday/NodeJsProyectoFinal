const express = require("express");
const nodemailer = require('nodemailer');
const user = require("../user.model");
const connection = require("../conexion");
const { body, param, validationResult } = require("express-validator");
var router = express.Router();

// esta ruta GET se utiliza para obtener todos los usuarios de 
// la base de datos y enviarlos como respuesta en formato JSON al cliente que realiza la solicitud.
router.get("/user", [], (req, res) => {
  user.getAll(connection, (data) => {
    res.json(data);
  });
});


router.post(
  "/user",
  [],
  // si la validación de la solicitud arroja errores, se devuelve una respuesta 
  // JSON indicando que la solicitud no fue exitosa y se proporciona información sobre los errores.
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ success: false, err: JSON.stringify(errors) });
      return;
    } else {
      let body = req.body;
      // configura el  correo electrónico utilizando Gmail como servicio de correo saliente. 
      // Se proporcionan las credenciales de autenticación,
      //  donde user es la dirección de correo electrónico del remitente y pass es la contraseña correspondiente.
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'fer.orenday3@gmail.com',
          pass: 'njfxacoedqknbjgg'
        }
      });

      //En esta parte se manda el contenido del correo electronico
      const mailOptions = {
        from: 'Maria Fernanda Hermosillo Orenday',
        to: body.contact,
        //body.asunto es para poner en el mensaje el asunto que va a mandar el usuario
        subject: `Recibimos tu comentario acerca de: ${body.asunto}`,
        //body.asunto es para poner en el mensaje la descripcion que va a mandar el usuario
        text: `Tu comentario se atenderá lo antes posible. Tu comentario fue: ${body.descripcion}`
      };


      // Aqui estamos usando el transporte de nodemailer,  estamos utilizando dos parametos error e informacion
      // en donde si se detectan errores al momento de mandar el correo se nos va a notificar. Si todo esta bien
      // se va enviar una respuesta json que nos va a indicar que el correo ya se ah mandado. 
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error al enviar el correo electrónico:', error);
        } else {
          console.log('Correo electrónico enviado:', info.response);
        }
      });
      res.json({ success: true, msg: `Se ha enviado un correo a ${body.contact}` })
      console.log(body);
    }
  }
);
module.exports = router;
