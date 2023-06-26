const createEditBtn = document.querySelector('#create-task');
const input = document.querySelector('#task-name');
const tasksDiv = document.querySelector('#tasks')

const baseBackendUrl = 'http://localhost:4000/api';

let TASK_TO_EDIT = null;

createEditBtn.addEventListener("click", ()=>{
    console.log("Click");
    const creating = !TASK_TO_EDIT 
    console.log({input});
    const path = creating ? "tasks" : `tasks/${TASK_TO_EDIT._id}`;
    const method = creating ? "POST" : "PUT";
    fetch(`${baseBackendUrl}/${path}`,{
        method,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({text: input.value})
    }).then((res)=>{
        getTasks();
        input.value = "";
        createEditBtn.innerText = "Crear tarea"
        TASK_TO_EDIT = null;
    })
})

function getTasks(){
    tasksDiv.innerHTML = null
    fetch(`${baseBackendUrl}/tasks`).then(
        (res)=>{
            return res.json();
        }
    ).then(
        (resJSON)=>{
            const tasks = resJSON.data;
            for (const task of tasks) {
                const taskParahraph = document.createElement('p');
                const deleteTask = document.createElement('button');
                const taskContainer = document.createElement('div');
                taskParahraph.innerText = task.name;
                deleteTask.innerText = "Borrar";
                deleteTask.setAttribute('id', task._id);
                deleteTask.addEventListener('click', (e)=>{
                    deleteTask.innerText = '...';
                    const taskId = e.target.id;
                    fetch(`${baseBackendUrl}/tasks/${taskId}`,{
                        method: "DELETE",
                    }).then(()=>{
                        const taskDiv = deleteTask.parentElement;
                        taskDiv.remove();
                    })
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
    )
}

getTasks();