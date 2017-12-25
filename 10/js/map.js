'use strict';

(function () {
  var mapElem = document.querySelector('.map');
  var overlayElem = mapElem.querySelector('.map__pinsoverlay');

  var pinsElem = mapElem.querySelector('.map__pins');
  var pinMainElem = mapElem.querySelector('.map__pin--main');

  var filtersFormElem = mapElem.querySelector('.map__filters');
  var noticeFormElem = document.querySelector('.notice__form');


  /** Константы размеров пользовательского пина */
  var NEEDLE_HEIGHT = 22;
  var USER_PIN_NEEDLE_POSITION = pinMainElem.offsetWidth / 2;
  var USER_PIN_HEIGHT = pinMainElem.offsetHeight + NEEDLE_HEIGHT;

  /** Константа лимита таскания пина */
  var PIN_LIMITS = {
    y: {
      top: 100,
      /** Нижний предел рассчитывается через
       *  высоту отца - высоту таскаемого элемента - 500 */
      bottom: overlayElem.offsetHeight - pinMainElem.offsetHeight - 500
    }
  };

  var mapData = [];


  var onBackendGetSuccess = function (data) {
    window.pins.render(data);
    window.forms.enableFiltering(data);

    mapData = data;
  };

  var onBackendGetError = function (error) {
    window.forms.toggleDisabledOnElems(filtersFormElem, true);
    window.utils.createErrorMessageElem(error, 'error');
  };


  /** Отрисовывает пины, энаблит элементы форм */
  var enableInteractivity = function () {
    mapElem.classList.remove('map--faded');
    noticeFormElem.classList.remove('notice__form--disabled');

    window.forms.toggleDisabledOnElems(noticeFormElem, false);
    window.forms.toggleDisabledOnElems(filtersFormElem, false);

    window.backend.get(window.constants.serverUrl.DOWNLOAD, onBackendGetSuccess, onBackendGetError);
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

  var onOfferPinClick = function (event) {
    window.pins.onClick(event, mapData);
  };

  var removeInitialPinPopupSync = function () {
    pinsElem.removeEventListener('click', onOfferPinClick);
  };

  var getPinMainElemPosition = function () {
    return {
      x: pinMainElem.offsetLeft,
      y: pinMainElem.offsetTop
    };
  };

  /**
   * Получает координаты пина, вычисляет координаты иголки пина, передает их в поле адреса
   * @param {Object} position
   */
  var getPinElemNeedleCoords = function (position) {
    var updatedCoords = {
      x: position.x + USER_PIN_NEEDLE_POSITION,
      y: position.y + USER_PIN_HEIGHT
    };

    window.forms.onCoordsChange(updatedCoords);
  };

  var setAddressCoords = function () {
    getPinElemNeedleCoords(getPinMainElemPosition());
  };


  setAddressCoords();

  window.utils.enableDragging(pinMainElem, pinMainElem, PIN_LIMITS, getPinElemNeedleCoords);
  window.forms.toggleDisabledOnElems(noticeFormElem, true);
  window.forms.toggleDisabledOnElems(filtersFormElem, true);

  pinMainElem.addEventListener('mouseup', onUserPinMouseUp);
  pinMainElem.addEventListener('keydown', onUserPinEnterPress);
  pinsElem.addEventListener('click', onOfferPinClick);


  window.map = {
    pinsElem: pinsElem,
    setAddressCoords: setAddressCoords,
    removeInitialPinPopupSync: removeInitialPinPopupSync
  };
})();
