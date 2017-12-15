'use strict';

(function () {
  var mapElem = document.querySelector('.map');
  var overlayElem = mapElem.querySelector('.map__pinsoverlay');

  var pinsElem = mapElem.querySelector('.map__pins');
  var pinMainElem = mapElem.querySelector('.map__pin--main');

  var filtersFormElem = mapElem.querySelector('.map__filters');
  var noticeFormElem = document.querySelector('.notice__form');

  var addressInputElem = document.querySelector('#address[readonly]');


  pinMainElem.style.zIndex = '5';


  /** Константы размеров пользовательского пина */
  var NEEDLE_HEIGHT = 22;
  var USER_PIN_NEEDLE_POSITION = pinMainElem.offsetWidth / 2;
  var USER_PIN_HEIGHT = pinMainElem.offsetHeight + NEEDLE_HEIGHT;

  /** Константы лимита таскания пина */
  var LIMIT_Y = {
    min: 100,
    max: overlayElem.offsetHeight - 500
  };


  /** Отрисовывает пины, энаблит элементы форм */
  var enableInteractivity = function () {
    mapElem.classList.remove('map--faded');
    noticeFormElem.classList.remove('notice__form--disabled');

    window.forms.toggleDisabledOnElems(noticeFormElem, false);
    window.forms.toggleDisabledOnElems(filtersFormElem, false);

    window.pins.render(window.data.getOffers);
  };

  /**
   * При первом клике запускает интерактивность, потом убивает слушателей на повторный запуск (не нужен)
   */
  var onUserPinMouseUp = function () {
    enableInteractivity();
    pinMainElem.removeEventListener('mouseup', onUserPinMouseUp);
    pinMainElem.removeEventListener('keydown', onUserPinEnterPress);
  };

  /**
   * При первом нажатии запускает интерактивность, потом убивает слушателей на повторный запуск (не нужен)
   * @param {KeyboardEvent} event
   */
  var onUserPinEnterPress = function (event) {
    if (event.keyCode === window.constants.ENTER_KEYCODE || event.keyCode === window.constants.SPACE_KEYCODE) {
      enableInteractivity();
      pinMainElem.removeEventListener('keydown', onUserPinEnterPress);
      pinMainElem.removeEventListener('mouseup', onUserPinMouseUp);
    }
  };

  var onCoordPinMouseUp = function () {
    var coords = {
      x: pinMainElem.offsetLeft + USER_PIN_NEEDLE_POSITION,
      y: pinMainElem.offsetTop + USER_PIN_HEIGHT
    };

    addressInputElem.value = 'x: ' + coords.x + ', y: ' + coords.y;
  };


  window.utils.enableDragging(pinMainElem, pinMainElem, LIMIT_Y);
  window.forms.toggleDisabledOnElems(noticeFormElem, true);
  window.forms.toggleDisabledOnElems(filtersFormElem, true);

  pinMainElem.addEventListener('mouseup', onUserPinMouseUp);
  pinMainElem.addEventListener('mouseup', onCoordPinMouseUp);
  pinMainElem.addEventListener('keydown', onUserPinEnterPress);

  pinsElem.addEventListener('click', window.pins.onClick);
})();
