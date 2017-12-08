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
        title: ALL_TITLES[i],
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


/** @type {Array.<OfferObj>} */
var offersArray = getArrayOfOffers(OFFERS_COUNT);


var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var pinImgElem = pinTemplate.querySelector('img');

/** Константы пина */
var PIN_HEIGHT = 18;
var PIN_OFFSET_X = pinImgElem.getAttribute('width') / 2;
var PIN_OFFSET_Y = parseFloat(pinImgElem.getAttribute('height')) + PIN_HEIGHT;

/**
 * Создает ноду пина
 * @param {OfferObj.location} coordinates
 * @param {OfferObj.author.avatar} avatar
 * @param {number} dataIndex
 * @return {HTMLElement}
 */
var createPinElem = function (coordinates, avatar, dataIndex) {
  var pinElem = pinTemplate.cloneNode(true);
  pinElem.querySelector('img').src = avatar;

  pinElem.style.left = coordinates.x - PIN_OFFSET_X + 'px';
  pinElem.style.top = coordinates.y - PIN_OFFSET_Y + 'px';
  pinElem.classList.add('map__pin');
  pinElem.dataset.offer = dataIndex;

  return pinElem;
};

/**
 * Рендерит фрагмент всех пинов
 * @param {Array.<OfferObj>} offers
 */
var renderPins = function (offers) {
  var pinFragment = document.createDocumentFragment();
  var mapPinsElem = document.querySelector('.map__pins');

  offers.forEach(function (offer, index) {
    pinFragment.appendChild(createPinElem(offer.location, offer.author.avatar, index));
  });

  mapPinsElem.appendChild(pinFragment);
};


/**
 * Создает ноду фичи
 * @param {string} feature
 * @return {HTMLElement}
 */
var createFeaturesElem = function (feature) {
  var featureElem = document.createElement('li');
  featureElem.classList.add('feature', 'feature--' + feature);

  return featureElem;
};

/**
 * Создает фрагмент фичи
 * @param {OfferObj.offer.features} featuresArray
 * @return {DocumentFragment}
 */
var createFeaturesFragment = function (featuresArray) {
  var featuresFragment = document.createDocumentFragment();

  featuresArray.forEach(function (feature) {
    featuresFragment.appendChild(createFeaturesElem(feature));
  });

  return featuresFragment;
};


/**
 * Создает ноду объявления
 * @param {OfferObj} rent
 * @return {HTMLElement}
 */
var createOfferElem = function (rent) {
  var offerElem = document.querySelector('template').content.querySelector('article.map__card').cloneNode(true);

  offerElem.querySelector('h3').textContent = rent.offer.title;
  offerElem.querySelector('p small').textContent = rent.offer.address;
  offerElem.querySelector('.popup__price').textContent = rent.offer.price + '₽/ночь';
  offerElem.querySelector('h4').textContent = ALL_TYPES[rent.offer.type];
  offerElem.querySelector('h4 + p').textContent = rent.offer.rooms + ' комнаты для ' + rent.offer.guests + ' гостей';
  offerElem.querySelector('h4 + p + p').textContent = 'Заезд после ' + rent.offer.checkin + ',' + ' выезд до ' + rent.offer.checkout;
  offerElem.querySelector('.popup__avatar').src = rent.author.avatar;
  offerElem.querySelector('ul + p').textContent = '';
  offerElem.querySelector('.popup__features').innerHTML = '';
  offerElem.querySelector('.popup__features').appendChild(createFeaturesFragment(rent.offer.features));
  offerElem.removeChild(offerElem.querySelector('.popup__pictures'));

  return offerElem;
};


/** Константы клавиатурных кодов */
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var SPACE_KEYCODE = 32;


var mapElem = document.querySelector('.map');

var mapPinsElem = mapElem.querySelector('.map__pins');
var mapPinMainElem = mapElem.querySelector('.map__pin--main');

var mapFiltersFormElem = mapElem.querySelector('.map__filters');
var noticeFormElem = document.querySelector('.notice__form');

/**
 * Добавляет или убирает аттрибут disabled нодам формы в зависимости от условия
 * @param {HTMLCollection} form
 * @param {boolean} isDisabled
 */
var toggleDisabledOnFormElems = function (form, isDisabled) {
  var formElems = form.elements;

  for (var i = 0; i < formElems.length; i += 1) {
    formElems[i].disabled = isDisabled;
  }
};

toggleDisabledOnFormElems(noticeFormElem, true);
toggleDisabledOnFormElems(mapFiltersFormElem, true);


var removePinActiveClass = function () {
  var pins = mapPinsElem.querySelectorAll('.map__pin--active');
  pins.forEach(function (pin) {
    pin.classList.remove('map__pin--active');
  });
};


/** Отнимает у активного пина активность, закрывает попап  */
var closePopup = function () {
  removePinActiveClass();

  var popupElem = document.querySelector('.map__card');
  popupElem.classList.add('hidden');
};

var onPopupEscPress = function (event) {
  if (event.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

/** Вешает закрывателей на ноду попапа */
var getReadyToClosePopup = function () {
  var popupCloseElem = document.querySelector('.map__card').querySelector('.popup__close');

  popupCloseElem.addEventListener('click', function () {
    closePopup();
  });
  document.addEventListener('keydown', onPopupEscPress);
};

/** Отрисовывает пины, энаблит элементы форм */
var enableInteractivity = function () {
  mapElem.classList.remove('map--faded');
  noticeFormElem.classList.remove('notice__form--disabled');

  toggleDisabledOnFormElems(noticeFormElem, false);
  toggleDisabledOnFormElems(mapFiltersFormElem, false);

  renderPins(offersArray);
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
  if (event.keyCode === ENTER_KEYCODE || event.keyCode === SPACE_KEYCODE) {
    enableInteractivity();
    mapPinMainElem.removeEventListener('keydown', onUserPinEnterPress);
    mapPinMainElem.removeEventListener('mouseup', onUserPinMouseUp);
  }
};

mapPinMainElem.addEventListener('mouseup', onUserPinMouseUp);
mapPinMainElem.addEventListener('keydown', onUserPinEnterPress);


/**
 * Матчит дата-аттрибут пина с индексом соответствующего пину объявления
 * @param {HTMLElement} eventTarget
 * @return {Object}
 */
var getClickedPinOffer = function (eventTarget) {
  var offerIndex = parseFloat(eventTarget.dataset.offer);
  return offersArray[offerIndex];
};

/**
 * Рендерит объявление с заменой предыдущего (если оно было)
 * @param {OfferObj} offer
 */
var renderPopup = function (offer) {
  var mapFiltersElem = document.querySelector('.map__filters-container');

  var oldOfferElem = mapFiltersElem.querySelector('.map__card');
  var offerElem = createOfferElem(offer);

  if (oldOfferElem) {
    mapFiltersElem.replaceChild(offerElem, oldOfferElem);
  } else {
    mapFiltersElem.appendChild(offerElem);
  }
};

/**
 * Отнимает у пинов активный класс, потом бабблит клик до нужной ноды. Если находит нужную - задает активный ей класс, заменяет попап и вешает на него отслеживание закрытия
 * @param {MouseEvent} event
 */
var onOfferPinClick = function (event) {
  removePinActiveClass();

  var target = event.target;
  while (target.className !== mapPinsElem.className) {
    if (target.className === 'map__pin') {
      target.classList.add('map__pin--active');
      renderPopup(getClickedPinOffer(target));
      getReadyToClosePopup();
      return;
    }

    target = target.parentNode;
  }
};

mapPinsElem.addEventListener('click', onOfferPinClick);
