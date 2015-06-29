// @FIXME there is a problem with the stretch:
// how does it must be applyed ?
// should we maintain some `absoluteStart`, `absoluteDuration`, etc... values ?

// @NOTE: separate timeline's with from the scale,
// => only define #pixels for one seconds (kind of real scale) ?

"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _slicedToArray = require("babel-runtime/helpers/sliced-to-array")["default"];

var TimeContext = (function () {
  function TimeContext() {
    var parent = arguments[0] === undefined ? null : arguments[0];

    _classCallCheck(this, TimeContext);

    this._parent = parent;
    this._children = [];

    this._xScale = null; // inherits from parent context
    this._originalXScale = null;

    this.start = 0;
    this.duration = parent !== null ? parent.duration : 1;
    this.offset = 0;
    this._stretchRatio = 1;
    // @NOTE: need an `absoluteStretchRatio` ?

    if (this._parent) {
      this._parent._children.push(this);
    }
  }

  _createClass(TimeContext, {
    xScale: {

      // attempt to get a solution to the stretch problem
      // get normalizedStart() {
      //   return this.start / this.stretchRatio;
      // }

      /**
       * @return {Function} the closest available xScale in the tree
       */

      get: function () {
        if (this._parent && !this._xScale) {
          return this._parent.xScale;
        } else {
          return this._xScale;
        }
      },
      set: function (xScale) {
        this._xScale = xScale;
      }
    },
    originalXScale: {

      // read only
      // @NOTE not used anymore outside this object, was used to have a proper start
      // from an inner context with it's own `stretchRatio` but creates many bad side effects
      // => find another strategy => use _context.parent.xScale

      get: function () {
        // lazy bind originalXScale on top of the tree
        if (!this._parent && !this._originalXScale) {
          this._originalXScale = this._xScale;
        }

        // returns the closest available xScale in the tree
        if (this._parent) {
          return this._parent.originalXScale;
        } else {
          return this._originalXScale;
        }
      }
    },
    stretchRatio: {
      get: function () {
        return this._stretchRatio;
      },

      // @FIXME: inconsistencies occur
      // when stretching parent and when child.stretchRatio != 1
      set: function (ratio) {
        // do not remove xScale on top of the graph
        if (ratio === 1 && this._parent && this._parent.stretchRatio === 1) {
          this._xScale = null;
        } else {
          var xScale = this.originalXScale.copy();

          var _xScale$domain = xScale.domain();

          var _xScale$domain2 = _slicedToArray(_xScale$domain, 2);

          var min = _xScale$domain2[0];
          var max = _xScale$domain2[1];

          var diff = (max - min) / ratio;
          xScale.domain([min, min + diff]);

          this._xScale = xScale;
        }

        var ratioChange = ratio / this._stretchRatio;
        this._stretchRatio = ratio;

        // propagate change to children who have their own stretchRatio
        this._children.forEach(function (child) {
          if (child._xScale) {
            child.stretchRatio = child.stretchRatio * ratioChange;
          }
        });
      }
    }
  });

  return TimeContext;
})();

