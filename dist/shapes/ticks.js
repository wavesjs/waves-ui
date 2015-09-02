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
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return { time: 0, focused: true, label: '' };
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
        var x = renderingContext.timeToPixel(_this.time(datum));
        var opacity = _this.focused(datum) ? _this.params.focusedOpacity : _this.params.defaultOpacity;

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

        var label = _this.label(datum);
        if (label) {
          var $label = document.createElementNS(_this.ns, 'text');
          $label.classList.add('label');
          var $text = document.createTextNode(label);
          $label.appendChild($text);
          $label.setAttributeNS(null, 'transform', 'matrix(1, 0, 0, -1, ' + (x + 2) + ', ' + (height + 2) + ')');
          // firefox problem here
          // $label.setAttributeNS(null, 'alignment-baseline', 'text-before-edge');
          $label.setAttributeNS(null, 'y', '10');

          $label.style.fontSize = '10px';
          $label.style.lineHeight = '10px';
          $label.style.fontFamily = 'monospace';
          $label.style.color = '#676767';
          $label.style.opacity = 0.9;
          $label.style.mozUserSelect = 'none';
          $label.style.webkitUserSelect = 'none';
          $label.style.userSelect = 'none';

          // const bg = document.createElementNS(this.ns, 'rect');
          // bg.setAttributeNS(null, 'width', '100%');
          // bg.setAttributeNS(null, 'height', '100%');
          // bg.setAttributeNS(null, 'fill', '#ffffff');
          // label.appendChild(bg);

          _this.$el.appendChild($label);
        }
      });

      this.$el.appendChild(fragment);
    }
  }]);

  return Ticks;
})(_baseShape2['default']);

exports['default'] = Ticks;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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QUFDOztBQUVILFVBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ2hDOzs7U0FwRmtCLEtBQUs7OztxQkFBTCxLQUFLIiwiZmlsZSI6ImVzNi9zaGFwZXMvdGlja3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vYmFzZS1zaGFwZSc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGlja3MgZXh0ZW5kcyBCYXNlU2hhcGUge1xuICBfZ2V0Q2xhc3NOYW1lKCkge1xuICAgIHJldHVybiAndGljayc7XG4gIH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIHJldHVybiB7IHRpbWU6IDAsIGZvY3VzZWQ6IHRydWUsIGxhYmVsOiAnJyB9O1xuICB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjb2xvcjogJ3N0ZWVsYmx1ZScsXG4gICAgICBmb2N1c2VkT3BhY2l0eTogMC44LFxuICAgICAgZGVmYXVsdE9wYWNpdHk6IDAuM1xuICAgIH07XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdnJyk7XG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdGEpIHtcbiAgICB3aGlsZSAodGhpcy4kZWwuZmlyc3RDaGlsZCkge1xuICAgICAgdGhpcy4kZWwucmVtb3ZlQ2hpbGQodGhpcy4kZWwuZmlyc3RDaGlsZCk7XG4gICAgfVxuXG4gICAgY29uc3QgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgY29uc3QgbGF5ZXJIZWlnaHQgPSByZW5kZXJpbmdDb250ZXh0LmhlaWdodDsgLy8gdmFsdWVUb1BpeGVsKDEpO1xuXG4gICAgZGF0YS5mb3JFYWNoKChkYXR1bSkgPT4ge1xuICAgICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy50aW1lKGRhdHVtKSk7XG4gICAgICBjb25zdCBvcGFjaXR5ID0gdGhpcy5mb2N1c2VkKGRhdHVtKSA/XG4gICAgICAgIHRoaXMucGFyYW1zLmZvY3VzZWRPcGFjaXR5IDogdGhpcy5wYXJhbXMuZGVmYXVsdE9wYWNpdHk7XG5cbiAgICAgIGNvbnN0IGhlaWdodCA9IGxheWVySGVpZ2h0O1xuXG4gICAgICBjb25zdCB0aWNrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdsaW5lJyk7XG4gICAgICB0aWNrLmNsYXNzTGlzdC5hZGQoJ3RpY2snKTtcblxuICAgICAgdGljay5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneDEnLCAwKTtcbiAgICAgIHRpY2suc2V0QXR0cmlidXRlTlMobnVsbCwgJ3gyJywgMCk7XG4gICAgICB0aWNrLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5MScsIDApO1xuICAgICAgdGljay5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneTInLCBoZWlnaHQpO1xuXG4gICAgICB0aWNrLnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgJ25vbmUnKTtcbiAgICAgIHRpY2suc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZScsIHRoaXMucGFyYW1zLmNvbG9yKTtcbiAgICAgIHRpY2suc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdjcmlzcEVkZ2VzJyk7XG4gICAgICB0aWNrLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7eH0sIDApYCk7XG4gICAgICB0aWNrLnNldEF0dHJpYnV0ZU5TKG51bGwsICdvcGFjaXR5Jywgb3BhY2l0eSk7XG5cbiAgICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRpY2spO1xuXG4gICAgICBjb25zdCBsYWJlbCA9IHRoaXMubGFiZWwoZGF0dW0pO1xuICAgICAgaWYgKGxhYmVsKSB7XG4gICAgICAgIGNvbnN0ICRsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAndGV4dCcpO1xuICAgICAgICAkbGFiZWwuY2xhc3NMaXN0LmFkZCgnbGFiZWwnKTtcbiAgICAgICAgY29uc3QgJHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShsYWJlbCk7XG4gICAgICAgICRsYWJlbC5hcHBlbmRDaGlsZCgkdGV4dCk7XG4gICAgICAgICRsYWJlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYG1hdHJpeCgxLCAwLCAwLCAtMSwgJHt4ICsgMn0sICR7aGVpZ2h0ICsgMn0pYCk7XG4gICAgICAgIC8vIGZpcmVmb3ggcHJvYmxlbSBoZXJlXG4gICAgICAgIC8vICRsYWJlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnYWxpZ25tZW50LWJhc2VsaW5lJywgJ3RleHQtYmVmb3JlLWVkZ2UnKTtcbiAgICAgICAgJGxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5JywgJzEwJyk7XG5cbiAgICAgICAgJGxhYmVsLnN0eWxlLmZvbnRTaXplID0gJzEwcHgnO1xuICAgICAgICAkbGFiZWwuc3R5bGUubGluZUhlaWdodCA9ICcxMHB4JztcbiAgICAgICAgJGxhYmVsLnN0eWxlLmZvbnRGYW1pbHkgPSAnbW9ub3NwYWNlJztcbiAgICAgICAgJGxhYmVsLnN0eWxlLmNvbG9yID0gJyM2NzY3NjcnO1xuICAgICAgICAkbGFiZWwuc3R5bGUub3BhY2l0eSA9IDAuOTtcbiAgICAgICAgJGxhYmVsLnN0eWxlLm1velVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgICAgICRsYWJlbC5zdHlsZS53ZWJraXRVc2VyU2VsZWN0ID0gJ25vbmUnO1xuICAgICAgICAkbGFiZWwuc3R5bGUudXNlclNlbGVjdCA9ICdub25lJztcblxuICAgICAgICAvLyBjb25zdCBiZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncmVjdCcpO1xuICAgICAgICAvLyBiZy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCAnMTAwJScpO1xuICAgICAgICAvLyBiZy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgJzEwMCUnKTtcbiAgICAgICAgLy8gYmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCAnI2ZmZmZmZicpO1xuICAgICAgICAvLyBsYWJlbC5hcHBlbmRDaGlsZChiZyk7XG5cbiAgICAgICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQoJGxhYmVsKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKGZyYWdtZW50KTtcbiAgfVxufSJdfQ==