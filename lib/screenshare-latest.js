/*! SkyWay Copyright(c) 2018 NTT Communications Corporation */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ScreenShare"] = factory();
	else
		root["ScreenShare"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _logger = __webpack_require__(1);

var _logger2 = _interopRequireDefault(_logger);

var _util = __webpack_require__(2);

var _chrome = __webpack_require__(3);

var _chrome2 = _interopRequireDefault(_chrome);

var _firefox = __webpack_require__(4);

var _firefox2 = _interopRequireDefault(_firefox);

var _unknown = __webpack_require__(5);

var _unknown2 = _interopRequireDefault(_unknown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Factory class for ScreenShare.
 * Currently, only Chrome and Firefox are supported.
 */
var ScreenShare = function () {
  function ScreenShare() {
    _classCallCheck(this, ScreenShare);
  }

  _createClass(ScreenShare, null, [{
    key: 'create',

    /**
     * Create ScreenShare instance.
     * @param {Object} [options] - Options for ScreenShare.
     * @param {boolean} [options.debug=false] - If true, print logs.
     * @return {FirefoxAdapter|ChromeAdapter|UnknownAdapter} - Adapter instance for each supported browser, or unknown for not supported.
     */
    value: function create() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { debug: false };

      var logger = new _logger2.default(options.debug);

      switch ((0, _util.getBrowserName)()) {
        case 'firefox':
          return new _firefox2.default(logger);
        case 'chrome':
          return new _chrome2.default(logger);
        default:
          return new _unknown2.default(logger);
      }
    }
  }]);

  return ScreenShare;
}();

exports.default = ScreenShare;
// for interop exports

module.exports = ScreenShare;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class for logging.
 */
var Logger = function () {
  /**
   * Create Logger instance.
   * @param {boolean} [isDebugMode=false] - If true, print logs.
   */
  function Logger() {
    var isDebugMode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    _classCallCheck(this, Logger);

    this._enable = isDebugMode;
  }

  /**
   * Log with prefix.
   * @param {...*} message - Arguments to log.
   */


  _createClass(Logger, [{
    key: 'log',
    value: function log() {
      if (this._enable) {
        var _console;

        for (var _len = arguments.length, message = Array(_len), _key = 0; _key < _len; _key++) {
          message[_key] = arguments[_key];
        }

        (_console = console).log.apply(_console, ['SkyWay-ScreenShare: '].concat(message));
      }
    }
  }]);

  return Logger;
}();

exports.default = Logger;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBrowserName = getBrowserName;
/**
 * Get browser name.
 * @return {string} `firefox` OR `chrome` OR `N/A`.
 */
function getBrowserName() {
  var ua = navigator.userAgent.toLowerCase();

  // Firefox
  if (ua.indexOf('firefox') !== -1) {
    return 'firefox';
  }

  // Chrome
  if (ua.indexOf('chrome') !== -1 && ua.indexOf('edge') === -1) {
    return 'chrome';
  }

  return 'N/A';
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * ScreenShare class for Chrome.
 */
var ChromeAdapter = function () {
  /**
   * Create instance.
   * @param {Logger} logger - Logger instance passed by factory.
   */
  function ChromeAdapter(logger) {
    _classCallCheck(this, ChromeAdapter);

    this._logger = logger;
    this._stream = null;

    this._logger.log('Chrome adapter ready');
  }

  /**
   * Start screen share.
   * For Chrome, you can specify mediaSource to share via dialog called by Extension.
   * @param {Object} [params] - Options for getUserMedia constraints.
   * @param {number} [params.width] - Constraints for width.
   * @param {number} [params.height] - Constraints for height.
   * @param {number} [params.frameRate] - Constraints for frameRate.
   * @return {Promise<MediaStream>} - Promise resolved with MediaStream instance.
   */


  _createClass(ChromeAdapter, [{
    key: 'start',
    value: function start() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var that = this;

      return new Promise(function (resolve, reject) {
        window.addEventListener('message', _onMessage, false);
        window.postMessage({ type: 'getStreamId' }, '*');

        /**
         * @param {Event} ev.data - Event data from extension.
         * @param {string} ev.data.type - Event type strings.
         * @param {string} ev.data.streamId - Screen id to share.
         */
        function _onMessage(_ref) {
          var data = _ref.data;

          that._logger.log('Received ' + data.type + ' message from Extension.', data);

          if (data.type !== 'gotStreamId') {
            return;
          }

          var gUMConstraints = that._paramsToConstraints(params, data.streamId);
          that._logger.log('Parameter of getUserMedia: ', gUMConstraints);

          navigator.mediaDevices.getUserMedia(gUMConstraints).then(function (stream) {
            // remove for retry
            window.removeEventListener('message', _onMessage);

            that._stream = stream;
            resolve(stream);
          }).catch(function (err) {
            // remove for cancel
            window.removeEventListener('message', _onMessage);

            reject(err);
          });
        }
      });
    }

    /**
     * Stop screen share.
     */

  }, {
    key: 'stop',
    value: function stop() {
      if (this._stream instanceof MediaStream === false) {
        return;
      }

      this._stream.getTracks().forEach(function (track) {
        return track.stop();
      });
      this._stream = null;
    }

    /**
     * Returns whether screen sharing is available or NOT.
     * @return {boolean} - Screen sharing is available or NOT.
     */

  }, {
    key: 'isScreenShareAvailable',
    value: function isScreenShareAvailable() {
      if ('__skywayWebRTCScreenShareExtensionAvailable__' in window) {
        return true;
      }

      return false;
    }

    /**
     * Convert from passed user options to MediaStreamConstraints.
     * @param {Object} params - Options for getUserMedia constraints.
     * @param {number} [params.width] - Constraints for width.
     * @param {number} [params.height] - Constraints for height.
     * @param {number} [params.frameRate] - Constraints for frameRate.
     * @param {string} streamId - Constraints for chromeMediaSourceId gotten from extension.
     * @return {MediaStreamConstraints} - Constraints for getUserMedia.
     * @private
     */

  }, {
    key: '_paramsToConstraints',
    value: function _paramsToConstraints(params, streamId) {
      var gUMConstraints = {
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: streamId
          },
          optional: [{
            googTemporalLayeredScreencast: true
          }]
        },
        audio: false
      };

      if (isFinite(params.width)) {
        gUMConstraints.video.mandatory.maxWidth = params.width;
        gUMConstraints.video.mandatory.minWidth = params.width;
      }
      if (isFinite(params.height)) {
        gUMConstraints.video.mandatory.maxHeight = params.height;
        gUMConstraints.video.mandatory.minHeight = params.height;
      }
      if (isFinite(params.frameRate)) {
        gUMConstraints.video.mandatory.maxFrameRate = params.frameRate;
        gUMConstraints.video.mandatory.minFrameRate = params.frameRate;
      }

      return gUMConstraints;
    }
  }]);

  return ChromeAdapter;
}();

