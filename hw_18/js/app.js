'use strict';
const tabNasiaEl = document.querySelector('[data-tabpane="nasia"]');
const tabAlifmobiEl = document.querySelector('[data-tabpane="alifmobi"]');

const buttonNasiaEl = document.querySelector('[data-tab="nasia"]');
const buttonAlifmobiEl = document.querySelector('[data-tab="alifmobi"]');

tabAlifmobiEl.style.display = 'none';

buttonAlifmobiEl.onclick = () => {
  tabAlifmobiEl.style.display = 'block';
  tabNasiaEl.style.display = 'none';
};

buttonNasiaEl.onclick = () => {
  tabAlifmobiEl.style.display = 'none';
  tabNasiaEl.style.display = 'block';
};
