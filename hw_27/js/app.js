'use strict';
const rootEl = document.getElementById('root');
const formEl = document.createElement('form');
formEl.dataset.id = 'todo-form';
const formElements = `<div>
<label for="todo-text">Название</label>
<input data-input="text" id="todo-text">
</div>
<div>
<label for="todo-priority">Приоритет</label>
<input data-input="priority" id="todo-priority" type="number">
</div>
<button data-action="add">Добавить</button>`;
formEl.innerHTML = formElements;

const nameInput = formEl.querySelector('[data-input=text]');
const priorityInput = formEl.querySelector('[data-input=priority]');

rootEl.appendChild(formEl);

const listEl = document.createElement('ul');
listEl.dataset.id = 'todo-list';
rootEl.appendChild(listEl);

const errorEl = document.createElement('div');
errorEl.dataset.id = 'message';
rootEl.appendChild(errorEl);

const tasks = [];

let nextId = 1;
const minPriority = 1;

formEl.onsubmit = (e) => {
  e.preventDefault();
  errorEl.textContent = '';
  if (!nameInput.value) {
    errorEl.textContent = 'Значение поля не может быть пустым';
    nameInput.focus();
    return;
  }
  if (!priorityInput.value) {
    errorEl.textContent = 'Значение поля не может быть пустым';
    priorityInput.focus();
    return;
  }
  if (Number(priorityInput.value) < minPriority) {
    errorEl.textContent = 'Минималны приоритет должен быт выше 0';
    priorityInput.focus();
    return;
  }

  const task = {
    id: nextId++,
    text: nameInput.value.trim(),
    priority: Number(priorityInput.value),
  };

  tasks.push(task);
  sortPriortity();
  renderListItems(tasks);
  formEl.reset();
  nameInput.focus();
};

listEl.onclick = (e) => {
  let currentListItem = null;
  let incEl = null;
  let decEl = null;

  if (e.target.dataset.action) {
    currentListItem = e.target.parentElement;
    incEl = currentListItem.querySelector('[data-action="inc"]');
    decEl = currentListItem.querySelector('[data-action="dec"]');
  }
  const currentTask = tasks.find(
    (element) => element.id === Number(currentListItem.dataset.todoId)
  );
  if (e.target === incEl) {
    currentTask.priority++;
    sortPriortity();
    renderListItems(tasks);
  }
  if (e.target === decEl && currentTask.priority > minPriority) {
    currentTask.priority--;
    sortPriortity();
    renderListItems(tasks);
  }
};

function renderListItems(arr) {
  listEl.innerHTML = '';

  arr.forEach((element) => {
    const listItemEl = document.createElement('li');
    const nextListItem = listItemEl.nextElementSibling;
    listItemEl.dataset.todoId = element.id;
    listItemEl.innerHTML = `${element.text} (приоритет: <span data-info="priority">${element.priority}</span>)
		<button data-action="inc">+</button>
		<button data-action="dec">-</button>`;

    listEl.insertBefore(listItemEl, nextListItem);
  });
}

function sortPriortity() {
  tasks.sort((first, second) => first.priority - second.priority);
}
