"use strict";

var MoisturizerVuePlugin = require('./moisturizerVuePlugin');

var AppInstantiator = require('./appInstantiator');

var Hydrator = require('./hydrator');

module.exports = MoisturizerVuePlugin;

module.exports.instantiateApp = function (comp, options) {
  return new AppInstantiator(comp, options).instantiate();
};

module.exports.hydrateComponents = function (comps, options) {
  return new Hydrator(comps, options).hydrate();
};