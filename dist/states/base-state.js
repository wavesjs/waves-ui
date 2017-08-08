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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2Utc3RhdGUuanMiXSwibmFtZXMiOlsiQmFzZVN0YXRlIiwidGltZWxpbmUiLCJlIiwiaGl0TGF5ZXJzIiwidHJhY2tzIiwibGF5ZXJzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7O0lBV3FCQSxTO0FBQ25COzs7OztBQUtBLHFCQUFZQyxRQUFaLEVBQXNCO0FBQUE7O0FBQ3BCOzs7O0FBSUEsU0FBS0EsUUFBTCxHQUFnQkEsUUFBaEI7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7QUFrQkE7Ozs0QkFHUSxDQUFFOztBQUVWOzs7Ozs7MkJBR08sQ0FBRTs7QUFFVDs7Ozs7Ozs7Ozs7O2dDQVNZQyxDLEVBQUdDLFMsRUFBVyxDQUFFOzs7d0JBaENmO0FBQ1gsYUFBTyxLQUFLRixRQUFMLENBQWNHLE1BQXJCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3dCQUthO0FBQ1gsYUFBTyxLQUFLSCxRQUFMLENBQWNHLE1BQWQsQ0FBcUJDLE1BQTVCO0FBQ0Q7Ozs7O2tCQTlCa0JMLFMiLCJmaWxlIjoiYmFzZS1zdGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogYFN0YXRlYCBpbnN0YW5jZXMgYXJlIHVzZWQgdG8gZGVmaW5lIHRoZSBhcHBsaWNhdGlvbiBsb2dpYyBieSBwcmVjaXNpbmdcbiAqIHNwZWNpZmljIHVzZXIgaW50ZXJhY3Rpb24gY2FzZXMsIGFuZCBob3cgdGhleSBpbXBhY3QgdGhlIG92ZXJhbCB0ZW1wb3JhbFxuICogcmVwcmVzZW50YXRpb24uIFRoZSBhYnN0cmFjdGlvbnMgZXh0ZW5kaW5nIHRoaXMgYmFzZSBjbGFzcyBzaG91bGQgYmVcbiAqIGNvbnNpZGVyZWQgYXMgdGhlIG1haW4gaW50ZXJmYWNlIGJldHdlZW4gdGhlIHZpc3VhbGl6YXRpb24gYW5kIHRoZVxuICogYXBwbGljYXRpb24gbG9naWMuIEFsbCBwcm92aWRlZCBzdGF0ZXMgc2hvdWxkIGJlIHNlZW4gYXMgc2ltcGxlIGV4YW1wbGVzIGZvclxuICogcmFwaWQgcHJvdG90eXBpbmcsXG4gKlxuICogU3RhdGVzIG1hbmFnZSBpbnRlcmFjdGlvbnMgbGlrZSB6b29taW5nLCBicm93c2luZywgb3IgZWRpdGluZyB0aGUgdGltZWxpbmUuXG4gKiBDdXN0b21pemVkIHN0YXRlcyBzaG91bGQgZXh0ZW5kIHRoaXMgQmFzZVN0YXRlLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlU3RhdGUge1xuICAvKipcbiAgICogUmV0dXJucyB0aW1lbGluZSB0cmFja3MgY29sbGVjdGlvbi5cbiAgICpcbiAgICogQHR5cGUge1RyYWNrQ29sbGVjdGlvbn1cbiAgICovXG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lKSB7XG4gICAgLyoqXG4gICAgICogQSByZWZlcmVuY2UgdG8gdGhlIHRpbWVsaW5lIG9uIHdoaWNoIHRoZSBzdGF0ZSBzaG91bGQgYmUgaW5zdGFsbGVkLlxuICAgICAqIEB0eXBlIHtUaW1lbGluZX1cbiAgICAgKi9cbiAgICB0aGlzLnRpbWVsaW5lID0gdGltZWxpbmU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aW1lbGluZSB0cmFja3MgY29sbGVjdGlvbi5cbiAgICpcbiAgICogQHR5cGUge1RyYWNrQ29sbGVjdGlvbjxUcmFjaz59XG4gICAqL1xuICBnZXQgdHJhY2tzKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVsaW5lLnRyYWNrcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFsbCByZWdpc3RlcmVkIGxheWVycy5cbiAgICpcbiAgICogQHR5cGUge0FycmF5PExheWVyPn1cbiAgICovXG4gIGdldCBsYXllcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZWxpbmUudHJhY2tzLmxheWVycztcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgdGltZWxpbmUgaXMgZW50ZXJpbmcgdGhlIHN0YXRlLlxuICAgKi9cbiAgZW50ZXIoKSB7fVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgdGltZWxpbmUgaXMgbGVhdmluZyB0aGUgc3RhdGUuXG4gICAqL1xuICBleGl0KCkge31cblxuICAvKipcbiAgICogTWFpbiBpbnRlcmZhY2UgbWV0aG9kIHRvIG92ZXJyaWRlIHdoZW4gY3JlYXRpbmcgYSBuZXcgYFN0YXRlYC4gSGFuZGxlIGV2ZW50XG4gICAqIGZyb20gbW91c2Ugb3Iga2V5Ym9hcmQsIHNob3VsZCBkZWZpbmUgYmVoYXZpb3IgYWNjb3JkaW5nIHRvIHRoZSBldmVudFxuICAgKiAoYWthLiBtb3VzZWRvd24sIG1vdXNldXAsIC4uLikuXG4gICAqXG4gICAqIEBwYXJhbSB7V2F2ZUV2ZW50fSBlIC0gdGhlIGV2ZW50IHRvIHByb2Nlc3MuXG4gICAqIEBwYXJhbSB7QXJyYXl9IGhpdExheWVycyAtIHRoZSBsYXllcnMgaGl0IGJ5IHRoZSBtb3VzZSBldmVudCAoaWYgc3VyZmFjZVxuICAgKiBldmVudCkuXG4gICAqL1xuICBoYW5kbGVFdmVudChlLCBoaXRMYXllcnMpIHt9XG59XG4iXX0=