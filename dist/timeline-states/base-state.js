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
    tracks: {

      /**
       * Get timeline views
       */

      get: function () {
        return this.timeline.tracks;
      }
    },
    layers: {

      /**
       * Get timeline layers
       */

      get: function () {
        return this.timeline.tracks.layers;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi90aW1lbGluZS1zdGF0ZXMvYmFzZS1zdGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQUtxQixTQUFTO0FBQ2pCLFdBRFEsU0FBUyxDQUNoQixRQUFRLEVBQWdCO1FBQWQsT0FBTyxnQ0FBRyxFQUFFOzswQkFEZixTQUFTOztBQUUxQixRQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztHQUMxQjs7ZUFIa0IsU0FBUztBQVF4QixVQUFNOzs7Ozs7V0FBQSxZQUFHO0FBQ1gsZUFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztPQUM3Qjs7QUFLRyxVQUFNOzs7Ozs7V0FBQSxZQUFHO0FBQ1gsZUFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7T0FDcEM7O0FBS0QsU0FBSzs7Ozs7O2FBQUEsaUJBQUcsRUFBRTs7QUFLVixRQUFJOzs7Ozs7YUFBQSxnQkFBRyxFQUFFOztBQU1ULGVBQVc7Ozs7Ozs7YUFBQSxxQkFBQyxDQUFDLEVBQUUsRUFBRTs7OztTQWpDRSxTQUFTOzs7aUJBQVQsU0FBUyIsImZpbGUiOiJlczYvdGltZWxpbmUtc3RhdGVzL2Jhc2Utc3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiogYFN0YXRlYCBpbnN0YW5jZXMgYXJlIHVzZWQgdG8gZGVmaW5lIHRoZSBhcHBsaWNhdGlvbiBsb2dpYyBieSBwcmVjaXNpbmcgc3BlY2lmaWMgdXNlciBpbnRlcmFjdGlvbiBjYXNlcywgYW5kIGhvdyB0aGV5IGltcGFjdCB0aGUgb3ZlcmFsIHRlbXBvcmFsIGRhdGEgcmVwcmVzZW50YXRpb24uXG4qIFN0YXRlcyBtYW5hZ2UgaW50ZXJhY3Rpb25zIGxpa2Ugem9vbWluZywgYnJvd3NpbmcsIG9yIGVkaXRpbmcgdGhlIHRpbWVsaW5lLlxuKiBDdXN0b21pemVkIHN0YXRlcyBzaG91bGQgZXh0ZW5kIHRoaXMgQmFzZVN0YXRlLlxuKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLnRpbWVsaW5lID0gdGltZWxpbmU7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRpbWVsaW5lIHZpZXdzXG4gICAqL1xuICBnZXQgdHJhY2tzKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVsaW5lLnRyYWNrcztcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGltZWxpbmUgbGF5ZXJzXG4gICAqL1xuICBnZXQgbGF5ZXJzKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVsaW5lLnRyYWNrcy5sYXllcnM7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIHRpbWVsaW5lIGlzIGVudGVyaW5nIHRoZSBzdGF0ZVxuICAgKi9cbiAgZW50ZXIoKSB7fVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgdGltZWxpbmUgaXMgbGVhdmluZyB0aGUgc3RhdGVcbiAgICovXG4gIGV4aXQoKSB7fVxuXG4gIC8qKlxuICAgKiBoYW5kbGUgcmVnaXN0ZXJlZCBpbnB1dHMgZnJvbSBtb3VzZSBhbmQga2V5Ym9hcmRcbiAgICogQHBhcmFtIHtFdmVudH0gZSAtIHRoZSBldmVudCB0byBwcm9jZXNzXG4gICAqL1xuICBoYW5kbGVFdmVudChlKSB7fVxufVxuIl19