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
      get: function () {
        return this.timeline.views;
      }
    },
    layers: {
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
       * Called when the timeline is exiting the state
       */

      value: function exit() {}
    },
    handleEvent: {

      /**
       * handle registered inputs from surface, keyboard, etc...
       * @param {Event} e - the event to process
       */

      value: function handleEvent(e) {}
    }
  });

  return BaseState;
})();

module.exports = BaseState;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi90aW1lbGluZS1zdGF0ZXMvYmFzZS1zdGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7SUFBcUIsU0FBUztBQUNqQixXQURRLFNBQVMsQ0FDaEIsUUFBUSxFQUFnQjtRQUFkLE9BQU8sZ0NBQUcsRUFBRTs7MEJBRGYsU0FBUzs7QUFFMUIsUUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7R0FDMUI7O2VBSGtCLFNBQVM7QUFLeEIsU0FBSztXQUFBLFlBQUc7QUFDVixlQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO09BQzVCOztBQUVHLFVBQU07V0FBQSxZQUFHO0FBQ1gsZUFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7T0FDbkM7O0FBS0QsU0FBSzs7Ozs7O2FBQUEsaUJBQUcsRUFBRTs7QUFLVixRQUFJOzs7Ozs7YUFBQSxnQkFBRyxFQUFFOztBQU1ULGVBQVc7Ozs7Ozs7YUFBQSxxQkFBQyxDQUFDLEVBQUUsRUFBRTs7OztTQTNCRSxTQUFTOzs7aUJBQVQsU0FBUyIsImZpbGUiOiJlczYvdGltZWxpbmUtc3RhdGVzL2Jhc2Utc3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlU3RhdGUge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy50aW1lbGluZSA9IHRpbWVsaW5lO1xuICB9XG5cbiAgZ2V0IHZpZXdzKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVsaW5lLnZpZXdzO1xuICB9XG5cbiAgZ2V0IGxheWVycygpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lbGluZS52aWV3cy5sYXllcnM7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIHRpbWVsaW5lIGlzIGVudGVyaW5nIHRoZSBzdGF0ZVxuICAgKi9cbiAgZW50ZXIoKSB7fVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgdGltZWxpbmUgaXMgZXhpdGluZyB0aGUgc3RhdGVcbiAgICovXG4gIGV4aXQoKSB7fVxuXG4gIC8qKlxuICAgKiBoYW5kbGUgcmVnaXN0ZXJlZCBpbnB1dHMgZnJvbSBzdXJmYWNlLCBrZXlib2FyZCwgZXRjLi4uXG4gICAqIEBwYXJhbSB7RXZlbnR9IGUgLSB0aGUgZXZlbnQgdG8gcHJvY2Vzc1xuICAgKi9cbiAgaGFuZGxlRXZlbnQoZSkge31cbn1cbiJdfQ==