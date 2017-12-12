'use strict';

(function () {
  /** Отнимает у активного пина активность, закрывает попап  */
  var closePopup = function () {
    var popupElem = document.querySelector('.map__card');
    window.pins.removePinActiveClass();
    popupElem.classList.add('hidden');
  };

  var onPopupEscPress = function (event) {
    if (event.keyCode === window.constants.ESC_KEYCODE) {
      closePopup();
    }
  };

  /** Вешает закрывателей на ноду попапа */
  var addPopupCloseHandlers = function () {
    var popupCloseElem = document.querySelector('.popup__close');
    popupCloseElem.addEventListener('click', function () {
      closePopup();
    });
    document.addEventListener('keydown', onPopupEscPress);
  };

  /**
   * Рендерит попап объявления с заменой предыдущего (если он был)
   * @param {OfferObj} offer
   */
  var renderPopup = function (offer) {
    var mapFiltersElem = document.querySelector('.map__filters-container');

    var oldOfferElem = mapFiltersElem.querySelector('.map__card');
    var offerElem = window.offer.createOfferElem(offer);

    if (oldOfferElem) {
      mapFiltersElem.replaceChild(offerElem, oldOfferElem);
    } else {
      mapFiltersElem.appendChild(offerElem);
    }
  };


  window.popup = {
    addPopupCloseHandlers: addPopupCloseHandlers,
    renderPopup: renderPopup
  };
})();
