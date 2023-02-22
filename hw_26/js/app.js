'use strict';
const rootEl = document.getElementById('root');
const formEl = document.createElement('form');
formEl.dataset.id = 'comment-form';
const textArea = document.createElement('textarea');
textArea.dataset.input = 'text';
textArea.setAttribute('name', '');
textArea.id = '';
textArea.cols = 30;
textArea.rows = 10;
formEl.appendChild(textArea);
const addButton = document.createElement('button');
addButton.dataset.action = 'add';
addButton.textContent = 'Добавить';

formEl.appendChild(addButton);

rootEl.appendChild(formEl);

const listEl = document.createElement('ul');
listEl.dataset.id = 'comments-list';
rootEl.appendChild(listEl);

const errorEl = document.createElement('div');
errorEl.dataset.id = 'message';
rootEl.appendChild(errorEl);

let comments = [];

let nextId = 1;
const likeSymbol = ' ❤';

formEl.onsubmit = (e) => {
  e.preventDefault();
  errorEl.textContent = '';
  if (!textArea.value) {
    errorEl.textContent = 'Значение поля не может быть пустым';
    textArea.focus();
    return;
  }

  const comment = {
    id: nextId++,
    text: textArea.value.trim(),
    likes: 0,
  };

  const listItemEl = document.createElement('li');
  listItemEl.dataset.commentId = comment.id;
  const commentTextEl = document.createElement('span');
  commentTextEl.dataset.info = 'text';
  commentTextEl.textContent = comment.text;
  listItemEl.appendChild(commentTextEl);
  listItemEl.append(likeSymbol);
  const likesCountEl = document.createElement('span');
  likesCountEl.dataset.info = 'likes';
  likesCountEl.textContent = comment.likes;
  listItemEl.appendChild(likesCountEl);
  const likeBtn = document.createElement('button');
  likeBtn.dataset.action = 'like';
  likeBtn.textContent = '+';
  listItemEl.appendChild(likeBtn);
  const disLikeBtn = document.createElement('button');
  disLikeBtn.dataset.action = 'dislike';
  disLikeBtn.textContent = '-';
  listItemEl.appendChild(disLikeBtn);

  listEl.appendChild(listItemEl);
  comments.push(comment);

  formEl.reset();
  textArea.focus();
};

const minDislike = -10;

listEl.onclick = (e) => {
  let currentCommentEl = null;
  let likeEl = null;
  let dislikeEl = null;
  let currentComment = {};
  let counterEl = null;

  if (e.target.dataset.action) {
    currentCommentEl = e.target.parentElement;
    likeEl = currentCommentEl.querySelector('[data-action=like]');
    dislikeEl = currentCommentEl.querySelector('[data-action=dislike]');
    counterEl = currentCommentEl.querySelector('[data-info=likes]');
    currentComment = comments.find(
      (item) => item.id === Number(currentCommentEl.dataset.commentId)
    );
    if (e.target === likeEl) {
      currentComment.likes++;
      counterEl.textContent = currentComment.likes;
    }
    if (e.target === dislikeEl) {
      currentComment.likes--;
      counterEl.textContent = currentComment.likes;
      if (currentComment.likes <= minDislike) {
        comments = comments.filter((item) => item.id !== currentComment.id);
        currentCommentEl.remove();
      }
    }
  }
};
