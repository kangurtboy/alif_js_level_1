'use strict';
const apiUrl = 'http://127.0.0.1:9999/api/hw32/posts';
let posts = [];

const rootEl = document.getElementById('root');
const loaderEL = document.createElement('div');

loaderEL.dataset.id = 'loader';
loaderEL.textContent = 'Данные загружаются';

const loader = {
  show() {
    loaderEL.style.display = 'block';
  },
  hide() {
    loaderEL.style.display = 'none';
  },
};
const formEl = document.createElement('form');
formEl.dataset.id = 'post-form';
formEl.innerHTML = `<fieldset data-id="post-fields">
	<input data-input="author">
	<input data-input="text">
	<button data-action="add">Добавить</button>
</fieldset>`;
rootEl.appendChild(formEl);

const inputs = rootEl.querySelectorAll('input');
const errorEl = document.createElement('div');
errorEl.dataset.id = 'message';
const postsEl = document.createElement('div');
postsEl.dataset.id = 'posts';
rootEl.appendChild(postsEl);

function makePostEl(post) {
  const wrappEl = document.createElement('div');
  wrappEl.dataset.type = 'post';
  wrappEl.dataset.postId = post.id;
  wrappEl.innerHTML = `<div data-post-part="author">${post.author}</div>
  <div data-post-part="text">${post.text}</div>
  <div data-post-action="remove">удалить</div>`;

  return wrappEl;
}

function makeWall(el, items) {
  items
    .map((item) => item)
    .forEach((element) => {
      el.appendChild(makePostEl(element));
    });
}

function ajax(method, url, headers, callbacks, body) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  if (callbacks.onStart) {
    callbacks.onStart();
  }

  if (headers.length) {
    for (const item in headers) {
      xhr.setRequestHeader(item, headers[item]);
    }
  }
  xhr.onload = () => {
    callbacks.onSuccess(xhr.responseText);
  };
  xhr.onerror = () => {
    if (callbacks.onError) {
      callbacks.onError();
    }
  };
  xhr.onloadend = () => {
    if (callbacks.onFinish) {
      callbacks.onFinish();
    }
  };
  if (method === 'GET') {
    xhr.send();
  } else {
    xhr.send(body);
  }
}

// const functions = {
//   onStart: () => {},
//   onFinish: () => {},
//   onSuccess: (data) => {},
//   onError: (data) => {},
// };

function validation(nodes) {
  const errorElement = rootEl.querySelector('[data-id=message]');
  if (errorElement) {
    errorElement.remove();
  }
  for (const item of nodes) {
    if (!item.value) {
      item.focus();
      errorEl.textContent = 'Поля не может быт пустым';
      rootEl.appendChild(errorEl.cloneNode(true));
      return false;
    }
  }
  nodes[0].focus();
  return true;
}

//Добавления постов
formEl.onsubmit = (e) => {
  e.preventDefault();
  const authorEl = formEl.querySelector('[data-input="author"]');
  const textEl = formEl.querySelector('[data-input="text"]');

  if (!validation(inputs)) {
    return;
  }
  const post = {
    id: 0,
    author: authorEl.value.trim(),
    text: textEl.value.trim(),
  };

  ajax(
    'POST',
    apiUrl,
    { 'Content-Type': 'Aplication/json' },
    {
      onSuccess: (data) => {},
    },
    JSON.stringify(post)
  );
  formEl.reset();
};

//получение постов

ajax(
  'GET',
  apiUrl,
  {},
  {
    onSuccess: (postData) => {
      posts = JSON.parse(postData);
      makeWall(postsEl, posts);
    },
  },
  {}
);

//Уделение постов
postsEl.onclick = (e) => {
  if (e.target.dataset.postAction === 'remove') {
    const currentPostEl = e.target.parentElement;
    const postId = currentPostEl.dataset.postId;
    currentPostEl.remove();
    ajax(
      'DELETE',
      `${apiUrl}/${postId}`,
      { 'Content-Type': 'Aplication/json' },
      {},
      null
    );
  }
};
