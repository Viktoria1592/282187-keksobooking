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
   * Создает ноду пина, используя данные из объекта объявлений
   * @param {Object} offer - Объект объявлений
   * @param {number} dataIndex - Датасет для связи пина с попапом
   * @return {Node}
   */
  var createElem = function (offer, dataIndex) {
    var pinElem = pinTemplate.cloneNode(true);
    pinElem.querySelector('img').src = offer.author.avatar;

    pinElem.style.left = offer.location.x - PIN_OFFSET_X + 'px';
    pinElem.style.top = offer.location.y - PIN_OFFSET_Y + 'px';
    pinElem.classList.add('map__pin');
    pinElem.dataset.offer = dataIndex;

    return pinElem;
  };

  /**
   * Рендерит фрагмент пина/пинов
   * @param {Array} offer
   */
  var renderFragment = function (offer) {
    var pinFragment = window.utils.createElemsFragment(offer, createElem);
    mapPinsElem.appendChild(pinFragment);
  };

  /** Удаляет пины, узнавая их по датасетам */
  var removeElems = function () {
    var pins = mapPinsElem.querySelectorAll('button[data-offer]');

    pins.forEach(function (pin) {
      pin.parentNode.removeChild(pin);
    });
  };

  var removeActiveClass = function () {
    var pins = mapPinsElem.querySelectorAll('.map__pin--active');

    pins.forEach(function (pin) {
      pin.classList.remove('map__pin--active');
    });
  };

  /**
   * Матчит датасет пина с индексом соответствующего пину объявления
   * @param {EventTarget} eventTarget
   * @param {Array} offers
   * @return {Object}
   */
  var getClickedPinOffer = function (eventTarget, offers) {
    var offerIndex = parseFloat(eventTarget.dataset.offer);
    return offers[offerIndex];
  };

  /**
   * Отнимает у пинов активный класс, потом бабблит клик до нужной ноды. Если находит нужную - задает активный ей класс, заменяет попап и вешает на него отслеживание закрытия
   * @param {MouseEvent} event
   * @param {Array} offers
   */
  var onClick = function (event, offers) {
    window.pins.deselect();

    var target = event.target;
    var clickedPin = window.utils.findClosestElem(target, 'map__pin', mapPinsElem);

    if (clickedPin) {
      clickedPin.classList.add('map__pin--active');
      window.popup.render(getClickedPinOffer(clickedPin, offers));
    }
  };


  window.pins = {
    render: renderFragment,
    remove: removeElems,
    deselect: removeActiveClass,
    onClick: onClick
  };
})();
