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

var _baseState = require('./base-state');

var _baseState2 = _interopRequireDefault(_baseState);

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
}(_baseState2.default);

exports.default = BrushZoomState;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJydXNoLXpvb20tc3RhdGUuanMiXSwibmFtZXMiOlsiQnJ1c2hab29tU3RhdGUiLCJ0aW1lbGluZSIsImUiLCJ0eXBlIiwib25Nb3VzZURvd24iLCJvbk1vdXNlTW92ZSIsIm9uTW91c2VVcCIsIm9uS2V5RG93biIsImJydXNoZXMiLCJzdGFydFgiLCJ4IiwidHJhY2tzIiwiZm9yRWFjaCIsInRyYWNrIiwiaW50ZXJhY3Rpb25zIiwiJGludGVyYWN0aW9ucyIsImJydXNoIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50TlMiLCJzZXRBdHRyaWJ1dGVOUyIsImhlaWdodCIsInN0eWxlIiwiZmlsbCIsIm9wYWNpdHkiLCJhcHBlbmRDaGlsZCIsInB1c2giLCJ3aWR0aCIsIk1hdGgiLCJhYnMiLCJtaW4iLCJwYXJlbnROb2RlIiwicmVtb3ZlQ2hpbGQiLCJlbmRYIiwibGVmdFgiLCJtYXgiLCJyaWdodFgiLCJtaW5UaW1lIiwidGltZVRvUGl4ZWwiLCJpbnZlcnQiLCJtYXhUaW1lIiwiZGVsdGFEdXJhdGlvbiIsInpvb20iLCJ2aXNpYmxlRHVyYXRpb24iLCJvZmZzZXQiLCJ1cGRhdGUiLCJvcmlnaW5hbEV2ZW50Iiwia2V5Q29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFHQTs7Ozs7OztJQU9xQkEsYzs7O0FBQ25CLDBCQUFZQyxRQUFaLEVBQXNCO0FBQUE7QUFBQSxpSkFDZEEsUUFEYztBQUVyQjs7OztnQ0FFV0MsQyxFQUFHO0FBQ2IsY0FBT0EsRUFBRUMsSUFBVDtBQUNFLGFBQUssV0FBTDtBQUNFLGVBQUtDLFdBQUwsQ0FBaUJGLENBQWpCO0FBQ0E7QUFDRixhQUFLLFdBQUw7QUFDRSxlQUFLRyxXQUFMLENBQWlCSCxDQUFqQjtBQUNBO0FBQ0YsYUFBSyxTQUFMO0FBQ0UsZUFBS0ksU0FBTCxDQUFlSixDQUFmO0FBQ0E7QUFDRixhQUFLLFNBQUw7QUFDRSxlQUFLSyxTQUFMLENBQWVM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O0FBQ0Q7QUFDRjs7Ozs7a0JBdEZrQjVDLGMiLCJmaWxlIjoiYnJ1c2gtem9vbS1zdGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBucyBmcm9tICcuLi9jb3JlL25hbWVzcGFjZSc7XG5pbXBvcnQgQmFzZVN0YXRlIGZyb20gJy4vYmFzZS1zdGF0ZSc7XG5cblxuLyoqXG4gKiBQcm90b29scyBsaWtlIHpvb20gd2l0aCB6b25lIHNlbGVjdGlvbi4gUHJlc3Mgc3BhY2UgYmFyIHRvIHJlc2V0IHpvb20uXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvc3RhdGVzLXpvb20uaHRtbClcbiAqXG4gKiBAdG9kbyAtIGNvdWxkIGFsc28gaGFuZGxlIGBnYCBhbmQgYGhgIGtleXMgdG8gem9vbS1pbiwgem9vbS1vdXQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJydXNoWm9vbVN0YXRlIGV4dGVuZHMgQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUpIHtcbiAgICBzdXBlcih0aW1lbGluZSk7XG4gIH1cblxuICBoYW5kbGVFdmVudChlKSB7XG4gICAgc3dpdGNoKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlRG93bihlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxuICAgICAgICB0aGlzLm9uTW91c2VNb3ZlKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICB0aGlzLm9uTW91c2VVcChlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdrZXlkb3duJzpcbiAgICAgICAgdGhpcy5vbktleURvd24oZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VEb3duKGUpIHtcbiAgICB0aGlzLmJydXNoZXMgPSBbXTtcbiAgICB0aGlzLnN0YXJ0WCA9IGUueDtcbiAgICAvLyBjcmVhdGUgYnJ1c2ggaW4gZWFjaCBjb250YWluZXJzXG4gICAgdGhpcy50cmFja3MuZm9yRWFjaCgodHJhY2spID0+IHtcbiAgICAgIGNvbnN0IGludGVyYWN0aW9ucyA9IHRyYWNrLiRpbnRlcmFjdGlvbnM7XG5cbiAgICAgIGNvbnN0IGJydXNoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAncmVjdCcpO1xuICAgICAgYnJ1c2guc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIHRyYWNrLmhlaWdodCk7XG4gICAgICBicnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneScsIDApO1xuICAgICAgYnJ1c2guc3R5bGUuZmlsbCA9ICcjNzg3ODc4JztcbiAgICAgIGJydXNoLnN0eWxlLm9wYWNpdHkgPSAwLjI7XG5cbiAgICAgIGludGVyYWN0aW9ucy5hcHBlbmRDaGlsZChicnVzaCk7XG5cbiAgICAgIHRoaXMuYnJ1c2hlcy5wdXNoKGJydXNoKTtcbiAgICB9KTtcbiAgfVxuXG4gIG9uTW91c2VNb3ZlKGUpIHtcbiAgICAvLyB1cGRhdGUgYnJ1c2hcbiAgICBjb25zdCB3aWR0aCA9IE1hdGguYWJzKGUueCAtIHRoaXMuc3RhcnRYKTtcbiAgICBjb25zdCB4ID0gTWF0aC5taW4oZS54LCB0aGlzLnN0YXJ0WCk7XG5cbiAgICB0aGlzLmJydXNoZXMuZm9yRWFjaCgoYnJ1c2gpID0+IHtcbiAgICAgIGJydXNoLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHdpZHRoKTtcbiAgICAgIGJydXNoLnNldEF0dHJpYnV0ZU5TKG51bGwsICd4JywgeCk7XG4gICAgfSk7XG4gIH1cblxuICBvbk1vdXNlVXAoZSkge1xuICAgIC8vIHJlbW92ZSBicnVzaFxuICAgIHRoaXMuYnJ1c2hlcy5mb3JFYWNoKChicnVzaCkgPT4ge1xuICAgICAgYnJ1c2gucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChicnVzaCk7XG4gICAgfSk7XG5cbiAgICAvLyB1cGRhdGUgdGltZUNvbnRleHRcbiAgICBjb25zdCBzdGFydFggPSB0aGlzLnN0YXJ0WDtcbiAgICBjb25zdCBlbmRYID0gZS54O1xuICAgIC8vIHJldHVybiBpZiBubyBkcmFnXG4gICAgaWYgKE1hdGguYWJzKHN0YXJ0WCAtIGVuZFgpIDwgMSkgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IGxlZnRYID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oc3RhcnRYLCBlbmRYKSk7XG4gICAgY29uc3QgcmlnaHRYID0gTWF0aC5tYXgoc3RhcnRYLCBlbmRYKTtcblxuICAgIGxldCBtaW5UaW1lID0gdGhpcy50aW1lbGluZS50aW1lVG9QaXhlbC5pbnZlcnQobGVmdFgpO1xuICAgIGxldCBtYXhUaW1lID0gdGhpcy50aW1lbGluZS50aW1lVG9QaXhlbC5pbnZlcnQocmlnaHRYKTtcblxuICAgIGNvbnN0IGRlbHRhRHVyYXRpb24gPSBtYXhUaW1lIC0gbWluVGltZTtcbiAgICBjb25zdCB6b29tID0gdGhpcy50aW1lbGluZS52aXNpYmxlRHVyYXRpb24gLyBkZWx0YUR1cmF0aW9uO1xuXG4gICAgdGhpcy50aW1lbGluZS5vZmZzZXQgLT0gbWluVGltZTtcbiAgICB0aGlzLnRpbWVsaW5lLnpvb20gKj0gem9vbTtcblxuICAgIHRoaXMudHJhY2tzLnVwZGF0ZSgpO1xuICB9XG5cbiAgb25LZXlEb3duKGUpIHtcbiAgICAvLyByZXNldCBvbiBzcGFjZSBiYXJcbiAgICBpZiAoZS5vcmlnaW5hbEV2ZW50LmtleUNvZGUgPT09IDMyKSB7XG4gICAgICB0aGlzLnRpbWVsaW5lLm9mZnNldCA9IDA7XG4gICAgICB0aGlzLnRpbWVsaW5lLnpvb20gPSAxO1xuICAgICAgdGhpcy50cmFja3MudXBkYXRlKCk7XG4gICAgfVxuICB9XG59XG4iXX0=