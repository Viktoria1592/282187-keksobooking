'use strict';
/** @typedef {Object.<string, number>} Coords
 * Объект, хранящий x и y координаты
 */

(function () {
  /** Константа количества гостей, при котором бронь будет считаться "не для гостей" */
  var NOT_FOR_GUESTS_VALUE = '100';

  /** Константа минимальных цен */
  var MIN_PRICES = {
    bungalo: '0',
    flat: '1000',
    house: '5000',
    palace: '10000'
  };

  /** Константа цен из фильтра */
  var PRICE_RANGES = {
    low: 10000,
    high: 50000
  };


  /** Сюда складываются отфильтрованные пользователем объявления */
  var filteredOffers = {};


  var mapFiltersFormElem = document.querySelector('.map__filters');
  var featureCheckboxElems = mapFiltersFormElem.querySelectorAll('input[type="checkbox"]');
  var selectElems = mapFiltersFormElem.querySelectorAll('select');

  var userFormElem = document.querySelector('.notice__form');
  var typeSelectElem = userFormElem.querySelector('#type');
  var priceInputElem = userFormElem.querySelector('#price');
  var checkinSelectElem = userFormElem.querySelector('#timein');
  var checkoutSelectElem = userFormElem.querySelector('#timeout');
  var numOfRoomsSelectElem = userFormElem.querySelector('#room_number');
  var capacitySelectElem = userFormElem.querySelector('#capacity');

  var addressInputElem = userFormElem.querySelector('#address');


  var onBackendPostSuccess = function () {
    userFormElem.reset();
  };

  var onBackendPostError = function (error) {
    var errorElem = document.createElement('div');
    errorElem.classList.add('error', 'error--bottom');
    errorElem.textContent = error;
    document.body.insertAdjacentElement('afterbegin', errorElem);
  };


  var onUserFormElemSubmit = function (event) {
    window.backend.post(window.constants.serverUrl.UPLOAD, new FormData(event.target), onBackendPostSuccess, onBackendPostError);

    event.preventDefault();
  };


  /**
   * При выборе опции селекта из первого параметра выбирает опцию с аналогичным значением у селекта из второго параметра
   * @param {Node} changedSelect - Измененная нода
   * @param {Node} syncingSelect - Синхронизирующая с измененной нода
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

  /** Синхронизирует комнаты с гостями */
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

  /**
   * Коллбек для обновления координат в поле адреса
   * @param {Coords} coords
   */
  var onCoordsChange = function (coords) {
    addressInputElem.value = 'x: ' + Math.round(coords.x) + ', y: ' + Math.round(coords.y);
  };

  /**
   * Новый обработчик на клики по пинам, учитывающий появившиеся данные с фильтра. Старый, существовавший с момента загрузки страницы, убит.
   * @param {MouseEvent} event
   */
  var onFilteredOfferPinClick = function (event) {
    window.pins.onClick(event, filteredOffers);
  };

  /**
   * Проверяет соответствие одного из типов объявления тому, которое было выбрано пользователем
   * @param {string} offerType - Переводится в строку, чтобы строго сравнивать
   * @param {string} matchesType
   * @return {boolean}
   */
  var checkType = function (offerType, matchesType) {
    return matchesType === 'any' || matchesType === offerType.toString();
  };

  /**
   * Переводит сумму за съем жилья в объявлении в типовое строковое значение из константы
   * @param {number} offerRentCost
   * @return {string}
   */
  var getRentCostRange = function (offerRentCost) {
    if (offerRentCost < PRICE_RANGES.low) {
      return 'low';
    } else if (offerRentCost >= PRICE_RANGES.high) {
      return 'high';
    } else {
      return 'middle';
    }
  };

  /**
   * Проверяет соответствие цены за съем жилья в объявлении той цене, которая была выбрана пользователем
   * @param {number} offerRentCost
   * @param {string} matchesCost
   * @return {boolean}
   */
  var checkRentCost = function (offerRentCost, matchesCost) {
    return matchesCost === 'any' || matchesCost === getRentCostRange(offerRentCost);
  };

  /**
   * Проверяет, есть ли в левом массиве все элементы правого массива
   * @param {Array} offerFeatures
   * @param {Array} neededFeatures
   * @return {boolean}
   */
  var checkFeatures = function (offerFeatures, neededFeatures) {
    return neededFeatures.every(function (feature) {
      return offerFeatures.indexOf(feature) > -1;
    });
  };

  /**
   * Совершает все действия, связанные непосредственно с обновлением информации после фильрации
   * @param {Array} filteredRents
   */
  var handleFiltering = function (filteredRents) {
    /** Убирает предыдущие пины */
    window.pins.remove();

    /** Предыдущая синхронизация работала с общими данными, не подходит */
    window.map.removeInitialPinPopupSync();

    /** Новая синхронизация, работающая с отфильтрованными данными */
    window.map.pinsElem.addEventListener('click', onFilteredOfferPinClick);
    window.pins.render(filteredRents);
  };


  /**
   * Запускает возможность пользовательской фильтрации объявлений
   * @param {Array} data - Данные с сервера
   */
  var enableFiltering = function (data) {
    /** Должны совпасть с данными с сервера, чтобы пройти фильтрацию*/
    var matches = {};

    /** Раздает селектам датасет на основе айдишника, отрывая у того ненужный префикс */
    selectElems.forEach(function (selectElem) {
      selectElem.dataset.feature = selectElem.id.replace(/housing-/i, '');
    });

    window.debounce(mapFiltersFormElem.addEventListener('change', function () {
      matches = Array.from(selectElems).reduce(function (acc, matchedOffers) {
        matches[matchedOffers.dataset.feature] = matchedOffers.options[matchedOffers.selectedIndex].value;

        return matches;
      }, {});

      var checkedFeatures = Array.from(featureCheckboxElems).filter(function (checkedBox) {
        return checkedBox.checked;
      }).map(function (checkedBox) {
        return checkedBox.value;
      });


      filteredOffers = data.filter(function (rent) {
        return checkType(rent.offer.type, matches.type) &&
          checkType(rent.offer.rooms, matches.rooms) &&
          checkType(rent.offer.guests, matches.guests) &&
          checkRentCost(rent.offer.price, matches.price) &&
          checkFeatures(rent.offer.features, checkedFeatures);
      });


      handleFiltering(filteredOffers);
    }));
  };


  syncRoomsWithGuests();
  userFormElem.addEventListener('submit', onUserFormElemSubmit);
  userFormElem.addEventListener('change', onUserFormElemChange);


  window.forms = {
    toggleDisabledOnElems: toggleDisabledOnElems,
    onCoordsChange: onCoordsChange,
    enableFiltering: enableFiltering
  };
})();
