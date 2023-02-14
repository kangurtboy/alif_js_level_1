'use strict';

const player = {
  videoEl: document.querySelector('[data-id="video"]'),
  playBtnEl: document.querySelector('[data-action="play"]'),
  pauseBtnEl: document.querySelector('[data-action="pause"]'),
  volumePlusEl: document.querySelector('[data-action="volume-plus"]'),
  volumeMinusEl: document.querySelector('[data-action="volume-minus"]'),
};
const volumeStep = 0.1;
const maxVolume = 1;

player.playBtnEl.onclick = () => {
  player.videoEl.play();
};

player.pauseBtnEl.onclick = () => {
  player.videoEl.pause();
};

player.volumePlusEl.onclick = () => {
  if (player.videoEl.volume < maxVolume) {
    player.videoEl.volume += volumeStep;
  }
};

player.volumeMinusEl.onclick = () => {
  if (player.videoEl.volume > volumeStep) {
    player.videoEl.volume -= volumeStep;
  }
};
