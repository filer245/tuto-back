require("dotenv").config()
const http = require("http"); 
const fs = require("fs");


function requestController(req, res){
    const url = req.url;
    const method = req.method;
    console.log({url, method});

    if(method === "GET" && url === "/"){
        res.setHeader("Content-type","text/html")
        fs.readFile('./public/index.html', function(err, file){
            if(err){
                console.log("Hubo un error", {err});
            }
            res.write(file)
            res.end();
        });
        return
    }
    if(method === "GET" && url === "/about"){
        res.setHeader("Content-type","text/html")
        fs.readFile('./public/about.html', function(err, file){
            if(err){
                console.log("Hubo un error", {err});
            }
            res.write(file)
            res.end();
        });
        return
    }
    res.setHeader("Content-type","text/html; charset=utf-8")
        res.write("<h1>Página no encontrada</h1>");
        res.end();
        return
}

const server = http.createServer(requestController)
const PORT = process.env.PORT;
 
server.listen(PORT, function(){
    console.log("Server corriendo bien en el puerto: " + PORT);
});