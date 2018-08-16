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

var _BaseShape2 = require('./BaseShape');

var _BaseShape3 = _interopRequireDefault(_BaseShape2);

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
}(_BaseShape3.default);

exports.default = TracePath;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRyYWNlUGF0aC5qcyJdLCJuYW1lcyI6WyJUcmFjZVBhdGgiLCJ4IiwibWVhbiIsInJhbmdlIiwicmFuZ2VDb2xvciIsIm1lYW5Db2xvciIsImRpc3BsYXlNZWFuIiwicmVuZGVyaW5nQ29udGV4dCIsIiRlbCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudE5TIiwibnMiLCIkcmFuZ2UiLCJhcHBlbmRDaGlsZCIsInBhcmFtcyIsIiRtZWFuIiwiZGF0YSIsInNsaWNlIiwic29ydCIsImEiLCJiIiwic2V0QXR0cmlidXRlTlMiLCJfYnVpbGRNZWFuTGluZSIsIl9idWlsZFJhbmdlWm9uZSIsImluc3RydWN0aW9ucyIsIm1hcCIsImRhdHVtIiwiaW5kZXgiLCJ0aW1lVG9QaXhlbCIsInkiLCJ2YWx1ZVRvUGl4ZWwiLCJqb2luIiwibGVuZ3RoIiwiaW5zdHJ1Y3Rpb25zU3RhcnQiLCJpbnN0cnVjdGlvbnNFbmQiLCJpIiwiaGFsZlJhbmdlIiwieTAiLCJ5MSIsInN0YXJ0IiwiZW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFHQTs7Ozs7SUFLTUEsUzs7Ozs7Ozs7OzttQ0FDVztBQUFFLGFBQU8sY0FBUDtBQUF3Qjs7O3VDQUV0QjtBQUNqQixhQUFPLEVBQUVDLEdBQUcsQ0FBTCxFQUFRQyxNQUFNLENBQWQsRUFBaUJDLE9BQU8sQ0FBeEIsRUFBUDtBQUNEOzs7bUNBRWM7QUFDYixhQUFPO0FBQ0xDLG9CQUFZLFdBRFA7QUFFTEMsbUJBQVcsU0FGTjtBQUdMQyxxQkFBYTtBQUhSLE9BQVA7QUFLRDs7OzJCQUVNQyxnQixFQUFrQjtBQUN2QixVQUFJLEtBQUtDLEdBQVQsRUFBYztBQUFFLGVBQU8sS0FBS0EsR0FBWjtBQUFrQjtBQUNsQyxXQUFLQSxHQUFMLEdBQVdDLFNBQVNDLGVBQVQsQ0FBeUIsS0FBS0MsRUFBOUIsRUFBa0MsR0FBbEMsQ0FBWDtBQUNBO0FBQ0EsV0FBS0MsTUFBTCxHQUFjSCxTQUFTQyxlQUFULENBQXlCLEtBQUtDLEVBQTlCLEVBQWtDLE1BQWxDLENBQWQ7QUFDQSxXQUFLSCxHQUFMLENBQVNLLFdBQVQsQ0FBcUIsS0FBS0QsTUFBMUI7O0FBRUE7QUFDQSxVQUFJLEtBQUtFLE1BQUwsQ0FBWVIsV0FBaEIsRUFBNkI7QUFDM0IsYUFBS1MsS0FBTCxHQUFhTixTQUFTQyxlQUFULENBQXlCLEtBQUtDLEVBQTlCLEVBQWtDLE1BQWxDLENBQWI7QUFDQSxhQUFLSCxHQUFMLENBQVNLLFdBQVQsQ0FBcUIsS0FBS0UsS0FBMUI7QUFDRDs7QUFFRCxhQUFPLEtBQUtQLEdBQVo7QUFDRDs7OzJCQUVNRCxnQixFQUFrQlMsSSxFQUFNO0FBQUE7O0FBQzdCO0FBQ0FBLGFBQU9BLEtBQUtDLEtBQUwsQ0FBVyxDQUFYLENBQVA7QUFDQUQsV0FBS0UsSUFBTCxDQUFVLFVBQUNDLENBQUQsRUFBSUMsQ0FBSjtBQUFBLGVBQVUsT0FBS25CLENBQUwsQ0FBT2tCLENBQVAsSUFBWSxPQUFLbEIsQ0FBTCxDQUFPbUIsQ0FBUCxDQUFaLEdBQXdCLENBQUMsQ0FBekIsR0FBNkIsQ0FBdkM7QUFBQSxPQUFWOztBQUVBLFVBQUksS0FBS04sTUFBTCxDQUFZUixXQUFoQixFQUE2QjtBQUMzQixhQUFLUyxLQUFMLENBQVdNLGNBQVgsQ0FBMEIsSUFBMUIsRUFBZ0MsR0FBaEMsRUFBcUMsS0FBS0MsY0FBTCxDQUFvQmYsZ0JBQXBCLEVBQXNDUyxJQUF0QyxDQUFyQztBQUNBLGFBQUtELEtBQUwsQ0FBV00sY0FBWCxDQUEwQixJQUExQixFQUFnQyxRQUFoQyxFQUEwQyxLQUFLUCxNQUFMLENBQVlULFNBQXREO0FBQ0EsYUFBS1UsS0FBTCxDQUFXTSxjQUFYLENBQTBCLElBQTFCLEVBQWdDLE1BQWhDLEVBQXdDLE1BQXhDO0FBQ0Q7O0FBRUQsV0FBS1QsTUFBTCxDQUFZUyxjQUFaLENBQTJCLElBQTNCLEVBQWlDLEdBQWpDLEVBQXNDLEtBQUtFLGVBQUwsQ0FBcUJoQixnQkFBckIsRUFBdUNTLElBQXZDLENBQXRDO0FBQ0EsV0FBS0osTUFBTCxDQUFZUyxjQUFaLENBQTJCLElBQTNCLEVBQWlDLFFBQWpDLEVBQTJDLE1BQTNDO0FBQ0EsV0FBS1QsTUFBTCxDQUFZUyxjQUFaLENBQTJCLElBQTNCLEVBQWlDLE1BQWpDLEVBQXlDLEtBQUtQLE1BQUwsQ0FBWVYsVUFBckQ7QUFDQSxXQUFLUSxNQUFMLENBQVlTLGNBQVosQ0FBMkIsSUFBM0IsRUFBaUMsU0FBakMsRUFBNEMsS0FBNUM7O0FBRUFMLGFBQU8sSUFBUDtBQUNEOzs7bUNBRWNULGdCLEVBQWtCUyxJLEVBQU07QUFBQTs7QUFDckMsVUFBSVEsZUFBZVIsS0FBS1MsR0FBTCxDQUFTLFVBQUNDLEtBQUQsRUFBUUMsS0FBUixFQUFrQjtBQUM1QyxZQUFNMUIsSUFBSU0saUJBQWlCcUIsV0FBakIsQ0FBNkIsT0FBSzNCLENBQUwsQ0FBT3lCLEtBQVAsQ0FBN0IsQ0FBVjtBQUNBLFlBQU1HLElBQUl0QixpQkFBaUJ1QixZQUFqQixDQUE4QixPQUFLNUIsSUFBTCxDQUFVd0IsS0FBVixDQUE5QixDQUFWO0FBQ0EsZUFBVXpCLENBQVYsU0FBZTRCLENBQWY7QUFDRCxPQUprQixDQUFuQjs7QUFNQSxhQUFPLE1BQU1MLGFBQWFPLElBQWIsQ0FBa0IsR0FBbEIsQ0FBYjtBQUNEOzs7b0NBRWV4QixnQixFQUFrQlMsSSxFQUFNO0FBQ3RDLFVBQU1nQixTQUFTaEIsS0FBS2dCLE1BQXBCO0FBQ0E7QUFDQSxVQUFJQyxvQkFBb0IsRUFBeEI7QUFDQSxVQUFJQyxrQkFBa0IsRUFBdEI7O0FBRUEsV0FBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlILE1BQXBCLEVBQTRCRyxHQUE1QixFQUFpQztBQUMvQixZQUFNVCxRQUFRVixLQUFLbUIsQ0FBTCxDQUFkO0FBQ0EsWUFBTWpDLE9BQU8sS0FBS0EsSUFBTCxDQUFVd0IsS0FBVixDQUFiO0FBQ0EsWUFBTVUsWUFBWSxLQUFLakMsS0FBTCxDQUFXdUIsS0FBWCxJQUFvQixDQUF0Qzs7QUFFQSxZQUFNekIsSUFBS00saUJBQWlCcUIsV0FBakIsQ0FBNkIsS0FBSzNCLENBQUwsQ0FBT3lCLEtBQVAsQ0FBN0IsQ0FBWDtBQUNBLFlBQU1XLEtBQUs5QixpQkFBaUJ1QixZQUFqQixDQUE4QjVCLE9BQU9rQyxTQUFyQyxDQUFYO0FBQ0EsWUFBTUUsS0FBSy9CLGlCQUFpQnVCLFlBQWpCLENBQThCNUIsT0FBT2tDLFNBQXJDLENBQVg7O0FBRUEsWUFBTUcsUUFBV3RDLENBQVgsU0FBZ0JvQyxFQUF0QjtBQUNBLFlBQU1HLE1BQVd2QyxDQUFYLFNBQWdCcUMsRUFBdEI7O0FBRUFMLDRCQUFvQkEsc0JBQXNCLEVBQXRCLEdBQ2xCTSxLQURrQixHQUNQTixpQkFETyxTQUNjTSxLQURsQzs7QUFHQUwsMEJBQWtCQSxvQkFBb0IsRUFBcEIsR0FDaEJNLEdBRGdCLEdBQ1BBLEdBRE8sU0FDQU4sZUFEbEI7QUFFRDs7QUFFRCxVQUFJVixxQkFBbUJTLGlCQUFuQixTQUF3Q0MsZUFBeEMsTUFBSjtBQUNBLGFBQU9WLFlBQVA7QUFDRDs7Ozs7a0JBR1l4QixTIiwiZmlsZSI6IlRyYWNlUGF0aC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9CYXNlU2hhcGUnO1xuXG5cbi8qKlxuICogQSBzaGFwZSB0byBkaXNwbGF5IHBhdGhzIGluIGEgdHJhY2UgdmlzdWFsaXphdGlvbiAobWVhbiAvIHJhbmdlKS4gKGVudGl0eSBzaGFwZSlcbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci10cmFjZS5odG1sKVxuICovXG5jbGFzcyBUcmFjZVBhdGggZXh0ZW5kcyBCYXNlU2hhcGUge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAndHJhY2UtY29tbW9uJzsgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgcmV0dXJuIHsgeDogMCwgbWVhbjogMCwgcmFuZ2U6IDAgfTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmFuZ2VDb2xvcjogJ3N0ZWVsYmx1ZScsXG4gICAgICBtZWFuQ29sb3I6ICcjMjMyMzIzJyxcbiAgICAgIGRpc3BsYXlNZWFuOiB0cnVlXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgaWYgKHRoaXMuJGVsKSB7IHJldHVybiB0aGlzLiRlbDsgfVxuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdnJyk7XG4gICAgLy8gcmFuZ2UgcGF0aFxuICAgIHRoaXMuJHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdwYXRoJyk7XG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kcmFuZ2UpO1xuXG4gICAgLy8gbWVhbiBsaW5lXG4gICAgaWYgKHRoaXMucGFyYW1zLmRpc3BsYXlNZWFuKSB7XG4gICAgICB0aGlzLiRtZWFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdwYXRoJyk7XG4gICAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRtZWFuKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkge1xuICAgIC8vIG9yZGVyIGRhdGEgYnkgeCBwb3NpdGlvblxuICAgIGRhdGEgPSBkYXRhLnNsaWNlKDApO1xuICAgIGRhdGEuc29ydCgoYSwgYikgPT4gdGhpcy54KGEpIDwgdGhpcy54KGIpID8gLTEgOiAxKTtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5kaXNwbGF5TWVhbikge1xuICAgICAgdGhpcy4kbWVhbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZCcsIHRoaXMuX2J1aWxkTWVhbkxpbmUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkpO1xuICAgICAgdGhpcy4kbWVhbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlJywgdGhpcy5wYXJhbXMubWVhbkNvbG9yKTtcbiAgICAgIHRoaXMuJG1lYW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCAnbm9uZScpO1xuICAgIH1cblxuICAgIHRoaXMuJHJhbmdlLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgdGhpcy5fYnVpbGRSYW5nZVpvbmUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkpO1xuICAgIHRoaXMuJHJhbmdlLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2UnLCAnbm9uZScpO1xuICAgIHRoaXMuJHJhbmdlLnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgdGhpcy5wYXJhbXMucmFuZ2VDb2xvcik7XG4gICAgdGhpcy4kcmFuZ2Uuc2V0QXR0cmlidXRlTlMobnVsbCwgJ29wYWNpdHknLCAnMC40Jyk7XG5cbiAgICBkYXRhID0gbnVsbDtcbiAgfVxuXG4gIF9idWlsZE1lYW5MaW5lKHJlbmRlcmluZ0NvbnRleHQsIGRhdGEpIHtcbiAgICBsZXQgaW5zdHJ1Y3Rpb25zID0gZGF0YS5tYXAoKGRhdHVtLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy54KGRhdHVtKSk7XG4gICAgICBjb25zdCB5ID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwodGhpcy5tZWFuKGRhdHVtKSk7XG4gICAgICByZXR1cm4gYCR7eH0sJHt5fWA7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gJ00nICsgaW5zdHJ1Y3Rpb25zLmpvaW4oJ0wnKTtcbiAgfVxuXG4gIF9idWlsZFJhbmdlWm9uZShyZW5kZXJpbmdDb250ZXh0LCBkYXRhKSB7XG4gICAgY29uc3QgbGVuZ3RoID0gZGF0YS5sZW5ndGg7XG4gICAgLy8gY29uc3QgbGFzdEluZGV4ID0gZGF0YVxuICAgIGxldCBpbnN0cnVjdGlvbnNTdGFydCA9ICcnO1xuICAgIGxldCBpbnN0cnVjdGlvbnNFbmQgPSAnJztcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGRhdHVtID0gZGF0YVtpXTtcbiAgICAgIGNvbnN0IG1lYW4gPSB0aGlzLm1lYW4oZGF0dW0pO1xuICAgICAgY29uc3QgaGFsZlJhbmdlID0gdGhpcy5yYW5nZShkYXR1bSkgLyAyO1xuXG4gICAgICBjb25zdCB4ICA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy54KGRhdHVtKSk7XG4gICAgICBjb25zdCB5MCA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKG1lYW4gKyBoYWxmUmFuZ2UpO1xuICAgICAgY29uc3QgeTEgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChtZWFuIC0gaGFsZlJhbmdlKTtcblxuICAgICAgY29uc3Qgc3RhcnQgPSBgJHt4fSwke3kwfWA7XG4gICAgICBjb25zdCBlbmQgICA9IGAke3h9LCR7eTF9YDtcblxuICAgICAgaW5zdHJ1Y3Rpb25zU3RhcnQgPSBpbnN0cnVjdGlvbnNTdGFydCA9PT0gJycgP1xuICAgICAgICBzdGFydCA6IGAke2luc3RydWN0aW9uc1N0YXJ0fUwke3N0YXJ0fWA7XG5cbiAgICAgIGluc3RydWN0aW9uc0VuZCA9IGluc3RydWN0aW9uc0VuZCA9PT0gJycgP1xuICAgICAgICBlbmQgOiBgJHtlbmR9TCR7aW5zdHJ1Y3Rpb25zRW5kfWA7XG4gICAgfVxuXG4gICAgbGV0IGluc3RydWN0aW9ucyA9IGBNJHtpbnN0cnVjdGlvbnNTdGFydH1MJHtpbnN0cnVjdGlvbnNFbmR9WmA7XG4gICAgcmV0dXJuIGluc3RydWN0aW9ucztcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUcmFjZVBhdGg7XG4iXX0=