'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _utilsScales = require('../utils/scales');

/**
 *  @class ViewTimeContext
 *
 *  A ViewTimeContext instance represents the mapping between the time and the pixel domains
 *
 *  The `TimelineTimeContext` has 3 important attributes:
 *  - `timeContext.timeToPixel` which defines the time to pixel transfert function, itself defined by the `pixelsPerSecond` attribute of the timeline
 *  - `timeContext.offset` defines a decay (in time domain) applied to all the views on the timeline. This allow to navigate inside visibleDurations longer than what can be represented in Layers (views) containers (e.g. horizontal scroll)
 *  - `timeContext.zoom` defines the zoom factor applyed to the timeline
 *
 *  It also maintains an helper (`visibleDuration`) which represent how much time the `tracks` are displaying
 *
 *  It also maintain an array of references to all the LayerTimeContext attached to the timeline to propagate changes on the time to pixel representation
 */

var _utilsScales2 = _interopRequireDefault(_utilsScales);

var TimelineTimeContext = (function () {
  function TimelineTimeContext(pixelsPerSecond, visibleWidth) {
    _classCallCheck(this, TimelineTimeContext);

    this._children = [];

    // @rename to timeToPixel
    this._timeToPixel = null;
    // this._originalXScale = null;

    this._offset = 0;
    this._zoom = 1;
    this._computedPixelsPerSecond = pixelsPerSecond;
    // params
    this._visibleWidth = visibleWidth;
    this._visibleDuration = this.visibleWidth / this._computedPixelsPerSecond;
    this._maintainVisibleDuration = false;

    // create the timeToPixel scale
    var scale = _utilsScales2['default'].linear().domain([0, 1]).range([0, pixelsPerSecond]);

    this.timeToPixel = scale;
    // this.originalXScale = this.timeToPixel.copy();

    this._originalPixelsPerSecond = this._computedPixelsPerSecond;
  }

  _createClass(TimelineTimeContext, [{
    key: '_updateTimeToPixelRange',
    value: function _updateTimeToPixelRange() {
      this._visibleDuration = this.visibleWidth / this._computedPixelsPerSecond;
      this.timeToPixel.range([0, this._computedPixelsPerSecond]);
    }
  }, {
    key: 'pixelsPerSecond',
    get: function get() {
      return this._originalPixelsPerSecond;
    },
    set: function set(value) {
      this._computedPixelsPerSecond = value * this.zoom;
      this._originalPixelsPerSecond = value;
      this._updateTimeToPixelRange();

      // force children scale update
      this._children.forEach(function (child) {
        if (!child._timeToPixel) {
          return;
        }
        child.stretchRatio = child.stretchRatio;
      });
    }
  }, {
    key: 'computedPixelsPerSecond',
    get: function get() {
      return this._computedPixelsPerSecond;
    }
  }, {
    key: 'offset',
    get: function get() {
      return this._offset;
    },
    set: function set(value) {
      this._offset = value;
    }
  }, {
    key: 'zoom',
    get: function get() {
      return this._zoom;
    },
    set: function set(value) {
      // Compute change to propagate to children who have their own timeToPixel
      var ratioChange = value / this._zoom;
      this._zoom = value;
      this._computedPixelsPerSecond = this._originalPixelsPerSecond * value;
      this._updateTimeToPixelRange();

      this._children.forEach(function (child) {
        if (!child._timeToPixel) {
          return;
        }
        child.stretchRatio = child.stretchRatio * ratioChange;
      });
    }
  }, {
    key: 'visibleWidth',
    get: function get() {
      return this._visibleWidth;
    },
    set: function set(value) {
      var widthRatio = value / this.visibleWidth;

      this._visibleWidth = value;
      this._visibleDuration = this.visibleWidth / this._computedPixelsPerSecond;

      if (this.maintainVisibleDuration) {
        this.pixelsPerSecond = this._computedPixelsPerSecond * widthRatio;
      }
    }

    /** @readonly */
  }, {
    key: 'visibleDuration',
    get: function get() {
      return this._visibleDuration;
    }
  }, {
    key: 'maintainVisibleDuration',
    get: function get() {
      return this._maintainVisibleDuration;
    },
    set: function set(bool) {
      this._maintainVisibleDuration = bool;
    }
  }, {
    key: 'timeToPixel',
    get: function get() {
      return this._timeToPixel;
    },
    set: function set(scale) {
      this._timeToPixel = scale;
    }
  }]);

  return TimelineTimeContext;
})();

