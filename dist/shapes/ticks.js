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

var Axis = (function (_BaseShape) {
  _inherits(Axis, _BaseShape);

  function Axis() {
    _classCallCheck(this, Axis);

    _get(Object.getPrototypeOf(Axis.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Axis, [{
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
        var x = renderingContext.timeToPixel(datum.x);
        var opacity = datum.marker ? 0.8 : 0.3;
        // const height = datum.marker ? layerHeight : layerHeight - 10;
        var height = layerHeight;

        var tick = document.createElementNS(_this.ns, 'line');
        tick.classList.add('tick');

        tick.setAttributeNS(null, 'x1', 0);
        tick.setAttributeNS(null, 'x2', 0);
        tick.setAttributeNS(null, 'y1', 0);
        tick.setAttributeNS(null, 'y2', height);

        tick.setAttributeNS(null, 'fill', 'none');
        tick.setAttributeNS(null, 'stroke', 'steelblue');
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

  return Axis;
})(_baseShape2['default']);

exports['default'] = Axis;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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QyxjQUFjLENBQUMsSUFBSSxFQUFFLG9CQUFvQixFQUFFLGtCQUFrQixDQUFDLENBQUM7QUFDckUsZUFBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDO0FBQzlCLGVBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQztBQUNoQyxlQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxXQUFXLENBQUM7QUFDckMsZUFBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDO0FBQzlCLGVBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztBQUMxQixlQUFLLENBQUMsS0FBSyxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUM7QUFDbkMsZUFBSyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLENBQUM7QUFDdEMsZUFBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDOzs7Ozs7OztBQVFoQyxnQkFBSyxHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzdCO09BQ0YsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ2hDOzs7U0EvRGtCLElBQUk7OztxQkFBSixJQUFJIiwiZmlsZSI6ImVzNi9zaGFwZXMvdGlja3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vYmFzZS1zaGFwZSc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXhpcyBleHRlbmRzIEJhc2VTaGFwZSB7XG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2cnKTtcbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkge1xuICAgIHdoaWxlICh0aGlzLiRlbC5maXJzdENoaWxkKSB7XG4gICAgICB0aGlzLiRlbC5yZW1vdmVDaGlsZCh0aGlzLiRlbC5maXJzdENoaWxkKTtcbiAgICB9XG5cbiAgICBjb25zdCBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICBjb25zdCBsYXllckhlaWdodCA9IHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0OyAvLyB2YWx1ZVRvUGl4ZWwoMSk7XG5cbiAgICBkYXRhLmZvckVhY2goKGRhdHVtKSA9PiB7XG4gICAgICBjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChkYXR1bS54KTtcbiAgICAgIGNvbnN0IG9wYWNpdHkgPSBkYXR1bS5tYXJrZXIgPyAwLjggOiAwLjM7XG4gICAgICAvLyBjb25zdCBoZWlnaHQgPSBkYXR1bS5tYXJrZXIgPyBsYXllckhlaWdodCA6IGxheWVySGVpZ2h0IC0gMTA7XG4gICAgICBjb25zdCBoZWlnaHQgPSBsYXllckhlaWdodDtcblxuICAgICAgY29uc3QgdGljayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnbGluZScpO1xuICAgICAgdGljay5jbGFzc0xpc3QuYWRkKCd0aWNrJyk7XG5cbiAgICAgIHRpY2suc2V0QXR0cmlidXRlTlMobnVsbCwgJ3gxJywgMCk7XG4gICAgICB0aWNrLnNldEF0dHJpYnV0ZU5TKG51bGwsICd4MicsIDApO1xuICAgICAgdGljay5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneTEnLCAwKTtcbiAgICAgIHRpY2suc2V0QXR0cmlidXRlTlMobnVsbCwgJ3kyJywgaGVpZ2h0KTtcblxuICAgICAgdGljay5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsICdub25lJyk7XG4gICAgICB0aWNrLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2UnLCAnc3RlZWxibHVlJyk7XG4gICAgICB0aWNrLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuICAgICAgdGljay5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3h9LCAwKWApO1xuICAgICAgdGljay5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnb3BhY2l0eScsIG9wYWNpdHkpO1xuXG4gICAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aWNrKTtcblxuICAgICAgaWYgKGRhdHVtLmxhYmVsKSB7XG4gICAgICAgIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICd0ZXh0Jyk7XG4gICAgICAgIGxhYmVsLmNsYXNzTGlzdC5hZGQoJ2xhYmVsJyk7XG5cbiAgICAgICAgbGFiZWwuaW5uZXJIVE1MID0gZGF0dW0ubGFiZWw7XG4gICAgICAgIGxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgbWF0cml4KDEsIDAsIDAsIC0xLCAke3ggKyAyfSwgJHtoZWlnaHQgKyAyfSlgKTtcbiAgICAgICAgbGFiZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2FsaWdubWVudC1iYXNlbGluZScsICd0ZXh0LWJlZm9yZS1lZGdlJyk7XG4gICAgICAgIGxhYmVsLnN0eWxlLmZvbnRTaXplID0gJzEwcHgnO1xuICAgICAgICBsYWJlbC5zdHlsZS5saW5lSGVpZ2h0ID0gJzEwcHgnO1xuICAgICAgICBsYWJlbC5zdHlsZS5mb250RmFtaWx5ID0gJ21vbm9zcGFjZSc7XG4gICAgICAgIGxhYmVsLnN0eWxlLmNvbG9yID0gJyM2NzY3NjcnO1xuICAgICAgICBsYWJlbC5zdHlsZS5vcGFjaXR5ID0gMC45O1xuICAgICAgICBsYWJlbC5zdHlsZS5tb3pVc2VyU2VsZWN0ID0gJ25vbmUnO1xuICAgICAgICBsYWJlbC5zdHlsZS53ZWJraXRVc2VyU2VsZWN0ID0gJ25vbmUnO1xuICAgICAgICBsYWJlbC5zdHlsZS51c2VyU2VsZWN0ID0gJ25vbmUnO1xuXG4gICAgICAgIC8vIGNvbnN0IGJnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdyZWN0Jyk7XG4gICAgICAgIC8vIGJnLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsICcxMDAlJyk7XG4gICAgICAgIC8vIGJnLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCAnMTAwJScpO1xuICAgICAgICAvLyBiZy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsICcjZmZmZmZmJyk7XG4gICAgICAgIC8vIGxhYmVsLmFwcGVuZENoaWxkKGJnKTtcblxuICAgICAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZChsYWJlbCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZChmcmFnbWVudCk7XG4gIH1cbn0iXX0=