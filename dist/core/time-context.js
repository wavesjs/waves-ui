/**
 *  @class TimeContext
 *
 *  represent a time segment and its scale to the pixel domain
 *  the timeContexts are organised in a tree structure,
 *  with the timeline's TimeContext on top
 *
 *  @WARNING: the tree works with two level, but probably wont with more depth
 */
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _slicedToArray = require("babel-runtime/helpers/sliced-to-array")["default"];

var TimeContext = (function () {
  function TimeContext() {
    var parent = arguments[0] === undefined ? null : arguments[0];

    _classCallCheck(this, TimeContext);

    this.parent = parent;
    this._children = [];

    this._xScale = null;
    this._originalXScale = null;

    this.start = 0;
    this.duration = parent !== null ? parent.duration : 1;
    this.offset = 0;
    this._stretchRatio = 1;

    if (this.parent) {
      this.parent._children.push(this);
    }
  }

  _createClass(TimeContext, {
    xScale: {

      /**
       * @return {Function} the closest available xScale in the TimeContext tree
       */

      get: function () {
        if (this.parent && !this._xScale) {
          return this.parent.xScale;
        } else {
          return this._xScale;
        }
      },
      set: function (xScale) {
        this._xScale = xScale;
      }
    },
    originalXScale: {

      // returns the xScale as defined in the timeline without stretching

      get: function () {
        // lazy bind originalXScale on top of the tree
        if (!this.parent && !this._originalXScale) {
          this._originalXScale = this._xScale;
        }

        // returns the closest available xScale in the tree (aka the timeline)
        if (this.parent) {
          return this.parent.originalXScale;
        } else {
          return this._originalXScale;
        }
      }
    },
    stretchRatio: {
      get: function () {
        return this._stretchRatio;
      },
      set: function (ratio) {
        // do not remove xScale on top of the graph
        if (ratio === 1 && this.parent) {
          this._xScale = null;
        } else {
          var xScale = this.originalXScale.copy();

          var _xScale$domain = xScale.domain();

          var _xScale$domain2 = _slicedToArray(_xScale$domain, 2);

          var min = _xScale$domain2[0];
          var max = _xScale$domain2[1];

          var diff = (max - min) / ratio;

          if (this.parent) {
            diff = diff / this.parent.stretchRatio;
          }

          xScale.domain([min, min + diff]);
          this._xScale = xScale;
        }

        this._stretchRatio = ratio;

        // propagate change to children who have their own stretchRatio
        var ratioChange = ratio / this._stretchRatio;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3RpbWUtY29udGV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztJQVNNLFdBQVc7QUFDSixXQURQLFdBQVcsR0FDWTtRQUFmLE1BQU0sZ0NBQUcsSUFBSTs7MEJBRHJCLFdBQVc7O0FBRWIsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsUUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7O0FBRXBCLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQ3BCLFFBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDOztBQUU1QixRQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztBQUNmLFFBQUksQ0FBQyxRQUFRLEdBQUcsQUFBQyxNQUFNLEtBQUssSUFBSSxHQUFJLE1BQU0sQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO0FBQ3hELFFBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLFFBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDOztBQUV2QixRQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDZixVQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDbEM7R0FDRjs7ZUFoQkcsV0FBVztBQTZCWCxVQUFNOzs7Ozs7V0FSQSxZQUFHO0FBQ1gsWUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNoQyxpQkFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztTQUMzQixNQUFNO0FBQ0wsaUJBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztTQUNyQjtPQUNGO1dBRVMsVUFBQyxNQUFNLEVBQUU7QUFDakIsWUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7T0FDdkI7O0FBR0csa0JBQWM7Ozs7V0FBQSxZQUFHOztBQUVuQixZQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUU7QUFDekMsY0FBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1NBQ3JDOzs7QUFHRCxZQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDZixpQkFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQztTQUNuQyxNQUFNO0FBQ0wsaUJBQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQztTQUM3QjtPQUNGOztBQU1HLGdCQUFZO1dBSkEsWUFBRztBQUNqQixlQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7T0FDM0I7V0FFZSxVQUFDLEtBQUssRUFBRTs7QUFFdEIsWUFBSSxLQUFLLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDOUIsY0FBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7U0FDckIsTUFBTTtBQUNMLGNBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUM7OytCQUN2QixNQUFNLENBQUMsTUFBTSxFQUFFOzs7O2NBQTNCLEdBQUc7Y0FBRSxHQUFHOztBQUVmLGNBQUksSUFBSSxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQSxHQUFJLEtBQUssQ0FBQzs7QUFFL0IsY0FBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2YsZ0JBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUM7V0FDeEM7O0FBRUQsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDakMsY0FBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7U0FDdkI7O0FBRUQsWUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7OztBQUczQixZQUFNLFdBQVcsR0FBRyxLQUFLLEdBQUksSUFBSSxDQUFDLGFBQWEsQUFBQyxDQUFDOztBQUVqRCxZQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFTLEtBQUssRUFBRTtBQUNyQyxjQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUU7QUFDakIsaUJBQUssQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7V0FDdkQ7U0FDRixDQUFDLENBQUM7T0FDSjs7OztTQWhGRyxXQUFXOzs7QUFtRmpCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsV0FBVyxDQUFDIiwiZmlsZSI6ImVzNi9jb3JlL3RpbWUtY29udGV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogIEBjbGFzcyBUaW1lQ29udGV4dFxuICpcbiAqICByZXByZXNlbnQgYSB0aW1lIHNlZ21lbnQgYW5kIGl0cyBzY2FsZSB0byB0aGUgcGl4ZWwgZG9tYWluXG4gKiAgdGhlIHRpbWVDb250ZXh0cyBhcmUgb3JnYW5pc2VkIGluIGEgdHJlZSBzdHJ1Y3R1cmUsXG4gKiAgd2l0aCB0aGUgdGltZWxpbmUncyBUaW1lQ29udGV4dCBvbiB0b3BcbiAqXG4gKiAgQFdBUk5JTkc6IHRoZSB0cmVlIHdvcmtzIHdpdGggdHdvIGxldmVsLCBidXQgcHJvYmFibHkgd29udCB3aXRoIG1vcmUgZGVwdGhcbiAqL1xuY2xhc3MgVGltZUNvbnRleHQge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQgPSBudWxsKSB7XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgdGhpcy5fY2hpbGRyZW4gPSBbXTtcblxuICAgIHRoaXMuX3hTY2FsZSA9IG51bGw7XG4gICAgdGhpcy5fb3JpZ2luYWxYU2NhbGUgPSBudWxsO1xuXG4gICAgdGhpcy5zdGFydCA9IDA7XG4gICAgdGhpcy5kdXJhdGlvbiA9IChwYXJlbnQgIT09IG51bGwpID8gcGFyZW50LmR1cmF0aW9uIDrCoDE7XG4gICAgdGhpcy5vZmZzZXQgPSAwO1xuICAgIHRoaXMuX3N0cmV0Y2hSYXRpbyA9IDE7XG5cbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgIHRoaXMucGFyZW50Ll9jaGlsZHJlbi5wdXNoKHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gdGhlIGNsb3Nlc3QgYXZhaWxhYmxlIHhTY2FsZSBpbiB0aGUgVGltZUNvbnRleHQgdHJlZVxuICAgKi9cbiAgZ2V0IHhTY2FsZSgpIHtcbiAgICBpZiAodGhpcy5wYXJlbnQgJiYgIXRoaXMuX3hTY2FsZSkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyZW50LnhTY2FsZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX3hTY2FsZTtcbiAgICB9XG4gIH1cblxuICBzZXQgeFNjYWxlKHhTY2FsZSkge1xuICAgIHRoaXMuX3hTY2FsZSA9IHhTY2FsZTtcbiAgfVxuXG4gIC8vIHJldHVybnMgdGhlIHhTY2FsZSBhcyBkZWZpbmVkIGluIHRoZSB0aW1lbGluZSB3aXRob3V0IHN0cmV0Y2hpbmdcbiAgZ2V0IG9yaWdpbmFsWFNjYWxlKCkge1xuICAgIC8vIGxhenkgYmluZCBvcmlnaW5hbFhTY2FsZSBvbiB0b3Agb2YgdGhlIHRyZWVcbiAgICBpZiAoIXRoaXMucGFyZW50ICYmICF0aGlzLl9vcmlnaW5hbFhTY2FsZSkge1xuICAgICAgdGhpcy5fb3JpZ2luYWxYU2NhbGUgPSB0aGlzLl94U2NhbGU7XG4gICAgfVxuXG4gICAgLy8gcmV0dXJucyB0aGUgY2xvc2VzdCBhdmFpbGFibGUgeFNjYWxlIGluIHRoZSB0cmVlIChha2EgdGhlIHRpbWVsaW5lKVxuICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyZW50Lm9yaWdpbmFsWFNjYWxlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fb3JpZ2luYWxYU2NhbGU7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHN0cmV0Y2hSYXRpbygpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RyZXRjaFJhdGlvO1xuICB9XG5cbiAgc2V0IHN0cmV0Y2hSYXRpbyhyYXRpbykge1xuICAgIC8vIGRvIG5vdCByZW1vdmUgeFNjYWxlIG9uIHRvcCBvZiB0aGUgZ3JhcGhcbiAgICBpZiAocmF0aW8gPT09IDEgJiYgdGhpcy5wYXJlbnQpIHtcbiAgICAgIHRoaXMuX3hTY2FsZSA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHhTY2FsZSA9IHRoaXMub3JpZ2luYWxYU2NhbGUuY29weSgpO1xuICAgICAgY29uc3QgW21pbiwgbWF4XSA9IHhTY2FsZS5kb21haW4oKTtcblxuICAgICAgbGV0IGRpZmYgPSAobWF4IC0gbWluKSAvIHJhdGlvO1xuXG4gICAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgICAgZGlmZiA9IGRpZmYgLyB0aGlzLnBhcmVudC5zdHJldGNoUmF0aW87XG4gICAgICB9XG5cbiAgICAgIHhTY2FsZS5kb21haW4oW21pbiwgbWluICsgZGlmZl0pO1xuICAgICAgdGhpcy5feFNjYWxlID0geFNjYWxlO1xuICAgIH1cblxuICAgIHRoaXMuX3N0cmV0Y2hSYXRpbyA9IHJhdGlvO1xuXG4gICAgLy8gcHJvcGFnYXRlIGNoYW5nZSB0byBjaGlsZHJlbiB3aG8gaGF2ZSB0aGVpciBvd24gc3RyZXRjaFJhdGlvXG4gICAgY29uc3QgcmF0aW9DaGFuZ2UgPSByYXRpbyAvICh0aGlzLl9zdHJldGNoUmF0aW8pO1xuXG4gICAgdGhpcy5fY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjaGlsZCkge1xuICAgICAgaWYgKGNoaWxkLl94U2NhbGUpIHtcbiAgICAgICAgY2hpbGQuc3RyZXRjaFJhdGlvID0gY2hpbGQuc3RyZXRjaFJhdGlvICogcmF0aW9DaGFuZ2U7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUaW1lQ29udGV4dDtcbiJdfQ==