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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi90aW1lbGluZS1zdGF0ZXMvc2VsZWN0aW9uLXN0YXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztJQUNNLFNBQVM7QUFDRixXQURQLFNBQVMsQ0FDRCxRQUFRLEVBQUU7MEJBRGxCLFNBQVM7O0FBRVgsUUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7QUFDekIsUUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO0FBQzlCLFFBQUksQ0FBQyxpQkFBaUIsR0FBRyxRQUFRLENBQUMsaUJBQWlCLENBQUM7R0FDckQ7O2VBTEcsU0FBUztBQVViLFNBQUs7Ozs7OzthQUFBLGlCQUFHLEVBQUU7O0FBS1YsUUFBSTs7Ozs7O2FBQUEsZ0JBQUcsRUFBRTs7QUFNVCxlQUFXOzs7Ozs7O2FBQUEscUJBQUMsQ0FBQyxFQUFFLEVBQUU7Ozs7U0FyQmIsU0FBUzs7O0FBd0JmLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDIiwiZmlsZSI6ImVzNi90aW1lbGluZS1zdGF0ZXMvc2VsZWN0aW9uLXN0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5jbGFzcyBCYXNlU3RhdGUge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSkge1xuICAgIHRoaXMudGltZWxpbmUgPSB0aW1lbGluZTtcbiAgICB0aGlzLmxheWVycyA9IHRpbWVsaW5lLmxheWVycztcbiAgICB0aGlzLmludGVyYWN0aW9uc0dyb3VwID0gdGltZWxpbmUuaW50ZXJhY3Rpb25zR3JvdXA7XG4gIH1cblxuICAvKipcbiAgICogIENhbGxlZCB3aGVuIHRoZSB0aW1lbGluZSBpcyBlbnRlcmluZyB0aGUgc3RhdGVcbiAgICovXG4gIGVudGVyKCkge31cblxuICAvKipcbiAgICogIENhbGxlZCB3aGVuIHRoZSB0aW1lbGluZSBpcyBleGl0aW5nIHRoZSBzdGF0ZVxuICAgKi9cbiAgZXhpdCgpIHt9XG5cbiAgLyoqXG4gICAqICBoYW5kbGUgcmVnaXN0ZXJlZCBpbnB1dHMgZnJvbSBzdXJmYWNlLCBrZXlib2FyZCwgZXRjLi4uXG4gICAqICBAcGFyYW0ge0V2ZW50fSB0aGUgZXZlbnQgdG8gcHJvY2Vzc1xuICAgKi9cbiAgaGFuZGxlRXZlbnQoZSkge31cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCYXNlU3RhdGU7Il19