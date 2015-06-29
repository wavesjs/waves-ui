"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var Segment = require("./segment");

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
        this.shape = _get(_core.Object.getPrototypeOf(AnnotatedSegment.prototype), "render", this).call(this, renderingContext);
        var height = renderingContext.height;

        this.label = document.createElementNS(this.ns, "text");
        this.label.setAttributeNS(null, "x", 1);
        this.label.setAttributeNS(null, "y", 11);
        this.label.setAttributeNS(null, "transform", "matrix(1, 0, 0, -1, 0, " + height + ")");
        this.label.style.fontSize = "10px";
        this.label.style.fontFamily = "monospace";
        this.label.style.color = "#676767";
        this.label.style.mozUserSelect = "none";
        this.label.style.webkitUserSelect = "none";
        this.label.style.userSelect = "none";

        this.shape.appendChild(this.label);

        return this.shape;
      }
    },
    update: {
      value: function update(renderingContext, group, datum, index) {
        _get(_core.Object.getPrototypeOf(AnnotatedSegment.prototype), "update", this).call(this, renderingContext, group, datum, index);

        this.label.innerHTML = this.text(datum);
      }
    }
  });

  return AnnotatedSegment;
})(Segment);

module.exports = AnnotatedSegment;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaGFwZXMvYW5ub3RhdGVkLXNlZ21lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDOztJQUUvQixnQkFBZ0I7V0FBaEIsZ0JBQWdCOzBCQUFoQixnQkFBZ0I7Ozs7Ozs7WUFBaEIsZ0JBQWdCOztlQUFoQixnQkFBZ0I7QUFDcEIsZ0JBQVk7YUFBQSx3QkFBRztBQUFFLGVBQU8sbUJBQW1CLENBQUM7T0FBRTs7QUFFOUMsb0JBQWdCO2FBQUEsNEJBQUc7QUFDakIsWUFBSSxJQUFJLG9DQUpOLGdCQUFnQixpREFJaUIsQ0FBQztBQUNwQyxZQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztBQUN0QixlQUFPLElBQUksQ0FBQztPQUNiOztBQUVELFVBQU07YUFBQSxnQkFBQyxnQkFBZ0IsRUFBRTtBQUN2QixZQUFJLENBQUMsS0FBSyxvQ0FWUixnQkFBZ0Isd0NBVVEsZ0JBQWdCLENBQUMsQ0FBQztBQUM1QyxZQUFNLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUM7O0FBRXZDLFlBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3ZELFlBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDeEMsWUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN6QyxZQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsV0FBVyw4QkFBNEIsTUFBTSxPQUFJLENBQUM7QUFDbEYsWUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQztBQUNuQyxZQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDO0FBQzFDLFlBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7QUFDbkMsWUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQztBQUN4QyxZQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLENBQUM7QUFDM0MsWUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQzs7QUFFckMsWUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVuQyxlQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7T0FDbkI7O0FBRUQsVUFBTTthQUFBLGdCQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQzVDLHlDQTlCRSxnQkFBZ0Isd0NBOEJMLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFOztBQUVwRCxZQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQ3pDOzs7O1NBakNHLGdCQUFnQjtHQUFTLE9BQU87O0FBb0N0QyxNQUFNLENBQUMsT0FBTyxHQUFHLGdCQUFnQixDQUFDIiwiZmlsZSI6ImVzNi9zaGFwZXMvYW5ub3RhdGVkLXNlZ21lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBTZWdtZW50ID0gcmVxdWlyZSgnLi9zZWdtZW50Jyk7XG5cbmNsYXNzIEFubm90YXRlZFNlZ21lbnQgZXh0ZW5kcyBTZWdtZW50IHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ2Fubm90YXRlZC1zZWdtZW50JzsgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgbGV0IGxpc3QgPSBzdXBlci5fZ2V0QWNjZXNzb3JMaXN0KCk7XG4gICAgbGlzdC50ZXh0ID0gJ2RlZmF1bHQnO1xuICAgIHJldHVybiBsaXN0O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICB0aGlzLnNoYXBlID0gc3VwZXIucmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpO1xuICAgIGNvbnN0IGhlaWdodCA9IHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0O1xuXG4gICAgdGhpcy5sYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAndGV4dCcpO1xuICAgIHRoaXMubGFiZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3gnLCAxKTtcbiAgICB0aGlzLmxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5JywgMTEpO1xuICAgIHRoaXMubGFiZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGBtYXRyaXgoMSwgMCwgMCwgLTEsIDAsICR7aGVpZ2h0fSlgKTtcbiAgICB0aGlzLmxhYmVsLnN0eWxlLmZvbnRTaXplID0gJzEwcHgnO1xuICAgIHRoaXMubGFiZWwuc3R5bGUuZm9udEZhbWlseSA9ICdtb25vc3BhY2UnO1xuICAgIHRoaXMubGFiZWwuc3R5bGUuY29sb3IgPSAnIzY3Njc2Nyc7XG4gICAgdGhpcy5sYWJlbC5zdHlsZS5tb3pVc2VyU2VsZWN0ID0gJ25vbmUnO1xuICAgIHRoaXMubGFiZWwuc3R5bGUud2Via2l0VXNlclNlbGVjdCA9ICdub25lJztcbiAgICB0aGlzLmxhYmVsLnN0eWxlLnVzZXJTZWxlY3QgPSAnbm9uZSc7XG5cbiAgICB0aGlzLnNoYXBlLmFwcGVuZENoaWxkKHRoaXMubGFiZWwpO1xuXG4gICAgcmV0dXJuIHRoaXMuc2hhcGU7XG4gIH1cblxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZ3JvdXAsIGRhdHVtLCBpbmRleCkge1xuICAgIHN1cGVyLnVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBncm91cCwgZGF0dW0sIGluZGV4KTtcblxuICAgIHRoaXMubGFiZWwuaW5uZXJIVE1MID0gdGhpcy50ZXh0KGRhdHVtKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEFubm90YXRlZFNlZ21lbnQ7Il19