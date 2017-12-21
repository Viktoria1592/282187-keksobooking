'use strict';

(function () {
  window.constants = {
    /** Константы адресов сервера */
    serverUrl: {
      DOWNLOAD: 'https://js.dump.academy/keksobooking/data',
      UPLOAD: 'https://js.dump.academy/keksobooking/'
    },

    /** Константы клавиатурных кодов */
    ESC_KEYCODE: 27,
    ENTER_KEYCODE: 13,
    SPACE_KEYCODE: 32,

    /** Константы стилей ошибок */
    errorTopStyle: 'position: relative; width: 1200px; z-index: 100; padding: 15px 0; border-radius: 10px 10px 0 0; background-color: rgba(3, 28, 45, .45); text-align: center; font-weight: 700; font-size: 30px; color: white',

    errorBottomStyle: 'position: fixed; bottom: 0; width: 1200px; z-index: 100; margin-bottom: 10px; padding: 15px 0; border-radius: 10px; background-color: rgba(3, 28, 45, .45); text-align: center; font-weight: 700; font-size: 30px; color: white'
  };
})();
