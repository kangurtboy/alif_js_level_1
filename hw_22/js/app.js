'use strict';

const posts = [
  { id: 3, type: 'text', content: 'Final Week!' },
  { id: 2, type: 'image', content: 'img/logo_js.svg' },
  { id: 1, type: 'video', content: 'video/video.mp4' },
];

const rootEl = document.getElementById('root');

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

makeWall(rootEl, posts);
