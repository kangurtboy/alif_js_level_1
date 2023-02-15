'use strict';
const nokia = {
  price: 239,
  maxQty: 10,
  minQty: 1,
};

const order = {
  price: 239,
  id: 34,
  qty: 1,
  message: '',
};

const messages = {
  minQty: `${nokia.minQty} шт - минимальный размер заказа`,
  maxQty: `${nokia.maxQty} шт - максимум в одни руки`,
};

const priceSymbol = ' с.';

const productEl = {
  inc: document.querySelector('[data-action=inc]'),
  dec: document.querySelector('[data-action=dec]'),
  message: document.querySelector('[data-id="message"]'),
  total: document.querySelector('[data-id="total"]'),
  qty: document.querySelector('[data-id="qty"]'),
};

productEl.qty.textContent = nokia.minQty;
productEl.total.textContent = nokia.price + priceSymbol;

productEl.inc.onclick = () => {
  order.qty++;
  if (order.qty <= nokia.maxQty) {
    order.price = nokia.price * order.qty;
    productEl.total.textContent = order.price + priceSymbol;
    productEl.qty.textContent = order.qty;
    productEl.message.textContent = '';
  }

  if (order.qty > nokia.maxQty) {
    productEl.message.textContent = messages.maxQty;
    order.qty = nokia.maxQty;
  }
};

productEl.dec.onclick = () => {
  order.qty--;
  if (order.qty > 0) {
    order.price = nokia.price * order.qty;
    productEl.total.textContent = order.price + priceSymbol;
    productEl.qty.textContent = order.qty;
    productEl.message.textContent = '';
  }

  if (order.qty < nokia.minQty) {
    productEl.message.textContent = messages.minQty;
    order.qty = nokia.minQty;
  }
};
