'use strict';

(function () {
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var pinImgElem = pinTemplate.querySelector('img');
  var mapPinsElem = document.querySelector('.map .map__pins');

  /** Константы размеров пина */
  var NEEDLE_HEIGHT = 18;
  var PIN_OFFSET_X = pinImgElem.getAttribute('width') / 2;
  var PIN_OFFSET_Y = parseFloat(pinImgElem.getAttribute('height')) + NEEDLE_HEIGHT;


  /**
   * Создает ноду пина
   * @param {data.location} coordinates
   * @param {data.author.avatar} avatar
   * @param {number} dataIndex
   * @return {HTMLElement}
   */
  var createElem = function (coordinates, avatar, dataIndex) {
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
   * @param {Array.<data>} offers
   */
  var renderFragment = function (offers) {
    var pinFragment = document.createDocumentFragment();

    offers.forEach(function (offer, index) {
      pinFragment.appendChild(createElem(offer.location, offer.author.avatar, index));
    });

    mapPinsElem.appendChild(pinFragment);
  };

  var removeActiveClass = function () {
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
    return window.map.mapData[offerIndex];
  };

  /**
   * Отнимает у пинов активный класс, потом бабблит клик до нужной ноды. Если находит нужную - задает активный ей класс, заменяет попап и вешает на него отслеживание закрытия
   * @param {MouseEvent} event
   */
  var onClick = function (event) {
    window.pins.deselect();

    var target = event.target;
    var clickedPin = window.utils.findClosestElem(target, 'map__pin', mapPinsElem);

    if (clickedPin) {
      clickedPin.classList.add('map__pin--active');
      window.popup.render(getClickedPinOffer(clickedPin));
    }
  };


  window.pins = {
    render: renderFragment,
    deselect: removeActiveClass,
    onClick: onClick
  };
})();
