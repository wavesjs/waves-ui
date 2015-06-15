"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var BaseShape = require("./base-shape");

var TraceDots = (function (_BaseShape) {
  function TraceDots() {
    _classCallCheck(this, TraceDots);

    if (_BaseShape != null) {
      _BaseShape.apply(this, arguments);
    }
  }

  _inherits(TraceDots, _BaseShape);

  _createClass(TraceDots, {
    _getAccessorList: {
      value: function _getAccessorList() {
        return {
          x: function x(d) {
            var v = arguments[1] === undefined ? null : arguments[1];

            if (v !== null) {
              d.x = v;
            }
            return d.x;
          },
          mean: function mean(d) {
            var v = arguments[1] === undefined ? null : arguments[1];

            if (v !== null) {
              d.mean = v;
            }
            return d.mean;
          },
          min: 0,
          max: 0
        };
      }
    },
    _getDefaults: {
      value: function _getDefaults() {
        return {
          meanRadius: 3,
          rangeRadius: 3,
          meanColor: "#232323",
          rangeColor: "steelblue"
        };
      }
    },
    render: {
      value: function render(renderingContext) {
        if (this.shape) {
          return this.shape;
        }

        // container
        this.shape = document.createElementNS(this.ns, "g");
        // draw mean dot
        this.mean = document.createElementNS(this.ns, "circle");
        this.mean.setAttributeNS(null, "r", this.params.meanRadius);
        this.mean.setAttributeNS(null, "stroke", this.params.meanColor);
        this.mean.setAttributeNS(null, "fill", "none");
        // range dots (0 => top, 1 => bottom)
        this.max = document.createElementNS(this.ns, "circle");
        this.max.setAttributeNS(null, "r", this.params.meanRadius);
        this.max.setAttributeNS(null, "stroke", this.params.rangeColor);
        this.max.setAttributeNS(null, "fill", "none");

        this.min = document.createElementNS(this.ns, "circle");
        this.min.setAttributeNS(null, "r", this.params.meanRadius);
        this.min.setAttributeNS(null, "stroke", this.params.rangeColor);
        this.min.setAttributeNS(null, "fill", "none");

        this.shape.appendChild(this.mean);
        this.shape.appendChild(this.max);
        this.shape.appendChild(this.min);

        return this.shape;
      }
    },
    update: {

      // @TODO use accessors

      value: function update(renderingContext, group, datum, index) {
        // y positions
        var meanPos = "" + renderingContext.yScale(datum.mean);
        this.mean.setAttributeNS(null, "transform", "translate(0, " + meanPos + ")");

        var halfRange = datum.range / 2;
        var max = "" + renderingContext.yScale(datum.mean + halfRange);
        this.max.setAttributeNS(null, "transform", "translate(0, " + max + ")");
        var min = "" + renderingContext.yScale(datum.mean - halfRange);
        this.min.setAttributeNS(null, "transform", "translate(0, " + min + ")");

        var xPos = "" + renderingContext.xScale(datum.x);
        this.shape.setAttributeNS(null, "transform", "translate(" + xPos + ", 0)");
      }
    }
  });

  return TraceDots;
})(BaseShape);

