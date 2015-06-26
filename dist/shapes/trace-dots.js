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
    getClassName: {
      value: function getClassName() {
        return "trace-dots";
      }
    },
    _getAccessorList: {
      value: function _getAccessorList() {
        return { x: 0, mean: 0, range: 0 };
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
        this._mean = document.createElementNS(this.ns, "circle");
        this._mean.setAttributeNS(null, "r", this.params.meanRadius);
        this._mean.setAttributeNS(null, "stroke", this.params.meanColor);
        this._mean.setAttributeNS(null, "fill", "transparent");
        this._mean.classList.add("mean");
        // range dots (0 => top, 1 => bottom)
        this._max = document.createElementNS(this.ns, "circle");
        this._max.setAttributeNS(null, "r", this.params.meanRadius);
        this._max.setAttributeNS(null, "stroke", this.params.rangeColor);
        this._max.setAttributeNS(null, "fill", "transparent");
        this._max.classList.add("max");

        this._min = document.createElementNS(this.ns, "circle");
        this._min.setAttributeNS(null, "r", this.params.meanRadius);
        this._min.setAttributeNS(null, "stroke", this.params.rangeColor);
        this._min.setAttributeNS(null, "fill", "transparent");
        this._min.classList.add("min");

        this.shape.appendChild(this._mean);
        this.shape.appendChild(this._max);
        this.shape.appendChild(this._min);

        return this.shape;
      }
    },
    update: {

      // @TODO use accessors

      value: function update(renderingContext, group, datum, index) {
        var mean = this.mean(datum);
        var range = this.range(datum);
        var x = this.x(datum);
        // y positions
        var meanPos = "" + renderingContext.yScale(mean);
        this._mean.setAttributeNS(null, "transform", "translate(0, " + meanPos + ")");

        var halfRange = datum.range / 2;
        var max = renderingContext.yScale(mean + halfRange);
        this._max.setAttributeNS(null, "transform", "translate(0, " + max + ")");
        var min = renderingContext.yScale(mean - halfRange);
        this._min.setAttributeNS(null, "transform", "translate(0, " + min + ")");

        var xPos = renderingContext.xScale(x);
        this.shape.setAttributeNS(null, "transform", "translate(" + xPos + ", 0)");
      }
    }
  });

  return TraceDots;
})(BaseShape);

