"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Fingerprinter = require('./fingerprinter');

var config = require('./config');

var Slots =
/*#__PURE__*/
function () {
  function Slots(components) {
    _classCallCheck(this, Slots);

    var Vue = require('./moisturizerVuePlugin').vue;

    this.components = components;
    this.vm = new Vue({});
  }

  _createClass(Slots, [{
    key: "serialize",
    value: function serialize(slots) {
      var _this = this;

      var serialize = function serialize(slot) {
        return _this.serializeSlot(slot);
      };

      var defaultSlot = slots.default && slots.default.map(serialize);
      return this.stringify({
        default: defaultSlot || []
      });
    }
  }, {
    key: "getFromElement",
    value: function getFromElement(el) {
      var _this2 = this;

      var attr = el.getAttribute(config.attrs.slots);
      var defaultSlot = this.objectify(attr).default;
      return {
        default: defaultSlot.map(function (slot) {
          return _this2.deserializeSlot(slot);
        })
      };
    }
  }, {
    key: "serializeSlot",
    value: function serializeSlot() {
      var slot = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      if (slot.text) return this.getText(slot);
      if (slot.componentOptions) return this.getComponent(slot);
      if (slot.tag && !slot.componentOptions) return this.getTag(slot);
      throw new Error("Cannot handle slot ".concat(JSON.stringify(slot)));
    }
  }, {
    key: "deserializeSlot",
    value: function deserializeSlot(slot) {
      if (slot.type === 'text') return slot.text;
      if (slot.type === 'tag') return this.createVNodeFromTag(slot.name, slot.children);
      if (slot.type === 'component') return this.createVNodeFromComponent(slot.fingerprint);
      throw new Error("Found unknown slot type \"".concat(slot.type, "\""));
    }
  }, {
    key: "getText",
    value: function getText(slot) {
      var type = 'text';
      var text = slot.text;
      var __moisturizer = true;
      return {
        __moisturizer: __moisturizer,
        type: type,
        text: text
      };
    }
  }, {
    key: "getComponent",
    value: function getComponent(slot) {
      var type = 'component';
      var fingerprint = Fingerprinter.print(slot);
      var __moisturizer = true;
      return {
        __moisturizer: __moisturizer,
        type: type,
        fingerprint: fingerprint
      };
    }
  }, {
    key: "getTag",
    value: function getTag(slot) {
      var _this3 = this;

      var type = 'tag';
      var name = slot.tag;
      var children = slot.children ? slot.children.map(function (c) {
        return _this3.serializeSlot(c);
      }) : [];
      var __moisturizer = true;
      return {
        __moisturizer: __moisturizer,
        type: type,
        name: name,
        children: children
      };
    }
  }, {
    key: "createVNodeFromTag",
    value: function createVNodeFromTag(el, children) {
      var _this4 = this;

      var childrenAsVNodes = children ? children.map(function (c) {
        return _this4.deserializeSlot(c);
      }) : undefined;
      return this.vm.$createElement(el, childrenAsVNodes);
    }
  }, {
    key: "createVNodeFromComponent",
    value: function createVNodeFromComponent(fingerprint) {
      var component = this.components.find(function (comp) {
        return Fingerprinter.print(comp) === fingerprint;
      });
      var msg = "Could not find component \"".concat(fingerprint, "\". Did you provide it to the hydration?");
      if (!component) throw new Error(msg);
      return this.vm.$createElement(component);
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
      var json = str && str.replace(/'/g, '"').replace(/\\"/g, '"') || '{"default": []}';
      return JSON.parse(json);
    }
  }]);

  return Slots;
}();

module.exports = Slots;