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
 * A shape to display a line. Its main use is as common shape to create a
 * breakpoint visualization. (entity shape)
 *
 * [example usage](./examples/layer-breakpoint.html)
 */
var Line = function (_BaseShape) {
  (0, _inherits3.default)(Line, _BaseShape);

  function Line() {
    (0, _classCallCheck3.default)(this, Line);
    return (0, _possibleConstructorReturn3.default)(this, (Line.__proto__ || (0, _getPrototypeOf2.default)(Line)).apply(this, arguments));
  }

  (0, _createClass3.default)(Line, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'line';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return { cx: 0, cy: 0 };
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return { color: '#000000' };
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      if (this.$el) {
        return this.$el;
      }

      this.$el = document.createElementNS(this.ns, 'path');
      // this.el.setAttributeNS(null, 'shape-rendering', 'crispEdges');
      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, data) {
      var _this2 = this;

      data = data.slice(0);
      data.sort(function (a, b) {
        return _this2.cx(a) < _this2.cx(b) ? -1 : 1;
      });

      var path = 'M';
      var length = data.length;

      for (var i = 0; i < length; i++) {
        var datum = data[i];
        var x = renderingContext.timeToPixel(this.cx(datum));
        var y = renderingContext.valueToPixel(this.cy(datum)) - 0.5;
        path += x + ',' + y;

        if (i < length - 1) path += 'L';
      }

      this.$el.setAttributeNS(null, 'd', path);
      this.$el.style.stroke = this.params.color;
      this.$el.style.fill = 'none';

      data = null;
    }
  }]);
  return Line;
}(_BaseShape3.default);

