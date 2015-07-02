/**
 * @class TimeContext
 *
 * A TimeContext instance represents a time segment and its horizontal scale to the pixel domain.
 * A timeContext is attached to a `Timeline` instance or its `Layer`.
 * When attached to a layer, a timeContext has a parent timeContext, the one attached to the timeline it belongs to.
 *
 * A timeContext has four importants attributes:
 * - timeContext.start which defines the start time of the context in seconds.
 *   - From a layer perspective, this could be the time at which temporal data must be represented in the timeline (for instance the begining of a soundfile in a DAW).
 *   - From a timeline perspective, this will always be 0.
 * - timeContext.offset which defines the offset time of the context in seconds.
 *   - From a timeline perspective, it is a way to have a window view upon a large timeline for instance.
 *   - From a layer perspective, this could be the offset time of the data in the context of a Layer (@TODO give a use case example here "crop ?", and/or explain that it's not a common use case).
 * - timeContext.duration which defines the duration
 *   - From a layer perspective, this is the duration of the temporal data (eg. the duration of a soundfile)
 *   - From a timeline perspective, this is the overall duration of the timeline
 * - stretchRatio which defines the stretch applied
 *   - From a timeline perspective, this is zoom factor we apply to the timeline
 *   - From a layer perspective, this is a way to stretch the datas.
 *
 * In actual implementation, timeContexts are organised in a tree structure, with the timeline's TimeContext on top of it.
 * @WARNING: the tree works with two level, but probably wont with more depth
 */
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _slicedToArray = require("babel-runtime/helpers/sliced-to-array")["default"];

var TimeContext = (function () {
  function TimeContext(_x, params) {
    var parent = arguments[0] === undefined ? null : arguments[0];

    _classCallCheck(this, TimeContext);

    this.parent = parent;
    this._children = [];

    this._xScale = null;
    this._originalXScale = null;

    this.params = params || {};

    this.start = 0; // Start time, in seconds
    this.duration = parent !== null ? parent.duration : 1;
    this.offset = 0; // Content offset in regard to start, in seconds
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

        if (!this.parent && !this._originalXScale) {
          this._originalXScale = this._xScale.copy();
        }
      }
    },
    xScaleRange: {
      set: function (range) {
        if (this._xScale) {
          this._xScale.range(range);
        }

        if (this._originalXScale) {
          this._originalXScale.range(range);
        }

        this._children.forEach(function (child) {
          child.xScaleRange = range;
        });
      },
      get: function (range) {
        return this.xScale.range();
      }
    },
    originalXScale: {

      /**
       * @return {Function} the xScale as defined in the timeline without stretching
       */

      get: function () {
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
        // Do not remove xScale on top of the graph
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

        // Propagate change to children who have their own stretchRatio
        var ratioChange = ratio / this._stretchRatio;

        this._children.forEach(function (child) {
          if (!child._xScale) {
            return;
          }
          child.stretchRatio = child.stretchRatio * ratioChange;
        });
      }
    }
  });

  return TimeContext;
})();

