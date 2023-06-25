require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;

app.use(express.static('public'));

//Configurar rutas

app.get('/',(req, res)=>{
    res.send('Hola');
})

app.get('/about',(req, res)=>{
    res.send('Hola desde about');
})

app.get('/users',(req, res)=>{
    res.send([{name:"Sergio"}, {name: "Alex"}, {name: "María"}]);
})

app.listen(port,()=>{
    console.log(`Servidor corriendo en el puerto: ${port}`);
})