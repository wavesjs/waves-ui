"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _slicedToArray = require("babel-runtime/helpers/sliced-to-array")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var AbstractTimeContext = _interopRequire(require("./abstract-time-context"));

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
    this._duration = parent.visibleDuration;
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

        ctx.parent = this.parent;
        ctx.start = this.start;
        ctx.duration = this.duration;
        ctx.offset = this.offset;
        ctx.stretchRatio = this.stretchRatio; // creates the xScale if needed

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

        var diff = (max - min) / (value * this.parent.zoom);

        xScale.domain([min, min + diff]);

        this._xScale = xScale;
        this._stretchRatio = value;
      }
    },
    xScale: {

      // read only

      get: function () {
        if (!this._xScale) {
          return this.parent.xScale;
        }

        return this._xScale;
      }
    },
    xScaleRange: {
      get: function () {
        return this.xScale.range();
      },
      set: function (arr) {
        if (!this._xScale) {
          return;
        }
        this._xScale.range(arr);
      }
    }
  });

  return LayerTimeContext;
})(AbstractTimeContext);

module.exports = LayerTimeContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL2xheWVyLXRpbWUtY29udGV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0lBQU8sbUJBQW1CLDJCQUFNLHlCQUF5Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBMEJwQyxnQkFBZ0I7QUFDeEIsV0FEUSxnQkFBZ0IsQ0FDdkIsTUFBTSxFQUFFOzBCQURELGdCQUFnQjs7QUFFakMscUNBRmlCLGdCQUFnQiw2Q0FFM0IsRUFBRSxFQUFFOztBQUVWLFFBQUksQ0FBQyxNQUFNLEVBQUU7QUFBRSxZQUFNLElBQUksS0FBSyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7S0FBRTs7QUFFeEUsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7O0FBRXJCLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDOztBQUVwQixRQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNoQixRQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUM7QUFDeEMsUUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7QUFDakIsUUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7O0FBRXZCLFFBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUNsQzs7WUFoQmtCLGdCQUFnQjs7ZUFBaEIsZ0JBQWdCO0FBa0JuQyxTQUFLO2FBQUEsaUJBQUc7QUFDTixZQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDOztBQUV2QixXQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDekIsV0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3ZCLFdBQUcsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUM3QixXQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDekIsV0FBRyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDOztBQUVyQyxlQUFPLEdBQUcsQ0FBQztPQUNaOztBQU1HLFNBQUs7V0FKQSxZQUFHO0FBQ1YsZUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDO09BQ3BCO1dBRVEsVUFBQyxLQUFLLEVBQUU7QUFDZixZQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztPQUNyQjs7QUFNRyxZQUFRO1dBSkEsWUFBRztBQUNiLGVBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztPQUN2QjtXQUVXLFVBQUMsS0FBSyxFQUFFO0FBQ2xCLFlBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO09BQ3hCOztBQU1HLFVBQU07V0FKQSxZQUFHO0FBQ1gsZUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDO09BQ3JCO1dBRVMsVUFBQyxLQUFLLEVBQUU7QUFDaEIsWUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7T0FDdEI7O0FBTUcsZ0JBQVk7V0FKQSxZQUFHO0FBQ2pCLGVBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztPQUMzQjtXQUVlLFVBQUMsS0FBSyxFQUFFOztBQUV0QixZQUFJLEtBQUssS0FBTSxDQUFDLEVBQUU7QUFDaEIsY0FBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDcEIsaUJBQU87U0FDUjs7QUFFRCxZQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7NkJBQzlCLE1BQU0sQ0FBQyxNQUFNLEVBQUU7Ozs7WUFBM0IsR0FBRztZQUFFLEdBQUc7O0FBQ2YsWUFBTSxJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFBLElBQUssS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFBLEFBQUMsQ0FBQzs7QUFFdEQsY0FBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQzs7QUFFakMsWUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7QUFDdEIsWUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7T0FDNUI7O0FBR0csVUFBTTs7OztXQUFBLFlBQUc7QUFDWCxZQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNqQixpQkFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztTQUMzQjs7QUFFRCxlQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7T0FDckI7O0FBTUcsZUFBVztXQUpBLFlBQUc7QUFDaEIsZUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO09BQzVCO1dBRWMsVUFBQyxHQUFHLEVBQUU7QUFDbkIsWUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFBRSxpQkFBTztTQUFFO0FBQzlCLFlBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQ3pCOzs7O1NBM0ZrQixnQkFBZ0I7R0FBUyxtQkFBbUI7O2lCQUE1QyxnQkFBZ0IiLCJmaWxlIjoiZXM2L2NvcmUvbGF5ZXItdGltZS1jb250ZXh0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFic3RyYWN0VGltZUNvbnRleHQgZnJvbSAnLi9hYnN0cmFjdC10aW1lLWNvbnRleHQnO1xuXG4vKipcbiAqICBAY2xhc3MgTGF5ZXJUaW1lQ29udGV4dFxuICpcbiAqICBBIGBMYXllclRpbWVDb250ZXh0YCBpbnN0YW5jZSByZXByZXNlbnQgYSB0aW1lIHNlZ21lbnQgaW50byBhIGBUaW1lbGluZVRpbWVDb250ZXh0YC4gSXQgbXVzdCBiZSBhdHRhY2hlZCB0byBhIGBUaW1lbGluZVRpbWVDb250ZXh0YCAodGhlIG9uZSBvZiB0aGUgdGltZWxpbmUgaXQgYmVsb25ncyB0bykuIEl0IHJlbGllcyBvbiBpdHMgcGFyZW50J3MgeFNjYWxlICh0aW1lIHRvIHBpeGVsIHRyYW5zZmVydCBmdW5jdGlvbikgdG8gY3JlYXRlIHRoZSB0aW1lIHRvIHBpeGVsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBMYXllciAodGhlIHZpZXcpIGl0IGlzIGF0dGFjaGVkIHRvLlxuICpcbiAqICBUaGUgYGxheWVyVGltZUNvbnRleHRgIGhhcyBmb3VyIGltcG9ydGFudCBhdHRyaWJ1dGVzXG4gKiAgLSBgdGltZUNvbnRleHQuc3RhcnRgIHJlcHJlc2VudCB0aGUgdGltZSBhdCB3aGljaCB0ZW1wb3JhbCBkYXRhIG11c3QgYmUgcmVwcmVzZW50ZWQgaW4gdGhlIHRpbWVsaW5lIChmb3IgaW5zdGFuY2UgdGhlIGJlZ2luaW5nIG9mIGEgc291bmRmaWxlIGluIGEgREFXKVxuICogIC0gYHRpbWVDb250ZXh0Lm9mZnNldGAgcmVwcmVzZW50cyBvZmZzZXQgdGltZSBvZiB0aGUgZGF0YSBpbiB0aGUgY29udGV4dCBvZiBhIExheWVyLiAoQFRPRE8gZ2l2ZSBhIHVzZSBjYXNlIGV4YW1wbGUgaGVyZSBcImNyb3AgP1wiLCBhbmQvb3IgZXhwbGFpbiB0aGF0IGl0J3Mgbm90IGEgY29tbW9uIHVzZSBjYXNlKVxuICogIC0gYHRpbWVDb250ZXh0LmR1cmF0aW9uYCBpcyB0aGUgZHVyYXRpb24gb2YgdGhlIHZpZXcgb24gdGhlIGRhdGFcbiAqICAtIGB0aW1lQ29udGV4dC5zdHJldGNoUmF0aW9gIGlzIHRoZSBzdHJldGNoIGFwcGx5ZWQgdG8gdGhlIHRlbXBvcmFsIGRhdGEgY29udGFpbmVkIGluIHRoZSB2aWV3ICh0aGlzIHZhbHVlIGNhbiBiZSBzZWVuIGFzIGEgbG9jYWwgem9vbSBvbiB0aGUgZGF0YSwgb3IgYXMgYSBzdHJldGNoIG9uIHRoZSB0aW1lIGNvbXBvbmVudHMgb2YgdGhlIGRhdGEpLiBXaGVuIGFwcGx5ZWQsIHRoZSBzdHJldGNoIHJhdGlvIG1haW50YWluIHRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgdmlldyBpbiB0aGUgdGltZWxpbmUuXG4gKlxuICpcbiAqICsgdGltZWxpbmUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIDAgICAgICAgICA1ICAgICAgICAgMTAgICAgICAgICAgMTUgICAgICAgICAgMjAgICAgICAgIDI1ICAgICAgICAgIDMwIHNlY29uZHNcbiAqICstLS0rKioqKioqKioqKioqKioqKiorLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKyoqKioqKiorLS1cbiAqICAgICB8KioqIHNvdW5kZmlsZSAqKip8TGF5ZXIgKHZpZXcgb24gdGhlIHNvdW5kIGZpbGUpICAgICAgICAgICAgfCoqKioqKip8XG4gKiAgICAgKyoqKioqKioqKioqKioqKioqKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSsqKioqKioqK1xuICpcbiAqICAgICA8LS0tLSBvZmZzZXQgLS0tLT48LS0tLS0tLS0tLS0tLS0tIGR1cmF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tPlxuICogPC0tLS0tLS0tIHN0YXJ0IC0tLS0tPlxuICpcbiAqICAgICAgVGhlIHBhcnRzIG9mIHRoZSBzb3VuZCBmaWxlIHJlcHJlc2VudGVkIHdpdGggJyonIGFyZSBoaWRkZW4gZnJvbSB0aGUgdmlld1xuICpcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGF5ZXJUaW1lQ29udGV4dCBleHRlbmRzIEFic3RyYWN0VGltZUNvbnRleHQge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQpIHtcbiAgICBzdXBlcih7fSk7XG5cbiAgICBpZiAoIXBhcmVudCkgeyB0aHJvdyBuZXcgRXJyb3IoJ0xheWVyVGltZUNvbnRleHQgbXVzdCBoYXZlIGEgcGFyZW50Jyk7IH1cblxuICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuXG4gICAgdGhpcy5feFNjYWxlID0gbnVsbDtcblxuICAgIHRoaXMuX3N0YXJ0ID0gMDtcbiAgICB0aGlzLl9kdXJhdGlvbiA9IHBhcmVudC52aXNpYmxlRHVyYXRpb247XG4gICAgdGhpcy5fb2Zmc2V0ID0gMDtcbiAgICB0aGlzLl9zdHJldGNoUmF0aW8gPSAxO1xuICAgIC8vIHJlZ2lzdGVyIGludG8gdGhlIHRpbWVsaW5lJ3MgVGltZUNvbnRleHRcbiAgICB0aGlzLnBhcmVudC5fY2hpbGRyZW4ucHVzaCh0aGlzKTtcbiAgfVxuXG4gIGNsb25lKCkge1xuICAgIGNvbnN0IGN0eCA9IG5ldyB0aGlzKCk7XG5cbiAgICBjdHgucGFyZW50ID0gdGhpcy5wYXJlbnQ7XG4gICAgY3R4LnN0YXJ0ID0gdGhpcy5zdGFydDtcbiAgICBjdHguZHVyYXRpb24gPSB0aGlzLmR1cmF0aW9uO1xuICAgIGN0eC5vZmZzZXQgPSB0aGlzLm9mZnNldDtcbiAgICBjdHguc3RyZXRjaFJhdGlvID0gdGhpcy5zdHJldGNoUmF0aW87IC8vIGNyZWF0ZXMgdGhlIHhTY2FsZSBpZiBuZWVkZWRcblxuICAgIHJldHVybiBjdHg7XG4gIH1cblxuICBnZXQgc3RhcnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXJ0O1xuICB9XG5cbiAgc2V0IHN0YXJ0KHZhbHVlKSB7XG4gICAgdGhpcy5fc3RhcnQgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBkdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fZHVyYXRpb247XG4gIH1cblxuICBzZXQgZHVyYXRpb24odmFsdWUpIHtcbiAgICB0aGlzLl9kdXJhdGlvbiA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IG9mZnNldCgpIHtcbiAgICByZXR1cm4gdGhpcy5fb2Zmc2V0O1xuICB9XG5cbiAgc2V0IG9mZnNldCh2YWx1ZSkge1xuICAgIHRoaXMuX29mZnNldCA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHN0cmV0Y2hSYXRpbygpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RyZXRjaFJhdGlvO1xuICB9XG5cbiAgc2V0IHN0cmV0Y2hSYXRpbyh2YWx1ZSkge1xuICAgIC8vIHJlbW92ZSBsb2NhbCB4U2NhbGUgaWYgcmF0aW8gPSAxXG4gICAgaWYgKHZhbHVlID09PSAgMSkge1xuICAgICAgdGhpcy5feFNjYWxlID0gbnVsbDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB4U2NhbGUgPSB0aGlzLnBhcmVudC5vcmlnaW5hbFhTY2FsZS5jb3B5KCk7XG4gICAgY29uc3QgW21pbiwgbWF4XSA9IHhTY2FsZS5kb21haW4oKTtcbiAgICBjb25zdCBkaWZmID0gKG1heCAtIG1pbikgLyAodmFsdWUgKiB0aGlzLnBhcmVudC56b29tKTtcblxuICAgIHhTY2FsZS5kb21haW4oW21pbiwgbWluICsgZGlmZl0pO1xuXG4gICAgdGhpcy5feFNjYWxlID0geFNjYWxlO1xuICAgIHRoaXMuX3N0cmV0Y2hSYXRpbyA9IHZhbHVlO1xuICB9XG5cbiAgLy8gcmVhZCBvbmx5XG4gIGdldCB4U2NhbGUoKSB7XG4gICAgaWYgKCF0aGlzLl94U2NhbGUpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudC54U2NhbGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3hTY2FsZTtcbiAgfVxuXG4gIGdldCB4U2NhbGVSYW5nZSgpIHtcbiAgICByZXR1cm4gdGhpcy54U2NhbGUucmFuZ2UoKTtcbiAgfVxuXG4gIHNldCB4U2NhbGVSYW5nZShhcnIpIHtcbiAgICBpZiAoIXRoaXMuX3hTY2FsZSkgeyByZXR1cm47IH1cbiAgICB0aGlzLl94U2NhbGUucmFuZ2UoYXJyKTtcbiAgfVxufVxuIl19