const express = require("express");
const nodemailer = require('nodemailer');
const user = require("../user.model");
const connection = require("../conexion");
const { body, param, validationResult } = require("express-validator");
var router = express.Router();

const admin = require('firebase-admin');

const serviceAccount = require('../credenciales.json'); // Ruta a tu archivo de credenciales descargado desde Firebase

// Inicializar la conexión a Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://tu-proyecto.firebaseio.com'
});

// Obtener una referencia a la colección deseada
const db = admin.firestore();
const collectionRef = db.collection('citas');

// esta ruta GET se utiliza para obtener todos los usuarios de 
// la base de datos y enviarlos como respuesta en formato JSON al cliente que realiza la solicitud.
router.get("/user", [], (req, res) => {
  user.getAll(connection, (data) => {
    res.json(data);
  });
});

router.post("/userQr", [], (req, res) => {
  let body = req.body;
console.log(body.fullName);
  collectionRef.where('data.fullName', '==', body.fullName)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
        console.log('No hay nada')
        res.json({
          success: true,
          result: doc.data(),
        })
      });
    })
    .catch((error) => {
      res.json({
        success: false,
        result: error,
      })
    });

});

router.post("/cancelar", [], (req, res) => {
  let body = req.body;

  collectionRef.where('data.fullName', '==', body.fullName)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
        const documentRef = collectionRef.doc(doc.id);
        documentRef.delete()
          .then(() => {
            res.json({
              success: true,
            })
          })
          .catch((error) => {
            res.json({
              success: false,
              msg: error
            })
          });

      });
    })
    .catch((error) => {
      res.json({
        success: false,
        result: error,
      })
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
      return
    } else {
      let body = req.body;
      console.log(body);
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
        to: body.email,
        //body.asunto es para poner en el mensaje el asunto que va a mandar el usuario
        subject: `Reservacion confirmada a nombre de: ${body.fullName}`,
        //body.asunto es para poner en el mensaje la descripcion que va a mandar el usuario
        text: `Tu reservacion ha sido realizada con exito en  ${body.casaReservada.title}, con fecha del ${body.arriveDate} al ${body.lastDate}, con un total de ${body.huespedes} huespedes`
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
