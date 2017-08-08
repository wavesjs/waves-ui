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
        var x = renderingContext.timeToPixel(this.cx(datum));
        var y = renderingContext.valueToPixel(this.cy(datum)) - 0.5;
        path += x + ',' + y;

        if (i < length - 1) path += 'L';
      }

      this.$el.setAttributeNS(null, 'd', this._buildLine(renderingContext, data));
      this.$el.style.stroke = this.params.color;
      this.$el.style.fill = 'none';

      data = null;
    }
  }]);
  return Line;
}(_baseShape2.default);

exports.default = Line;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpbmUuanMiXSwibmFtZXMiOlsiTGluZSIsImN4IiwiY3kiLCJjb2xvciIsInJlbmRlcmluZ0NvbnRleHQiLCIkZWwiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnROUyIsIm5zIiwiZGF0YSIsInNsaWNlIiwic29ydCIsImEiLCJiIiwicGF0aCIsImxlbmd0aCIsImkiLCJ4IiwidGltZVRvUGl4ZWwiLCJkYXR1bSIsInkiLCJ2YWx1ZVRvUGl4ZWwiLCJzZXRBdHRyaWJ1dGVOUyIsIl9idWlsZExpbmUiLCJzdHlsZSIsInN0cm9rZSIsInBhcmFtcyIsImZpbGwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztBQUdBOzs7Ozs7SUFNTUEsSTs7Ozs7Ozs7OzttQ0FDVztBQUFFLGFBQU8sTUFBUDtBQUFnQjs7O3VDQUVkO0FBQ2pCLGFBQU8sRUFBRUMsSUFBSSxDQUFOLEVBQVNDLElBQUksQ0FBYixFQUFQO0FBQ0Q7OzttQ0FFYztBQUNiLGFBQU8sRUFBRUMsT0FBTyxTQUFULEVBQVA7QUFDRDs7OzJCQUVNQyxnQixFQUFrQjtBQUN2QixVQUFJLEtBQUtDLEdBQVQsRUFBYztBQUFFLGVBQU8sS0FBS0EsR0FBWjtBQUFrQjs7QUFFbEMsV0FBS0EsR0FBTCxHQUFXQyxTQUFTQyxlQUFULENBQXlCLEtBQUtDLEVBQTlCLEVBQWtDLE1BQWxDLENBQVg7QUFDQTtBQUNBLGFBQU8sS0FBS0gsR0FBWjtBQUNEOzs7MkJBRU1ELGdCLEVBQWtCSyxJLEVBQU07QUFBQTs7QUFDN0JBLGFBQU9BLEtBQUtDLEtBQUwsQ0FBVyxDQUFYLENBQVA7QUFDQUQsV0FBS0UsSUFBTCxDQUFVLFVBQUNDLENBQUQsRUFBSUMsQ0FBSjtBQUFBLGVBQVUsT0FBS1osRUFBTCxDQUFRVyxDQUFSLElBQWEsT0FBS1gsRUFBTCxDQUFRWSxDQUFSLENBQWIsR0FBMEIsQ0FBQyxDQUEzQixHQUErQixDQUF6QztBQUFBLE9BQVY7O0FBRUEsVUFBSUMsT0FBTyxHQUFYO0FBQ0EsVUFBTUMsU0FBU04sS0FBS00sTUFBcEI7O0FBRUEsV0FBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlELE1BQXBCLEVBQTRCQyxHQUE1QixFQUFpQztBQUMvQixZQUFNQyxJQUFJYixpQkFBaUJjLFdBQWpCLENBQTZCLEtBQUtqQixFQUFMLENBQVFrQixLQUFSLENBQTdCLENBQVY7QUFDQSxZQUFNQyxJQUFJaEIsaUJBQWlCaUIsWUFBakIsQ0FBOEIsS0FBS25CLEVBQUwsQ0FBUWlCLEtBQVIsQ0FBOUIsSUFBZ0QsR0FBMUQ7QUFDQUwsZ0JBQVdHLENBQVgsU0FBZ0JHLENBQWhCOztBQUVBLFlBQUlKLElBQUlELFNBQVMsQ0FBakIsRUFDRUQsUUFBUSxHQUFSO0FBQ0g7O0FBRUQsV0FBS1QsR0FBTCxDQUFTaUIsY0FBVCxDQUF3QixJQUF4QixFQUE4QixHQUE5QixFQUFtQyxLQUFLQyxVQUFMLENBQWdCbkIsZ0JBQWhCLEVBQWtDSyxJQUFsQyxDQUFuQztBQUNBLFdBQUtKLEdBQUwsQ0FBU21CLEtBQVQsQ0FBZUMsTUFBZixHQUF3QixLQUFLQyxNQUFMLENBQVl2QixLQUFwQztBQUNBLFdBQUtFLEdBQUwsQ0FBU21CLEtBQVQsQ0FBZUcsSUFBZixHQUFzQixNQUF0Qjs7QUFFQWxCLGFBQU8sSUFBUDtBQUNEOzs7OztrQkFHWVQsSSIsImZpbGUiOiJsaW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuL2Jhc2Utc2hhcGUnO1xuXG5cbi8qKlxuICogQSBzaGFwZSB0byBkaXNwbGF5IGEgbGluZS4gSXRzIG1haW4gdXNlIGlzIGFzIGNvbW1vbiBzaGFwZSB0byBjcmVhdGUgYVxuICogYnJlYWtwb2ludCB2aXN1YWxpemF0aW9uLiAoZW50aXR5IHNoYXBlKVxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLWJyZWFrcG9pbnQuaHRtbClcbiAqL1xuY2xhc3MgTGluZSBleHRlbmRzIEJhc2VTaGFwZSB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICdsaW5lJzsgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgcmV0dXJuIHsgY3g6IDAsIGN5OiAwIH07XG4gIH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHsgY29sb3I6ICcjMDAwMDAwJyB9O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy4kZWwpIHsgcmV0dXJuIHRoaXMuJGVsOyB9XG5cbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncGF0aCcpO1xuICAgIC8vIHRoaXMuZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdjcmlzcEVkZ2VzJyk7XG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdGEpIHtcbiAgICBkYXRhID0gZGF0YS5zbGljZSgwKTtcbiAgICBkYXRhLnNvcnQoKGEsIGIpID0+IHRoaXMuY3goYSkgPCB0aGlzLmN4KGIpID8gLTEgOiAxKTtcblxuICAgIGxldCBwYXRoID0gJ00nO1xuICAgIGNvbnN0IGxlbmd0aCA9IGRhdGEubGVuZ3RoO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy5jeChkYXR1bSkpO1xuICAgICAgY29uc3QgeSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHRoaXMuY3koZGF0dW0pKSAtIDAuNTtcbiAgICAgIHBhdGggKz0gYCR7eH0sJHt5fWA7XG5cbiAgICAgIGlmIChpIDwgbGVuZ3RoIC0gMSlcbiAgICAgICAgcGF0aCArPSAnTCc7XG4gICAgfVxuXG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCB0aGlzLl9idWlsZExpbmUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkpO1xuICAgIHRoaXMuJGVsLnN0eWxlLnN0cm9rZSA9IHRoaXMucGFyYW1zLmNvbG9yO1xuICAgIHRoaXMuJGVsLnN0eWxlLmZpbGwgPSAnbm9uZSc7XG5cbiAgICBkYXRhID0gbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBMaW5lO1xuIl19