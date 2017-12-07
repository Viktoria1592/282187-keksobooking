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

var offersArray = getArrayOfOffers(OFFERS_COUNT);
var currentOffer = offersArray[0];


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
 * Рендерит фрагмент пина
 * @param {Array} offers
 * @return {DocumentFragment}
 */
var renderPins = function (offers) {
  var pinFragment = document.createDocumentFragment();

  offers.forEach(function (offer, index) {
    pinFragment.appendChild(createPinElem(offer.location, offer.author.avatar, index));
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
 * @param {Object} rent
 * @return {HTMLElement}
 */
var renderOffer = function (rent) {
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
  offerElem.removeChild(offerElem.querySelector('.popup__pictures'));

  return offerElem;
};

/**
 * Отрисовывает всю карту вместе с пинами и попапом-объявлением
 */
var renderMap = function () {
  var mapPinsElem = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();

  var mapFiltersElem = document.querySelector('.map__filters-container');
  var offerElem = renderOffer(currentOffer);

  offerElem.querySelector('.popup__features').appendChild(renderFeaturesElem(currentOffer.offer.features));
  mapPinsElem.appendChild(renderPins(offersArray));
  fragment.appendChild(offerElem);
  mapFiltersElem.appendChild(fragment);
};

/** Константы клавиатурных кодов */
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var SPACE_KEYCODE = 32;


var mapElem = document.querySelector('.map');
var mapFilters = mapElem.querySelectorAll('.map__filter');
var mapHousingFeatures = mapElem.querySelector('.map__filter-set');

var mapPinsElem = mapElem.querySelector('.map__pins');
var mapPinMainElem = mapElem.querySelector('.map__pin--main');

var formElem = document.querySelector('.notice__form');
var formFieldElem = formElem.querySelectorAll('fieldset');

/**
 * Добавляет или убирает аттрибут disabled нодам формы в зависимости от условия. Учитывает количество нод
 * @param {HTMLCollection|HTMLElement} elem
 * @param {boolean} isDisabled
 */
var toggleDisabledOnFormElems = function (elem, isDisabled) {
  if (elem.length > 1) {
    elem.forEach(function (toBeDisabled) {
      toBeDisabled.disabled = isDisabled;
    });
  } else {
    elem.disabled = isDisabled;
  }
};

toggleDisabledOnFormElems(mapFilters, true);
toggleDisabledOnFormElems(formFieldElem, true);
toggleDisabledOnFormElems(mapHousingFeatures, true);

/**
 * Проходится по всем пинам на карте, отнимает класс активности
 */
var removePinActiveClass = function () {
  var pins = mapPinsElem.querySelectorAll('.map__pin--active');
  pins.forEach(function (pin) {
    pin.classList.remove('map__pin--active');
  });
};

/**
 * Сначала отнимает у пинов активность, потом закрывает попап
 */
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

/**
 * Вешает закрывателей на ноду попапа
 */
var getReadyToClosePopup = function () {
  var popupCloseElem = document.querySelector('.map__card').querySelector('.popup__close');

  popupCloseElem.addEventListener('click', function () {
    closePopup();
  });
  document.addEventListener('keydown', onPopupEscPress);
};

/**
 * Запускает весь функционал карты, а также энаблит элементы форм
 */
var enableInteractivity = function () {
  mapElem.classList.remove('map--faded');
  formElem.classList.remove('notice__form--disabled');

  toggleDisabledOnFormElems(mapFilters, false);
  toggleDisabledOnFormElems(formFieldElem, false);
  toggleDisabledOnFormElems(mapHousingFeatures, false);

  renderMap();
  getReadyToClosePopup();
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
  }
  mapPinMainElem.removeEventListener('keydown', onUserPinEnterPress);
  mapPinMainElem.removeEventListener('mouseup', onUserPinMouseUp);
};

mapPinMainElem.addEventListener('mouseup', onUserPinMouseUp);
mapPinMainElem.addEventListener('keydown', onUserPinEnterPress);

/**
 * Матчит дата-аттрибут пина с индексом соответствующего пину объявления. Рендерит заново объявление с заменой предыдущего
 * @param {HTMLElement} eventTarget
 */
var replacePopup = function (eventTarget) {
  var mapFiltersElem = document.querySelector('.map__filters-container');
  var oldOfferElem = mapFiltersElem.querySelector('.map__card');

  var newOfferIndex = parseFloat(eventTarget.dataset.offer);
  var newOfferObj = offersArray[newOfferIndex];
  var newOfferElem = renderOffer(newOfferObj);

  var newOfferFeaturesElem = newOfferElem.querySelector('.popup__features');
  newOfferFeaturesElem.appendChild(renderFeaturesElem(newOfferObj.offer.features));

  mapFiltersElem.replaceChild(newOfferElem, oldOfferElem);
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
      replacePopup(target);
      getReadyToClosePopup();
      return;
    }

    target = target.parentNode;
  }
};

mapPinsElem.addEventListener('click', onOfferPinClick);
