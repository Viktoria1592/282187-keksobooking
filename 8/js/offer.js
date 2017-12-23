'use strict';

(function () {
  /** Константа переведенных на русский типов жилья */
  var TYPES = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом'
  };

  /**
   * На вход нужный элемент, на выходе копия ноды
   * @param {string} querySelector
   * @return {Node}
   */
  var copyElemFromTemplate = function (querySelector) {
    return document.querySelector('template').content.querySelector(querySelector).cloneNode(true);
  };

  /**
   * Создает ноду фичи
   * @param {string} feature
   * @return {HTMLElement}
   */
  var getFeaturesItemElem = function (feature) {
    var featuresItemElem = copyElemFromTemplate('.popup__features li');
    featuresItemElem.className = '';
    featuresItemElem.classList.add('feature', 'feature--' + feature);

    return featuresItemElem;
  };

  /**
   * Создает ноду li с изображением внутри
   * @param {string} src
   * @return {HTMLLIElement}
   */
  var getImgItemElem = function (src) {
    var imgItemElem = copyElemFromTemplate('.popup__pictures li');
    var imgElem = imgItemElem.querySelector('img');
    imgElem.src = src;
    imgElem.width = 210;

    imgItemElem.appendChild(imgElem);

    return imgItemElem;
  };

  /**
   * Создает фрагмент элементов
   * @param {Array} offersArray
   * @param {Function} elemsCreator
   * @return {DocumentFragment}
   */
  var createElemsFragment = function (offersArray, elemsCreator) {
    var elemsFragment = document.createDocumentFragment();

    offersArray.forEach(function (feature) {
      elemsFragment.appendChild(elemsCreator(feature));
    });

    return elemsFragment;
  };

  /**
   * Создает ноду объявления
   * @param {Object} rent
   * @return {HTMLElement}
   */
  var createOfferElem = function (rent) {
    var offerElem = copyElemFromTemplate('article.map__card');

    offerElem.querySelector('h3').textContent = rent.offer.title;
    offerElem.querySelector('p small').textContent = rent.offer.address;
    offerElem.querySelector('.popup__price').textContent = rent.offer.price + '₽/ночь';
    offerElem.querySelector('h4').textContent = TYPES[rent.offer.type];
    offerElem.querySelector('h4 + p').textContent = rent.offer.rooms + ' комнаты для ' + rent.offer.guests + ' гостей';
    offerElem.querySelector('h4 + p + p').textContent = 'Заезд после ' + rent.offer.checkin + ',' + ' выезд до ' + rent.offer.checkout;
    offerElem.querySelector('.popup__avatar').src = rent.author.avatar;
    offerElem.querySelector('ul + p').textContent = rent.offer.description;
    offerElem.querySelector('.popup__features').innerHTML = '';
    offerElem.querySelector('.popup__features').appendChild(createElemsFragment(rent.offer.features, getFeaturesItemElem));
    offerElem.querySelector('.popup__pictures').innerHTML = '';
    offerElem.querySelector('.popup__pictures').appendChild(createElemsFragment(rent.offer.photos, getImgItemElem));

    return offerElem;
  };


  window.offer = {
    createElem: createOfferElem
  };
})();
