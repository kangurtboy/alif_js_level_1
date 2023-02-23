'use strict';

function ajax(method, url, headers, callbacks, body) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  if (callbacks.onStart) {
    callbacks.onStart();
  }

  if (headers) {
    for (const item in headers) {
      xhr.setRequestHeader(item, headers[item]);
    }
  }
  xhr.onload = () => {
    if (xhr.status < 200 || xhr.status > 299) {
      if (callbacks.onError) {
        callbacks.onError(xhr.statusText);
      }
      return;
    }
    callbacks.onSuccess(xhr.responseText);
  };

  xhr.onloadend = () => {
    callbacks.onFinish();
  };
  if (method === 'GET') {
    xhr.send();
  } else {
    xhr.send(body);
  }
}

// const functions = {
//   onStart: () => {},
//   onFinish: () => {},
//   onSuccess: (data) => {},
//   onError: (data) => {},
// };
