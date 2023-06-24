require("dotenv").config()
const http = require("http"); 


function requestController(){
    console.log("Hola!!!!");
}

const server = http.createServer(requestController)
const PORT = process.env.PORT;
 
server.listen(PORT, function(){
    console.log("Server corriendo bien en el puerto: " + PORT);
});