"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * `State` instances are used to define the application logic by precising
 * specific user interaction cases, and how they impact the overal temporal
 * representation. The abstractions extending this base class should be
 * considered as the main interface between the visualization and the
 * application logic. All provided states should be seen as simple examples for
 * rapid prototyping,
 *
 * States manage interactions like zooming, browsing, or editing the timeline.
 * Customized states should extend this BaseState.
 */
var BaseState = function () {
  /**
   * Returns timeline tracks collection.
   *
   * @type {TrackCollection}
   */
  function BaseState(timeline) {
    (0, _classCallCheck3.default)(this, BaseState);

    /**
     * A reference to the timeline on which the state should be installed.
     * @type {Timeline}
     */
    this.timeline = timeline;
  }

  /**
   * Returns timeline tracks collection.
   *
   * @type {TrackCollection<Track>}
   */


  (0, _createClass3.default)(BaseState, [{
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
     * Main interface method to override when creating a new `State`. Handle event
     * from mouse or keyboard, should define behavior according to the event
     * (aka. mousedown, mouseup, ...).
     *
     * @param {WaveEvent} e - the event to process.
     * @param {Array} hitLayers - the layers hit by the mouse event (if surface
     * event).
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
     *
     * @type {Array<Layer>}
     */

  }, {
    key: "layers",
    get: function get() {
      return this.timeline.tracks.layers;
    }
  }]);
  return BaseState;
}();

exports.default = BaseState;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJhc2VTdGF0ZS5qcyJdLCJuYW1lcyI6WyJCYXNlU3RhdGUiLCJ0aW1lbGluZSIsImUiLCJoaXRMYXllcnMiLCJ0cmFja3MiLCJsYXllcnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7SUFXTUEsUztBQUNKOzs7OztBQUtBLHFCQUFZQyxRQUFaLEVBQXNCO0FBQUE7O0FBQ3BCOzs7O0FBSUEsU0FBS0EsUUFBTCxHQUFnQkEsUUFBaEI7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7QUFrQkE7Ozs0QkFHUSxDQUFFOztBQUVWOzs7Ozs7MkJBR08sQ0FBRTs7QUFFVDs7Ozs7Ozs7Ozs7O2dDQVNZQyxDLEVBQUdDLFMsRUFBVyxDQUFFOzs7d0JBaENmO0FBQ1gsYUFBTyxLQUFLRixRQUFMLENBQWNHLE1BQXJCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3dCQUthO0FBQ1gsYUFBTyxLQUFLSCxRQUFMLENBQWNHLE1BQWQsQ0FBcUJDLE1BQTVCO0FBQ0Q7Ozs7O2tCQXdCWUwsUyIsImZpbGUiOiJCYXNlU3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGBTdGF0ZWAgaW5zdGFuY2VzIGFyZSB1c2VkIHRvIGRlZmluZSB0aGUgYXBwbGljYXRpb24gbG9naWMgYnkgcHJlY2lzaW5nXG4gKiBzcGVjaWZpYyB1c2VyIGludGVyYWN0aW9uIGNhc2VzLCBhbmQgaG93IHRoZXkgaW1wYWN0IHRoZSBvdmVyYWwgdGVtcG9yYWxcbiAqIHJlcHJlc2VudGF0aW9uLiBUaGUgYWJzdHJhY3Rpb25zIGV4dGVuZGluZyB0aGlzIGJhc2UgY2xhc3Mgc2hvdWxkIGJlXG4gKiBjb25zaWRlcmVkIGFzIHRoZSBtYWluIGludGVyZmFjZSBiZXR3ZWVuIHRoZSB2aXN1YWxpemF0aW9uIGFuZCB0aGVcbiAqIGFwcGxpY2F0aW9uIGxvZ2ljLiBBbGwgcHJvdmlkZWQgc3RhdGVzIHNob3VsZCBiZSBzZWVuIGFzIHNpbXBsZSBleGFtcGxlcyBmb3JcbiAqIHJhcGlkIHByb3RvdHlwaW5nLFxuICpcbiAqIFN0YXRlcyBtYW5hZ2UgaW50ZXJhY3Rpb25zIGxpa2Ugem9vbWluZywgYnJvd3NpbmcsIG9yIGVkaXRpbmcgdGhlIHRpbWVsaW5lLlxuICogQ3VzdG9taXplZCBzdGF0ZXMgc2hvdWxkIGV4dGVuZCB0aGlzIEJhc2VTdGF0ZS5cbiAqL1xuY2xhc3MgQmFzZVN0YXRlIHtcbiAgLyoqXG4gICAqIFJldHVybnMgdGltZWxpbmUgdHJhY2tzIGNvbGxlY3Rpb24uXG4gICAqXG4gICAqIEB0eXBlIHtUcmFja0NvbGxlY3Rpb259XG4gICAqL1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSkge1xuICAgIC8qKlxuICAgICAqIEEgcmVmZXJlbmNlIHRvIHRoZSB0aW1lbGluZSBvbiB3aGljaCB0aGUgc3RhdGUgc2hvdWxkIGJlIGluc3RhbGxlZC5cbiAgICAgKiBAdHlwZSB7VGltZWxpbmV9XG4gICAgICovXG4gICAgdGhpcy50aW1lbGluZSA9IHRpbWVsaW5lO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGltZWxpbmUgdHJhY2tzIGNvbGxlY3Rpb24uXG4gICAqXG4gICAqIEB0eXBlIHtUcmFja0NvbGxlY3Rpb248VHJhY2s+fVxuICAgKi9cbiAgZ2V0IHRyYWNrcygpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lbGluZS50cmFja3M7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbGwgcmVnaXN0ZXJlZCBsYXllcnMuXG4gICAqXG4gICAqIEB0eXBlIHtBcnJheTxMYXllcj59XG4gICAqL1xuICBnZXQgbGF5ZXJzKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVsaW5lLnRyYWNrcy5sYXllcnM7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIHRpbWVsaW5lIGlzIGVudGVyaW5nIHRoZSBzdGF0ZS5cbiAgICovXG4gIGVudGVyKCkge31cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIHRpbWVsaW5lIGlzIGxlYXZpbmcgdGhlIHN0YXRlLlxuICAgKi9cbiAgZXhpdCgpIHt9XG5cbiAgLyoqXG4gICAqIE1haW4gaW50ZXJmYWNlIG1ldGhvZCB0byBvdmVycmlkZSB3aGVuIGNyZWF0aW5nIGEgbmV3IGBTdGF0ZWAuIEhhbmRsZSBldmVudFxuICAgKiBmcm9tIG1vdXNlIG9yIGtleWJvYXJkLCBzaG91bGQgZGVmaW5lIGJlaGF2aW9yIGFjY29yZGluZyB0byB0aGUgZXZlbnRcbiAgICogKGFrYS4gbW91c2Vkb3duLCBtb3VzZXVwLCAuLi4pLlxuICAgKlxuICAgKiBAcGFyYW0ge1dhdmVFdmVudH0gZSAtIHRoZSBldmVudCB0byBwcm9jZXNzLlxuICAgKiBAcGFyYW0ge0FycmF5fSBoaXRMYXllcnMgLSB0aGUgbGF5ZXJzIGhpdCBieSB0aGUgbW91c2UgZXZlbnQgKGlmIHN1cmZhY2VcbiAgICogZXZlbnQpLlxuICAgKi9cbiAgaGFuZGxlRXZlbnQoZSwgaGl0TGF5ZXJzKSB7fVxufVxuXG5leHBvcnQgZGVmYXVsdCBCYXNlU3RhdGU7XG4iXX0=