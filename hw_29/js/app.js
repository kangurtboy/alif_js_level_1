'use strict';
const apiUrl = 'http://127.0.0.1:9999/api/hw29/posts';
let posts = [];
const loader = {
  show() {
    const loaderEL = document.createElement('div');
    loaderEL.dataset.id = 'loader';
    loaderEL.textContent = 'Данные загружаются';
    rootEl.appendChild(loaderEL);
  },
  hide() {
    rootEl.querySelector('[data-id=loader]').remove();
  },
};

const rootEl = document.getElementById('root');

const wallEl = document.createElement('div');
wallEl.dataset.id = 'wall';
rootEl.appendChild(wallEl);
loader.show();
const xhr = new XMLHttpRequest();
xhr.open('GET', apiUrl);
xhr.send();
xhr.onload = () => {
  loader.hide();
  posts = JSON.parse(xhr.response);
  makeWall(wallEl, posts);
};

function makePostEl(post) {
  let postEl = null;
  const wrappEl = document.createElement('div');
  wrappEl.dataset.id = post.id;
  wrappEl.dataset.type = post.type;
  if (post.type === 'text') {
    postEl = document.createElement('div');
    wrappEl.appendChild(postEl);
    postEl.textContent = post.content;
  }
  if (post.type === 'image') {
    postEl = document.createElement('img');
    wrappEl.appendChild(postEl);
    postEl.src = post.content;
  }
  if (post.type === 'video') {
    postEl = document.createElement('video');
    wrappEl.appendChild(postEl);
    postEl.src = post.content;
    postEl.controls = true;
  }
  return wrappEl;
}

function makeWall(el, items) {
  items
    .map((item) => item)
    .forEach((element) => {
      el.appendChild(makePostEl(element));
    });
}
