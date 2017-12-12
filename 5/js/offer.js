'use strict';

(function () {
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
   * Создает фрагмент фич
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
    offerElem.querySelector('h4').textContent = window.data.types[rent.offer.type];
    offerElem.querySelector('h4 + p').textContent = rent.offer.rooms + ' комнаты для ' + rent.offer.guests + ' гостей';
    offerElem.querySelector('h4 + p + p').textContent = 'Заезд после ' + rent.offer.checkin + ',' + ' выезд до ' + rent.offer.checkout;
    offerElem.querySelector('.popup__avatar').src = rent.author.avatar;
    offerElem.querySelector('ul + p').textContent = '';
    offerElem.querySelector('.popup__features').innerHTML = '';
    offerElem.querySelector('.popup__features').appendChild(createFeaturesFragment(rent.offer.features));
    offerElem.removeChild(offerElem.querySelector('.popup__pictures'));

    return offerElem;
  };


  window.offer = {
    render: createOfferElem
  };
})();
