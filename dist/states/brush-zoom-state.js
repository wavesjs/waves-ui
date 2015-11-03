'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreNamespace = require('../core/namespace');

var _coreNamespace2 = _interopRequireDefault(_coreNamespace);

var _baseState = require('./base-state');

var _baseState2 = _interopRequireDefault(_baseState);

/**
 * Protools like zoom with zone selection. Press space bar to reset zoom.
 *
 * [example usage](./examples/states-zoom.html)
 *
 * @todo - could also handle `g` and `h` keys to zoom-in, zoom-out.
 */

var BrushZoomState = (function (_BaseState) {
  _inherits(BrushZoomState, _BaseState);

  function BrushZoomState(timeline) {
    _classCallCheck(this, BrushZoomState);

    _get(Object.getPrototypeOf(BrushZoomState.prototype), 'constructor', this).call(this, timeline);
  }

  _createClass(BrushZoomState, [{
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
      var _this = this;

      this.brushes = [];
      this.startX = e.x;
      // create brush in each containers
      this.tracks.forEach(function (track) {
        var interactions = track.$interactions;

        var brush = document.createElementNS(_coreNamespace2['default'], 'rect');
        brush.setAttributeNS(null, 'height', track.height);
        brush.setAttributeNS(null, 'y', 0);
        brush.style.fill = '#787878';
        brush.style.opacity = 0.2;

        interactions.appendChild(brush);

        _this.brushes.push(brush);
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
})(_baseState2['default']);

exports['default'] = BrushZoomState;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zdGF0ZXMvYnJ1c2gtem9vbS1zdGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzZCQUFlLG1CQUFtQjs7Ozt5QkFDWixjQUFjOzs7Ozs7Ozs7Ozs7SUFVZixjQUFjO1lBQWQsY0FBYzs7QUFDdEIsV0FEUSxjQUFjLENBQ3JCLFFBQVEsRUFBRTswQkFESCxjQUFjOztBQUUvQiwrQkFGaUIsY0FBYyw2Q0FFekIsUUFBUSxFQUFFO0dBQ2pCOztlQUhrQixjQUFjOztXQUt0QixxQkFBQyxDQUFDLEVBQUU7QUFDYixjQUFPLENBQUMsQ0FBQyxJQUFJO0FBQ1gsYUFBSyxXQUFXO0FBQ2QsY0FBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixnQkFBTTtBQUFBLEFBQ1IsYUFBSyxXQUFXO0FBQ2QsY0FBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixnQkFBTTtBQUFBLEFBQ1IsYUFBSyxTQUFTO0FBQ1osY0FBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixnQkFBTTtBQUFBLEFBQ1IsYUFBSyxTQUFTO0FBQ1osY0FBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixnQkFBTTtBQUFBLE9BQ1Q7S0FDRjs7O1dBRVUscUJBQUMsQ0FBQyxFQUFFOzs7QUFDYixVQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUNsQixVQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRWxCLFVBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFLO0FBQzdCLFlBQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUM7O0FBRXpDLFlBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxlQUFlLDZCQUFLLE1BQU0sQ0FBQyxDQUFDO0FBQ25ELGFBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFB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aWxlIjoic3JjL3N0YXRlcy9icnVzaC16b29tLXN0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG5zIGZyb20gJy4uL2NvcmUvbmFtZXNwYWNlJztcbmltcG9ydCBCYXNlU3RhdGUgZnJvbSAnLi9iYXNlLXN0YXRlJztcblxuXG4vKipcbiAqIFByb3Rvb2xzIGxpa2Ugem9vbSB3aXRoIHpvbmUgc2VsZWN0aW9uLiBQcmVzcyBzcGFjZSBiYXIgdG8gcmVzZXQgem9vbS5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9zdGF0ZXMtem9vbS5odG1sKVxuICpcbiAqIEB0b2RvIC0gY291bGQgYWxzbyBoYW5kbGUgYGdgIGFuZCBgaGAga2V5cyB0byB6b29tLWluLCB6b29tLW91dC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnJ1c2hab29tU3RhdGUgZXh0ZW5kcyBCYXNlU3RhdGUge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSkge1xuICAgIHN1cGVyKHRpbWVsaW5lKTtcbiAgfVxuXG4gIGhhbmRsZUV2ZW50KGUpIHtcbiAgICBzd2l0Y2goZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICB0aGlzLm9uTW91c2VEb3duKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XG4gICAgICAgIHRoaXMub25Nb3VzZU1vdmUoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIHRoaXMub25Nb3VzZVVwKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2tleWRvd24nOlxuICAgICAgICB0aGlzLm9uS2V5RG93bihlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZURvd24oZSkge1xuICAgIHRoaXMuYnJ1c2hlcyA9IFtdO1xuICAgIHRoaXMuc3RhcnRYID0gZS54O1xuICAgIC8vIGNyZWF0ZSBicnVzaCBpbiBlYWNoIGNvbnRhaW5lcnNcbiAgICB0aGlzLnRyYWNrcy5mb3JFYWNoKCh0cmFjaykgPT4ge1xuICAgICAgY29uc3QgaW50ZXJhY3Rpb25zID0gdHJhY2suJGludGVyYWN0aW9ucztcblxuICAgICAgY29uc3QgYnJ1c2ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdyZWN0Jyk7XG4gICAgICBicnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgdHJhY2suaGVpZ2h0KTtcbiAgICAgIGJydXNoLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5JywgMCk7XG4gICAgICBicnVzaC5zdHlsZS5maWxsID0gJyM3ODc4NzgnO1xuICAgICAgYnJ1c2guc3R5bGUub3BhY2l0eSA9IDAuMjtcblxuICAgICAgaW50ZXJhY3Rpb25zLmFwcGVuZENoaWxkKGJydXNoKTtcblxuICAgICAgdGhpcy5icnVzaGVzLnB1c2goYnJ1c2gpO1xuICAgIH0pO1xuICB9XG5cbiAgb25Nb3VzZU1vdmUoZSkge1xuICAgIC8vIHVwZGF0ZSBicnVzaFxuICAgIGNvbnN0IHdpZHRoID0gTWF0aC5hYnMoZS54IC0gdGhpcy5zdGFydFgpO1xuICAgIGNvbnN0IHggPSBNYXRoLm1pbihlLngsIHRoaXMuc3RhcnRYKTtcblxuICAgIHRoaXMuYnJ1c2hlcy5mb3JFYWNoKChicnVzaCkgPT4ge1xuICAgICAgYnJ1c2guc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgd2lkdGgpO1xuICAgICAgYnJ1c2guc2V0QXR0cmlidXRlTlMobnVsbCwgJ3gnLCB4KTtcbiAgICB9KTtcbiAgfVxuXG4gIG9uTW91c2VVcChlKSB7XG4gICAgLy8gcmVtb3ZlIGJydXNoXG4gICAgdGhpcy5icnVzaGVzLmZvckVhY2goKGJydXNoKSA9PiB7XG4gICAgICBicnVzaC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGJydXNoKTtcbiAgICB9KTtcblxuICAgIC8vIHVwZGF0ZSB0aW1lQ29udGV4dFxuICAgIGNvbnN0IHN0YXJ0WCA9IHRoaXMuc3RhcnRYO1xuICAgIGNvbnN0IGVuZFggPSBlLng7XG4gICAgLy8gcmV0dXJuIGlmIG5vIGRyYWdcbiAgICBpZiAoTWF0aC5hYnMoc3RhcnRYIC0gZW5kWCkgPCAxKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgbGVmdFggPSBNYXRoLm1heCgwLCBNYXRoLm1pbihzdGFydFgsIGVuZFgpKTtcbiAgICBjb25zdCByaWdodFggPSBNYXRoLm1heChzdGFydFgsIGVuZFgpO1xuXG4gICAgbGV0IG1pblRpbWUgPSB0aGlzLnRpbWVsaW5lLnRpbWVUb1BpeGVsLmludmVydChsZWZ0WCk7XG4gICAgbGV0IG1heFRpbWUgPSB0aGlzLnRpbWVsaW5lLnRpbWVUb1BpeGVsLmludmVydChyaWdodFgpO1xuXG4gICAgY29uc3QgZGVsdGFEdXJhdGlvbiA9IG1heFRpbWUgLSBtaW5UaW1lO1xuICAgIGNvbnN0IHpvb20gPSB0aGlzLnRpbWVsaW5lLnZpc2libGVEdXJhdGlvbiAvIGRlbHRhRHVyYXRpb247XG5cbiAgICB0aGlzLnRpbWVsaW5lLm9mZnNldCAtPSBtaW5UaW1lO1xuICAgIHRoaXMudGltZWxpbmUuem9vbSAqPSB6b29tO1xuXG4gICAgdGhpcy50cmFja3MudXBkYXRlKCk7XG4gIH1cblxuICBvbktleURvd24oZSkge1xuICAgIC8vIHJlc2V0IG9uIHNwYWNlIGJhclxuICAgIGlmIChlLm9yaWdpbmFsRXZlbnQua2V5Q29kZSA9PT0gMzIpIHtcbiAgICAgIHRoaXMudGltZWxpbmUub2Zmc2V0ID0gMDtcbiAgICAgIHRoaXMudGltZWxpbmUuem9vbSA9IDE7XG4gICAgICB0aGlzLnRyYWNrcy51cGRhdGUoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==