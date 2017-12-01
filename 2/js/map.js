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

var ALL_TYPES = [
  'flat',
  'house',
  'bungalo'
];

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
 * @param {boolean} includeMax - Необязателен. Если true, то генерирует включая max, если false --- не включая
 * @return {number}
 */
var getRandomNum = function (min, max, includeMax) {
  if (includeMax) {
    includeMax = 1;
  } else {
    includeMax = 0;
  }

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
  var randomLengthArray = [];
  var randomLength = getRandomNum(0, srcArray.length, true);
  for (var i = 0; i < randomLength; i += 1) {
    randomLengthArray.push(srcArray[i]);
  }

  return randomLengthArray;
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
 * Преобразует тип в русское название. Если тип был передан в объекте - сначала преобразует его в строку
 * @param {string} type
 * @return {string}
 */
var translateType = function (type) {
  switch (type) {
    case 'flat':
      return 'Квартира';
    case 'bungalo':
      return 'Бунгало';
    case 'house':
      return 'Дом';
  }

  return type;
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
        type: getRandomElem(ALL_TYPES),
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

var arrayOfOffers = getArrayOfOffers(OFFERS_COUNT);
var CURRENT_OFFER = arrayOfOffers[0];

/**
 * Готовит фрагмент пина
 * @param {Object} coordinates
 * @param {string} avatar
 * @return {HTMLButtonElement}
 */
var createPinElem = function (coordinates, avatar) {
  var currentPin = document.createElement('button');
  var pinImage = document.createElement('img');

  pinImage.setAttribute('width', '40');
  pinImage.setAttribute('height', '40');
  pinImage.setAttribute('draggable', 'false');
  pinImage.src = avatar;

  var PIN_HEIGHT = 18;
  var OFFSET_X = pinImage.getAttribute('width') / 2;
  var OFFSET_Y = +pinImage.getAttribute('height') + PIN_HEIGHT;
  console.log(OFFSET_Y);

  currentPin.style.left = coordinates.x - OFFSET_X + 'px';
  currentPin.style.top = coordinates.y - OFFSET_Y + 'px';
  currentPin.classList.add('map__pin');

  currentPin.appendChild(pinImage);

  return currentPin;
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
 * @param {Object} feature
 * @return {HTMLLIElement}
 */
var createFeaturesElem = function (feature) {
  var currentLi = document.createElement('li');
  currentLi.classList.add('feature', 'feature--' + feature);

  return currentLi;
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
 * @return {Element}
 */
var renderOffer = function (currentOffer) {
  var offerTemplate = document.querySelector('template').content.querySelector('article.map__card');

  offerTemplate.querySelector('h3').textContent = currentOffer.offer.title;
  offerTemplate.querySelector('p small').textContent = currentOffer.offer.address;
  offerTemplate.querySelector('.popup__price').textContent = currentOffer.offer.price + '₽/ночь';
  offerTemplate.querySelector('h4').textContent = translateType(currentOffer.offer.type);
  offerTemplate.querySelector('h4 + p').textContent = currentOffer.offer.rooms + ' комнаты для ' + currentOffer.offer.guests + ' гостей';
  offerTemplate.querySelector('h4 + p + p').textContent = 'Заезд после ' + currentOffer.offer.checkin + ',' + ' выезд до ' + currentOffer.offer.checkout;
  offerTemplate.querySelector('.popup__avatar').src = currentOffer.author.avatar;
  offerTemplate.querySelector('ul + p').textContent = '';
  offerTemplate.querySelector('.popup__features').innerHTML = '';

  return offerTemplate;
};

/**
 * Отрисовывает всю карту вместе с пинами и попапом-объявлением
 */
var renderMap = function () {
  document.querySelector('.map').classList.remove('map--faded');

  var fragment = document.createDocumentFragment();

  var mapFilters = document.querySelector('.map__filters-container');
  var offerTemplate = renderOffer(CURRENT_OFFER);

  offerTemplate.querySelector('.popup__features').appendChild(renderFeaturesElem(CURRENT_OFFER.offer.features));
  fragment.appendChild(offerTemplate);
  fragment.appendChild(renderPins(arrayOfOffers));
  mapFilters.appendChild(fragment);
};

renderMap();
