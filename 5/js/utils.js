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


  window.utils = {
    getRandomNum: getRandomNum,
    getRandomElem: getRandomElem,
    getArrayOfRandomLength: getArrayOfRandomLength,
    addZero: addZero,
    findClosestElem: findClosestElem
  };
})();
