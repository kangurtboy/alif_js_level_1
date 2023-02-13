'use strict';
const postsEl = document.querySelector('[data-id = posts]');
function thanosEffect(el) {
  const elements = Array.from(el.children);
  const filtered = elements.filter(
    (item , index) => index % 2 === 0
  );
  filtered.forEach((item) => {
    item.style.visibility = 'hidden';
  });
}

thanosEffect(postsEl);
