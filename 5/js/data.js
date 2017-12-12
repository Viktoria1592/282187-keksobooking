'use strict';

/**
 * Объект объявления
 * @typedef {Object} OfferObj
 * @property {Object} OfferObj.author
 * @property {Object} OfferObj.offer
 * @property {Object} OfferObj.location
 *
 * @property {string} OfferObj.author.avatar
 *
 * @property {string} OfferObj.offer.title
 * @property {string} OfferObj.offer.address
 * @property {number} OfferObj.offer.price
 * @property {string} OfferObj.offer.type
 * @property {number} OfferObj.offer.rooms
 * @property {number} OfferObj.offer.guests
 * @property {string} OfferObj.offer.checkin
 * @property {string} OfferObj.offer.checkout
 * @property {Array} OfferObj.offer.features
 * @property {string} OfferObj.offer.description
 * @property {Array} OfferObj.offer.photos
 *
 * @property {number} OfferObj.location.x
 * @property {number} OfferObj.location.y
 */

(function () {
  /** Массивы-константы, полученные из ТЗ */
  var ALL_TITLES = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];

  var ALL_FEATURES = [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ];

  var ALL_TYPES = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом'
  };

  var ALL_CHECKINS = [
    '12:00',
    '13:00',
    '14:00'
  ];

  var ALL_CHECKOUTS = [
    '12:00',
    '13:00',
    '14:00'
  ];


  /**
   * Создает массив объявлений
   * @param {number} count - Количество нужных объявлений
   * @return {Array}
   */
  var getArrayOfOffers = function (count) {
    var offersArray = [];
    var currentOffer;

    for (var i = 0; i < count; i += 1) {
      /** Получаем координаты для использования в массивах */
      var x = window.utils.getRandomNum(300, 900, true);
      var y = window.utils.getRandomNum(100, 500, true);

      currentOffer = {
        author: {
          avatar: window.utils.getAvatarUrl(i + 1)
        },
        offer: {
          title: ALL_TITLES[i],
          address: x + ', ' + y,
          price: window.utils.getRandomNum(1000, 1000000, true),
          type: window.utils.getRandomElem(Object.keys(ALL_TYPES)),
          rooms: window.utils.getRandomNum(1, 5, true),
          guests: window.utils.getRandomNum(1, 10, true),
          checkin: window.utils.getRandomElem(ALL_CHECKINS),
          checkout: window.utils.getRandomElem(ALL_CHECKOUTS),
          features: window.utils.getArrayOfRandomLength(ALL_FEATURES),
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
    /** @type {Array.<OfferObj>} */
    types: ALL_TYPES,
    getOffers: getArrayOfOffers(window.constants.OFFERS_COUNT)
  };
})();
