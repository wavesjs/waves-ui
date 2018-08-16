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

var _namespace = require('../core/namespace');

var _namespace2 = _interopRequireDefault(_namespace);

var _BaseState2 = require('./BaseState');

var _BaseState3 = _interopRequireDefault(_BaseState2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Protools like zoom with zone selection. Press space bar to reset zoom.
 *
 * [example usage](./examples/states-zoom.html)
 *
 * @todo - could also handle `g` and `h` keys to zoom-in, zoom-out.
 */
var BrushZoomState = function (_BaseState) {
  (0, _inherits3.default)(BrushZoomState, _BaseState);

  function BrushZoomState(timeline) {
    (0, _classCallCheck3.default)(this, BrushZoomState);
    return (0, _possibleConstructorReturn3.default)(this, (BrushZoomState.__proto__ || (0, _getPrototypeOf2.default)(BrushZoomState)).call(this, timeline));
  }

  (0, _createClass3.default)(BrushZoomState, [{
    key: 'handleEvent',
    value: function handleEvent(e) {
      switch (e.type) {
        case 'mousedown':
          this.onMouseDown(e);
          break;
        case 'mousemove':
          this.onMouseMove(e);
          break;
        case 'mouseup':
          this.onMouseUp(e);
          break;
        case 'keydown':
          this.onKeyDown(e);
          break;
      }
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(e) {
      var _this2 = this;

      this.brushes = [];
      this.startX = e.x;
      // create brush in each containers
      this.tracks.forEach(function (track) {
        var interactions = track.$interactions;

        var brush = document.createElementNS(_namespace2.default, 'rect');
        brush.setAttributeNS(null, 'height', track.height);
        brush.setAttributeNS(null, 'y', 0);
        brush.style.fill = '#787878';
        brush.style.opacity = 0.2;

        interactions.appendChild(brush);

        _this2.brushes.push(brush);
      });
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      // update brush
      var width = Math.abs(e.x - this.startX);
      var x = Math.min(e.x, this.startX);

      this.brushes.forEach(function (brush) {
        brush.setAttributeNS(null, 'width', width);
        brush.setAttributeNS(null, 'x', x);
      });
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(e) {
      // remove brush
      this.brushes.forEach(function (brush) {
        brush.parentNode.removeChild(brush);
      });

      // update timeContext
      var startX = this.startX;
      var endX = e.x;
      // return if no drag
      if (Math.abs(startX - endX) < 1) {
        return;
      }

      var leftX = Math.max(0, Math.min(startX, endX));
      var rightX = Math.max(startX, endX);

      var minTime = this.timeline.timeToPixel.invert(leftX);
      var maxTime = this.timeline.timeToPixel.invert(rightX);

      var deltaDuration = maxTime - minTime;
      var zoom = this.timeline.visibleDuration / deltaDuration;

      this.timeline.offset -= minTime;
      this.timeline.zoom *= zoom;

      this.tracks.update();
    }
  }, {
    key: 'onKeyDown',
    value: function onKeyDown(e) {
      // reset on space bar
      if (e.originalEvent.keyCode === 32) {
        this.timeline.offset = 0;
        this.timeline.zoom = 1;
        this.tracks.update();
      }
    }
  }]);
  return BrushZoomState;
}(_BaseState3.default);

exports.default = BrushZoomState;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJydXNoWm9vbVN0YXRlLmpzIl0sIm5hbWVzIjpbIkJydXNoWm9vbVN0YXRlIiwidGltZWxpbmUiLCJlIiwidHlwZSIsIm9uTW91c2VEb3duIiwib25Nb3VzZU1vdmUiLCJvbk1vdXNlVXAiLCJvbktleURvd24iLCJicnVzaGVzIiwic3RhcnRYIiwieCIsInRyYWNrcyIsImZvckVhY2giLCJ0cmFjayIsImludGVyYWN0aW9ucyIsIiRpbnRlcmFjdGlvbnMiLCJicnVzaCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudE5TIiwic2V0QXR0cmlidXRlTlMiLCJoZWlnaHQiLCJzdHlsZSIsImZpbGwiLCJvcGFjaXR5IiwiYXBwZW5kQ2hpbGQiLCJwdXNoIiwid2lkdGgiLCJNYXRoIiwiYWJzIiwibWluIiwicGFyZW50Tm9kZSIsInJlbW92ZUNoaWxkIiwiZW5kWCIsImxlZnRYIiwibWF4IiwicmlnaHRYIiwibWluVGltZSIsInRpbWVUb1BpeGVsIiwiaW52ZXJ0IiwibWF4VGltZSIsImRlbHRhRHVyYXRpb24iLCJ6b29tIiwidmlzaWJsZUR1cmF0aW9uIiwib2Zmc2V0IiwidXBkYXRlIiwib3JpZ2luYWxFdmVudCIsImtleUNvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBR0E7Ozs7Ozs7SUFPTUEsYzs7O0FBQ0osMEJBQVlDLFFBQVosRUFBc0I7QUFBQTtBQUFBLGlKQUNkQSxRQURjO0FBRXJCOzs7O2dDQUVXQyxDLEVBQUc7QUFDYixjQUFPQSxFQUFFQyxJQUFUO0FBQ0UsYUFBSyxXQUFMO0FBQ0UsZUFBS0MsV0FBTCxDQUFpQkYsQ0FBakI7QUFDQTtBQUNGLGFBQUssV0FBTDtBQUNFLGVBQUtHLFdBQUwsQ0FBaUJILENBQWpCO0FBQ0E7QUFDRixhQUFLLFNBQUw7QUFDRSxlQUFLSSxTQUFMLENBQWVKLENBQWY7QUFDQTtBQUNGLGFBQUssU0FBTDtBQUNFLGVBQUtLLFNBQUwsQ0FBZUwsQ0FB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RDtBQUNGOzs7OztrQkFHWTVDLGMiLCJmaWxlIjoiQnJ1c2hab29tU3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbnMgZnJvbSAnLi4vY29yZS9uYW1lc3BhY2UnO1xuaW1wb3J0IEJhc2VTdGF0ZSBmcm9tICcuL0Jhc2VTdGF0ZSc7XG5cblxuLyoqXG4gKiBQcm90b29scyBsaWtlIHpvb20gd2l0aCB6b25lIHNlbGVjdGlvbi4gUHJlc3Mgc3BhY2UgYmFyIHRvIHJlc2V0IHpvb20uXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvc3RhdGVzLXpvb20uaHRtbClcbiAqXG4gKiBAdG9kbyAtIGNvdWxkIGFsc28gaGFuZGxlIGBnYCBhbmQgYGhgIGtleXMgdG8gem9vbS1pbiwgem9vbS1vdXQuXG4gKi9cbmNsYXNzIEJydXNoWm9vbVN0YXRlIGV4dGVuZHMgQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUpIHtcbiAgICBzdXBlcih0aW1lbGluZSk7XG4gIH1cblxuICBoYW5kbGVFdmVudChlKSB7XG4gICAgc3dpdGNoKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlRG93bihlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxuICAgICAgICB0aGlzLm9uTW91c2VNb3ZlKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICB0aGlzLm9uTW91c2VVcChlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdrZXlkb3duJzpcbiAgICAgICAgdGhpcy5vbktleURvd24oZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VEb3duKGUpIHtcbiAgICB0aGlzLmJydXNoZXMgPSBbXTtcbiAgICB0aGlzLnN0YXJ0WCA9IGUueDtcbiAgICAvLyBjcmVhdGUgYnJ1c2ggaW4gZWFjaCBjb250YWluZXJzXG4gICAgdGhpcy50cmFja3MuZm9yRWFjaCgodHJhY2spID0+IHtcbiAgICAgIGNvbnN0IGludGVyYWN0aW9ucyA9IHRyYWNrLiRpbnRlcmFjdGlvbnM7XG5cbiAgICAgIGNvbnN0IGJydXNoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAncmVjdCcpO1xuICAgICAgYnJ1c2guc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIHRyYWNrLmhlaWdodCk7XG4gICAgICBicnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneScsIDApO1xuICAgICAgYnJ1c2guc3R5bGUuZmlsbCA9ICcjNzg3ODc4JztcbiAgICAgIGJydXNoLnN0eWxlLm9wYWNpdHkgPSAwLjI7XG5cbiAgICAgIGludGVyYWN0aW9ucy5hcHBlbmRDaGlsZChicnVzaCk7XG5cbiAgICAgIHRoaXMuYnJ1c2hlcy5wdXNoKGJydXNoKTtcbiAgICB9KTtcbiAgfVxuXG4gIG9uTW91c2VNb3ZlKGUpIHtcbiAgICAvLyB1cGRhdGUgYnJ1c2hcbiAgICBjb25zdCB3aWR0aCA9IE1hdGguYWJzKGUueCAtIHRoaXMuc3RhcnRYKTtcbiAgICBjb25zdCB4ID0gTWF0aC5taW4oZS54LCB0aGlzLnN0YXJ0WCk7XG5cbiAgICB0aGlzLmJydXNoZXMuZm9yRWFjaCgoYnJ1c2gpID0+IHtcbiAgICAgIGJydXNoLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHdpZHRoKTtcbiAgICAgIGJydXNoLnNldEF0dHJpYnV0ZU5TKG51bGwsICd4JywgeCk7XG4gICAgfSk7XG4gIH1cblxuICBvbk1vdXNlVXAoZSkge1xuICAgIC8vIHJlbW92ZSBicnVzaFxuICAgIHRoaXMuYnJ1c2hlcy5mb3JFYWNoKChicnVzaCkgPT4ge1xuICAgICAgYnJ1c2gucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChicnVzaCk7XG4gICAgfSk7XG5cbiAgICAvLyB1cGRhdGUgdGltZUNvbnRleHRcbiAgICBjb25zdCBzdGFydFggPSB0aGlzLnN0YXJ0WDtcbiAgICBjb25zdCBlbmRYID0gZS54O1xuICAgIC8vIHJldHVybiBpZiBubyBkcmFnXG4gICAgaWYgKE1hdGguYWJzKHN0YXJ0WCAtIGVuZFgpIDwgMSkgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IGxlZnRYID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oc3RhcnRYLCBlbmRYKSk7XG4gICAgY29uc3QgcmlnaHRYID0gTWF0aC5tYXgoc3RhcnRYLCBlbmRYKTtcblxuICAgIGxldCBtaW5UaW1lID0gdGhpcy50aW1lbGluZS50aW1lVG9QaXhlbC5pbnZlcnQobGVmdFgpO1xuICAgIGxldCBtYXhUaW1lID0gdGhpcy50aW1lbGluZS50aW1lVG9QaXhlbC5pbnZlcnQocmlnaHRYKTtcblxuICAgIGNvbnN0IGRlbHRhRHVyYXRpb24gPSBtYXhUaW1lIC0gbWluVGltZTtcbiAgICBjb25zdCB6b29tID0gdGhpcy50aW1lbGluZS52aXNpYmxlRHVyYXRpb24gLyBkZWx0YUR1cmF0aW9uO1xuXG4gICAgdGhpcy50aW1lbGluZS5vZmZzZXQgLT0gbWluVGltZTtcbiAgICB0aGlzLnRpbWVsaW5lLnpvb20gKj0gem9vbTtcblxuICAgIHRoaXMudHJhY2tzLnVwZGF0ZSgpO1xuICB9XG5cbiAgb25LZXlEb3duKGUpIHtcbiAgICAvLyByZXNldCBvbiBzcGFjZSBiYXJcbiAgICBpZiAoZS5vcmlnaW5hbEV2ZW50LmtleUNvZGUgPT09IDMyKSB7XG4gICAgICB0aGlzLnRpbWVsaW5lLm9mZnNldCA9IDA7XG4gICAgICB0aGlzLnRpbWVsaW5lLnpvb20gPSAxO1xuICAgICAgdGhpcy50cmFja3MudXBkYXRlKCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJydXNoWm9vbVN0YXRlO1xuIl19