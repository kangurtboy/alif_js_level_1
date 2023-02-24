'use strict';
const apiUrl = 'http://127.0.0.1:9999/api/hw33/posts';
let posts = [];

const rootEl = document.getElementById('root');
const loaderEL = document.createElement('div');
loaderEL.dataset.id = 'loader';
loaderEL.textContent = 'Данные загружаются';
rootEl.appendChild(loaderEL);

const errorEl = document.createElement('div');
errorEl.dataset.id = 'message';
rootEl.appendChild(errorEl);
const error = {
  show: (text) => {
    errorEl.textContent = text;
  },
  hide: () => {
    errorEl.textContent = '';
  },
};
const loader = {
  show() {
    loaderEL.style.display = 'block';
  },
  hide() {
    loaderEL.style.display = 'none';
  },
  spinner: {
    show: (el) => {
      const spinnerEl = document.createElement('div');
      spinnerEl.innerHTML =
        '<span data-id="action-loader"><img src="./img/loader.gif"></span>';
      el.appendChild(spinnerEl);
    },
    hide: () => {
      const spinnerEl = rootEl.querySelector('[data-id=action-loader]');
      if (spinnerEl) {
        spinnerEl.parentElement.remove();
      }
    },
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

const postsEl = document.createElement('div');
postsEl.dataset.id = 'posts';
rootEl.appendChild(postsEl);
const fieldSetEl = rootEl.querySelector('[data-id="post-fields"]');

function makePostEl(post) {
  const wrappEl = document.createElement('div');
  wrappEl.dataset.type = 'post';
  wrappEl.dataset.postId = post.id;
  wrappEl.innerHTML = `<div data-post-part="author">${post.author}</div>
  <div data-post-part="text">${post.text}</div>
  <div>
	  ❤️ <span data-info="likes">${post.likes}</span>
	  <button data-action="like">+1</button>
	  <button data-action="dislike">-1</button>
	  <button data-action="remove">Удалить</button>
  </div>`;

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

  if (headers) {
    for (const item in headers) {
      xhr.setRequestHeader(item, headers[item]);
    }
  }
  xhr.onload = () => {
    if (callbacks.onSuccess) {
      callbacks.onSuccess(xhr.responseText);
    }
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
  for (const item of nodes) {
    if (!item.value) {
      item.focus();
      error.show('Поля не может быт пустым');
      return false;
    }
    error.hide();
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
    likes: 0,
  };

  ajax(
    'POST',
    apiUrl,
    { 'Content-Type': 'application/json' },
    {
      onStart: () => {
        const postEl = makePostEl(post);
        loader.show();
        fieldSetEl.disabled = true;
        if (postsEl.childElementCount) {
          postsEl.insertBefore(postEl, postsEl.children[0]);
        } else {
          postsEl.appendChild(postEl);
        }
      },
      onSuccess: (postData) => {
        const lastPostEl = postsEl.children[0];
        const loadedPost = JSON.parse(postData);
        lastPostEl.dataset.postId = loadedPost.id;
        posts.unshift(loadedPost);
        loader.hide();
        formEl.reset();
        fieldSetEl.disabled = false;
        authorEl.focus();
      },
    },
    JSON.stringify(post)
  );
};

ajax(
  'GET',
  apiUrl,
  {},
  {
    onStart: () => {
      loader.show;
    },
    onSuccess: (postData) => {
      posts = JSON.parse(postData);
      makeWall(postsEl, posts);
      loader.hide();
    },
  },
  {}
);

//Уделение постов
postsEl.addEventListener('click', (e) => {
  if (e.target.dataset.action === 'remove') {
    const currentPostEl = e.target.parentElement.parentElement;
    const postId = Number(currentPostEl.dataset.postId);
    currentPostEl.remove();
    ajax(
      'DELETE',
      `${apiUrl}/${postId}`,
      { 'Content-Type': 'aplication/json' },
      {
        onStart: () => {
          loader.show();
          posts = posts.filter((item) => item.id !== postId);
        },
        onSuccess: () => {
          loader.hide();
        },
        onFinish: () => {
          loader.hide();
        },
      },
      null
    );
  }
});

//Лайки и дизлайки
postsEl.addEventListener('click', (e) => {
  let currentPostEl = null;
  let likeCountEl = null;
  let actionsEl = null;
  const one = 1;
  if (e.target.dataset.action === 'dislike') {
    //Если нажал на дизлайк
    currentPostEl = e.target.parentElement.parentElement;
    actionsEl = e.target.parentElement;
    likeCountEl = currentPostEl.querySelector('[data-info="likes"]');
    const postId = Number(currentPostEl.dataset.postId);
    const findedPost = posts.find((item) => item.id === postId);
    ajax(
      'DELETE',
      `${apiUrl}/${postId}/likes`,
      {},
      {
        onStart: () => {
          loader.spinner.show(currentPostEl);
          actionsEl.style.display = 'none';
        },
        onSuccess: () => {
          likeCountEl.textContent = Number(likeCountEl.textContent) - one;
          findedPost.likes = Number(likeCountEl.textContent);
        },
        onFinish: () => {
          actionsEl.style.display = 'block';

          loader.spinner.hide();
        },
      },
      null
    );
  }

  if (e.target.dataset.action === 'like') {
    //Если нажал на лайк
    currentPostEl = e.target.parentElement.parentElement;
    actionsEl = e.target.parentElement;
    likeCountEl = currentPostEl.querySelector('[data-info="likes"]');
    const postId = Number(currentPostEl.dataset.postId);
    const findedPost = posts.find((item) => item.id === postId);
    ajax(
      'POST',
      `${apiUrl}/${postId}/likes`,
      {},
      {
        onStart: () => {
          loader.spinner.show(currentPostEl);
          actionsEl.style.display = 'none';
        },
        onSuccess: () => {
          likeCountEl.textContent = Number(likeCountEl.textContent) + one;
          findedPost.likes = Number(likeCountEl.textContent);
        },
        onFinish: () => {
          actionsEl.style.display = 'block';

          loader.spinner.hide();
        },
      },
      null
    );
  }
});
