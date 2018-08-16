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
}(_BaseShape3.default);

exports.default = Cursor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1cnNvci5qcyJdLCJuYW1lcyI6WyJDdXJzb3IiLCJ4IiwiY29sb3IiLCJvcGFjaXR5IiwicmVuZGVyaW5nQ29udGV4dCIsIiRlbCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudE5TIiwic2V0QXR0cmlidXRlTlMiLCJzdHlsZSIsInN0cm9rZSIsInBhcmFtcyIsImRhdHVtIiwiZmxvYXRYIiwidGltZVRvUGl4ZWwiLCJNYXRoIiwicm91bmQiLCJoZWlnaHQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBR0E7Ozs7O0lBS01BLE07Ozs7Ozs7Ozs7bUNBQ1c7QUFBRSxhQUFPLFFBQVA7QUFBa0I7Ozt1Q0FFaEI7QUFDakIsYUFBTyxFQUFFQyxHQUFHLENBQUwsRUFBUDtBQUNEOzs7bUNBRWM7QUFDYixhQUFPO0FBQ0xDLGVBQU8sU0FERjtBQUVMQyxpQkFBUztBQUZKLE9BQVA7QUFJRDs7OzJCQUVNQyxnQixFQUFrQjtBQUN2QixXQUFLQyxHQUFMLEdBQVdDLFNBQVNDLGVBQVQsc0JBQTZCLE1BQTdCLENBQVg7QUFDQSxXQUFLRixHQUFMLENBQVNHLGNBQVQsQ0FBd0IsSUFBeEIsRUFBOEIsR0FBOUIsRUFBbUMsQ0FBbkM7QUFDQSxXQUFLSCxHQUFMLENBQVNHLGNBQVQsQ0FBd0IsSUFBeEIsRUFBOEIsSUFBOUIsRUFBb0MsQ0FBcEM7QUFDQSxXQUFLSCxHQUFMLENBQVNHLGNBQVQsQ0FBd0IsSUFBeEIsRUFBOEIsaUJBQTlCLEVBQWlELFlBQWpEO0FBQ0EsV0FBS0gsR0FBTCxDQUFTSSxLQUFULENBQWVDLE1BQWYsR0FBd0IsS0FBS0MsTUFBTCxDQUFZVCxLQUFwQzs7QUFFQSxhQUFPLEtBQUtHLEdBQVo7QUFDRDs7OzJCQUVNRCxnQixFQUFrQlEsSyxFQUFPO0FBQzlCLFVBQU1DLFNBQVNULGlCQUFpQlUsV0FBakIsQ0FBNkIsS0FBS2IsQ0FBTCxDQUFPVyxLQUFQLENBQTdCLENBQWY7QUFDQSxVQUFNWCxJQUFJYyxLQUFLQyxLQUFMLENBQVdILE1BQVgsQ0FBVjs7QUFFQSxXQUFLUixHQUFMLENBQVNHLGNBQVQsQ0FBd0IsSUFBeEIsRUFBOEIsV0FBOUIsaUJBQXdEUCxDQUF4RDtBQUNBLFdBQUtJLEdBQUwsQ0FBU0csY0FBVCxDQUF3QixJQUF4QixFQUE4QixJQUE5QixFQUFvQ0osaUJBQWlCYSxNQUFyRDtBQUNEOztBQUVEOzs7Ozs7OzZCQUlTO0FBQUUsYUFBTyxLQUFQO0FBQWU7Ozs7O2tCQUdiakIsTSIsImZpbGUiOiJjdXJzb3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vQmFzZVNoYXBlJztcbmltcG9ydCBucyBmcm9tICcuLi9jb3JlL25hbWVzcGFjZSc7XG5cblxuLyoqXG4gKiBBIHNoYXBlIHRvIGRpc3BsYXkgYSBjdXJzb3IuXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItY3Vyc29yLmh0bWwpXG4gKi9cbmNsYXNzIEN1cnNvciBleHRlbmRzIEJhc2VTaGFwZSB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICdjdXJzb3InOyB9XG5cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICByZXR1cm4geyB4OiAwIH07XG4gIH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbG9yOiAnIzAwMDAwMCcsXG4gICAgICBvcGFjaXR5OiAxXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdsaW5lJyk7XG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3gnLCAwKTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneTEnLCAwKTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ2NyaXNwRWRnZXMnKTtcbiAgICB0aGlzLiRlbC5zdHlsZS5zdHJva2UgPSB0aGlzLnBhcmFtcy5jb2xvcjtcblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSkge1xuICAgIGNvbnN0IGZsb2F0WCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy54KGRhdHVtKSk7XG4gICAgY29uc3QgeCA9IE1hdGgucm91bmQoZmxvYXRYKTtcblxuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7eH0sIDApYCk7XG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3kyJywgcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBjdXJzb3IgY2Fubm90IGJlIHNlbGVjdGVkLlxuICAgKiBAcmV0dXJuIHtCb29sZWFufSBmYWxzZVxuICAgKi9cbiAgaW5BcmVhKCkgeyByZXR1cm4gZmFsc2U7IH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ3Vyc29yO1xuIl19