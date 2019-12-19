"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Fingerprinter = require('./fingerprinter');

var NodeVisitor = require('./visitor');

var config = require('./config');

var Props =
/*#__PURE__*/
function () {
  function Props(components) {
    _classCallCheck(this, Props);

    this.components = components;
  }

  _createClass(Props, [{
    key: "serialize",
    value: function serialize(props) {
      var convertedProps = this.serializeComponents(props) || {};
      var sanitizedProps = this.sanitizeProps(convertedProps);
      return this.stringifyForAttr(sanitizedProps);
    }
  }, {
    key: "getFromElement",
    value: function getFromElement(el, components) {
      var props = this.readPropsFromEl(el);
      return this.deserializeComponents(props, components);
    }
  }, {
    key: "deserializeComponents",
    value: function deserializeComponents(node) {
      var _this = this;

      var condition = function condition(node) {
        return _this.isSerializedComponent(node);
      };

      var callback = function callback(node) {
        return _this.convertToVueComponent(node);
      };

      return new NodeVisitor(condition, callback).visit(node);
    }
  }, {
    key: "serializeComponents",
    value: function serializeComponents(node) {
      var _this2 = this;

      var condition = function condition(node) {
        return _this2.isVueComponent(node);
      };

      var callback = function callback(node) {
        return _this2.convertToSerializedComponent(node);
      };

      return new NodeVisitor(condition, callback).visit(node);
    }
  }, {
    key: "convertToSerializedComponent",
    value: function convertToSerializedComponent(prop) {
      return {
        __moisturizer: true,
        type: 'component',
        fingerprint: Fingerprinter.print(prop)
      };
    }
  }, {
    key: "convertToVueComponent",
    value: function convertToVueComponent(prop) {
      return this.components.find(function (comp) {
        return Fingerprinter.print(comp) === prop.fingerprint;
      });
    }
  }, {
    key: "isVueComponent",
    value: function isVueComponent(obj) {
      return obj && obj.render !== undefined;
    }
  }, {
    key: "isSerializedComponent",
    value: function isSerializedComponent(obj) {
      return obj && obj.__moisturizer && obj.type === 'component';
    }
  }, {
    key: "stringifyForAttr",
    value: function stringifyForAttr(props) {
      var json = JSON.stringify(props);
      return json.replace(/'/g, "\\'").replace(/"/g, "&escapedquot;");
    }
  }, {
    key: "sanitizeProps",
    value: function sanitizeProps(props) {
      var _this3 = this;

      var result = Array.isArray(props) ? [] : {};
      Object.keys(props).forEach(function (key) {
        if (key === '__typename') {
          return;
        }

        if (props[key] && _typeof(props[key]) === 'object') {
          result[key] = _this3.sanitizeProps(props[key]);
        } else {
          result[key] = props[key];
        }
      });
      return result;
    }
  }, {
    key: "readPropsFromEl",
    value: function readPropsFromEl(el) {
      var attr = el.getAttribute(config.attrs.props);
      var json = attr && attr.replace(/'/g, '"').replace(/&escapedquot;/g, '"') || '"{}"';

      try {
        return JSON.parse(json);
      } catch (err) {
        console.error('Failed to deserialize props from JSON: ', json);
        throw err;
      }
    }
  }]);

  return Props;
}();

module.exports = Props;