const posts = [
  {
    id: 0,
    read: true,
  },
  {
    id: 1,
    read: false,
  },
  {
    id: 2,
    read: false,
  },
];

function hasUnread(items) {
  if (!items.length) {
    return false;
  }
  return items.some((item) => item.read === false);
}

const notify = hasUnread(posts);

console.log(notify);