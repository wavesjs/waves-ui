var UILoop = (function(){var DP$0 = Object.defineProperty;"use strict";

  function UILoop(fps) {
    this.fps = fps || 60;
    this.__callbacks = [];
    this.__running = false;
    this.__animationFrameId = null;

    this.then = Date.now();
    this.interval = 1000/fps;
  }DP$0(UILoop, "prototype", {"configurable": false, "enumerable": false, "writable": false});

  UILoop.prototype.register = function(func) {var args = arguments[1];if(args === void 0)args = [];var ctx = arguments[2];if(ctx === void 0)ctx = null;
    var ticket = { func: func, args: args, ctx: ctx };
    this.__callbacks.push(ticket);
  }

  UILoop.prototype.start = function() {var this$0 = this;
    if (this.__running) { return; }

    this.__running = true;
    this.__animationFrameId = window.requestAnimationFrame(function()  {return this$0.draw()});
  }

  UILoop.prototype.stop = function() {
    if (!this.__running) { return; }

    this.__running = false;
    window.cancelAnimationFrame(this.__animationFrameId);
  }

  UILoop.prototype.exec = function() {
    if (!this.__callbacks.length) { return; }

    // callback must be called in the same order they were registered
    for (var i = 0; i < this.__callbacks.length; i++) {
      var ticket = this.__callbacks[i];
      ticket.func.apply(ticket.ctx, ticket.args);
      this.__callbacks.splice(i, 1);
      // decrement to keep in sync with callbacks length
      i = i - 1;
    }
  }

  UILoop.prototype.draw = function(e) {var this$0 = this;
    if (!this.__running) { return; }
    
    this.__animationFrameId = window.requestAnimationFrame(function()  {return this$0.draw()});

    this.now = Date.now();
    this.delta = this.now - this.then;

    if (this.delta > this.interval) {
      this.then = this.now - (this.delta % this.interval);
      this.exec();
    }
  }
;return UILoop;})();

module.exports = UILoop;