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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9oZWxwZXJzL3pvb21lci5lczYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUVBLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQzs7QUFFZixLQUFLLENBQUMsVUFBVSxHQUFHLFVBQVMsSUFBSSxFQUFFO0FBQ2hDLFNBQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLG1CQUFtQixDQUFDO0NBQ3JFLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJGLElBQUksT0FBTyxHQUFHLGlCQUFTLEtBQUssRUFBRSxFQUFFLEVBQUU7QUFDaEMsTUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDekIsU0FBSyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7R0FDakI7O0FBRUQsT0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztDQUNuQixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTZCRixLQUFLLENBQUMsU0FBUyxHQUFHOztBQUVoQixVQUFRLEVBQUUsa0JBQVMsR0FBRyxFQUFnQjtRQUFkLEtBQUssZ0NBQUcsSUFBSTs7QUFDbEMsUUFBSSxDQUFDLEtBQUssRUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7O0FBRTNELFFBQUksR0FBRyxHQUFHLFlBQWM7VUFBYixDQUFDLGdDQUFHLElBQUk7O0FBQ2pCLFVBQUksS0FBSyxTQUFPLENBQUMsQUFBRSxDQUFDO0FBQ3BCLFVBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUM7O0FBRWxELFNBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxZQUF1QjtZQUFkLEtBQUssZ0NBQUcsSUFBSTs7QUFDNUIsWUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFLE9BQU8sSUFBSSxDQUFDLEtB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TSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ25DLFVBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUM7S0FDckMsTUFBTSxJQUFJLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxRQUFRLEtBQUssS0FBSyxFQUFFO0FBQ2pELGFBQU8sR0FBRyxVQUFVLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0tBQ3hDO0FBQ0QsV0FBTyxNQUFNLENBQUM7R0FDZixDQUFDO0NBQ0gsQ0FBQzs7O0FBR0YsS0FBSyxDQUFDLE9BQU8sR0FBRyxVQUFTLElBQUksRUFBRTtBQUM3QixNQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztDQUNuQyxDQUFDOztBQUVGLEtBQUssQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3hDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7OztBQWV6QyxNQUFNLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyIsImZpbGUiOiJzcmMvaGVscGVycy96b29tZXIuZXM2LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSB7fTtcblxudXRpbHMuaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChmdW5jKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbn07XG5cbi8vIEBUT0RPIC0gcmVtb3ZlIGluIGZhdm9yIG9mIGBPYmplY3QuYXNzaWduYFxuLy8gQE5PVEUgZG9uZSBpbiB1aSBjb21wb25lbnRzXG4vLyB1dGlscy5leHRlbmQgPSBmdW5jdGlvbiBleHRlbmQoKSB7XG4vLyAgIC8vIHRoaXMgY2FuIHByb2JhYmx5IGltcHJvdmVkIGluIGVzNlxuLy8gICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4vLyAgIHZhciBob3N0ID0gYXJncy5zaGlmdCgpO1xuLy8gICB2YXIgY29weSA9IGFyZ3Muc2hpZnQoKTtcblxuLy8gICBmb3IgKHZhciBpIGluIGNvcHkpIHsgaG9zdFtpXSA9IGNvcHlbaV07IH1cbi8vICAgYXJncy51bnNoaWZ0KGhvc3QpO1xuXG4vLyAgIGlmIChhcmdzLmxlbmd0aCA+IDEpIHsgcmV0dXJuIGV4dGVuZC5hcHBseShudWxsLCBhcmdzKTsgfVxuLy8gICByZXR1cm4gaG9zdDtcbi8vIH07XG5cbnZhciBleHBsb2RlID0gZnVuY3Rpb24oaXRlbXMsIGNiKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShpdGVtcykpIHtcbiAgICBpdGVtcyA9IFtpdGVtc107XG4gIH1cblxuICBpdGVtcy5mb3JFYWNoKGNiKTtcbn07XG5cbi8vIEBUT0RPIC0gcmVtb3ZlIHdoZW4gYWxsIG9jY3VyZW5jZSByZW1vdmVkIGluIGRlcGVuZGVuY2llc1xuLy8gQE5PVEUgZG9uZSBpbiB1aSBjb21wb25lbnRzXG4vLyBjb21iaW5lZCBhY2Nlc3NvcnNcbi8vIHV0aWxzLmdldFNldCA9IGZ1bmN0aW9uIGdldFNldChvYmosIHByb3BzID0gbnVsbCwgdmFsdWVNb2RlID0gZmFsc2Upe1xuLy8gICBpZiAoIXByb3BzKSB0aHJvdyBuZXcgRXJyb3IoJ1Byb3BlcnR5IG5hbWUgaXMgbWFuZGF0b3J5LicpO1xuXG4vLyAgIHZhciBhZGQgPSAocCA9IG51bGwpID0+IHtcbi8vICAgICB2YXIgX3Byb3AgPSBgXyR7cH1gO1xuLy8gICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KF9wcm9wKSkgb2JqW19wcm9wXSA9IG51bGw7XG5cbi8vICAgICBvYmpbcF0gPSBmdW5jdGlvbih2YWx1ZSA9IG51bGwpIHtcbi8vICAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkgcmV0dXJuIHRoaXNbX3Byb3BdO1xuXG4vLyAgICAgICBpZiAoIXV0aWxzLmlzRnVuY3Rpb24odmFsdWUpICYmICF2YWx1ZU1vZGUpIHtcbi8vICAgICAgICAgdGhpc1tfcHJvcF0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHZhbHVlOyB9O1xuLy8gICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgdGhpc1tfcHJvcF0gPSB2YWx1ZTtcbi8vICAgICAgIH1cblxuLy8gICAgICAgcmV0dXJuIHRoaXM7XG4vLyAgICAgfTtcbi8vICAgfTtcblxuLy8gICBleHBsb2RlKHByb3BzLCAocCkgPT4gYWRkKHApKTtcbi8vIH07XG5cbi8vIGNvbWJpbmVkIGFjY2Vzc29yc1xudXRpbHMuYWNjZXNzb3JzID0ge1xuXG4gIGlkZW50aXR5OiBmdW5jdGlvbihvYmosIHByb3BzID0gbnVsbCkge1xuICAgIGlmICghcHJvcHMpIHRocm93IG5ldyBFcnJvcignUHJvcGVydHkgbmFtZSBpcyBtYW5kYXRvcnkuJyk7XG5cbiAgICB2YXIgYWRkID0gKHAgPSBudWxsKSA9PiB7XG4gICAgICB2YXIgX3Byb3AgPSBgXyR7cH1gO1xuICAgICAgaWYgKCFvYmouaGFzT3duUHJvcGVydHkoX3Byb3ApKSBvYmpbX3Byb3BdID0gbnVsbDtcblxuICAgICAgb2JqW3BdID0gZnVuY3Rpb24odmFsdWUgPSBudWxsKSB7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkgcmV0dXJuIHRoaXNbX3Byb3BdO1xuICAgICAgICB0aGlzW19wcm9wXSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH07XG4gICAgfTtcblxuICAgIGV4cGxvZGUocHJvcHMsIChwKSA9PiBhZGQocCkpO1xuICB9LFxuXG4gIGdldEZ1bmN0aW9uOiBmdW5jdGlvbihvYmosIHByb3BzID0gbnVsbCkge1xuICAgIGlmICghcHJvcHMpIHRocm93IG5ldyBFcnJvcignUHJvcGVydHkgbmFtZSBpcyBtYW5kYXRvcnkuJyk7XG5cbiAgICB2YXIgYWRkID0gKHAgPSBudWxsKSA9PiB7XG4gICAgICB2YXIgX3Byb3AgPSBgXyR7cH1gO1xuICAgICAgaWYgKCFvYmouaGFzT3duUHJvcGVydHkoX3Byb3ApKSBvYmpbX3Byb3BdID0gbnVsbDtcblxuICAgICAgb2JqW3BdID0gZnVuY3Rpb24odmFsdWUgPSBudWxsKSB7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkgcmV0dXJuIHRoaXNbX3Byb3BdO1xuXG4gICAgICAgIGlmICghdXRpbHMuaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgICAgICB0aGlzW19wcm9wXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdmFsdWU7IH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpc1tfcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH07XG4gICAgfTtcblxuICAgIGV4cGxvZGUocHJvcHMsIChwKSA9PiBhZGQocCkpO1xuXG4gIH0sXG5cbiAgZ2V0VmFsdWU6IGZ1bmN0aW9uKG9iaiwgcHJvcHMgPSBudWxsKSB7XG4gICAgaWYgKCFwcm9wcykgdGhyb3cgbmV3IEVycm9yKCdQcm9wZXJ0eSBuYW1lIGlzIG1hbmRhdG9yeS4nKTtcblxuICAgIHZhciBhZGQgPSAocCA9IG51bGwpID0+IHtcbiAgICAgIHZhciBfcHJvcCA9IGBfJHtwfWA7XG4gICAgICBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShfcHJvcCkpIG9ialtfcHJvcF0gPSBudWxsO1xuXG4gICAgICBvYmpbcF0gPSBmdW5jdGlvbih2YWx1ZSA9IG51bGwpIHtcbiAgICAgICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICAgICAgaWYgKCF1dGlscy5pc0Z1bmN0aW9uKHRoaXNbX3Byb3BdKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXNbX3Byb3BdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB0aGlzW19wcm9wXSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpc1tfcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9O1xuICAgIH07XG5cbiAgICBleHBsb2RlKHByb3BzLCAocCkgPT4gYWRkKHApKTtcbiAgfVxufTtcblxuXG4vLyByZXR1cm4gYSB1bmlxdWUgaWRlbnRpZmllciB3aXRoIGFuIG9wdGlvbm5hbCBwcmVmaXhcbnZhciBfY291bnRlcnMgPSB7ICcnOiAwIH07XG5cbnV0aWxzLnVuaXF1ZUlkID0gZnVuY3Rpb24ocHJlZml4ID0gJycpIHtcbiAgaWYgKHByZWZpeCAmJiAhX2NvdW50ZXJzW3ByZWZpeF0pIHtcbiAgICBfY291bnRlcnNbcHJlZml4XSA9IDA7XG4gIH1cblxuICB2YXIgaWQgPSBfY291bnRlcnNbcHJlZml4XTtcbiAgaWYgKHByZWZpeCkgeyBpZCA9IFtwcmVmaXgsIGlkXS5qb2luKCctJyk7IH1cbiAgX2NvdW50ZXJzW3ByZWZpeF0gKz0gMTtcblxuICByZXR1cm4gaWQ7XG59O1xuXG4vLyBzdHlsZSBpbmplY3Rpb25cbnZhciBfc2hlZXQ7XG5cbnZhciBjcmVhdGVTdHlsZVNoZWV0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gIC8vIHdlYmtpdCBoYWNrOiBjZi4gaHR0cDovL2Rhdmlkd2Fsc2gubmFtZS9hZGQtcnVsZXMtc3R5bGVzaGVldHNcbiAgZWwuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbCk7XG4gIF9zaGVldCA9IGVsLnNoZWV0O1xufTtcblxudXRpbHMuYWRkQ3NzUnVsZSA9IGZ1bmN0aW9uKHNlbGVjdG9yLCBydWxlcywgcG9zaXRpb24gPSAwKSB7XG4gIGlmICghX3NoZWV0KSB7IGNyZWF0ZVN0eWxlU2hlZXQoKTsgfVxuXG4gIHZhciBydWxlID0gT2JqZWN0LmtleXMocnVsZXMpLm1hcCgoa2V5KSA9PiB7XG4gICAgcmV0dXJuIGtleSArICc6JyArIHJ1bGVzW2tleV07XG4gIH0pLmpvaW4oJzsnKTtcblxuICBydWxlID0gc2VsZWN0b3IgKyAneycgKyBydWxlICsgJ30nO1xuICBfc2hlZXQuaW5zZXJ0UnVsZShydWxlLCBwb3NpdGlvbik7XG59O1xuXG4vLyBmcm9tIHVuZGVyc2NvcmUgMS43LjBcbnV0aWxzLnRocm90dGxlID0gZnVuY3Rpb24oZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICB2YXIgY29udGV4dCwgYXJncywgcmVzdWx0O1xuICB2YXIgdGltZW91dCA9IG51bGw7XG4gIHZhciBwcmV2aW91cyA9IDA7XG4gIGlmICghb3B0aW9ucykgb3B0aW9ucyA9IHt9O1xuICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICBwcmV2aW91cyA9IG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UgPyAwIDogbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgdGltZW91dCA9IG51bGw7XG4gICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgfTtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICBpZiAoIXByZXZpb3VzICYmIG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UpIHByZXZpb3VzID0gbm93O1xuICAgIHZhciByZW1haW5pbmcgPSB3YWl0IC0gKG5vdyAtIHByZXZpb3VzKTtcbiAgICBjb250ZXh0ID0gdGhpcztcbiAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgIGlmIChyZW1haW5pbmcgPD0gMCB8fCByZW1haW5pbmcgPiB3YWl0KSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgIHByZXZpb3VzID0gbm93O1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgIH0gZWxzZSBpZiAoIXRpbWVvdXQgJiYgb3B0aW9ucy50cmFpbGluZyAhPT0gZmFsc2UpIHtcbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCByZW1haW5pbmcpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufTtcblxuLy9cbnV0aWxzLnRvRnJvbnQgPSBmdW5jdGlvbihpdGVtKSB7XG4gIGl0ZW0ucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChpdGVtKTtcbn07XG5cbnV0aWxzLlVJTG9vcCA9IHJlcXVpcmUoJy4vbGliL3VpLWxvb3AnKTtcbnV0aWxzLm9ic2VydmUgPSByZXF1aXJlKCcuL2xpYi9vYnNlcnZlJyk7XG5cbi8vIGNyZWF0ZSBhIGRlZmF1bHQgZGF0YSBhY2Nlc3NvciBmb3IgZWFjaCBnaXZlbiBhdHRyc1xuXG4vLyB2YXIgZGVmYXVsdERhdGFNYXAgPSBmdW5jdGlvbiBkZWZhdWx0RGF0YU1hcChvYmosIGF0dHJzKSB7XG4vLyAgIGF0dHJzLmZvckVhY2goKGF0dHIpID0+IHtcbi8vICAgICBvYmpbYXR0cl0oKGQsIHYgPSBudWxsKSA9PiB7XG4vLyAgICAgICBpZiAodiA9PT0gbnVsbCkgcmV0dXJuIGQueTtcbi8vICAgICAgIGRbYXR0cl0gPSArdjtcbi8vICAgICAgIHJldHVybiBvYmo7XG4vLyAgICAgfSlcbi8vICAgfSk7XG4vLyB9O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gdXRpbHM7XG4iXX0=