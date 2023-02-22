'use strict';
const rootEl = document.getElementById('root');
const obj = {
  tagname: 'div',
  attributes: {
    id: 'first',
    'data-id': 'first',
    class: 'primary',
  },
  text: 'Hello JS',
};

function makeElement(el) {
  const element = document.createElement(el.tagname);
  element.textContent = el.text;
  for (const item in el.attributes) {
    element.setAttribute(item, el.attributes[item]);
  }
  return element;
}
const createdEl = makeElement(obj);
rootEl.appendChild(createdEl);
