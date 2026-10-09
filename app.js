"use strict";
const taskForm = document.getElementById("taskForm");
const taskNameInput = document.getElementById("taskName");
const dueDateInput = document.getElementById("dueDate");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const STORAGE_KEY = "typescript-todo-tasks";
let tasks = loadTasks();
function loadTasks() {
    try {
        const storedTasks = localStorage.getItem(STORAGE_KEY);
        if (storedTasks === null) {
            return [];
        }
        const parsedTasks = JSON.parse(storedTasks);
        if (!Array.isArray(parsedTasks)) {
            return [];
        }
        const validTasks = parsedTasks.filter((task) => {
            if (typeof task !== "object" || task === null) {
                return false;
            }
            const item = task;
            return (typeof item.id === "number" &&
                typeof item.name === "string" &&
                typeof item.dueDate === "string" &&
                typeof item.completed === "boolean");
        });
        return validTasks;
    }
    catch {
        return [];
    }
}
function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
function renderTasks() {
    taskList.innerHTML = "";
    emptyMessage.style.display = tasks.length === 0 ? "block" : "none";
    tasks.forEach((task) => {
        const listItem = document.createElement("li");
        listItem.className = task.completed ? "task completed" : "task";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", `Mark ${task.name} as completed`);
        checkbox.addEventListener("click", () => {
            toggleTask(task.id);
        });
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
        });
        listItem.append(checkbox, nameSpan, dateSpan, statusSpan, deleteButton);
        taskList.appendChild(listItem);
    });
}
taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = taskNameInput.value.trim();
    const dueDate = dueDateInput.value;
    if (name === "" || dueDate === "") {
        return;
    }
    const newTask = {
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
});
function toggleTask(id) {
    tasks = tasks.map((task) => {
        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }
        return task;
    });
    saveTasks();
    renderTasks();
}
function deleteTask(id) {
    tasks = tasks.filter((task) => task.id != id);
    saveTasks();
    renderTasks();
}
renderTasks();
