'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseShape = require('./base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

/**
 * A shape to display paths in a trace visualization (mean / range). (entity shape)
 *
 * [example usage](./examples/layer-trace.html)
 */

var TracePath = (function (_BaseShape) {
  _inherits(TracePath, _BaseShape);

  function TracePath() {
    _classCallCheck(this, TracePath);

    _get(Object.getPrototypeOf(TracePath.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(TracePath, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'trace-common';
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
        rangeColor: 'steelblue',
        meanColor: '#232323',
        displayMean: true
      };
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      if (this.$el) {
        return this.$el;
      }
      this.$el = document.createElementNS(this.ns, 'g');
      // range path
      this.$range = document.createElementNS(this.ns, 'path');
      this.$el.appendChild(this.$range);

      // mean line
      if (this.params.displayMean) {
        this.$mean = document.createElementNS(this.ns, 'path');
        this.$el.appendChild(this.$mean);
      }

      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, data) {
      var _this = this;

      // order data by x position
      data = data.slice(0);
      data.sort(function (a, b) {
        return _this.x(a) < _this.x(b) ? -1 : 1;
      });

      if (this.params.displayMean) {
        this.$mean.setAttributeNS(null, 'd', this._buildMeanLine(renderingContext, data));
        this.$mean.setAttributeNS(null, 'stroke', this.params.meanColor);
        this.$mean.setAttributeNS(null, 'fill', 'none');
      }

      this.$range.setAttributeNS(null, 'd', this._buildRangeZone(renderingContext, data));
      this.$range.setAttributeNS(null, 'stroke', 'none');
      this.$range.setAttributeNS(null, 'fill', this.params.rangeColor);
      this.$range.setAttributeNS(null, 'opacity', '0.4');

      data = null;
    }
  }, {
    key: '_buildMeanLine',
    value: function _buildMeanLine(renderingContext, data) {
      var _this2 = this;

      var instructions = data.map(function (datum, index) {
        var x = renderingContext.timeToPixel(_this2.x(datum));
        var y = renderingContext.valueToPixel(_this2.mean(datum));
        return x + ',' + y;
      });

      return 'M' + instructions.join('L');
    }
  }, {
    key: '_buildRangeZone',
    value: function _buildRangeZone(renderingContext, data) {
      var length = data.length;
      // const lastIndex = data
      var instructionsStart = '';
      var instructionsEnd = '';

      for (var i = 0; i < length; i++) {
        var datum = data[i];
        var mean = this.mean(datum);
        var halfRange = this.range(datum) / 2;

        var x = renderingContext.timeToPixel(this.x(datum));
        var y0 = renderingContext.valueToPixel(mean + halfRange);
        var y1 = renderingContext.valueToPixel(mean - halfRange);

        var start = x + ',' + y0;
        var end = x + ',' + y1;

        instructionsStart = instructionsStart === '' ? start : instructionsStart + 'L' + start;

        instructionsEnd = instructionsEnd === '' ? end : end + 'L' + instructionsEnd;
      }

      var instructions = 'M' + instructionsStart + 'L' + instructionsEnd + 'Z';
      return instructions;
    }
  }]);

  return TracePath;
})(_baseShape2['default']);

