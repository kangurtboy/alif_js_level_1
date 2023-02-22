'use strict';
const rootEl = document.getElementById('root');
const formEl = document.createElement('form');
formEl.dataset.id = 'purchase-form';
const nameInput = document.createElement('input');
nameInput.dataset.input = 'name';
const priceInput = document.createElement('input');
priceInput.dataset.input = 'price';
priceInput.type = 'number';
const addButton = document.createElement('button');
addButton.dataset.action = 'add';
addButton.textContent = 'Добавить';

formEl.appendChild(nameInput);
formEl.appendChild(priceInput);
formEl.appendChild(addButton);

rootEl.appendChild(formEl);

const listEl = document.createElement('ul');
listEl.dataset.id = 'purchases-list';
rootEl.appendChild(listEl);

const totalWrapperEl = document.createElement('div');
totalWrapperEl.textContent = 'Самая дорогая покупка: ';

const totalEl = document.createElement('span');
totalEl.dataset.id = 'most-expensive';
totalWrapperEl.appendChild(totalEl);

rootEl.appendChild(totalWrapperEl);

const errorEl = document.createElement('div');
errorEl.dataset.id = 'message';
rootEl.appendChild(errorEl);
const priceSymbol = 'с.';
totalEl.textContent = 'нет покупок';
let purchases = [];

let nextID = 1;

formEl.onsubmit = (e) => {
  e.preventDefault();
  errorEl.textContent = '';
  if (!nameInput.value) {
    errorEl.textContent = 'Значение поля не может быть пустым';
    nameInput.focus();
    return;
  }
  if (Number(priceInput.value) < 0) {
    errorEl.textContent = 'Введите число больше нуля!';
    priceInput.focus();
    return;
  }
  if (!priceInput.value) {
    errorEl.textContent = 'Значение поля не может быть пустым';
    priceInput.focus();
    return;
  }

  if (isNaN(Number(priceInput.value))) {
    errorEl.textContent = 'Введите только число';
    priceInput.focus();
    return;
  }
  const purchase = {
    id: nextID++,
    name: nameInput.value.trim(),
    price: Number(priceInput.value),
  };

  purchases.unshift(purchase);
  const removeButton = document.createElement('button');
  removeButton.dataset.action = 'remove';
  removeButton.textContent = 'Удалить';
  const listItemEl = document.createElement('li');
  listItemEl.textContent = `${purchase.name} на сумму ${purchase.price} ${priceSymbol} `;
  listItemEl.appendChild(removeButton);
  listItemEl.dataset.purchaseId = purchase.id;
  const firstEl = listEl.children[0];
  const mostExensive = getExpencivePurchase(purchases);
  totalEl.textContent = `${mostExensive.name} на сумму ${mostExensive.price} ${priceSymbol}`;
  if (firstEl) {
    listEl.insertBefore(listItemEl, firstEl);
  } else {
    listEl.appendChild(listItemEl);
  }
  formEl.reset();
  nameInput.focus();
};

listEl.onclick = (e) => {
  let currentItemEl = null;
  let removeButton = null;
  let removedId = null;
  if (e.target.textContent === 'Удалить') {
    removeButton = e.target;
    currentItemEl = removeButton.parentElement;
    currentItemEl.remove();
    removedId = Number(currentItemEl.dataset.purchaseId);
    purchases = purchases.filter((item) => item.id !== removedId);
  }
  const mostExensive = getExpencivePurchase(purchases);
  totalEl.textContent = `${mostExensive.name} на сумму ${mostExensive.price} ${priceSymbol}`;
  if (!listEl.children.length) {
    totalEl.textContent = 'нет покупок';
  }
};

function getExpencivePurchase(arr) {
  let result = arr
    .map((item) => item.price)
    .reduce((prev, curr) => {
      if (prev > curr) {
        return prev;
      }
      return curr;
    });
  result = arr.find((item) => item.price === result);

  return result;
}
