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
        var meanPos = "" + renderingContext.yScale(mean);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaGFwZXMvdHJhY2UtZG90cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU8sU0FBUywyQkFBTSxjQUFjOztJQUdmLFNBQVM7V0FBVCxTQUFTOzBCQUFULFNBQVM7Ozs7Ozs7WUFBVCxTQUFTOztlQUFULFNBQVM7QUFDNUIsZ0JBQVk7YUFBQSx3QkFBRztBQUFFLGVBQU8sWUFBWSxDQUFDO09BQUU7O0FBRXZDLG9CQUFnQjthQUFBLDRCQUFHO0FBQ2pCLGVBQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDO09BQ3BDOztBQUVELGdCQUFZO2FBQUEsd0JBQUc7QUFDYixlQUFPO0FBQ0wsb0JBQVUsRUFBRSxDQUFDO0FBQ2IscUJBQVcsRUFBRSxDQUFDO0FBQ2QsbUJBQVMsRUFBRSxTQUFTO0FBQ3BCLG9CQUFVLEVBQUUsV0FBVztTQUN4QixDQUFDO09BQ0g7O0FBRUQsVUFBTTthQUFBLGdCQUFDLGdCQUFnQixFQUFFO0FBQ3ZCLFlBQUksSUFBSSxDQUFDLEdBQUcsRUFBRTtBQUFFLGlCQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7U0FBRTs7QUFFbEMsWUFBSSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7O0FBRWxELFlBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ3pELFlBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM3RCxZQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFD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VyxvQkFBa0IsR0FBRyxPQUFJLENBQUM7QUFDcEUsWUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFdBQVcsb0JBQWtCLEdBQUcsT0FBSSxDQUFDO0FBQ3BFLFlBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxXQUFXLGlCQUFlLElBQUksVUFBTyxDQUFDO09BQ3JFOzs7O1NBL0RrQixTQUFTO0dBQVMsU0FBUzs7aUJBQTNCLFNBQVMiLCJmaWxlIjoiZXM2L3NoYXBlcy90cmFjZS1kb3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuL2Jhc2Utc2hhcGUnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyYWNlRG90cyBleHRlbmRzIEJhc2VTaGFwZSB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICd0cmFjZS1kb3RzJzsgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgcmV0dXJuIHsgeDogMCwgbWVhbjogMCwgcmFuZ2U6IDAgfTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbWVhblJhZGl1czogMyxcbiAgICAgIHJhbmdlUmFkaXVzOiAzLFxuICAgICAgbWVhbkNvbG9yOiAnIzIzMjMyMycsXG4gICAgICByYW5nZUNvbG9yOiAnc3RlZWxibHVlJ1xuICAgIH07XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIGlmICh0aGlzLiRlbCkgeyByZXR1cm4gdGhpcy4kZWw7IH1cbiAgICAvLyBjb250YWluZXJcbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnZycpO1xuICAgIC8vIGRyYXcgbWVhbiBkb3RcbiAgICB0aGlzLiRtZWFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdjaXJjbGUnKTtcbiAgICB0aGlzLiRtZWFuLnNldEF0dHJpYnV0ZU5TKG51bGwsICdyJywgdGhpcy5wYXJhbXMubWVhblJhZGl1cyk7XG4gICAgdGhpcy4kbWVhbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlJywgdGhpcy5wYXJhbXMubWVhbkNvbG9yKTtcbiAgICB0aGlzLiRtZWFuLnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgJ3RyYW5zcGFyZW50Jyk7XG4gICAgdGhpcy4kbWVhbi5jbGFzc0xpc3QuYWRkKCdtZWFuJyk7XG4gICAgLy8gcmFuZ2UgZG90cyAoMCA9PiB0b3AsIDEgPT4gYm90dG9tKVxuICAgIHRoaXMuJG1heCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnY2lyY2xlJyk7XG4gICAgdGhpcy4kbWF4LnNldEF0dHJpYnV0ZU5TKG51bGwsICdyJywgdGhpcy5wYXJhbXMubWVhblJhZGl1cyk7XG4gICAgdGhpcy4kbWF4LnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2UnLCB0aGlzLnBhcmFtcy5yYW5nZUNvbG9yKTtcbiAgICB0aGlzLiRtYXguc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCAndHJhbnNwYXJlbnQnKTtcbiAgICB0aGlzLiRtYXguY2xhc3NMaXN0LmFkZCgnbWF4Jyk7XG5cbiAgICB0aGlzLiRtaW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2NpcmNsZScpO1xuICAgIHRoaXMuJG1pbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAncicsIHRoaXMucGFyYW1zLm1lYW5SYWRpdXMpO1xuICAgIHRoaXMuJG1pbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlJywgdGhpcy5wYXJhbXMucmFuZ2VDb2xvcik7XG4gICAgdGhpcy4kbWluLnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgJ3RyYW5zcGFyZW50Jyk7XG4gICAgdGhpcy4kbWluLmNsYXNzTGlzdC5hZGQoJ21pbicpO1xuXG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kbWVhbik7XG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kbWF4KTtcbiAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRtaW4pO1xuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgLy8gQFRPRE8gdXNlIGFjY2Vzc29yc1xuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0sIGluZGV4KSB7XG4gICAgY29uc3QgbWVhbiA9IHRoaXMubWVhbihkYXR1bSk7XG4gICAgY29uc3QgcmFuZ2UgPSB0aGlzLnJhbmdlKGRhdHVtKTtcbiAgICBjb25zdCB4ID0gdGhpcy54KGRhdHVtKTtcbiAgICAvLyB5IHBvc2l0aW9uc1xuICAgIGNvbnN0IG1lYW5Qb3MgPSBgJHtyZW5kZXJpbmdDb250ZXh0LnlTY2FsZShtZWFuKX1gO1xuICAgIHRoaXMuJG1lYW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgJHttZWFuUG9zfSlgKTtcblxuICAgIGNvbnN0IGhhbGZSYW5nZSA9IHJhbmdlIC8gMjtcbiAgICBjb25zdCBtYXggPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChtZWFuICsgaGFsZlJhbmdlKTtcbiAgICBjb25zdCBtaW4gPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChtZWFuIC0gaGFsZlJhbmdlKTtcbiAgICBjb25zdCB4UG9zID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh4KTtcblxuICAgIHRoaXMuJG1heC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke21heH0pYCk7XG4gICAgdGhpcy4kbWluLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7bWlufSlgKTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3hQb3N9LCAwKWApO1xuICB9XG59XG4iXX0=