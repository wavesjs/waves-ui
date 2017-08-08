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

var _namespace = require('../core/namespace');

var _namespace2 = _interopRequireDefault(_namespace);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A shape to display a cursor.
 *
 * [example usage](./examples/layer-cursor.html)
 */
var Cursor = function (_BaseShape) {
  (0, _inherits3.default)(Cursor, _BaseShape);

  function Cursor() {
    (0, _classCallCheck3.default)(this, Cursor);
    return (0, _possibleConstructorReturn3.default)(this, (Cursor.__proto__ || (0, _getPrototypeOf2.default)(Cursor)).apply(this, arguments));
  }

  (0, _createClass3.default)(Cursor, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'cursor';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return { x: 0 };
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {
        color: '#000000',
        opacity: 1
      };
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      this.$el = document.createElementNS(_namespace2.default, 'line');
      this.$el.setAttributeNS(null, 'x', 0);
      this.$el.setAttributeNS(null, 'y1', 0);
      this.$el.setAttributeNS(null, 'shape-rendering', 'crispEdges');
      this.$el.style.stroke = this.params.color;

      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, datum) {
      var floatX = renderingContext.timeToPixel(this.x(datum));
      var x = Math.round(floatX);

      this.$el.setAttributeNS(null, 'transform', 'translate(' + x + ', 0)');
      this.$el.setAttributeNS(null, 'y2', renderingContext.height);
    }

    /**
     * The cursor cannot be selected.
     * @return {Boolean} false
     */

  }, {
    key: 'inArea',
    value: function inArea() {
      return false;
    }
  }]);
  return Cursor;
}(_baseShape2.default);

exports.default = Cursor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1cnNvci5qcyJdLCJuYW1lcyI6WyJDdXJzb3IiLCJ4IiwiY29sb3IiLCJvcGFjaXR5IiwicmVuZGVyaW5nQ29udGV4dCIsIiRlbCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudE5TIiwic2V0QXR0cmlidXRlTlMiLCJzdHlsZSIsInN0cm9rZSIsInBhcmFtcyIsImRhdHVtIiwiZmxvYXRYIiwidGltZVRvUGl4ZWwiLCJNYXRoIiwicm91bmQiLCJoZWlnaHQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBR0E7Ozs7O0lBS01BLE07Ozs7Ozs7Ozs7bUNBQ1c7QUFBRSxhQUFPLFFBQVA7QUFBa0I7Ozt1Q0FFaEI7QUFDakIsYUFBTyxFQUFFQyxHQUFHLENBQUwsRUFBUDtBQUNEOzs7bUNBRWM7QUFDYixhQUFPO0FBQ0xDLGVBQU8sU0FERjtBQUVMQyxpQkFBUztBQUZKLE9BQVA7QUFJRDs7OzJCQUVNQyxnQixFQUFrQjtBQUN2QixXQUFLQyxHQUFMLEdBQVdDLFNBQVNDLGVBQVQsc0JBQTZCLE1BQTdCLENBQVg7QUFDQSxXQUFLRixHQUFMLENBQVNHLGNBQVQsQ0FBd0IsSUFBeEIsRUFBOEIsR0FBOUIsRUFBbUMsQ0FBbkM7QUFDQSxXQUFLSCxHQUFMLENBQVNHLGNBQVQsQ0FBd0IsSUFBeEIsRUFBOEIsSUFBOUIsRUFBb0MsQ0FBcEM7QUFDQSxXQUFLSCxHQUFMLENBQVNHLGNBQVQsQ0FBd0IsSUFBeEIsRUFBOEIsaUJBQTlCLEVBQWlELFlBQWpEO0FBQ0EsV0FBS0gsR0FBTCxDQUFTSSxLQUFULENBQWVDLE1BQWYsR0FBd0IsS0FBS0MsTUFBTCxDQUFZVCxLQUFwQzs7QUFFQSxhQUFPLEtBQUtHLEdBQVo7QUFDRDs7OzJCQUVNRCxnQixFQUFrQlEsSyxFQUFPO0FBQzlCLFVBQU1DLFNBQVNULGlCQUFpQlUsV0FBakIsQ0FBNkIsS0FBS2IsQ0FBTCxDQUFPVyxLQUFQLENBQTdCLENBQWY7QUFDQSxVQUFNWCxJQUFJYyxLQUFLQyxLQUFMLENBQVdILE1BQVgsQ0FBVjs7QUFFQSxXQUFLUixHQUFMLENBQVNHLGNBQVQsQ0FBd0IsSUFBeEIsRUFBOEIsV0FBOUIsaUJBQXdEUCxDQUF4RDtBQUNBLFdBQUtJLEdBQUwsQ0FBU0csY0FBVCxDQUF3QixJQUF4QixFQUE4QixJQUE5QixFQUFvQ0osaUJBQWlCYSxNQUFyRDtBQUNEOztBQUVEOzs7Ozs7OzZCQUlTO0FBQUUsYUFBTyxLQUFQO0FBQWU7Ozs7O2tCQUdiakIsTSIsImZpbGUiOiJjdXJzb3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vYmFzZS1zaGFwZSc7XG5pbXBvcnQgbnMgZnJvbSAnLi4vY29yZS9uYW1lc3BhY2UnO1xuXG5cbi8qKlxuICogQSBzaGFwZSB0byBkaXNwbGF5IGEgY3Vyc29yLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLWN1cnNvci5odG1sKVxuICovXG5jbGFzcyBDdXJzb3IgZXh0ZW5kcyBCYXNlU2hhcGUge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAnY3Vyc29yJzsgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgcmV0dXJuIHsgeDogMCB9O1xuICB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjb2xvcjogJyMwMDAwMDAnLFxuICAgICAgb3BhY2l0eTogMVxuICAgIH07XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnbGluZScpO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd4JywgMCk7XG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3kxJywgMCk7XG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdjcmlzcEVkZ2VzJyk7XG4gICAgdGhpcy4kZWwuc3R5bGUuc3Ryb2tlID0gdGhpcy5wYXJhbXMuY29sb3I7XG5cbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0pIHtcbiAgICBjb25zdCBmbG9hdFggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMueChkYXR1bSkpO1xuICAgIGNvbnN0IHggPSBNYXRoLnJvdW5kKGZsb2F0WCk7XG5cbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3h9LCAwKWApO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5MicsIHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgY3Vyc29yIGNhbm5vdCBiZSBzZWxlY3RlZC5cbiAgICogQHJldHVybiB7Qm9vbGVhbn0gZmFsc2VcbiAgICovXG4gIGluQXJlYSgpIHsgcmV0dXJuIGZhbHNlOyB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEN1cnNvcjtcbiJdfQ==