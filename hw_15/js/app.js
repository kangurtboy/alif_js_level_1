'use strict';
const countStep = 10;
const intervalStep = 1000;
setInterval(() => {
  const counterEl = document.querySelector('[data-id=counter]');
  counterEl.__counterValue = Number.parseInt(counterEl.textContent);
  counterEl.__counterValue += countStep;
  counterEl.textContent = counterEl.__counterValue;
}, intervalStep);
