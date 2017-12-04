'use strict';

/** Количество нужных объявлений */
var OFFERS_COUNT = 8;


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

var ALL_CHECKOUTS = ALL_CHECKINS.slice();

/**
 * Генерирует случайное число от min до max. Если без третьего параметра --- не включая max, с --- включая max
 * @param {number} min
 * @param {number} max
 * @param {boolean} [includeMax] - необязателен. Если true, то генерирует включая max, если false --- не включая
 * @return {number}
 */
var getRandomNum = function (min, max, includeMax) {
  includeMax = includeMax ? 1 : 0;
  return Math.floor(Math.random() * (max - min + includeMax) + min);
};

/**
 * Возвращает случайный элемент массива
 * @param {Array} srcArray
 * @return {string}
 */
var getRandomElem = function (srcArray) {
  return srcArray[getRandomNum(0, srcArray.length)];
};

/**
 * Возвращает массив значений произвольной длины. Значений может не быть совсем, или могут быть все
 * @param {Array} srcArray
 * @return {Array}
 */
var getArrayOfRandomLength = function (srcArray) {
  var randomLength = getRandomNum(0, srcArray.length, true);

  return srcArray.slice(0, randomLength);
};

/**
 * Превращает число в строку, добавляя ноль перед num-числом к однозначным num
 * @param {number} num
 * @return {string}
 */
var addZero = function (num) {
  return (num < 10 ? '0' : '') + num;
};

/**
 * Возвращает адрес изображения
 * @param {number} avatar
 * @return {string}
 */
var getAvatarUrl = function (avatar) {
  return 'img/avatars/user' + addZero(avatar) + '.png';
};

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
    var x = getRandomNum(300, 900, true);
    var y = getRandomNum(100, 500, true);

    currentOffer = {
      author: {
        avatar: getAvatarUrl(i + 1)
      },
      offer: {
        title: getRandomElem(ALL_TITLES),
        address: x + ', ' + y,
        price: getRandomNum(1000, 1000000, true),
        type: getRandomElem(Object.keys(ALL_TYPES)),
        rooms: getRandomNum(1, 5, true),
        guests: getRandomNum(1, 10, true),
        checkin: getRandomElem(ALL_CHECKINS),
        checkout: getRandomElem(ALL_CHECKOUTS),
        features: getArrayOfRandomLength(ALL_FEATURES),
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

var offersArray = getArrayOfOffers(OFFERS_COUNT);
var CURRENT_OFFER = offersArray[0];


var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var pinImgElem = pinTemplate.querySelector('img');

/** Константы пина */
var PIN_HEIGHT = 18;
var PIN_OFFSET_X = pinImgElem.getAttribute('width') / 2;
var PIN_OFFSET_Y = parseFloat(pinImgElem.getAttribute('height')) + PIN_HEIGHT;

/**
 * Готовит фрагмент пина
 * @param {Object} coordinates
 * @param {string} avatar
 * @return {HTMLElement}
 */
var createPinElem = function (coordinates, avatar) {
  var pinElem = pinTemplate.cloneNode(true);
  pinElem.querySelector('img').src = avatar;

  pinElem.style.left = coordinates.x - PIN_OFFSET_X + 'px';
  pinElem.style.top = coordinates.y - PIN_OFFSET_Y + 'px';
  pinElem.classList.add('map__pin');

  return pinElem;
};

/**
 * Рендерит фрагмент пина
 * @param {Array} offers
 * @return {DocumentFragment}
 */
var renderPins = function (offers) {
  var pinFragment = document.createDocumentFragment();

  offers.forEach(function (offer) {
    pinFragment.appendChild(createPinElem(offer.location, offer.author.avatar));
  });

  return pinFragment;
};

/**
 * Готовит фрагмент фичи
 * @param {string} feature
 * @return {HTMLElement}
 */
var createFeaturesElem = function (feature) {
  var featureElem = document.createElement('li');
  featureElem.classList.add('feature', 'feature--' + feature);

  return featureElem;
};

/**
 * Рендерит фрагмент фичи
 * @param {Array} featuresArray
 * @return {DocumentFragment}
 */
var renderFeaturesElem = function (featuresArray) {
  var featuresFragment = document.createDocumentFragment();

  featuresArray.forEach(function (feature) {
    featuresFragment.appendChild(createFeaturesElem(feature));
  });

  return featuresFragment;
};

/**
 * Отрисовывает объявление
 * @param {Object} currentOffer
 * @return {HTMLElement}
 */
var renderOffer = function (currentOffer) {
  var offerElem = document.querySelector('template').content.querySelector('article.map__card').cloneNode(true);

  offerElem.querySelector('h3').textContent = currentOffer.offer.title;
  offerElem.querySelector('p small').textContent = currentOffer.offer.address;
  offerElem.querySelector('.popup__price').textContent = currentOffer.offer.price + '₽/ночь';
  offerElem.querySelector('h4').textContent = ALL_TYPES[currentOffer.offer.type];
  offerElem.querySelector('h4 + p').textContent = currentOffer.offer.rooms + ' комнаты для ' + currentOffer.offer.guests + ' гостей';
  offerElem.querySelector('h4 + p + p').textContent = 'Заезд после ' + currentOffer.offer.checkin + ',' + ' выезд до ' + currentOffer.offer.checkout;
  offerElem.querySelector('.popup__avatar').src = currentOffer.author.avatar;
  offerElem.querySelector('ul + p').textContent = '';
  offerElem.querySelector('.popup__features').innerHTML = '';

  return offerElem;
};

/**
 * Отрисовывает всю карту вместе с пинами и попапом-объявлением
 */
var renderMap = function () {
  var mapElem = document.querySelector('.map');
  var mapPinsElem = mapElem.querySelector('.map__pins');
  mapElem.classList.remove('map--faded');

  var fragment = document.createDocumentFragment();

  var mapFiltersElem = document.querySelector('.map__filters-container');
  var offerElem = renderOffer(CURRENT_OFFER);

  offerElem.querySelector('.popup__features').appendChild(renderFeaturesElem(CURRENT_OFFER.offer.features));
  mapPinsElem.appendChild(renderPins(offersArray));
  fragment.appendChild(offerElem);
  mapFiltersElem.appendChild(fragment);
};

renderMap();
