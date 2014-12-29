var UILoop = (function(){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var proto$0={};

  function UILoop(fps) {
    this.fps = fps || 60;
    this.__callbacks = [];
    this.__running = false;
    this.__animationFrameId = null;
  }DP$0(UILoop,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.register = function(func) {var args = arguments[1];if(args === void 0)args = [];var ctx = arguments[2];if(ctx === void 0)ctx = null;
    var ticket = { func: func, args: args, ctx: ctx };
    this.__callbacks.push(ticket);
  };

  proto$0.start = function() {var this$0 = this;
    if (this.__running) { return; }

    this.__running = true;
    this.__animationFrameId = window.requestAnimationFrame(function()  {return this$0.draw()});
  };

  proto$0.stop = function() {
    if (!this.__running) { return; }

    this.__running = false;
    window.cancelAnimationFrame(this.__animationFrameId);
  };

  proto$0.exec = function() {
    if (!this.__callbacks.length) { return; }

    // callback must be called in the same order they were registered
    for (var i = 0; i < this.__callbacks.length; i++) {
      var ticket = this.__callbacks[i];
      ticket.func.apply(ticket.ctx, ticket.args);
      this.__callbacks.splice(i, 1);
      // decrement to keep in sync with callbacks length
      i = i - 1;
    }
  };

  proto$0.draw = function(e) {var this$0 = this;
    if (!this.__running) { return; }
    
    this.exec();
    this.__animationFrameId = window.requestAnimationFrame(function()  {return this$0.draw()});
  };
MIXIN$0(UILoop.prototype,proto$0);proto$0=void 0;return UILoop;})();

module.exports = UILoop;