exports['default'] = TimelineTimeContext;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3RpbWVsaW5lLXRpbWUtY29udGV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7MkJBQW1CLGlCQUFpQjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWlCZixtQkFBbUI7QUFDM0IsV0FEUSxtQkFBbUIsQ0FDMUIsZUFBZSxFQUFFLFlBQVksRUFBRTswQkFEeEIsbUJBQW1COztBQUVwQyxRQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQzs7O0FBR3BCLFFBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDOzs7QUFHekIsUUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7QUFDakIsUUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDZixRQUFJLENBQUMsd0JBQXdCLEdBQUcsZUFBZSxDQUFDOztBQUVoRCxRQUFJLENBQUMsYUFBYSxHQUFHLFlBQVksQ0FBQztBQUNsQyxRQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUM7QUFDMUUsUUFBSSxDQUFDLHdCQUF3QixHQUFHLEtBQUssQ0FBQzs7O0FBR3RDLFFBQU0sS0FBSyxHQUFHLHlCQUFPLE1BQU0sRUFBRSxDQUMxQixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FDZCxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQzs7QUFFL0IsUUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7OztBQUd6QixRQUFJLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDO0dBQy9EOztlQXpCa0IsbUJBQW1COztXQTRHZixtQ0FBRztBQUN4QixVQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUM7QUFDMUUsVUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQztLQUM1RDs7O1NBcEZrQixlQUFHO0FBQ3BCLGFBQU8sSUFBSSxDQUFDLHdCQUF3QixDQUFDO0tBQ3RDO1NBRWtCLGFBQUMsS0FBSyxFQUFFO0FBQ3pCLFVBQUksQ0FBQyx3QkFBd0IsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUNsRCxVQUFJLENBQUMsd0JBQXdCLEdBQUcsS0FBSyxDQUFDO0FBQ3RDLFVBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDOzs7QUFHL0IsVUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBUyxLQUFLLEVBQUU7QUFDckMsWUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUU7QUFBRSxpQkFBTztTQUFFO0FBQ3BDLGFBQUssQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQztPQUN6QyxDQUFDLENBQUM7S0FDSjs7O1NBRTBCLGVBQUc7QUFDNUIsYUFBTyxJQUFJLENBQUMsd0JBQXdCLENBQUM7S0FDdEM7OztTQUVTLGVBQUc7QUFDWCxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7S0FDckI7U0FFUyxhQUFDLEtBQUssRUFBRTtBQUNoQixVQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztLQUN0Qjs7O1NBRU8sZUFBRztBQUNULGFBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztLQUNuQjtTQUVPLGFBQUMsS0FBSyxFQUFFOztBQUVkLFVBQU0sV0FBVyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3ZDLFVBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ25CLFVBQUksQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUMsd0JBQXdCLEdBQUcsS0FBSyxDQUFDO0FBQ3RFLFVBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDOztBQUUvQixVQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFTLEtBQUssRUFBRTtBQUNyQyxZQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRTtBQUFFLGlCQUFPO1NBQUU7QUFDcEMsYUFBSyxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQztPQUN2RCxDQUFDLENBQUM7S0FDSjs7O1NBRWUsZUFBRztBQUNqQixhQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7S0FDM0I7U0FFZSxhQUFDLEtBQUssRUFBRTtBQUN0QixVQUFNLFVBQVUsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQzs7QUFFN0MsVUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7QUFDM0IsVUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDOztBQUUxRSxVQUFJLElBQUksQ0FBQyx1QkFBdUIsRUFBRTtBQUNoQyxZQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxVQUFVLENBQUM7T0FDbkU7S0FDRjs7Ozs7U0FHa0IsZUFBRztBQUNwQixhQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztLQUM5Qjs7O1NBRTBCLGVBQUc7QUFDNUIsYUFBTyxJQUFJLENBQUMsd0JBQXdCLENBQUM7S0FDdEM7U0FFMEIsYUFBQyxJQUFJLEVBQUU7QUFDaEMsVUFBSSxDQUFDLHdCQUF3QixHQUFHLElBQUksQ0FBQztLQUN0Qzs7O1NBRWMsZUFBRztBQUNoQixhQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7S0FDMUI7U0FFYyxhQUFDLEtBQUssRUFBRTtBQUNyQixVQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztLQUMzQjs7O1NBMUdrQixtQkFBbUI7OztxQkFBbkIsbUJBQW1CIiwiZmlsZSI6ImVzNi9jb3JlL3RpbWVsaW5lLXRpbWUtY29udGV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBzY2FsZXMgZnJvbSAnLi4vdXRpbHMvc2NhbGVzJztcblxuXG4vKipcbiAqICBAY2xhc3MgVmlld1RpbWVDb250ZXh0XG4gKlxuICogIEEgVmlld1RpbWVDb250ZXh0IGluc3RhbmNlIHJlcHJlc2VudHMgdGhlIG1hcHBpbmcgYmV0d2VlbiB0aGUgdGltZSBhbmQgdGhlIHBpeGVsIGRvbWFpbnNcbiAqXG4gKiAgVGhlIGBUaW1lbGluZVRpbWVDb250ZXh0YCBoYXMgMyBpbXBvcnRhbnQgYXR0cmlidXRlczpcbiAqICAtIGB0aW1lQ29udGV4dC50aW1lVG9QaXhlbGAgd2hpY2ggZGVmaW5lcyB0aGUgdGltZSB0byBwaXhlbCB0cmFuc2ZlcnQgZnVuY3Rpb24sIGl0c2VsZiBkZWZpbmVkIGJ5IHRoZSBgcGl4ZWxzUGVyU2Vjb25kYCBhdHRyaWJ1dGUgb2YgdGhlIHRpbWVsaW5lXG4gKiAgLSBgdGltZUNvbnRleHQub2Zmc2V0YCBkZWZpbmVzIGEgZGVjYXkgKGluIHRpbWUgZG9tYWluKSBhcHBsaWVkIHRvIGFsbCB0aGUgdmlld3Mgb24gdGhlIHRpbWVsaW5lLiBUaGlzIGFsbG93IHRvIG5hdmlnYXRlIGluc2lkZSB2aXNpYmxlRHVyYXRpb25zIGxvbmdlciB0aGFuIHdoYXQgY2FuIGJlIHJlcHJlc2VudGVkIGluIExheWVycyAodmlld3MpIGNvbnRhaW5lcnMgKGUuZy4gaG9yaXpvbnRhbCBzY3JvbGwpXG4gKiAgLSBgdGltZUNvbnRleHQuem9vbWAgZGVmaW5lcyB0aGUgem9vbSBmYWN0b3IgYXBwbHllZCB0byB0aGUgdGltZWxpbmVcbiAqXG4gKiAgSXQgYWxzbyBtYWludGFpbnMgYW4gaGVscGVyIChgdmlzaWJsZUR1cmF0aW9uYCkgd2hpY2ggcmVwcmVzZW50IGhvdyBtdWNoIHRpbWUgdGhlIGB0cmFja3NgIGFyZSBkaXNwbGF5aW5nXG4gKlxuICogIEl0IGFsc28gbWFpbnRhaW4gYW4gYXJyYXkgb2YgcmVmZXJlbmNlcyB0byBhbGwgdGhlIExheWVyVGltZUNvbnRleHQgYXR0YWNoZWQgdG8gdGhlIHRpbWVsaW5lIHRvIHByb3BhZ2F0ZSBjaGFuZ2VzIG9uIHRoZSB0aW1lIHRvIHBpeGVsIHJlcHJlc2VudGF0aW9uXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVsaW5lVGltZUNvbnRleHQge1xuICBjb25zdHJ1Y3RvcihwaXhlbHNQZXJTZWNvbmQsIHZpc2libGVXaWR0aCkge1xuICAgIHRoaXMuX2NoaWxkcmVuID0gW107XG5cbiAgICAvLyBAcmVuYW1lIHRvIHRpbWVUb1BpeGVsXG4gICAgdGhpcy5fdGltZVRvUGl4ZWwgPSBudWxsO1xuICAgIC8vIHRoaXMuX29yaWdpbmFsWFNjYWxlID0gbnVsbDtcblxuICAgIHRoaXMuX29mZnNldCA9IDA7XG4gICAgdGhpcy5fem9vbSA9IDE7XG4gICAgdGhpcy5fY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmQgPSBwaXhlbHNQZXJTZWNvbmQ7XG4gICAgLy8gcGFyYW1zXG4gICAgdGhpcy5fdmlzaWJsZVdpZHRoID0gdmlzaWJsZVdpZHRoO1xuICAgIHRoaXMuX3Zpc2libGVEdXJhdGlvbiA9IHRoaXMudmlzaWJsZVdpZHRoIC8gdGhpcy5fY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmQ7XG4gICAgdGhpcy5fbWFpbnRhaW5WaXNpYmxlRHVyYXRpb24gPSBmYWxzZTtcblxuICAgIC8vIGNyZWF0ZSB0aGUgdGltZVRvUGl4ZWwgc2NhbGVcbiAgICBjb25zdCBzY2FsZSA9IHNjYWxlcy5saW5lYXIoKVxuICAgICAgLmRvbWFpbihbMCwgMV0pXG4gICAgICAucmFuZ2UoWzAsIHBpeGVsc1BlclNlY29uZF0pO1xuXG4gICAgdGhpcy50aW1lVG9QaXhlbCA9IHNjYWxlO1xuICAgIC8vIHRoaXMub3JpZ2luYWxYU2NhbGUgPSB0aGlzLnRpbWVUb1BpeGVsLmNvcHkoKTtcblxuICAgIHRoaXMuX29yaWdpbmFsUGl4ZWxzUGVyU2Vjb25kID0gdGhpcy5fY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmQ7XG4gIH1cblxuICBnZXQgcGl4ZWxzUGVyU2Vjb25kKCkge1xuICAgIHJldHVybiB0aGlzLl9vcmlnaW5hbFBpeGVsc1BlclNlY29uZDtcbiAgfVxuXG4gIHNldCBwaXhlbHNQZXJTZWNvbmQodmFsdWUpIHtcbiAgICB0aGlzLl9jb21wdXRlZFBpeGVsc1BlclNlY29uZCA9IHZhbHVlICogdGhpcy56b29tO1xuICAgIHRoaXMuX29yaWdpbmFsUGl4ZWxzUGVyU2Vjb25kID0gdmFsdWU7XG4gICAgdGhpcy5fdXBkYXRlVGltZVRvUGl4ZWxSYW5nZSgpO1xuXG4gICAgLy8gZm9yY2UgY2hpbGRyZW4gc2NhbGUgdXBkYXRlXG4gICAgdGhpcy5fY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjaGlsZCkge1xuICAgICAgaWYgKCFjaGlsZC5fdGltZVRvUGl4ZWwpIHsgcmV0dXJuOyB9XG4gICAgICBjaGlsZC5zdHJldGNoUmF0aW8gPSBjaGlsZC5zdHJldGNoUmF0aW87XG4gICAgfSk7XG4gIH1cblxuICBnZXQgY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kO1xuICB9XG5cbiAgZ2V0IG9mZnNldCgpIHtcbiAgICByZXR1cm4gdGhpcy5fb2Zmc2V0O1xuICB9XG5cbiAgc2V0IG9mZnNldCh2YWx1ZSkge1xuICAgIHRoaXMuX29mZnNldCA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHpvb20oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3pvb207XG4gIH1cblxuICBzZXQgem9vbSh2YWx1ZSkge1xuICAgIC8vIENvbXB1dGUgY2hhbmdlIHRvIHByb3BhZ2F0ZSB0byBjaGlsZHJlbiB3aG8gaGF2ZSB0aGVpciBvd24gdGltZVRvUGl4ZWxcbiAgICBjb25zdCByYXRpb0NoYW5nZSA9IHZhbHVlIC8gdGhpcy5fem9vbTtcbiAgICB0aGlzLl96b29tID0gdmFsdWU7XG4gICAgdGhpcy5fY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmQgPSB0aGlzLl9vcmlnaW5hbFBpeGVsc1BlclNlY29uZCAqIHZhbHVlO1xuICAgIHRoaXMuX3VwZGF0ZVRpbWVUb1BpeGVsUmFuZ2UoKTtcblxuICAgIHRoaXMuX2NoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgIGlmICghY2hpbGQuX3RpbWVUb1BpeGVsKSB7IHJldHVybjsgfVxuICAgICAgY2hpbGQuc3RyZXRjaFJhdGlvID0gY2hpbGQuc3RyZXRjaFJhdGlvICogcmF0aW9DaGFuZ2U7XG4gICAgfSk7XG4gIH1cblxuICBnZXQgdmlzaWJsZVdpZHRoKCkge1xuICAgIHJldHVybiB0aGlzLl92aXNpYmxlV2lkdGg7XG4gIH1cblxuICBzZXQgdmlzaWJsZVdpZHRoKHZhbHVlKSB7XG4gICAgY29uc3Qgd2lkdGhSYXRpbyA9IHZhbHVlIC8gdGhpcy52aXNpYmxlV2lkdGg7XG5cbiAgICB0aGlzLl92aXNpYmxlV2lkdGggPSB2YWx1ZTtcbiAgICB0aGlzLl92aXNpYmxlRHVyYXRpb24gPSB0aGlzLnZpc2libGVXaWR0aCAvIHRoaXMuX2NvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kO1xuXG4gICAgaWYgKHRoaXMubWFpbnRhaW5WaXNpYmxlRHVyYXRpb24pIHtcbiAgICAgIHRoaXMucGl4ZWxzUGVyU2Vjb25kID0gdGhpcy5fY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmQgKiB3aWR0aFJhdGlvO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcmVhZG9ubHkgKi9cbiAgZ2V0IHZpc2libGVEdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fdmlzaWJsZUR1cmF0aW9uO1xuICB9XG5cbiAgZ2V0IG1haW50YWluVmlzaWJsZUR1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9tYWludGFpblZpc2libGVEdXJhdGlvbjtcbiAgfVxuXG4gIHNldCBtYWludGFpblZpc2libGVEdXJhdGlvbihib29sKSB7XG4gICAgdGhpcy5fbWFpbnRhaW5WaXNpYmxlRHVyYXRpb24gPSBib29sO1xuICB9XG5cbiAgZ2V0IHRpbWVUb1BpeGVsKCkge1xuICAgIHJldHVybiB0aGlzLl90aW1lVG9QaXhlbDtcbiAgfVxuXG4gIHNldCB0aW1lVG9QaXhlbChzY2FsZSkge1xuICAgIHRoaXMuX3RpbWVUb1BpeGVsID0gc2NhbGU7XG4gIH1cblxuICBfdXBkYXRlVGltZVRvUGl4ZWxSYW5nZSgpIHtcbiAgICB0aGlzLl92aXNpYmxlRHVyYXRpb24gPSB0aGlzLnZpc2libGVXaWR0aCAvIHRoaXMuX2NvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kO1xuICAgIHRoaXMudGltZVRvUGl4ZWwucmFuZ2UoWzAsIHRoaXMuX2NvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kXSk7XG4gIH1cbn1cbiJdfQ==