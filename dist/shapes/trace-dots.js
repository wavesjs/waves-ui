"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var BaseShape = _interopRequire(require("./base-shape"));

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
        if (this.$el) {
          return this.$el;
        }
        // container
        this.$el = document.createElementNS(this.ns, "g");
        // draw mean dot
        this.$mean = document.createElementNS(this.ns, "circle");
        this.$mean.setAttributeNS(null, "r", this.params.meanRadius);
        this.$mean.setAttributeNS(null, "stroke", this.params.meanColor);
        this.$mean.setAttributeNS(null, "fill", "transparent");
        this.$mean.classList.add("mean");
        // range dots (0 => top, 1 => bottom)
        this.$max = document.createElementNS(this.ns, "circle");
        this.$max.setAttributeNS(null, "r", this.params.meanRadius);
        this.$max.setAttributeNS(null, "stroke", this.params.rangeColor);
        this.$max.setAttributeNS(null, "fill", "transparent");
        this.$max.classList.add("max");

        this.$min = document.createElementNS(this.ns, "circle");
        this.$min.setAttributeNS(null, "r", this.params.meanRadius);
        this.$min.setAttributeNS(null, "stroke", this.params.rangeColor);
        this.$min.setAttributeNS(null, "fill", "transparent");
        this.$min.classList.add("min");

        this.$el.appendChild(this.$mean);
        this.$el.appendChild(this.$max);
        this.$el.appendChild(this.$min);

        return this.$el;
      }
    },
    update: {

      // @TODO use accessors

      value: function update(renderingContext, datum, index) {
        var mean = this.mean(datum);
        var range = this.range(datum);
        var x = this.x(datum);
        // y positions
        var meanPos = "" + renderingContext.valueToPixel(mean);
        this.$mean.setAttributeNS(null, "transform", "translate(0, " + meanPos + ")");

        var halfRange = range / 2;
        var max = renderingContext.valueToPixel(mean + halfRange);
        var min = renderingContext.valueToPixel(mean - halfRange);
        var xPos = renderingContext.timeToPixel(x);

        this.$max.setAttributeNS(null, "transform", "translate(0, " + max + ")");
        this.$min.setAttributeNS(null, "transform", "translate(0, " + min + ")");
        this.$el.setAttributeNS(null, "transform", "translate(" + xPos + ", 0)");
      }
    }
  });

  return TraceDots;
})(BaseShape);

