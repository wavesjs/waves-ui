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
//# sourceMappingURL=data:application/json;base64,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Q0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUM5QixjQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxBQUFDLENBQUM7QUFDcEQsY0FBSSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ2I7T0FDRjs7Ozs7O1NBN0RHLE1BQU07OztBQWdFWixNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyIsImZpbGUiOiJlczYvaGVscGVycy96b29tZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBVSUxvb3Age1xuXG4gIGNvbnN0cnVjdG9yKGZwcykge1xuICAgIHRoaXMuZnBzID0gZnBzIHx8IDYwO1xuXG4gICAgdGhpcy5fX3F1ZXVlID0gW107XG4gICAgdGhpcy5fX2lzUnVubmluZyA9IGZhbHNlO1xuICAgIHRoaXMuX19yQUZJZCA9IG51bGw7XG5cbiAgICB0aGlzLnRoZW4gPSBEYXRlLm5vdygpO1xuICAgIHRoaXMuaW50ZXJ2YWwgPSAxMDAwIC8gZnBzO1xuICB9XG5cbiAgcmVnaXN0ZXIoZnVuYywgYXJncyA9IFtdLCBjdHggPSBudWxsKSB7XG4gICAgdmFyIHRpY2tldCA9IHsgZnVuYywgYXJncywgY3R4IH07XG4gICAgdGhpcy5fX3F1ZXVlLnB1c2godGlja2V0KTtcbiAgfVxuXG4gIGhhc1JlZ2lzdGVyZWRDYWxsYmFja3MoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5fX3F1ZXVlLmxlbmd0aDtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIGlmICh0aGlzLl9faXNSdW5uaW5nKSB7IHJldHVybjsgfVxuXG4gICAgdGhpcy5fX2lzUnVubmluZyA9IHRydWU7XG4gICAgdGhpcy5fX3JBRklkID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLmRyYXcoKSk7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIGlmICghdGhpcy5fX2lzUnVubmluZykgeyByZXR1cm47IH1cblxuICAgIHRoaXMuX19pc1J1bm5pbmcgPSBmYWxzZTtcbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5fX3JBRklkKTtcbiAgfVxuXG4gIGV4ZWMoKSB7XG4gICAgaWYgKCF0aGlzLl9fcXVldWUubGVuZ3RoKSB7IHJldHVybjsgfVxuXG4gICAgLy8gY2FsbGJhY2tzIG11c3QgYmUgY2FsbGVkIGluIHRoZSBzYW1lIG9yZGVyIHRoZXkgd2VyZSByZWdpc3RlcmVkIEZJRk9cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX19xdWV1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHRpY2tldCA9IHRoaXMuX19xdWV1ZVtpXTtcbiAgICAgIHRpY2tldC5mdW5jLmFwcGx5KHRpY2tldC5jdHgsIHRpY2tldC5hcmdzKTtcbiAgICAgIHRoaXMuX19xdWV1ZS5zcGxpY2UoaSwgMSk7XG4gICAgICAvLyBkZWNyZW1lbnQgdG8ga2VlcCBpbiBzeW5jIHdpdGggY2FsbGJhY2tzIGxlbmd0aFxuICAgICAgaSA9IGkgLSAxO1xuICAgIH1cbiAgfVxuXG4gIGRyYXcoZSkge1xuICAgIGlmICghdGhpcy5fX2lzUnVubmluZykgeyByZXR1cm47IH1cblxuICAgIHRoaXMuX19yQUZJZCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5kcmF3KCkpO1xuXG4gICAgdGhpcy5ub3cgPSBEYXRlLm5vdygpO1xuICAgIHRoaXMuZGVsdGEgPSB0aGlzLm5vdyAtIHRoaXMudGhlbjtcblxuICAgIGlmICh0aGlzLmRlbHRhID4gdGhpcy5pbnRlcnZhbCkge1xuICAgICAgdGhpcy50aGVuID0gdGhpcy5ub3cgLSAodGhpcy5kZWx0YSAlIHRoaXMuaW50ZXJ2YWwpO1xuICAgICAgdGhpcy5leGVjKCk7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVUlMb29wOyJdfQ==