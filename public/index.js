const createEditBtn = document.querySelector('#create-task');
const input = document.querySelector('#task-name');
const tasksDiv = document.querySelector('#tasks')

const baseBackendUrl = `${window.origin}/api`;

let TASK_TO_EDIT = null;

createEditBtn.addEventListener("click", async ()=>{
    console.log("Click");
    const creating = !TASK_TO_EDIT 
    console.log({input});
    const path = creating ? "tasks" : `tasks/${TASK_TO_EDIT._id}`;
    const method = creating ? "POST" : "PUT";
    const res = await fetch(`${baseBackendUrl}/${path}`,{
        method,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({text: input.value})
    })
    getTasks();
    input.value = "";
    createEditBtn.innerText = "Crear tarea"
    TASK_TO_EDIT = null;
})

async function getTasks(){
    tasksDiv.innerHTML = null
    const res = await fetch(`${baseBackendUrl}/tasks`)
    const resJSON = await res.json();
    const tasks = resJSON.data;
    for (const task of tasks) {
        const taskParahraph = document.createElement('p');
        const deleteTask = document.createElement('button');
        const taskContainer = document.createElement('div');
        taskParahraph.innerText = task.name;
        deleteTask.innerText = "Borrar";
        deleteTask.setAttribute('id', task._id);
        deleteTask.addEventListener('click', async (e)=>{
            deleteTask.innerText = '...';
            const taskId = e.target.id;
            await fetch(`${baseBackendUrl}/tasks/${taskId}`,{
                method: "DELETE",
            })
            const taskDiv = deleteTask.parentElement;
            taskDiv.remove()
        })
        taskParahraph.addEventListener('click', (e)=>{
                    input.value = taskParahraph.innerText;
                    createEditBtn.innerText = " Editar Tarea";
                    TASK_TO_EDIT = task;
                    console.log({TASK_TO_EDIT});
        })
        taskContainer.appendChild(taskParahraph);
        taskContainer.appendChild(deleteTask);
        tasksDiv.appendChild(taskContainer);
    }    
}

getTasks();