interface Task{
    id: number,
    name: string,
    dueDate: string,
    completed: boolean
}

const taskForm = document.getElementById("taskForm") as HTMLFormElement; 
const taskNameInput = document.getElementById("taskName") as HTMLInputElement; 
const dueDateInput = document.getElementById("dueDate") as HTMLInputElement; 
const taskList = document.getElementById("taskList") as HTMLUListElement; 
const emptyMessage = document.getElementById("emptyMessage") as HTMLParagraphElement;

const STORAGE_KEY = "typescript-todo-tasks"; 
let tasks: Task[] = loadTasks();

function loadTasks(): Task[] {
    try{
        const storedTasks: string | null = localStorage.getItem(STORAGE_KEY); 
        if (storedTasks === null) { 
            return []; 
        }

        const parsedTasks: unknown = JSON.parse(storedTasks);

        if (!Array.isArray(parsedTasks)) { 
            return []; 
        }

        const validTasks:Task[] = parsedTasks.filter(
            (task: unknown): task is Task => {
                if (typeof task !== "object" || task === null) { 
                    return false; 
                }

                const item = task as Record<string, unknown>;

                return ( 
                    typeof item.id === "number" && 
                    typeof item.name === "string" && 
                    typeof item.dueDate === "string" && 
                    typeof item.completed === "boolean" 
                );
            }
        );
        return validTasks;
    }catch { 
        return []; 
    }
}

function saveTasks(): void { 
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); 
}

function renderTasks():void {
    taskList.innerHTML = ""; 
    emptyMessage.style.display = tasks.length === 0 ? "block" : "none";

    tasks.forEach((task: Task) => {
        const listItem = document.createElement("li");
        listItem.className = task.completed ? "task completed" : "task";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", `Mark ${task.name} as completed`);

        checkbox.addEventListener("click", () => {
            toggleTask(task.id);
        })

        const nameSpan = document.createElement("span");
        nameSpan.className = "task-name";
        nameSpan.textContent = task.name;

        const dateSpan = document.createElement("span"); 
        dateSpan.className = "task-date"; 
        dateSpan.textContent = `Due: ${task.dueDate}`;

        const statusSpan = document.createElement("span"); 
        statusSpan.className = "task-status"; 
        statusSpan.textContent = task.completed ? "Completed" : "Pending";

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("aria-label", `Delete ${task.name}`);

        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        })

        listItem.append(checkbox, nameSpan, dateSpan, statusSpan, deleteButton);

        taskList.appendChild(listItem)
    })
}

taskForm.addEventListener("submit", (event:SubmitEvent) =>{
    event.preventDefault();

    const name: string = taskNameInput.value.trim(); 
    const dueDate: string = dueDateInput.value;

    if(name === "" || dueDate === ""){
        return;
    }

    const newTask: Task = { 
        id: Date.now(), 
        name: name, 
        dueDate: dueDate, 
        completed: false 
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();

    taskForm.reset(); 
    taskNameInput.focus();
})

function toggleTask(id:number):void {
    tasks = tasks.map((task: Task):Task => {
        if(task.id === id){
            return{
                ...task,
                completed: !task.completed
            }
        }
        return task;
    })
    saveTasks();
    renderTasks();
}

function deleteTask(id: number):void{
    tasks = tasks.filter((task:Task) => task.id != id);

    saveTasks();
    renderTasks();
}

renderTasks();