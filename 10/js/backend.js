'use strict';

(function () {
  /** Константа ошибки по таймауту */
  var TIMEOUT = 3000;

  var SERVER_STATUS_OK = 200;
  /** Константа подрезания принимаемых данных (когда все, что отдает сервер не нужно)*/

  var RESPONSE_DATA_LENGTH = 5;

  var ERRORS = {
    timeoutExceeded: function (timeout) {
      return 'Запрос не успел выполниться за ' + timeout + ' мс';
    },

    generalError: function (error) {
      return 'Произошла ошибка ' + error;
    },

    connectionError: function () {
      return 'Произошла ошибка соединения';
    }
  };

  /**
   * Подрезает полученный из сервера массив данных
   * @param {Array} response - Ответ сервера
   * @return {Array}
   */
  var trimXhrGetResponse = function (response) {
    return response.slice(0, RESPONSE_DATA_LENGTH);
  };

  var createXhr = function (responseType, timeout) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = responseType;
    xhr.timeout = timeout;

    return xhr;
  };

  /**
   * Обрабатывает полученный ответ сервера
   * @param {Function} onSuccess - При успешном ответе передает коллбеку данные внутри ответа
   * @param {Function} onError - При ошибке использует константы ошибок и передает их коллбеку
   * @param {Function} [responseModifier] - Если нужно обработать успешный ответ
   * @return {XMLHttpRequest}
   */
  var processHxr = function (onSuccess, onError, responseModifier) {
    var xhr = createXhr('json', TIMEOUT);

    xhr.addEventListener('load', function () {
      if (xhr.status === SERVER_STATUS_OK) {
        if (responseModifier) {
          onSuccess(responseModifier(xhr.response));
        } else {
          onSuccess(xhr.response);
        }
      } else {
        onError(ERRORS.generalError(xhr.status));
      }
    });

    xhr.addEventListener('error', function () {
      onError(ERRORS.connectionError());
    });

    xhr.addEventListener('timeout', function () {
      onError(ERRORS.timeoutExceeded(xhr.timeout));
    });


    return xhr;
  };


  /**
   * Обработка GET-запроса
   * @param {string} url
   * @param {Function} onSuccess
   * @param {Function} onError
   */
  var get = function (url, onSuccess, onError) {
    var response = processHxr(onSuccess, onError, trimXhrGetResponse);

    response.open('GET', url);
    response.send();
  };

  /**
   * Обработка POST-запроса
   * @param {string} url
   * @param {FormData} data - Посылаемые данные
   * @param {Function} onSuccess
   * @param {Function} onError
   */
  var post = function (url, data, onSuccess, onError) {
    var response = processHxr(onSuccess, onError);

    response.open('POST', url);
    response.send(data);
  };


  window.backend = {
    get: get,
    post: post
  };
})();
