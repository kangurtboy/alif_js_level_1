'use strict';
const loaderEl = document.querySelector('[data-id=loader]');

const maxTimeout = 5000;

function hideElement() {
  loaderEl.style.display = 'none';
}

setTimeout(hideElement, maxTimeout);
