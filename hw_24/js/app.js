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
totalWrapperEl.textContent = 'Итоговой кэшбек: ';

const totalEl = document.createElement('span');
totalEl.dataset.id = 'total-cashback';
totalWrapperEl.appendChild(totalEl);

rootEl.appendChild(totalWrapperEl);

const errorEl = document.createElement('div');
errorEl.dataset.id = 'message';
const totalCashback = 0;
rootEl.appendChild(errorEl);
const priceSymbol = 'с.';
totalEl.textContent = `${totalCashback} ${priceSymbol}`;
const purchases = [];

const cashbackPercent = 0.5;
let nextID = 1;
const minPrice = 1;

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
  if (purchase.price <= minPrice) {
  }
  const currentCashback = () => {
    if (purchase.price <= minPrice) {
      return 0;
    }
    return getCahsback(purchase.price, cashbackPercent);
  };
  purchases.unshift(purchase);
  const listItemEl = document.createElement('li');
  listItemEl.textContent = `${purchase.name} на сумму ${
    purchase.price
  } ${priceSymbol} (кэшбек - ${currentCashback()} с.)`;
  listItemEl.dataset.purchaseId = purchase.id;
  const firstEl = listEl.children[0];
  if (firstEl) {
    listEl.insertBefore(listItemEl, firstEl);
  } else {
    listEl.appendChild(listItemEl);
  }

  let reducedCashback = purchases
    .map((item) => {
      if (item.price <= minPrice) {
        return 0;
      }
      return getCahsback(item.price, cashbackPercent);
    })
    .reduce((prev, curr) => prev + curr);
  if (reducedCashback <= 0) {
    reducedCashback = 0;
  }
  totalEl.textContent = `${reducedCashback} ${priceSymbol}`;

  formEl.reset();
  nameInput.focus();
};

function getCahsback(price, percent) {
  return (price / 100) * percent;
}
