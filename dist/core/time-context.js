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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3RpbWUtY29udGV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7O0lBRTVCLFdBQVc7QUFDSixXQURQLFdBQVcsR0FDWTtRQUFmLE1BQU0sZ0NBQUcsSUFBSTs7MEJBRHJCLFdBQVc7O0FBRWIsUUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7QUFDdEIsUUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7O0FBRXBCLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQ3BCLFFBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDOztBQUU1QixRQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztBQUNmLFFBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLFFBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLFFBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDOztBQUV2QixRQUFJLE1BQU0sRUFBRTtBQUNWLFlBQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzdCO0dBQ0Y7O2VBaEJHLFdBQVc7QUE2QlgsVUFBTTs7Ozs7O1dBUkEsWUFBRztBQUNYLFlBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDakMsaUJBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7U0FDNUIsTUFBTTtBQUNMLGlCQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDckI7T0FDRjtXQUVTLFVBQUMsTUFBTSxFQUFFO0FBQ2pCLFlBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO09BQ3ZCOztBQUdHLGtCQUFjOzs7O1dBQUEsWUFBRzs7QUFFbkIsWUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFO0FBQzFDLGNBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztTQUNyQzs7O0FBR0QsWUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ2hCLGlCQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDO1NBQ3BDLE1BQU07QUFDTCxpQkFBTyxJQUFJLENBQUMsZUFBZSxDQUFDO1NBQzdCO09BQ0Y7O0FBUUcsZ0JBQVk7V0FOQSxZQUFHO0FBQ2pCLGVBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztPQUMzQjs7OztXQUllLFVBQUMsS0FBSyxFQUFFOztBQUV0QixZQUNFLEtBQUssS0FBSyxDQUFDLElBQ1gsSUFBSSxDQUFDLE9BQU8sSUFDWixJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksS0FBSyxDQUFDLEVBQy9CO0FBQ0EsY0FBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7U0FDckIsTUFBTTtBQUNMLGNBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUM7OytCQUN2QixNQUFNLENBQUMsTUFBTSxFQUFFOzs7O2NBQTNCLEdBQUc7Y0FBRSxHQUFHOztBQUNmLGNBQU0sSUFBSSxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQSxHQUFJLEtBQUssQ0FBQztBQUNqQyxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQzs7QUFFakMsY0FBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7U0FDdkI7O0FBRUQsWUFBTSxXQUFXLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7QUFDL0MsWUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7OztBQUczQixZQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFTLEtBQUssRUFBRTtBQUNyQyxjQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUU7QUFDakIsaUJBQUssQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7V0FDdkQ7U0FDRixDQUFDLENBQUM7T0FDSjs7OztTQWhGRyxXQUFXOzs7QUFtRmpCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsV0FBVyxDQUFDIiwiZmlsZSI6ImVzNi9jb3JlL3RpbWUtY29udGV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGQzID0gcmVxdWlyZSgnZDMnKTtcbmNvbnN0IG5zID0gcmVxdWlyZSgnLi9uYW1lc3BhY2UnKTtcblxuY2xhc3MgVGltZUNvbnRleHQge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQgPSBudWxsKSB7XG4gICAgdGhpcy5fcGFyZW50ID0gcGFyZW50O1xuICAgIHRoaXMuX2NoaWxkcmVuID0gW107XG5cbiAgICB0aGlzLl94U2NhbGUgPSBudWxsOyAvLyBpbmhlcml0cyBmcm9tIHBhcmVudCBjb250ZXh0XG4gICAgdGhpcy5fb3JpZ2luYWxYU2NhbGUgPSBudWxsO1xuXG4gICAgdGhpcy5zdGFydCA9IDA7XG4gICAgdGhpcy5kdXJhdGlvbiA9IDE7XG4gICAgdGhpcy5vZmZzZXQgPSAwO1xuICAgIHRoaXMuX3N0cmV0Y2hSYXRpbyA9IDE7XG5cbiAgICBpZiAocGFyZW50KSB7XG4gICAgICBwYXJlbnQuX2NoaWxkcmVuLnB1c2godGhpcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufSB0aGUgY2xvc2VzdCBhdmFpbGFibGUgeFNjYWxlIGluIHRoZSB0cmVlXG4gICAqL1xuICBnZXQgeFNjYWxlKCkge1xuICAgIGlmICh0aGlzLl9wYXJlbnQgJiYgIXRoaXMuX3hTY2FsZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudC54U2NhbGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl94U2NhbGU7XG4gICAgfVxuICB9XG5cbiAgc2V0IHhTY2FsZSh4U2NhbGUpIHtcbiAgICB0aGlzLl94U2NhbGUgPSB4U2NhbGU7XG4gIH1cblxuICAvLyByZWFkIG9ubHlcbiAgZ2V0IG9yaWdpbmFsWFNjYWxlKCkge1xuICAgIC8vIGxhenkgYmluZCBvcmlnaW5hbFhTY2FsZSBvbiB0b3Agb2YgdGhlIHRyZWVcbiAgICBpZiAoIXRoaXMuX3BhcmVudCAmJiAhdGhpcy5fb3JpZ2luYWxYU2NhbGUpIHtcbiAgICAgIHRoaXMuX29yaWdpbmFsWFNjYWxlID0gdGhpcy5feFNjYWxlO1xuICAgIH1cblxuICAgIC8vIHJldHVybnMgdGhlIGNsb3Nlc3QgYXZhaWxhYmxlIHhTY2FsZSBpbiB0aGUgdHJlZVxuICAgIGlmICh0aGlzLl9wYXJlbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQub3JpZ2luYWxYU2NhbGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9vcmlnaW5hbFhTY2FsZTtcbiAgICB9XG4gIH1cblxuICBnZXQgc3RyZXRjaFJhdGlvKCkge1xuICAgIHJldHVybiB0aGlzLl9zdHJldGNoUmF0aW87XG4gIH1cblxuICAvLyBARklYTUU6IGluY29uc2lzdGVuY2llcyBvY2N1ciB3aGVuIG9uIGNoaWxkIGNvbnRleHQgc3RyZXRjaFxuICAvLyB3aGVuIHN0cmV0Y2hpbmcgcGFyZW50ICg9PiB3aGVuIGNoaWxkLnN0cmV0Y2hSYXRpbyAhPSAxKVxuICBzZXQgc3RyZXRjaFJhdGlvKHJhdGlvKSB7XG4gICAgLy8gZG8gbm90IHJlbW92ZSB4U2NhbGUgb24gdG9wIG9mIHRoZSBncmFwaFxuICAgIGlmIChcbiAgICAgIHJhdGlvID09PSAxICYmXG4gICAgICB0aGlzLl9wYXJlbnQgJiZcbiAgICAgIHRoaXMuX3BhcmVudC5zdHJldGNoUmF0aW8gPT09IDFcbiAgICApIHtcbiAgICAgIHRoaXMuX3hTY2FsZSA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHhTY2FsZSA9IHRoaXMub3JpZ2luYWxYU2NhbGUuY29weSgpO1xuICAgICAgY29uc3QgW21pbiwgbWF4XSA9IHhTY2FsZS5kb21haW4oKTtcbiAgICAgIGNvbnN0IGRpZmYgPSAobWF4IC0gbWluKSAvIHJhdGlvO1xuICAgICAgeFNjYWxlLmRvbWFpbihbbWluLCBtaW4gKyBkaWZmXSk7XG5cbiAgICAgIHRoaXMuX3hTY2FsZSA9IHhTY2FsZTtcbiAgICB9XG5cbiAgICBjb25zdCByYXRpb0NoYW5nZSA9IHJhdGlvIC8gdGhpcy5fc3RyZXRjaFJhdGlvO1xuICAgIHRoaXMuX3N0cmV0Y2hSYXRpbyA9IHJhdGlvO1xuXG4gICAgLy8gcHJvcGFnYXRlIGNoYW5nZSB0byBjaGlsZHJlbiB3aG8gaGF2ZSB0aGVpciBvd24gc3RyZXRjaFJhdGlvXG4gICAgdGhpcy5fY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjaGlsZCkge1xuICAgICAgaWYgKGNoaWxkLl94U2NhbGUpIHtcbiAgICAgICAgY2hpbGQuc3RyZXRjaFJhdGlvID0gY2hpbGQuc3RyZXRjaFJhdGlvICogcmF0aW9DaGFuZ2U7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUaW1lQ29udGV4dDtcbiJdfQ==