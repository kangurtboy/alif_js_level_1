'use strict';
const photoEl = document.querySelector('[data-id="photo"]');
const photos = [
  {
    id: 1,
    src: 'https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    alt: 'photo-1',
  },
  {
    id: 2,
    src: 'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    alt: 'photo-2',
  },
  {
    id: 3,
    src: 'https://images.pexels.com/photos/7292745/pexels-photo-7292745.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    alt: 'photo-3',
  },
  {
    id: 4,
    src: 'https://images.pexels.com/photos/2909077/pexels-photo-2909077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    alt: 'photo-4',
  },
];

function bindPhotoToViewer(photo, el) {
  const prevEl = document.querySelector('[data-action="prev"]');
  const nextEl = document.querySelector('[data-action=next]');
  const maxLength = photo.length - 1;
  let currentIndex = 0;
  el.src = photo[currentIndex].src;
  el.alt = photo[currentIndex].alt;

  nextEl.onclick = () => {
    currentIndex++;
    if (currentIndex < photo.length) {
      el.src = photo[currentIndex].src;
      el.alt = photo[currentIndex].alt;
    }
    if (currentIndex === photo.length) {
      currentIndex = 0;
      el.src = photo[currentIndex].src;
      el.alt = photo[currentIndex].alt;
    }
  };

  prevEl.onclick = () => {
    currentIndex--;

    if (currentIndex < 0) {
      currentIndex = maxLength;
      el.src = photo[currentIndex].src;
      el.alt = photo[currentIndex].alt;
    }
    if (photo[currentIndex].src) {
      el.src = photo[currentIndex].src;
      el.alt = photo[currentIndex].alt;
    }
  };
}

bindPhotoToViewer(photos, photoEl);
