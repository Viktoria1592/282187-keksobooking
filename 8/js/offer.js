'use strict';

(function () {
  /** Константа переведенных на русский типов жилья */
  var TYPES = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом'
  };


  /**
   * Создает ноду фичи
   * @param {string} feature
   * @return {HTMLElement}
   */
  var createFeaturesItemElem = function (feature) {
    var FeaturesItemElem = document.createElement('li');
    FeaturesItemElem.classList.add('feature', 'feature--' + feature);

    return FeaturesItemElem;
  };

  var createImgItemElem = function (src) {
    var imgItemElem = document.createElement('li');
    var imgElem = document.createElement('img');
    imgElem.src = src;
    imgElem.width = 210;

    imgItemElem.appendChild(imgElem);

    return imgItemElem;
  };

  /**
   * Создает фрагмент фич
   * @param {data.offer.features} featuresArray
   * @param {Function} elemsCreator
   * @return {DocumentFragment}
   */
  var createElemsFragment = function (featuresArray, elemsCreator) {
    var elemsFragment = document.createDocumentFragment();

    featuresArray.forEach(function (feature) {
      elemsFragment.appendChild(elemsCreator(feature));
    });

    return elemsFragment;
  };

  /**
   * Создает ноду объявления
   * @param {data} rent
   * @return {HTMLElement}
   */
  var createOfferElem = function (rent) {
    var offerElem = document.querySelector('template').content.querySelector('article.map__card').cloneNode(true);

    offerElem.querySelector('h3').textContent = rent.offer.title;
    offerElem.querySelector('p small').textContent = rent.offer.address;
    offerElem.querySelector('.popup__price').textContent = rent.offer.price + '₽/ночь';
    offerElem.querySelector('h4').textContent = TYPES[rent.offer.type];
    offerElem.querySelector('h4 + p').textContent = rent.offer.rooms + ' комнаты для ' + rent.offer.guests + ' гостей';
    offerElem.querySelector('h4 + p + p').textContent = 'Заезд после ' + rent.offer.checkin + ',' + ' выезд до ' + rent.offer.checkout;
    offerElem.querySelector('.popup__avatar').src = rent.author.avatar;
    offerElem.querySelector('ul + p').textContent = rent.offer.description;
    offerElem.querySelector('.popup__features').innerHTML = '';
    offerElem.querySelector('.popup__features').appendChild(createElemsFragment(rent.offer.features, createFeaturesItemElem));
    offerElem.querySelector('.popup__pictures').innerHTML = '';
    offerElem.querySelector('.popup__pictures').appendChild(createElemsFragment(rent.offer.photos, createImgItemElem));

    return offerElem;
  };


  window.offer = {
    createElem: createOfferElem
  };
})();
