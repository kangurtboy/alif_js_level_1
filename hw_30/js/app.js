'use strict';
const apiUrl = 'http://127.0.0.1:9999/api/hw30/posts';
let posts = [];
const loader = {
  show() {
    const loaderEL = document.createElement('div');
    loaderEL.dataset.id = 'loader';
    loaderEL.textContent = 'Данные загружаются';
    rootEl.appendChild(loaderEL);
  },
  hide() {
    const loaderEL = rootEl.querySelector('[data-id=loader]');
    if (loaderEL) {
      loaderEL.remove();
    }
  },
};

const loadBtn = document.createElement('button');
loadBtn.dataset.action = 'load';
loadBtn.textContent = 'Загрузить данные';

const rootEl = document.getElementById('root');
let retryBtn = null;
rootEl.appendChild(loadBtn);
const wallEl = document.createElement('div');
wallEl.dataset.id = 'wall';
rootEl.appendChild(wallEl);

function loadData() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', apiUrl);
  xhr.send();
  const retryWrapper = document.createElement('div');
  xhr.onload = () => {
    const retryEl = `Произошла ошибка: <span data-id="error">${
      JSON.parse(xhr.response).message
    }</span> <button data-action="retry">Повторить зaпрос</button>`;
    retryWrapper.innerHTML = retryEl;
    loader.hide();
    if (xhr.status > 299 || xhr.status < 200) {
      onError(retryWrapper);
      return;
    }
    onSuccess(xhr);
    return;
  };
}

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

rootEl.onclick = (e) => {
  if (e.target === retryBtn || e.target === loadBtn) {
    loader.show();
    loadData();
  }
};

function onSuccess(xhr) {
  let retryWrapper = null;
  wallEl.innerHTML = '';
  posts = JSON.parse(xhr.response);
  if (document.querySelector('[data-action="retry"]')) {
    retryWrapper = document.querySelector(
      '[data-action="retry"]'
    ).parentElement;
  }
  if (retryWrapper) {
    retryWrapper.remove();
    rootEl.appendChild(loadBtn);
  }
  makeWall(wallEl, posts);
}

function onError(retryWrapper) {
  if (loadBtn) {
    loadBtn.remove();
  }
  rootEl.appendChild(retryWrapper);
  retryBtn = rootEl.querySelector('[data-action="retry"]');
  return;
}
