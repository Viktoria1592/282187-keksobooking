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
   * @param {Object} [extraLimits] - Дополнительный лимит вида "лимит X пикселей от левой стороны отца, Y пикселей от правой границы отца". Задавать только со всеми осями (X и Y)!
   */
  var enableDragging = function (handlerElem, dragElem, extraLimits) {
    dragElem = dragElem || handlerElem;
    /** Если экстралимит не задан, заносим в переменную limits объект с нулевыми значениями лимитов */
    var limits = extraLimits || {
      x: {
        left: 0,
        right: 0
      },
      y: {
        top: 0,
        bottom: 0
      }
    };

    handlerElem.addEventListener('mousedown', function (event) {
      event.preventDefault();

      var currentCoords = {
        x: event.clientX,
        y: event.clientY
      };

      /** Меньше этих значений драг идти не будет. Учитывают размеры самого элемента относительно начальных координат родителя (которые 0) */
      var minCoords = {
        x: dragElem.offsetWidth / 2 + limits.x.left,
        y: dragElem.offsetHeight / 2 + limits.y.top
      };

      /** Больше этих значений драг идти не будет. Учитывают размеры самого элемента относительно размеров родителя и экстралимит */
      var maxCoords = {
        x: minCoords.x - limits.x.left - limits.x.right + dragElem.parentNode.offsetWidth - dragElem.offsetWidth,
        y: minCoords.y - limits.y.top - limits.y.bottom + dragElem.parentNode.offsetHeight - dragElem.offsetHeight
      };

      var onElemHandlerMouseMove = function (moveEvent) {
        /** Разница между координатами прошлого события (сначала это mousedown, потом mousemove) и текущего события) */
        var movedDistanceCoords = {
          x: currentCoords.x - moveEvent.clientX,
          y: currentCoords.y - moveEvent.clientY
        };

        /** Здесь новые координаты перемещаемого элемента, которыми обновляется элемент */
        var moveCoords = {
          x: dragElem.offsetLeft - movedDistanceCoords.x,
          y: dragElem.offsetTop - movedDistanceCoords.y
        };

        /** Назначает новые координаты в зависимости от ширины и высоты родительского элемента */
        dragElem.style.left = Math.max(minCoords.x, Math.min(moveCoords.x, maxCoords.x)) + 'px';
        dragElem.style.top = Math.max(minCoords.y, Math.min(moveCoords.y, maxCoords.y)) + 'px';

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
