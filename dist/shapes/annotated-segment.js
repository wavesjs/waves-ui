"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var Segment = _interopRequire(require("./segment"));

var AnnotatedSegment = (function (_Segment) {
  function AnnotatedSegment() {
    _classCallCheck(this, AnnotatedSegment);

    if (_Segment != null) {
      _Segment.apply(this, arguments);
    }
  }

  _inherits(AnnotatedSegment, _Segment);

  _createClass(AnnotatedSegment, {
    getClassName: {
      value: function getClassName() {
        return "annotated-segment";
      }
    },
    _getAccessorList: {
      value: function _getAccessorList() {
        var list = _get(_core.Object.getPrototypeOf(AnnotatedSegment.prototype), "_getAccessorList", this).call(this);
        list.text = "default";
        return list;
      }
    },
    render: {
      value: function render(renderingContext) {
        this.$el = _get(_core.Object.getPrototypeOf(AnnotatedSegment.prototype), "render", this).call(this, renderingContext);
        var height = renderingContext.height;

        this.$label = document.createElementNS(this.ns, "text");
        this.$label.setAttributeNS(null, "x", 1);
        this.$label.setAttributeNS(null, "y", 11);
        this.$label.setAttributeNS(null, "transform", "matrix(1, 0, 0, -1, 0, " + height + ")");
        this.$label.style.fontSize = "10px";
        this.$label.style.fontFamily = "monospace";
        this.$label.style.color = "#676767";
        this.$label.style.mozUserSelect = "none";
        this.$label.style.webkitUserSelect = "none";
        this.$label.style.userSelect = "none";

        this.$el.appendChild(this.$label);

        return this.$el;
      }
    },
    update: {
      value: function update(renderingContext, datum, index) {
        _get(_core.Object.getPrototypeOf(AnnotatedSegment.prototype), "update", this).call(this, renderingContext, datum, index);

        this.$label.innerHTML = this.text(datum);
      }
    }
  });

  return AnnotatedSegment;
})(Segment);

module.exports = AnnotatedSegment;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUFBTyxPQUFPLDJCQUFNLFdBQVc7O0lBR1YsZ0JBQWdCO1dBQWhCLGdCQUFnQjswQkFBaEIsZ0JBQWdCOzs7Ozs7O1lBQWhCLGdCQUFnQjs7ZUFBaEIsZ0JBQWdCO0FBQ25DLGdCQUFZO2FBQUEsd0JBQUc7QUFBRSxlQUFPLG1CQUFtQixDQUFDO09BQUU7O0FBRTlDLG9CQUFnQjthQUFBLDRCQUFHO0FBQ2pCLFlBQUksSUFBSSxvQ0FKUyxnQkFBZ0IsaURBSUUsQ0FBQztBQUNwQyxZQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztBQUN0QixlQUFPLElBQUksQ0FBQztPQUNiOztBQUVELFVBQU07YUFBQSxnQkFBQyxnQkFBZ0IsRUFBRTtBQUN2QixZQUFJLENBQUMsR0FBRyxvQ0FWUyxnQkFBZ0Isd0NBVVQsZ0JBQWdCLENBQUMsQ0FBQztBQUMxQyxZQUFNLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUM7O0FBRXZDLFlBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3hELFlBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDekMsWUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUMxQyxZQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsV0FBVyw4QkFBNEIsTUFBTSxPQUFJLENBQUM7QUFDbkYsWUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQztBQUNwQyxZQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDO0FBQzNDLFlBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7QUFDcEMsWUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQztBQUN6QyxZQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLENBQUM7QUFDNUMsWUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQzs7QUFFdEMsWUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUVsQyxlQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7T0FDakI7O0FBRUQsVUFBTTthQUFBLGdCQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDckMseUNBOUJpQixnQkFBZ0Isd0NBOEJwQixnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFOztBQUU3QyxZQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQzFDOzs7O1NBakNrQixnQkFBZ0I7R0FBUyxPQUFPOztpQkFBaEMsZ0JBQWdCIiwiZmlsZSI6ImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VnbWVudCBmcm9tICcuL3NlZ21lbnQnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFubm90YXRlZFNlZ21lbnQgZXh0ZW5kcyBTZWdtZW50IHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ2Fubm90YXRlZC1zZWdtZW50JzsgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgbGV0IGxpc3QgPSBzdXBlci5fZ2V0QWNjZXNzb3JMaXN0KCk7XG4gICAgbGlzdC50ZXh0ID0gJ2RlZmF1bHQnO1xuICAgIHJldHVybiBsaXN0O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICB0aGlzLiRlbCA9IHN1cGVyLnJlbmRlcihyZW5kZXJpbmdDb250ZXh0KTtcbiAgICBjb25zdCBoZWlnaHQgPSByZW5kZXJpbmdDb250ZXh0LmhlaWdodDtcblxuICAgIHRoaXMuJGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICd0ZXh0Jyk7XG4gICAgdGhpcy4kbGFiZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3gnLCAxKTtcbiAgICB0aGlzLiRsYWJlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneScsIDExKTtcbiAgICB0aGlzLiRsYWJlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYG1hdHJpeCgxLCAwLCAwLCAtMSwgMCwgJHtoZWlnaHR9KWApO1xuICAgIHRoaXMuJGxhYmVsLnN0eWxlLmZvbnRTaXplID0gJzEwcHgnO1xuICAgIHRoaXMuJGxhYmVsLnN0eWxlLmZvbnRGYW1pbHkgPSAnbW9ub3NwYWNlJztcbiAgICB0aGlzLiRsYWJlbC5zdHlsZS5jb2xvciA9ICcjNjc2NzY3JztcbiAgICB0aGlzLiRsYWJlbC5zdHlsZS5tb3pVc2VyU2VsZWN0ID0gJ25vbmUnO1xuICAgIHRoaXMuJGxhYmVsLnN0eWxlLndlYmtpdFVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgdGhpcy4kbGFiZWwuc3R5bGUudXNlclNlbGVjdCA9ICdub25lJztcblxuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJGxhYmVsKTtcblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSwgaW5kZXgpIHtcbiAgICBzdXBlci51cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0sIGluZGV4KTtcblxuICAgIHRoaXMuJGxhYmVsLmlubmVySFRNTCA9IHRoaXMudGV4dChkYXR1bSk7XG4gIH1cbn1cbiJdfQ==