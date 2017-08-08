'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _baseShape = require('./base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A shape to display paths in a trace visualization (mean / range). (entity shape)
 *
 * [example usage](./examples/layer-trace.html)
 */
var TracePath = function (_BaseShape) {
  (0, _inherits3.default)(TracePath, _BaseShape);

  function TracePath() {
    (0, _classCallCheck3.default)(this, TracePath);
    return (0, _possibleConstructorReturn3.default)(this, (TracePath.__proto__ || (0, _getPrototypeOf2.default)(TracePath)).apply(this, arguments));
  }

  (0, _createClass3.default)(TracePath, [{
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
      var _this2 = this;

      // order data by x position
      data = data.slice(0);
      data.sort(function (a, b) {
        return _this2.x(a) < _this2.x(b) ? -1 : 1;
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
      var _this3 = this;

      var instructions = data.map(function (datum, index) {
        var x = renderingContext.timeToPixel(_this3.x(datum));
        var y = renderingContext.valueToPixel(_this3.mean(datum));
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
}(_baseShape2.default);

exports.default = TracePath;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRyYWNlLXBhdGguanMiXSwibmFtZXMiOlsiVHJhY2VQYXRoIiwieCIsIm1lYW4iLCJyYW5nZSIsInJhbmdlQ29sb3IiLCJtZWFuQ29sb3IiLCJkaXNwbGF5TWVhbiIsInJlbmRlcmluZ0NvbnRleHQiLCIkZWwiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnROUyIsIm5zIiwiJHJhbmdlIiwiYXBwZW5kQ2hpbGQiLCJwYXJhbXMiLCIkbWVhbiIsImRhdGEiLCJzbGljZSIsInNvcnQiLCJhIiwiYiIsInNldEF0dHJpYnV0ZU5TIiwiX2J1aWxkTWVhbkxpbmUiLCJfYnVpbGRSYW5nZVpvbmUiLCJpbnN0cnVjdGlvbnMiLCJtYXAiLCJkYXR1bSIsImluZGV4IiwidGltZVRvUGl4ZWwiLCJ5IiwidmFsdWVUb1BpeGVsIiwiam9pbiIsImxlbmd0aCIsImluc3RydWN0aW9uc1N0YXJ0IiwiaW5zdHJ1Y3Rpb25zRW5kIiwiaSIsImhhbGZSYW5nZSIsInkwIiwieTEiLCJzdGFydCIsImVuZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBR0E7Ozs7O0lBS3FCQSxTOzs7Ozs7Ozs7O21DQUNKO0FBQUUsYUFBTyxjQUFQO0FBQXdCOzs7dUNBRXRCO0FBQ2pCLGFBQU8sRUFBRUMsR0FBRyxDQUFMLEVBQVFDLE1BQU0sQ0FBZCxFQUFpQkMsT0FBTyxDQUF4QixFQUFQO0FBQ0Q7OzttQ0FFYztBQUNiLGFBQU87QUFDTEMsb0JBQVksV0FEUDtBQUVMQyxtQkFBVyxTQUZOO0FBR0xDLHFCQUFhO0FBSFIsT0FBUDtBQUtEOzs7MkJBRU1DLGdCLEVBQWtCO0FBQ3ZCLFVBQUksS0FBS0MsR0FBVCxFQUFjO0FBQUUsZUFBTyxLQUFLQSxHQUFaO0FBQWtCO0FBQ2xDLFdBQUtBLEdBQUwsR0FBV0MsU0FBU0MsZUFBVCxDQUF5QixLQUFLQyxFQUE5QixFQUFrQyxHQUFsQyxDQUFYO0FBQ0E7QUFDQSxXQUFLQyxNQUFMLEdBQWNILFNBQVND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QixXQUFqQixDQUE2QixLQUFLM0IsQ0FBTCxDQUFPeUIsS0FBUCxDQUE3QixDQUFYO0FBQ0EsWUFBTVcsS0FBSzlCLGlCQUFpQnVCLFlBQWpCLENBQThCNUIsT0FBT2tDLFNBQXJDLENBQVg7QUFDQSxZQUFNRSxLQUFLL0IsaUJBQWlCdUIsWUFBakIsQ0FBOEI1QixPQUFPa0MsU0FBckMsQ0FBWDs7QUFFQSxZQUFNRyxRQUFXdEMsQ0FBWCxTQUFnQm9DLEVBQXRCO0FBQ0EsWUFBTUcsTUFBV3ZDLENBQVgsU0FBZ0JxQyxFQUF0Qjs7QUFFQUwsNEJBQW9CQSxzQkFBc0IsRUFBdEIsR0FDbEJNLEtBRGtCLEdBQ1BOLGlCQURPLFNBQ2NNLEtBRGxDOztBQUdBTCwwQkFBa0JBLG9CQUFvQixFQUFwQixHQUNoQk0sR0FEZ0IsR0FDUEEsR0FETyxTQUNBTixlQURsQjtBQUVEOztBQUVELFVBQUlWLHFCQUFtQlMsaUJBQW5CLFNBQXdDQyxlQUF4QyxNQUFKO0FBQ0EsYUFBT1YsWUFBUDtBQUNEOzs7OztrQkF2RmtCeEIsUyIsImZpbGUiOiJ0cmFjZS1wYXRoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuL2Jhc2Utc2hhcGUnO1xuXG5cbi8qKlxuICogQSBzaGFwZSB0byBkaXNwbGF5IHBhdGhzIGluIGEgdHJhY2UgdmlzdWFsaXphdGlvbiAobWVhbiAvIHJhbmdlKS4gKGVudGl0eSBzaGFwZSlcbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci10cmFjZS5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmFjZVBhdGggZXh0ZW5kcyBCYXNlU2hhcGUge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAndHJhY2UtY29tbW9uJzsgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgcmV0dXJuIHsgeDogMCwgbWVhbjogMCwgcmFuZ2U6IDAgfTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmFuZ2VDb2xvcjogJ3N0ZWVsYmx1ZScsXG4gICAgICBtZWFuQ29sb3I6ICcjMjMyMzIzJyxcbiAgICAgIGRpc3BsYXlNZWFuOiB0cnVlXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgaWYgKHRoaXMuJGVsKSB7IHJldHVybiB0aGlzLiRlbDsgfVxuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdnJyk7XG4gICAgLy8gcmFuZ2UgcGF0aFxuICAgIHRoaXMuJHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdwYXRoJyk7XG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kcmFuZ2UpO1xuXG4gICAgLy8gbWVhbiBsaW5lXG4gICAgaWYgKHRoaXMucGFyYW1zLmRpc3BsYXlNZWFuKSB7XG4gICAgICB0aGlzLiRtZWFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdwYXRoJyk7XG4gICAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRtZWFuKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkge1xuICAgIC8vIG9yZGVyIGRhdGEgYnkgeCBwb3NpdGlvblxuICAgIGRhdGEgPSBkYXRhLnNsaWNlKDApO1xuICAgIGRhdGEuc29ydCgoYSwgYikgPT4gdGhpcy54KGEpIDwgdGhpcy54KGIpID8gLTEgOiAxKTtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5kaXNwbGF5TWVhbikge1xuICAgICAgdGhpcy4kbWVhbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZCcsIHRoaXMuX2J1aWxkTWVhbkxpbmUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkpO1xuICAgICAgdGhpcy4kbWVhbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlJywgdGhpcy5wYXJhbXMubWVhbkNvbG9yKTtcbiAgICAgIHRoaXMuJG1lYW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCAnbm9uZScpO1xuICAgIH1cblxuICAgIHRoaXMuJHJhbmdlLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgdGhpcy5fYnVpbGRSYW5nZVpvbmUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkpO1xuICAgIHRoaXMuJHJhbmdlLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2UnLCAnbm9uZScpO1xuICAgIHRoaXMuJHJhbmdlLnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgdGhpcy5wYXJhbXMucmFuZ2VDb2xvcik7XG4gICAgdGhpcy4kcmFuZ2Uuc2V0QXR0cmlidXRlTlMobnVsbCwgJ29wYWNpdHknLCAnMC40Jyk7XG5cbiAgICBkYXRhID0gbnVsbDtcbiAgfVxuXG4gIF9idWlsZE1lYW5MaW5lKHJlbmRlcmluZ0NvbnRleHQsIGRhdGEpIHtcbiAgICBsZXQgaW5zdHJ1Y3Rpb25zID0gZGF0YS5tYXAoKGRhdHVtLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy54KGRhdHVtKSk7XG4gICAgICBjb25zdCB5ID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwodGhpcy5tZWFuKGRhdHVtKSk7XG4gICAgICByZXR1cm4gYCR7eH0sJHt5fWA7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gJ00nICsgaW5zdHJ1Y3Rpb25zLmpvaW4oJ0wnKTtcbiAgfVxuXG4gIF9idWlsZFJhbmdlWm9uZShyZW5kZXJpbmdDb250ZXh0LCBkYXRhKSB7XG4gICAgY29uc3QgbGVuZ3RoID0gZGF0YS5sZW5ndGg7XG4gICAgLy8gY29uc3QgbGFzdEluZGV4ID0gZGF0YVxuICAgIGxldCBpbnN0cnVjdGlvbnNTdGFydCA9ICcnO1xuICAgIGxldCBpbnN0cnVjdGlvbnNFbmQgPSAnJztcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGRhdHVtID0gZGF0YVtpXTtcbiAgICAgIGNvbnN0IG1lYW4gPSB0aGlzLm1lYW4oZGF0dW0pO1xuICAgICAgY29uc3QgaGFsZlJhbmdlID0gdGhpcy5yYW5nZShkYXR1bSkgLyAyO1xuXG4gICAgICBjb25zdCB4ICA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy54KGRhdHVtKSk7XG4gICAgICBjb25zdCB5MCA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKG1lYW4gKyBoYWxmUmFuZ2UpO1xuICAgICAgY29uc3QgeTEgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChtZWFuIC0gaGFsZlJhbmdlKTtcblxuICAgICAgY29uc3Qgc3RhcnQgPSBgJHt4fSwke3kwfWA7XG4gICAgICBjb25zdCBlbmQgICA9IGAke3h9LCR7eTF9YDtcblxuICAgICAgaW5zdHJ1Y3Rpb25zU3RhcnQgPSBpbnN0cnVjdGlvbnNTdGFydCA9PT0gJycgP1xuICAgICAgICBzdGFydCA6IGAke2luc3RydWN0aW9uc1N0YXJ0fUwke3N0YXJ0fWA7XG5cbiAgICAgIGluc3RydWN0aW9uc0VuZCA9IGluc3RydWN0aW9uc0VuZCA9PT0gJycgP1xuICAgICAgICBlbmQgOiBgJHtlbmR9TCR7aW5zdHJ1Y3Rpb25zRW5kfWA7XG4gICAgfVxuXG4gICAgbGV0IGluc3RydWN0aW9ucyA9IGBNJHtpbnN0cnVjdGlvbnNTdGFydH1MJHtpbnN0cnVjdGlvbnNFbmR9WmA7XG4gICAgcmV0dXJuIGluc3RydWN0aW9ucztcbiAgfVxufVxuIl19