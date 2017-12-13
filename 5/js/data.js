'use strict';

/**
 * Объект объявления
 * @typedef {Object} data
 * @property {Object} data.author
 * @property {Object} data.offer
 * @property {Object} data.location
 *
 * @property {string} data.author.avatar
 *
 * @property {string} data.offer.title
 * @property {string} data.offer.address
 * @property {number} data.offer.price
 * @property {string} data.offer.type
 * @property {number} data.offer.rooms
 * @property {number} data.offer.guests
 * @property {string} data.offer.checkin
 * @property {string} data.offer.checkout
 * @property {Array} data.offer.features
 * @property {string} data.offer.description
 * @property {Array} data.offer.photos
 *
 * @property {number} data.location.x
 * @property {number} data.location.y
 */

(function () {
  /** Массивы-константы, полученные из ТЗ */
  var TITLES = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];

  var FEATURES = [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ];

  var TYPES = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом'
  };

  var CHECKINS = [
    '12:00',
    '13:00',
    '14:00'
  ];

  var CHECKOUTS = [
    '12:00',
    '13:00',
    '14:00'
  ];


  /**
   * Возвращает адрес изображения
   * @param {number} img
   * @return {string}
   */
  var getAvatarUrl = function (img) {
    return 'img/avatars/user' + window.utils.addZero(img) + '.png';
  };

  /**
   * Создает массив объявлений
   * @param {number} count - Количество нужных объявлений
   * @return {Array}
   */
  var getOffers = function (count) {
    var offersArray = [];
    var currentOffer;

    for (var i = 0; i < count; i += 1) {
      /** Получаем координаты для использования в массивах */
      var x = window.utils.getRandomNum(300, 900, true);
      var y = window.utils.getRandomNum(100, 500, true);

      currentOffer = {
        author: {
          avatar: getAvatarUrl(i + 1)
        },
        offer: {
          title: TITLES[i],
          address: x + ', ' + y,
          price: window.utils.getRandomNum(1000, 1000000, true),
          type: window.utils.getRandomElem(Object.keys(TYPES)),
          rooms: window.utils.getRandomNum(1, 5, true),
          guests: window.utils.getRandomNum(1, 10, true),
          checkin: window.utils.getRandomElem(CHECKINS),
          checkout: window.utils.getRandomElem(CHECKOUTS),
          features: window.utils.getArrayOfRandomLength(FEATURES),
          description: '',
          photos: []
        },
        location: {
          x: x,
          y: y
        }
      };
      offersArray.push(currentOffer);
    }

    return offersArray;
  };


  window.data = {
    /** @type {Array.<data.offer.type>} */
    types: TYPES,
    getOffers: getOffers(window.constants.OFFERS_COUNT)
  };
})();
