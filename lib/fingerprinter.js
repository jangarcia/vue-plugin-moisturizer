"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var md5 = require('md5');

var Fingerprinter =
/*#__PURE__*/
function () {
  function Fingerprinter(component) {
    _classCallCheck(this, Fingerprinter);

    this.component = component;
  } // TODO find better way to identify components
  // TODO for instance: Hash component definition


  _createClass(Fingerprinter, [{
    key: "fingerprint",
    value: function fingerprint() {
      var id = this.componentName() || this.renderFunctionAsStr();
      var message = 'Cannot fingerprint component.';
      var advice = 'Either set a name in your component or use a functional component';
      if (!id) throw new Error("".concat(message, " ").concat(advice));
      return md5(id);
    }
  }, {
    key: "componentName",
    value: function componentName() {
      var comp = this.component;
      if (comp.name) return comp.name;
      if (comp.$vnode) return comp.$vnode.componentOptions.Ctor.options.name;
      if (comp.componentOptions) return comp.componentOptions.Ctor.options.name;
      return undefined;
    }
  }, {
    key: "renderFunctionAsStr",
    value: function renderFunctionAsStr() {
      var comp = this.component;
      if (comp.render) return comp.render.toString();
      if (comp.componentOptions.Ctor.options) return comp.componentOptions.Ctor.options.toString();
      return undefined;
    }
  }], [{
    key: "print",
    value: function print(comp) {
      return new Fingerprinter(comp).fingerprint();
    }
  }]);

  return Fingerprinter;
}();

module.exports = Fingerprinter;