//Selection of Elements
const todoInput = document.getElementById("input");
const todoList = document.querySelector(".list-group");
const addButton = document.getElementById("circle");
const warningMessage = document.getElementById("warning-message");
const secondCard = document.getElementById("second-card");
const todoItems = document.getElementsByClassName(
  "align-self-center p-margin cursor-pointer"
);
const clearCompletedButton = document.getElementById("clear-completed");
const completedButton = document.getElementById("completed-button");
const activeButton = document.getElementById("active");
const allButton = document.getElementById("all");
const itemsLeft = document.getElementById("items-left");
const modeButton = document.getElementById("mode");
const firstDiv = document.querySelector("body > div");
const placeHolder = document.getElementById("my-input");

// Event Listeners
addButton.addEventListener("click", addToDo);
document.addEventListener("DOMContentLoaded", loadAllTodosToUI);
secondCard.addEventListener("click", deleteTodo);
todoList.addEventListener("click", completedTask);
document.addEventListener(
  "DOMContentLoaded",
  applyCompletedTodosFromLocalStorage
);
clearCompletedButton.addEventListener("click", clearCompletedTodos);
completedButton.addEventListener("click", showCompletedTodosList);
activeButton.addEventListener("click", showActiveTodosList);
allButton.addEventListener("click", showAllTodos);
document.addEventListener("DOMContentLoaded", showItemsLeft);
modeButton.addEventListener("click", changeMode);

let isDarkMode = false;

// Functions
function changeMode(e) {
  isDarkMode = !isDarkMode;

  if (isDarkMode) {
    modeButton.src = "./images/icon-moon.svg";
    firstDiv.style.backgroundImage = "url('./images/bg-desktop-light.jpg')";
    firstDiv.parentElement.style.backgroundColor = "#fff";
    let todos = Array.from(todoList.children);
    todos.forEach(function (todo) {
      todo.style.background = "#fff";
      todo.style.color = "#000";
    });
    todoInput.style.background = "#fff";
    todoInput.style.color = "#000";
    addButton.parentElement.style.background = "#fff";
    todoList.nextElementSibling.style.background = "#fff";
    todoInput.style.setProperty("--placeholder-color", "hsl(300, 2%, 9%)");
  } else {
    location.reload();
  }
}

function showItemsLeft(e) {
  let todos = Array.from(todoList.children);
  let filteredItems = Array.from(todos).filter(
    (item) =>
      !item.firstElementChild.firstElementChild.classList.contains(
        "button-check-click"
      )
  );
  itemsLeft.textContent = `${filteredItems.length} items left`;
}

function showAllTodos() {
  let elements = Array.from(todoList.children);
  elements.forEach(function (element) {
    element.classList.remove("display");
  });
}

function showActiveTodosList(e) {
  e.target.classList.add("btn-active-color");
  allButton.classList.add("btn-deactive-color");
  completedButton.classList.add("btn-deactive-color");

  let elements = Array.from(todoList.children);
  elements.forEach(function (element) {
    if (
      element.firstElementChild.firstElementChild.classList.contains(
        "button-check-click"
      )
    ) {
      element.classList.add("display");
    } else {
      element.classList.remove("display");
    }
  });
}
function showCompletedTodosList(e) {
  e.target.classList.add("btn-active-color");
  allButton.classList.add("btn-deactive-color");
  activeButton.classList.add("btn-deactive-color");

  let elements = Array.from(todoList.children);
  elements.forEach(function (element) {
    if (
      element.firstElementChild.firstElementChild.className !==
      "button-check btn-padding button-check-click"
    ) {
      element.classList.add("display");
    } else {
      element.classList.remove("display");
    }
  });
}

function clearCompletedTodos() {
  //delete from storage
  let completedTodos = completedTodosStorage();
  let todos = getTodosFromStorage();
  completedTodos.forEach(function (completedtodo) {
    todos.forEach(function (todo, index) {
      if (todo === completedtodo) {
        todos.splice(index, 1);
      }
    });
  });
  localStorage.setItem("todos", JSON.stringify(todos));
  localStorage.removeItem("completedTodos");

  //delete from UI
  Array.from(todoList.children).forEach((todo) => {
    if (
      todo.firstElementChild.firstElementChild.classList.contains(
        "button-check-click"
      )
    ) {
      todo.remove();
    }
  });

  showItemsLeft();
}

