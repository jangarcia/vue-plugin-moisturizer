"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var NodeVisitor = require('./visitor');

var Fingerprinter = require('./fingerprinter');

var fingerprint = Fingerprinter.print;

var AttrSerializer =
/*#__PURE__*/
function () {
  function AttrSerializer(components) {
    _classCallCheck(this, AttrSerializer);

    this.components = components;
  }

  _createClass(AttrSerializer, [{
    key: "serialize",
    value: function serialize(json) {
      var convertedJson = this.serializeComponents(json);
      return this.stringify(convertedJson);
    }
  }, {
    key: "deserialize",
    value: function deserialize(str) {
      var json = this.objectify(str);
      return this.deserializeComponents(json);
    }
  }, {
    key: "stringify",
    value: function stringify(json) {
      var str = JSON.stringify(json);
      return str.replace(/'/g, "\\'").replace(/"/g, "'");
    }
  }, {
    key: "objectify",
    value: function objectify(str) {
      var json = str.replace(/'/g, '"').replace(/\\"/g, '"');
      return JSON.parse(json);
    }
  }, {
    key: "serializeComponents",
    value: function serializeComponents(node) {
      var _this = this;

      var condition = function condition(node) {
        return _this.isVueComponent(node);
      };

      var callback = function callback(node) {
        return _this.convertToSerializedComponent(node);
      };

      return new NodeVisitor(condition, callback).visit(node);
    }
  }, {
    key: "deserializeComponents",
    value: function deserializeComponents(node) {
      var _this2 = this;

      var condition = function condition(node) {
        return _this2.isSerializedComponent(node);
      };

      var callback = function callback(node) {
        return _this2.convertToVueComponent(node);
      };

      return new NodeVisitor(condition, callback).visit(node);
    }
  }, {
    key: "convertToSerializedComponent",
    value: function convertToSerializedComponent(prop) {
      return {
        __moisturizer: true,
        type: 'component',
        fingerprint: fingerprint(prop)
      };
    }
  }, {
    key: "convertToVueComponent",
    value: function convertToVueComponent(serializedComponent) {
      return this.components.find(function (component) {
        return fingerprint(component) === serializedComponent.fingerprint;
      });
    }
  }, {
    key: "isVueComponent",
    value: function isVueComponent(obj) {
      return obj.render !== undefined;
    }
  }, {
    key: "isSerializedComponent",
    value: function isSerializedComponent(obj) {
      return obj.__moisturizer && obj.type === 'component';
    }
  }]);

  return AttrSerializer;
}();

module.exports = AttrSerializer;