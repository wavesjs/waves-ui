'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

var _d3Scale = require('d3-scale');

var _d3Scale2 = _interopRequireDefault(_d3Scale);

/**
 *  @class LayerTimeContext
 *
 *  A `LayerTimeContext` instance represent a time segment into a `TimelineTimeContext`. It must be attached to a `TimelineTimeContext` (the one of the timeline it belongs to). It relies on its parent's `timeToPixel` (time to pixel transfert function) to create the time to pixel representation of the Layer (the view) it is attached to.
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

var LayerTimeContext = (function () {
  function LayerTimeContext(parent) {
    _classCallCheck(this, LayerTimeContext);

    if (!parent) {
      throw new Error('LayerTimeContext must have a parent');
    }

    this.parent = parent;

    this._timeToPixel = null;

    this._start = 0;
    this._duration = parent.visibleDuration;
    this._offset = 0;
    this._stretchRatio = 1;
    // register into the timeline's TimeContext
    this.parent._children.push(this);
  }

  _createClass(LayerTimeContext, [{
    key: 'clone',
    value: function clone() {
      var ctx = new this();

      ctx.parent = this.parent;
      ctx.start = this.start;
      ctx.duration = this.duration;
      ctx.offset = this.offset;
      ctx.stretchRatio = this.stretchRatio; // creates the local scale if needed

      return ctx;
    }
  }, {
    key: 'start',
    get: function () {
      return this._start;
    },
    set: function (value) {
      this._start = value;
    }
  }, {
    key: 'duration',
    get: function () {
      return this._duration;
    },
    set: function (value) {
      this._duration = value;
    }
  }, {
    key: 'offset',
    get: function () {
      return this._offset;
    },
    set: function (value) {
      this._offset = value;
    }
  }, {
    key: 'stretchRatio',
    get: function () {
      return this._stretchRatio;
    },
    set: function (value) {
      // remove local scale if ratio = 1
      if (value === 1) {
        this._timeToPixel = null;
        return;
      }
      // reuse previsously created local scale if exists
      var timeToPixel = this._timeToPixel ? this._timeToPixel : _d3Scale2['default'].linear().domain([0, 1]);

      timeToPixel.range([0, this.parent.computedPixelsPerSecond * value]);

      this._timeToPixel = timeToPixel;
      this._stretchRatio = value;
    }
  }, {
    key: 'timeToPixel',

    // read only
    get: function () {
      if (!this._timeToPixel) {
        return this.parent.timeToPixel;
      }

      return this._timeToPixel;
    }
  }]);

  return LayerTimeContext;
})();

exports['default'] = LayerTimeContext;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7dUJBQW9CLFVBQVU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBMkJULGdCQUFnQjtBQUN4QixXQURRLGdCQUFnQixDQUN2QixNQUFNLEVBQUU7MEJBREQsZ0JBQWdCOztBQUVqQyxRQUFJLENBQUMsTUFBTSxFQUFFO0FBQUUsWUFBTSxJQUFJLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO0tBQUU7O0FBRXhFLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDOztBQUVyQixRQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQzs7QUFFekIsUUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDaEIsUUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDO0FBQ3hDLFFBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDOztBQUV2QixRQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDbEM7O2VBZGtCLGdCQUFnQjs7V0FnQjlCLGlCQUFHO0FBQ04sVUFBTSxHQUFHLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQzs7QUFFdkIsU0FBRyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQ3pCLFNBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUN2QixTQUFHLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDN0IsU0FBRyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQ3pCLFNBQUcsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQzs7QUFFckMsYUFBTyxHQUFHLENBQUM7S0FDWjs7O1NBRVEsWUFBRztBQUNWLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztLQUNwQjtTQUVRLFVBQUMsS0FBSyxFQUFFO0FBQ2YsVUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7S0FDckI7OztTQUVXLFlBQUc7QUFDYixhQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7S0FDdkI7U0FFVyxVQUFDLEtBQUssRUFBRTtBQUNsQixVQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztLQUN4Qjs7O1NBRVMsWUFBRztBQUNYLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztLQUNyQjtTQUVTLFVBQUMsS0FBSyxFQUFFO0FBQ2hCLFVBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0tBQ3RCOzs7U0FFZSxZQUFHO0FBQ2pCLGFBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztLQUMzQjtTQUVlLFVBQUMsS0FBSyxFQUFFOztBQUV0QixVQUFJLEtBQUssS0FBTSxDQUFDLEVBQUU7QUFDaEIsWUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7QUFDekIsZUFBTztPQUNSOztBQUVELFVBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxZQUFZLEdBQ25DLElBQUksQ0FBQyxZQUFZLEdBQUcscUJBQVEsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRXRELGlCQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsdUJBQXVCLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQzs7QUFFcEUsVUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7QUFDaEMsVUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7S0FDNUI7Ozs7O1NBR2MsWUFBRztBQUNoQixVQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtBQUN0QixlQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO09BQ2hDOztBQUVELGFBQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztLQUMxQjs7O1NBL0VrQixnQkFBZ0I7OztxQkFBaEIsZ0JBQWdCIiwiZmlsZSI6ImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZDNTY2FsZSBmcm9tICdkMy1zY2FsZSc7XG5cblxuLyoqXG4gKiAgQGNsYXNzIExheWVyVGltZUNvbnRleHRcbiAqXG4gKiAgQSBgTGF5ZXJUaW1lQ29udGV4dGAgaW5zdGFuY2UgcmVwcmVzZW50IGEgdGltZSBzZWdtZW50IGludG8gYSBgVGltZWxpbmVUaW1lQ29udGV4dGAuIEl0IG11c3QgYmUgYXR0YWNoZWQgdG8gYSBgVGltZWxpbmVUaW1lQ29udGV4dGAgKHRoZSBvbmUgb2YgdGhlIHRpbWVsaW5lIGl0IGJlbG9uZ3MgdG8pLiBJdCByZWxpZXMgb24gaXRzIHBhcmVudCdzIGB0aW1lVG9QaXhlbGAgKHRpbWUgdG8gcGl4ZWwgdHJhbnNmZXJ0IGZ1bmN0aW9uKSB0byBjcmVhdGUgdGhlIHRpbWUgdG8gcGl4ZWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIExheWVyICh0aGUgdmlldykgaXQgaXMgYXR0YWNoZWQgdG8uXG4gKlxuICogIFRoZSBgbGF5ZXJUaW1lQ29udGV4dGAgaGFzIGZvdXIgaW1wb3J0YW50IGF0dHJpYnV0ZXNcbiAqICAtIGB0aW1lQ29udGV4dC5zdGFydGAgcmVwcmVzZW50IHRoZSB0aW1lIGF0IHdoaWNoIHRlbXBvcmFsIGRhdGEgbXVzdCBiZSByZXByZXNlbnRlZCBpbiB0aGUgdGltZWxpbmUgKGZvciBpbnN0YW5jZSB0aGUgYmVnaW5pbmcgb2YgYSBzb3VuZGZpbGUgaW4gYSBEQVcpXG4gKiAgLSBgdGltZUNvbnRleHQub2Zmc2V0YCByZXByZXNlbnRzIG9mZnNldCB0aW1lIG9mIHRoZSBkYXRhIGluIHRoZSBjb250ZXh0IG9mIGEgTGF5ZXIuIChAVE9ETyBnaXZlIGEgdXNlIGNhc2UgZXhhbXBsZSBoZXJlIFwiY3JvcCA/XCIsIGFuZC9vciBleHBsYWluIHRoYXQgaXQncyBub3QgYSBjb21tb24gdXNlIGNhc2UpXG4gKiAgLSBgdGltZUNvbnRleHQuZHVyYXRpb25gIGlzIHRoZSBkdXJhdGlvbiBvZiB0aGUgdmlldyBvbiB0aGUgZGF0YVxuICogIC0gYHRpbWVDb250ZXh0LnN0cmV0Y2hSYXRpb2AgaXMgdGhlIHN0cmV0Y2ggYXBwbHllZCB0byB0aGUgdGVtcG9yYWwgZGF0YSBjb250YWluZWQgaW4gdGhlIHZpZXcgKHRoaXMgdmFsdWUgY2FuIGJlIHNlZW4gYXMgYSBsb2NhbCB6b29tIG9uIHRoZSBkYXRhLCBvciBhcyBhIHN0cmV0Y2ggb24gdGhlIHRpbWUgY29tcG9uZW50cyBvZiB0aGUgZGF0YSkuIFdoZW4gYXBwbHllZCwgdGhlIHN0cmV0Y2ggcmF0aW8gbWFpbnRhaW4gdGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSB2aWV3IGluIHRoZSB0aW1lbGluZS5cbiAqXG4gKlxuICogKyB0aW1lbGluZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogMCAgICAgICAgIDUgICAgICAgICAxMCAgICAgICAgICAxNSAgICAgICAgICAyMCAgICAgICAgMjUgICAgICAgICAgMzAgc2Vjb25kc1xuICogKy0tLSsqKioqKioqKioqKioqKioqKistLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rKioqKioqKistLVxuICogICAgIHwqKiogc291bmRmaWxlICoqKnxMYXllciAodmlldyBvbiB0aGUgc291bmQgZmlsZSkgICAgICAgICAgICB8KioqKioqKnxcbiAqICAgICArKioqKioqKioqKioqKioqKiorLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKyoqKioqKiorXG4gKlxuICogICAgIDwtLS0tIG9mZnNldCAtLS0tPjwtLS0tLS0tLS0tLS0tLS0gZHVyYXRpb24gLS0tLS0tLS0tLS0tLS0tLS0+XG4gKiA8LS0tLS0tLS0gc3RhcnQgLS0tLS0+XG4gKlxuICogICAgICBUaGUgcGFydHMgb2YgdGhlIHNvdW5kIGZpbGUgcmVwcmVzZW50ZWQgd2l0aCAnKicgYXJlIGhpZGRlbiBmcm9tIHRoZSB2aWV3XG4gKlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMYXllclRpbWVDb250ZXh0IHtcbiAgY29uc3RydWN0b3IocGFyZW50KSB7XG4gICAgaWYgKCFwYXJlbnQpIHsgdGhyb3cgbmV3IEVycm9yKCdMYXllclRpbWVDb250ZXh0IG11c3QgaGF2ZSBhIHBhcmVudCcpOyB9XG5cbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcblxuICAgIHRoaXMuX3RpbWVUb1BpeGVsID0gbnVsbDtcblxuICAgIHRoaXMuX3N0YXJ0ID0gMDtcbiAgICB0aGlzLl9kdXJhdGlvbiA9IHBhcmVudC52aXNpYmxlRHVyYXRpb247XG4gICAgdGhpcy5fb2Zmc2V0ID0gMDtcbiAgICB0aGlzLl9zdHJldGNoUmF0aW8gPSAxO1xuICAgIC8vIHJlZ2lzdGVyIGludG8gdGhlIHRpbWVsaW5lJ3MgVGltZUNvbnRleHRcbiAgICB0aGlzLnBhcmVudC5fY2hpbGRyZW4ucHVzaCh0aGlzKTtcbiAgfVxuXG4gIGNsb25lKCkge1xuICAgIGNvbnN0IGN0eCA9IG5ldyB0aGlzKCk7XG5cbiAgICBjdHgucGFyZW50ID0gdGhpcy5wYXJlbnQ7XG4gICAgY3R4LnN0YXJ0ID0gdGhpcy5zdGFydDtcbiAgICBjdHguZHVyYXRpb24gPSB0aGlzLmR1cmF0aW9uO1xuICAgIGN0eC5vZmZzZXQgPSB0aGlzLm9mZnNldDtcbiAgICBjdHguc3RyZXRjaFJhdGlvID0gdGhpcy5zdHJldGNoUmF0aW87IC8vIGNyZWF0ZXMgdGhlIGxvY2FsIHNjYWxlIGlmIG5lZWRlZFxuXG4gICAgcmV0dXJuIGN0eDtcbiAgfVxuXG4gIGdldCBzdGFydCgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhcnQ7XG4gIH1cblxuICBzZXQgc3RhcnQodmFsdWUpIHtcbiAgICB0aGlzLl9zdGFydCA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGR1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9kdXJhdGlvbjtcbiAgfVxuXG4gIHNldCBkdXJhdGlvbih2YWx1ZSkge1xuICAgIHRoaXMuX2R1cmF0aW9uID0gdmFsdWU7XG4gIH1cblxuICBnZXQgb2Zmc2V0KCkge1xuICAgIHJldHVybiB0aGlzLl9vZmZzZXQ7XG4gIH1cblxuICBzZXQgb2Zmc2V0KHZhbHVlKSB7XG4gICAgdGhpcy5fb2Zmc2V0ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgc3RyZXRjaFJhdGlvKCkge1xuICAgIHJldHVybiB0aGlzLl9zdHJldGNoUmF0aW87XG4gIH1cblxuICBzZXQgc3RyZXRjaFJhdGlvKHZhbHVlKSB7XG4gICAgLy8gcmVtb3ZlIGxvY2FsIHNjYWxlIGlmIHJhdGlvID0gMVxuICAgIGlmICh2YWx1ZSA9PT0gIDEpIHtcbiAgICAgIHRoaXMuX3RpbWVUb1BpeGVsID0gbnVsbDtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gcmV1c2UgcHJldmlzb3VzbHkgY3JlYXRlZCBsb2NhbCBzY2FsZSBpZiBleGlzdHNcbiAgICBjb25zdCB0aW1lVG9QaXhlbCA9IHRoaXMuX3RpbWVUb1BpeGVsID9cbiAgICAgIHRoaXMuX3RpbWVUb1BpeGVsIDogZDNTY2FsZS5saW5lYXIoKS5kb21haW4oWzAsIDFdKTtcblxuICAgIHRpbWVUb1BpeGVsLnJhbmdlKFswLCB0aGlzLnBhcmVudC5jb21wdXRlZFBpeGVsc1BlclNlY29uZCAqIHZhbHVlXSk7XG5cbiAgICB0aGlzLl90aW1lVG9QaXhlbCA9IHRpbWVUb1BpeGVsO1xuICAgIHRoaXMuX3N0cmV0Y2hSYXRpbyA9IHZhbHVlO1xuICB9XG5cbiAgLy8gcmVhZCBvbmx5XG4gIGdldCB0aW1lVG9QaXhlbCgpIHtcbiAgICBpZiAoIXRoaXMuX3RpbWVUb1BpeGVsKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnQudGltZVRvUGl4ZWw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3RpbWVUb1BpeGVsO1xuICB9XG59XG4iXX0=