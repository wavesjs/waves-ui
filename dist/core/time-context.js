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
  function TimeContext() {
    var parent = arguments[0] === undefined ? null : arguments[0];

    _classCallCheck(this, TimeContext);

    this.parent = parent;
    this._children = [];

    this._xScale = null;
    this._originalXScale = null;

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
        return this.xScale;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3RpbWUtY29udGV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXdCTSxXQUFXO0FBQ0osV0FEUCxXQUFXLEdBQ1k7UUFBZixNQUFNLGdDQUFHLElBQUk7OzBCQURyQixXQUFXOztBQUViLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLFFBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDOztBQUVwQixRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztBQUNwQixRQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQzs7QUFFNUIsUUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDZixRQUFJLENBQUMsUUFBUSxHQUFHLEFBQUMsTUFBTSxLQUFLLElBQUksR0FBSSxNQUFNLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztBQUN4RCxRQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNoQixRQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQzs7QUFFdkIsUUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2YsVUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ2xDO0dBQ0Y7O2VBaEJHLFdBQVc7QUE2QlgsVUFBTTs7Ozs7O1dBUkEsWUFBRztBQUNYLFlBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDaEMsaUJBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7U0FDM0IsTUFBTTtBQUNMLGlCQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDckI7T0FDRjtXQUVTLFVBQUMsTUFBTSxFQUFFO0FBQ2pCLFlBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDOztBQUV0QixZQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUU7QUFDekMsY0FBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQzVDO09BQ0Y7O0FBY0csZUFBVztXQVpBLFVBQUMsS0FBSyxFQUFFO0FBQ3JCLFlBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNoQixjQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUMzQjs7QUFFRCxZQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7QUFDeEIsY0FBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDbkM7O0FBRUQsWUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLLEVBQUs7QUFBRSxlQUFLLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQTtTQUFFLENBQUMsQ0FBQztPQUNsRTtXQUVjLFVBQUMsS0FBSyxFQUFFO0FBQ3JCLGVBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQTtPQUNuQjs7QUFLRyxrQkFBYzs7Ozs7O1dBQUEsWUFBRztBQUNuQixZQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDZixpQkFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQztTQUNuQyxNQUFNO0FBQ0wsaUJBQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQztTQUM3QjtPQUNGOztBQU1HLGdCQUFZO1dBSkEsWUFBRztBQUNqQixlQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7T0FDM0I7V0FFZSxVQUFDLEtBQUssRUFBRTs7QUFFdEIsWUFBSSxLQUFLLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDOUIsY0FBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7U0FDckIsTUFBTTtBQUNMLGNBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUM7OytCQUN2QixNQUFNLENBQUMsTUFBTSxFQUFFOzs7O2NBQTNCLEdBQUc7Y0FBRSxHQUFHOztBQUVmLGNBQUksSUFBSSxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQSxHQUFJLEtBQUssQ0FBQzs7QUFFL0IsY0FBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2YsZ0JBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUM7V0FDeEM7O0FBRUQsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDakMsY0FBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7U0FDdkI7O0FBRUQsWUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7OztBQUczQixZQUFNLFdBQVcsR0FBRyxLQUFLLEdBQUksSUFBSSxDQUFDLGFBQWEsQUFBQyxDQUFDOztBQUVqRCxZQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFTLEtBQUssRUFBRTtBQUNyQyxjQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRTtBQUFFLG1CQUFPO1dBQUU7QUFDL0IsZUFBSyxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQztTQUN2RCxDQUFDLENBQUM7T0FDSjs7OztTQS9GRyxXQUFXOzs7QUFrR2pCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsV0FBVyxDQUFDIiwiZmlsZSI6ImVzNi9jb3JlL3RpbWUtY29udGV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGNsYXNzIFRpbWVDb250ZXh0XG4gKlxuICogQSBUaW1lQ29udGV4dCBpbnN0YW5jZSByZXByZXNlbnRzIGEgdGltZSBzZWdtZW50IGFuZCBpdHMgaG9yaXpvbnRhbCBzY2FsZSB0byB0aGUgcGl4ZWwgZG9tYWluLlxuICogQSB0aW1lQ29udGV4dCBpcyBhdHRhY2hlZCB0byBhIGBUaW1lbGluZWAgaW5zdGFuY2Ugb3IgaXRzIGBMYXllcmAuXG4gKiBXaGVuIGF0dGFjaGVkIHRvIGEgbGF5ZXIsIGEgdGltZUNvbnRleHQgaGFzIGEgcGFyZW50IHRpbWVDb250ZXh0LCB0aGUgb25lIGF0dGFjaGVkIHRvIHRoZSB0aW1lbGluZSBpdCBiZWxvbmdzIHRvLlxuICpcbiAqIEEgdGltZUNvbnRleHQgaGFzIGZvdXIgaW1wb3J0YW50cyBhdHRyaWJ1dGVzOlxuICogLSB0aW1lQ29udGV4dC5zdGFydCB3aGljaCBkZWZpbmVzIHRoZSBzdGFydCB0aW1lIG9mIHRoZSBjb250ZXh0IGluIHNlY29uZHMuXG4gKiAgIC0gRnJvbSBhIGxheWVyIHBlcnNwZWN0aXZlLCB0aGlzIGNvdWxkIGJlIHRoZSB0aW1lIGF0IHdoaWNoIHRlbXBvcmFsIGRhdGEgbXVzdCBiZSByZXByZXNlbnRlZCBpbiB0aGUgdGltZWxpbmUgKGZvciBpbnN0YW5jZSB0aGUgYmVnaW5pbmcgb2YgYSBzb3VuZGZpbGUgaW4gYSBEQVcpLlxuICogICAtIEZyb20gYSB0aW1lbGluZSBwZXJzcGVjdGl2ZSwgdGhpcyB3aWxsIGFsd2F5cyBiZSAwLlxuICogLSB0aW1lQ29udGV4dC5vZmZzZXQgd2hpY2ggZGVmaW5lcyB0aGUgb2Zmc2V0IHRpbWUgb2YgdGhlIGNvbnRleHQgaW4gc2Vjb25kcy5cbiAqICAgLSBGcm9tIGEgdGltZWxpbmUgcGVyc3BlY3RpdmUsIGl0IGlzIGEgd2F5IHRvIGhhdmUgYSB3aW5kb3cgdmlldyB1cG9uIGEgbGFyZ2UgdGltZWxpbmUgZm9yIGluc3RhbmNlLlxuICogICAtIEZyb20gYSBsYXllciBwZXJzcGVjdGl2ZSwgdGhpcyBjb3VsZCBiZSB0aGUgb2Zmc2V0IHRpbWUgb2YgdGhlIGRhdGEgaW4gdGhlIGNvbnRleHQgb2YgYSBMYXllciAoQFRPRE8gZ2l2ZSBhIHVzZSBjYXNlIGV4YW1wbGUgaGVyZSBcImNyb3AgP1wiLCBhbmQvb3IgZXhwbGFpbiB0aGF0IGl0J3Mgbm90IGEgY29tbW9uIHVzZSBjYXNlKS5cbiAqIC0gdGltZUNvbnRleHQuZHVyYXRpb24gd2hpY2ggZGVmaW5lcyB0aGUgZHVyYXRpb25cbiAqICAgLSBGcm9tIGEgbGF5ZXIgcGVyc3BlY3RpdmUsIHRoaXMgaXMgdGhlIGR1cmF0aW9uIG9mIHRoZSB0ZW1wb3JhbCBkYXRhIChlZy4gdGhlIGR1cmF0aW9uIG9mIGEgc291bmRmaWxlKVxuICogICAtIEZyb20gYSB0aW1lbGluZSBwZXJzcGVjdGl2ZSwgdGhpcyBpcyB0aGUgb3ZlcmFsbCBkdXJhdGlvbiBvZiB0aGUgdGltZWxpbmVcbiAqIC0gc3RyZXRjaFJhdGlvIHdoaWNoIGRlZmluZXMgdGhlIHN0cmV0Y2ggYXBwbGllZFxuICogICAtIEZyb20gYSB0aW1lbGluZSBwZXJzcGVjdGl2ZSwgdGhpcyBpcyB6b29tIGZhY3RvciB3ZSBhcHBseSB0byB0aGUgdGltZWxpbmVcbiAqICAgLSBGcm9tIGEgbGF5ZXIgcGVyc3BlY3RpdmUsIHRoaXMgaXMgYSB3YXkgdG8gc3RyZXRjaCB0aGUgZGF0YXMuXG4gKlxuICogSW4gYWN0dWFsIGltcGxlbWVudGF0aW9uLCB0aW1lQ29udGV4dHMgYXJlIG9yZ2FuaXNlZCBpbiBhIHRyZWUgc3RydWN0dXJlLCB3aXRoIHRoZSB0aW1lbGluZSdzIFRpbWVDb250ZXh0IG9uIHRvcCBvZiBpdC5cbiAqIEBXQVJOSU5HOiB0aGUgdHJlZSB3b3JrcyB3aXRoIHR3byBsZXZlbCwgYnV0IHByb2JhYmx5IHdvbnQgd2l0aCBtb3JlIGRlcHRoXG4gKi9cbmNsYXNzIFRpbWVDb250ZXh0IHtcbiAgY29uc3RydWN0b3IocGFyZW50ID0gbnVsbCkge1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgIHRoaXMuX2NoaWxkcmVuID0gW107XG5cbiAgICB0aGlzLl94U2NhbGUgPSBudWxsO1xuICAgIHRoaXMuX29yaWdpbmFsWFNjYWxlID0gbnVsbDtcblxuICAgIHRoaXMuc3RhcnQgPSAwOyAgLy8gU3RhcnQgdGltZSwgaW4gc2Vjb25kc1xuICAgIHRoaXMuZHVyYXRpb24gPSAocGFyZW50ICE9PSBudWxsKSA/IHBhcmVudC5kdXJhdGlvbiA6wqAxO1xuICAgIHRoaXMub2Zmc2V0ID0gMDsgIC8vIENvbnRlbnQgb2Zmc2V0IGluIHJlZ2FyZCB0byBzdGFydCwgaW4gc2Vjb25kc1xuICAgIHRoaXMuX3N0cmV0Y2hSYXRpbyA9IDE7XG5cbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgIHRoaXMucGFyZW50Ll9jaGlsZHJlbi5wdXNoKHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gdGhlIGNsb3Nlc3QgYXZhaWxhYmxlIHhTY2FsZSBpbiB0aGUgVGltZUNvbnRleHQgdHJlZVxuICAgKi9cbiAgZ2V0IHhTY2FsZSgpIHtcbiAgICBpZiAodGhpcy5wYXJlbnQgJiYgIXRoaXMuX3hTY2FsZSkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyZW50LnhTY2FsZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX3hTY2FsZTtcbiAgICB9XG4gIH1cblxuICBzZXQgeFNjYWxlKHhTY2FsZSkge1xuICAgIHRoaXMuX3hTY2FsZSA9IHhTY2FsZTtcblxuICAgIGlmICghdGhpcy5wYXJlbnQgJiYgIXRoaXMuX29yaWdpbmFsWFNjYWxlKSB7XG4gICAgICB0aGlzLl9vcmlnaW5hbFhTY2FsZSA9IHRoaXMuX3hTY2FsZS5jb3B5KCk7XG4gICAgfVxuICB9XG5cbiAgc2V0IHhTY2FsZVJhbmdlKHJhbmdlKSB7XG4gICAgaWYgKHRoaXMuX3hTY2FsZSkge1xuICAgICAgdGhpcy5feFNjYWxlLnJhbmdlKHJhbmdlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fb3JpZ2luYWxYU2NhbGUpIHtcbiAgICAgIHRoaXMuX29yaWdpbmFsWFNjYWxlLnJhbmdlKHJhbmdlKTtcbiAgICB9XG5cbiAgICB0aGlzLl9jaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4geyBjaGlsZC54U2NhbGVSYW5nZSA9IHJhbmdlIH0pO1xuICB9XG5cbiAgZ2V0IHhTY2FsZVJhbmdlKHJhbmdlKSB7XG4gICAgcmV0dXJuIHRoaXMueFNjYWxlXG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7RnVuY3Rpb259IHRoZSB4U2NhbGUgYXMgZGVmaW5lZCBpbiB0aGUgdGltZWxpbmUgd2l0aG91dCBzdHJldGNoaW5nXG4gICAqL1xuICBnZXQgb3JpZ2luYWxYU2NhbGUoKSB7XG4gICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnQub3JpZ2luYWxYU2NhbGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9vcmlnaW5hbFhTY2FsZTtcbiAgICB9XG4gIH1cblxuICBnZXQgc3RyZXRjaFJhdGlvKCkge1xuICAgIHJldHVybiB0aGlzLl9zdHJldGNoUmF0aW87XG4gIH1cblxuICBzZXQgc3RyZXRjaFJhdGlvKHJhdGlvKSB7XG4gICAgLy8gRG8gbm90IHJlbW92ZSB4U2NhbGUgb24gdG9wIG9mIHRoZSBncmFwaFxuICAgIGlmIChyYXRpbyA9PT0gMSAmJiB0aGlzLnBhcmVudCkge1xuICAgICAgdGhpcy5feFNjYWxlID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgeFNjYWxlID0gdGhpcy5vcmlnaW5hbFhTY2FsZS5jb3B5KCk7XG4gICAgICBjb25zdCBbbWluLCBtYXhdID0geFNjYWxlLmRvbWFpbigpO1xuXG4gICAgICBsZXQgZGlmZiA9IChtYXggLSBtaW4pIC8gcmF0aW87XG5cbiAgICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgICBkaWZmID0gZGlmZiAvIHRoaXMucGFyZW50LnN0cmV0Y2hSYXRpbztcbiAgICAgIH1cblxuICAgICAgeFNjYWxlLmRvbWFpbihbbWluLCBtaW4gKyBkaWZmXSk7XG4gICAgICB0aGlzLl94U2NhbGUgPSB4U2NhbGU7XG4gICAgfVxuXG4gICAgdGhpcy5fc3RyZXRjaFJhdGlvID0gcmF0aW87XG5cbiAgICAvLyBQcm9wYWdhdGUgY2hhbmdlIHRvIGNoaWxkcmVuIHdobyBoYXZlIHRoZWlyIG93biBzdHJldGNoUmF0aW9cbiAgICBjb25zdCByYXRpb0NoYW5nZSA9IHJhdGlvIC8gKHRoaXMuX3N0cmV0Y2hSYXRpbyk7XG5cbiAgICB0aGlzLl9jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICBpZiAoIWNoaWxkLl94U2NhbGUpIHsgcmV0dXJuOyB9XG4gICAgICBjaGlsZC5zdHJldGNoUmF0aW8gPSBjaGlsZC5zdHJldGNoUmF0aW8gKiByYXRpb0NoYW5nZTtcbiAgICB9KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRpbWVDb250ZXh0O1xuIl19