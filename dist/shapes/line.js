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

var Line = (function (_BaseShape) {
  _inherits(Line, _BaseShape);

  function Line() {
    _classCallCheck(this, Line);

    _get(Object.getPrototypeOf(Line.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Line, [{
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
      var _this = this;

      data = data.slice(0);
      data.sort(function (a, b) {
        return _this.cx(a) < _this.cx(b) ? -1 : 1;
      });

      this.$el.setAttributeNS(null, 'd', this._buildLine(renderingContext, data));
      this.$el.style.stroke = this.params.color;
      this.$el.style.fill = 'none';

      data = null;
    }

    // builds the `path.d` attribute
    // @TODO create some ShapeHelper ?
  }, {
    key: '_buildLine',
    value: function _buildLine(renderingContext, data) {
      var _this2 = this;

      if (!data.length) {
        return '';
      }
      // sort data
      var instructions = data.map(function (datum, index) {
        var x = renderingContext.timeToPixel(_this2.cx(datum));
        var y = renderingContext.valueToPixel(_this2.cy(datum));
        return x + ',' + y;
      });

      return 'M' + instructions.join('L');
    }
  }]);

  return Line;
})(_baseShape2['default']);

exports['default'] = Line;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaGFwZXMvbGluZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3lCQUFzQixjQUFjOzs7O0lBR2YsSUFBSTtZQUFKLElBQUk7O1dBQUosSUFBSTswQkFBSixJQUFJOzsrQkFBSixJQUFJOzs7ZUFBSixJQUFJOztXQUNYLHdCQUFHO0FBQUUsYUFBTyxNQUFNLENBQUM7S0FBRTs7O1dBRWpCLDRCQUFHO0FBQ2pCLGFBQU8sRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQztLQUN6Qjs7O1dBRVcsd0JBQUc7QUFDYixhQUFPLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDO0tBQzdCOzs7V0FFSyxnQkFBQyxnQkFBZ0IsRUFBRTtBQUN2QixVQUFJLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFBRSxlQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7T0FBRTs7QUFFbEMsVUFBSSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7O0FBRXJELGFBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztLQUNqQjs7O1dBRUssZ0JBQUMsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFOzs7QUFDN0IsVUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckIsVUFBSSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDO2VBQUssTUFBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQztPQUFBLENBQUMsQ0FBQzs7QUFFdEQsVUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDNUUsVUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQzFDLFVBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7O0FBRTdCLFVBQUksR0FBRyxJQUFJLENBQUM7S0FDYjs7Ozs7O1dBSVMsb0JBQUMsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFOzs7QUFDakMsVUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFBRSxlQUFPLEVBQUUsQ0FBQztPQUFFOztBQUVoQyxVQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsS0FBSyxFQUFFLEtBQUssRUFBSztBQUM1QyxZQUFNLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsT0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN2RCxZQUFNLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsT0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN4RCxlQUFVLENBQUMsU0FBSSxDQUFDLENBQUc7T0FDcEIsQ0FBQyxDQUFDOztBQUVILGFBQU8sR0FBRyxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDckM7OztTQTFDa0IsSUFBSTs7O3FCQUFKLElBQUkiLCJmaWxlIjoiZXM2L3NoYXBlcy9saW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuL2Jhc2Utc2hhcGUnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmUgZXh0ZW5kcyBCYXNlU2hhcGUge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAnbGluZSc7IH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIHJldHVybiB7IGN4OiAwLCBjeTogMCB9O1xuICB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7IGNvbG9yOiAnIzAwMDAwMCcgfTtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgaWYgKHRoaXMuJGVsKSB7IHJldHVybiB0aGlzLiRlbDsgfVxuXG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3BhdGgnKTtcbiAgICAvLyB0aGlzLmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXRhKSB7XG4gICAgZGF0YSA9IGRhdGEuc2xpY2UoMCk7XG4gICAgZGF0YS5zb3J0KChhLCBiKSA9PiB0aGlzLmN4KGEpIDwgdGhpcy5jeChiKSA/IC0xIDogMSk7XG5cbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZCcsIHRoaXMuX2J1aWxkTGluZShyZW5kZXJpbmdDb250ZXh0LCBkYXRhKSk7XG4gICAgdGhpcy4kZWwuc3R5bGUuc3Ryb2tlID0gdGhpcy5wYXJhbXMuY29sb3I7XG4gICAgdGhpcy4kZWwuc3R5bGUuZmlsbCA9ICdub25lJztcblxuICAgIGRhdGEgPSBudWxsO1xuICB9XG5cbiAgLy8gYnVpbGRzIHRoZSBgcGF0aC5kYCBhdHRyaWJ1dGVcbiAgLy8gQFRPRE8gY3JlYXRlIHNvbWUgU2hhcGVIZWxwZXIgP1xuICBfYnVpbGRMaW5lKHJlbmRlcmluZ0NvbnRleHQsIGRhdGEpIHtcbiAgICBpZiAoIWRhdGEubGVuZ3RoKSB7IHJldHVybiAnJzsgfVxuICAgIC8vIHNvcnQgZGF0YVxuICAgIGxldCBpbnN0cnVjdGlvbnMgPSBkYXRhLm1hcCgoZGF0dW0sIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLmN4KGRhdHVtKSk7XG4gICAgICBjb25zdCB5ID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwodGhpcy5jeShkYXR1bSkpO1xuICAgICAgcmV0dXJuIGAke3h9LCR7eX1gO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuICdNJyArIGluc3RydWN0aW9ucy5qb2luKCdMJyk7XG4gIH1cbn1cbiJdfQ==