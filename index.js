require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

const Task = mongoose.model("Task", taskSchema, "Tasks");

//Middleware archivos estáticos
app.use(express.static('public'));

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

app.listen(port,()=>{console.log(`Servidor corriendo en el puerto: ${port}. Dirname: ${__dirname}.`)})