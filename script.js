const inputBox = document.getElementById('inputBox');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');

let editTodo = null;

// Function to add todo
const addTodo = () => {
    const inputText = inputBox.value.trim();
    if (inputText.length <= 0) {
        alert("You must write something in your to do");
        return false;
    }

    if (addBtn.value === "Edit") {
        // Update localStorage before editing UI
        editLocalTodos(editTodo.target.parentElement.dataset.date, inputText);
        // Update UI text
        editTodo.target.previousElementSibling.innerHTML = inputText;
        addBtn.value = "Add";
        inputBox.value = "";
    }
    else {
        const li = document.createElement("li");

        // Store creation date
        const createdAt = new Date();
        li.dataset.date = createdAt.toISOString();

        const p = document.createElement("p");
        p.innerHTML = inputText;
        li.appendChild(p);

        // Date label
        const dateSpan = document.createElement("span");
        dateSpan.classList.add("date");
        dateSpan.textContent = createdAt.toLocaleDateString() + " " + createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        li.appendChild(dateSpan);

        // Edit Btn
        const editBtn = document.createElement("button");
        editBtn.innerText = "Edit";
        editBtn.classList.add("btn", "editBtn");
        li.appendChild(editBtn);

        // Delete Btn
        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Remove";
        deleteBtn.classList.add("btn", "deleteBtn");
        li.appendChild(deleteBtn);

        todoList.appendChild(li);
        inputBox.value = "";

        saveLocalTodos({ text: inputText, date: createdAt.toISOString() });
    }
}

// Function to update : (Edit/Delete) todo
const updateTodo = (e) => {
    if (e.target.innerHTML === "Remove") {
        todoList.removeChild(e.target.parentElement);
        deleteLocalTodos(e.target.parentElement.dataset.date);
    }

    if (e.target.innerHTML === "Edit") {
        inputBox.value = e.target.parentElement.querySelector("p").innerHTML;
        inputBox.focus();
        addBtn.value = "Edit";
        editTodo = e;
    }
}

// Save todo to localStorage
const saveLocalTodos = (todoObj) => {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos.push(todoObj);
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Load todos from localStorage
const getLocalTodos = () => {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos.forEach(todoObj => {
        const li = document.createElement("li");
        li.dataset.date = todoObj.date;

        const p = document.createElement("p");
        p.innerHTML = todoObj.text;
        li.appendChild(p);

        // Date label
        const dateSpan = document.createElement("span");
        dateSpan.classList.add("date");
        const dateObj = new Date(todoObj.date);
        dateSpan.textContent = dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        li.appendChild(dateSpan);

        // Edit Btn
        const editBtn = document.createElement("button");
        editBtn.innerText = "Edit";
        editBtn.classList.add("btn", "editBtn");
        li.appendChild(editBtn);

        // Delete Btn
        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Remove";
        deleteBtn.classList.add("btn", "deleteBtn");
        li.appendChild(deleteBtn);

        todoList.appendChild(li);
    });
}

// Delete todo from localStorage
const deleteLocalTodos = (dateKey) => {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos = todos.filter(todo => todo.date !== dateKey);
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Edit todo in localStorage
const editLocalTodos = (dateKey, newText) => {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    let index = todos.findIndex(todo => todo.date === dateKey);
    if (index !== -1) {
        todos[index].text = newText;
    }
    localStorage.setItem("todos", JSON.stringify(todos));
}

document.addEventListener('DOMContentLoaded', getLocalTodos);
addBtn.addEventListener('click', addTodo);
todoList.addEventListener('click', updateTodo);
