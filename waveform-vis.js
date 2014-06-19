!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.waveformVis=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/* globals d3 */
"use strict";

var getSet = window.getSet || _dereq_('get-set');
 // used with brfs transform

var waveform = {};

Object.defineProperty(waveform, 'dname', { writable: true });
Object.defineProperty(waveform, 'xScale', { writable: true });
Object.defineProperty(waveform, 'yScale', { writable: true });
Object.defineProperty(waveform, 'base', { writable: true });
Object.defineProperty(waveform, 'g', { writable: true });
Object.defineProperty(waveform, '_data', {writable: true});

Object.defineProperty(waveform, 'on', { enumerable: true, writable: true});
Object.defineProperty(waveform, 'trigger', {writable: true});

Object.defineProperty(waveform, 'init', {
  value: function(options) {

    getSet(this)([
      'name', 'cache', 'width', 'height', 'top', 'precision', 'opacity',
      'xDomain', 'xRange', 'yDomain', 'yRange',
      'color'
    ]);

    this.targetStart = 0;

    this.color("#000");

    // content of the worker loaded as text via brfs transform
    var blob = new Blob(["self.addEventListener('message', function(e) {\n\n  var data = e.data;\n  var message = data.message;\n\n  switch (data.cmd) {\n    \n    case 'downSample':\n      downSample(message.data, message.width, message.step);\n      break;\n  }\n\n}, false);\n\nfunction downSample(data, width, step) {\n  var ret = [];\n\n  for (var i = 0; i < width; i++) {\n    var o = {};\n    var min = 1.0;\n    var max = -1.0;\n    \n    for (var j = 0; j < step; j++) {\n      var datum = data[(i * step) + j];\n      if (datum < min) min = datum;\n      if (datum > max) max = datum;\n    }\n\n    o.max = max;\n    o.min = min;\n    ret.push(o);\n  }\n\n  postMessage({cmd: 'downSample', message: ret});\n}"], { type: "text/javascript" });

    // inlined worker
    this.resampler = new Worker(window.URL.createObjectURL(blob));
    this.resampler.addEventListener('message', this.resamplerCmd.bind(this), false);

    return this;
  }
});

Object.defineProperty(waveform, 'data', {
  enumerable: true, value: function(data){
    if(!arguments.length) return this._data;
    if(data.sampleRate) this.sampleRate = data.sampleRate;
    if(data.duration) this.duration = data.duration;

    this._data = data;
    return this;
  }
  
});

Object.defineProperty(waveform, 'load', {
  enumerable: true, value: function(base){
    this.base = base; // bind the baseTimeLine
    this.on = base.on;
    this.trigger = base.trigger;
    this.unitClass = this.name() + '-item';
  }
});

Object.defineProperty(waveform, 'bind', {
  enumerable: true, value: function(g) {
    this.g = g;
    this.height(this.height() || this.base.height());
    this.width(this.width() || this.base.width());

    // this.downSample(this.data(), this.width() * 0.5);
    this.downSample(this.data(), this.precision());
  }
});

Object.defineProperty(waveform, 'resamplerCmd', {
  enumerable: true, value: function(e){
    var data = e.data;
    var msg = data.message;

    switch (data.cmd) {

      case 'downSample':
        this.setDownsample(msg);
        break;

      default:
        console.error('Unknown command: ' + data.msg);
        break;

    }
  }
});

Object.defineProperty(waveform, 'downSample', {
  value: function(data, step){
    var that = this;
    var resampler = this.resampler;
    var width = data.length / step;

    resampler.postMessage({cmd: 'downSample', message: {data: data, width: width, step: step}});
  }
});

Object.defineProperty(waveform, 'setDownsample', {
  value: function(ret) {
   
    this.cache(ret);
    this.xxScale = d3.scale.linear().domain([0, ret.length]).range(this.base.xScale.domain());

    // this.xScale.domain([0, ret.length]);
    // this.originalXscale = this.xScale.copy();

    this.update();
  }
});

Object.defineProperty(waveform, 'xZoom', {
  enumerable: true, value: function(zoom) {
    var val = zoom.value;
    this.factor = zoom.factor;
    var cache = this.cache();
    var min = this.base.xScale.domain()[0],
        max = this.base.xScale.domain()[1];

    // this.draw(cache.slice(this.xxScale.invert(min), this.xxScale.invert(max)));
    this.draw();

  }
});

Object.defineProperty(waveform, 'update', {
  enumerable: true, value: function() {
    var that = this;
    var el = this.base.el;
    var sel = this.g;

    sel.append("foreignObject")
      .attr("width", this.width())
      .attr("height", this.height())
    .append("xhtml:canvas")
      .attr("width", this.width())
      .attr("height", this.height())
      .classed(this.unitClass, true);

    this.draw();
  }
});


Object.defineProperty(waveform, 'draw', {
  enumerable: true, configurable: true, value: function(data) {
    data = data || this.cache();

    var that = this;
    var el = this.g.selectAll('.' + this.unitClass).node();

    this.ctx = this.ctx || el.getContext('2d');
    var ctx = this.ctx;
    var width = this.width();
    var height = this.height();
    
    el.width = width;
    el.height = height;

    var amp = height / 2;

    // rectangles
    // ----------
    // var w = that.xScale(data[1].x) - that.xScale(data[0].x)+1;
    // data.forEach(function(d) {
    //   that.ctx.fillRect(that.xScale(d.x), (1 + that.yScale(d.min)), w, Math.max(1, (that.yScale(d.max) - that.yScale(d.min))));
    // });

    // line
    // ----------
    // var i, n = data.length;

    // function min(d) {return that.yScale(d.min);}
    // function max(d) {return that.yScale(d.max);}
    
    // function x(d) {return that.xScale(d.x);}
    // ctx.beginPath();
    // ctx.moveTo(x(data[0]), amp);
    // for (i = 2; i < n - 1; i ++) {
      
    //   var xc = [x(data[i]), amp];

    //   ctx.quadraticCurveTo(xc[0], xc[1], x(data[i]), max(data[i]));
    //   ctx.lineTo(x(data[i]), min(data[i]));
    // }
    // ctx.stroke();
    
    // trapez
    // ------
    var i, n = data.length;

    function min(d) {return that.yScale(d.min);}
    function max(d) {return that.yScale(d.max);}
    
    function x(i) {return that.base.xScale(that.xxScale(i));}
    
    ctx.strokeStyle = this.color();
    ctx.fillStyle = this.color();
    
    for (i = 2; i < n - 1; i ++) {
      ctx.beginPath();
      ctx.moveTo(x(i), amp);
      ctx.lineTo(x(i), max(data[i]));
      ctx.lineTo(x(i+1), max(data[i+1]));
      ctx.lineTo(x(i+1), min(data[i+1]));
      ctx.lineTo(x(i), min(data[i]));
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    }

  }
});

module.exports = function(options) {
  return Object.create(waveform.init(options));
};
},{"get-set":3}],2:[function(_dereq_,module,exports){
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

},{}],3:[function(_dereq_,module,exports){

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