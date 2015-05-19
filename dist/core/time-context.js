"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _slicedToArray = require("babel-runtime/helpers/sliced-to-array")["default"];

var d3 = require("d3");
var ns = require("./namespace");

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3RpbWUtY29udGV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7O0lBRTVCLFdBQVc7QUFDSixXQURQLFdBQVcsR0FDWTtRQUFmLE1BQU0sZ0NBQUcsSUFBSTs7MEJBRHJCLFdBQVc7O0FBRWIsUUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7QUFDdEIsUUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7O0FBRXBCLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQ3BCLFFBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDOztBQUU1QixRQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztBQUNmLFFBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLFFBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLFFBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDOzs7QUFHdkIsUUFBSSxNQUFNLEVBQUU7QUFDVixZQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUM3QjtHQUNGOztlQWpCRyxXQUFXO0FBOEJYLFVBQU07Ozs7OztXQVJBLFlBQUc7QUFDWCxZQUFJLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ2pDLGlCQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO1NBQzVCLE1BQU07QUFDTCxpQkFBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1NBQ3JCO09BQ0Y7V0FFUyxVQUFDLE1BQU0sRUFBRTtBQUNqQixZQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztPQUN2Qjs7QUFNRyxrQkFBYzs7Ozs7OztXQUFBLFlBQUc7O0FBRW5CLFlBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRTtBQUMxQyxjQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDckM7OztBQUdELFlBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNoQixpQkFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQztTQUNwQyxNQUFNO0FBQ0wsaUJBQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQztTQUM3QjtPQUNGOztBQVFHLGdCQUFZO1dBTkEsWUFBRztBQUNqQixlQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7T0FDM0I7Ozs7V0FJZSxVQUFDLEtBQUssRUFBRTs7QUFFdEIsWUFDRSxLQUFLLEtBQUssQ0FBQyxJQUNYLElBQUksQ0FBQyxPQUFPLElBQ1osSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEtBQUssQ0FBQyxFQUMvQjtBQUNBLGNBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1NBQ3JCLE1BQU07QUFDTCxjQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDOzsrQkFDdkIsTUFBTSxDQUFDLE1BQU0sRUFBRTs7OztjQUEzQixHQUFHO2NBQUUsR0FBRzs7QUFDZixjQUFNLElBQUksR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUEsR0FBSSxLQUFLLENBQUM7QUFDakMsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7O0FBRWpDLGNBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1NBQ3ZCOztBQUVELFlBQU0sV0FBVyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO0FBQy9DLFlBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDOzs7QUFHM0IsWUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBUyxLQUFLLEVBQUU7QUFDckMsY0FBSSxLQUFLLENBQUMsT0FBTyxFQUFFO0FBQ2pCLGlCQUFLLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDO1dBQ3ZEO1NBQ0YsQ0FBQyxDQUFDO09BQ0o7Ozs7U0FwRkcsV0FBVzs7O0FBdUZqQixNQUFNLENBQUMsT0FBTyxHQUFHLFdBQVcsQ0FBQyIsImZpbGUiOiJlczYvY29yZS90aW1lLWNvbnRleHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBkMyA9IHJlcXVpcmUoJ2QzJyk7XG5jb25zdCBucyA9IHJlcXVpcmUoJy4vbmFtZXNwYWNlJyk7XG5cbmNsYXNzIFRpbWVDb250ZXh0IHtcbiAgY29uc3RydWN0b3IocGFyZW50ID0gbnVsbCkge1xuICAgIHRoaXMuX3BhcmVudCA9IHBhcmVudDtcbiAgICB0aGlzLl9jaGlsZHJlbiA9IFtdO1xuXG4gICAgdGhpcy5feFNjYWxlID0gbnVsbDsgLy8gaW5oZXJpdHMgZnJvbSBwYXJlbnQgY29udGV4dFxuICAgIHRoaXMuX29yaWdpbmFsWFNjYWxlID0gbnVsbDtcblxuICAgIHRoaXMuc3RhcnQgPSAwO1xuICAgIHRoaXMuZHVyYXRpb24gPSAxO1xuICAgIHRoaXMub2Zmc2V0ID0gMDtcbiAgICB0aGlzLl9zdHJldGNoUmF0aW8gPSAxO1xuICAgIC8vIEBOT1RFOiBuZWVkIGFuIGBhYnNvbHV0ZVN0cmV0Y2hSYXRpb2AgP1xuXG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgcGFyZW50Ll9jaGlsZHJlbi5wdXNoKHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gdGhlIGNsb3Nlc3QgYXZhaWxhYmxlIHhTY2FsZSBpbiB0aGUgdHJlZVxuICAgKi9cbiAgZ2V0IHhTY2FsZSgpIHtcbiAgICBpZiAodGhpcy5fcGFyZW50ICYmICF0aGlzLl94U2NhbGUpIHtcbiAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQueFNjYWxlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5feFNjYWxlO1xuICAgIH1cbiAgfVxuXG4gIHNldCB4U2NhbGUoeFNjYWxlKSB7XG4gICAgdGhpcy5feFNjYWxlID0geFNjYWxlO1xuICB9XG5cbiAgLy8gcmVhZCBvbmx5XG4gIC8vIEBOT1RFIG5vdCB1c2VkIGFueW1vcmUgb3V0c2lkZSB0aGlzIG9iamVjdCwgd2FzIHVzZWQgdG8gaGF2ZSBhIHByb3BlciBzdGFydFxuICAvLyBmcm9tIGFuIGlubmVyIGNvbnRleHQgd2l0aCBpdCdzIG93biBgc3RyZXRjaFJhdGlvYCBidXQgY3JlYXRlcyBtYW55IGJhZCBzaWRlIGVmZmVjdHNcbiAgLy8gPT4gZmluZCBhbm90aGVyIHN0cmF0ZWd5ID0+IHVzZSBfY29udGV4dC5wYXJlbnQueFNjYWxlXG4gIGdldCBvcmlnaW5hbFhTY2FsZSgpIHtcbiAgICAvLyBsYXp5IGJpbmQgb3JpZ2luYWxYU2NhbGUgb24gdG9wIG9mIHRoZSB0cmVlXG4gICAgaWYgKCF0aGlzLl9wYXJlbnQgJiYgIXRoaXMuX29yaWdpbmFsWFNjYWxlKSB7XG4gICAgICB0aGlzLl9vcmlnaW5hbFhTY2FsZSA9IHRoaXMuX3hTY2FsZTtcbiAgICB9XG5cbiAgICAvLyByZXR1cm5zIHRoZSBjbG9zZXN0IGF2YWlsYWJsZSB4U2NhbGUgaW4gdGhlIHRyZWVcbiAgICBpZiAodGhpcy5fcGFyZW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5fcGFyZW50Lm9yaWdpbmFsWFNjYWxlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fb3JpZ2luYWxYU2NhbGU7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHN0cmV0Y2hSYXRpbygpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RyZXRjaFJhdGlvO1xuICB9XG5cbiAgLy8gQEZJWE1FOiBpbmNvbnNpc3RlbmNpZXMgb2NjdXIgd2hlbiBvbiBjaGlsZCBjb250ZXh0IHN0cmV0Y2hcbiAgLy8gd2hlbiBzdHJldGNoaW5nIHBhcmVudCAoPT4gd2hlbiBjaGlsZC5zdHJldGNoUmF0aW8gIT0gMSlcbiAgc2V0IHN0cmV0Y2hSYXRpbyhyYXRpbykge1xuICAgIC8vIGRvIG5vdCByZW1vdmUgeFNjYWxlIG9uIHRvcCBvZiB0aGUgZ3JhcGhcbiAgICBpZiAoXG4gICAgICByYXRpbyA9PT0gMSAmJlxuICAgICAgdGhpcy5fcGFyZW50ICYmXG4gICAgICB0aGlzLl9wYXJlbnQuc3RyZXRjaFJhdGlvID09PSAxXG4gICAgKSB7XG4gICAgICB0aGlzLl94U2NhbGUgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB4U2NhbGUgPSB0aGlzLm9yaWdpbmFsWFNjYWxlLmNvcHkoKTtcbiAgICAgIGNvbnN0IFttaW4sIG1heF0gPSB4U2NhbGUuZG9tYWluKCk7XG4gICAgICBjb25zdCBkaWZmID0gKG1heCAtIG1pbikgLyByYXRpbztcbiAgICAgIHhTY2FsZS5kb21haW4oW21pbiwgbWluICsgZGlmZl0pO1xuXG4gICAgICB0aGlzLl94U2NhbGUgPSB4U2NhbGU7XG4gICAgfVxuXG4gICAgY29uc3QgcmF0aW9DaGFuZ2UgPSByYXRpbyAvIHRoaXMuX3N0cmV0Y2hSYXRpbztcbiAgICB0aGlzLl9zdHJldGNoUmF0aW8gPSByYXRpbztcblxuICAgIC8vIHByb3BhZ2F0ZSBjaGFuZ2UgdG8gY2hpbGRyZW4gd2hvIGhhdmUgdGhlaXIgb3duIHN0cmV0Y2hSYXRpb1xuICAgIHRoaXMuX2NoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgIGlmIChjaGlsZC5feFNjYWxlKSB7XG4gICAgICAgIGNoaWxkLnN0cmV0Y2hSYXRpbyA9IGNoaWxkLnN0cmV0Y2hSYXRpbyAqIHJhdGlvQ2hhbmdlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVGltZUNvbnRleHQ7XG4iXX0=