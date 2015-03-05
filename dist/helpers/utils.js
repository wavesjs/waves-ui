"use strict";

var _core = require("babel-runtime/core-js")["default"];

var utils = {};

utils.isFunction = function (func) {
  return Object.prototype.toString.call(func) === "[object Function]";
};

// @TODO - remove in favor of `Object.assign`
// @NOTE done in ui components
// utils.extend = function extend() {
//   // this can probably improved in es6
//   var args = Array.prototype.slice.call(arguments);
//   var host = args.shift();
//   var copy = args.shift();

//   for (var i in copy) { host[i] = copy[i]; }
//   args.unshift(host);

//   if (args.length > 1) { return extend.apply(null, args); }
//   return host;
// };

var explode = function explode(items, cb) {
  if (!Array.isArray(items)) {
    items = [items];
  }

  items.forEach(cb);
};

// @TODO - remove when all occurence removed in dependencies
// @NOTE done in ui components
// combined accessors
// utils.getSet = function getSet(obj, props = null, valueMode = false){
//   if (!props) throw new Error('Property name is mandatory.');

//   var add = (p = null) => {
//     var _prop = `_${p}`;
//     if (!obj.hasOwnProperty(_prop)) obj[_prop] = null;

//     obj[p] = function(value = null) {
//       if (value === null) return this[_prop];

//       if (!utils.isFunction(value) && !valueMode) {
//         this[_prop] = function() { return value; };
//       } else {
//         this[_prop] = value;
//       }

//       return this;
//     };
//   };

//   explode(props, (p) => add(p));
// };

// combined accessors
utils.accessors = {

  identity: function identity(obj) {
    var props = arguments[1] === undefined ? null : arguments[1];

    if (!props) throw new Error("Property name is mandatory.");

    var add = function () {
      var p = arguments[0] === undefined ? null : arguments[0];

      var _prop = "_" + p;
      if (!obj.hasOwnProperty(_prop)) obj[_prop] = null;

      obj[p] = function () {
        var value = arguments[0] === undefined ? null : arguments[0];

        if (value === null) return this[_prop];
        this[_prop] = value;
        return this;
      };
    };

    explode(props, function (p) {
      return add(p);
    });
  },

  getFunction: function getFunction(obj) {
    var props = arguments[1] === undefined ? null : arguments[1];

    if (!props) throw new Error("Property name is mandatory.");

    var add = function () {
      var p = arguments[0] === undefined ? null : arguments[0];

      var _prop = "_" + p;
      if (!obj.hasOwnProperty(_prop)) obj[_prop] = null;

      obj[p] = function () {
        var value = arguments[0] === undefined ? null : arguments[0];

        if (value === null) return this[_prop];

        if (!utils.isFunction(value)) {
          this[_prop] = function () {
            return value;
          };
        } else {
          this[_prop] = value;
        }
        return this;
      };
    };

    explode(props, function (p) {
      return add(p);
    });
  },

  getValue: function getValue(obj) {
    var props = arguments[1] === undefined ? null : arguments[1];

    if (!props) throw new Error("Property name is mandatory.");

    var add = function () {
      var p = arguments[0] === undefined ? null : arguments[0];

      var _prop = "_" + p;
      if (!obj.hasOwnProperty(_prop)) obj[_prop] = null;

      obj[p] = function () {
        var value = arguments[0] === undefined ? null : arguments[0];

        if (value === null) {
          if (!utils.isFunction(this[_prop])) {
            return this[_prop];
          }

          return this[_prop]();
        }

        this[_prop] = value;
        return this;
      };
    };

    explode(props, function (p) {
      return add(p);
    });
  }
};

// return a unique identifier with an optionnal prefix
var _counters = { "": 0 };

utils.uniqueId = function () {
  var prefix = arguments[0] === undefined ? "" : arguments[0];

  if (prefix && !_counters[prefix]) {
    _counters[prefix] = 0;
  }

  var id = _counters[prefix];
  if (prefix) {
    id = [prefix, id].join("-");
  }
  _counters[prefix] += 1;

  return id;
};

// style injection
var _sheet;

var createStyleSheet = function createStyleSheet() {
  var el = document.createElement("style");
  // webkit hack: cf. http://davidwalsh.name/add-rules-stylesheets
  el.appendChild(document.createTextNode(""));
  document.body.appendChild(el);
  _sheet = el.sheet;
};

