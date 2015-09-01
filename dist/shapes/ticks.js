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
      return {
        time: 0,
        focused: true,
        label: ''
      };
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

          $label.innerHTML = label;
          $label.setAttributeNS(null, 'transform', 'matrix(1, 0, 0, -1, ' + (x + 2) + ', ' + (height + 2) + ')');
          $label.setAttributeNS(null, 'alignment-baseline', 'text-before-edge');
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
//# sourceMappingURL=data:application/json;base64,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Ozs7U0FyRmtCLEtBQUs7OztxQkFBTCxLQUFLIiwiZmlsZSI6ImVzNi9zaGFwZXMvdGlja3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vYmFzZS1zaGFwZSc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGlja3MgZXh0ZW5kcyBCYXNlU2hhcGUge1xuICBfZ2V0Q2xhc3NOYW1lKCkge1xuICAgIHJldHVybiAndGljayc7XG4gIH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIHJldHVybiB7XG4gICAgICB0aW1lOiAwLFxuICAgICAgZm9jdXNlZDogdHJ1ZSxcbiAgICAgIGxhYmVsOiAnJyxcbiAgICB9XG4gIH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbG9yOiAnc3RlZWxibHVlJyxcbiAgICAgIGZvY3VzZWRPcGFjaXR5OiAwLjgsXG4gICAgICBkZWZhdWx0T3BhY2l0eTogMC4zXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2cnKTtcbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkge1xuICAgIHdoaWxlICh0aGlzLiRlbC5maXJzdENoaWxkKSB7XG4gICAgICB0aGlzLiRlbC5yZW1vdmVDaGlsZCh0aGlzLiRlbC5maXJzdENoaWxkKTtcbiAgICB9XG5cbiAgICBjb25zdCBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICBjb25zdCBsYXllckhlaWdodCA9IHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0OyAvLyB2YWx1ZVRvUGl4ZWwoMSk7XG5cbiAgICBkYXRhLmZvckVhY2goKGRhdHVtKSA9PiB7XG4gICAgICBjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLnRpbWUoZGF0dW0pKTtcbiAgICAgIGNvbnN0IG9wYWNpdHkgPSB0aGlzLmZvY3VzZWQoZGF0dW0pID9cbiAgICAgICAgdGhpcy5wYXJhbXMuZm9jdXNlZE9wYWNpdHkgOiB0aGlzLnBhcmFtcy5kZWZhdWx0T3BhY2l0eTtcblxuICAgICAgY29uc3QgaGVpZ2h0ID0gbGF5ZXJIZWlnaHQ7XG5cbiAgICAgIGNvbnN0IHRpY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2xpbmUnKTtcbiAgICAgIHRpY2suY2xhc3NMaXN0LmFkZCgndGljaycpO1xuXG4gICAgICB0aWNrLnNldEF0dHJpYnV0ZU5TKG51bGwsICd4MScsIDApO1xuICAgICAgdGljay5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneDInLCAwKTtcbiAgICAgIHRpY2suc2V0QXR0cmlidXRlTlMobnVsbCwgJ3kxJywgMCk7XG4gICAgICB0aWNrLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5MicsIGhlaWdodCk7XG5cbiAgICAgIHRpY2suc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCAnbm9uZScpO1xuICAgICAgdGljay5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlJywgdGhpcy5wYXJhbXMuY29sb3IpO1xuICAgICAgdGljay5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ2NyaXNwRWRnZXMnKTtcbiAgICAgIHRpY2suc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHt4fSwgMClgKTtcbiAgICAgIHRpY2suc2V0QXR0cmlidXRlTlMobnVsbCwgJ29wYWNpdHknLCBvcGFjaXR5KTtcblxuICAgICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGljayk7XG5cbiAgICAgIGNvbnN0IGxhYmVsID0gdGhpcy5sYWJlbChkYXR1bSk7XG4gICAgICBpZiAobGFiZWwpIHtcbiAgICAgICAgY29uc3QgJGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICd0ZXh0Jyk7XG4gICAgICAgICRsYWJlbC5jbGFzc0xpc3QuYWRkKCdsYWJlbCcpO1xuXG4gICAgICAgICRsYWJlbC5pbm5lckhUTUwgPSBsYWJlbDtcbiAgICAgICAgJGxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgbWF0cml4KDEsIDAsIDAsIC0xLCAke3ggKyAyfSwgJHtoZWlnaHQgKyAyfSlgKTtcbiAgICAgICAgJGxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdhbGlnbm1lbnQtYmFzZWxpbmUnLCAndGV4dC1iZWZvcmUtZWRnZScpO1xuICAgICAgICAkbGFiZWwuc3R5bGUuZm9udFNpemUgPSAnMTBweCc7XG4gICAgICAgICRsYWJlbC5zdHlsZS5saW5lSGVpZ2h0ID0gJzEwcHgnO1xuICAgICAgICAkbGFiZWwuc3R5bGUuZm9udEZhbWlseSA9ICdtb25vc3BhY2UnO1xuICAgICAgICAkbGFiZWwuc3R5bGUuY29sb3IgPSAnIzY3Njc2Nyc7XG4gICAgICAgICRsYWJlbC5zdHlsZS5vcGFjaXR5ID0gMC45O1xuICAgICAgICAkbGFiZWwuc3R5bGUubW96VXNlclNlbGVjdCA9ICdub25lJztcbiAgICAgICAgJGxhYmVsLnN0eWxlLndlYmtpdFVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgICAgICRsYWJlbC5zdHlsZS51c2VyU2VsZWN0ID0gJ25vbmUnO1xuXG4gICAgICAgIC8vIGNvbnN0IGJnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdyZWN0Jyk7XG4gICAgICAgIC8vIGJnLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsICcxMDAlJyk7XG4gICAgICAgIC8vIGJnLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCAnMTAwJScpO1xuICAgICAgICAvLyBiZy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsICcjZmZmZmZmJyk7XG4gICAgICAgIC8vIGxhYmVsLmFwcGVuZENoaWxkKGJnKTtcblxuICAgICAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCgkbGFiZWwpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xuICB9XG59Il19