exports.default = Line;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkxpbmUuanMiXSwibmFtZXMiOlsiTGluZSIsImN4IiwiY3kiLCJjb2xvciIsInJlbmRlcmluZ0NvbnRleHQiLCIkZWwiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnROUyIsIm5zIiwiZGF0YSIsInNsaWNlIiwic29ydCIsImEiLCJiIiwicGF0aCIsImxlbmd0aCIsImkiLCJkYXR1bSIsIngiLCJ0aW1lVG9QaXhlbCIsInkiLCJ2YWx1ZVRvUGl4ZWwiLCJzZXRBdHRyaWJ1dGVOUyIsInN0eWxlIiwic3Ryb2tlIiwicGFyYW1zIiwiZmlsbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBR0E7Ozs7OztJQU1NQSxJOzs7Ozs7Ozs7O21DQUNXO0FBQUUsYUFBTyxNQUFQO0FBQWdCOzs7dUNBRWQ7QUFDakIsYUFBTyxFQUFFQyxJQUFJLENBQU4sRUFBU0MsSUFBSSxDQUFiLEVBQVA7QUFDRDs7O21DQUVjO0FBQ2IsYUFBTyxFQUFFQyxPQUFPLFNBQVQsRUFBUDtBQUNEOzs7MkJBRU1DLGdCLEVBQWtCO0FBQ3ZCLFVBQUksS0FBS0MsR0FBVCxFQUFjO0FBQUUsZUFBTyxLQUFLQSxHQUFaO0FBQWtCOztBQUVsQyxXQUFLQSxHQUFMLEdBQVdDLFNBQVNDLGVBQVQsQ0FBeUIsS0FBS0MsRUFBOUIsRUFBa0MsTUFBbEMsQ0FBWDtBQUNBO0FBQ0EsYUFBTyxLQUFLSCxHQUFaO0FBQ0Q7OzsyQkFFTUQsZ0IsRUFBa0JLLEksRUFBTTtBQUFBOztBQUM3QkEsYUFBT0EsS0FBS0MsS0FBTCxDQUFXLENBQVgsQ0FBUDtBQUNBRCxXQUFLRSxJQUFMLENBQVUsVUFBQ0MsQ0FBRCxFQUFJQyxDQUFKO0FBQUEsZUFBVSxPQUFLWixFQUFMLENBQVFXLENBQVIsSUFBYSxPQUFLWCxFQUFMLENBQVFZLENBQVIsQ0FBYixHQUEwQixDQUFDLENBQTNCLEdBQStCLENBQXpDO0FBQUEsT0FBVjs7QUFFQSxVQUFJQyxPQUFPLEdBQVg7QUFDQSxVQUFNQyxTQUFTTixLQUFLTSxNQUFwQjs7QUFFQSxXQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSUQsTUFBcEIsRUFBNEJDLEdBQTVCLEVBQWlDO0FBQy9CLFlBQU1DLFFBQVFSLEtBQUtPLENBQUwsQ0FBZDtBQUNBLFlBQU1FLElBQUlkLGlCQUFpQmUsV0FBakIsQ0FBNkIsS0FBS2xCLEVBQUwsQ0FBUWdCLEtBQVIsQ0FBN0IsQ0FBVjtBQUNBLFlBQU1HLElBQUloQixpQkFBaUJpQixZQUFqQixDQUE4QixLQUFLbkIsRUFBTCxDQUFRZSxLQUFSLENBQTlCLElBQWdELEdBQTFEO0FBQ0FILGdCQUFXSSxDQUFYLFNBQWdCRSxDQUFoQjs7QUFFQSxZQUFJSixJQUFJRCxTQUFTLENBQWpCLEVBQ0VELFFBQVEsR0FBUjtBQUNIOztBQUVELFdBQUtULEdBQUwsQ0FBU2lCLGNBQVQsQ0FBd0IsSUFBeEIsRUFBOEIsR0FBOUIsRUFBbUNSLElBQW5DO0FBQ0EsV0FBS1QsR0FBTCxDQUFTa0IsS0FBVCxDQUFlQyxNQUFmLEdBQXdCLEtBQUtDLE1BQUwsQ0FBWXRCLEtBQXBDO0FBQ0EsV0FBS0UsR0FBTCxDQUFTa0IsS0FBVCxDQUFlRyxJQUFmLEdBQXNCLE1BQXRCOztBQUVBakIsYUFBTyxJQUFQO0FBQ0Q7Ozs7O2tCQUdZVCxJIiwiZmlsZSI6IkxpbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vQmFzZVNoYXBlJztcblxuXG4vKipcbiAqIEEgc2hhcGUgdG8gZGlzcGxheSBhIGxpbmUuIEl0cyBtYWluIHVzZSBpcyBhcyBjb21tb24gc2hhcGUgdG8gY3JlYXRlIGFcbiAqIGJyZWFrcG9pbnQgdmlzdWFsaXphdGlvbi4gKGVudGl0eSBzaGFwZSlcbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1icmVha3BvaW50Lmh0bWwpXG4gKi9cbmNsYXNzIExpbmUgZXh0ZW5kcyBCYXNlU2hhcGUge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAnbGluZSc7IH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIHJldHVybiB7IGN4OiAwLCBjeTogMCB9O1xuICB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7IGNvbG9yOiAnIzAwMDAwMCcgfTtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgaWYgKHRoaXMuJGVsKSB7IHJldHVybiB0aGlzLiRlbDsgfVxuXG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3BhdGgnKTtcbiAgICAvLyB0aGlzLmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXRhKSB7XG4gICAgZGF0YSA9IGRhdGEuc2xpY2UoMCk7XG4gICAgZGF0YS5zb3J0KChhLCBiKSA9PiB0aGlzLmN4KGEpIDwgdGhpcy5jeChiKSA/IC0xIDogMSk7XG5cbiAgICBsZXQgcGF0aCA9ICdNJztcbiAgICBjb25zdCBsZW5ndGggPSBkYXRhLmxlbmd0aDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGRhdHVtID0gZGF0YVtpXTtcbiAgICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMuY3goZGF0dW0pKTtcbiAgICAgIGNvbnN0IHkgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aGlzLmN5KGRhdHVtKSkgLSAwLjU7XG4gICAgICBwYXRoICs9IGAke3h9LCR7eX1gO1xuXG4gICAgICBpZiAoaSA8IGxlbmd0aCAtIDEpXG4gICAgICAgIHBhdGggKz0gJ0wnO1xuICAgIH1cblxuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgcGF0aCk7XG4gICAgdGhpcy4kZWwuc3R5bGUuc3Ryb2tlID0gdGhpcy5wYXJhbXMuY29sb3I7XG4gICAgdGhpcy4kZWwuc3R5bGUuZmlsbCA9ICdub25lJztcblxuICAgIGRhdGEgPSBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExpbmU7XG4iXX0=