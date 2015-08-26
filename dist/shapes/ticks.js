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

var Ticks = (function (_BaseShape) {
  _inherits(Ticks, _BaseShape);

  function Ticks() {
    _classCallCheck(this, Ticks);

    _get(Object.getPrototypeOf(Ticks.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Ticks, [{
    key: '_getClassName',
    value: function _getClassName() {
      return 'tick';
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {
        color: 'steelblue',
        focusedOpacity: 0.8,
        defaultOpacity: 0.3
      };
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      this.$el = document.createElementNS(this.ns, 'g');
      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, data) {
      var _this = this;

      while (this.$el.firstChild) {
        this.$el.removeChild(this.$el.firstChild);
      }

      var fragment = document.createDocumentFragment();
      var layerHeight = renderingContext.height; // valueToPixel(1);

      data.forEach(function (datum) {
        var x = renderingContext.timeToPixel(datum.time);
        var opacity = datum.focused ? _this.params.focusedOpacity : _this.params.defaultOpacity;

        var height = layerHeight;

        var tick = document.createElementNS(_this.ns, 'line');
        tick.classList.add('tick');

        tick.setAttributeNS(null, 'x1', 0);
        tick.setAttributeNS(null, 'x2', 0);
        tick.setAttributeNS(null, 'y1', 0);
        tick.setAttributeNS(null, 'y2', height);

        tick.setAttributeNS(null, 'fill', 'none');
        tick.setAttributeNS(null, 'stroke', _this.params.color);
        tick.setAttributeNS(null, 'shape-rendering', 'crispEdges');
        tick.setAttributeNS(null, 'transform', 'translate(' + x + ', 0)');
        tick.setAttributeNS(null, 'opacity', opacity);

        _this.$el.appendChild(tick);

        if (datum.label) {
          var label = document.createElementNS(_this.ns, 'text');
          label.classList.add('label');

          label.innerHTML = datum.label;
          label.setAttributeNS(null, 'transform', 'matrix(1, 0, 0, -1, ' + (x + 2) + ', ' + (height + 2) + ')');
          label.setAttributeNS(null, 'alignment-baseline', 'text-before-edge');
          label.style.fontSize = '10px';
          label.style.lineHeight = '10px';
          label.style.fontFamily = 'monospace';
          label.style.color = '#676767';
          label.style.opacity = 0.9;
          label.style.mozUserSelect = 'none';
          label.style.webkitUserSelect = 'none';
          label.style.userSelect = 'none';

          // const bg = document.createElementNS(this.ns, 'rect');
          // bg.setAttributeNS(null, 'width', '100%');
          // bg.setAttributeNS(null, 'height', '100%');
          // bg.setAttributeNS(null, 'fill', '#ffffff');
          // label.appendChild(bg);

          _this.$el.appendChild(label);
        }
      });

      this.$el.appendChild(fragment);
    }
  }]);

  return Ticks;
})(_baseShape2['default']);

exports['default'] = Ticks;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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RyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU3QixlQUFLLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7QUFDOUIsZUFBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsV0FBVyw0QkFBeUIsQ0FBQyxHQUFHLENBQUMsQ0FBQSxXQUFLLE1BQU0sR0FBRyxDQUFDLENBQUEsT0FBSSxDQUFDO0FBQ3hGLGVBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLG9CQUFvQixFQUFFLGtCQUFrQixDQUFDLENBQUM7QUFDckUsZUFBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDO0FBQzlCLGVBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQztBQUNoQyxlQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxXQUFXLENBQUM7QUFDckMsZUFBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDO0FBQzlCLGVBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztBQUMxQixlQUFLLENBQUMsS0FBSyxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUM7QUFDbkMsZUFBSyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLENBQUM7QUFDdEMsZUFBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDOzs7Ozs7OztBQVFoQyxnQkFBSyxHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzdCO09BQ0YsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ2hDOzs7U0E1RWtCLEtBQUs7OztxQkFBTCxLQUFLIiwiZmlsZSI6ImVzNi9zaGFwZXMvdGlja3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vYmFzZS1zaGFwZSc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGlja3MgZXh0ZW5kcyBCYXNlU2hhcGUge1xuICBfZ2V0Q2xhc3NOYW1lKCkge1xuICAgIHJldHVybiAndGljayc7XG4gIH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbG9yOiAnc3RlZWxibHVlJyxcbiAgICAgIGZvY3VzZWRPcGFjaXR5OiAwLjgsXG4gICAgICBkZWZhdWx0T3BhY2l0eTogMC4zXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2cnKTtcbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkge1xuICAgIHdoaWxlICh0aGlzLiRlbC5maXJzdENoaWxkKSB7XG4gICAgICB0aGlzLiRlbC5yZW1vdmVDaGlsZCh0aGlzLiRlbC5maXJzdENoaWxkKTtcbiAgICB9XG5cbiAgICBjb25zdCBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICBjb25zdCBsYXllckhlaWdodCA9IHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0OyAvLyB2YWx1ZVRvUGl4ZWwoMSk7XG5cbiAgICBkYXRhLmZvckVhY2goKGRhdHVtKSA9PiB7XG4gICAgICBjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChkYXR1bS50aW1lKTtcbiAgICAgIGNvbnN0IG9wYWNpdHkgPSBkYXR1bS5mb2N1c2VkID9cbiAgICAgICAgdGhpcy5wYXJhbXMuZm9jdXNlZE9wYWNpdHkgOiB0aGlzLnBhcmFtcy5kZWZhdWx0T3BhY2l0eTtcblxuICAgICAgY29uc3QgaGVpZ2h0ID0gbGF5ZXJIZWlnaHQ7XG5cbiAgICAgIGNvbnN0IHRpY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2xpbmUnKTtcbiAgICAgIHRpY2suY2xhc3NMaXN0LmFkZCgndGljaycpO1xuXG4gICAgICB0aWNrLnNldEF0dHJpYnV0ZU5TKG51bGwsICd4MScsIDApO1xuICAgICAgdGljay5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneDInLCAwKTtcbiAgICAgIHRpY2suc2V0QXR0cmlidXRlTlMobnVsbCwgJ3kxJywgMCk7XG4gICAgICB0aWNrLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5MicsIGhlaWdodCk7XG5cbiAgICAgIHRpY2suc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCAnbm9uZScpO1xuICAgICAgdGljay5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlJywgdGhpcy5wYXJhbXMuY29sb3IpO1xuICAgICAgdGljay5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ2NyaXNwRWRnZXMnKTtcbiAgICAgIHRpY2suc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHt4fSwgMClgKTtcbiAgICAgIHRpY2suc2V0QXR0cmlidXRlTlMobnVsbCwgJ29wYWNpdHknLCBvcGFjaXR5KTtcblxuICAgICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGljayk7XG5cbiAgICAgIGlmIChkYXR1bS5sYWJlbCkge1xuICAgICAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAndGV4dCcpO1xuICAgICAgICBsYWJlbC5jbGFzc0xpc3QuYWRkKCdsYWJlbCcpO1xuXG4gICAgICAgIGxhYmVsLmlubmVySFRNTCA9IGRhdHVtLmxhYmVsO1xuICAgICAgICBsYWJlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYG1hdHJpeCgxLCAwLCAwLCAtMSwgJHt4ICsgMn0sICR7aGVpZ2h0ICsgMn0pYCk7XG4gICAgICAgIGxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdhbGlnbm1lbnQtYmFzZWxpbmUnLCAndGV4dC1iZWZvcmUtZWRnZScpO1xuICAgICAgICBsYWJlbC5zdHlsZS5mb250U2l6ZSA9ICcxMHB4JztcbiAgICAgICAgbGFiZWwuc3R5bGUubGluZUhlaWdodCA9ICcxMHB4JztcbiAgICAgICAgbGFiZWwuc3R5bGUuZm9udEZhbWlseSA9ICdtb25vc3BhY2UnO1xuICAgICAgICBsYWJlbC5zdHlsZS5jb2xvciA9ICcjNjc2NzY3JztcbiAgICAgICAgbGFiZWwuc3R5bGUub3BhY2l0eSA9IDAuOTtcbiAgICAgICAgbGFiZWwuc3R5bGUubW96VXNlclNlbGVjdCA9ICdub25lJztcbiAgICAgICAgbGFiZWwuc3R5bGUud2Via2l0VXNlclNlbGVjdCA9ICdub25lJztcbiAgICAgICAgbGFiZWwuc3R5bGUudXNlclNlbGVjdCA9ICdub25lJztcblxuICAgICAgICAvLyBjb25zdCBiZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncmVjdCcpO1xuICAgICAgICAvLyBiZy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCAnMTAwJScpO1xuICAgICAgICAvLyBiZy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgJzEwMCUnKTtcbiAgICAgICAgLy8gYmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCAnI2ZmZmZmZicpO1xuICAgICAgICAvLyBsYWJlbC5hcHBlbmRDaGlsZChiZyk7XG5cbiAgICAgICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQobGFiZWwpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xuICB9XG59Il19