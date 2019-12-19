"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Fingerprinter = require('./fingerprinter');

var config = require('./config');

var Props = require('./props');

var Slots = require('./slots');

var MoisturizerVuePlugin =
/*#__PURE__*/
function () {
  function MoisturizerVuePlugin() {
    _classCallCheck(this, MoisturizerVuePlugin);
  }

  _createClass(MoisturizerVuePlugin, null, [{
    key: "install",
    value: function install(Vue) {
      MoisturizerVuePlugin.setVue(Vue);
      MoisturizerVuePlugin.applyMixin(Vue);
    }
  }, {
    key: "setVue",
    value: function setVue(Vue) {
      MoisturizerVuePlugin.vue = Vue;
    }
  }, {
    key: "applyMixin",
    value: function applyMixin(Vue) {
      Vue.mixin({
        created: function created() {
          if (typeof window === 'undefined' && this.$attrs.hydrate) {
            var _MoisturizerVuePlugin;

            MoisturizerVuePlugin.extendAttrs(this, (_MoisturizerVuePlugin = {}, _defineProperty(_MoisturizerVuePlugin, config.attrs.fingerprint, MoisturizerVuePlugin.getFingerprint(this)), _defineProperty(_MoisturizerVuePlugin, config.attrs.props, MoisturizerVuePlugin.getProps(this)), _defineProperty(_MoisturizerVuePlugin, config.attrs.slots, MoisturizerVuePlugin.getSlots(this)), _MoisturizerVuePlugin));
          }
        },
        props: {
          hydrate: {
            type: Boolean,
            default: false
          }
        }
      });
    }
  }, {
    key: "extendAttrs",
    value: function extendAttrs(comp, obj) {
      comp.$vnode.data = comp.$vnode.data || {};
      comp.$vnode.data.attrs = comp.$vnode.data.attrs || {};
      Object.assign(comp.$vnode.data.attrs, obj);
    }
  }, {
    key: "getFingerprint",
    value: function getFingerprint(comp) {
      return Fingerprinter.print(comp);
    }
  }, {
    key: "getProps",
    value: function getProps(comp) {
      return new Props([]).serialize(comp.$options.propsData);
    }
  }, {
    key: "getSlots",
    value: function getSlots(comp) {
      return new Slots().serialize(comp.$slots);
    }
  }]);

  return MoisturizerVuePlugin;
}();

module.exports = MoisturizerVuePlugin;