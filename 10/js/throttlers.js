'use strict';
(function () {
  /** Длительность задержки между обновлением элемента */
  var DEBOUNCE_INTERVAL = 400;
  var lastTimeout;

  window.debounce = function (callback) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(callback, DEBOUNCE_INTERVAL);
  };
})();
