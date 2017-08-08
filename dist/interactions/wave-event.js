"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Object template for all events. Event sources should use this event template
 * in order to keep consistency with existing sources.
 */
var WaveEvent =
/**
 * @param {String} source - The name of the source (`keyboard`, `surface`, ...).
 * @param {String} type - The type of the source (`mousedown`, `keyup`, ...).
 * @param {Event} originalEvent - The original event as emitted by the browser.
 */
function WaveEvent(source, type, originalEvent) {
  (0, _classCallCheck3.default)(this, WaveEvent);

  this.source = source;
  this.type = type;
  this.originalEvent = originalEvent;

  this.target = originalEvent.target;
  this.currentTarget = originalEvent.currentTarget;
};

exports.default = WaveEvent;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndhdmUtZXZlbnQuanMiXSwibmFtZXMiOlsiV2F2ZUV2ZW50Iiwic291cmNlIiwidHlwZSIsIm9yaWdpbmFsRXZlbnQiLCJ0YXJnZXQiLCJjdXJyZW50VGFyZ2V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7OztJQUlxQkEsUztBQUNuQjs7Ozs7QUFLQSxtQkFBWUMsTUFBWixFQUFvQkMsSUFBcEIsRUFBMEJDLGFBQTFCLEVBQXlDO0FBQUE7O0FBQ3ZDLE9BQUtGLE1BQUwsR0FBY0EsTUFBZDtBQUNBLE9BQUtDLElBQUwsR0FBWUEsSUFBWjtBQUNBLE9BQUtDLGFBQUwsR0FBcUJBLGFBQXJCOztBQUVBLE9BQUtDLE1BQUwsR0FBY0QsY0FBY0MsTUFBNUI7QUFDQSxPQUFLQyxhQUFMLEdBQXFCRixjQUFjRSxhQUFuQztBQUNELEM7O2tCQWJrQkwsUyIsImZpbGUiOiJ3YXZlLWV2ZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBPYmplY3QgdGVtcGxhdGUgZm9yIGFsbCBldmVudHMuIEV2ZW50IHNvdXJjZXMgc2hvdWxkIHVzZSB0aGlzIGV2ZW50IHRlbXBsYXRlXG4gKiBpbiBvcmRlciB0byBrZWVwIGNvbnNpc3RlbmN5IHdpdGggZXhpc3Rpbmcgc291cmNlcy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2F2ZUV2ZW50IHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzb3VyY2UgLSBUaGUgbmFtZSBvZiB0aGUgc291cmNlIChga2V5Ym9hcmRgLCBgc3VyZmFjZWAsIC4uLikuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gVGhlIHR5cGUgb2YgdGhlIHNvdXJjZSAoYG1vdXNlZG93bmAsIGBrZXl1cGAsIC4uLikuXG4gICAqIEBwYXJhbSB7RXZlbnR9IG9yaWdpbmFsRXZlbnQgLSBUaGUgb3JpZ2luYWwgZXZlbnQgYXMgZW1pdHRlZCBieSB0aGUgYnJvd3Nlci5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHNvdXJjZSwgdHlwZSwgb3JpZ2luYWxFdmVudCkge1xuICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgdGhpcy5vcmlnaW5hbEV2ZW50ID0gb3JpZ2luYWxFdmVudDtcblxuICAgIHRoaXMudGFyZ2V0ID0gb3JpZ2luYWxFdmVudC50YXJnZXQ7XG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gb3JpZ2luYWxFdmVudC5jdXJyZW50VGFyZ2V0O1xuICB9XG59XG4iXX0=