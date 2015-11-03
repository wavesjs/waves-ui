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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zaGFwZXMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBSXFCLFNBQVM7Ozs7OztBQU1qQixTQU5RLFNBQVMsQ0FNaEIsTUFBTSxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUU7d0JBTnRCLFNBQVM7O0FBTzFCLE1BQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLE1BQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLE1BQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDOztBQUVuQyxNQUFJLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUM7QUFDbkMsTUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUMsYUFBYSxDQUFDO0NBQ2xEOztxQkFia0IsU0FBUyIsImZpbGUiOiJzcmMvc2hhcGVzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBPYmplY3QgdGVtcGxhdGUgZm9yIGFsbCBldmVudHMuIEV2ZW50IHNvdXJjZXMgc2hvdWxkIHVzZSB0aGlzIGV2ZW50IHRlbXBsYXRlXG4gKiBpbiBvcmRlciB0byBrZWVwIGNvbnNpc3RlbmN5IHdpdGggZXhpc3Rpbmcgc291cmNlcy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2F2ZUV2ZW50IHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzb3VyY2UgLSBUaGUgbmFtZSBvZiB0aGUgc291cmNlIChga2V5Ym9hcmRgLCBgc3VyZmFjZWAsIC4uLikuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gVGhlIHR5cGUgb2YgdGhlIHNvdXJjZSAoYG1vdXNlZG93bmAsIGBrZXl1cGAsIC4uLikuXG4gICAqIEBwYXJhbSB7RXZlbnR9IG9yaWdpbmFsRXZlbnQgLSBUaGUgb3JpZ2luYWwgZXZlbnQgYXMgZW1pdHRlZCBieSB0aGUgYnJvd3Nlci5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHNvdXJjZSwgdHlwZSwgb3JpZ2luYWxFdmVudCkge1xuICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgdGhpcy5vcmlnaW5hbEV2ZW50ID0gb3JpZ2luYWxFdmVudDtcblxuICAgIHRoaXMudGFyZ2V0ID0gb3JpZ2luYWxFdmVudC50YXJnZXQ7XG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gb3JpZ2luYWxFdmVudC5jdXJyZW50VGFyZ2V0O1xuICB9XG59XG4iXX0=