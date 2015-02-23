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

var explode = function (items, cb) {
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

  identity: function (obj) {
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

  getFunction: function (obj) {
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

  getValue: function (obj) {
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

var createStyleSheet = function () {
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
  var later = function () {
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

//# sourceMappingURL=data:application/json;base64,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QUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNuQyxVQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDO0tBQ3JDLE1BQU0sSUFBSSxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsUUFBUSxLQUFLLEtBQUssRUFBRTtBQUNqRCxhQUFPLEdBQUcsVUFBVSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztLQUN4QztBQUNELFdBQU8sTUFBTSxDQUFDO0dBQ2YsQ0FBQztDQUNILENBQUM7OztBQUdGLEtBQUssQ0FBQyxPQUFPLEdBQUcsVUFBUyxJQUFJLEVBQUU7QUFDN0IsTUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7Q0FDbkMsQ0FBQzs7QUFFRixLQUFLLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN4QyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FBZXpDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDIiwiZmlsZSI6Ii4vdXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHt9O1xuXG51dGlscy5pc0Z1bmN0aW9uID0gZnVuY3Rpb24oZnVuYykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGZ1bmMpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufTtcblxuLy8gQFRPRE8gLSByZW1vdmUgaW4gZmF2b3Igb2YgYE9iamVjdC5hc3NpZ25gXG4vLyBATk9URSBkb25lIGluIHVpIGNvbXBvbmVudHNcbi8vIHV0aWxzLmV4dGVuZCA9IGZ1bmN0aW9uIGV4dGVuZCgpIHtcbi8vICAgLy8gdGhpcyBjYW4gcHJvYmFibHkgaW1wcm92ZWQgaW4gZXM2XG4vLyAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbi8vICAgdmFyIGhvc3QgPSBhcmdzLnNoaWZ0KCk7XG4vLyAgIHZhciBjb3B5ID0gYXJncy5zaGlmdCgpO1xuXG4vLyAgIGZvciAodmFyIGkgaW4gY29weSkgeyBob3N0W2ldID0gY29weVtpXTsgfVxuLy8gICBhcmdzLnVuc2hpZnQoaG9zdCk7XG5cbi8vICAgaWYgKGFyZ3MubGVuZ3RoID4gMSkgeyByZXR1cm4gZXh0ZW5kLmFwcGx5KG51bGwsIGFyZ3MpOyB9XG4vLyAgIHJldHVybiBob3N0O1xuLy8gfTtcblxudmFyIGV4cGxvZGUgPSBmdW5jdGlvbihpdGVtcywgY2IpIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KGl0ZW1zKSkge1xuICAgIGl0ZW1zID0gW2l0ZW1zXTtcbiAgfVxuXG4gIGl0ZW1zLmZvckVhY2goY2IpO1xufTtcblxuLy8gQFRPRE8gLSByZW1vdmUgd2hlbiBhbGwgb2NjdXJlbmNlIHJlbW92ZWQgaW4gZGVwZW5kZW5jaWVzXG4vLyBATk9URSBkb25lIGluIHVpIGNvbXBvbmVudHNcbi8vIGNvbWJpbmVkIGFjY2Vzc29yc1xuLy8gdXRpbHMuZ2V0U2V0ID0gZnVuY3Rpb24gZ2V0U2V0KG9iaiwgcHJvcHMgPSBudWxsLCB2YWx1ZU1vZGUgPSBmYWxzZSl7XG4vLyAgIGlmICghcHJvcHMpIHRocm93IG5ldyBFcnJvcignUHJvcGVydHkgbmFtZSBpcyBtYW5kYXRvcnkuJyk7XG5cbi8vICAgdmFyIGFkZCA9IChwID0gbnVsbCkgPT4ge1xuLy8gICAgIHZhciBfcHJvcCA9IGBfJHtwfWA7XG4vLyAgICAgaWYgKCFvYmouaGFzT3duUHJvcGVydHkoX3Byb3ApKSBvYmpbX3Byb3BdID0gbnVsbDtcblxuLy8gICAgIG9ialtwXSA9IGZ1bmN0aW9uKHZhbHVlID0gbnVsbCkge1xuLy8gICAgICAgaWYgKHZhbHVlID09PSBudWxsKSByZXR1cm4gdGhpc1tfcHJvcF07XG5cbi8vICAgICAgIGlmICghdXRpbHMuaXNGdW5jdGlvbih2YWx1ZSkgJiYgIXZhbHVlTW9kZSkge1xuLy8gICAgICAgICB0aGlzW19wcm9wXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdmFsdWU7IH07XG4vLyAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICB0aGlzW19wcm9wXSA9IHZhbHVlO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICByZXR1cm4gdGhpcztcbi8vICAgICB9O1xuLy8gICB9O1xuXG4vLyAgIGV4cGxvZGUocHJvcHMsIChwKSA9PiBhZGQocCkpO1xuLy8gfTtcblxuLy8gY29tYmluZWQgYWNjZXNzb3JzXG51dGlscy5hY2Nlc3NvcnMgPSB7XG5cbiAgaWRlbnRpdHk6IGZ1bmN0aW9uKG9iaiwgcHJvcHMgPSBudWxsKSB7XG4gICAgaWYgKCFwcm9wcykgdGhyb3cgbmV3IEVycm9yKCdQcm9wZXJ0eSBuYW1lIGlzIG1hbmRhdG9yeS4nKTtcblxuICAgIHZhciBhZGQgPSAocCA9IG51bGwpID0+IHtcbiAgICAgIHZhciBfcHJvcCA9IGBfJHtwfWA7XG4gICAgICBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShfcHJvcCkpIG9ialtfcHJvcF0gPSBudWxsO1xuXG4gICAgICBvYmpbcF0gPSBmdW5jdGlvbih2YWx1ZSA9IG51bGwpIHtcbiAgICAgICAgaWYgKHZhbHVlID09PSBudWxsKSByZXR1cm4gdGhpc1tfcHJvcF07XG4gICAgICAgIHRoaXNbX3Byb3BdID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfTtcbiAgICB9O1xuXG4gICAgZXhwbG9kZShwcm9wcywgKHApID0+IGFkZChwKSk7XG4gIH0sXG5cbiAgZ2V0RnVuY3Rpb246IGZ1bmN0aW9uKG9iaiwgcHJvcHMgPSBudWxsKSB7XG4gICAgaWYgKCFwcm9wcykgdGhyb3cgbmV3IEVycm9yKCdQcm9wZXJ0eSBuYW1lIGlzIG1hbmRhdG9yeS4nKTtcblxuICAgIHZhciBhZGQgPSAocCA9IG51bGwpID0+IHtcbiAgICAgIHZhciBfcHJvcCA9IGBfJHtwfWA7XG4gICAgICBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShfcHJvcCkpIG9ialtfcHJvcF0gPSBudWxsO1xuXG4gICAgICBvYmpbcF0gPSBmdW5jdGlvbih2YWx1ZSA9IG51bGwpIHtcbiAgICAgICAgaWYgKHZhbHVlID09PSBudWxsKSByZXR1cm4gdGhpc1tfcHJvcF07XG5cbiAgICAgICAgaWYgKCF1dGlscy5pc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgICAgIHRoaXNbX3Byb3BdID0gZnVuY3Rpb24oKSB7IHJldHVybiB2YWx1ZTsgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzW19wcm9wXSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfTtcbiAgICB9O1xuXG4gICAgZXhwbG9kZShwcm9wcywgKHApID0+IGFkZChwKSk7XG5cbiAgfSxcblxuICBnZXRWYWx1ZTogZnVuY3Rpb24ob2JqLCBwcm9wcyA9IG51bGwpIHtcbiAgICBpZiAoIXByb3BzKSB0aHJvdyBuZXcgRXJyb3IoJ1Byb3BlcnR5IG5hbWUgaXMgbWFuZGF0b3J5LicpO1xuXG4gICAgdmFyIGFkZCA9IChwID0gbnVsbCkgPT4ge1xuICAgICAgdmFyIF9wcm9wID0gYF8ke3B9YDtcbiAgICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KF9wcm9wKSkgb2JqW19wcm9wXSA9IG51bGw7XG5cbiAgICAgIG9ialtwXSA9IGZ1bmN0aW9uKHZhbHVlID0gbnVsbCkge1xuICAgICAgICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICBpZiAoIXV0aWxzLmlzRnVuY3Rpb24odGhpc1tfcHJvcF0pKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpc1tfcHJvcF07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHRoaXNbX3Byb3BdKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzW19wcm9wXSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH07XG4gICAgfTtcblxuICAgIGV4cGxvZGUocHJvcHMsIChwKSA9PiBhZGQocCkpO1xuICB9XG59O1xuXG5cbi8vIHJldHVybiBhIHVuaXF1ZSBpZGVudGlmaWVyIHdpdGggYW4gb3B0aW9ubmFsIHByZWZpeFxudmFyIF9jb3VudGVycyA9IHsgJyc6IDAgfTtcblxudXRpbHMudW5pcXVlSWQgPSBmdW5jdGlvbihwcmVmaXggPSAnJykge1xuICBpZiAocHJlZml4ICYmICFfY291bnRlcnNbcHJlZml4XSkge1xuICAgIF9jb3VudGVyc1twcmVmaXhdID0gMDtcbiAgfVxuXG4gIHZhciBpZCA9IF9jb3VudGVyc1twcmVmaXhdO1xuICBpZiAocHJlZml4KSB7IGlkID0gW3ByZWZpeCwgaWRdLmpvaW4oJy0nKTsgfVxuICBfY291bnRlcnNbcHJlZml4XSArPSAxO1xuXG4gIHJldHVybiBpZDtcbn07XG5cbi8vIHN0eWxlIGluamVjdGlvblxudmFyIF9zaGVldDtcblxudmFyIGNyZWF0ZVN0eWxlU2hlZXQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgLy8gd2Via2l0IGhhY2s6IGNmLiBodHRwOi8vZGF2aWR3YWxzaC5uYW1lL2FkZC1ydWxlcy1zdHlsZXNoZWV0c1xuICBlbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJykpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVsKTtcbiAgX3NoZWV0ID0gZWwuc2hlZXQ7XG59XG5cbnV0aWxzLmFkZENzc1J1bGUgPSBmdW5jdGlvbihzZWxlY3RvciwgcnVsZXMsIHBvc2l0aW9uID0gMCkge1xuICBpZiAoIV9zaGVldCkgeyBjcmVhdGVTdHlsZVNoZWV0KCk7IH1cblxuICB2YXIgcnVsZSA9IE9iamVjdC5rZXlzKHJ1bGVzKS5tYXAoKGtleSkgPT4ge1xuICAgIHJldHVybiBrZXkgKyAnOicgKyBydWxlc1trZXldO1xuICB9KS5qb2luKCc7Jyk7XG5cbiAgcnVsZSA9IHNlbGVjdG9yICsgJ3snICsgcnVsZSArICd9JztcbiAgX3NoZWV0Lmluc2VydFJ1bGUocnVsZSwgcG9zaXRpb24pO1xufVxuXG4vLyBmcm9tIHVuZGVyc2NvcmUgMS43LjBcbnV0aWxzLnRocm90dGxlID0gZnVuY3Rpb24oZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICB2YXIgY29udGV4dCwgYXJncywgcmVzdWx0O1xuICB2YXIgdGltZW91dCA9IG51bGw7XG4gIHZhciBwcmV2aW91cyA9IDA7XG4gIGlmICghb3B0aW9ucykgb3B0aW9ucyA9IHt9O1xuICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICBwcmV2aW91cyA9IG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UgPyAwIDogbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgdGltZW91dCA9IG51bGw7XG4gICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgfTtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICBpZiAoIXByZXZpb3VzICYmIG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UpIHByZXZpb3VzID0gbm93O1xuICAgIHZhciByZW1haW5pbmcgPSB3YWl0IC0gKG5vdyAtIHByZXZpb3VzKTtcbiAgICBjb250ZXh0ID0gdGhpcztcbiAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgIGlmIChyZW1haW5pbmcgPD0gMCB8fCByZW1haW5pbmcgPiB3YWl0KSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgIHByZXZpb3VzID0gbm93O1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgIH0gZWxzZSBpZiAoIXRpbWVvdXQgJiYgb3B0aW9ucy50cmFpbGluZyAhPT0gZmFsc2UpIHtcbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCByZW1haW5pbmcpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufTtcblxuLy9cbnV0aWxzLnRvRnJvbnQgPSBmdW5jdGlvbihpdGVtKSB7XG4gIGl0ZW0ucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChpdGVtKTtcbn07XG5cbnV0aWxzLlVJTG9vcCA9IHJlcXVpcmUoJy4vbGliL3VpLWxvb3AnKTtcbnV0aWxzLm9ic2VydmUgPSByZXF1aXJlKCcuL2xpYi9vYnNlcnZlJyk7XG5cbi8vIGNyZWF0ZSBhIGRlZmF1bHQgZGF0YSBhY2Nlc3NvciBmb3IgZWFjaCBnaXZlbiBhdHRyc1xuXG4vLyB2YXIgZGVmYXVsdERhdGFNYXAgPSBmdW5jdGlvbiBkZWZhdWx0RGF0YU1hcChvYmosIGF0dHJzKSB7XG4vLyAgIGF0dHJzLmZvckVhY2goKGF0dHIpID0+IHtcbi8vICAgICBvYmpbYXR0cl0oKGQsIHYgPSBudWxsKSA9PiB7XG4vLyAgICAgICBpZiAodiA9PT0gbnVsbCkgcmV0dXJuIGQueTtcbi8vICAgICAgIGRbYXR0cl0gPSArdjtcbi8vICAgICAgIHJldHVybiBvYmo7XG4vLyAgICAgfSlcbi8vICAgfSk7XG4vLyB9O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gdXRpbHM7XG4iXX0=