module.exports = TraceDots;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFPLFNBQVMsMkJBQU0sY0FBYzs7SUFHZixTQUFTO1dBQVQsU0FBUzswQkFBVCxTQUFTOzs7Ozs7O1lBQVQsU0FBUzs7ZUFBVCxTQUFTO0FBQzVCLGdCQUFZO2FBQUEsd0JBQUc7QUFBRSxlQUFPLFlBQVksQ0FBQztPQUFFOztBQUV2QyxvQkFBZ0I7YUFBQSw0QkFBRztBQUNqQixlQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQztPQUNwQzs7QUFFRCxnQkFBWTthQUFBLHdCQUFHO0FBQ2IsZUFBTztBQUNMLG9CQUFVLEVBQUUsQ0FBQztBQUNiLHFCQUFXLEVBQUUsQ0FBQztBQUNkLG1CQUFTLEVBQUUsU0FBUztBQUNwQixvQkFBVSxFQUFFLFdBQVc7U0FDeEIsQ0FBQztPQUNIOztBQUVELFVBQU07YUFBQSxnQkFBQyxnQkFBZ0IsRUFBRTtBQUN2QixZQUFJLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFBRSxpQkFBTyxJQUFJLENBQUMsR0FBRyxDQUFDO1NBQUU7O0FBRWxDLFlBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDOztBQUVsRCxZQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUN6RCxZQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDN0QsWUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2pFLFlBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDdkQsWUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUVqQyxZQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUN4RCxZQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDNUQsWUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2pFLFlBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDdEQsWUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUUvQixZQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUN4RCxZQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDNUQsWUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2pFLFlBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDdEQsWUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUUvQixZQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDakMsWUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hDLFlBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFaEMsZUFBTyxJQUFJLENBQUMsR0FBRyxDQUFDO09BQ2pCOztBQUdELFVBQU07Ozs7YUFBQSxnQkFBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQ3JDLFlBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDOUIsWUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNoQyxZQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUV4QixZQUFNLE9BQU8sUUFBTSxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEFBQUUsQ0FBQztBQUN6RCxZQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxvQkFBa0IsT0FBTyxPQUFJLENBQUM7O0FBRXpFLFlBQU0sU0FBUyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDNUIsWUFBTSxHQUFHLEdBQUcsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsQ0FBQztBQUM1RCxZQUFNLEdBQUcsR0FBRyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxDQUFDO0FBQzVELFlBQU0sSUFBSSxHQUFHLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFN0MsWUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFdBQVcsb0JBQWtCLEdBQUcsT0FBSSxDQUFDO0FBQ3BFLFlBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxXQUFXLG9CQUFrQixHQUFHLE9BQUksQ0FBQztBQUNwRSxZQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxpQkFBZSxJQUFJLFVBQU8sQ0FBQztPQUNyRTs7OztTQS9Ea0IsU0FBUztHQUFTLFNBQVM7O2lCQUEzQixTQUFTIiwiZmlsZSI6ImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vYmFzZS1zaGFwZSc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhY2VEb3RzIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ3RyYWNlLWRvdHMnOyB9XG5cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICByZXR1cm4geyB4OiAwLCBtZWFuOiAwLCByYW5nZTogMCB9O1xuICB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtZWFuUmFkaXVzOiAzLFxuICAgICAgcmFuZ2VSYWRpdXM6IDMsXG4gICAgICBtZWFuQ29sb3I6ICcjMjMyMzIzJyxcbiAgICAgIHJhbmdlQ29sb3I6ICdzdGVlbGJsdWUnXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgaWYgKHRoaXMuJGVsKSB7IHJldHVybiB0aGlzLiRlbDsgfVxuICAgIC8vIGNvbnRhaW5lclxuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdnJyk7XG4gICAgLy8gZHJhdyBtZWFuIGRvdFxuICAgIHRoaXMuJG1lYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2NpcmNsZScpO1xuICAgIHRoaXMuJG1lYW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ3InLCB0aGlzLnBhcmFtcy5tZWFuUmFkaXVzKTtcbiAgICB0aGlzLiRtZWFuLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2UnLCB0aGlzLnBhcmFtcy5tZWFuQ29sb3IpO1xuICAgIHRoaXMuJG1lYW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCAndHJhbnNwYXJlbnQnKTtcbiAgICB0aGlzLiRtZWFuLmNsYXNzTGlzdC5hZGQoJ21lYW4nKTtcbiAgICAvLyByYW5nZSBkb3RzICgwID0+IHRvcCwgMSA9PiBib3R0b20pXG4gICAgdGhpcy4kbWF4ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdjaXJjbGUnKTtcbiAgICB0aGlzLiRtYXguc2V0QXR0cmlidXRlTlMobnVsbCwgJ3InLCB0aGlzLnBhcmFtcy5tZWFuUmFkaXVzKTtcbiAgICB0aGlzLiRtYXguc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZScsIHRoaXMucGFyYW1zLnJhbmdlQ29sb3IpO1xuICAgIHRoaXMuJG1heC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsICd0cmFuc3BhcmVudCcpO1xuICAgIHRoaXMuJG1heC5jbGFzc0xpc3QuYWRkKCdtYXgnKTtcblxuICAgIHRoaXMuJG1pbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnY2lyY2xlJyk7XG4gICAgdGhpcy4kbWluLnNldEF0dHJpYnV0ZU5TKG51bGwsICdyJywgdGhpcy5wYXJhbXMubWVhblJhZGl1cyk7XG4gICAgdGhpcy4kbWluLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2UnLCB0aGlzLnBhcmFtcy5yYW5nZUNvbG9yKTtcbiAgICB0aGlzLiRtaW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCAndHJhbnNwYXJlbnQnKTtcbiAgICB0aGlzLiRtaW4uY2xhc3NMaXN0LmFkZCgnbWluJyk7XG5cbiAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRtZWFuKTtcbiAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRtYXgpO1xuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJG1pbik7XG5cbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICAvLyBAVE9ETyB1c2UgYWNjZXNzb3JzXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSwgaW5kZXgpIHtcbiAgICBjb25zdCBtZWFuID0gdGhpcy5tZWFuKGRhdHVtKTtcbiAgICBjb25zdCByYW5nZSA9IHRoaXMucmFuZ2UoZGF0dW0pO1xuICAgIGNvbnN0IHggPSB0aGlzLngoZGF0dW0pO1xuICAgIC8vIHkgcG9zaXRpb25zXG4gICAgY29uc3QgbWVhblBvcyA9IGAke3JlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKG1lYW4pfWA7XG4gICAgdGhpcy4kbWVhbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke21lYW5Qb3N9KWApO1xuXG4gICAgY29uc3QgaGFsZlJhbmdlID0gcmFuZ2UgLyAyO1xuICAgIGNvbnN0IG1heCA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKG1lYW4gKyBoYWxmUmFuZ2UpO1xuICAgIGNvbnN0IG1pbiA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKG1lYW4gLSBoYWxmUmFuZ2UpO1xuICAgIGNvbnN0IHhQb3MgPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHgpO1xuXG4gICAgdGhpcy4kbWF4LnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7bWF4fSlgKTtcbiAgICB0aGlzLiRtaW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgJHttaW59KWApO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7eFBvc30sIDApYCk7XG4gIH1cbn1cbiJdfQ==