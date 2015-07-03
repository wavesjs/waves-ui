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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL2xheWVyLXRpbWUtY29udGV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sbUJBQW1CLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBeUJ6RCxnQkFBZ0I7QUFDVCxXQURQLGdCQUFnQixDQUNSLE1BQU0sRUFBRTswQkFEaEIsZ0JBQWdCOztBQUVsQixxQ0FGRSxnQkFBZ0IsNkNBRVosRUFBRSxFQUFFO0FBQ1YsUUFBSSxDQUFDLE1BQU0sRUFBRTtBQUFFLFlBQU0sSUFBSSxLQUFLLENBQUMscUNBQXFDLENBQUMsQ0FBQztLQUFFOztBQUV4RSxRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQzs7QUFFckIsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7O0FBRXBCLFFBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLFFBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDO0FBQzNDLFFBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDOztBQUV2QixRQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDbEM7O1lBZkcsZ0JBQWdCOztlQUFoQixnQkFBZ0I7QUFpQnBCLFNBQUs7YUFBQSxpQkFBRztBQUNOLFlBQU0sR0FBRyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7QUFDdkIsV0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3ZCLFdBQUcsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUM3QixXQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDekIsV0FBRyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDOztBQUVyQyxlQUFPLEdBQUcsQ0FBQztPQUNaOztBQU1HLFNBQUs7V0FKQSxZQUFHO0FBQ1YsZUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDO09BQ3BCO1dBRVEsVUFBQyxLQUFLLEVBQUU7QUFDZixZQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztPQUNyQjs7QUFNRyxZQUFRO1dBSkEsWUFBRztBQUNiLGVBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztPQUN2QjtXQUVXLFVBQUMsS0FBSyxFQUFFO0FBQ2xCLFlBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO09BQ3hCOztBQU1HLFVBQU07V0FKQSxZQUFHO0FBQ1gsZUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDO09BQ3JCO1dBRVMsVUFBQyxLQUFLLEVBQUU7QUFDaEIsWUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7T0FDdEI7O0FBTUcsZ0JBQVk7V0FKQSxZQUFHO0FBQ2pCLGVBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztPQUMzQjtXQUVlLFVBQUMsS0FBSyxFQUFFOztBQUV0QixZQUFJLEtBQUssS0FBTSxDQUFDLEVBQUU7QUFDaEIsY0FBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDcEIsaUJBQU87U0FDUjs7QUFFRCxZQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7NkJBQzlCLE1BQU0sQ0FBQyxNQUFNLEVBQUU7Ozs7WUFBM0IsR0FBRztZQUFFLEdBQUc7O0FBQ2YsWUFBTSxJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFBLElBQUssS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFBLEFBQUMsQ0FBQzs7QUFFOUQsY0FBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQzs7QUFFakMsWUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7QUFDdEIsWUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7T0FDNUI7O0FBR0csVUFBTTs7OztXQUFBLFlBQUc7QUFDWCxZQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNqQixpQkFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztTQUMzQjs7QUFFRCxlQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7T0FDckI7O0FBTUcsZUFBVztXQUpBLFlBQUc7QUFDaEIsZUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO09BQzVCO1dBRWMsVUFBQyxHQUFHLEVBQUU7QUFDbkIsWUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFBRSxpQkFBTztTQUFFO0FBQzlCLFlBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQ3pCOzs7O1NBeEZHLGdCQUFnQjtHQUFTLG1CQUFtQjs7QUEyRmxELE1BQU0sQ0FBQyxPQUFPLEdBQUcsZ0JBQWdCLENBQUMiLCJmaWxlIjoiZXM2L2NvcmUvbGF5ZXItdGltZS1jb250ZXh0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQWJzdHJhY3RUaW1lQ29udGV4dCA9IHJlcXVpcmUoJy4vYWJzdHJhY3QtdGltZS1jb250ZXh0Jyk7XG5cbi8qKlxuICogIEBjbGFzcyBMYXllclRpbWVDb250ZXh0XG4gKlxuICogIEEgYExheWVyVGltZUNvbnRleHRgIGluc3RhbmNlIHJlcHJlc2VudCBhIHRpbWUgc2VnbWVudCBpbnRvIGEgYFRpbWVsaW5lVGltZUNvbnRleHRgLiBJdCBtdXN0IGJlIGF0dGFjaGVkIHRvIGEgYFRpbWVsaW5lVGltZUNvbnRleHRgICh0aGUgb25lIG9mIHRoZSB0aW1lbGluZSBpdCBiZWxvbmdzIHRvKS4gSXQgcmVsaWVzIG9uIGl0cyBwYXJlbnQncyB4U2NhbGUgKHRpbWUgdG8gcGl4ZWwgdHJhbnNmZXJ0IGZ1bmN0aW9uKSB0byBjcmVhdGUgdGhlIHRpbWUgdG8gcGl4ZWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIExheWVyICh0aGUgdmlldykgaXQgaXMgYXR0YWNoZWQgdG8uXG4gKlxuICogIFRoZSBgbGF5ZXJUaW1lQ29udGV4dGAgaGFzIGZvdXIgaW1wb3J0YW50IGF0dHJpYnV0ZXNcbiAqICAtIGB0aW1lQ29udGV4dC5zdGFydGAgcmVwcmVzZW50IHRoZSB0aW1lIGF0IHdoaWNoIHRlbXBvcmFsIGRhdGEgbXVzdCBiZSByZXByZXNlbnRlZCBpbiB0aGUgdGltZWxpbmUgKGZvciBpbnN0YW5jZSB0aGUgYmVnaW5pbmcgb2YgYSBzb3VuZGZpbGUgaW4gYSBEQVcpXG4gKiAgLSBgdGltZUNvbnRleHQub2Zmc2V0YCByZXByZXNlbnRzIG9mZnNldCB0aW1lIG9mIHRoZSBkYXRhIGluIHRoZSBjb250ZXh0IG9mIGEgTGF5ZXIuIChAVE9ETyBnaXZlIGEgdXNlIGNhc2UgZXhhbXBsZSBoZXJlIFwiY3JvcCA/XCIsIGFuZC9vciBleHBsYWluIHRoYXQgaXQncyBub3QgYSBjb21tb24gdXNlIGNhc2UpXG4gKiAgLSBgdGltZUNvbnRleHQuZHVyYXRpb25gIGlzIHRoZSBkdXJhdGlvbiBvZiB0aGUgdmlldyBvbiB0aGUgZGF0YVxuICogIC0gYHRpbWVDb250ZXh0LnN0cmV0Y2hSYXRpb2AgaXMgdGhlIHN0cmV0Y2ggYXBwbHllZCB0byB0aGUgdGVtcG9yYWwgZGF0YSBjb250YWluZWQgaW4gdGhlIHZpZXcgKHRoaXMgdmFsdWUgY2FuIGJlIHNlZW4gYXMgYSBsb2NhbCB6b29tIG9uIHRoZSBkYXRhLCBvciBhcyBhIHN0cmV0Y2ggb24gdGhlIHRpbWUgY29tcG9uZW50cyBvZiB0aGUgZGF0YSkuIFdoZW4gYXBwbHllZCwgdGhlIHN0cmV0Y2ggcmF0aW8gbWFpbnRhaW4gdGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSB2aWV3IGluIHRoZSB0aW1lbGluZS5cbiAqXG4gKiArIHRpbWVsaW5lIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiAwICAgICAgICAgNSAgICAgICAgIDEwICAgICAgICAgIDE1ICAgICAgICAgIDIwICAgICAgICAyNSAgICAgICAgICAzMCBzZWNvbmRzXG4gKiArLS0tKyoqKioqKioqKioqKioqKioqKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSsqKioqKioqKy0tXG4gKiAgICAgfCoqKiBzb3VuZGZpbGUgKioqfExheWVyICh2aWV3IG9uIHRoZSBzb3VuZCBmaWxlKSAgICAgICAgICAgIHwqKioqKioqfFxuICogICAgICsqKioqKioqKioqKioqKioqKistLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rKioqKioqKitcbiAqXG4gKiAgICAgPC0tLS0gb2Zmc2V0IC0tLS0+PC0tLS0tLS0tLS0tLS0tLSBkdXJhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLT5cbiAqIDwtLS0tLS0tLSBzdGFydCAtLS0tLT5cbiAqXG4gKiAgICAgIFRoZSBwYXJ0cyBvZiB0aGUgc291bmQgZmlsZSByZXByZXNlbnRlZCB3aXRoICcqJyBhcmUgaGlkZGVuIGZyb20gdGhlIHZpZXdcbiAqXG4gKi9cbmNsYXNzIExheWVyVGltZUNvbnRleHQgZXh0ZW5kcyBBYnN0cmFjdFRpbWVDb250ZXh0IHtcbiAgY29uc3RydWN0b3IocGFyZW50KSB7XG4gICAgc3VwZXIoe30pO1xuICAgIGlmICghcGFyZW50KSB7IHRocm93IG5ldyBFcnJvcignTGF5ZXJUaW1lQ29udGV4dCBtdXN0IGhhdmUgYSBwYXJlbnQnKTsgfVxuXG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG5cbiAgICB0aGlzLl94U2NhbGUgPSBudWxsO1xuXG4gICAgdGhpcy5fc3RhcnQgPSAwO1xuICAgIHRoaXMuX2R1cmF0aW9uID0gcGFyZW50LmNvbnRhaW5lcnNEdXJhdGlvbjtcbiAgICB0aGlzLl9vZmZzZXQgPSAwO1xuICAgIHRoaXMuX3N0cmV0Y2hSYXRpbyA9IDE7XG4gICAgLy8gcmVnaXN0ZXIgaW50byB0aGUgdGltZWxpbmUncyBUaW1lQ29udGV4dFxuICAgIHRoaXMucGFyZW50Ll9jaGlsZHJlbi5wdXNoKHRoaXMpO1xuICB9XG5cbiAgY2xvbmUoKSB7XG4gICAgY29uc3QgY3R4ID0gbmV3IHRoaXMoKTtcbiAgICBjdHguc3RhcnQgPSB0aGlzLnN0YXJ0O1xuICAgIGN0eC5kdXJhdGlvbiA9IHRoaXMuZHVyYXRpb247XG4gICAgY3R4Lm9mZnNldCA9IHRoaXMub2Zmc2V0O1xuICAgIGN0eC5zdHJldGNoUmF0aW8gPSB0aGlzLnN0cmV0Y2hSYXRpbztcblxuICAgIHJldHVybiBjdHg7XG4gIH1cblxuICBnZXQgc3RhcnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXJ0O1xuICB9XG5cbiAgc2V0IHN0YXJ0KHZhbHVlKSB7XG4gICAgdGhpcy5fc3RhcnQgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBkdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fZHVyYXRpb247XG4gIH1cblxuICBzZXQgZHVyYXRpb24odmFsdWUpIHtcbiAgICB0aGlzLl9kdXJhdGlvbiA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IG9mZnNldCgpIHtcbiAgICByZXR1cm4gdGhpcy5fb2Zmc2V0O1xuICB9XG5cbiAgc2V0IG9mZnNldCh2YWx1ZSkge1xuICAgIHRoaXMuX29mZnNldCA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHN0cmV0Y2hSYXRpbygpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RyZXRjaFJhdGlvO1xuICB9XG5cbiAgc2V0IHN0cmV0Y2hSYXRpbyh2YWx1ZSkge1xuICAgIC8vIHJlbW92ZSBsb2NhbCB4U2NhbGUgaWYgcmF0aW8gPSAxXG4gICAgaWYgKHZhbHVlID09PSAgMSkge1xuICAgICAgdGhpcy5feFNjYWxlID0gbnVsbDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB4U2NhbGUgPSB0aGlzLnBhcmVudC5vcmlnaW5hbFhTY2FsZS5jb3B5KCk7XG4gICAgY29uc3QgW21pbiwgbWF4XSA9IHhTY2FsZS5kb21haW4oKTtcbiAgICBjb25zdCBkaWZmID0gKG1heCAtIG1pbikgLyAodmFsdWUgKiB0aGlzLnBhcmVudC5zdHJldGNoUmF0aW8pO1xuXG4gICAgeFNjYWxlLmRvbWFpbihbbWluLCBtaW4gKyBkaWZmXSk7XG5cbiAgICB0aGlzLl94U2NhbGUgPSB4U2NhbGU7XG4gICAgdGhpcy5fc3RyZXRjaFJhdGlvID0gdmFsdWU7XG4gIH1cblxuICAvLyByZWFkIG9ubHlcbiAgZ2V0IHhTY2FsZSgpIHtcbiAgICBpZiAoIXRoaXMuX3hTY2FsZSkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyZW50LnhTY2FsZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5feFNjYWxlO1xuICB9XG5cbiAgZ2V0IHhTY2FsZVJhbmdlKCkge1xuICAgIHJldHVybiB0aGlzLnhTY2FsZS5yYW5nZSgpO1xuICB9XG5cbiAgc2V0IHhTY2FsZVJhbmdlKGFycikge1xuICAgIGlmICghdGhpcy5feFNjYWxlKSB7IHJldHVybjsgfVxuICAgIHRoaXMuX3hTY2FsZS5yYW5nZShhcnIpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTGF5ZXJUaW1lQ29udGV4dDtcbiJdfQ==