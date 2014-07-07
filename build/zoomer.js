!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.zoomer=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var getSet = _dereq_('get-set');

var anchor = {};

Object.defineProperty(anchor, 'dname', { writable: true });
Object.defineProperty(anchor, 'xBaseDomain', { writable: true });
Object.defineProperty(anchor, 'yScale', { writable: true });
Object.defineProperty(anchor, 'base', { writable: true });
Object.defineProperty(anchor, 'g', { writable: true });

Object.defineProperty(anchor, 'on', { enumerable: true, writable: true});
Object.defineProperty(anchor, 'trigger', {writable: true});

Object.defineProperty(anchor, 'init', {
  value: function(options) {

    getSet(this)(['name']);
    return this;
  }
});

Object.defineProperty(anchor, 'load', {
  enumerable: true, value: function(base){
    this.base = base; // bind the baseTimeLine
    this.on = base.on;
    this.trigger = base.trigger;
    this.unitClass = this.name() + '-item';
  }
});

Object.defineProperty(anchor, 'bind', {
  enumerable: true, value: function(g) {
    this.g = g;
    this.update();
  }
});

Object.defineProperty(anchor, 'position', {
  enumerable: true, value: function(pos) {
    if (!arguments.length) return this._position;
    this._position = this.base.xScale.invert(pos);
    this.update();
  }
});

Object.defineProperty(anchor, 'update', {
  enumerable: true, value: function() {
    var that = this;
    var el = this.base.el;
    var p = function(d) {
      return that.base.xScale(d) || 0;
    };

    var sel = this.g.selectAll('.' + this.unitClass)
      .data([this.position()]);
    
    sel.enter()
        .append("line")
        .classed(this.unitClass, true)
        .style("stroke-width", 1)
        .style("stroke", '#f00')
        .attr("x1", p)
        .attr("x2", p)
        .attr("y1", 0)
        .attr("y2", this.base.height());

    sel.exit().remove();
    this.draw();
  }
});


 Object.defineProperty(anchor, 'xZoom', {
  enumerable: true, value: function(val) {
    this.draw();
  }
});

Object.defineProperty(anchor, 'draw', {
  enumerable: true, configurable: true, value: function(el) {
    el = el || this.g.selectAll('.' + this.unitClass);
    var that = this;

    var p = function(d) {
      return that.base.xScale(d) || 0;
    };

    el
      .attr("x1", p)
      .attr("x2", p);
  }
});

module.exports = function(options) {
  return Object.create(anchor.init());
};
},{"get-set":4}],2:[function(_dereq_,module,exports){
/* global d3 */

"use strict";

var events = _dereq_('events');
var eventEmitter = new events.EventEmitter();
var getSet = _dereq_('get-set');
var anchorVis = _dereq_('./anchor');

var zoomer;

// property descriptor
var baseDesc = {

  // swapX: { enumerable: true, writable: true },
  // swapY: { enumerable: true, writable: true },

  on: { enumerable: true, writable: true },
  trigger: { writable: true },
  
  // init
  // ----

  init: {
    value: function(options) {
      options = options || {}; // fail safe
      
      // generic getters(setters) accessors and defaults
      var addGS = getSet(this)([
          'graph'
        ]);

      this.on = eventEmitter.on;
      this.trigger = eventEmitter.emit;

      return this;
    }
  },

  // draws the layers
  draw: {
    enumerable: true, value: function(sel){

      var that = zoomer; // binding fix when called from d3
      var graph = that.graph();
      var anch = anchorVis().name('anch');
      graph.layer(anch);
      // graph.draw(); // redraws

      sel.each(function() {
        var zx = 0;
        var zy = 0;
        var xponent = 1.005;
        var zoomerX;

        d3.select(this).on('mousedown', function() {
          zoomerX = this.getBoundingClientRect().left;
          zy = d3.event.pageY;
          // zx = d3.event.offsetX;
          zx = parseInt(d3.event.pageX - zoomerX, 10);
          
          // update position of the anchor on click
          graph.layers['anch'].position(zx);

          document.body.classList.add('zooming');

          // mouseMove
          function mmove(evt) {
            if(evt.which === 1) {

              var deltaY = zy - evt.pageY;
              var deltaX = zx - (parseInt(evt.pageX - zoomerX, 10));

              var zoomVal = Math.abs(deltaY);
              var zFactor = (deltaY > 0)? Math.pow(xponent, zoomVal) : 1 / Math.pow(xponent, zoomVal);
              var e = {anchor: zx, factor: zFactor, delta: {x: deltaX, y: deltaY}};
              that.trigger('mousemove', e);
            }
          }

          // mouseUp
          function mup() {
            document.body.removeEventListener('mousemove', mmove);
            document.body.removeEventListener('mouseup', mup);
            document.body.classList.remove('zooming');
            that.trigger('mouseup');
          }

          document.body.addEventListener('mousemove', mmove);
          document.body.addEventListener('mouseup', mup);

        });
      });
      
      return this;
    }
  }


};


// exported factory
// ----------------
module.exports = function(options) {
  zoomer = Object.create({}, baseDesc);
  return zoomer.init(options); // return initiated object
};
},{"./anchor":1,"events":3,"get-set":4}],3:[function(_dereq_,module,exports){
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
      } else {
        throw TypeError('Uncaught, unspecified "error" event.');
      }
      return false;
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
},{"events":3}]},{},[2])
(2)
});