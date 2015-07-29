/**
* `State` instances are used to define the application logic by precising specific user interaction cases, and how they impact the overal temporal representation.
* States manage interactions like zooming, browsing, or editing the timeline.
* Customized states should extend this BaseState.
*/
"use strict";

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _Object$defineProperty = require("babel-runtime/core-js/object/define-property")["default"];

_Object$defineProperty(exports, "__esModule", {
  value: true
});

var BaseState = (function () {
  function BaseState(timeline) {
    var options = arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, BaseState);

    this.timeline = timeline;
  }

  _createClass(BaseState, [{
    key: "tracks",

    /**
     * Get timeline views
     */
    get: function () {
      return this.timeline.tracks;
    }
  }, {
    key: "layers",

    /**
     * Get timeline layers
     */
    get: function () {
      return this.timeline.tracks.layers;
    }
  }, {
    key: "enter",

    /**
     * Called when the timeline is entering the state
     */
    value: function enter() {}
  }, {
    key: "exit",

    /**
     * Called when the timeline is leaving the state
     */
    value: function exit() {}
  }, {
    key: "handleEvent",

    /**
     * handle registered inputs from mouse and keyboard
     * @param {Event} e - the event to process
     */
    value: function handleEvent(e) {}
  }]);

  return BaseState;
})();

exports["default"] = BaseState;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFLcUIsU0FBUztBQUNqQixXQURRLFNBQVMsQ0FDaEIsUUFBUSxFQUFnQjtRQUFkLE9BQU8sZ0NBQUcsRUFBRTs7MEJBRGYsU0FBUzs7QUFFMUIsUUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7R0FDMUI7O2VBSGtCLFNBQVM7Ozs7OztTQVFsQixZQUFHO0FBQ1gsYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztLQUM3Qjs7Ozs7OztTQUtTLFlBQUc7QUFDWCxhQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztLQUNwQzs7Ozs7OztXQUtJLGlCQUFHLEVBQUU7Ozs7Ozs7V0FLTixnQkFBRyxFQUFFOzs7Ozs7OztXQU1FLHFCQUFDLENBQUMsRUFBRSxFQUFFOzs7U0FqQ0UsU0FBUzs7O3FCQUFULFNBQVMiLCJmaWxlIjoiZXM2L3V0aWxzL29ydGhvZ29uYWwtZGF0YS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuKiBgU3RhdGVgIGluc3RhbmNlcyBhcmUgdXNlZCB0byBkZWZpbmUgdGhlIGFwcGxpY2F0aW9uIGxvZ2ljIGJ5IHByZWNpc2luZyBzcGVjaWZpYyB1c2VyIGludGVyYWN0aW9uIGNhc2VzLCBhbmQgaG93IHRoZXkgaW1wYWN0IHRoZSBvdmVyYWwgdGVtcG9yYWwgcmVwcmVzZW50YXRpb24uXG4qIFN0YXRlcyBtYW5hZ2UgaW50ZXJhY3Rpb25zIGxpa2Ugem9vbWluZywgYnJvd3NpbmcsIG9yIGVkaXRpbmcgdGhlIHRpbWVsaW5lLlxuKiBDdXN0b21pemVkIHN0YXRlcyBzaG91bGQgZXh0ZW5kIHRoaXMgQmFzZVN0YXRlLlxuKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLnRpbWVsaW5lID0gdGltZWxpbmU7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRpbWVsaW5lIHZpZXdzXG4gICAqL1xuICBnZXQgdHJhY2tzKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVsaW5lLnRyYWNrcztcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGltZWxpbmUgbGF5ZXJzXG4gICAqL1xuICBnZXQgbGF5ZXJzKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVsaW5lLnRyYWNrcy5sYXllcnM7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIHRpbWVsaW5lIGlzIGVudGVyaW5nIHRoZSBzdGF0ZVxuICAgKi9cbiAgZW50ZXIoKSB7fVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgdGltZWxpbmUgaXMgbGVhdmluZyB0aGUgc3RhdGVcbiAgICovXG4gIGV4aXQoKSB7fVxuXG4gIC8qKlxuICAgKiBoYW5kbGUgcmVnaXN0ZXJlZCBpbnB1dHMgZnJvbSBtb3VzZSBhbmQga2V5Ym9hcmRcbiAgICogQHBhcmFtIHtFdmVudH0gZSAtIHRoZSBldmVudCB0byBwcm9jZXNzXG4gICAqL1xuICBoYW5kbGVFdmVudChlKSB7fVxufVxuIl19