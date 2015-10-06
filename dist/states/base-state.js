/**
* `State` instances are used to define the application logic by precising specific user interaction cases, and how they impact the overal temporal representation.
* States manage interactions like zooming, browsing, or editing the timeline.
* Customized states should extend this BaseState.
*/
"use strict";

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var BaseState = (function () {
  function BaseState(timeline) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, BaseState);

    this.timeline = timeline;
  }

  /**
   * Get timeline views
   */

  _createClass(BaseState, [{
    key: "enter",

    /**
     * Called when the timeline is entering the state
     */
    value: function enter() {}

    /**
     * Called when the timeline is leaving the state
     */
  }, {
    key: "exit",
    value: function exit() {}

    /**
     * handle registered inputs from mouse and keyboard
     * @param {Event} e - the event to process
     * @param {Array} hitLayers - the layers hit by the event (if surface event)
     */
  }, {
    key: "handleEvent",
    value: function handleEvent(e, hitLayers) {}
  }, {
    key: "tracks",
    get: function get() {
      return this.timeline.tracks;
    }

    /**
     * Get timeline layers
     */
  }, {
    key: "layers",
    get: function get() {
      return this.timeline.tracks.layers;
    }
  }]);

  return BaseState;
})();

exports["default"] = BaseState;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zdGF0ZXMvYmFzZS1zdGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7SUFLcUIsU0FBUztBQUNqQixXQURRLFNBQVMsQ0FDaEIsUUFBUSxFQUFnQjtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBRGYsU0FBUzs7QUFFMUIsUUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7R0FDMUI7Ozs7OztlQUhrQixTQUFTOzs7Ozs7V0FzQnZCLGlCQUFHLEVBQUU7Ozs7Ozs7V0FLTixnQkFBRyxFQUFFOzs7Ozs7Ozs7V0FPRSxxQkFBQyxDQUFDLEVBQUUsU0FBUyxFQUFFLEVBQUU7OztTQTFCbEIsZUFBRztBQUNYLGFBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7S0FDN0I7Ozs7Ozs7U0FLUyxlQUFHO0FBQ1gsYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7S0FDcEM7OztTQWpCa0IsU0FBUzs7O3FCQUFULFNBQVMiLCJmaWxlIjoiZXM2L3N0YXRlcy9iYXNlLXN0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4qIGBTdGF0ZWAgaW5zdGFuY2VzIGFyZSB1c2VkIHRvIGRlZmluZSB0aGUgYXBwbGljYXRpb24gbG9naWMgYnkgcHJlY2lzaW5nIHNwZWNpZmljIHVzZXIgaW50ZXJhY3Rpb24gY2FzZXMsIGFuZCBob3cgdGhleSBpbXBhY3QgdGhlIG92ZXJhbCB0ZW1wb3JhbCByZXByZXNlbnRhdGlvbi5cbiogU3RhdGVzIG1hbmFnZSBpbnRlcmFjdGlvbnMgbGlrZSB6b29taW5nLCBicm93c2luZywgb3IgZWRpdGluZyB0aGUgdGltZWxpbmUuXG4qIEN1c3RvbWl6ZWQgc3RhdGVzIHNob3VsZCBleHRlbmQgdGhpcyBCYXNlU3RhdGUuXG4qL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUsIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMudGltZWxpbmUgPSB0aW1lbGluZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGltZWxpbmUgdmlld3NcbiAgICovXG4gIGdldCB0cmFja3MoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZWxpbmUudHJhY2tzO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aW1lbGluZSBsYXllcnNcbiAgICovXG4gIGdldCBsYXllcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZWxpbmUudHJhY2tzLmxheWVycztcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgdGltZWxpbmUgaXMgZW50ZXJpbmcgdGhlIHN0YXRlXG4gICAqL1xuICBlbnRlcigpIHt9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSB0aW1lbGluZSBpcyBsZWF2aW5nIHRoZSBzdGF0ZVxuICAgKi9cbiAgZXhpdCgpIHt9XG5cbiAgLyoqXG4gICAqIGhhbmRsZSByZWdpc3RlcmVkIGlucHV0cyBmcm9tIG1vdXNlIGFuZCBrZXlib2FyZFxuICAgKiBAcGFyYW0ge0V2ZW50fSBlIC0gdGhlIGV2ZW50IHRvIHByb2Nlc3NcbiAgICogQHBhcmFtIHtBcnJheX0gaGl0TGF5ZXJzIC0gdGhlIGxheWVycyBoaXQgYnkgdGhlIGV2ZW50IChpZiBzdXJmYWNlIGV2ZW50KVxuICAgKi9cbiAgaGFuZGxlRXZlbnQoZSwgaGl0TGF5ZXJzKSB7fVxufVxuIl19