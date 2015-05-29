"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var BaseState = (function () {
  function BaseState(timeline) {
    var options = arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, BaseState);

    this.timeline = timeline;
    this.layers = timeline.layers;
    // this.interactionsGroup = options.interactionsGroup;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi90aW1lbGluZS1zdGF0ZXMvYmFzZS1zdGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7SUFDTSxTQUFTO0FBQ0YsV0FEUCxTQUFTLENBQ0QsUUFBUSxFQUFnQjtRQUFkLE9BQU8sZ0NBQUcsRUFBRTs7MEJBRDlCLFNBQVM7O0FBRVgsUUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7QUFDekIsUUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDOztHQUUvQjs7ZUFMRyxTQUFTO0FBVWIsU0FBSzs7Ozs7O2FBQUEsaUJBQUcsRUFBRTs7QUFLVixRQUFJOzs7Ozs7YUFBQSxnQkFBRyxFQUFFOztBQU1ULGVBQVc7Ozs7Ozs7YUFBQSxxQkFBQyxDQUFDLEVBQUUsRUFBRTs7OztTQXJCYixTQUFTOzs7QUF3QmYsTUFBTSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMiLCJmaWxlIjoiZXM2L3RpbWVsaW5lLXN0YXRlcy9iYXNlLXN0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5jbGFzcyBCYXNlU3RhdGUge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy50aW1lbGluZSA9IHRpbWVsaW5lO1xuICAgIHRoaXMubGF5ZXJzID0gdGltZWxpbmUubGF5ZXJzO1xuICAgIC8vIHRoaXMuaW50ZXJhY3Rpb25zR3JvdXAgPSBvcHRpb25zLmludGVyYWN0aW9uc0dyb3VwO1xuICB9XG5cbiAgLyoqXG4gICAqICBDYWxsZWQgd2hlbiB0aGUgdGltZWxpbmUgaXMgZW50ZXJpbmcgdGhlIHN0YXRlXG4gICAqL1xuICBlbnRlcigpIHt9XG5cbiAgLyoqXG4gICAqICBDYWxsZWQgd2hlbiB0aGUgdGltZWxpbmUgaXMgZXhpdGluZyB0aGUgc3RhdGVcbiAgICovXG4gIGV4aXQoKSB7fVxuXG4gIC8qKlxuICAgKiAgaGFuZGxlIHJlZ2lzdGVyZWQgaW5wdXRzIGZyb20gc3VyZmFjZSwga2V5Ym9hcmQsIGV0Yy4uLlxuICAgKiAgQHBhcmFtIHtFdmVudH0gdGhlIGV2ZW50IHRvIHByb2Nlc3NcbiAgICovXG4gIGhhbmRsZUV2ZW50KGUpIHt9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZVN0YXRlOyJdfQ==