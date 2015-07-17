/**
* `State` instances are used to define the application logic by precising specific user interaction cases, and how they impact the overal temporal data representation.
* States manage interactions like zooming, browsing, or editing the timeline.
* Customized states should extend this BaseState.
*/
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var BaseState = (function () {
  function BaseState(timeline) {
    var options = arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, BaseState);

    this.timeline = timeline;
  }

  _createClass(BaseState, {
    views: {

      /**
       * Get timeline views
       */

      get: function () {
        return this.timeline.views;
      }
    },
    layers: {

      /**
       * Get timeline layers
       */

      get: function () {
        return this.timeline.views.layers;
      }
    },
    enter: {

      /**
       * Called when the timeline is entering the state
       */

      value: function enter() {}
    },
    exit: {

      /**
       * Called when the timeline is leaving the state
       */

      value: function exit() {}
    },
    handleEvent: {

      /**
       * handle registered inputs from mouse and keyboard
       * @param {Event} e - the event to process
       */

      value: function handleEvent(e) {}
    }
  });

  return BaseState;
})();

module.exports = BaseState;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3RpbWVsaW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBS3FCLFNBQVM7QUFDakIsV0FEUSxTQUFTLENBQ2hCLFFBQVEsRUFBZ0I7UUFBZCxPQUFPLGdDQUFHLEVBQUU7OzBCQURmLFNBQVM7O0FBRTFCLFFBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0dBQzFCOztlQUhrQixTQUFTO0FBUXhCLFNBQUs7Ozs7OztXQUFBLFlBQUc7QUFDVixlQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO09BQzVCOztBQUtHLFVBQU07Ozs7OztXQUFBLFlBQUc7QUFDWCxlQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztPQUNuQzs7QUFLRCxTQUFLOzs7Ozs7YUFBQSxpQkFBRyxFQUFFOztBQUtWLFFBQUk7Ozs7OzthQUFBLGdCQUFHLEVBQUU7O0FBTVQsZUFBVzs7Ozs7OzthQUFBLHFCQUFDLENBQUMsRUFBRSxFQUFFOzs7O1NBakNFLFNBQVM7OztpQkFBVCxTQUFTIiwiZmlsZSI6ImVzNi9jb3JlL3RpbWVsaW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4qIGBTdGF0ZWAgaW5zdGFuY2VzIGFyZSB1c2VkIHRvIGRlZmluZSB0aGUgYXBwbGljYXRpb24gbG9naWMgYnkgcHJlY2lzaW5nIHNwZWNpZmljIHVzZXIgaW50ZXJhY3Rpb24gY2FzZXMsIGFuZCBob3cgdGhleSBpbXBhY3QgdGhlIG92ZXJhbCB0ZW1wb3JhbCBkYXRhIHJlcHJlc2VudGF0aW9uLlxuKiBTdGF0ZXMgbWFuYWdlIGludGVyYWN0aW9ucyBsaWtlIHpvb21pbmcsIGJyb3dzaW5nLCBvciBlZGl0aW5nIHRoZSB0aW1lbGluZS5cbiogQ3VzdG9taXplZCBzdGF0ZXMgc2hvdWxkIGV4dGVuZCB0aGlzIEJhc2VTdGF0ZS5cbiovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlU3RhdGUge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy50aW1lbGluZSA9IHRpbWVsaW5lO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aW1lbGluZSB2aWV3c1xuICAgKi9cbiAgZ2V0IHZpZXdzKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVsaW5lLnZpZXdzO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aW1lbGluZSBsYXllcnNcbiAgICovXG4gIGdldCBsYXllcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZWxpbmUudmlld3MubGF5ZXJzO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSB0aW1lbGluZSBpcyBlbnRlcmluZyB0aGUgc3RhdGVcbiAgICovXG4gIGVudGVyKCkge31cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIHRpbWVsaW5lIGlzIGxlYXZpbmcgdGhlIHN0YXRlXG4gICAqL1xuICBleGl0KCkge31cblxuICAvKipcbiAgICogaGFuZGxlIHJlZ2lzdGVyZWQgaW5wdXRzIGZyb20gbW91c2UgYW5kIGtleWJvYXJkXG4gICAqIEBwYXJhbSB7RXZlbnR9IGUgLSB0aGUgZXZlbnQgdG8gcHJvY2Vzc1xuICAgKi9cbiAgaGFuZGxlRXZlbnQoZSkge31cbn1cbiJdfQ==