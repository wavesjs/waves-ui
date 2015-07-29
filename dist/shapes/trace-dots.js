'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

var _baseShape = require('./base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

var TraceDots = (function (_BaseShape) {
  function TraceDots() {
    _classCallCheck(this, TraceDots);

    if (_BaseShape != null) {
      _BaseShape.apply(this, arguments);
    }
  }

  _inherits(TraceDots, _BaseShape);

  _createClass(TraceDots, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'trace-dots';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return { x: 0, mean: 0, range: 0 };
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {
        meanRadius: 3,
        rangeRadius: 3,
        meanColor: '#232323',
        rangeColor: 'steelblue'
      };
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      if (this.$el) {
        return this.$el;
      }
      // container
      this.$el = document.createElementNS(this.ns, 'g');
      // draw mean dot
      this.$mean = document.createElementNS(this.ns, 'circle');
      this.$mean.setAttributeNS(null, 'r', this.params.meanRadius);
      this.$mean.setAttributeNS(null, 'stroke', this.params.meanColor);
      this.$mean.setAttributeNS(null, 'fill', 'transparent');
      this.$mean.classList.add('mean');
      // range dots (0 => top, 1 => bottom)
      this.$max = document.createElementNS(this.ns, 'circle');
      this.$max.setAttributeNS(null, 'r', this.params.meanRadius);
      this.$max.setAttributeNS(null, 'stroke', this.params.rangeColor);
      this.$max.setAttributeNS(null, 'fill', 'transparent');
      this.$max.classList.add('max');

      this.$min = document.createElementNS(this.ns, 'circle');
      this.$min.setAttributeNS(null, 'r', this.params.meanRadius);
      this.$min.setAttributeNS(null, 'stroke', this.params.rangeColor);
      this.$min.setAttributeNS(null, 'fill', 'transparent');
      this.$min.classList.add('min');

      this.$el.appendChild(this.$mean);
      this.$el.appendChild(this.$max);
      this.$el.appendChild(this.$min);

      return this.$el;
    }
  }, {
    key: 'update',

    // @TODO use accessors
    value: function update(renderingContext, datum, index) {
      var mean = this.mean(datum);
      var range = this.range(datum);
      var x = this.x(datum);
      // y positions
      var meanPos = '' + renderingContext.valueToPixel(mean);
      this.$mean.setAttributeNS(null, 'transform', 'translate(0, ' + meanPos + ')');

      var halfRange = range / 2;
      var max = renderingContext.valueToPixel(mean + halfRange);
      var min = renderingContext.valueToPixel(mean - halfRange);
      var xPos = renderingContext.timeToPixel(x);

      this.$max.setAttributeNS(null, 'transform', 'translate(0, ' + max + ')');
      this.$min.setAttributeNS(null, 'transform', 'translate(0, ' + min + ')');
      this.$el.setAttributeNS(null, 'transform', 'translate(' + xPos + ', 0)');
    }
  }, {
    key: 'inArea',
    value: function inArea(renderingContext, datum, x1, y1, x2, y2) {
      var x = renderingContext.timeToPixel(this.x(datum));
      var mean = renderingContext.valueToPixel(this.mean(datum));
      var range = renderingContext.valueToPixel(this.range(datum));
      var min = mean - range / 2;
      var max = mean + range / 2;

      if (x > x1 && x < x2 && (min > y1 || max < y2)) {
        return true;
      }

      return false;
    }
  }]);

  return TraceDots;
})(_baseShape2['default']);

