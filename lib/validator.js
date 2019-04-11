"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var hasDuplicates = require('has-duplicates');

var Fingerprint = require('./fingerprinter');

var config = require('./config');

var Validator =
/*#__PURE__*/
function () {
  function Validator(components) {
    _classCallCheck(this, Validator);

    this.components = components;
    this.fingerprints = components.map(function (c) {
      return Fingerprint.print(c);
    });
  }

  _createClass(Validator, [{
    key: "validate",
    value: function validate() {
      this.showWarningsForUnprovidedComponents();
      this.throwErrorforDuplicateFingerprints();
    }
  }, {
    key: "showWarningsForUnprovidedComponents",
    value: function showWarningsForUnprovidedComponents() {
      var _this = this;

      if (process && process.env && process.env.NODE_ENV === 'production') return;
      var elements = document.querySelectorAll("[".concat(config.attrs.fingerprint, "]"));

      _toConsumableArray(elements).forEach(function (el) {
        return _this.checkIfComponentIsProvided(el);
      });
    } // TODO Provide human-readable message which component is actually missing

  }, {
    key: "checkIfComponentIsProvided",
    value: function checkIfComponentIsProvided(el) {
      var fingerprintInAttr = el.getAttribute(config.attrs.fingerprint);

      var fingerprintMatch = function fingerprintMatch(name) {
        return name === fingerprintInAttr;
      };

      var componentProvidedForEl = this.fingerprints.find(fingerprintMatch);

      if (!componentProvidedForEl) {
        var msg = "Vue Moisturizer: You did not provide the component \"".concat(fingerprintInAttr, "\" in the client");
        console.error(msg);
      }
    } // TODO Tell the programmer which components are dupes

  }, {
    key: "throwErrorforDuplicateFingerprints",
    value: function throwErrorforDuplicateFingerprints() {
      if (hasDuplicates(this.fingerprints)) {
        var warning = "You are trying to hydrate multiple components that have the same fingerprint!";
        var advice = "Please provide different names for components or use functional components";
        throw new Error("".concat(warning, "\n").concat(advice));
      }
    }
  }]);

  return Validator;
}();

module.exports = Validator;