module.exports = TimeContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3RpbWUtY29udGV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXdCTSxXQUFXO0FBQ0osV0FEUCxXQUFXLEtBQ1ksTUFBTSxFQUFFO1FBQXZCLE1BQU0sZ0NBQUcsSUFBSTs7MEJBRHJCLFdBQVc7O0FBRWIsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsUUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7O0FBRXBCLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQ3BCLFFBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDOztBQUU1QixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sSUFBSSxFQUFFLENBQUM7O0FBRTNCLFFBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2YsUUFBSSxDQUFDLFFBQVEsR0FBRyxBQUFDLE1BQU0sS0FBSyxJQUFJLEdBQUksTUFBTSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7QUFDeEQsUUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDaEIsUUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7O0FBRXZCLFFBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNmLFVBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNsQztHQUNGOztlQWxCRyxXQUFXO0FBK0JYLFVBQU07Ozs7OztXQVJBLFlBQUc7QUFDWCxZQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ2hDLGlCQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1NBQzNCLE1BQU07QUFDTCxpQkFBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1NBQ3JCO09BQ0Y7V0FFUyxVQUFDLE1BQU0sRUFBRTtBQUNqQixZQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQzs7QUFFdEIsWUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFO0FBQ3pDLGNBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUM1QztPQUNGOztBQWNHLGVBQVc7V0FaQSxVQUFDLEtBQUssRUFBRTtBQUNyQixZQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDaEIsY0FBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDM0I7O0FBRUQsWUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO0FBQ3hCLGNBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ25DOztBQUVELFlBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFLO0FBQUUsZUFBSyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUE7U0FBRSxDQUFDLENBQUM7T0FDbEU7V0FFYyxVQUFDLEtBQUssRUFBRTtBQUNyQixlQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7T0FDNUI7O0FBS0csa0JBQWM7Ozs7OztXQUFBLFlBQUc7QUFDbkIsWUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2YsaUJBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUM7U0FDbkMsTUFBTTtBQUNMLGlCQUFPLElBQUksQ0FBQyxlQUFlLENBQUM7U0FDN0I7T0FDRjs7QUFNRyxnQkFBWTtXQUpBLFlBQUc7QUFDakIsZUFBTyxJQUFJLENBQUMsYUFBYSxDQUFDO09BQzNCO1dBRWUsVUFBQyxLQUFLLEVBQUU7O0FBRXRCLFlBQUksS0FBSyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQzlCLGNBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1NBQ3JCLE1BQU07QUFDTCxjQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDOzsrQkFDdkIsTUFBTSxDQUFDLE1BQU0sRUFBRTs7OztjQUEzQixHQUFHO2NBQUUsR0FBRzs7QUFFZixjQUFJLElBQUksR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUEsR0FBSSxLQUFLLENBQUM7O0FBRS9CLGNBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNmLGdCQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDO1dBQ3hDOztBQUVELGdCQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ2pDLGNBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1NBQ3ZCOztBQUVELFlBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDOzs7QUFHM0IsWUFBTSxXQUFXLEdBQUcsS0FBSyxHQUFJLElBQUksQ0FBQyxhQUFhLEFBQUMsQ0FBQzs7QUFFakQsWUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBUyxLQUFLLEVBQUU7QUFDckMsY0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUU7QUFBRSxtQkFBTztXQUFFO0FBQy9CLGVBQUssQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7U0FDdkQsQ0FBQyxDQUFDO09BQ0o7Ozs7U0FqR0csV0FBVzs7O0FBb0dqQixNQUFNLENBQUMsT0FBTyxHQUFHLFdBQVcsQ0FBQyIsImZpbGUiOiJlczYvY29yZS90aW1lLWNvbnRleHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBjbGFzcyBUaW1lQ29udGV4dFxuICpcbiAqIEEgVGltZUNvbnRleHQgaW5zdGFuY2UgcmVwcmVzZW50cyBhIHRpbWUgc2VnbWVudCBhbmQgaXRzIGhvcml6b250YWwgc2NhbGUgdG8gdGhlIHBpeGVsIGRvbWFpbi5cbiAqIEEgdGltZUNvbnRleHQgaXMgYXR0YWNoZWQgdG8gYSBgVGltZWxpbmVgIGluc3RhbmNlIG9yIGl0cyBgTGF5ZXJgLlxuICogV2hlbiBhdHRhY2hlZCB0byBhIGxheWVyLCBhIHRpbWVDb250ZXh0IGhhcyBhIHBhcmVudCB0aW1lQ29udGV4dCwgdGhlIG9uZSBhdHRhY2hlZCB0byB0aGUgdGltZWxpbmUgaXQgYmVsb25ncyB0by5cbiAqXG4gKiBBIHRpbWVDb250ZXh0IGhhcyBmb3VyIGltcG9ydGFudHMgYXR0cmlidXRlczpcbiAqIC0gdGltZUNvbnRleHQuc3RhcnQgd2hpY2ggZGVmaW5lcyB0aGUgc3RhcnQgdGltZSBvZiB0aGUgY29udGV4dCBpbiBzZWNvbmRzLlxuICogICAtIEZyb20gYSBsYXllciBwZXJzcGVjdGl2ZSwgdGhpcyBjb3VsZCBiZSB0aGUgdGltZSBhdCB3aGljaCB0ZW1wb3JhbCBkYXRhIG11c3QgYmUgcmVwcmVzZW50ZWQgaW4gdGhlIHRpbWVsaW5lIChmb3IgaW5zdGFuY2UgdGhlIGJlZ2luaW5nIG9mIGEgc291bmRmaWxlIGluIGEgREFXKS5cbiAqICAgLSBGcm9tIGEgdGltZWxpbmUgcGVyc3BlY3RpdmUsIHRoaXMgd2lsbCBhbHdheXMgYmUgMC5cbiAqIC0gdGltZUNvbnRleHQub2Zmc2V0IHdoaWNoIGRlZmluZXMgdGhlIG9mZnNldCB0aW1lIG9mIHRoZSBjb250ZXh0IGluIHNlY29uZHMuXG4gKiAgIC0gRnJvbSBhIHRpbWVsaW5lIHBlcnNwZWN0aXZlLCBpdCBpcyBhIHdheSB0byBoYXZlIGEgd2luZG93IHZpZXcgdXBvbiBhIGxhcmdlIHRpbWVsaW5lIGZvciBpbnN0YW5jZS5cbiAqICAgLSBGcm9tIGEgbGF5ZXIgcGVyc3BlY3RpdmUsIHRoaXMgY291bGQgYmUgdGhlIG9mZnNldCB0aW1lIG9mIHRoZSBkYXRhIGluIHRoZSBjb250ZXh0IG9mIGEgTGF5ZXIgKEBUT0RPIGdpdmUgYSB1c2UgY2FzZSBleGFtcGxlIGhlcmUgXCJjcm9wID9cIiwgYW5kL29yIGV4cGxhaW4gdGhhdCBpdCdzIG5vdCBhIGNvbW1vbiB1c2UgY2FzZSkuXG4gKiAtIHRpbWVDb250ZXh0LmR1cmF0aW9uIHdoaWNoIGRlZmluZXMgdGhlIGR1cmF0aW9uXG4gKiAgIC0gRnJvbSBhIGxheWVyIHBlcnNwZWN0aXZlLCB0aGlzIGlzIHRoZSBkdXJhdGlvbiBvZiB0aGUgdGVtcG9yYWwgZGF0YSAoZWcuIHRoZSBkdXJhdGlvbiBvZiBhIHNvdW5kZmlsZSlcbiAqICAgLSBGcm9tIGEgdGltZWxpbmUgcGVyc3BlY3RpdmUsIHRoaXMgaXMgdGhlIG92ZXJhbGwgZHVyYXRpb24gb2YgdGhlIHRpbWVsaW5lXG4gKiAtIHN0cmV0Y2hSYXRpbyB3aGljaCBkZWZpbmVzIHRoZSBzdHJldGNoIGFwcGxpZWRcbiAqICAgLSBGcm9tIGEgdGltZWxpbmUgcGVyc3BlY3RpdmUsIHRoaXMgaXMgem9vbSBmYWN0b3Igd2UgYXBwbHkgdG8gdGhlIHRpbWVsaW5lXG4gKiAgIC0gRnJvbSBhIGxheWVyIHBlcnNwZWN0aXZlLCB0aGlzIGlzIGEgd2F5IHRvIHN0cmV0Y2ggdGhlIGRhdGFzLlxuICpcbiAqIEluIGFjdHVhbCBpbXBsZW1lbnRhdGlvbiwgdGltZUNvbnRleHRzIGFyZSBvcmdhbmlzZWQgaW4gYSB0cmVlIHN0cnVjdHVyZSwgd2l0aCB0aGUgdGltZWxpbmUncyBUaW1lQ29udGV4dCBvbiB0b3Agb2YgaXQuXG4gKiBAV0FSTklORzogdGhlIHRyZWUgd29ya3Mgd2l0aCB0d28gbGV2ZWwsIGJ1dCBwcm9iYWJseSB3b250IHdpdGggbW9yZSBkZXB0aFxuICovXG5jbGFzcyBUaW1lQ29udGV4dCB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCA9IG51bGwsIHBhcmFtcykge1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgIHRoaXMuX2NoaWxkcmVuID0gW107XG5cbiAgICB0aGlzLl94U2NhbGUgPSBudWxsO1xuICAgIHRoaXMuX29yaWdpbmFsWFNjYWxlID0gbnVsbDtcblxuICAgIHRoaXMucGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuXG4gICAgdGhpcy5zdGFydCA9IDA7ICAvLyBTdGFydCB0aW1lLCBpbiBzZWNvbmRzXG4gICAgdGhpcy5kdXJhdGlvbiA9IChwYXJlbnQgIT09IG51bGwpID8gcGFyZW50LmR1cmF0aW9uIDrCoDE7XG4gICAgdGhpcy5vZmZzZXQgPSAwOyAgLy8gQ29udGVudCBvZmZzZXQgaW4gcmVnYXJkIHRvIHN0YXJ0LCBpbiBzZWNvbmRzXG4gICAgdGhpcy5fc3RyZXRjaFJhdGlvID0gMTtcblxuICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgdGhpcy5wYXJlbnQuX2NoaWxkcmVuLnB1c2godGhpcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufSB0aGUgY2xvc2VzdCBhdmFpbGFibGUgeFNjYWxlIGluIHRoZSBUaW1lQ29udGV4dCB0cmVlXG4gICAqL1xuICBnZXQgeFNjYWxlKCkge1xuICAgIGlmICh0aGlzLnBhcmVudCAmJiAhdGhpcy5feFNjYWxlKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnQueFNjYWxlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5feFNjYWxlO1xuICAgIH1cbiAgfVxuXG4gIHNldCB4U2NhbGUoeFNjYWxlKSB7XG4gICAgdGhpcy5feFNjYWxlID0geFNjYWxlO1xuXG4gICAgaWYgKCF0aGlzLnBhcmVudCAmJiAhdGhpcy5fb3JpZ2luYWxYU2NhbGUpIHtcbiAgICAgIHRoaXMuX29yaWdpbmFsWFNjYWxlID0gdGhpcy5feFNjYWxlLmNvcHkoKTtcbiAgICB9XG4gIH1cblxuICBzZXQgeFNjYWxlUmFuZ2UocmFuZ2UpIHtcbiAgICBpZiAodGhpcy5feFNjYWxlKSB7XG4gICAgICB0aGlzLl94U2NhbGUucmFuZ2UocmFuZ2UpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9vcmlnaW5hbFhTY2FsZSkge1xuICAgICAgdGhpcy5fb3JpZ2luYWxYU2NhbGUucmFuZ2UocmFuZ2UpO1xuICAgIH1cblxuICAgIHRoaXMuX2NoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7IGNoaWxkLnhTY2FsZVJhbmdlID0gcmFuZ2UgfSk7XG4gIH1cblxuICBnZXQgeFNjYWxlUmFuZ2UocmFuZ2UpIHtcbiAgICByZXR1cm4gdGhpcy54U2NhbGUucmFuZ2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gdGhlIHhTY2FsZSBhcyBkZWZpbmVkIGluIHRoZSB0aW1lbGluZSB3aXRob3V0IHN0cmV0Y2hpbmdcbiAgICovXG4gIGdldCBvcmlnaW5hbFhTY2FsZSgpIHtcbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudC5vcmlnaW5hbFhTY2FsZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX29yaWdpbmFsWFNjYWxlO1xuICAgIH1cbiAgfVxuXG4gIGdldCBzdHJldGNoUmF0aW8oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0cmV0Y2hSYXRpbztcbiAgfVxuXG4gIHNldCBzdHJldGNoUmF0aW8ocmF0aW8pIHtcbiAgICAvLyBEbyBub3QgcmVtb3ZlIHhTY2FsZSBvbiB0b3Agb2YgdGhlIGdyYXBoXG4gICAgaWYgKHJhdGlvID09PSAxICYmIHRoaXMucGFyZW50KSB7XG4gICAgICB0aGlzLl94U2NhbGUgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB4U2NhbGUgPSB0aGlzLm9yaWdpbmFsWFNjYWxlLmNvcHkoKTtcbiAgICAgIGNvbnN0IFttaW4sIG1heF0gPSB4U2NhbGUuZG9tYWluKCk7XG5cbiAgICAgIGxldCBkaWZmID0gKG1heCAtIG1pbikgLyByYXRpbztcblxuICAgICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICAgIGRpZmYgPSBkaWZmIC8gdGhpcy5wYXJlbnQuc3RyZXRjaFJhdGlvO1xuICAgICAgfVxuXG4gICAgICB4U2NhbGUuZG9tYWluKFttaW4sIG1pbiArIGRpZmZdKTtcbiAgICAgIHRoaXMuX3hTY2FsZSA9IHhTY2FsZTtcbiAgICB9XG5cbiAgICB0aGlzLl9zdHJldGNoUmF0aW8gPSByYXRpbztcblxuICAgIC8vIFByb3BhZ2F0ZSBjaGFuZ2UgdG8gY2hpbGRyZW4gd2hvIGhhdmUgdGhlaXIgb3duIHN0cmV0Y2hSYXRpb1xuICAgIGNvbnN0IHJhdGlvQ2hhbmdlID0gcmF0aW8gLyAodGhpcy5fc3RyZXRjaFJhdGlvKTtcblxuICAgIHRoaXMuX2NoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgIGlmICghY2hpbGQuX3hTY2FsZSkgeyByZXR1cm47IH1cbiAgICAgIGNoaWxkLnN0cmV0Y2hSYXRpbyA9IGNoaWxkLnN0cmV0Y2hSYXRpbyAqIHJhdGlvQ2hhbmdlO1xuICAgIH0pO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVGltZUNvbnRleHQ7XG4iXX0=