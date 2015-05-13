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
        var height = context.height;

        this.label = document.createElementNS(this.ns, "text");
        this.label.setAttributeNS(null, "x", 10);
        this.label.setAttributeNS(null, "y", 10);
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
      value: function update(context, group, datum, index) {
        _get(_core.Object.getPrototypeOf(AnnotatedMarker.prototype), "update", this).call(this, context, group, datum, index);

        this.label.innerHTML = this.text(datum);
      }
    }
  });

  return AnnotatedMarker;
})(Marker);

module.exports = AnnotatedMarker;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaGFwZXMvYW5ub3RhdGVkLW1hcmtlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7O0lBRTdCLGVBQWU7V0FBZixlQUFlOzBCQUFmLGVBQWU7Ozs7Ozs7WUFBZixlQUFlOztlQUFmLGVBQWU7QUFDbkIsb0JBQWdCO2FBQUEsNEJBQUc7QUFDakIsWUFBSSxJQUFJLG9DQUZOLGVBQWUsaURBRWtCLENBQUM7QUFDcEMsWUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7QUFDdEIsZUFBTyxJQUFJLENBQUM7T0FDYjs7QUFFRCxVQUFNO2FBQUEsZ0JBQUMsT0FBTyxFQUFFO0FBQ2QsWUFBSSxDQUFDLEtBQUssb0NBUlIsZUFBZSx3Q0FRUyxPQUFPLENBQUMsQ0FBQztBQUNuQyxZQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDOztBQUU5QixZQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN2RCxZQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3pDLFlBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDekMsWUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFdBQVcsOEJBQTRCLE1BQU0sT0FBSSxDQUFDO0FBQ2xGLFlBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUM7QUFDbkMsWUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLFdBQVcsQ0FBQztBQUMxQyxZQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDO0FBQ25DLFlBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUM7QUFDeEMsWUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEdBQUcsTUFBTSxDQUFDO0FBQzNDLFlBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUM7O0FBRXJDLFlBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFbkMsZUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDO09BQ25COztBQUVELFVBQU07YUFBQSxnQkFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDbkMseUNBNUJFLGVBQWUsd0NBNEJKLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTs7QUFFM0MsWUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUN6Qzs7OztTQS9CRyxlQUFlO0dBQVMsTUFBTTs7QUFrQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsZUFBZSxDQUFDIiwiZmlsZSI6ImVzNi9zaGFwZXMvYW5ub3RhdGVkLW1hcmtlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IE1hcmtlciA9IHJlcXVpcmUoJy4vbWFya2VyJyk7XG5cbmNsYXNzIEFubm90YXRlZE1hcmtlciBleHRlbmRzIE1hcmtlciB7XG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgbGV0IGxpc3QgPSBzdXBlci5fZ2V0QWNjZXNzb3JMaXN0KCk7XG4gICAgbGlzdC50ZXh0ID0gJ2RlZmF1bHQnO1xuICAgIHJldHVybiBsaXN0O1xuICB9XG5cbiAgcmVuZGVyKGNvbnRleHQpIHtcbiAgICB0aGlzLnNoYXBlID0gc3VwZXIucmVuZGVyKGNvbnRleHQpO1xuICAgIGNvbnN0IGhlaWdodCA9IGNvbnRleHQuaGVpZ2h0O1xuXG4gICAgdGhpcy5sYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAndGV4dCcpO1xuICAgIHRoaXMubGFiZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3gnLCAxMCk7XG4gICAgdGhpcy5sYWJlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneScsIDEwKTtcbiAgICB0aGlzLmxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgbWF0cml4KDEsIDAsIDAsIC0xLCAwLCAke2hlaWdodH0pYCk7XG4gICAgdGhpcy5sYWJlbC5zdHlsZS5mb250U2l6ZSA9ICcxMHB4JztcbiAgICB0aGlzLmxhYmVsLnN0eWxlLmZvbnRGYW1pbHkgPSAnbW9ub3NwYWNlJztcbiAgICB0aGlzLmxhYmVsLnN0eWxlLmNvbG9yID0gJyM2NzY3NjcnO1xuICAgIHRoaXMubGFiZWwuc3R5bGUubW96VXNlclNlbGVjdCA9ICdub25lJztcbiAgICB0aGlzLmxhYmVsLnN0eWxlLndlYmtpdFVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgdGhpcy5sYWJlbC5zdHlsZS51c2VyU2VsZWN0ID0gJ25vbmUnO1xuXG4gICAgdGhpcy5zaGFwZS5hcHBlbmRDaGlsZCh0aGlzLmxhYmVsKTtcblxuICAgIHJldHVybiB0aGlzLnNoYXBlO1xuICB9XG5cbiAgdXBkYXRlKGNvbnRleHQsIGdyb3VwLCBkYXR1bSwgaW5kZXgpIHtcbiAgICBzdXBlci51cGRhdGUoY29udGV4dCwgZ3JvdXAsIGRhdHVtLCBpbmRleCk7XG5cbiAgICB0aGlzLmxhYmVsLmlubmVySFRNTCA9IHRoaXMudGV4dChkYXR1bSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBbm5vdGF0ZWRNYXJrZXI7Il19