module.exports = TimeContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3RpbWUtY29udGV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7SUFPTSxXQUFXO0FBQ0osV0FEUCxXQUFXLEdBQ1k7UUFBZixNQUFNLGdDQUFHLElBQUk7OzBCQURyQixXQUFXOztBQUViLFFBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQ3RCLFFBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDOztBQUVwQixRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztBQUNwQixRQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQzs7QUFFNUIsUUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDZixRQUFJLENBQUMsUUFBUSxHQUFHLEFBQUMsTUFBTSxLQUFLLElBQUksR0FBSSxNQUFNLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztBQUN4RCxRQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNoQixRQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQzs7O0FBR3ZCLFFBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNoQixVQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDbkM7R0FDRjs7ZUFqQkcsV0FBVztBQW1DWCxVQUFNOzs7Ozs7Ozs7OztXQVJBLFlBQUc7QUFDWCxZQUFJLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ2pDLGlCQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO1NBQzVCLE1BQU07QUFDTCxpQkFBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1NBQ3JCO09BQ0Y7V0FFUyxVQUFDLE1BQU0sRUFBRTtBQUNqQixZQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztPQUN2Qjs7QUFNRyxrQkFBYzs7Ozs7OztXQUFBLFlBQUc7O0FBRW5CLFlBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRTtBQUMxQyxjQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDckM7OztBQUdELFlBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNoQixpQkFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQztTQUNwQyxNQUFNO0FBQ0wsaUJBQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQztTQUM3QjtPQUNGOztBQVFHLGdCQUFZO1dBTkEsWUFBRztBQUNqQixlQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7T0FDM0I7Ozs7V0FJZSxVQUFDLEtBQUssRUFBRTs7QUFFdEIsWUFDRSxLQUFLLEtBQUssQ0FBQyxJQUNYLElBQUksQ0FBQyxPQUFPLElBQ1osSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEtBQUssQ0FBQyxFQUMvQjtBQUNBLGNBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1NBQ3JCLE1BQU07QUFDTCxjQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDOzsrQkFDdkIsTUFBTSxDQUFDLE1BQU0sRUFBRTs7OztjQUEzQixHQUFHO2NBQUUsR0FBRzs7QUFDZixjQUFNLElBQUksR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUEsR0FBSSxLQUFLLENBQUM7QUFDakMsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7O0FBRWpDLGNBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1NBQ3ZCOztBQUVELFlBQU0sV0FBVyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO0FBQy9DLFlBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDOzs7QUFHM0IsWUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBUyxLQUFLLEVBQUU7QUFDckMsY0FBSSxLQUFLLENBQUMsT0FBTyxFQUFFO0FBQ2pCLGlCQUFLLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDO1dBQ3ZEO1NBQ0YsQ0FBQyxDQUFDO09BQ0o7Ozs7U0F6RkcsV0FBVzs7O0FBNEZqQixNQUFNLENBQUMsT0FBTyxHQUFHLFdBQVcsQ0FBQyIsImZpbGUiOiJlczYvY29yZS90aW1lLWNvbnRleHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBARklYTUUgdGhlcmUgaXMgYSBwcm9ibGVtIHdpdGggdGhlIHN0cmV0Y2g6XG4vLyBob3cgZG9lcyBpdCBtdXN0IGJlIGFwcGx5ZWQgP1xuLy8gc2hvdWxkIHdlIG1haW50YWluIHNvbWUgYGFic29sdXRlU3RhcnRgLCBgYWJzb2x1dGVEdXJhdGlvbmAsIGV0Yy4uLiB2YWx1ZXMgP1xuXG4vLyBATk9URTogc2VwYXJhdGUgdGltZWxpbmUncyB3aXRoIGZyb20gdGhlIHNjYWxlLFxuLy8gPT4gb25seSBkZWZpbmUgI3BpeGVscyBmb3Igb25lIHNlY29uZHMgKGtpbmQgb2YgcmVhbCBzY2FsZSkgP1xuXG5jbGFzcyBUaW1lQ29udGV4dCB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCA9IG51bGwpIHtcbiAgICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gICAgdGhpcy5fY2hpbGRyZW4gPSBbXTtcblxuICAgIHRoaXMuX3hTY2FsZSA9IG51bGw7IC8vIGluaGVyaXRzIGZyb20gcGFyZW50IGNvbnRleHRcbiAgICB0aGlzLl9vcmlnaW5hbFhTY2FsZSA9IG51bGw7XG5cbiAgICB0aGlzLnN0YXJ0ID0gMDtcbiAgICB0aGlzLmR1cmF0aW9uID0gKHBhcmVudCAhPT0gbnVsbCkgPyBwYXJlbnQuZHVyYXRpb24gOsKgMTtcbiAgICB0aGlzLm9mZnNldCA9IDA7XG4gICAgdGhpcy5fc3RyZXRjaFJhdGlvID0gMTtcbiAgICAvLyBATk9URTogbmVlZCBhbiBgYWJzb2x1dGVTdHJldGNoUmF0aW9gID9cblxuICAgIGlmICh0aGlzLl9wYXJlbnQpIHtcbiAgICAgIHRoaXMuX3BhcmVudC5fY2hpbGRyZW4ucHVzaCh0aGlzKTtcbiAgICB9XG4gIH1cblxuICAvLyBhdHRlbXB0IHRvIGdldCBhIHNvbHV0aW9uIHRvIHRoZSBzdHJldGNoIHByb2JsZW1cbiAgLy8gZ2V0IG5vcm1hbGl6ZWRTdGFydCgpIHtcbiAgLy8gICByZXR1cm4gdGhpcy5zdGFydCAvIHRoaXMuc3RyZXRjaFJhdGlvO1xuICAvLyB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufSB0aGUgY2xvc2VzdCBhdmFpbGFibGUgeFNjYWxlIGluIHRoZSB0cmVlXG4gICAqL1xuICBnZXQgeFNjYWxlKCkge1xuICAgIGlmICh0aGlzLl9wYXJlbnQgJiYgIXRoaXMuX3hTY2FsZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudC54U2NhbGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl94U2NhbGU7XG4gICAgfVxuICB9XG5cbiAgc2V0IHhTY2FsZSh4U2NhbGUpIHtcbiAgICB0aGlzLl94U2NhbGUgPSB4U2NhbGU7XG4gIH1cblxuICAvLyByZWFkIG9ubHlcbiAgLy8gQE5PVEUgbm90IHVzZWQgYW55bW9yZSBvdXRzaWRlIHRoaXMgb2JqZWN0LCB3YXMgdXNlZCB0byBoYXZlIGEgcHJvcGVyIHN0YXJ0XG4gIC8vIGZyb20gYW4gaW5uZXIgY29udGV4dCB3aXRoIGl0J3Mgb3duIGBzdHJldGNoUmF0aW9gIGJ1dCBjcmVhdGVzIG1hbnkgYmFkIHNpZGUgZWZmZWN0c1xuICAvLyA9PiBmaW5kIGFub3RoZXIgc3RyYXRlZ3kgPT4gdXNlIF9jb250ZXh0LnBhcmVudC54U2NhbGVcbiAgZ2V0IG9yaWdpbmFsWFNjYWxlKCkge1xuICAgIC8vIGxhenkgYmluZCBvcmlnaW5hbFhTY2FsZSBvbiB0b3Agb2YgdGhlIHRyZWVcbiAgICBpZiAoIXRoaXMuX3BhcmVudCAmJiAhdGhpcy5fb3JpZ2luYWxYU2NhbGUpIHtcbiAgICAgIHRoaXMuX29yaWdpbmFsWFNjYWxlID0gdGhpcy5feFNjYWxlO1xuICAgIH1cblxuICAgIC8vIHJldHVybnMgdGhlIGNsb3Nlc3QgYXZhaWxhYmxlIHhTY2FsZSBpbiB0aGUgdHJlZVxuICAgIGlmICh0aGlzLl9wYXJlbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQub3JpZ2luYWxYU2NhbGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9vcmlnaW5hbFhTY2FsZTtcbiAgICB9XG4gIH1cblxuICBnZXQgc3RyZXRjaFJhdGlvKCkge1xuICAgIHJldHVybiB0aGlzLl9zdHJldGNoUmF0aW87XG4gIH1cblxuICAvLyBARklYTUU6IGluY29uc2lzdGVuY2llcyBvY2N1clxuICAvLyB3aGVuIHN0cmV0Y2hpbmcgcGFyZW50IGFuZCB3aGVuIGNoaWxkLnN0cmV0Y2hSYXRpbyAhPSAxXG4gIHNldCBzdHJldGNoUmF0aW8ocmF0aW8pIHtcbiAgICAvLyBkbyBub3QgcmVtb3ZlIHhTY2FsZSBvbiB0b3Agb2YgdGhlIGdyYXBoXG4gICAgaWYgKFxuICAgICAgcmF0aW8gPT09IDEgJiZcbiAgICAgIHRoaXMuX3BhcmVudCAmJlxuICAgICAgdGhpcy5fcGFyZW50LnN0cmV0Y2hSYXRpbyA9PT0gMVxuICAgICkge1xuICAgICAgdGhpcy5feFNjYWxlID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgeFNjYWxlID0gdGhpcy5vcmlnaW5hbFhTY2FsZS5jb3B5KCk7XG4gICAgICBjb25zdCBbbWluLCBtYXhdID0geFNjYWxlLmRvbWFpbigpO1xuICAgICAgY29uc3QgZGlmZiA9IChtYXggLSBtaW4pIC8gcmF0aW87XG4gICAgICB4U2NhbGUuZG9tYWluKFttaW4sIG1pbiArIGRpZmZdKTtcblxuICAgICAgdGhpcy5feFNjYWxlID0geFNjYWxlO1xuICAgIH1cblxuICAgIGNvbnN0IHJhdGlvQ2hhbmdlID0gcmF0aW8gLyB0aGlzLl9zdHJldGNoUmF0aW87XG4gICAgdGhpcy5fc3RyZXRjaFJhdGlvID0gcmF0aW87XG5cbiAgICAvLyBwcm9wYWdhdGUgY2hhbmdlIHRvIGNoaWxkcmVuIHdobyBoYXZlIHRoZWlyIG93biBzdHJldGNoUmF0aW9cbiAgICB0aGlzLl9jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICBpZiAoY2hpbGQuX3hTY2FsZSkge1xuICAgICAgICBjaGlsZC5zdHJldGNoUmF0aW8gPSBjaGlsZC5zdHJldGNoUmF0aW8gKiByYXRpb0NoYW5nZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRpbWVDb250ZXh0O1xuIl19