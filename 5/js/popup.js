'use strict';

(function () {
  /** Отнимает у активного пина активность, закрывает попап  */
  var close = function () {
    var popupElem = document.querySelector('.map__card');
    window.pins.deselect();
    popupElem.classList.add('hidden');
  };

  var onEscPress = function (event) {
    if (event.keyCode === window.constants.ESC_KEYCODE) {
      close();
    }
  };

  /** Вешает закрывателей на ноду попапа */
  var addCloseHandlers = function () {
    var closeElem = document.querySelector('.popup__close');
    closeElem.addEventListener('click', function () {
      close();
    });
    document.addEventListener('keydown', onEscPress);
  };

  /**
   * Рендерит попап объявления с заменой предыдущего (если он был)
   * @param {data} offer
   */
  var render = function (offer) {
    var mapFiltersElem = document.querySelector('.map__filters-container');

    var oldOfferElem = mapFiltersElem.querySelector('.map__card');
    var offerElem = window.offer.createElem(offer);

    if (oldOfferElem) {
      mapFiltersElem.replaceChild(offerElem, oldOfferElem);
    } else {
      mapFiltersElem.appendChild(offerElem);
    }

    addCloseHandlers();
  };


  window.popup = {
    render: render
  };
})();