exports['default'] = TracePath;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zaGFwZXMvdHJhY2UtcGF0aC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3lCQUFzQixjQUFjOzs7Ozs7Ozs7O0lBUWYsU0FBUztZQUFULFNBQVM7O1dBQVQsU0FBUzswQkFBVCxTQUFTOzsrQkFBVCxTQUFTOzs7ZUFBVCxTQUFTOztXQUNoQix3QkFBRztBQUFFLGFBQU8sY0FBYyxDQUFDO0tBQUU7OztXQUV6Qiw0QkFBRztBQUNqQixhQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQztLQUNwQzs7O1dBRVcsd0JBQUc7QUFDYixhQUFPO0FBQ0wsa0JBQVUsRUFBRSxXQUFXO0FBQ3ZCLGlCQUFTLEVBQUUsU0FBUztBQUNwQixtQkFBVyxFQUFFLElBQUk7T0FDbEIsQ0FBQztLQUNIOzs7V0FFSyxnQkFBQyxnQkFBZ0IsRUFBRTtBQUN2QixVQUFJLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFBRSxlQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7T0FBRTtBQUNsQyxVQUFJLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQzs7QUFFbEQsVUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDeEQsVUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOzs7QUFHbEMsVUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRTtBQUMzQixZQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN2RCxZQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJ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QUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN2RCxZQUFNLEVBQUUsR0FBRyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxDQUFDO0FBQzNELFlBQU0sRUFBRSxHQUFHLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDLENBQUM7O0FBRTNELFlBQU0sS0FBSyxHQUFNLENBQUMsU0FBSSxFQUFFLEFBQUUsQ0FBQztBQUMzQixZQUFNLEdBQUcsR0FBUSxDQUFDLFNBQUksRUFBRSxBQUFFLENBQUM7O0FBRTNCLHlCQUFpQixHQUFHLGlCQUFpQixLQUFLLEVBQUUsR0FDMUMsS0FBSyxHQUFNLGlCQUFpQixTQUFJLEtBQUssQUFBRSxDQUFDOztBQUUxQyx1QkFBZSxHQUFHLGVBQWUsS0FBSyxFQUFFLEdBQ3RDLEdBQUcsR0FBTSxHQUFHLFNBQUksZUFBZSxBQUFFLENBQUM7T0FDckM7O0FBRUQsVUFBSSxZQUFZLFNBQU8saUJBQWlCLFNBQUksZUFBZSxNQUFHLENBQUM7QUFDL0QsYUFBTyxZQUFZLENBQUM7S0FDckI7OztTQXZGa0IsU0FBUzs7O3FCQUFULFNBQVMiLCJmaWxlIjoic3JjL3NoYXBlcy90cmFjZS1wYXRoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuL2Jhc2Utc2hhcGUnO1xuXG5cbi8qKlxuICogQSBzaGFwZSB0byBkaXNwbGF5IHBhdGhzIGluIGEgdHJhY2UgdmlzdWFsaXphdGlvbiAobWVhbiAvIHJhbmdlKS4gKGVudGl0eSBzaGFwZSlcbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci10cmFjZS5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmFjZVBhdGggZXh0ZW5kcyBCYXNlU2hhcGUge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAndHJhY2UtY29tbW9uJzsgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgcmV0dXJuIHsgeDogMCwgbWVhbjogMCwgcmFuZ2U6IDAgfTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmFuZ2VDb2xvcjogJ3N0ZWVsYmx1ZScsXG4gICAgICBtZWFuQ29sb3I6ICcjMjMyMzIzJyxcbiAgICAgIGRpc3BsYXlNZWFuOiB0cnVlXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgaWYgKHRoaXMuJGVsKSB7IHJldHVybiB0aGlzLiRlbDsgfVxuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdnJyk7XG4gICAgLy8gcmFuZ2UgcGF0aFxuICAgIHRoaXMuJHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdwYXRoJyk7XG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kcmFuZ2UpO1xuXG4gICAgLy8gbWVhbiBsaW5lXG4gICAgaWYgKHRoaXMucGFyYW1zLmRpc3BsYXlNZWFuKSB7XG4gICAgICB0aGlzLiRtZWFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdwYXRoJyk7XG4gICAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRtZWFuKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkge1xuICAgIC8vIG9yZGVyIGRhdGEgYnkgeCBwb3NpdGlvblxuICAgIGRhdGEgPSBkYXRhLnNsaWNlKDApO1xuICAgIGRhdGEuc29ydCgoYSwgYikgPT4gdGhpcy54KGEpIDwgdGhpcy54KGIpID8gLTEgOiAxKTtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5kaXNwbGF5TWVhbikge1xuICAgICAgdGhpcy4kbWVhbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZCcsIHRoaXMuX2J1aWxkTWVhbkxpbmUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkpO1xuICAgICAgdGhpcy4kbWVhbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlJywgdGhpcy5wYXJhbXMubWVhbkNvbG9yKTtcbiAgICAgIHRoaXMuJG1lYW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCAnbm9uZScpO1xuICAgIH1cblxuICAgIHRoaXMuJHJhbmdlLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgdGhpcy5fYnVpbGRSYW5nZVpvbmUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkpO1xuICAgIHRoaXMuJHJhbmdlLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2UnLCAnbm9uZScpO1xuICAgIHRoaXMuJHJhbmdlLnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgdGhpcy5wYXJhbXMucmFuZ2VDb2xvcik7XG4gICAgdGhpcy4kcmFuZ2Uuc2V0QXR0cmlidXRlTlMobnVsbCwgJ29wYWNpdHknLCAnMC40Jyk7XG5cbiAgICBkYXRhID0gbnVsbDtcbiAgfVxuXG4gIF9idWlsZE1lYW5MaW5lKHJlbmRlcmluZ0NvbnRleHQsIGRhdGEpIHtcbiAgICBsZXQgaW5zdHJ1Y3Rpb25zID0gZGF0YS5tYXAoKGRhdHVtLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy54KGRhdHVtKSk7XG4gICAgICBjb25zdCB5ID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwodGhpcy5tZWFuKGRhdHVtKSk7XG4gICAgICByZXR1cm4gYCR7eH0sJHt5fWA7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gJ00nICsgaW5zdHJ1Y3Rpb25zLmpvaW4oJ0wnKTtcbiAgfVxuXG4gIF9idWlsZFJhbmdlWm9uZShyZW5kZXJpbmdDb250ZXh0LCBkYXRhKSB7XG4gICAgY29uc3QgbGVuZ3RoID0gZGF0YS5sZW5ndGg7XG4gICAgLy8gY29uc3QgbGFzdEluZGV4ID0gZGF0YVxuICAgIGxldCBpbnN0cnVjdGlvbnNTdGFydCA9ICcnO1xuICAgIGxldCBpbnN0cnVjdGlvbnNFbmQgPSAnJztcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGRhdHVtID0gZGF0YVtpXTtcbiAgICAgIGNvbnN0IG1lYW4gPSB0aGlzLm1lYW4oZGF0dW0pO1xuICAgICAgY29uc3QgaGFsZlJhbmdlID0gdGhpcy5yYW5nZShkYXR1bSkgLyAyO1xuXG4gICAgICBjb25zdCB4ICA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy54KGRhdHVtKSk7XG4gICAgICBjb25zdCB5MCA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKG1lYW4gKyBoYWxmUmFuZ2UpO1xuICAgICAgY29uc3QgeTEgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChtZWFuIC0gaGFsZlJhbmdlKTtcblxuICAgICAgY29uc3Qgc3RhcnQgPSBgJHt4fSwke3kwfWA7XG4gICAgICBjb25zdCBlbmQgICA9IGAke3h9LCR7eTF9YDtcblxuICAgICAgaW5zdHJ1Y3Rpb25zU3RhcnQgPSBpbnN0cnVjdGlvbnNTdGFydCA9PT0gJycgP1xuICAgICAgICBzdGFydCA6IGAke2luc3RydWN0aW9uc1N0YXJ0fUwke3N0YXJ0fWA7XG5cbiAgICAgIGluc3RydWN0aW9uc0VuZCA9IGluc3RydWN0aW9uc0VuZCA9PT0gJycgP1xuICAgICAgICBlbmQgOiBgJHtlbmR9TCR7aW5zdHJ1Y3Rpb25zRW5kfWA7XG4gICAgfVxuXG4gICAgbGV0IGluc3RydWN0aW9ucyA9IGBNJHtpbnN0cnVjdGlvbnNTdGFydH1MJHtpbnN0cnVjdGlvbnNFbmR9WmA7XG4gICAgcmV0dXJuIGluc3RydWN0aW9ucztcbiAgfVxufVxuIl19