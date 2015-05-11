"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var BaseShape = require("./base-shape");

var Marker = (function (_BaseShape) {
  function Marker() {
    _classCallCheck(this, Marker);

    if (_BaseShape != null) {
      _BaseShape.apply(this, arguments);
    }
  }

  _inherits(Marker, _BaseShape);

  _createClass(Marker, {
    _getAccessorList: {
      value: function _getAccessorList() {
        return { x: 0, color: "#000000" };
      }
    },
    _getDefaults: {
      value: function _getDefaults() {
        return {};
      }
    },
    render: {
      value: function render(context) {
        if (this.shape) {
          return this.shape;
        }

        var height = context.params.height;

        this.shape = document.createElementNS(this.ns, "g");
        this.line = document.createElementNS(this.ns, "line");
        this.handler = document.createElementNS(this.ns, "rect");

        // draw line
        this.line.setAttribute("x", 0);
        this.line.setAttribute("y1", 0);
        this.line.setAttribute("y2", height);

        this.shape.appendChild(this.line);
        this.shape.appendChild(this.handler);

        return this.shape;
      }
    },
    update: {
      value: function update(context, group, datum, index) {
        var x = context.xScale(this.x(datum));
        var color = this.color(datum);

        group.setAttributeNS(null, "transform", "translate(" + x + ", 0)");

        this.line.style.stroke = color;
      }
    }
  });

  return Marker;
})(BaseShape);

module.exports = Marker;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaGFwZXMvbWFya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDOztJQUVwQyxNQUFNO1dBQU4sTUFBTTswQkFBTixNQUFNOzs7Ozs7O1lBQU4sTUFBTTs7ZUFBTixNQUFNO0FBQ1Ysb0JBQWdCO2FBQUEsNEJBQUc7QUFDakIsZUFBTyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDO09BQ25DOztBQUVELGdCQUFZO2FBQUEsd0JBQUc7QUFDYixlQUFPLEVBRU4sQ0FBQTtPQUNGOztBQUVELFVBQU07YUFBQSxnQkFBQyxPQUFPLEVBQUU7QUFDZCxZQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFBRSxpQkFBTyxJQUFJLENBQUMsS0FBSyxDQUFDO1NBQUU7O0FBRXRDLFlBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDOztBQUVyQyxZQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNwRCxZQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN0RCxZQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQzs7O0FBR3pELFlBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMvQixZQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDaEMsWUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDOztBQUVyQyxZQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEMsWUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUVyQyxlQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7T0FDbkI7O0FBRUQsVUFBTTthQUFBLGdCQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtBQUNuQyxZQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN4QyxZQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVoQyxhQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxXQUFXLGlCQUFlLENBQUMsVUFBTyxDQUFDOztBQUU5RCxZQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO09BQ2hDOzs7O1NBdENHLE1BQU07R0FBUyxTQUFTOztBQXlDOUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMiLCJmaWxlIjoiZXM2L3NoYXBlcy9tYXJrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBCYXNlU2hhcGUgPSByZXF1aXJlKCcuL2Jhc2Utc2hhcGUnKTtcblxuY2xhc3MgTWFya2VyIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICByZXR1cm4geyB4OiAwLCBjb2xvcjogJyMwMDAwMDAnIH07XG4gIH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHtcblxuICAgIH1cbiAgfVxuXG4gIHJlbmRlcihjb250ZXh0KSB7XG4gICAgaWYgKHRoaXMuc2hhcGUpIHsgcmV0dXJuIHRoaXMuc2hhcGU7IH1cblxuICAgIGNvbnN0IGhlaWdodCA9IGNvbnRleHQucGFyYW1zLmhlaWdodDtcblxuICAgIHRoaXMuc2hhcGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2cnKTtcbiAgICB0aGlzLmxpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2xpbmUnKTtcbiAgICB0aGlzLmhhbmRsZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3JlY3QnKTtcblxuICAgIC8vIGRyYXcgbGluZVxuICAgIHRoaXMubGluZS5zZXRBdHRyaWJ1dGUoJ3gnLCAwKTtcbiAgICB0aGlzLmxpbmUuc2V0QXR0cmlidXRlKCd5MScsIDApO1xuICAgIHRoaXMubGluZS5zZXRBdHRyaWJ1dGUoJ3kyJywgaGVpZ2h0KTtcblxuICAgIHRoaXMuc2hhcGUuYXBwZW5kQ2hpbGQodGhpcy5saW5lKTtcbiAgICB0aGlzLnNoYXBlLmFwcGVuZENoaWxkKHRoaXMuaGFuZGxlcik7XG5cbiAgICByZXR1cm4gdGhpcy5zaGFwZTtcbiAgfVxuXG4gIHVwZGF0ZShjb250ZXh0LCBncm91cCwgZGF0dW0sIGluZGV4KSB7XG4gICAgY29uc3QgeCA9IGNvbnRleHQueFNjYWxlKHRoaXMueChkYXR1bSkpO1xuICAgIGNvbnN0IGNvbG9yID0gdGhpcy5jb2xvcihkYXR1bSk7XG5cbiAgICBncm91cC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3h9LCAwKWApO1xuXG4gICAgdGhpcy5saW5lLnN0eWxlLnN0cm9rZSA9IGNvbG9yO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWFya2VyOyJdfQ==