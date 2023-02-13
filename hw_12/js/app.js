'use strict';
function extractOwnerId(postId) {
  const selector = `[data-id="${postId}"]`;
  const ownerIdEl = document.querySelector(selector);
  return ownerIdEl.dataset.ownerid;
}

const postId = 1;

extractOwnerId(postId);