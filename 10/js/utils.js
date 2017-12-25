'use strict';

(function () {
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
   * Создает элемент, принимая коллбек на генерацию элемента, селектор старого элемента и отца
   * @param {string} parentElemSelector - Селектор отца, сюда функция положит новый элемент
   * @param {Function} newElem - Генератор нового элемента
   * @param {string} [oldElemSelector] - Старая заменяемая версия элемента
   */
  var createOrReplaceElem = function (parentElemSelector, newElem, oldElemSelector) {
    var parentElem = document.querySelector(parentElemSelector);
    var oldElem = parentElem.querySelector(oldElemSelector);

    if (oldElem) {
      parentElem.replaceChild(newElem, oldElem);
    } else {
      parentElem.appendChild(newElem);
    }
  };

  /**
   * Создает типовую ошибку
   * @param {string} errorMessage
   * @param {string} classOfElem
   * @param {string} [additionalClass] - Дополнительный класс для БЭМ-модификатора
   */
  var createErrorMessageElem = function (errorMessage, classOfElem, additionalClass) {
    var errorElem = document.createElement('div');
    errorElem.classList.add(classOfElem);
    if (additionalClass) {
      errorElem.classList.add(additionalClass);
    }

    errorElem.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', errorElem);
  };

  /**
   * Создает фрагмент элементов из массива, обрабатывая его с помощью коллбека
   * @param {Array} dataArray - Массив из базы данных
   * @param {Function} elemsCreator - Коллбек, обрабатывающий полученный массив
   * @return {DocumentFragment}
   */
  var createElemsFragment = function (dataArray, elemsCreator) {
    var elemsFragment = document.createDocumentFragment();

    dataArray.forEach(function (elem, index) {
      elemsFragment.appendChild(elemsCreator(elem, index));
    });

    return elemsFragment;
  };

  /**
   * Активирует таскание у любого элемента
   * @param {HTMLElement} handlerElem - То, за что таскаем, "ручка"
   * @param {HTMLElement} [dragElem] - То, что таскаем. Если не задан - весь элемент становится ручкой, таскать можно за любую его часть
   * @param {Object} [extraLimits] - Дополнительный лимит. Если не задан - равен 0. Задавать можно с любой для любой стороны в любом порядке.
   * @param {Function} [callback] - Если нужно как-то обработать полученные координаты.
   */
  var enableDragging = function (handlerElem, dragElem, extraLimits, callback) {
    dragElem = dragElem || handlerElem;

    /** Если экстралимит не задан, заносим в переменную limits объект с нулевыми значениями лимитов */
    var noLimits = {
      x: {
        left: 0,
        right: 0
      },
      y: {
        top: 0,
        bottom: 0
      }
    };
    var limits = Object.assign(noLimits, extraLimits);


    handlerElem.addEventListener('mousedown', function (event) {
      event.preventDefault();

      var clickInsideElemOffset = {
        x: event.clientX - dragElem.offsetLeft,
        y: event.clientY - dragElem.offsetTop
      };

      var dragElemHalfWidth = dragElem.offsetWidth / 2;
      var dragElemHalfHeight = dragElem.offsetHeight / 2;


      /** Меньше этих значений драг идти не будет. Учитывают размеры самого элемента относительно начальных координат родителя (которые 0) */
      var minCoords = {
        x: dragElemHalfWidth + limits.x.left,
        y: dragElemHalfHeight + limits.y.top
      };

      /** Больше этих значений драг идти не будет. Учитывают размеры самого элемента относительно размеров родителя и экстралимит */
      var maxCoords = {
        x: dragElem.parentNode.offsetWidth - dragElemHalfWidth - limits.x.right,
        y: dragElem.parentNode.offsetHeight - dragElemHalfHeight - limits.y.bottom
      };


      var onElemHandlerMouseMove = function (moveEvent) {
        /** Здесь новые координаты перемещаемого элемента, которыми обновляется элемент */
        var moveCoords = {
          x: moveEvent.clientX - clickInsideElemOffset.x,
          y: moveEvent.clientY - clickInsideElemOffset.y
        };

        var movedElemNewPosition = {
          x: Math.max(minCoords.x, Math.min(moveCoords.x, maxCoords.x)),
          y: Math.max(minCoords.y, Math.min(moveCoords.y, maxCoords.y))
        };

        /** Назначает новые координаты в зависимости от ширины и высоты родительского элемента */
        dragElem.style.left = movedElemNewPosition.x + 'px';
        dragElem.style.top = movedElemNewPosition.y + 'px';


        if (typeof callback === 'function') {
          callback(movedElemNewPosition);
        }
      };

      var onElemHandlerMouseUp = function () {
        document.removeEventListener('mousemove', onElemHandlerMouseMove);
        document.removeEventListener('mouseup', onElemHandlerMouseUp);
      };


      document.addEventListener('mousemove', onElemHandlerMouseMove);
      document.addEventListener('mouseup', onElemHandlerMouseUp);
    });
  };


  window.utils = {
    createElemsFragment: createElemsFragment,
    createOrReplaceElem: createOrReplaceElem,
    createErrorMessageElem: createErrorMessageElem,
    findClosestElem: findClosestElem,
    enableDragging: enableDragging
  };
})();
