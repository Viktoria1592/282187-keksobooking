'use strict';

(function () {
  var userFormElem = document.querySelector('.notice__form');

  var checkinSelectElem = userFormElem.querySelector('#timein');
  var checkoutSelectElem = userFormElem.querySelector('#timeout');

  var typeSelectElem = userFormElem.querySelector('#type');
  var priceInputElem = userFormElem.querySelector('#price');

  var numOfRoomsSelectElem = userFormElem.querySelector('#room_number');
  var capacitySelectElem = userFormElem.querySelector('#capacity');

  var addressInputElem = userFormElem.querySelector('#address');

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

  /**
   * Задает минимальную цену за ночь согласно константе-объекту минимальных цен
   */
  var syncTypeWithMinPrice = function () {
    var selectedType = typeSelectElem.options[typeSelectElem.selectedIndex].value;
    priceInputElem.min = window.constants.MIN_PRICES[selectedType];
  };

  var syncRoomsWithGuests = function () {
    if (numOfRoomsSelectElem.options[numOfRoomsSelectElem.selectedIndex].value === window.constants.NOT_FOR_GUESTS_VALUE) {
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


  syncRoomsWithGuests();
  userFormElem.addEventListener('change', onUserFormElemChange);


  // Временная фигня, чтобы форма сабмитилась и сервер данные принял
  addressInputElem.value = 'Tokyo-to, Chiyoda-ku Hitotsu-bashi 2-5-10';


  /**
   * Добавляет или убирает аттрибут disabled нодам формы в зависимости от условия
   * @param {HTMLCollection} form
   * @param {boolean} isDisabled
   */
  var toggleDisabledOnFormElems = function (form, isDisabled) {
    var formElems = form.elements;

    for (var i = 0; i < formElems.length; i += 1) {
      formElems[i].disabled = isDisabled;
    }
  };

  window.forms = {
    toggleDisabledOnFormElems: toggleDisabledOnFormElems
  };

})();