utils.addCssRule = function (selector, rules) {
  var position = arguments[2] === undefined ? 0 : arguments[2];

  if (!_sheet) {
    createStyleSheet();
  }

  var rule = _core.Object.keys(rules).map(function (key) {
    return key + ":" + rules[key];
  }).join(";");

  rule = selector + "{" + rule + "}";
  _sheet.insertRule(rule, position);
};

// from underscore 1.7.0
utils.throttle = function (func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  if (!options) options = {};
  var later = function later() {
    previous = options.leading === false ? 0 : new Date().getTime();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function () {
    var now = new Date().getTime();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      clearTimeout(timeout);
      timeout = null;
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};

//
utils.toFront = function (item) {
  item.parentNode.appendChild(item);
};

utils.UILoop = require("./lib/ui-loop");
utils.observe = require("./lib/observe");

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9oZWxwZXJzL3pvb21lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBRUEsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDOztBQUVmLEtBQUssQ0FBQyxVQUFVLEdBQUcsVUFBUyxJQUFJLEVBQUU7QUFDaEMsU0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssbUJBQW1CLENBQUM7Q0FDckUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkYsSUFBSSxPQUFPLEdBQUcsaUJBQVMsS0FBSyxFQUFFLEVBQUUsRUFBRTtBQUNoQyxNQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUN6QixTQUFLLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUNqQjs7QUFFRCxPQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0NBQ25CLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNkJGLEtBQUssQ0FBQyxTQUFTLEdBQUc7O0FBRWhCLFVBQVEsRUFBRSxrQkFBUyxHQUFHLEVBQWdCO1FBQWQsS0FBSyxnQ0FBRyxJQUFJOztBQUNsQyxRQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQzs7QUFFM0QsUUFBSSxHQUFHLEdBQUcsWUFBYztVQUFiLENBQUMsZ0NBQUcsSUFBSTs7QUFDakIsVUFBSSxLQUFLLFNBQU8sQ0FBQyxBQUFFLENBQUM7QUFDcEIsVUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQzs7QUFFbEQsU0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLFlBQXVCO1lBQWQsS0FBSyxnQ0FBRyxJQUFJOztBQUM1QixZQUFJLEtBQUssS0FBSyxJQUFJLEVBQUUsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkMsWUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQztBQUNwQixlQUFPLElBQUksQ0FBQztPQUNiLENBQUM7S0FDSCxDQUFDOztBQUVGLFdBQU8sQ0FBQyxLQUFLLEVBQUUsVUFBQyxDQUFDO2FBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztLQUFBLENBQUMsQ0FBQztHQUMvQjs7QUFFRCxhQUFXLEVBQUUscUJBQVMsR0FBRyxFQUFnQjtRQUFkLEtBQUssZ0NBQUcsSUFBSTs7QUFDckMsUUFBSSxDQUFDLEtBQUssRUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7O0FBRTNELFFBQUksR0FBRyxHQUFHLFlBQWM7VUFBYixDQUFDLGdDQUFHLElBQUk7O0FBQ2pCLFVBQUksS0FBSyxTQUFPLENBQUMsQUFBRSxDQUFDO0FBQ3BCLFVBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUM7O0FBRWxELFNBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxZQUF1QjtZQUFkLEtBQUssZ0NBQUcsSUFBSTs7QUFDNUIsWUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUV2QyxZQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUM1QixjQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsWUFBVztBQUFFLG1CQUFPLEtBQUssQ0FBQztXQUFFLENBQUM7U0FDNUMsTUFBTTtBQUNMLGNBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUM7U0FDckI7QUFDRCxlQUFPLElBQUksQ0FBQztPQUNiLENBQUM7S0FDSCxDQUFDOztBQUVGLFdBQU8sQ0FBQyxLQUFLLEVBQUUsVUFBQyxDQUFDO2FBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztLQUFBLENBQUMsQ0FBQztHQUUvQjs7QUFFRCxVQUFRLEVBQUUsa0JBQVMsR0FBRyxFQUFnQjtRQUFkLEtBQUssZ0NBQUcsSUFBSTs7QUFDbEMsUUFBSSxDQUFDLEtBQUssRUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7O0FBRTNELFFBQUksR0FBRyxHQUFHLFlBQWM7VUFBYixDQUFDLGdDQUFHLElBQUk7O0FBQ2pCLFVBQUksS0FBSyxTQUFPLENBQUMsQUFBRSxDQUFDO0FBQ3BCLFVBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUM7O0FBRWxELFNBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxZQUF1QjtZQUFkLEtBQUssZ0NBQUcsSUFBSTs7QUFDNUIsWUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFO0FBQ2xCLGNBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQ2xDLG1CQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztXQUNwQjs7QUFFRCxpQkFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztTQUN0Qjs7QUFFRCxZQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQ3BCLGVBQU8sSUFBSSxDQUFDO09BQ2IsQ0FBQztLQUNILENBQUM7O0FBRUYsV0FBTyxDQUFDLEtBQUssRUFBRSxVQUFDLENBQUM7YUFBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO0tBQUEsQ0FBQyxDQUFDO0dBQy9CO0NBQ0YsQ0FBQzs7O0FBSUYsSUFBSSxTQUFTLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7O0FBRTFCLEtBQUssQ0FBQyxRQUFRLEdBQUcsWUFBc0I7TUFBYixNQUFNLGdDQUFHLEVBQUU7O0FBQ25DLE1BQUksTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQ2hDLGFBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7R0FDdkI7O0FBRUQsTUFBSSxFQUFFLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNCLE1BQUksTUFBTSxFQUFFO0FBQUUsTUFBRSxHQUFHLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztHQUFFO0FBQzVDLFdBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXZCLFNBQU8sRUFBRSxDQUFDO0NBQ1gsQ0FBQzs7O0FBR0YsSUFBSSxNQUFNLENBQUM7O0FBRVgsSUFBSSxnQkFBZ0IsR0FBRyw0QkFBVztBQUNoQyxNQUFJLEVBQUUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUV6QyxJQUFFLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM1QyxVQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM5QixRQUFNLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQztDQUNuQixDQUFDOztBQUVGLEtBQUssQ0FBQyxVQUFVLEdBQUcsVUFBUyxRQUFRLEVBQUUsS0FBSyxFQUFnQjtNQUFkLFFBQVEsZ0NBQUcsQ0FBQzs7QUFDdkQsTUFBSSxDQUFDLE1BQU0sRUFBRTtBQUFFLG9CQUFnQixFQUFFLENBQUM7R0FBRTs7QUFFcEMsTUFBSSxJQUFJLEdBQUcsTUFBQSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUN6QyxXQUFPLEdBQUcsR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBQy9CLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRWIsTUFBSSxHQUFHLFFBQVEsR0FBRyxHQUFHLEdBQUcsSUFBSSxHQUFHLEdBQUcsQ0FBQztBQUNuQyxRQUFNLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztDQUNuQyxDQUFDOzs7QUFHRixLQUFLLENBQUMsUUFBUSxHQUFHLFVBQVMsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7QUFDN0MsTUFBSSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQztBQUMxQixNQUFJLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDbkIsTUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLE1BQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUMzQixNQUFJLEtBQUssR0FBRyxpQkFBVztBQUNyQixZQUFRLEdBQUcsT0FBTyxDQUFDLE9BQU8sS0FBSyxLQUFLLEdBQUcsQ0FBQyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDaEUsV0FBTyxHQUFHLElBQUksQ0FBQztBQUNmLFVBQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNuQyxRQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDO0dBQ3JDLENBQUM7QUFDRixTQUFPLFlBQVc7QUFDaEIsUUFBSSxHQUFHLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUMvQixRQUFJLENBQUMsUUFBUSxJQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssS0FBSyxFQUFFLFFBQVEsR0FBRyxHQUFHLENBQUM7QUFDM0QsUUFBSSxTQUFTLEdBQUcsSUFBSSxJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUEsQUFBQyxDQUFDO0FBQ3hDLFdBQU8sR0FBRyxJQUFJLENBQUM7QUFDZixRQUFJLEdBQUcsU0FBUyxDQUFDO0FBQ2pCLFFBQUksU0FBUyxJQUFJLENBQUMsSUFBSSxTQUFTLEdBQUcsSUFBSSxFQUFFO0FBQ3RDLGtCQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDdEIsYUFBTyxHQUFHLElBQUksQ0FBQztBQUNmLGNBQVEsR0FBRyxHQUFHLENBQUM7QUFDZixZQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDbkMsVUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQztLQUNyQyxNQUFNLElBQUksQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLFFBQVEsS0FBSyxLQUFLLEVBQUU7QUFDakQsYUFBTyxHQUFHLFVBQVUsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7S0FDeEM7QUFDRCxXQUFPLE1BQU0sQ0FBQztHQUNmLENBQUM7Q0FDSCxDQUFDOzs7QUFHRixLQUFLLENBQUMsT0FBTyxHQUFHLFVBQVMsSUFBSSxFQUFFO0FBQzdCLE1BQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0NBQ25DLENBQUM7O0FBRUYsS0FBSyxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDeEMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FBZXpDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDIiwiZmlsZSI6ImVzNi9oZWxwZXJzL3pvb21lci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0ge307XG5cbnV0aWxzLmlzRnVuY3Rpb24gPSBmdW5jdGlvbihmdW5jKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZnVuYykgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59O1xuXG4vLyBAVE9ETyAtIHJlbW92ZSBpbiBmYXZvciBvZiBgT2JqZWN0LmFzc2lnbmBcbi8vIEBOT1RFIGRvbmUgaW4gdWkgY29tcG9uZW50c1xuLy8gdXRpbHMuZXh0ZW5kID0gZnVuY3Rpb24gZXh0ZW5kKCkge1xuLy8gICAvLyB0aGlzIGNhbiBwcm9iYWJseSBpbXByb3ZlZCBpbiBlczZcbi8vICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuLy8gICB2YXIgaG9zdCA9IGFyZ3Muc2hpZnQoKTtcbi8vICAgdmFyIGNvcHkgPSBhcmdzLnNoaWZ0KCk7XG5cbi8vICAgZm9yICh2YXIgaSBpbiBjb3B5KSB7IGhvc3RbaV0gPSBjb3B5W2ldOyB9XG4vLyAgIGFyZ3MudW5zaGlmdChob3N0KTtcblxuLy8gICBpZiAoYXJncy5sZW5ndGggPiAxKSB7IHJldHVybiBleHRlbmQuYXBwbHkobnVsbCwgYXJncyk7IH1cbi8vICAgcmV0dXJuIGhvc3Q7XG4vLyB9O1xuXG52YXIgZXhwbG9kZSA9IGZ1bmN0aW9uKGl0ZW1zLCBjYikge1xuICBpZiAoIUFycmF5LmlzQXJyYXkoaXRlbXMpKSB7XG4gICAgaXRlbXMgPSBbaXRlbXNdO1xuICB9XG5cbiAgaXRlbXMuZm9yRWFjaChjYik7XG59O1xuXG4vLyBAVE9ETyAtIHJlbW92ZSB3aGVuIGFsbCBvY2N1cmVuY2UgcmVtb3ZlZCBpbiBkZXBlbmRlbmNpZXNcbi8vIEBOT1RFIGRvbmUgaW4gdWkgY29tcG9uZW50c1xuLy8gY29tYmluZWQgYWNjZXNzb3JzXG4vLyB1dGlscy5nZXRTZXQgPSBmdW5jdGlvbiBnZXRTZXQob2JqLCBwcm9wcyA9IG51bGwsIHZhbHVlTW9kZSA9IGZhbHNlKXtcbi8vICAgaWYgKCFwcm9wcykgdGhyb3cgbmV3IEVycm9yKCdQcm9wZXJ0eSBuYW1lIGlzIG1hbmRhdG9yeS4nKTtcblxuLy8gICB2YXIgYWRkID0gKHAgPSBudWxsKSA9PiB7XG4vLyAgICAgdmFyIF9wcm9wID0gYF8ke3B9YDtcbi8vICAgICBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShfcHJvcCkpIG9ialtfcHJvcF0gPSBudWxsO1xuXG4vLyAgICAgb2JqW3BdID0gZnVuY3Rpb24odmFsdWUgPSBudWxsKSB7XG4vLyAgICAgICBpZiAodmFsdWUgPT09IG51bGwpIHJldHVybiB0aGlzW19wcm9wXTtcblxuLy8gICAgICAgaWYgKCF1dGlscy5pc0Z1bmN0aW9uKHZhbHVlKSAmJiAhdmFsdWVNb2RlKSB7XG4vLyAgICAgICAgIHRoaXNbX3Byb3BdID0gZnVuY3Rpb24oKSB7IHJldHVybiB2YWx1ZTsgfTtcbi8vICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgIHRoaXNbX3Byb3BdID0gdmFsdWU7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIHJldHVybiB0aGlzO1xuLy8gICAgIH07XG4vLyAgIH07XG5cbi8vICAgZXhwbG9kZShwcm9wcywgKHApID0+IGFkZChwKSk7XG4vLyB9O1xuXG4vLyBjb21iaW5lZCBhY2Nlc3NvcnNcbnV0aWxzLmFjY2Vzc29ycyA9IHtcblxuICBpZGVudGl0eTogZnVuY3Rpb24ob2JqLCBwcm9wcyA9IG51bGwpIHtcbiAgICBpZiAoIXByb3BzKSB0aHJvdyBuZXcgRXJyb3IoJ1Byb3BlcnR5IG5hbWUgaXMgbWFuZGF0b3J5LicpO1xuXG4gICAgdmFyIGFkZCA9IChwID0gbnVsbCkgPT4ge1xuICAgICAgdmFyIF9wcm9wID0gYF8ke3B9YDtcbiAgICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KF9wcm9wKSkgb2JqW19wcm9wXSA9IG51bGw7XG5cbiAgICAgIG9ialtwXSA9IGZ1bmN0aW9uKHZhbHVlID0gbnVsbCkge1xuICAgICAgICBpZiAodmFsdWUgPT09IG51bGwpIHJldHVybiB0aGlzW19wcm9wXTtcbiAgICAgICAgdGhpc1tfcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9O1xuICAgIH07XG5cbiAgICBleHBsb2RlKHByb3BzLCAocCkgPT4gYWRkKHApKTtcbiAgfSxcblxuICBnZXRGdW5jdGlvbjogZnVuY3Rpb24ob2JqLCBwcm9wcyA9IG51bGwpIHtcbiAgICBpZiAoIXByb3BzKSB0aHJvdyBuZXcgRXJyb3IoJ1Byb3BlcnR5IG5hbWUgaXMgbWFuZGF0b3J5LicpO1xuXG4gICAgdmFyIGFkZCA9IChwID0gbnVsbCkgPT4ge1xuICAgICAgdmFyIF9wcm9wID0gYF8ke3B9YDtcbiAgICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KF9wcm9wKSkgb2JqW19wcm9wXSA9IG51bGw7XG5cbiAgICAgIG9ialtwXSA9IGZ1bmN0aW9uKHZhbHVlID0gbnVsbCkge1xuICAgICAgICBpZiAodmFsdWUgPT09IG51bGwpIHJldHVybiB0aGlzW19wcm9wXTtcblxuICAgICAgICBpZiAoIXV0aWxzLmlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICAgICAgdGhpc1tfcHJvcF0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHZhbHVlOyB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXNbX3Byb3BdID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9O1xuICAgIH07XG5cbiAgICBleHBsb2RlKHByb3BzLCAocCkgPT4gYWRkKHApKTtcblxuICB9LFxuXG4gIGdldFZhbHVlOiBmdW5jdGlvbihvYmosIHByb3BzID0gbnVsbCkge1xuICAgIGlmICghcHJvcHMpIHRocm93IG5ldyBFcnJvcignUHJvcGVydHkgbmFtZSBpcyBtYW5kYXRvcnkuJyk7XG5cbiAgICB2YXIgYWRkID0gKHAgPSBudWxsKSA9PiB7XG4gICAgICB2YXIgX3Byb3AgPSBgXyR7cH1gO1xuICAgICAgaWYgKCFvYmouaGFzT3duUHJvcGVydHkoX3Byb3ApKSBvYmpbX3Byb3BdID0gbnVsbDtcblxuICAgICAgb2JqW3BdID0gZnVuY3Rpb24odmFsdWUgPSBudWxsKSB7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICAgIGlmICghdXRpbHMuaXNGdW5jdGlvbih0aGlzW19wcm9wXSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzW19wcm9wXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gdGhpc1tfcHJvcF0oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXNbX3Byb3BdID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfTtcbiAgICB9O1xuXG4gICAgZXhwbG9kZShwcm9wcywgKHApID0+IGFkZChwKSk7XG4gIH1cbn07XG5cblxuLy8gcmV0dXJuIGEgdW5pcXVlIGlkZW50aWZpZXIgd2l0aCBhbiBvcHRpb25uYWwgcHJlZml4XG52YXIgX2NvdW50ZXJzID0geyAnJzogMCB9O1xuXG51dGlscy51bmlxdWVJZCA9IGZ1bmN0aW9uKHByZWZpeCA9ICcnKSB7XG4gIGlmIChwcmVmaXggJiYgIV9jb3VudGVyc1twcmVmaXhdKSB7XG4gICAgX2NvdW50ZXJzW3ByZWZpeF0gPSAwO1xuICB9XG5cbiAgdmFyIGlkID0gX2NvdW50ZXJzW3ByZWZpeF07XG4gIGlmIChwcmVmaXgpIHsgaWQgPSBbcHJlZml4LCBpZF0uam9pbignLScpOyB9XG4gIF9jb3VudGVyc1twcmVmaXhdICs9IDE7XG5cbiAgcmV0dXJuIGlkO1xufTtcblxuLy8gc3R5bGUgaW5qZWN0aW9uXG52YXIgX3NoZWV0O1xuXG52YXIgY3JlYXRlU3R5bGVTaGVldCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAvLyB3ZWJraXQgaGFjazogY2YuIGh0dHA6Ly9kYXZpZHdhbHNoLm5hbWUvYWRkLXJ1bGVzLXN0eWxlc2hlZXRzXG4gIGVsLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKSk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWwpO1xuICBfc2hlZXQgPSBlbC5zaGVldDtcbn07XG5cbnV0aWxzLmFkZENzc1J1bGUgPSBmdW5jdGlvbihzZWxlY3RvciwgcnVsZXMsIHBvc2l0aW9uID0gMCkge1xuICBpZiAoIV9zaGVldCkgeyBjcmVhdGVTdHlsZVNoZWV0KCk7IH1cblxuICB2YXIgcnVsZSA9IE9iamVjdC5rZXlzKHJ1bGVzKS5tYXAoKGtleSkgPT4ge1xuICAgIHJldHVybiBrZXkgKyAnOicgKyBydWxlc1trZXldO1xuICB9KS5qb2luKCc7Jyk7XG5cbiAgcnVsZSA9IHNlbGVjdG9yICsgJ3snICsgcnVsZSArICd9JztcbiAgX3NoZWV0Lmluc2VydFJ1bGUocnVsZSwgcG9zaXRpb24pO1xufTtcblxuLy8gZnJvbSB1bmRlcnNjb3JlIDEuNy4wXG51dGlscy50aHJvdHRsZSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgdmFyIGNvbnRleHQsIGFyZ3MsIHJlc3VsdDtcbiAgdmFyIHRpbWVvdXQgPSBudWxsO1xuICB2YXIgcHJldmlvdXMgPSAwO1xuICBpZiAoIW9wdGlvbnMpIG9wdGlvbnMgPSB7fTtcbiAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgcHJldmlvdXMgPSBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlID8gMCA6IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIHRpbWVvdXQgPSBudWxsO1xuICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gIH07XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgbm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgaWYgKCFwcmV2aW91cyAmJiBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlKSBwcmV2aW91cyA9IG5vdztcbiAgICB2YXIgcmVtYWluaW5nID0gd2FpdCAtIChub3cgLSBwcmV2aW91cyk7XG4gICAgY29udGV4dCA9IHRoaXM7XG4gICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICBpZiAocmVtYWluaW5nIDw9IDAgfHwgcmVtYWluaW5nID4gd2FpdCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICBwcmV2aW91cyA9IG5vdztcbiAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICB9IGVsc2UgaWYgKCF0aW1lb3V0ICYmIG9wdGlvbnMudHJhaWxpbmcgIT09IGZhbHNlKSB7XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgcmVtYWluaW5nKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn07XG5cbi8vXG51dGlscy50b0Zyb250ID0gZnVuY3Rpb24oaXRlbSkge1xuICBpdGVtLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoaXRlbSk7XG59O1xuXG51dGlscy5VSUxvb3AgPSByZXF1aXJlKCcuL2xpYi91aS1sb29wJyk7XG51dGlscy5vYnNlcnZlID0gcmVxdWlyZSgnLi9saWIvb2JzZXJ2ZScpO1xuXG4vLyBjcmVhdGUgYSBkZWZhdWx0IGRhdGEgYWNjZXNzb3IgZm9yIGVhY2ggZ2l2ZW4gYXR0cnNcblxuLy8gdmFyIGRlZmF1bHREYXRhTWFwID0gZnVuY3Rpb24gZGVmYXVsdERhdGFNYXAob2JqLCBhdHRycykge1xuLy8gICBhdHRycy5mb3JFYWNoKChhdHRyKSA9PiB7XG4vLyAgICAgb2JqW2F0dHJdKChkLCB2ID0gbnVsbCkgPT4ge1xuLy8gICAgICAgaWYgKHYgPT09IG51bGwpIHJldHVybiBkLnk7XG4vLyAgICAgICBkW2F0dHJdID0gK3Y7XG4vLyAgICAgICByZXR1cm4gb2JqO1xuLy8gICAgIH0pXG4vLyAgIH0pO1xuLy8gfTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IHV0aWxzO1xuIl19