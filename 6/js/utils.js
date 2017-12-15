'use strict';

(function () {
  /**
   * Генерирует случайное число от min до max
   * @param {number} min
   * @param {number} max
   * @param {boolean} [includeMax] - необязателен. Если true, то генерирует включая max, если false --- не включая
   * @return {number}
   */
  var getRandomNum = function (min, max, includeMax) {
    includeMax = includeMax ? 1 : 0;
    return Math.floor(Math.random() * (max - min + includeMax) + min);
  };

  /**
   * Возвращает случайный элемент массива
   * @param {Array} srcArray
   * @return {string}
   */
  var getRandomElem = function (srcArray) {
    return srcArray[getRandomNum(0, srcArray.length)];
  };

  /**
   * Возвращает массив значений произвольной длины. Значений может не быть совсем, или могут быть все
   * @param {Array} srcArray
   * @return {Array}
   */
  var getArrayOfRandomLength = function (srcArray) {
    var randomLength = getRandomNum(0, srcArray.length, true);

    return srcArray.slice(0, randomLength);
  };

  /**
   * Превращает число в строку, добавляя ноль перед num-числом к однозначным num
   * @param {number} num
   * @return {string}
   */
  var addZero = function (num) {
    return (num < 10 ? '0' : '') + num;
  };

  /**
   * Принимает цель события, класс, на котором событие должно быть поймано и родителя, до которого событие может всплыть. Возвращает элемент с нужным классом
   * @param {Event.target} target
   * @param {string} elemClass
   * @param {HTMLElement} parentElem
   * @return {HTMLElement}
   */
  var findClosestElem = function (target, elemClass, parentElem) {
    var closestElem;

    while (target.className !== parentElem.className) {
      if (target.className === elemClass) {
        closestElem = target;
      }
      target = target.parentNode;
    }

    return closestElem;
  };

  /**
   * Активирует таскание у любого элемента
   * @param {HTMLElement} handlerElem - То, за что таскаем, "ручка"
   * @param {HTMLElement} [dragElem] - То, что таскаем. Если не задан - весь элемент становится ручкой, таскать можно за любую его часть
   * @param {Object} [extraYLimit] - Дополнительный лимит по Y
   */
  var enableDragging = function (handlerElem, dragElem, extraYLimit) {
    if (!dragElem) {
      dragElem = handlerElem;
    }

    var limits = {};
    if (extraYLimit) {
      limits.min = extraYLimit.min;
      limits.max = extraYLimit.min;
    } else {
      limits.min = 0;
      limits.max = 0;
    }


    handlerElem.addEventListener('mousedown', function (event) {
      event.preventDefault();

      var currentCoords = {
        x: event.clientX,
        y: event.clientY
      };

      /** Меньше этих значений драг идти не будет. Учитывают размеры самого элемента */
      var minCoords = {
        x: dragElem.parentNode.offsetLeft + dragElem.offsetWidth / 2,
        y: dragElem.parentNode.offsetTop + dragElem.offsetHeight / 2 + limits.min
      };

      /** Больше этих значений драг идти не будет. Учитывают размеры самого элемента и экстралимит, если задан */
      var maxCoords = {
        x: minCoords.x + dragElem.parentNode.offsetWidth - dragElem.offsetWidth,
        y: minCoords.y - limits.min - limits.max + dragElem.parentNode.offsetHeight - dragElem.offsetHeight
      };

      var onElemHandlerMouseMove = function (moveEvent) {
        var movedDistanceCoords = {
          x: currentCoords.x - moveEvent.clientX,
          y: currentCoords.y - moveEvent.clientY
        };

        /** Назначает новые координаты в зависимости от ширины и высоты родительского элемента */
        dragElem.style.left = Math.max(minCoords.x, Math.min(dragElem.offsetLeft - movedDistanceCoords.x, maxCoords.x)) + 'px';
        dragElem.style.top = Math.max(minCoords.y, Math.min(dragElem.offsetTop - movedDistanceCoords.y, maxCoords.y)) + 'px';

        /** Обновляет координаты в соответствии с передвижением элемента*/
        currentCoords = {
          x: moveEvent.clientX,
          y: moveEvent.clientY
        };
      };

      var onElemHandlerMouseUp = function () {
        document.removeEventListener('mousemove', onElemHandlerMouseMove);
        document.removeEventListener('mouseup', onElemHandlerMouseMove);
      };


      document.addEventListener('mousemove', onElemHandlerMouseMove);
      document.addEventListener('mouseup', onElemHandlerMouseUp);
    });
  };


  window.utils = {
    getRandomNum: getRandomNum,
    getRandomElem: getRandomElem,
    getArrayOfRandomLength: getArrayOfRandomLength,
    addZero: addZero,
    findClosestElem: findClosestElem,
    enableDragging: enableDragging
  };
})();
