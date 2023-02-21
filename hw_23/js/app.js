'use strict';
const rootEl = document.getElementById('root');
const formEl = document.createElement('form');
formEl.dataset.id = 'comment-form';
const textAreaEl = document.createElement('textarea');
textAreaEl.dataset.input = 'comment';
formEl.appendChild(textAreaEl);
const buttonEl = document.createElement('button');
buttonEl.dataset.action = 'add';
buttonEl.textContent = 'Добавить';
formEl.appendChild(buttonEl);
const listEl = document.createElement('ul');
listEl.dataset.id = 'comment-list';
rootEl.appendChild(formEl);
const errorEl = document.createElement('div');
errorEl.dataset.id = 'message';
rootEl.appendChild(errorEl);

rootEl.appendChild(listEl);
let nextId = 1;
const comments = [];

formEl.onsubmit = (e) => {
  const listItemEl = document.createElement('li');
  e.preventDefault();
  textAreaEl.focus();
  errorEl.textContent = '';
  if (!textAreaEl.value) {
    errorEl.textContent = 'Значение поля не может быть пустым';
    return;
  }
  const comment = {
    id: nextId++,
    text: textAreaEl.value.trim(),
  };
  comments.push(comment);
  listItemEl.textContent = comment.text;
  listItemEl.dataset.commentId = comment.id;
  listEl.appendChild(listItemEl);
  formEl.reset();
};
