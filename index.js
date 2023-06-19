const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./conexion");
const app = express();
const misrutas = require("./routes/rutas");
//const misrutas = require('./routes/rutas');
const cors = require('cors');
//app.use('/', misrutas);
// const admin = require('firebase-admin');

app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});
app.use(bodyParser.json());
app.use(cors());
app.use("/", misrutas);

// const serviceAccount = require('./credenciales.json'); // Ruta a tu archivo de credenciales descargado desde Firebase

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://dbstaymate-default-rtdb.firebaseio.com' // URL de tu proyecto de Firebase
// });

// Habilitar CORS

app.listen(3000, (err, res) => {
  if (err) {
    console.log("Error al levantar servidor");
    return;
  }
  console.log("Apis escuchando en el puerto 3000");
});
