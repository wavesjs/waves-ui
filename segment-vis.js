!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.segmentVis=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){

"use strict";

var getSet = _dereq_('get-set');
var extend = _dereq_('extend');

function isFunction(func) {
  return Object.prototype.toString.call(func) === '[object Function]';
}

// helper data mapping functions
function defDataMap(prop, def) {
  if (arguments.length < 2) def = null;

  return function(d, v) {
    if (isFunction(def)) def = def();
    if (arguments.length === 1) return d && d[prop] || def;
    d[prop] = v;
  };
}

var segDesc = {

  unitClass: { writable: true },
  dname: { writable: true },
  xBaseDomain: { writable: true },
  yScale: { writable: true },
  base: { writable: true },
  g: { writable: true },

  // handler width
  hdWidth: { writable: true },

  // "inherit" events,
  on: { enumerable: true, writable: true},
  trigger: {writable: true},

  init: {
    value: function() {

      // getters(setters) to be added
      getSet(this)([
        'name', 'height', 'top', 'data', 'opacity',
        'dataView', 'xDomain', 'xRange', 'yDomain', 'yRange',
        'dStart', 'dDuration', 'dHeight', 'dY', 'dColor', 'dSortIndex',
        'each'
      ]);

      // defaults
      this.minWidth = 1;
      this.selectable = false;
      this.hdWidth = 3;
      this.height(0);
      this.opacity(0.70);

      // default data accessors defDataMap(property, defaultvalue)
      this.dStart(defDataMap('start', 0));
      this.dDuration(defDataMap('duration', 0));
      this.dHeight(defDataMap('height', this.height));
      this.dY(defDataMap('y', 0));
      this.dColor(defDataMap('color', '#ccc'));

      return this;
    }
  },

  load: {
    enumerable: true, configurable: true, value: function(base){
      this.base = base; // bind the baseTimeLine
      this.unitClass = this.name() + '-item';
    }
  },

  bind: {
    value: function(g) {
      this.g = g;
      this.update();
    }
  },

  update: {
    enumerable: true, value: function(data) {
      data = data || this.data() || this.base.data();
      this.data(data);
      // this.untouchedXscale = this.base.xScale.copy();
      // this.untouchedYscale = this.base.yScale.copy();
      this.zoomFactor = this.base.zoomFactor;

      var sel = this.g.selectAll('.' + this.unitClass)
            .data(data, this.dSortIndex());

      var g = sel.enter()
      .append('g')
        .attr("class", this.unitClass)
        .attr('id', function(d) {
          return d.id;
        });
        // .attr("transform", "translate(0, 0)");

      g.append('rect')
        .attr("class", 'seg')
        .attr('fill-opacity', this.opacity());

      g.append("line")
        .attr("class", 'handle left')
        .style("stroke-width", this.hdWidth)
        .attr('stroke-opacity', 0);

      g.append("line")
        .attr("class", 'handle right')
        .style("stroke-width", this.hdWidth)
        .attr('stroke-opacity', 0);

      sel.exit().remove();
      this.draw();
    }
  },

  xZoom: {
    enumerable: true, value: function(val) {
      // console.log(this.xBaseDomain);
      // console.log('zooom');
      var that = this;
      var xScale = this.base.xScale;
      var min = xScale.domain()[0],
          max = xScale.domain()[1];

      var nuData = [];
      // var dv = extend(this.defaultDataView(), this.dataView());

      this.data().forEach(function(d, i) {
        var start = that.dStart()(d);
        var duration = that.dDuration()(d);
        var end = start + duration;
        // if((start + dv.duration(d)) <= max && start >= min) nuData.push(d);
        if((start > min && end < max) || (start < min && end < max && end > min) || (start > min && start < max && end > max) || (end > max && start < min)) nuData.push(d);
        // if((end < min && start < min) || (end > max && start > max)) nuData.push(d);
      });

      // this.update(nuData);
      this.update();
      // var xAxis = this.graph[this.iName];
      // xAxis.scale(xScale);

      // this.g.call(xAxis);
    }
  },

  draw: {
    enumerable: true, configurable: true, value: function(el) {
      el = el || this.g.selectAll('.' + this.unitClass);

      var that = this;
      var g = this.g;
      var halfHandler = this.hdWidth * 0.5;
      // var dv = extend(this.defaultDataView(), this.dataView());
      var base = this.base;
      var xScale = this.base.xScale;
      var max = Math.max;

      // data mappers
      var dStart = this.dStart();
      var dDuration = this.dDuration();
      var dY = this.dY();
      var dColor = this.dColor();
      var dHeight = this.dHeight();

      var x = function(d) { return xScale(dStart(d)); };
      var w = function(d) { return max(that.minWidth,
        (xScale(dStart(d) + dDuration(d))) - xScale(dStart(d))); };

      // var h = function(d) { return max(that.yScale(dv.height(d)), 1); };
      var h = function(d) { return max(base.height() - that.yScale(dHeight(d)), 1); };
      var y = function(d) { return that.yScale(dY(d)) - h(d); };

      // handlers
      var lx = function(d) { return xScale(dStart(d)) + halfHandler; };
      var rx = function(d) {
        var _w = (xScale(dStart(d) + dDuration(d))) - xScale(dStart(d));
        var rpos = xScale(dStart(d) + dDuration(d)) - halfHandler;
        return (_w < that.minWidth) ? dStart(d) + ((that.minWidth + that.hdWidth) * 2 ) : rpos;
      };

      var lrh = function(d) { return y(d) + h(d); };
      var color = function(d) { return dColor(d); };

      var segs = el.selectAll('.seg');

      segs.attr('x', x)
        .attr('y', y)

        .attr('width', w)
        .attr('height', h)

        .attr('fill', color);

      if(!!this.each()) segs.each(this.each());

      el.selectAll('.handle.left')
        .attr("x1", lx)
        .attr("x2", lx)

        .attr("y1", y)
        .attr("y2", lrh)

        .attr("fill", color)
        .style("stroke", color);

      el.selectAll('.handle.right')
        .attr("x1", rx)
        .attr("x2", rx)

        .attr("y1", y)
        .attr("y2", lrh)

        .attr("fill", color)
        .style("stroke", color);
    }
  }

};

module.exports = function createBaseTimeline(options){
  var segmenter = Object.create({}, segDesc);
  return segmenter.init();
};

},{"extend":3,"get-set":4}],2:[function(_dereq_,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],3:[function(_dereq_,module,exports){
var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;
var undefined;

var isPlainObject = function isPlainObject(obj) {
	"use strict";
	if (!obj || toString.call(obj) !== '[object Object]' || obj.nodeType || obj.setInterval) {
		return false;
	}

	var has_own_constructor = hasOwn.call(obj, 'constructor');
	var has_is_property_of_method = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !has_own_constructor && !has_is_property_of_method) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {}

	return key === undefined || hasOwn.call(obj, key);
};

module.exports = function extend() {
	"use strict";
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === "boolean") {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if (typeof target !== "object" && typeof target !== "function" || target == undefined) {
			target = {};
	}

	for (; i < length; ++i) {
		// Only deal with non-null/undefined values
		if ((options = arguments[i]) != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target === copy) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
					if (copyIsArray) {
						copyIsArray = false;
						clone = src && Array.isArray(src) ? src : [];
					} else {
						clone = src && isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[name] = extend(deep, clone, copy);

				// Don't bring in undefined values
				} else if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};


},{}],4:[function(_dereq_,module,exports){

"use strict";

var events = _dereq_('events');
var ee = new events.EventEmitter();

module.exports = getSet;


function add(obj, prop, triggers) {

  var _prop = '_' + prop;

    // does it trigger on change?
    triggers = triggers || false;

    // define private properties
    Object.defineProperty(obj, _prop, { // defaults
      configurable: true,
      writable: true
    });

    // d3/jquery getter(setter) paradigm
    Object.defineProperty(obj, prop, {
      enumerable: true, configurable: true, value: function(val) {

        if (arguments.length === 0) return obj[_prop];
        obj[_prop] = val;

        // bind events if
        if (triggers) {
          if (!obj.hasOwnProperty('on')) obj.on = ee.on;
          if (!obj.hasOwnProperty('emit')) obj.trigger = ee.emit;
          obj.trigger(prop + ':changed', val);
        }

        return obj;
      }
    });
}

function getSet(obj) {

  return function (prop, triggers) {

    if (Array.isArray(prop)) {
      
      prop.forEach(function (p) {
        add(obj, p, triggers);
      });

    } else {
      add(obj, prop, triggers);
    }

    return add;
  };
}
},{"events":2}]},{},[1])
(1)
});