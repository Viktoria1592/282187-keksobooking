'use strict';

(function () {
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var pinImgElem = pinTemplate.querySelector('img');

  var PIN_NEEDLE_HEIGHT = 18;


  window.constants = {
    /** Константы клавиатурных кодов */
    ESC_KEYCODE: 27,
    ENTER_KEYCODE: 13,
    SPACE_KEYCODE: 32,


    /** Количество нужных объявлений */
    OFFERS_COUNT: 8,


    /** Массивы-константы, полученные из ТЗ */
    ALL_TITLES: [
      'Большая уютная квартира',
      'Маленькая неуютная квартира',
      'Огромный прекрасный дворец',
      'Маленький ужасный дворец',
      'Красивый гостевой домик',
      'Некрасивый негостеприимный домик',
      'Уютное бунгало далеко от моря',
      'Неуютное бунгало по колено в воде'
    ],

    ALL_FEATURES: [
      'wifi',
      'dishwasher',
      'parking',
      'washer',
      'elevator',
      'conditioner'
    ],

    ALL_TYPES: {
      flat: 'Квартира',
      bungalo: 'Бунгало',
      house: 'Дом'
    },

    ALL_CHECKINS: [
      '12:00',
      '13:00',
      '14:00'
    ],

    ALL_CHECKOUTS: [
      '12:00',
      '13:00',
      '14:00'
    ],


    /** Константы пина */
    PIN_NEEDLE_HEIGHT: PIN_NEEDLE_HEIGHT,
    PIN_OFFSET_X: pinImgElem.getAttribute('width') / 2,
    PIN_OFFSET_Y: parseFloat(pinImgElem.getAttribute('height')) + PIN_NEEDLE_HEIGHT,


    /** Константы минимальных цен */
    MIN_PRICES: {
      bungalo: '0',
      flat: '1000',
      house: '5000',
      palace: '10000'
    },


    /** Константа количества гостей, при котором бронь будет считаться "не для гостей"  */
    NOT_FOR_GUESTS_VALUE: 100
  };
})();

