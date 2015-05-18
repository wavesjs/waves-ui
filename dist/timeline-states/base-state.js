"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var BaseState = (function () {
  function BaseState(timeline) {
    _classCallCheck(this, BaseState);

    this.timeline = timeline;
    this.layers = timeline.layers;
    this.interactionsGroup = timeline.interactionsGroup;
  }

  _createClass(BaseState, {
    enter: {

      /**
       *  Called when the timeline is entering the state
       */

      value: function enter() {}
    },
    exit: {

      /**
       *  Called when the timeline is exiting the state
       */

      value: function exit() {}
    },
    handleEvent: {

      /**
       *  handle registered inputs from surface, keyboard, etc...
       *  @param {Event} the event to process
       */

      value: function handleEvent(e) {}
    }
  });

  return BaseState;
})();

module.exports = BaseState;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi90aW1lbGluZS1zdGF0ZXMvYmFzZS1zdGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7SUFDTSxTQUFTO0FBQ0YsV0FEUCxTQUFTLENBQ0QsUUFBUSxFQUFFOzBCQURsQixTQUFTOztBQUVYLFFBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztBQUM5QixRQUFJLENBQUMsaUJBQWlCLEdBQUcsUUFBUSxDQUFDLGlCQUFpQixDQUFDO0dBQ3JEOztlQUxHLFNBQVM7QUFVYixTQUFLOzs7Ozs7YUFBQSxpQkFBRyxFQUFFOztBQUtWLFFBQUk7Ozs7OzthQUFBLGdCQUFHLEVBQUU7O0FBTVQsZUFBVzs7Ozs7OzthQUFBLHFCQUFDLENBQUMsRUFBRSxFQUFFOzs7O1NBckJiLFNBQVM7OztBQXdCZixNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQyIsImZpbGUiOiJlczYvdGltZWxpbmUtc3RhdGVzL2Jhc2Utc3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmNsYXNzIEJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lKSB7XG4gICAgdGhpcy50aW1lbGluZSA9IHRpbWVsaW5lO1xuICAgIHRoaXMubGF5ZXJzID0gdGltZWxpbmUubGF5ZXJzO1xuICAgIHRoaXMuaW50ZXJhY3Rpb25zR3JvdXAgPSB0aW1lbGluZS5pbnRlcmFjdGlvbnNHcm91cDtcbiAgfVxuXG4gIC8qKlxuICAgKiAgQ2FsbGVkIHdoZW4gdGhlIHRpbWVsaW5lIGlzIGVudGVyaW5nIHRoZSBzdGF0ZVxuICAgKi9cbiAgZW50ZXIoKSB7fVxuXG4gIC8qKlxuICAgKiAgQ2FsbGVkIHdoZW4gdGhlIHRpbWVsaW5lIGlzIGV4aXRpbmcgdGhlIHN0YXRlXG4gICAqL1xuICBleGl0KCkge31cblxuICAvKipcbiAgICogIGhhbmRsZSByZWdpc3RlcmVkIGlucHV0cyBmcm9tIHN1cmZhY2UsIGtleWJvYXJkLCBldGMuLi5cbiAgICogIEBwYXJhbSB7RXZlbnR9IHRoZSBldmVudCB0byBwcm9jZXNzXG4gICAqL1xuICBoYW5kbGVFdmVudChlKSB7fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2VTdGF0ZTsiXX0=