module.exports = TraceDots;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaGFwZXMvdHJhY2UtZG90cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQzs7SUFHcEMsU0FBUztXQUFULFNBQVM7MEJBQVQsU0FBUzs7Ozs7OztZQUFULFNBQVM7O2VBQVQsU0FBUztBQUNiLGdCQUFZO2FBQUEsd0JBQUc7QUFBRSxlQUFPLFlBQVksQ0FBQztPQUFFOztBQUV2QyxvQkFBZ0I7YUFBQSw0QkFBRztBQUNqQixlQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQztPQUNwQzs7QUFFRCxnQkFBWTthQUFBLHdCQUFHO0FBQ2IsZUFBTztBQUNMLG9CQUFVLEVBQUUsQ0FBQztBQUNiLHFCQUFXLEVBQUUsQ0FBQztBQUNkLG1CQUFTLEVBQUUsU0FBUztBQUNwQixvQkFBVSxFQUFFLFdBQVc7U0FDeEIsQ0FBQztPQUNIOztBQUVELFVBQU07YUFBQSxnQkFBQyxnQkFBZ0IsRUFBRTtBQUN2QixZQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFBRSxpQkFBTyxJQUFJLENBQUMsS0FBSyxDQUFDO1NBQUU7O0FBRXRDLFlBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDOztBQUVwRCxZQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUN6RCxZQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDN0QsWUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2pFLFlBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDdkQsWUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUVqQyxZQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUN4RCxZQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDNUQsWUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2pFLFlBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDdEQsWUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUUvQixZQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUN4RCxZQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDNUQsWUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2pFLFlBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDdEQsWUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUUvQixZQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkMsWUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xDLFlBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFbEMsZUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDO09BQ25COztBQUdELFVBQU07Ozs7YUFBQSxnQkFBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtBQUM1QyxZQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzlCLFlBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDaEMsWUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFeEIsWUFBTSxPQUFPLFFBQU0sZ0JBQWdCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxBQUFFLENBQUM7QUFDbkQsWUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFdBQVcsb0JBQWtCLE9BQU8sT0FBSSxDQUFDOztBQUV6RSxZQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztBQUNsQyxZQUFNLEdBQUcsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxDQUFDO0FBQ3RELFlBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxXQUFXLG9CQUFrQixHQUFHLE9BQUksQ0FBQztBQUNwRSxZQUFNLEdBQUcsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxDQUFDO0FBQ3RELFlBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxXQUFXLG9CQUFrQixHQUFHLE9BQUksQ0FBQzs7QUFFcEUsWUFBTSxJQUFJLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hDLFlBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxXQUFXLGlCQUFlLElBQUksVUFBTyxDQUFDO09BQ3ZFOzs7O1NBL0RHLFNBQVM7R0FBUyxTQUFTOztBQWtFakMsTUFBTSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMiLCJmaWxlIjoiZXM2L3NoYXBlcy90cmFjZS1kb3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQmFzZVNoYXBlID0gcmVxdWlyZSgnLi9iYXNlLXNoYXBlJyk7XG5cblxuY2xhc3MgVHJhY2VEb3RzIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ3RyYWNlLWRvdHMnOyB9XG5cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICByZXR1cm4geyB4OiAwLCBtZWFuOiAwLCByYW5nZTogMCB9O1xuICB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtZWFuUmFkaXVzOiAzLFxuICAgICAgcmFuZ2VSYWRpdXM6IDMsXG4gICAgICBtZWFuQ29sb3I6ICcjMjMyMzIzJyxcbiAgICAgIHJhbmdlQ29sb3I6ICdzdGVlbGJsdWUnXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgaWYgKHRoaXMuc2hhcGUpIHsgcmV0dXJuIHRoaXMuc2hhcGU7IH1cbiAgICAvLyBjb250YWluZXJcbiAgICB0aGlzLnNoYXBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdnJyk7XG4gICAgLy8gZHJhdyBtZWFuIGRvdFxuICAgIHRoaXMuX21lYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2NpcmNsZScpO1xuICAgIHRoaXMuX21lYW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ3InLCB0aGlzLnBhcmFtcy5tZWFuUmFkaXVzKTtcbiAgICB0aGlzLl9tZWFuLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2UnLCB0aGlzLnBhcmFtcy5tZWFuQ29sb3IpO1xuICAgIHRoaXMuX21lYW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCAndHJhbnNwYXJlbnQnKTtcbiAgICB0aGlzLl9tZWFuLmNsYXNzTGlzdC5hZGQoJ21lYW4nKTtcbiAgICAvLyByYW5nZSBkb3RzICgwID0+IHRvcCwgMSA9PiBib3R0b20pXG4gICAgdGhpcy5fbWF4ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdjaXJjbGUnKTtcbiAgICB0aGlzLl9tYXguc2V0QXR0cmlidXRlTlMobnVsbCwgJ3InLCB0aGlzLnBhcmFtcy5tZWFuUmFkaXVzKTtcbiAgICB0aGlzLl9tYXguc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZScsIHRoaXMucGFyYW1zLnJhbmdlQ29sb3IpO1xuICAgIHRoaXMuX21heC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsICd0cmFuc3BhcmVudCcpO1xuICAgIHRoaXMuX21heC5jbGFzc0xpc3QuYWRkKCdtYXgnKTtcblxuICAgIHRoaXMuX21pbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnY2lyY2xlJyk7XG4gICAgdGhpcy5fbWluLnNldEF0dHJpYnV0ZU5TKG51bGwsICdyJywgdGhpcy5wYXJhbXMubWVhblJhZGl1cyk7XG4gICAgdGhpcy5fbWluLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2UnLCB0aGlzLnBhcmFtcy5yYW5nZUNvbG9yKTtcbiAgICB0aGlzLl9taW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCAndHJhbnNwYXJlbnQnKTtcbiAgICB0aGlzLl9taW4uY2xhc3NMaXN0LmFkZCgnbWluJyk7XG5cbiAgICB0aGlzLnNoYXBlLmFwcGVuZENoaWxkKHRoaXMuX21lYW4pO1xuICAgIHRoaXMuc2hhcGUuYXBwZW5kQ2hpbGQodGhpcy5fbWF4KTtcbiAgICB0aGlzLnNoYXBlLmFwcGVuZENoaWxkKHRoaXMuX21pbik7XG5cbiAgICByZXR1cm4gdGhpcy5zaGFwZTtcbiAgfVxuXG4gIC8vIEBUT0RPIHVzZSBhY2Nlc3NvcnNcbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGdyb3VwLCBkYXR1bSwgaW5kZXgpIHtcbiAgICBjb25zdCBtZWFuID0gdGhpcy5tZWFuKGRhdHVtKTtcbiAgICBjb25zdCByYW5nZSA9IHRoaXMucmFuZ2UoZGF0dW0pO1xuICAgIGNvbnN0IHggPSB0aGlzLngoZGF0dW0pO1xuICAgIC8vIHkgcG9zaXRpb25zXG4gICAgY29uc3QgbWVhblBvcyA9IGAke3JlbmRlcmluZ0NvbnRleHQueVNjYWxlKG1lYW4pfWA7XG4gICAgdGhpcy5fbWVhbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke21lYW5Qb3N9KWApO1xuXG4gICAgY29uc3QgaGFsZlJhbmdlID0gZGF0dW0ucmFuZ2UgLyAyO1xuICAgIGNvbnN0IG1heCA9IHJlbmRlcmluZ0NvbnRleHQueVNjYWxlKG1lYW4gKyBoYWxmUmFuZ2UpO1xuICAgIHRoaXMuX21heC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke21heH0pYCk7XG4gICAgY29uc3QgbWluID0gcmVuZGVyaW5nQ29udGV4dC55U2NhbGUobWVhbiAtIGhhbGZSYW5nZSk7XG4gICAgdGhpcy5fbWluLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7bWlufSlgKTtcblxuICAgIGNvbnN0IHhQb3MgPSByZW5kZXJpbmdDb250ZXh0LnhTY2FsZSh4KTtcbiAgICB0aGlzLnNoYXBlLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7eFBvc30sIDApYCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUcmFjZURvdHM7Il19