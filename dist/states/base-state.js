/**
 * `State` instances are used to define the application logic by precising specific user interaction cases, and how they impact the overal temporal representation. The abstractions extending this base class should be considered as the main interface between the visualization and the application logic. All provided states should be seen as simple examples for rapid prototyping,
 *
 * States manage interactions like zooming, browsing, or editing the timeline. Customized states should extend this BaseState.
 */
"use strict";

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var BaseState = (function () {
  /**
   * Returns timeline tracks collection.
   * @type {TrackCollection}
   */

  function BaseState(timeline) {
    _classCallCheck(this, BaseState);

    /**
     * A reference to the timeline on which the state should be installed.
     * @type {Timeline}
     */
    this.timeline = timeline;
  }

  /**
   * Returns timeline tracks collection.
   * @type {TrackCollection<Track>}
   */

  _createClass(BaseState, [{
    key: "enter",

    /**
     * Called when the timeline is entering the state.
     */
    value: function enter() {}

    /**
     * Called when the timeline is leaving the state.
     */
  }, {
    key: "exit",
    value: function exit() {}

    /**
     * Main interface method to override when creating a new `State`. Handle event from mouse or keyboard, should define behavior according to the event (aka. mousedown, mouseup, ...)
     * @param {WaveEvent} e - the event to process
     * @param {Array} hitLayers - the layers hit by the mouse event (if surface event)
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
     * Returns all registered layers.
     * @type {Array<Layer>}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zdGF0ZXMvYmFzZS1zdGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7SUFLcUIsU0FBUzs7Ozs7O0FBS2pCLFdBTFEsU0FBUyxDQUtoQixRQUFRLEVBQUU7MEJBTEgsU0FBUzs7Ozs7O0FBVTFCLFFBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0dBQzFCOzs7Ozs7O2VBWGtCLFNBQVM7Ozs7OztXQWdDdkIsaUJBQUcsRUFBRTs7Ozs7OztXQUtOLGdCQUFHLEVBQUU7Ozs7Ozs7OztXQU9FLHFCQUFDLENBQUMsRUFBRSxTQUFTLEVBQUUsRUFBRTs7O1NBM0JsQixlQUFHO0FBQ1gsYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztLQUM3Qjs7Ozs7Ozs7U0FNUyxlQUFHO0FBQ1gsYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7S0FDcEM7OztTQTNCa0IsU0FBUzs7O3FCQUFULFNBQVMiLCJmaWxlIjoic3JjL3N0YXRlcy9iYXNlLXN0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBgU3RhdGVgIGluc3RhbmNlcyBhcmUgdXNlZCB0byBkZWZpbmUgdGhlIGFwcGxpY2F0aW9uIGxvZ2ljIGJ5IHByZWNpc2luZyBzcGVjaWZpYyB1c2VyIGludGVyYWN0aW9uIGNhc2VzLCBhbmQgaG93IHRoZXkgaW1wYWN0IHRoZSBvdmVyYWwgdGVtcG9yYWwgcmVwcmVzZW50YXRpb24uIFRoZSBhYnN0cmFjdGlvbnMgZXh0ZW5kaW5nIHRoaXMgYmFzZSBjbGFzcyBzaG91bGQgYmUgY29uc2lkZXJlZCBhcyB0aGUgbWFpbiBpbnRlcmZhY2UgYmV0d2VlbiB0aGUgdmlzdWFsaXphdGlvbiBhbmQgdGhlIGFwcGxpY2F0aW9uIGxvZ2ljLiBBbGwgcHJvdmlkZWQgc3RhdGVzIHNob3VsZCBiZSBzZWVuIGFzIHNpbXBsZSBleGFtcGxlcyBmb3IgcmFwaWQgcHJvdG90eXBpbmcsXG4gKlxuICogU3RhdGVzIG1hbmFnZSBpbnRlcmFjdGlvbnMgbGlrZSB6b29taW5nLCBicm93c2luZywgb3IgZWRpdGluZyB0aGUgdGltZWxpbmUuIEN1c3RvbWl6ZWQgc3RhdGVzIHNob3VsZCBleHRlbmQgdGhpcyBCYXNlU3RhdGUuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VTdGF0ZSB7XG4gIC8qKlxuICAgKiBSZXR1cm5zIHRpbWVsaW5lIHRyYWNrcyBjb2xsZWN0aW9uLlxuICAgKiBAdHlwZSB7VHJhY2tDb2xsZWN0aW9ufVxuICAgKi9cbiAgY29uc3RydWN0b3IodGltZWxpbmUpIHtcbiAgICAvKipcbiAgICAgKiBBIHJlZmVyZW5jZSB0byB0aGUgdGltZWxpbmUgb24gd2hpY2ggdGhlIHN0YXRlIHNob3VsZCBiZSBpbnN0YWxsZWQuXG4gICAgICogQHR5cGUge1RpbWVsaW5lfVxuICAgICAqL1xuICAgIHRoaXMudGltZWxpbmUgPSB0aW1lbGluZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRpbWVsaW5lIHRyYWNrcyBjb2xsZWN0aW9uLlxuICAgKiBAdHlwZSB7VHJhY2tDb2xsZWN0aW9uPFRyYWNrPn1cbiAgICovXG4gIGdldCB0cmFja3MoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZWxpbmUudHJhY2tzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYWxsIHJlZ2lzdGVyZWQgbGF5ZXJzLlxuICAgKiBAdHlwZSB7QXJyYXk8TGF5ZXI+fVxuICAgKi9cbiAgZ2V0IGxheWVycygpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lbGluZS50cmFja3MubGF5ZXJzO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSB0aW1lbGluZSBpcyBlbnRlcmluZyB0aGUgc3RhdGUuXG4gICAqL1xuICBlbnRlcigpIHt9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSB0aW1lbGluZSBpcyBsZWF2aW5nIHRoZSBzdGF0ZS5cbiAgICovXG4gIGV4aXQoKSB7fVxuXG4gIC8qKlxuICAgKiBNYWluIGludGVyZmFjZSBtZXRob2QgdG8gb3ZlcnJpZGUgd2hlbiBjcmVhdGluZyBhIG5ldyBgU3RhdGVgLiBIYW5kbGUgZXZlbnQgZnJvbSBtb3VzZSBvciBrZXlib2FyZCwgc2hvdWxkIGRlZmluZSBiZWhhdmlvciBhY2NvcmRpbmcgdG8gdGhlIGV2ZW50IChha2EuIG1vdXNlZG93biwgbW91c2V1cCwgLi4uKVxuICAgKiBAcGFyYW0ge1dhdmVFdmVudH0gZSAtIHRoZSBldmVudCB0byBwcm9jZXNzXG4gICAqIEBwYXJhbSB7QXJyYXl9IGhpdExheWVycyAtIHRoZSBsYXllcnMgaGl0IGJ5IHRoZSBtb3VzZSBldmVudCAoaWYgc3VyZmFjZSBldmVudClcbiAgICovXG4gIGhhbmRsZUV2ZW50KGUsIGhpdExheWVycykge31cbn1cbiJdfQ==