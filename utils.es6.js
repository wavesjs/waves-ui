'use strict';

var utils = {};

utils.isFunction = function(func) {
  return Object.prototype.toString.call(func) === '[object Function]';
};

// combined accessors
utils.getSet = function getSet(obj, props = null, valueMode = false){
  if (!props) throw new Error('Property name is mandatory.');

  var add = (p = null) => {
    var _prop = '__' + p;
    if (!obj.hasOwnProperty(_prop)) obj[_prop] = null;

    obj[p] = function(value = null) {
      if (value === null) return this[_prop];

      if (!utils.isFunction(value) && !valueMode) {
        this[_prop] = () => value;
      } else {
        this[_prop] = value;
      }

      return this;
    };
  };

  if (Array.isArray(props)) {
    props.forEach((p) => add(p));
  } else {
    add(props);
  }

};

// return a unique identifier with an optionnal prefix
var _counters = { '': 0 };

utils.uniqueId = function(prefix = '') {
  if (prefix && !_counters[prefix]) {
    _counters[prefix] = 0;
  }

  var id = _counters[prefix];
  if (prefix) { id = [prefix, id].join('-'); }
  _counters[prefix] += 1;

  return id;
};

// 
utils.extend = function extend() {
  // this can probably improved in es6
  var args = Array.prototype.slice.call(arguments);
  var host = args.shift();
  var copy = args.shift();

  for (var i in copy) { host[i] = copy[i]; }
  args.unshift(host);

  if (args.length > 1) { return extend.apply(null, args); }
  return host;
};


// style injection
var _sheet;

function createStyleSheet() {
  var el = document.createElement('style');
  // webkit hack: cf. http://davidwalsh.name/add-rules-stylesheets
  el.appendChild(document.createTextNode(''));
  document.body.appendChild(el);
  _sheet = el.sheet;
}

utils.addCssRule = function(selector, rules, position = 0) {
  if (!_sheet) { createStyleSheet(); }

  var rule = Object.keys(rules).map((key) => {
    return key + ':' + rules[key];
  }).join(';');

  rule = selector + '{' + rule + '}';
  _sheet.insertRule(rule, position);
}

utils.UILoop = require('./lib/ui-loop');

// create a default data accessor for each given attrs

// var defaultDataMap = function defaultDataMap(obj, attrs) {
//   attrs.forEach((attr) => {
//     obj[attr]((d, v = null) => {
//       if (v === null) return d.y;
//       d[attr] = +v;
//       return obj;
//     })
//   });
// };


module.exports = utils;
