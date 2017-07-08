/**
 * Object template for all events. Event sources should use this event template
 * in order to keep consistency with existing sources.
 */
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var WaveEvent =
/**
 * @param {String} source - The name of the source (`keyboard`, `surface`, ...).
 * @param {String} type - The type of the source (`mousedown`, `keyup`, ...).
 * @param {Event} originalEvent - The original event as emitted by the browser.
 */
function WaveEvent(source, type, originalEvent) {
  _classCallCheck(this, WaveEvent);

  this.source = source;
  this.type = type;
  this.originalEvent = originalEvent;

  this.target = originalEvent.target;
  this.currentTarget = originalEvent.currentTarget;
};

exports["default"] = WaveEvent;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9pbnRlcmFjdGlvbnMvd2F2ZS1ldmVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFJcUIsU0FBUzs7Ozs7O0FBTWpCLFNBTlEsU0FBUyxDQU1oQixNQUFNLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRTt3QkFOdEIsU0FBUzs7QUFPMUIsTUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsTUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsTUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7O0FBRW5DLE1BQUksQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQztBQUNuQyxNQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQyxhQUFhLENBQUM7Q0FDbEQ7O3FCQWJrQixTQUFTIiwiZmlsZSI6InNyYy9pbnRlcmFjdGlvbnMvd2F2ZS1ldmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogT2JqZWN0IHRlbXBsYXRlIGZvciBhbGwgZXZlbnRzLiBFdmVudCBzb3VyY2VzIHNob3VsZCB1c2UgdGhpcyBldmVudCB0ZW1wbGF0ZVxuICogaW4gb3JkZXIgdG8ga2VlcCBjb25zaXN0ZW5jeSB3aXRoIGV4aXN0aW5nIHNvdXJjZXMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhdmVFdmVudCB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc291cmNlIC0gVGhlIG5hbWUgb2YgdGhlIHNvdXJjZSAoYGtleWJvYXJkYCwgYHN1cmZhY2VgLCAuLi4pLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIFRoZSB0eXBlIG9mIHRoZSBzb3VyY2UgKGBtb3VzZWRvd25gLCBga2V5dXBgLCAuLi4pLlxuICAgKiBAcGFyYW0ge0V2ZW50fSBvcmlnaW5hbEV2ZW50IC0gVGhlIG9yaWdpbmFsIGV2ZW50IGFzIGVtaXR0ZWQgYnkgdGhlIGJyb3dzZXIuXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihzb3VyY2UsIHR5cGUsIG9yaWdpbmFsRXZlbnQpIHtcbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIHRoaXMub3JpZ2luYWxFdmVudCA9IG9yaWdpbmFsRXZlbnQ7XG5cbiAgICB0aGlzLnRhcmdldCA9IG9yaWdpbmFsRXZlbnQudGFyZ2V0O1xuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IG9yaWdpbmFsRXZlbnQuY3VycmVudFRhcmdldDtcbiAgfVxufVxuIl19