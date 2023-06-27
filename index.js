require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const transporter = require('./helpers/mailer')
const jwt = require('jsonwebtoken');

mongoose.connect(process.env.MONGODB_URL).then((e)=>{
        console.log("Conexión exitosa al DB");
}).catch((err)=>{
    console.log("Hubo un error al conectarse a la DB: " + {err});
})

const taskSchema = new Schema({
    name: String,
    done: Boolean,
    //createdBy:
})

const userSchema = new Schema({
    firstname: String,
    lastname: String,
    email: String,
    loginCode: String,
})

const Task = mongoose.model("Task", taskSchema, "Tasks");
const User = mongoose.model("User", userSchema, "Users");


//Middleware archivos estáticos
app.use(express.static('public', {extensions: ["html", "css", "js"]}));

//Middleware parseador del body de las req
app.use(express.json())

//Configurar rutas

app.get('/api/tasks',(req, res)=>{
    Task.find().then((tasks)=>{
        res.status(200).json({ok: true, data: tasks});
    })
    
})

//Middleware tipo post
app.post('/api/tasks', (req,res)=>{
    const body = req.body;
    console.log({body})
    Task.create({
        name: body.text,
        done: false
    }).then((createdTask)=>{
        res.status(201).json({ok: true, message: "Tarea creada con éxito", data: createdTask})
    }).catch((err)=>{
        res.status(400).json({ok: false, message: "Error al crear la tarea"})
    })
})

app.put('/api/tasks/:id', (req,res)=>{
    const body = req.body;
    const id = req.params.id;
    Task.findByIdAndUpdate(id,{
        name: body.text,
    }).then((updatedTask)=>{
        res.status(200).json({ok: true, message: "Tarea editada con éxito", data: updatedTask})
    }).catch((err)=>{
        res.status(400).json({ok: false, message: "Error al editar la tarea"})
    })
})

app.delete('/api/tasks/:id', (req,res)=>{
    const id = req.params.id;
    Task.findByIdAndDelete(id).then((deletedTask)=>{
        res.status(200).json({ok: true, message: "Tarea eliminada con éxito", data: deletedTask})
    }).catch((err)=>{
        res.status(400).json({ok: false, message: "Error al eliminar la tarea"});
    })
})

app.post('/api/auth/login/:email/code',async function (req, res) {
    const { email } = req.params;

    const user = await User.findOne({ email });

    if(!user){
        // await User.create({email, firstname: "Sergio", lastname: "Paniagua"});
        return res.status(400).json({ok: false, message: "No existe."});
    }

    let code = "";

    for (let index = 0; index <= 5; index++) {
        let character = Math.ceil(Math.random()*9);
        code += character;
    }

    console.log({code});

    user.loginCode = code;
    await user.save();

    const result = await transporter.sendMail({
        from: `Sergio Paniagua ${process.env.EMAIL}`,
        to: email,
        subject: `Tu código es: ${code}`,
        body: "Tu codico de inicio de sesión."
    })
    console.log({result});
    res.status(200).json({ok: true, message: "Código enviado"});
})

app.post('/api/auth/login/:email',async function (req, res) {
    const { email } = req.params;
    const { code } = req.body;

    const user = await User.findOne({ email, loginCode: code });

    if(!user){
        // await User.create({email, firstname: "Sergio", lastname: "Paniagua"});
        return res.status(400).json({ok: false, message: "Credenciales inválidas"});
    } 

    res.status(200).json({ok: true, message: "Inicio exitoso"});
})

app.listen(port,function () {console.log(`Servidor corriendo en el puerto: ${port}. Dirname: ${__dirname}.`)})