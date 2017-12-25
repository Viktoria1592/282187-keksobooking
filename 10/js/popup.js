'use strict';

(function () {
  /** Отнимает у активного пина активность, закрывает попап  */
  var close = function () {
    var popupElem = document.querySelector('.map__card');
    window.pins.deselect();
    popupElem.classList.add('hidden');
  };

  var onEscPress = function (event) {
    if (event.keyCode === window.constants.Keycode.ESC) {
      close();
    }
  };

  /** Вешает закрывателей на ноду попапа */
  var addCloseHandlers = function () {
    var closeElem = document.querySelector('.popup__close');
    closeElem.addEventListener('click', function () {
      close();
    });

    document.addEventListener('keydown', onEscPress);
  };


  var render = function (offer) {
    window.utils.createOrReplaceElem('.map__filters-container', window.offer.createElem(offer), '.map__card');
    addCloseHandlers();
  };


  window.popup = {
    render: render
  };
})();
