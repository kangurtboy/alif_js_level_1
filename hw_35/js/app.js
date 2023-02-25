'use strict';
const apiUrl = 'http://127.0.0.1:9999/api/hw35/posts';
let posts = [];

const rootEl = document.getElementById('root');
const loaderEL = document.createElement('div');
loaderEL.dataset.id = 'loader';
loaderEL.textContent = 'Данные загружаются';
rootEl.appendChild(loaderEL);
let selectedPostEl = null;
let selectedPost = {};
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
	<input data-input="id" type="hidden" value="0">
	<input data-input="author">
	<input data-input="text">
	<button data-action="add">Добавить</button>
</fieldset>`;
rootEl.appendChild(formEl);
const authorInput = rootEl.querySelector('[data-input="author"]');
const textInput = rootEl.querySelector('[data-input="text"]');
const idInput = rootEl.querySelector('[data-input="id"]');

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
	  <button data-action="edit">Изменить</button>
	  <button data-action="remove">Удалить</button>
</div>
<form data-form="comment">
	<input data-id="text">
	<button>Добавить</button>
</form>
<div data-post-part="comments">${makeCommentEl(post.comments)}</div>`;

  return wrappEl;
}

function makeCommentEl(comments) {
  //Создание елемента комментарий
  if (!comments) {
    return '';
  }
  let result = '';
  comments.forEach((comment) => {
    const commentMarkup = `<div data-comment-id="${comment.id}">${comment.text}</div>`;
    result += commentMarkup;
  });

  return result;
}

function makeWall(el, items) {
  items
    .map((item) => item)
    .forEach((element) => {
      el.appendChild(makePostEl(element));
    });
}

const formSetting = {
  //Управление кнопки форма
  fieldSetEl: formEl.querySelector('[data-id="post-fields"]'),
  isEdit: false,
  editState: () => {
    //Cостаяние редактирование
    const saveBtn = document.createElement('button');
    saveBtn.dataset.action = 'save';
    saveBtn.textContent = 'Сохранить';
    const cancelBtn = document.createElement('button');
    cancelBtn.dataset.action = 'cancel';
    cancelBtn.textContent = 'Отмена';
    const addBtn = formEl.querySelector('[data-action="add"]');
    if (addBtn) {
      addBtn.remove();
      formSetting.fieldSetEl.appendChild(saveBtn);
      formSetting.fieldSetEl.appendChild(cancelBtn);
      formSetting.isEdit = true;
      authorInput.value = selectedPost.author;
      textInput.value = selectedPost.text;
      idInput.value = selectedPost.id;
    }
  },
  initialState: () => {
    //Изначальная состаяния
    const saveBtn = formEl.querySelector('[data-action="save"]');
    const cancelBtn = formEl.querySelector('[data-action="cancel"]');

    const addBtn = document.createElement('button');
    addBtn.dataset.action = 'add';
    addBtn.textContent = 'Добавить';
    if (saveBtn && cancelBtn) {
      saveBtn.remove();
      cancelBtn.remove();
      formSetting.fieldSetEl.appendChild(addBtn);
      formSetting.isEdit = false;
      authorInput.value = '';
      textInput.value = '';
      idInput.value = 0;
    }
  },
};

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
    comments: [],
  };
  if (formSetting.isEdit) {
    post.id = Number(idInput.value);
  }

  ajax(
    'POST',
    apiUrl,
    { 'Content-Type': 'application/json' },
    {
      onStart: () => {
        const postEl = makePostEl(post);
        loader.show();
        fieldSetEl.disabled = true;
        if (!formSetting.isEdit) {
          if (postsEl.childElementCount) {
            postsEl.insertBefore(postEl, postsEl.children[0]);
          } else {
            postsEl.appendChild(postEl);
          }
        }
      },
      onSuccess: (postData) => {
        const lastPostEl = postsEl.children[0];
        const loadedPost = JSON.parse(postData);
        lastPostEl.dataset.postId = loadedPost.id;
        if (!formSetting.isEdit) {
          posts.unshift(loadedPost);
        }
        loader.hide();
        formEl.reset();
        fieldSetEl.disabled = false;
        authorEl.focus();
        if (formSetting.isEdit) {
          postsEl.replaceChild(makePostEl(post), selectedPostEl);
          const findedPost = posts.find((item) => item.id === loadedPost.id);
          findedPost.text = loadedPost.text;
          findedPost.author = loadedPost.author;
        }
        formSetting.initialState();
      },
    },
    JSON.stringify(post)
  );
};

//Получение постов
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

//Добавление комментарий
postsEl.addEventListener('submit', (e) => {
  e.preventDefault();
  let currentPostEl = null;
  const createdFormEl = document.createElement('form');
  createdFormEl.innerHTML = '<input data-id="text"><button>Добавить</button>';
  createdFormEl.dataset.form = 'comment';
  let commentText = null;
  let currentCommentForm = null;
  let commentsEl = null;

  if (e.target.dataset.form === 'comment') {
    currentPostEl = e.target.closest('[data-type="post"]');
    const postId = Number(currentPostEl.dataset.postId);
    const findedPost = posts.find((item) => item.id === postId);
    currentCommentForm = currentPostEl.querySelector('[data-form=comment]');
    commentsEl = currentPostEl.querySelector('[data-post-part="comments"]');
    commentText = currentPostEl.querySelector('[data-id="text"]');
    const comment = JSON.stringify({
      id: 0,
      text: commentText.value.trim(),
    });
    if (!validation([commentText])) {
      return;
    }
    ajax(
      'POST',
      `${apiUrl}/${postId}/comments`,
      { 'Content-Type': 'application/json' },
      {
        onStart: () => {
          loader.spinner.show(currentPostEl);
          currentCommentForm.remove();
        },
        onSuccess: (data) => {
          commentsEl.innerHTML += makeCommentEl([JSON.parse(data)]);
          findedPost.comments.push(JSON.parse(data));
        },
        onFinish: () => {
          loader.spinner.hide();
          currentPostEl.insertBefore(createdFormEl, commentsEl);
          currentCommentForm.reset();
        },
      },
      comment
    );
  }
});

//Редактирование поста

formEl.addEventListener('click', (e) => {
  if (e.target.dataset.action === 'cancel') {
    formSetting.initialState();
  }
});

postsEl.addEventListener('click', (e) => {
  if (e.target.dataset.action === 'edit') {
    selectedPostEl = e.target.closest('[data-type="post"]');
    selectedPost = posts.find(
      (post) => post.id === Number(selectedPostEl.dataset.postId)
    );
    formSetting.editState();
  }
});
