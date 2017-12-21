'use strict';

(function () {
  var TIMEOUT = 10000;


  var getData = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT;


    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
      } else {
        onError('Произошла ошибка ' + xhr.status);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });


    return xhr;
  };

  var download = function (url, onSuccess, onError) {
    var xhr = getData(onSuccess, onError);

    xhr.open('GET', url);
    xhr.send();
  };

  var upload = function (url, data, onSuccess, onError) {
    var xhr = getData(onSuccess, onError);

    xhr.open('POST', url);
    xhr.send(data);
  };


  window.xhr = {
    download: download,
    upload: upload
  };
})();
