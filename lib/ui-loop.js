"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];
var UILoop = (function () {
  function UILoop(fps) {
    _babelHelpers.classCallCheck(this, UILoop);

    this.fps = fps || 60;

    this.__queue = [];
    this.__isRunning = false;
    this.__rAFId = null;

    this.then = Date.now();
    this.interval = 1000 / fps;
  }

  _babelHelpers.prototypeProperties(UILoop, null, {
    register: {
      value: function register(func) {
        var args = arguments[1] === undefined ? [] : arguments[1];
        var ctx = arguments[2] === undefined ? null : arguments[2];
        var ticket = { func: func, args: args, ctx: ctx };
        this.__queue.push(ticket);
      },
      writable: true,
      configurable: true
    },
    hasRegisteredCallbacks: {
      value: function hasRegisteredCallbacks() {
        return !!this.__queue.length;
      },
      writable: true,
      configurable: true
    },
    start: {
      value: function start() {
        var _this = this;
        if (this.__isRunning) {
          return;
        }

        this.__isRunning = true;
        this.__rAFId = window.requestAnimationFrame(function () {
          return _this.draw();
        });
      },
      writable: true,
      configurable: true
    },
    stop: {
      value: function stop() {
        if (!this.__isRunning) {
          return;
        }

        this.__isRunning = false;
        window.cancelAnimationFrame(this.__rAFId);
      },
      writable: true,
      configurable: true
    },
    exec: {
      value: function exec() {
        if (!this.__queue.length) {
          return;
        }

        // callbacks must be called in the same order they were registered FIFO
        for (var i = 0; i < this.__queue.length; i++) {
          var ticket = this.__queue[i];
          ticket.func.apply(ticket.ctx, ticket.args);
          this.__queue.splice(i, 1);
          // decrement to keep in sync with callbacks length
          i = i - 1;
        }
      },
      writable: true,
      configurable: true
    },
    draw: {
      value: function draw(e) {
        var _this = this;
        if (!this.__isRunning) {
          return;
        }

        this.__rAFId = window.requestAnimationFrame(function () {
          return _this.draw();
        });

        this.now = Date.now();
        this.delta = this.now - this.then;

        if (this.delta > this.interval) {
          this.then = this.now - this.delta % this.interval;
          this.exec();
        }
      },
      writable: true,
      configurable: true
    }
  });

  return UILoop;
})();

module.exports = UILoop;

//# sourceMappingURL=data:application/json;base64,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S0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDOUIsY0FBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQUFBQyxDQUFDO0FBQ3BELGNBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNiO09BQ0Y7Ozs7OztTQTdERyxNQUFNOzs7QUFnRVosTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMiLCJmaWxlIjoiLi9saWIvdWktbG9vcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFVJTG9vcCB7XG5cbiAgY29uc3RydWN0b3IoZnBzKSB7XG4gICAgdGhpcy5mcHMgPSBmcHMgfHwgNjA7XG5cbiAgICB0aGlzLl9fcXVldWUgPSBbXTtcbiAgICB0aGlzLl9faXNSdW5uaW5nID0gZmFsc2U7XG4gICAgdGhpcy5fX3JBRklkID0gbnVsbDtcblxuICAgIHRoaXMudGhlbiA9IERhdGUubm93KCk7XG4gICAgdGhpcy5pbnRlcnZhbCA9IDEwMDAgLyBmcHM7XG4gIH1cblxuICByZWdpc3RlcihmdW5jLCBhcmdzID0gW10sIGN0eCA9IG51bGwpIHtcbiAgICB2YXIgdGlja2V0ID0geyBmdW5jLCBhcmdzLCBjdHggfTtcbiAgICB0aGlzLl9fcXVldWUucHVzaCh0aWNrZXQpO1xuICB9XG5cbiAgaGFzUmVnaXN0ZXJlZENhbGxiYWNrcygpIHtcbiAgICByZXR1cm4gISF0aGlzLl9fcXVldWUubGVuZ3RoO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgaWYgKHRoaXMuX19pc1J1bm5pbmcpIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLl9faXNSdW5uaW5nID0gdHJ1ZTtcbiAgICB0aGlzLl9fckFGSWQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuZHJhdygpKTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgaWYgKCF0aGlzLl9faXNSdW5uaW5nKSB7IHJldHVybjsgfVxuXG4gICAgdGhpcy5fX2lzUnVubmluZyA9IGZhbHNlO1xuICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLl9fckFGSWQpO1xuICB9XG5cbiAgZXhlYygpIHtcbiAgICBpZiAoIXRoaXMuX19xdWV1ZS5sZW5ndGgpIHsgcmV0dXJuOyB9XG5cbiAgICAvLyBjYWxsYmFja3MgbXVzdCBiZSBjYWxsZWQgaW4gdGhlIHNhbWUgb3JkZXIgdGhleSB3ZXJlIHJlZ2lzdGVyZWQgRklGT1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fX3F1ZXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdGlja2V0ID0gdGhpcy5fX3F1ZXVlW2ldO1xuICAgICAgdGlja2V0LmZ1bmMuYXBwbHkodGlja2V0LmN0eCwgdGlja2V0LmFyZ3MpO1xuICAgICAgdGhpcy5fX3F1ZXVlLnNwbGljZShpLCAxKTtcbiAgICAgIC8vIGRlY3JlbWVudCB0byBrZWVwIGluIHN5bmMgd2l0aCBjYWxsYmFja3MgbGVuZ3RoXG4gICAgICBpID0gaSAtIDE7XG4gICAgfVxuICB9XG5cbiAgZHJhdyhlKSB7XG4gICAgaWYgKCF0aGlzLl9faXNSdW5uaW5nKSB7IHJldHVybjsgfVxuXG4gICAgdGhpcy5fX3JBRklkID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLmRyYXcoKSk7XG5cbiAgICB0aGlzLm5vdyA9IERhdGUubm93KCk7XG4gICAgdGhpcy5kZWx0YSA9IHRoaXMubm93IC0gdGhpcy50aGVuO1xuXG4gICAgaWYgKHRoaXMuZGVsdGEgPiB0aGlzLmludGVydmFsKSB7XG4gICAgICB0aGlzLnRoZW4gPSB0aGlzLm5vdyAtICh0aGlzLmRlbHRhICUgdGhpcy5pbnRlcnZhbCk7XG4gICAgICB0aGlzLmV4ZWMoKTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBVSUxvb3A7Il19