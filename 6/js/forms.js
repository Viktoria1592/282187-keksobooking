'use strict';

(function () {
  /** Константа количества гостей, при котором бронь будет считаться "не для гостей"  */
  var NOT_FOR_GUESTS_VALUE = 100;

  /** Константа минимальных цен */
  var MIN_PRICES = {
    bungalo: '0',
    flat: '1000',
    house: '5000',
    palace: '10000'
  };


  var userFormElem = document.querySelector('.notice__form');

  var checkinSelectElem = userFormElem.querySelector('#timein');
  var checkoutSelectElem = userFormElem.querySelector('#timeout');

  var typeSelectElem = userFormElem.querySelector('#type');
  var priceInputElem = userFormElem.querySelector('#price');

  var numOfRoomsSelectElem = userFormElem.querySelector('#room_number');
  var capacitySelectElem = userFormElem.querySelector('#capacity');


  /**
   * При выборе опции селекта из первого параметра выбирает опцию с аналогичным значением у селекта из второго параметра
   * @param {HTMLSelectElement} changedSelect
   * @param {HTMLSelectElement} syncingSelect
   */
  var syncSelectElemsValue = function (changedSelect, syncingSelect) {
    var selectedValue = changedSelect.options[changedSelect.selectedIndex].value;

    for (var i = 0; i < syncingSelect.length; i += 1) {
      if (syncingSelect[i].value === selectedValue) {
        syncingSelect[i].selected = true;
        break;
      }
    }
  };

  /** Задает минимальную цену за ночь согласно константе-объекту минимальных цен */
  var syncTypeWithMinPrice = function () {
    var selectedType = typeSelectElem.options[typeSelectElem.selectedIndex].value;
    priceInputElem.min = MIN_PRICES[selectedType];
  };

  var syncRoomsWithGuests = function () {
    if (numOfRoomsSelectElem.options[numOfRoomsSelectElem.selectedIndex].value === NOT_FOR_GUESTS_VALUE) {
      var notForGuestsOption = capacitySelectElem.querySelector('option[value="0"]');
      notForGuestsOption.selected = true;
    } else {
      syncSelectElemsValue(numOfRoomsSelectElem, capacitySelectElem);
    }
  };

  /**
   * Коллбэк для событий селектов у формы
   * @param {change} event
   */
  var onUserFormElemChange = function (event) {
    var target = event.target;

    switch (target) {
      case checkinSelectElem:
        syncSelectElemsValue(checkinSelectElem, checkoutSelectElem);
        break;
      case checkoutSelectElem:
        syncSelectElemsValue(checkoutSelectElem, checkinSelectElem);
        break;
      case typeSelectElem:
        syncTypeWithMinPrice();
        break;
      case numOfRoomsSelectElem:
        syncRoomsWithGuests();
        break;
    }
  };

  /**
   * Добавляет или убирает аттрибут disabled нодам формы в зависимости от isDisabled
   * @param {HTMLCollection} form
   * @param {boolean} isDisabled
   */
  var toggleDisabledOnElems = function (form, isDisabled) {
    var formElems = form.elements;

    for (var i = 0; i < formElems.length; i += 1) {
      formElems[i].disabled = isDisabled;
    }
  };


  syncRoomsWithGuests();
  userFormElem.addEventListener('change', onUserFormElemChange);


  window.forms = {
    toggleDisabledOnElems: toggleDisabledOnElems
  };
})();
