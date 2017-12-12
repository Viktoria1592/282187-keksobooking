'use strict';

var mapElem = document.querySelector('.map');

var mapPinsElem = mapElem.querySelector('.map__pins');
var mapPinMainElem = mapElem.querySelector('.map__pin--main');

var mapFiltersFormElem = mapElem.querySelector('.map__filters');
var noticeFormElem = document.querySelector('.notice__form');

window.forms.toggleDisabledOnFormElems(noticeFormElem, true);
window.forms.toggleDisabledOnFormElems(mapFiltersFormElem, true);


/** Отрисовывает пины, энаблит элементы форм */
var enableInteractivity = function () {
  mapElem.classList.remove('map--faded');
  noticeFormElem.classList.remove('notice__form--disabled');

  window.forms.toggleDisabledOnFormElems(noticeFormElem, false);
  window.forms.toggleDisabledOnFormElems(mapFiltersFormElem, false);

  window.pins.renderPins(window.offersData.offersArray);
};

/**
 * При первом клике запускает интерактивность, потом убивает слушателей на повторный запуск (не нужен)
 */
var onUserPinMouseUp = function () {
  enableInteractivity();
  mapPinMainElem.removeEventListener('mouseup', onUserPinMouseUp);
  mapPinMainElem.removeEventListener('keydown', onUserPinEnterPress);
};

/**
 * При первом нажатии запускает интерактивность, потом убивает слушателей на повторный запуск (не нужен)
 * @param {KeyboardEvent} event
 */
var onUserPinEnterPress = function (event) {
  if (event.keyCode === window.constants.ENTER_KEYCODE || event.keyCode === window.constants.SPACE_KEYCODE) {
    enableInteractivity();
    mapPinMainElem.removeEventListener('keydown', onUserPinEnterPress);
    mapPinMainElem.removeEventListener('mouseup', onUserPinMouseUp);
  }
};

mapPinMainElem.addEventListener('mouseup', onUserPinMouseUp);
mapPinMainElem.addEventListener('keydown', onUserPinEnterPress);

mapPinsElem.addEventListener('click', window.pins.onOfferPinClick);
