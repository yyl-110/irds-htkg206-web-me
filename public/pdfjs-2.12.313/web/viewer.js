/**
 * @licstart The following is the entire license notice for the
 * Javascript code in this page
 *
 * Copyright 2021 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @licend The above is the entire license notice for the
 * Javascript code in this page
 */

/******/ (() => { // webpackBootstrap
/******/ 'use strict'
  /******/ const __webpack_modules__ = ([
    /* 0 */,
    /* 1 */
    /***/ (__unused_webpack_module, exports) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.compatibilityParams = exports.OptionKind = exports.AppOptions = void 0

      function _typeof(obj) {
        '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof(obj) { return typeof obj } }
        else { _typeof = function _typeof(obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj)
      }

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      const compatibilityParams = Object.create(null)
      exports.compatibilityParams = compatibilityParams
      {
        const userAgent = typeof navigator !== 'undefined' && navigator.userAgent || ''
        const platform = typeof navigator !== 'undefined' && navigator.platform || ''
        const maxTouchPoints = typeof navigator !== 'undefined' && navigator.maxTouchPoints || 1
        const isAndroid = /Android/.test(userAgent)
        const isIOS = /\b(iPad|iPhone|iPod)(?=;)/.test(userAgent) || platform === 'MacIntel' && maxTouchPoints > 1
        const isIOSChrome = /CriOS/.test(userAgent);

        (function checkOnBlobSupport() {
          if (isIOSChrome) {
            compatibilityParams.disableCreateObjectURL = true
          }
        })();

        (function checkCanvasSizeLimitation() {
          if (isIOS || isAndroid) {
            compatibilityParams.maxCanvasPixels = 5242880
          }
        })()
      }
      const OptionKind = {
        VIEWER: 0x02,
        API: 0x04,
        WORKER: 0x08,
        PREFERENCE: 0x80,
      }
      exports.OptionKind = OptionKind
      const defaultOptions = {
        annotationMode: {
          value: 2,
          kind: OptionKind.VIEWER + OptionKind.PREFERENCE,
        },
        cursorToolOnLoad: {
          value: 0,
          kind: OptionKind.VIEWER + OptionKind.PREFERENCE,
        },
        defaultUrl: {
          value: 'compressed.tracemonkey-pldi-09.pdf',
          kind: OptionKind.VIEWER,
        },
        defaultZoomValue: {
          value: '',
          kind: OptionKind.VIEWER + OptionKind.PREFERENCE,
        },
        disableHistory: {
          value: false,
          kind: OptionKind.VIEWER,
        },
        disablePageLabels: {
          value: false,
          kind: OptionKind.VIEWER + OptionKind.PREFERENCE,
        },
        enablePermissions: {
          value: false,
          kind: OptionKind.VIEWER + OptionKind.PREFERENCE,
        },
        enablePrintAutoRotate: {
          value: true,
          kind: OptionKind.VIEWER + OptionKind.PREFERENCE,
        },
        enableScripting: {
          value: true,
          kind: OptionKind.VIEWER + OptionKind.PREFERENCE,
        },
        externalLinkRel: {
          value: 'noopener noreferrer nofollow',
          kind: OptionKind.VIEWER,
        },
        externalLinkTarget: {
          value: 0,
          kind: OptionKind.VIEWER + OptionKind.PREFERENCE,
        },
        historyUpdateUrl: {
          value: false,
          kind: OptionKind.VIEWER + OptionKind.PREFERENCE,
        },
        ignoreDestinationZoom: {
          value: false,
          kind: OptionKind.VIEWER + OptionKind.PREFERENCE,
        },
        imageResourcesPath: {
          value: './images/',
          kind: OptionKind.VIEWER,
        },
        maxCanvasPixels: {
          value: 16777216,
          compatibility: compatibilityParams.maxCanvasPixels,
          kind: OptionKind.VIEWER,
        },
        pdfBugEnabled: {
          value: false,
          kind: OptionKind.VIEWER + OptionKind.PREFERENCE,
        },
        printResolution: {
          value: 150,
          kind: OptionKind.VIEWER,
        },
        renderer: {
          value: 'canvas',
          kind: OptionKind.VIEWER,
        },
        sidebarViewOnLoad: {
          value: -1,
          kind: OptionKind.VIEWER + OptionKind.PREFERENCE,
        },
        scrollModeOnLoad: {
          value: -1,
          kind: OptionKind.VIEWER + OptionKind.PREFERENCE,
        },
        spreadModeOnLoad: {
          value: -1,
          kind: OptionKind.VIEWER + OptionKind.PREFERENCE,
        },
        textLayerMode: {
          value: 1,
          kind: OptionKind.VIEWER + OptionKind.PREFERENCE,
        },
        useOnlyCssZoom: {
          value: false,
          kind: OptionKind.VIEWER + OptionKind.PREFERENCE,
        },
        viewerCssTheme: {
          value: 0,
          kind: OptionKind.VIEWER + OptionKind.PREFERENCE,
        },
        viewOnLoad: {
          value: 0,
          kind: OptionKind.VIEWER + OptionKind.PREFERENCE,
        },
        cMapPacked: {
          value: true,
          kind: OptionKind.API,
        },
        cMapUrl: {
          value: '../web/cmaps/',
          kind: OptionKind.API,
        },
        disableAutoFetch: {
          value: false,
          kind: OptionKind.API + OptionKind.PREFERENCE,
        },
        disableFontFace: {
          value: false,
          kind: OptionKind.API + OptionKind.PREFERENCE,
        },
        disableRange: {
          value: false,
          kind: OptionKind.API + OptionKind.PREFERENCE,
        },
        disableStream: {
          value: false,
          kind: OptionKind.API + OptionKind.PREFERENCE,
        },
        docBaseUrl: {
          value: '',
          kind: OptionKind.API,
        },
        enableXfa: {
          value: true,
          kind: OptionKind.API + OptionKind.PREFERENCE,
        },
        fontExtraProperties: {
          value: false,
          kind: OptionKind.API,
        },
        isEvalSupported: {
          value: true,
          kind: OptionKind.API,
        },
        maxImageSize: {
          value: -1,
          kind: OptionKind.API,
        },
        pdfBug: {
          value: false,
          kind: OptionKind.API,
        },
        standardFontDataUrl: {
          value: '../web/standard_fonts/',
          kind: OptionKind.API,
        },
        verbosity: {
          value: 1,
          kind: OptionKind.API,
        },
        workerPort: {
          value: null,
          kind: OptionKind.WORKER,
        },
        workerSrc: {
          value: '../build/pdf.worker.js',
          kind: OptionKind.WORKER,
        },
      }
      {
        defaultOptions.disablePreferences = {
          value: false,
          kind: OptionKind.VIEWER,
        }
        defaultOptions.locale = {
          value: typeof navigator !== 'undefined' ? navigator.language : 'en-US',
          kind: OptionKind.VIEWER,
        }
        defaultOptions.sandboxBundleSrc = {
          value: '../build/pdf.sandbox.js',
          kind: OptionKind.VIEWER,
        }
        defaultOptions.renderer.kind += OptionKind.PREFERENCE
      }
      const userOptions = Object.create(null)

      const AppOptions = /* #__PURE__ */(function () {
        function AppOptions() {
          _classCallCheck(this, AppOptions)

          throw new Error('Cannot initialize AppOptions.')
        }

        _createClass(AppOptions, null, [{
          key: 'get',
          value: function get(name) {
            const userOption = userOptions[name]

            if (userOption !== undefined) {
              return userOption
            }

            const defaultOption = defaultOptions[name]

            if (defaultOption !== undefined) {
              let _defaultOption$compat

              return (_defaultOption$compat = defaultOption.compatibility) !== null && _defaultOption$compat !== void 0 ? _defaultOption$compat : defaultOption.value
            }

            return undefined
          },
        }, {
          key: 'getAll',
          value: function getAll() {
            const kind = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null
            const options = Object.create(null)

            for (const name in defaultOptions) {
              var _defaultOption$compat2

              const defaultOption = defaultOptions[name]

              if (kind) {
                if ((kind & defaultOption.kind) === 0) {
                  continue
                }

                if (kind === OptionKind.PREFERENCE) {
                  const value = defaultOption.value
                  const valueType = _typeof(value)

                  if (valueType === 'boolean' || valueType === 'string' || valueType === 'number' && Number.isInteger(value)) {
                    options[name] = value
                    continue
                  }

                  throw new Error('Invalid type for preference: '.concat(name))
                }
              }

              const userOption = userOptions[name]
              options[name] = userOption !== undefined ? userOption : (_defaultOption$compat2 = defaultOption.compatibility) !== null && _defaultOption$compat2 !== void 0 ? _defaultOption$compat2 : defaultOption.value
            }

            return options
          },
        }, {
          key: 'set',
          value: function set(name, value) {
            userOptions[name] = value
          },
        }, {
          key: 'setAll',
          value: function setAll(options) {
            for (const name in options) {
              userOptions[name] = options[name]
            }
          },
        }, {
          key: 'remove',
          value: function remove(name) {
            delete userOptions[name]
          },
        }, {
          key: '_hasUserOptions',
          value: function _hasUserOptions() {
            return Object.keys(userOptions).length > 0
          },
        }])

        return AppOptions
      }())

      exports.AppOptions = AppOptions

      /***/
    },
    /* 2 */
    /***/ (__unused_webpack_module, exports, __webpack_require__) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.PDFViewerApplication = exports.PDFPrintServiceFactory = exports.DefaultExternalServices = void 0

      const _regenerator = _interopRequireDefault(__webpack_require__(3))

      const _ui_utils = __webpack_require__(5)

      const _app_options = __webpack_require__(1)

      const _event_utils = __webpack_require__(6)

      const _pdfjsLib = __webpack_require__(7)

      const _pdf_cursor_tools = __webpack_require__(8)

      const _overlay_manager = __webpack_require__(10)

      const _password_prompt = __webpack_require__(11)

      const _pdf_attachment_viewer = __webpack_require__(12)

      const _pdf_document_properties = __webpack_require__(14)

      const _pdf_find_bar = __webpack_require__(15)

      const _pdf_find_controller = __webpack_require__(16)

      const _pdf_history = __webpack_require__(18)

      const _pdf_layer_viewer = __webpack_require__(19)

      const _pdf_link_service = __webpack_require__(20)

      const _pdf_outline_viewer = __webpack_require__(21)

      const _pdf_presentation_mode = __webpack_require__(22)

      const _pdf_rendering_queue = __webpack_require__(23)

      const _pdf_scripting_manager = __webpack_require__(24)

      const _pdf_sidebar = __webpack_require__(25)

      const _pdf_sidebar_resizer = __webpack_require__(26)

      const _pdf_thumbnail_viewer = __webpack_require__(27)

      const _pdf_viewer = __webpack_require__(29)

      const _secondary_toolbar = __webpack_require__(38)

      const _toolbar = __webpack_require__(39)

      const _view_history = __webpack_require__(40)

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj } }

      function ownKeys(object, enumerableOnly) { const keys = Object.keys(object); if (Object.getOwnPropertySymbols) { let symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter((sym) => { return Object.getOwnPropertyDescriptor(object, sym).enumerable }) } keys.push.apply(keys, symbols) } return keys }

      function _objectSpread(target) {
        for (let i = 1; i < arguments.length; i++) {
          var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach((key) => { _defineProperty(target, key, source[key]) }) }
          else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) }
          else { ownKeys(Object(source)).forEach((key) => { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)) }) }
        } return target
      }

      function _defineProperty(obj, key, value) {
        if (key in obj) { Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true }) }
        else { obj[key] = value } return obj
      }

      function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest() }

      function _nonIterableRest() { throw new TypeError('Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') }

      function _iterableToArrayLimit(arr, i) {
        let _i = arr == null ? null : typeof Symbol !== 'undefined' && arr[Symbol.iterator] || arr['@@iterator']; if (_i == null)
          return; const _arr = []; let _n = true; let _d = false; let _s, _e; try {
            for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
              _arr.push(_s.value); if (i && _arr.length === i)
                break
            }
          }
        catch (err) { _d = true; _e = err }
        finally {
          try {
            if (!_n && _i.return != null)
              _i.return()
          }
          finally {
            if (_d)
              throw _e
          }
        } return _arr
      }

      function _arrayWithHoles(arr) {
        if (Array.isArray(arr))
          return arr
      }

      function _createForOfIteratorHelper(o, allowArrayLike) {
        let it = typeof Symbol !== 'undefined' && o[Symbol.iterator] || o['@@iterator']; if (!it) {
          if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === 'number') {
            if (it)
              o = it; let i = 0; const F = function F() { }; return {
                s: F,
                n: function n() {
                  if (i >= o.length)
                    return { done: true }; return { done: false, value: o[i++] }
                },
                e: function e(_e2) { throw _e2 },
                f: F,
              }
          } throw new TypeError('Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.')
        } let normalCompletion = true; let didErr = false; let err; return {
          s: function s() { it = it.call(o) },
          n: function n() { const step = it.next(); normalCompletion = step.done; return step },
          e: function e(_e3) { didErr = true; err = _e3 },
          f: function f() {
            try {
              if (!normalCompletion && it.return != null)
                it.return()
            }
            finally {
              if (didErr)
                throw err
            }
          },
        }
      }

      function _unsupportedIterableToArray(o, minLen) {
        if (!o)
          return; if (typeof o === 'string')
          return _arrayLikeToArray(o, minLen); let n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor)
          n = o.constructor.name; if (n === 'Map' || n === 'Set')
          return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
          return _arrayLikeToArray(o, minLen)
      }

      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length)
          len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2
      }

      function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
        try { var info = gen[key](arg); var value = info.value }
        catch (error) { reject(error); return } if (info.done) { resolve(value) }
        else { Promise.resolve(value).then(_next, _throw) }
      }

      function _asyncToGenerator(fn) { return function () { const self = this; const args = arguments; return new Promise((resolve, reject) => { const gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value) } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err) } _next(undefined) }) } }

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      const DISABLE_AUTO_FETCH_LOADING_BAR_TIMEOUT = 5000
      const FORCE_PAGES_LOADED_TIMEOUT = 10000
      const WHEEL_ZOOM_DISABLED_TIMEOUT = 1000
      const ViewOnLoad = {
        UNKNOWN: -1,
        PREVIOUS: 0,
        INITIAL: 1,
      }
      const ViewerCssTheme = {
        AUTOMATIC: 0,
        LIGHT: 1,
        DARK: 2,
      }
      const KNOWN_VERSIONS = ['1.0', '1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9', '2.0', '2.1', '2.2', '2.3']
      const KNOWN_GENERATORS = ['acrobat distiller', 'acrobat pdfwriter', 'adobe livecycle', 'adobe pdf library', 'adobe photoshop', 'ghostscript', 'tcpdf', 'cairo', 'dvipdfm', 'dvips', 'pdftex', 'pdfkit', 'itext', 'prince', 'quarkxpress', 'mac os x', 'microsoft', 'openoffice', 'oracle', 'luradocument', 'pdf-xchange', 'antenna house', 'aspose.cells', 'fpdf']

      const DefaultExternalServices = /* #__PURE__ */(function () {
        function DefaultExternalServices() {
          _classCallCheck(this, DefaultExternalServices)

          throw new Error('Cannot initialize DefaultExternalServices.')
        }

        _createClass(DefaultExternalServices, null, [{
          key: 'updateFindControlState',
          value: function updateFindControlState(data) { },
        }, {
          key: 'updateFindMatchesCount',
          value: function updateFindMatchesCount(data) { },
        }, {
          key: 'initPassiveLoading',
          value: function initPassiveLoading(callbacks) { },
        }, {
          key: 'fallback',
          value: (function () {
            const _fallback = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee(data) {
              return _regenerator.default.wrap((_context) => {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                    case 'end':
                      return _context.stop()
                  }
                }
              }, _callee)
            }))

            function fallback(_x) {
              return _fallback.apply(this, arguments)
            }

            return fallback
          }()),
        }, {
          key: 'reportTelemetry',
          value: function reportTelemetry(data) { },
        }, {
          key: 'createDownloadManager',
          value: function createDownloadManager(options) {
            throw new Error('Not implemented: createDownloadManager')
          },
        }, {
          key: 'createPreferences',
          value: function createPreferences() {
            throw new Error('Not implemented: createPreferences')
          },
        }, {
          key: 'createL10n',
          value: function createL10n(options) {
            throw new Error('Not implemented: createL10n')
          },
        }, {
          key: 'createScripting',
          value: function createScripting(options) {
            throw new Error('Not implemented: createScripting')
          },
        }, {
          key: 'supportsIntegratedFind',
          get: function get() {
            return (0, _pdfjsLib.shadow)(this, 'supportsIntegratedFind', false)
          },
        }, {
          key: 'supportsDocumentFonts',
          get: function get() {
            return (0, _pdfjsLib.shadow)(this, 'supportsDocumentFonts', true)
          },
        }, {
          key: 'supportedMouseWheelZoomModifierKeys',
          get: function get() {
            return (0, _pdfjsLib.shadow)(this, 'supportedMouseWheelZoomModifierKeys', {
              ctrlKey: true,
              metaKey: true,
            })
          },
        }, {
          key: 'isInAutomation',
          get: function get() {
            return (0, _pdfjsLib.shadow)(this, 'isInAutomation', false)
          },
        }])

        return DefaultExternalServices
      }())

      exports.DefaultExternalServices = DefaultExternalServices
      const PDFViewerApplication = {
        initialBookmark: document.location.hash.substring(1),
        _initializedCapability: (0, _pdfjsLib.createPromiseCapability)(),
        _fellback: false,
        appConfig: null,
        pdfDocument: null,
        pdfLoadingTask: null,
        printService: null,
        pdfViewer: null,
        pdfThumbnailViewer: null,
        pdfRenderingQueue: null,
        pdfPresentationMode: null,
        pdfDocumentProperties: null,
        pdfLinkService: null,
        pdfHistory: null,
        pdfSidebar: null,
        pdfSidebarResizer: null,
        pdfOutlineViewer: null,
        pdfAttachmentViewer: null,
        pdfLayerViewer: null,
        pdfCursorTools: null,
        pdfScriptingManager: null,
        store: null,
        downloadManager: null,
        overlayManager: null,
        preferences: null,
        toolbar: null,
        secondaryToolbar: null,
        eventBus: null,
        l10n: null,
        isInitialViewSet: false,
        downloadComplete: false,
        isViewerEmbedded: window.parent !== window,
        url: '',
        baseUrl: '',
        _downloadUrl: '',
        externalServices: DefaultExternalServices,
        _boundEvents: Object.create(null),
        documentInfo: null,
        metadata: null,
        _contentDispositionFilename: null,
        _contentLength: null,
        _saveInProgress: false,
        _docStats: null,
        _wheelUnusedTicks: 0,
        _idleCallbacks: new Set(),
        initialize: function initialize(appConfig) {
          const _this = this

          return _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee2() {
            let appContainer
            return _regenerator.default.wrap((_context2) => {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _this.preferences = _this.externalServices.createPreferences()
                    _this.appConfig = appConfig
                    _context2.next = 4
                    return _this._readPreferences()

                  case 4:
                    _context2.next = 6
                    return _this._parseHashParameters()

                  case 6:
                    _this._forceCssTheme()

                    _context2.next = 9
                    return _this._initializeL10n()

                  case 9:
                    if (_this.isViewerEmbedded && _app_options.AppOptions.get('externalLinkTarget') === _pdfjsLib.LinkTarget.NONE) {
                      _app_options.AppOptions.set('externalLinkTarget', _pdfjsLib.LinkTarget.TOP)
                    }

                    _context2.next = 12
                    return _this._initializeViewerComponents()

                  case 12:
                    _this.bindEvents()

                    _this.bindWindowEvents()

                    appContainer = appConfig.appContainer || document.documentElement

                    _this.l10n.translate(appContainer).then(() => {
                      _this.eventBus.dispatch('localized', {
                        source: _this,
                      })
                    })

                    _this._initializedCapability.resolve()

                  case 17:
                  case 'end':
                    return _context2.stop()
                }
              }
            }, _callee2)
          }))()
        },
        _readPreferences: function _readPreferences() {
          const _this2 = this

          return _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee3() {
            return _regenerator.default.wrap((_context3) => {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    if (!_app_options.AppOptions.get('disablePreferences')) {
                      _context3.next = 2
                      break
                    }

                    return _context3.abrupt('return')

                  case 2:
                    if (_app_options.AppOptions._hasUserOptions()) {
                      console.warn('_readPreferences: The Preferences may override manually set AppOptions; ' + 'please use the "disablePreferences"-option in order to prevent that.')
                    }

                    _context3.prev = 3
                    _context3.t0 = _app_options.AppOptions
                    _context3.next = 7
                    return _this2.preferences.getAll()

                  case 7:
                    _context3.t1 = _context3.sent

                    _context3.t0.setAll.call(_context3.t0, _context3.t1)

                    _context3.next = 14
                    break

                  case 11:
                    _context3.prev = 11
                    _context3.t2 = _context3.catch(3)
                    console.error('_readPreferences: "'.concat(_context3.t2 === null || _context3.t2 === void 0 ? void 0 : _context3.t2.message, '".'))

                  case 14:
                  case 'end':
                    return _context3.stop()
                }
              }
            }, _callee3, null, [[3, 11]])
          }))()
        },
        _parseHashParameters: function _parseHashParameters() {
          const _this3 = this

          return _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee4() {
            let hash, params, waitOn, viewer, enabled
            return _regenerator.default.wrap((_context4) => {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    if (_app_options.AppOptions.get('pdfBugEnabled')) {
                      _context4.next = 2
                      break
                    }

                    return _context4.abrupt('return')

                  case 2:
                    hash = document.location.hash.substring(1)

                    if (hash) {
                      _context4.next = 5
                      break
                    }

                    return _context4.abrupt('return')

                  case 5:
                    params = (0, _ui_utils.parseQueryString)(hash), waitOn = []

                    if (params.get('disableworker') === 'true') {
                      waitOn.push(loadFakeWorker())
                    }

                    if (params.has('disablerange')) {
                      _app_options.AppOptions.set('disableRange', params.get('disablerange') === 'true')
                    }

                    if (params.has('disablestream')) {
                      _app_options.AppOptions.set('disableStream', params.get('disablestream') === 'true')
                    }

                    if (params.has('disableautofetch')) {
                      _app_options.AppOptions.set('disableAutoFetch', params.get('disableautofetch') === 'true')
                    }

                    if (params.has('disablefontface')) {
                      _app_options.AppOptions.set('disableFontFace', params.get('disablefontface') === 'true')
                    }

                    if (params.has('disablehistory')) {
                      _app_options.AppOptions.set('disableHistory', params.get('disablehistory') === 'true')
                    }

                    if (params.has('verbosity')) {
                      _app_options.AppOptions.set('verbosity', params.get('verbosity') | 0)
                    }

                    if (!params.has('textlayer')) {
                      _context4.next = 22
                      break
                    }

                    _context4.t0 = params.get('textlayer')
                    _context4.next = _context4.t0 === 'off' ? 17 : _context4.t0 === 'visible' ? 19 : _context4.t0 === 'shadow' ? 19 : _context4.t0 === 'hover' ? 19 : 22
                    break

                  case 17:
                    _app_options.AppOptions.set('textLayerMode', _ui_utils.TextLayerMode.DISABLE)

                    return _context4.abrupt('break', 22)

                  case 19:
                    viewer = _this3.appConfig.viewerContainer
                    viewer.classList.add('textLayer-'.concat(params.get('textlayer')))
                    return _context4.abrupt('break', 22)

                  case 22:
                    if (params.has('pdfbug')) {
                      _app_options.AppOptions.set('pdfBug', true)

                      _app_options.AppOptions.set('fontExtraProperties', true)

                      enabled = params.get('pdfbug').split(',')
                      waitOn.push(initPDFBug(enabled))
                    }

                    if (params.has('locale')) {
                      _app_options.AppOptions.set('locale', params.get('locale'))
                    }

                    if (!(waitOn.length === 0)) {
                      _context4.next = 26
                      break
                    }

                    return _context4.abrupt('return')

                  case 26:
                    _context4.prev = 26
                    _context4.next = 29
                    return Promise.all(waitOn)

                  case 29:
                    _context4.next = 34
                    break

                  case 31:
                    _context4.prev = 31
                    _context4.t1 = _context4.catch(26)
                    console.error('_parseHashParameters: "'.concat(_context4.t1.message, '".'))

                  case 34:
                  case 'end':
                    return _context4.stop()
                }
              }
            }, _callee4, null, [[26, 31]])
          }))()
        },
        _initializeL10n: function _initializeL10n() {
          const _this4 = this

          return _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee5() {
            let dir
            return _regenerator.default.wrap((_context5) => {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    _this4.l10n = _this4.externalServices.createL10n({
                      locale: _app_options.AppOptions.get('locale'),
                    })
                    _context5.next = 3
                    return _this4.l10n.getDirection()

                  case 3:
                    dir = _context5.sent
                    document.getElementsByTagName('html')[0].dir = dir

                  case 5:
                  case 'end':
                    return _context5.stop()
                }
              }
            }, _callee5)
          }))()
        },
        _forceCssTheme: function _forceCssTheme() {
          const cssTheme = _app_options.AppOptions.get('viewerCssTheme')

          if (cssTheme === ViewerCssTheme.AUTOMATIC || !Object.values(ViewerCssTheme).includes(cssTheme)) {
            return
          }

          try {
            const styleSheet = document.styleSheets[0]
            const cssRules = (styleSheet === null || styleSheet === void 0 ? void 0 : styleSheet.cssRules) || []

            for (let i = 0, ii = cssRules.length; i < ii; i++) {
              var _rule$media

              const rule = cssRules[i]

              if (rule instanceof CSSMediaRule && ((_rule$media = rule.media) === null || _rule$media === void 0 ? void 0 : _rule$media[0]) === '(prefers-color-scheme: dark)') {
                if (cssTheme === ViewerCssTheme.LIGHT) {
                  styleSheet.deleteRule(i)
                  return
                }

                const darkRules = /^@media \(prefers-color-scheme: dark\) {\n\s*([\w\s-.,:;/\\{}()]+)\n}$/.exec(rule.cssText)

                if (darkRules !== null && darkRules !== void 0 && darkRules[1]) {
                  styleSheet.deleteRule(i)
                  styleSheet.insertRule(darkRules[1], i)
                }

                return
              }
            }
          }
          catch (reason) {
            console.error('_forceCssTheme: "'.concat(reason === null || reason === void 0 ? void 0 : reason.message, '".'))
          }
        },
        _initializeViewerComponents: function _initializeViewerComponents() {
          const _this5 = this

          return _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee6() {
            let appConfig, externalServices, eventBus, pdfRenderingQueue, pdfLinkService, downloadManager, findController, pdfScriptingManager, container, viewer
            return _regenerator.default.wrap((_context6) => {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    appConfig = _this5.appConfig, externalServices = _this5.externalServices

                    if (appConfig.eventBus) {
                      eventBus = appConfig.eventBus
                    }
                    else if (externalServices.isInAutomation) {
                      eventBus = new _event_utils.AutomationEventBus()
                    }
                    else {
                      eventBus = new _event_utils.EventBus()
                    }

                    _this5.eventBus = eventBus
                    _this5.overlayManager = new _overlay_manager.OverlayManager()
                    pdfRenderingQueue = new _pdf_rendering_queue.PDFRenderingQueue()
                    pdfRenderingQueue.onIdle = _this5._cleanup.bind(_this5)
                    _this5.pdfRenderingQueue = pdfRenderingQueue
                    pdfLinkService = new _pdf_link_service.PDFLinkService({
                      eventBus,
                      externalLinkTarget: _app_options.AppOptions.get('externalLinkTarget'),
                      externalLinkRel: _app_options.AppOptions.get('externalLinkRel'),
                      ignoreDestinationZoom: _app_options.AppOptions.get('ignoreDestinationZoom'),
                    })
                    _this5.pdfLinkService = pdfLinkService
                    downloadManager = externalServices.createDownloadManager()
                    _this5.downloadManager = downloadManager
                    findController = new _pdf_find_controller.PDFFindController({
                      linkService: pdfLinkService,
                      eventBus,
                    })
                    _this5.findController = findController
                    pdfScriptingManager = new _pdf_scripting_manager.PDFScriptingManager({
                      eventBus,
                      sandboxBundleSrc: _app_options.AppOptions.get('sandboxBundleSrc'),
                      scriptingFactory: externalServices,
                      docPropertiesLookup: _this5._scriptingDocProperties.bind(_this5),
                    })
                    _this5.pdfScriptingManager = pdfScriptingManager
                    container = appConfig.mainContainer
                    viewer = appConfig.viewerContainer
                    _this5.pdfViewer = new _pdf_viewer.PDFViewer({
                      container,
                      viewer,
                      eventBus,
                      renderingQueue: pdfRenderingQueue,
                      linkService: pdfLinkService,
                      downloadManager,
                      findController,
                      scriptingManager: _app_options.AppOptions.get('enableScripting') && pdfScriptingManager,
                      renderer: _app_options.AppOptions.get('renderer'),
                      l10n: _this5.l10n,
                      textLayerMode: _app_options.AppOptions.get('textLayerMode'),
                      annotationMode: _app_options.AppOptions.get('annotationMode'),
                      imageResourcesPath: _app_options.AppOptions.get('imageResourcesPath'),
                      enablePrintAutoRotate: _app_options.AppOptions.get('enablePrintAutoRotate'),
                      useOnlyCssZoom: _app_options.AppOptions.get('useOnlyCssZoom'),
                      maxCanvasPixels: _app_options.AppOptions.get('maxCanvasPixels'),
                      enablePermissions: _app_options.AppOptions.get('enablePermissions'),
                    })
                    pdfRenderingQueue.setViewer(_this5.pdfViewer)
                    pdfLinkService.setViewer(_this5.pdfViewer)
                    pdfScriptingManager.setViewer(_this5.pdfViewer)
                    _this5.pdfThumbnailViewer = new _pdf_thumbnail_viewer.PDFThumbnailViewer({
                      container: appConfig.sidebar.thumbnailView,
                      eventBus,
                      renderingQueue: pdfRenderingQueue,
                      linkService: pdfLinkService,
                      l10n: _this5.l10n,
                    })
                    pdfRenderingQueue.setThumbnailViewer(_this5.pdfThumbnailViewer)

                    if (!_this5.isViewerEmbedded && !_app_options.AppOptions.get('disableHistory')) {
                      _this5.pdfHistory = new _pdf_history.PDFHistory({
                        linkService: pdfLinkService,
                        eventBus,
                      })
                      pdfLinkService.setHistory(_this5.pdfHistory)
                    }

                    if (!_this5.supportsIntegratedFind) {
                      _this5.findBar = new _pdf_find_bar.PDFFindBar(appConfig.findBar, eventBus, _this5.l10n)
                    }

                    _this5.pdfDocumentProperties = new _pdf_document_properties.PDFDocumentProperties(appConfig.documentProperties, _this5.overlayManager, eventBus, _this5.l10n)
                    _this5.pdfCursorTools = new _pdf_cursor_tools.PDFCursorTools({
                      container,
                      eventBus,
                      cursorToolOnLoad: _app_options.AppOptions.get('cursorToolOnLoad'),
                    })
                    _this5.toolbar = new _toolbar.Toolbar(appConfig.toolbar, eventBus, _this5.l10n)
                    _this5.secondaryToolbar = new _secondary_toolbar.SecondaryToolbar(appConfig.secondaryToolbar, container, eventBus)

                    if (_this5.supportsFullscreen) {
                      _this5.pdfPresentationMode = new _pdf_presentation_mode.PDFPresentationMode({
                        container,
                        pdfViewer: _this5.pdfViewer,
                        eventBus,
                      })
                    }

                    _this5.passwordPrompt = new _password_prompt.PasswordPrompt(appConfig.passwordOverlay, _this5.overlayManager, _this5.l10n, _this5.isViewerEmbedded)
                    _this5.pdfOutlineViewer = new _pdf_outline_viewer.PDFOutlineViewer({
                      container: appConfig.sidebar.outlineView,
                      eventBus,
                      linkService: pdfLinkService,
                    })
                    _this5.pdfAttachmentViewer = new _pdf_attachment_viewer.PDFAttachmentViewer({
                      container: appConfig.sidebar.attachmentsView,
                      eventBus,
                      downloadManager,
                    })
                    _this5.pdfLayerViewer = new _pdf_layer_viewer.PDFLayerViewer({
                      container: appConfig.sidebar.layersView,
                      eventBus,
                      l10n: _this5.l10n,
                    })
                    _this5.pdfSidebar = new _pdf_sidebar.PDFSidebar({
                      elements: appConfig.sidebar,
                      pdfViewer: _this5.pdfViewer,
                      pdfThumbnailViewer: _this5.pdfThumbnailViewer,
                      eventBus,
                      l10n: _this5.l10n,
                    })
                    _this5.pdfSidebar.onToggled = _this5.forceRendering.bind(_this5)
                    _this5.pdfSidebarResizer = new _pdf_sidebar_resizer.PDFSidebarResizer(appConfig.sidebarResizer, eventBus, _this5.l10n)

                  case 37:
                  case 'end':
                    return _context6.stop()
                }
              }
            }, _callee6)
          }))()
        },
        run: function run(config) {
          this.initialize(config).then(webViewerInitialized)
        },

        get initialized() {
          return this._initializedCapability.settled
        },

        get initializedPromise() {
          return this._initializedCapability.promise
        },

        zoomIn: function zoomIn(steps) {
          if (this.pdfViewer.isInPresentationMode) {
            return
          }

          this.pdfViewer.increaseScale(steps)
        },
        zoomOut: function zoomOut(steps) {
          if (this.pdfViewer.isInPresentationMode) {
            return
          }

          this.pdfViewer.decreaseScale(steps)
        },
        zoomReset: function zoomReset() {
          if (this.pdfViewer.isInPresentationMode) {
            return
          }

          this.pdfViewer.currentScaleValue = _ui_utils.DEFAULT_SCALE_VALUE
        },

        get pagesCount() {
          return this.pdfDocument ? this.pdfDocument.numPages : 0
        },

        get page() {
          return this.pdfViewer.currentPageNumber
        },

        set page(val) {
          this.pdfViewer.currentPageNumber = val
        },

        get supportsPrinting() {
          return PDFPrintServiceFactory.instance.supportsPrinting
        },

        get supportsFullscreen() {
          return (0, _pdfjsLib.shadow)(this, 'supportsFullscreen', document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled)
        },

        get supportsIntegratedFind() {
          return this.externalServices.supportsIntegratedFind
        },

        get supportsDocumentFonts() {
          return this.externalServices.supportsDocumentFonts
        },

        get loadingBar() {
          const bar = new _ui_utils.ProgressBar('#loadingBar')
          return (0, _pdfjsLib.shadow)(this, 'loadingBar', bar)
        },

        get supportedMouseWheelZoomModifierKeys() {
          return this.externalServices.supportedMouseWheelZoomModifierKeys
        },

        initPassiveLoading: function initPassiveLoading() {
          throw new Error('Not implemented: initPassiveLoading')
        },
        setTitleUsingUrl: function setTitleUsingUrl() {
          const url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ''
          const downloadUrl = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null
          this.url = url
          this.baseUrl = url.split('#')[0]

          if (downloadUrl) {
            this._downloadUrl = downloadUrl === url ? this.baseUrl : downloadUrl.split('#')[0]
          }

          let title = (0, _pdfjsLib.getPdfFilenameFromUrl)(url, '')

          if (!title) {
            try {
              title = decodeURIComponent((0, _pdfjsLib.getFilenameFromUrl)(url)) || url
            }
            catch (ex) {
              title = url
            }
          }

          this.setTitle(title)
        },
        setTitle: function setTitle(title) {
          if (this.isViewerEmbedded) {
            return
          }

          document.title = title
        },

        get _docFilename() {
          return this._contentDispositionFilename || (0, _pdfjsLib.getPdfFilenameFromUrl)(this.url)
        },

        _hideViewBookmark: function _hideViewBookmark() {
          const _this$appConfig = this.appConfig
          const toolbar = _this$appConfig.toolbar
          const secondaryToolbar = _this$appConfig.secondaryToolbar
          toolbar.viewBookmark.hidden = true
          secondaryToolbar.viewBookmarkButton.hidden = true
        },
        _cancelIdleCallbacks: function _cancelIdleCallbacks() {
          if (!this._idleCallbacks.size) {
            return
          }

          const _iterator = _createForOfIteratorHelper(this._idleCallbacks)
          let _step

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              const callback = _step.value
              window.cancelIdleCallback(callback)
            }
          }
          catch (err) {
            _iterator.e(err)
          }
          finally {
            _iterator.f()
          }

          this._idleCallbacks.clear()
        },
        close: function close() {
          const _this6 = this

          return _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee7() {
            let _this6$pdfDocument, _this6$pdfHistory, _this6$findBar

            let container, promises
            return _regenerator.default.wrap((_context7) => {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    _this6._unblockDocumentLoadEvent()

                    _this6._hideViewBookmark()

                    container = _this6.appConfig.errorWrapper.container
                    container.hidden = true

                    if (_this6.pdfLoadingTask) {
                      _context7.next = 6
                      break
                    }

                    return _context7.abrupt('return')

                  case 6:
                    if (!(((_this6$pdfDocument = _this6.pdfDocument) === null || _this6$pdfDocument === void 0 ? void 0 : _this6$pdfDocument.annotationStorage.size) > 0 && _this6._annotationStorageModified)) {
                      _context7.next = 14
                      break
                    }

                    _context7.prev = 7
                    _context7.next = 10
                    return _this6.save({
                      sourceEventType: 'save',
                    })

                  case 10:
                    _context7.next = 14
                    break

                  case 12:
                    _context7.prev = 12
                    _context7.t0 = _context7.catch(7)

                  case 14:
                    promises = []
                    promises.push(_this6.pdfLoadingTask.destroy())
                    _this6.pdfLoadingTask = null

                    if (_this6.pdfDocument) {
                      _this6.pdfDocument = null

                      _this6.pdfThumbnailViewer.setDocument(null)

                      _this6.pdfViewer.setDocument(null)

                      _this6.pdfLinkService.setDocument(null)

                      _this6.pdfDocumentProperties.setDocument(null)
                    }

                    _this6.pdfLinkService.externalLinkEnabled = true
                    _this6._fellback = false
                    _this6.store = null
                    _this6.isInitialViewSet = false
                    _this6.downloadComplete = false
                    _this6.url = ''
                    _this6.baseUrl = ''
                    _this6._downloadUrl = ''
                    _this6.documentInfo = null
                    _this6.metadata = null
                    _this6._contentDispositionFilename = null
                    _this6._contentLength = null
                    _this6._saveInProgress = false
                    _this6._docStats = null

                    _this6._cancelIdleCallbacks()

                    promises.push(_this6.pdfScriptingManager.destroyPromise)

                    _this6.pdfSidebar.reset()

                    _this6.pdfOutlineViewer.reset()

                    _this6.pdfAttachmentViewer.reset()

                    _this6.pdfLayerViewer.reset();

                    (_this6$pdfHistory = _this6.pdfHistory) === null || _this6$pdfHistory === void 0 ? void 0 : _this6$pdfHistory.reset();
                    (_this6$findBar = _this6.findBar) === null || _this6$findBar === void 0 ? void 0 : _this6$findBar.reset()

                    _this6.toolbar.reset()

                    _this6.secondaryToolbar.reset()

                    if (typeof PDFBug !== 'undefined') {
                      PDFBug.cleanup()
                    }

                    _context7.next = 45
                    return Promise.all(promises)

                  case 45:
                  case 'end':
                    return _context7.stop()
                }
              }
            }, _callee7, null, [[7, 12]])
          }))()
        },
        open: function open(file, args) {
          const _this7 = this

          return _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee8() {
            let workerParameters, key, parameters, apiParameters, _key, value, _key2, loadingTask

            return _regenerator.default.wrap((_context8) => {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    if (!_this7.pdfLoadingTask) {
                      _context8.next = 3
                      break
                    }

                    _context8.next = 3
                    return _this7.close()

                  case 3:
                    workerParameters = _app_options.AppOptions.getAll(_app_options.OptionKind.WORKER)

                    for (key in workerParameters) {
                      _pdfjsLib.GlobalWorkerOptions[key] = workerParameters[key]
                    }

                    parameters = Object.create(null)

                    if (typeof file === 'string') {
                      _this7.setTitleUsingUrl(file, file)

                      parameters.url = file
                    }
                    else if (file && 'byteLength' in file) {
                      parameters.data = file
                    }
                    else if (file.url && file.originalUrl) {
                      _this7.setTitleUsingUrl(file.originalUrl, file.url)

                      parameters.url = file.url
                    }

                    apiParameters = _app_options.AppOptions.getAll(_app_options.OptionKind.API)

                    for (_key in apiParameters) {
                      value = apiParameters[_key]

                      if (_key === 'docBaseUrl' && !value) { }

                      parameters[_key] = value
                    }

                    if (args) {
                      for (_key2 in args) {
                        parameters[_key2] = args[_key2]
                      }
                    }

                    loadingTask = (0, _pdfjsLib.getDocument)(parameters)
                    _this7.pdfLoadingTask = loadingTask

                    loadingTask.onPassword = function (updateCallback, reason) {
                      _this7.pdfLinkService.externalLinkEnabled = false

                      _this7.passwordPrompt.setUpdateCallback(updateCallback, reason)

                      _this7.passwordPrompt.open()
                    }

                    loadingTask.onProgress = function (_ref) {
                      const loaded = _ref.loaded
                      const total = _ref.total

                      _this7.progress(loaded / total)
                    }

                    loadingTask.onUnsupportedFeature = _this7.fallback.bind(_this7)
                    return _context8.abrupt('return', loadingTask.promise.then((pdfDocument) => {
                      _this7.load(pdfDocument)
                      // 加载完成移除loading动画
                      const loading = document.getElementById('loadingContainer')
                      loading && loading.remove()
                    }, (reason) => {
                      if (loadingTask !== _this7.pdfLoadingTask) {
                        return undefined
                      }

                      let key = 'loading_error'

                      if (reason instanceof _pdfjsLib.InvalidPDFException) {
                        key = 'invalid_file_error'
                      }
                      else if (reason instanceof _pdfjsLib.MissingPDFException) {
                        key = 'missing_file_error'
                      }
                      else if (reason instanceof _pdfjsLib.UnexpectedResponseException) {
                        key = 'unexpected_response_error'
                      }

                      return _this7.l10n.get(key).then((msg) => {
                        _this7._documentError(msg, {
                          message: reason === null || reason === void 0 ? void 0 : reason.message,
                        })

                        throw reason
                      })
                    }))

                  case 16:
                  case 'end':
                    return _context8.stop()
                }
              }
            }, _callee8)
          }))()
        },
        _ensureDownloadComplete: function _ensureDownloadComplete() {
          if (this.pdfDocument && this.downloadComplete) {
            return
          }

          throw new Error('PDF document not downloaded.')
        },
        download: function download() {
          const _arguments = arguments
          const _this8 = this

          return _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee9() {
            let _ref2, _ref2$sourceEventType, sourceEventType, url, filename, data, blob

            return _regenerator.default.wrap((_context9) => {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    _ref2 = _arguments.length > 0 && _arguments[0] !== undefined ? _arguments[0] : {}, _ref2$sourceEventType = _ref2.sourceEventType, sourceEventType = _ref2$sourceEventType === void 0 ? 'download' : _ref2$sourceEventType
                    url = _this8._downloadUrl, filename = _this8._docFilename
                    _context9.prev = 2

                    _this8._ensureDownloadComplete()

                    _context9.next = 6
                    return _this8.pdfDocument.getData()

                  case 6:
                    data = _context9.sent
                    blob = new Blob([data], {
                      type: 'application/pdf',
                    })
                    _context9.next = 10
                    return _this8.downloadManager.download(blob, url, filename, sourceEventType)

                  case 10:
                    _context9.next = 16
                    break

                  case 12:
                    _context9.prev = 12
                    _context9.t0 = _context9.catch(2)
                    _context9.next = 16
                    return _this8.downloadManager.downloadUrl(url, filename)

                  case 16:
                  case 'end':
                    return _context9.stop()
                }
              }
            }, _callee9, null, [[2, 12]])
          }))()
        },
        save: function save() {
          const _arguments2 = arguments
          const _this9 = this

          return _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee10() {
            let _ref3, _ref3$sourceEventType, sourceEventType, url, filename, data, blob

            return _regenerator.default.wrap((_context10) => {
              while (1) {
                switch (_context10.prev = _context10.next) {
                  case 0:
                    _ref3 = _arguments2.length > 0 && _arguments2[0] !== undefined ? _arguments2[0] : {}, _ref3$sourceEventType = _ref3.sourceEventType, sourceEventType = _ref3$sourceEventType === void 0 ? 'download' : _ref3$sourceEventType

                    if (!_this9._saveInProgress) {
                      _context10.next = 3
                      break
                    }

                    return _context10.abrupt('return')

                  case 3:
                    _this9._saveInProgress = true
                    _context10.next = 6
                    return _this9.pdfScriptingManager.dispatchWillSave()

                  case 6:
                    url = _this9._downloadUrl, filename = _this9._docFilename
                    _context10.prev = 7

                    _this9._ensureDownloadComplete()

                    _context10.next = 11
                    return _this9.pdfDocument.saveDocument()

                  case 11:
                    data = _context10.sent
                    blob = new Blob([data], {
                      type: 'application/pdf',
                    })
                    _context10.next = 15
                    return _this9.downloadManager.download(blob, url, filename, sourceEventType)

                  case 15:
                    _context10.next = 22
                    break

                  case 17:
                    _context10.prev = 17
                    _context10.t0 = _context10.catch(7)
                    console.error('Error when saving the document: '.concat(_context10.t0.message))
                    _context10.next = 22
                    return _this9.download({
                      sourceEventType,
                    })

                  case 22:
                    _context10.prev = 22
                    _context10.next = 25
                    return _this9.pdfScriptingManager.dispatchDidSave()

                  case 25:
                    _this9._saveInProgress = false
                    return _context10.finish(22)

                  case 27:
                  case 'end':
                    return _context10.stop()
                }
              }
            }, _callee10, null, [[7, 17, 22, 27]])
          }))()
        },
        downloadOrSave: function downloadOrSave(options) {
          let _this$pdfDocument

          if (((_this$pdfDocument = this.pdfDocument) === null || _this$pdfDocument === void 0 ? void 0 : _this$pdfDocument.annotationStorage.size) > 0) {
            this.save(options)
          }
          else {
            this.download(options)
          }
        },
        fallback: function fallback(featureId) {
          const _this10 = this

          this.externalServices.reportTelemetry({
            type: 'unsupportedFeature',
            featureId,
          })

          if (this._fellback) {
            return
          }

          this._fellback = true
          this.externalServices.fallback({
            featureId,
            url: this.baseUrl,
          }).then((download) => {
            if (!download) {
              return
            }

            _this10.download({
              sourceEventType: 'download',
            })
          })
        },
        _documentError: function _documentError(message) {
          const moreInfo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null

          this._unblockDocumentLoadEvent()

          this._otherError(message, moreInfo)
        },
        _otherError: function _otherError(message) {
          const moreInfo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null
          const moreInfoText = [this.l10n.get('error_version_info', {
            version: _pdfjsLib.version || '?',
            build: _pdfjsLib.build || '?',
          })]

          if (moreInfo) {
            moreInfoText.push(this.l10n.get('error_message', {
              message: moreInfo.message,
            }))

            if (moreInfo.stack) {
              moreInfoText.push(this.l10n.get('error_stack', {
                stack: moreInfo.stack,
              }))
            }
            else {
              if (moreInfo.filename) {
                moreInfoText.push(this.l10n.get('error_file', {
                  file: moreInfo.filename,
                }))
              }

              if (moreInfo.lineNumber) {
                moreInfoText.push(this.l10n.get('error_line', {
                  line: moreInfo.lineNumber,
                }))
              }
            }
          }

          const errorWrapperConfig = this.appConfig.errorWrapper
          const errorWrapper = errorWrapperConfig.container
          errorWrapper.hidden = false
          const errorMessage = errorWrapperConfig.errorMessage
          errorMessage.textContent = message
          const closeButton = errorWrapperConfig.closeButton

          closeButton.onclick = function () {
            errorWrapper.hidden = true
          }

          const errorMoreInfo = errorWrapperConfig.errorMoreInfo
          const moreInfoButton = errorWrapperConfig.moreInfoButton
          const lessInfoButton = errorWrapperConfig.lessInfoButton

          moreInfoButton.onclick = function () {
            errorMoreInfo.hidden = false
            moreInfoButton.hidden = true
            lessInfoButton.hidden = false
            errorMoreInfo.style.height = `${errorMoreInfo.scrollHeight}px`
          }

          lessInfoButton.onclick = function () {
            errorMoreInfo.hidden = true
            moreInfoButton.hidden = false
            lessInfoButton.hidden = true
          }

          moreInfoButton.oncontextmenu = _ui_utils.noContextMenuHandler
          lessInfoButton.oncontextmenu = _ui_utils.noContextMenuHandler
          closeButton.oncontextmenu = _ui_utils.noContextMenuHandler
          moreInfoButton.hidden = false
          lessInfoButton.hidden = true
          Promise.all(moreInfoText).then((parts) => {
            errorMoreInfo.value = parts.join('\n')
          })
        },
        progress: function progress(level) {
          const _this11 = this

          if (this.downloadComplete) {
            return
          }

          const percent = Math.round(level * 100)

          if (percent > this.loadingBar.percent || isNaN(percent)) {
            this.loadingBar.percent = percent
            const disableAutoFetch = this.pdfDocument ? this.pdfDocument.loadingParams.disableAutoFetch : _app_options.AppOptions.get('disableAutoFetch')

            if (disableAutoFetch && percent) {
              if (this.disableAutoFetchLoadingBarTimeout) {
                clearTimeout(this.disableAutoFetchLoadingBarTimeout)
                this.disableAutoFetchLoadingBarTimeout = null
              }

              this.loadingBar.show()
              this.disableAutoFetchLoadingBarTimeout = setTimeout(() => {
                _this11.loadingBar.hide()

                _this11.disableAutoFetchLoadingBarTimeout = null
              }, DISABLE_AUTO_FETCH_LOADING_BAR_TIMEOUT)
            }
          }
        },
        load: function load(pdfDocument) {
          const _this12 = this

          this.pdfDocument = pdfDocument
          pdfDocument.getDownloadInfo().then((_ref4) => {
            const length = _ref4.length
            _this12._contentLength = length
            _this12.downloadComplete = true

            _this12.loadingBar.hide()

            firstPagePromise.then(() => {
              _this12.eventBus.dispatch('documentloaded', {
                source: _this12,
              })
            })
          })
          const pageLayoutPromise = pdfDocument.getPageLayout().catch(() => { })
          const pageModePromise = pdfDocument.getPageMode().catch(() => { })
          const openActionPromise = pdfDocument.getOpenAction().catch(() => { })
          this.toolbar.setPagesCount(pdfDocument.numPages, false)
          this.secondaryToolbar.setPagesCount(pdfDocument.numPages)
          let baseDocumentUrl
          baseDocumentUrl = null
          this.pdfLinkService.setDocument(pdfDocument, baseDocumentUrl)
          this.pdfDocumentProperties.setDocument(pdfDocument, this.url)
          const pdfViewer = this.pdfViewer
          pdfViewer.setDocument(pdfDocument)
          var firstPagePromise = pdfViewer.firstPagePromise
          const onePageRendered = pdfViewer.onePageRendered
          const pagesPromise = pdfViewer.pagesPromise
          const pdfThumbnailViewer = this.pdfThumbnailViewer
          pdfThumbnailViewer.setDocument(pdfDocument)
          const storedPromise = (this.store = new _view_history.ViewHistory(pdfDocument.fingerprints[0])).getMultiple({
            page: null,
            zoom: _ui_utils.DEFAULT_SCALE_VALUE,
            scrollLeft: '0',
            scrollTop: '0',
            rotation: null,
            sidebarView: _ui_utils.SidebarView.UNKNOWN,
            scrollMode: _ui_utils.ScrollMode.UNKNOWN,
            spreadMode: _ui_utils.SpreadMode.UNKNOWN,
          }).catch(() => {
            return Object.create(null)
          })
          firstPagePromise.then((pdfPage) => {
            _this12.loadingBar.setWidth(_this12.appConfig.viewerContainer)

            _this12._initializeAnnotationStorageCallbacks(pdfDocument)

            Promise.all([_ui_utils.animationStarted, storedPromise, pageLayoutPromise, pageModePromise, openActionPromise]).then(/* #__PURE__ */function () {
              const _ref6 = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee11(_ref5) {
                let _ref7, timeStamp, stored, pageLayout, pageMode, openAction, viewOnLoad, initialBookmark, zoom, hash, rotation, sidebarView, scrollMode, spreadMode, modes

                return _regenerator.default.wrap((_context11) => {
                  while (1) {
                    switch (_context11.prev = _context11.next) {
                      case 0:
                        _ref7 = _slicedToArray(_ref5, 5), timeStamp = _ref7[0], stored = _ref7[1], pageLayout = _ref7[2], pageMode = _ref7[3], openAction = _ref7[4]
                        viewOnLoad = _app_options.AppOptions.get('viewOnLoad')

                        _this12._initializePdfHistory({
                          fingerprint: pdfDocument.fingerprints[0],
                          viewOnLoad,
                          initialDest: openAction === null || openAction === void 0 ? void 0 : openAction.dest,
                        })

                        initialBookmark = _this12.initialBookmark
                        zoom = _app_options.AppOptions.get('defaultZoomValue')
                        hash = zoom ? 'zoom='.concat(zoom) : null
                        rotation = null
                        sidebarView = _app_options.AppOptions.get('sidebarViewOnLoad')
                        scrollMode = _app_options.AppOptions.get('scrollModeOnLoad')
                        spreadMode = _app_options.AppOptions.get('spreadModeOnLoad')

                        if (stored.page && viewOnLoad !== ViewOnLoad.INITIAL) {
                          hash = 'page='.concat(stored.page, '&zoom=').concat(zoom || stored.zoom, ',') + ''.concat(stored.scrollLeft, ',').concat(stored.scrollTop)
                          rotation = Number.parseInt(stored.rotation, 10)

                          if (sidebarView === _ui_utils.SidebarView.UNKNOWN) {
                            sidebarView = stored.sidebarView | 0
                          }

                          if (scrollMode === _ui_utils.ScrollMode.UNKNOWN) {
                            scrollMode = stored.scrollMode | 0
                          }

                          if (spreadMode === _ui_utils.SpreadMode.UNKNOWN) {
                            spreadMode = stored.spreadMode | 0
                          }
                        }

                        if (pageMode && sidebarView === _ui_utils.SidebarView.UNKNOWN) {
                          sidebarView = (0, _ui_utils.apiPageModeToSidebarView)(pageMode)
                        }

                        if (pageLayout && scrollMode === _ui_utils.ScrollMode.UNKNOWN && spreadMode === _ui_utils.SpreadMode.UNKNOWN) {
                          modes = (0, _ui_utils.apiPageLayoutToViewerModes)(pageLayout)
                          spreadMode = modes.spreadMode
                        }

                        _this12.setInitialView(hash, {
                          rotation,
                          sidebarView,
                          scrollMode,
                          spreadMode,
                        })

                        _this12.eventBus.dispatch('documentinit', {
                          source: _this12,
                        })

                        if (!_this12.isViewerEmbedded) {
                          pdfViewer.focus()
                        }

                        _context11.next = 18
                        return Promise.race([pagesPromise, new Promise((resolve) => {
                          setTimeout(resolve, FORCE_PAGES_LOADED_TIMEOUT)
                        })])

                      case 18:
                        if (!(!initialBookmark && !hash)) {
                          _context11.next = 20
                          break
                        }

                        return _context11.abrupt('return')

                      case 20:
                        if (!pdfViewer.hasEqualPageSizes) {
                          _context11.next = 22
                          break
                        }

                        return _context11.abrupt('return')

                      case 22:
                        _this12.initialBookmark = initialBookmark
                        pdfViewer.currentScaleValue = pdfViewer.currentScaleValue

                        _this12.setInitialView(hash)

                      case 25:
                      case 'end':
                        return _context11.stop()
                    }
                  }
                }, _callee11)
              }))

              return function (_x2) {
                return _ref6.apply(this, arguments)
              }
            }()).catch(() => {
              _this12.setInitialView()
            }).then(() => {
              pdfViewer.update()
            })
          })
          pagesPromise.then(() => {
            _this12._unblockDocumentLoadEvent()

            _this12._initializeAutoPrint(pdfDocument, openActionPromise)
          }, (reason) => {
            _this12.l10n.get('loading_error').then((msg) => {
              _this12._documentError(msg, {
                message: reason === null || reason === void 0 ? void 0 : reason.message,
              })
            })
          })
          onePageRendered.then((data) => {
            _this12.externalServices.reportTelemetry({
              type: 'pageInfo',
              timestamp: data.timestamp,
            })

            pdfDocument.getOutline().then((outline) => {
              if (pdfDocument !== _this12.pdfDocument) {
                return
              }

              _this12.pdfOutlineViewer.render({
                outline,
                pdfDocument,
              })
            })
            pdfDocument.getAttachments().then((attachments) => {
              if (pdfDocument !== _this12.pdfDocument) {
                return
              }

              _this12.pdfAttachmentViewer.render({
                attachments,
              })
            })
            pdfViewer.optionalContentConfigPromise.then((optionalContentConfig) => {
              if (pdfDocument !== _this12.pdfDocument) {
                return
              }

              _this12.pdfLayerViewer.render({
                optionalContentConfig,
                pdfDocument,
              })
            })

            if ('requestIdleCallback' in window) {
              var callback = window.requestIdleCallback(() => {
                _this12._collectTelemetry(pdfDocument)

                _this12._idleCallbacks.delete(callback)
              }, {
                timeout: 1000,
              })

              _this12._idleCallbacks.add(callback)
            }
          })

          this._initializePageLabels(pdfDocument)

          this._initializeMetadata(pdfDocument)
        },
        _scriptingDocProperties: function _scriptingDocProperties(pdfDocument) {
          const _this13 = this

          return _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee12() {
            let _this13$metadata, _this13$metadata2

            return _regenerator.default.wrap((_context12) => {
              while (1) {
                switch (_context12.prev = _context12.next) {
                  case 0:
                    if (_this13.documentInfo) {
                      _context12.next = 5
                      break
                    }

                    _context12.next = 3
                    return new Promise((resolve) => {
                      _this13.eventBus._on('metadataloaded', resolve, {
                        once: true,
                      })
                    })

                  case 3:
                    if (!(pdfDocument !== _this13.pdfDocument)) {
                      _context12.next = 5
                      break
                    }

                    return _context12.abrupt('return', null)

                  case 5:
                    if (_this13._contentLength) {
                      _context12.next = 10
                      break
                    }

                    _context12.next = 8
                    return new Promise((resolve) => {
                      _this13.eventBus._on('documentloaded', resolve, {
                        once: true,
                      })
                    })

                  case 8:
                    if (!(pdfDocument !== _this13.pdfDocument)) {
                      _context12.next = 10
                      break
                    }

                    return _context12.abrupt('return', null)

                  case 10:
                    return _context12.abrupt('return', _objectSpread(_objectSpread({}, _this13.documentInfo), {}, {
                      baseURL: _this13.baseUrl,
                      filesize: _this13._contentLength,
                      filename: _this13._docFilename,
                      metadata: (_this13$metadata = _this13.metadata) === null || _this13$metadata === void 0 ? void 0 : _this13$metadata.getRaw(),
                      authors: (_this13$metadata2 = _this13.metadata) === null || _this13$metadata2 === void 0 ? void 0 : _this13$metadata2.get('dc:creator'),
                      numPages: _this13.pagesCount,
                      URL: _this13.url,
                    }))

                  case 11:
                  case 'end':
                    return _context12.stop()
                }
              }
            }, _callee12)
          }))()
        },
        _collectTelemetry: function _collectTelemetry(pdfDocument) {
          const _this14 = this

          return _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee13() {
            let markInfo, tagged
            return _regenerator.default.wrap((_context13) => {
              while (1) {
                switch (_context13.prev = _context13.next) {
                  case 0:
                    _context13.next = 2
                    return _this14.pdfDocument.getMarkInfo()

                  case 2:
                    markInfo = _context13.sent

                    if (!(pdfDocument !== _this14.pdfDocument)) {
                      _context13.next = 5
                      break
                    }

                    return _context13.abrupt('return')

                  case 5:
                    tagged = (markInfo === null || markInfo === void 0 ? void 0 : markInfo.Marked) || false

                    _this14.externalServices.reportTelemetry({
                      type: 'tagged',
                      tagged,
                    })

                  case 7:
                  case 'end':
                    return _context13.stop()
                }
              }
            }, _callee13)
          }))()
        },
        _initializeAutoPrint: function _initializeAutoPrint(pdfDocument, openActionPromise) {
          const _this15 = this

          return _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee14() {
            let _yield$Promise$all, _yield$Promise$all2, openAction, javaScript, triggerAutoPrint, _iterator2, _step2, js

            return _regenerator.default.wrap((_context14) => {
              while (1) {
                switch (_context14.prev = _context14.next) {
                  case 0:
                    _context14.next = 2
                    return Promise.all([openActionPromise, !_this15.pdfViewer.enableScripting ? pdfDocument.getJavaScript() : null])

                  case 2:
                    _yield$Promise$all = _context14.sent
                    _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 2)
                    openAction = _yield$Promise$all2[0]
                    javaScript = _yield$Promise$all2[1]

                    if (!(pdfDocument !== _this15.pdfDocument)) {
                      _context14.next = 8
                      break
                    }

                    return _context14.abrupt('return')

                  case 8:
                    triggerAutoPrint = false

                    if ((openAction === null || openAction === void 0 ? void 0 : openAction.action) === 'Print') {
                      triggerAutoPrint = true
                    }

                    if (!javaScript) {
                      _context14.next = 31
                      break
                    }

                    javaScript.some((js) => {
                      if (!js) {
                        return false
                      }

                      console.warn('Warning: JavaScript support is not enabled')

                      _this15.fallback(_pdfjsLib.UNSUPPORTED_FEATURES.javaScript)

                      return true
                    })

                    if (triggerAutoPrint) {
                      _context14.next = 31
                      break
                    }

                    _iterator2 = _createForOfIteratorHelper(javaScript)
                    _context14.prev = 14

                    _iterator2.s()

                  case 16:
                    if ((_step2 = _iterator2.n()).done) {
                      _context14.next = 23
                      break
                    }

                    js = _step2.value

                    if (!(js && _ui_utils.AutoPrintRegExp.test(js))) {
                      _context14.next = 21
                      break
                    }

                    triggerAutoPrint = true
                    return _context14.abrupt('break', 23)

                  case 21:
                    _context14.next = 16
                    break

                  case 23:
                    _context14.next = 28
                    break

                  case 25:
                    _context14.prev = 25
                    _context14.t0 = _context14.catch(14)

                    _iterator2.e(_context14.t0)

                  case 28:
                    _context14.prev = 28

                    _iterator2.f()

                    return _context14.finish(28)

                  case 31:
                    if (triggerAutoPrint) {
                      _this15.triggerPrinting()
                    }

                  case 32:
                  case 'end':
                    return _context14.stop()
                }
              }
            }, _callee14, null, [[14, 25, 28, 31]])
          }))()
        },
        _initializeMetadata: function _initializeMetadata(pdfDocument) {
          const _this16 = this

          return _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee15() {
            let _this16$_contentDispo, _this16$_contentLengt

            let _yield$pdfDocument$ge, info, metadata, contentDispositionFilename, contentLength, pdfTitle, metadataTitle, versionId, generatorId, producer, formType

            return _regenerator.default.wrap((_context15) => {
              while (1) {
                switch (_context15.prev = _context15.next) {
                  case 0:
                    _context15.next = 2
                    return pdfDocument.getMetadata()

                  case 2:
                    _yield$pdfDocument$ge = _context15.sent
                    info = _yield$pdfDocument$ge.info
                    metadata = _yield$pdfDocument$ge.metadata
                    contentDispositionFilename = _yield$pdfDocument$ge.contentDispositionFilename
                    contentLength = _yield$pdfDocument$ge.contentLength

                    if (!(pdfDocument !== _this16.pdfDocument)) {
                      _context15.next = 9
                      break
                    }

                    return _context15.abrupt('return')

                  case 9:
                    _this16.documentInfo = info
                    _this16.metadata = metadata;
                    (_this16$_contentDispo = _this16._contentDispositionFilename) !== null && _this16$_contentDispo !== void 0 ? _this16$_contentDispo : _this16._contentDispositionFilename = contentDispositionFilename;
                    (_this16$_contentLengt = _this16._contentLength) !== null && _this16$_contentLengt !== void 0 ? _this16$_contentLengt : _this16._contentLength = contentLength
                    console.log('PDF '.concat(pdfDocument.fingerprints[0], ' [').concat(info.PDFFormatVersion, ' ') + ''.concat((info.Producer || '-').trim(), ' / ').concat((info.Creator || '-').trim(), '] ') + '(PDF.js: '.concat(_pdfjsLib.version || '-', ')'))
                    pdfTitle = info === null || info === void 0 ? void 0 : info.Title
                    metadataTitle = metadata === null || metadata === void 0 ? void 0 : metadata.get('dc:title')

                    if (metadataTitle) {
                      if (metadataTitle !== 'Untitled' && !/[\uFFF0-\uFFFF]/.test(metadataTitle)) {
                        pdfTitle = metadataTitle
                      }
                    }

                    if (pdfTitle) {
                      _this16.setTitle(''.concat(pdfTitle, ' - ').concat(contentDispositionFilename || document.title))
                    }
                    else if (contentDispositionFilename) {
                      _this16.setTitle(contentDispositionFilename)
                    }

                    if (info.IsXFAPresent && !info.IsAcroFormPresent && !pdfDocument.isPureXfa) {
                      if (pdfDocument.loadingParams.enableXfa) {
                        console.warn('Warning: XFA Foreground documents are not supported')
                      }
                      else {
                        console.warn('Warning: XFA support is not enabled')
                      }

                      _this16.fallback(_pdfjsLib.UNSUPPORTED_FEATURES.forms)
                    }
                    else if ((info.IsAcroFormPresent || info.IsXFAPresent) && !_this16.pdfViewer.renderForms) {
                      console.warn('Warning: Interactive form support is not enabled')

                      _this16.fallback(_pdfjsLib.UNSUPPORTED_FEATURES.forms)
                    }

                    if (info.IsSignaturesPresent) {
                      console.warn('Warning: Digital signatures validation is not supported')

                      _this16.fallback(_pdfjsLib.UNSUPPORTED_FEATURES.signatures)
                    }

                    versionId = 'other'

                    if (KNOWN_VERSIONS.includes(info.PDFFormatVersion)) {
                      versionId = 'v'.concat(info.PDFFormatVersion.replace('.', '_'))
                    }

                    generatorId = 'other'

                    if (info.Producer) {
                      producer = info.Producer.toLowerCase()
                      KNOWN_GENERATORS.some((generator) => {
                        if (!producer.includes(generator)) {
                          return false
                        }

                        generatorId = generator.replace(/[ .-]/g, '_')
                        return true
                      })
                    }

                    formType = null

                    if (info.IsXFAPresent) {
                      formType = 'xfa'
                    }
                    else if (info.IsAcroFormPresent) {
                      formType = 'acroform'
                    }

                    _this16.externalServices.reportTelemetry({
                      type: 'documentInfo',
                      version: versionId,
                      generator: generatorId,
                      formType,
                    })

                    _this16.eventBus.dispatch('metadataloaded', {
                      source: _this16,
                    })

                  case 28:
                  case 'end':
                    return _context15.stop()
                }
              }
            }, _callee15)
          }))()
        },
        _initializePageLabels: function _initializePageLabels(pdfDocument) {
          const _this17 = this

          return _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee16() {
            let labels, numLabels, standardLabels, emptyLabels, i, label, pdfViewer, pdfThumbnailViewer, toolbar
            return _regenerator.default.wrap((_context16) => {
              while (1) {
                switch (_context16.prev = _context16.next) {
                  case 0:
                    _context16.next = 2
                    return pdfDocument.getPageLabels()

                  case 2:
                    labels = _context16.sent

                    if (!(pdfDocument !== _this17.pdfDocument)) {
                      _context16.next = 5
                      break
                    }

                    return _context16.abrupt('return')

                  case 5:
                    if (!(!labels || _app_options.AppOptions.get('disablePageLabels'))) {
                      _context16.next = 7
                      break
                    }

                    return _context16.abrupt('return')

                  case 7:
                    numLabels = labels.length
                    standardLabels = 0, emptyLabels = 0
                    i = 0

                  case 10:
                    if (!(i < numLabels)) {
                      _context16.next = 24
                      break
                    }

                    label = labels[i]

                    if (!(label === (i + 1).toString())) {
                      _context16.next = 16
                      break
                    }

                    standardLabels++
                    _context16.next = 21
                    break

                  case 16:
                    if (!(label === '')) {
                      _context16.next = 20
                      break
                    }

                    emptyLabels++
                    _context16.next = 21
                    break

                  case 20:
                    return _context16.abrupt('break', 24)

                  case 21:
                    i++
                    _context16.next = 10
                    break

                  case 24:
                    if (!(standardLabels >= numLabels || emptyLabels >= numLabels)) {
                      _context16.next = 26
                      break
                    }

                    return _context16.abrupt('return')

                  case 26:
                    pdfViewer = _this17.pdfViewer, pdfThumbnailViewer = _this17.pdfThumbnailViewer, toolbar = _this17.toolbar
                    pdfViewer.setPageLabels(labels)
                    pdfThumbnailViewer.setPageLabels(labels)
                    toolbar.setPagesCount(numLabels, true)
                    toolbar.setPageNumber(pdfViewer.currentPageNumber, pdfViewer.currentPageLabel)

                  case 31:
                  case 'end':
                    return _context16.stop()
                }
              }
            }, _callee16)
          }))()
        },
        _initializePdfHistory: function _initializePdfHistory(_ref8) {
          const fingerprint = _ref8.fingerprint
          const viewOnLoad = _ref8.viewOnLoad
          const _ref8$initialDest = _ref8.initialDest
          const initialDest = _ref8$initialDest === void 0 ? null : _ref8$initialDest

          if (!this.pdfHistory) {
            return
          }

          this.pdfHistory.initialize({
            fingerprint,
            resetHistory: viewOnLoad === ViewOnLoad.INITIAL,
            updateUrl: _app_options.AppOptions.get('historyUpdateUrl'),
          })

          if (this.pdfHistory.initialBookmark) {
            this.initialBookmark = this.pdfHistory.initialBookmark
            this.initialRotation = this.pdfHistory.initialRotation
          }

          if (initialDest && !this.initialBookmark && viewOnLoad === ViewOnLoad.UNKNOWN) {
            this.initialBookmark = JSON.stringify(initialDest)
            this.pdfHistory.push({
              explicitDest: initialDest,
              pageNumber: null,
            })
          }
        },
        _initializeAnnotationStorageCallbacks: function _initializeAnnotationStorageCallbacks(pdfDocument) {
          const _this18 = this

          if (pdfDocument !== this.pdfDocument) {
            return
          }

          const annotationStorage = pdfDocument.annotationStorage

          annotationStorage.onSetModified = function () {
            window.addEventListener('beforeunload', beforeUnload)
            _this18._annotationStorageModified = true
          }

          annotationStorage.onResetModified = function () {
            window.removeEventListener('beforeunload', beforeUnload)
            delete _this18._annotationStorageModified
          }
        },
        setInitialView: function setInitialView(storedHash) {
          const _this19 = this

          const _ref9 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
          const rotation = _ref9.rotation
          const sidebarView = _ref9.sidebarView
          const scrollMode = _ref9.scrollMode
          const spreadMode = _ref9.spreadMode

          const setRotation = function setRotation(angle) {
            if ((0, _ui_utils.isValidRotation)(angle)) {
              _this19.pdfViewer.pagesRotation = angle
            }
          }

          const setViewerModes = function setViewerModes(scroll, spread) {
            if ((0, _ui_utils.isValidScrollMode)(scroll)) {
              _this19.pdfViewer.scrollMode = scroll
            }

            if ((0, _ui_utils.isValidSpreadMode)(spread)) {
              _this19.pdfViewer.spreadMode = spread
            }
          }

          this.isInitialViewSet = true
          this.pdfSidebar.setInitialView(sidebarView)
          setViewerModes(scrollMode, spreadMode)

          if (this.initialBookmark) {
            setRotation(this.initialRotation)
            delete this.initialRotation
            this.pdfLinkService.setHash(this.initialBookmark)
            this.initialBookmark = null
          }
          else if (storedHash) {
            setRotation(rotation)
            this.pdfLinkService.setHash(storedHash)
          }

          this.toolbar.setPageNumber(this.pdfViewer.currentPageNumber, this.pdfViewer.currentPageLabel)
          this.secondaryToolbar.setPageNumber(this.pdfViewer.currentPageNumber)

          if (!this.pdfViewer.currentScaleValue) {
            this.pdfViewer.currentScaleValue = _ui_utils.DEFAULT_SCALE_VALUE
          }
        },
        _cleanup: function _cleanup() {
          if (!this.pdfDocument) {
            return
          }

          this.pdfViewer.cleanup()
          this.pdfThumbnailViewer.cleanup()
          this.pdfDocument.cleanup(this.pdfViewer.renderer === _ui_utils.RendererType.SVG)
        },
        forceRendering: function forceRendering() {
          this.pdfRenderingQueue.printing = !!this.printService
          this.pdfRenderingQueue.isThumbnailViewEnabled = this.pdfSidebar.isThumbnailViewVisible
          this.pdfRenderingQueue.renderHighestPriority()
        },
        beforePrint: function beforePrint() {
          const _this20 = this

          this.pdfScriptingManager.dispatchWillPrint()

          if (this.printService) {
            return
          }

          if (!this.supportsPrinting) {
            this.l10n.get('printing_not_supported').then((msg) => {
              _this20._otherError(msg)
            })
            return
          }

          if (!this.pdfViewer.pageViewsReady) {
            this.l10n.get('printing_not_ready').then((msg) => {
              window.alert(msg)
            })
            return
          }

          const pagesOverview = this.pdfViewer.getPagesOverview()
          const printContainer = this.appConfig.printContainer

          const printResolution = _app_options.AppOptions.get('printResolution')

          const optionalContentConfigPromise = this.pdfViewer.optionalContentConfigPromise
          const printService = PDFPrintServiceFactory.instance.createPrintService(this.pdfDocument, pagesOverview, printContainer, printResolution, optionalContentConfigPromise, this.l10n)
          this.printService = printService
          this.forceRendering()
          printService.layout()
          this.externalServices.reportTelemetry({
            type: 'print',
          })
        },
        afterPrint: function afterPrint() {
          this.pdfScriptingManager.dispatchDidPrint()

          if (this.printService) {
            let _this$pdfDocument2

            this.printService.destroy()
            this.printService = null;
            (_this$pdfDocument2 = this.pdfDocument) === null || _this$pdfDocument2 === void 0 ? void 0 : _this$pdfDocument2.annotationStorage.resetModified()
          }

          this.forceRendering()
        },
        rotatePages: function rotatePages(delta) {
          this.pdfViewer.pagesRotation += delta
        },
        requestPresentationMode: function requestPresentationMode() {
          let _this$pdfPresentation;

          (_this$pdfPresentation = this.pdfPresentationMode) === null || _this$pdfPresentation === void 0 ? void 0 : _this$pdfPresentation.request()
        },
        triggerPrinting: function triggerPrinting() {
          if (!this.supportsPrinting) {
            return
          }

          window.print()
        },
        bindEvents: function bindEvents() {
          const eventBus = this.eventBus
          const _boundEvents = this._boundEvents
          _boundEvents.beforePrint = this.beforePrint.bind(this)
          _boundEvents.afterPrint = this.afterPrint.bind(this)

          eventBus._on('resize', webViewerResize)

          eventBus._on('hashchange', webViewerHashchange)

          eventBus._on('beforeprint', _boundEvents.beforePrint)

          eventBus._on('afterprint', _boundEvents.afterPrint)

          eventBus._on('pagerendered', webViewerPageRendered)

          eventBus._on('updateviewarea', webViewerUpdateViewarea)

          eventBus._on('pagechanging', webViewerPageChanging)

          eventBus._on('scalechanging', webViewerScaleChanging)

          eventBus._on('rotationchanging', webViewerRotationChanging)

          eventBus._on('sidebarviewchanged', webViewerSidebarViewChanged)

          eventBus._on('pagemode', webViewerPageMode)

          eventBus._on('namedaction', webViewerNamedAction)

          eventBus._on('presentationmodechanged', webViewerPresentationModeChanged)

          eventBus._on('presentationmode', webViewerPresentationMode)

          // eventBus._on("print", webViewerPrint);

          // eventBus._on("download", webViewerDownload);

          eventBus._on('save', webViewerSave)

          eventBus._on('firstpage', webViewerFirstPage)

          eventBus._on('lastpage', webViewerLastPage)

          eventBus._on('nextpage', webViewerNextPage)

          eventBus._on('previouspage', webViewerPreviousPage)

          eventBus._on('zoomin', webViewerZoomIn)

          eventBus._on('zoomout', webViewerZoomOut)

          eventBus._on('zoomreset', webViewerZoomReset)

          eventBus._on('pagenumberchanged', webViewerPageNumberChanged)

          eventBus._on('scalechanged', webViewerScaleChanged)

          eventBus._on('rotatecw', webViewerRotateCw)

          eventBus._on('rotateccw', webViewerRotateCcw)

          eventBus._on('optionalcontentconfig', webViewerOptionalContentConfig)

          eventBus._on('switchscrollmode', webViewerSwitchScrollMode)

          eventBus._on('scrollmodechanged', webViewerScrollModeChanged)

          eventBus._on('switchspreadmode', webViewerSwitchSpreadMode)

          eventBus._on('spreadmodechanged', webViewerSpreadModeChanged)

          eventBus._on('documentproperties', webViewerDocumentProperties)

          eventBus._on('findfromurlhash', webViewerFindFromUrlHash)

          eventBus._on('updatefindmatchescount', webViewerUpdateFindMatchesCount)

          eventBus._on('updatefindcontrolstate', webViewerUpdateFindControlState)

          if (_app_options.AppOptions.get('pdfBug')) {
            _boundEvents.reportPageStatsPDFBug = reportPageStatsPDFBug

            eventBus._on('pagerendered', _boundEvents.reportPageStatsPDFBug)

            eventBus._on('pagechanging', _boundEvents.reportPageStatsPDFBug)
          }

          eventBus._on('fileinputchange', webViewerFileInputChange)

          // eventBus._on("openfile", webViewerOpenFile);
        },
        bindWindowEvents: function bindWindowEvents() {
          const eventBus = this.eventBus
          const _boundEvents = this._boundEvents

          _boundEvents.windowResize = function () {
            eventBus.dispatch('resize', {
              source: window,
            })
          }

          _boundEvents.windowHashChange = function () {
            eventBus.dispatch('hashchange', {
              source: window,
              hash: document.location.hash.substring(1),
            })
          }

          _boundEvents.windowBeforePrint = function () {
            eventBus.dispatch('beforeprint', {
              source: window,
            })
          }

          _boundEvents.windowAfterPrint = function () {
            eventBus.dispatch('afterprint', {
              source: window,
            })
          }

          _boundEvents.windowUpdateFromSandbox = function (event) {
            eventBus.dispatch('updatefromsandbox', {
              source: window,
              detail: event.detail,
            })
          }

          window.addEventListener('visibilitychange', webViewerVisibilityChange)
          window.addEventListener('wheel', webViewerWheel, {
            passive: false,
          })
          window.addEventListener('touchstart', webViewerTouchStart, {
            passive: false,
          })
          window.addEventListener('click', webViewerClick)
          window.addEventListener('keydown', webViewerKeyDown)
          window.addEventListener('resize', _boundEvents.windowResize)
          window.addEventListener('hashchange', _boundEvents.windowHashChange)
          window.addEventListener('beforeprint', _boundEvents.windowBeforePrint)
          window.addEventListener('afterprint', _boundEvents.windowAfterPrint)
          window.addEventListener('updatefromsandbox', _boundEvents.windowUpdateFromSandbox)
        },
        unbindEvents: function unbindEvents() {
          const eventBus = this.eventBus
          const _boundEvents = this._boundEvents

          eventBus._off('resize', webViewerResize)

          eventBus._off('hashchange', webViewerHashchange)

          eventBus._off('beforeprint', _boundEvents.beforePrint)

          eventBus._off('afterprint', _boundEvents.afterPrint)

          eventBus._off('pagerendered', webViewerPageRendered)

          eventBus._off('updateviewarea', webViewerUpdateViewarea)

          eventBus._off('pagechanging', webViewerPageChanging)

          eventBus._off('scalechanging', webViewerScaleChanging)

          eventBus._off('rotationchanging', webViewerRotationChanging)

          eventBus._off('sidebarviewchanged', webViewerSidebarViewChanged)

          eventBus._off('pagemode', webViewerPageMode)

          eventBus._off('namedaction', webViewerNamedAction)

          eventBus._off('presentationmodechanged', webViewerPresentationModeChanged)

          eventBus._off('presentationmode', webViewerPresentationMode)

          eventBus._off('print', webViewerPrint)

          // eventBus._off('download', webViewerDownload)

          eventBus._off('save', webViewerSave)

          eventBus._off('firstpage', webViewerFirstPage)

          eventBus._off('lastpage', webViewerLastPage)

          eventBus._off('nextpage', webViewerNextPage)

          eventBus._off('previouspage', webViewerPreviousPage)

          eventBus._off('zoomin', webViewerZoomIn)

          eventBus._off('zoomout', webViewerZoomOut)

          eventBus._off('zoomreset', webViewerZoomReset)

          eventBus._off('pagenumberchanged', webViewerPageNumberChanged)

          eventBus._off('scalechanged', webViewerScaleChanged)

          eventBus._off('rotatecw', webViewerRotateCw)

          eventBus._off('rotateccw', webViewerRotateCcw)

          eventBus._off('optionalcontentconfig', webViewerOptionalContentConfig)

          eventBus._off('switchscrollmode', webViewerSwitchScrollMode)

          eventBus._off('scrollmodechanged', webViewerScrollModeChanged)

          eventBus._off('switchspreadmode', webViewerSwitchSpreadMode)

          eventBus._off('spreadmodechanged', webViewerSpreadModeChanged)

          eventBus._off('documentproperties', webViewerDocumentProperties)

          eventBus._off('findfromurlhash', webViewerFindFromUrlHash)

          eventBus._off('updatefindmatchescount', webViewerUpdateFindMatchesCount)

          eventBus._off('updatefindcontrolstate', webViewerUpdateFindControlState)

          if (_boundEvents.reportPageStatsPDFBug) {
            eventBus._off('pagerendered', _boundEvents.reportPageStatsPDFBug)

            eventBus._off('pagechanging', _boundEvents.reportPageStatsPDFBug)

            _boundEvents.reportPageStatsPDFBug = null
          }

          eventBus._off('fileinputchange', webViewerFileInputChange)

          eventBus._off('openfile', webViewerOpenFile)

          _boundEvents.beforePrint = null
          _boundEvents.afterPrint = null
        },
        unbindWindowEvents: function unbindWindowEvents() {
          const _boundEvents = this._boundEvents
          window.removeEventListener('visibilitychange', webViewerVisibilityChange)
          window.removeEventListener('wheel', webViewerWheel, {
            passive: false,
          })
          window.removeEventListener('touchstart', webViewerTouchStart, {
            passive: false,
          })
          window.removeEventListener('click', webViewerClick)
          window.removeEventListener('keydown', webViewerKeyDown)
          window.removeEventListener('resize', _boundEvents.windowResize)
          window.removeEventListener('hashchange', _boundEvents.windowHashChange)
          window.removeEventListener('beforeprint', _boundEvents.windowBeforePrint)
          window.removeEventListener('afterprint', _boundEvents.windowAfterPrint)
          window.removeEventListener('updatefromsandbox', _boundEvents.windowUpdateFromSandbox)
          _boundEvents.windowResize = null
          _boundEvents.windowHashChange = null
          _boundEvents.windowBeforePrint = null
          _boundEvents.windowAfterPrint = null
          _boundEvents.windowUpdateFromSandbox = null
        },
        accumulateWheelTicks: function accumulateWheelTicks(ticks) {
          if (this._wheelUnusedTicks > 0 && ticks < 0 || this._wheelUnusedTicks < 0 && ticks > 0) {
            this._wheelUnusedTicks = 0
          }

          this._wheelUnusedTicks += ticks
          const wholeTicks = Math.sign(this._wheelUnusedTicks) * Math.floor(Math.abs(this._wheelUnusedTicks))
          this._wheelUnusedTicks -= wholeTicks
          return wholeTicks
        },
        _unblockDocumentLoadEvent: function _unblockDocumentLoadEvent() {
          if (document.blockUnblockOnload) {
            document.blockUnblockOnload(false)
          }

          this._unblockDocumentLoadEvent = function () { }
        },
        _reportDocumentStatsTelemetry: function _reportDocumentStatsTelemetry() {
          const stats = this.pdfDocument.stats

          if (stats !== this._docStats) {
            this._docStats = stats
            this.externalServices.reportTelemetry({
              type: 'documentStats',
              stats,
            })
          }
        },

        get scriptingReady() {
          return this.pdfScriptingManager.ready
        },

      }
      exports.PDFViewerApplication = PDFViewerApplication
      let validateFileURL
      {
        const HOSTED_VIEWER_ORIGINS = ['null', 'http://mozilla.github.io', 'https://mozilla.github.io']

        validateFileURL = function validateFileURL(file) {
          if (file === undefined) {
            return
          }

          try {
            const viewerOrigin = new URL(window.location.href).origin || 'null'

            if (HOSTED_VIEWER_ORIGINS.includes(viewerOrigin)) {
              return
            }

            const _URL = new URL(file, window.location.href)
            const origin = _URL.origin
            const protocol = _URL.protocol

            if (origin !== viewerOrigin && protocol !== 'blob:') {
              // throw new Error("file origin does not match viewer's");
            }
          }
          catch (ex) {
            PDFViewerApplication.l10n.get('loading_error').then((msg) => {
              PDFViewerApplication._documentError(msg, {
                message: ex === null || ex === void 0 ? void 0 : ex.message,
              })
            })
            throw ex
          }
        }
      }

      function loadFakeWorker() {
        return _loadFakeWorker.apply(this, arguments)
      }

      function _loadFakeWorker() {
        _loadFakeWorker = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee17() {
          return _regenerator.default.wrap((_context17) => {
            while (1) {
              switch (_context17.prev = _context17.next) {
                case 0:
                  if (!_pdfjsLib.GlobalWorkerOptions.workerSrc) {
                    _pdfjsLib.GlobalWorkerOptions.workerSrc = _app_options.AppOptions.get('workerSrc')
                  }

                  _context17.next = 3
                  return (0, _pdfjsLib.loadScript)(_pdfjsLib.PDFWorker.workerSrc)

                case 3:
                case 'end':
                  return _context17.stop()
              }
            }
          }, _callee17)
        }))
        return _loadFakeWorker.apply(this, arguments)
      }

      function initPDFBug(_x3) {
        return _initPDFBug.apply(this, arguments)
      }

      function _initPDFBug() {
        _initPDFBug = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee18(enabledTabs) {
          let _PDFViewerApplication7, debuggerScriptPath, mainContainer

          return _regenerator.default.wrap((_context18) => {
            while (1) {
              switch (_context18.prev = _context18.next) {
                case 0:
                  _PDFViewerApplication7 = PDFViewerApplication.appConfig, debuggerScriptPath = _PDFViewerApplication7.debuggerScriptPath, mainContainer = _PDFViewerApplication7.mainContainer
                  _context18.next = 3
                  return (0, _pdfjsLib.loadScript)(debuggerScriptPath)

                case 3:
                  PDFBug.init({
                    OPS: _pdfjsLib.OPS,
                  }, mainContainer, enabledTabs)

                case 4:
                case 'end':
                  return _context18.stop()
              }
            }
          }, _callee18)
        }))
        return _initPDFBug.apply(this, arguments)
      }

      function reportPageStatsPDFBug(_ref10) {
        let _pageView$pdfPage

        const pageNumber = _ref10.pageNumber

        if (typeof Stats === 'undefined' || !Stats.enabled) {
          return
        }

        const pageView = PDFViewerApplication.pdfViewer.getPageView(pageNumber - 1)
        const pageStats = pageView === null || pageView === void 0 ? void 0 : (_pageView$pdfPage = pageView.pdfPage) === null || _pageView$pdfPage === void 0 ? void 0 : _pageView$pdfPage.stats

        if (!pageStats) {
          return
        }

        Stats.add(pageNumber, pageStats)
      }

      function webViewerInitialized() {
        let _params$get

        const appConfig = PDFViewerApplication.appConfig
        let file
        const queryString = document.location.search.substring(1)
        const params = (0, _ui_utils.parseQueryString)(queryString)
        file = (_params$get = params.get('file')) !== null && _params$get !== void 0 ? _params$get : _app_options.AppOptions.get('defaultUrl')
        validateFileURL(file)
        const fileInput = document.createElement('input')
        fileInput.id = appConfig.openFileInputName
        fileInput.className = 'fileInput'
        fileInput.setAttribute('type', 'file')
        fileInput.oncontextmenu = _ui_utils.noContextMenuHandler
        document.body.appendChild(fileInput)

        if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
          appConfig.toolbar.openFile.hidden = true
          appConfig.secondaryToolbar.openFileButton.hidden = true
        }
        else {
          fileInput.value = null
        }

        fileInput.addEventListener('change', function (evt) {
          const files = evt.target.files

          if (!files || files.length === 0) {
            return
          }

          PDFViewerApplication.eventBus.dispatch('fileinputchange', {
            source: this,
            fileInput: evt.target,
          })
        })
        appConfig.mainContainer.addEventListener('dragover', (evt) => {
          evt.preventDefault()
          evt.dataTransfer.dropEffect = 'move'
        })
        appConfig.mainContainer.addEventListener('drop', function (evt) {
          evt.preventDefault()
          const files = evt.dataTransfer.files

          if (!files || files.length === 0) {
            return
          }

          PDFViewerApplication.eventBus.dispatch('fileinputchange', {
            source: this,
            fileInput: evt.dataTransfer,
          })
        })

        if (!PDFViewerApplication.supportsDocumentFonts) {
          _app_options.AppOptions.set('disableFontFace', true)

          PDFViewerApplication.l10n.get('web_fonts_disabled').then((msg) => {
            console.warn(msg)
          })
        }

        if (!PDFViewerApplication.supportsPrinting) {
          appConfig.toolbar.print.classList.add('hidden')
          appConfig.secondaryToolbar.printButton.classList.add('hidden')
        }

        if (!PDFViewerApplication.supportsFullscreen) {
          appConfig.toolbar.presentationModeButton.classList.add('hidden')
          appConfig.secondaryToolbar.presentationModeButton.classList.add('hidden')
        }

        if (PDFViewerApplication.supportsIntegratedFind) {
          appConfig.toolbar.viewFind.classList.add('hidden')
        }

        appConfig.mainContainer.addEventListener('transitionend', function (evt) {
          if (evt.target === this) {
            PDFViewerApplication.eventBus.dispatch('resize', {
              source: this,
            })
          }
        }, true)

        try {
          webViewerOpenFileViaURL(file)
        }
        catch (reason) {
          PDFViewerApplication.l10n.get('loading_error').then((msg) => {
            PDFViewerApplication._documentError(msg, reason)
          })
        }
      }

      function webViewerOpenFileViaURL(file) {
        if (file) {
          PDFViewerApplication.open(file)
        }
        else {
          PDFViewerApplication._hideViewBookmark()
        }
      }

      function webViewerPageRendered(_ref11) {
        const pageNumber = _ref11.pageNumber
        const error = _ref11.error

        if (pageNumber === PDFViewerApplication.page) {
          PDFViewerApplication.toolbar.updateLoadingIndicatorState(false)
        }

        if (PDFViewerApplication.pdfSidebar.isThumbnailViewVisible) {
          const pageView = PDFViewerApplication.pdfViewer.getPageView(pageNumber - 1)
          const thumbnailView = PDFViewerApplication.pdfThumbnailViewer.getThumbnail(pageNumber - 1)

          if (pageView && thumbnailView) {
            thumbnailView.setImage(pageView)
          }
        }

        if (error) {
          PDFViewerApplication.l10n.get('rendering_error').then((msg) => {
            PDFViewerApplication._otherError(msg, error)
          })
        }

        PDFViewerApplication._reportDocumentStatsTelemetry()
      }

      function webViewerPageMode(_ref12) {
        const mode = _ref12.mode
        let view

        switch (mode) {
          case 'thumbs':
            view = _ui_utils.SidebarView.THUMBS
            break

          case 'bookmarks':
          case 'outline':
            view = _ui_utils.SidebarView.OUTLINE
            break

          case 'attachments':
            view = _ui_utils.SidebarView.ATTACHMENTS
            break

          case 'layers':
            view = _ui_utils.SidebarView.LAYERS
            break

          case 'none':
            view = _ui_utils.SidebarView.NONE
            break

          default:
            console.error(`Invalid "pagemode" hash parameter: ${mode}`)
            return
        }

        PDFViewerApplication.pdfSidebar.switchView(view, true)
      }

      function webViewerNamedAction(evt) {
        switch (evt.action) {
          case 'GoToPage':
            PDFViewerApplication.appConfig.toolbar.pageNumber.select()
            break

          case 'Find':
            if (!PDFViewerApplication.supportsIntegratedFind) {
              PDFViewerApplication.findBar.toggle()
            }

            break

          case 'Print':
            PDFViewerApplication.triggerPrinting()
            break

          case 'SaveAs':
            webViewerSave()
            break
        }
      }

      function webViewerPresentationModeChanged(evt) {
        PDFViewerApplication.pdfViewer.presentationModeState = evt.state
      }

      function webViewerSidebarViewChanged(evt) {
        PDFViewerApplication.pdfRenderingQueue.isThumbnailViewEnabled = PDFViewerApplication.pdfSidebar.isThumbnailViewVisible

        if (PDFViewerApplication.isInitialViewSet) {
          let _PDFViewerApplication;

          (_PDFViewerApplication = PDFViewerApplication.store) === null || _PDFViewerApplication === void 0 ? void 0 : _PDFViewerApplication.set('sidebarView', evt.view).catch(() => { })
        }
      }

      function webViewerUpdateViewarea(evt) {
        const location = evt.location

        if (PDFViewerApplication.isInitialViewSet) {
          let _PDFViewerApplication2;

          (_PDFViewerApplication2 = PDFViewerApplication.store) === null || _PDFViewerApplication2 === void 0
            ? void 0
            : _PDFViewerApplication2.setMultiple({
              page: location.pageNumber,
              zoom: location.scale,
              scrollLeft: location.left,
              scrollTop: location.top,
              rotation: location.rotation,
            }).catch(() => { })
        }

        const href = PDFViewerApplication.pdfLinkService.getAnchorUrl(location.pdfOpenParams)
        PDFViewerApplication.appConfig.toolbar.viewBookmark.href = href
        PDFViewerApplication.appConfig.secondaryToolbar.viewBookmarkButton.href = href
        const currentPage = PDFViewerApplication.pdfViewer.getPageView(PDFViewerApplication.page - 1)
        const loading = (currentPage === null || currentPage === void 0 ? void 0 : currentPage.renderingState) !== _ui_utils.RenderingStates.FINISHED
        PDFViewerApplication.toolbar.updateLoadingIndicatorState(loading)
      }

      function webViewerScrollModeChanged(evt) {
        if (PDFViewerApplication.isInitialViewSet) {
          let _PDFViewerApplication3;

          (_PDFViewerApplication3 = PDFViewerApplication.store) === null || _PDFViewerApplication3 === void 0 ? void 0 : _PDFViewerApplication3.set('scrollMode', evt.mode).catch(() => { })
        }
      }

      function webViewerSpreadModeChanged(evt) {
        if (PDFViewerApplication.isInitialViewSet) {
          let _PDFViewerApplication4;

          (_PDFViewerApplication4 = PDFViewerApplication.store) === null || _PDFViewerApplication4 === void 0 ? void 0 : _PDFViewerApplication4.set('spreadMode', evt.mode).catch(() => { })
        }
      }

      function webViewerResize() {
        const pdfDocument = PDFViewerApplication.pdfDocument
        const pdfViewer = PDFViewerApplication.pdfViewer

        if (!pdfDocument) {
          return
        }

        const currentScaleValue = pdfViewer.currentScaleValue

        if (currentScaleValue === 'auto' || currentScaleValue === 'page-fit' || currentScaleValue === 'page-width') {
          pdfViewer.currentScaleValue = currentScaleValue
        }

        pdfViewer.update()
      }

      function webViewerHashchange(evt) {
        let _PDFViewerApplication5

        const hash = evt.hash

        if (!hash) {
          return
        }

        if (!PDFViewerApplication.isInitialViewSet) {
          PDFViewerApplication.initialBookmark = hash
        }
        else if (!((_PDFViewerApplication5 = PDFViewerApplication.pdfHistory) !== null && _PDFViewerApplication5 !== void 0 && _PDFViewerApplication5.popStateInProgress)) {
          PDFViewerApplication.pdfLinkService.setHash(hash)
        }
      }

      let webViewerFileInputChange, webViewerOpenFile
      {
        webViewerFileInputChange = function webViewerFileInputChange(evt) {
          let _PDFViewerApplication6

          if ((_PDFViewerApplication6 = PDFViewerApplication.pdfViewer) !== null && _PDFViewerApplication6 !== void 0 && _PDFViewerApplication6.isInPresentationMode) {
            return
          }

          const file = evt.fileInput.files[0]

          if (!_app_options.compatibilityParams.disableCreateObjectURL) {
            let url = URL.createObjectURL(file)

            if (file.name) {
              url = {
                url,
                originalUrl: file.name,
              }
            }

            PDFViewerApplication.open(url)
          }
          else {
            PDFViewerApplication.setTitleUsingUrl(file.name)
            const fileReader = new FileReader()

            fileReader.onload = function webViewerChangeFileReaderOnload(event) {
              const buffer = event.target.result
              PDFViewerApplication.open(new Uint8Array(buffer))
            }

            fileReader.readAsArrayBuffer(file)
          }
        }

        webViewerOpenFile = function webViewerOpenFile(evt) {
          const openFileInputName = PDFViewerApplication.appConfig.openFileInputName
          document.getElementById(openFileInputName).click()
        }
      }

      function webViewerPresentationMode() {
        PDFViewerApplication.requestPresentationMode()
      }

      function webViewerPrint() {
        PDFViewerApplication.triggerPrinting()
      }

      function webViewerDownload() {
        PDFViewerApplication.downloadOrSave({
          sourceEventType: 'download',
        })
      }

      function webViewerSave() {
        PDFViewerApplication.downloadOrSave({
          sourceEventType: 'save',
        })
      }

      function webViewerFirstPage() {
        if (PDFViewerApplication.pdfDocument) {
          PDFViewerApplication.page = 1
        }
      }

      function webViewerLastPage() {
        if (PDFViewerApplication.pdfDocument) {
          PDFViewerApplication.page = PDFViewerApplication.pagesCount
        }
      }

      function webViewerNextPage() {
        PDFViewerApplication.pdfViewer.nextPage()
      }

      function webViewerPreviousPage() {
        PDFViewerApplication.pdfViewer.previousPage()
      }

      function webViewerZoomIn() {
        PDFViewerApplication.zoomIn()
      }

      function webViewerZoomOut() {
        PDFViewerApplication.zoomOut()
      }

      function webViewerZoomReset() {
        PDFViewerApplication.zoomReset()
      }

      function webViewerPageNumberChanged(evt) {
        const pdfViewer = PDFViewerApplication.pdfViewer

        if (evt.value !== '') {
          PDFViewerApplication.pdfLinkService.goToPage(evt.value)
        }

        if (evt.value !== pdfViewer.currentPageNumber.toString() && evt.value !== pdfViewer.currentPageLabel) {
          PDFViewerApplication.toolbar.setPageNumber(pdfViewer.currentPageNumber, pdfViewer.currentPageLabel)
        }
      }

      function webViewerScaleChanged(evt) {
        PDFViewerApplication.pdfViewer.currentScaleValue = evt.value
      }

      function webViewerRotateCw() {
        PDFViewerApplication.rotatePages(90)
      }

      function webViewerRotateCcw() {
        PDFViewerApplication.rotatePages(-90)
      }

      function webViewerOptionalContentConfig(evt) {
        PDFViewerApplication.pdfViewer.optionalContentConfigPromise = evt.promise
      }

      function webViewerSwitchScrollMode(evt) {
        PDFViewerApplication.pdfViewer.scrollMode = evt.mode
      }

      function webViewerSwitchSpreadMode(evt) {
        PDFViewerApplication.pdfViewer.spreadMode = evt.mode
      }

      function webViewerDocumentProperties() {
        PDFViewerApplication.pdfDocumentProperties.open()
      }

      function webViewerFindFromUrlHash(evt) {
        PDFViewerApplication.eventBus.dispatch('find', {
          source: evt.source,
          type: '',
          query: evt.query,
          phraseSearch: evt.phraseSearch,
          caseSensitive: false,
          entireWord: false,
          highlightAll: true,
          findPrevious: false,
        })
      }

      function webViewerUpdateFindMatchesCount(_ref13) {
        const matchesCount = _ref13.matchesCount

        if (PDFViewerApplication.supportsIntegratedFind) {
          PDFViewerApplication.externalServices.updateFindMatchesCount(matchesCount)
        }
        else {
          PDFViewerApplication.findBar.updateResultsCount(matchesCount)
        }
      }

      function webViewerUpdateFindControlState(_ref14) {
        const state = _ref14.state
        const previous = _ref14.previous
        const matchesCount = _ref14.matchesCount
        const rawQuery = _ref14.rawQuery

        if (PDFViewerApplication.supportsIntegratedFind) {
          PDFViewerApplication.externalServices.updateFindControlState({
            result: state,
            findPrevious: previous,
            matchesCount,
            rawQuery,
          })
        }
        else {
          PDFViewerApplication.findBar.updateUIState(state, previous, matchesCount)
        }
      }

      function webViewerScaleChanging(evt) {
        PDFViewerApplication.toolbar.setPageScale(evt.presetValue, evt.scale)
        PDFViewerApplication.pdfViewer.update()
      }

      function webViewerRotationChanging(evt) {
        PDFViewerApplication.pdfThumbnailViewer.pagesRotation = evt.pagesRotation
        PDFViewerApplication.forceRendering()
        PDFViewerApplication.pdfViewer.currentPageNumber = evt.pageNumber
      }

      function webViewerPageChanging(_ref15) {
        const pageNumber = _ref15.pageNumber
        const pageLabel = _ref15.pageLabel
        PDFViewerApplication.toolbar.setPageNumber(pageNumber, pageLabel)
        PDFViewerApplication.secondaryToolbar.setPageNumber(pageNumber)

        if (PDFViewerApplication.pdfSidebar.isThumbnailViewVisible) {
          PDFViewerApplication.pdfThumbnailViewer.scrollThumbnailIntoView(pageNumber)
        }
      }

      function webViewerVisibilityChange(evt) {
        if (document.visibilityState === 'visible') {
          setZoomDisabledTimeout()
        }
      }

      let zoomDisabledTimeout = null

      function setZoomDisabledTimeout() {
        if (zoomDisabledTimeout) {
          clearTimeout(zoomDisabledTimeout)
        }

        zoomDisabledTimeout = setTimeout(() => {
          zoomDisabledTimeout = null
        }, WHEEL_ZOOM_DISABLED_TIMEOUT)
      }

      function webViewerWheel(evt) {
        const pdfViewer = PDFViewerApplication.pdfViewer
        const supportedMouseWheelZoomModifierKeys = PDFViewerApplication.supportedMouseWheelZoomModifierKeys

        if (pdfViewer.isInPresentationMode) {
          return
        }

        if (evt.ctrlKey && supportedMouseWheelZoomModifierKeys.ctrlKey || evt.metaKey && supportedMouseWheelZoomModifierKeys.metaKey) {
          evt.preventDefault()

          if (zoomDisabledTimeout || document.visibilityState === 'hidden') {
            return
          }

          const previousScale = pdfViewer.currentScale
          const delta = (0, _ui_utils.normalizeWheelEventDirection)(evt)
          let ticks = 0

          if (evt.deltaMode === WheelEvent.DOM_DELTA_LINE || evt.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
            if (Math.abs(delta) >= 1) {
              ticks = Math.sign(delta)
            }
            else {
              ticks = PDFViewerApplication.accumulateWheelTicks(delta)
            }
          }
          else {
            const PIXELS_PER_LINE_SCALE = 30
            ticks = PDFViewerApplication.accumulateWheelTicks(delta / PIXELS_PER_LINE_SCALE)
          }

          if (ticks < 0) {
            PDFViewerApplication.zoomOut(-ticks)
          }
          else if (ticks > 0) {
            PDFViewerApplication.zoomIn(ticks)
          }

          const currentScale = pdfViewer.currentScale

          if (previousScale !== currentScale) {
            const scaleCorrectionFactor = currentScale / previousScale - 1
            const rect = pdfViewer.container.getBoundingClientRect()
            const dx = evt.clientX - rect.left
            const dy = evt.clientY - rect.top
            pdfViewer.container.scrollLeft += dx * scaleCorrectionFactor
            pdfViewer.container.scrollTop += dy * scaleCorrectionFactor
          }
        }
        else {
          setZoomDisabledTimeout()
        }
      }

      function webViewerTouchStart(evt) {
        if (evt.touches.length > 1) {
          evt.preventDefault()
        }
      }

      function webViewerClick(evt) {
        if (!PDFViewerApplication.secondaryToolbar.isOpen) {
          return
        }

        const appConfig = PDFViewerApplication.appConfig

        if (PDFViewerApplication.pdfViewer.containsElement(evt.target) || appConfig.toolbar.container.contains(evt.target) && evt.target !== appConfig.secondaryToolbar.toggleButton) {
          PDFViewerApplication.secondaryToolbar.close()
        }
      }

      function webViewerKeyDown(evt) {
        if (PDFViewerApplication.overlayManager.active) {
          return
        }

        const eventBus = PDFViewerApplication.eventBus
        const pdfViewer = PDFViewerApplication.pdfViewer
        const isViewerInPresentationMode = pdfViewer.isInPresentationMode
        let handled = false
        let ensureViewerFocused = false
        const cmd = (evt.ctrlKey ? 1 : 0) | (evt.altKey ? 2 : 0) | (evt.shiftKey ? 4 : 0) | (evt.metaKey ? 8 : 0)

        if (cmd === 1 || cmd === 8 || cmd === 5 || cmd === 12) {
          switch (evt.keyCode) {
            case 70:
              if (!PDFViewerApplication.supportsIntegratedFind && !evt.shiftKey) {
                PDFViewerApplication.findBar.open()
                handled = true
              }

              break

            case 71:
              if (!PDFViewerApplication.supportsIntegratedFind) {
                const state = PDFViewerApplication.findController.state

                if (state) {
                  const eventState = Object.assign(Object.create(null), state, {
                    source: window,
                    type: 'again',
                    findPrevious: cmd === 5 || cmd === 12,
                  })
                  eventBus.dispatch('find', eventState)
                }

                handled = true
              }

              break

            case 61:
            case 107:
            case 187:
            case 171:
              if (!isViewerInPresentationMode) {
                PDFViewerApplication.zoomIn()
              }

              handled = true
              break

            case 173:
            case 109:
            case 189:
              if (!isViewerInPresentationMode) {
                PDFViewerApplication.zoomOut()
              }

              handled = true
              break

            case 48:
            case 96:
              if (!isViewerInPresentationMode) {
                setTimeout(() => {
                  PDFViewerApplication.zoomReset()
                })
                handled = false
              }

              break

            case 38:
              if (isViewerInPresentationMode || PDFViewerApplication.page > 1) {
                PDFViewerApplication.page = 1
                handled = true
                ensureViewerFocused = true
              }

              break

            case 40:
              if (isViewerInPresentationMode || PDFViewerApplication.page < PDFViewerApplication.pagesCount) {
                PDFViewerApplication.page = PDFViewerApplication.pagesCount
                handled = true
                ensureViewerFocused = true
              }

              break
          }
        }

        if (cmd === 1 || cmd === 8) {
          switch (evt.keyCode) {
            case 83:
              // eventBus.dispatch("download", {
              //   source: window
              // });
              // handled = true;
              break

            case 79:
              {
                eventBus.dispatch('openfile', {
                  source: window,
                })
                handled = true
              }
              break
          }
        }

        if (cmd === 3 || cmd === 10) {
          switch (evt.keyCode) {
            case 80:
              PDFViewerApplication.requestPresentationMode()
              handled = true
              break

            case 71:
              PDFViewerApplication.appConfig.toolbar.pageNumber.select()
              handled = true
              break
          }
        }

        if (handled) {
          if (ensureViewerFocused && !isViewerInPresentationMode) {
            pdfViewer.focus()
          }

          evt.preventDefault()
          return
        }

        const curElement = (0, _ui_utils.getActiveOrFocusedElement)()
        const curElementTagName = curElement === null || curElement === void 0 ? void 0 : curElement.tagName.toUpperCase()

        if (curElementTagName === 'INPUT' || curElementTagName === 'TEXTAREA' || curElementTagName === 'SELECT' || curElement !== null && curElement !== void 0 && curElement.isContentEditable) {
          if (evt.keyCode !== 27) {
            return
          }
        }

        if (cmd === 0) {
          let turnPage = 0
          let turnOnlyIfPageFit = false

          switch (evt.keyCode) {
            case 38:
            case 33:
              if (pdfViewer.isVerticalScrollbarEnabled) {
                turnOnlyIfPageFit = true
              }

              turnPage = -1
              break

            case 8:
              if (!isViewerInPresentationMode) {
                turnOnlyIfPageFit = true
              }

              turnPage = -1
              break

            case 37:
              if (pdfViewer.isHorizontalScrollbarEnabled) {
                turnOnlyIfPageFit = true
              }

            case 75:
            case 80:
              turnPage = -1
              break

            case 27:
              if (PDFViewerApplication.secondaryToolbar.isOpen) {
                PDFViewerApplication.secondaryToolbar.close()
                handled = true
              }

              if (!PDFViewerApplication.supportsIntegratedFind && PDFViewerApplication.findBar.opened) {
                PDFViewerApplication.findBar.close()
                handled = true
              }

              break

            case 40:
            case 34:
              if (pdfViewer.isVerticalScrollbarEnabled) {
                turnOnlyIfPageFit = true
              }

              turnPage = 1
              break

            case 13:
            case 32:
              if (!isViewerInPresentationMode) {
                turnOnlyIfPageFit = true
              }

              turnPage = 1
              break

            case 39:
              if (pdfViewer.isHorizontalScrollbarEnabled) {
                turnOnlyIfPageFit = true
              }

            case 74:
            case 78:
              turnPage = 1
              break

            case 36:
              if (isViewerInPresentationMode || PDFViewerApplication.page > 1) {
                PDFViewerApplication.page = 1
                handled = true
                ensureViewerFocused = true
              }

              break

            case 35:
              if (isViewerInPresentationMode || PDFViewerApplication.page < PDFViewerApplication.pagesCount) {
                PDFViewerApplication.page = PDFViewerApplication.pagesCount
                handled = true
                ensureViewerFocused = true
              }

              break

            case 83:
              PDFViewerApplication.pdfCursorTools.switchTool(_pdf_cursor_tools.CursorTool.SELECT)
              break

            case 72:
              PDFViewerApplication.pdfCursorTools.switchTool(_pdf_cursor_tools.CursorTool.HAND)
              break

            case 82:
              PDFViewerApplication.rotatePages(90)
              break

            case 115:
              PDFViewerApplication.pdfSidebar.toggle()
              break
          }

          if (turnPage !== 0 && (!turnOnlyIfPageFit || pdfViewer.currentScaleValue === 'page-fit')) {
            if (turnPage > 0) {
              pdfViewer.nextPage()
            }
            else {
              pdfViewer.previousPage()
            }

            handled = true
          }
        }

        if (cmd === 4) {
          switch (evt.keyCode) {
            case 13:
            case 32:
              if (!isViewerInPresentationMode && pdfViewer.currentScaleValue !== 'page-fit') {
                break
              }

              pdfViewer.previousPage()
              handled = true
              break

            case 82:
              PDFViewerApplication.rotatePages(-90)
              break
          }
        }

        if (!handled && !isViewerInPresentationMode) {
          if (evt.keyCode >= 33 && evt.keyCode <= 40 || evt.keyCode === 32 && curElementTagName !== 'BUTTON') {
            ensureViewerFocused = true
          }
        }

        if (ensureViewerFocused && !pdfViewer.containsElement(curElement)) {
          pdfViewer.focus()
        }

        if (handled) {
          evt.preventDefault()
        }
      }

      function beforeUnload(evt) {
        evt.preventDefault()
        evt.returnValue = ''
        return false
      }

      var PDFPrintServiceFactory = {
        instance: {
          supportsPrinting: false,
          createPrintService: function createPrintService() {
            throw new Error('Not implemented: createPrintService')
          },
        },
      }
      exports.PDFPrintServiceFactory = PDFPrintServiceFactory

      /***/
    },
    /* 3 */
    /***/ (module, __unused_webpack_exports, __webpack_require__) => {
      module.exports = __webpack_require__(4)

      /***/
    },
    /* 4 */
    /***/ (module, __unused_webpack_exports, __webpack_require__) => {
      /* module decorator */ module = __webpack_require__.nmd(module)

      function _typeof(obj) {
        '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof(obj) { return typeof obj } }
        else { _typeof = function _typeof(obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj)
      }

      const runtime = (function (exports) {
        'use strict'

        const Op = Object.prototype
        const hasOwn = Op.hasOwnProperty
        let undefined
        const $Symbol = typeof Symbol === 'function' ? Symbol : {}
        const iteratorSymbol = $Symbol.iterator || '@@iterator'
        const asyncIteratorSymbol = $Symbol.asyncIterator || '@@asyncIterator'
        const toStringTagSymbol = $Symbol.toStringTag || '@@toStringTag'

        function define(obj, key, value) {
          Object.defineProperty(obj, key, {
            value,
            enumerable: true,
            configurable: true,
            writable: true,
          })
          return obj[key]
        }

        try {
          define({}, '')
        }
        catch (err) {
          define = function define(obj, key, value) {
            return obj[key] = value
          }
        }

        function wrap(innerFn, outerFn, self, tryLocsList) {
          const protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator
          const generator = Object.create(protoGenerator.prototype)
          const context = new Context(tryLocsList || [])
          generator._invoke = makeInvokeMethod(innerFn, self, context)
          return generator
        }

        exports.wrap = wrap

        function tryCatch(fn, obj, arg) {
          try {
            return {
              type: 'normal',
              arg: fn.call(obj, arg),
            }
          }
          catch (err) {
            return {
              type: 'throw',
              arg: err,
            }
          }
        }

        const GenStateSuspendedStart = 'suspendedStart'
        const GenStateSuspendedYield = 'suspendedYield'
        const GenStateExecuting = 'executing'
        const GenStateCompleted = 'completed'
        const ContinueSentinel = {}

        function Generator() { }

        function GeneratorFunction() { }

        function GeneratorFunctionPrototype() { }

        let IteratorPrototype = {}
        define(IteratorPrototype, iteratorSymbol, function () {
          return this
        })
        const getProto = Object.getPrototypeOf
        const NativeIteratorPrototype = getProto && getProto(getProto(values([])))

        if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
          IteratorPrototype = NativeIteratorPrototype
        }

        const Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype)
        GeneratorFunction.prototype = GeneratorFunctionPrototype
        define(Gp, 'constructor', GeneratorFunctionPrototype)
        define(GeneratorFunctionPrototype, 'constructor', GeneratorFunction)
        GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, 'GeneratorFunction')

        function defineIteratorMethods(prototype) {
          ['next', 'throw', 'return'].forEach((method) => {
            define(prototype, method, function (arg) {
              return this._invoke(method, arg)
            })
          })
        }

        exports.isGeneratorFunction = function (genFun) {
          const ctor = typeof genFun === 'function' && genFun.constructor
          return ctor ? ctor === GeneratorFunction || (ctor.displayName || ctor.name) === 'GeneratorFunction' : false
        }

        exports.mark = function (genFun) {
          if (Object.setPrototypeOf) {
            Object.setPrototypeOf(genFun, GeneratorFunctionPrototype)
          }
          else {
            genFun.__proto__ = GeneratorFunctionPrototype
            define(genFun, toStringTagSymbol, 'GeneratorFunction')
          }

          genFun.prototype = Object.create(Gp)
          return genFun
        }

        exports.awrap = function (arg) {
          return {
            __await: arg,
          }
        }

        function AsyncIterator(generator, PromiseImpl) {
          function invoke(method, arg, resolve, reject) {
            const record = tryCatch(generator[method], generator, arg)

            if (record.type === 'throw') {
              reject(record.arg)
            }
            else {
              const result = record.arg
              const value = result.value

              if (value && _typeof(value) === 'object' && hasOwn.call(value, '__await')) {
                return PromiseImpl.resolve(value.__await).then((value) => {
                  invoke('next', value, resolve, reject)
                }, (err) => {
                  invoke('throw', err, resolve, reject)
                })
              }

              return PromiseImpl.resolve(value).then((unwrapped) => {
                result.value = unwrapped
                resolve(result)
              }, (error) => {
                return invoke('throw', error, resolve, reject)
              })
            }
          }

          let previousPromise

          function enqueue(method, arg) {
            function callInvokeWithMethodAndArg() {
              return new PromiseImpl((resolve, reject) => {
                invoke(method, arg, resolve, reject)
              })
            }

            return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg()
          }

          this._invoke = enqueue
        }

        defineIteratorMethods(AsyncIterator.prototype)
        define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
          return this
        })
        exports.AsyncIterator = AsyncIterator

        exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
          if (PromiseImpl === void 0)
            PromiseImpl = Promise
          const iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl)
          return exports.isGeneratorFunction(outerFn)
            ? iter
            : iter.next().then((result) => {
              return result.done ? result.value : iter.next()
            })
        }

        function makeInvokeMethod(innerFn, self, context) {
          let state = GenStateSuspendedStart
          return function invoke(method, arg) {
            if (state === GenStateExecuting) {
              throw new Error('Generator is already running')
            }

            if (state === GenStateCompleted) {
              if (method === 'throw') {
                throw arg
              }

              return doneResult()
            }

            context.method = method
            context.arg = arg

            while (true) {
              const delegate = context.delegate

              if (delegate) {
                const delegateResult = maybeInvokeDelegate(delegate, context)

                if (delegateResult) {
                  if (delegateResult === ContinueSentinel)
                    continue
                  return delegateResult
                }
              }

              if (context.method === 'next') {
                context.sent = context._sent = context.arg
              }
              else if (context.method === 'throw') {
                if (state === GenStateSuspendedStart) {
                  state = GenStateCompleted
                  throw context.arg
                }

                context.dispatchException(context.arg)
              }
              else if (context.method === 'return') {
                context.abrupt('return', context.arg)
              }

              state = GenStateExecuting
              const record = tryCatch(innerFn, self, context)

              if (record.type === 'normal') {
                state = context.done ? GenStateCompleted : GenStateSuspendedYield

                if (record.arg === ContinueSentinel) {
                  continue
                }

                return {
                  value: record.arg,
                  done: context.done,
                }
              }
              else if (record.type === 'throw') {
                state = GenStateCompleted
                context.method = 'throw'
                context.arg = record.arg
              }
            }
          }
        }

        function maybeInvokeDelegate(delegate, context) {
          const method = delegate.iterator[context.method]

          if (method === undefined) {
            context.delegate = null

            if (context.method === 'throw') {
              if (delegate.iterator.return) {
                context.method = 'return'
                context.arg = undefined
                maybeInvokeDelegate(delegate, context)

                if (context.method === 'throw') {
                  return ContinueSentinel
                }
              }

              context.method = 'throw'
              context.arg = new TypeError('The iterator does not provide a \'throw\' method')
            }

            return ContinueSentinel
          }

          const record = tryCatch(method, delegate.iterator, context.arg)

          if (record.type === 'throw') {
            context.method = 'throw'
            context.arg = record.arg
            context.delegate = null
            return ContinueSentinel
          }

          const info = record.arg

          if (!info) {
            context.method = 'throw'
            context.arg = new TypeError('iterator result is not an object')
            context.delegate = null
            return ContinueSentinel
          }

          if (info.done) {
            context[delegate.resultName] = info.value
            context.next = delegate.nextLoc

            if (context.method !== 'return') {
              context.method = 'next'
              context.arg = undefined
            }
          }
          else {
            return info
          }

          context.delegate = null
          return ContinueSentinel
        }

        defineIteratorMethods(Gp)
        define(Gp, toStringTagSymbol, 'Generator')
        define(Gp, iteratorSymbol, function () {
          return this
        })
        define(Gp, 'toString', () => {
          return '[object Generator]'
        })

        function pushTryEntry(locs) {
          const entry = {
            tryLoc: locs[0],
          }

          if (1 in locs) {
            entry.catchLoc = locs[1]
          }

          if (2 in locs) {
            entry.finallyLoc = locs[2]
            entry.afterLoc = locs[3]
          }

          this.tryEntries.push(entry)
        }

        function resetTryEntry(entry) {
          const record = entry.completion || {}
          record.type = 'normal'
          delete record.arg
          entry.completion = record
        }

        function Context(tryLocsList) {
          this.tryEntries = [{
            tryLoc: 'root',
          }]
          tryLocsList.forEach(pushTryEntry, this)
          this.reset(true)
        }

        exports.keys = function (object) {
          const keys = []

          for (const key in object) {
            keys.push(key)
          }

          keys.reverse()
          return function next() {
            while (keys.length) {
              const key = keys.pop()

              if (key in object) {
                next.value = key
                next.done = false
                return next
              }
            }

            next.done = true
            return next
          }
        }

        function values(iterable) {
          if (iterable) {
            const iteratorMethod = iterable[iteratorSymbol]

            if (iteratorMethod) {
              return iteratorMethod.call(iterable)
            }

            if (typeof iterable.next === 'function') {
              return iterable
            }

            if (!isNaN(iterable.length)) {
              let i = -1
              const next = function next() {
                while (++i < iterable.length) {
                  if (hasOwn.call(iterable, i)) {
                    next.value = iterable[i]
                    next.done = false
                    return next
                  }
                }

                next.value = undefined
                next.done = true
                return next
              }

              return next.next = next
            }
          }

          return {
            next: doneResult,
          }
        }

        exports.values = values

        function doneResult() {
          return {
            value: undefined,
            done: true,
          }
        }

        Context.prototype = {
          constructor: Context,
          reset: function reset(skipTempReset) {
            this.prev = 0
            this.next = 0
            this.sent = this._sent = undefined
            this.done = false
            this.delegate = null
            this.method = 'next'
            this.arg = undefined
            this.tryEntries.forEach(resetTryEntry)

            if (!skipTempReset) {
              for (const name in this) {
                if (name.charAt(0) === 't' && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
                  this[name] = undefined
                }
              }
            }
          },
          stop: function stop() {
            this.done = true
            const rootEntry = this.tryEntries[0]
            const rootRecord = rootEntry.completion

            if (rootRecord.type === 'throw') {
              throw rootRecord.arg
            }

            return this.rval
          },
          dispatchException: function dispatchException(exception) {
            if (this.done) {
              throw exception
            }

            const context = this

            function handle(loc, caught) {
              record.type = 'throw'
              record.arg = exception
              context.next = loc

              if (caught) {
                context.method = 'next'
                context.arg = undefined
              }

              return !!caught
            }

            for (let i = this.tryEntries.length - 1; i >= 0; --i) {
              const entry = this.tryEntries[i]
              var record = entry.completion

              if (entry.tryLoc === 'root') {
                return handle('end')
              }

              if (entry.tryLoc <= this.prev) {
                const hasCatch = hasOwn.call(entry, 'catchLoc')
                const hasFinally = hasOwn.call(entry, 'finallyLoc')

                if (hasCatch && hasFinally) {
                  if (this.prev < entry.catchLoc) {
                    return handle(entry.catchLoc, true)
                  }
                  else if (this.prev < entry.finallyLoc) {
                    return handle(entry.finallyLoc)
                  }
                }
                else if (hasCatch) {
                  if (this.prev < entry.catchLoc) {
                    return handle(entry.catchLoc, true)
                  }
                }
                else if (hasFinally) {
                  if (this.prev < entry.finallyLoc) {
                    return handle(entry.finallyLoc)
                  }
                }
                else {
                  throw new Error('try statement without catch or finally')
                }
              }
            }
          },
          abrupt: function abrupt(type, arg) {
            for (let i = this.tryEntries.length - 1; i >= 0; --i) {
              const entry = this.tryEntries[i]

              if (entry.tryLoc <= this.prev && hasOwn.call(entry, 'finallyLoc') && this.prev < entry.finallyLoc) {
                var finallyEntry = entry
                break
              }
            }

            if (finallyEntry && (type === 'break' || type === 'continue') && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
              finallyEntry = null
            }

            const record = finallyEntry ? finallyEntry.completion : {}
            record.type = type
            record.arg = arg

            if (finallyEntry) {
              this.method = 'next'
              this.next = finallyEntry.finallyLoc
              return ContinueSentinel
            }

            return this.complete(record)
          },
          complete: function complete(record, afterLoc) {
            if (record.type === 'throw') {
              throw record.arg
            }

            if (record.type === 'break' || record.type === 'continue') {
              this.next = record.arg
            }
            else if (record.type === 'return') {
              this.rval = this.arg = record.arg
              this.method = 'return'
              this.next = 'end'
            }
            else if (record.type === 'normal' && afterLoc) {
              this.next = afterLoc
            }

            return ContinueSentinel
          },
          finish: function finish(finallyLoc) {
            for (let i = this.tryEntries.length - 1; i >= 0; --i) {
              const entry = this.tryEntries[i]

              if (entry.finallyLoc === finallyLoc) {
                this.complete(entry.completion, entry.afterLoc)
                resetTryEntry(entry)
                return ContinueSentinel
              }
            }
          },
          catch: function _catch(tryLoc) {
            for (let i = this.tryEntries.length - 1; i >= 0; --i) {
              const entry = this.tryEntries[i]

              if (entry.tryLoc === tryLoc) {
                const record = entry.completion

                if (record.type === 'throw') {
                  var thrown = record.arg
                  resetTryEntry(entry)
                }

                return thrown
              }
            }

            throw new Error('illegal catch attempt')
          },
          delegateYield: function delegateYield(iterable, resultName, nextLoc) {
            this.delegate = {
              iterator: values(iterable),
              resultName,
              nextLoc,
            }

            if (this.method === 'next') {
              this.arg = undefined
            }

            return ContinueSentinel
          },
        }
        return exports
      }((false ? 0 : _typeof(module)) === 'object' ? module.exports : {}))

      try {
        regeneratorRuntime = runtime
      }
      catch (accidentalStrictMode) {
        if ((typeof globalThis === 'undefined' ? 'undefined' : _typeof(globalThis)) === 'object') {
          globalThis.regeneratorRuntime = runtime
        }
        else {
          Function('r', 'regeneratorRuntime = r')(runtime)
        }
      }

      /***/
    },
    /* 5 */
    /***/ (__unused_webpack_module, exports) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.animationStarted = exports.VERTICAL_PADDING = exports.UNKNOWN_SCALE = exports.TextLayerMode = exports.SpreadMode = exports.SidebarView = exports.ScrollMode = exports.SCROLLBAR_PADDING = exports.RenderingStates = exports.RendererType = exports.ProgressBar = exports.PresentationModeState = exports.MIN_SCALE = exports.MAX_SCALE = exports.MAX_AUTO_SCALE = exports.DEFAULT_SCALE_VALUE = exports.DEFAULT_SCALE_DELTA = exports.DEFAULT_SCALE = exports.AutoPrintRegExp = void 0
      exports.apiPageLayoutToViewerModes = apiPageLayoutToViewerModes
      exports.apiPageModeToSidebarView = apiPageModeToSidebarView
      exports.approximateFraction = approximateFraction
      exports.backtrackBeforeAllVisibleElements = backtrackBeforeAllVisibleElements
      exports.binarySearchFirstItem = binarySearchFirstItem
      exports.getActiveOrFocusedElement = getActiveOrFocusedElement
      exports.getOutputScale = getOutputScale
      exports.getPageSizeInches = getPageSizeInches
      exports.getVisibleElements = getVisibleElements
      exports.isPortraitOrientation = isPortraitOrientation
      exports.isValidRotation = isValidRotation
      exports.isValidScrollMode = isValidScrollMode
      exports.isValidSpreadMode = isValidSpreadMode
      exports.noContextMenuHandler = noContextMenuHandler
      exports.normalizeWheelEventDelta = normalizeWheelEventDelta
      exports.normalizeWheelEventDirection = normalizeWheelEventDirection
      exports.parseQueryString = parseQueryString
      exports.roundToDivide = roundToDivide
      exports.scrollIntoView = scrollIntoView
      exports.watchScroll = watchScroll

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest() }

      function _nonIterableRest() { throw new TypeError('Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') }

      function _iterableToArrayLimit(arr, i) {
        let _i = arr == null ? null : typeof Symbol !== 'undefined' && arr[Symbol.iterator] || arr['@@iterator']; if (_i == null)
          return; const _arr = []; let _n = true; let _d = false; let _s, _e; try {
            for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
              _arr.push(_s.value); if (i && _arr.length === i)
                break
            }
          }
        catch (err) { _d = true; _e = err }
        finally {
          try {
            if (!_n && _i.return != null)
              _i.return()
          }
          finally {
            if (_d)
              throw _e
          }
        } return _arr
      }

      function _arrayWithHoles(arr) {
        if (Array.isArray(arr))
          return arr
      }

      function _createForOfIteratorHelper(o, allowArrayLike) {
        let it = typeof Symbol !== 'undefined' && o[Symbol.iterator] || o['@@iterator']; if (!it) {
          if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === 'number') {
            if (it)
              o = it; let i = 0; const F = function F() { }; return {
                s: F,
                n: function n() {
                  if (i >= o.length)
                    return { done: true }; return { done: false, value: o[i++] }
                },
                e: function e(_e2) { throw _e2 },
                f: F,
              }
          } throw new TypeError('Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.')
        } let normalCompletion = true; let didErr = false; let err; return {
          s: function s() { it = it.call(o) },
          n: function n() { const step = it.next(); normalCompletion = step.done; return step },
          e: function e(_e3) { didErr = true; err = _e3 },
          f: function f() {
            try {
              if (!normalCompletion && it.return != null)
                it.return()
            }
            finally {
              if (didErr)
                throw err
            }
          },
        }
      }

      function _unsupportedIterableToArray(o, minLen) {
        if (!o)
          return; if (typeof o === 'string')
          return _arrayLikeToArray(o, minLen); let n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor)
          n = o.constructor.name; if (n === 'Map' || n === 'Set')
          return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
          return _arrayLikeToArray(o, minLen)
      }

      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length)
          len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2
      }

      const DEFAULT_SCALE_VALUE = 'auto'
      exports.DEFAULT_SCALE_VALUE = DEFAULT_SCALE_VALUE
      const DEFAULT_SCALE = 1.0
      exports.DEFAULT_SCALE = DEFAULT_SCALE
      const DEFAULT_SCALE_DELTA = 1.1
      exports.DEFAULT_SCALE_DELTA = DEFAULT_SCALE_DELTA
      const MIN_SCALE = 0.1
      exports.MIN_SCALE = MIN_SCALE
      const MAX_SCALE = 10.0
      exports.MAX_SCALE = MAX_SCALE
      const UNKNOWN_SCALE = 0
      exports.UNKNOWN_SCALE = UNKNOWN_SCALE
      const MAX_AUTO_SCALE = 1.25
      exports.MAX_AUTO_SCALE = MAX_AUTO_SCALE
      const SCROLLBAR_PADDING = 40
      exports.SCROLLBAR_PADDING = SCROLLBAR_PADDING
      const VERTICAL_PADDING = 5
      exports.VERTICAL_PADDING = VERTICAL_PADDING
      const LOADINGBAR_END_OFFSET_VAR = '--loadingBar-end-offset'
      const RenderingStates = {
        INITIAL: 0,
        RUNNING: 1,
        PAUSED: 2,
        FINISHED: 3,
      }
      exports.RenderingStates = RenderingStates
      const PresentationModeState = {
        UNKNOWN: 0,
        NORMAL: 1,
        CHANGING: 2,
        FULLSCREEN: 3,
      }
      exports.PresentationModeState = PresentationModeState
      const SidebarView = {
        UNKNOWN: -1,
        NONE: 0,
        THUMBS: 1,
        OUTLINE: 2,
        ATTACHMENTS: 3,
        LAYERS: 4,
      }
      exports.SidebarView = SidebarView
      const RendererType = {
        CANVAS: 'canvas',
        SVG: 'svg',
      }
      exports.RendererType = RendererType
      const TextLayerMode = {
        DISABLE: 0,
        ENABLE: 1,
        ENABLE_ENHANCE: 2,
      }
      exports.TextLayerMode = TextLayerMode
      const ScrollMode = {
        UNKNOWN: -1,
        VERTICAL: 0,
        HORIZONTAL: 1,
        WRAPPED: 2,
        PAGE: 3,
      }
      exports.ScrollMode = ScrollMode
      const SpreadMode = {
        UNKNOWN: -1,
        NONE: 0,
        ODD: 1,
        EVEN: 2,
      }
      exports.SpreadMode = SpreadMode
      const AutoPrintRegExp = /\bprint\s*\(/
      exports.AutoPrintRegExp = AutoPrintRegExp

      function getOutputScale(ctx) {
        const devicePixelRatio = window.devicePixelRatio || 1
        const backingStoreRatio = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.backingStorePixelRatio || 1
        const pixelRatio = devicePixelRatio / backingStoreRatio
        return {
          sx: pixelRatio,
          sy: pixelRatio,
          scaled: pixelRatio !== 1,
        }
      }

      function scrollIntoView(element, spot) {
        const scrollMatches = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false
        let parent = element.offsetParent

        if (!parent) {
          console.error('offsetParent is not set -- cannot scroll')
          return
        }

        let offsetY = element.offsetTop + element.clientTop
        let offsetX = element.offsetLeft + element.clientLeft

        while (parent.clientHeight === parent.scrollHeight && parent.clientWidth === parent.scrollWidth || scrollMatches && (parent.classList.contains('markedContent') || getComputedStyle(parent).overflow === 'hidden')) {
          offsetY += parent.offsetTop
          offsetX += parent.offsetLeft
          parent = parent.offsetParent

          if (!parent) {
            return
          }
        }

        if (spot) {
          if (spot.top !== undefined) {
            offsetY += spot.top
          }

          if (spot.left !== undefined) {
            offsetX += spot.left
            parent.scrollLeft = offsetX
          }
        }

        parent.scrollTop = offsetY
      }

      function watchScroll(viewAreaElement, callback) {
        const debounceScroll = function debounceScroll(evt) {
          if (rAF) {
            return
          }

          rAF = window.requestAnimationFrame(() => {
            rAF = null
            const currentX = viewAreaElement.scrollLeft
            const lastX = state.lastX

            if (currentX !== lastX) {
              state.right = currentX > lastX
            }

            state.lastX = currentX
            const currentY = viewAreaElement.scrollTop
            const lastY = state.lastY

            if (currentY !== lastY) {
              state.down = currentY > lastY
            }

            state.lastY = currentY
            callback(state)
          })
        }

        var state = {
          right: true,
          down: true,
          lastX: viewAreaElement.scrollLeft,
          lastY: viewAreaElement.scrollTop,
          _eventHandler: debounceScroll,
        }
        var rAF = null
        viewAreaElement.addEventListener('scroll', debounceScroll, true)
        return state
      }

      function parseQueryString(query) {
        const params = new Map()

        const _iterator = _createForOfIteratorHelper(new URLSearchParams(query))
        let _step

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            const _step$value = _slicedToArray(_step.value, 2)
            const key = _step$value[0]
            const value = _step$value[1]

            params.set(key.toLowerCase(), value)
          }
        }
        catch (err) {
          _iterator.e(err)
        }
        finally {
          _iterator.f()
        }

        return params
      }

      function binarySearchFirstItem(items, condition) {
        let minIndex = 0
        let maxIndex = items.length - 1

        if (maxIndex < 0 || !condition(items[maxIndex])) {
          return items.length
        }

        if (condition(items[minIndex])) {
          return minIndex
        }

        while (minIndex < maxIndex) {
          const currentIndex = minIndex + maxIndex >> 1
          const currentItem = items[currentIndex]

          if (condition(currentItem)) {
            maxIndex = currentIndex
          }
          else {
            minIndex = currentIndex + 1
          }
        }

        return minIndex
      }

      function approximateFraction(x) {
        if (Math.floor(x) === x) {
          return [x, 1]
        }

        const xinv = 1 / x
        const limit = 8

        if (xinv > limit) {
          return [1, limit]
        }
        else if (Math.floor(xinv) === xinv) {
          return [1, xinv]
        }

        const x_ = x > 1 ? xinv : x
        let a = 0
        let b = 1
        let c = 1
        let d = 1

        while (true) {
          const p = a + c
          const q = b + d

          if (q > limit) {
            break
          }

          if (x_ <= p / q) {
            c = p
            d = q
          }
          else {
            a = p
            b = q
          }
        }

        let result

        if (x_ - a / b < c / d - x_) {
          result = x_ === x ? [a, b] : [b, a]
        }
        else {
          result = x_ === x ? [c, d] : [d, c]
        }

        return result
      }

      function roundToDivide(x, div) {
        const r = x % div
        return r === 0 ? x : Math.round(x - r + div)
      }

      function getPageSizeInches(_ref) {
        const view = _ref.view
        const userUnit = _ref.userUnit
        const rotate = _ref.rotate

        const _view = _slicedToArray(view, 4)
        const x1 = _view[0]
        const y1 = _view[1]
        const x2 = _view[2]
        const y2 = _view[3]

        const changeOrientation = rotate % 180 !== 0
        const width = (x2 - x1) / 72 * userUnit
        const height = (y2 - y1) / 72 * userUnit
        return {
          width: changeOrientation ? height : width,
          height: changeOrientation ? width : height,
        }
      }

      function backtrackBeforeAllVisibleElements(index, views, top) {
        if (index < 2) {
          return index
        }

        let elt = views[index].div
        let pageTop = elt.offsetTop + elt.clientTop

        if (pageTop >= top) {
          elt = views[index - 1].div
          pageTop = elt.offsetTop + elt.clientTop
        }

        for (let i = index - 2; i >= 0; --i) {
          elt = views[i].div

          if (elt.offsetTop + elt.clientTop + elt.clientHeight <= pageTop) {
            break
          }

          index = i
        }

        return index
      }

      function getVisibleElements(_ref2) {
        const scrollEl = _ref2.scrollEl
        const views = _ref2.views
        const _ref2$sortByVisibilit = _ref2.sortByVisibility
        const sortByVisibility = _ref2$sortByVisibilit === void 0 ? false : _ref2$sortByVisibilit
        const _ref2$horizontal = _ref2.horizontal
        const horizontal = _ref2$horizontal === void 0 ? false : _ref2$horizontal
        const _ref2$rtl = _ref2.rtl
        const rtl = _ref2$rtl === void 0 ? false : _ref2$rtl
        const top = scrollEl.scrollTop
        const bottom = top + scrollEl.clientHeight
        const left = scrollEl.scrollLeft
        const right = left + scrollEl.clientWidth

        function isElementBottomAfterViewTop(view) {
          const element = view.div
          const elementBottom = element.offsetTop + element.clientTop + element.clientHeight
          return elementBottom > top
        }

        function isElementNextAfterViewHorizontally(view) {
          const element = view.div
          const elementLeft = element.offsetLeft + element.clientLeft
          const elementRight = elementLeft + element.clientWidth
          return rtl ? elementLeft < right : elementRight > left
        }

        const visible = []
        const ids = new Set()
        const numViews = views.length
        let firstVisibleElementInd = binarySearchFirstItem(views, horizontal ? isElementNextAfterViewHorizontally : isElementBottomAfterViewTop)

        if (firstVisibleElementInd > 0 && firstVisibleElementInd < numViews && !horizontal) {
          firstVisibleElementInd = backtrackBeforeAllVisibleElements(firstVisibleElementInd, views, top)
        }

        let lastEdge = horizontal ? right : -1

        for (let i = firstVisibleElementInd; i < numViews; i++) {
          const view = views[i]
          const element = view.div
          const currentWidth = element.offsetLeft + element.clientLeft
          const currentHeight = element.offsetTop + element.clientTop
          const viewWidth = element.clientWidth
          const viewHeight = element.clientHeight
          const viewRight = currentWidth + viewWidth
          const viewBottom = currentHeight + viewHeight

          if (lastEdge === -1) {
            if (viewBottom >= bottom) {
              lastEdge = viewBottom
            }
          }
          else if ((horizontal ? currentWidth : currentHeight) > lastEdge) {
            break
          }

          if (viewBottom <= top || currentHeight >= bottom || viewRight <= left || currentWidth >= right) {
            continue
          }

          const hiddenHeight = Math.max(0, top - currentHeight) + Math.max(0, viewBottom - bottom)
          const hiddenWidth = Math.max(0, left - currentWidth) + Math.max(0, viewRight - right)
          const fractionHeight = (viewHeight - hiddenHeight) / viewHeight
          const fractionWidth = (viewWidth - hiddenWidth) / viewWidth
          const percent = fractionHeight * fractionWidth * 100 | 0
          visible.push({
            id: view.id,
            x: currentWidth,
            y: currentHeight,
            view,
            percent,
            widthPercent: fractionWidth * 100 | 0,
          })
          ids.add(view.id)
        }

        const first = visible[0]
        const last = visible[visible.length - 1]

        if (sortByVisibility) {
          visible.sort((a, b) => {
            const pc = a.percent - b.percent

            if (Math.abs(pc) > 0.001) {
              return -pc
            }

            return a.id - b.id
          })
        }

        return {
          first,
          last,
          views: visible,
          ids,
        }
      }

      function noContextMenuHandler(evt) {
        evt.preventDefault()
      }

      function normalizeWheelEventDirection(evt) {
        let delta = Math.hypot(evt.deltaX, evt.deltaY)
        const angle = Math.atan2(evt.deltaY, evt.deltaX)

        if (-0.25 * Math.PI < angle && angle < 0.75 * Math.PI) {
          delta = -delta
        }

        return delta
      }

      function normalizeWheelEventDelta(evt) {
        let delta = normalizeWheelEventDirection(evt)
        const MOUSE_DOM_DELTA_PIXEL_MODE = 0
        const MOUSE_DOM_DELTA_LINE_MODE = 1
        const MOUSE_PIXELS_PER_LINE = 30
        const MOUSE_LINES_PER_PAGE = 30

        if (evt.deltaMode === MOUSE_DOM_DELTA_PIXEL_MODE) {
          delta /= MOUSE_PIXELS_PER_LINE * MOUSE_LINES_PER_PAGE
        }
        else if (evt.deltaMode === MOUSE_DOM_DELTA_LINE_MODE) {
          delta /= MOUSE_LINES_PER_PAGE
        }

        return delta
      }

      function isValidRotation(angle) {
        return Number.isInteger(angle) && angle % 90 === 0
      }

      function isValidScrollMode(mode) {
        return Number.isInteger(mode) && Object.values(ScrollMode).includes(mode) && mode !== ScrollMode.UNKNOWN
      }

      function isValidSpreadMode(mode) {
        return Number.isInteger(mode) && Object.values(SpreadMode).includes(mode) && mode !== SpreadMode.UNKNOWN
      }

      function isPortraitOrientation(size) {
        return size.width <= size.height
      }

      const animationStarted = new Promise((resolve) => {
        window.requestAnimationFrame(resolve)
      })
      exports.animationStarted = animationStarted

      function clamp(v, min, max) {
        return Math.min(Math.max(v, min), max)
      }

      const ProgressBar = /* #__PURE__ */(function () {
        function ProgressBar(id) {
          const _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
          const height = _ref3.height
          const width = _ref3.width
          const units = _ref3.units

          _classCallCheck(this, ProgressBar)

          this.visible = true
          this.div = document.querySelector(`${id} .progress`)
          this.bar = this.div.parentNode
          this.height = height || 100
          this.width = width || 100
          this.units = units || '%'
          this.div.style.height = this.height + this.units
          this.percent = 0
        }

        _createClass(ProgressBar, [{
          key: '_updateBar',
          value: function _updateBar() {
            if (this._indeterminate) {
              this.div.classList.add('indeterminate')
              this.div.style.width = this.width + this.units
              return
            }

            this.div.classList.remove('indeterminate')
            const progressSize = this.width * this._percent / 100
            this.div.style.width = progressSize + this.units
          },
        }, {
          key: 'percent',
          get: function get() {
            return this._percent
          },
          set: function set(val) {
            this._indeterminate = isNaN(val)
            this._percent = clamp(val, 0, 100)

            this._updateBar()
          },
        }, {
          key: 'setWidth',
          value: function setWidth(viewer) {
            if (!viewer) {
              return
            }

            const container = viewer.parentNode
            const scrollbarWidth = container.offsetWidth - viewer.offsetWidth

            if (scrollbarWidth > 0) {
              const doc = document.documentElement
              doc.style.setProperty(LOADINGBAR_END_OFFSET_VAR, ''.concat(scrollbarWidth, 'px'))
            }
          },
        }, {
          key: 'hide',
          value: function hide() {
            if (!this.visible) {
              return
            }

            this.visible = false
            this.bar.classList.add('hidden')
          },
        }, {
          key: 'show',
          value: function show() {
            if (this.visible) {
              return
            }

            this.visible = true
            this.bar.classList.remove('hidden')
          },
        }])

        return ProgressBar
      }())

      exports.ProgressBar = ProgressBar

      function getActiveOrFocusedElement() {
        let curRoot = document
        let curActiveOrFocused = curRoot.activeElement || curRoot.querySelector(':focus')

        while ((_curActiveOrFocused = curActiveOrFocused) !== null && _curActiveOrFocused !== void 0 && _curActiveOrFocused.shadowRoot) {
          var _curActiveOrFocused

          curRoot = curActiveOrFocused.shadowRoot
          curActiveOrFocused = curRoot.activeElement || curRoot.querySelector(':focus')
        }

        return curActiveOrFocused
      }

      function apiPageLayoutToViewerModes(layout) {
        let scrollMode = ScrollMode.VERTICAL
        let spreadMode = SpreadMode.NONE

        switch (layout) {
          case 'SinglePage':
            scrollMode = ScrollMode.PAGE
            break

          case 'OneColumn':
            break

          case 'TwoPageLeft':
            scrollMode = ScrollMode.PAGE

          case 'TwoColumnLeft':
            spreadMode = SpreadMode.ODD
            break

          case 'TwoPageRight':
            scrollMode = ScrollMode.PAGE

          case 'TwoColumnRight':
            spreadMode = SpreadMode.EVEN
            break
        }

        return {
          scrollMode,
          spreadMode,
        }
      }

      function apiPageModeToSidebarView(mode) {
        switch (mode) {
          case 'UseNone':
            return SidebarView.NONE

          case 'UseThumbs':
            return SidebarView.THUMBS

          case 'UseOutlines':
            return SidebarView.OUTLINE

          case 'UseAttachments':
            return SidebarView.ATTACHMENTS

          case 'UseOC':
            return SidebarView.LAYERS
        }

        return SidebarView.NONE
      }

      /***/
    },
    /* 6 */
    /***/ (__unused_webpack_module, exports) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.WaitOnType = exports.EventBus = exports.AutomationEventBus = void 0
      exports.waitOnEventOrTimeout = waitOnEventOrTimeout

      function _inherits(subClass, superClass) {
        if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function') } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass)
          _setPrototypeOf(subClass, superClass)
      }

      function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o }; return _setPrototypeOf(o, p) }

      function _createSuper(Derived) {
        const hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() {
          const Super = _getPrototypeOf(Derived); let result; if (hasNativeReflectConstruct) { const NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget) }
          else { result = Super.apply(this, arguments) } return _possibleConstructorReturn(this, result)
        }
      }

      function _possibleConstructorReturn(self, call) {
        if (call && (_typeof(call) === 'object' || typeof call === 'function')) { return call }
        else if (call !== void 0) { throw new TypeError('Derived constructors may only return object or undefined') } return _assertThisInitialized(self)
      }

      function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called') } return self }

      function _isNativeReflectConstruct() {
        if (typeof Reflect === 'undefined' || !Reflect.construct)
          return false; if (Reflect.construct.sham)
          return false; if (typeof Proxy === 'function')
          return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], () => { })); return true }
        catch (e) { return false }
      }

      function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o) }; return _getPrototypeOf(o) }

      function _createForOfIteratorHelper(o, allowArrayLike) {
        let it = typeof Symbol !== 'undefined' && o[Symbol.iterator] || o['@@iterator']; if (!it) {
          if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === 'number') {
            if (it)
              o = it; let i = 0; const F = function F() { }; return {
                s: F,
                n: function n() {
                  if (i >= o.length)
                    return { done: true }; return { done: false, value: o[i++] }
                },
                e: function e(_e) { throw _e },
                f: F,
              }
          } throw new TypeError('Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.')
        } let normalCompletion = true; let didErr = false; let err; return {
          s: function s() { it = it.call(o) },
          n: function n() { const step = it.next(); normalCompletion = step.done; return step },
          e: function e(_e2) { didErr = true; err = _e2 },
          f: function f() {
            try {
              if (!normalCompletion && it.return != null)
                it.return()
            }
            finally {
              if (didErr)
                throw err
            }
          },
        }
      }

      function _unsupportedIterableToArray(o, minLen) {
        if (!o)
          return; if (typeof o === 'string')
          return _arrayLikeToArray(o, minLen); let n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor)
          n = o.constructor.name; if (n === 'Map' || n === 'Set')
          return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
          return _arrayLikeToArray(o, minLen)
      }

      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length)
          len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2
      }

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      function _typeof(obj) {
        '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof(obj) { return typeof obj } }
        else { _typeof = function _typeof(obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj)
      }

      const WaitOnType = {
        EVENT: 'event',
        TIMEOUT: 'timeout',
      }
      exports.WaitOnType = WaitOnType

      function waitOnEventOrTimeout(_ref) {
        const target = _ref.target
        const name = _ref.name
        const _ref$delay = _ref.delay
        const delay = _ref$delay === void 0 ? 0 : _ref$delay
        return new Promise((resolve, reject) => {
          if (_typeof(target) !== 'object' || !(name && typeof name === 'string') || !(Number.isInteger(delay) && delay >= 0)) {
            throw new Error('waitOnEventOrTimeout - invalid parameters.')
          }

          function handler(type) {
            if (target instanceof EventBus) {
              target._off(name, eventHandler)
            }
            else {
              target.removeEventListener(name, eventHandler)
            }

            if (timeout) {
              clearTimeout(timeout)
            }

            resolve(type)
          }

          var eventHandler = handler.bind(null, WaitOnType.EVENT)

          if (target instanceof EventBus) {
            target._on(name, eventHandler)
          }
          else {
            target.addEventListener(name, eventHandler)
          }

          const timeoutHandler = handler.bind(null, WaitOnType.TIMEOUT)
          var timeout = setTimeout(timeoutHandler, delay)
        })
      }

      var EventBus = /* #__PURE__ */(function () {
        function EventBus() {
          _classCallCheck(this, EventBus)

          this._listeners = Object.create(null)
        }

        _createClass(EventBus, [{
          key: 'on',
          value: function on(eventName, listener) {
            const options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null

            this._on(eventName, listener, {
              external: true,
              once: options === null || options === void 0 ? void 0 : options.once,
            })
          },
        }, {
          key: 'off',
          value: function off(eventName, listener) {
            const options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null

            this._off(eventName, listener, {
              external: true,
              once: options === null || options === void 0 ? void 0 : options.once,
            })
          },
        }, {
          key: 'dispatch',
          value: function dispatch(eventName, data) {
            const eventListeners = this._listeners[eventName]

            if (!eventListeners || eventListeners.length === 0) {
              return
            }

            let externalListeners

            const _iterator = _createForOfIteratorHelper(eventListeners.slice(0))
            let _step

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                const _step$value = _step.value
                const _listener = _step$value.listener
                const external = _step$value.external
                const once = _step$value.once

                if (once) {
                  this._off(eventName, _listener)
                }

                if (external) {
                  (externalListeners || (externalListeners = [])).push(_listener)
                  continue
                }

                _listener(data)
              }
            }
            catch (err) {
              _iterator.e(err)
            }
            finally {
              _iterator.f()
            }

            if (externalListeners) {
              const _iterator2 = _createForOfIteratorHelper(externalListeners)
              let _step2

              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  const listener = _step2.value
                  listener(data)
                }
              }
              catch (err) {
                _iterator2.e(err)
              }
              finally {
                _iterator2.f()
              }

              externalListeners = null
            }
          },
        }, {
          key: '_on',
          value: function _on(eventName, listener) {
            let _this$_listeners

            const options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null
            const eventListeners = (_this$_listeners = this._listeners)[eventName] || (_this$_listeners[eventName] = [])
            eventListeners.push({
              listener,
              external: (options === null || options === void 0 ? void 0 : options.external) === true,
              once: (options === null || options === void 0 ? void 0 : options.once) === true,
            })
          },
        }, {
          key: '_off',
          value: function _off(eventName, listener) {
            const options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null
            const eventListeners = this._listeners[eventName]

            if (!eventListeners) {
              return
            }

            for (let i = 0, ii = eventListeners.length; i < ii; i++) {
              if (eventListeners[i].listener === listener) {
                eventListeners.splice(i, 1)
                return
              }
            }
          },
        }])

        return EventBus
      }())

      exports.EventBus = EventBus

      const AutomationEventBus = /* #__PURE__ */(function (_EventBus) {
        _inherits(AutomationEventBus, _EventBus)

        const _super = _createSuper(AutomationEventBus)

        function AutomationEventBus() {
          _classCallCheck(this, AutomationEventBus)

          return _super.apply(this, arguments)
        }

        _createClass(AutomationEventBus, [{
          key: 'dispatch',
          value: function dispatch(eventName, data) {
            throw new Error('Not implemented: AutomationEventBus.dispatch')
          },
        }])

        return AutomationEventBus
      }(EventBus))

      exports.AutomationEventBus = AutomationEventBus

      /***/
    },
    /* 7 */
    /***/ (module) => {
      let pdfjsLib

      if (typeof window !== 'undefined' && window['pdfjs-dist/build/pdf']) {
        pdfjsLib = window['pdfjs-dist/build/pdf']
      }
      else {
        pdfjsLib = require('../build/pdf.js')
      }

      module.exports = pdfjsLib

      /***/
    },
    /* 8 */
    /***/ (__unused_webpack_module, exports, __webpack_require__) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.PDFCursorTools = exports.CursorTool = void 0

      const _grab_to_pan = __webpack_require__(9)

      const _ui_utils = __webpack_require__(5)

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      const CursorTool = {
        SELECT: 0,
        HAND: 1,
        ZOOM: 2,
      }
      exports.CursorTool = CursorTool

      const PDFCursorTools = /* #__PURE__ */(function () {
        function PDFCursorTools(_ref) {
          const _this = this

          const container = _ref.container
          const eventBus = _ref.eventBus
          const _ref$cursorToolOnLoad = _ref.cursorToolOnLoad
          const cursorToolOnLoad = _ref$cursorToolOnLoad === void 0 ? CursorTool.SELECT : _ref$cursorToolOnLoad

          _classCallCheck(this, PDFCursorTools)

          this.container = container
          this.eventBus = eventBus
          this.active = CursorTool.SELECT
          this.activeBeforePresentationMode = null
          this.handTool = new _grab_to_pan.GrabToPan({
            element: this.container,
          })

          this._addEventListeners()

          Promise.resolve().then(() => {
            _this.switchTool(cursorToolOnLoad)
          })
        }

        _createClass(PDFCursorTools, [{
          key: 'activeTool',
          get: function get() {
            return this.active
          },
        }, {
          key: 'switchTool',
          value: function switchTool(tool) {
            const _this2 = this

            if (this.activeBeforePresentationMode !== null) {
              return
            }

            if (tool === this.active) {
              return
            }

            const disableActiveTool = function disableActiveTool() {
              switch (_this2.active) {
                case CursorTool.SELECT:
                  break

                case CursorTool.HAND:
                  _this2.handTool.deactivate()

                  break

                case CursorTool.ZOOM:
              }
            }

            switch (tool) {
              case CursorTool.SELECT:
                disableActiveTool()
                break

              case CursorTool.HAND:
                disableActiveTool()
                this.handTool.activate()
                break

              case CursorTool.ZOOM:
              default:
                console.error('switchTool: "'.concat(tool, '" is an unsupported value.'))
                return
            }

            this.active = tool

            this._dispatchEvent()
          },
        }, {
          key: '_dispatchEvent',
          value: function _dispatchEvent() {
            this.eventBus.dispatch('cursortoolchanged', {
              source: this,
              tool: this.active,
            })
          },
        }, {
          key: '_addEventListeners',
          value: function _addEventListeners() {
            const _this3 = this

            this.eventBus._on('switchcursortool', (evt) => {
              _this3.switchTool(evt.tool)
            })

            this.eventBus._on('presentationmodechanged', (evt) => {
              switch (evt.state) {
                case _ui_utils.PresentationModeState.FULLSCREEN:
                  {
                    const previouslyActive = _this3.active

                    _this3.switchTool(CursorTool.SELECT)

                    _this3.activeBeforePresentationMode = previouslyActive
                    break
                  }

                case _ui_utils.PresentationModeState.NORMAL:
                  {
                    const _previouslyActive = _this3.activeBeforePresentationMode
                    _this3.activeBeforePresentationMode = null

                    _this3.switchTool(_previouslyActive)

                    break
                  }
              }
            })
          },
        }])

        return PDFCursorTools
      }())

      exports.PDFCursorTools = PDFCursorTools

      /***/
    },
    /* 9 */
    /***/ (__unused_webpack_module, exports) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.GrabToPan = void 0

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj) }

      function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError('Cannot initialize the same private elements twice on an object') } }

      function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError('attempted to get private field on non-instance') } return fn }

      const CSS_CLASS_GRAB = 'grab-to-pan-grab'

      const _onMouseDown = /* #__PURE__ */new WeakSet()

      const _onMouseMove = /* #__PURE__ */new WeakSet()

      const _endPan = /* #__PURE__ */new WeakSet()

      const GrabToPan = /* #__PURE__ */(function () {
        function GrabToPan(options) {
          _classCallCheck(this, GrabToPan)

          _classPrivateMethodInitSpec(this, _endPan)

          _classPrivateMethodInitSpec(this, _onMouseMove)

          _classPrivateMethodInitSpec(this, _onMouseDown)

          this.element = options.element
          this.document = options.element.ownerDocument

          if (typeof options.ignoreTarget === 'function') {
            this.ignoreTarget = options.ignoreTarget
          }

          this.onActiveChanged = options.onActiveChanged
          this.activate = this.activate.bind(this)
          this.deactivate = this.deactivate.bind(this)
          this.toggle = this.toggle.bind(this)
          this._onMouseDown = _classPrivateMethodGet(this, _onMouseDown, _onMouseDown2).bind(this)
          this._onMouseMove = _classPrivateMethodGet(this, _onMouseMove, _onMouseMove2).bind(this)
          this._endPan = _classPrivateMethodGet(this, _endPan, _endPan2).bind(this)
          const overlay = this.overlay = document.createElement('div')
          overlay.className = 'grab-to-pan-grabbing'
        }

        _createClass(GrabToPan, [{
          key: 'activate',
          value: function activate() {
            if (!this.active) {
              let _this$onActiveChanged

              this.active = true
              this.element.addEventListener('mousedown', this._onMouseDown, true)
              this.element.classList.add(CSS_CLASS_GRAB);
              (_this$onActiveChanged = this.onActiveChanged) === null || _this$onActiveChanged === void 0 ? void 0 : _this$onActiveChanged.call(this, true)
            }
          },
        }, {
          key: 'deactivate',
          value: function deactivate() {
            if (this.active) {
              let _this$onActiveChanged2

              this.active = false
              this.element.removeEventListener('mousedown', this._onMouseDown, true)

              this._endPan()

              this.element.classList.remove(CSS_CLASS_GRAB);
              (_this$onActiveChanged2 = this.onActiveChanged) === null || _this$onActiveChanged2 === void 0 ? void 0 : _this$onActiveChanged2.call(this, false)
            }
          },
        }, {
          key: 'toggle',
          value: function toggle() {
            if (this.active) {
              this.deactivate()
            }
            else {
              this.activate()
            }
          },
        }, {
          key: 'ignoreTarget',
          value: function ignoreTarget(node) {
            return node.matches('a[href], a[href] *, input, textarea, button, button *, select, option')
          },
        }])

        return GrabToPan
      }())

      exports.GrabToPan = GrabToPan

      function _onMouseDown2(event) {
        if (event.button !== 0 || this.ignoreTarget(event.target)) {
          return
        }

        if (event.originalTarget) {
          try {
            event.originalTarget.tagName
          }
          catch (e) {
            return
          }
        }

        this.scrollLeftStart = this.element.scrollLeft
        this.scrollTopStart = this.element.scrollTop
        this.clientXStart = event.clientX
        this.clientYStart = event.clientY
        this.document.addEventListener('mousemove', this._onMouseMove, true)
        this.document.addEventListener('mouseup', this._endPan, true)
        this.element.addEventListener('scroll', this._endPan, true)
        event.preventDefault()
        event.stopPropagation()
        const focusedElement = document.activeElement

        if (focusedElement && !focusedElement.contains(event.target)) {
          focusedElement.blur()
        }
      }

      function _onMouseMove2(event) {
        this.element.removeEventListener('scroll', this._endPan, true)

        if (!(event.buttons & 1)) {
          this._endPan()

          return
        }

        const xDiff = event.clientX - this.clientXStart
        const yDiff = event.clientY - this.clientYStart
        const scrollTop = this.scrollTopStart - yDiff
        const scrollLeft = this.scrollLeftStart - xDiff

        if (this.element.scrollTo) {
          this.element.scrollTo({
            top: scrollTop,
            left: scrollLeft,
            behavior: 'instant',
          })
        }
        else {
          this.element.scrollTop = scrollTop
          this.element.scrollLeft = scrollLeft
        }

        if (!this.overlay.parentNode) {
          document.body.appendChild(this.overlay)
        }
      }

      function _endPan2() {
        this.element.removeEventListener('scroll', this._endPan, true)
        this.document.removeEventListener('mousemove', this._onMouseMove, true)
        this.document.removeEventListener('mouseup', this._endPan, true)
        this.overlay.remove()
      }

      /***/
    },
    /* 10 */
    /***/ (__unused_webpack_module, exports, __webpack_require__) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.OverlayManager = void 0

      const _regenerator = _interopRequireDefault(__webpack_require__(3))

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj } }

      function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
        try { var info = gen[key](arg); var value = info.value }
        catch (error) { reject(error); return } if (info.done) { resolve(value) }
        else { Promise.resolve(value).then(_next, _throw) }
      }

      function _asyncToGenerator(fn) { return function () { const self = this; const args = arguments; return new Promise((resolve, reject) => { const gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value) } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err) } _next(undefined) }) } }

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      const OverlayManager = /* #__PURE__ */(function () {
        function OverlayManager() {
          _classCallCheck(this, OverlayManager)

          this._overlays = {}
          this._active = null
          this._keyDownBound = this._keyDown.bind(this)
        }

        _createClass(OverlayManager, [{
          key: 'active',
          get: function get() {
            return this._active
          },
        }, {
          key: 'register',
          value: (function () {
            const _register = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee(name, element) {
              let callerCloseMethod
              let canForceClose
              let container
              const _args = arguments
              return _regenerator.default.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      callerCloseMethod = _args.length > 2 && _args[2] !== undefined ? _args[2] : null
                      canForceClose = _args.length > 3 && _args[3] !== undefined ? _args[3] : false

                      if (!(!name || !element || !(container = element.parentNode))) {
                        _context.next = 6
                        break
                      }

                      throw new Error('Not enough parameters.')

                    case 6:
                      if (!this._overlays[name]) {
                        _context.next = 8
                        break
                      }

                      throw new Error('The overlay is already registered.')

                    case 8:
                      this._overlays[name] = {
                        element,
                        container,
                        callerCloseMethod,
                        canForceClose,
                      }

                    case 9:
                    case 'end':
                      return _context.stop()
                  }
                }
              }, _callee, this)
            }))

            function register(_x, _x2) {
              return _register.apply(this, arguments)
            }

            return register
          }()),
        }, {
          key: 'unregister',
          value: (function () {
            const _unregister = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee2(name) {
              return _regenerator.default.wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      if (this._overlays[name]) {
                        _context2.next = 4
                        break
                      }

                      throw new Error('The overlay does not exist.')

                    case 4:
                      if (!(this._active === name)) {
                        _context2.next = 6
                        break
                      }

                      throw new Error('The overlay cannot be removed while it is active.')

                    case 6:
                      delete this._overlays[name]

                    case 7:
                    case 'end':
                      return _context2.stop()
                  }
                }
              }, _callee2, this)
            }))

            function unregister(_x3) {
              return _unregister.apply(this, arguments)
            }

            return unregister
          }()),
        }, {
          key: 'open',
          value: (function () {
            const _open = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee3(name) {
              return _regenerator.default.wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      if (this._overlays[name]) {
                        _context3.next = 4
                        break
                      }

                      throw new Error('The overlay does not exist.')

                    case 4:
                      if (!this._active) {
                        _context3.next = 14
                        break
                      }

                      if (!this._overlays[name].canForceClose) {
                        _context3.next = 9
                        break
                      }

                      this._closeThroughCaller()

                      _context3.next = 14
                      break

                    case 9:
                      if (!(this._active === name)) {
                        _context3.next = 13
                        break
                      }

                      throw new Error('The overlay is already active.')

                    case 13:
                      throw new Error('Another overlay is currently active.')

                    case 14:
                      this._active = name

                      this._overlays[this._active].element.classList.remove('hidden')

                      this._overlays[this._active].container.classList.remove('hidden')

                      window.addEventListener('keydown', this._keyDownBound)

                    case 18:
                    case 'end':
                      return _context3.stop()
                  }
                }
              }, _callee3, this)
            }))

            function open(_x4) {
              return _open.apply(this, arguments)
            }

            return open
          }()),
        }, {
          key: 'close',
          value: (function () {
            const _close = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee4(name) {
              return _regenerator.default.wrap(function _callee4$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      if (this._overlays[name]) {
                        _context4.next = 4
                        break
                      }

                      throw new Error('The overlay does not exist.')

                    case 4:
                      if (this._active) {
                        _context4.next = 8
                        break
                      }

                      throw new Error('The overlay is currently not active.')

                    case 8:
                      if (!(this._active !== name)) {
                        _context4.next = 10
                        break
                      }

                      throw new Error('Another overlay is currently active.')

                    case 10:
                      this._overlays[this._active].container.classList.add('hidden')

                      this._overlays[this._active].element.classList.add('hidden')

                      this._active = null
                      window.removeEventListener('keydown', this._keyDownBound)

                    case 14:
                    case 'end':
                      return _context4.stop()
                  }
                }
              }, _callee4, this)
            }))

            function close(_x5) {
              return _close.apply(this, arguments)
            }

            return close
          }()),
        }, {
          key: '_keyDown',
          value: function _keyDown(evt) {
            if (this._active && evt.keyCode === 27) {
              this._closeThroughCaller()

              evt.preventDefault()
            }
          },
        }, {
          key: '_closeThroughCaller',
          value: function _closeThroughCaller() {
            if (this._overlays[this._active].callerCloseMethod) {
              this._overlays[this._active].callerCloseMethod()
            }

            if (this._active) {
              this.close(this._active)
            }
          },
        }])

        return OverlayManager
      }())

      exports.OverlayManager = OverlayManager

      /***/
    },
    /* 11 */
    /***/ (__unused_webpack_module, exports, __webpack_require__) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.PasswordPrompt = void 0

      const _regenerator = _interopRequireDefault(__webpack_require__(3))

      const _pdfjsLib = __webpack_require__(7)

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj } }

      function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
        try { var info = gen[key](arg); var value = info.value }
        catch (error) { reject(error); return } if (info.done) { resolve(value) }
        else { Promise.resolve(value).then(_next, _throw) }
      }

      function _asyncToGenerator(fn) { return function () { const self = this; const args = arguments; return new Promise((resolve, reject) => { const gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value) } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err) } _next(undefined) }) } }

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      const PasswordPrompt = /* #__PURE__ */(function () {
        function PasswordPrompt(options, overlayManager, l10n) {
          const _this = this

          const isViewerEmbedded = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false

          _classCallCheck(this, PasswordPrompt)

          this.overlayName = options.overlayName
          this.container = options.container
          this.label = options.label
          this.input = options.input
          this.submitButton = options.submitButton
          this.cancelButton = options.cancelButton
          this.overlayManager = overlayManager
          this.l10n = l10n
          this._isViewerEmbedded = isViewerEmbedded
          this.updateCallback = null
          this.reason = null
          this.submitButton.addEventListener('click', this.verify.bind(this))
          this.cancelButton.addEventListener('click', this.close.bind(this))
          this.input.addEventListener('keydown', (e) => {
            if (e.keyCode === 13) {
              _this.verify()
            }
          })
          this.overlayManager.register(this.overlayName, this.container, this.close.bind(this), true)
        }

        _createClass(PasswordPrompt, [{
          key: 'open',
          value: (function () {
            const _open = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee() {
              let passwordIncorrect
              return _regenerator.default.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2
                      return this.overlayManager.open(this.overlayName)

                    case 2:
                      passwordIncorrect = this.reason === _pdfjsLib.PasswordResponses.INCORRECT_PASSWORD

                      if (!this._isViewerEmbedded || passwordIncorrect) {
                        this.input.focus()
                      }

                      _context.next = 6
                      return this.l10n.get('password_'.concat(passwordIncorrect ? 'invalid' : 'label'))

                    case 6:
                      this.label.textContent = _context.sent

                    case 7:
                    case 'end':
                      return _context.stop()
                  }
                }
              }, _callee, this)
            }))

            function open() {
              return _open.apply(this, arguments)
            }

            return open
          }()),
        }, {
          key: 'close',
          value: function close() {
            const _this2 = this

            this.overlayManager.close(this.overlayName).then(() => {
              _this2.input.value = ''
            })
          },
        }, {
          key: 'verify',
          value: function verify() {
            const password = this.input.value

            if ((password === null || password === void 0 ? void 0 : password.length) > 0) {
              this.close()
              this.updateCallback(password)
            }
          },
        }, {
          key: 'setUpdateCallback',
          value: function setUpdateCallback(updateCallback, reason) {
            this.updateCallback = updateCallback
            this.reason = reason
          },
        }])

        return PasswordPrompt
      }())

      exports.PasswordPrompt = PasswordPrompt

      /***/
    },
    /* 12 */
    /***/ (__unused_webpack_module, exports, __webpack_require__) => {
      function _typeof(obj) {
        '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof(obj) { return typeof obj } }
        else { _typeof = function _typeof(obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj)
      }

      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.PDFAttachmentViewer = void 0

      const _pdfjsLib = __webpack_require__(7)

      const _base_tree_viewer = __webpack_require__(13)

      function _createForOfIteratorHelper(o, allowArrayLike) {
        let it = typeof Symbol !== 'undefined' && o[Symbol.iterator] || o['@@iterator']; if (!it) {
          if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === 'number') {
            if (it)
              o = it; let i = 0; const F = function F() { }; return {
                s: F,
                n: function n() {
                  if (i >= o.length)
                    return { done: true }; return { done: false, value: o[i++] }
                },
                e: function e(_e) { throw _e },
                f: F,
              }
          } throw new TypeError('Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.')
        } let normalCompletion = true; let didErr = false; let err; return {
          s: function s() { it = it.call(o) },
          n: function n() { const step = it.next(); normalCompletion = step.done; return step },
          e: function e(_e2) { didErr = true; err = _e2 },
          f: function f() {
            try {
              if (!normalCompletion && it.return != null)
                it.return()
            }
            finally {
              if (didErr)
                throw err
            }
          },
        }
      }

      function _unsupportedIterableToArray(o, minLen) {
        if (!o)
          return; if (typeof o === 'string')
          return _arrayLikeToArray(o, minLen); let n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor)
          n = o.constructor.name; if (n === 'Map' || n === 'Set')
          return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
          return _arrayLikeToArray(o, minLen)
      }

      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length)
          len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2
      }

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      function _get(target, property, receiver) {
        if (typeof Reflect !== 'undefined' && Reflect.get) { _get = Reflect.get }
        else {
          _get = function _get(target, property, receiver) {
            const base = _superPropBase(target, property); if (!base)
              return; const desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver) } return desc.value
          }
        } return _get(target, property, receiver || target)
      }

      function _superPropBase(object, property) {
        while (!Object.prototype.hasOwnProperty.call(object, property)) {
          object = _getPrototypeOf(object); if (object === null)
            break
        } return object
      }

      function _inherits(subClass, superClass) {
        if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function') } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass)
          _setPrototypeOf(subClass, superClass)
      }

      function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o }; return _setPrototypeOf(o, p) }

      function _createSuper(Derived) {
        const hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() {
          const Super = _getPrototypeOf(Derived); let result; if (hasNativeReflectConstruct) { const NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget) }
          else { result = Super.apply(this, arguments) } return _possibleConstructorReturn(this, result)
        }
      }

      function _possibleConstructorReturn(self, call) {
        if (call && (_typeof(call) === 'object' || typeof call === 'function')) { return call }
        else if (call !== void 0) { throw new TypeError('Derived constructors may only return object or undefined') } return _assertThisInitialized(self)
      }

      function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called') } return self }

      function _isNativeReflectConstruct() {
        if (typeof Reflect === 'undefined' || !Reflect.construct)
          return false; if (Reflect.construct.sham)
          return false; if (typeof Proxy === 'function')
          return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], () => { })); return true }
        catch (e) { return false }
      }

      function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o) }; return _getPrototypeOf(o) }

      const PDFAttachmentViewer = /* #__PURE__ */(function (_BaseTreeViewer) {
        _inherits(PDFAttachmentViewer, _BaseTreeViewer)

        const _super = _createSuper(PDFAttachmentViewer)

        function PDFAttachmentViewer(options) {
          let _this

          _classCallCheck(this, PDFAttachmentViewer)

          _this = _super.call(this, options)
          _this.downloadManager = options.downloadManager

          _this.eventBus._on('fileattachmentannotation', _this._appendAttachment.bind(_assertThisInitialized(_this)))

          return _this
        }

        _createClass(PDFAttachmentViewer, [{
          key: 'reset',
          value: function reset() {
            const keepRenderedCapability = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false

            _get(_getPrototypeOf(PDFAttachmentViewer.prototype), 'reset', this).call(this)

            this._attachments = null

            if (!keepRenderedCapability) {
              this._renderedCapability = (0, _pdfjsLib.createPromiseCapability)()
            }

            if (this._pendingDispatchEvent) {
              clearTimeout(this._pendingDispatchEvent)
            }

            this._pendingDispatchEvent = null
          },
        }, {
          key: '_dispatchEvent',
          value: function _dispatchEvent(attachmentsCount) {
            const _this2 = this

            this._renderedCapability.resolve()

            if (this._pendingDispatchEvent) {
              clearTimeout(this._pendingDispatchEvent)
              this._pendingDispatchEvent = null
            }

            if (attachmentsCount === 0) {
              this._pendingDispatchEvent = setTimeout(() => {
                _this2.eventBus.dispatch('attachmentsloaded', {
                  source: _this2,
                  attachmentsCount: 0,
                })

                _this2._pendingDispatchEvent = null
              })
              return
            }

            this.eventBus.dispatch('attachmentsloaded', {
              source: this,
              attachmentsCount,
            })
          },
        }, {
          key: '_bindLink',
          value: function _bindLink(element, _ref) {
            const _this3 = this

            const content = _ref.content
            const filename = _ref.filename

            element.onclick = function () {
              _this3.downloadManager.openOrDownloadData(element, content, filename)

              return false
            }
          },
        }, {
          key: 'render',
          value: function render(_ref2) {
            const attachments = _ref2.attachments
            const _ref2$keepRenderedCap = _ref2.keepRenderedCapability
            const keepRenderedCapability = _ref2$keepRenderedCap === void 0 ? false : _ref2$keepRenderedCap

            if (this._attachments) {
              this.reset(keepRenderedCapability)
            }

            this._attachments = attachments || null

            if (!attachments) {
              this._dispatchEvent(0)

              return
            }

            const names = Object.keys(attachments).sort((a, b) => {
              return a.toLowerCase().localeCompare(b.toLowerCase())
            })
            const fragment = document.createDocumentFragment()
            let attachmentsCount = 0

            const _iterator = _createForOfIteratorHelper(names)
            let _step

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                const name = _step.value
                const item = attachments[name]
                const content = item.content
                const filename = (0, _pdfjsLib.getFilenameFromUrl)(item.filename)
                const div = document.createElement('div')
                div.className = 'treeItem'
                const element = document.createElement('a')

                this._bindLink(element, {
                  content,
                  filename,
                })

                element.textContent = this._normalizeTextContent(filename)
                div.appendChild(element)
                fragment.appendChild(div)
                attachmentsCount++
              }
            }
            catch (err) {
              _iterator.e(err)
            }
            finally {
              _iterator.f()
            }

            this._finishRendering(fragment, attachmentsCount)
          },
        }, {
          key: '_appendAttachment',
          value: function _appendAttachment(_ref3) {
            const _this4 = this

            const id = _ref3.id
            const filename = _ref3.filename
            const content = _ref3.content
            const renderedPromise = this._renderedCapability.promise
            renderedPromise.then(() => {
              if (renderedPromise !== _this4._renderedCapability.promise) {
                return
              }

              let attachments = _this4._attachments

              if (!attachments) {
                attachments = Object.create(null)
              }
              else {
                for (const name in attachments) {
                  if (id === name) {
                    return
                  }
                }
              }

              attachments[id] = {
                filename,
                content,
              }

              _this4.render({
                attachments,
                keepRenderedCapability: true,
              })
            })
          },
        }])

        return PDFAttachmentViewer
      }(_base_tree_viewer.BaseTreeViewer))

      exports.PDFAttachmentViewer = PDFAttachmentViewer

      /***/
    },
    /* 13 */
    /***/ (__unused_webpack_module, exports, __webpack_require__) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.BaseTreeViewer = void 0

      const _pdfjsLib = __webpack_require__(7)

      function _createForOfIteratorHelper(o, allowArrayLike) {
        let it = typeof Symbol !== 'undefined' && o[Symbol.iterator] || o['@@iterator']; if (!it) {
          if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === 'number') {
            if (it)
              o = it; let i = 0; const F = function F() { }; return {
                s: F,
                n: function n() {
                  if (i >= o.length)
                    return { done: true }; return { done: false, value: o[i++] }
                },
                e: function e(_e) { throw _e },
                f: F,
              }
          } throw new TypeError('Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.')
        } let normalCompletion = true; let didErr = false; let err; return {
          s: function s() { it = it.call(o) },
          n: function n() { const step = it.next(); normalCompletion = step.done; return step },
          e: function e(_e2) { didErr = true; err = _e2 },
          f: function f() {
            try {
              if (!normalCompletion && it.return != null)
                it.return()
            }
            finally {
              if (didErr)
                throw err
            }
          },
        }
      }

      function _unsupportedIterableToArray(o, minLen) {
        if (!o)
          return; if (typeof o === 'string')
          return _arrayLikeToArray(o, minLen); let n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor)
          n = o.constructor.name; if (n === 'Map' || n === 'Set')
          return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
          return _arrayLikeToArray(o, minLen)
      }

      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length)
          len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2
      }

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      const TREEITEM_OFFSET_TOP = -100
      const TREEITEM_SELECTED_CLASS = 'selected'

      const BaseTreeViewer = /* #__PURE__ */(function () {
        function BaseTreeViewer(options) {
          _classCallCheck(this, BaseTreeViewer)

          if (this.constructor === BaseTreeViewer) {
            throw new Error('Cannot initialize BaseTreeViewer.')
          }

          this.container = options.container
          this.eventBus = options.eventBus
          this.reset()
        }

        _createClass(BaseTreeViewer, [{
          key: 'reset',
          value: function reset() {
            this._pdfDocument = null
            this._lastToggleIsShow = true
            this._currentTreeItem = null
            this.container.textContent = ''
            this.container.classList.remove('treeWithDeepNesting')
          },
        }, {
          key: '_dispatchEvent',
          value: function _dispatchEvent(count) {
            throw new Error('Not implemented: _dispatchEvent')
          },
        }, {
          key: '_bindLink',
          value: function _bindLink(element, params) {
            throw new Error('Not implemented: _bindLink')
          },
        }, {
          key: '_normalizeTextContent',
          value: function _normalizeTextContent(str) {
            return (0, _pdfjsLib.removeNullCharacters)(str, true) || '\u2013'
          },
        }, {
          key: '_addToggleButton',
          value: function _addToggleButton(div) {
            const _this = this

            const hidden = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false
            const toggler = document.createElement('div')
            toggler.className = 'treeItemToggler'

            if (hidden) {
              toggler.classList.add('treeItemsHidden')
            }

            toggler.onclick = function (evt) {
              evt.stopPropagation()
              toggler.classList.toggle('treeItemsHidden')

              if (evt.shiftKey) {
                const shouldShowAll = !toggler.classList.contains('treeItemsHidden')

                _this._toggleTreeItem(div, shouldShowAll)
              }
            }

            div.insertBefore(toggler, div.firstChild)
          },
        }, {
          key: '_toggleTreeItem',
          value: function _toggleTreeItem(root) {
            const show = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false
            this._lastToggleIsShow = show

            const _iterator = _createForOfIteratorHelper(root.querySelectorAll('.treeItemToggler'))
            let _step

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                const toggler = _step.value
                toggler.classList.toggle('treeItemsHidden', !show)
              }
            }
            catch (err) {
              _iterator.e(err)
            }
            finally {
              _iterator.f()
            }
          },
        }, {
          key: '_toggleAllTreeItems',
          value: function _toggleAllTreeItems() {
            this._toggleTreeItem(this.container, !this._lastToggleIsShow)
          },
        }, {
          key: '_finishRendering',
          value: function _finishRendering(fragment, count) {
            const hasAnyNesting = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false

            if (hasAnyNesting) {
              this.container.classList.add('treeWithDeepNesting')
              this._lastToggleIsShow = !fragment.querySelector('.treeItemsHidden')
            }

            this.container.appendChild(fragment)

            this._dispatchEvent(count)
          },
        }, {
          key: 'render',
          value: function render(params) {
            throw new Error('Not implemented: render')
          },
        }, {
          key: '_updateCurrentTreeItem',
          value: function _updateCurrentTreeItem() {
            const treeItem = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null

            if (this._currentTreeItem) {
              this._currentTreeItem.classList.remove(TREEITEM_SELECTED_CLASS)

              this._currentTreeItem = null
            }

            if (treeItem) {
              treeItem.classList.add(TREEITEM_SELECTED_CLASS)
              this._currentTreeItem = treeItem
            }
          },
        }, {
          key: '_scrollToCurrentTreeItem',
          value: function _scrollToCurrentTreeItem(treeItem) {
            if (!treeItem) {
              return
            }

            let currentNode = treeItem.parentNode

            while (currentNode && currentNode !== this.container) {
              if (currentNode.classList.contains('treeItem')) {
                const toggler = currentNode.firstElementChild
                toggler === null || toggler === void 0 ? void 0 : toggler.classList.remove('treeItemsHidden')
              }

              currentNode = currentNode.parentNode
            }

            this._updateCurrentTreeItem(treeItem)

            this.container.scrollTo(treeItem.offsetLeft, treeItem.offsetTop + TREEITEM_OFFSET_TOP)
          },
        }])

        return BaseTreeViewer
      }())

      exports.BaseTreeViewer = BaseTreeViewer

      /***/
    },
    /* 14 */
    /***/ (__unused_webpack_module, exports, __webpack_require__) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.PDFDocumentProperties = void 0

      const _regenerator = _interopRequireDefault(__webpack_require__(3))

      const _pdfjsLib = __webpack_require__(7)

      const _ui_utils = __webpack_require__(5)

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj } }

      function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest() }

      function _nonIterableRest() { throw new TypeError('Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') }

      function _unsupportedIterableToArray(o, minLen) {
        if (!o)
          return; if (typeof o === 'string')
          return _arrayLikeToArray(o, minLen); let n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor)
          n = o.constructor.name; if (n === 'Map' || n === 'Set')
          return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
          return _arrayLikeToArray(o, minLen)
      }

      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length)
          len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2
      }

      function _iterableToArrayLimit(arr, i) {
        let _i = arr == null ? null : typeof Symbol !== 'undefined' && arr[Symbol.iterator] || arr['@@iterator']; if (_i == null)
          return; const _arr = []; let _n = true; let _d = false; let _s, _e; try {
            for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
              _arr.push(_s.value); if (i && _arr.length === i)
                break
            }
          }
        catch (err) { _d = true; _e = err }
        finally {
          try {
            if (!_n && _i.return != null)
              _i.return()
          }
          finally {
            if (_d)
              throw _e
          }
        } return _arr
      }

      function _arrayWithHoles(arr) {
        if (Array.isArray(arr))
          return arr
      }

      function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
        try { var info = gen[key](arg); var value = info.value }
        catch (error) { reject(error); return } if (info.done) { resolve(value) }
        else { Promise.resolve(value).then(_next, _throw) }
      }

      function _asyncToGenerator(fn) { return function () { const self = this; const args = arguments; return new Promise((resolve, reject) => { const gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value) } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err) } _next(undefined) }) } }

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      const DEFAULT_FIELD_CONTENT = '-'
      const NON_METRIC_LOCALES = ['en-us', 'en-lr', 'my']
      const US_PAGE_NAMES = {
        '8.5x11': 'Letter',
        '8.5x14': 'Legal',
      }
      const METRIC_PAGE_NAMES = {
        '297x420': 'A3',
        '210x297': 'A4',
      }

      function getPageName(size, isPortrait, pageNames) {
        const width = isPortrait ? size.width : size.height
        const height = isPortrait ? size.height : size.width
        return pageNames[''.concat(width, 'x').concat(height)]
      }

      const PDFDocumentProperties = /* #__PURE__ */(function () {
        function PDFDocumentProperties(_ref, overlayManager, eventBus, l10n) {
          const _this = this

          const overlayName = _ref.overlayName
          const fields = _ref.fields
          const container = _ref.container
          const closeButton = _ref.closeButton

          _classCallCheck(this, PDFDocumentProperties)

          this.overlayName = overlayName
          this.fields = fields
          this.container = container
          this.overlayManager = overlayManager
          this.l10n = l10n

          this._reset()

          closeButton.addEventListener('click', this.close.bind(this))
          this.overlayManager.register(this.overlayName, this.container, this.close.bind(this))

          eventBus._on('pagechanging', (evt) => {
            _this._currentPageNumber = evt.pageNumber
          })

          eventBus._on('rotationchanging', (evt) => {
            _this._pagesRotation = evt.pagesRotation
          })

          this._isNonMetricLocale = true
          l10n.getLanguage().then((locale) => {
            _this._isNonMetricLocale = NON_METRIC_LOCALES.includes(locale)
          })
        }

        _createClass(PDFDocumentProperties, [{
          key: 'open',
          value: (function () {
            const _open = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee() {
              const _this2 = this

              let freezeFieldData, currentPageNumber, pagesRotation, _yield$this$pdfDocume, info, contentDispositionFilename, contentLength, _yield$Promise$all, _yield$Promise$all2, fileName, fileSize, creationDate, modificationDate, pageSize, isLinearized, _yield$this$pdfDocume2, length, data

              return _regenerator.default.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      freezeFieldData = function freezeFieldData(data) {
                        Object.defineProperty(_this2, 'fieldData', {
                          value: Object.freeze(data),
                          writable: false,
                          enumerable: true,
                          configurable: true,
                        })
                      }

                      _context.next = 3
                      return Promise.all([this.overlayManager.open(this.overlayName), this._dataAvailableCapability.promise])

                    case 3:
                      currentPageNumber = this._currentPageNumber
                      pagesRotation = this._pagesRotation

                      if (!(this.fieldData && currentPageNumber === this.fieldData._currentPageNumber && pagesRotation === this.fieldData._pagesRotation)) {
                        _context.next = 8
                        break
                      }

                      this._updateUI()

                      return _context.abrupt('return')

                    case 8:
                      _context.next = 10
                      return this.pdfDocument.getMetadata()

                    case 10:
                      _yield$this$pdfDocume = _context.sent
                      info = _yield$this$pdfDocume.info
                      contentDispositionFilename = _yield$this$pdfDocume.contentDispositionFilename
                      contentLength = _yield$this$pdfDocume.contentLength
                      _context.next = 16
                      return Promise.all([contentDispositionFilename || (0, _pdfjsLib.getPdfFilenameFromUrl)(this.url), this._parseFileSize(contentLength), this._parseDate(info.CreationDate), this._parseDate(info.ModDate), this.pdfDocument.getPage(currentPageNumber).then((pdfPage) => {
                        return _this2._parsePageSize((0, _ui_utils.getPageSizeInches)(pdfPage), pagesRotation)
                      }), this._parseLinearization(info.IsLinearized)])

                    case 16:
                      _yield$Promise$all = _context.sent
                      _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 6)
                      fileName = _yield$Promise$all2[0]
                      fileSize = _yield$Promise$all2[1]
                      creationDate = _yield$Promise$all2[2]
                      modificationDate = _yield$Promise$all2[3]
                      pageSize = _yield$Promise$all2[4]
                      isLinearized = _yield$Promise$all2[5]
                      freezeFieldData({
                        fileName,
                        fileSize,
                        title: info.Title,
                        author: info.Author,
                        subject: info.Subject,
                        keywords: info.Keywords,
                        creationDate,
                        modificationDate,
                        creator: info.Creator,
                        producer: info.Producer,
                        version: info.PDFFormatVersion,
                        pageCount: this.pdfDocument.numPages,
                        pageSize,
                        linearized: isLinearized,
                        _currentPageNumber: currentPageNumber,
                        _pagesRotation: pagesRotation,
                      })

                      this._updateUI()

                      _context.next = 28
                      return this.pdfDocument.getDownloadInfo()

                    case 28:
                      _yield$this$pdfDocume2 = _context.sent
                      length = _yield$this$pdfDocume2.length

                      if (!(contentLength === length)) {
                        _context.next = 32
                        break
                      }

                      return _context.abrupt('return')

                    case 32:
                      data = Object.assign(Object.create(null), this.fieldData)
                      _context.next = 35
                      return this._parseFileSize(length)

                    case 35:
                      data.fileSize = _context.sent
                      freezeFieldData(data)

                      this._updateUI()

                    case 38:
                    case 'end':
                      return _context.stop()
                  }
                }
              }, _callee, this)
            }))

            function open() {
              return _open.apply(this, arguments)
            }

            return open
          }()),
        }, {
          key: 'close',
          value: function close() {
            this.overlayManager.close(this.overlayName)
          },
        }, {
          key: 'setDocument',
          value: function setDocument(pdfDocument) {
            const url = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null

            if (this.pdfDocument) {
              this._reset()

              this._updateUI(true)
            }

            if (!pdfDocument) {
              return
            }

            this.pdfDocument = pdfDocument
            this.url = url

            this._dataAvailableCapability.resolve()
          },
        }, {
          key: '_reset',
          value: function _reset() {
            this.pdfDocument = null
            this.url = null
            delete this.fieldData
            this._dataAvailableCapability = (0, _pdfjsLib.createPromiseCapability)()
            this._currentPageNumber = 1
            this._pagesRotation = 0
          },
        }, {
          key: '_updateUI',
          value: function _updateUI() {
            const reset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false

            if (reset || !this.fieldData) {
              for (const id in this.fields) {
                this.fields[id].textContent = DEFAULT_FIELD_CONTENT
              }

              return
            }

            if (this.overlayManager.active !== this.overlayName) {
              return
            }

            for (const _id in this.fields) {
              const content = this.fieldData[_id]
              this.fields[_id].textContent = content || content === 0 ? content : DEFAULT_FIELD_CONTENT
            }
          },
        }, {
          key: '_parseFileSize',
          value: (function () {
            const _parseFileSize2 = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee2() {
              let fileSize
              let kb
              let mb
              const _args2 = arguments
              return _regenerator.default.wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      fileSize = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : 0
                      kb = fileSize / 1024, mb = kb / 1024

                      if (kb) {
                        _context2.next = 4
                        break
                      }

                      return _context2.abrupt('return', undefined)

                    case 4:
                      return _context2.abrupt('return', this.l10n.get('document_properties_'.concat(mb >= 1 ? 'mb' : 'kb'), {
                        size_mb: mb >= 1 && (+mb.toPrecision(3)).toLocaleString(),
                        size_kb: mb < 1 && (+kb.toPrecision(3)).toLocaleString(),
                        size_b: fileSize.toLocaleString(),
                      }))

                    case 5:
                    case 'end':
                      return _context2.stop()
                  }
                }
              }, _callee2, this)
            }))

            function _parseFileSize() {
              return _parseFileSize2.apply(this, arguments)
            }

            return _parseFileSize
          }()),
        }, {
          key: '_parsePageSize',
          value: (function () {
            const _parsePageSize2 = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee3(pageSizeInches, pagesRotation) {
              let isPortrait, sizeInches, sizeMillimeters, rawName, exactMillimeters, intMillimeters, _yield$Promise$all3, _yield$Promise$all4, _yield$Promise$all4$, width, height, unit, name, orientation

              return _regenerator.default.wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      if (pageSizeInches) {
                        _context3.next = 2
                        break
                      }

                      return _context3.abrupt('return', undefined)

                    case 2:
                      if (pagesRotation % 180 !== 0) {
                        pageSizeInches = {
                          width: pageSizeInches.height,
                          height: pageSizeInches.width,
                        }
                      }

                      isPortrait = (0, _ui_utils.isPortraitOrientation)(pageSizeInches)
                      sizeInches = {
                        width: Math.round(pageSizeInches.width * 100) / 100,
                        height: Math.round(pageSizeInches.height * 100) / 100,
                      }
                      sizeMillimeters = {
                        width: Math.round(pageSizeInches.width * 25.4 * 10) / 10,
                        height: Math.round(pageSizeInches.height * 25.4 * 10) / 10,
                      }
                      rawName = getPageName(sizeInches, isPortrait, US_PAGE_NAMES) || getPageName(sizeMillimeters, isPortrait, METRIC_PAGE_NAMES)

                      if (!rawName && !(Number.isInteger(sizeMillimeters.width) && Number.isInteger(sizeMillimeters.height))) {
                        exactMillimeters = {
                          width: pageSizeInches.width * 25.4,
                          height: pageSizeInches.height * 25.4,
                        }
                        intMillimeters = {
                          width: Math.round(sizeMillimeters.width),
                          height: Math.round(sizeMillimeters.height),
                        }

                        if (Math.abs(exactMillimeters.width - intMillimeters.width) < 0.1 && Math.abs(exactMillimeters.height - intMillimeters.height) < 0.1) {
                          rawName = getPageName(intMillimeters, isPortrait, METRIC_PAGE_NAMES)

                          if (rawName) {
                            sizeInches = {
                              width: Math.round(intMillimeters.width / 25.4 * 100) / 100,
                              height: Math.round(intMillimeters.height / 25.4 * 100) / 100,
                            }
                            sizeMillimeters = intMillimeters
                          }
                        }
                      }

                      _context3.next = 10
                      return Promise.all([this._isNonMetricLocale ? sizeInches : sizeMillimeters, this.l10n.get('document_properties_page_size_unit_'.concat(this._isNonMetricLocale ? 'inches' : 'millimeters')), rawName && this.l10n.get('document_properties_page_size_name_'.concat(rawName.toLowerCase())), this.l10n.get('document_properties_page_size_orientation_'.concat(isPortrait ? 'portrait' : 'landscape'))])

                    case 10:
                      _yield$Promise$all3 = _context3.sent
                      _yield$Promise$all4 = _slicedToArray(_yield$Promise$all3, 4)
                      _yield$Promise$all4$ = _yield$Promise$all4[0]
                      width = _yield$Promise$all4$.width
                      height = _yield$Promise$all4$.height
                      unit = _yield$Promise$all4[1]
                      name = _yield$Promise$all4[2]
                      orientation = _yield$Promise$all4[3]
                      return _context3.abrupt('return', this.l10n.get('document_properties_page_size_dimension_'.concat(name ? 'name_' : '', 'string'), {
                        width: width.toLocaleString(),
                        height: height.toLocaleString(),
                        unit,
                        name,
                        orientation,
                      }))

                    case 19:
                    case 'end':
                      return _context3.stop()
                  }
                }
              }, _callee3, this)
            }))

            function _parsePageSize(_x, _x2) {
              return _parsePageSize2.apply(this, arguments)
            }

            return _parsePageSize
          }()),
        }, {
          key: '_parseDate',
          value: (function () {
            const _parseDate2 = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee4(inputDate) {
              let dateObject
              return _regenerator.default.wrap(function _callee4$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      dateObject = _pdfjsLib.PDFDateString.toDateObject(inputDate)

                      if (dateObject) {
                        _context4.next = 3
                        break
                      }

                      return _context4.abrupt('return', undefined)

                    case 3:
                      return _context4.abrupt('return', this.l10n.get('document_properties_date_string', {
                        date: dateObject.toLocaleDateString(),
                        time: dateObject.toLocaleTimeString(),
                      }))

                    case 4:
                    case 'end':
                      return _context4.stop()
                  }
                }
              }, _callee4, this)
            }))

            function _parseDate(_x3) {
              return _parseDate2.apply(this, arguments)
            }

            return _parseDate
          }()),
        }, {
          key: '_parseLinearization',
          value: function _parseLinearization(isLinearized) {
            return this.l10n.get('document_properties_linearized_'.concat(isLinearized ? 'yes' : 'no'))
          },
        }])

        return PDFDocumentProperties
      }())

      exports.PDFDocumentProperties = PDFDocumentProperties

      /***/
    },
    /* 15 */
    /***/ (__unused_webpack_module, exports, __webpack_require__) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.PDFFindBar = void 0

      const _pdf_find_controller = __webpack_require__(16)

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      const MATCHES_COUNT_LIMIT = 1000

      const PDFFindBar = /* #__PURE__ */(function () {
        function PDFFindBar(options, eventBus, l10n) {
          const _this = this

          _classCallCheck(this, PDFFindBar)

          this.opened = false
          this.bar = options.bar
          this.toggleButton = options.toggleButton
          this.findField = options.findField
          this.highlightAll = options.highlightAllCheckbox
          this.caseSensitive = options.caseSensitiveCheckbox
          this.entireWord = options.entireWordCheckbox
          this.findMsg = options.findMsg
          this.findResultsCount = options.findResultsCount
          this.findPreviousButton = options.findPreviousButton
          this.findNextButton = options.findNextButton
          this.eventBus = eventBus
          this.l10n = l10n
          this.toggleButton.addEventListener('click', () => {
            _this.toggle()
          })
          this.findField.addEventListener('input', () => {
            _this.dispatchEvent('')
          })
          this.bar.addEventListener('keydown', (e) => {
            switch (e.keyCode) {
              case 13:
                if (e.target === _this.findField) {
                  _this.dispatchEvent('again', e.shiftKey)
                }

                break

              case 27:
                _this.close()

                break
            }
          })
          this.findPreviousButton.addEventListener('click', () => {
            _this.dispatchEvent('again', true)
          })
          this.findNextButton.addEventListener('click', () => {
            _this.dispatchEvent('again', false)
          })
          this.highlightAll.addEventListener('click', () => {
            _this.dispatchEvent('highlightallchange')
          })
          this.caseSensitive.addEventListener('click', () => {
            _this.dispatchEvent('casesensitivitychange')
          })
          this.entireWord.addEventListener('click', () => {
            _this.dispatchEvent('entirewordchange')
          })

          this.eventBus._on('resize', this._adjustWidth.bind(this))
        }

        _createClass(PDFFindBar, [{
          key: 'reset',
          value: function reset() {
            this.updateUIState()
          },
        }, {
          key: 'dispatchEvent',
          value: function dispatchEvent(type) {
            const findPrev = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false
            this.eventBus.dispatch('find', {
              source: this,
              type,
              query: this.findField.value,
              phraseSearch: true,
              caseSensitive: this.caseSensitive.checked,
              entireWord: this.entireWord.checked,
              highlightAll: this.highlightAll.checked,
              findPrevious: findPrev,
            })
          },
        }, {
          key: 'updateUIState',
          value: function updateUIState(state, previous, matchesCount) {
            const _this2 = this

            let findMsg = Promise.resolve('')
            let status = ''

            switch (state) {
              case _pdf_find_controller.FindState.FOUND:
                break

              case _pdf_find_controller.FindState.PENDING:
                status = 'pending'
                break

              case _pdf_find_controller.FindState.NOT_FOUND:
                findMsg = this.l10n.get('find_not_found')
                status = 'notFound'
                break

              case _pdf_find_controller.FindState.WRAPPED:
                findMsg = this.l10n.get('find_reached_'.concat(previous ? 'top' : 'bottom'))
                break
            }

            this.findField.setAttribute('data-status', status)
            findMsg.then((msg) => {
              _this2.findMsg.textContent = msg

              _this2._adjustWidth()
            })
            this.updateResultsCount(matchesCount)
          },
        }, {
          key: 'updateResultsCount',
          value: function updateResultsCount() {
            const _this3 = this

            const _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
            const _ref$current = _ref.current
            const current = _ref$current === void 0 ? 0 : _ref$current
            const _ref$total = _ref.total
            const total = _ref$total === void 0 ? 0 : _ref$total

            const limit = MATCHES_COUNT_LIMIT
            let matchCountMsg = Promise.resolve('')

            if (total > 0) {
              if (total > limit) {
                const key = 'find_match_count_limit'
                matchCountMsg = this.l10n.get(key, {
                  limit,
                })
              }
              else {
                const _key = 'find_match_count'
                matchCountMsg = this.l10n.get(_key, {
                  current,
                  total,
                })
              }
            }

            matchCountMsg.then((msg) => {
              _this3.findResultsCount.textContent = msg

              _this3.findResultsCount.classList.toggle('hidden', !total)

              _this3._adjustWidth()
            })
          },
        }, {
          key: 'open',
          value: function open() {
            if (!this.opened) {
              this.opened = true
              this.toggleButton.classList.add('toggled')
              this.toggleButton.setAttribute('aria-expanded', 'true')
              this.bar.classList.remove('hidden')
            }

            this.findField.select()
            this.findField.focus()

            this._adjustWidth()
          },
        }, {
          key: 'close',
          value: function close() {
            if (!this.opened) {
              return
            }

            this.opened = false
            this.toggleButton.classList.remove('toggled')
            this.toggleButton.setAttribute('aria-expanded', 'false')
            this.bar.classList.add('hidden')
            this.eventBus.dispatch('findbarclose', {
              source: this,
            })
          },
        }, {
          key: 'toggle',
          value: function toggle() {
            if (this.opened) {
              this.close()
            }
            else {
              this.open()
            }
          },
        }, {
          key: '_adjustWidth',
          value: function _adjustWidth() {
            if (!this.opened) {
              return
            }

            this.bar.classList.remove('wrapContainers')
            const findbarHeight = this.bar.clientHeight
            const inputContainerHeight = this.bar.firstElementChild.clientHeight

            if (findbarHeight > inputContainerHeight) {
              this.bar.classList.add('wrapContainers')
            }
          },
        }])

        return PDFFindBar
      }())

      exports.PDFFindBar = PDFFindBar

      /***/
    },
    /* 16 */
    /***/ (__unused_webpack_module, exports, __webpack_require__) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.PDFFindController = exports.FindState = void 0

      const _pdfjsLib = __webpack_require__(7)

      const _pdf_find_utils = __webpack_require__(17)

      const _ui_utils = __webpack_require__(5)

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest() }

      function _nonIterableRest() { throw new TypeError('Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') }

      function _iterableToArrayLimit(arr, i) {
        let _i = arr == null ? null : typeof Symbol !== 'undefined' && arr[Symbol.iterator] || arr['@@iterator']; if (_i == null)
          return; const _arr = []; let _n = true; let _d = false; let _s, _e; try {
            for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
              _arr.push(_s.value); if (i && _arr.length === i)
                break
            }
          }
        catch (err) { _d = true; _e = err }
        finally {
          try {
            if (!_n && _i.return != null)
              _i.return()
          }
          finally {
            if (_d)
              throw _e
          }
        } return _arr
      }

      function _arrayWithHoles(arr) {
        if (Array.isArray(arr))
          return arr
      }

      function _createForOfIteratorHelper(o, allowArrayLike) {
        let it = typeof Symbol !== 'undefined' && o[Symbol.iterator] || o['@@iterator']; if (!it) {
          if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === 'number') {
            if (it)
              o = it; let i = 0; const F = function F() { }; return {
                s: F,
                n: function n() {
                  if (i >= o.length)
                    return { done: true }; return { done: false, value: o[i++] }
                },
                e: function e(_e2) { throw _e2 },
                f: F,
              }
          } throw new TypeError('Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.')
        } let normalCompletion = true; let didErr = false; let err; return {
          s: function s() { it = it.call(o) },
          n: function n() { const step = it.next(); normalCompletion = step.done; return step },
          e: function e(_e3) { didErr = true; err = _e3 },
          f: function f() {
            try {
              if (!normalCompletion && it.return != null)
                it.return()
            }
            finally {
              if (didErr)
                throw err
            }
          },
        }
      }

      function _unsupportedIterableToArray(o, minLen) {
        if (!o)
          return; if (typeof o === 'string')
          return _arrayLikeToArray(o, minLen); let n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor)
          n = o.constructor.name; if (n === 'Map' || n === 'Set')
          return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
          return _arrayLikeToArray(o, minLen)
      }

      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length)
          len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2
      }

      const FindState = {
        FOUND: 0,
        NOT_FOUND: 1,
        WRAPPED: 2,
        PENDING: 3,
      }
      exports.FindState = FindState
      const FIND_TIMEOUT = 250
      const MATCH_SCROLL_OFFSET_TOP = -50
      const MATCH_SCROLL_OFFSET_LEFT = -400
      const CHARACTERS_TO_NORMALIZE = {
        '\u2010': '-',
        '\u2018': '\'',
        '\u2019': '\'',
        '\u201A': '\'',
        '\u201B': '\'',
        '\u201C': '"',
        '\u201D': '"',
        '\u201E': '"',
        '\u201F': '"',
        '\xBC': '1/4',
        '\xBD': '1/2',
        '\xBE': '3/4',
      }
      let normalizationRegex = null

      function normalize(text) {
        if (!normalizationRegex) {
          const replace = Object.keys(CHARACTERS_TO_NORMALIZE).join('')
          normalizationRegex = new RegExp('['.concat(replace, ']'), 'g')
        }

        let diffs = null
        const normalizedText = text.replace(normalizationRegex, (ch, index) => {
          const normalizedCh = CHARACTERS_TO_NORMALIZE[ch]
          const diff = normalizedCh.length - ch.length

          if (diff !== 0) {
            (diffs || (diffs = [])).push([index, diff])
          }

          return normalizedCh
        })
        return [normalizedText, diffs]
      }

      function getOriginalIndex(matchIndex) {
        const diffs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null

        if (!diffs) {
          return matchIndex
        }

        let totalDiff = 0

        const _iterator = _createForOfIteratorHelper(diffs)
        let _step

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            const _step$value = _slicedToArray(_step.value, 2)
            const index = _step$value[0]
            const diff = _step$value[1]

            const currentIndex = index + totalDiff

            if (currentIndex >= matchIndex) {
              break
            }

            if (currentIndex + diff > matchIndex) {
              totalDiff += matchIndex - currentIndex
              break
            }

            totalDiff += diff
          }
        }
        catch (err) {
          _iterator.e(err)
        }
        finally {
          _iterator.f()
        }

        return matchIndex - totalDiff
      }

      const PDFFindController = /* #__PURE__ */(function () {
        function PDFFindController(_ref) {
          const _this = this

          const linkService = _ref.linkService
          const eventBus = _ref.eventBus

          _classCallCheck(this, PDFFindController)

          this._linkService = linkService
          this._eventBus = eventBus

          this._reset()

          eventBus._on('find', this._onFind.bind(this))

          eventBus._on('findbarclose', this._onFindBarClose.bind(this))

          this.executeCommand = function (cmd, state) {
            console.error('Deprecated method `PDFFindController.executeCommand` called, ' + 'please dispatch a "find"-event using the EventBus instead.')
            const eventState = Object.assign(Object.create(null), state, {
              type: cmd.substring('find'.length),
            })

            _this._onFind(eventState)
          }
        }

        _createClass(PDFFindController, [{
          key: 'highlightMatches',
          get: function get() {
            return this._highlightMatches
          },
        }, {
          key: 'pageMatches',
          get: function get() {
            return this._pageMatches
          },
        }, {
          key: 'pageMatchesLength',
          get: function get() {
            return this._pageMatchesLength
          },
        }, {
          key: 'selected',
          get: function get() {
            return this._selected
          },
        }, {
          key: 'state',
          get: function get() {
            return this._state
          },
        }, {
          key: 'setDocument',
          value: function setDocument(pdfDocument) {
            if (this._pdfDocument) {
              this._reset()
            }

            if (!pdfDocument) {
              return
            }

            this._pdfDocument = pdfDocument

            this._firstPageCapability.resolve()
          },
        }, {
          key: '_onFind',
          value: function _onFind(state) {
            const _this2 = this

            if (!state) {
              return
            }

            const pdfDocument = this._pdfDocument
            const type = state.type

            if (this._state === null || this._shouldDirtyMatch(state)) {
              this._dirtyMatch = true
            }

            this._state = state

            if (type !== 'highlightallchange') {
              this._updateUIState(FindState.PENDING)
            }

            this._firstPageCapability.promise.then(() => {
              if (!_this2._pdfDocument || pdfDocument && _this2._pdfDocument !== pdfDocument) {
                return
              }

              _this2._extractText()

              const findbarClosed = !_this2._highlightMatches
              const pendingTimeout = !!_this2._findTimeout

              if (_this2._findTimeout) {
                clearTimeout(_this2._findTimeout)
                _this2._findTimeout = null
              }

              if (!type) {
                _this2._findTimeout = setTimeout(() => {
                  _this2._nextMatch()

                  _this2._findTimeout = null
                }, FIND_TIMEOUT)
              }
              else if (_this2._dirtyMatch) {
                _this2._nextMatch()
              }
              else if (type === 'again') {
                _this2._nextMatch()

                if (findbarClosed && _this2._state.highlightAll) {
                  _this2._updateAllPages()
                }
              }
              else if (type === 'highlightallchange') {
                if (pendingTimeout) {
                  _this2._nextMatch()
                }
                else {
                  _this2._highlightMatches = true
                }

                _this2._updateAllPages()
              }
              else {
                _this2._nextMatch()
              }
            })
          },
        }, {
          key: 'scrollMatchIntoView',
          value: function scrollMatchIntoView(_ref2) {
            const _ref2$element = _ref2.element
            const element = _ref2$element === void 0 ? null : _ref2$element
            const _ref2$selectedLeft = _ref2.selectedLeft
            const selectedLeft = _ref2$selectedLeft === void 0 ? 0 : _ref2$selectedLeft
            const _ref2$pageIndex = _ref2.pageIndex
            const pageIndex = _ref2$pageIndex === void 0 ? -1 : _ref2$pageIndex
            const _ref2$matchIndex = _ref2.matchIndex
            const matchIndex = _ref2$matchIndex === void 0 ? -1 : _ref2$matchIndex

            if (!this._scrollMatches || !element) {
              return
            }
            else if (matchIndex === -1 || matchIndex !== this._selected.matchIdx) {
              return
            }
            else if (pageIndex === -1 || pageIndex !== this._selected.pageIdx) {
              return
            }

            this._scrollMatches = false
            const spot = {
              top: MATCH_SCROLL_OFFSET_TOP,
              left: selectedLeft + MATCH_SCROLL_OFFSET_LEFT,
            };
            (0, _ui_utils.scrollIntoView)(element, spot, true)
          },
        }, {
          key: '_reset',
          value: function _reset() {
            this._highlightMatches = false
            this._scrollMatches = false
            this._pdfDocument = null
            this._pageMatches = []
            this._pageMatchesLength = []
            this._state = null
            this._selected = {
              pageIdx: -1,
              matchIdx: -1,
            }
            this._offset = {
              pageIdx: null,
              matchIdx: null,
              wrapped: false,
            }
            this._extractTextPromises = []
            this._pageContents = []
            this._pageDiffs = []
            this._matchesCountTotal = 0
            this._pagesToSearch = null
            this._pendingFindMatches = new Set()
            this._resumePageIdx = null
            this._dirtyMatch = false
            clearTimeout(this._findTimeout)
            this._findTimeout = null
            this._firstPageCapability = (0, _pdfjsLib.createPromiseCapability)()
          },
        }, {
          key: '_query',
          get: function get() {
            if (this._state.query !== this._rawQuery) {
              this._rawQuery = this._state.query

              const _normalize = normalize(this._state.query)

              const _normalize2 = _slicedToArray(_normalize, 1)

              this._normalizedQuery = _normalize2[0]
            }

            return this._normalizedQuery
          },
        }, {
          key: '_shouldDirtyMatch',
          value: function _shouldDirtyMatch(state) {
            if (state.query !== this._state.query) {
              return true
            }

            switch (state.type) {
              case 'again':
                var pageNumber = this._selected.pageIdx + 1
                var linkService = this._linkService

                if (pageNumber >= 1 && pageNumber <= linkService.pagesCount && pageNumber !== linkService.page && !linkService.isPageVisible(pageNumber)) {
                  return true
                }

                return false

              case 'highlightallchange':
                return false
            }

            return true
          },
        }, {
          key: '_prepareMatches',
          value: function _prepareMatches(matchesWithLength, matches, matchesLength) {
            function isSubTerm(currentIndex) {
              const currentElem = matchesWithLength[currentIndex]
              const nextElem = matchesWithLength[currentIndex + 1]

              if (currentIndex < matchesWithLength.length - 1 && currentElem.match === nextElem.match) {
                currentElem.skipped = true
                return true
              }

              for (let i = currentIndex - 1; i >= 0; i--) {
                const prevElem = matchesWithLength[i]

                if (prevElem.skipped) {
                  continue
                }

                if (prevElem.match + prevElem.matchLength < currentElem.match) {
                  break
                }

                if (prevElem.match + prevElem.matchLength >= currentElem.match + currentElem.matchLength) {
                  currentElem.skipped = true
                  return true
                }
              }

              return false
            }

            matchesWithLength.sort((a, b) => {
              return a.match === b.match ? a.matchLength - b.matchLength : a.match - b.match
            })

            for (let i = 0, len = matchesWithLength.length; i < len; i++) {
              if (isSubTerm(i)) {
                continue
              }

              matches.push(matchesWithLength[i].match)
              matchesLength.push(matchesWithLength[i].matchLength)
            }
          },
        }, {
          key: '_isEntireWord',
          value: function _isEntireWord(content, startIdx, length) {
            if (startIdx > 0) {
              const first = content.charCodeAt(startIdx)
              const limit = content.charCodeAt(startIdx - 1)

              if ((0, _pdf_find_utils.getCharacterType)(first) === (0, _pdf_find_utils.getCharacterType)(limit)) {
                return false
              }
            }

            const endIdx = startIdx + length - 1

            if (endIdx < content.length - 1) {
              const last = content.charCodeAt(endIdx)

              const _limit = content.charCodeAt(endIdx + 1)

              if ((0, _pdf_find_utils.getCharacterType)(last) === (0, _pdf_find_utils.getCharacterType)(_limit)) {
                return false
              }
            }

            return true
          },
        }, {
          key: '_calculatePhraseMatch',
          value: function _calculatePhraseMatch(query, pageIndex, pageContent, pageDiffs, entireWord) {
            const matches = []
            const matchesLength = []
            const queryLen = query.length
            let matchIdx = -queryLen

            while (true) {
              matchIdx = pageContent.indexOf(query, matchIdx + queryLen)

              if (matchIdx === -1) {
                break
              }

              if (entireWord && !this._isEntireWord(pageContent, matchIdx, queryLen)) {
                continue
              }

              const originalMatchIdx = getOriginalIndex(matchIdx, pageDiffs)
              const matchEnd = matchIdx + queryLen - 1
              const originalQueryLen = getOriginalIndex(matchEnd, pageDiffs) - originalMatchIdx + 1
              matches.push(originalMatchIdx)
              matchesLength.push(originalQueryLen)
            }

            this._pageMatches[pageIndex] = matches
            this._pageMatchesLength[pageIndex] = matchesLength
          },
        }, {
          key: '_calculateWordMatch',
          value: function _calculateWordMatch(query, pageIndex, pageContent, pageDiffs, entireWord) {
            const matchesWithLength = []
            const queryArray = query.match(/\S+/g)

            for (let i = 0, len = queryArray.length; i < len; i++) {
              const subquery = queryArray[i]
              const subqueryLen = subquery.length
              let matchIdx = -subqueryLen

              while (true) {
                matchIdx = pageContent.indexOf(subquery, matchIdx + subqueryLen)

                if (matchIdx === -1) {
                  break
                }

                if (entireWord && !this._isEntireWord(pageContent, matchIdx, subqueryLen)) {
                  continue
                }

                const originalMatchIdx = getOriginalIndex(matchIdx, pageDiffs)
                const matchEnd = matchIdx + subqueryLen - 1
                const originalQueryLen = getOriginalIndex(matchEnd, pageDiffs) - originalMatchIdx + 1
                matchesWithLength.push({
                  match: originalMatchIdx,
                  matchLength: originalQueryLen,
                  skipped: false,
                })
              }
            }

            this._pageMatchesLength[pageIndex] = []
            this._pageMatches[pageIndex] = []

            this._prepareMatches(matchesWithLength, this._pageMatches[pageIndex], this._pageMatchesLength[pageIndex])
          },
        }, {
          key: '_calculateMatch',
          value: function _calculateMatch(pageIndex) {
            let pageContent = this._pageContents[pageIndex]
            const pageDiffs = this._pageDiffs[pageIndex]
            let query = this._query
            const _this$_state = this._state
            const caseSensitive = _this$_state.caseSensitive
            const entireWord = _this$_state.entireWord
            const phraseSearch = _this$_state.phraseSearch

            if (query.length === 0) {
              return
            }

            if (!caseSensitive) {
              pageContent = pageContent.toLowerCase()
              query = query.toLowerCase()
            }

            if (phraseSearch) {
              this._calculatePhraseMatch(query, pageIndex, pageContent, pageDiffs, entireWord)
            }
            else {
              this._calculateWordMatch(query, pageIndex, pageContent, pageDiffs, entireWord)
            }

            if (this._state.highlightAll) {
              this._updatePage(pageIndex)
            }

            if (this._resumePageIdx === pageIndex) {
              this._resumePageIdx = null

              this._nextPageMatch()
            }

            const pageMatchesCount = this._pageMatches[pageIndex].length

            if (pageMatchesCount > 0) {
              this._matchesCountTotal += pageMatchesCount

              this._updateUIResultsCount()
            }
          },
        }, {
          key: '_extractText',
          value: function _extractText() {
            const _this3 = this

            if (this._extractTextPromises.length > 0) {
              return
            }

            let promise = Promise.resolve()

            const _loop = function _loop(i, ii) {
              const extractTextCapability = (0, _pdfjsLib.createPromiseCapability)()
              _this3._extractTextPromises[i] = extractTextCapability.promise
              promise = promise.then(() => {
                return _this3._pdfDocument.getPage(i + 1).then((pdfPage) => {
                  return pdfPage.getTextContent({
                    normalizeWhitespace: true,
                  })
                }).then((textContent) => {
                  const textItems = textContent.items
                  const strBuf = []

                  for (let j = 0, jj = textItems.length; j < jj; j++) {
                    strBuf.push(textItems[j].str)
                  }

                  const _normalize3 = normalize(strBuf.join(''))

                  const _normalize4 = _slicedToArray(_normalize3, 2)

                  _this3._pageContents[i] = _normalize4[0]
                  _this3._pageDiffs[i] = _normalize4[1]
                  extractTextCapability.resolve(i)
                }, (reason) => {
                  console.error('Unable to get text content for page '.concat(i + 1), reason)
                  _this3._pageContents[i] = ''
                  _this3._pageDiffs[i] = null
                  extractTextCapability.resolve(i)
                })
              })
            }

            for (let i = 0, ii = this._linkService.pagesCount; i < ii; i++) {
              _loop(i, ii)
            }
          },
        }, {
          key: '_updatePage',
          value: function _updatePage(index) {
            if (this._scrollMatches && this._selected.pageIdx === index) {
              this._linkService.page = index + 1
            }

            this._eventBus.dispatch('updatetextlayermatches', {
              source: this,
              pageIndex: index,
            })
          },
        }, {
          key: '_updateAllPages',
          value: function _updateAllPages() {
            this._eventBus.dispatch('updatetextlayermatches', {
              source: this,
              pageIndex: -1,
            })
          },
        }, {
          key: '_nextMatch',
          value: function _nextMatch() {
            const _this4 = this

            const previous = this._state.findPrevious
            const currentPageIndex = this._linkService.page - 1
            const numPages = this._linkService.pagesCount
            this._highlightMatches = true

            if (this._dirtyMatch) {
              this._dirtyMatch = false
              this._selected.pageIdx = this._selected.matchIdx = -1
              this._offset.pageIdx = currentPageIndex
              this._offset.matchIdx = null
              this._offset.wrapped = false
              this._resumePageIdx = null
              this._pageMatches.length = 0
              this._pageMatchesLength.length = 0
              this._matchesCountTotal = 0

              this._updateAllPages()

              for (let i = 0; i < numPages; i++) {
                if (this._pendingFindMatches.has(i)) {
                  continue
                }

                this._pendingFindMatches.add(i)

                this._extractTextPromises[i].then((pageIdx) => {
                  _this4._pendingFindMatches.delete(pageIdx)

                  _this4._calculateMatch(pageIdx)
                })
              }
            }

            if (this._query === '') {
              this._updateUIState(FindState.FOUND)

              return
            }

            if (this._resumePageIdx) {
              return
            }

            const offset = this._offset
            this._pagesToSearch = numPages

            if (offset.matchIdx !== null) {
              const numPageMatches = this._pageMatches[offset.pageIdx].length

              if (!previous && offset.matchIdx + 1 < numPageMatches || previous && offset.matchIdx > 0) {
                offset.matchIdx = previous ? offset.matchIdx - 1 : offset.matchIdx + 1

                this._updateMatch(true)

                return
              }

              this._advanceOffsetPage(previous)
            }

            this._nextPageMatch()
          },
        }, {
          key: '_matchesReady',
          value: function _matchesReady(matches) {
            const offset = this._offset
            const numMatches = matches.length
            const previous = this._state.findPrevious

            if (numMatches) {
              offset.matchIdx = previous ? numMatches - 1 : 0

              this._updateMatch(true)

              return true
            }

            this._advanceOffsetPage(previous)

            if (offset.wrapped) {
              offset.matchIdx = null

              if (this._pagesToSearch < 0) {
                this._updateMatch(false)

                return true
              }
            }

            return false
          },
        }, {
          key: '_nextPageMatch',
          value: function _nextPageMatch() {
            if (this._resumePageIdx !== null) {
              console.error('There can only be one pending page.')
            }

            let matches = null

            do {
              const pageIdx = this._offset.pageIdx
              matches = this._pageMatches[pageIdx]

              if (!matches) {
                this._resumePageIdx = pageIdx
                break
              }
            } while (!this._matchesReady(matches))
          },
        }, {
          key: '_advanceOffsetPage',
          value: function _advanceOffsetPage(previous) {
            const offset = this._offset
            const numPages = this._linkService.pagesCount
            offset.pageIdx = previous ? offset.pageIdx - 1 : offset.pageIdx + 1
            offset.matchIdx = null
            this._pagesToSearch--

            if (offset.pageIdx >= numPages || offset.pageIdx < 0) {
              offset.pageIdx = previous ? numPages - 1 : 0
              offset.wrapped = true
            }
          },
        }, {
          key: '_updateMatch',
          value: function _updateMatch() {
            const found = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false
            let state = FindState.NOT_FOUND
            const wrapped = this._offset.wrapped
            this._offset.wrapped = false

            if (found) {
              const previousPage = this._selected.pageIdx
              this._selected.pageIdx = this._offset.pageIdx
              this._selected.matchIdx = this._offset.matchIdx
              state = wrapped ? FindState.WRAPPED : FindState.FOUND

              if (previousPage !== -1 && previousPage !== this._selected.pageIdx) {
                this._updatePage(previousPage)
              }
            }

            this._updateUIState(state, this._state.findPrevious)

            if (this._selected.pageIdx !== -1) {
              this._scrollMatches = true

              this._updatePage(this._selected.pageIdx)
            }
          },
        }, {
          key: '_onFindBarClose',
          value: function _onFindBarClose(evt) {
            const _this5 = this

            const pdfDocument = this._pdfDocument

            this._firstPageCapability.promise.then(() => {
              if (!_this5._pdfDocument || pdfDocument && _this5._pdfDocument !== pdfDocument) {
                return
              }

              if (_this5._findTimeout) {
                clearTimeout(_this5._findTimeout)
                _this5._findTimeout = null
              }

              if (_this5._resumePageIdx) {
                _this5._resumePageIdx = null
                _this5._dirtyMatch = true
              }

              _this5._updateUIState(FindState.FOUND)

              _this5._highlightMatches = false

              _this5._updateAllPages()
            })
          },
        }, {
          key: '_requestMatchesCount',
          value: function _requestMatchesCount() {
            const _this$_selected = this._selected
            const pageIdx = _this$_selected.pageIdx
            const matchIdx = _this$_selected.matchIdx
            let current = 0
            let total = this._matchesCountTotal

            if (matchIdx !== -1) {
              for (let i = 0; i < pageIdx; i++) {
                var _this$_pageMatches$i

                current += ((_this$_pageMatches$i = this._pageMatches[i]) === null || _this$_pageMatches$i === void 0 ? void 0 : _this$_pageMatches$i.length) || 0
              }

              current += matchIdx + 1
            }

            if (current < 1 || current > total) {
              current = total = 0
            }

            return {
              current,
              total,
            }
          },
        }, {
          key: '_updateUIResultsCount',
          value: function _updateUIResultsCount() {
            this._eventBus.dispatch('updatefindmatchescount', {
              source: this,
              matchesCount: this._requestMatchesCount(),
            })
          },
        }, {
          key: '_updateUIState',
          value: function _updateUIState(state) {
            let _this$_state$query, _this$_state2

            const previous = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false

            this._eventBus.dispatch('updatefindcontrolstate', {
              source: this,
              state,
              previous,
              matchesCount: this._requestMatchesCount(),
              rawQuery: (_this$_state$query = (_this$_state2 = this._state) === null || _this$_state2 === void 0 ? void 0 : _this$_state2.query) !== null && _this$_state$query !== void 0 ? _this$_state$query : null,
            })
          },
        }])

        return PDFFindController
      }())

      exports.PDFFindController = PDFFindController

      /***/
    },
    /* 17 */
    /***/ (__unused_webpack_module, exports) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.CharacterType = void 0
      exports.getCharacterType = getCharacterType
      const CharacterType = {
        SPACE: 0,
        ALPHA_LETTER: 1,
        PUNCT: 2,
        HAN_LETTER: 3,
        KATAKANA_LETTER: 4,
        HIRAGANA_LETTER: 5,
        HALFWIDTH_KATAKANA_LETTER: 6,
        THAI_LETTER: 7,
      }
      exports.CharacterType = CharacterType

      function isAlphabeticalScript(charCode) {
        return charCode < 0x2E80
      }

      function isAscii(charCode) {
        return (charCode & 0xFF80) === 0
      }

      function isAsciiAlpha(charCode) {
        return charCode >= 0x61 && charCode <= 0x7A || charCode >= 0x41 && charCode <= 0x5A
      }

      function isAsciiDigit(charCode) {
        return charCode >= 0x30 && charCode <= 0x39
      }

      function isAsciiSpace(charCode) {
        return charCode === 0x20 || charCode === 0x09 || charCode === 0x0D || charCode === 0x0A
      }

      function isHan(charCode) {
        return charCode >= 0x3400 && charCode <= 0x9FFF || charCode >= 0xF900 && charCode <= 0xFAFF
      }

      function isKatakana(charCode) {
        return charCode >= 0x30A0 && charCode <= 0x30FF
      }

      function isHiragana(charCode) {
        return charCode >= 0x3040 && charCode <= 0x309F
      }

      function isHalfwidthKatakana(charCode) {
        return charCode >= 0xFF60 && charCode <= 0xFF9F
      }

      function isThai(charCode) {
        return (charCode & 0xFF80) === 0x0E00
      }

      function getCharacterType(charCode) {
        if (isAlphabeticalScript(charCode)) {
          if (isAscii(charCode)) {
            if (isAsciiSpace(charCode)) {
              return CharacterType.SPACE
            }
            else if (isAsciiAlpha(charCode) || isAsciiDigit(charCode) || charCode === 0x5F) {
              return CharacterType.ALPHA_LETTER
            }

            return CharacterType.PUNCT
          }
          else if (isThai(charCode)) {
            return CharacterType.THAI_LETTER
          }
          else if (charCode === 0xA0) {
            return CharacterType.SPACE
          }

          return CharacterType.ALPHA_LETTER
        }

        if (isHan(charCode)) {
          return CharacterType.HAN_LETTER
        }
        else if (isKatakana(charCode)) {
          return CharacterType.KATAKANA_LETTER
        }
        else if (isHiragana(charCode)) {
          return CharacterType.HIRAGANA_LETTER
        }
        else if (isHalfwidthKatakana(charCode)) {
          return CharacterType.HALFWIDTH_KATAKANA_LETTER
        }

        return CharacterType.ALPHA_LETTER
      }

      /***/
    },
    /* 18 */
    /***/ (__unused_webpack_module, exports, __webpack_require__) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.PDFHistory = void 0
      exports.isDestArraysEqual = isDestArraysEqual
      exports.isDestHashesEqual = isDestHashesEqual

      const _ui_utils = __webpack_require__(5)

      const _event_utils = __webpack_require__(6)

      function _typeof(obj) {
        '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof(obj) { return typeof obj } }
        else { _typeof = function _typeof(obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj)
      }

      function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest() }

      function _nonIterableRest() { throw new TypeError('Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') }

      function _unsupportedIterableToArray(o, minLen) {
        if (!o)
          return; if (typeof o === 'string')
          return _arrayLikeToArray(o, minLen); let n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor)
          n = o.constructor.name; if (n === 'Map' || n === 'Set')
          return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
          return _arrayLikeToArray(o, minLen)
      }

      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length)
          len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2
      }

      function _iterableToArrayLimit(arr, i) {
        let _i = arr == null ? null : typeof Symbol !== 'undefined' && arr[Symbol.iterator] || arr['@@iterator']; if (_i == null)
          return; const _arr = []; let _n = true; let _d = false; let _s, _e; try {
            for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
              _arr.push(_s.value); if (i && _arr.length === i)
                break
            }
          }
        catch (err) { _d = true; _e = err }
        finally {
          try {
            if (!_n && _i.return != null)
              _i.return()
          }
          finally {
            if (_d)
              throw _e
          }
        } return _arr
      }

      function _arrayWithHoles(arr) {
        if (Array.isArray(arr))
          return arr
      }

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      const HASH_CHANGE_TIMEOUT = 1000
      const POSITION_UPDATED_THRESHOLD = 50
      const UPDATE_VIEWAREA_TIMEOUT = 1000

      function getCurrentHash() {
        return document.location.hash
      }

      const PDFHistory = /* #__PURE__ */(function () {
        function PDFHistory(_ref) {
          const _this = this

          const linkService = _ref.linkService
          const eventBus = _ref.eventBus

          _classCallCheck(this, PDFHistory)

          this.linkService = linkService
          this.eventBus = eventBus
          this._initialized = false
          this._fingerprint = ''
          this.reset()
          this._boundEvents = null
          this._isViewerInPresentationMode = false

          this.eventBus._on('presentationmodechanged', (evt) => {
            _this._isViewerInPresentationMode = evt.state !== _ui_utils.PresentationModeState.NORMAL
          })

          this.eventBus._on('pagesinit', () => {
            _this._isPagesLoaded = false

            _this.eventBus._on('pagesloaded', (evt) => {
              _this._isPagesLoaded = !!evt.pagesCount
            }, {
              once: true,
            })
          })
        }

        _createClass(PDFHistory, [{
          key: 'initialize',
          value: function initialize(_ref2) {
            const fingerprint = _ref2.fingerprint
            const _ref2$resetHistory = _ref2.resetHistory
            const resetHistory = _ref2$resetHistory === void 0 ? false : _ref2$resetHistory
            const _ref2$updateUrl = _ref2.updateUrl
            const updateUrl = _ref2$updateUrl === void 0 ? false : _ref2$updateUrl

            if (!fingerprint || typeof fingerprint !== 'string') {
              console.error('PDFHistory.initialize: The "fingerprint" must be a non-empty string.')
              return
            }

            if (this._initialized) {
              this.reset()
            }

            const reInitialized = this._fingerprint !== '' && this._fingerprint !== fingerprint
            this._fingerprint = fingerprint
            this._updateUrl = updateUrl === true
            this._initialized = true

            this._bindEvents()

            const state = window.history.state
            this._popStateInProgress = false
            this._blockHashChange = 0
            this._currentHash = getCurrentHash()
            this._numPositionUpdates = 0
            this._uid = this._maxUid = 0
            this._destination = null
            this._position = null

            if (!this._isValidState(state, true) || resetHistory) {
              const _this$_parseCurrentHa = this._parseCurrentHash(true)
              const hash = _this$_parseCurrentHa.hash
              const page = _this$_parseCurrentHa.page
              const rotation = _this$_parseCurrentHa.rotation

              if (!hash || reInitialized || resetHistory) {
                this._pushOrReplaceState(null, true)

                return
              }

              this._pushOrReplaceState({
                hash,
                page,
                rotation,
              }, true)

              return
            }

            const destination = state.destination

            this._updateInternalState(destination, state.uid, true)

            if (destination.rotation !== undefined) {
              this._initialRotation = destination.rotation
            }

            if (destination.dest) {
              this._initialBookmark = JSON.stringify(destination.dest)
              this._destination.page = null
            }
            else if (destination.hash) {
              this._initialBookmark = destination.hash
            }
            else if (destination.page) {
              this._initialBookmark = 'page='.concat(destination.page)
            }
          },
        }, {
          key: 'reset',
          value: function reset() {
            if (this._initialized) {
              this._pageHide()

              this._initialized = false

              this._unbindEvents()
            }

            if (this._updateViewareaTimeout) {
              clearTimeout(this._updateViewareaTimeout)
              this._updateViewareaTimeout = null
            }

            this._initialBookmark = null
            this._initialRotation = null
          },
        }, {
          key: 'push',
          value: function push(_ref3) {
            const _this2 = this

            const _ref3$namedDest = _ref3.namedDest
            const namedDest = _ref3$namedDest === void 0 ? null : _ref3$namedDest
            const explicitDest = _ref3.explicitDest
            const pageNumber = _ref3.pageNumber

            if (!this._initialized) {
              return
            }

            if (namedDest && typeof namedDest !== 'string') {
              console.error(`PDFHistory.push: ${'"'.concat(namedDest, '" is not a valid namedDest parameter.')}`)
              return
            }
            else if (!Array.isArray(explicitDest)) {
              console.error(`PDFHistory.push: ${'"'.concat(explicitDest, '" is not a valid explicitDest parameter.')}`)
              return
            }
            else if (!this._isValidPage(pageNumber)) {
              if (pageNumber !== null || this._destination) {
                console.error(`PDFHistory.push: ${'"'.concat(pageNumber, '" is not a valid pageNumber parameter.')}`)
                return
              }
            }

            const hash = namedDest || JSON.stringify(explicitDest)

            if (!hash) {
              return
            }

            let forceReplace = false

            if (this._destination && (isDestHashesEqual(this._destination.hash, hash) || isDestArraysEqual(this._destination.dest, explicitDest))) {
              if (this._destination.page) {
                return
              }

              forceReplace = true
            }

            if (this._popStateInProgress && !forceReplace) {
              return
            }

            this._pushOrReplaceState({
              dest: explicitDest,
              hash,
              page: pageNumber,
              rotation: this.linkService.rotation,
            }, forceReplace)

            if (!this._popStateInProgress) {
              this._popStateInProgress = true
              Promise.resolve().then(() => {
                _this2._popStateInProgress = false
              })
            }
          },
        }, {
          key: 'pushPage',
          value: function pushPage(pageNumber) {
            let _this$_destination
            const _this3 = this

            if (!this._initialized) {
              return
            }

            if (!this._isValidPage(pageNumber)) {
              console.error('PDFHistory.pushPage: "'.concat(pageNumber, '" is not a valid page number.'))
              return
            }

            if (((_this$_destination = this._destination) === null || _this$_destination === void 0 ? void 0 : _this$_destination.page) === pageNumber) {
              return
            }

            if (this._popStateInProgress) {
              return
            }

            this._pushOrReplaceState({
              dest: null,
              hash: 'page='.concat(pageNumber),
              page: pageNumber,
              rotation: this.linkService.rotation,
            })

            if (!this._popStateInProgress) {
              this._popStateInProgress = true
              Promise.resolve().then(() => {
                _this3._popStateInProgress = false
              })
            }
          },
        }, {
          key: 'pushCurrentPosition',
          value: function pushCurrentPosition() {
            if (!this._initialized || this._popStateInProgress) {
              return
            }

            this._tryPushCurrentPosition()
          },
        }, {
          key: 'back',
          value: function back() {
            if (!this._initialized || this._popStateInProgress) {
              return
            }

            const state = window.history.state

            if (this._isValidState(state) && state.uid > 0) {
              window.history.back()
            }
          },
        }, {
          key: 'forward',
          value: function forward() {
            if (!this._initialized || this._popStateInProgress) {
              return
            }

            const state = window.history.state

            if (this._isValidState(state) && state.uid < this._maxUid) {
              window.history.forward()
            }
          },
        }, {
          key: 'popStateInProgress',
          get: function get() {
            return this._initialized && (this._popStateInProgress || this._blockHashChange > 0)
          },
        }, {
          key: 'initialBookmark',
          get: function get() {
            return this._initialized ? this._initialBookmark : null
          },
        }, {
          key: 'initialRotation',
          get: function get() {
            return this._initialized ? this._initialRotation : null
          },
        }, {
          key: '_pushOrReplaceState',
          value: function _pushOrReplaceState(destination) {
            const forceReplace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false
            const shouldReplace = forceReplace || !this._destination
            const newState = {
              fingerprint: this._fingerprint,
              uid: shouldReplace ? this._uid : this._uid + 1,
              destination,
            }

            this._updateInternalState(destination, newState.uid)

            let newUrl

            if (this._updateUrl && destination !== null && destination !== void 0 && destination.hash) {
              const baseUrl = document.location.href.split('#')[0]

              if (!baseUrl.startsWith('file://')) {
                newUrl = ''.concat(baseUrl, '#').concat(destination.hash)
              }
            }

            if (shouldReplace) {
              window.history.replaceState(newState, '', newUrl)
            }
            else {
              window.history.pushState(newState, '', newUrl)
            }
          },
        }, {
          key: '_tryPushCurrentPosition',
          value: function _tryPushCurrentPosition() {
            const temporary = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false

            if (!this._position) {
              return
            }

            let position = this._position

            if (temporary) {
              position = Object.assign(Object.create(null), this._position)
              position.temporary = true
            }

            if (!this._destination) {
              this._pushOrReplaceState(position)

              return
            }

            if (this._destination.temporary) {
              this._pushOrReplaceState(position, true)

              return
            }

            if (this._destination.hash === position.hash) {
              return
            }

            if (!this._destination.page && (POSITION_UPDATED_THRESHOLD <= 0 || this._numPositionUpdates <= POSITION_UPDATED_THRESHOLD)) {
              return
            }

            let forceReplace = false

            if (this._destination.page >= position.first && this._destination.page <= position.page) {
              if (this._destination.dest !== undefined || !this._destination.first) {
                return
              }

              forceReplace = true
            }

            this._pushOrReplaceState(position, forceReplace)
          },
        }, {
          key: '_isValidPage',
          value: function _isValidPage(val) {
            return Number.isInteger(val) && val > 0 && val <= this.linkService.pagesCount
          },
        }, {
          key: '_isValidState',
          value: function _isValidState(state) {
            const checkReload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false

            if (!state) {
              return false
            }

            if (state.fingerprint !== this._fingerprint) {
              if (checkReload) {
                if (typeof state.fingerprint !== 'string' || state.fingerprint.length !== this._fingerprint.length) {
                  return false
                }

                const _performance$getEntri = performance.getEntriesByType('navigation')
                const _performance$getEntri2 = _slicedToArray(_performance$getEntri, 1)
                const perfEntry = _performance$getEntri2[0]

                if ((perfEntry === null || perfEntry === void 0 ? void 0 : perfEntry.type) !== 'reload') {
                  return false
                }
              }
              else {
                return false
              }
            }

            if (!Number.isInteger(state.uid) || state.uid < 0) {
              return false
            }

            if (state.destination === null || _typeof(state.destination) !== 'object') {
              return false
            }

            return true
          },
        }, {
          key: '_updateInternalState',
          value: function _updateInternalState(destination, uid) {
            const removeTemporary = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false

            if (this._updateViewareaTimeout) {
              clearTimeout(this._updateViewareaTimeout)
              this._updateViewareaTimeout = null
            }

            if (removeTemporary && destination !== null && destination !== void 0 && destination.temporary) {
              delete destination.temporary
            }

            this._destination = destination
            this._uid = uid
            this._maxUid = Math.max(this._maxUid, uid)
            this._numPositionUpdates = 0
          },
        }, {
          key: '_parseCurrentHash',
          value: function _parseCurrentHash() {
            const checkNameddest = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false
            const hash = unescape(getCurrentHash()).substring(1)
            const params = (0, _ui_utils.parseQueryString)(hash)
            const nameddest = params.get('nameddest') || ''
            let page = params.get('page') | 0

            if (!this._isValidPage(page) || checkNameddest && nameddest.length > 0) {
              page = null
            }

            return {
              hash,
              page,
              rotation: this.linkService.rotation,
            }
          },
        }, {
          key: '_updateViewarea',
          value: function _updateViewarea(_ref4) {
            const _this4 = this

            const location = _ref4.location

            if (this._updateViewareaTimeout) {
              clearTimeout(this._updateViewareaTimeout)
              this._updateViewareaTimeout = null
            }

            this._position = {
              hash: this._isViewerInPresentationMode ? 'page='.concat(location.pageNumber) : location.pdfOpenParams.substring(1),
              page: this.linkService.page,
              first: location.pageNumber,
              rotation: location.rotation,
            }

            if (this._popStateInProgress) {
              return
            }

            if (POSITION_UPDATED_THRESHOLD > 0 && this._isPagesLoaded && this._destination && !this._destination.page) {
              this._numPositionUpdates++
            }

            if (UPDATE_VIEWAREA_TIMEOUT > 0) {
              this._updateViewareaTimeout = setTimeout(() => {
                if (!_this4._popStateInProgress) {
                  _this4._tryPushCurrentPosition(true)
                }

                _this4._updateViewareaTimeout = null
              }, UPDATE_VIEWAREA_TIMEOUT)
            }
          },
        }, {
          key: '_popState',
          value: function _popState(_ref5) {
            const _this5 = this

            const state = _ref5.state
            const newHash = getCurrentHash()
            const hashChanged = this._currentHash !== newHash
            this._currentHash = newHash

            if (!state) {
              this._uid++

              const _this$_parseCurrentHa2 = this._parseCurrentHash()
              const hash = _this$_parseCurrentHa2.hash
              const page = _this$_parseCurrentHa2.page
              const rotation = _this$_parseCurrentHa2.rotation

              this._pushOrReplaceState({
                hash,
                page,
                rotation,
              }, true)

              return
            }

            if (!this._isValidState(state)) {
              return
            }

            this._popStateInProgress = true

            if (hashChanged) {
              this._blockHashChange++;
              (0, _event_utils.waitOnEventOrTimeout)({
                target: window,
                name: 'hashchange',
                delay: HASH_CHANGE_TIMEOUT,
              }).then(() => {
                _this5._blockHashChange--
              })
            }

            const destination = state.destination

            this._updateInternalState(destination, state.uid, true)

            if ((0, _ui_utils.isValidRotation)(destination.rotation)) {
              this.linkService.rotation = destination.rotation
            }

            if (destination.dest) {
              this.linkService.goToDestination(destination.dest)
            }
            else if (destination.hash) {
              this.linkService.setHash(destination.hash)
            }
            else if (destination.page) {
              this.linkService.page = destination.page
            }

            Promise.resolve().then(() => {
              _this5._popStateInProgress = false
            })
          },
        }, {
          key: '_pageHide',
          value: function _pageHide() {
            if (!this._destination || this._destination.temporary) {
              this._tryPushCurrentPosition()
            }
          },
        }, {
          key: '_bindEvents',
          value: function _bindEvents() {
            if (this._boundEvents) {
              return
            }

            this._boundEvents = {
              updateViewarea: this._updateViewarea.bind(this),
              popState: this._popState.bind(this),
              pageHide: this._pageHide.bind(this),
            }

            this.eventBus._on('updateviewarea', this._boundEvents.updateViewarea)

            window.addEventListener('popstate', this._boundEvents.popState)
            window.addEventListener('pagehide', this._boundEvents.pageHide)
          },
        }, {
          key: '_unbindEvents',
          value: function _unbindEvents() {
            if (!this._boundEvents) {
              return
            }

            this.eventBus._off('updateviewarea', this._boundEvents.updateViewarea)

            window.removeEventListener('popstate', this._boundEvents.popState)
            window.removeEventListener('pagehide', this._boundEvents.pageHide)
            this._boundEvents = null
          },
        }])

        return PDFHistory
      }())

      exports.PDFHistory = PDFHistory

      function isDestHashesEqual(destHash, pushHash) {
        if (typeof destHash !== 'string' || typeof pushHash !== 'string') {
          return false
        }

        if (destHash === pushHash) {
          return true
        }

        const nameddest = (0, _ui_utils.parseQueryString)(destHash).get('nameddest')

        if (nameddest === pushHash) {
          return true
        }

        return false
      }

      function isDestArraysEqual(firstDest, secondDest) {
        function isEntryEqual(first, second) {
          if (_typeof(first) !== _typeof(second)) {
            return false
          }

          if (Array.isArray(first) || Array.isArray(second)) {
            return false
          }

          if (first !== null && _typeof(first) === 'object' && second !== null) {
            if (Object.keys(first).length !== Object.keys(second).length) {
              return false
            }

            for (const key in first) {
              if (!isEntryEqual(first[key], second[key])) {
                return false
              }
            }

            return true
          }

          return first === second || Number.isNaN(first) && Number.isNaN(second)
        }

        if (!(Array.isArray(firstDest) && Array.isArray(secondDest))) {
          return false
        }

        if (firstDest.length !== secondDest.length) {
          return false
        }

        for (let i = 0, ii = firstDest.length; i < ii; i++) {
          if (!isEntryEqual(firstDest[i], secondDest[i])) {
            return false
          }
        }

        return true
      }

      /***/
    },
    /* 19 */
    /***/ (__unused_webpack_module, exports, __webpack_require__) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.PDFLayerViewer = void 0

      const _regenerator = _interopRequireDefault(__webpack_require__(3))

      const _base_tree_viewer = __webpack_require__(13)

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj } }

      function _typeof(obj) {
        '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof(obj) { return typeof obj } }
        else { _typeof = function _typeof(obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj)
      }

      function _createForOfIteratorHelper(o, allowArrayLike) {
        let it = typeof Symbol !== 'undefined' && o[Symbol.iterator] || o['@@iterator']; if (!it) {
          if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === 'number') {
            if (it)
              o = it; let i = 0; const F = function F() { }; return {
                s: F,
                n: function n() {
                  if (i >= o.length)
                    return { done: true }; return { done: false, value: o[i++] }
                },
                e: function e(_e) { throw _e },
                f: F,
              }
          } throw new TypeError('Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.')
        } let normalCompletion = true; let didErr = false; let err; return {
          s: function s() { it = it.call(o) },
          n: function n() { const step = it.next(); normalCompletion = step.done; return step },
          e: function e(_e2) { didErr = true; err = _e2 },
          f: function f() {
            try {
              if (!normalCompletion && it.return != null)
                it.return()
            }
            finally {
              if (didErr)
                throw err
            }
          },
        }
      }

      function _unsupportedIterableToArray(o, minLen) {
        if (!o)
          return; if (typeof o === 'string')
          return _arrayLikeToArray(o, minLen); let n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor)
          n = o.constructor.name; if (n === 'Map' || n === 'Set')
          return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
          return _arrayLikeToArray(o, minLen)
      }

      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length)
          len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2
      }

      function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
        try { var info = gen[key](arg); var value = info.value }
        catch (error) { reject(error); return } if (info.done) { resolve(value) }
        else { Promise.resolve(value).then(_next, _throw) }
      }

      function _asyncToGenerator(fn) { return function () { const self = this; const args = arguments; return new Promise((resolve, reject) => { const gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value) } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err) } _next(undefined) }) } }

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      function _get(target, property, receiver) {
        if (typeof Reflect !== 'undefined' && Reflect.get) { _get = Reflect.get }
        else {
          _get = function _get(target, property, receiver) {
            const base = _superPropBase(target, property); if (!base)
              return; const desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver) } return desc.value
          }
        } return _get(target, property, receiver || target)
      }

      function _superPropBase(object, property) {
        while (!Object.prototype.hasOwnProperty.call(object, property)) {
          object = _getPrototypeOf(object); if (object === null)
            break
        } return object
      }

      function _inherits(subClass, superClass) {
        if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function') } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass)
          _setPrototypeOf(subClass, superClass)
      }

      function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o }; return _setPrototypeOf(o, p) }

      function _createSuper(Derived) {
        const hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() {
          const Super = _getPrototypeOf(Derived); let result; if (hasNativeReflectConstruct) { const NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget) }
          else { result = Super.apply(this, arguments) } return _possibleConstructorReturn(this, result)
        }
      }

      function _possibleConstructorReturn(self, call) {
        if (call && (_typeof(call) === 'object' || typeof call === 'function')) { return call }
        else if (call !== void 0) { throw new TypeError('Derived constructors may only return object or undefined') } return _assertThisInitialized(self)
      }

      function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called') } return self }

      function _isNativeReflectConstruct() {
        if (typeof Reflect === 'undefined' || !Reflect.construct)
          return false; if (Reflect.construct.sham)
          return false; if (typeof Proxy === 'function')
          return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], () => { })); return true }
        catch (e) { return false }
      }

      function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o) }; return _getPrototypeOf(o) }

      const PDFLayerViewer = /* #__PURE__ */(function (_BaseTreeViewer) {
        _inherits(PDFLayerViewer, _BaseTreeViewer)

        const _super = _createSuper(PDFLayerViewer)

        function PDFLayerViewer(options) {
          let _this

          _classCallCheck(this, PDFLayerViewer)

          _this = _super.call(this, options)
          _this.l10n = options.l10n

          _this.eventBus._on('resetlayers', _this._resetLayers.bind(_assertThisInitialized(_this)))

          _this.eventBus._on('togglelayerstree', _this._toggleAllTreeItems.bind(_assertThisInitialized(_this)))

          return _this
        }

        _createClass(PDFLayerViewer, [{
          key: 'reset',
          value: function reset() {
            _get(_getPrototypeOf(PDFLayerViewer.prototype), 'reset', this).call(this)

            this._optionalContentConfig = null
          },
        }, {
          key: '_dispatchEvent',
          value: function _dispatchEvent(layersCount) {
            this.eventBus.dispatch('layersloaded', {
              source: this,
              layersCount,
            })
          },
        }, {
          key: '_bindLink',
          value: function _bindLink(element, _ref) {
            const _this2 = this

            const groupId = _ref.groupId
            const input = _ref.input

            const setVisibility = function setVisibility() {
              _this2._optionalContentConfig.setVisibility(groupId, input.checked)

              _this2.eventBus.dispatch('optionalcontentconfig', {
                source: _this2,
                promise: Promise.resolve(_this2._optionalContentConfig),
              })
            }

            element.onclick = function (evt) {
              if (evt.target === input) {
                setVisibility()
                return true
              }
              else if (evt.target !== element) {
                return true
              }

              input.checked = !input.checked
              setVisibility()
              return false
            }
          },
        }, {
          key: '_setNestedName',
          value: (function () {
            const _setNestedName2 = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee(element, _ref2) {
              let _ref2$name, name

              return _regenerator.default.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _ref2$name = _ref2.name, name = _ref2$name === void 0 ? null : _ref2$name

                      if (!(typeof name === 'string')) {
                        _context.next = 4
                        break
                      }

                      element.textContent = this._normalizeTextContent(name)
                      return _context.abrupt('return')

                    case 4:
                      _context.next = 6
                      return this.l10n.get('additional_layers')

                    case 6:
                      element.textContent = _context.sent
                      element.style.fontStyle = 'italic'

                    case 8:
                    case 'end':
                      return _context.stop()
                  }
                }
              }, _callee, this)
            }))

            function _setNestedName(_x, _x2) {
              return _setNestedName2.apply(this, arguments)
            }

            return _setNestedName
          }()),
        }, {
          key: '_addToggleButton',
          value: function _addToggleButton(div, _ref3) {
            const _ref3$name = _ref3.name
            const name = _ref3$name === void 0 ? null : _ref3$name

            _get(_getPrototypeOf(PDFLayerViewer.prototype), '_addToggleButton', this).call(this, div, name === null)
          },
        }, {
          key: '_toggleAllTreeItems',
          value: function _toggleAllTreeItems() {
            if (!this._optionalContentConfig) {
              return
            }

            _get(_getPrototypeOf(PDFLayerViewer.prototype), '_toggleAllTreeItems', this).call(this)
          },
        }, {
          key: 'render',
          value: function render(_ref4) {
            const optionalContentConfig = _ref4.optionalContentConfig
            const pdfDocument = _ref4.pdfDocument

            if (this._optionalContentConfig) {
              this.reset()
            }

            this._optionalContentConfig = optionalContentConfig || null
            this._pdfDocument = pdfDocument || null
            const groups = optionalContentConfig === null || optionalContentConfig === void 0 ? void 0 : optionalContentConfig.getOrder()

            if (!groups) {
              this._dispatchEvent(0)

              return
            }

            const fragment = document.createDocumentFragment()
            const queue = [{
              parent: fragment,
              groups,
            }]
            let layersCount = 0
            let hasAnyNesting = false

            while (queue.length > 0) {
              const levelData = queue.shift()

              const _iterator = _createForOfIteratorHelper(levelData.groups)
              var _step

              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  const groupId = _step.value
                  const div = document.createElement('div')
                  div.className = 'treeItem'
                  const element = document.createElement('a')
                  div.appendChild(element)

                  if (_typeof(groupId) === 'object') {
                    hasAnyNesting = true

                    this._addToggleButton(div, groupId)

                    this._setNestedName(element, groupId)

                    const itemsDiv = document.createElement('div')
                    itemsDiv.className = 'treeItems'
                    div.appendChild(itemsDiv)
                    queue.push({
                      parent: itemsDiv,
                      groups: groupId.order,
                    })
                  }
                  else {
                    const group = optionalContentConfig.getGroup(groupId)
                    const input = document.createElement('input')

                    this._bindLink(element, {
                      groupId,
                      input,
                    })

                    input.type = 'checkbox'
                    input.id = groupId
                    input.checked = group.visible
                    const label = document.createElement('label')
                    label.setAttribute('for', groupId)
                    label.textContent = this._normalizeTextContent(group.name)
                    element.appendChild(input)
                    element.appendChild(label)
                    layersCount++
                  }

                  levelData.parent.appendChild(div)
                }
              }
              catch (err) {
                _iterator.e(err)
              }
              finally {
                _iterator.f()
              }
            }

            this._finishRendering(fragment, layersCount, hasAnyNesting)
          },
        }, {
          key: '_resetLayers',
          value: (function () {
            const _resetLayers2 = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee2() {
              let optionalContentConfig
              return _regenerator.default.wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      if (this._optionalContentConfig) {
                        _context2.next = 2
                        break
                      }

                      return _context2.abrupt('return')

                    case 2:
                      _context2.next = 4
                      return this._pdfDocument.getOptionalContentConfig()

                    case 4:
                      optionalContentConfig = _context2.sent
                      this.eventBus.dispatch('optionalcontentconfig', {
                        source: this,
                        promise: Promise.resolve(optionalContentConfig),
                      })
                      this.render({
                        optionalContentConfig,
                        pdfDocument: this._pdfDocument,
                      })

                    case 7:
                    case 'end':
                      return _context2.stop()
                  }
                }
              }, _callee2, this)
            }))

            function _resetLayers() {
              return _resetLayers2.apply(this, arguments)
            }

            return _resetLayers
          }()),
        }])

        return PDFLayerViewer
      }(_base_tree_viewer.BaseTreeViewer))

      exports.PDFLayerViewer = PDFLayerViewer

      /***/
    },
    /* 20 */
    /***/ (__unused_webpack_module, exports, __webpack_require__) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.SimpleLinkService = exports.PDFLinkService = void 0

      const _regenerator = _interopRequireDefault(__webpack_require__(3))

      const _pdfjsLib = __webpack_require__(7)

      const _ui_utils = __webpack_require__(5)

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj } }

      function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
        try { var info = gen[key](arg); var value = info.value }
        catch (error) { reject(error); return } if (info.done) { resolve(value) }
        else { Promise.resolve(value).then(_next, _throw) }
      }

      function _asyncToGenerator(fn) { return function () { const self = this; const args = arguments; return new Promise((resolve, reject) => { const gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value) } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err) } _next(undefined) }) } }

      function _typeof(obj) {
        '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof(obj) { return typeof obj } }
        else { _typeof = function _typeof(obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj)
      }

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      const PDFLinkService = /* #__PURE__ */(function () {
        function PDFLinkService() {
          const _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
          const eventBus = _ref.eventBus
          const _ref$externalLinkTarg = _ref.externalLinkTarget
          const externalLinkTarget = _ref$externalLinkTarg === void 0 ? null : _ref$externalLinkTarg
          const _ref$externalLinkRel = _ref.externalLinkRel
          const externalLinkRel = _ref$externalLinkRel === void 0 ? null : _ref$externalLinkRel
          const _ref$ignoreDestinatio = _ref.ignoreDestinationZoom
          const ignoreDestinationZoom = _ref$ignoreDestinatio === void 0 ? false : _ref$ignoreDestinatio

          _classCallCheck(this, PDFLinkService)

          this.eventBus = eventBus
          this.externalLinkTarget = externalLinkTarget
          this.externalLinkRel = externalLinkRel
          this.externalLinkEnabled = true
          this._ignoreDestinationZoom = ignoreDestinationZoom
          this.baseUrl = null
          this.pdfDocument = null
          this.pdfViewer = null
          this.pdfHistory = null
          this._pagesRefCache = null
        }

        _createClass(PDFLinkService, [{
          key: 'setDocument',
          value: function setDocument(pdfDocument) {
            const baseUrl = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null
            this.baseUrl = baseUrl
            this.pdfDocument = pdfDocument
            this._pagesRefCache = Object.create(null)
          },
        }, {
          key: 'setViewer',
          value: function setViewer(pdfViewer) {
            this.pdfViewer = pdfViewer
          },
        }, {
          key: 'setHistory',
          value: function setHistory(pdfHistory) {
            this.pdfHistory = pdfHistory
          },
        }, {
          key: 'pagesCount',
          get: function get() {
            return this.pdfDocument ? this.pdfDocument.numPages : 0
          },
        }, {
          key: 'page',
          get: function get() {
            return this.pdfViewer.currentPageNumber
          },
          set: function set(value) {
            this.pdfViewer.currentPageNumber = value
          },
        }, {
          key: 'rotation',
          get: function get() {
            return this.pdfViewer.pagesRotation
          },
          set: function set(value) {
            this.pdfViewer.pagesRotation = value
          },
        }, {
          key: '_goToDestinationHelper',
          value: function _goToDestinationHelper(rawDest) {
            const _this = this

            const namedDest = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null
            const explicitDest = arguments.length > 2 ? arguments[2] : undefined
            const destRef = explicitDest[0]
            let pageNumber

            if (_typeof(destRef) === 'object' && destRef !== null) {
              pageNumber = this._cachedPageNumber(destRef)

              if (!pageNumber) {
                this.pdfDocument.getPageIndex(destRef).then((pageIndex) => {
                  _this.cachePageRef(pageIndex + 1, destRef)

                  _this._goToDestinationHelper(rawDest, namedDest, explicitDest)
                }).catch(() => {
                  console.error('PDFLinkService._goToDestinationHelper: "'.concat(destRef, '" is not ') + 'a valid page reference, for dest="'.concat(rawDest, '".'))
                })
                return
              }
            }
            else if (Number.isInteger(destRef)) {
              pageNumber = destRef + 1
            }
            else {
              console.error('PDFLinkService._goToDestinationHelper: "'.concat(destRef, '" is not ') + 'a valid destination reference, for dest="'.concat(rawDest, '".'))
              return
            }

            if (!pageNumber || pageNumber < 1 || pageNumber > this.pagesCount) {
              console.error('PDFLinkService._goToDestinationHelper: "'.concat(pageNumber, '" is not ') + 'a valid page number, for dest="'.concat(rawDest, '".'))
              return
            }

            if (this.pdfHistory) {
              this.pdfHistory.pushCurrentPosition()
              this.pdfHistory.push({
                namedDest,
                explicitDest,
                pageNumber,
              })
            }

            this.pdfViewer.scrollPageIntoView({
              pageNumber,
              destArray: explicitDest,
              ignoreDestinationZoom: this._ignoreDestinationZoom,
            })
          },
        }, {
          key: 'goToDestination',
          value: (function () {
            const _goToDestination = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee(dest) {
              let namedDest, explicitDest
              return _regenerator.default.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      if (this.pdfDocument) {
                        _context.next = 2
                        break
                      }

                      return _context.abrupt('return')

                    case 2:
                      if (!(typeof dest === 'string')) {
                        _context.next = 9
                        break
                      }

                      namedDest = dest
                      _context.next = 6
                      return this.pdfDocument.getDestination(dest)

                    case 6:
                      explicitDest = _context.sent
                      _context.next = 13
                      break

                    case 9:
                      namedDest = null
                      _context.next = 12
                      return dest

                    case 12:
                      explicitDest = _context.sent

                    case 13:
                      if (Array.isArray(explicitDest)) {
                        _context.next = 16
                        break
                      }

                      console.error('PDFLinkService.goToDestination: "'.concat(explicitDest, '" is not ') + 'a valid destination array, for dest="'.concat(dest, '".'))
                      return _context.abrupt('return')

                    case 16:
                      this._goToDestinationHelper(dest, namedDest, explicitDest)

                    case 17:
                    case 'end':
                      return _context.stop()
                  }
                }
              }, _callee, this)
            }))

            function goToDestination(_x) {
              return _goToDestination.apply(this, arguments)
            }

            return goToDestination
          }()),
        }, {
          key: 'goToPage',
          value: function goToPage(val) {
            if (!this.pdfDocument) {
              return
            }

            const pageNumber = typeof val === 'string' && this.pdfViewer.pageLabelToPageNumber(val) || val | 0

            if (!(Number.isInteger(pageNumber) && pageNumber > 0 && pageNumber <= this.pagesCount)) {
              console.error('PDFLinkService.goToPage: "'.concat(val, '" is not a valid page.'))
              return
            }

            if (this.pdfHistory) {
              this.pdfHistory.pushCurrentPosition()
              this.pdfHistory.pushPage(pageNumber)
            }

            this.pdfViewer.scrollPageIntoView({
              pageNumber,
            })
          },
        }, {
          key: 'addLinkAttributes',
          value: function addLinkAttributes(link, url) {
            const newWindow = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
            (0, _pdfjsLib.addLinkAttributes)(link, {
              url,
              target: newWindow ? _pdfjsLib.LinkTarget.BLANK : this.externalLinkTarget,
              rel: this.externalLinkRel,
              enabled: this.externalLinkEnabled,
            })
          },
        }, {
          key: 'getDestinationHash',
          value: function getDestinationHash(dest) {
            if (typeof dest === 'string') {
              if (dest.length > 0) {
                return this.getAnchorUrl(`#${escape(dest)}`)
              }
            }
            else if (Array.isArray(dest)) {
              const str = JSON.stringify(dest)

              if (str.length > 0) {
                return this.getAnchorUrl(`#${escape(str)}`)
              }
            }

            return this.getAnchorUrl('')
          },
        }, {
          key: 'getAnchorUrl',
          value: function getAnchorUrl(anchor) {
            return (this.baseUrl || '') + anchor
          },
        }, {
          key: 'setHash',
          value: function setHash(hash) {
            if (!this.pdfDocument) {
              return
            }

            let pageNumber, dest

            if (hash.includes('=')) {
              const params = (0, _ui_utils.parseQueryString)(hash)

              if (params.has('search')) {
                this.eventBus.dispatch('findfromurlhash', {
                  source: this,
                  query: params.get('search').replace(/"/g, ''),
                  phraseSearch: params.get('phrase') === 'true',
                })
              }

              if (params.has('page')) {
                pageNumber = params.get('page') | 0 || 1
              }

              if (params.has('zoom')) {
                const zoomArgs = params.get('zoom').split(',')
                const zoomArg = zoomArgs[0]
                const zoomArgNumber = Number.parseFloat(zoomArg)

                if (!zoomArg.includes('Fit')) {
                  dest = [null, {
                    name: 'XYZ',
                  }, zoomArgs.length > 1 ? zoomArgs[1] | 0 : null, zoomArgs.length > 2 ? zoomArgs[2] | 0 : null, zoomArgNumber ? zoomArgNumber / 100 : zoomArg]
                }
                else {
                  if (zoomArg === 'Fit' || zoomArg === 'FitB') {
                    dest = [null, {
                      name: zoomArg,
                    }]
                  }
                  else if (zoomArg === 'FitH' || zoomArg === 'FitBH' || zoomArg === 'FitV' || zoomArg === 'FitBV') {
                    dest = [null, {
                      name: zoomArg,
                    }, zoomArgs.length > 1 ? zoomArgs[1] | 0 : null]
                  }
                  else if (zoomArg === 'FitR') {
                    if (zoomArgs.length !== 5) {
                      console.error('PDFLinkService.setHash: Not enough parameters for "FitR".')
                    }
                    else {
                      dest = [null, {
                        name: zoomArg,
                      }, zoomArgs[1] | 0, zoomArgs[2] | 0, zoomArgs[3] | 0, zoomArgs[4] | 0]
                    }
                  }
                  else {
                    console.error(`${'PDFLinkService.setHash: "'.concat(zoomArg, '" is not ')}a valid zoom value.`)
                  }
                }
              }

              if (dest) {
                this.pdfViewer.scrollPageIntoView({
                  pageNumber: pageNumber || this.page,
                  destArray: dest,
                  allowNegativeOffset: true,
                })
              }
              else if (pageNumber) {
                this.page = pageNumber
              }

              if (params.has('pagemode')) {
                this.eventBus.dispatch('pagemode', {
                  source: this,
                  mode: params.get('pagemode'),
                })
              }

              if (params.has('nameddest')) {
                this.goToDestination(params.get('nameddest'))
              }
            }
            else {
              dest = unescape(hash)

              try {
                dest = JSON.parse(dest)

                if (!Array.isArray(dest)) {
                  dest = dest.toString()
                }
              }
              catch (ex) { }

              if (typeof dest === 'string' || isValidExplicitDestination(dest)) {
                this.goToDestination(dest)
                return
              }

              console.error(`${'PDFLinkService.setHash: "'.concat(unescape(hash), '" is not ')}a valid destination.`)
            }
          },
        }, {
          key: 'executeNamedAction',
          value: function executeNamedAction(action) {
            let _this$pdfHistory, _this$pdfHistory2

            switch (action) {
              case 'GoBack':
                (_this$pdfHistory = this.pdfHistory) === null || _this$pdfHistory === void 0 ? void 0 : _this$pdfHistory.back()
                break

              case 'GoForward':
                (_this$pdfHistory2 = this.pdfHistory) === null || _this$pdfHistory2 === void 0 ? void 0 : _this$pdfHistory2.forward()
                break

              case 'NextPage':
                this.pdfViewer.nextPage()
                break

              case 'PrevPage':
                this.pdfViewer.previousPage()
                break

              case 'LastPage':
                this.page = this.pagesCount
                break

              case 'FirstPage':
                this.page = 1
                break

              default:
                break
            }

            this.eventBus.dispatch('namedaction', {
              source: this,
              action,
            })
          },
        }, {
          key: 'cachePageRef',
          value: function cachePageRef(pageNum, pageRef) {
            if (!pageRef) {
              return
            }

            const refStr = pageRef.gen === 0 ? ''.concat(pageRef.num, 'R') : ''.concat(pageRef.num, 'R').concat(pageRef.gen)
            this._pagesRefCache[refStr] = pageNum
          },
        }, {
          key: '_cachedPageNumber',
          value: function _cachedPageNumber(pageRef) {
            let _this$_pagesRefCache

            if (!pageRef) {
              return null
            }

            const refStr = pageRef.gen === 0 ? ''.concat(pageRef.num, 'R') : ''.concat(pageRef.num, 'R').concat(pageRef.gen)
            return ((_this$_pagesRefCache = this._pagesRefCache) === null || _this$_pagesRefCache === void 0 ? void 0 : _this$_pagesRefCache[refStr]) || null
          },
        }, {
          key: 'isPageVisible',
          value: function isPageVisible(pageNumber) {
            return this.pdfViewer.isPageVisible(pageNumber)
          },
        }, {
          key: 'isPageCached',
          value: function isPageCached(pageNumber) {
            return this.pdfViewer.isPageCached(pageNumber)
          },
        }])

        return PDFLinkService
      }())

      exports.PDFLinkService = PDFLinkService

      function isValidExplicitDestination(dest) {
        if (!Array.isArray(dest)) {
          return false
        }

        const destLength = dest.length

        if (destLength < 2) {
          return false
        }

        const page = dest[0]

        if (!(_typeof(page) === 'object' && Number.isInteger(page.num) && Number.isInteger(page.gen)) && !(Number.isInteger(page) && page >= 0)) {
          return false
        }

        const zoom = dest[1]

        if (!(_typeof(zoom) === 'object' && typeof zoom.name === 'string')) {
          return false
        }

        let allowNull = true

        switch (zoom.name) {
          case 'XYZ':
            if (destLength !== 5) {
              return false
            }

            break

          case 'Fit':
          case 'FitB':
            return destLength === 2

          case 'FitH':
          case 'FitBH':
          case 'FitV':
          case 'FitBV':
            if (destLength !== 3) {
              return false
            }

            break

          case 'FitR':
            if (destLength !== 6) {
              return false
            }

            allowNull = false
            break

          default:
            return false
        }

        for (let i = 2; i < destLength; i++) {
          const param = dest[i]

          if (!(typeof param === 'number' || allowNull && param === null)) {
            return false
          }
        }

        return true
      }

      const SimpleLinkService = /* #__PURE__ */(function () {
        function SimpleLinkService() {
          _classCallCheck(this, SimpleLinkService)

          this.externalLinkEnabled = true
        }

        _createClass(SimpleLinkService, [{
          key: 'pagesCount',
          get: function get() {
            return 0
          },
        }, {
          key: 'page',
          get: function get() {
            return 0
          },
          set: function set(value) { },
        }, {
          key: 'rotation',
          get: function get() {
            return 0
          },
          set: function set(value) { },
        }, {
          key: 'goToDestination',
          value: (function () {
            const _goToDestination2 = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee2(dest) {
              return _regenerator.default.wrap((_context2) => {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                    case 'end':
                      return _context2.stop()
                  }
                }
              }, _callee2)
            }))

            function goToDestination(_x2) {
              return _goToDestination2.apply(this, arguments)
            }

            return goToDestination
          }()),
        }, {
          key: 'goToPage',
          value: function goToPage(val) { },
        }, {
          key: 'addLinkAttributes',
          value: function addLinkAttributes(link, url) {
            const newWindow = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
            (0, _pdfjsLib.addLinkAttributes)(link, {
              url,
              enabled: this.externalLinkEnabled,
            })
          },
        }, {
          key: 'getDestinationHash',
          value: function getDestinationHash(dest) {
            return '#'
          },
        }, {
          key: 'getAnchorUrl',
          value: function getAnchorUrl(hash) {
            return '#'
          },
        }, {
          key: 'setHash',
          value: function setHash(hash) { },
        }, {
          key: 'executeNamedAction',
          value: function executeNamedAction(action) { },
        }, {
          key: 'cachePageRef',
          value: function cachePageRef(pageNum, pageRef) { },
        }, {
          key: 'isPageVisible',
          value: function isPageVisible(pageNumber) {
            return true
          },
        }, {
          key: 'isPageCached',
          value: function isPageCached(pageNumber) {
            return true
          },
        }])

        return SimpleLinkService
      }())

      exports.SimpleLinkService = SimpleLinkService

      /***/
    },
    /* 21 */
    /***/ (__unused_webpack_module, exports, __webpack_require__) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.PDFOutlineViewer = void 0

      const _regenerator = _interopRequireDefault(__webpack_require__(3))

      const _base_tree_viewer = __webpack_require__(13)

      const _pdfjsLib = __webpack_require__(7)

      const _ui_utils = __webpack_require__(5)

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj } }

      function _typeof(obj) {
        '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof(obj) { return typeof obj } }
        else { _typeof = function _typeof(obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj)
      }

      function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest() }

      function _nonIterableRest() { throw new TypeError('Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') }

      function _iterableToArrayLimit(arr, i) {
        let _i = arr == null ? null : typeof Symbol !== 'undefined' && arr[Symbol.iterator] || arr['@@iterator']; if (_i == null)
          return; const _arr = []; let _n = true; let _d = false; let _s, _e; try {
            for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
              _arr.push(_s.value); if (i && _arr.length === i)
                break
            }
          }
        catch (err) { _d = true; _e = err }
        finally {
          try {
            if (!_n && _i.return != null)
              _i.return()
          }
          finally {
            if (_d)
              throw _e
          }
        } return _arr
      }

      function _arrayWithHoles(arr) {
        if (Array.isArray(arr))
          return arr
      }

      function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
        try { var info = gen[key](arg); var value = info.value }
        catch (error) { reject(error); return } if (info.done) { resolve(value) }
        else { Promise.resolve(value).then(_next, _throw) }
      }

      function _asyncToGenerator(fn) { return function () { const self = this; const args = arguments; return new Promise((resolve, reject) => { const gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value) } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err) } _next(undefined) }) } }

      function _createForOfIteratorHelper(o, allowArrayLike) {
        let it = typeof Symbol !== 'undefined' && o[Symbol.iterator] || o['@@iterator']; if (!it) {
          if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === 'number') {
            if (it)
              o = it; let i = 0; const F = function F() { }; return {
                s: F,
                n: function n() {
                  if (i >= o.length)
                    return { done: true }; return { done: false, value: o[i++] }
                },
                e: function e(_e2) { throw _e2 },
                f: F,
              }
          } throw new TypeError('Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.')
        } let normalCompletion = true; let didErr = false; let err; return {
          s: function s() { it = it.call(o) },
          n: function n() { const step = it.next(); normalCompletion = step.done; return step },
          e: function e(_e3) { didErr = true; err = _e3 },
          f: function f() {
            try {
              if (!normalCompletion && it.return != null)
                it.return()
            }
            finally {
              if (didErr)
                throw err
            }
          },
        }
      }

      function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread() }

      function _nonIterableSpread() { throw new TypeError('Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') }

      function _unsupportedIterableToArray(o, minLen) {
        if (!o)
          return; if (typeof o === 'string')
          return _arrayLikeToArray(o, minLen); let n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor)
          n = o.constructor.name; if (n === 'Map' || n === 'Set')
          return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
          return _arrayLikeToArray(o, minLen)
      }

      function _iterableToArray(iter) {
        if (typeof Symbol !== 'undefined' && iter[Symbol.iterator] != null || iter['@@iterator'] != null)
          return Array.from(iter)
      }

      function _arrayWithoutHoles(arr) {
        if (Array.isArray(arr))
          return _arrayLikeToArray(arr)
      }

      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length)
          len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2
      }

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      function _get(target, property, receiver) {
        if (typeof Reflect !== 'undefined' && Reflect.get) { _get = Reflect.get }
        else {
          _get = function _get(target, property, receiver) {
            const base = _superPropBase(target, property); if (!base)
              return; const desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver) } return desc.value
          }
        } return _get(target, property, receiver || target)
      }

      function _superPropBase(object, property) {
        while (!Object.prototype.hasOwnProperty.call(object, property)) {
          object = _getPrototypeOf(object); if (object === null)
            break
        } return object
      }

      function _inherits(subClass, superClass) {
        if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function') } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass)
          _setPrototypeOf(subClass, superClass)
      }

      function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o }; return _setPrototypeOf(o, p) }

      function _createSuper(Derived) {
        const hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() {
          const Super = _getPrototypeOf(Derived); let result; if (hasNativeReflectConstruct) { const NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget) }
          else { result = Super.apply(this, arguments) } return _possibleConstructorReturn(this, result)
        }
      }

      function _possibleConstructorReturn(self, call) {
        if (call && (_typeof(call) === 'object' || typeof call === 'function')) { return call }
        else if (call !== void 0) { throw new TypeError('Derived constructors may only return object or undefined') } return _assertThisInitialized(self)
      }

      function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called') } return self }

      function _isNativeReflectConstruct() {
        if (typeof Reflect === 'undefined' || !Reflect.construct)
          return false; if (Reflect.construct.sham)
          return false; if (typeof Proxy === 'function')
          return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], () => { })); return true }
        catch (e) { return false }
      }

      function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o) }; return _getPrototypeOf(o) }

      const PDFOutlineViewer = /* #__PURE__ */(function (_BaseTreeViewer) {
        _inherits(PDFOutlineViewer, _BaseTreeViewer)

        const _super = _createSuper(PDFOutlineViewer)

        function PDFOutlineViewer(options) {
          let _this

          _classCallCheck(this, PDFOutlineViewer)

          _this = _super.call(this, options)
          _this.linkService = options.linkService

          _this.eventBus._on('toggleoutlinetree', _this._toggleAllTreeItems.bind(_assertThisInitialized(_this)))

          _this.eventBus._on('currentoutlineitem', _this._currentOutlineItem.bind(_assertThisInitialized(_this)))

          _this.eventBus._on('pagechanging', (evt) => {
            _this._currentPageNumber = evt.pageNumber
          })

          _this.eventBus._on('pagesloaded', (evt) => {
            _this._isPagesLoaded = !!evt.pagesCount

            if (_this._currentOutlineItemCapability && !_this._currentOutlineItemCapability.settled) {
              _this._currentOutlineItemCapability.resolve(_this._isPagesLoaded)
            }
          })

          _this.eventBus._on('sidebarviewchanged', (evt) => {
            _this._sidebarView = evt.view
          })

          return _this
        }

        _createClass(PDFOutlineViewer, [{
          key: 'reset',
          value: function reset() {
            _get(_getPrototypeOf(PDFOutlineViewer.prototype), 'reset', this).call(this)

            this._outline = null
            this._pageNumberToDestHashCapability = null
            this._currentPageNumber = 1
            this._isPagesLoaded = null

            if (this._currentOutlineItemCapability && !this._currentOutlineItemCapability.settled) {
              this._currentOutlineItemCapability.resolve(false)
            }

            this._currentOutlineItemCapability = null
          },
        }, {
          key: '_dispatchEvent',
          value: function _dispatchEvent(outlineCount) {
            let _this$_pdfDocument

            this._currentOutlineItemCapability = (0, _pdfjsLib.createPromiseCapability)()

            if (outlineCount === 0 || (_this$_pdfDocument = this._pdfDocument) !== null && _this$_pdfDocument !== void 0 && _this$_pdfDocument.loadingParams.disableAutoFetch) {
              this._currentOutlineItemCapability.resolve(false)
            }
            else if (this._isPagesLoaded !== null) {
              this._currentOutlineItemCapability.resolve(this._isPagesLoaded)
            }

            this.eventBus.dispatch('outlineloaded', {
              source: this,
              outlineCount,
              currentOutlineItemPromise: this._currentOutlineItemCapability.promise,
            })
          },
        }, {
          key: '_bindLink',
          value: function _bindLink(element, _ref) {
            const _this2 = this

            const url = _ref.url
            const newWindow = _ref.newWindow
            const dest = _ref.dest
            const linkService = this.linkService

            if (url) {
              linkService.addLinkAttributes(element, url, newWindow)
              return
            }

            element.href = linkService.getDestinationHash(dest)

            element.onclick = function (evt) {
              _this2._updateCurrentTreeItem(evt.target.parentNode)

              if (dest) {
                linkService.goToDestination(dest)
              }

              return false
            }
          },
        }, {
          key: '_setStyles',
          value: function _setStyles(element, _ref2) {
            const bold = _ref2.bold
            const italic = _ref2.italic

            if (bold) {
              element.style.fontWeight = 'bold'
            }

            if (italic) {
              element.style.fontStyle = 'italic'
            }
          },
        }, {
          key: '_addToggleButton',
          value: function _addToggleButton(div, _ref3) {
            const count = _ref3.count
            const items = _ref3.items
            let hidden = false

            if (count < 0) {
              let totalCount = items.length

              if (totalCount > 0) {
                const queue = _toConsumableArray(items)

                while (queue.length > 0) {
                  const _queue$shift = queue.shift()
                  const nestedCount = _queue$shift.count
                  const nestedItems = _queue$shift.items

                  if (nestedCount > 0 && nestedItems.length > 0) {
                    totalCount += nestedItems.length
                    queue.push.apply(queue, _toConsumableArray(nestedItems))
                  }
                }
              }

              if (Math.abs(count) === totalCount) {
                hidden = true
              }
            }

            _get(_getPrototypeOf(PDFOutlineViewer.prototype), '_addToggleButton', this).call(this, div, hidden)
          },
        }, {
          key: '_toggleAllTreeItems',
          value: function _toggleAllTreeItems() {
            if (!this._outline) {
              return
            }

            _get(_getPrototypeOf(PDFOutlineViewer.prototype), '_toggleAllTreeItems', this).call(this)
          },
        }, {
          key: 'render',
          value: function render(_ref4) {
            const outline = _ref4.outline
            const pdfDocument = _ref4.pdfDocument

            if (this._outline) {
              this.reset()
            }

            this._outline = outline || null
            this._pdfDocument = pdfDocument || null

            if (!outline) {
              this._dispatchEvent(0)

              return
            }

            const fragment = document.createDocumentFragment()
            const queue = [{
              parent: fragment,
              items: outline,
            }]
            let outlineCount = 0
            let hasAnyNesting = false

            while (queue.length > 0) {
              const levelData = queue.shift()

              const _iterator = _createForOfIteratorHelper(levelData.items)
              var _step

              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  const item = _step.value
                  const div = document.createElement('div')
                  div.className = 'treeItem'
                  const element = document.createElement('a')

                  this._bindLink(element, item)

                  this._setStyles(element, item)

                  element.textContent = this._normalizeTextContent(item.title)
                  div.appendChild(element)

                  if (item.items.length > 0) {
                    hasAnyNesting = true

                    this._addToggleButton(div, item)

                    const itemsDiv = document.createElement('div')
                    itemsDiv.className = 'treeItems'
                    div.appendChild(itemsDiv)
                    queue.push({
                      parent: itemsDiv,
                      items: item.items,
                    })
                  }

                  levelData.parent.appendChild(div)
                  outlineCount++
                }
              }
              catch (err) {
                _iterator.e(err)
              }
              finally {
                _iterator.f()
              }
            }

            this._finishRendering(fragment, outlineCount, hasAnyNesting)
          },
        }, {
          key: '_currentOutlineItem',
          value: (function () {
            const _currentOutlineItem2 = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee() {
              let pageNumberToDestHash, i, destHash, linkElement
              return _regenerator.default.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      if (this._isPagesLoaded) {
                        _context.next = 2
                        break
                      }

                      throw new Error('_currentOutlineItem: All pages have not been loaded.')

                    case 2:
                      if (!(!this._outline || !this._pdfDocument)) {
                        _context.next = 4
                        break
                      }

                      return _context.abrupt('return')

                    case 4:
                      _context.next = 6
                      return this._getPageNumberToDestHash(this._pdfDocument)

                    case 6:
                      pageNumberToDestHash = _context.sent

                      if (pageNumberToDestHash) {
                        _context.next = 9
                        break
                      }

                      return _context.abrupt('return')

                    case 9:
                      this._updateCurrentTreeItem(null)

                      if (!(this._sidebarView !== _ui_utils.SidebarView.OUTLINE)) {
                        _context.next = 12
                        break
                      }

                      return _context.abrupt('return')

                    case 12:
                      i = this._currentPageNumber

                    case 13:
                      if (!(i > 0)) {
                        _context.next = 25
                        break
                      }

                      destHash = pageNumberToDestHash.get(i)

                      if (destHash) {
                        _context.next = 17
                        break
                      }

                      return _context.abrupt('continue', 22)

                    case 17:
                      linkElement = this.container.querySelector('a[href="'.concat(destHash, '"]'))

                      if (linkElement) {
                        _context.next = 20
                        break
                      }

                      return _context.abrupt('continue', 22)

                    case 20:
                      this._scrollToCurrentTreeItem(linkElement.parentNode)

                      return _context.abrupt('break', 25)

                    case 22:
                      i--
                      _context.next = 13
                      break

                    case 25:
                    case 'end':
                      return _context.stop()
                  }
                }
              }, _callee, this)
            }))

            function _currentOutlineItem() {
              return _currentOutlineItem2.apply(this, arguments)
            }

            return _currentOutlineItem
          }()),
        }, {
          key: '_getPageNumberToDestHash',
          value: (function () {
            const _getPageNumberToDestHash2 = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee2(pdfDocument) {
              let pageNumberToDestHash, pageNumberNesting, queue, levelData, currentNesting, _iterator2, _step2, _step2$value, dest, items, explicitDest, pageNumber, _explicitDest, _explicitDest2, destRef, destHash

              return _regenerator.default.wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      if (!this._pageNumberToDestHashCapability) {
                        _context2.next = 2
                        break
                      }

                      return _context2.abrupt('return', this._pageNumberToDestHashCapability.promise)

                    case 2:
                      this._pageNumberToDestHashCapability = (0, _pdfjsLib.createPromiseCapability)()
                      pageNumberToDestHash = new Map(), pageNumberNesting = new Map()
                      queue = [{
                        nesting: 0,
                        items: this._outline,
                      }]

                    case 5:
                      if (!(queue.length > 0)) {
                        _context2.next = 56
                        break
                      }

                      levelData = queue.shift(), currentNesting = levelData.nesting
                      _iterator2 = _createForOfIteratorHelper(levelData.items)
                      _context2.prev = 8

                      _iterator2.s()

                    case 10:
                      if ((_step2 = _iterator2.n()).done) {
                        _context2.next = 46
                        break
                      }

                      _step2$value = _step2.value, dest = _step2$value.dest, items = _step2$value.items
                      explicitDest = void 0, pageNumber = void 0

                      if (!(typeof dest === 'string')) {
                        _context2.next = 21
                        break
                      }

                      _context2.next = 16
                      return pdfDocument.getDestination(dest)

                    case 16:
                      explicitDest = _context2.sent

                      if (!(pdfDocument !== this._pdfDocument)) {
                        _context2.next = 19
                        break
                      }

                      return _context2.abrupt('return', null)

                    case 19:
                      _context2.next = 22
                      break

                    case 21:
                      explicitDest = dest

                    case 22:
                      if (!Array.isArray(explicitDest)) {
                        _context2.next = 43
                        break
                      }

                      _explicitDest = explicitDest, _explicitDest2 = _slicedToArray(_explicitDest, 1), destRef = _explicitDest2[0]

                      if (!(_typeof(destRef) === 'object' && destRef !== null)) {
                        _context2.next = 41
                        break
                      }

                      pageNumber = this.linkService._cachedPageNumber(destRef)

                      if (pageNumber) {
                        _context2.next = 39
                        break
                      }

                      _context2.prev = 27
                      _context2.next = 30
                      return pdfDocument.getPageIndex(destRef)

                    case 30:
                      _context2.t0 = _context2.sent
                      pageNumber = _context2.t0 + 1

                      if (!(pdfDocument !== this._pdfDocument)) {
                        _context2.next = 34
                        break
                      }

                      return _context2.abrupt('return', null)

                    case 34:
                      this.linkService.cachePageRef(pageNumber, destRef)
                      _context2.next = 39
                      break

                    case 37:
                      _context2.prev = 37
                      _context2.t1 = _context2.catch(27)

                    case 39:
                      _context2.next = 42
                      break

                    case 41:
                      if (Number.isInteger(destRef)) {
                        pageNumber = destRef + 1
                      }

                    case 42:
                      if (Number.isInteger(pageNumber) && (!pageNumberToDestHash.has(pageNumber) || currentNesting > pageNumberNesting.get(pageNumber))) {
                        destHash = this.linkService.getDestinationHash(dest)
                        pageNumberToDestHash.set(pageNumber, destHash)
                        pageNumberNesting.set(pageNumber, currentNesting)
                      }

                    case 43:
                      if (items.length > 0) {
                        queue.push({
                          nesting: currentNesting + 1,
                          items,
                        })
                      }

                    case 44:
                      _context2.next = 10
                      break

                    case 46:
                      _context2.next = 51
                      break

                    case 48:
                      _context2.prev = 48
                      _context2.t2 = _context2.catch(8)

                      _iterator2.e(_context2.t2)

                    case 51:
                      _context2.prev = 51

                      _iterator2.f()

                      return _context2.finish(51)

                    case 54:
                      _context2.next = 5
                      break

                    case 56:
                      this._pageNumberToDestHashCapability.resolve(pageNumberToDestHash.size > 0 ? pageNumberToDestHash : null)

                      return _context2.abrupt('return', this._pageNumberToDestHashCapability.promise)

                    case 58:
                    case 'end':
                      return _context2.stop()
                  }
                }
              }, _callee2, this, [[8, 48, 51, 54], [27, 37]])
            }))

            function _getPageNumberToDestHash(_x) {
              return _getPageNumberToDestHash2.apply(this, arguments)
            }

            return _getPageNumberToDestHash
          }()),
        }])

        return PDFOutlineViewer
      }(_base_tree_viewer.BaseTreeViewer))

      exports.PDFOutlineViewer = PDFOutlineViewer

      /***/
    },
    /* 22 */
    /***/ (__unused_webpack_module, exports, __webpack_require__) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.PDFPresentationMode = void 0

      const _ui_utils = __webpack_require__(5)

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      const DELAY_BEFORE_RESETTING_SWITCH_IN_PROGRESS = 1500
      const DELAY_BEFORE_HIDING_CONTROLS = 3000
      const ACTIVE_SELECTOR = 'pdfPresentationMode'
      const CONTROLS_SELECTOR = 'pdfPresentationModeControls'
      const MOUSE_SCROLL_COOLDOWN_TIME = 50
      const PAGE_SWITCH_THRESHOLD = 0.1
      const SWIPE_MIN_DISTANCE_THRESHOLD = 50
      const SWIPE_ANGLE_THRESHOLD = Math.PI / 6

      const PDFPresentationMode = /* #__PURE__ */(function () {
        function PDFPresentationMode(_ref) {
          const container = _ref.container
          const pdfViewer = _ref.pdfViewer
          const eventBus = _ref.eventBus

          _classCallCheck(this, PDFPresentationMode)

          this.container = container
          this.pdfViewer = pdfViewer
          this.eventBus = eventBus
          this.active = false
          this.args = null
          this.contextMenuOpen = false
          this.mouseScrollTimeStamp = 0
          this.mouseScrollDelta = 0
          this.touchSwipeState = null
        }

        _createClass(PDFPresentationMode, [{
          key: 'request',
          value: function request() {
            if (this.switchInProgress || this.active || !this.pdfViewer.pagesCount) {
              return false
            }

            this._addFullscreenChangeListeners()

            this._setSwitchInProgress()

            this._notifyStateChange()

            if (this.container.requestFullscreen) {
              this.container.requestFullscreen()
            }
            else if (this.container.mozRequestFullScreen) {
              this.container.mozRequestFullScreen()
            }
            else if (this.container.webkitRequestFullscreen) {
              this.container.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
            }
            else {
              return false
            }

            this.args = {
              pageNumber: this.pdfViewer.currentPageNumber,
              scaleValue: this.pdfViewer.currentScaleValue,
              scrollMode: this.pdfViewer.scrollMode,
              spreadMode: this.pdfViewer.spreadMode,
            }
            return true
          },
        }, {
          key: '_mouseWheel',
          value: function _mouseWheel(evt) {
            if (!this.active) {
              return
            }

            evt.preventDefault()
            const delta = (0, _ui_utils.normalizeWheelEventDelta)(evt)
            const currentTime = Date.now()
            const storedTime = this.mouseScrollTimeStamp

            if (currentTime > storedTime && currentTime - storedTime < MOUSE_SCROLL_COOLDOWN_TIME) {
              return
            }

            if (this.mouseScrollDelta > 0 && delta < 0 || this.mouseScrollDelta < 0 && delta > 0) {
              this._resetMouseScrollState()
            }

            this.mouseScrollDelta += delta

            if (Math.abs(this.mouseScrollDelta) >= PAGE_SWITCH_THRESHOLD) {
              const totalDelta = this.mouseScrollDelta

              this._resetMouseScrollState()

              const success = totalDelta > 0 ? this.pdfViewer.previousPage() : this.pdfViewer.nextPage()

              if (success) {
                this.mouseScrollTimeStamp = currentTime
              }
            }
          },
        }, {
          key: 'isFullscreen',
          get: function get() {
            return !!(document.fullscreenElement || document.mozFullScreen || document.webkitIsFullScreen)
          },
        }, {
          key: '_notifyStateChange',
          value: function _notifyStateChange() {
            let state = _ui_utils.PresentationModeState.NORMAL

            if (this.switchInProgress) {
              state = _ui_utils.PresentationModeState.CHANGING
            }
            else if (this.active) {
              state = _ui_utils.PresentationModeState.FULLSCREEN
            }

            this.eventBus.dispatch('presentationmodechanged', {
              source: this,
              state,
            })
          },
        }, {
          key: '_setSwitchInProgress',
          value: function _setSwitchInProgress() {
            const _this = this

            if (this.switchInProgress) {
              clearTimeout(this.switchInProgress)
            }

            this.switchInProgress = setTimeout(() => {
              _this._removeFullscreenChangeListeners()

              delete _this.switchInProgress

              _this._notifyStateChange()
            }, DELAY_BEFORE_RESETTING_SWITCH_IN_PROGRESS)
          },
        }, {
          key: '_resetSwitchInProgress',
          value: function _resetSwitchInProgress() {
            if (this.switchInProgress) {
              clearTimeout(this.switchInProgress)
              delete this.switchInProgress
            }
          },
        }, {
          key: '_enter',
          value: function _enter() {
            const _this2 = this

            this.active = true

            this._resetSwitchInProgress()

            this._notifyStateChange()

            this.container.classList.add(ACTIVE_SELECTOR)
            setTimeout(() => {
              _this2.pdfViewer.scrollMode = _ui_utils.ScrollMode.PAGE
              _this2.pdfViewer.spreadMode = _ui_utils.SpreadMode.NONE
              _this2.pdfViewer.currentPageNumber = _this2.args.pageNumber
              _this2.pdfViewer.currentScaleValue = 'page-fit'
            }, 0)

            this._addWindowListeners()

            this._showControls()

            this.contextMenuOpen = false
            window.getSelection().removeAllRanges()
          },
        }, {
          key: '_exit',
          value: function _exit() {
            const _this3 = this

            const pageNumber = this.pdfViewer.currentPageNumber
            this.container.classList.remove(ACTIVE_SELECTOR)
            setTimeout(() => {
              _this3.active = false

              _this3._removeFullscreenChangeListeners()

              _this3._notifyStateChange()

              _this3.pdfViewer.scrollMode = _this3.args.scrollMode
              _this3.pdfViewer.spreadMode = _this3.args.spreadMode
              _this3.pdfViewer.currentScaleValue = _this3.args.scaleValue
              _this3.pdfViewer.currentPageNumber = pageNumber
              _this3.args = null
            }, 0)

            this._removeWindowListeners()

            this._hideControls()

            this._resetMouseScrollState()

            this.contextMenuOpen = false
          },
        }, {
          key: '_mouseDown',
          value: function _mouseDown(evt) {
            if (this.contextMenuOpen) {
              this.contextMenuOpen = false
              evt.preventDefault()
              return
            }

            if (evt.button === 0) {
              const isInternalLink = evt.target.href && evt.target.classList.contains('internalLink')

              if (!isInternalLink) {
                evt.preventDefault()

                if (evt.shiftKey) {
                  this.pdfViewer.previousPage()
                }
                else {
                  this.pdfViewer.nextPage()
                }
              }
            }
          },
        }, {
          key: '_contextMenu',
          value: function _contextMenu() {
            this.contextMenuOpen = true
          },
        }, {
          key: '_showControls',
          value: function _showControls() {
            const _this4 = this

            if (this.controlsTimeout) {
              clearTimeout(this.controlsTimeout)
            }
            else {
              this.container.classList.add(CONTROLS_SELECTOR)
            }

            this.controlsTimeout = setTimeout(() => {
              _this4.container.classList.remove(CONTROLS_SELECTOR)

              delete _this4.controlsTimeout
            }, DELAY_BEFORE_HIDING_CONTROLS)
          },
        }, {
          key: '_hideControls',
          value: function _hideControls() {
            if (!this.controlsTimeout) {
              return
            }

            clearTimeout(this.controlsTimeout)
            this.container.classList.remove(CONTROLS_SELECTOR)
            delete this.controlsTimeout
          },
        }, {
          key: '_resetMouseScrollState',
          value: function _resetMouseScrollState() {
            this.mouseScrollTimeStamp = 0
            this.mouseScrollDelta = 0
          },
        }, {
          key: '_touchSwipe',
          value: function _touchSwipe(evt) {
            if (!this.active) {
              return
            }

            if (evt.touches.length > 1) {
              this.touchSwipeState = null
              return
            }

            switch (evt.type) {
              case 'touchstart':
                this.touchSwipeState = {
                  startX: evt.touches[0].pageX,
                  startY: evt.touches[0].pageY,
                  endX: evt.touches[0].pageX,
                  endY: evt.touches[0].pageY,
                }
                break

              case 'touchmove':
                if (this.touchSwipeState === null) {
                  return
                }

                this.touchSwipeState.endX = evt.touches[0].pageX
                this.touchSwipeState.endY = evt.touches[0].pageY
                evt.preventDefault()
                break

              case 'touchend':
                if (this.touchSwipeState === null) {
                  return
                }

                var delta = 0
                var dx = this.touchSwipeState.endX - this.touchSwipeState.startX
                var dy = this.touchSwipeState.endY - this.touchSwipeState.startY
                var absAngle = Math.abs(Math.atan2(dy, dx))

                if (Math.abs(dx) > SWIPE_MIN_DISTANCE_THRESHOLD && (absAngle <= SWIPE_ANGLE_THRESHOLD || absAngle >= Math.PI - SWIPE_ANGLE_THRESHOLD)) {
                  delta = dx
                }
                else if (Math.abs(dy) > SWIPE_MIN_DISTANCE_THRESHOLD && Math.abs(absAngle - Math.PI / 2) <= SWIPE_ANGLE_THRESHOLD) {
                  delta = dy
                }

                if (delta > 0) {
                  this.pdfViewer.previousPage()
                }
                else if (delta < 0) {
                  this.pdfViewer.nextPage()
                }

                break
            }
          },
        }, {
          key: '_addWindowListeners',
          value: function _addWindowListeners() {
            this.showControlsBind = this._showControls.bind(this)
            this.mouseDownBind = this._mouseDown.bind(this)
            this.mouseWheelBind = this._mouseWheel.bind(this)
            this.resetMouseScrollStateBind = this._resetMouseScrollState.bind(this)
            this.contextMenuBind = this._contextMenu.bind(this)
            this.touchSwipeBind = this._touchSwipe.bind(this)
            window.addEventListener('mousemove', this.showControlsBind)
            window.addEventListener('mousedown', this.mouseDownBind)
            window.addEventListener('wheel', this.mouseWheelBind, {
              passive: false,
            })
            window.addEventListener('keydown', this.resetMouseScrollStateBind)
            window.addEventListener('contextmenu', this.contextMenuBind)
            window.addEventListener('touchstart', this.touchSwipeBind)
            window.addEventListener('touchmove', this.touchSwipeBind)
            window.addEventListener('touchend', this.touchSwipeBind)
          },
        }, {
          key: '_removeWindowListeners',
          value: function _removeWindowListeners() {
            window.removeEventListener('mousemove', this.showControlsBind)
            window.removeEventListener('mousedown', this.mouseDownBind)
            window.removeEventListener('wheel', this.mouseWheelBind, {
              passive: false,
            })
            window.removeEventListener('keydown', this.resetMouseScrollStateBind)
            window.removeEventListener('contextmenu', this.contextMenuBind)
            window.removeEventListener('touchstart', this.touchSwipeBind)
            window.removeEventListener('touchmove', this.touchSwipeBind)
            window.removeEventListener('touchend', this.touchSwipeBind)
            delete this.showControlsBind
            delete this.mouseDownBind
            delete this.mouseWheelBind
            delete this.resetMouseScrollStateBind
            delete this.contextMenuBind
            delete this.touchSwipeBind
          },
        }, {
          key: '_fullscreenChange',
          value: function _fullscreenChange() {
            if (this.isFullscreen) {
              this._enter()
            }
            else {
              this._exit()
            }
          },
        }, {
          key: '_addFullscreenChangeListeners',
          value: function _addFullscreenChangeListeners() {
            this.fullscreenChangeBind = this._fullscreenChange.bind(this)
            window.addEventListener('fullscreenchange', this.fullscreenChangeBind)
            window.addEventListener('mozfullscreenchange', this.fullscreenChangeBind)
            window.addEventListener('webkitfullscreenchange', this.fullscreenChangeBind)
          },
        }, {
          key: '_removeFullscreenChangeListeners',
          value: function _removeFullscreenChangeListeners() {
            window.removeEventListener('fullscreenchange', this.fullscreenChangeBind)
            window.removeEventListener('mozfullscreenchange', this.fullscreenChangeBind)
            window.removeEventListener('webkitfullscreenchange', this.fullscreenChangeBind)
            delete this.fullscreenChangeBind
          },
        }])

        return PDFPresentationMode
      }())

      exports.PDFPresentationMode = PDFPresentationMode

      /***/
    },
    /* 23 */
    /***/ (__unused_webpack_module, exports, __webpack_require__) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.PDFRenderingQueue = void 0

      const _pdfjsLib = __webpack_require__(7)

      const _ui_utils = __webpack_require__(5)

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      const CLEANUP_TIMEOUT = 30000

      const PDFRenderingQueue = /* #__PURE__ */(function () {
        function PDFRenderingQueue() {
          _classCallCheck(this, PDFRenderingQueue)

          this.pdfViewer = null
          this.pdfThumbnailViewer = null
          this.onIdle = null
          this.highestPriorityPage = null
          this.idleTimeout = null
          this.printing = false
          this.isThumbnailViewEnabled = false
        }

        _createClass(PDFRenderingQueue, [{
          key: 'setViewer',
          value: function setViewer(pdfViewer) {
            this.pdfViewer = pdfViewer
          },
        }, {
          key: 'setThumbnailViewer',
          value: function setThumbnailViewer(pdfThumbnailViewer) {
            this.pdfThumbnailViewer = pdfThumbnailViewer
          },
        }, {
          key: 'isHighestPriority',
          value: function isHighestPriority(view) {
            return this.highestPriorityPage === view.renderingId
          },
        }, {
          key: 'hasViewer',
          value: function hasViewer() {
            return !!this.pdfViewer
          },
        }, {
          key: 'renderHighestPriority',
          value: function renderHighestPriority(currentlyVisiblePages) {
            let _this$pdfThumbnailVie

            if (this.idleTimeout) {
              clearTimeout(this.idleTimeout)
              this.idleTimeout = null
            }

            if (this.pdfViewer.forceRendering(currentlyVisiblePages)) {
              return
            }

            if (this.isThumbnailViewEnabled && (_this$pdfThumbnailVie = this.pdfThumbnailViewer) !== null && _this$pdfThumbnailVie !== void 0 && _this$pdfThumbnailVie.forceRendering()) {
              return
            }

            if (this.printing) {
              return
            }

            if (this.onIdle) {
              this.idleTimeout = setTimeout(this.onIdle.bind(this), CLEANUP_TIMEOUT)
            }
          },
        }, {
          key: 'getHighestPriority',
          value: function getHighestPriority(visible, views, scrolledDown) {
            const preRenderExtra = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false
            const visibleViews = visible.views
            const numVisible = visibleViews.length

            if (numVisible === 0) {
              return null
            }

            for (let i = 0; i < numVisible; i++) {
              const view = visibleViews[i].view

              if (!this.isViewFinished(view)) {
                return view
              }
            }

            const firstId = visible.first.id
            const lastId = visible.last.id

            if (lastId - firstId + 1 > numVisible) {
              const visibleIds = visible.ids

              for (let _i = 1, ii = lastId - firstId; _i < ii; _i++) {
                const holeId = scrolledDown ? firstId + _i : lastId - _i

                if (visibleIds.has(holeId)) {
                  continue
                }

                const holeView = views[holeId - 1]

                if (!this.isViewFinished(holeView)) {
                  return holeView
                }
              }
            }

            let preRenderIndex = scrolledDown ? lastId : firstId - 2
            let preRenderView = views[preRenderIndex]

            if (preRenderView && !this.isViewFinished(preRenderView)) {
              return preRenderView
            }

            if (preRenderExtra) {
              preRenderIndex += scrolledDown ? 1 : -1
              preRenderView = views[preRenderIndex]

              if (preRenderView && !this.isViewFinished(preRenderView)) {
                return preRenderView
              }
            }

            return null
          },
        }, {
          key: 'isViewFinished',
          value: function isViewFinished(view) {
            return view.renderingState === _ui_utils.RenderingStates.FINISHED
          },
        }, {
          key: 'renderView',
          value: function renderView(view) {
            const _this = this

            switch (view.renderingState) {
              case _ui_utils.RenderingStates.FINISHED:
                return false

              case _ui_utils.RenderingStates.PAUSED:
                this.highestPriorityPage = view.renderingId
                view.resume()
                break

              case _ui_utils.RenderingStates.RUNNING:
                this.highestPriorityPage = view.renderingId
                break

              case _ui_utils.RenderingStates.INITIAL:
                this.highestPriorityPage = view.renderingId
                view.draw().finally(() => {
                  _this.renderHighestPriority()
                }).catch((reason) => {
                  if (reason instanceof _pdfjsLib.RenderingCancelledException) {
                    return
                  }

                  console.error('renderView: "'.concat(reason, '"'))
                })
                break
            }

            return true
          },
        }])

        return PDFRenderingQueue
      }())

      exports.PDFRenderingQueue = PDFRenderingQueue

      /***/
    },
    /* 24 */
    /***/ (__unused_webpack_module, exports, __webpack_require__) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.PDFScriptingManager = void 0

      const _regenerator = _interopRequireDefault(__webpack_require__(3))

      const _ui_utils = __webpack_require__(5)

      const _pdfjsLib = __webpack_require__(7)

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj } }

      function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread() }

      function _nonIterableSpread() { throw new TypeError('Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') }

      function _iterableToArray(iter) {
        if (typeof Symbol !== 'undefined' && iter[Symbol.iterator] != null || iter['@@iterator'] != null)
          return Array.from(iter)
      }

      function _arrayWithoutHoles(arr) {
        if (Array.isArray(arr))
          return _arrayLikeToArray(arr)
      }

      function ownKeys(object, enumerableOnly) { const keys = Object.keys(object); if (Object.getOwnPropertySymbols) { let symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter((sym) => { return Object.getOwnPropertyDescriptor(object, sym).enumerable }) } keys.push.apply(keys, symbols) } return keys }

      function _objectSpread(target) {
        for (let i = 1; i < arguments.length; i++) {
          var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach((key) => { _defineProperty(target, key, source[key]) }) }
          else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) }
          else { ownKeys(Object(source)).forEach((key) => { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)) }) }
        } return target
      }

      function _defineProperty(obj, key, value) {
        if (key in obj) { Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true }) }
        else { obj[key] = value } return obj
      }

      function _createForOfIteratorHelper(o, allowArrayLike) {
        let it = typeof Symbol !== 'undefined' && o[Symbol.iterator] || o['@@iterator']; if (!it) {
          if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === 'number') {
            if (it)
              o = it; let i = 0; const F = function F() { }; return {
                s: F,
                n: function n() {
                  if (i >= o.length)
                    return { done: true }; return { done: false, value: o[i++] }
                },
                e: function e(_e2) { throw _e2 },
                f: F,
              }
          } throw new TypeError('Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.')
        } let normalCompletion = true; let didErr = false; let err; return {
          s: function s() { it = it.call(o) },
          n: function n() { const step = it.next(); normalCompletion = step.done; return step },
          e: function e(_e3) { didErr = true; err = _e3 },
          f: function f() {
            try {
              if (!normalCompletion && it.return != null)
                it.return()
            }
            finally {
              if (didErr)
                throw err
            }
          },
        }
      }

      function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest() }

      function _nonIterableRest() { throw new TypeError('Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') }

      function _unsupportedIterableToArray(o, minLen) {
        if (!o)
          return; if (typeof o === 'string')
          return _arrayLikeToArray(o, minLen); let n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor)
          n = o.constructor.name; if (n === 'Map' || n === 'Set')
          return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
          return _arrayLikeToArray(o, minLen)
      }

      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length)
          len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2
      }

      function _iterableToArrayLimit(arr, i) {
        let _i = arr == null ? null : typeof Symbol !== 'undefined' && arr[Symbol.iterator] || arr['@@iterator']; if (_i == null)
          return; const _arr = []; let _n = true; let _d = false; let _s, _e; try {
            for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
              _arr.push(_s.value); if (i && _arr.length === i)
                break
            }
          }
        catch (err) { _d = true; _e = err }
        finally {
          try {
            if (!_n && _i.return != null)
              _i.return()
          }
          finally {
            if (_d)
              throw _e
          }
        } return _arr
      }

      function _arrayWithHoles(arr) {
        if (Array.isArray(arr))
          return arr
      }

      function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
        try { var info = gen[key](arg); var value = info.value }
        catch (error) { reject(error); return } if (info.done) { resolve(value) }
        else { Promise.resolve(value).then(_next, _throw) }
      }

      function _asyncToGenerator(fn) { return function () { const self = this; const args = arguments; return new Promise((resolve, reject) => { const gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value) } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err) } _next(undefined) }) } }

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      const PDFScriptingManager = /* #__PURE__ */(function () {
        function PDFScriptingManager(_ref) {
          const eventBus = _ref.eventBus
          const _ref$sandboxBundleSrc = _ref.sandboxBundleSrc
          const sandboxBundleSrc = _ref$sandboxBundleSrc === void 0 ? null : _ref$sandboxBundleSrc
          const _ref$scriptingFactory = _ref.scriptingFactory
          const scriptingFactory = _ref$scriptingFactory === void 0 ? null : _ref$scriptingFactory
          const _ref$docPropertiesLoo = _ref.docPropertiesLookup
          const docPropertiesLookup = _ref$docPropertiesLoo === void 0 ? null : _ref$docPropertiesLoo

          _classCallCheck(this, PDFScriptingManager)

          this._pdfDocument = null
          this._pdfViewer = null
          this._closeCapability = null
          this._destroyCapability = null
          this._scripting = null
          this._mouseState = Object.create(null)
          this._ready = false
          this._eventBus = eventBus
          this._sandboxBundleSrc = sandboxBundleSrc
          this._scriptingFactory = scriptingFactory
          this._docPropertiesLookup = docPropertiesLookup
        }

        _createClass(PDFScriptingManager, [{
          key: 'setViewer',
          value: function setViewer(pdfViewer) {
            this._pdfViewer = pdfViewer
          },
        }, {
          key: 'setDocument',
          value: (function () {
            const _setDocument = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee2(pdfDocument) {
              const _this = this
              let _this$_scripting3

              let _yield$Promise$all, _yield$Promise$all2, objects, calculationOrder, docActions, _iterator, _step, _step$value, name, listener, _iterator2, _step2, _step2$value, _name, _listener, docProperties

              return _regenerator.default.wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      if (!this._pdfDocument) {
                        _context2.next = 3
                        break
                      }

                      _context2.next = 3
                      return this._destroyScripting()

                    case 3:
                      this._pdfDocument = pdfDocument

                      if (pdfDocument) {
                        _context2.next = 6
                        break
                      }

                      return _context2.abrupt('return')

                    case 6:
                      _context2.next = 8
                      return Promise.all([pdfDocument.getFieldObjects(), pdfDocument.getCalculationOrderIds(), pdfDocument.getJSActions()])

                    case 8:
                      _yield$Promise$all = _context2.sent
                      _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 3)
                      objects = _yield$Promise$all2[0]
                      calculationOrder = _yield$Promise$all2[1]
                      docActions = _yield$Promise$all2[2]

                      if (!(!objects && !docActions)) {
                        _context2.next = 17
                        break
                      }

                      _context2.next = 16
                      return this._destroyScripting()

                    case 16:
                      return _context2.abrupt('return')

                    case 17:
                      if (!(pdfDocument !== this._pdfDocument)) {
                        _context2.next = 19
                        break
                      }

                      return _context2.abrupt('return')

                    case 19:
                      _context2.prev = 19
                      this._scripting = this._createScripting()
                      _context2.next = 29
                      break

                    case 23:
                      _context2.prev = 23
                      _context2.t0 = _context2.catch(19)
                      console.error('PDFScriptingManager.setDocument: "'.concat(_context2.t0 === null || _context2.t0 === void 0 ? void 0 : _context2.t0.message, '".'))
                      _context2.next = 28
                      return this._destroyScripting()

                    case 28:
                      return _context2.abrupt('return')

                    case 29:
                      this._internalEvents.set('updatefromsandbox', (event) => {
                        if ((event === null || event === void 0 ? void 0 : event.source) !== window) {
                          return
                        }

                        _this._updateFromSandbox(event.detail)
                      })

                      this._internalEvents.set('dispatcheventinsandbox', (event) => {
                        let _this$_scripting;

                        (_this$_scripting = _this._scripting) === null || _this$_scripting === void 0 ? void 0 : _this$_scripting.dispatchEventInSandbox(event.detail)
                      })

                      this._internalEvents.set('pagechanging', (_ref2) => {
                        const pageNumber = _ref2.pageNumber
                        const previous = _ref2.previous

                        if (pageNumber === previous) {
                          return
                        }

                        _this._dispatchPageClose(previous)

                        _this._dispatchPageOpen(pageNumber)
                      })

                      this._internalEvents.set('pagerendered', (_ref3) => {
                        const pageNumber = _ref3.pageNumber

                        if (!_this._pageOpenPending.has(pageNumber)) {
                          return
                        }

                        if (pageNumber !== _this._pdfViewer.currentPageNumber) {
                          return
                        }

                        _this._dispatchPageOpen(pageNumber)
                      })

                      this._internalEvents.set('pagesdestroy', /* #__PURE__ */(function () {
                        const _ref4 = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee(event) {
                          let _this$_scripting2, _this$_closeCapabilit

                          return _regenerator.default.wrap((_context) => {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  _context.next = 2
                                  return _this._dispatchPageClose(_this._pdfViewer.currentPageNumber)

                                case 2:
                                  _context.next = 4
                                  return (_this$_scripting2 = _this._scripting) === null || _this$_scripting2 === void 0
                                    ? void 0
                                    : _this$_scripting2.dispatchEventInSandbox({
                                      id: 'doc',
                                      name: 'WillClose',
                                    })

                                case 4:
                                  (_this$_closeCapabilit = _this._closeCapability) === null || _this$_closeCapabilit === void 0 ? void 0 : _this$_closeCapabilit.resolve()

                                case 5:
                                case 'end':
                                  return _context.stop()
                              }
                            }
                          }, _callee)
                        }))

                        return function (_x2) {
                          return _ref4.apply(this, arguments)
                        }
                      }()))

                      this._domEvents.set('mousedown', (event) => {
                        _this._mouseState.isDown = true
                      })

                      this._domEvents.set('mouseup', (event) => {
                        _this._mouseState.isDown = false
                      })

                      _iterator = _createForOfIteratorHelper(this._internalEvents)

                      try {
                        for (_iterator.s(); !(_step = _iterator.n()).done;) {
                          _step$value = _slicedToArray(_step.value, 2), name = _step$value[0], listener = _step$value[1]

                          this._eventBus._on(name, listener)
                        }
                      }
                      catch (err) {
                        _iterator.e(err)
                      }
                      finally {
                        _iterator.f()
                      }

                      _iterator2 = _createForOfIteratorHelper(this._domEvents)

                      try {
                        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                          _step2$value = _slicedToArray(_step2.value, 2), _name = _step2$value[0], _listener = _step2$value[1]
                          window.addEventListener(_name, _listener)
                        }
                      }
                      catch (err) {
                        _iterator2.e(err)
                      }
                      finally {
                        _iterator2.f()
                      }

                      _context2.prev = 40
                      _context2.next = 43
                      return this._getDocProperties()

                    case 43:
                      docProperties = _context2.sent

                      if (!(pdfDocument !== this._pdfDocument)) {
                        _context2.next = 46
                        break
                      }

                      return _context2.abrupt('return')

                    case 46:
                      _context2.next = 48
                      return this._scripting.createSandbox({
                        objects,
                        calculationOrder,
                        appInfo: {
                          platform: navigator.platform,
                          language: navigator.language,
                        },
                        docInfo: _objectSpread(_objectSpread({}, docProperties), {}, {
                          actions: docActions,
                        }),
                      })

                    case 48:
                      this._eventBus.dispatch('sandboxcreated', {
                        source: this,
                      })

                      _context2.next = 57
                      break

                    case 51:
                      _context2.prev = 51
                      _context2.t1 = _context2.catch(40)
                      console.error('PDFScriptingManager.setDocument: "'.concat(_context2.t1 === null || _context2.t1 === void 0 ? void 0 : _context2.t1.message, '".'))
                      _context2.next = 56
                      return this._destroyScripting()

                    case 56:
                      return _context2.abrupt('return')

                    case 57:
                      _context2.next = 59
                      return (_this$_scripting3 = this._scripting) === null || _this$_scripting3 === void 0
                        ? void 0
                        : _this$_scripting3.dispatchEventInSandbox({
                          id: 'doc',
                          name: 'Open',
                        })

                    case 59:
                      _context2.next = 61
                      return this._dispatchPageOpen(this._pdfViewer.currentPageNumber, true)

                    case 61:
                      Promise.resolve().then(() => {
                        if (pdfDocument === _this._pdfDocument) {
                          _this._ready = true
                        }
                      })

                    case 62:
                    case 'end':
                      return _context2.stop()
                  }
                }
              }, _callee2, this, [[19, 23], [40, 51]])
            }))

            function setDocument(_x) {
              return _setDocument.apply(this, arguments)
            }

            return setDocument
          }()),
        }, {
          key: 'dispatchWillSave',
          value: (function () {
            const _dispatchWillSave = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee3(detail) {
              let _this$_scripting4

              return _regenerator.default.wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      return _context3.abrupt('return', (_this$_scripting4 = this._scripting) === null || _this$_scripting4 === void 0
                        ? void 0
                        : _this$_scripting4.dispatchEventInSandbox({
                          id: 'doc',
                          name: 'WillSave',
                        }))

                    case 1:
                    case 'end':
                      return _context3.stop()
                  }
                }
              }, _callee3, this)
            }))

            function dispatchWillSave(_x3) {
              return _dispatchWillSave.apply(this, arguments)
            }

            return dispatchWillSave
          }()),
        }, {
          key: 'dispatchDidSave',
          value: (function () {
            const _dispatchDidSave = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee4(detail) {
              let _this$_scripting5

              return _regenerator.default.wrap(function _callee4$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      return _context4.abrupt('return', (_this$_scripting5 = this._scripting) === null || _this$_scripting5 === void 0
                        ? void 0
                        : _this$_scripting5.dispatchEventInSandbox({
                          id: 'doc',
                          name: 'DidSave',
                        }))

                    case 1:
                    case 'end':
                      return _context4.stop()
                  }
                }
              }, _callee4, this)
            }))

            function dispatchDidSave(_x4) {
              return _dispatchDidSave.apply(this, arguments)
            }

            return dispatchDidSave
          }()),
        }, {
          key: 'dispatchWillPrint',
          value: (function () {
            const _dispatchWillPrint = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee5(detail) {
              let _this$_scripting6

              return _regenerator.default.wrap(function _callee5$(_context5) {
                while (1) {
                  switch (_context5.prev = _context5.next) {
                    case 0:
                      return _context5.abrupt('return', (_this$_scripting6 = this._scripting) === null || _this$_scripting6 === void 0
                        ? void 0
                        : _this$_scripting6.dispatchEventInSandbox({
                          id: 'doc',
                          name: 'WillPrint',
                        }))

                    case 1:
                    case 'end':
                      return _context5.stop()
                  }
                }
              }, _callee5, this)
            }))

            function dispatchWillPrint(_x5) {
              return _dispatchWillPrint.apply(this, arguments)
            }

            return dispatchWillPrint
          }()),
        }, {
          key: 'dispatchDidPrint',
          value: (function () {
            const _dispatchDidPrint = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee6(detail) {
              let _this$_scripting7

              return _regenerator.default.wrap(function _callee6$(_context6) {
                while (1) {
                  switch (_context6.prev = _context6.next) {
                    case 0:
                      return _context6.abrupt('return', (_this$_scripting7 = this._scripting) === null || _this$_scripting7 === void 0
                        ? void 0
                        : _this$_scripting7.dispatchEventInSandbox({
                          id: 'doc',
                          name: 'DidPrint',
                        }))

                    case 1:
                    case 'end':
                      return _context6.stop()
                  }
                }
              }, _callee6, this)
            }))

            function dispatchDidPrint(_x6) {
              return _dispatchDidPrint.apply(this, arguments)
            }

            return dispatchDidPrint
          }()),
        }, {
          key: 'mouseState',
          get: function get() {
            return this._mouseState
          },
        }, {
          key: 'destroyPromise',
          get: function get() {
            let _this$_destroyCapabil

            return ((_this$_destroyCapabil = this._destroyCapability) === null || _this$_destroyCapabil === void 0 ? void 0 : _this$_destroyCapabil.promise) || null
          },
        }, {
          key: 'ready',
          get: function get() {
            return this._ready
          },
        }, {
          key: '_internalEvents',
          get: function get() {
            return (0, _pdfjsLib.shadow)(this, '_internalEvents', new Map())
          },
        }, {
          key: '_domEvents',
          get: function get() {
            return (0, _pdfjsLib.shadow)(this, '_domEvents', new Map())
          },
        }, {
          key: '_pageOpenPending',
          get: function get() {
            return (0, _pdfjsLib.shadow)(this, '_pageOpenPending', new Set())
          },
        }, {
          key: '_visitedPages',
          get: function get() {
            return (0, _pdfjsLib.shadow)(this, '_visitedPages', new Map())
          },
        }, {
          key: '_updateFromSandbox',
          value: (function () {
            const _updateFromSandbox2 = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee7(detail) {
              let isInPresentationMode, id, siblings, command, value, modes, ids, _iterator3, _step3, elementId, element, _this$_pdfDocument

              return _regenerator.default.wrap(function _callee7$(_context7) {
                while (1) {
                  switch (_context7.prev = _context7.next) {
                    case 0:
                      isInPresentationMode = this._pdfViewer.isInPresentationMode || this._pdfViewer.isChangingPresentationMode
                      id = detail.id, siblings = detail.siblings, command = detail.command, value = detail.value

                      if (id) {
                        _context7.next = 46
                        break
                      }

                      _context7.t0 = command
                      _context7.next = _context7.t0 === 'clear' ? 6 : _context7.t0 === 'error' ? 8 : _context7.t0 === 'layout' ? 10 : _context7.t0 === 'page-num' ? 15 : _context7.t0 === 'print' ? 17 : _context7.t0 === 'println' ? 21 : _context7.t0 === 'zoom' ? 23 : _context7.t0 === 'SaveAs' ? 27 : _context7.t0 === 'FirstPage' ? 29 : _context7.t0 === 'LastPage' ? 31 : _context7.t0 === 'NextPage' ? 33 : _context7.t0 === 'PrevPage' ? 35 : _context7.t0 === 'ZoomViewIn' ? 37 : _context7.t0 === 'ZoomViewOut' ? 41 : 45
                      break

                    case 6:
                      console.clear()
                      return _context7.abrupt('break', 45)

                    case 8:
                      console.error(value)
                      return _context7.abrupt('break', 45)

                    case 10:
                      if (!isInPresentationMode) {
                        _context7.next = 12
                        break
                      }

                      return _context7.abrupt('return')

                    case 12:
                      modes = (0, _ui_utils.apiPageLayoutToViewerModes)(value)
                      this._pdfViewer.spreadMode = modes.spreadMode
                      return _context7.abrupt('break', 45)

                    case 15:
                      this._pdfViewer.currentPageNumber = value + 1
                      return _context7.abrupt('break', 45)

                    case 17:
                      _context7.next = 19
                      return this._pdfViewer.pagesPromise

                    case 19:
                      this._eventBus.dispatch('print', {
                        source: this,
                      })

                      return _context7.abrupt('break', 45)

                    case 21:
                      console.log(value)
                      return _context7.abrupt('break', 45)

                    case 23:
                      if (!isInPresentationMode) {
                        _context7.next = 25
                        break
                      }

                      return _context7.abrupt('return')

                    case 25:
                      this._pdfViewer.currentScaleValue = value
                      return _context7.abrupt('break', 45)

                    case 27:
                      this._eventBus.dispatch('save', {
                        source: this,
                      })

                      return _context7.abrupt('break', 45)

                    case 29:
                      this._pdfViewer.currentPageNumber = 1
                      return _context7.abrupt('break', 45)

                    case 31:
                      this._pdfViewer.currentPageNumber = this._pdfViewer.pagesCount
                      return _context7.abrupt('break', 45)

                    case 33:
                      this._pdfViewer.nextPage()

                      return _context7.abrupt('break', 45)

                    case 35:
                      this._pdfViewer.previousPage()

                      return _context7.abrupt('break', 45)

                    case 37:
                      if (!isInPresentationMode) {
                        _context7.next = 39
                        break
                      }

                      return _context7.abrupt('return')

                    case 39:
                      this._pdfViewer.increaseScale()

                      return _context7.abrupt('break', 45)

                    case 41:
                      if (!isInPresentationMode) {
                        _context7.next = 43
                        break
                      }

                      return _context7.abrupt('return')

                    case 43:
                      this._pdfViewer.decreaseScale()

                      return _context7.abrupt('break', 45)

                    case 45:
                      return _context7.abrupt('return')

                    case 46:
                      if (!isInPresentationMode) {
                        _context7.next = 49
                        break
                      }

                      if (!detail.focus) {
                        _context7.next = 49
                        break
                      }

                      return _context7.abrupt('return')

                    case 49:
                      delete detail.id
                      delete detail.siblings
                      ids = siblings ? [id].concat(_toConsumableArray(siblings)) : [id]
                      _iterator3 = _createForOfIteratorHelper(ids)

                      try {
                        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                          elementId = _step3.value
                          element = document.getElementById(elementId)

                          if (element) {
                            element.dispatchEvent(new CustomEvent('updatefromsandbox', {
                              detail,
                            }))
                          }
                          else {
                            (_this$_pdfDocument = this._pdfDocument) === null || _this$_pdfDocument === void 0 ? void 0 : _this$_pdfDocument.annotationStorage.setValue(elementId, detail)
                          }
                        }
                      }
                      catch (err) {
                        _iterator3.e(err)
                      }
                      finally {
                        _iterator3.f()
                      }

                    case 54:
                    case 'end':
                      return _context7.stop()
                  }
                }
              }, _callee7, this)
            }))

            function _updateFromSandbox(_x7) {
              return _updateFromSandbox2.apply(this, arguments)
            }

            return _updateFromSandbox
          }()),
        }, {
          key: '_dispatchPageOpen',
          value: (function () {
            const _dispatchPageOpen2 = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee9(pageNumber) {
              const _this2 = this

              let initialize
              let pdfDocument
              let visitedPages
              let pageView
              let actionsPromise
              const _args9 = arguments
              return _regenerator.default.wrap(function _callee9$(_context9) {
                while (1) {
                  switch (_context9.prev = _context9.next) {
                    case 0:
                      initialize = _args9.length > 1 && _args9[1] !== undefined ? _args9[1] : false
                      pdfDocument = this._pdfDocument, visitedPages = this._visitedPages

                      if (initialize) {
                        this._closeCapability = (0, _pdfjsLib.createPromiseCapability)()
                      }

                      if (this._closeCapability) {
                        _context9.next = 5
                        break
                      }

                      return _context9.abrupt('return')

                    case 5:
                      pageView = this._pdfViewer.getPageView(pageNumber - 1)

                      if (!((pageView === null || pageView === void 0 ? void 0 : pageView.renderingState) !== _ui_utils.RenderingStates.FINISHED)) {
                        _context9.next = 9
                        break
                      }

                      this._pageOpenPending.add(pageNumber)

                      return _context9.abrupt('return')

                    case 9:
                      this._pageOpenPending.delete(pageNumber)

                      actionsPromise = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee8() {
                        let _pageView$pdfPage, _this2$_scripting

                        let actions
                        return _regenerator.default.wrap((_context8) => {
                          while (1) {
                            switch (_context8.prev = _context8.next) {
                              case 0:
                                _context8.next = 2
                                return !visitedPages.has(pageNumber) ? (_pageView$pdfPage = pageView.pdfPage) === null || _pageView$pdfPage === void 0 ? void 0 : _pageView$pdfPage.getJSActions() : null

                              case 2:
                                actions = _context8.sent

                                if (!(pdfDocument !== _this2._pdfDocument)) {
                                  _context8.next = 5
                                  break
                                }

                                return _context8.abrupt('return')

                              case 5:
                                _context8.next = 7
                                return (_this2$_scripting = _this2._scripting) === null || _this2$_scripting === void 0
                                  ? void 0
                                  : _this2$_scripting.dispatchEventInSandbox({
                                    id: 'page',
                                    name: 'PageOpen',
                                    pageNumber,
                                    actions,
                                  })

                              case 7:
                              case 'end':
                                return _context8.stop()
                            }
                          }
                        }, _callee8)
                      }))()
                      visitedPages.set(pageNumber, actionsPromise)

                    case 12:
                    case 'end':
                      return _context9.stop()
                  }
                }
              }, _callee9, this)
            }))

            function _dispatchPageOpen(_x8) {
              return _dispatchPageOpen2.apply(this, arguments)
            }

            return _dispatchPageOpen
          }()),
        }, {
          key: '_dispatchPageClose',
          value: (function () {
            const _dispatchPageClose2 = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee10(pageNumber) {
              let _this$_scripting8

              let pdfDocument, visitedPages, actionsPromise
              return _regenerator.default.wrap(function _callee10$(_context10) {
                while (1) {
                  switch (_context10.prev = _context10.next) {
                    case 0:
                      pdfDocument = this._pdfDocument, visitedPages = this._visitedPages

                      if (this._closeCapability) {
                        _context10.next = 3
                        break
                      }

                      return _context10.abrupt('return')

                    case 3:
                      if (!this._pageOpenPending.has(pageNumber)) {
                        _context10.next = 5
                        break
                      }

                      return _context10.abrupt('return')

                    case 5:
                      actionsPromise = visitedPages.get(pageNumber)

                      if (actionsPromise) {
                        _context10.next = 8
                        break
                      }

                      return _context10.abrupt('return')

                    case 8:
                      visitedPages.set(pageNumber, null)
                      _context10.next = 11
                      return actionsPromise

                    case 11:
                      if (!(pdfDocument !== this._pdfDocument)) {
                        _context10.next = 13
                        break
                      }

                      return _context10.abrupt('return')

                    case 13:
                      _context10.next = 15
                      return (_this$_scripting8 = this._scripting) === null || _this$_scripting8 === void 0
                        ? void 0
                        : _this$_scripting8.dispatchEventInSandbox({
                          id: 'page',
                          name: 'PageClose',
                          pageNumber,
                        })

                    case 15:
                    case 'end':
                      return _context10.stop()
                  }
                }
              }, _callee10, this)
            }))

            function _dispatchPageClose(_x9) {
              return _dispatchPageClose2.apply(this, arguments)
            }

            return _dispatchPageClose
          }()),
        }, {
          key: '_getDocProperties',
          value: (function () {
            const _getDocProperties2 = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee11() {
              return _regenerator.default.wrap(function _callee11$(_context11) {
                while (1) {
                  switch (_context11.prev = _context11.next) {
                    case 0:
                      if (!this._docPropertiesLookup) {
                        _context11.next = 2
                        break
                      }

                      return _context11.abrupt('return', this._docPropertiesLookup(this._pdfDocument))

                    case 2:
                      throw new Error('_getDocProperties: Unable to lookup properties.')

                    case 3:
                    case 'end':
                      return _context11.stop()
                  }
                }
              }, _callee11, this)
            }))

            function _getDocProperties() {
              return _getDocProperties2.apply(this, arguments)
            }

            return _getDocProperties
          }()),
        }, {
          key: '_createScripting',
          value: function _createScripting() {
            this._destroyCapability = (0, _pdfjsLib.createPromiseCapability)()

            if (this._scripting) {
              throw new Error('_createScripting: Scripting already exists.')
            }

            if (this._scriptingFactory) {
              return this._scriptingFactory.createScripting({
                sandboxBundleSrc: this._sandboxBundleSrc,
              })
            }

            throw new Error('_createScripting: Cannot create scripting.')
          },
        }, {
          key: '_destroyScripting',
          value: (function () {
            const _destroyScripting2 = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee12() {
              let _this$_destroyCapabil3

              let _this$_destroyCapabil2, _iterator4, _step4, _step4$value, name, listener, _iterator5, _step5, _step5$value, _name2, _listener2

              return _regenerator.default.wrap(function _callee12$(_context12) {
                while (1) {
                  switch (_context12.prev = _context12.next) {
                    case 0:
                      if (this._scripting) {
                        _context12.next = 4
                        break
                      }

                      this._pdfDocument = null;
                      (_this$_destroyCapabil2 = this._destroyCapability) === null || _this$_destroyCapabil2 === void 0 ? void 0 : _this$_destroyCapabil2.resolve()
                      return _context12.abrupt('return')

                    case 4:
                      if (!this._closeCapability) {
                        _context12.next = 8
                        break
                      }

                      _context12.next = 7
                      return Promise.race([this._closeCapability.promise, new Promise((resolve) => {
                        setTimeout(resolve, 1000)
                      })]).catch((reason) => { })

                    case 7:
                      this._closeCapability = null

                    case 8:
                      this._pdfDocument = null
                      _context12.prev = 9
                      _context12.next = 12
                      return this._scripting.destroySandbox()

                    case 12:
                      _context12.next = 16
                      break

                    case 14:
                      _context12.prev = 14
                      _context12.t0 = _context12.catch(9)

                    case 16:
                      _iterator4 = _createForOfIteratorHelper(this._internalEvents)

                      try {
                        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                          _step4$value = _slicedToArray(_step4.value, 2), name = _step4$value[0], listener = _step4$value[1]

                          this._eventBus._off(name, listener)
                        }
                      }
                      catch (err) {
                        _iterator4.e(err)
                      }
                      finally {
                        _iterator4.f()
                      }

                      this._internalEvents.clear()

                      _iterator5 = _createForOfIteratorHelper(this._domEvents)

                      try {
                        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                          _step5$value = _slicedToArray(_step5.value, 2), _name2 = _step5$value[0], _listener2 = _step5$value[1]
                          window.removeEventListener(_name2, _listener2)
                        }
                      }
                      catch (err) {
                        _iterator5.e(err)
                      }
                      finally {
                        _iterator5.f()
                      }

                      this._domEvents.clear()

                      this._pageOpenPending.clear()

                      this._visitedPages.clear()

                      this._scripting = null
                      delete this._mouseState.isDown
                      this._ready = false;
                      (_this$_destroyCapabil3 = this._destroyCapability) === null || _this$_destroyCapabil3 === void 0 ? void 0 : _this$_destroyCapabil3.resolve()

                    case 28:
                    case 'end':
                      return _context12.stop()
                  }
                }
              }, _callee12, this, [[9, 14]])
            }))

            function _destroyScripting() {
              return _destroyScripting2.apply(this, arguments)
            }

            return _destroyScripting
          }()),
        }])

        return PDFScriptingManager
      }())

      exports.PDFScriptingManager = PDFScriptingManager

      /***/
    },
    /* 25 */
    /***/ (__unused_webpack_module, exports, __webpack_require__) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.PDFSidebar = void 0

      const _ui_utils = __webpack_require__(5)

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      const UI_NOTIFICATION_CLASS = 'pdfSidebarNotification'

      const PDFSidebar = /* #__PURE__ */(function () {
        function PDFSidebar(_ref) {
          const elements = _ref.elements
          const pdfViewer = _ref.pdfViewer
          const pdfThumbnailViewer = _ref.pdfThumbnailViewer
          const eventBus = _ref.eventBus
          const l10n = _ref.l10n

          _classCallCheck(this, PDFSidebar)

          this.isOpen = false
          this.active = _ui_utils.SidebarView.THUMBS
          this.isInitialViewSet = false
          this.onToggled = null
          this.pdfViewer = pdfViewer
          this.pdfThumbnailViewer = pdfThumbnailViewer
          this.outerContainer = elements.outerContainer
          this.viewerContainer = elements.viewerContainer
          this.toggleButton = elements.toggleButton
          this.thumbnailButton = elements.thumbnailButton
          this.outlineButton = elements.outlineButton
          this.attachmentsButton = elements.attachmentsButton
          this.layersButton = elements.layersButton
          this.thumbnailView = elements.thumbnailView
          this.outlineView = elements.outlineView
          this.attachmentsView = elements.attachmentsView
          this.layersView = elements.layersView
          this._outlineOptionsContainer = elements.outlineOptionsContainer
          this._currentOutlineItemButton = elements.currentOutlineItemButton
          this.eventBus = eventBus
          this.l10n = l10n

          this._addEventListeners()
        }

        _createClass(PDFSidebar, [{
          key: 'reset',
          value: function reset() {
            this.isInitialViewSet = false

            this._hideUINotification(true)

            this.switchView(_ui_utils.SidebarView.THUMBS)
            this.outlineButton.disabled = false
            this.attachmentsButton.disabled = false
            this.layersButton.disabled = false
            this._currentOutlineItemButton.disabled = true
          },
        }, {
          key: 'visibleView',
          get: function get() {
            return this.isOpen ? this.active : _ui_utils.SidebarView.NONE
          },
        }, {
          key: 'isThumbnailViewVisible',
          get: function get() {
            return this.isOpen && this.active === _ui_utils.SidebarView.THUMBS
          },
        }, {
          key: 'isOutlineViewVisible',
          get: function get() {
            return this.isOpen && this.active === _ui_utils.SidebarView.OUTLINE
          },
        }, {
          key: 'isAttachmentsViewVisible',
          get: function get() {
            return this.isOpen && this.active === _ui_utils.SidebarView.ATTACHMENTS
          },
        }, {
          key: 'isLayersViewVisible',
          get: function get() {
            return this.isOpen && this.active === _ui_utils.SidebarView.LAYERS
          },
        }, {
          key: 'setInitialView',
          value: function setInitialView() {
            const view = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _ui_utils.SidebarView.NONE
            if (this.isInitialViewSet) {
              return
            }

            this.isInitialViewSet = true

            if (view === _ui_utils.SidebarView.NONE || view === _ui_utils.SidebarView.UNKNOWN) {
              this._dispatchEvent()

              return
            }

            if (!this._switchView(view, true)) {
              this._dispatchEvent()
            }
          },
        }, {
          key: 'switchView',
          value: function switchView(view) {
            const forceOpen = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false

            this._switchView(view, forceOpen)
          },
        }, {
          key: '_switchView',
          value: function _switchView(view) {
            const forceOpen = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false
            const isViewChanged = view !== this.active
            let shouldForceRendering = false

            switch (view) {
              case _ui_utils.SidebarView.NONE:
                if (this.isOpen) {
                  this.close()
                  return true
                }

                return false

              case _ui_utils.SidebarView.THUMBS:
                if (this.isOpen && isViewChanged) {
                  shouldForceRendering = true
                }

                break

              case _ui_utils.SidebarView.OUTLINE:
                if (this.outlineButton.disabled) {
                  return false
                }

                break

              case _ui_utils.SidebarView.ATTACHMENTS:
                if (this.attachmentsButton.disabled) {
                  return false
                }

                break

              case _ui_utils.SidebarView.LAYERS:
                if (this.layersButton.disabled) {
                  return false
                }

                break

              default:
                console.error('PDFSidebar._switchView: "'.concat(view, '" is not a valid view.'))
                return false
            }

            this.active = view
            this.thumbnailButton.classList.toggle('toggled', view === _ui_utils.SidebarView.THUMBS)
            this.outlineButton.classList.toggle('toggled', view === _ui_utils.SidebarView.OUTLINE)
            this.attachmentsButton.classList.toggle('toggled', view === _ui_utils.SidebarView.ATTACHMENTS)
            this.layersButton.classList.toggle('toggled', view === _ui_utils.SidebarView.LAYERS)
            this.thumbnailView.classList.toggle('hidden', view !== _ui_utils.SidebarView.THUMBS)
            this.outlineView.classList.toggle('hidden', view !== _ui_utils.SidebarView.OUTLINE)
            this.attachmentsView.classList.toggle('hidden', view !== _ui_utils.SidebarView.ATTACHMENTS)
            this.layersView.classList.toggle('hidden', view !== _ui_utils.SidebarView.LAYERS)

            this._outlineOptionsContainer.classList.toggle('hidden', view !== _ui_utils.SidebarView.OUTLINE)

            if (forceOpen && !this.isOpen) {
              this.open()
              return true
            }

            if (shouldForceRendering) {
              this._updateThumbnailViewer()

              this._forceRendering()
            }

            if (isViewChanged) {
              this._dispatchEvent()
            }

            return isViewChanged
          },
        }, {
          key: 'open',
          value: function open() {
            if (this.isOpen) {
              return
            }

            this.isOpen = true
            this.toggleButton.classList.add('toggled')
            this.toggleButton.setAttribute('aria-expanded', 'true')
            this.outerContainer.classList.add('sidebarMoving', 'sidebarOpen')
            if (this.active === _ui_utils.SidebarView.THUMBS) {
              this._updateThumbnailViewer()
            }

            this._forceRendering()

            this._dispatchEvent()

            this._hideUINotification()
          },
        }, {
          key: 'close',
          value: function close() {
            if (!this.isOpen) {
              return
            }

            this.isOpen = false
            this.toggleButton.classList.remove('toggled')
            this.toggleButton.setAttribute('aria-expanded', 'false')
            this.outerContainer.classList.add('sidebarMoving')
            this.outerContainer.classList.remove('sidebarOpen')

            this._forceRendering()

            this._dispatchEvent()
          },
        }, {
          key: 'toggle',
          value: function toggle() {
            if (this.isOpen) {
              this.close()
            }
            else {
              this.open()
            }
          },
        }, {
          key: '_dispatchEvent',
          value: function _dispatchEvent() {
            this.eventBus.dispatch('sidebarviewchanged', {
              source: this,
              view: this.visibleView,
            })
          },
        }, {
          key: '_forceRendering',
          value: function _forceRendering() {
            if (this.onToggled) {
              this.onToggled()
            }
            else {
              this.pdfViewer.forceRendering()
              this.pdfThumbnailViewer.forceRendering()
            }
          },
        }, {
          key: '_updateThumbnailViewer',
          value: function _updateThumbnailViewer() {
            const pdfViewer = this.pdfViewer
            const pdfThumbnailViewer = this.pdfThumbnailViewer
            const pagesCount = pdfViewer.pagesCount

            for (let pageIndex = 0; pageIndex < pagesCount; pageIndex++) {
              const pageView = pdfViewer.getPageView(pageIndex)

              if ((pageView === null || pageView === void 0 ? void 0 : pageView.renderingState) === _ui_utils.RenderingStates.FINISHED) {
                const thumbnailView = pdfThumbnailViewer.getThumbnail(pageIndex)
                thumbnailView.setImage(pageView)
              }
            }

            pdfThumbnailViewer.scrollThumbnailIntoView(pdfViewer.currentPageNumber)
          },
        }, {
          key: '_showUINotification',
          value: function _showUINotification() {
            const _this = this

            this.l10n.get('toggle_sidebar_notification2.title').then((msg) => {
              _this.toggleButton.title = msg
            })

            if (!this.isOpen) {
              this.toggleButton.classList.add(UI_NOTIFICATION_CLASS)
            }
          },
        }, {
          key: '_hideUINotification',
          value: function _hideUINotification() {
            const _this2 = this

            const reset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false

            if (this.isOpen || reset) {
              this.toggleButton.classList.remove(UI_NOTIFICATION_CLASS)
            }

            if (reset) {
              this.l10n.get('toggle_sidebar.title').then((msg) => {
                _this2.toggleButton.title = msg
              })
            }
          },
        }, {
          key: '_addEventListeners',
          value: function _addEventListeners() {
            const _this3 = this

            this.viewerContainer.addEventListener('transitionend', (evt) => {
              if (evt.target === _this3.viewerContainer) {
                _this3.outerContainer.classList.remove('sidebarMoving')
              }
            })
            this.toggleButton.addEventListener('click', () => {
              _this3.toggle()
            })
            this.thumbnailButton.addEventListener('click', () => {
              _this3.switchView(_ui_utils.SidebarView.THUMBS)
            })
            this.outlineButton.addEventListener('click', () => {
              _this3.switchView(_ui_utils.SidebarView.OUTLINE)
            })
            this.outlineButton.addEventListener('dblclick', () => {
              _this3.eventBus.dispatch('toggleoutlinetree', {
                source: _this3,
              })
            })
            this.attachmentsButton.addEventListener('click', () => {
              _this3.switchView(_ui_utils.SidebarView.ATTACHMENTS)
            })
            this.layersButton.addEventListener('click', () => {
              _this3.switchView(_ui_utils.SidebarView.LAYERS)
            })
            this.layersButton.addEventListener('dblclick', () => {
              _this3.eventBus.dispatch('resetlayers', {
                source: _this3,
              })
            })

            this._currentOutlineItemButton.addEventListener('click', () => {
              _this3.eventBus.dispatch('currentoutlineitem', {
                source: _this3,
              })
            })

            const onTreeLoaded = function onTreeLoaded(count, button, view) {
              button.disabled = !count

              if (count) {
                _this3._showUINotification()
              }
              else if (_this3.active === view) {
                _this3.switchView(_ui_utils.SidebarView.THUMBS)
              }
            }

            this.eventBus._on('outlineloaded', (evt) => {
              onTreeLoaded(evt.outlineCount, _this3.outlineButton, _ui_utils.SidebarView.OUTLINE)
              evt.currentOutlineItemPromise.then((enabled) => {
                if (!_this3.isInitialViewSet) {
                  return
                }

                _this3._currentOutlineItemButton.disabled = !enabled
              })
            })

            this.eventBus._on('attachmentsloaded', (evt) => {
              onTreeLoaded(evt.attachmentsCount, _this3.attachmentsButton, _ui_utils.SidebarView.ATTACHMENTS)
            })

            this.eventBus._on('layersloaded', (evt) => {
              onTreeLoaded(evt.layersCount, _this3.layersButton, _ui_utils.SidebarView.LAYERS)
            })

            this.eventBus._on('presentationmodechanged', (evt) => {
              if (evt.state === _ui_utils.PresentationModeState.NORMAL && _this3.isThumbnailViewVisible) {
                _this3._updateThumbnailViewer()
              }
            })
          },
        }])

        return PDFSidebar
      }())

      exports.PDFSidebar = PDFSidebar

      /***/
    },
    /* 26 */
    /***/ (__unused_webpack_module, exports) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.PDFSidebarResizer = void 0

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      const SIDEBAR_WIDTH_VAR = '--sidebar-width'
      const SIDEBAR_MIN_WIDTH = 200
      const SIDEBAR_RESIZING_CLASS = 'sidebarResizing'

      const PDFSidebarResizer = /* #__PURE__ */(function () {
        function PDFSidebarResizer(options, eventBus, l10n) {
          const _this = this

          _classCallCheck(this, PDFSidebarResizer)

          this.isRTL = false
          this.sidebarOpen = false
          this.doc = document.documentElement
          this._width = null
          this._outerContainerWidth = null
          this._boundEvents = Object.create(null)
          this.outerContainer = options.outerContainer
          this.resizer = options.resizer
          this.eventBus = eventBus
          l10n.getDirection().then((dir) => {
            _this.isRTL = dir === 'rtl'
          })

          this._addEventListeners()
        }

        _createClass(PDFSidebarResizer, [{
          key: 'outerContainerWidth',
          get: function get() {
            return this._outerContainerWidth || (this._outerContainerWidth = this.outerContainer.clientWidth)
          },
        }, {
          key: '_updateWidth',
          value: function _updateWidth() {
            let width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0
            const maxWidth = Math.floor(this.outerContainerWidth / 2)

            if (width > maxWidth) {
              width = maxWidth
            }

            if (width < SIDEBAR_MIN_WIDTH) {
              width = SIDEBAR_MIN_WIDTH
            }

            if (width === this._width) {
              return false
            }

            this._width = width
            this.doc.style.setProperty(SIDEBAR_WIDTH_VAR, ''.concat(width, 'px'))
            return true
          },
        }, {
          key: '_mouseMove',
          value: function _mouseMove(evt) {
            let width = evt.clientX

            if (this.isRTL) {
              width = this.outerContainerWidth - width
            }

            this._updateWidth(width)
          },
        }, {
          key: '_mouseUp',
          value: function _mouseUp(evt) {
            this.outerContainer.classList.remove(SIDEBAR_RESIZING_CLASS)
            this.eventBus.dispatch('resize', {
              source: this,
            })
            const _boundEvents = this._boundEvents
            window.removeEventListener('mousemove', _boundEvents.mouseMove)
            window.removeEventListener('mouseup', _boundEvents.mouseUp)
          },
        }, {
          key: '_addEventListeners',
          value: function _addEventListeners() {
            const _this2 = this

            const _boundEvents = this._boundEvents
            _boundEvents.mouseMove = this._mouseMove.bind(this)
            _boundEvents.mouseUp = this._mouseUp.bind(this)
            this.resizer.addEventListener('mousedown', (evt) => {
              if (evt.button !== 0) {
                return
              }

              _this2.outerContainer.classList.add(SIDEBAR_RESIZING_CLASS)

              window.addEventListener('mousemove', _boundEvents.mouseMove)
              window.addEventListener('mouseup', _boundEvents.mouseUp)
            })

            this.eventBus._on('sidebarviewchanged', (evt) => {
              _this2.sidebarOpen = !!(evt !== null && evt !== void 0 && evt.view)
            })

            this.eventBus._on('resize', (evt) => {
              if ((evt === null || evt === void 0 ? void 0 : evt.source) !== window) {
                return
              }

              _this2._outerContainerWidth = null

              if (!_this2._width) {
                return
              }

              if (!_this2.sidebarOpen) {
                _this2._updateWidth(_this2._width)

                return
              }

              _this2.outerContainer.classList.add(SIDEBAR_RESIZING_CLASS)

              const updated = _this2._updateWidth(_this2._width)

              Promise.resolve().then(() => {
                _this2.outerContainer.classList.remove(SIDEBAR_RESIZING_CLASS)

                if (updated) {
                  _this2.eventBus.dispatch('resize', {
                    source: _this2,
                  })
                }
              })
            })
          },
        }])

        return PDFSidebarResizer
      }())

      exports.PDFSidebarResizer = PDFSidebarResizer

      /***/
    },
    /* 27 */
    /***/ (__unused_webpack_module, exports, __webpack_require__) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.PDFThumbnailViewer = void 0

      const _regenerator = _interopRequireDefault(__webpack_require__(3))

      const _ui_utils = __webpack_require__(5)

      const _pdf_thumbnail_view = __webpack_require__(28)

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj } }

      function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
        try { var info = gen[key](arg); var value = info.value }
        catch (error) { reject(error); return } if (info.done) { resolve(value) }
        else { Promise.resolve(value).then(_next, _throw) }
      }

      function _asyncToGenerator(fn) { return function () { const self = this; const args = arguments; return new Promise((resolve, reject) => { const gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value) } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err) } _next(undefined) }) } }

      function _createForOfIteratorHelper(o, allowArrayLike) {
        let it = typeof Symbol !== 'undefined' && o[Symbol.iterator] || o['@@iterator']; if (!it) {
          if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === 'number') {
            if (it)
              o = it; let i = 0; const F = function F() { }; return {
                s: F,
                n: function n() {
                  if (i >= o.length)
                    return { done: true }; return { done: false, value: o[i++] }
                },
                e: function e(_e) { throw _e },
                f: F,
              }
          } throw new TypeError('Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.')
        } let normalCompletion = true; let didErr = false; let err; return {
          s: function s() { it = it.call(o) },
          n: function n() { const step = it.next(); normalCompletion = step.done; return step },
          e: function e(_e2) { didErr = true; err = _e2 },
          f: function f() {
            try {
              if (!normalCompletion && it.return != null)
                it.return()
            }
            finally {
              if (didErr)
                throw err
            }
          },
        }
      }

      function _unsupportedIterableToArray(o, minLen) {
        if (!o)
          return; if (typeof o === 'string')
          return _arrayLikeToArray(o, minLen); let n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor)
          n = o.constructor.name; if (n === 'Map' || n === 'Set')
          return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
          return _arrayLikeToArray(o, minLen)
      }

      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length)
          len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2
      }

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj) }

      function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError('Cannot initialize the same private elements twice on an object') } }

      function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError('attempted to get private field on non-instance') } return fn }

      const THUMBNAIL_SCROLL_MARGIN = -19
      const THUMBNAIL_SELECTED_CLASS = 'selected'

      const _ensurePdfPageLoaded = /* #__PURE__ */new WeakSet()

      const _getScrollAhead = /* #__PURE__ */new WeakSet()

      const PDFThumbnailViewer = /* #__PURE__ */(function () {
        function PDFThumbnailViewer(_ref) {
          const _this = this

          const container = _ref.container
          const eventBus = _ref.eventBus
          const linkService = _ref.linkService
          const renderingQueue = _ref.renderingQueue
          const l10n = _ref.l10n

          _classCallCheck(this, PDFThumbnailViewer)

          _classPrivateMethodInitSpec(this, _getScrollAhead)

          _classPrivateMethodInitSpec(this, _ensurePdfPageLoaded)

          this.container = container
          this.linkService = linkService
          this.renderingQueue = renderingQueue
          this.l10n = l10n
          this.scroll = (0, _ui_utils.watchScroll)(this.container, this._scrollUpdated.bind(this))

          this._resetView()

          eventBus._on('optionalcontentconfigchanged', () => {
            _this._setImageDisabled = true
          })
        }

        _createClass(PDFThumbnailViewer, [{
          key: '_scrollUpdated',
          value: function _scrollUpdated() {
            this.renderingQueue.renderHighestPriority()
          },
        }, {
          key: 'getThumbnail',
          value: function getThumbnail(index) {
            return this._thumbnails[index]
          },
        }, {
          key: '_getVisibleThumbs',
          value: function _getVisibleThumbs() {
            return (0, _ui_utils.getVisibleElements)({
              scrollEl: this.container,
              views: this._thumbnails,
            })
          },
        }, {
          key: 'scrollThumbnailIntoView',
          value: function scrollThumbnailIntoView(pageNumber) {
            if (!this.pdfDocument) {
              return
            }

            const thumbnailView = this._thumbnails[pageNumber - 1]

            if (!thumbnailView) {
              console.error('scrollThumbnailIntoView: Invalid "pageNumber" parameter.')
              return
            }

            if (pageNumber !== this._currentPageNumber) {
              const prevThumbnailView = this._thumbnails[this._currentPageNumber - 1]
              prevThumbnailView.div.classList.remove(THUMBNAIL_SELECTED_CLASS)
              thumbnailView.div.classList.add(THUMBNAIL_SELECTED_CLASS)
            }

            const _this$_getVisibleThum = this._getVisibleThumbs()
            const first = _this$_getVisibleThum.first
            const last = _this$_getVisibleThum.last
            const views = _this$_getVisibleThum.views

            if (views.length > 0) {
              let shouldScroll = false

              if (pageNumber <= first.id || pageNumber >= last.id) {
                shouldScroll = true
              }
              else {
                const _iterator = _createForOfIteratorHelper(views)
                let _step

                try {
                  for (_iterator.s(); !(_step = _iterator.n()).done;) {
                    const _step$value = _step.value
                    const id = _step$value.id
                    const percent = _step$value.percent

                    if (id !== pageNumber) {
                      continue
                    }

                    shouldScroll = percent < 100
                    break
                  }
                }
                catch (err) {
                  _iterator.e(err)
                }
                finally {
                  _iterator.f()
                }
              }

              if (shouldScroll) {
                (0, _ui_utils.scrollIntoView)(thumbnailView.div, {
                  top: THUMBNAIL_SCROLL_MARGIN,
                })
              }
            }

            this._currentPageNumber = pageNumber
          },
        }, {
          key: 'pagesRotation',
          get: function get() {
            return this._pagesRotation
          },
          set: function set(rotation) {
            if (!(0, _ui_utils.isValidRotation)(rotation)) {
              throw new Error('Invalid thumbnails rotation angle.')
            }

            if (!this.pdfDocument) {
              return
            }

            if (this._pagesRotation === rotation) {
              return
            }

            this._pagesRotation = rotation
            const updateArgs = {
              rotation,
            }

            const _iterator2 = _createForOfIteratorHelper(this._thumbnails)
            let _step2

            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                const thumbnail = _step2.value
                thumbnail.update(updateArgs)
              }
            }
            catch (err) {
              _iterator2.e(err)
            }
            finally {
              _iterator2.f()
            }
          },
        }, {
          key: 'cleanup',
          value: function cleanup() {
            for (let i = 0, ii = this._thumbnails.length; i < ii; i++) {
              if (this._thumbnails[i] && this._thumbnails[i].renderingState !== _ui_utils.RenderingStates.FINISHED) {
                this._thumbnails[i].reset()
              }
            }

            _pdf_thumbnail_view.TempImageFactory.destroyCanvas()
          },
        }, {
          key: '_resetView',
          value: function _resetView() {
            this._thumbnails = []
            this._currentPageNumber = 1
            this._pageLabels = null
            this._pagesRotation = 0
            this._optionalContentConfigPromise = null
            this._setImageDisabled = false
            this.container.textContent = ''
          },
        }, {
          key: 'setDocument',
          value: function setDocument(pdfDocument) {
            const _this2 = this

            if (this.pdfDocument) {
              this._cancelRendering()

              this._resetView()
            }

            this.pdfDocument = pdfDocument

            if (!pdfDocument) {
              return
            }

            const firstPagePromise = pdfDocument.getPage(1)
            const optionalContentConfigPromise = pdfDocument.getOptionalContentConfig()
            firstPagePromise.then((firstPdfPage) => {
              _this2._optionalContentConfigPromise = optionalContentConfigPromise
              const pagesCount = pdfDocument.numPages
              const viewport = firstPdfPage.getViewport({
                scale: 1,
              })

              const checkSetImageDisabled = function checkSetImageDisabled() {
                return _this2._setImageDisabled
              }

              for (let pageNum = 1; pageNum <= pagesCount; ++pageNum) {
                const thumbnail = new _pdf_thumbnail_view.PDFThumbnailView({
                  container: _this2.container,
                  id: pageNum,
                  defaultViewport: viewport.clone(),
                  optionalContentConfigPromise,
                  linkService: _this2.linkService,
                  renderingQueue: _this2.renderingQueue,
                  checkSetImageDisabled,
                  l10n: _this2.l10n,
                })

                _this2._thumbnails.push(thumbnail)
              }

              const firstThumbnailView = _this2._thumbnails[0]

              if (firstThumbnailView) {
                firstThumbnailView.setPdfPage(firstPdfPage)
              }

              const thumbnailView = _this2._thumbnails[_this2._currentPageNumber - 1]
              thumbnailView.div.classList.add(THUMBNAIL_SELECTED_CLASS)
            }).catch((reason) => {
              console.error('Unable to initialize thumbnail viewer', reason)
            })
          },
        }, {
          key: '_cancelRendering',
          value: function _cancelRendering() {
            for (let i = 0, ii = this._thumbnails.length; i < ii; i++) {
              if (this._thumbnails[i]) {
                this._thumbnails[i].cancelRendering()
              }
            }
          },
        }, {
          key: 'setPageLabels',
          value: function setPageLabels(labels) {
            if (!this.pdfDocument) {
              return
            }

            if (!labels) {
              this._pageLabels = null
            }
            else if (!(Array.isArray(labels) && this.pdfDocument.numPages === labels.length)) {
              this._pageLabels = null
              console.error('PDFThumbnailViewer_setPageLabels: Invalid page labels.')
            }
            else {
              this._pageLabels = labels
            }

            for (let i = 0, ii = this._thumbnails.length; i < ii; i++) {
              var _this$_pageLabels$i, _this$_pageLabels

              this._thumbnails[i].setPageLabel((_this$_pageLabels$i = (_this$_pageLabels = this._pageLabels) === null || _this$_pageLabels === void 0 ? void 0 : _this$_pageLabels[i]) !== null && _this$_pageLabels$i !== void 0 ? _this$_pageLabels$i : null)
            }
          },
        }, {
          key: 'forceRendering',
          value: function forceRendering() {
            const _this3 = this

            const visibleThumbs = this._getVisibleThumbs()

            const scrollAhead = _classPrivateMethodGet(this, _getScrollAhead, _getScrollAhead2).call(this, visibleThumbs)

            const thumbView = this.renderingQueue.getHighestPriority(visibleThumbs, this._thumbnails, scrollAhead)

            if (thumbView) {
              _classPrivateMethodGet(this, _ensurePdfPageLoaded, _ensurePdfPageLoaded2).call(this, thumbView).then(() => {
                _this3.renderingQueue.renderView(thumbView)
              })

              return true
            }

            return false
          },
        }])

        return PDFThumbnailViewer
      }())

      exports.PDFThumbnailViewer = PDFThumbnailViewer

      function _ensurePdfPageLoaded2(_x) {
        return _ensurePdfPageLoaded3.apply(this, arguments)
      }

      function _ensurePdfPageLoaded3() {
        _ensurePdfPageLoaded3 = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee(thumbView) {
          let pdfPage
          return _regenerator.default.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!thumbView.pdfPage) {
                    _context.next = 2
                    break
                  }

                  return _context.abrupt('return', thumbView.pdfPage)

                case 2:
                  _context.prev = 2
                  _context.next = 5
                  return this.pdfDocument.getPage(thumbView.id)

                case 5:
                  pdfPage = _context.sent

                  if (!thumbView.pdfPage) {
                    thumbView.setPdfPage(pdfPage)
                  }

                  return _context.abrupt('return', pdfPage)

                case 10:
                  _context.prev = 10
                  _context.t0 = _context.catch(2)
                  console.error('Unable to get page for thumb view', _context.t0)
                  return _context.abrupt('return', null)

                case 14:
                case 'end':
                  return _context.stop()
              }
            }
          }, _callee, this, [[2, 10]])
        }))
        return _ensurePdfPageLoaded3.apply(this, arguments)
      }

      function _getScrollAhead2(visible) {
        let _visible$first, _visible$last

        if (((_visible$first = visible.first) === null || _visible$first === void 0 ? void 0 : _visible$first.id) === 1) {
          return true
        }
        else if (((_visible$last = visible.last) === null || _visible$last === void 0 ? void 0 : _visible$last.id) === this._thumbnails.length) {
          return false
        }

        return this.scroll.down
      }

      /***/
    },
    /* 28 */
    /***/ (__unused_webpack_module, exports, __webpack_require__) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.TempImageFactory = exports.PDFThumbnailView = void 0

      const _regenerator = _interopRequireDefault(__webpack_require__(3))

      const _ui_utils = __webpack_require__(5)

      const _pdfjsLib = __webpack_require__(7)

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj } }

      function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest() }

      function _nonIterableRest() { throw new TypeError('Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') }

      function _unsupportedIterableToArray(o, minLen) {
        if (!o)
          return; if (typeof o === 'string')
          return _arrayLikeToArray(o, minLen); let n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor)
          n = o.constructor.name; if (n === 'Map' || n === 'Set')
          return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
          return _arrayLikeToArray(o, minLen)
      }

      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length)
          len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2
      }

      function _iterableToArrayLimit(arr, i) {
        let _i = arr == null ? null : typeof Symbol !== 'undefined' && arr[Symbol.iterator] || arr['@@iterator']; if (_i == null)
          return; const _arr = []; let _n = true; let _d = false; let _s, _e; try {
            for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
              _arr.push(_s.value); if (i && _arr.length === i)
                break
            }
          }
        catch (err) { _d = true; _e = err }
        finally {
          try {
            if (!_n && _i.return != null)
              _i.return()
          }
          finally {
            if (_d)
              throw _e
          }
        } return _arr
      }

      function _arrayWithHoles(arr) {
        if (Array.isArray(arr))
          return arr
      }

      function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
        try { var info = gen[key](arg); var value = info.value }
        catch (error) { reject(error); return } if (info.done) { resolve(value) }
        else { Promise.resolve(value).then(_next, _throw) }
      }

      function _asyncToGenerator(fn) { return function () { const self = this; const args = arguments; return new Promise((resolve, reject) => { const gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value) } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err) } _next(undefined) }) } }

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      function _classStaticPrivateFieldSpecSet(receiver, classConstructor, descriptor, value) { _classCheckPrivateStaticAccess(receiver, classConstructor); _classCheckPrivateStaticFieldDescriptor(descriptor, 'set'); _classApplyDescriptorSet(receiver, descriptor, value); return value }

      function _classApplyDescriptorSet(receiver, descriptor, value) {
        if (descriptor.set) { descriptor.set.call(receiver, value) }
        else { if (!descriptor.writable) { throw new TypeError('attempted to set read only private field') } descriptor.value = value }
      }

      function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) { _classCheckPrivateStaticAccess(receiver, classConstructor); _classCheckPrivateStaticFieldDescriptor(descriptor, 'get'); return _classApplyDescriptorGet(receiver, descriptor) }

      function _classCheckPrivateStaticFieldDescriptor(descriptor, action) { if (descriptor === undefined) { throw new TypeError(`attempted to ${action} private static field before its declaration`) } }

      function _classCheckPrivateStaticAccess(receiver, classConstructor) { if (receiver !== classConstructor) { throw new TypeError('Private static access of wrong provenance') } }

      function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver) } return descriptor.value }

      const DRAW_UPSCALE_FACTOR = 2
      const MAX_NUM_SCALING_STEPS = 3
      const THUMBNAIL_CANVAS_BORDER_WIDTH = 1
      const THUMBNAIL_WIDTH = 98

      const TempImageFactory = /* #__PURE__ */(function () {
        function TempImageFactory() {
          _classCallCheck(this, TempImageFactory)
        }

        _createClass(TempImageFactory, null, [{
          key: 'getCanvas',
          value: function getCanvas(width, height) {
            const tempCanvas = _classStaticPrivateFieldSpecGet(this, TempImageFactory, _tempCanvas) || _classStaticPrivateFieldSpecSet(this, TempImageFactory, _tempCanvas, document.createElement('canvas'))

            tempCanvas.width = width
            tempCanvas.height = height
            tempCanvas.mozOpaque = true
            const ctx = tempCanvas.getContext('2d', {
              alpha: false,
            })
            ctx.save()
            ctx.fillStyle = 'rgb(255, 255, 255)'
            ctx.fillRect(0, 0, width, height)
            ctx.restore()
            return [tempCanvas, tempCanvas.getContext('2d')]
          },
        }, {
          key: 'destroyCanvas',
          value: function destroyCanvas() {
            const tempCanvas = _classStaticPrivateFieldSpecGet(this, TempImageFactory, _tempCanvas)

            if (tempCanvas) {
              tempCanvas.width = 0
              tempCanvas.height = 0
            }

            _classStaticPrivateFieldSpecSet(this, TempImageFactory, _tempCanvas, null)
          },
        }])

        return TempImageFactory
      }())

      exports.TempImageFactory = TempImageFactory
      var _tempCanvas = {
        writable: true,
        value: null,
      }

      const PDFThumbnailView = /* #__PURE__ */(function () {
        function PDFThumbnailView(_ref) {
          const container = _ref.container
          const id = _ref.id
          const defaultViewport = _ref.defaultViewport
          const optionalContentConfigPromise = _ref.optionalContentConfigPromise
          const linkService = _ref.linkService
          const renderingQueue = _ref.renderingQueue
          const checkSetImageDisabled = _ref.checkSetImageDisabled
          const l10n = _ref.l10n

          _classCallCheck(this, PDFThumbnailView)

          this.id = id
          this.renderingId = `thumbnail${id}`
          this.pageLabel = null
          this.pdfPage = null
          this.rotation = 0
          this.viewport = defaultViewport
          this.pdfPageRotate = defaultViewport.rotation
          this._optionalContentConfigPromise = optionalContentConfigPromise || null
          this.linkService = linkService
          this.renderingQueue = renderingQueue
          this.renderTask = null
          this.renderingState = _ui_utils.RenderingStates.INITIAL
          this.resume = null

          this._checkSetImageDisabled = checkSetImageDisabled || function () {
            return false
          }

          const pageWidth = this.viewport.width
          const pageHeight = this.viewport.height
          const pageRatio = pageWidth / pageHeight
          this.canvasWidth = THUMBNAIL_WIDTH
          this.canvasHeight = this.canvasWidth / pageRatio | 0
          this.scale = this.canvasWidth / pageWidth
          this.l10n = l10n
          const anchor = document.createElement('a')
          anchor.href = linkService.getAnchorUrl(`#page=${id}`)

          this._thumbPageTitle.then((msg) => {
            anchor.title = msg
          })

          anchor.onclick = function () {
            linkService.goToPage(id)
            return false
          }

          this.anchor = anchor
          const div = document.createElement('div')
          div.className = 'thumbnail'
          div.setAttribute('data-page-number', this.id)
          this.div = div
          const ring = document.createElement('div')
          ring.className = 'thumbnailSelectionRing'
          const borderAdjustment = 2 * THUMBNAIL_CANVAS_BORDER_WIDTH
          ring.style.width = `${this.canvasWidth + borderAdjustment}px`
          ring.style.height = `${this.canvasHeight + borderAdjustment}px`
          this.ring = ring
          div.appendChild(ring)
          anchor.appendChild(div)
          container.appendChild(anchor)
        }

        _createClass(PDFThumbnailView, [{
          key: 'setPdfPage',
          value: function setPdfPage(pdfPage) {
            this.pdfPage = pdfPage
            this.pdfPageRotate = pdfPage.rotate
            const totalRotation = (this.rotation + this.pdfPageRotate) % 360
            this.viewport = pdfPage.getViewport({
              scale: 1,
              rotation: totalRotation,
            })
            this.reset()
          },
        }, {
          key: 'reset',
          value: function reset() {
            this.cancelRendering()
            this.renderingState = _ui_utils.RenderingStates.INITIAL
            const pageWidth = this.viewport.width
            const pageHeight = this.viewport.height
            const pageRatio = pageWidth / pageHeight
            this.canvasHeight = this.canvasWidth / pageRatio | 0
            this.scale = this.canvasWidth / pageWidth
            this.div.removeAttribute('data-loaded')
            const ring = this.ring
            ring.textContent = ''
            const borderAdjustment = 2 * THUMBNAIL_CANVAS_BORDER_WIDTH
            ring.style.width = `${this.canvasWidth + borderAdjustment}px`
            ring.style.height = `${this.canvasHeight + borderAdjustment}px`

            if (this.canvas) {
              this.canvas.width = 0
              this.canvas.height = 0
              delete this.canvas
            }

            if (this.image) {
              this.image.removeAttribute('src')
              delete this.image
            }
          },
        }, {
          key: 'update',
          value: function update(_ref2) {
            const _ref2$rotation = _ref2.rotation
            const rotation = _ref2$rotation === void 0 ? null : _ref2$rotation

            if (typeof rotation === 'number') {
              this.rotation = rotation
            }

            const totalRotation = (this.rotation + this.pdfPageRotate) % 360
            this.viewport = this.viewport.clone({
              scale: 1,
              rotation: totalRotation,
            })
            this.reset()
          },
        }, {
          key: 'cancelRendering',
          value: function cancelRendering() {
            if (this.renderTask) {
              this.renderTask.cancel()
              this.renderTask = null
            }

            this.resume = null
          },
        }, {
          key: '_getPageDrawContext',
          value: function _getPageDrawContext() {
            const upscaleFactor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1
            const canvas = document.createElement('canvas')
            canvas.mozOpaque = true
            const ctx = canvas.getContext('2d', {
              alpha: false,
            })
            const outputScale = (0, _ui_utils.getOutputScale)(ctx)
            canvas.width = upscaleFactor * this.canvasWidth * outputScale.sx | 0
            canvas.height = upscaleFactor * this.canvasHeight * outputScale.sy | 0
            const transform = outputScale.scaled ? [outputScale.sx, 0, 0, outputScale.sy, 0, 0] : null
            return {
              ctx,
              canvas,
              transform,
            }
          },
        }, {
          key: '_convertCanvasToImage',
          value: function _convertCanvasToImage(canvas) {
            if (this.renderingState !== _ui_utils.RenderingStates.FINISHED) {
              throw new Error('_convertCanvasToImage: Rendering has not finished.')
            }

            const reducedCanvas = this._reduceImage(canvas)

            const image = document.createElement('img')
            image.className = 'thumbnailImage'

            this._thumbPageCanvas.then((msg) => {
              image.setAttribute('aria-label', msg)
            })

            image.style.width = `${this.canvasWidth}px`
            image.style.height = `${this.canvasHeight}px`
            image.src = reducedCanvas.toDataURL()
            this.image = image
            this.div.setAttribute('data-loaded', true)
            this.ring.appendChild(image)
            reducedCanvas.width = 0
            reducedCanvas.height = 0
          },
        }, {
          key: 'draw',
          value: function draw() {
            const _this = this

            if (this.renderingState !== _ui_utils.RenderingStates.INITIAL) {
              console.error('Must be in new state before drawing')
              return Promise.resolve()
            }

            const pdfPage = this.pdfPage

            if (!pdfPage) {
              this.renderingState = _ui_utils.RenderingStates.FINISHED
              return Promise.reject(new Error('pdfPage is not loaded'))
            }

            this.renderingState = _ui_utils.RenderingStates.RUNNING

            const finishRenderTask = /* #__PURE__ */(function () {
              const _ref3 = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee() {
                let error
                const _args = arguments
                return _regenerator.default.wrap((_context) => {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        error = _args.length > 0 && _args[0] !== undefined ? _args[0] : null

                        if (renderTask === _this.renderTask) {
                          _this.renderTask = null
                        }

                        if (!(error instanceof _pdfjsLib.RenderingCancelledException)) {
                          _context.next = 4
                          break
                        }

                        return _context.abrupt('return')

                      case 4:
                        _this.renderingState = _ui_utils.RenderingStates.FINISHED

                        _this._convertCanvasToImage(canvas)

                        if (!error) {
                          _context.next = 8
                          break
                        }

                        throw error

                      case 8:
                      case 'end':
                        return _context.stop()
                    }
                  }
                }, _callee)
              }))

              return function finishRenderTask() {
                return _ref3.apply(this, arguments)
              }
            }())

            const _this$_getPageDrawCon = this._getPageDrawContext(DRAW_UPSCALE_FACTOR)
            const ctx = _this$_getPageDrawCon.ctx
            var canvas = _this$_getPageDrawCon.canvas
            const transform = _this$_getPageDrawCon.transform

            const drawViewport = this.viewport.clone({
              scale: DRAW_UPSCALE_FACTOR * this.scale,
            })

            const renderContinueCallback = function renderContinueCallback(cont) {
              if (!_this.renderingQueue.isHighestPriority(_this)) {
                _this.renderingState = _ui_utils.RenderingStates.PAUSED

                _this.resume = function () {
                  _this.renderingState = _ui_utils.RenderingStates.RUNNING
                  cont()
                }

                return
              }

              cont()
            }

            const renderContext = {
              canvasContext: ctx,
              transform,
              viewport: drawViewport,
              optionalContentConfigPromise: this._optionalContentConfigPromise,
            }
            var renderTask = this.renderTask = pdfPage.render(renderContext)
            renderTask.onContinue = renderContinueCallback
            const resultPromise = renderTask.promise.then(() => {
              return finishRenderTask(null)
            }, (error) => {
              return finishRenderTask(error)
            })
            resultPromise.finally(() => {
              canvas.width = 0
              canvas.height = 0

              const pageCached = _this.linkService.isPageCached(_this.id)

              if (!pageCached) {
                let _this$pdfPage;

                (_this$pdfPage = _this.pdfPage) === null || _this$pdfPage === void 0 ? void 0 : _this$pdfPage.cleanup()
              }
            })
            return resultPromise
          },
        }, {
          key: 'setImage',
          value: function setImage(pageView) {
            if (this._checkSetImageDisabled()) {
              return
            }

            if (this.renderingState !== _ui_utils.RenderingStates.INITIAL) {
              return
            }

            const canvas = pageView.canvas
            const pdfPage = pageView.pdfPage

            if (!canvas) {
              return
            }

            if (!this.pdfPage) {
              this.setPdfPage(pdfPage)
            }

            this.renderingState = _ui_utils.RenderingStates.FINISHED

            this._convertCanvasToImage(canvas)
          },
        }, {
          key: '_reduceImage',
          value: function _reduceImage(img) {
            const _this$_getPageDrawCon2 = this._getPageDrawContext()
            const ctx = _this$_getPageDrawCon2.ctx
            const canvas = _this$_getPageDrawCon2.canvas

            if (img.width <= 2 * canvas.width) {
              ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height)
              return canvas
            }

            let reducedWidth = canvas.width << MAX_NUM_SCALING_STEPS
            let reducedHeight = canvas.height << MAX_NUM_SCALING_STEPS

            const _TempImageFactory$get = TempImageFactory.getCanvas(reducedWidth, reducedHeight)
            const _TempImageFactory$get2 = _slicedToArray(_TempImageFactory$get, 2)
            const reducedImage = _TempImageFactory$get2[0]
            const reducedImageCtx = _TempImageFactory$get2[1]

            while (reducedWidth > img.width || reducedHeight > img.height) {
              reducedWidth >>= 1
              reducedHeight >>= 1
            }

            reducedImageCtx.drawImage(img, 0, 0, img.width, img.height, 0, 0, reducedWidth, reducedHeight)

            while (reducedWidth > 2 * canvas.width) {
              reducedImageCtx.drawImage(reducedImage, 0, 0, reducedWidth, reducedHeight, 0, 0, reducedWidth >> 1, reducedHeight >> 1)
              reducedWidth >>= 1
              reducedHeight >>= 1
            }

            ctx.drawImage(reducedImage, 0, 0, reducedWidth, reducedHeight, 0, 0, canvas.width, canvas.height)
            return canvas
          },
        }, {
          key: '_thumbPageTitle',
          get: function get() {
            let _this$pageLabel

            return this.l10n.get('thumb_page_title', {
              page: (_this$pageLabel = this.pageLabel) !== null && _this$pageLabel !== void 0 ? _this$pageLabel : this.id,
            })
          },
        }, {
          key: '_thumbPageCanvas',
          get: function get() {
            let _this$pageLabel2

            return this.l10n.get('thumb_page_canvas', {
              page: (_this$pageLabel2 = this.pageLabel) !== null && _this$pageLabel2 !== void 0 ? _this$pageLabel2 : this.id,
            })
          },
        }, {
          key: 'setPageLabel',
          value: function setPageLabel(label) {
            const _this2 = this

            this.pageLabel = typeof label === 'string' ? label : null

            this._thumbPageTitle.then((msg) => {
              _this2.anchor.title = msg
            })

            if (this.renderingState !== _ui_utils.RenderingStates.FINISHED) {
              return
            }

            this._thumbPageCanvas.then((msg) => {
              let _this2$image;

              (_this2$image = _this2.image) === null || _this2$image === void 0 ? void 0 : _this2$image.setAttribute('aria-label', msg)
            })
          },
        }])

        return PDFThumbnailView
      }())

      exports.PDFThumbnailView = PDFThumbnailView

      /***/
    },
    /* 29 */
    /***/ (__unused_webpack_module, exports, __webpack_require__) => {
      function _typeof(obj) {
        '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof(obj) { return typeof obj } }
        else { _typeof = function _typeof(obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj)
      }

      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.PDFViewer = exports.PDFSinglePageViewer = void 0

      const _ui_utils = __webpack_require__(5)

      const _base_viewer = __webpack_require__(30)

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      function _get(target, property, receiver) {
        if (typeof Reflect !== 'undefined' && Reflect.get) { _get = Reflect.get }
        else {
          _get = function _get(target, property, receiver) {
            const base = _superPropBase(target, property); if (!base)
              return; const desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver) } return desc.value
          }
        } return _get(target, property, receiver || target)
      }

      function _superPropBase(object, property) {
        while (!Object.prototype.hasOwnProperty.call(object, property)) {
          object = _getPrototypeOf(object); if (object === null)
            break
        } return object
      }

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _inherits(subClass, superClass) {
        if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function') } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass)
          _setPrototypeOf(subClass, superClass)
      }

      function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o }; return _setPrototypeOf(o, p) }

      function _createSuper(Derived) {
        const hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() {
          const Super = _getPrototypeOf(Derived); let result; if (hasNativeReflectConstruct) { const NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget) }
          else { result = Super.apply(this, arguments) } return _possibleConstructorReturn(this, result)
        }
      }

      function _possibleConstructorReturn(self, call) {
        if (call && (_typeof(call) === 'object' || typeof call === 'function')) { return call }
        else if (call !== void 0) { throw new TypeError('Derived constructors may only return object or undefined') } return _assertThisInitialized(self)
      }

      function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called') } return self }

      function _isNativeReflectConstruct() {
        if (typeof Reflect === 'undefined' || !Reflect.construct)
          return false; if (Reflect.construct.sham)
          return false; if (typeof Proxy === 'function')
          return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], () => { })); return true }
        catch (e) { return false }
      }

      function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o) }; return _getPrototypeOf(o) }

      const PDFViewer = /* #__PURE__ */(function (_BaseViewer) {
        _inherits(PDFViewer, _BaseViewer)

        const _super = _createSuper(PDFViewer)

        function PDFViewer() {
          _classCallCheck(this, PDFViewer)

          return _super.apply(this, arguments)
        }

        return PDFViewer
      }(_base_viewer.BaseViewer))

      exports.PDFViewer = PDFViewer

      const PDFSinglePageViewer = /* #__PURE__ */(function (_BaseViewer2) {
        _inherits(PDFSinglePageViewer, _BaseViewer2)

        const _super2 = _createSuper(PDFSinglePageViewer)

        function PDFSinglePageViewer() {
          _classCallCheck(this, PDFSinglePageViewer)

          return _super2.apply(this, arguments)
        }

        _createClass(PDFSinglePageViewer, [{
          key: '_resetView',
          value: function _resetView() {
            _get(_getPrototypeOf(PDFSinglePageViewer.prototype), '_resetView', this).call(this)

            this._scrollMode = _ui_utils.ScrollMode.PAGE
            this._spreadMode = _ui_utils.SpreadMode.NONE
          },
        }, {
          key: 'scrollMode',
          set: function set(mode) { },
        }, {
          key: '_updateScrollMode',
          value: function _updateScrollMode() { },
        }, {
          key: 'spreadMode',
          set: function set(mode) { },
        }, {
          key: '_updateSpreadMode',
          value: function _updateSpreadMode() { },
        }])

        return PDFSinglePageViewer
      }(_base_viewer.BaseViewer))

      exports.PDFSinglePageViewer = PDFSinglePageViewer

      /***/
    },
    /* 30 */
    /***/ (__unused_webpack_module, exports, __webpack_require__) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.PagesCountLimit = exports.PDFPageViewBuffer = exports.BaseViewer = void 0

      const _regenerator = _interopRequireDefault(__webpack_require__(3))

      const _pdfjsLib = __webpack_require__(7)

      const _ui_utils = __webpack_require__(5)

      const _annotation_layer_builder = __webpack_require__(31)

      const _l10n_utils = __webpack_require__(32)

      const _pdf_page_view = __webpack_require__(33)

      const _pdf_rendering_queue = __webpack_require__(23)

      const _pdf_link_service = __webpack_require__(20)

      const _struct_tree_layer_builder = __webpack_require__(34)

      const _text_highlighter = __webpack_require__(35)

      const _text_layer_builder = __webpack_require__(36)

      const _xfa_layer_builder = __webpack_require__(37)

      let _Symbol$iterator

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj } }

      function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
        try { var info = gen[key](arg); var value = info.value }
        catch (error) { reject(error); return } if (info.done) { resolve(value) }
        else { Promise.resolve(value).then(_next, _throw) }
      }

      function _asyncToGenerator(fn) { return function () { const self = this; const args = arguments; return new Promise((resolve, reject) => { const gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value) } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err) } _next(undefined) }) } }

      function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest() }

      function _nonIterableRest() { throw new TypeError('Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') }

      function _iterableToArrayLimit(arr, i) {
        let _i = arr == null ? null : typeof Symbol !== 'undefined' && arr[Symbol.iterator] || arr['@@iterator']; if (_i == null)
          return; const _arr = []; let _n = true; let _d = false; let _s, _e; try {
            for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
              _arr.push(_s.value); if (i && _arr.length === i)
                break
            }
          }
        catch (err) { _d = true; _e = err }
        finally {
          try {
            if (!_n && _i.return != null)
              _i.return()
          }
          finally {
            if (_d)
              throw _e
          }
        } return _arr
      }

      function _arrayWithHoles(arr) {
        if (Array.isArray(arr))
          return arr
      }

      function _createForOfIteratorHelper(o, allowArrayLike) {
        let it = typeof Symbol !== 'undefined' && o[Symbol.iterator] || o['@@iterator']; if (!it) {
          if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === 'number') {
            if (it)
              o = it; let i = 0; const F = function F() { }; return {
                s: F,
                n: function n() {
                  if (i >= o.length)
                    return { done: true }; return { done: false, value: o[i++] }
                },
                e: function e(_e2) { throw _e2 },
                f: F,
              }
          } throw new TypeError('Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.')
        } let normalCompletion = true; let didErr = false; let err; return {
          s: function s() { it = it.call(o) },
          n: function n() { const step = it.next(); normalCompletion = step.done; return step },
          e: function e(_e3) { didErr = true; err = _e3 },
          f: function f() {
            try {
              if (!normalCompletion && it.return != null)
                it.return()
            }
            finally {
              if (didErr)
                throw err
            }
          },
        }
      }

      function _unsupportedIterableToArray(o, minLen) {
        if (!o)
          return; if (typeof o === 'string')
          return _arrayLikeToArray(o, minLen); let n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor)
          n = o.constructor.name; if (n === 'Map' || n === 'Set')
          return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
          return _arrayLikeToArray(o, minLen)
      }

      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length)
          len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2
      }

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj) }

      function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value) }

      function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError('Cannot initialize the same private elements twice on an object') } }

      function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError('attempted to get private field on non-instance') } return fn }

      function _classPrivateFieldGet(receiver, privateMap) { const descriptor = _classExtractFieldDescriptor(receiver, privateMap, 'get'); return _classApplyDescriptorGet(receiver, descriptor) }

      function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver) } return descriptor.value }

      function _classPrivateFieldSet(receiver, privateMap, value) { const descriptor = _classExtractFieldDescriptor(receiver, privateMap, 'set'); _classApplyDescriptorSet(receiver, descriptor, value); return value }

      function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError(`attempted to ${action} private field on non-instance`) } return privateMap.get(receiver) }

      function _classApplyDescriptorSet(receiver, descriptor, value) {
        if (descriptor.set) { descriptor.set.call(receiver, value) }
        else { if (!descriptor.writable) { throw new TypeError('attempted to set read only private field') } descriptor.value = value }
      }

      const DEFAULT_CACHE_SIZE = 10
      const ENABLE_PERMISSIONS_CLASS = 'enablePermissions'
      const PagesCountLimit = {
        FORCE_SCROLL_MODE_PAGE: 15000,
        FORCE_LAZY_PAGE_INIT: 7500,
        PAUSE_EAGER_PAGE_INIT: 500,
      }
      exports.PagesCountLimit = PagesCountLimit

      const _buf = /* #__PURE__ */new WeakMap()

      const _size = /* #__PURE__ */new WeakMap()

      const _destroyFirstView = /* #__PURE__ */new WeakSet()

      _Symbol$iterator = Symbol.iterator

      const PDFPageViewBuffer = /* #__PURE__ */(function (_Symbol$iterator2) {
        function PDFPageViewBuffer(size) {
          _classCallCheck(this, PDFPageViewBuffer)

          _classPrivateMethodInitSpec(this, _destroyFirstView)

          _classPrivateFieldInitSpec(this, _buf, {
            writable: true,
            value: new Set(),
          })

          _classPrivateFieldInitSpec(this, _size, {
            writable: true,
            value: 0,
          })

          _classPrivateFieldSet(this, _size, size)
        }

        _createClass(PDFPageViewBuffer, [{
          key: 'push',
          value: function push(view) {
            const buf = _classPrivateFieldGet(this, _buf)

            if (buf.has(view)) {
              buf.delete(view)
            }

            buf.add(view)

            if (buf.size > _classPrivateFieldGet(this, _size)) {
              _classPrivateMethodGet(this, _destroyFirstView, _destroyFirstView2).call(this)
            }
          },
        }, {
          key: 'resize',
          value: function resize(newSize) {
            const idsToKeep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null

            _classPrivateFieldSet(this, _size, newSize)

            const buf = _classPrivateFieldGet(this, _buf)

            if (idsToKeep) {
              const ii = buf.size
              let i = 1

              const _iterator = _createForOfIteratorHelper(buf)
              let _step

              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  const view = _step.value

                  if (idsToKeep.has(view.id)) {
                    buf.delete(view)
                    buf.add(view)
                  }

                  if (++i > ii) {
                    break
                  }
                }
              }
              catch (err) {
                _iterator.e(err)
              }
              finally {
                _iterator.f()
              }
            }

            while (buf.size > _classPrivateFieldGet(this, _size)) {
              _classPrivateMethodGet(this, _destroyFirstView, _destroyFirstView2).call(this)
            }
          },
        }, {
          key: 'has',
          value: function has(view) {
            return _classPrivateFieldGet(this, _buf).has(view)
          },
        }, {
          key: _Symbol$iterator2,
          value: function value() {
            return _classPrivateFieldGet(this, _buf).keys()
          },
        }])

        return PDFPageViewBuffer
      }(_Symbol$iterator))

      exports.PDFPageViewBuffer = PDFPageViewBuffer

      function _destroyFirstView2() {
        const firstView = _classPrivateFieldGet(this, _buf).keys().next().value

        firstView === null || firstView === void 0 ? void 0 : firstView.destroy()

        _classPrivateFieldGet(this, _buf).delete(firstView)
      }

      const _buffer = /* #__PURE__ */new WeakMap()

      const _annotationMode = /* #__PURE__ */new WeakMap()

      const _previousAnnotationMode = /* #__PURE__ */new WeakMap()

      const _enablePermissions = /* #__PURE__ */new WeakMap()

      const _previousContainerHeight = /* #__PURE__ */new WeakMap()

      const _scrollModePageState = /* #__PURE__ */new WeakMap()

      const _initializePermissions = /* #__PURE__ */new WeakSet()

      const _onePageRenderedOrForceFetch = /* #__PURE__ */new WeakSet()

      const _ensurePageViewVisible = /* #__PURE__ */new WeakSet()

      const _isSameScale = /* #__PURE__ */new WeakSet()

      const _ensurePdfPageLoaded = /* #__PURE__ */new WeakSet()

      const _getScrollAhead = /* #__PURE__ */new WeakSet()

      const _toggleLoadingIconSpinner = /* #__PURE__ */new WeakSet()

      const BaseViewer = /* #__PURE__ */(function () {
        function BaseViewer(options) {
          let _this$container
          let _this$viewer
          let _options$textLayerMod
          let _options$annotationMo
          const _this = this

          _classCallCheck(this, BaseViewer)

          _classPrivateMethodInitSpec(this, _toggleLoadingIconSpinner)

          _classPrivateMethodInitSpec(this, _getScrollAhead)

          _classPrivateMethodInitSpec(this, _ensurePdfPageLoaded)

          _classPrivateMethodInitSpec(this, _isSameScale)

          _classPrivateMethodInitSpec(this, _ensurePageViewVisible)

          _classPrivateMethodInitSpec(this, _onePageRenderedOrForceFetch)

          _classPrivateMethodInitSpec(this, _initializePermissions)

          _classPrivateFieldInitSpec(this, _buffer, {
            writable: true,
            value: null,
          })

          _classPrivateFieldInitSpec(this, _annotationMode, {
            writable: true,
            value: _pdfjsLib.AnnotationMode.ENABLE_FORMS,
          })

          _classPrivateFieldInitSpec(this, _previousAnnotationMode, {
            writable: true,
            value: null,
          })

          _classPrivateFieldInitSpec(this, _enablePermissions, {
            writable: true,
            value: false,
          })

          _classPrivateFieldInitSpec(this, _previousContainerHeight, {
            writable: true,
            value: 0,
          })

          _classPrivateFieldInitSpec(this, _scrollModePageState, {
            writable: true,
            value: null,
          })

          if (this.constructor === BaseViewer) {
            throw new Error('Cannot initialize BaseViewer.')
          }

          const viewerVersion = '2.12.313'

          if (_pdfjsLib.version !== viewerVersion) {
            throw new Error('The API version "'.concat(_pdfjsLib.version, '" does not match the Viewer version "').concat(viewerVersion, '".'))
          }

          this.container = options.container
          this.viewer = options.viewer || options.container.firstElementChild

          if (!(((_this$container = this.container) === null || _this$container === void 0 ? void 0 : _this$container.tagName.toUpperCase()) === 'DIV' && ((_this$viewer = this.viewer) === null || _this$viewer === void 0 ? void 0 : _this$viewer.tagName.toUpperCase()) === 'DIV')) {
            throw new Error('Invalid `container` and/or `viewer` option.')
          }

          if (this.container.offsetParent && getComputedStyle(this.container).position !== 'absolute') {
            throw new Error('The `container` must be absolutely positioned.')
          }

          this.eventBus = options.eventBus
          this.linkService = options.linkService || new _pdf_link_service.SimpleLinkService()
          this.downloadManager = options.downloadManager || null
          this.findController = options.findController || null
          this._scriptingManager = options.scriptingManager || null
          this.removePageBorders = options.removePageBorders || false
          this.textLayerMode = (_options$textLayerMod = options.textLayerMode) !== null && _options$textLayerMod !== void 0 ? _options$textLayerMod : _ui_utils.TextLayerMode.ENABLE

          _classPrivateFieldSet(this, _annotationMode, (_options$annotationMo = options.annotationMode) !== null && _options$annotationMo !== void 0 ? _options$annotationMo : _pdfjsLib.AnnotationMode.ENABLE_FORMS)

          this.imageResourcesPath = options.imageResourcesPath || ''
          this.enablePrintAutoRotate = options.enablePrintAutoRotate || false
          this.renderer = options.renderer || _ui_utils.RendererType.CANVAS
          this.useOnlyCssZoom = options.useOnlyCssZoom || false
          this.maxCanvasPixels = options.maxCanvasPixels
          this.l10n = options.l10n || _l10n_utils.NullL10n

          _classPrivateFieldSet(this, _enablePermissions, options.enablePermissions || false)

          this.defaultRenderingQueue = !options.renderingQueue

          if (this.defaultRenderingQueue) {
            this.renderingQueue = new _pdf_rendering_queue.PDFRenderingQueue()
            this.renderingQueue.setViewer(this)
          }
          else {
            this.renderingQueue = options.renderingQueue
          }

          this._doc = document.documentElement
          this.scroll = (0, _ui_utils.watchScroll)(this.container, this._scrollUpdate.bind(this))
          this.presentationModeState = _ui_utils.PresentationModeState.UNKNOWN
          this._onBeforeDraw = this._onAfterDraw = null

          this._resetView()

          if (this.removePageBorders) {
            this.viewer.classList.add('removePageBorders')
          }

          Promise.resolve().then(() => {
            _this.eventBus.dispatch('baseviewerinit', {
              source: _this,
            })
          })
        }

        _createClass(BaseViewer, [{
          key: 'pagesCount',
          get: function get() {
            return this._pages.length
          },
        }, {
          key: 'getPageView',
          value: function getPageView(index) {
            return this._pages[index]
          },
        }, {
          key: 'pageViewsReady',
          get: function get() {
            if (!this._pagesCapability.settled) {
              return false
            }

            return this._pages.every((pageView) => {
              return pageView === null || pageView === void 0 ? void 0 : pageView.pdfPage
            })
          },
        }, {
          key: 'renderForms',
          get: function get() {
            return _classPrivateFieldGet(this, _annotationMode) === _pdfjsLib.AnnotationMode.ENABLE_FORMS
          },
        }, {
          key: 'enableScripting',
          get: function get() {
            return !!this._scriptingManager
          },
        }, {
          key: 'currentPageNumber',
          get: function get() {
            return this._currentPageNumber
          },
          set: function set(val) {
            if (!Number.isInteger(val)) {
              throw new TypeError('Invalid page number.')
            }

            if (!this.pdfDocument) {
              return
            }

            if (!this._setCurrentPageNumber(val, true)) {
              console.error('currentPageNumber: "'.concat(val, '" is not a valid page.'))
            }
          },
        }, {
          key: '_setCurrentPageNumber',
          value: function _setCurrentPageNumber(val) {
            let _this$_pageLabels, _this$_pageLabels2

            const resetCurrentPageView = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false

            if (this._currentPageNumber === val) {
              if (resetCurrentPageView) {
                this._resetCurrentPageView()
              }

              return true
            }

            if (!(val > 0 && val <= this.pagesCount)) {
              return false
            }

            const previous = this._currentPageNumber
            this._currentPageNumber = val
            this.eventBus.dispatch('pagechanging', {
              source: this,
              pageNumber: val,
              pageLabel: (_this$_pageLabels = (_this$_pageLabels2 = this._pageLabels) === null || _this$_pageLabels2 === void 0 ? void 0 : _this$_pageLabels2[val - 1]) !== null && _this$_pageLabels !== void 0 ? _this$_pageLabels : null,
              previous,
            })

            if (resetCurrentPageView) {
              this._resetCurrentPageView()
            }

            return true
          },
        }, {
          key: 'currentPageLabel',
          get: function get() {
            let _this$_pageLabels3, _this$_pageLabels4

            return (_this$_pageLabels3 = (_this$_pageLabels4 = this._pageLabels) === null || _this$_pageLabels4 === void 0 ? void 0 : _this$_pageLabels4[this._currentPageNumber - 1]) !== null && _this$_pageLabels3 !== void 0 ? _this$_pageLabels3 : null
          },
          set: function set(val) {
            if (!this.pdfDocument) {
              return
            }

            let page = val | 0

            if (this._pageLabels) {
              const i = this._pageLabels.indexOf(val)

              if (i >= 0) {
                page = i + 1
              }
            }

            if (!this._setCurrentPageNumber(page, true)) {
              console.error('currentPageLabel: "'.concat(val, '" is not a valid page.'))
            }
          },
        }, {
          key: 'currentScale',
          get: function get() {
            return this._currentScale !== _ui_utils.UNKNOWN_SCALE ? this._currentScale : _ui_utils.DEFAULT_SCALE
          },
          set: function set(val) {
            if (isNaN(val)) {
              throw new TypeError('Invalid numeric scale.')
            }

            if (!this.pdfDocument) {
              return
            }

            this._setScale(val, false)
          },
        }, {
          key: 'currentScaleValue',
          get: function get() {
            return this._currentScaleValue
          },
          set: function set(val) {
            if (!this.pdfDocument) {
              return
            }

            this._setScale(val, false)
          },
        }, {
          key: 'pagesRotation',
          get: function get() {
            return this._pagesRotation
          },
          set: function set(rotation) {
            if (!(0, _ui_utils.isValidRotation)(rotation)) {
              throw new Error('Invalid pages rotation angle.')
            }

            if (!this.pdfDocument) {
              return
            }

            rotation %= 360

            if (rotation < 0) {
              rotation += 360
            }

            if (this._pagesRotation === rotation) {
              return
            }

            this._pagesRotation = rotation
            const pageNumber = this._currentPageNumber
            const updateArgs = {
              rotation,
            }

            const _iterator2 = _createForOfIteratorHelper(this._pages)
            let _step2

            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                const pageView = _step2.value
                pageView.update(updateArgs)
              }
            }
            catch (err) {
              _iterator2.e(err)
            }
            finally {
              _iterator2.f()
            }

            if (this._currentScaleValue) {
              this._setScale(this._currentScaleValue, true)
            }

            this.eventBus.dispatch('rotationchanging', {
              source: this,
              pagesRotation: rotation,
              pageNumber,
            })

            if (this.defaultRenderingQueue) {
              this.update()
            }
          },
        }, {
          key: 'firstPagePromise',
          get: function get() {
            return this.pdfDocument ? this._firstPageCapability.promise : null
          },
        }, {
          key: 'onePageRendered',
          get: function get() {
            return this.pdfDocument ? this._onePageRenderedCapability.promise : null
          },
        }, {
          key: 'pagesPromise',
          get: function get() {
            return this.pdfDocument ? this._pagesCapability.promise : null
          },
        }, {
          key: 'setDocument',
          value: function setDocument(pdfDocument) {
            const _this2 = this

            if (this.pdfDocument) {
              this.eventBus.dispatch('pagesdestroy', {
                source: this,
              })

              this._cancelRendering()

              this._resetView()

              if (this.findController) {
                this.findController.setDocument(null)
              }

              if (this._scriptingManager) {
                this._scriptingManager.setDocument(null)
              }
            }

            this.pdfDocument = pdfDocument

            if (!pdfDocument) {
              return
            }

            const isPureXfa = pdfDocument.isPureXfa
            const pagesCount = pdfDocument.numPages
            const firstPagePromise = pdfDocument.getPage(1)
            const optionalContentConfigPromise = pdfDocument.getOptionalContentConfig()
            const permissionsPromise = _classPrivateFieldGet(this, _enablePermissions) ? pdfDocument.getPermissions() : Promise.resolve()

            if (pagesCount > PagesCountLimit.FORCE_SCROLL_MODE_PAGE) {
              console.warn('Forcing PAGE-scrolling for performance reasons, given the length of the document.')
              const mode = this._scrollMode = _ui_utils.ScrollMode.PAGE
              this.eventBus.dispatch('scrollmodechanged', {
                source: this,
                mode,
              })
            }

            this._pagesCapability.promise.then(() => {
              _this2.eventBus.dispatch('pagesloaded', {
                source: _this2,
                pagesCount,
              })
            }, () => { })

            this._onBeforeDraw = function (evt) {
              const pageView = _this2._pages[evt.pageNumber - 1]

              if (!pageView) {
                return
              }

              _classPrivateFieldGet(_this2, _buffer).push(pageView)
            }

            this.eventBus._on('pagerender', this._onBeforeDraw)

            this._onAfterDraw = function (evt) {
              if (evt.cssTransform || _this2._onePageRenderedCapability.settled) {
                return
              }

              _this2._onePageRenderedCapability.resolve({
                timestamp: evt.timestamp,
              })

              _this2.eventBus._off('pagerendered', _this2._onAfterDraw)

              _this2._onAfterDraw = null
            }

            this.eventBus._on('pagerendered', this._onAfterDraw)

            Promise.all([firstPagePromise, permissionsPromise]).then((_ref) => {
              const _ref2 = _slicedToArray(_ref, 2)
              const firstPdfPage = _ref2[0]
              const permissions = _ref2[1]

              if (pdfDocument !== _this2.pdfDocument) {
                return
              }

              _this2._firstPageCapability.resolve(firstPdfPage)

              _this2._optionalContentConfigPromise = optionalContentConfigPromise

              _classPrivateMethodGet(_this2, _initializePermissions, _initializePermissions2).call(_this2, permissions)

              const viewerElement = _this2._scrollMode === _ui_utils.ScrollMode.PAGE ? null : _this2.viewer
              const scale = _this2.currentScale
              const viewport = firstPdfPage.getViewport({
                scale: scale * _pdfjsLib.PixelsPerInch.PDF_TO_CSS_UNITS,
              })
              const textLayerFactory = _this2.textLayerMode !== _ui_utils.TextLayerMode.DISABLE && !isPureXfa ? _this2 : null
              const annotationLayerFactory = _classPrivateFieldGet(_this2, _annotationMode) !== _pdfjsLib.AnnotationMode.DISABLE ? _this2 : null
              const xfaLayerFactory = isPureXfa ? _this2 : null

              for (let pageNum = 1; pageNum <= pagesCount; ++pageNum) {
                const pageView = new _pdf_page_view.PDFPageView({
                  container: viewerElement,
                  eventBus: _this2.eventBus,
                  id: pageNum,
                  scale,
                  defaultViewport: viewport.clone(),
                  optionalContentConfigPromise,
                  renderingQueue: _this2.renderingQueue,
                  textLayerFactory,
                  textLayerMode: _this2.textLayerMode,
                  annotationLayerFactory,
                  annotationMode: _classPrivateFieldGet(_this2, _annotationMode),
                  xfaLayerFactory,
                  textHighlighterFactory: _this2,
                  structTreeLayerFactory: _this2,
                  imageResourcesPath: _this2.imageResourcesPath,
                  renderer: _this2.renderer,
                  useOnlyCssZoom: _this2.useOnlyCssZoom,
                  maxCanvasPixels: _this2.maxCanvasPixels,
                  l10n: _this2.l10n,
                })

                _this2._pages.push(pageView)
              }

              const firstPageView = _this2._pages[0]

              if (firstPageView) {
                firstPageView.setPdfPage(firstPdfPage)

                _this2.linkService.cachePageRef(1, firstPdfPage.ref)
              }

              if (_this2._scrollMode === _ui_utils.ScrollMode.PAGE) {
                _classPrivateMethodGet(_this2, _ensurePageViewVisible, _ensurePageViewVisible2).call(_this2)
              }
              else if (_this2._spreadMode !== _ui_utils.SpreadMode.NONE) {
                _this2._updateSpreadMode()
              }

              _classPrivateMethodGet(_this2, _onePageRenderedOrForceFetch, _onePageRenderedOrForceFetch2).call(_this2).then(/* #__PURE__ */_asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee() {
                let getPagesLeft, _loop, _pageNum

                return _regenerator.default.wrap((_context2) => {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        if (_this2.findController) {
                          _this2.findController.setDocument(pdfDocument)
                        }

                        if (_this2._scriptingManager) {
                          _this2._scriptingManager.setDocument(pdfDocument)
                        }

                        if (!(pdfDocument.loadingParams.disableAutoFetch || pagesCount > PagesCountLimit.FORCE_LAZY_PAGE_INIT)) {
                          _context2.next = 5
                          break
                        }

                        _this2._pagesCapability.resolve()

                        return _context2.abrupt('return')

                      case 5:
                        getPagesLeft = pagesCount - 1

                        if (!(getPagesLeft <= 0)) {
                          _context2.next = 9
                          break
                        }

                        _this2._pagesCapability.resolve()

                        return _context2.abrupt('return')

                      case 9:
                        _loop = /* #__PURE__ */_regenerator.default.mark(function _loop(_pageNum) {
                          let promise
                          return _regenerator.default.wrap((_context) => {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  promise = pdfDocument.getPage(_pageNum).then((pdfPage) => {
                                    const pageView = _this2._pages[_pageNum - 1]

                                    if (!pageView.pdfPage) {
                                      pageView.setPdfPage(pdfPage)
                                    }

                                    _this2.linkService.cachePageRef(_pageNum, pdfPage.ref)

                                    if (--getPagesLeft === 0) {
                                      _this2._pagesCapability.resolve()
                                    }
                                  }, (reason) => {
                                    console.error('Unable to get page '.concat(_pageNum, ' to initialize viewer'), reason)

                                    if (--getPagesLeft === 0) {
                                      _this2._pagesCapability.resolve()
                                    }
                                  })

                                  if (!(_pageNum % PagesCountLimit.PAUSE_EAGER_PAGE_INIT === 0)) {
                                    _context.next = 4
                                    break
                                  }

                                  _context.next = 4
                                  return promise

                                case 4:
                                case 'end':
                                  return _context.stop()
                              }
                            }
                          }, _loop)
                        })
                        _pageNum = 2

                      case 11:
                        if (!(_pageNum <= pagesCount)) {
                          _context2.next = 16
                          break
                        }

                        return _context2.delegateYield(_loop(_pageNum), 't0', 13)

                      case 13:
                        ++_pageNum
                        _context2.next = 11
                        break

                      case 16:
                      case 'end':
                        return _context2.stop()
                    }
                  }
                }, _callee)
              })))

              _this2.eventBus.dispatch('pagesinit', {
                source: _this2,
              })

              pdfDocument.getMetadata().then((_ref4) => {
                const info = _ref4.info

                if (pdfDocument !== _this2.pdfDocument) {
                  return
                }

                if (info.Language) {
                  _this2.viewer.lang = info.Language
                }
              })

              if (_this2.defaultRenderingQueue) {
                _this2.update()
              }
            }).catch((reason) => {
              console.error('Unable to initialize viewer', reason)

              _this2._pagesCapability.reject(reason)
            })
          },
        }, {
          key: 'setPageLabels',
          value: function setPageLabels(labels) {
            if (!this.pdfDocument) {
              return
            }

            if (!labels) {
              this._pageLabels = null
            }
            else if (!(Array.isArray(labels) && this.pdfDocument.numPages === labels.length)) {
              this._pageLabels = null
              console.error('setPageLabels: Invalid page labels.')
            }
            else {
              this._pageLabels = labels
            }

            for (let i = 0, ii = this._pages.length; i < ii; i++) {
              var _this$_pageLabels$i, _this$_pageLabels5

              this._pages[i].setPageLabel((_this$_pageLabels$i = (_this$_pageLabels5 = this._pageLabels) === null || _this$_pageLabels5 === void 0 ? void 0 : _this$_pageLabels5[i]) !== null && _this$_pageLabels$i !== void 0 ? _this$_pageLabels$i : null)
            }
          },
        }, {
          key: '_resetView',
          value: function _resetView() {
            this._pages = []
            this._currentPageNumber = 1
            this._currentScale = _ui_utils.UNKNOWN_SCALE
            this._currentScaleValue = null
            this._pageLabels = null

            _classPrivateFieldSet(this, _buffer, new PDFPageViewBuffer(DEFAULT_CACHE_SIZE))

            this._location = null
            this._pagesRotation = 0
            this._optionalContentConfigPromise = null
            this._firstPageCapability = (0, _pdfjsLib.createPromiseCapability)()
            this._onePageRenderedCapability = (0, _pdfjsLib.createPromiseCapability)()
            this._pagesCapability = (0, _pdfjsLib.createPromiseCapability)()
            this._scrollMode = _ui_utils.ScrollMode.VERTICAL
            this._previousScrollMode = _ui_utils.ScrollMode.UNKNOWN
            this._spreadMode = _ui_utils.SpreadMode.NONE

            _classPrivateFieldSet(this, _scrollModePageState, {
              previousPageNumber: 1,
              scrollDown: true,
              pages: [],
            })

            if (this._onBeforeDraw) {
              this.eventBus._off('pagerender', this._onBeforeDraw)

              this._onBeforeDraw = null
            }

            if (this._onAfterDraw) {
              this.eventBus._off('pagerendered', this._onAfterDraw)

              this._onAfterDraw = null
            }

            this.viewer.textContent = ''

            this._updateScrollMode()

            this.viewer.removeAttribute('lang')
            this.viewer.classList.remove(ENABLE_PERMISSIONS_CLASS)

            if (_classPrivateFieldGet(this, _previousAnnotationMode) !== null) {
              _classPrivateFieldSet(this, _annotationMode, _classPrivateFieldGet(this, _previousAnnotationMode))

              _classPrivateFieldSet(this, _previousAnnotationMode, null)
            }
          },
        }, {
          key: '_scrollUpdate',
          value: function _scrollUpdate() {
            if (this.pagesCount === 0) {
              return
            }

            this.update()
          },
        }, {
          key: '_scrollIntoView',
          value: function _scrollIntoView(_ref5) {
            const pageDiv = _ref5.pageDiv
            const _ref5$pageSpot = _ref5.pageSpot
            let pageSpot = _ref5$pageSpot === void 0 ? null : _ref5$pageSpot
            const _ref5$pageNumber = _ref5.pageNumber
            const pageNumber = _ref5$pageNumber === void 0 ? null : _ref5$pageNumber

            if (this._scrollMode === _ui_utils.ScrollMode.PAGE) {
              if (pageNumber) {
                this._setCurrentPageNumber(pageNumber)
              }

              _classPrivateMethodGet(this, _ensurePageViewVisible, _ensurePageViewVisible2).call(this)

              this.update()
            }

            if (!pageSpot && !this.isInPresentationMode) {
              const left = pageDiv.offsetLeft + pageDiv.clientLeft
              const right = left + pageDiv.clientWidth
              const _this$container2 = this.container
              const scrollLeft = _this$container2.scrollLeft
              const clientWidth = _this$container2.clientWidth

              if (this._scrollMode === _ui_utils.ScrollMode.HORIZONTAL || left < scrollLeft || right > scrollLeft + clientWidth) {
                pageSpot = {
                  left: 0,
                  top: 0,
                }
              }
            }

            (0, _ui_utils.scrollIntoView)(pageDiv, pageSpot)
          },
        }, {
          key: '_setScaleUpdatePages',
          value: function _setScaleUpdatePages(newScale, newValue) {
            const noScroll = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false
            const preset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false
            this._currentScaleValue = newValue.toString()

            if (_classPrivateMethodGet(this, _isSameScale, _isSameScale2).call(this, newScale)) {
              if (preset) {
                this.eventBus.dispatch('scalechanging', {
                  source: this,
                  scale: newScale,
                  presetValue: newValue,
                })
              }

              return
            }

            this._doc.style.setProperty('--zoom-factor', newScale)

            this._doc.style.setProperty('--viewport-scale-factor', newScale * _pdfjsLib.PixelsPerInch.PDF_TO_CSS_UNITS)

            const updateArgs = {
              scale: newScale,
            }

            const _iterator3 = _createForOfIteratorHelper(this._pages)
            let _step3

            try {
              for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                const pageView = _step3.value
                pageView.update(updateArgs)
              }
            }
            catch (err) {
              _iterator3.e(err)
            }
            finally {
              _iterator3.f()
            }

            this._currentScale = newScale

            if (!noScroll) {
              let page = this._currentPageNumber
              let dest

              if (this._location && !(this.isInPresentationMode || this.isChangingPresentationMode)) {
                page = this._location.pageNumber
                dest = [null, {
                  name: 'XYZ',
                }, this._location.left, this._location.top, null]
              }

              this.scrollPageIntoView({
                pageNumber: page,
                destArray: dest,
                allowNegativeOffset: true,
              })
            }

            this.eventBus.dispatch('scalechanging', {
              source: this,
              scale: newScale,
              presetValue: preset ? newValue : undefined,
            })

            if (this.defaultRenderingQueue) {
              this.update()
            }

            _classPrivateFieldSet(this, _previousContainerHeight, this.container.clientHeight)
          },
        }, {
          key: '_pageWidthScaleFactor',
          get: function get() {
            if (this._spreadMode !== _ui_utils.SpreadMode.NONE && this._scrollMode !== _ui_utils.ScrollMode.HORIZONTAL) {
              return 2
            }

            return 1
          },
        }, {
          key: '_setScale',
          value: function _setScale(value) {
            const noScroll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false
            let scale = Number.parseFloat(value)

            if (scale > 0) {
              this._setScaleUpdatePages(scale, value, noScroll, false)
            }
            else {
              const currentPage = this._pages[this._currentPageNumber - 1]

              if (!currentPage) {
                return
              }

              let hPadding = _ui_utils.SCROLLBAR_PADDING
              let vPadding = _ui_utils.VERTICAL_PADDING

              if (this.isInPresentationMode) {
                hPadding = vPadding = 4
              }
              else if (this.removePageBorders) {
                hPadding = vPadding = 0
              }

              if (this._scrollMode === _ui_utils.ScrollMode.HORIZONTAL) {
                const _ref6 = [vPadding, hPadding]
                hPadding = _ref6[0]
                vPadding = _ref6[1]
              }

              const pageWidthScale = (this.container.clientWidth - hPadding) / currentPage.width * currentPage.scale / this._pageWidthScaleFactor
              const pageHeightScale = (this.container.clientHeight - vPadding) / currentPage.height * currentPage.scale

              switch (value) {
                case 'page-actual':
                  scale = 1
                  break

                case 'page-width':
                  scale = pageWidthScale
                  break

                case 'page-height':
                  scale = pageHeightScale
                  break

                case 'page-fit':
                  scale = Math.min(pageWidthScale, pageHeightScale)
                  break

                case 'auto':
                  var horizontalScale = (0, _ui_utils.isPortraitOrientation)(currentPage) ? pageWidthScale : Math.min(pageHeightScale, pageWidthScale)
                  scale = Math.min(_ui_utils.MAX_AUTO_SCALE, horizontalScale)
                  break

                default:
                  console.error('_setScale: "'.concat(value, '" is an unknown zoom value.'))
                  return
              }

              this._setScaleUpdatePages(scale, value, noScroll, true)
            }
          },
        }, {
          key: '_resetCurrentPageView',
          value: function _resetCurrentPageView() {
            if (this.isInPresentationMode) {
              this._setScale(this._currentScaleValue, true)
            }

            const pageView = this._pages[this._currentPageNumber - 1]

            this._scrollIntoView({
              pageDiv: pageView.div,
            })
          },
        }, {
          key: 'pageLabelToPageNumber',
          value: function pageLabelToPageNumber(label) {
            if (!this._pageLabels) {
              return null
            }

            const i = this._pageLabels.indexOf(label)

            if (i < 0) {
              return null
            }

            return i + 1
          },
        }, {
          key: 'scrollPageIntoView',
          value: function scrollPageIntoView(_ref7) {
            const pageNumber = _ref7.pageNumber
            const _ref7$destArray = _ref7.destArray
            const destArray = _ref7$destArray === void 0 ? null : _ref7$destArray
            const _ref7$allowNegativeOf = _ref7.allowNegativeOffset
            const allowNegativeOffset = _ref7$allowNegativeOf === void 0 ? false : _ref7$allowNegativeOf
            const _ref7$ignoreDestinati = _ref7.ignoreDestinationZoom
            const ignoreDestinationZoom = _ref7$ignoreDestinati === void 0 ? false : _ref7$ignoreDestinati

            if (!this.pdfDocument) {
              return
            }

            const pageView = Number.isInteger(pageNumber) && this._pages[pageNumber - 1]

            if (!pageView) {
              console.error('scrollPageIntoView: "'.concat(pageNumber, '" is not a valid pageNumber parameter.'))
              return
            }

            if (this.isInPresentationMode || !destArray) {
              this._setCurrentPageNumber(pageNumber, true)

              return
            }

            let x = 0
            let y = 0
            let width = 0
            let height = 0
            let widthScale
            let heightScale
            const changeOrientation = pageView.rotation % 180 !== 0
            const pageWidth = (changeOrientation ? pageView.height : pageView.width) / pageView.scale / _pdfjsLib.PixelsPerInch.PDF_TO_CSS_UNITS
            const pageHeight = (changeOrientation ? pageView.width : pageView.height) / pageView.scale / _pdfjsLib.PixelsPerInch.PDF_TO_CSS_UNITS
            let scale = 0

            switch (destArray[1].name) {
              case 'XYZ':
                x = destArray[2]
                y = destArray[3]
                scale = destArray[4]
                x = x !== null ? x : 0
                y = y !== null ? y : pageHeight
                break

              case 'Fit':
              case 'FitB':
                scale = 'page-fit'
                break

              case 'FitH':
              case 'FitBH':
                y = destArray[2]
                scale = 'page-width'

                if (y === null && this._location) {
                  x = this._location.left
                  y = this._location.top
                }
                else if (typeof y !== 'number' || y < 0) {
                  y = pageHeight
                }

                break

              case 'FitV':
              case 'FitBV':
                x = destArray[2]
                width = pageWidth
                height = pageHeight
                scale = 'page-height'
                break

              case 'FitR':
                x = destArray[2]
                y = destArray[3]
                width = destArray[4] - x
                height = destArray[5] - y
                var hPadding = this.removePageBorders ? 0 : _ui_utils.SCROLLBAR_PADDING
                var vPadding = this.removePageBorders ? 0 : _ui_utils.VERTICAL_PADDING
                widthScale = (this.container.clientWidth - hPadding) / width / _pdfjsLib.PixelsPerInch.PDF_TO_CSS_UNITS
                heightScale = (this.container.clientHeight - vPadding) / height / _pdfjsLib.PixelsPerInch.PDF_TO_CSS_UNITS
                scale = Math.min(Math.abs(widthScale), Math.abs(heightScale))
                break

              default:
                console.error('scrollPageIntoView: "'.concat(destArray[1].name, '" is not a valid destination type.'))
                return
            }

            if (!ignoreDestinationZoom) {
              if (scale && scale !== this._currentScale) {
                this.currentScaleValue = scale
              }
              else if (this._currentScale === _ui_utils.UNKNOWN_SCALE) {
                this.currentScaleValue = _ui_utils.DEFAULT_SCALE_VALUE
              }
            }

            if (scale === 'page-fit' && !destArray[4]) {
              this._scrollIntoView({
                pageDiv: pageView.div,
                pageNumber,
              })

              return
            }

            const boundingRect = [pageView.viewport.convertToViewportPoint(x, y), pageView.viewport.convertToViewportPoint(x + width, y + height)]
            let left = Math.min(boundingRect[0][0], boundingRect[1][0])
            let top = Math.min(boundingRect[0][1], boundingRect[1][1])

            if (!allowNegativeOffset) {
              left = Math.max(left, 0)
              top = Math.max(top, 0)
            }

            this._scrollIntoView({
              pageDiv: pageView.div,
              pageSpot: {
                left,
                top,
              },
              pageNumber,
            })
          },
        }, {
          key: '_updateLocation',
          value: function _updateLocation(firstPage) {
            const currentScale = this._currentScale
            const currentScaleValue = this._currentScaleValue
            const normalizedScaleValue = Number.parseFloat(currentScaleValue) === currentScale ? Math.round(currentScale * 10000) / 100 : currentScaleValue
            const pageNumber = firstPage.id
            let pdfOpenParams = `#page=${pageNumber}`
            pdfOpenParams += `&zoom=${normalizedScaleValue}`
            const currentPageView = this._pages[pageNumber - 1]
            const container = this.container
            const topLeft = currentPageView.getPagePoint(container.scrollLeft - firstPage.x, container.scrollTop - firstPage.y)
            const intLeft = Math.round(topLeft[0])
            const intTop = Math.round(topLeft[1])
            pdfOpenParams += `,${intLeft},${intTop}`
            this._location = {
              pageNumber,
              scale: normalizedScaleValue,
              top: intTop,
              left: intLeft,
              rotation: this._pagesRotation,
              pdfOpenParams,
            }
          },
        }, {
          key: 'update',
          value: function update() {
            const visible = this._getVisiblePages()

            const visiblePages = visible.views
            const numVisiblePages = visiblePages.length

            if (numVisiblePages === 0) {
              return
            }

            const newCacheSize = Math.max(DEFAULT_CACHE_SIZE, 2 * numVisiblePages + 1)

            _classPrivateFieldGet(this, _buffer).resize(newCacheSize, visible.ids)

            this.renderingQueue.renderHighestPriority(visible)

            if (!this.isInPresentationMode) {
              const isSimpleLayout = this._spreadMode === _ui_utils.SpreadMode.NONE && (this._scrollMode === _ui_utils.ScrollMode.PAGE || this._scrollMode === _ui_utils.ScrollMode.VERTICAL)
              let currentId = this._currentPageNumber
              let stillFullyVisible = false

              const _iterator4 = _createForOfIteratorHelper(visiblePages)
              let _step4

              try {
                for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                  const page = _step4.value

                  if (page.percent < 100) {
                    break
                  }

                  if (page.id === currentId && isSimpleLayout) {
                    stillFullyVisible = true
                    break
                  }
                }
              }
              catch (err) {
                _iterator4.e(err)
              }
              finally {
                _iterator4.f()
              }

              if (!stillFullyVisible) {
                currentId = visiblePages[0].id
              }

              this._setCurrentPageNumber(currentId)
            }

            this._updateLocation(visible.first)

            this.eventBus.dispatch('updateviewarea', {
              source: this,
              location: this._location,
            })
          },
        }, {
          key: 'containsElement',
          value: function containsElement(element) {
            return this.container.contains(element)
          },
        }, {
          key: 'focus',
          value: function focus() {
            this.container.focus()
          },
        }, {
          key: '_isContainerRtl',
          get: function get() {
            return getComputedStyle(this.container).direction === 'rtl'
          },
        }, {
          key: 'isInPresentationMode',
          get: function get() {
            return this.presentationModeState === _ui_utils.PresentationModeState.FULLSCREEN
          },
        }, {
          key: 'isChangingPresentationMode',
          get: function get() {
            return this.presentationModeState === _ui_utils.PresentationModeState.CHANGING
          },
        }, {
          key: 'isHorizontalScrollbarEnabled',
          get: function get() {
            return this.isInPresentationMode ? false : this.container.scrollWidth > this.container.clientWidth
          },
        }, {
          key: 'isVerticalScrollbarEnabled',
          get: function get() {
            return this.isInPresentationMode ? false : this.container.scrollHeight > this.container.clientHeight
          },
        }, {
          key: '_getCurrentVisiblePage',
          value: function _getCurrentVisiblePage() {
            if (!this.pagesCount) {
              return {
                views: [],
              }
            }

            const pageView = this._pages[this._currentPageNumber - 1]
            const element = pageView.div
            const view = {
              id: pageView.id,
              x: element.offsetLeft + element.clientLeft,
              y: element.offsetTop + element.clientTop,
              view: pageView,
            }
            const ids = new Set([pageView.id])
            return {
              first: view,
              last: view,
              views: [view],
              ids,
            }
          },
        }, {
          key: '_getVisiblePages',
          value: function _getVisiblePages() {
            if (this.isInPresentationMode) {
              return this._getCurrentVisiblePage()
            }

            const views = this._scrollMode === _ui_utils.ScrollMode.PAGE ? _classPrivateFieldGet(this, _scrollModePageState).pages : this._pages
            const horizontal = this._scrollMode === _ui_utils.ScrollMode.HORIZONTAL
            const rtl = horizontal && this._isContainerRtl
            return (0, _ui_utils.getVisibleElements)({
              scrollEl: this.container,
              views,
              sortByVisibility: true,
              horizontal,
              rtl,
            })
          },
        }, {
          key: 'isPageVisible',
          value: function isPageVisible(pageNumber) {
            if (!this.pdfDocument) {
              return false
            }

            if (!(Number.isInteger(pageNumber) && pageNumber > 0 && pageNumber <= this.pagesCount)) {
              console.error('isPageVisible: "'.concat(pageNumber, '" is not a valid page.'))
              return false
            }

            return this._getVisiblePages().ids.has(pageNumber)
          },
        }, {
          key: 'isPageCached',
          value: function isPageCached(pageNumber) {
            if (!this.pdfDocument) {
              return false
            }

            if (!(Number.isInteger(pageNumber) && pageNumber > 0 && pageNumber <= this.pagesCount)) {
              console.error('isPageCached: "'.concat(pageNumber, '" is not a valid page.'))
              return false
            }

            const pageView = this._pages[pageNumber - 1]
            return _classPrivateFieldGet(this, _buffer).has(pageView)
          },
        }, {
          key: 'cleanup',
          value: function cleanup() {
            for (let i = 0, ii = this._pages.length; i < ii; i++) {
              if (this._pages[i] && this._pages[i].renderingState !== _ui_utils.RenderingStates.FINISHED) {
                this._pages[i].reset()
              }
            }
          },
        }, {
          key: '_cancelRendering',
          value: function _cancelRendering() {
            for (let i = 0, ii = this._pages.length; i < ii; i++) {
              if (this._pages[i]) {
                this._pages[i].cancelRendering()
              }
            }
          },
        }, {
          key: 'forceRendering',
          value: function forceRendering(currentlyVisiblePages) {
            const _this3 = this

            const visiblePages = currentlyVisiblePages || this._getVisiblePages()

            const scrollAhead = _classPrivateMethodGet(this, _getScrollAhead, _getScrollAhead2).call(this, visiblePages)

            const preRenderExtra = this._spreadMode !== _ui_utils.SpreadMode.NONE && this._scrollMode !== _ui_utils.ScrollMode.HORIZONTAL
            const pageView = this.renderingQueue.getHighestPriority(visiblePages, this._pages, scrollAhead, preRenderExtra)

            _classPrivateMethodGet(this, _toggleLoadingIconSpinner, _toggleLoadingIconSpinner2).call(this, visiblePages.ids)

            if (pageView) {
              _classPrivateMethodGet(this, _ensurePdfPageLoaded, _ensurePdfPageLoaded2).call(this, pageView).then(() => {
                _this3.renderingQueue.renderView(pageView)
              })

              return true
            }

            return false
          },
        }, {
          key: 'createTextLayerBuilder',
          value: function createTextLayerBuilder(textLayerDiv, pageIndex, viewport) {
            const enhanceTextSelection = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false
            const eventBus = arguments.length > 4 ? arguments[4] : undefined
            const highlighter = arguments.length > 5 ? arguments[5] : undefined
            return new _text_layer_builder.TextLayerBuilder({
              textLayerDiv,
              eventBus,
              pageIndex,
              viewport,
              enhanceTextSelection: this.isInPresentationMode ? false : enhanceTextSelection,
              highlighter,
            })
          },
        }, {
          key: 'createTextHighlighter',
          value: function createTextHighlighter(pageIndex, eventBus) {
            return new _text_highlighter.TextHighlighter({
              eventBus,
              pageIndex,
              findController: this.isInPresentationMode ? null : this.findController,
            })
          },
        }, {
          key: 'createAnnotationLayerBuilder',
          value: function createAnnotationLayerBuilder(pageDiv, pdfPage) {
            let _this$pdfDocument, _this$pdfDocument2, _this$pdfDocument3, _this$_scriptingManag

            const annotationStorage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null
            const imageResourcesPath = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ''
            const renderForms = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true
            const l10n = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _l10n_utils.NullL10n
            const enableScripting = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null
            const hasJSActionsPromise = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : null
            const mouseState = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : null
            const fieldObjectsPromise = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : null
            const annotationCanvasMap = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : null
            return new _annotation_layer_builder.AnnotationLayerBuilder({
              pageDiv,
              pdfPage,
              annotationStorage: annotationStorage || ((_this$pdfDocument = this.pdfDocument) === null || _this$pdfDocument === void 0 ? void 0 : _this$pdfDocument.annotationStorage),
              imageResourcesPath,
              renderForms,
              linkService: this.linkService,
              downloadManager: this.downloadManager,
              l10n,
              enableScripting: enableScripting !== null && enableScripting !== void 0 ? enableScripting : this.enableScripting,
              hasJSActionsPromise: hasJSActionsPromise || ((_this$pdfDocument2 = this.pdfDocument) === null || _this$pdfDocument2 === void 0 ? void 0 : _this$pdfDocument2.hasJSActions()),
              fieldObjectsPromise: fieldObjectsPromise || ((_this$pdfDocument3 = this.pdfDocument) === null || _this$pdfDocument3 === void 0 ? void 0 : _this$pdfDocument3.getFieldObjects()),
              mouseState: mouseState || ((_this$_scriptingManag = this._scriptingManager) === null || _this$_scriptingManag === void 0 ? void 0 : _this$_scriptingManag.mouseState),
              annotationCanvasMap,
            })
          },
        }, {
          key: 'createXfaLayerBuilder',
          value: function createXfaLayerBuilder(pageDiv, pdfPage) {
            let _this$pdfDocument4

            const annotationStorage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null
            return new _xfa_layer_builder.XfaLayerBuilder({
              pageDiv,
              pdfPage,
              annotationStorage: annotationStorage || ((_this$pdfDocument4 = this.pdfDocument) === null || _this$pdfDocument4 === void 0 ? void 0 : _this$pdfDocument4.annotationStorage),
              linkService: this.linkService,
            })
          },
        }, {
          key: 'createStructTreeLayerBuilder',
          value: function createStructTreeLayerBuilder(pdfPage) {
            return new _struct_tree_layer_builder.StructTreeLayerBuilder({
              pdfPage,
            })
          },
        }, {
          key: 'hasEqualPageSizes',
          get: function get() {
            const firstPageView = this._pages[0]

            for (let i = 1, ii = this._pages.length; i < ii; ++i) {
              const pageView = this._pages[i]

              if (pageView.width !== firstPageView.width || pageView.height !== firstPageView.height) {
                return false
              }
            }

            return true
          },
        }, {
          key: 'getPagesOverview',
          value: function getPagesOverview() {
            const _this4 = this

            return this._pages.map((pageView) => {
              const viewport = pageView.pdfPage.getViewport({
                scale: 1,
              })

              if (!_this4.enablePrintAutoRotate || (0, _ui_utils.isPortraitOrientation)(viewport)) {
                return {
                  width: viewport.width,
                  height: viewport.height,
                  rotation: viewport.rotation,
                }
              }

              return {
                width: viewport.height,
                height: viewport.width,
                rotation: (viewport.rotation - 90) % 360,
              }
            })
          },
        }, {
          key: 'optionalContentConfigPromise',
          get: function get() {
            if (!this.pdfDocument) {
              return Promise.resolve(null)
            }

            if (!this._optionalContentConfigPromise) {
              return this.pdfDocument.getOptionalContentConfig()
            }

            return this._optionalContentConfigPromise
          },
          set: function set(promise) {
            if (!(promise instanceof Promise)) {
              throw new TypeError('Invalid optionalContentConfigPromise: '.concat(promise))
            }

            if (!this.pdfDocument) {
              return
            }

            if (!this._optionalContentConfigPromise) {
              return
            }

            this._optionalContentConfigPromise = promise
            const updateArgs = {
              optionalContentConfigPromise: promise,
            }

            const _iterator5 = _createForOfIteratorHelper(this._pages)
            let _step5

            try {
              for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                const pageView = _step5.value
                pageView.update(updateArgs)
              }
            }
            catch (err) {
              _iterator5.e(err)
            }
            finally {
              _iterator5.f()
            }

            this.update()
            this.eventBus.dispatch('optionalcontentconfigchanged', {
              source: this,
              promise,
            })
          },
        }, {
          key: 'scrollMode',
          get: function get() {
            return this._scrollMode
          },
          set: function set(mode) {
            if (this._scrollMode === mode) {
              return
            }

            if (!(0, _ui_utils.isValidScrollMode)(mode)) {
              throw new Error('Invalid scroll mode: '.concat(mode))
            }

            if (this.pagesCount > PagesCountLimit.FORCE_SCROLL_MODE_PAGE) {
              return
            }

            this._previousScrollMode = this._scrollMode
            this._scrollMode = mode
            this.eventBus.dispatch('scrollmodechanged', {
              source: this,
              mode,
            })

            this._updateScrollMode(this._currentPageNumber)
          },
        }, {
          key: '_updateScrollMode',
          value: function _updateScrollMode() {
            const pageNumber = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null
            const scrollMode = this._scrollMode
            const viewer = this.viewer
            viewer.classList.toggle('scrollHorizontal', scrollMode === _ui_utils.ScrollMode.HORIZONTAL)
            viewer.classList.toggle('scrollWrapped', scrollMode === _ui_utils.ScrollMode.WRAPPED)

            if (!this.pdfDocument || !pageNumber) {
              return
            }

            if (scrollMode === _ui_utils.ScrollMode.PAGE) {
              _classPrivateMethodGet(this, _ensurePageViewVisible, _ensurePageViewVisible2).call(this)
            }
            else if (this._previousScrollMode === _ui_utils.ScrollMode.PAGE) {
              this._updateSpreadMode()
            }

            if (this._currentScaleValue && isNaN(this._currentScaleValue)) {
              this._setScale(this._currentScaleValue, true)
            }

            this._setCurrentPageNumber(pageNumber, true)

            this.update()
          },
        }, {
          key: 'spreadMode',
          get: function get() {
            return this._spreadMode
          },
          set: function set(mode) {
            if (this._spreadMode === mode) {
              return
            }

            if (!(0, _ui_utils.isValidSpreadMode)(mode)) {
              throw new Error('Invalid spread mode: '.concat(mode))
            }

            this._spreadMode = mode
            this.eventBus.dispatch('spreadmodechanged', {
              source: this,
              mode,
            })

            this._updateSpreadMode(this._currentPageNumber)
          },
        }, {
          key: '_updateSpreadMode',
          value: function _updateSpreadMode() {
            const pageNumber = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null

            if (!this.pdfDocument) {
              return
            }

            const viewer = this.viewer
            const pages = this._pages

            if (this._scrollMode === _ui_utils.ScrollMode.PAGE) {
              _classPrivateMethodGet(this, _ensurePageViewVisible, _ensurePageViewVisible2).call(this)
            }
            else {
              viewer.textContent = ''

              if (this._spreadMode === _ui_utils.SpreadMode.NONE) {
                for (let i = 0, ii = pages.length; i < ii; ++i) {
                  viewer.appendChild(pages[i].div)
                }
              }
              else {
                const parity = this._spreadMode - 1
                let spread = null

                for (let _i2 = 0, _ii = pages.length; _i2 < _ii; ++_i2) {
                  if (spread === null) {
                    spread = document.createElement('div')
                    spread.className = 'spread'
                    viewer.appendChild(spread)
                  }
                  else if (_i2 % 2 === parity) {
                    spread = spread.cloneNode(false)
                    viewer.appendChild(spread)
                  }

                  spread.appendChild(pages[_i2].div)
                }
              }
            }

            if (!pageNumber) {
              return
            }

            if (this._currentScaleValue && isNaN(this._currentScaleValue)) {
              this._setScale(this._currentScaleValue, true)
            }

            this._setCurrentPageNumber(pageNumber, true)

            this.update()
          },
        }, {
          key: '_getPageAdvance',
          value: function _getPageAdvance(currentPageNumber) {
            const previous = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false

            switch (this._scrollMode) {
              case _ui_utils.ScrollMode.WRAPPED:
                {
                  const _this$_getVisiblePage = this._getVisiblePages()
                  const views = _this$_getVisiblePage.views
                  const pageLayout = new Map()

                  const _iterator6 = _createForOfIteratorHelper(views)
                  let _step6

                  try {
                    for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                      const _step6$value = _step6.value
                      const id = _step6$value.id
                      const y = _step6$value.y
                      const percent = _step6$value.percent
                      const widthPercent = _step6$value.widthPercent

                      if (percent === 0 || widthPercent < 100) {
                        continue
                      }

                      let yArray = pageLayout.get(y)

                      if (!yArray) {
                        pageLayout.set(y, yArray || (yArray = []))
                      }

                      yArray.push(id)
                    }
                  }
                  catch (err) {
                    _iterator6.e(err)
                  }
                  finally {
                    _iterator6.f()
                  }

                  const _iterator7 = _createForOfIteratorHelper(pageLayout.values())
                  let _step7

                  try {
                    for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
                      const _yArray = _step7.value

                      const currentIndex = _yArray.indexOf(currentPageNumber)

                      if (currentIndex === -1) {
                        continue
                      }

                      const numPages = _yArray.length

                      if (numPages === 1) {
                        break
                      }

                      if (previous) {
                        for (let i = currentIndex - 1, ii = 0; i >= ii; i--) {
                          const currentId = _yArray[i]
                          const expectedId = _yArray[i + 1] - 1

                          if (currentId < expectedId) {
                            return currentPageNumber - expectedId
                          }
                        }
                      }
                      else {
                        for (let _i3 = currentIndex + 1, _ii2 = numPages; _i3 < _ii2; _i3++) {
                          const _currentId = _yArray[_i3]
                          const _expectedId = _yArray[_i3 - 1] + 1

                          if (_currentId > _expectedId) {
                            return _expectedId - currentPageNumber
                          }
                        }
                      }

                      if (previous) {
                        const firstId = _yArray[0]

                        if (firstId < currentPageNumber) {
                          return currentPageNumber - firstId + 1
                        }
                      }
                      else {
                        const lastId = _yArray[numPages - 1]

                        if (lastId > currentPageNumber) {
                          return lastId - currentPageNumber + 1
                        }
                      }

                      break
                    }
                  }
                  catch (err) {
                    _iterator7.e(err)
                  }
                  finally {
                    _iterator7.f()
                  }

                  break
                }

              case _ui_utils.ScrollMode.HORIZONTAL:
                {
                  break
                }

              case _ui_utils.ScrollMode.PAGE:
              case _ui_utils.ScrollMode.VERTICAL:
                {
                  if (this._spreadMode === _ui_utils.SpreadMode.NONE) {
                    break
                  }

                  const parity = this._spreadMode - 1

                  if (previous && currentPageNumber % 2 !== parity) {
                    break
                  }
                  else if (!previous && currentPageNumber % 2 === parity) {
                    break
                  }

                  const _this$_getVisiblePage2 = this._getVisiblePages()
                  const _views = _this$_getVisiblePage2.views
                  const _expectedId2 = previous ? currentPageNumber - 1 : currentPageNumber + 1

                  const _iterator8 = _createForOfIteratorHelper(_views)
                  let _step8

                  try {
                    for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
                      const _step8$value = _step8.value
                      const _id = _step8$value.id
                      const _percent = _step8$value.percent
                      const _widthPercent = _step8$value.widthPercent

                      if (_id !== _expectedId2) {
                        continue
                      }

                      if (_percent > 0 && _widthPercent === 100) {
                        return 2
                      }

                      break
                    }
                  }
                  catch (err) {
                    _iterator8.e(err)
                  }
                  finally {
                    _iterator8.f()
                  }

                  break
                }
            }

            return 1
          },
        }, {
          key: 'nextPage',
          value: function nextPage() {
            const currentPageNumber = this._currentPageNumber
            const pagesCount = this.pagesCount

            if (currentPageNumber >= pagesCount) {
              return false
            }

            const advance = this._getPageAdvance(currentPageNumber, false) || 1
            this.currentPageNumber = Math.min(currentPageNumber + advance, pagesCount)
            return true
          },
        }, {
          key: 'previousPage',
          value: function previousPage() {
            const currentPageNumber = this._currentPageNumber

            if (currentPageNumber <= 1) {
              return false
            }

            const advance = this._getPageAdvance(currentPageNumber, true) || 1
            this.currentPageNumber = Math.max(currentPageNumber - advance, 1)
            return true
          },
        }, {
          key: 'increaseScale',
          value: function increaseScale() {
            let steps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1
            let newScale = this._currentScale

            do {
              newScale = (newScale * _ui_utils.DEFAULT_SCALE_DELTA).toFixed(2)
              newScale = Math.ceil(newScale * 10) / 10
              newScale = Math.min(_ui_utils.MAX_SCALE, newScale)
            } while (--steps > 0 && newScale < _ui_utils.MAX_SCALE)

            this.currentScaleValue = newScale
          },
        }, {
          key: 'decreaseScale',
          value: function decreaseScale() {
            let steps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1
            let newScale = this._currentScale

            do {
              newScale = (newScale / _ui_utils.DEFAULT_SCALE_DELTA).toFixed(2)
              newScale = Math.floor(newScale * 10) / 10
              newScale = Math.max(_ui_utils.MIN_SCALE, newScale)
            } while (--steps > 0 && newScale > _ui_utils.MIN_SCALE)

            this.currentScaleValue = newScale
          },
        }])

        return BaseViewer
      }())

      exports.BaseViewer = BaseViewer

      function _initializePermissions2(permissions) {
        if (!permissions) {
          return
        }

        if (!permissions.includes(_pdfjsLib.PermissionFlag.COPY)) {
          this.viewer.classList.add(ENABLE_PERMISSIONS_CLASS)
        }

        if (!permissions.includes(_pdfjsLib.PermissionFlag.MODIFY_ANNOTATIONS) && !permissions.includes(_pdfjsLib.PermissionFlag.FILL_INTERACTIVE_FORMS)) {
          if (_classPrivateFieldGet(this, _annotationMode) === _pdfjsLib.AnnotationMode.ENABLE_FORMS) {
            _classPrivateFieldSet(this, _previousAnnotationMode, _classPrivateFieldGet(this, _annotationMode))

            _classPrivateFieldSet(this, _annotationMode, _pdfjsLib.AnnotationMode.ENABLE)
          }
        }
      }

      function _onePageRenderedOrForceFetch2() {
        if (!this.container.offsetParent || this._getVisiblePages().views.length === 0) {
          return Promise.resolve()
        }

        return this._onePageRenderedCapability.promise
      }

      function _ensurePageViewVisible2() {
        if (this._scrollMode !== _ui_utils.ScrollMode.PAGE) {
          throw new Error('#ensurePageViewVisible: Invalid scrollMode value.')
        }

        const pageNumber = this._currentPageNumber
        const state = _classPrivateFieldGet(this, _scrollModePageState)
        const viewer = this.viewer

        viewer.textContent = ''
        state.pages.length = 0

        if (this._spreadMode === _ui_utils.SpreadMode.NONE) {
          const pageView = this._pages[pageNumber - 1]

          if (this.isInPresentationMode) {
            const spread = document.createElement('div')
            spread.className = 'spread'
            const dummyPage = document.createElement('div')
            dummyPage.className = 'dummyPage'
            dummyPage.style.height = ''.concat(this.container.clientHeight, 'px')
            spread.appendChild(dummyPage)
            spread.appendChild(pageView.div)
            viewer.appendChild(spread)
          }
          else {
            viewer.appendChild(pageView.div)
          }

          state.pages.push(pageView)
        }
        else {
          const pageIndexSet = new Set()
          const parity = this._spreadMode - 1

          if (pageNumber % 2 !== parity) {
            pageIndexSet.add(pageNumber - 1)
            pageIndexSet.add(pageNumber)
          }
          else {
            pageIndexSet.add(pageNumber - 2)
            pageIndexSet.add(pageNumber - 1)
          }

          let _spread = null

          const _iterator9 = _createForOfIteratorHelper(pageIndexSet)
          let _step9

          try {
            for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
              const i = _step9.value
              const _pageView = this._pages[i]

              if (!_pageView) {
                continue
              }

              if (_spread === null) {
                _spread = document.createElement('div')
                _spread.className = 'spread'
                viewer.appendChild(_spread)
              }
              else if (i % 2 === parity) {
                _spread = _spread.cloneNode(false)
                viewer.appendChild(_spread)
              }

              _spread.appendChild(_pageView.div)

              state.pages.push(_pageView)
            }
          }
          catch (err) {
            _iterator9.e(err)
          }
          finally {
            _iterator9.f()
          }
        }

        state.scrollDown = pageNumber >= state.previousPageNumber
        state.previousPageNumber = pageNumber
      }

      function _isSameScale2(newScale) {
        if (this.isInPresentationMode && this.container.clientHeight !== _classPrivateFieldGet(this, _previousContainerHeight)) {
          return false
        }

        return newScale === this._currentScale || Math.abs(newScale - this._currentScale) < 1e-15
      }

      function _ensurePdfPageLoaded2(_x) {
        return _ensurePdfPageLoaded3.apply(this, arguments)
      }

      function _ensurePdfPageLoaded3() {
        _ensurePdfPageLoaded3 = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee2(pageView) {
          let pdfPage
          return _regenerator.default.wrap(function _callee2$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  if (!pageView.pdfPage) {
                    _context3.next = 2
                    break
                  }

                  return _context3.abrupt('return', pageView.pdfPage)

                case 2:
                  _context3.prev = 2
                  _context3.next = 5
                  return this.pdfDocument.getPage(pageView.id)

                case 5:
                  pdfPage = _context3.sent

                  if (!pageView.pdfPage) {
                    pageView.setPdfPage(pdfPage)
                  }

                  if (!this.linkService._cachedPageNumber(pdfPage.ref)) {
                    this.linkService.cachePageRef(pageView.id, pdfPage.ref)
                  }

                  return _context3.abrupt('return', pdfPage)

                case 11:
                  _context3.prev = 11
                  _context3.t0 = _context3.catch(2)
                  console.error('Unable to get page for page view', _context3.t0)
                  return _context3.abrupt('return', null)

                case 15:
                case 'end':
                  return _context3.stop()
              }
            }
          }, _callee2, this, [[2, 11]])
        }))
        return _ensurePdfPageLoaded3.apply(this, arguments)
      }

      function _getScrollAhead2(visible) {
        let _visible$first, _visible$last

        if (((_visible$first = visible.first) === null || _visible$first === void 0 ? void 0 : _visible$first.id) === 1) {
          return true
        }
        else if (((_visible$last = visible.last) === null || _visible$last === void 0 ? void 0 : _visible$last.id) === this.pagesCount) {
          return false
        }

        switch (this._scrollMode) {
          case _ui_utils.ScrollMode.PAGE:
            return _classPrivateFieldGet(this, _scrollModePageState).scrollDown

          case _ui_utils.ScrollMode.HORIZONTAL:
            return this.scroll.right
        }

        return this.scroll.down
      }

      function _toggleLoadingIconSpinner2(visibleIds) {
        const _iterator10 = _createForOfIteratorHelper(visibleIds)
        let _step10

        try {
          for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
            const id = _step10.value
            const pageView = this._pages[id - 1]
            pageView === null || pageView === void 0 ? void 0 : pageView.toggleLoadingIconSpinner(true)
          }
        }
        catch (err) {
          _iterator10.e(err)
        }
        finally {
          _iterator10.f()
        }

        const _iterator11 = _createForOfIteratorHelper(_classPrivateFieldGet(this, _buffer))
        let _step11

        try {
          for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
            const _pageView2 = _step11.value

            if (visibleIds.has(_pageView2.id)) {
              continue
            }

            _pageView2.toggleLoadingIconSpinner(false)
          }
        }
        catch (err) {
          _iterator11.e(err)
        }
        finally {
          _iterator11.f()
        }
      }

      /***/
    },
    /* 31 */
    /***/ (__unused_webpack_module, exports, __webpack_require__) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.AnnotationLayerBuilder = void 0

      const _regenerator = _interopRequireDefault(__webpack_require__(3))

      const _pdfjsLib = __webpack_require__(7)

      const _l10n_utils = __webpack_require__(32)

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj } }

      function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest() }

      function _nonIterableRest() { throw new TypeError('Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') }

      function _unsupportedIterableToArray(o, minLen) {
        if (!o)
          return; if (typeof o === 'string')
          return _arrayLikeToArray(o, minLen); let n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor)
          n = o.constructor.name; if (n === 'Map' || n === 'Set')
          return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
          return _arrayLikeToArray(o, minLen)
      }

      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length)
          len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2
      }

      function _iterableToArrayLimit(arr, i) {
        let _i = arr == null ? null : typeof Symbol !== 'undefined' && arr[Symbol.iterator] || arr['@@iterator']; if (_i == null)
          return; const _arr = []; let _n = true; let _d = false; let _s, _e; try {
            for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
              _arr.push(_s.value); if (i && _arr.length === i)
                break
            }
          }
        catch (err) { _d = true; _e = err }
        finally {
          try {
            if (!_n && _i.return != null)
              _i.return()
          }
          finally {
            if (_d)
              throw _e
          }
        } return _arr
      }

      function _arrayWithHoles(arr) {
        if (Array.isArray(arr))
          return arr
      }

      function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
        try { var info = gen[key](arg); var value = info.value }
        catch (error) { reject(error); return } if (info.done) { resolve(value) }
        else { Promise.resolve(value).then(_next, _throw) }
      }

      function _asyncToGenerator(fn) { return function () { const self = this; const args = arguments; return new Promise((resolve, reject) => { const gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value) } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err) } _next(undefined) }) } }

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      const AnnotationLayerBuilder = /* #__PURE__ */(function () {
        function AnnotationLayerBuilder(_ref) {
          const pageDiv = _ref.pageDiv
          const pdfPage = _ref.pdfPage
          const linkService = _ref.linkService
          const downloadManager = _ref.downloadManager
          const _ref$annotationStorag = _ref.annotationStorage
          const annotationStorage = _ref$annotationStorag === void 0 ? null : _ref$annotationStorag
          const _ref$imageResourcesPa = _ref.imageResourcesPath
          const imageResourcesPath = _ref$imageResourcesPa === void 0 ? '' : _ref$imageResourcesPa
          const _ref$renderForms = _ref.renderForms
          const renderForms = _ref$renderForms === void 0 ? true : _ref$renderForms
          const _ref$l10n = _ref.l10n
          const l10n = _ref$l10n === void 0 ? _l10n_utils.NullL10n : _ref$l10n
          const _ref$enableScripting = _ref.enableScripting
          const enableScripting = _ref$enableScripting === void 0 ? false : _ref$enableScripting
          const _ref$hasJSActionsProm = _ref.hasJSActionsPromise
          const hasJSActionsPromise = _ref$hasJSActionsProm === void 0 ? null : _ref$hasJSActionsProm
          const _ref$fieldObjectsProm = _ref.fieldObjectsPromise
          const fieldObjectsPromise = _ref$fieldObjectsProm === void 0 ? null : _ref$fieldObjectsProm
          const _ref$mouseState = _ref.mouseState
          const mouseState = _ref$mouseState === void 0 ? null : _ref$mouseState
          const _ref$annotationCanvas = _ref.annotationCanvasMap
          const annotationCanvasMap = _ref$annotationCanvas === void 0 ? null : _ref$annotationCanvas

          _classCallCheck(this, AnnotationLayerBuilder)

          this.pageDiv = pageDiv
          this.pdfPage = pdfPage
          this.linkService = linkService
          this.downloadManager = downloadManager
          this.imageResourcesPath = imageResourcesPath
          this.renderForms = renderForms
          this.l10n = l10n
          this.annotationStorage = annotationStorage
          this.enableScripting = enableScripting
          this._hasJSActionsPromise = hasJSActionsPromise
          this._fieldObjectsPromise = fieldObjectsPromise
          this._mouseState = mouseState
          this._annotationCanvasMap = annotationCanvasMap
          this.div = null
          this._cancelled = false
        }

        _createClass(AnnotationLayerBuilder, [{
          key: 'render',
          value: (function () {
            const _render = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee(viewport) {
              let intent
              let _yield$Promise$all
              let _yield$Promise$all2
              let annotations
              let _yield$Promise$all2$
              let hasJSActions
              let _yield$Promise$all2$2
              let fieldObjects
              let parameters
              const _args = arguments

              return _regenerator.default.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      intent = _args.length > 1 && _args[1] !== undefined ? _args[1] : 'display'
                      _context.next = 3
                      return Promise.all([this.pdfPage.getAnnotations({
                        intent,
                      }), this._hasJSActionsPromise, this._fieldObjectsPromise])

                    case 3:
                      _yield$Promise$all = _context.sent
                      _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 3)
                      annotations = _yield$Promise$all2[0]
                      _yield$Promise$all2$ = _yield$Promise$all2[1]
                      hasJSActions = _yield$Promise$all2$ === void 0 ? false : _yield$Promise$all2$
                      _yield$Promise$all2$2 = _yield$Promise$all2[2]
                      fieldObjects = _yield$Promise$all2$2 === void 0 ? null : _yield$Promise$all2$2

                      if (!(this._cancelled || annotations.length === 0)) {
                        _context.next = 12
                        break
                      }

                      return _context.abrupt('return')

                    case 12:
                      parameters = {
                        viewport: viewport.clone({
                          dontFlip: true,
                        }),
                        div: this.div,
                        annotations,
                        page: this.pdfPage,
                        imageResourcesPath: this.imageResourcesPath,
                        renderForms: this.renderForms,
                        linkService: this.linkService,
                        downloadManager: this.downloadManager,
                        annotationStorage: this.annotationStorage,
                        enableScripting: this.enableScripting,
                        hasJSActions,
                        fieldObjects,
                        mouseState: this._mouseState,
                        annotationCanvasMap: this._annotationCanvasMap,
                      }

                      if (this.div) {
                        _pdfjsLib.AnnotationLayer.update(parameters)
                      }
                      else {
                        this.div = document.createElement('div')
                        this.div.className = 'annotationLayer'
                        this.pageDiv.appendChild(this.div)
                        parameters.div = this.div

                        _pdfjsLib.AnnotationLayer.render(parameters)

                        this.l10n.translate(this.div)
                      }

                    case 14:
                    case 'end':
                      return _context.stop()
                  }
                }
              }, _callee, this)
            }))

            function render(_x) {
              return _render.apply(this, arguments)
            }

            return render
          }()),
        }, {
          key: 'cancel',
          value: function cancel() {
            this._cancelled = true
          },
        }, {
          key: 'hide',
          value: function hide() {
            if (!this.div) {
              return
            }

            this.div.hidden = true
          },
        }])

        return AnnotationLayerBuilder
      }())

      exports.AnnotationLayerBuilder = AnnotationLayerBuilder

      /***/
    },
    /* 32 */
    /***/ (__unused_webpack_module, exports, __webpack_require__) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.NullL10n = void 0
      exports.fixupLangCode = fixupLangCode
      exports.getL10nFallback = getL10nFallback

      const _regenerator = _interopRequireDefault(__webpack_require__(3))

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj } }

      function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
        try { var info = gen[key](arg); var value = info.value }
        catch (error) { reject(error); return } if (info.done) { resolve(value) }
        else { Promise.resolve(value).then(_next, _throw) }
      }

      function _asyncToGenerator(fn) { return function () { const self = this; const args = arguments; return new Promise((resolve, reject) => { const gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value) } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err) } _next(undefined) }) } }

      const DEFAULT_L10N_STRINGS = {
        'of_pages': 'of {{pagesCount}}',
        'page_of_pages': '({{pageNumber}} of {{pagesCount}})',
        'document_properties_kb': '{{size_kb}} KB ({{size_b}} bytes)',
        'document_properties_mb': '{{size_mb}} MB ({{size_b}} bytes)',
        'document_properties_date_string': '{{date}}, {{time}}',
        'document_properties_page_size_unit_inches': 'in',
        'document_properties_page_size_unit_millimeters': 'mm',
        'document_properties_page_size_orientation_portrait': 'portrait',
        'document_properties_page_size_orientation_landscape': 'landscape',
        'document_properties_page_size_name_a3': 'A3',
        'document_properties_page_size_name_a4': 'A4',
        'document_properties_page_size_name_letter': 'Letter',
        'document_properties_page_size_name_legal': 'Legal',
        'document_properties_page_size_dimension_string': '{{width}} × {{height}} {{unit}} ({{orientation}})',
        'document_properties_page_size_dimension_name_string': '{{width}} × {{height}} {{unit}} ({{name}}, {{orientation}})',
        'document_properties_linearized_yes': 'Yes',
        'document_properties_linearized_no': 'No',
        'print_progress_percent': '{{progress}}%',
        'toggle_sidebar.title': 'Toggle Sidebar',
        'toggle_sidebar_notification2.title': 'Toggle Sidebar (document contains outline/attachments/layers)',
        'additional_layers': 'Additional Layers',
        'page_landmark': 'Page {{page}}',
        'thumb_page_title': 'Page {{page}}',
        'thumb_page_canvas': 'Thumbnail of Page {{page}}',
        'find_reached_top': 'Reached top of document, continued from bottom',
        'find_reached_bottom': 'Reached end of document, continued from top',
        'find_match_count[one]': '{{current}} of {{total}} match',
        'find_match_count[other]': '{{current}} of {{total}} matches',
        'find_match_count_limit[one]': 'More than {{limit}} match',
        'find_match_count_limit[other]': 'More than {{limit}} matches',
        'find_not_found': 'Phrase not found',
        'error_version_info': 'PDF.js v{{version}} (build: {{build}})',
        'error_message': 'Message: {{message}}',
        'error_stack': 'Stack: {{stack}}',
        'error_file': 'File: {{file}}',
        'error_line': 'Line: {{line}}',
        'rendering_error': 'An error occurred while rendering the page.',
        'page_scale_width': 'Page Width',
        'page_scale_fit': 'Page Fit',
        'page_scale_auto': 'Automatic Zoom',
        'page_scale_actual': 'Actual Size',
        'page_scale_percent': '{{scale}}%',
        'loading': 'Loading…',
        'loading_error': 'An error occurred while loading the PDF.',
        'invalid_file_error': 'Invalid or corrupted PDF file.',
        'missing_file_error': 'Missing PDF file.',
        'unexpected_response_error': 'Unexpected server response.',
        'printing_not_supported': 'Warning: Printing is not fully supported by this browser.',
        'printing_not_ready': 'Warning: The PDF is not fully loaded for printing.',
        'web_fonts_disabled': 'Web fonts are disabled: unable to use embedded PDF fonts.',
      }

      function getL10nFallback(key, args) {
        switch (key) {
          case 'find_match_count':
            key = 'find_match_count['.concat(args.total === 1 ? 'one' : 'other', ']')
            break

          case 'find_match_count_limit':
            key = 'find_match_count_limit['.concat(args.limit === 1 ? 'one' : 'other', ']')
            break
        }

        return DEFAULT_L10N_STRINGS[key] || ''
      }

      const PARTIAL_LANG_CODES = {
        en: 'en-US',
        es: 'es-ES',
        fy: 'fy-NL',
        ga: 'ga-IE',
        gu: 'gu-IN',
        hi: 'hi-IN',
        hy: 'hy-AM',
        nb: 'nb-NO',
        ne: 'ne-NP',
        nn: 'nn-NO',
        pa: 'pa-IN',
        pt: 'pt-PT',
        sv: 'sv-SE',
        zh: 'zh-CN',
      }

      function fixupLangCode(langCode) {
        return PARTIAL_LANG_CODES[langCode === null || langCode === void 0 ? void 0 : langCode.toLowerCase()] || langCode
      }

      function formatL10nValue(text, args) {
        if (!args) {
          return text
        }

        return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (all, name) => {
          return name in args ? args[name] : `{{${name}}}`
        })
      }

      const NullL10n = {
        getLanguage: function getLanguage() {
          return _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee() {
            return _regenerator.default.wrap((_context) => {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    return _context.abrupt('return', 'en-us')

                  case 1:
                  case 'end':
                    return _context.stop()
                }
              }
            }, _callee)
          }))()
        },
        getDirection: function getDirection() {
          return _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee2() {
            return _regenerator.default.wrap((_context2) => {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    return _context2.abrupt('return', 'ltr')

                  case 1:
                  case 'end':
                    return _context2.stop()
                }
              }
            }, _callee2)
          }))()
        },
        get: function get(key) {
          const _arguments = arguments
          return _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee3() {
            let args, fallback
            return _regenerator.default.wrap((_context3) => {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    args = _arguments.length > 1 && _arguments[1] !== undefined ? _arguments[1] : null
                    fallback = _arguments.length > 2 && _arguments[2] !== undefined ? _arguments[2] : getL10nFallback(key, args)
                    return _context3.abrupt('return', formatL10nValue(fallback, args))

                  case 3:
                  case 'end':
                    return _context3.stop()
                }
              }
            }, _callee3)
          }))()
        },
        translate: function translate(element) {
          return _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee4() {
            return _regenerator.default.wrap((_context4) => {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                  case 'end':
                    return _context4.stop()
                }
              }
            }, _callee4)
          }))()
        },
      }
      exports.NullL10n = NullL10n

      /***/
    },
    /* 33 */
    /***/ (__unused_webpack_module, exports, __webpack_require__) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.PDFPageView = void 0

      const _regenerator = _interopRequireDefault(__webpack_require__(3))

      const _pdfjsLib = __webpack_require__(7)

      const _ui_utils = __webpack_require__(5)

      const _app_options = __webpack_require__(1)

      const _l10n_utils = __webpack_require__(32)

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj } }

      function _typeof(obj) {
        '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof(obj) { return typeof obj } }
        else { _typeof = function _typeof(obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj)
      }

      function _createForOfIteratorHelper(o, allowArrayLike) {
        let it = typeof Symbol !== 'undefined' && o[Symbol.iterator] || o['@@iterator']; if (!it) {
          if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === 'number') {
            if (it)
              o = it; let i = 0; const F = function F() { }; return {
                s: F,
                n: function n() {
                  if (i >= o.length)
                    return { done: true }; return { done: false, value: o[i++] }
                },
                e: function e(_e) { throw _e },
                f: F,
              }
          } throw new TypeError('Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.')
        } let normalCompletion = true; let didErr = false; let err; return {
          s: function s() { it = it.call(o) },
          n: function n() { const step = it.next(); normalCompletion = step.done; return step },
          e: function e(_e2) { didErr = true; err = _e2 },
          f: function f() {
            try {
              if (!normalCompletion && it.return != null)
                it.return()
            }
            finally {
              if (didErr)
                throw err
            }
          },
        }
      }

      function _unsupportedIterableToArray(o, minLen) {
        if (!o)
          return; if (typeof o === 'string')
          return _arrayLikeToArray(o, minLen); let n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor)
          n = o.constructor.name; if (n === 'Map' || n === 'Set')
          return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
          return _arrayLikeToArray(o, minLen)
      }

      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length)
          len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2
      }

      function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
        try { var info = gen[key](arg); var value = info.value }
        catch (error) { reject(error); return } if (info.done) { resolve(value) }
        else { Promise.resolve(value).then(_next, _throw) }
      }

      function _asyncToGenerator(fn) { return function () { const self = this; const args = arguments; return new Promise((resolve, reject) => { const gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value) } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err) } _next(undefined) }) } }

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value) }

      function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError('Cannot initialize the same private elements twice on an object') } }

      function _classPrivateFieldGet(receiver, privateMap) { const descriptor = _classExtractFieldDescriptor(receiver, privateMap, 'get'); return _classApplyDescriptorGet(receiver, descriptor) }

      function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver) } return descriptor.value }

      function _classPrivateFieldSet(receiver, privateMap, value) { const descriptor = _classExtractFieldDescriptor(receiver, privateMap, 'set'); _classApplyDescriptorSet(receiver, descriptor, value); return value }

      function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError(`attempted to ${action} private field on non-instance`) } return privateMap.get(receiver) }

      function _classApplyDescriptorSet(receiver, descriptor, value) {
        if (descriptor.set) { descriptor.set.call(receiver, value) }
        else { if (!descriptor.writable) { throw new TypeError('attempted to set read only private field') } descriptor.value = value }
      }

      const MAX_CANVAS_PIXELS = _app_options.compatibilityParams.maxCanvasPixels || 16777216

      const _annotationMode = /* #__PURE__ */new WeakMap()

      const PDFPageView = /* #__PURE__ */(function () {
        function PDFPageView(options) {
          let _options$textLayerMod, _options$annotationMo, _options$textHighligh, _this$renderingQueue

          _classCallCheck(this, PDFPageView)

          _classPrivateFieldInitSpec(this, _annotationMode, {
            writable: true,
            value: _pdfjsLib.AnnotationMode.ENABLE_FORMS,
          })

          const container = options.container
          const defaultViewport = options.defaultViewport
          this.id = options.id
          this.renderingId = `page${this.id}`
          this.pdfPage = null
          this.pageLabel = null
          this.rotation = 0
          this.scale = options.scale || _ui_utils.DEFAULT_SCALE
          this.viewport = defaultViewport
          this.pdfPageRotate = defaultViewport.rotation
          this._optionalContentConfigPromise = options.optionalContentConfigPromise || null
          this.hasRestrictedScaling = false
          this.textLayerMode = (_options$textLayerMod = options.textLayerMode) !== null && _options$textLayerMod !== void 0 ? _options$textLayerMod : _ui_utils.TextLayerMode.ENABLE

          _classPrivateFieldSet(this, _annotationMode, (_options$annotationMo = options.annotationMode) !== null && _options$annotationMo !== void 0 ? _options$annotationMo : _pdfjsLib.AnnotationMode.ENABLE_FORMS)

          this.imageResourcesPath = options.imageResourcesPath || ''
          this.useOnlyCssZoom = options.useOnlyCssZoom || false
          this.maxCanvasPixels = options.maxCanvasPixels || MAX_CANVAS_PIXELS
          this.eventBus = options.eventBus
          this.renderingQueue = options.renderingQueue
          this.textLayerFactory = options.textLayerFactory
          this.annotationLayerFactory = options.annotationLayerFactory
          this.xfaLayerFactory = options.xfaLayerFactory
          this.textHighlighter = (_options$textHighligh = options.textHighlighterFactory) === null || _options$textHighligh === void 0 ? void 0 : _options$textHighligh.createTextHighlighter(this.id - 1, this.eventBus)
          this.structTreeLayerFactory = options.structTreeLayerFactory
          this.renderer = options.renderer || _ui_utils.RendererType.CANVAS
          this.l10n = options.l10n || _l10n_utils.NullL10n
          this.paintTask = null
          this.paintedViewportMap = new WeakMap()
          this.renderingState = _ui_utils.RenderingStates.INITIAL
          this.resume = null
          this._renderError = null
          this._isStandalone = !((_this$renderingQueue = this.renderingQueue) !== null && _this$renderingQueue !== void 0 && _this$renderingQueue.hasViewer())
          this._annotationCanvasMap = null
          this.annotationLayer = null
          this.textLayer = null
          this.zoomLayer = null
          this.xfaLayer = null
          this.structTreeLayer = null
          const div = document.createElement('div')
          div.className = 'page'
          div.style.width = `${Math.floor(this.viewport.width)}px`
          div.style.height = `${Math.floor(this.viewport.height)}px`
          div.setAttribute('data-page-number', this.id)
          div.setAttribute('role', 'region')
          this.l10n.get('page_landmark', {
            page: this.id,
          }).then((msg) => {
            div.setAttribute('aria-label', msg)
          })
          this.div = div
          container === null || container === void 0 ? void 0 : container.appendChild(div)
        }

        _createClass(PDFPageView, [{
          key: 'setPdfPage',
          value: function setPdfPage(pdfPage) {
            this.pdfPage = pdfPage
            this.pdfPageRotate = pdfPage.rotate
            const totalRotation = (this.rotation + this.pdfPageRotate) % 360
            this.viewport = pdfPage.getViewport({
              scale: this.scale * _pdfjsLib.PixelsPerInch.PDF_TO_CSS_UNITS,
              rotation: totalRotation,
            })
            this.reset()
          },
        }, {
          key: 'destroy',
          value: function destroy() {
            this.reset()

            if (this.pdfPage) {
              this.pdfPage.cleanup()
            }
          },
        }, {
          key: '_renderAnnotationLayer',
          value: (function () {
            const _renderAnnotationLayer2 = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee() {
              let error
              return _regenerator.default.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      error = null
                      _context.prev = 1
                      _context.next = 4
                      return this.annotationLayer.render(this.viewport, 'display')

                    case 4:
                      _context.next = 9
                      break

                    case 6:
                      _context.prev = 6
                      _context.t0 = _context.catch(1)
                      error = _context.t0

                    case 9:
                      _context.prev = 9
                      this.eventBus.dispatch('annotationlayerrendered', {
                        source: this,
                        pageNumber: this.id,
                        error,
                      })
                      return _context.finish(9)

                    case 12:
                    case 'end':
                      return _context.stop()
                  }
                }
              }, _callee, this, [[1, 6, 9, 12]])
            }))

            function _renderAnnotationLayer() {
              return _renderAnnotationLayer2.apply(this, arguments)
            }

            return _renderAnnotationLayer
          }()),
        }, {
          key: '_renderXfaLayer',
          value: (function () {
            const _renderXfaLayer2 = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee2() {
              let error, result
              return _regenerator.default.wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      error = null
                      _context2.prev = 1
                      _context2.next = 4
                      return this.xfaLayer.render(this.viewport, 'display')

                    case 4:
                      result = _context2.sent

                      if (this.textHighlighter) {
                        this._buildXfaTextContentItems(result.textDivs)
                      }

                      _context2.next = 11
                      break

                    case 8:
                      _context2.prev = 8
                      _context2.t0 = _context2.catch(1)
                      error = _context2.t0

                    case 11:
                      _context2.prev = 11
                      this.eventBus.dispatch('xfalayerrendered', {
                        source: this,
                        pageNumber: this.id,
                        error,
                      })
                      return _context2.finish(11)

                    case 14:
                    case 'end':
                      return _context2.stop()
                  }
                }
              }, _callee2, this, [[1, 8, 11, 14]])
            }))

            function _renderXfaLayer() {
              return _renderXfaLayer2.apply(this, arguments)
            }

            return _renderXfaLayer
          }()),
        }, {
          key: '_buildXfaTextContentItems',
          value: (function () {
            const _buildXfaTextContentItems2 = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee3(textDivs) {
              let text, items, _iterator, _step, item

              return _regenerator.default.wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      _context3.next = 2
                      return this.pdfPage.getTextContent()

                    case 2:
                      text = _context3.sent
                      items = []
                      _iterator = _createForOfIteratorHelper(text.items)

                      try {
                        for (_iterator.s(); !(_step = _iterator.n()).done;) {
                          item = _step.value
                          items.push(item.str)
                        }
                      }
                      catch (err) {
                        _iterator.e(err)
                      }
                      finally {
                        _iterator.f()
                      }

                      this.textHighlighter.setTextMapping(textDivs, items)
                      this.textHighlighter.enable()

                    case 8:
                    case 'end':
                      return _context3.stop()
                  }
                }
              }, _callee3, this)
            }))

            function _buildXfaTextContentItems(_x) {
              return _buildXfaTextContentItems2.apply(this, arguments)
            }

            return _buildXfaTextContentItems
          }()),
        }, {
          key: '_resetZoomLayer',
          value: function _resetZoomLayer() {
            const removeFromDOM = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false

            if (!this.zoomLayer) {
              return
            }

            const zoomLayerCanvas = this.zoomLayer.firstChild
            this.paintedViewportMap.delete(zoomLayerCanvas)
            zoomLayerCanvas.width = 0
            zoomLayerCanvas.height = 0

            if (removeFromDOM) {
              this.zoomLayer.remove()
            }

            this.zoomLayer = null
          },
        }, {
          key: 'reset',
          value: function reset() {
            let _this$annotationLayer
            let _this$xfaLayer
            const _this = this

            const _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
            const _ref$keepZoomLayer = _ref.keepZoomLayer
            const keepZoomLayer = _ref$keepZoomLayer === void 0 ? false : _ref$keepZoomLayer
            const _ref$keepAnnotationLa = _ref.keepAnnotationLayer
            const keepAnnotationLayer = _ref$keepAnnotationLa === void 0 ? false : _ref$keepAnnotationLa
            const _ref$keepXfaLayer = _ref.keepXfaLayer
            const keepXfaLayer = _ref$keepXfaLayer === void 0 ? false : _ref$keepXfaLayer

            this.cancelRendering({
              keepAnnotationLayer,
              keepXfaLayer,
            })
            this.renderingState = _ui_utils.RenderingStates.INITIAL
            const div = this.div
            div.style.width = `${Math.floor(this.viewport.width)}px`
            div.style.height = `${Math.floor(this.viewport.height)}px`
            const childNodes = div.childNodes
            const zoomLayerNode = keepZoomLayer && this.zoomLayer || null
            const annotationLayerNode = keepAnnotationLayer && ((_this$annotationLayer = this.annotationLayer) === null || _this$annotationLayer === void 0 ? void 0 : _this$annotationLayer.div) || null
            const xfaLayerNode = keepXfaLayer && ((_this$xfaLayer = this.xfaLayer) === null || _this$xfaLayer === void 0 ? void 0 : _this$xfaLayer.div) || null

            for (let i = childNodes.length - 1; i >= 0; i--) {
              const node = childNodes[i]

              switch (node) {
                case zoomLayerNode:
                case annotationLayerNode:
                case xfaLayerNode:
                  continue
              }

              node.remove()
            }

            div.removeAttribute('data-loaded')

            if (annotationLayerNode) {
              this.annotationLayer.hide()
            }

            if (xfaLayerNode) {
              this.xfaLayer.hide()
            }

            if (!zoomLayerNode) {
              if (this.canvas) {
                this.paintedViewportMap.delete(this.canvas)
                this.canvas.width = 0
                this.canvas.height = 0
                delete this.canvas
              }

              this._resetZoomLayer()
            }

            if (this.svg) {
              this.paintedViewportMap.delete(this.svg)
              delete this.svg
            }

            this.loadingIconDiv = document.createElement('div')
            this.loadingIconDiv.className = 'loadingIcon notVisible'

            if (this._isStandalone) {
              this.toggleLoadingIconSpinner(true)
            }

            this.loadingIconDiv.setAttribute('role', 'img')
            this.l10n.get('loading').then((msg) => {
              let _this$loadingIconDiv;

              (_this$loadingIconDiv = _this.loadingIconDiv) === null || _this$loadingIconDiv === void 0 ? void 0 : _this$loadingIconDiv.setAttribute('aria-label', msg)
            })
            div.appendChild(this.loadingIconDiv)
          },
        }, {
          key: 'update',
          value: function update(_ref2) {
            const _ref2$scale = _ref2.scale
            const scale = _ref2$scale === void 0 ? 0 : _ref2$scale
            const _ref2$rotation = _ref2.rotation
            const rotation = _ref2$rotation === void 0 ? null : _ref2$rotation
            const _ref2$optionalContent = _ref2.optionalContentConfigPromise
            const optionalContentConfigPromise = _ref2$optionalContent === void 0 ? null : _ref2$optionalContent

            if (_typeof(arguments[0]) !== 'object') {
              console.error('PDFPageView.update called with separate parameters, please use an object instead.')
              this.update({
                scale: arguments[0],
                rotation: arguments[1],
                optionalContentConfigPromise: arguments[2],
              })
              return
            }

            this.scale = scale || this.scale

            if (typeof rotation === 'number') {
              this.rotation = rotation
            }

            if (optionalContentConfigPromise instanceof Promise) {
              this._optionalContentConfigPromise = optionalContentConfigPromise
            }

            const totalRotation = (this.rotation + this.pdfPageRotate) % 360
            const viewportScale = this.scale * _pdfjsLib.PixelsPerInch.PDF_TO_CSS_UNITS
            this.viewport = this.viewport.clone({
              scale: viewportScale,
              rotation: totalRotation,
            })

            if (this._isStandalone) {
              const style = document.documentElement.style
              style.setProperty('--zoom-factor', this.scale)
              style.setProperty('--viewport-scale-factor', viewportScale)
            }

            if (this.svg) {
              this.cssTransform({
                target: this.svg,
                redrawAnnotationLayer: true,
                redrawXfaLayer: true,
              })
              this.eventBus.dispatch('pagerendered', {
                source: this,
                pageNumber: this.id,
                cssTransform: true,
                timestamp: performance.now(),
                error: this._renderError,
              })
              return
            }

            let isScalingRestricted = false

            if (this.canvas && this.maxCanvasPixels > 0) {
              const outputScale = this.outputScale

              if ((Math.floor(this.viewport.width) * outputScale.sx | 0) * (Math.floor(this.viewport.height) * outputScale.sy | 0) > this.maxCanvasPixels) {
                isScalingRestricted = true
              }
            }

            if (this.canvas) {
              if (this.useOnlyCssZoom || this.hasRestrictedScaling && isScalingRestricted) {
                this.cssTransform({
                  target: this.canvas,
                  redrawAnnotationLayer: true,
                  redrawXfaLayer: true,
                })
                this.eventBus.dispatch('pagerendered', {
                  source: this,
                  pageNumber: this.id,
                  cssTransform: true,
                  timestamp: performance.now(),
                  error: this._renderError,
                })
                return
              }

              if (!this.zoomLayer && !this.canvas.hidden) {
                this.zoomLayer = this.canvas.parentNode
                this.zoomLayer.style.position = 'absolute'
              }
            }

            if (this.zoomLayer) {
              this.cssTransform({
                target: this.zoomLayer.firstChild,
              })
            }

            this.reset({
              keepZoomLayer: true,
              keepAnnotationLayer: true,
              keepXfaLayer: true,
            })
          },
        }, {
          key: 'cancelRendering',
          value: function cancelRendering() {
            const _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
            const _ref3$keepAnnotationL = _ref3.keepAnnotationLayer
            const keepAnnotationLayer = _ref3$keepAnnotationL === void 0 ? false : _ref3$keepAnnotationL
            const _ref3$keepXfaLayer = _ref3.keepXfaLayer
            const keepXfaLayer = _ref3$keepXfaLayer === void 0 ? false : _ref3$keepXfaLayer

            if (this.paintTask) {
              this.paintTask.cancel()
              this.paintTask = null
            }

            this.resume = null

            if (this.textLayer) {
              this.textLayer.cancel()
              this.textLayer = null
            }

            if (this.annotationLayer && (!keepAnnotationLayer || !this.annotationLayer.div)) {
              this.annotationLayer.cancel()
              this.annotationLayer = null
              this._annotationCanvasMap = null
            }

            if (this.xfaLayer && (!keepXfaLayer || !this.xfaLayer.div)) {
              let _this$textHighlighter

              this.xfaLayer.cancel()
              this.xfaLayer = null;
              (_this$textHighlighter = this.textHighlighter) === null || _this$textHighlighter === void 0 ? void 0 : _this$textHighlighter.disable()
            }

            if (this._onTextLayerRendered) {
              this.eventBus._off('textlayerrendered', this._onTextLayerRendered)

              this._onTextLayerRendered = null
            }
          },
        }, {
          key: 'cssTransform',
          value: function cssTransform(_ref4) {
            const target = _ref4.target
            const _ref4$redrawAnnotatio = _ref4.redrawAnnotationLayer
            const redrawAnnotationLayer = _ref4$redrawAnnotatio === void 0 ? false : _ref4$redrawAnnotatio
            const _ref4$redrawXfaLayer = _ref4.redrawXfaLayer
            const redrawXfaLayer = _ref4$redrawXfaLayer === void 0 ? false : _ref4$redrawXfaLayer
            const width = this.viewport.width
            const height = this.viewport.height
            const div = this.div
            target.style.width = target.parentNode.style.width = div.style.width = `${Math.floor(width)}px`
            target.style.height = target.parentNode.style.height = div.style.height = `${Math.floor(height)}px`
            const relativeRotation = this.viewport.rotation - this.paintedViewportMap.get(target).rotation
            const absRotation = Math.abs(relativeRotation)
            let scaleX = 1
            let scaleY = 1

            if (absRotation === 90 || absRotation === 270) {
              scaleX = height / width
              scaleY = width / height
            }

            target.style.transform = 'rotate('.concat(relativeRotation, 'deg) scale(').concat(scaleX, ', ').concat(scaleY, ')')

            if (this.textLayer) {
              const textLayerViewport = this.textLayer.viewport
              const textRelativeRotation = this.viewport.rotation - textLayerViewport.rotation
              const textAbsRotation = Math.abs(textRelativeRotation)
              let scale = width / textLayerViewport.width

              if (textAbsRotation === 90 || textAbsRotation === 270) {
                scale = width / textLayerViewport.height
              }

              const textLayerDiv = this.textLayer.textLayerDiv
              let transX, transY

              switch (textAbsRotation) {
                case 0:
                  transX = transY = 0
                  break

                case 90:
                  transX = 0
                  transY = `-${textLayerDiv.style.height}`
                  break

                case 180:
                  transX = `-${textLayerDiv.style.width}`
                  transY = `-${textLayerDiv.style.height}`
                  break

                case 270:
                  transX = `-${textLayerDiv.style.width}`
                  transY = 0
                  break

                default:
                  console.error('Bad rotation value.')
                  break
              }

              textLayerDiv.style.transform = 'rotate('.concat(textAbsRotation, 'deg) ') + 'scale('.concat(scale, ') ') + 'translate('.concat(transX, ', ').concat(transY, ')')
              textLayerDiv.style.transformOrigin = '0% 0%'
            }

            if (redrawAnnotationLayer && this.annotationLayer) {
              this._renderAnnotationLayer()
            }

            if (redrawXfaLayer && this.xfaLayer) {
              this._renderXfaLayer()
            }
          },
        }, {
          key: 'width',
          get: function get() {
            return this.viewport.width
          },
        }, {
          key: 'height',
          get: function get() {
            return this.viewport.height
          },
        }, {
          key: 'getPagePoint',
          value: function getPagePoint(x, y) {
            return this.viewport.convertToPdfPoint(x, y)
          },
        }, {
          key: 'toggleLoadingIconSpinner',
          value: function toggleLoadingIconSpinner() {
            let _this$loadingIconDiv2

            const viewVisible = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
            (_this$loadingIconDiv2 = this.loadingIconDiv) === null || _this$loadingIconDiv2 === void 0 ? void 0 : _this$loadingIconDiv2.classList.toggle('notVisible', !viewVisible)
          },
        }, {
          key: 'draw',
          value: function draw() {
            let _this$annotationLayer2
            let _this$xfaLayer2
            const _this2 = this

            if (this.renderingState !== _ui_utils.RenderingStates.INITIAL) {
              console.error('Must be in new state before drawing')
              this.reset()
            }

            const div = this.div
            const pdfPage = this.pdfPage

            if (!pdfPage) {
              this.renderingState = _ui_utils.RenderingStates.FINISHED

              if (this.loadingIconDiv) {
                this.loadingIconDiv.remove()
                delete this.loadingIconDiv
              }

              return Promise.reject(new Error('pdfPage is not loaded'))
            }

            this.renderingState = _ui_utils.RenderingStates.RUNNING
            const canvasWrapper = document.createElement('div')
            canvasWrapper.style.width = div.style.width
            canvasWrapper.style.height = div.style.height
            canvasWrapper.classList.add('canvasWrapper')

            if ((_this$annotationLayer2 = this.annotationLayer) !== null && _this$annotationLayer2 !== void 0 && _this$annotationLayer2.div) {
              div.insertBefore(canvasWrapper, this.annotationLayer.div)
            }
            else {
              div.appendChild(canvasWrapper)
            }

            let textLayer = null

            if (this.textLayerMode !== _ui_utils.TextLayerMode.DISABLE && this.textLayerFactory) {
              let _this$annotationLayer3

              const textLayerDiv = document.createElement('div')
              textLayerDiv.className = 'textLayer'
              textLayerDiv.style.width = canvasWrapper.style.width
              textLayerDiv.style.height = canvasWrapper.style.height

              if ((_this$annotationLayer3 = this.annotationLayer) !== null && _this$annotationLayer3 !== void 0 && _this$annotationLayer3.div) {
                div.insertBefore(textLayerDiv, this.annotationLayer.div)
              }
              else {
                div.appendChild(textLayerDiv)
              }

              textLayer = this.textLayerFactory.createTextLayerBuilder(textLayerDiv, this.id - 1, this.viewport, this.textLayerMode === _ui_utils.TextLayerMode.ENABLE_ENHANCE, this.eventBus, this.textHighlighter)
            }

            this.textLayer = textLayer

            if (_classPrivateFieldGet(this, _annotationMode) !== _pdfjsLib.AnnotationMode.DISABLE && this.annotationLayerFactory) {
              this._annotationCanvasMap || (this._annotationCanvasMap = new Map())
              this.annotationLayer || (this.annotationLayer = this.annotationLayerFactory.createAnnotationLayerBuilder(div, pdfPage, null, this.imageResourcesPath, _classPrivateFieldGet(this, _annotationMode) === _pdfjsLib.AnnotationMode.ENABLE_FORMS, this.l10n, null, null, null, null, this._annotationCanvasMap))
            }

            if ((_this$xfaLayer2 = this.xfaLayer) !== null && _this$xfaLayer2 !== void 0 && _this$xfaLayer2.div) {
              div.appendChild(this.xfaLayer.div)
            }

            let renderContinueCallback = null

            if (this.renderingQueue) {
              renderContinueCallback = function renderContinueCallback(cont) {
                if (!_this2.renderingQueue.isHighestPriority(_this2)) {
                  _this2.renderingState = _ui_utils.RenderingStates.PAUSED

                  _this2.resume = function () {
                    _this2.renderingState = _ui_utils.RenderingStates.RUNNING
                    cont()
                  }

                  return
                }

                cont()
              }
            }

            const finishPaintTask = /* #__PURE__ */(function () {
              const _ref5 = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee4() {
                let error
                const _args4 = arguments
                return _regenerator.default.wrap((_context4) => {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        error = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : null

                        if (paintTask === _this2.paintTask) {
                          _this2.paintTask = null
                        }

                        if (!(error instanceof _pdfjsLib.RenderingCancelledException)) {
                          _context4.next = 5
                          break
                        }

                        _this2._renderError = null
                        return _context4.abrupt('return')

                      case 5:
                        _this2._renderError = error
                        _this2.renderingState = _ui_utils.RenderingStates.FINISHED

                        if (_this2.loadingIconDiv) {
                          _this2.loadingIconDiv.remove()

                          delete _this2.loadingIconDiv
                        }

                        _this2._resetZoomLayer(true)

                        _this2.eventBus.dispatch('pagerendered', {
                          source: _this2,
                          pageNumber: _this2.id,
                          cssTransform: false,
                          timestamp: performance.now(),
                          error: _this2._renderError,
                        })

                        if (!error) {
                          _context4.next = 12
                          break
                        }

                        throw error

                      case 12:
                      case 'end':
                        return _context4.stop()
                    }
                  }
                }, _callee4)
              }))

              return function finishPaintTask() {
                return _ref5.apply(this, arguments)
              }
            }())

            var paintTask = this.renderer === _ui_utils.RendererType.SVG ? this.paintOnSvg(canvasWrapper) : this.paintOnCanvas(canvasWrapper)
            paintTask.onRenderContinue = renderContinueCallback
            this.paintTask = paintTask
            const resultPromise = paintTask.promise.then(() => {
              return finishPaintTask(null).then(() => {
                if (textLayer) {
                  const readableStream = pdfPage.streamTextContent({
                    normalizeWhitespace: true,
                    includeMarkedContent: true,
                  })
                  textLayer.setTextContentStream(readableStream)
                  textLayer.render()
                }

                if (_this2.annotationLayer) {
                  _this2._renderAnnotationLayer()
                }
              })
            }, (reason) => {
              return finishPaintTask(reason)
            })

            if (this.xfaLayerFactory) {
              if (!this.xfaLayer) {
                this.xfaLayer = this.xfaLayerFactory.createXfaLayerBuilder(div, pdfPage, null)
              }

              this._renderXfaLayer()
            }

            if (this.structTreeLayerFactory && this.textLayer && this.canvas) {
              this._onTextLayerRendered = function (event) {
                if (event.pageNumber !== _this2.id) {
                  return
                }

                _this2.eventBus._off('textlayerrendered', _this2._onTextLayerRendered)

                _this2._onTextLayerRendered = null

                if (!_this2.canvas) {
                  return
                }

                _this2.pdfPage.getStructTree().then((tree) => {
                  if (!tree) {
                    return
                  }

                  if (!_this2.canvas) {
                    return
                  }

                  const treeDom = _this2.structTreeLayer.render(tree)

                  treeDom.classList.add('structTree')

                  _this2.canvas.appendChild(treeDom)
                })
              }

              this.eventBus._on('textlayerrendered', this._onTextLayerRendered)

              this.structTreeLayer = this.structTreeLayerFactory.createStructTreeLayerBuilder(pdfPage)
            }

            div.setAttribute('data-loaded', true)
            this.eventBus.dispatch('pagerender', {
              source: this,
              pageNumber: this.id,
            })
            return resultPromise
          },
        }, {
          key: 'paintOnCanvas',
          value: function paintOnCanvas(canvasWrapper) {
            const renderCapability = (0, _pdfjsLib.createPromiseCapability)()
            const result = {
              promise: renderCapability.promise,
              onRenderContinue: function onRenderContinue(cont) {
                cont()
              },
              cancel: function cancel() {
                renderTask.cancel()
              },
            }
            const viewport = this.viewport
            const canvas = document.createElement('canvas')
            canvas.hidden = true
            let isCanvasHidden = true

            const showCanvas = function showCanvas() {
              if (isCanvasHidden) {
                canvas.hidden = false
                isCanvasHidden = false
              }
            }

            canvasWrapper.appendChild(canvas)
            this.canvas = canvas
            canvas.mozOpaque = true
            const ctx = canvas.getContext('2d', {
              alpha: false,
            })
            const outputScale = (0, _ui_utils.getOutputScale)(ctx)
            this.outputScale = outputScale

            if (this.useOnlyCssZoom) {
              const actualSizeViewport = viewport.clone({
                scale: _pdfjsLib.PixelsPerInch.PDF_TO_CSS_UNITS,
              })
              outputScale.sx *= actualSizeViewport.width / viewport.width
              outputScale.sy *= actualSizeViewport.height / viewport.height
              outputScale.scaled = true
            }

            if (this.maxCanvasPixels > 0) {
              const pixelsInViewport = viewport.width * viewport.height
              const maxScale = Math.sqrt(this.maxCanvasPixels / pixelsInViewport)

              if (outputScale.sx > maxScale || outputScale.sy > maxScale) {
                outputScale.sx = maxScale
                outputScale.sy = maxScale
                outputScale.scaled = true
                this.hasRestrictedScaling = true
              }
              else {
                this.hasRestrictedScaling = false
              }
            }

            const sfx = (0, _ui_utils.approximateFraction)(outputScale.sx)
            const sfy = (0, _ui_utils.approximateFraction)(outputScale.sy)
            canvas.width = (0, _ui_utils.roundToDivide)(viewport.width * outputScale.sx, sfx[0])
            canvas.height = (0, _ui_utils.roundToDivide)(viewport.height * outputScale.sy, sfy[0])
            canvas.style.width = `${(0, _ui_utils.roundToDivide)(viewport.width, sfx[1])}px`
            canvas.style.height = `${(0, _ui_utils.roundToDivide)(viewport.height, sfy[1])}px`
            this.paintedViewportMap.set(canvas, viewport)
            const transform = !outputScale.scaled ? null : [outputScale.sx, 0, 0, outputScale.sy, 0, 0]
            const renderContext = {
              canvasContext: ctx,
              transform,
              viewport: this.viewport,
              annotationMode: _classPrivateFieldGet(this, _annotationMode),
              optionalContentConfigPromise: this._optionalContentConfigPromise,
              annotationCanvasMap: this._annotationCanvasMap,
            }
            var renderTask = this.pdfPage.render(renderContext)

            renderTask.onContinue = function (cont) {
              showCanvas()

              if (result.onRenderContinue) {
                result.onRenderContinue(cont)
              }
              else {
                cont()
              }
            }

            renderTask.promise.then(() => {
              showCanvas()
              renderCapability.resolve()
            }, (error) => {
              showCanvas()
              renderCapability.reject(error)
            })
            return result
          },
        }, {
          key: 'paintOnSvg',
          value: function paintOnSvg(wrapper) {
            const _this3 = this

            let cancelled = false

            const ensureNotCancelled = function ensureNotCancelled() {
              if (cancelled) {
                throw new _pdfjsLib.RenderingCancelledException('Rendering cancelled, page '.concat(_this3.id), 'svg')
              }
            }

            const pdfPage = this.pdfPage
            const actualSizeViewport = this.viewport.clone({
              scale: _pdfjsLib.PixelsPerInch.PDF_TO_CSS_UNITS,
            })
            const promise = pdfPage.getOperatorList({
              annotationMode: _classPrivateFieldGet(this, _annotationMode),
            }).then((opList) => {
              ensureNotCancelled()
              const svgGfx = new _pdfjsLib.SVGGraphics(pdfPage.commonObjs, pdfPage.objs, _app_options.compatibilityParams.disableCreateObjectURL)
              return svgGfx.getSVG(opList, actualSizeViewport).then((svg) => {
                ensureNotCancelled()
                _this3.svg = svg

                _this3.paintedViewportMap.set(svg, actualSizeViewport)

                svg.style.width = wrapper.style.width
                svg.style.height = wrapper.style.height
                _this3.renderingState = _ui_utils.RenderingStates.FINISHED
                wrapper.appendChild(svg)
              })
            })
            return {
              promise,
              onRenderContinue: function onRenderContinue(cont) {
                cont()
              },
              cancel: function cancel() {
                cancelled = true
              },
            }
          },
        }, {
          key: 'setPageLabel',
          value: function setPageLabel(label) {
            this.pageLabel = typeof label === 'string' ? label : null

            if (this.pageLabel !== null) {
              this.div.setAttribute('data-page-label', this.pageLabel)
            }
            else {
              this.div.removeAttribute('data-page-label')
            }
          },
        }])

        return PDFPageView
      }())

      exports.PDFPageView = PDFPageView

      /***/
    },
    /* 34 */
    /***/ (__unused_webpack_module, exports) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.StructTreeLayerBuilder = void 0

      function _createForOfIteratorHelper(o, allowArrayLike) {
        let it = typeof Symbol !== 'undefined' && o[Symbol.iterator] || o['@@iterator']; if (!it) {
          if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === 'number') {
            if (it)
              o = it; let i = 0; const F = function F() { }; return {
                s: F,
                n: function n() {
                  if (i >= o.length)
                    return { done: true }; return { done: false, value: o[i++] }
                },
                e: function e(_e) { throw _e },
                f: F,
              }
          } throw new TypeError('Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.')
        } let normalCompletion = true; let didErr = false; let err; return {
          s: function s() { it = it.call(o) },
          n: function n() { const step = it.next(); normalCompletion = step.done; return step },
          e: function e(_e2) { didErr = true; err = _e2 },
          f: function f() {
            try {
              if (!normalCompletion && it.return != null)
                it.return()
            }
            finally {
              if (didErr)
                throw err
            }
          },
        }
      }

      function _unsupportedIterableToArray(o, minLen) {
        if (!o)
          return; if (typeof o === 'string')
          return _arrayLikeToArray(o, minLen); let n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor)
          n = o.constructor.name; if (n === 'Map' || n === 'Set')
          return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
          return _arrayLikeToArray(o, minLen)
      }

      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length)
          len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2
      }

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      const PDF_ROLE_TO_HTML_ROLE = {
        Document: null,
        DocumentFragment: null,
        Part: 'group',
        Sect: 'group',
        Div: 'group',
        Aside: 'note',
        NonStruct: 'none',
        P: null,
        H: 'heading',
        Title: null,
        FENote: 'note',
        Sub: 'group',
        Lbl: null,
        Span: null,
        Em: null,
        Strong: null,
        Link: 'link',
        Annot: 'note',
        Form: 'form',
        Ruby: null,
        RB: null,
        RT: null,
        RP: null,
        Warichu: null,
        WT: null,
        WP: null,
        L: 'list',
        LI: 'listitem',
        LBody: null,
        Table: 'table',
        TR: 'row',
        TH: 'columnheader',
        TD: 'cell',
        THead: 'columnheader',
        TBody: null,
        TFoot: null,
        Caption: null,
        Figure: 'figure',
        Formula: null,
        Artifact: null,
      }
      const HEADING_PATTERN = /^H(\d+)$/

      const StructTreeLayerBuilder = /* #__PURE__ */(function () {
        function StructTreeLayerBuilder(_ref) {
          const pdfPage = _ref.pdfPage

          _classCallCheck(this, StructTreeLayerBuilder)

          this.pdfPage = pdfPage
        }

        _createClass(StructTreeLayerBuilder, [{
          key: 'render',
          value: function render(structTree) {
            return this._walk(structTree)
          },
        }, {
          key: '_setAttributes',
          value: function _setAttributes(structElement, htmlElement) {
            if (structElement.alt !== undefined) {
              htmlElement.setAttribute('aria-label', structElement.alt)
            }

            if (structElement.id !== undefined) {
              htmlElement.setAttribute('aria-owns', structElement.id)
            }

            if (structElement.lang !== undefined) {
              htmlElement.setAttribute('lang', structElement.lang)
            }
          },
        }, {
          key: '_walk',
          value: function _walk(node) {
            if (!node) {
              return null
            }

            const element = document.createElement('span')

            if ('role' in node) {
              const role = node.role
              const match = role.match(HEADING_PATTERN)

              if (match) {
                element.setAttribute('role', 'heading')
                element.setAttribute('aria-level', match[1])
              }
              else if (PDF_ROLE_TO_HTML_ROLE[role]) {
                element.setAttribute('role', PDF_ROLE_TO_HTML_ROLE[role])
              }
            }

            this._setAttributes(node, element)

            if (node.children) {
              if (node.children.length === 1 && 'id' in node.children[0]) {
                this._setAttributes(node.children[0], element)
              }
              else {
                const _iterator = _createForOfIteratorHelper(node.children)
                let _step

                try {
                  for (_iterator.s(); !(_step = _iterator.n()).done;) {
                    const kid = _step.value
                    element.appendChild(this._walk(kid))
                  }
                }
                catch (err) {
                  _iterator.e(err)
                }
                finally {
                  _iterator.f()
                }
              }
            }

            return element
          },
        }])

        return StructTreeLayerBuilder
      }())

      exports.StructTreeLayerBuilder = StructTreeLayerBuilder

      /***/
    },
    /* 35 */
    /***/ (__unused_webpack_module, exports) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.TextHighlighter = void 0

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      const TextHighlighter = /* #__PURE__ */(function () {
        function TextHighlighter(_ref) {
          const findController = _ref.findController
          const eventBus = _ref.eventBus
          const pageIndex = _ref.pageIndex

          _classCallCheck(this, TextHighlighter)

          this.findController = findController
          this.matches = []
          this.eventBus = eventBus
          this.pageIdx = pageIndex
          this._onUpdateTextLayerMatches = null
          this.textDivs = null
          this.textContentItemsStr = null
          this.enabled = false
        }

        _createClass(TextHighlighter, [{
          key: 'setTextMapping',
          value: function setTextMapping(divs, texts) {
            this.textDivs = divs
            this.textContentItemsStr = texts
          },
        }, {
          key: 'enable',
          value: function enable() {
            const _this = this

            if (!this.textDivs || !this.textContentItemsStr) {
              throw new Error('Text divs and strings have not been set.')
            }

            if (this.enabled) {
              throw new Error('TextHighlighter is already enabled.')
            }

            this.enabled = true

            if (!this._onUpdateTextLayerMatches) {
              this._onUpdateTextLayerMatches = function (evt) {
                if (evt.pageIndex === _this.pageIdx || evt.pageIndex === -1) {
                  _this._updateMatches()
                }
              }

              this.eventBus._on('updatetextlayermatches', this._onUpdateTextLayerMatches)
            }

            this._updateMatches()
          },
        }, {
          key: 'disable',
          value: function disable() {
            if (!this.enabled) {
              return
            }

            this.enabled = false

            if (this._onUpdateTextLayerMatches) {
              this.eventBus._off('updatetextlayermatches', this._onUpdateTextLayerMatches)

              this._onUpdateTextLayerMatches = null
            }
          },
        }, {
          key: '_convertMatches',
          value: function _convertMatches(matches, matchesLength) {
            if (!matches) {
              return []
            }

            const textContentItemsStr = this.textContentItemsStr
            let i = 0
            let iIndex = 0
            const end = textContentItemsStr.length - 1
            const result = []

            for (let m = 0, mm = matches.length; m < mm; m++) {
              let matchIdx = matches[m]

              while (i !== end && matchIdx >= iIndex + textContentItemsStr[i].length) {
                iIndex += textContentItemsStr[i].length
                i++
              }

              if (i === textContentItemsStr.length) {
                console.error('Could not find a matching mapping')
              }

              const match = {
                begin: {
                  divIdx: i,
                  offset: matchIdx - iIndex,
                },
              }
              matchIdx += matchesLength[m]

              while (i !== end && matchIdx > iIndex + textContentItemsStr[i].length) {
                iIndex += textContentItemsStr[i].length
                i++
              }

              match.end = {
                divIdx: i,
                offset: matchIdx - iIndex,
              }
              result.push(match)
            }

            return result
          },
        }, {
          key: '_renderMatches',
          value: function _renderMatches(matches) {
            if (matches.length === 0) {
              return
            }

            const findController = this.findController
            const pageIdx = this.pageIdx
            const textContentItemsStr = this.textContentItemsStr
            const textDivs = this.textDivs
            const isSelectedPage = pageIdx === findController.selected.pageIdx
            const selectedMatchIdx = findController.selected.matchIdx
            const highlightAll = findController.state.highlightAll
            let prevEnd = null
            const infinity = {
              divIdx: -1,
              offset: undefined,
            }

            function beginText(begin, className) {
              const divIdx = begin.divIdx
              textDivs[divIdx].textContent = ''
              return appendTextToDiv(divIdx, 0, begin.offset, className)
            }

            function appendTextToDiv(divIdx, fromOffset, toOffset, className) {
              let div = textDivs[divIdx]

              if (div.nodeType === Node.TEXT_NODE) {
                const span = document.createElement('span')
                div.parentNode.insertBefore(span, div)
                span.appendChild(div)
                textDivs[divIdx] = span
                div = span
              }

              const content = textContentItemsStr[divIdx].substring(fromOffset, toOffset)
              const node = document.createTextNode(content)

              if (className) {
                const _span = document.createElement('span')

                _span.className = ''.concat(className, ' appended')

                _span.appendChild(node)

                div.appendChild(_span)
                return className.includes('selected') ? _span.offsetLeft : 0
              }

              div.appendChild(node)
              return 0
            }

            let i0 = selectedMatchIdx
            let i1 = i0 + 1

            if (highlightAll) {
              i0 = 0
              i1 = matches.length
            }
            else if (!isSelectedPage) {
              return
            }

            for (let i = i0; i < i1; i++) {
              const match = matches[i]
              const begin = match.begin
              const end = match.end
              const isSelected = isSelectedPage && i === selectedMatchIdx
              const highlightSuffix = isSelected ? ' selected' : ''
              let selectedLeft = 0

              if (!prevEnd || begin.divIdx !== prevEnd.divIdx) {
                if (prevEnd !== null) {
                  appendTextToDiv(prevEnd.divIdx, prevEnd.offset, infinity.offset)
                }

                beginText(begin)
              }
              else {
                appendTextToDiv(prevEnd.divIdx, prevEnd.offset, begin.offset)
              }

              if (begin.divIdx === end.divIdx) {
                selectedLeft = appendTextToDiv(begin.divIdx, begin.offset, end.offset, `highlight${highlightSuffix}`)
              }
              else {
                selectedLeft = appendTextToDiv(begin.divIdx, begin.offset, infinity.offset, `highlight begin${highlightSuffix}`)

                for (let n0 = begin.divIdx + 1, n1 = end.divIdx; n0 < n1; n0++) {
                  textDivs[n0].className = `highlight middle${highlightSuffix}`
                }

                beginText(end, `highlight end${highlightSuffix}`)
              }

              prevEnd = end

              if (isSelected) {
                findController.scrollMatchIntoView({
                  element: textDivs[begin.divIdx],
                  selectedLeft,
                  pageIndex: pageIdx,
                  matchIndex: selectedMatchIdx,
                })
              }
            }

            if (prevEnd) {
              appendTextToDiv(prevEnd.divIdx, prevEnd.offset, infinity.offset)
            }
          },
        }, {
          key: '_updateMatches',
          value: function _updateMatches() {
            if (!this.enabled) {
              return
            }

            const findController = this.findController
            const matches = this.matches
            const pageIdx = this.pageIdx
            const textContentItemsStr = this.textContentItemsStr
            const textDivs = this.textDivs
            let clearedUntilDivIdx = -1

            for (let i = 0, ii = matches.length; i < ii; i++) {
              const match = matches[i]
              const begin = Math.max(clearedUntilDivIdx, match.begin.divIdx)

              for (let n = begin, end = match.end.divIdx; n <= end; n++) {
                const div = textDivs[n]
                div.textContent = textContentItemsStr[n]
                div.className = ''
              }

              clearedUntilDivIdx = match.end.divIdx + 1
            }

            if (!(findController !== null && findController !== void 0 && findController.highlightMatches)) {
              return
            }

            const pageMatches = findController.pageMatches[pageIdx] || null
            const pageMatchesLength = findController.pageMatchesLength[pageIdx] || null
            this.matches = this._convertMatches(pageMatches, pageMatchesLength)

            this._renderMatches(this.matches)
          },
        }])

        return TextHighlighter
      }())

      exports.TextHighlighter = TextHighlighter

      /***/
    },
    /* 36 */
    /***/ (__unused_webpack_module, exports, __webpack_require__) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.TextLayerBuilder = void 0

      const _pdfjsLib = __webpack_require__(7)

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      const EXPAND_DIVS_TIMEOUT = 300

      const TextLayerBuilder = /* #__PURE__ */(function () {
        function TextLayerBuilder(_ref) {
          const textLayerDiv = _ref.textLayerDiv
          const eventBus = _ref.eventBus
          const pageIndex = _ref.pageIndex
          const viewport = _ref.viewport
          const _ref$highlighter = _ref.highlighter
          const highlighter = _ref$highlighter === void 0 ? null : _ref$highlighter
          const _ref$enhanceTextSelec = _ref.enhanceTextSelection
          const enhanceTextSelection = _ref$enhanceTextSelec === void 0 ? false : _ref$enhanceTextSelec

          _classCallCheck(this, TextLayerBuilder)

          this.textLayerDiv = textLayerDiv
          this.eventBus = eventBus
          this.textContent = null
          this.textContentItemsStr = []
          this.textContentStream = null
          this.renderingDone = false
          this.pageNumber = pageIndex + 1
          this.viewport = viewport
          this.textDivs = []
          this.textLayerRenderTask = null
          this.highlighter = highlighter
          this.enhanceTextSelection = enhanceTextSelection

          this._bindMouse()
        }

        _createClass(TextLayerBuilder, [{
          key: '_finishRendering',
          value: function _finishRendering() {
            this.renderingDone = true

            if (!this.enhanceTextSelection) {
              const endOfContent = document.createElement('div')
              endOfContent.className = 'endOfContent'
              this.textLayerDiv.appendChild(endOfContent)
            }

            this.eventBus.dispatch('textlayerrendered', {
              source: this,
              pageNumber: this.pageNumber,
              numTextDivs: this.textDivs.length,
            })
          },
        }, {
          key: 'render',
          value: function render() {
            let _this$highlighter
            const _this = this

            const timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0

            if (!(this.textContent || this.textContentStream) || this.renderingDone) {
              return
            }

            this.cancel()
            this.textDivs.length = 0;
            (_this$highlighter = this.highlighter) === null || _this$highlighter === void 0 ? void 0 : _this$highlighter.setTextMapping(this.textDivs, this.textContentItemsStr)
            const textLayerFrag = document.createDocumentFragment()
            this.textLayerRenderTask = (0, _pdfjsLib.renderTextLayer)({
              textContent: this.textContent,
              textContentStream: this.textContentStream,
              container: textLayerFrag,
              viewport: this.viewport,
              textDivs: this.textDivs,
              textContentItemsStr: this.textContentItemsStr,
              timeout,
              enhanceTextSelection: this.enhanceTextSelection,
            })
            this.textLayerRenderTask.promise.then(() => {
              let _this$highlighter2

              _this.textLayerDiv.appendChild(textLayerFrag)

              _this._finishRendering();

              (_this$highlighter2 = _this.highlighter) === null || _this$highlighter2 === void 0 ? void 0 : _this$highlighter2.enable()
            }, (reason) => { })
          },
        }, {
          key: 'cancel',
          value: function cancel() {
            let _this$highlighter3

            if (this.textLayerRenderTask) {
              this.textLayerRenderTask.cancel()
              this.textLayerRenderTask = null
            }

            (_this$highlighter3 = this.highlighter) === null || _this$highlighter3 === void 0 ? void 0 : _this$highlighter3.disable()
          },
        }, {
          key: 'setTextContentStream',
          value: function setTextContentStream(readableStream) {
            this.cancel()
            this.textContentStream = readableStream
          },
        }, {
          key: 'setTextContent',
          value: function setTextContent(textContent) {
            this.cancel()
            this.textContent = textContent
          },
        }, {
          key: '_bindMouse',
          value: function _bindMouse() {
            const _this2 = this

            const div = this.textLayerDiv
            let expandDivsTimer = null
            div.addEventListener('mousedown', (evt) => {
              if (_this2.enhanceTextSelection && _this2.textLayerRenderTask) {
                _this2.textLayerRenderTask.expandTextDivs(true)

                if (expandDivsTimer) {
                  clearTimeout(expandDivsTimer)
                  expandDivsTimer = null
                }

                return
              }

              const end = div.querySelector('.endOfContent')

              if (!end) {
                return
              }

              let adjustTop = evt.target !== div
              adjustTop = adjustTop && window.getComputedStyle(end).getPropertyValue('-moz-user-select') !== 'none'

              if (adjustTop) {
                const divBounds = div.getBoundingClientRect()
                const r = Math.max(0, (evt.pageY - divBounds.top) / divBounds.height)
                end.style.top = `${(r * 100).toFixed(2)}%`
              }

              end.classList.add('active')
            })
            div.addEventListener('mouseup', () => {
              if (_this2.enhanceTextSelection && _this2.textLayerRenderTask) {
                expandDivsTimer = setTimeout(() => {
                  if (_this2.textLayerRenderTask) {
                    _this2.textLayerRenderTask.expandTextDivs(false)
                  }

                  expandDivsTimer = null
                }, EXPAND_DIVS_TIMEOUT)
                return
              }

              const end = div.querySelector('.endOfContent')

              if (!end) {
                return
              }

              end.style.top = ''
              end.classList.remove('active')
            })
          },
        }])

        return TextLayerBuilder
      }())

      exports.TextLayerBuilder = TextLayerBuilder

      /***/
    },
    /* 37 */
    /***/ (__unused_webpack_module, exports, __webpack_require__) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.XfaLayerBuilder = void 0

      const _pdfjsLib = __webpack_require__(7)

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      const XfaLayerBuilder = /* #__PURE__ */(function () {
        function XfaLayerBuilder(_ref) {
          const pageDiv = _ref.pageDiv
          const pdfPage = _ref.pdfPage
          const _ref$annotationStorag = _ref.annotationStorage
          const annotationStorage = _ref$annotationStorag === void 0 ? null : _ref$annotationStorag
          const linkService = _ref.linkService
          const _ref$xfaHtml = _ref.xfaHtml
          const xfaHtml = _ref$xfaHtml === void 0 ? null : _ref$xfaHtml

          _classCallCheck(this, XfaLayerBuilder)

          this.pageDiv = pageDiv
          this.pdfPage = pdfPage
          this.annotationStorage = annotationStorage
          this.linkService = linkService
          this.xfaHtml = xfaHtml
          this.div = null
          this._cancelled = false
        }

        _createClass(XfaLayerBuilder, [{
          key: 'render',
          value: function render(viewport) {
            const _this = this

            const intent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'display'

            if (intent === 'print') {
              const parameters = {
                viewport: viewport.clone({
                  dontFlip: true,
                }),
                div: this.div,
                xfaHtml: this.xfaHtml,
                annotationStorage: this.annotationStorage,
                linkService: this.linkService,
                intent,
              }
              const div = document.createElement('div')
              this.pageDiv.appendChild(div)
              parameters.div = div

              const result = _pdfjsLib.XfaLayer.render(parameters)

              return Promise.resolve(result)
            }

            return this.pdfPage.getXfa().then((xfaHtml) => {
              if (_this._cancelled || !xfaHtml) {
                return {
                  textDivs: [],
                }
              }

              const parameters = {
                viewport: viewport.clone({
                  dontFlip: true,
                }),
                div: _this.div,
                xfaHtml,
                annotationStorage: _this.annotationStorage,
                linkService: _this.linkService,
                intent,
              }

              if (_this.div) {
                return _pdfjsLib.XfaLayer.update(parameters)
              }

              _this.div = document.createElement('div')

              _this.pageDiv.appendChild(_this.div)

              parameters.div = _this.div
              return _pdfjsLib.XfaLayer.render(parameters)
            }).catch((error) => {
              console.error(error)
            })
          },
        }, {
          key: 'cancel',
          value: function cancel() {
            this._cancelled = true
          },
        }, {
          key: 'hide',
          value: function hide() {
            if (!this.div) {
              return
            }

            this.div.hidden = true
          },
        }])

        return XfaLayerBuilder
      }())

      exports.XfaLayerBuilder = XfaLayerBuilder

      /***/
    },
    /* 38 */
    /***/ (__unused_webpack_module, exports, __webpack_require__) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.SecondaryToolbar = void 0

      const _ui_utils = __webpack_require__(5)

      const _pdf_cursor_tools = __webpack_require__(8)

      const _base_viewer = __webpack_require__(30)

      function _createForOfIteratorHelper(o, allowArrayLike) {
        let it = typeof Symbol !== 'undefined' && o[Symbol.iterator] || o['@@iterator']; if (!it) {
          if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === 'number') {
            if (it)
              o = it; let i = 0; const F = function F() { }; return {
                s: F,
                n: function n() {
                  if (i >= o.length)
                    return { done: true }; return { done: false, value: o[i++] }
                },
                e: function e(_e) { throw _e },
                f: F,
              }
          } throw new TypeError('Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.')
        } let normalCompletion = true; let didErr = false; let err; return {
          s: function s() { it = it.call(o) },
          n: function n() { const step = it.next(); normalCompletion = step.done; return step },
          e: function e(_e2) { didErr = true; err = _e2 },
          f: function f() {
            try {
              if (!normalCompletion && it.return != null)
                it.return()
            }
            finally {
              if (didErr)
                throw err
            }
          },
        }
      }

      function _unsupportedIterableToArray(o, minLen) {
        if (!o)
          return; if (typeof o === 'string')
          return _arrayLikeToArray(o, minLen); let n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor)
          n = o.constructor.name; if (n === 'Map' || n === 'Set')
          return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
          return _arrayLikeToArray(o, minLen)
      }

      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length)
          len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2
      }

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      const SecondaryToolbar = /* #__PURE__ */(function () {
        function SecondaryToolbar(options, mainContainer, eventBus) {
          _classCallCheck(this, SecondaryToolbar)

          this.toolbar = options.toolbar
          this.toggleButton = options.toggleButton
          this.toolbarButtonContainer = options.toolbarButtonContainer
          this.buttons = [{
            element: options.presentationModeButton,
            eventName: 'presentationmode',
            close: true,
          }, {
            element: options.openFileButton,
            eventName: 'openfile',
            close: true,
          }, {
            element: options.printButton,
            eventName: 'print',
            close: true,
          }, {
            element: options.downloadButton,
            eventName: 'download',
            close: true,
          }, {
            element: options.viewBookmarkButton,
            eventName: null,
            close: true,
          }, {
            element: options.firstPageButton,
            eventName: 'firstpage',
            close: true,
          }, {
            element: options.lastPageButton,
            eventName: 'lastpage',
            close: true,
          }, {
            element: options.pageRotateCwButton,
            eventName: 'rotatecw',
            close: false,
          }, {
            element: options.pageRotateCcwButton,
            eventName: 'rotateccw',
            close: false,
          }, {
            element: options.cursorSelectToolButton,
            eventName: 'switchcursortool',
            eventDetails: {
              tool: _pdf_cursor_tools.CursorTool.SELECT,
            },
            close: true,
          }, {
            element: options.cursorHandToolButton,
            eventName: 'switchcursortool',
            eventDetails: {
              tool: _pdf_cursor_tools.CursorTool.HAND,
            },
            close: true,
          }, {
            element: options.scrollPageButton,
            eventName: 'switchscrollmode',
            eventDetails: {
              mode: _ui_utils.ScrollMode.PAGE,
            },
            close: true,
          }, {
            element: options.scrollVerticalButton,
            eventName: 'switchscrollmode',
            eventDetails: {
              mode: _ui_utils.ScrollMode.VERTICAL,
            },
            close: true,
          }, {
            element: options.scrollHorizontalButton,
            eventName: 'switchscrollmode',
            eventDetails: {
              mode: _ui_utils.ScrollMode.HORIZONTAL,
            },
            close: true,
          }, {
            element: options.scrollWrappedButton,
            eventName: 'switchscrollmode',
            eventDetails: {
              mode: _ui_utils.ScrollMode.WRAPPED,
            },
            close: true,
          }, {
            element: options.spreadNoneButton,
            eventName: 'switchspreadmode',
            eventDetails: {
              mode: _ui_utils.SpreadMode.NONE,
            },
            close: true,
          }, {
            element: options.spreadOddButton,
            eventName: 'switchspreadmode',
            eventDetails: {
              mode: _ui_utils.SpreadMode.ODD,
            },
            close: true,
          }, {
            element: options.spreadEvenButton,
            eventName: 'switchspreadmode',
            eventDetails: {
              mode: _ui_utils.SpreadMode.EVEN,
            },
            close: true,
          }, {
            element: options.documentPropertiesButton,
            eventName: 'documentproperties',
            close: true,
          }]
          this.items = {
            firstPage: options.firstPageButton,
            lastPage: options.lastPageButton,
            pageRotateCw: options.pageRotateCwButton,
            pageRotateCcw: options.pageRotateCcwButton,
          }
          this.mainContainer = mainContainer
          this.eventBus = eventBus
          this.opened = false
          this.containerHeight = null
          this.previousContainerHeight = null
          this.reset()

          this._bindClickListeners()

          this._bindCursorToolsListener(options)

          this._bindScrollModeListener(options)

          this._bindSpreadModeListener(options)

          this.eventBus._on('resize', this._setMaxHeight.bind(this))
        }

        _createClass(SecondaryToolbar, [{
          key: 'isOpen',
          get: function get() {
            return this.opened
          },
        }, {
          key: 'setPageNumber',
          value: function setPageNumber(pageNumber) {
            this.pageNumber = pageNumber

            this._updateUIState()
          },
        }, {
          key: 'setPagesCount',
          value: function setPagesCount(pagesCount) {
            this.pagesCount = pagesCount

            this._updateUIState()
          },
        }, {
          key: 'reset',
          value: function reset() {
            this.pageNumber = 0
            this.pagesCount = 0

            this._updateUIState()

            this.eventBus.dispatch('secondarytoolbarreset', {
              source: this,
            })
          },
        }, {
          key: '_updateUIState',
          value: function _updateUIState() {
            this.items.firstPage.disabled = this.pageNumber <= 1
            this.items.lastPage.disabled = this.pageNumber >= this.pagesCount
            this.items.pageRotateCw.disabled = this.pagesCount === 0
            this.items.pageRotateCcw.disabled = this.pagesCount === 0
          },
        }, {
          key: '_bindClickListeners',
          value: function _bindClickListeners() {
            const _this = this

            this.toggleButton.addEventListener('click', this.toggle.bind(this))

            const _iterator = _createForOfIteratorHelper(this.buttons)
            let _step

            try {
              const _loop = function _loop() {
                const _step$value = _step.value
                const element = _step$value.element
                const eventName = _step$value.eventName
                const close = _step$value.close
                const eventDetails = _step$value.eventDetails
                element.addEventListener('click', (evt) => {
                  if (eventName !== null) {
                    const details = {
                      source: _this,
                    }

                    for (const property in eventDetails) {
                      details[property] = eventDetails[property]
                    }

                    _this.eventBus.dispatch(eventName, details)
                  }

                  if (close) {
                    _this.close()
                  }
                })
              }

              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                _loop()
              }
            }
            catch (err) {
              _iterator.e(err)
            }
            finally {
              _iterator.f()
            }
          },
        }, {
          key: '_bindCursorToolsListener',
          value: function _bindCursorToolsListener(buttons) {
            this.eventBus._on('cursortoolchanged', (_ref) => {
              const tool = _ref.tool
              buttons.cursorSelectToolButton.classList.toggle('toggled', tool === _pdf_cursor_tools.CursorTool.SELECT)
              buttons.cursorHandToolButton.classList.toggle('toggled', tool === _pdf_cursor_tools.CursorTool.HAND)
            })
          },
        }, {
          key: '_bindScrollModeListener',
          value: function _bindScrollModeListener(buttons) {
            const _this2 = this

            const scrollModeChanged = function scrollModeChanged(_ref2) {
              const mode = _ref2.mode
              buttons.scrollPageButton.classList.toggle('toggled', mode === _ui_utils.ScrollMode.PAGE)
              buttons.scrollVerticalButton.classList.toggle('toggled', mode === _ui_utils.ScrollMode.VERTICAL)
              buttons.scrollHorizontalButton.classList.toggle('toggled', mode === _ui_utils.ScrollMode.HORIZONTAL)
              buttons.scrollWrappedButton.classList.toggle('toggled', mode === _ui_utils.ScrollMode.WRAPPED)
              const forceScrollModePage = _this2.pagesCount > _base_viewer.PagesCountLimit.FORCE_SCROLL_MODE_PAGE
              buttons.scrollPageButton.disabled = forceScrollModePage
              buttons.scrollVerticalButton.disabled = forceScrollModePage
              buttons.scrollHorizontalButton.disabled = forceScrollModePage
              buttons.scrollWrappedButton.disabled = forceScrollModePage
              const isScrollModeHorizontal = mode === _ui_utils.ScrollMode.HORIZONTAL
              buttons.spreadNoneButton.disabled = isScrollModeHorizontal
              buttons.spreadOddButton.disabled = isScrollModeHorizontal
              buttons.spreadEvenButton.disabled = isScrollModeHorizontal
            }

            this.eventBus._on('scrollmodechanged', scrollModeChanged)

            this.eventBus._on('secondarytoolbarreset', (evt) => {
              if (evt.source === _this2) {
                scrollModeChanged({
                  mode: _ui_utils.ScrollMode.VERTICAL,
                })
              }
            })
          },
        }, {
          key: '_bindSpreadModeListener',
          value: function _bindSpreadModeListener(buttons) {
            const _this3 = this

            function spreadModeChanged(_ref3) {
              const mode = _ref3.mode
              buttons.spreadNoneButton.classList.toggle('toggled', mode === _ui_utils.SpreadMode.NONE)
              buttons.spreadOddButton.classList.toggle('toggled', mode === _ui_utils.SpreadMode.ODD)
              buttons.spreadEvenButton.classList.toggle('toggled', mode === _ui_utils.SpreadMode.EVEN)
            }

            this.eventBus._on('spreadmodechanged', spreadModeChanged)

            this.eventBus._on('secondarytoolbarreset', (evt) => {
              if (evt.source === _this3) {
                spreadModeChanged({
                  mode: _ui_utils.SpreadMode.NONE,
                })
              }
            })
          },
        }, {
          key: 'open',
          value: function open() {
            if (this.opened) {
              return
            }

            this.opened = true

            this._setMaxHeight()

            this.toggleButton.classList.add('toggled')
            this.toggleButton.setAttribute('aria-expanded', 'true')
            this.toolbar.classList.remove('hidden')
          },
        }, {
          key: 'close',
          value: function close() {
            if (!this.opened) {
              return
            }

            this.opened = false
            this.toolbar.classList.add('hidden')
            this.toggleButton.classList.remove('toggled')
            this.toggleButton.setAttribute('aria-expanded', 'false')
          },
        }, {
          key: 'toggle',
          value: function toggle() {
            if (this.opened) {
              this.close()
            }
            else {
              this.open()
            }
          },
        }, {
          key: '_setMaxHeight',
          value: function _setMaxHeight() {
            if (!this.opened) {
              return
            }

            this.containerHeight = this.mainContainer.clientHeight

            if (this.containerHeight === this.previousContainerHeight) {
              return
            }

            this.toolbarButtonContainer.style.maxHeight = ''.concat(this.containerHeight - _ui_utils.SCROLLBAR_PADDING, 'px')
            this.previousContainerHeight = this.containerHeight
          },
        }])

        return SecondaryToolbar
      }())

      exports.SecondaryToolbar = SecondaryToolbar

      /***/
    },
    /* 39 */
    /***/ (__unused_webpack_module, exports, __webpack_require__) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.Toolbar = void 0

      const _regenerator = _interopRequireDefault(__webpack_require__(3))

      const _ui_utils = __webpack_require__(5)

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj } }

      function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
        try { var info = gen[key](arg); var value = info.value }
        catch (error) { reject(error); return } if (info.done) { resolve(value) }
        else { Promise.resolve(value).then(_next, _throw) }
      }

      function _asyncToGenerator(fn) { return function () { const self = this; const args = arguments; return new Promise((resolve, reject) => { const gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value) } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err) } _next(undefined) }) } }

      function _createForOfIteratorHelper(o, allowArrayLike) {
        let it = typeof Symbol !== 'undefined' && o[Symbol.iterator] || o['@@iterator']; if (!it) {
          if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === 'number') {
            if (it)
              o = it; let i = 0; const F = function F() { }; return {
                s: F,
                n: function n() {
                  if (i >= o.length)
                    return { done: true }; return { done: false, value: o[i++] }
                },
                e: function e(_e) { throw _e },
                f: F,
              }
          } throw new TypeError('Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.')
        } let normalCompletion = true; let didErr = false; let err; return {
          s: function s() { it = it.call(o) },
          n: function n() { const step = it.next(); normalCompletion = step.done; return step },
          e: function e(_e2) { didErr = true; err = _e2 },
          f: function f() {
            try {
              if (!normalCompletion && it.return != null)
                it.return()
            }
            finally {
              if (didErr)
                throw err
            }
          },
        }
      }

      function _unsupportedIterableToArray(o, minLen) {
        if (!o)
          return; if (typeof o === 'string')
          return _arrayLikeToArray(o, minLen); let n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor)
          n = o.constructor.name; if (n === 'Map' || n === 'Set')
          return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
          return _arrayLikeToArray(o, minLen)
      }

      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length)
          len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2
      }

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      const PAGE_NUMBER_LOADING_INDICATOR = 'visiblePageIsLoading'

      const Toolbar = /* #__PURE__ */(function () {
        function Toolbar(options, eventBus, l10n) {
          _classCallCheck(this, Toolbar)

          this.toolbar = options.container
          this.eventBus = eventBus
          this.l10n = l10n
          this.buttons = [{
            element: options.previous,
            eventName: 'previouspage',
          }, {
            element: options.next,
            eventName: 'nextpage',
          }, {
            element: options.zoomIn,
            eventName: 'zoomin',
          }, {
            element: options.zoomOut,
            eventName: 'zoomout',
          }, {
            element: options.openFile,
            eventName: 'openfile',
          }, {
            element: options.print,
            eventName: 'print',
          }, {
            element: options.presentationModeButton,
            eventName: 'presentationmode',
          }, {
            element: options.download,
            eventName: 'download',
          }, {
            element: options.viewBookmark,
            eventName: null,
          }]
          this.items = {
            numPages: options.numPages,
            pageNumber: options.pageNumber,
            scaleSelect: options.scaleSelect,
            customScaleOption: options.customScaleOption,
            previous: options.previous,
            next: options.next,
            zoomIn: options.zoomIn,
            zoomOut: options.zoomOut,
          }
          this._wasLocalized = false
          this.reset()

          this._bindListeners()
        }

        _createClass(Toolbar, [{
          key: 'setPageNumber',
          value: function setPageNumber(pageNumber, pageLabel) {
            this.pageNumber = pageNumber
            this.pageLabel = pageLabel

            this._updateUIState(false)
          },
        }, {
          key: 'setPagesCount',
          value: function setPagesCount(pagesCount, hasPageLabels) {
            this.pagesCount = pagesCount
            this.hasPageLabels = hasPageLabels

            this._updateUIState(true)
          },
        }, {
          key: 'setPageScale',
          value: function setPageScale(pageScaleValue, pageScale) {
            this.pageScaleValue = (pageScaleValue || pageScale).toString()
            this.pageScale = pageScale

            this._updateUIState(false)
          },
        }, {
          key: 'reset',
          value: function reset() {
            this.pageNumber = 0
            this.pageLabel = null
            this.hasPageLabels = false
            this.pagesCount = 0
            this.pageScaleValue = _ui_utils.DEFAULT_SCALE_VALUE
            this.pageScale = _ui_utils.DEFAULT_SCALE

            this._updateUIState(true)

            this.updateLoadingIndicatorState()
          },
        }, {
          key: '_bindListeners',
          value: function _bindListeners() {
            const _this = this

            const _this$items = this.items
            const pageNumber = _this$items.pageNumber
            const scaleSelect = _this$items.scaleSelect
            const self = this

            const _iterator = _createForOfIteratorHelper(this.buttons)
            let _step

            try {
              const _loop = function _loop() {
                const _step$value = _step.value
                const element = _step$value.element
                const eventName = _step$value.eventName
                element.addEventListener('click', (evt) => {
                  if (eventName !== null) {
                    _this.eventBus.dispatch(eventName, {
                      source: _this,
                    })
                  }
                })
              }

              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                _loop()
              }
            }
            catch (err) {
              _iterator.e(err)
            }
            finally {
              _iterator.f()
            }

            pageNumber.addEventListener('click', function () {
              this.select()
            })
            pageNumber.addEventListener('change', function () {
              self.eventBus.dispatch('pagenumberchanged', {
                source: self,
                value: this.value,
              })
            })
            scaleSelect.addEventListener('change', function () {
              if (this.value === 'custom') {
                return
              }

              self.eventBus.dispatch('scalechanged', {
                source: self,
                value: this.value,
              })
            })
            scaleSelect.addEventListener('click', function (evt) {
              const target = evt.target

              if (this.value === self.pageScaleValue && target.tagName.toUpperCase() === 'OPTION') {
                this.blur()
              }
            })
            scaleSelect.oncontextmenu = _ui_utils.noContextMenuHandler

            this.eventBus._on('localized', () => {
              _this._wasLocalized = true

              _this._adjustScaleWidth()

              _this._updateUIState(true)
            })
          },
        }, {
          key: '_updateUIState',
          value: function _updateUIState() {
            const resetNumPages = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false

            if (!this._wasLocalized) {
              return
            }

            const pageNumber = this.pageNumber
            const pagesCount = this.pagesCount
            const pageScaleValue = this.pageScaleValue
            const pageScale = this.pageScale
            const items = this.items

            if (resetNumPages) {
              if (this.hasPageLabels) {
                items.pageNumber.type = 'text'
              }
              else {
                items.pageNumber.type = 'number'
                this.l10n.get('of_pages', {
                  pagesCount,
                }).then((msg) => {
                  items.numPages.textContent = msg
                })
              }

              items.pageNumber.max = pagesCount
            }

            if (this.hasPageLabels) {
              items.pageNumber.value = this.pageLabel
              this.l10n.get('page_of_pages', {
                pageNumber,
                pagesCount,
              }).then((msg) => {
                items.numPages.textContent = msg
              })
            }
            else {
              items.pageNumber.value = pageNumber
            }

            items.previous.disabled = pageNumber <= 1
            items.next.disabled = pageNumber >= pagesCount
            items.zoomOut.disabled = pageScale <= _ui_utils.MIN_SCALE
            items.zoomIn.disabled = pageScale >= _ui_utils.MAX_SCALE
            this.l10n.get('page_scale_percent', {
              scale: Math.round(pageScale * 10000) / 100,
            }).then((msg) => {
              let predefinedValueFound = false

              const _iterator2 = _createForOfIteratorHelper(items.scaleSelect.options)
              let _step2

              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  const option = _step2.value

                  if (option.value !== pageScaleValue) {
                    option.selected = false
                    continue
                  }

                  option.selected = true
                  predefinedValueFound = true
                }
              }
              catch (err) {
                _iterator2.e(err)
              }
              finally {
                _iterator2.f()
              }

              if (!predefinedValueFound) {
                items.customScaleOption.textContent = msg
                items.customScaleOption.selected = true
              }
            })
          },
        }, {
          key: 'updateLoadingIndicatorState',
          value: function updateLoadingIndicatorState() {
            const loading = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false
            const pageNumberInput = this.items.pageNumber
            pageNumberInput.classList.toggle(PAGE_NUMBER_LOADING_INDICATOR, loading)
          },
        }, {
          key: '_adjustScaleWidth',
          value: (function () {
            const _adjustScaleWidth2 = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee() {
              let items, l10n, predefinedValuesPromise, style, scaleSelectContainerWidth, scaleSelectOverflow, canvas, ctx, maxWidth, _iterator3, _step3, predefinedValue, _ctx$measureText, width, doc

              return _regenerator.default.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      items = this.items, l10n = this.l10n
                      predefinedValuesPromise = Promise.all([l10n.get('page_scale_auto'), l10n.get('page_scale_actual'), l10n.get('page_scale_fit'), l10n.get('page_scale_width')])
                      style = getComputedStyle(items.scaleSelect), scaleSelectContainerWidth = Number.parseInt(style.getPropertyValue('--scale-select-container-width'), 10), scaleSelectOverflow = Number.parseInt(style.getPropertyValue('--scale-select-overflow'), 10)
                      canvas = document.createElement('canvas')
                      canvas.mozOpaque = true
                      ctx = canvas.getContext('2d', {
                        alpha: false,
                      })
                      _context.next = 8
                      return _ui_utils.animationStarted

                    case 8:
                      ctx.font = ''.concat(style.fontSize, ' ').concat(style.fontFamily)
                      maxWidth = 0
                      _context.t0 = _createForOfIteratorHelper
                      _context.next = 13
                      return predefinedValuesPromise

                    case 13:
                      _context.t1 = _context.sent
                      _iterator3 = (0, _context.t0)(_context.t1)

                      try {
                        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                          predefinedValue = _step3.value
                          _ctx$measureText = ctx.measureText(predefinedValue), width = _ctx$measureText.width

                          if (width > maxWidth) {
                            maxWidth = width
                          }
                        }
                      }
                      catch (err) {
                        _iterator3.e(err)
                      }
                      finally {
                        _iterator3.f()
                      }

                      maxWidth += 2 * scaleSelectOverflow

                      if (maxWidth > scaleSelectContainerWidth) {
                        doc = document.documentElement
                        doc.style.setProperty('--scale-select-container-width', ''.concat(maxWidth, 'px'))
                      }

                      canvas.width = 0
                      canvas.height = 0
                      canvas = ctx = null

                    case 21:
                    case 'end':
                      return _context.stop()
                  }
                }
              }, _callee, this)
            }))

            function _adjustScaleWidth() {
              return _adjustScaleWidth2.apply(this, arguments)
            }

            return _adjustScaleWidth
          }()),
        }])

        return Toolbar
      }())

      exports.Toolbar = Toolbar

      /***/
    },
    /* 40 */
    /***/ (__unused_webpack_module, exports, __webpack_require__) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.ViewHistory = void 0

      const _regenerator = _interopRequireDefault(__webpack_require__(3))

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj } }

      function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
        try { var info = gen[key](arg); var value = info.value }
        catch (error) { reject(error); return } if (info.done) { resolve(value) }
        else { Promise.resolve(value).then(_next, _throw) }
      }

      function _asyncToGenerator(fn) { return function () { const self = this; const args = arguments; return new Promise((resolve, reject) => { const gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value) } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err) } _next(undefined) }) } }

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      const DEFAULT_VIEW_HISTORY_CACHE_SIZE = 20

      const ViewHistory = /* #__PURE__ */(function () {
        function ViewHistory(fingerprint) {
          const _this = this

          const cacheSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_VIEW_HISTORY_CACHE_SIZE

          _classCallCheck(this, ViewHistory)

          this.fingerprint = fingerprint
          this.cacheSize = cacheSize
          this._initializedPromise = this._readFromStorage().then((databaseStr) => {
            const database = JSON.parse(databaseStr || '{}')
            let index = -1

            if (!Array.isArray(database.files)) {
              database.files = []
            }
            else {
              while (database.files.length >= _this.cacheSize) {
                database.files.shift()
              }

              for (let i = 0, ii = database.files.length; i < ii; i++) {
                const branch = database.files[i]

                if (branch.fingerprint === _this.fingerprint) {
                  index = i
                  break
                }
              }
            }

            if (index === -1) {
              index = database.files.push({
                fingerprint: _this.fingerprint,
              }) - 1
            }

            _this.file = database.files[index]
            _this.database = database
          })
        }

        _createClass(ViewHistory, [{
          key: '_writeToStorage',
          value: (function () {
            const _writeToStorage2 = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee() {
              let databaseStr
              return _regenerator.default.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      databaseStr = JSON.stringify(this.database)
                      localStorage.setItem('pdfjs.history', databaseStr)

                    case 2:
                    case 'end':
                      return _context.stop()
                  }
                }
              }, _callee, this)
            }))

            function _writeToStorage() {
              return _writeToStorage2.apply(this, arguments)
            }

            return _writeToStorage
          }()),
        }, {
          key: '_readFromStorage',
          value: (function () {
            const _readFromStorage2 = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee2() {
              return _regenerator.default.wrap((_context2) => {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      return _context2.abrupt('return', localStorage.getItem('pdfjs.history'))

                    case 1:
                    case 'end':
                      return _context2.stop()
                  }
                }
              }, _callee2)
            }))

            function _readFromStorage() {
              return _readFromStorage2.apply(this, arguments)
            }

            return _readFromStorage
          }()),
        }, {
          key: 'set',
          value: (function () {
            const _set = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee3(name, val) {
              return _regenerator.default.wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      _context3.next = 2
                      return this._initializedPromise

                    case 2:
                      this.file[name] = val
                      return _context3.abrupt('return', this._writeToStorage())

                    case 4:
                    case 'end':
                      return _context3.stop()
                  }
                }
              }, _callee3, this)
            }))

            function set(_x, _x2) {
              return _set.apply(this, arguments)
            }

            return set
          }()),
        }, {
          key: 'setMultiple',
          value: (function () {
            const _setMultiple = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee4(properties) {
              let name
              return _regenerator.default.wrap(function _callee4$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      _context4.next = 2
                      return this._initializedPromise

                    case 2:
                      for (name in properties) {
                        this.file[name] = properties[name]
                      }

                      return _context4.abrupt('return', this._writeToStorage())

                    case 4:
                    case 'end':
                      return _context4.stop()
                  }
                }
              }, _callee4, this)
            }))

            function setMultiple(_x3) {
              return _setMultiple.apply(this, arguments)
            }

            return setMultiple
          }()),
        }, {
          key: 'get',
          value: (function () {
            const _get = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee5(name, defaultValue) {
              let val
              return _regenerator.default.wrap(function _callee5$(_context5) {
                while (1) {
                  switch (_context5.prev = _context5.next) {
                    case 0:
                      _context5.next = 2
                      return this._initializedPromise

                    case 2:
                      val = this.file[name]
                      return _context5.abrupt('return', val !== undefined ? val : defaultValue)

                    case 4:
                    case 'end':
                      return _context5.stop()
                  }
                }
              }, _callee5, this)
            }))

            function get(_x4, _x5) {
              return _get.apply(this, arguments)
            }

            return get
          }()),
        }, {
          key: 'getMultiple',
          value: (function () {
            const _getMultiple = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee6(properties) {
              let values, name, val
              return _regenerator.default.wrap(function _callee6$(_context6) {
                while (1) {
                  switch (_context6.prev = _context6.next) {
                    case 0:
                      _context6.next = 2
                      return this._initializedPromise

                    case 2:
                      values = Object.create(null)

                      for (name in properties) {
                        val = this.file[name]
                        values[name] = val !== undefined ? val : properties[name]
                      }

                      return _context6.abrupt('return', values)

                    case 5:
                    case 'end':
                      return _context6.stop()
                  }
                }
              }, _callee6, this)
            }))

            function getMultiple(_x6) {
              return _getMultiple.apply(this, arguments)
            }

            return getMultiple
          }()),
        }])

        return ViewHistory
      }())

      exports.ViewHistory = ViewHistory

      /***/
    },
    /* 41 */
    /***/ (__unused_webpack_module, exports, __webpack_require__) => {
      function _typeof(obj) {
        '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof(obj) { return typeof obj } }
        else { _typeof = function _typeof(obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj)
      }

      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.GenericCom = void 0

      const _regenerator = _interopRequireDefault(__webpack_require__(3))

      const _app = __webpack_require__(2)

      const _preferences = __webpack_require__(42)

      const _download_manager = __webpack_require__(43)

      const _genericl10n = __webpack_require__(44)

      const _generic_scripting = __webpack_require__(46)

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj } }

      function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
        try { var info = gen[key](arg); var value = info.value }
        catch (error) { reject(error); return } if (info.done) { resolve(value) }
        else { Promise.resolve(value).then(_next, _throw) }
      }

      function _asyncToGenerator(fn) { return function () { const self = this; const args = arguments; return new Promise((resolve, reject) => { const gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value) } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err) } _next(undefined) }) } }

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      function _inherits(subClass, superClass) {
        if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function') } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass)
          _setPrototypeOf(subClass, superClass)
      }

      function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o }; return _setPrototypeOf(o, p) }

      function _createSuper(Derived) {
        const hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() {
          const Super = _getPrototypeOf(Derived); let result; if (hasNativeReflectConstruct) { const NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget) }
          else { result = Super.apply(this, arguments) } return _possibleConstructorReturn(this, result)
        }
      }

      function _possibleConstructorReturn(self, call) {
        if (call && (_typeof(call) === 'object' || typeof call === 'function')) { return call }
        else if (call !== void 0) { throw new TypeError('Derived constructors may only return object or undefined') } return _assertThisInitialized(self)
      }

      function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called') } return self }

      function _isNativeReflectConstruct() {
        if (typeof Reflect === 'undefined' || !Reflect.construct)
          return false; if (Reflect.construct.sham)
          return false; if (typeof Proxy === 'function')
          return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], () => { })); return true }
        catch (e) { return false }
      }

      function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o) }; return _getPrototypeOf(o) }

      ;
      const GenericCom = {}
      exports.GenericCom = GenericCom

      const GenericPreferences = /* #__PURE__ */(function (_BasePreferences) {
        _inherits(GenericPreferences, _BasePreferences)

        const _super = _createSuper(GenericPreferences)

        function GenericPreferences() {
          _classCallCheck(this, GenericPreferences)

          return _super.apply(this, arguments)
        }

        _createClass(GenericPreferences, [{
          key: '_writeToStorage',
          value: (function () {
            const _writeToStorage2 = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee(prefObj) {
              return _regenerator.default.wrap((_context) => {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      localStorage.setItem('pdfjs.preferences', JSON.stringify(prefObj))

                    case 1:
                    case 'end':
                      return _context.stop()
                  }
                }
              }, _callee)
            }))

            function _writeToStorage(_x) {
              return _writeToStorage2.apply(this, arguments)
            }

            return _writeToStorage
          }()),
        }, {
          key: '_readFromStorage',
          value: (function () {
            const _readFromStorage2 = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee2(prefObj) {
              return _regenerator.default.wrap((_context2) => {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      return _context2.abrupt('return', JSON.parse(localStorage.getItem('pdfjs.preferences')))

                    case 1:
                    case 'end':
                      return _context2.stop()
                  }
                }
              }, _callee2)
            }))

            function _readFromStorage(_x2) {
              return _readFromStorage2.apply(this, arguments)
            }

            return _readFromStorage
          }()),
        }])

        return GenericPreferences
      }(_preferences.BasePreferences))

      const GenericExternalServices = /* #__PURE__ */(function (_DefaultExternalServi) {
        _inherits(GenericExternalServices, _DefaultExternalServi)

        const _super2 = _createSuper(GenericExternalServices)

        function GenericExternalServices() {
          _classCallCheck(this, GenericExternalServices)

          return _super2.apply(this, arguments)
        }

        _createClass(GenericExternalServices, null, [{
          key: 'createDownloadManager',
          value: function createDownloadManager(options) {
            return new _download_manager.DownloadManager()
          },
        }, {
          key: 'createPreferences',
          value: function createPreferences() {
            return new GenericPreferences()
          },
        }, {
          key: 'createL10n',
          value: function createL10n(_ref) {
            const _ref$locale = _ref.locale
            const locale = _ref$locale === void 0 ? 'en-US' : _ref$locale
            return new _genericl10n.GenericL10n(locale)
          },
        }, {
          key: 'createScripting',
          value: function createScripting(_ref2) {
            const sandboxBundleSrc = _ref2.sandboxBundleSrc
            return new _generic_scripting.GenericScripting(sandboxBundleSrc)
          },
        }])

        return GenericExternalServices
      }(_app.DefaultExternalServices))

      _app.PDFViewerApplication.externalServices = GenericExternalServices

      /***/
    },
    /* 42 */
    /***/ (__unused_webpack_module, exports, __webpack_require__) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.BasePreferences = void 0

      const _regenerator = _interopRequireDefault(__webpack_require__(3))

      const _app_options = __webpack_require__(1)

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj } }

      function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
        try { var info = gen[key](arg); var value = info.value }
        catch (error) { reject(error); return } if (info.done) { resolve(value) }
        else { Promise.resolve(value).then(_next, _throw) }
      }

      function _asyncToGenerator(fn) { return function () { const self = this; const args = arguments; return new Promise((resolve, reject) => { const gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value) } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err) } _next(undefined) }) } }

      function _typeof(obj) {
        '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof(obj) { return typeof obj } }
        else { _typeof = function _typeof(obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj)
      }

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      const BasePreferences = /* #__PURE__ */(function () {
        function BasePreferences() {
          const _this = this

          _classCallCheck(this, BasePreferences)

          if (this.constructor === BasePreferences) {
            throw new Error('Cannot initialize BasePreferences.')
          }

          Object.defineProperty(this, 'defaults', {
            value: Object.freeze({
              annotationMode: 2,
              cursorToolOnLoad: 0,
              defaultZoomValue: '',
              disablePageLabels: false,
              enablePermissions: false,
              enablePrintAutoRotate: true,
              enableScripting: true,
              externalLinkTarget: 0,
              historyUpdateUrl: false,
              ignoreDestinationZoom: false,
              pdfBugEnabled: false,
              renderer: 'canvas',
              sidebarViewOnLoad: -1,
              scrollModeOnLoad: -1,
              spreadModeOnLoad: -1,
              textLayerMode: 1,
              useOnlyCssZoom: false,
              viewerCssTheme: 0,
              viewOnLoad: 0,
              disableAutoFetch: false,
              disableFontFace: false,
              disableRange: false,
              disableStream: false,
              enableXfa: true,
            }),
            writable: false,
            enumerable: true,
            configurable: false,
          })
          this.prefs = Object.create(null)
          this._initializedPromise = this._readFromStorage(this.defaults).then((prefs) => {
            for (const name in _this.defaults) {
              const prefValue = prefs === null || prefs === void 0 ? void 0 : prefs[name]

              if (_typeof(prefValue) === _typeof(_this.defaults[name])) {
                _this.prefs[name] = prefValue
              }
            }
          })
        }

        _createClass(BasePreferences, [{
          key: '_writeToStorage',
          value: (function () {
            const _writeToStorage2 = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee(prefObj) {
              return _regenerator.default.wrap((_context) => {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      throw new Error('Not implemented: _writeToStorage')

                    case 1:
                    case 'end':
                      return _context.stop()
                  }
                }
              }, _callee)
            }))

            function _writeToStorage(_x) {
              return _writeToStorage2.apply(this, arguments)
            }

            return _writeToStorage
          }()),
        }, {
          key: '_readFromStorage',
          value: (function () {
            const _readFromStorage2 = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee2(prefObj) {
              return _regenerator.default.wrap((_context2) => {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      throw new Error('Not implemented: _readFromStorage')

                    case 1:
                    case 'end':
                      return _context2.stop()
                  }
                }
              }, _callee2)
            }))

            function _readFromStorage(_x2) {
              return _readFromStorage2.apply(this, arguments)
            }

            return _readFromStorage
          }()),
        }, {
          key: 'reset',
          value: (function () {
            const _reset = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee3() {
              return _regenerator.default.wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      _context3.next = 2
                      return this._initializedPromise

                    case 2:
                      this.prefs = Object.create(null)
                      return _context3.abrupt('return', this._writeToStorage(this.defaults))

                    case 4:
                    case 'end':
                      return _context3.stop()
                  }
                }
              }, _callee3, this)
            }))

            function reset() {
              return _reset.apply(this, arguments)
            }

            return reset
          }()),
        }, {
          key: 'set',
          value: (function () {
            const _set = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee4(name, value) {
              let defaultValue, valueType, defaultType
              return _regenerator.default.wrap(function _callee4$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      _context4.next = 2
                      return this._initializedPromise

                    case 2:
                      defaultValue = this.defaults[name]

                      if (!(defaultValue === undefined)) {
                        _context4.next = 7
                        break
                      }

                      throw new Error('Set preference: "'.concat(name, '" is undefined.'))

                    case 7:
                      if (!(value === undefined)) {
                        _context4.next = 9
                        break
                      }

                      throw new Error('Set preference: no value is specified.')

                    case 9:
                      valueType = _typeof(value)
                      defaultType = _typeof(defaultValue)

                      if (!(valueType !== defaultType)) {
                        _context4.next = 19
                        break
                      }

                      if (!(valueType === 'number' && defaultType === 'string')) {
                        _context4.next = 16
                        break
                      }

                      value = value.toString()
                      _context4.next = 17
                      break

                    case 16:
                      throw new Error('Set preference: "'.concat(value, '" is a ').concat(valueType, ', expected a ').concat(defaultType, '.'))

                    case 17:
                      _context4.next = 21
                      break

                    case 19:
                      if (!(valueType === 'number' && !Number.isInteger(value))) {
                        _context4.next = 21
                        break
                      }

                      throw new Error('Set preference: "'.concat(value, '" must be an integer.'))

                    case 21:
                      this.prefs[name] = value
                      return _context4.abrupt('return', this._writeToStorage(this.prefs))

                    case 23:
                    case 'end':
                      return _context4.stop()
                  }
                }
              }, _callee4, this)
            }))

            function set(_x3, _x4) {
              return _set.apply(this, arguments)
            }

            return set
          }()),
        }, {
          key: 'get',
          value: (function () {
            const _get = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee5(name) {
              let defaultValue, prefValue
              return _regenerator.default.wrap(function _callee5$(_context5) {
                while (1) {
                  switch (_context5.prev = _context5.next) {
                    case 0:
                      _context5.next = 2
                      return this._initializedPromise

                    case 2:
                      defaultValue = this.defaults[name], prefValue = this.prefs[name]

                      if (!(defaultValue === undefined)) {
                        _context5.next = 5
                        break
                      }

                      throw new Error('Get preference: "'.concat(name, '" is undefined.'))

                    case 5:
                      return _context5.abrupt('return', prefValue !== undefined ? prefValue : defaultValue)

                    case 6:
                    case 'end':
                      return _context5.stop()
                  }
                }
              }, _callee5, this)
            }))

            function get(_x5) {
              return _get.apply(this, arguments)
            }

            return get
          }()),
        }, {
          key: 'getAll',
          value: (function () {
            const _getAll = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee6() {
              let obj, name, prefValue
              return _regenerator.default.wrap(function _callee6$(_context6) {
                while (1) {
                  switch (_context6.prev = _context6.next) {
                    case 0:
                      _context6.next = 2
                      return this._initializedPromise

                    case 2:
                      obj = Object.create(null)

                      for (name in this.defaults) {
                        prefValue = this.prefs[name]
                        obj[name] = prefValue !== undefined ? prefValue : this.defaults[name]
                      }

                      return _context6.abrupt('return', obj)

                    case 5:
                    case 'end':
                      return _context6.stop()
                  }
                }
              }, _callee6, this)
            }))

            function getAll() {
              return _getAll.apply(this, arguments)
            }

            return getAll
          }()),
        }])

        return BasePreferences
      }())

      exports.BasePreferences = BasePreferences

      /***/
    },
    /* 43 */
    /***/ (__unused_webpack_module, exports, __webpack_require__) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.DownloadManager = void 0

      const _pdfjsLib = __webpack_require__(7)

      const _app_options = __webpack_require__(1)

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      ;

      function _download(blobUrl, filename) {
        const a = document.createElement('a')

        if (!a.click) {
          throw new Error('DownloadManager: "a.click()" is not supported.')
        }

        a.href = blobUrl
        a.target = '_parent'

        if ('download' in a) {
          a.download = filename
        }

        (document.body || document.documentElement).appendChild(a)
        a.click()
        a.remove()
      }

      const DownloadManager = /* #__PURE__ */(function () {
        function DownloadManager() {
          _classCallCheck(this, DownloadManager)

          this._openBlobUrls = new WeakMap()
        }

        _createClass(DownloadManager, [{
          key: 'downloadUrl',
          value: function downloadUrl(url, filename) {
            if (!(0, _pdfjsLib.createValidAbsoluteUrl)(url, 'http://example.com')) {
              console.error('downloadUrl - not a valid URL: '.concat(url))
              return
            }

            _download(`${url}#pdfjs.action=download`, filename)
          },
        }, {
          key: 'downloadData',
          value: function downloadData(data, filename, contentType) {
            const blobUrl = (0, _pdfjsLib.createObjectURL)(data, contentType, _app_options.compatibilityParams.disableCreateObjectURL)

            _download(blobUrl, filename)
          },
        }, {
          key: 'openOrDownloadData',
          value: function openOrDownloadData(element, data, filename) {
            const isPdfData = (0, _pdfjsLib.isPdfFile)(filename)
            const contentType = isPdfData ? 'application/pdf' : ''

            if (isPdfData && !_app_options.compatibilityParams.disableCreateObjectURL) {
              let blobUrl = this._openBlobUrls.get(element)

              if (!blobUrl) {
                blobUrl = URL.createObjectURL(new Blob([data], {
                  type: contentType,
                }))

                this._openBlobUrls.set(element, blobUrl)
              }

              let viewerUrl
              viewerUrl = `?file=${encodeURIComponent(`${blobUrl}#${filename}`)}`

              try {
                window.open(viewerUrl)
                return true
              }
              catch (ex) {
                console.error('openOrDownloadData: '.concat(ex))
                URL.revokeObjectURL(blobUrl)

                this._openBlobUrls.delete(element)
              }
            }

            this.downloadData(data, filename, contentType)
            return false
          },
        }, {
          key: 'download',
          value: function download(blob, url, filename) {
            const sourceEventType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'download'

            if (_app_options.compatibilityParams.disableCreateObjectURL) {
              this.downloadUrl(url, filename)
              return
            }

            const blobUrl = URL.createObjectURL(blob)

            _download(blobUrl, filename)
          },
        }])

        return DownloadManager
      }())

      exports.DownloadManager = DownloadManager

      /***/
    },
    /* 44 */
    /***/ (__unused_webpack_module, exports, __webpack_require__) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.GenericL10n = void 0

      const _regenerator = _interopRequireDefault(__webpack_require__(3))

      __webpack_require__(45)

      const _l10n_utils = __webpack_require__(32)

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj } }

      function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
        try { var info = gen[key](arg); var value = info.value }
        catch (error) { reject(error); return } if (info.done) { resolve(value) }
        else { Promise.resolve(value).then(_next, _throw) }
      }

      function _asyncToGenerator(fn) { return function () { const self = this; const args = arguments; return new Promise((resolve, reject) => { const gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value) } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err) } _next(undefined) }) } }

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      const webL10n = document.webL10n

      const GenericL10n = /* #__PURE__ */(function () {
        function GenericL10n(lang) {
          _classCallCheck(this, GenericL10n)

          this._lang = lang
          this._ready = new Promise((resolve, reject) => {
            webL10n.setLanguage((0, _l10n_utils.fixupLangCode)(lang), () => {
              resolve(webL10n)
            })
          })
        }

        _createClass(GenericL10n, [{
          key: 'getLanguage',
          value: (function () {
            const _getLanguage = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee() {
              let l10n
              return _regenerator.default.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2
                      return this._ready

                    case 2:
                      l10n = _context.sent
                      return _context.abrupt('return', l10n.getLanguage())

                    case 4:
                    case 'end':
                      return _context.stop()
                  }
                }
              }, _callee, this)
            }))

            function getLanguage() {
              return _getLanguage.apply(this, arguments)
            }

            return getLanguage
          }()),
        }, {
          key: 'getDirection',
          value: (function () {
            const _getDirection = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee2() {
              let l10n
              return _regenerator.default.wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      _context2.next = 2
                      return this._ready

                    case 2:
                      l10n = _context2.sent
                      return _context2.abrupt('return', l10n.getDirection())

                    case 4:
                    case 'end':
                      return _context2.stop()
                  }
                }
              }, _callee2, this)
            }))

            function getDirection() {
              return _getDirection.apply(this, arguments)
            }

            return getDirection
          }()),
        }, {
          key: 'get',
          value: (function () {
            const _get = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee3(key) {
              let args
              let fallback
              let l10n
              const _args3 = arguments
              return _regenerator.default.wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      args = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : null
                      fallback = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : (0, _l10n_utils.getL10nFallback)(key, args)
                      _context3.next = 4
                      return this._ready

                    case 4:
                      l10n = _context3.sent
                      return _context3.abrupt('return', l10n.get(key, args, fallback))

                    case 6:
                    case 'end':
                      return _context3.stop()
                  }
                }
              }, _callee3, this)
            }))

            function get(_x) {
              return _get.apply(this, arguments)
            }

            return get
          }()),
        }, {
          key: 'translate',
          value: (function () {
            const _translate = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee4(element) {
              let l10n
              return _regenerator.default.wrap(function _callee4$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      _context4.next = 2
                      return this._ready

                    case 2:
                      l10n = _context4.sent
                      return _context4.abrupt('return', l10n.translate(element))

                    case 4:
                    case 'end':
                      return _context4.stop()
                  }
                }
              }, _callee4, this)
            }))

            function translate(_x2) {
              return _translate.apply(this, arguments)
            }

            return translate
          }()),
        }])

        return GenericL10n
      }())

      exports.GenericL10n = GenericL10n

      /***/
    },
    /* 45 */
    /***/ () => {
      document.webL10n = (function (window, document, undefined) {
        let gL10nData = {}
        let gTextData = ''
        const gTextProp = 'textContent'
        let gLanguage = ''
        const gMacros = {}
        let gReadyState = 'loading'
        const gAsyncResourceLoading = true

        function getL10nResourceLinks() {
          return document.querySelectorAll('link[type="application/l10n"]')
        }

        function getL10nDictionary() {
          const script = document.querySelector('script[type="application/l10n"]')
          return script ? JSON.parse(script.innerHTML) : null
        }

        function getTranslatableChildren(element) {
          return element ? element.querySelectorAll('*[data-l10n-id]') : []
        }

        function getL10nAttributes(element) {
          if (!element)
            return {}
          const l10nId = element.getAttribute('data-l10n-id')
          const l10nArgs = element.getAttribute('data-l10n-args')
          let args = {}

          if (l10nArgs) {
            try {
              args = JSON.parse(l10nArgs)
            }
            catch (e) {
              console.warn(`could not parse arguments for #${l10nId}`)
            }
          }

          return {
            id: l10nId,
            args,
          }
        }

        function xhrLoadText(url, onSuccess, onFailure) {
          onSuccess = onSuccess || function _onSuccess(data) { }

          onFailure = onFailure || function _onFailure() { }

          const xhr = new XMLHttpRequest()
          xhr.open('GET', url, gAsyncResourceLoading)

          if (xhr.overrideMimeType) {
            xhr.overrideMimeType('text/plain; charset=utf-8')
          }

          xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
              if (xhr.status == 200 || xhr.status === 0) {
                onSuccess(xhr.responseText)
              }
              else {
                onFailure()
              }
            }
          }

          xhr.onerror = onFailure
          xhr.ontimeout = onFailure

          try {
            xhr.send(null)
          }
          catch (e) {
            onFailure()
          }
        }

        function parseResource(href, lang, successCallback, failureCallback) {
          const baseURL = href.replace(/[^/]*$/, '') || './'

          function evalString(text) {
            if (!text.includes('\\'))
              return text
            return text.replace(/\\\\/g, '\\').replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, '\t').replace(/\\b/g, '\b').replace(/\\f/g, '\f').replace(/\\{/g, '{').replace(/\\}/g, '}').replace(/\\"/g, '"').replace(/\\'/g, '\'')
          }

          function parseProperties(text, parsedPropertiesCallback) {
            const dictionary = {}
            const reBlank = /^\s*|\s*$/
            const reComment = /^\s*#|^\s*$/
            const reSection = /^\s*\[(.*)\]\s*$/
            const reImport = /^\s*@import\s+url\((.*)\)\s*$/i
            const reSplit = /^([^=\s]*)\s*=\s*(.+)$/

            function parseRawLines(rawText, extendedSyntax, parsedRawLinesCallback) {
              const entries = rawText.replace(reBlank, '').split(/[\r\n]+/)
              let currentLang = '*'
              const genericLang = lang.split('-', 1)[0]
              let skipLang = false
              let match = ''

              function nextEntry() {
                while (true) {
                  if (!entries.length) {
                    parsedRawLinesCallback()
                    return
                  }

                  const line = entries.shift()
                  if (reComment.test(line))
                    continue

                  if (extendedSyntax) {
                    match = reSection.exec(line)

                    if (match) {
                      currentLang = match[1].toLowerCase()
                      skipLang = currentLang !== '*' && currentLang !== lang && currentLang !== genericLang
                      continue
                    }
                    else if (skipLang) {
                      continue
                    }

                    match = reImport.exec(line)

                    if (match) {
                      loadImport(baseURL + match[1], nextEntry)
                      return
                    }
                  }

                  const tmp = line.match(reSplit)

                  if (tmp && tmp.length == 3) {
                    dictionary[tmp[1]] = evalString(tmp[2])
                  }
                }
              }

              nextEntry()
            }

            function loadImport(url, callback) {
              xhrLoadText(url, (content) => {
                parseRawLines(content, false, callback)
              }, () => {
                console.warn(`${url} not found.`)
                callback()
              })
            }

            parseRawLines(text, true, () => {
              parsedPropertiesCallback(dictionary)
            })
          }

          xhrLoadText(href, (response) => {
            gTextData += response
            parseProperties(response, (data) => {
              for (const key in data) {
                var id
                var prop
                const index = key.lastIndexOf('.')

                if (index > 0) {
                  id = key.substring(0, index)
                  prop = key.substring(index + 1)
                }
                else {
                  id = key
                  prop = gTextProp
                }

                if (!gL10nData[id]) {
                  gL10nData[id] = {}
                }

                gL10nData[id][prop] = data[key]
              }

              if (successCallback) {
                successCallback()
              }
            })
          }, failureCallback)
        }

        function loadLocale(lang, callback) {
          if (lang) {
            lang = lang.toLowerCase()
          }

          callback = callback || function _callback() { }

          clear()
          gLanguage = lang
          const langLinks = getL10nResourceLinks()
          const langCount = langLinks.length

          if (langCount === 0) {
            const dict = getL10nDictionary()

            if (dict && dict.locales && dict.default_locale) {
              console.log('using the embedded JSON directory, early way out')
              gL10nData = dict.locales[lang]

              if (!gL10nData) {
                const defaultLocale = dict.default_locale.toLowerCase()

                for (let anyCaseLang in dict.locales) {
                  anyCaseLang = anyCaseLang.toLowerCase()

                  if (anyCaseLang === lang) {
                    gL10nData = dict.locales[lang]
                    break
                  }
                  else if (anyCaseLang === defaultLocale) {
                    gL10nData = dict.locales[defaultLocale]
                  }
                }
              }

              callback()
            }
            else {
              console.log('no resource to load, early way out')
            }

            gReadyState = 'complete'
            return
          }

          let onResourceLoaded = null
          let gResourceCount = 0

          onResourceLoaded = function onResourceLoaded() {
            gResourceCount++

            if (gResourceCount >= langCount) {
              callback()
              gReadyState = 'complete'
            }
          }

          function L10nResourceLink(link) {
            const href = link.href

            this.load = function (lang, callback) {
              parseResource(href, lang, callback, () => {
                console.warn(`${href} not found.`)
                console.warn(`"${lang}" resource not found`)
                gLanguage = ''
                callback()
              })
            }
          }

          for (let i = 0; i < langCount; i++) {
            const resource = new L10nResourceLink(langLinks[i])
            resource.load(lang, onResourceLoaded)
          }
        }

        function clear() {
          gL10nData = {}
          gTextData = ''
          gLanguage = ''
        }

        function getPluralRules(lang) {
          const locales2rules = {
            af: 3,
            ak: 4,
            am: 4,
            ar: 1,
            asa: 3,
            az: 0,
            be: 11,
            bem: 3,
            bez: 3,
            bg: 3,
            bh: 4,
            bm: 0,
            bn: 3,
            bo: 0,
            br: 20,
            brx: 3,
            bs: 11,
            ca: 3,
            cgg: 3,
            chr: 3,
            cs: 12,
            cy: 17,
            da: 3,
            de: 3,
            dv: 3,
            dz: 0,
            ee: 3,
            el: 3,
            en: 3,
            eo: 3,
            es: 3,
            et: 3,
            eu: 3,
            fa: 0,
            ff: 5,
            fi: 3,
            fil: 4,
            fo: 3,
            fr: 5,
            fur: 3,
            fy: 3,
            ga: 8,
            gd: 24,
            gl: 3,
            gsw: 3,
            gu: 3,
            guw: 4,
            gv: 23,
            ha: 3,
            haw: 3,
            he: 2,
            hi: 4,
            hr: 11,
            hu: 0,
            id: 0,
            ig: 0,
            ii: 0,
            is: 3,
            it: 3,
            iu: 7,
            ja: 0,
            jmc: 3,
            jv: 0,
            ka: 0,
            kab: 5,
            kaj: 3,
            kcg: 3,
            kde: 0,
            kea: 0,
            kk: 3,
            kl: 3,
            km: 0,
            kn: 0,
            ko: 0,
            ksb: 3,
            ksh: 21,
            ku: 3,
            kw: 7,
            lag: 18,
            lb: 3,
            lg: 3,
            ln: 4,
            lo: 0,
            lt: 10,
            lv: 6,
            mas: 3,
            mg: 4,
            mk: 16,
            ml: 3,
            mn: 3,
            mo: 9,
            mr: 3,
            ms: 0,
            mt: 15,
            my: 0,
            nah: 3,
            naq: 7,
            nb: 3,
            nd: 3,
            ne: 3,
            nl: 3,
            nn: 3,
            no: 3,
            nr: 3,
            nso: 4,
            ny: 3,
            nyn: 3,
            om: 3,
            or: 3,
            pa: 3,
            pap: 3,
            pl: 13,
            ps: 3,
            pt: 3,
            rm: 3,
            ro: 9,
            rof: 3,
            ru: 11,
            rwk: 3,
            sah: 0,
            saq: 3,
            se: 7,
            seh: 3,
            ses: 0,
            sg: 0,
            sh: 11,
            shi: 19,
            sk: 12,
            sl: 14,
            sma: 7,
            smi: 7,
            smj: 7,
            smn: 7,
            sms: 7,
            sn: 3,
            so: 3,
            sq: 3,
            sr: 11,
            ss: 3,
            ssy: 3,
            st: 3,
            sv: 3,
            sw: 3,
            syr: 3,
            ta: 3,
            te: 3,
            teo: 3,
            th: 0,
            ti: 4,
            tig: 3,
            tk: 3,
            tl: 4,
            tn: 3,
            to: 0,
            tr: 0,
            ts: 3,
            tzm: 22,
            uk: 11,
            ur: 3,
            ve: 3,
            vi: 0,
            vun: 3,
            wa: 4,
            wae: 3,
            wo: 0,
            xh: 3,
            xog: 3,
            yo: 0,
            zh: 0,
            zu: 3,
          }

          function isIn(n, list) {
            return list.includes(n)
          }

          function isBetween(n, start, end) {
            return start <= n && n <= end
          }

          const pluralRules = {
            0: function _(n) {
              return 'other'
            },
            1: function _(n) {
              if (isBetween(n % 100, 3, 10))
                return 'few'
              if (n === 0)
                return 'zero'
              if (isBetween(n % 100, 11, 99))
                return 'many'
              if (n == 2)
                return 'two'
              if (n == 1)
                return 'one'
              return 'other'
            },
            2: function _(n) {
              if (n !== 0 && n % 10 === 0)
                return 'many'
              if (n == 2)
                return 'two'
              if (n == 1)
                return 'one'
              return 'other'
            },
            3: function _(n) {
              if (n == 1)
                return 'one'
              return 'other'
            },
            4: function _(n) {
              if (isBetween(n, 0, 1))
                return 'one'
              return 'other'
            },
            5: function _(n) {
              if (isBetween(n, 0, 2) && n != 2)
                return 'one'
              return 'other'
            },
            6: function _(n) {
              if (n === 0)
                return 'zero'
              if (n % 10 == 1 && n % 100 != 11)
                return 'one'
              return 'other'
            },
            7: function _(n) {
              if (n == 2)
                return 'two'
              if (n == 1)
                return 'one'
              return 'other'
            },
            8: function _(n) {
              if (isBetween(n, 3, 6))
                return 'few'
              if (isBetween(n, 7, 10))
                return 'many'
              if (n == 2)
                return 'two'
              if (n == 1)
                return 'one'
              return 'other'
            },
            9: function _(n) {
              if (n === 0 || n != 1 && isBetween(n % 100, 1, 19))
                return 'few'
              if (n == 1)
                return 'one'
              return 'other'
            },
            10: function _(n) {
              if (isBetween(n % 10, 2, 9) && !isBetween(n % 100, 11, 19))
                return 'few'
              if (n % 10 == 1 && !isBetween(n % 100, 11, 19))
                return 'one'
              return 'other'
            },
            11: function _(n) {
              if (isBetween(n % 10, 2, 4) && !isBetween(n % 100, 12, 14))
                return 'few'
              if (n % 10 === 0 || isBetween(n % 10, 5, 9) || isBetween(n % 100, 11, 14))
                return 'many'
              if (n % 10 == 1 && n % 100 != 11)
                return 'one'
              return 'other'
            },
            12: function _(n) {
              if (isBetween(n, 2, 4))
                return 'few'
              if (n == 1)
                return 'one'
              return 'other'
            },
            13: function _(n) {
              if (isBetween(n % 10, 2, 4) && !isBetween(n % 100, 12, 14))
                return 'few'
              if (n != 1 && isBetween(n % 10, 0, 1) || isBetween(n % 10, 5, 9) || isBetween(n % 100, 12, 14))
                return 'many'
              if (n == 1)
                return 'one'
              return 'other'
            },
            14: function _(n) {
              if (isBetween(n % 100, 3, 4))
                return 'few'
              if (n % 100 == 2)
                return 'two'
              if (n % 100 == 1)
                return 'one'
              return 'other'
            },
            15: function _(n) {
              if (n === 0 || isBetween(n % 100, 2, 10))
                return 'few'
              if (isBetween(n % 100, 11, 19))
                return 'many'
              if (n == 1)
                return 'one'
              return 'other'
            },
            16: function _(n) {
              if (n % 10 == 1 && n != 11)
                return 'one'
              return 'other'
            },
            17: function _(n) {
              if (n == 3)
                return 'few'
              if (n === 0)
                return 'zero'
              if (n == 6)
                return 'many'
              if (n == 2)
                return 'two'
              if (n == 1)
                return 'one'
              return 'other'
            },
            18: function _(n) {
              if (n === 0)
                return 'zero'
              if (isBetween(n, 0, 2) && n !== 0 && n != 2)
                return 'one'
              return 'other'
            },
            19: function _(n) {
              if (isBetween(n, 2, 10))
                return 'few'
              if (isBetween(n, 0, 1))
                return 'one'
              return 'other'
            },
            20: function _(n) {
              if ((isBetween(n % 10, 3, 4) || n % 10 == 9) && !(isBetween(n % 100, 10, 19) || isBetween(n % 100, 70, 79) || isBetween(n % 100, 90, 99)))
                return 'few'
              if (n % 1000000 === 0 && n !== 0)
                return 'many'
              if (n % 10 == 2 && !isIn(n % 100, [12, 72, 92]))
                return 'two'
              if (n % 10 == 1 && !isIn(n % 100, [11, 71, 91]))
                return 'one'
              return 'other'
            },
            21: function _(n) {
              if (n === 0)
                return 'zero'
              if (n == 1)
                return 'one'
              return 'other'
            },
            22: function _(n) {
              if (isBetween(n, 0, 1) || isBetween(n, 11, 99))
                return 'one'
              return 'other'
            },
            23: function _(n) {
              if (isBetween(n % 10, 1, 2) || n % 20 === 0)
                return 'one'
              return 'other'
            },
            24: function _(n) {
              if (isBetween(n, 3, 10) || isBetween(n, 13, 19))
                return 'few'
              if (isIn(n, [2, 12]))
                return 'two'
              if (isIn(n, [1, 11]))
                return 'one'
              return 'other'
            },
          }
          const index = locales2rules[lang.replace(/-.*$/, '')]

          if (!(index in pluralRules)) {
            console.warn(`plural form unknown for [${lang}]`)
            return function () {
              return 'other'
            }
          }

          return pluralRules[index]
        }

        gMacros.plural = function (str, param, key, prop) {
          const n = Number.parseFloat(param)
          if (isNaN(n))
            return str
          if (prop != gTextProp)
            return str

          if (!gMacros._pluralRules) {
            gMacros._pluralRules = getPluralRules(gLanguage)
          }

          const index = `[${gMacros._pluralRules(n)}]`

          if (n === 0 && `${key}[zero]` in gL10nData) {
            str = gL10nData[`${key}[zero]`][prop]
          }
          else if (n == 1 && `${key}[one]` in gL10nData) {
            str = gL10nData[`${key}[one]`][prop]
          }
          else if (n == 2 && `${key}[two]` in gL10nData) {
            str = gL10nData[`${key}[two]`][prop]
          }
          else if (key + index in gL10nData) {
            str = gL10nData[key + index][prop]
          }
          else if (`${key}[other]` in gL10nData) {
            str = gL10nData[`${key}[other]`][prop]
          }

          return str
        }

        function getL10nData(key, args, fallback) {
          let data = gL10nData[key]

          if (!data) {
            console.warn(`#${key} is undefined.`)

            if (!fallback) {
              return null
            }

            data = fallback
          }

          const rv = {}

          for (const prop in data) {
            let str = data[prop]
            str = substIndexes(str, args, key, prop)
            str = substArguments(str, args, key)
            rv[prop] = str
          }

          return rv
        }

        function substIndexes(str, args, key, prop) {
          const reIndex = /\{\[\s*([a-z]+)\(([a-z]+)\)\s*\]\}/i
          const reMatch = reIndex.exec(str)
          if (!reMatch || !reMatch.length)
            return str
          const macroName = reMatch[1]
          const paramName = reMatch[2]
          let param

          if (args && paramName in args) {
            param = args[paramName]
          }
          else if (paramName in gL10nData) {
            param = gL10nData[paramName]
          }

          if (macroName in gMacros) {
            const macro = gMacros[macroName]
            str = macro(str, param, key, prop)
          }

          return str
        }

        function substArguments(str, args, key) {
          const reArgs = /\{\{\s*(.+?)\s*\}\}/g
          return str.replace(reArgs, (matched_text, arg) => {
            if (args && arg in args) {
              return args[arg]
            }

            if (arg in gL10nData) {
              return gL10nData[arg]
            }

            console.log(`argument {{${arg}}} for #${key} is undefined.`)
            return matched_text
          })
        }

        function translateElement(element) {
          const l10n = getL10nAttributes(element)
          if (!l10n.id)
            return
          const data = getL10nData(l10n.id, l10n.args)

          if (!data) {
            console.warn(`#${l10n.id} is undefined.`)
            return
          }

          if (data[gTextProp]) {
            if (getChildElementCount(element) === 0) {
              element[gTextProp] = data[gTextProp]
            }
            else {
              const children = element.childNodes
              let found = false

              for (let i = 0, l = children.length; i < l; i++) {
                if (children[i].nodeType === 3 && /\S/.test(children[i].nodeValue)) {
                  if (found) {
                    children[i].nodeValue = ''
                  }
                  else {
                    children[i].nodeValue = data[gTextProp]
                    found = true
                  }
                }
              }

              if (!found) {
                const textNode = document.createTextNode(data[gTextProp])
                element.insertBefore(textNode, element.firstChild)
              }
            }

            delete data[gTextProp]
          }

          for (const k in data) {
            element[k] = data[k]
          }
        }

        function getChildElementCount(element) {
          if (element.children) {
            return element.children.length
          }

          if (typeof element.childElementCount !== 'undefined') {
            return element.childElementCount
          }

          let count = 0

          for (let i = 0; i < element.childNodes.length; i++) {
            count += element.nodeType === 1 ? 1 : 0
          }

          return count
        }

        function translateFragment(element) {
          element = element || document.documentElement
          const children = getTranslatableChildren(element)
          const elementCount = children.length

          for (let i = 0; i < elementCount; i++) {
            translateElement(children[i])
          }

          translateElement(element)
        }

        return {
          get: function get(key, args, fallbackString) {
            const index = key.lastIndexOf('.')
            let prop = gTextProp

            if (index > 0) {
              prop = key.substring(index + 1)
              key = key.substring(0, index)
            }

            let fallback

            if (fallbackString) {
              fallback = {}
              fallback[prop] = fallbackString
            }

            const data = getL10nData(key, args, fallback)

            if (data && prop in data) {
              return data[prop]
            }

            return `{{${key}}}`
          },
          getData: function getData() {
            return gL10nData
          },
          getText: function getText() {
            return gTextData
          },
          getLanguage: function getLanguage() {
            return gLanguage
          },
          setLanguage: function setLanguage(lang, callback) {
            loadLocale(lang, () => {
              if (callback)
                callback()
            })
          },
          getDirection: function getDirection() {
            const rtlList = ['ar', 'he', 'fa', 'ps', 'ur']
            const shortCode = gLanguage.split('-', 1)[0]
            return rtlList.includes(shortCode) ? 'rtl' : 'ltr'
          },
          translate: translateFragment,
          getReadyState: function getReadyState() {
            return gReadyState
          },
          ready: function ready(callback) {
            if (!callback) {

            }
            else if (gReadyState == 'complete' || gReadyState == 'interactive') {
              window.setTimeout(() => {
                callback()
              })
            }
            else if (document.addEventListener) {
              document.addEventListener('localized', function once() {
                document.removeEventListener('localized', once)
                callback()
              })
            }
          },
        }
      }(window, document))

      /***/
    },
    /* 46 */
    /***/ (__unused_webpack_module, exports, __webpack_require__) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.GenericScripting = void 0
      exports.docPropertiesLookup = docPropertiesLookup

      const _regenerator = _interopRequireDefault(__webpack_require__(3))

      const _pdfjsLib = __webpack_require__(7)

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj } }

      function ownKeys(object, enumerableOnly) { const keys = Object.keys(object); if (Object.getOwnPropertySymbols) { let symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter((sym) => { return Object.getOwnPropertyDescriptor(object, sym).enumerable }) } keys.push.apply(keys, symbols) } return keys }

      function _objectSpread(target) {
        for (let i = 1; i < arguments.length; i++) {
          var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach((key) => { _defineProperty(target, key, source[key]) }) }
          else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) }
          else { ownKeys(Object(source)).forEach((key) => { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)) }) }
        } return target
      }

      function _defineProperty(obj, key, value) {
        if (key in obj) { Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true }) }
        else { obj[key] = value } return obj
      }

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

      function _defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
          const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor)
            descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps); if (staticProps)
          _defineProperties(Constructor, staticProps); return Constructor
      }

      function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
        try { var info = gen[key](arg); var value = info.value }
        catch (error) { reject(error); return } if (info.done) { resolve(value) }
        else { Promise.resolve(value).then(_next, _throw) }
      }

      function _asyncToGenerator(fn) { return function () { const self = this; const args = arguments; return new Promise((resolve, reject) => { const gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value) } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err) } _next(undefined) }) } }

      function docPropertiesLookup(_x) {
        return _docPropertiesLookup.apply(this, arguments)
      }

      function _docPropertiesLookup() {
        _docPropertiesLookup = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee4(pdfDocument) {
          let url, baseUrl, _yield$pdfDocument$ge, info, metadata, contentDispositionFilename, contentLength, _yield$pdfDocument$ge2, length

          return _regenerator.default.wrap((_context4) => {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  url = '', baseUrl = url.split('#')[0]
                  _context4.next = 3
                  return pdfDocument.getMetadata()

                case 3:
                  _yield$pdfDocument$ge = _context4.sent
                  info = _yield$pdfDocument$ge.info
                  metadata = _yield$pdfDocument$ge.metadata
                  contentDispositionFilename = _yield$pdfDocument$ge.contentDispositionFilename
                  contentLength = _yield$pdfDocument$ge.contentLength

                  if (contentLength) {
                    _context4.next = 14
                    break
                  }

                  _context4.next = 11
                  return pdfDocument.getDownloadInfo()

                case 11:
                  _yield$pdfDocument$ge2 = _context4.sent
                  length = _yield$pdfDocument$ge2.length
                  contentLength = length

                case 14:
                  return _context4.abrupt('return', _objectSpread(_objectSpread({}, info), {}, {
                    baseURL: baseUrl,
                    filesize: contentLength,
                    filename: contentDispositionFilename || (0, _pdfjsLib.getPdfFilenameFromUrl)(url),
                    metadata: metadata === null || metadata === void 0 ? void 0 : metadata.getRaw(),
                    authors: metadata === null || metadata === void 0 ? void 0 : metadata.get('dc:creator'),
                    numPages: pdfDocument.numPages,
                    URL: url,
                  }))

                case 15:
                case 'end':
                  return _context4.stop()
              }
            }
          }, _callee4)
        }))
        return _docPropertiesLookup.apply(this, arguments)
      }

      const GenericScripting = /* #__PURE__ */(function () {
        function GenericScripting(sandboxBundleSrc) {
          _classCallCheck(this, GenericScripting)

          this._ready = (0, _pdfjsLib.loadScript)(sandboxBundleSrc, true).then(() => {
            return window.pdfjsSandbox.QuickJSSandbox()
          })
        }

        _createClass(GenericScripting, [{
          key: 'createSandbox',
          value: (function () {
            const _createSandbox = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee(data) {
              let sandbox
              return _regenerator.default.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2
                      return this._ready

                    case 2:
                      sandbox = _context.sent
                      sandbox.create(data)

                    case 4:
                    case 'end':
                      return _context.stop()
                  }
                }
              }, _callee, this)
            }))

            function createSandbox(_x2) {
              return _createSandbox.apply(this, arguments)
            }

            return createSandbox
          }()),
        }, {
          key: 'dispatchEventInSandbox',
          value: (function () {
            const _dispatchEventInSandbox = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee2(event) {
              let sandbox
              return _regenerator.default.wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      _context2.next = 2
                      return this._ready

                    case 2:
                      sandbox = _context2.sent
                      sandbox.dispatchEvent(event)

                    case 4:
                    case 'end':
                      return _context2.stop()
                  }
                }
              }, _callee2, this)
            }))

            function dispatchEventInSandbox(_x3) {
              return _dispatchEventInSandbox.apply(this, arguments)
            }

            return dispatchEventInSandbox
          }()),
        }, {
          key: 'destroySandbox',
          value: (function () {
            const _destroySandbox = _asyncToGenerator(/* #__PURE__ */_regenerator.default.mark(function _callee3() {
              let sandbox
              return _regenerator.default.wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      _context3.next = 2
                      return this._ready

                    case 2:
                      sandbox = _context3.sent
                      sandbox.nukeSandbox()

                    case 4:
                    case 'end':
                      return _context3.stop()
                  }
                }
              }, _callee3, this)
            }))

            function destroySandbox() {
              return _destroySandbox.apply(this, arguments)
            }

            return destroySandbox
          }()),
        }])

        return GenericScripting
      }())

      exports.GenericScripting = GenericScripting

      /***/
    },
    /* 47 */
    /***/ (__unused_webpack_module, exports, __webpack_require__) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.PDFPrintService = PDFPrintService

      const _pdfjsLib = __webpack_require__(7)

      const _app = __webpack_require__(2)

      const _app_options = __webpack_require__(1)

      const _print_utils = __webpack_require__(48)

      let activeService = null
      let overlayManager = null

      function renderPage(activeServiceOnEntry, pdfDocument, pageNumber, size, printResolution, optionalContentConfigPromise) {
        const scratchCanvas = activeService.scratchCanvas
        const PRINT_UNITS = printResolution / _pdfjsLib.PixelsPerInch.PDF
        scratchCanvas.width = Math.floor(size.width * PRINT_UNITS)
        scratchCanvas.height = Math.floor(size.height * PRINT_UNITS)
        const ctx = scratchCanvas.getContext('2d')
        ctx.save()
        ctx.fillStyle = 'rgb(255, 255, 255)'
        ctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height)
        ctx.restore()
        return pdfDocument.getPage(pageNumber).then((pdfPage) => {
          const renderContext = {
            canvasContext: ctx,
            transform: [PRINT_UNITS, 0, 0, PRINT_UNITS, 0, 0],
            viewport: pdfPage.getViewport({
              scale: 1,
              rotation: size.rotation,
            }),
            intent: 'print',
            annotationMode: _pdfjsLib.AnnotationMode.ENABLE_STORAGE,
            optionalContentConfigPromise,
          }
          return pdfPage.render(renderContext).promise
        })
      }

      function PDFPrintService(pdfDocument, pagesOverview, printContainer, printResolution) {
        const optionalContentConfigPromise = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null
        const l10n = arguments.length > 5 ? arguments[5] : undefined
        this.pdfDocument = pdfDocument
        this.pagesOverview = pagesOverview
        this.printContainer = printContainer
        this._printResolution = printResolution || 150
        this._optionalContentConfigPromise = optionalContentConfigPromise || pdfDocument.getOptionalContentConfig()
        this.l10n = l10n
        this.currentPage = -1
        this.scratchCanvas = document.createElement('canvas')
      }

      PDFPrintService.prototype = {
        layout: function layout() {
          this.throwIfInactive()
          const body = document.querySelector('body')
          body.setAttribute('data-pdfjsprinting', true)
          const hasEqualPageSizes = this.pagesOverview.every(function (size) {
            return size.width === this.pagesOverview[0].width && size.height === this.pagesOverview[0].height
          }, this)

          if (!hasEqualPageSizes) {
            console.warn('Not all pages have the same size. The printed ' + 'result may be incorrect!')
          }

          this.pageStyleSheet = document.createElement('style')
          const pageSize = this.pagesOverview[0]
          this.pageStyleSheet.textContent = `@page { size: ${pageSize.width}pt ${pageSize.height}pt;}`
          body.appendChild(this.pageStyleSheet)
        },
        destroy: function destroy() {
          if (activeService !== this) {
            return
          }

          this.printContainer.textContent = ''
          const body = document.querySelector('body')
          body.removeAttribute('data-pdfjsprinting')

          if (this.pageStyleSheet) {
            this.pageStyleSheet.remove()
            this.pageStyleSheet = null
          }

          this.scratchCanvas.width = this.scratchCanvas.height = 0
          this.scratchCanvas = null
          activeService = null
          ensureOverlay().then(() => {
            if (overlayManager.active !== 'printServiceOverlay') {
              return
            }

            overlayManager.close('printServiceOverlay')
          })
        },
        renderPages: function renderPages() {
          const _this = this

          if (this.pdfDocument.isPureXfa) {
            (0, _print_utils.getXfaHtmlForPrinting)(this.printContainer, this.pdfDocument)
            return Promise.resolve()
          }

          const pageCount = this.pagesOverview.length

          const renderNextPage = function renderNextPage(resolve, reject) {
            _this.throwIfInactive()

            if (++_this.currentPage >= pageCount) {
              renderProgress(pageCount, pageCount, _this.l10n)
              resolve()
              return
            }

            const index = _this.currentPage
            renderProgress(index, pageCount, _this.l10n)
            renderPage(_this, _this.pdfDocument, index + 1, _this.pagesOverview[index], _this._printResolution, _this._optionalContentConfigPromise).then(_this.useRenderedPage.bind(_this)).then(() => {
              renderNextPage(resolve, reject)
            }, reject)
          }

          return new Promise(renderNextPage)
        },
        useRenderedPage: function useRenderedPage() {
          this.throwIfInactive()
          const img = document.createElement('img')
          const scratchCanvas = this.scratchCanvas

          if ('toBlob' in scratchCanvas && !_app_options.compatibilityParams.disableCreateObjectURL) {
            scratchCanvas.toBlob((blob) => {
              img.src = URL.createObjectURL(blob)
            })
          }
          else {
            img.src = scratchCanvas.toDataURL()
          }

          const wrapper = document.createElement('div')
          wrapper.className = 'printedPage'
          wrapper.appendChild(img)
          this.printContainer.appendChild(wrapper)
          return new Promise((resolve, reject) => {
            img.onload = resolve
            img.onerror = reject
          })
        },
        performPrint: function performPrint() {
          const _this2 = this

          this.throwIfInactive()
          return new Promise((resolve) => {
            setTimeout(() => {
              if (!_this2.active) {
                resolve()
                return
              }

              print.call(window)
              setTimeout(resolve, 20)
            }, 0)
          })
        },

        get active() {
          return this === activeService
        },

        throwIfInactive: function throwIfInactive() {
          if (!this.active) {
            throw new Error('This print request was cancelled or completed.')
          }
        },
      }
      var print = window.print

      window.print = function () {
        if (activeService) {
          console.warn('Ignored window.print() because of a pending print job.')
          return
        }

        ensureOverlay().then(() => {
          if (activeService) {
            overlayManager.open('printServiceOverlay')
          }
        })

        try {
          dispatchEvent('beforeprint')
        }
        finally {
          if (!activeService) {
            console.error('Expected print service to be initialized.')
            ensureOverlay().then(() => {
              if (overlayManager.active === 'printServiceOverlay') {
                overlayManager.close('printServiceOverlay')
              }
            })
            return
          }

          const activeServiceOnEntry = activeService
          activeService.renderPages().then(() => {
            return activeServiceOnEntry.performPrint()
          }).catch(() => { }).then(() => {
            if (activeServiceOnEntry.active) {
              abort()
            }
          })
        }
      }

      function dispatchEvent(eventType) {
        const event = document.createEvent('CustomEvent')
        event.initCustomEvent(eventType, false, false, 'custom')
        window.dispatchEvent(event)
      }

      function abort() {
        if (activeService) {
          activeService.destroy()
          dispatchEvent('afterprint')
        }
      }

      function renderProgress(index, total, l10n) {
        const progressContainer = document.getElementById('printServiceOverlay')
        const progress = Math.round(100 * index / total)
        const progressBar = progressContainer.querySelector('progress')
        const progressPerc = progressContainer.querySelector('.relative-progress')
        progressBar.value = progress
        l10n.get('print_progress_percent', {
          progress,
        }).then((msg) => {
          progressPerc.textContent = msg
        })
      }

      window.addEventListener('keydown', (event) => {
        if (event.keyCode === 80 && (event.ctrlKey || event.metaKey) && !event.altKey && (!event.shiftKey || window.chrome || window.opera)) {
          window.print()
          event.preventDefault()

          if (event.stopImmediatePropagation) {
            event.stopImmediatePropagation()
          }
          else {
            event.stopPropagation()
          }
        }
      }, true)

      if ('onbeforeprint' in window) {
        const stopPropagationIfNeeded = function stopPropagationIfNeeded(event) {
          if (event.detail !== 'custom' && event.stopImmediatePropagation) {
            event.stopImmediatePropagation()
          }
        }

        window.addEventListener('beforeprint', stopPropagationIfNeeded)
        window.addEventListener('afterprint', stopPropagationIfNeeded)
      }

      let overlayPromise

      function ensureOverlay() {
        if (!overlayPromise) {
          overlayManager = _app.PDFViewerApplication.overlayManager

          if (!overlayManager) {
            throw new Error('The overlay manager has not yet been initialized.')
          }

          overlayPromise = overlayManager.register('printServiceOverlay', document.getElementById('printServiceOverlay'), abort, true)
          document.getElementById('printCancel').onclick = abort
        }

        return overlayPromise
      }

      _app.PDFPrintServiceFactory.instance = {
        supportsPrinting: true,
        createPrintService: function createPrintService(pdfDocument, pagesOverview, printContainer, printResolution, optionalContentConfigPromise, l10n) {
          if (activeService) {
            throw new Error('The print service is created and active.')
          }

          activeService = new PDFPrintService(pdfDocument, pagesOverview, printContainer, printResolution, optionalContentConfigPromise, l10n)
          return activeService
        },
      }

      /***/
    },
    /* 48 */
    /***/ (__unused_webpack_module, exports, __webpack_require__) => {
      Object.defineProperty(exports, '__esModule', ({
        value: true,
      }))
      exports.getXfaHtmlForPrinting = getXfaHtmlForPrinting

      const _pdfjsLib = __webpack_require__(7)

      const _pdf_link_service = __webpack_require__(20)

      const _xfa_layer_builder = __webpack_require__(37)

      function _createForOfIteratorHelper(o, allowArrayLike) {
        let it = typeof Symbol !== 'undefined' && o[Symbol.iterator] || o['@@iterator']; if (!it) {
          if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === 'number') {
            if (it)
              o = it; let i = 0; const F = function F() { }; return {
                s: F,
                n: function n() {
                  if (i >= o.length)
                    return { done: true }; return { done: false, value: o[i++] }
                },
                e: function e(_e) { throw _e },
                f: F,
              }
          } throw new TypeError('Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.')
        } let normalCompletion = true; let didErr = false; let err; return {
          s: function s() { it = it.call(o) },
          n: function n() { const step = it.next(); normalCompletion = step.done; return step },
          e: function e(_e2) { didErr = true; err = _e2 },
          f: function f() {
            try {
              if (!normalCompletion && it.return != null)
                it.return()
            }
            finally {
              if (didErr)
                throw err
            }
          },
        }
      }

      function _unsupportedIterableToArray(o, minLen) {
        if (!o)
          return; if (typeof o === 'string')
          return _arrayLikeToArray(o, minLen); let n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor)
          n = o.constructor.name; if (n === 'Map' || n === 'Set')
          return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
          return _arrayLikeToArray(o, minLen)
      }

      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length)
          len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2
      }

      function getXfaHtmlForPrinting(printContainer, pdfDocument) {
        const xfaHtml = pdfDocument.allXfaHtml
        const linkService = new _pdf_link_service.SimpleLinkService()
        const scale = Math.round(_pdfjsLib.PixelsPerInch.PDF_TO_CSS_UNITS * 100) / 100

        const _iterator = _createForOfIteratorHelper(xfaHtml.children)
        let _step

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            const xfaPage = _step.value
            const page = document.createElement('div')
            page.className = 'xfaPrintedPage'
            printContainer.appendChild(page)
            const builder = new _xfa_layer_builder.XfaLayerBuilder({
              pageDiv: page,
              pdfPage: null,
              annotationStorage: pdfDocument.annotationStorage,
              linkService,
              xfaHtml: xfaPage,
            })
            const viewport = (0, _pdfjsLib.getXfaPageViewport)(xfaPage, {
              scale,
            })
            builder.render(viewport, 'print')
          }
        }
        catch (err) {
          _iterator.e(err)
        }
        finally {
          _iterator.f()
        }
      }

      /***/
    },
    /******/])
  /************************************************************************/
  /******/ // The module cache
  /******/ const __webpack_module_cache__ = {}
  /******/
  /******/ // The require function
  /******/ function __webpack_require__(moduleId) {
    /******/ // Check if module is in cache
    /******/ const cachedModule = __webpack_module_cache__[moduleId]
    /******/ if (cachedModule !== undefined) {
      /******/ return cachedModule.exports
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/ const module = __webpack_module_cache__[moduleId] = {
      /******/ id: moduleId,
      /******/ loaded: false,
      /******/ exports: {},
      /******/
    }
    /******/
    /******/ // Execute the module function
    /******/ __webpack_modules__[moduleId](module, module.exports, __webpack_require__)
    /******/
    /******/ // Flag the module as loaded
    /******/ module.loaded = true
    /******/
    /******/ // Return the exports of the module
    /******/ return module.exports
    /******/
  }
  /******/
  /************************************************************************/
  /******/ /* webpack/runtime/node module decorator */
  /******/ (() => {
    /******/ __webpack_require__.nmd = (module) => {
      /******/ module.paths = []
      /******/ if (!module.children)
        module.children = []
      /******/ return module
      /******/
    }
    /******/
  })()
  /******/
  /************************************************************************/
  const __webpack_exports__ = {};
  // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
  (() => {
    const exports = __webpack_exports__

    Object.defineProperty(exports, '__esModule', ({
      value: true,
    }))
    Object.defineProperty(exports, 'PDFViewerApplication', ({
      enumerable: true,
      get: function get() {
        return _app.PDFViewerApplication
      },
    }))
    Object.defineProperty(exports, 'PDFViewerApplicationOptions', ({
      enumerable: true,
      get: function get() {
        return _app_options.AppOptions
      },
    }))

    var _app_options = __webpack_require__(1)

    var _app = __webpack_require__(2)

    const pdfjsVersion = '2.12.313'
    const pdfjsBuild = 'a2ae56f39'
    window.PDFViewerApplication = _app.PDFViewerApplication
    window.PDFViewerApplicationOptions = _app_options.AppOptions

    {
      __webpack_require__(41)
    }
    ;
    {
      __webpack_require__(47)
    }

    function getViewerConfiguration() {
      let errorWrapper = null
      errorWrapper = {
        container: document.getElementById('errorWrapper'),
        errorMessage: document.getElementById('errorMessage'),
        closeButton: document.getElementById('errorClose'),
        errorMoreInfo: document.getElementById('errorMoreInfo'),
        moreInfoButton: document.getElementById('errorShowMore'),
        lessInfoButton: document.getElementById('errorShowLess'),
      }
      return {
        appContainer: document.body,
        mainContainer: document.getElementById('viewerContainer'),
        viewerContainer: document.getElementById('viewer'),
        eventBus: null,
        toolbar: {
          container: document.getElementById('toolbarViewer'),
          numPages: document.getElementById('numPages'),
          pageNumber: document.getElementById('pageNumber'),
          scaleSelect: document.getElementById('scaleSelect'),
          customScaleOption: document.getElementById('customScaleOption'),
          previous: document.getElementById('previous'),
          next: document.getElementById('next'),
          zoomIn: document.getElementById('zoomIn'),
          zoomOut: document.getElementById('zoomOut'),
          viewFind: document.getElementById('viewFind'),
          openFile: document.getElementById('openFile'),
          print: document.getElementById('print'),
          presentationModeButton: document.getElementById('presentationMode'),
          download: document.getElementById('download'),
          viewBookmark: document.getElementById('viewBookmark'),
        },
        secondaryToolbar: {
          toolbar: document.getElementById('secondaryToolbar'),
          toggleButton: document.getElementById('secondaryToolbarToggle'),
          toolbarButtonContainer: document.getElementById('secondaryToolbarButtonContainer'),
          presentationModeButton: document.getElementById('secondaryPresentationMode'),
          openFileButton: document.getElementById('secondaryOpenFile'),
          printButton: document.getElementById('secondaryPrint'),
          downloadButton: document.getElementById('secondaryDownload'),
          viewBookmarkButton: document.getElementById('secondaryViewBookmark'),
          firstPageButton: document.getElementById('firstPage'),
          lastPageButton: document.getElementById('lastPage'),
          pageRotateCwButton: document.getElementById('pageRotateCw'),
          pageRotateCcwButton: document.getElementById('pageRotateCcw'),
          cursorSelectToolButton: document.getElementById('cursorSelectTool'),
          cursorHandToolButton: document.getElementById('cursorHandTool'),
          scrollPageButton: document.getElementById('scrollPage'),
          scrollVerticalButton: document.getElementById('scrollVertical'),
          scrollHorizontalButton: document.getElementById('scrollHorizontal'),
          scrollWrappedButton: document.getElementById('scrollWrapped'),
          spreadNoneButton: document.getElementById('spreadNone'),
          spreadOddButton: document.getElementById('spreadOdd'),
          spreadEvenButton: document.getElementById('spreadEven'),
          documentPropertiesButton: document.getElementById('documentProperties'),
        },
        sidebar: {
          outerContainer: document.getElementById('outerContainer'),
          viewerContainer: document.getElementById('viewerContainer'),
          toggleButton: document.getElementById('sidebarToggle'),
          thumbnailButton: document.getElementById('viewThumbnail'),
          outlineButton: document.getElementById('viewOutline'),
          attachmentsButton: document.getElementById('viewAttachments'),
          layersButton: document.getElementById('viewLayers'),
          thumbnailView: document.getElementById('thumbnailView'),
          outlineView: document.getElementById('outlineView'),
          attachmentsView: document.getElementById('attachmentsView'),
          layersView: document.getElementById('layersView'),
          outlineOptionsContainer: document.getElementById('outlineOptionsContainer'),
          currentOutlineItemButton: document.getElementById('currentOutlineItem'),
        },
        sidebarResizer: {
          outerContainer: document.getElementById('outerContainer'),
          resizer: document.getElementById('sidebarResizer'),
        },
        findBar: {
          bar: document.getElementById('findbar'),
          toggleButton: document.getElementById('viewFind'),
          findField: document.getElementById('findInput'),
          highlightAllCheckbox: document.getElementById('findHighlightAll'),
          caseSensitiveCheckbox: document.getElementById('findMatchCase'),
          entireWordCheckbox: document.getElementById('findEntireWord'),
          findMsg: document.getElementById('findMsg'),
          findResultsCount: document.getElementById('findResultsCount'),
          findPreviousButton: document.getElementById('findPrevious'),
          findNextButton: document.getElementById('findNext'),
        },
        passwordOverlay: {
          overlayName: 'passwordOverlay',
          container: document.getElementById('passwordOverlay'),
          label: document.getElementById('passwordText'),
          input: document.getElementById('password'),
          submitButton: document.getElementById('passwordSubmit'),
          cancelButton: document.getElementById('passwordCancel'),
        },
        documentProperties: {
          overlayName: 'documentPropertiesOverlay',
          container: document.getElementById('documentPropertiesOverlay'),
          closeButton: document.getElementById('documentPropertiesClose'),
          fields: {
            fileName: document.getElementById('fileNameField'),
            fileSize: document.getElementById('fileSizeField'),
            title: document.getElementById('titleField'),
            author: document.getElementById('authorField'),
            subject: document.getElementById('subjectField'),
            keywords: document.getElementById('keywordsField'),
            creationDate: document.getElementById('creationDateField'),
            modificationDate: document.getElementById('modificationDateField'),
            creator: document.getElementById('creatorField'),
            producer: document.getElementById('producerField'),
            version: document.getElementById('versionField'),
            pageCount: document.getElementById('pageCountField'),
            pageSize: document.getElementById('pageSizeField'),
            linearized: document.getElementById('linearizedField'),
          },
        },
        errorWrapper,
        printContainer: document.getElementById('printContainer'),
        openFileInputName: 'fileInput',
        debuggerScriptPath: './debugger.js',
      }
    }

    function webViewerLoad() {
      const config = getViewerConfiguration()
      const event = document.createEvent('CustomEvent')
      event.initCustomEvent('webviewerloaded', true, true, {
        source: window,
      })

      try {
        parent.document.dispatchEvent(event)
      }
      catch (ex) {
        console.error('webviewerloaded: '.concat(ex))
        document.dispatchEvent(event)
      }

      _app.PDFViewerApplication.run(config)
    }

    if (document.blockUnblockOnload) {
      document.blockUnblockOnload(true)
    }

    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      webViewerLoad()
    }
    else {
      document.addEventListener('DOMContentLoaded', webViewerLoad, true)
    }
  })()

  /******/
})()

// # sourceMappingURL=viewer.js.map
