'use strict';

(function () {
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var mapPinsElem = document.querySelector('.map .map__pins');


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

    pinElem.style.left = coordinates.x - window.constants.PIN_OFFSET_X + 'px';
    pinElem.style.top = coordinates.y - window.constants.PIN_OFFSET_Y + 'px';
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

    offers.forEach(function (offer, index) {
      pinFragment.appendChild(createPinElem(offer.location, offer.author.avatar, index));
    });

    mapPinsElem.appendChild(pinFragment);
  };

  var removePinActiveClass = function () {
    var pins = mapPinsElem.querySelectorAll('.map__pin--active');
    pins.forEach(function (pin) {
      pin.classList.remove('map__pin--active');
    });
  };

  /**
   * Матчит дата-аттрибут пина с индексом соответствующего пину объявления
   * @param {HTMLElement} eventTarget
   * @return {Object}
   */
  var getClickedPinOffer = function (eventTarget) {
    var offerIndex = parseFloat(eventTarget.dataset.offer);
    return window.offersData.offersArray[offerIndex];
  };

  /**
   * Отнимает у пинов активный класс, потом бабблит клик до нужной ноды. Если находит нужную - задает активный ей класс, заменяет попап и вешает на него отслеживание закрытия
   * @param {MouseEvent} event
   */
  var onOfferPinClick = function (event) {
    window.pins.removePinActiveClass();

    var target = event.target;
    var clickedPin = window.utils.findClosestElem(target, 'map__pin', mapPinsElem);

    if (clickedPin) {
      clickedPin.classList.add('map__pin--active');
      window.popup.renderPopup(getClickedPinOffer(clickedPin));
      window.popup.addPopupCloseHandlers();
    }
  };


  window.pins = {
    renderPins: renderPins,
    removePinActiveClass: removePinActiveClass,
    onOfferPinClick: onOfferPinClick
  };
})();