module.exports = TraceDots;
//# sourceMappingURL=data:application/json;base64,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VyxvQkFBa0IsR0FBRyxPQUFJLENBQUM7O0FBRW5FLFlBQU0sSUFBSSxRQUFNLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEFBQUUsQ0FBQztBQUNuRCxZQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxpQkFBZSxJQUFJLFVBQU8sQ0FBQztPQUN2RTs7OztTQW5FRyxTQUFTO0dBQVMsU0FBUzs7QUFzRWpDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDIiwiZmlsZSI6ImVzNi9zaGFwZXMvdHJhY2UtZG90cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEJhc2VTaGFwZSA9IHJlcXVpcmUoJy4vYmFzZS1zaGFwZScpO1xuXG5cbmNsYXNzIFRyYWNlRG90cyBleHRlbmRzIEJhc2VTaGFwZSB7XG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IGZ1bmN0aW9uKGQsIHYgPSBudWxsKSB7XG4gICAgICAgIGlmICh2ICE9PSBudWxsKSB7IGQueCA9IHY7IH1cbiAgICAgICAgcmV0dXJuIGQueDtcbiAgICAgIH0sXG4gICAgICBtZWFuOiBmdW5jdGlvbihkLCB2ID0gbnVsbCkge1xuICAgICAgICBpZiAodiAhPT0gbnVsbCkgeyBkLm1lYW4gPSB2IH1cbiAgICAgICAgcmV0dXJuIGQubWVhbjtcbiAgICAgIH0sXG4gICAgICBtaW46IDAsXG4gICAgICBtYXg6IDBcbiAgICB9O1xuICB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtZWFuUmFkaXVzOiAzLFxuICAgICAgcmFuZ2VSYWRpdXM6IDMsXG4gICAgICBtZWFuQ29sb3I6ICcjMjMyMzIzJyxcbiAgICAgIHJhbmdlQ29sb3I6ICdzdGVlbGJsdWUnXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgaWYgKHRoaXMuc2hhcGUpIHsgcmV0dXJuIHRoaXMuc2hhcGU7IH1cblxuICAgIC8vIGNvbnRhaW5lclxuICAgIHRoaXMuc2hhcGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2cnKTtcbiAgICAvLyBkcmF3IG1lYW4gZG90XG4gICAgdGhpcy5tZWFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdjaXJjbGUnKTtcbiAgICB0aGlzLm1lYW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ3InLCB0aGlzLnBhcmFtcy5tZWFuUmFkaXVzKTtcbiAgICB0aGlzLm1lYW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZScsIHRoaXMucGFyYW1zLm1lYW5Db2xvcik7XG4gICAgdGhpcy5tZWFuLnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgJ25vbmUnKTtcbiAgICAvLyByYW5nZSBkb3RzICgwID0+IHRvcCwgMSA9PiBib3R0b20pXG4gICAgdGhpcy5tYXggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2NpcmNsZScpO1xuICAgIHRoaXMubWF4LnNldEF0dHJpYnV0ZU5TKG51bGwsICdyJywgdGhpcy5wYXJhbXMubWVhblJhZGl1cyk7XG4gICAgdGhpcy5tYXguc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZScsIHRoaXMucGFyYW1zLnJhbmdlQ29sb3IpO1xuICAgIHRoaXMubWF4LnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgJ25vbmUnKTtcblxuICAgIHRoaXMubWluID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdjaXJjbGUnKTtcbiAgICB0aGlzLm1pbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAncicsIHRoaXMucGFyYW1zLm1lYW5SYWRpdXMpO1xuICAgIHRoaXMubWluLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2UnLCB0aGlzLnBhcmFtcy5yYW5nZUNvbG9yKTtcbiAgICB0aGlzLm1pbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsICdub25lJyk7XG5cbiAgICB0aGlzLnNoYXBlLmFwcGVuZENoaWxkKHRoaXMubWVhbik7XG4gICAgdGhpcy5zaGFwZS5hcHBlbmRDaGlsZCh0aGlzLm1heCk7XG4gICAgdGhpcy5zaGFwZS5hcHBlbmRDaGlsZCh0aGlzLm1pbik7XG5cbiAgICByZXR1cm4gdGhpcy5zaGFwZTtcbiAgfVxuXG4gIC8vIEBUT0RPIHVzZSBhY2Nlc3NvcnNcbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGdyb3VwLCBkYXR1bSwgaW5kZXgpIHtcbiAgICAvLyB5IHBvc2l0aW9uc1xuICAgIGNvbnN0IG1lYW5Qb3MgPSBgJHtyZW5kZXJpbmdDb250ZXh0LnlTY2FsZShkYXR1bS5tZWFuKX1gO1xuICAgIHRoaXMubWVhbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke21lYW5Qb3N9KWApO1xuXG4gICAgY29uc3QgaGFsZlJhbmdlID0gZGF0dW0ucmFuZ2UgLyAyO1xuICAgIGNvbnN0IG1heCA9IGAke3JlbmRlcmluZ0NvbnRleHQueVNjYWxlKGRhdHVtLm1lYW4gKyBoYWxmUmFuZ2UpfWA7XG4gICAgdGhpcy5tYXguc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgJHttYXh9KWApO1xuICAgIGNvbnN0IG1pbiA9IGAke3JlbmRlcmluZ0NvbnRleHQueVNjYWxlKGRhdHVtLm1lYW4gLSBoYWxmUmFuZ2UpfWA7XG4gICAgdGhpcy5taW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgJHttaW59KWApO1xuXG4gICAgY29uc3QgeFBvcyA9IGAke3JlbmRlcmluZ0NvbnRleHQueFNjYWxlKGRhdHVtLngpfWA7XG4gICAgdGhpcy5zaGFwZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3hQb3N9LCAwKWApO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVHJhY2VEb3RzOyJdfQ==