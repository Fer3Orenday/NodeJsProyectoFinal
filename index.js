const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./conexion");
const app = express();
const misrutas = require("./routes/rutas");
//const misrutas = require('./routes/rutas');
const cors = require('cors');
//app.use('/', misrutas);

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


// Habilitar CORS

connection.connect((err, res) => {
  if (err) {
    console.log(err);
    console.log("Error de conexion con sql");
    return;
  }
  console.log("Conexion exitosa a la base de datos");
});

app.listen(3000, (err, res) => {
  if (err) {
    console.log("Error al levantar servidor");
    return;
  }
  console.log("Apis escuchando en el puerto 3000");
});
