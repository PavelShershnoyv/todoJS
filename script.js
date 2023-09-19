let input = document.querySelector("input[name='titleToDo']");
let button = document.querySelector("#add");
let todoHTML = document.querySelector(".todo");
let control = document.querySelector(".panel");
let errorHTML = document.querySelector(".error");
let one = control.querySelector('[data-func="n"]');
let two = control.querySelector('[data-func="2n"]');

let todos = [];

if (localStorage.getItem("todo")) {
  todos = JSON.parse(localStorage.getItem("todo"));
  render();
}

function updateLocalStorageAndRender() {
  localStorage.setItem("todo", JSON.stringify(todos));
  render();
}

let eventsError = ["input", "focus"];

["input", "focus"].forEach((event) => {
  input.addEventListener(event, () => {
    errorHTML.innerHTML = "";
  });
});

input.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    initBeforeRender();
  }
});

button.addEventListener("click", () => {
  initBeforeRender();
});

function initBeforeRender() {
  if (!input.value.trim()) {
    errorHTML.innerHTML = `<p>Поле не может быть пустым</p>`;
    return;
  }

  let newToDo = {
    title: input.value,
    success: false,
    mark: false,
  };

  let index = todos.findIndex((item) => item.success);

  if (index !== -1) {
    todos.splice(index, 0, newToDo);
  } else {
    todos.push(newToDo);
  }

  updateLocalStorageAndRender();
  input.value = "";
}

function render() {
  let elementHTML = todos
    .map(
      (item, i) => `
        <div draggable="true" class="todo_item ${item.success ? "success" : ""} 
        ${item.mark ? "mark" : ""}" id="item__${i}">
          <span>${item.title}</span>
          <div class="todo_item__action">
          ${
            item.success
              ? `<img src="img/cancellation.png" alt="" data-id="${i}" data-role="status">`
              : `<img src="img/checkMark.svg" alt="" data-id="${i}" data-role="status">`
          }
            <img src="img/delete.png" alt="" data-id="${i}" data-role="delete">
          </div>
        </div>`
    )
    .join("");

  todoHTML.innerHTML = elementHTML;
}

todoHTML.addEventListener("click", (e) => {
  let id = +e.target.getAttribute("data-id");
  let role = e.target.getAttribute("data-role");

  if (role === "status") {
    setStatusTask(id);
  } else if (role === "delete") {
    deleteTask(id);
  }
});

todoHTML.addEventListener("mousedown", (item) => {
  let currentId = +item.target.getAttribute("id")?.substr(6);
  let swapId;
  let unready = true;

  if (item.target.getAttribute("class").indexOf("success") !== -1) {
    unready = false;
  }
  let boxes = Array.from(todoHTML.querySelectorAll(".todo_item"));

  boxes.forEach((box) => {
    box.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
    box.addEventListener("dragenter", (e) => {
      let condition = e.target.getAttribute("class").indexOf("success");
      swapId = +e.target.getAttribute("id").substr(6);
      if ((!unready && condition === -1) || (unready && condition !== -1)) {
        swapId = currentId;
      }
    });
    box.addEventListener("drop", () => {
      [todos[swapId], todos[currentId]] = [todos[currentId], todos[swapId]];
      updateLocalStorageAndRender();
    });
  });
});

function setStatusTask(id) {
  todos[id].success = !todos[id].success;
  const element = todos[id];

  if (todos[id].success) {
    todos.splice(id, 1);
    todos.push(element);
  } else {
    todos.splice(id, 1);
    todos.unshift(element);
  }

  updateLocalStorageAndRender();
}

function deleteTask(id) {
  if (todos[id].success) {
    return;
  }
  todos.splice(id, 1);

  updateLocalStorageAndRender();
}

function setMark(index, remainder) {
  if (index == -1) {
    index = todos.length;
  }
  for (let i = 0; i < index; i++) {
    if (i % 2 == remainder) {
      todos[i].mark = !todos[i].mark;
    } else {
      todos[i].mark = false;
    }
  }

  updateLocalStorageAndRender();
}

function switchActiveButton(firstBtn, secondBtn) {
  firstBtn.classList.toggle("panel_item__active");
  secondBtn.classList.remove("panel_item__active");
}

control.addEventListener("click", (e) => {
  let func = e.target.getAttribute("data-func");

  switch (func) {
    case "n":
      setMark(
        todos.findIndex((item) => item.success),
        1
      );
      switchActiveButton(one, two);
      break;
    case "2n":
      setMark(
        todos.findIndex((item) => item.success),
        0
      );
      switchActiveButton(two, one);
      break;
    case "dell":
      deleteTask(todos.findIndex((item) => item.success) - 1);
      break;
    case "delf":
      deleteTask(0);
      break;
  }
});
