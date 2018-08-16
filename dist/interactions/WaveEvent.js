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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIldhdmVFdmVudC5qcyJdLCJuYW1lcyI6WyJXYXZlRXZlbnQiLCJzb3VyY2UiLCJ0eXBlIiwib3JpZ2luYWxFdmVudCIsInRhcmdldCIsImN1cnJlbnRUYXJnZXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBOzs7O0lBSU1BLFM7QUFDSjs7Ozs7QUFLQSxtQkFBWUMsTUFBWixFQUFvQkMsSUFBcEIsRUFBMEJDLGFBQTFCLEVBQXlDO0FBQUE7O0FBQ3ZDLE9BQUtGLE1BQUwsR0FBY0EsTUFBZDtBQUNBLE9BQUtDLElBQUwsR0FBWUEsSUFBWjtBQUNBLE9BQUtDLGFBQUwsR0FBcUJBLGFBQXJCOztBQUVBLE9BQUtDLE1BQUwsR0FBY0QsY0FBY0MsTUFBNUI7QUFDQSxPQUFLQyxhQUFMLEdBQXFCRixjQUFjRSxhQUFuQztBQUNELEM7O2tCQUdZTCxTIiwiZmlsZSI6IldhdmVFdmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogT2JqZWN0IHRlbXBsYXRlIGZvciBhbGwgZXZlbnRzLiBFdmVudCBzb3VyY2VzIHNob3VsZCB1c2UgdGhpcyBldmVudCB0ZW1wbGF0ZVxuICogaW4gb3JkZXIgdG8ga2VlcCBjb25zaXN0ZW5jeSB3aXRoIGV4aXN0aW5nIHNvdXJjZXMuXG4gKi9cbmNsYXNzIFdhdmVFdmVudCB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc291cmNlIC0gVGhlIG5hbWUgb2YgdGhlIHNvdXJjZSAoYGtleWJvYXJkYCwgYHN1cmZhY2VgLCAuLi4pLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIFRoZSB0eXBlIG9mIHRoZSBzb3VyY2UgKGBtb3VzZWRvd25gLCBga2V5dXBgLCAuLi4pLlxuICAgKiBAcGFyYW0ge0V2ZW50fSBvcmlnaW5hbEV2ZW50IC0gVGhlIG9yaWdpbmFsIGV2ZW50IGFzIGVtaXR0ZWQgYnkgdGhlIGJyb3dzZXIuXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihzb3VyY2UsIHR5cGUsIG9yaWdpbmFsRXZlbnQpIHtcbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIHRoaXMub3JpZ2luYWxFdmVudCA9IG9yaWdpbmFsRXZlbnQ7XG5cbiAgICB0aGlzLnRhcmdldCA9IG9yaWdpbmFsRXZlbnQudGFyZ2V0O1xuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IG9yaWdpbmFsRXZlbnQuY3VycmVudFRhcmdldDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBXYXZlRXZlbnQ7XG4iXX0=