exports.default = ChromeAdapter;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * ScreenShare class for Firefox.
 */
var FirefoxAdapter = function () {
  /**
   * Create instance.
   * @param {Logger} logger - Logger instance passed by factory.
   */
  function FirefoxAdapter(logger) {
    _classCallCheck(this, FirefoxAdapter);

    this._logger = logger;
    this._stream = null;

    this._logger.log('Firefox adapter ready');
  }

  /**
   * Start screen share.
   * For Firefox, you can specify mediaSource to share.
   * @param {Object} [params] - Options for getUserMedia constraints.
   * @param {number} [params.width] - Constraints for width.
   * @param {number} [params.height] - Constraints for height.
   * @param {number} [params.frameRate] - Constraints for frameRate.
   * @param {string} [params.mediaSource] - Constraints for mediaSource.
   * @return {Promise<MediaStream>} - Promise resolved with MediaStream instance.
   */


  _createClass(FirefoxAdapter, [{
    key: 'start',
    value: function start() {
      var _this = this;

      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var gUMConstraints = this._paramsToConstraints(params);
      this._logger.log('Parameter of getUserMedia: ', gUMConstraints);

      return navigator.mediaDevices.getUserMedia(gUMConstraints).then(function (stream) {
        _this._stream = stream;

        return Promise.resolve(stream);
      });
    }

    /**
     * Stop screen share.
     */

  }, {
    key: 'stop',
    value: function stop() {
      if (this._stream instanceof MediaStream === false) {
        return;
      }

      this._stream.getTracks().forEach(function (track) {
        return track.stop();
      });
      this._stream = null;
    }

    /**
     * Returns whether screen sharing is available or NOT.
     * @return {boolean} - Screen sharing is available or NOT.
     */

  }, {
    key: 'isScreenShareAvailable',
    value: function isScreenShareAvailable() {
      return true;
    }

    /**
     * Convert from passed user options to MediaStreamConstraints.
     * @param {Object} params - Options for getUserMedia constraints.
     * @param {number} [params.width] - Constraints for width.
     * @param {number} [params.height] - Constraints for height.
     * @param {number} [params.frameRate] - Constraints for frameRate.
     * @param {string} [params.mediaSource] - Constraints for mediaSource.
     * @return {MediaStreamConstraints} - Constraints for getUserMedia.
     * @private
     */

  }, {
    key: '_paramsToConstraints',
    value: function _paramsToConstraints(params) {
      var gUMConstraints = {
        video: {
          mediaSource: 'window'
        },
        audio: false
      };

      if ('mediaSource' in params) {
        gUMConstraints.video.mediaSource = params.mediaSource;
      }
      if (isFinite(params.width)) {
        gUMConstraints.video.width = { min: params.width, max: params.width };
      }
      if (isFinite(params.height)) {
        gUMConstraints.video.height = { min: params.height, max: params.height };
      }
      if (isFinite(params.frameRate)) {
        gUMConstraints.video.frameRate = { min: params.frameRate, max: params.frameRate };
      }

      return gUMConstraints;
    }
  }]);

  return FirefoxAdapter;
}();

exports.default = FirefoxAdapter;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * ScreenShare class for unknown(not supported browser).
 */
var UnknownAdapter = function () {
  /**
   * Create instance.
   * @param {Logger} logger - Logger instance passed by factory.
   */
  function UnknownAdapter(logger) {
    _classCallCheck(this, UnknownAdapter);

    this._logger = logger;
    this._logger.log('This browser does not support screen share.');
  }

  /**
   * Start screen share.
   * Just rejects for not supported browser.
   * @return {Promise<MediaStream>} - Always returns rejected Promise with error.
   */


  _createClass(UnknownAdapter, [{
    key: 'start',
    value: function start() {
      var err = new Error('This browser does not support screen share.');
      return Promise.reject(err);
    }

    /**
     * Stop screen share.
     */

  }, {
    key: 'stop',
    value: function stop() {}
    // nothing to do


    /**
     * Returns whether screen sharing is available or NOT.
     * @return {boolean} - Screen sharing is available or NOT.
     */

  }, {
    key: 'isScreenShareAvailable',
    value: function isScreenShareAvailable() {
      return false;
    }
  }]);

  return UnknownAdapter;
}();

exports.default = UnknownAdapter;

/***/ })
/******/ ]);
});