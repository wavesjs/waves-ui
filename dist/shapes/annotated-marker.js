"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var Marker = require("./marker");

var AnnotatedMarker = (function (_Marker) {
  function AnnotatedMarker() {
    _classCallCheck(this, AnnotatedMarker);

    if (_Marker != null) {
      _Marker.apply(this, arguments);
    }
  }

  _inherits(AnnotatedMarker, _Marker);

  _createClass(AnnotatedMarker, {
    _getAccessorList: {
      value: function _getAccessorList() {
        var list = _get(_core.Object.getPrototypeOf(AnnotatedMarker.prototype), "_getAccessorList", this).call(this);
        list.text = "default";
        return list;
      }
    },
    render: {
      value: function render(context) {
        this.shape = _get(_core.Object.getPrototypeOf(AnnotatedMarker.prototype), "render", this).call(this, context);
        var height = context.params.height;

        this.label = document.createElementNS(this.ns, "text");
        this.label.setAttributeNS(null, "x", 10);
        this.label.setAttributeNS(null, "y", 10);
        this.label.setAttributeNS(null, "transform", "matrix(1, 0, 0, -1, 0, " + height + ")");
        this.label.style.fontSize = "10px";
        this.label.style.fontFamily = "monospace";
        this.label.style.color = "#676767";

        this.shape.appendChild(this.label);

        return this.shape;
      }
    },
    update: {
      value: function update(context, group, datum, index) {
        _get(_core.Object.getPrototypeOf(AnnotatedMarker.prototype), "update", this).call(this, context, group, datum, index);

        this.label.innerHTML = this.text(datum);
      }
    }
  });

  return AnnotatedMarker;
})(Marker);

module.exports = AnnotatedMarker;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaGFwZXMvYW5ub3RhdGVkLW1hcmtlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7O0lBRTdCLGVBQWU7V0FBZixlQUFlOzBCQUFmLGVBQWU7Ozs7Ozs7WUFBZixlQUFlOztlQUFmLGVBQWU7QUFDbkIsb0JBQWdCO2FBQUEsNEJBQUc7QUFDakIsWUFBSSxJQUFJLG9DQUZOLGVBQWUsaURBRWtCLENBQUM7QUFDcEMsWUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7QUFDdEIsZUFBTyxJQUFJLENBQUM7T0FDYjs7QUFFRCxVQUFNO2FBQUEsZ0JBQUMsT0FBTyxFQUFFO0FBQ2QsWUFBSSxDQUFDLEtBQUssb0NBUlIsZUFBZSx3Q0FRUyxPQUFPLENBQUMsQ0FBQztBQUNuQyxZQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQzs7QUFFckMsWUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDdkQsWUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN6QyxZQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3pDLFlBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxXQUFXLDhCQUE0QixNQUFNLE9BQUksQ0FBQztBQUNsRixZQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDO0FBQ25DLFlBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxXQUFXLENBQUM7QUFDMUMsWUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQzs7QUFFbkMsWUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVuQyxlQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7T0FDbkI7O0FBRUQsVUFBTTthQUFBLGdCQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtBQUNuQyx5Q0F6QkUsZUFBZSx3Q0F5QkosT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFOztBQUUzQyxZQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQ3pDOzs7O1NBNUJHLGVBQWU7R0FBUyxNQUFNOztBQStCcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxlQUFlLENBQUMiLCJmaWxlIjoiZXM2L3NoYXBlcy9hbm5vdGF0ZWQtbWFya2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgTWFya2VyID0gcmVxdWlyZSgnLi9tYXJrZXInKTtcblxuY2xhc3MgQW5ub3RhdGVkTWFya2VyIGV4dGVuZHMgTWFya2VyIHtcbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICBsZXQgbGlzdCA9IHN1cGVyLl9nZXRBY2Nlc3Nvckxpc3QoKTtcbiAgICBsaXN0LnRleHQgPSAnZGVmYXVsdCc7XG4gICAgcmV0dXJuIGxpc3Q7XG4gIH1cblxuICByZW5kZXIoY29udGV4dCkge1xuICAgIHRoaXMuc2hhcGUgPSBzdXBlci5yZW5kZXIoY29udGV4dCk7XG4gICAgY29uc3QgaGVpZ2h0ID0gY29udGV4dC5wYXJhbXMuaGVpZ2h0O1xuXG4gICAgdGhpcy5sYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAndGV4dCcpO1xuICAgIHRoaXMubGFiZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3gnLCAxMCk7XG4gICAgdGhpcy5sYWJlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneScsIDEwKTtcbiAgICB0aGlzLmxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgbWF0cml4KDEsIDAsIDAsIC0xLCAwLCAke2hlaWdodH0pYCk7XG4gICAgdGhpcy5sYWJlbC5zdHlsZS5mb250U2l6ZSA9ICcxMHB4JztcbiAgICB0aGlzLmxhYmVsLnN0eWxlLmZvbnRGYW1pbHkgPSAnbW9ub3NwYWNlJztcbiAgICB0aGlzLmxhYmVsLnN0eWxlLmNvbG9yID0gJyM2NzY3NjcnO1xuXG4gICAgdGhpcy5zaGFwZS5hcHBlbmRDaGlsZCh0aGlzLmxhYmVsKTtcblxuICAgIHJldHVybiB0aGlzLnNoYXBlO1xuICB9XG5cbiAgdXBkYXRlKGNvbnRleHQsIGdyb3VwLCBkYXR1bSwgaW5kZXgpIHtcbiAgICBzdXBlci51cGRhdGUoY29udGV4dCwgZ3JvdXAsIGRhdHVtLCBpbmRleCk7XG5cbiAgICB0aGlzLmxhYmVsLmlubmVySFRNTCA9IHRoaXMudGV4dChkYXR1bSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBbm5vdGF0ZWRNYXJrZXI7Il19