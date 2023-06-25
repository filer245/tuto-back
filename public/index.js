console.log("Console.log interpretado por navegador");

const button = document.querySelector("button");
console.log({button});

button.addEventListener("click",()=>{
    console.log("Click");
    fetch("http://localhost:4000/users")
})