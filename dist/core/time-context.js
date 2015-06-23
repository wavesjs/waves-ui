"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _slicedToArray = require("babel-runtime/helpers/sliced-to-array")["default"];

var ns = require("./namespace");

// @FIXME there is a problem with the stretch:
// how does it must be applyed ?
// should we maintain some `absoluteStart`, `absoluteDuration`, etc... values ?

// @NOTE: separate timeline's with from the scale,
// => only define #pixels for one seconds (kind of real scale) ?

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3RpbWUtY29udGV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQzs7Ozs7Ozs7O0lBUzVCLFdBQVc7QUFDSixXQURQLFdBQVcsR0FDWTtRQUFmLE1BQU0sZ0NBQUcsSUFBSTs7MEJBRHJCLFdBQVc7O0FBRWIsUUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7QUFDdEIsUUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7O0FBRXBCLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQ3BCLFFBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDOztBQUU1QixRQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztBQUNmLFFBQUksQ0FBQyxRQUFRLEdBQUcsQUFBQyxNQUFNLEtBQUssSUFBSSxHQUFJLE1BQU0sQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO0FBQ3hELFFBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLFFBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDOzs7QUFHdkIsUUFBSSxNQUFNLEVBQUU7QUFDVixZQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUM3QjtHQUNGOztlQWpCRyxXQUFXO0FBbUNYLFVBQU07Ozs7Ozs7Ozs7O1dBUkEsWUFBRztBQUNYLFlBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDakMsaUJBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7U0FDNUIsTUFBTTtBQUNMLGlCQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDckI7T0FDRjtXQUVTLFVBQUMsTUFBTSxFQUFFO0FBQ2pCLFlBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO09BQ3ZCOztBQU1HLGtCQUFjOzs7Ozs7O1dBQUEsWUFBRzs7QUFFbkIsWUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFO0FBQzFDLGNBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztTQUNyQzs7O0FBR0QsWUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ2hCLGlCQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDO1NBQ3BDLE1BQU07QUFDTCxpQkFBTyxJQUFJLENBQUMsZUFBZSxDQUFDO1NBQzdCO09BQ0Y7O0FBUUcsZ0JBQVk7V0FOQSxZQUFHO0FBQ2pCLGVBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztPQUMzQjs7OztXQUllLFVBQUMsS0FBSyxFQUFFOztBQUV0QixZQUNFLEtBQUssS0FBSyxDQUFDLElBQ1gsSUFBSSxDQUFDLE9BQU8sSUFDWixJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksS0FBSyxDQUFDLEVBQy9CO0FBQ0EsY0FBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7U0FDckIsTUFBTTtBQUNMLGNBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUM7OytCQUN2QixNQUFNLENBQUMsTUFBTSxFQUFFOzs7O2NBQTNCLEdBQUc7Y0FBRSxHQUFHOztBQUNmLGNBQU0sSUFBSSxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQSxHQUFJLEtBQUssQ0FBQztBQUNqQyxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQzs7QUFFakMsY0FBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7U0FDdkI7O0FBRUQsWUFBTSxXQUFXLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7QUFDL0MsWUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7OztBQUczQixZQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFTLEtBQUssRUFBRTtBQUNyQyxjQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUU7QUFDakIsaUJBQUssQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7V0FDdkQ7U0FDRixDQUFDLENBQUM7T0FDSjs7OztTQXpGRyxXQUFXOzs7QUE0RmpCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsV0FBVyxDQUFDIiwiZmlsZSI6ImVzNi9jb3JlL3RpbWUtY29udGV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IG5zID0gcmVxdWlyZSgnLi9uYW1lc3BhY2UnKTtcblxuLy8gQEZJWE1FIHRoZXJlIGlzIGEgcHJvYmxlbSB3aXRoIHRoZSBzdHJldGNoOlxuLy8gaG93IGRvZXMgaXQgbXVzdCBiZSBhcHBseWVkID9cbi8vIHNob3VsZCB3ZSBtYWludGFpbiBzb21lIGBhYnNvbHV0ZVN0YXJ0YCwgYGFic29sdXRlRHVyYXRpb25gLCBldGMuLi4gdmFsdWVzID9cblxuLy8gQE5PVEU6IHNlcGFyYXRlIHRpbWVsaW5lJ3Mgd2l0aCBmcm9tIHRoZSBzY2FsZSxcbi8vID0+IG9ubHkgZGVmaW5lICNwaXhlbHMgZm9yIG9uZSBzZWNvbmRzIChraW5kIG9mIHJlYWwgc2NhbGUpID9cblxuY2xhc3MgVGltZUNvbnRleHQge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQgPSBudWxsKSB7XG4gICAgdGhpcy5fcGFyZW50ID0gcGFyZW50O1xuICAgIHRoaXMuX2NoaWxkcmVuID0gW107XG5cbiAgICB0aGlzLl94U2NhbGUgPSBudWxsOyAvLyBpbmhlcml0cyBmcm9tIHBhcmVudCBjb250ZXh0XG4gICAgdGhpcy5fb3JpZ2luYWxYU2NhbGUgPSBudWxsO1xuXG4gICAgdGhpcy5zdGFydCA9IDA7XG4gICAgdGhpcy5kdXJhdGlvbiA9IChwYXJlbnQgIT09IG51bGwpID8gcGFyZW50LmR1cmF0aW9uIDrCoDE7XG4gICAgdGhpcy5vZmZzZXQgPSAwO1xuICAgIHRoaXMuX3N0cmV0Y2hSYXRpbyA9IDE7XG4gICAgLy8gQE5PVEU6IG5lZWQgYW4gYGFic29sdXRlU3RyZXRjaFJhdGlvYCA/XG5cbiAgICBpZiAocGFyZW50KSB7XG4gICAgICBwYXJlbnQuX2NoaWxkcmVuLnB1c2godGhpcyk7XG4gICAgfVxuICB9XG5cbiAgLy8gYXR0ZW1wdCB0byBnZXQgYSBzb2x1dGlvbiB0byB0aGUgc3RyZXRjaCBwcm9ibGVtXG4gIC8vIGdldCBub3JtYWxpemVkU3RhcnQoKSB7XG4gIC8vICAgcmV0dXJuIHRoaXMuc3RhcnQgLyB0aGlzLnN0cmV0Y2hSYXRpbztcbiAgLy8gfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gdGhlIGNsb3Nlc3QgYXZhaWxhYmxlIHhTY2FsZSBpbiB0aGUgdHJlZVxuICAgKi9cbiAgZ2V0IHhTY2FsZSgpIHtcbiAgICBpZiAodGhpcy5fcGFyZW50ICYmICF0aGlzLl94U2NhbGUpIHtcbiAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQueFNjYWxlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5feFNjYWxlO1xuICAgIH1cbiAgfVxuXG4gIHNldCB4U2NhbGUoeFNjYWxlKSB7XG4gICAgdGhpcy5feFNjYWxlID0geFNjYWxlO1xuICB9XG5cbiAgLy8gcmVhZCBvbmx5XG4gIC8vIEBOT1RFIG5vdCB1c2VkIGFueW1vcmUgb3V0c2lkZSB0aGlzIG9iamVjdCwgd2FzIHVzZWQgdG8gaGF2ZSBhIHByb3BlciBzdGFydFxuICAvLyBmcm9tIGFuIGlubmVyIGNvbnRleHQgd2l0aCBpdCdzIG93biBgc3RyZXRjaFJhdGlvYCBidXQgY3JlYXRlcyBtYW55IGJhZCBzaWRlIGVmZmVjdHNcbiAgLy8gPT4gZmluZCBhbm90aGVyIHN0cmF0ZWd5ID0+IHVzZSBfY29udGV4dC5wYXJlbnQueFNjYWxlXG4gIGdldCBvcmlnaW5hbFhTY2FsZSgpIHtcbiAgICAvLyBsYXp5IGJpbmQgb3JpZ2luYWxYU2NhbGUgb24gdG9wIG9mIHRoZSB0cmVlXG4gICAgaWYgKCF0aGlzLl9wYXJlbnQgJiYgIXRoaXMuX29yaWdpbmFsWFNjYWxlKSB7XG4gICAgICB0aGlzLl9vcmlnaW5hbFhTY2FsZSA9IHRoaXMuX3hTY2FsZTtcbiAgICB9XG5cbiAgICAvLyByZXR1cm5zIHRoZSBjbG9zZXN0IGF2YWlsYWJsZSB4U2NhbGUgaW4gdGhlIHRyZWVcbiAgICBpZiAodGhpcy5fcGFyZW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5fcGFyZW50Lm9yaWdpbmFsWFNjYWxlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fb3JpZ2luYWxYU2NhbGU7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHN0cmV0Y2hSYXRpbygpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RyZXRjaFJhdGlvO1xuICB9XG5cbiAgLy8gQEZJWE1FOiBpbmNvbnNpc3RlbmNpZXMgb2NjdXIgd2hlbiBvbiBjaGlsZCBjb250ZXh0IHN0cmV0Y2hcbiAgLy8gd2hlbiBzdHJldGNoaW5nIHBhcmVudCAoPT4gd2hlbiBjaGlsZC5zdHJldGNoUmF0aW8gIT0gMSlcbiAgc2V0IHN0cmV0Y2hSYXRpbyhyYXRpbykge1xuICAgIC8vIGRvIG5vdCByZW1vdmUgeFNjYWxlIG9uIHRvcCBvZiB0aGUgZ3JhcGhcbiAgICBpZiAoXG4gICAgICByYXRpbyA9PT0gMSAmJlxuICAgICAgdGhpcy5fcGFyZW50ICYmXG4gICAgICB0aGlzLl9wYXJlbnQuc3RyZXRjaFJhdGlvID09PSAxXG4gICAgKSB7XG4gICAgICB0aGlzLl94U2NhbGUgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB4U2NhbGUgPSB0aGlzLm9yaWdpbmFsWFNjYWxlLmNvcHkoKTtcbiAgICAgIGNvbnN0IFttaW4sIG1heF0gPSB4U2NhbGUuZG9tYWluKCk7XG4gICAgICBjb25zdCBkaWZmID0gKG1heCAtIG1pbikgLyByYXRpbztcbiAgICAgIHhTY2FsZS5kb21haW4oW21pbiwgbWluICsgZGlmZl0pO1xuXG4gICAgICB0aGlzLl94U2NhbGUgPSB4U2NhbGU7XG4gICAgfVxuXG4gICAgY29uc3QgcmF0aW9DaGFuZ2UgPSByYXRpbyAvIHRoaXMuX3N0cmV0Y2hSYXRpbztcbiAgICB0aGlzLl9zdHJldGNoUmF0aW8gPSByYXRpbztcblxuICAgIC8vIHByb3BhZ2F0ZSBjaGFuZ2UgdG8gY2hpbGRyZW4gd2hvIGhhdmUgdGhlaXIgb3duIHN0cmV0Y2hSYXRpb1xuICAgIHRoaXMuX2NoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgIGlmIChjaGlsZC5feFNjYWxlKSB7XG4gICAgICAgIGNoaWxkLnN0cmV0Y2hSYXRpbyA9IGNoaWxkLnN0cmV0Y2hSYXRpbyAqIHJhdGlvQ2hhbmdlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVGltZUNvbnRleHQ7XG4iXX0=