exports['default'] = TraceDots;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFBc0IsY0FBYzs7OztJQUdmLFNBQVM7V0FBVCxTQUFTOzBCQUFULFNBQVM7Ozs7Ozs7WUFBVCxTQUFTOztlQUFULFNBQVM7O1dBQ2hCLHdCQUFHO0FBQUUsYUFBTyxZQUFZLENBQUM7S0FBRTs7O1dBRXZCLDRCQUFHO0FBQ2pCLGFBQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDO0tBQ3BDOzs7V0FFVyx3QkFBRztBQUNiLGFBQU87QUFDTCxrQkFBVSxFQUFFLENBQUM7QUFDYixtQkFBVyxFQUFFLENBQUM7QUFDZCxpQkFBUyxFQUFFLFNBQVM7QUFDcEIsa0JBQVUsRUFBRSxXQUFXO09BQ3hCLENBQUM7S0FDSDs7O1dBRUssZ0JBQUMsZ0JBQWdCLEVBQUU7QUFDdkIsVUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFO0FBQUUsZUFBTyxJQUFJLENBQUMsR0FBRyxDQUFDO09BQUU7O0FBRWxDLFVBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDOztBQUVsRCxVQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUN6RCxVQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDN0QsVUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2pFLFVBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDdkQsVUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUVqQyxVQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUN4RCxVQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDNUQsVUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2pFLFVBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDdEQsVUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUUvQixVQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUN4RCxVQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDNUQsVUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2pFLFVBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDdEQsVUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUUvQixVQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDakMsVUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hDLFVBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFaEMsYUFBTyxJQUFJLENBQUMsR0FBRyxDQUFDO0tBQ2pCOzs7OztXQUdLLGdCQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDckMsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM5QixVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2hDLFVBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRXhCLFVBQU0sT0FBTyxRQUFNLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQUFBRSxDQUFDO0FBQ3pELFVBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxXQUFXLG9CQUFrQixPQUFPLE9BQUksQ0FBQzs7QUFFekUsVUFBTSxTQUFTLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQztBQUM1QixVQUFNLEdBQUcsR0FBRyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxDQUFDO0FBQzVELFVBQU0sR0FBRyxHQUFHLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDLENBQUM7QUFDNUQsVUFBTSxJQUFJLEdBQUcsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUU3QyxVQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxvQkFBa0IsR0FBRyxPQUFJLENBQUM7QUFDcEUsVUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFdBQVcsb0JBQWtCLEdBQUcsT0FBSSxDQUFDO0FBQ3BFLFVBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxXQUFXLGlCQUFlLElBQUksVUFBTyxDQUFDO0tBQ3JFOzs7V0FFSyxnQkFBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO0FBQzlDLFVBQU0sQ0FBQyxHQUFHLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDdEQsVUFBTSxJQUFJLEdBQUcsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUM3RCxVQUFNLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQy9ELFVBQU0sR0FBRyxHQUFHLElBQUksR0FBSSxLQUFLLEdBQUcsQ0FBQyxBQUFDLENBQUM7QUFDL0IsVUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFJLEtBQUssR0FBRyxDQUFDLEFBQUMsQ0FBQzs7QUFFL0IsVUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssR0FBRyxHQUFHLEVBQUUsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFBLEFBQUMsRUFBRTtBQUM5QyxlQUFPLElBQUksQ0FBQztPQUNiOztBQUVELGFBQU8sS0FBSyxDQUFDO0tBQ2Q7OztTQTdFa0IsU0FBUzs7O3FCQUFULFNBQVMiLCJmaWxlIjoiZXM2L3V0aWxzL29ydGhvZ29uYWwtZGF0YS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9iYXNlLXNoYXBlJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmFjZURvdHMgZXh0ZW5kcyBCYXNlU2hhcGUge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAndHJhY2UtZG90cyc7IH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIHJldHVybiB7IHg6IDAsIG1lYW46IDAsIHJhbmdlOiAwIH07XG4gIH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1lYW5SYWRpdXM6IDMsXG4gICAgICByYW5nZVJhZGl1czogMyxcbiAgICAgIG1lYW5Db2xvcjogJyMyMzIzMjMnLFxuICAgICAgcmFuZ2VDb2xvcjogJ3N0ZWVsYmx1ZSdcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy4kZWwpIHsgcmV0dXJuIHRoaXMuJGVsOyB9XG4gICAgLy8gY29udGFpbmVyXG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2cnKTtcbiAgICAvLyBkcmF3IG1lYW4gZG90XG4gICAgdGhpcy4kbWVhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnY2lyY2xlJyk7XG4gICAgdGhpcy4kbWVhbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAncicsIHRoaXMucGFyYW1zLm1lYW5SYWRpdXMpO1xuICAgIHRoaXMuJG1lYW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZScsIHRoaXMucGFyYW1zLm1lYW5Db2xvcik7XG4gICAgdGhpcy4kbWVhbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsICd0cmFuc3BhcmVudCcpO1xuICAgIHRoaXMuJG1lYW4uY2xhc3NMaXN0LmFkZCgnbWVhbicpO1xuICAgIC8vIHJhbmdlIGRvdHMgKDAgPT4gdG9wLCAxID0+IGJvdHRvbSlcbiAgICB0aGlzLiRtYXggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2NpcmNsZScpO1xuICAgIHRoaXMuJG1heC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAncicsIHRoaXMucGFyYW1zLm1lYW5SYWRpdXMpO1xuICAgIHRoaXMuJG1heC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlJywgdGhpcy5wYXJhbXMucmFuZ2VDb2xvcik7XG4gICAgdGhpcy4kbWF4LnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgJ3RyYW5zcGFyZW50Jyk7XG4gICAgdGhpcy4kbWF4LmNsYXNzTGlzdC5hZGQoJ21heCcpO1xuXG4gICAgdGhpcy4kbWluID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdjaXJjbGUnKTtcbiAgICB0aGlzLiRtaW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ3InLCB0aGlzLnBhcmFtcy5tZWFuUmFkaXVzKTtcbiAgICB0aGlzLiRtaW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZScsIHRoaXMucGFyYW1zLnJhbmdlQ29sb3IpO1xuICAgIHRoaXMuJG1pbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsICd0cmFuc3BhcmVudCcpO1xuICAgIHRoaXMuJG1pbi5jbGFzc0xpc3QuYWRkKCdtaW4nKTtcblxuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJG1lYW4pO1xuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJG1heCk7XG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kbWluKTtcblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIC8vIEBUT0RPIHVzZSBhY2Nlc3NvcnNcbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtLCBpbmRleCkge1xuICAgIGNvbnN0IG1lYW4gPSB0aGlzLm1lYW4oZGF0dW0pO1xuICAgIGNvbnN0IHJhbmdlID0gdGhpcy5yYW5nZShkYXR1bSk7XG4gICAgY29uc3QgeCA9IHRoaXMueChkYXR1bSk7XG4gICAgLy8geSBwb3NpdGlvbnNcbiAgICBjb25zdCBtZWFuUG9zID0gYCR7cmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwobWVhbil9YDtcbiAgICB0aGlzLiRtZWFuLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7bWVhblBvc30pYCk7XG5cbiAgICBjb25zdCBoYWxmUmFuZ2UgPSByYW5nZSAvIDI7XG4gICAgY29uc3QgbWF4ID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwobWVhbiArIGhhbGZSYW5nZSk7XG4gICAgY29uc3QgbWluID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwobWVhbiAtIGhhbGZSYW5nZSk7XG4gICAgY29uc3QgeFBvcyA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoeCk7XG5cbiAgICB0aGlzLiRtYXguc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgJHttYXh9KWApO1xuICAgIHRoaXMuJG1pbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke21pbn0pYCk7XG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHt4UG9zfSwgMClgKTtcbiAgfVxuXG4gIGluQXJlYShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSwgeDEsIHkxLCB4MiwgeTIpIHtcbiAgICBjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLngoZGF0dW0pKTtcbiAgICBjb25zdCBtZWFuID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwodGhpcy5tZWFuKGRhdHVtKSk7XG4gICAgY29uc3QgcmFuZ2UgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aGlzLnJhbmdlKGRhdHVtKSk7XG4gICAgY29uc3QgbWluID0gbWVhbiAtIChyYW5nZSAvIDIpO1xuICAgIGNvbnN0IG1heCA9IG1lYW4gKyAocmFuZ2UgLyAyKTtcblxuICAgIGlmICh4ID4geDEgJiYgeCA8IHgyICYmIChtaW4gPiB5MSB8fCBtYXggPCB5MikpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIl19