"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _slicedToArray = require("babel-runtime/helpers/sliced-to-array")["default"];

var _core = require("babel-runtime/core-js")["default"];

var AbstractTimeContext = require("./abstract-time-context");

/**
 *  @class LayerTimeContext
 *
 *  A `LayerTimeContext` instance represent a time segment into a `TimelineTimeContext`. It must be attached to a `TimelineTimeContext` (the one of the timeline it belongs to). It relies on its parent's xScale (time to pixel transfert function) to create the time to pixel representation of the Layer (the view) it is attached to.
 *
 *  The `layerTimeContext` has four important attributes
 *  - `timeContext.start` represent the time at which temporal data must be represented in the timeline (for instance the begining of a soundfile in a DAW)
 *  - `timeContext.offset` represents offset time of the data in the context of a Layer. (@TODO give a use case example here "crop ?", and/or explain that it's not a common use case)
 *  - `timeContext.duration` is the duration of the view on the data
 *  - `timeContext.stretchRatio` is the stretch applyed to the temporal data contained in the view (this value can be seen as a local zoom on the data, or as a stretch on the time components of the data). When applyed, the stretch ratio maintain the start position of the view in the timeline.
 *
 * + timeline -----------------------------------------------------------------
 * 0         5         10          15          20        25          30 seconds
 * +---+*****************+------------------------------------------+*******+--
 *     |*** soundfile ***|Layer (view on the sound file)            |*******|
 *     +*****************+------------------------------------------+*******+
 *
 *     <---- offset ----><--------------- duration ----------------->
 * <-------- start ----->
 *
 *      The parts of the sound file represented with '*' are hidden from the view
 *
 */

var LayerTimeContext = (function (_AbstractTimeContext) {
  function LayerTimeContext(parent) {
    _classCallCheck(this, LayerTimeContext);

    _get(_core.Object.getPrototypeOf(LayerTimeContext.prototype), "constructor", this).call(this, {});
    if (!parent) {
      throw new Error("LayerTimeContext must have a parent");
    }

    this.parent = parent;

    this._xScale = null;

    this._start = 0;
    this._duration = parent.containersDuration;
    this._offset = 0;
    this._stretchRatio = 1;
    // register into the timeline's TimeContext
    this.parent._children.push(this);
  }

  _inherits(LayerTimeContext, _AbstractTimeContext);

  _createClass(LayerTimeContext, {
    clone: {
      value: function clone() {
        var ctx = new this();
        ctx.start = this.start;
        ctx.duration = this.duration;
        ctx.offset = this.offset;
        ctx.stretchRatio = this.stretchRatio;

        return ctx;
      }
    },
    start: {
      get: function () {
        return this._start;
      },
      set: function (value) {
        this._start = value;
      }
    },
    duration: {
      get: function () {
        return this._duration;
      },
      set: function (value) {
        this._duration = value;
      }
    },
    offset: {
      get: function () {
        return this._offset;
      },
      set: function (value) {
        this._offset = value;
      }
    },
    stretchRatio: {
      get: function () {
        return this._stretchRatio;
      },
      set: function (value) {
        // remove local xScale if ratio = 1
        if (value === 1) {
          this._xScale = null;
          return;
        }

        var xScale = this.parent.originalXScale.copy();

        var _xScale$domain = xScale.domain();

        var _xScale$domain2 = _slicedToArray(_xScale$domain, 2);

        var min = _xScale$domain2[0];
        var max = _xScale$domain2[1];

        var diff = (max - min) / (value * this.parent.stretchRatio);

        xScale.domain([min, min + diff]);

        this._xScale = xScale;
        this._stretchRatio = value;
      }
    },
    xScale: {
      get: function () {
        if (!this._xScale) {
          return this.parent.xScale;
        }

        return this._xScale;
      }
    },
    xScaleRange: {

      // set xScale(scale) {
      //   this._xScale = scale;
      // }

      get: function () {
        return this.xScale.range();
      },
      set: function (arr) {
        if (!this._xScale) {
          return;
        }
        this._xScale.range(arr);
      }
    },
    originalXScale: {

      // read only

      get: function () {
        return this.parent.originalXScale();
      }
    }
  });

  return LayerTimeContext;
})(AbstractTimeContext);

