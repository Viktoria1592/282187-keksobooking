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
 * Превращает число в строку, добавляя ноль перед num-числом к однозначным num
 * @param {number} num
 * @return {string}
 */
var addZero = function (num) {
  return (num < 10 ? '0' : '') + num;
};

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
 * Возвращает массив случайных чисел от min до max включительно. Длина массива === arrLength
 * @param {number} min
 * @param {number} max
 * @param {number} arrLength
 * @return {Array}
 */
var getArrayOfRandomNums = function (min, max, arrLength) {
  var RandomNums = [];
  for (var i = 0; i < arrLength; i += 1) {
    RandomNums.push(getRandomNum(min, max, true));
  }

  return RandomNums;
};

var allCoordX = getArrayOfRandomNums(300, 900, OFFERS_COUNT);
var allCoordY = getArrayOfRandomNums(100, 500, OFFERS_COUNT);

/**
 * Возвращает массив длины arrLength, каждый элемент которого это случайный элемент исходного массива
 * @param {Array} srcArray
 * @param {number} arrLength
 * @return {Array}
 */
var geArrayOfRandomElems = function (srcArray, arrLength) {
  var randomElemsArray = [];
  for (var i = 0; i < arrLength; i += 1) {
    randomElemsArray.push(srcArray[getRandomNum(0, srcArray.length)]);
  }

  return randomElemsArray;
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
 * Получает массив, копирует его. Работает с копией, размешивает ее элементы
 * @param {Array} srcArr
 * @param {number} arrLength - необязательный параметр. Если задан - количество элементов в новом массиве === arrLength, элементы не повторяются. Если arrLength > фактической длины массива - получаем повторы.
 * @return {Array}
 */
var getNewRandomizedArr = function (srcArr, arrLength) {
  if (!arrLength) {
    arrLength = srcArr.length;
  }

  var arrayCopy = srcArr.slice();
  var randomArr = [];
  var randomIndex;

  if (arrLength > srcArr.length) {
    for (var i = 0; i < arrLength; i += 1) {
      randomIndex = getRandomNum(0, arrayCopy.length);
      randomArr.push(arrayCopy[randomIndex]);
    }

  } else {
    for (var j = 0; j < arrLength; j += 1) {
      randomIndex = getRandomNum(0, arrayCopy.length);
      randomArr.push(arrayCopy[randomIndex]);
      arrayCopy.splice(randomIndex, 1);
    }
  }

  return randomArr;
};

/**
 * Возвращает массив URI-адресов длиной count, каждый адрес заканчивается на i до count включительно, + .png. Массив размешан
 * @param {number} count
 * @return {Array}
 */
var getImgURIs = function (count) {
  var URIs = [];
  for (var i = 1; i <= count; i += 1) {
    URIs.push('img/avatars/user' + addZero(i) + '.png');
  }

  return getNewRandomizedArr(URIs);
};

/**
 * Возвращает координатный адрес на карте формата "координата х, координата y".
 * @param {array} x
 * @param {array} y
 * @param {number} arrLength
 * @return {Array}
 */
var getAddresses = function (x, y, arrLength) {
  var addresses = [];
  for (var i = 0; i < arrLength; i += 1) {
    addresses.push(x[i] + ', ' + y[i]);
  }

  return addresses;
};

/**
 * Возвращает массив длины arrLength, в каждом из значений которого случайное количество фич
 * @param {Array} AllFeatures
 * @param {Number} arrLength
 * @return {Array}
 */
var getFeatures = function (AllFeatures, arrLength) {
  var arrayOfValues = [];
  for (var i = 0; i < arrLength; i += 1) {
    arrayOfValues.push(getArrayOfRandomLength(AllFeatures));
  }

  return arrayOfValues;
};

/**
 * Преобразует тип в русское название
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

/** Создаем нужное количество массивов для объявлений */
var offersData = {
  avatars: getImgURIs(8),

  types: geArrayOfRandomElems(ALL_TYPES, OFFERS_COUNT),
  addresses: getAddresses(allCoordX, allCoordY, OFFERS_COUNT),
  prices: getArrayOfRandomNums(1000, 1000000, OFFERS_COUNT),
  rooms: getArrayOfRandomNums(1, 5, OFFERS_COUNT),
  guests: getArrayOfRandomNums(1, 10, OFFERS_COUNT),
  titles: getNewRandomizedArr(ALL_TITLES),
  checkins: getNewRandomizedArr(ALL_CHECKINS, OFFERS_COUNT),
  checkouts: getNewRandomizedArr(ALL_CHECKOUTS, OFFERS_COUNT),
  features: getFeatures(ALL_FEATURES, OFFERS_COUNT),
  descriptions: [' '],
  photos: [],

  x: allCoordX,
  y: allCoordY
};

/**
 * Создает массив объявлений
 * @param {Object} offers - База данных объявлений
 * @param {number} count - Количество нужных объявлений
 * @return {Array}
 */
var getArrayOfOffers = function (offers, count) {
  var offersArray = [];
  var currentOffer;
  for (var i = 0; i < count; i += 1) {
    currentOffer = {
      author: {
        avatar: offersData.avatars[i]
      },
      offer: {
        title: offersData.titles[i],
        address: offersData.addresses[i],
        price: offersData.prices[i],
        type: offersData.types[i],
        rooms: offersData.rooms[i],
        guests: offersData.guests[i],
        checkin: offersData.checkins[i],
        checkout: offersData.checkouts[i],
        features: offersData.features[i],
        description: '',
        photos: []
      },
      location: {
        x: offersData.x[i],
        y: offersData.y[i]
      }
    };

    offersArray.push(currentOffer);
  }

  return offersArray;
};
var arrayOfOffers = getArrayOfOffers(offersData, 8);


/**
 * Отрисовывает пины
 * @param {Array} offers - принимает массив с объявлениями
 * @param {Node} context - то, куда отрисовываются элементы
 */
var renderPins = function (offers, context) {
  offers.forEach(function (offer, index) {
    var currentOffer = offers[index];
    var currentPin = document.createElement('button');
    var pinImage = document.createElement('img');

    currentPin.setAttribute('style', 'left:' + currentOffer.location.x + 'px; top:' + currentOffer.location.y + 'px');
    currentPin.classList.add('map__pin');

    pinImage.setAttribute('width', '40');
    pinImage.setAttribute('height', '40');
    pinImage.setAttribute('draggable', 'false');
    pinImage.src = currentOffer.author.avatar;

    currentPin.appendChild(pinImage);
    context.appendChild(currentPin);
  });
};

/**
 * Отрисовывает нужное количество фич (HTML-элементы <li> с нужным классом)
 * @param {Object} features
 * @param {Node} context - то, куда отрисовываются элементы
 */
var renderFeatures = function (features, context) {
  context.innerHTML = '';
  features.forEach(function (feature) {
    var currentLi = document.createElement('li');
    currentLi.classList.add('feature', 'feature--' + feature);
    context.appendChild(currentLi);
  });
};

/**
 * Отрисовывает объявление
 * @param {Array} offersArray
 * @param {number} index - Тот элемент массива, который мы хотим показывать объявлением
 * @return {Element}
 */
var renderOffer = function (offersArray, index) {
  var currentOffer = offersArray[index];

  var offerTemplate = document.querySelector('template').content.querySelector('article.map__card');

  offerTemplate.querySelector('h3').textContent = currentOffer.author.title;
  offerTemplate.querySelector('p small').textContent = currentOffer.offer.address;
  offerTemplate.querySelector('.popup__price').textContent = currentOffer.offer.price + '₽/ночь';
  offerTemplate.querySelector('h4').textContent = translateType(currentOffer.offer.type);
  offerTemplate.querySelector('h4 + p').textContent = currentOffer.offer.rooms + ' комнаты для ' + currentOffer.offer.guests + ' гостей';
  offerTemplate.querySelector('h4 + p + p').textContent = 'Заезд после ' + currentOffer.offer.checkin + ',' + ' выезд до ' + currentOffer.offer.checkout;
  renderFeatures(currentOffer.offer.features, offerTemplate.querySelector('.popup__features'));
  offerTemplate.querySelector('.popup__avatar').src = currentOffer.author.avatar;
  offerTemplate.querySelector('ul + p').textContent = '';
  return offerTemplate;
};

/**
 * Отрисовывает всю карту вместе с пинами и попапом-объявлением
 */
var renderMap = function () {
  document.querySelector('.map').classList.remove('map--faded');

  var fragment = document.createDocumentFragment();
  var pins = document.createDocumentFragment();

  var mapFilters = document.querySelector('.map__filters-container');
  var mapPins = document.querySelector('.map__pins');

  renderPins(arrayOfOffers, pins);
  fragment.appendChild(renderOffer(arrayOfOffers, 0));
  mapFilters.appendChild(fragment);
  mapPins.appendChild(pins);
};

renderMap();
