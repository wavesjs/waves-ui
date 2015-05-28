"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _slicedToArray = require("babel-runtime/helpers/sliced-to-array")["default"];

var d3 = require("d3");
var ns = require("./namespace");

// @FIXME there is a problem with the stretch:
// how does it must be applyed ?
// should we maintain some `absoluteStart`, `absoluteDuration`, etc... values ?

var TimeContext = (function () {
  function TimeContext() {
    var parent = arguments[0] === undefined ? null : arguments[0];

    _classCallCheck(this, TimeContext);

    this._parent = parent;
    this._children = [];

    this._xScale = null; // inherits from parent context
    this._originalXScale = null;

    this.start = 0;
    this.duration = 1;
    this.offset = 0;
    this._stretchRatio = 1;
    // @NOTE: need an `absoluteStretchRatio` ?

    if (parent) {
      parent._children.push(this);
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

      // @FIXME: inconsistencies occur when on child context stretch
      // when stretching parent (=> when child.stretchRatio != 1)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3RpbWUtY29udGV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7Ozs7OztJQU01QixXQUFXO0FBQ0osV0FEUCxXQUFXLEdBQ1k7UUFBZixNQUFNLGdDQUFHLElBQUk7OzBCQURyQixXQUFXOztBQUViLFFBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQ3RCLFFBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDOztBQUVwQixRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztBQUNwQixRQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQzs7QUFFNUIsUUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDZixRQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztBQUNsQixRQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNoQixRQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQzs7O0FBR3ZCLFFBQUksTUFBTSxFQUFFO0FBQ1YsWUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDN0I7R0FDRjs7ZUFqQkcsV0FBVztBQW1DWCxVQUFNOzs7Ozs7Ozs7OztXQVJBLFlBQUc7QUFDWCxZQUFJLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ2pDLGlCQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO1NBQzVCLE1BQU07QUFDTCxpQkFBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1NBQ3JCO09BQ0Y7V0FFUyxVQUFDLE1BQU0sRUFBRTtBQUNqQixZQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztPQUN2Qjs7QUFNRyxrQkFBYzs7Ozs7OztXQUFBLFlBQUc7O0FBRW5CLFlBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRTtBQUMxQyxjQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDckM7OztBQUdELFlBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNoQixpQkFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQztTQUNwQyxNQUFNO0FBQ0wsaUJBQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQztTQUM3QjtPQUNGOztBQVFHLGdCQUFZO1dBTkEsWUFBRztBQUNqQixlQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7T0FDM0I7Ozs7V0FJZSxVQUFDLEtBQUssRUFBRTs7QUFFdEIsWUFDRSxLQUFLLEtBQUssQ0FBQyxJQUNYLElBQUksQ0FBQyxPQUFPLElBQ1osSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEtBQUssQ0FBQyxFQUMvQjtBQUNBLGNBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1NBQ3JCLE1BQU07QUFDTCxjQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDOzsrQkFDdkIsTUFBTSxDQUFDLE1BQU0sRUFBRTs7OztjQUEzQixHQUFHO2NBQUUsR0FBRzs7QUFDZixjQUFNLElBQUksR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUEsR0FBSSxLQUFLLENBQUM7QUFDakMsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7O0FBRWpDLGNBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1NBQ3ZCOztBQUVELFlBQU0sV0FBVyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO0FBQy9DLFlBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDOzs7QUFHM0IsWUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBUyxLQUFLLEVBQUU7QUFDckMsY0FBSSxLQUFLLENBQUMsT0FBTyxFQUFFO0FBQ2pCLGlCQUFLLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDO1dBQ3ZEO1NBQ0YsQ0FBQyxDQUFDO09BQ0o7Ozs7U0F6RkcsV0FBVzs7O0FBNEZqQixNQUFNLENBQUMsT0FBTyxHQUFHLFdBQVcsQ0FBQyIsImZpbGUiOiJlczYvY29yZS90aW1lLWNvbnRleHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBkMyA9IHJlcXVpcmUoJ2QzJyk7XG5jb25zdCBucyA9IHJlcXVpcmUoJy4vbmFtZXNwYWNlJyk7XG5cbi8vIEBGSVhNRSB0aGVyZSBpcyBhIHByb2JsZW0gd2l0aCB0aGUgc3RyZXRjaDpcbi8vIGhvdyBkb2VzIGl0IG11c3QgYmUgYXBwbHllZCA/XG4vLyBzaG91bGQgd2UgbWFpbnRhaW4gc29tZSBgYWJzb2x1dGVTdGFydGAsIGBhYnNvbHV0ZUR1cmF0aW9uYCwgZXRjLi4uIHZhbHVlcyA/XG5cbmNsYXNzIFRpbWVDb250ZXh0IHtcbiAgY29uc3RydWN0b3IocGFyZW50ID0gbnVsbCkge1xuICAgIHRoaXMuX3BhcmVudCA9IHBhcmVudDtcbiAgICB0aGlzLl9jaGlsZHJlbiA9IFtdO1xuXG4gICAgdGhpcy5feFNjYWxlID0gbnVsbDsgLy8gaW5oZXJpdHMgZnJvbSBwYXJlbnQgY29udGV4dFxuICAgIHRoaXMuX29yaWdpbmFsWFNjYWxlID0gbnVsbDtcblxuICAgIHRoaXMuc3RhcnQgPSAwO1xuICAgIHRoaXMuZHVyYXRpb24gPSAxO1xuICAgIHRoaXMub2Zmc2V0ID0gMDtcbiAgICB0aGlzLl9zdHJldGNoUmF0aW8gPSAxO1xuICAgIC8vIEBOT1RFOiBuZWVkIGFuIGBhYnNvbHV0ZVN0cmV0Y2hSYXRpb2AgP1xuXG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgcGFyZW50Ll9jaGlsZHJlbi5wdXNoKHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGF0dGVtcHQgdG8gZ2V0IGEgc29sdXRpb24gdG8gdGhlIHN0cmV0Y2ggcHJvYmxlbVxuICAvLyBnZXQgbm9ybWFsaXplZFN0YXJ0KCkge1xuICAvLyAgIHJldHVybiB0aGlzLnN0YXJ0IC8gdGhpcy5zdHJldGNoUmF0aW87XG4gIC8vIH1cblxuICAvKipcbiAgICogQHJldHVybiB7RnVuY3Rpb259IHRoZSBjbG9zZXN0IGF2YWlsYWJsZSB4U2NhbGUgaW4gdGhlIHRyZWVcbiAgICovXG4gIGdldCB4U2NhbGUoKSB7XG4gICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhdGhpcy5feFNjYWxlKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcGFyZW50LnhTY2FsZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX3hTY2FsZTtcbiAgICB9XG4gIH1cblxuICBzZXQgeFNjYWxlKHhTY2FsZSkge1xuICAgIHRoaXMuX3hTY2FsZSA9IHhTY2FsZTtcbiAgfVxuXG4gIC8vIHJlYWQgb25seVxuICAvLyBATk9URSBub3QgdXNlZCBhbnltb3JlIG91dHNpZGUgdGhpcyBvYmplY3QsIHdhcyB1c2VkIHRvIGhhdmUgYSBwcm9wZXIgc3RhcnRcbiAgLy8gZnJvbSBhbiBpbm5lciBjb250ZXh0IHdpdGggaXQncyBvd24gYHN0cmV0Y2hSYXRpb2AgYnV0IGNyZWF0ZXMgbWFueSBiYWQgc2lkZSBlZmZlY3RzXG4gIC8vID0+IGZpbmQgYW5vdGhlciBzdHJhdGVneSA9PiB1c2UgX2NvbnRleHQucGFyZW50LnhTY2FsZVxuICBnZXQgb3JpZ2luYWxYU2NhbGUoKSB7XG4gICAgLy8gbGF6eSBiaW5kIG9yaWdpbmFsWFNjYWxlIG9uIHRvcCBvZiB0aGUgdHJlZVxuICAgIGlmICghdGhpcy5fcGFyZW50ICYmICF0aGlzLl9vcmlnaW5hbFhTY2FsZSkge1xuICAgICAgdGhpcy5fb3JpZ2luYWxYU2NhbGUgPSB0aGlzLl94U2NhbGU7XG4gICAgfVxuXG4gICAgLy8gcmV0dXJucyB0aGUgY2xvc2VzdCBhdmFpbGFibGUgeFNjYWxlIGluIHRoZSB0cmVlXG4gICAgaWYgKHRoaXMuX3BhcmVudCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudC5vcmlnaW5hbFhTY2FsZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX29yaWdpbmFsWFNjYWxlO1xuICAgIH1cbiAgfVxuXG4gIGdldCBzdHJldGNoUmF0aW8oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0cmV0Y2hSYXRpbztcbiAgfVxuXG4gIC8vIEBGSVhNRTogaW5jb25zaXN0ZW5jaWVzIG9jY3VyIHdoZW4gb24gY2hpbGQgY29udGV4dCBzdHJldGNoXG4gIC8vIHdoZW4gc3RyZXRjaGluZyBwYXJlbnQgKD0+IHdoZW4gY2hpbGQuc3RyZXRjaFJhdGlvICE9IDEpXG4gIHNldCBzdHJldGNoUmF0aW8ocmF0aW8pIHtcbiAgICAvLyBkbyBub3QgcmVtb3ZlIHhTY2FsZSBvbiB0b3Agb2YgdGhlIGdyYXBoXG4gICAgaWYgKFxuICAgICAgcmF0aW8gPT09IDEgJiZcbiAgICAgIHRoaXMuX3BhcmVudCAmJlxuICAgICAgdGhpcy5fcGFyZW50LnN0cmV0Y2hSYXRpbyA9PT0gMVxuICAgICkge1xuICAgICAgdGhpcy5feFNjYWxlID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgeFNjYWxlID0gdGhpcy5vcmlnaW5hbFhTY2FsZS5jb3B5KCk7XG4gICAgICBjb25zdCBbbWluLCBtYXhdID0geFNjYWxlLmRvbWFpbigpO1xuICAgICAgY29uc3QgZGlmZiA9IChtYXggLSBtaW4pIC8gcmF0aW87XG4gICAgICB4U2NhbGUuZG9tYWluKFttaW4sIG1pbiArIGRpZmZdKTtcblxuICAgICAgdGhpcy5feFNjYWxlID0geFNjYWxlO1xuICAgIH1cblxuICAgIGNvbnN0IHJhdGlvQ2hhbmdlID0gcmF0aW8gLyB0aGlzLl9zdHJldGNoUmF0aW87XG4gICAgdGhpcy5fc3RyZXRjaFJhdGlvID0gcmF0aW87XG5cbiAgICAvLyBwcm9wYWdhdGUgY2hhbmdlIHRvIGNoaWxkcmVuIHdobyBoYXZlIHRoZWlyIG93biBzdHJldGNoUmF0aW9cbiAgICB0aGlzLl9jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICBpZiAoY2hpbGQuX3hTY2FsZSkge1xuICAgICAgICBjaGlsZC5zdHJldGNoUmF0aW8gPSBjaGlsZC5zdHJldGNoUmF0aW8gKiByYXRpb0NoYW5nZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRpbWVDb250ZXh0O1xuIl19