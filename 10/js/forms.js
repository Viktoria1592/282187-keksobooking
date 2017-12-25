'use strict';
/** @typedef {Object.<string, number>} Coords
 * Объект, хранящий x и y координаты
 */

(function () {
  /** Константы количества гостей, при которых бронь будет считаться "не для гостей" */
  var NOT_FOR_GUESTS_VALUE = '100';
  var NOT_FOR_GUESTS_INDEX = '3';

  /** Мапа минимальных цен */
  var housingToMinPrice = {
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
  var addressInputElem = userFormElem.querySelector('#address');
  var checkinSelectElem = userFormElem.querySelector('#timein');
  var checkoutSelectElem = userFormElem.querySelector('#timeout');
  var roomsSelectElem = userFormElem.querySelector('#room_number');
  var capacitySelectElem = userFormElem.querySelector('#capacity');

  var capacityOptionsElems = capacitySelectElem.querySelectorAll('option');


  /** Сбрасывает форму и в поле адреса кладет нынешние координаты пользовательского пина */
  var onBackendPostSuccess = function () {
    userFormElem.reset();
    window.map.setAddressCoords();
  };

  /**
   * Если нода с ошибкой уже существует - заменяет ее
   * @param {string} error
   */
  var onBackendPostError = function (error) {
    window.utils.createOrReplaceElem('body', window.utils.createErrorMessageElem(error, 'error', 'error--bottom'), 'error--bottom');
  };

  var onUserFormElemSubmit = function (event) {
    window.backend.post(window.constants.ServerUrl.UPLOAD, new FormData(event.target), onBackendPostSuccess, onBackendPostError);

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

  /**
   * Проверяет, совпадают ли выбранное кол-во комнат с типом мест
   */
  var disableInvalidGuestsValues = function () {
    var selectedRoom = roomsSelectElem.options[roomsSelectElem.selectedIndex].value;

    capacityOptionsElems.forEach(function (option) {
      option.disabled = true;
    });

    if (selectedRoom === NOT_FOR_GUESTS_VALUE) {
      capacityOptionsElems[NOT_FOR_GUESTS_INDEX].disabled = false;
      return;
    }

    capacityOptionsElems.forEach(function (option) {
      if (option.value <= selectedRoom && option.value !== '0') {
        option.disabled = false;
      }
    });
  };

  /** Задает минимальную цену за ночь согласно мапе минимальных цен */
  var syncTypeWithMinPrice = function () {
    var selectedType = typeSelectElem.options[typeSelectElem.selectedIndex].value;
    var selectedPrice = housingToMinPrice[selectedType];

    priceInputElem.min = selectedPrice;
    priceInputElem.placeholder = selectedPrice;
  };

  /** Синхронизирует комнаты с гостями */
  var syncRoomsWithGuests = function () {
    disableInvalidGuestsValues();
    if (roomsSelectElem.options[roomsSelectElem.selectedIndex].value === NOT_FOR_GUESTS_VALUE) {
      var notForGuestsOption = capacitySelectElem.querySelector('option[value="0"]');
      notForGuestsOption.selected = true;
    } else {
      syncSelectElemsValue(roomsSelectElem, capacitySelectElem);
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
      case roomsSelectElem:
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


  syncTypeWithMinPrice();
  syncRoomsWithGuests();
  userFormElem.addEventListener('submit', onUserFormElemSubmit);
  userFormElem.addEventListener('change', onUserFormElemChange);


  window.forms = {
    toggleDisabledOnElems: toggleDisabledOnElems,
    onCoordsChange: onCoordsChange,
    enableFiltering: enableFiltering
  };
})();