module.exports = LayerTimeContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL2xheWVyLXRpbWUtY29udGV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sbUJBQW1CLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBeUJ6RCxnQkFBZ0I7QUFDVCxXQURQLGdCQUFnQixDQUNSLE1BQU0sRUFBRTswQkFEaEIsZ0JBQWdCOztBQUVsQixxQ0FGRSxnQkFBZ0IsNkNBRVosRUFBRSxFQUFFO0FBQ1YsUUFBSSxDQUFDLE1BQU0sRUFBRTtBQUFFLFlBQU0sSUFBSSxLQUFLLENBQUMscUNBQXFDLENBQUMsQ0FBQztLQUFFOztBQUV4RSxRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQzs7QUFFckIsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7O0FBRXBCLFFBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLFFBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDO0FBQzNDLFFBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDOztBQUV2QixRQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDbEM7O1lBZkcsZ0JBQWdCOztlQUFoQixnQkFBZ0I7QUFpQnBCLFNBQUs7YUFBQSxpQkFBRztBQUNOLFlBQU0sR0FBRyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7QUFDdkIsV0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3ZCLFdBQUcsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUM3QixXQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDekIsV0FBRyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDOztBQUVyQyxlQUFPLEdBQUcsQ0FBQztPQUNaOztBQU1HLFNBQUs7V0FKQSxZQUFHO0FBQ1YsZUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDO09BQ3BCO1dBRVEsVUFBQyxLQUFLLEVBQUU7QUFDZixZQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztPQUNyQjs7QUFNRyxZQUFRO1dBSkEsWUFBRztBQUNiLGVBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztPQUN2QjtXQUVXLFVBQUMsS0FBSyxFQUFFO0FBQ2xCLFlBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO09BQ3hCOztBQU1HLFVBQU07V0FKQSxZQUFHO0FBQ1gsZUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDO09BQ3JCO1dBRVMsVUFBQyxLQUFLLEVBQUU7QUFDaEIsWUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7T0FDdEI7O0FBTUcsZ0JBQVk7V0FKQSxZQUFHO0FBQ2pCLGVBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztPQUMzQjtXQUVlLFVBQUMsS0FBSyxFQUFFOztBQUV0QixZQUFJLEtBQUssS0FBTSxDQUFDLEVBQUU7QUFDaEIsY0FBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDcEIsaUJBQU87U0FDUjs7QUFFRCxZQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7NkJBQzlCLE1BQU0sQ0FBQyxNQUFNLEVBQUU7Ozs7WUFBM0IsR0FBRztZQUFFLEdBQUc7O0FBQ2YsWUFBTSxJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFBLElBQUssS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFBLEFBQUMsQ0FBQzs7QUFFOUQsY0FBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQzs7QUFFakMsWUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7QUFDdEIsWUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7T0FDNUI7O0FBR0csVUFBTTtXQUFBLFlBQUc7QUFDWCxZQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNqQixpQkFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztTQUMzQjs7QUFFRCxlQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7T0FDckI7O0FBVUcsZUFBVzs7Ozs7O1dBSkEsWUFBRztBQUNoQixlQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7T0FDNUI7V0FFYyxVQUFDLEdBQUcsRUFBRTtBQUNuQixZQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUFFLGlCQUFPO1NBQUU7QUFDOUIsWUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7T0FDekI7O0FBR0csa0JBQWM7Ozs7V0FBQSxZQUFHO0FBQ25CLGVBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQztPQUNyQzs7OztTQWpHRyxnQkFBZ0I7R0FBUyxtQkFBbUI7O0FBb0dsRCxNQUFNLENBQUMsT0FBTyxHQUFHLGdCQUFnQixDQUFDIiwiZmlsZSI6ImVzNi9jb3JlL2xheWVyLXRpbWUtY29udGV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEFic3RyYWN0VGltZUNvbnRleHQgPSByZXF1aXJlKCcuL2Fic3RyYWN0LXRpbWUtY29udGV4dCcpO1xuXG4vKipcbiAqICBAY2xhc3MgTGF5ZXJUaW1lQ29udGV4dFxuICpcbiAqICBBIGBMYXllclRpbWVDb250ZXh0YCBpbnN0YW5jZSByZXByZXNlbnQgYSB0aW1lIHNlZ21lbnQgaW50byBhIGBUaW1lbGluZVRpbWVDb250ZXh0YC4gSXQgbXVzdCBiZSBhdHRhY2hlZCB0byBhIGBUaW1lbGluZVRpbWVDb250ZXh0YCAodGhlIG9uZSBvZiB0aGUgdGltZWxpbmUgaXQgYmVsb25ncyB0bykuIEl0IHJlbGllcyBvbiBpdHMgcGFyZW50J3MgeFNjYWxlICh0aW1lIHRvIHBpeGVsIHRyYW5zZmVydCBmdW5jdGlvbikgdG8gY3JlYXRlIHRoZSB0aW1lIHRvIHBpeGVsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBMYXllciAodGhlIHZpZXcpIGl0IGlzIGF0dGFjaGVkIHRvLlxuICpcbiAqICBUaGUgYGxheWVyVGltZUNvbnRleHRgIGhhcyBmb3VyIGltcG9ydGFudCBhdHRyaWJ1dGVzXG4gKiAgLSBgdGltZUNvbnRleHQuc3RhcnRgIHJlcHJlc2VudCB0aGUgdGltZSBhdCB3aGljaCB0ZW1wb3JhbCBkYXRhIG11c3QgYmUgcmVwcmVzZW50ZWQgaW4gdGhlIHRpbWVsaW5lIChmb3IgaW5zdGFuY2UgdGhlIGJlZ2luaW5nIG9mIGEgc291bmRmaWxlIGluIGEgREFXKVxuICogIC0gYHRpbWVDb250ZXh0Lm9mZnNldGAgcmVwcmVzZW50cyBvZmZzZXQgdGltZSBvZiB0aGUgZGF0YSBpbiB0aGUgY29udGV4dCBvZiBhIExheWVyLiAoQFRPRE8gZ2l2ZSBhIHVzZSBjYXNlIGV4YW1wbGUgaGVyZSBcImNyb3AgP1wiLCBhbmQvb3IgZXhwbGFpbiB0aGF0IGl0J3Mgbm90IGEgY29tbW9uIHVzZSBjYXNlKVxuICogIC0gYHRpbWVDb250ZXh0LmR1cmF0aW9uYCBpcyB0aGUgZHVyYXRpb24gb2YgdGhlIHZpZXcgb24gdGhlIGRhdGFcbiAqICAtIGB0aW1lQ29udGV4dC5zdHJldGNoUmF0aW9gIGlzIHRoZSBzdHJldGNoIGFwcGx5ZWQgdG8gdGhlIHRlbXBvcmFsIGRhdGEgY29udGFpbmVkIGluIHRoZSB2aWV3ICh0aGlzIHZhbHVlIGNhbiBiZSBzZWVuIGFzIGEgbG9jYWwgem9vbSBvbiB0aGUgZGF0YSwgb3IgYXMgYSBzdHJldGNoIG9uIHRoZSB0aW1lIGNvbXBvbmVudHMgb2YgdGhlIGRhdGEpLiBXaGVuIGFwcGx5ZWQsIHRoZSBzdHJldGNoIHJhdGlvIG1haW50YWluIHRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgdmlldyBpbiB0aGUgdGltZWxpbmUuXG4gKlxuICogKyB0aW1lbGluZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogMCAgICAgICAgIDUgICAgICAgICAxMCAgICAgICAgICAxNSAgICAgICAgICAyMCAgICAgICAgMjUgICAgICAgICAgMzAgc2Vjb25kc1xuICogKy0tLSsqKioqKioqKioqKioqKioqKistLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rKioqKioqKistLVxuICogICAgIHwqKiogc291bmRmaWxlICoqKnxMYXllciAodmlldyBvbiB0aGUgc291bmQgZmlsZSkgICAgICAgICAgICB8KioqKioqKnxcbiAqICAgICArKioqKioqKioqKioqKioqKiorLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKyoqKioqKiorXG4gKlxuICogICAgIDwtLS0tIG9mZnNldCAtLS0tPjwtLS0tLS0tLS0tLS0tLS0gZHVyYXRpb24gLS0tLS0tLS0tLS0tLS0tLS0+XG4gKiA8LS0tLS0tLS0gc3RhcnQgLS0tLS0+XG4gKlxuICogICAgICBUaGUgcGFydHMgb2YgdGhlIHNvdW5kIGZpbGUgcmVwcmVzZW50ZWQgd2l0aCAnKicgYXJlIGhpZGRlbiBmcm9tIHRoZSB2aWV3XG4gKlxuICovXG5jbGFzcyBMYXllclRpbWVDb250ZXh0IGV4dGVuZHMgQWJzdHJhY3RUaW1lQ29udGV4dCB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCkge1xuICAgIHN1cGVyKHt9KTtcbiAgICBpZiAoIXBhcmVudCkgeyB0aHJvdyBuZXcgRXJyb3IoJ0xheWVyVGltZUNvbnRleHQgbXVzdCBoYXZlIGEgcGFyZW50Jyk7IH1cblxuICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuXG4gICAgdGhpcy5feFNjYWxlID0gbnVsbDtcblxuICAgIHRoaXMuX3N0YXJ0ID0gMDtcbiAgICB0aGlzLl9kdXJhdGlvbiA9IHBhcmVudC5jb250YWluZXJzRHVyYXRpb247XG4gICAgdGhpcy5fb2Zmc2V0ID0gMDtcbiAgICB0aGlzLl9zdHJldGNoUmF0aW8gPSAxO1xuICAgIC8vIHJlZ2lzdGVyIGludG8gdGhlIHRpbWVsaW5lJ3MgVGltZUNvbnRleHRcbiAgICB0aGlzLnBhcmVudC5fY2hpbGRyZW4ucHVzaCh0aGlzKTtcbiAgfVxuXG4gIGNsb25lKCkge1xuICAgIGNvbnN0IGN0eCA9IG5ldyB0aGlzKCk7XG4gICAgY3R4LnN0YXJ0ID0gdGhpcy5zdGFydDtcbiAgICBjdHguZHVyYXRpb24gPSB0aGlzLmR1cmF0aW9uO1xuICAgIGN0eC5vZmZzZXQgPSB0aGlzLm9mZnNldDtcbiAgICBjdHguc3RyZXRjaFJhdGlvID0gdGhpcy5zdHJldGNoUmF0aW87XG5cbiAgICByZXR1cm4gY3R4O1xuICB9XG5cbiAgZ2V0IHN0YXJ0KCkge1xuICAgIHJldHVybiB0aGlzLl9zdGFydDtcbiAgfVxuXG4gIHNldCBzdGFydCh2YWx1ZSkge1xuICAgIHRoaXMuX3N0YXJ0ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgZHVyYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2R1cmF0aW9uO1xuICB9XG5cbiAgc2V0IGR1cmF0aW9uKHZhbHVlKSB7XG4gICAgdGhpcy5fZHVyYXRpb24gPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBvZmZzZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX29mZnNldDtcbiAgfVxuXG4gIHNldCBvZmZzZXQodmFsdWUpIHtcbiAgICB0aGlzLl9vZmZzZXQgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBzdHJldGNoUmF0aW8oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0cmV0Y2hSYXRpbztcbiAgfVxuXG4gIHNldCBzdHJldGNoUmF0aW8odmFsdWUpIHtcbiAgICAvLyByZW1vdmUgbG9jYWwgeFNjYWxlIGlmIHJhdGlvID0gMVxuICAgIGlmICh2YWx1ZSA9PT0gIDEpIHtcbiAgICAgIHRoaXMuX3hTY2FsZSA9IG51bGw7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgeFNjYWxlID0gdGhpcy5wYXJlbnQub3JpZ2luYWxYU2NhbGUuY29weSgpO1xuICAgIGNvbnN0IFttaW4sIG1heF0gPSB4U2NhbGUuZG9tYWluKCk7XG4gICAgY29uc3QgZGlmZiA9IChtYXggLSBtaW4pIC8gKHZhbHVlICogdGhpcy5wYXJlbnQuc3RyZXRjaFJhdGlvKTtcblxuICAgIHhTY2FsZS5kb21haW4oW21pbiwgbWluICsgZGlmZl0pO1xuXG4gICAgdGhpcy5feFNjYWxlID0geFNjYWxlO1xuICAgIHRoaXMuX3N0cmV0Y2hSYXRpbyA9IHZhbHVlO1xuICB9XG5cblxuICBnZXQgeFNjYWxlKCkge1xuICAgIGlmICghdGhpcy5feFNjYWxlKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnQueFNjYWxlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl94U2NhbGU7XG4gIH1cblxuICAvLyBzZXQgeFNjYWxlKHNjYWxlKSB7XG4gIC8vICAgdGhpcy5feFNjYWxlID0gc2NhbGU7XG4gIC8vIH1cblxuICBnZXQgeFNjYWxlUmFuZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMueFNjYWxlLnJhbmdlKCk7XG4gIH1cblxuICBzZXQgeFNjYWxlUmFuZ2UoYXJyKSB7XG4gICAgaWYgKCF0aGlzLl94U2NhbGUpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5feFNjYWxlLnJhbmdlKGFycik7XG4gIH1cblxuICAvLyByZWFkIG9ubHlcbiAgZ2V0IG9yaWdpbmFsWFNjYWxlKCkge1xuICAgIHJldHVybiB0aGlzLnBhcmVudC5vcmlnaW5hbFhTY2FsZSgpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTGF5ZXJUaW1lQ29udGV4dDtcbiJdfQ==