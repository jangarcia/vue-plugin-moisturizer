"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MoisturizerVuePlugin = require('./moisturizerVuePlugin');

var Validator = require('./validator');

var Fingerprinter = require('./fingerprinter');

var config = require('./config');

var Props = require('./props');

var Slots = require('./slots');

var Hydrator =
/*#__PURE__*/
function () {
  function Hydrator(components) {
    var vueOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Hydrator);

    new Validator(components).validate();
    this.vueOptions = vueOptions;
    this.components = components;
  }

  _createClass(Hydrator, [{
    key: "hydrate",
    value: function hydrate() {
      var _this = this;

      return this.components.map(function (component) {
        return _this.hydrateComponent(component);
      });
    }
  }, {
    key: "hydrateComponent",
    value: function hydrateComponent(component) {
      var _this2 = this;

      var attr = config.attrs.fingerprint;
      var fingerprint = Fingerprinter.print(component);
      var elements = document.querySelectorAll("[".concat(attr, "=\"").concat(fingerprint, "\"]"));

      _toConsumableArray(elements).forEach(function (el) {
        return _this2.mount(component, el);
      });
    }
  }, {
    key: "mount",
    value: function mount(component, el) {
      var props = new Props(this.components).getFromElement(el);
      var slots = new Slots(this.components).getFromElement(el);

      var htmlAttrs = _toConsumableArray(el.attributes).filter(function (a) {
        return !a.name.startsWith('data-hydrate');
      });

      var attrObjects = _toConsumableArray(htmlAttrs).map(function (attr) {
        return _defineProperty({}, attr.name, attr.value);
      });

      var attrMap = Object.assign.apply(Object, [{}].concat(_toConsumableArray(attrObjects)));
      var instance = this.getVueInstance(component, props, slots, attrMap);
      instance.$mount(el);
    }
  }, {
    key: "getVueInstance",
    value: function getVueInstance(component, propsData, slots, attributes) {
      var slotObjects = Object.entries(slots);

      var toFunction = function toFunction(_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
            name = _ref3[0],
            slts = _ref3[1];

        return _defineProperty({}, name, function () {
          return slts;
        });
      };

      var scopedSlots = Object.assign.apply(Object, [{}].concat(_toConsumableArray(slotObjects.map(toFunction))));
      var Constr = MoisturizerVuePlugin.vue.extend({
        render: function render(createElement) {
          if (component.props) {
            var propNames = Object.entries(component.props).map(function (x) {
              return x[0];
            });
            var attrs = Object.entries(attributes).filter(function (x) {
              return !propNames.includes(x[0]);
            }).reduce(function (obj, _ref5) {
              var _ref6 = _slicedToArray(_ref5, 2),
                  key = _ref6[0],
                  val = _ref6[1];

              return _objectSpread({}, obj, _defineProperty({}, key, val));
            }, {});

            var props = _objectSpread({}, propsData, attributes);

            return createElement(component, {
              attrs: attrs,
              props: props,
              scopedSlots: scopedSlots
            });
          } else {
            return createElement(component, {
              attrs: attributes,
              scopedSlots: scopedSlots
            });
          }
        }
      });
      return new Constr(_objectSpread({}, this.vueOptions));
    }
  }]);

  return Hydrator;
}();

module.exports = Hydrator;