function applyCompletedTodosFromLocalStorage() {
  let storedCompletedTodos = completedTodosStorage();
  if (storedCompletedTodos) {
    storedCompletedTodos.forEach(function (todo) {
      Array.from(todoItems).forEach(function (todoItem) {
        if (todoItem.textContent.trim() == todo) {
          todoItem.previousElementSibling.classList.add("button-check-click");
          todoItem.classList.add("text-decoration-line-through");
          todoItem.previousElementSibling.innerHTML =
            '<img class="tick" src="./images/icon-check.svg" alt="">';
        }
      });
    });
  }
}

function completedTask(e) {
  if (e.target.className === "button-check btn-padding") {
    let completedTodos = completedTodosStorage();
    completedTodos.push(e.target.nextElementSibling.textContent);
    localStorage.setItem("completedTodos", JSON.stringify(completedTodos));
    applyCompletedTodosFromLocalStorage();
  }
}

function activeTodosStorage() {
  let activeTodos;
  if (localStorage.getItem("activeTodos") === null) {
    activeTodos = [];
  } else {
    activeTodos = JSON.parse(localStorage.getItem("activeTodos"));
  }
  return activeTodos;
}
function completedTodosStorage() {
  let completedTodos;
  if (localStorage.getItem("completedTodos") === null) {
    completedTodos = [];
  } else {
    completedTodos = JSON.parse(localStorage.getItem("completedTodos"));
  }
  return completedTodos;
}
function deleteTodo(e) {
  if (e.target.className === "delete-icon align-self-center cursor-pointer") {
    e.target.parentElement.remove();
    deleteTodoFromStorage(
      e.target.parentElement.firstElementChild.lastElementChild.textContent
    );
    showAlert("light", "Item successfully deleted :)");
  }
  showItemsLeft();
}
function deleteTodoFromStorage(deletetodo) {
  let todos = getTodosFromStorage();
  let completedTodos = completedTodosStorage();
  todos.forEach(function (todo, index) {
    if (todo === deletetodo) {
      todos.splice(index, 1);
    }
  });
  completedTodos.forEach(function (completedtodo, index) {
    if (completedtodo === deletetodo) {
      completedTodos.splice(index, 1);
    }
  });
  localStorage.setItem("todos", JSON.stringify(todos));
  localStorage.setItem("completedTodos", JSON.stringify(completedTodos));
}
function loadAllTodosToUI() {
  let todos = getTodosFromStorage();
  todos.forEach(function (todo) {
    addTodoToUI(todo);
  });
  showItemsLeft();
}
function getTodosFromStorage() {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  return todos;
}
function addTodoToStorage(newTodo) {
  let todos = getTodosFromStorage();
  todos.push(newTodo);
  localStorage.setItem("todos", JSON.stringify(todos));
}
function addToDo(e) {
  const newTodo = todoInput.value.trim();
  let todos = getTodosFromStorage();
  if (newTodo === "") {
    showAlert("danger", "Please enter an item!");
  } else if (todos.includes(newTodo)) {
    showAlert("warning", "This item has already been added!");
  } else {
    addTodoToUI(newTodo);
    addTodoToStorage(newTodo);
    showAlert("light", "Item successfully added :)");
  }
  showItemsLeft();
}
function showAlert(type, message) {
  const alert = document.createElement("p");
  alert.className = `text-${type}`;
  alert.innerHTML = message;
  warningMessage.appendChild(alert);
  setTimeout(function () {
    alert.remove();
  }, 2000);
}
function addTodoToUI(newTodo) {
  const listItem = document.createElement("li");
  const textButton = document.createElement("div");
  const itemButton = document.createElement("button");
  const itemText = document.createElement("p");
  const deleteIcon = document.createElement("img");

  listItem.className =
    "list-group-item very-dark-blue d-flex justify-content-between align-content-center list-padding";
  if (
    modeButton.src ===
    "http://127.0.0.1:5500/mentor/todo-app-main/todo-app-main/images/icon-moon.svg"
  ) {
    listItem.style.background = "#fff";
    listItem.style.color = "#000";
  } else {
    listItem.removeAttribute("style");
  }
  textButton.className = "d-flex gap-3";
  itemButton.className = "button-check btn-padding";
  itemText.className = "align-self-center p-margin cursor-pointer";
  deleteIcon.className = "delete-icon align-self-center cursor-pointer";
  deleteIcon.src = "./images/icon-cross.svg";

  itemText.appendChild(document.createTextNode(newTodo));
  listItem.appendChild(textButton);
  listItem.appendChild(deleteIcon);
  textButton.appendChild(itemButton);
  textButton.appendChild(itemText);
  todoList.appendChild(listItem);
  todoInput.value = "";

  showItemsLeft();
}
