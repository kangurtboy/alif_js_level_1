'use strict';
const post = {
  id: 1,
  userLiked: false,
};

const likeEl = document.querySelector('[data-action="like"]');
const imgEl = likeEl.querySelector('[data-id="img"]');

const imgLike = 'img/liked.svg';
const imgDisLike = 'img/unliked.svg';

likeEl.addEventListener('click', () => {
  if (!post.userLiked) {
    imgEl.src = imgLike;
    post.userLiked = true;
  } else {
    imgEl.src = imgDisLike;
    post.userLiked = false;
  }
});
