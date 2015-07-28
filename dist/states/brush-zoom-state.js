"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var ns = _interopRequire(require("../core/namespace"));

var BaseState = _interopRequire(require("./base-state"));

/**
 * Protools like zoom with zone selection
 * Press space bar to reset zoom default (1)
 * @TODO could also handle 'g' and 'h' key to zoom, de-zoom
 */

var BrushZoomState = (function (_BaseState) {
  function BrushZoomState(timeline) {
    _classCallCheck(this, BrushZoomState);

    _get(_core.Object.getPrototypeOf(BrushZoomState.prototype), "constructor", this).call(this, timeline);
  }

  _inherits(BrushZoomState, _BaseState);

  _createClass(BrushZoomState, {
    handleEvent: {
      value: function handleEvent(e) {
        switch (e.type) {
          case "mousedown":
            this.onMouseDown(e);
            break;
          case "mousemove":
            this.onMouseMove(e);
            break;
          case "mouseup":
            this.onMouseUp(e);
            break;
          case "keydown":
            this.onKeyDown(e);
            break;
        }
      }
    },
    onMouseDown: {
      value: function onMouseDown(e) {
        var _this = this;

        this.brushes = [];
        this.startX = e.x;
        // create brush in each containers
        this.tracks.forEach(function (track) {
          var interactions = track.$interactions;

          var brush = document.createElementNS(ns, "rect");
          brush.setAttributeNS(null, "height", track.height);
          brush.setAttributeNS(null, "y", 0);
          brush.style.fill = "#787878";
          brush.style.opacity = 0.2;

          interactions.appendChild(brush);

          _this.brushes.push(brush);
        });
      }
    },
    onMouseMove: {
      value: function onMouseMove(e) {
        // update brush
        var width = Math.abs(e.x - this.startX);
        var x = Math.min(e.x, this.startX);

        this.brushes.forEach(function (brush) {
          brush.setAttributeNS(null, "width", width);
          brush.setAttributeNS(null, "x", x);
        });
      }
    },
    onMouseUp: {
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
    },
    onKeyDown: {
      value: function onKeyDown(e) {
        // reset on space bar
        if (e.originalEvent.keyCode === 32) {
          this.timeline.offset = 0;
          this.timeline.zoom = 1;
          this.tracks.update();
        }
      }
    }
  });

  return BrushZoomState;
})(BaseState);

module.exports = BrushZoomState;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUFBTyxFQUFFLDJCQUFNLG1CQUFtQjs7SUFDM0IsU0FBUywyQkFBTSxjQUFjOzs7Ozs7OztJQVFmLGNBQWM7QUFDdEIsV0FEUSxjQUFjLENBQ3JCLFFBQVEsRUFBRTswQkFESCxjQUFjOztBQUUvQixxQ0FGaUIsY0FBYyw2Q0FFekIsUUFBUSxFQUFFO0dBQ2pCOztZQUhrQixjQUFjOztlQUFkLGNBQWM7QUFLakMsZUFBVzthQUFBLHFCQUFDLENBQUMsRUFBRTtBQUNiLGdCQUFPLENBQUMsQ0FBQyxJQUFJO0FBQ1gsZUFBSyxXQUFXO0FBQ2QsZ0JBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEIsa0JBQU07QUFBQSxBQUNSLGVBQUssV0FBVztBQUNkLGdCQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLGtCQUFNO0FBQUEsQUFDUixlQUFLLFNBQVM7QUFDWixnQkFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixrQkFBTTtBQUFBLEFBQ1IsZUFBSyxTQUFTO0FBQ1osZ0JBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsa0JBQU07QUFBQSxTQUNUO09BQ0Y7O0FBRUQsZUFBVzthQUFBLHFCQUFDLENBQUMsRUFBRTs7O0FBQ2IsWUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDbEIsWUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUVsQixZQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUssRUFBSztBQUM3QixjQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDOztBQUV6QyxjQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztB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LENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ3RCO09BQ0Y7Ozs7U0F0RmtCLGNBQWM7R0FBUyxTQUFTOztpQkFBaEMsY0FBYyIsImZpbGUiOiJlczYvdXRpbHMvb3J0aG9nb25hbC1kYXRhLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG5zIGZyb20gJy4uL2NvcmUvbmFtZXNwYWNlJztcbmltcG9ydCBCYXNlU3RhdGUgZnJvbSAnLi9iYXNlLXN0YXRlJztcblxuXG4vKipcbiAqIFByb3Rvb2xzIGxpa2Ugem9vbSB3aXRoIHpvbmUgc2VsZWN0aW9uXG4gKiBQcmVzcyBzcGFjZSBiYXIgdG8gcmVzZXQgem9vbSBkZWZhdWx0ICgxKVxuICogQFRPRE8gY291bGQgYWxzbyBoYW5kbGUgJ2cnIGFuZCAnaCcga2V5IHRvIHpvb20sIGRlLXpvb21cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnJ1c2hab29tU3RhdGUgZXh0ZW5kcyBCYXNlU3RhdGUge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSkge1xuICAgIHN1cGVyKHRpbWVsaW5lKTtcbiAgfVxuXG4gIGhhbmRsZUV2ZW50KGUpIHtcbiAgICBzd2l0Y2goZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICB0aGlzLm9uTW91c2VEb3duKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XG4gICAgICAgIHRoaXMub25Nb3VzZU1vdmUoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIHRoaXMub25Nb3VzZVVwKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2tleWRvd24nOlxuICAgICAgICB0aGlzLm9uS2V5RG93bihlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZURvd24oZSkge1xuICAgIHRoaXMuYnJ1c2hlcyA9IFtdO1xuICAgIHRoaXMuc3RhcnRYID0gZS54O1xuICAgIC8vIGNyZWF0ZSBicnVzaCBpbiBlYWNoIGNvbnRhaW5lcnNcbiAgICB0aGlzLnRyYWNrcy5mb3JFYWNoKCh0cmFjaykgPT4ge1xuICAgICAgY29uc3QgaW50ZXJhY3Rpb25zID0gdHJhY2suJGludGVyYWN0aW9ucztcblxuICAgICAgY29uc3QgYnJ1c2ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdyZWN0Jyk7XG4gICAgICBicnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgdHJhY2suaGVpZ2h0KTtcbiAgICAgIGJydXNoLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5JywgMCk7XG4gICAgICBicnVzaC5zdHlsZS5maWxsID0gJyM3ODc4NzgnO1xuICAgICAgYnJ1c2guc3R5bGUub3BhY2l0eSA9IDAuMjtcblxuICAgICAgaW50ZXJhY3Rpb25zLmFwcGVuZENoaWxkKGJydXNoKTtcblxuICAgICAgdGhpcy5icnVzaGVzLnB1c2goYnJ1c2gpO1xuICAgIH0pO1xuICB9XG5cbiAgb25Nb3VzZU1vdmUoZSkge1xuICAgIC8vIHVwZGF0ZSBicnVzaFxuICAgIGNvbnN0IHdpZHRoID0gTWF0aC5hYnMoZS54IC0gdGhpcy5zdGFydFgpO1xuICAgIGNvbnN0IHggPSBNYXRoLm1pbihlLngsIHRoaXMuc3RhcnRYKTtcblxuICAgIHRoaXMuYnJ1c2hlcy5mb3JFYWNoKChicnVzaCkgPT4ge1xuICAgICAgYnJ1c2guc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgd2lkdGgpO1xuICAgICAgYnJ1c2guc2V0QXR0cmlidXRlTlMobnVsbCwgJ3gnLCB4KTtcbiAgICB9KTtcbiAgfVxuXG4gIG9uTW91c2VVcChlKSB7XG4gICAgLy8gcmVtb3ZlIGJydXNoXG4gICAgdGhpcy5icnVzaGVzLmZvckVhY2goKGJydXNoKSA9PiB7XG4gICAgICBicnVzaC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGJydXNoKTtcbiAgICB9KTtcblxuICAgIC8vIHVwZGF0ZSB0aW1lQ29udGV4dFxuICAgIGNvbnN0IHN0YXJ0WCA9IHRoaXMuc3RhcnRYO1xuICAgIGNvbnN0IGVuZFggPSBlLng7XG4gICAgLy8gcmV0dXJuIGlmIG5vIGRyYWdcbiAgICBpZiAoTWF0aC5hYnMoc3RhcnRYIC0gZW5kWCkgPCAxKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgbGVmdFggPSBNYXRoLm1heCgwLCBNYXRoLm1pbihzdGFydFgsIGVuZFgpKTtcbiAgICBjb25zdCByaWdodFggPSBNYXRoLm1heChzdGFydFgsIGVuZFgpO1xuXG4gICAgbGV0IG1pblRpbWUgPSB0aGlzLnRpbWVsaW5lLnRpbWVUb1BpeGVsLmludmVydChsZWZ0WCk7XG4gICAgbGV0IG1heFRpbWUgPSB0aGlzLnRpbWVsaW5lLnRpbWVUb1BpeGVsLmludmVydChyaWdodFgpO1xuXG4gICAgY29uc3QgZGVsdGFEdXJhdGlvbiA9IG1heFRpbWUgLSBtaW5UaW1lO1xuICAgIGNvbnN0IHpvb20gPSB0aGlzLnRpbWVsaW5lLnZpc2libGVEdXJhdGlvbiAvIGRlbHRhRHVyYXRpb247XG5cbiAgICB0aGlzLnRpbWVsaW5lLm9mZnNldCAtPSBtaW5UaW1lO1xuICAgIHRoaXMudGltZWxpbmUuem9vbSAqPSB6b29tO1xuXG4gICAgdGhpcy50cmFja3MudXBkYXRlKCk7XG4gIH1cblxuICBvbktleURvd24oZSkge1xuICAgIC8vIHJlc2V0IG9uIHNwYWNlIGJhclxuICAgIGlmIChlLm9yaWdpbmFsRXZlbnQua2V5Q29kZSA9PT0gMzIpIHtcbiAgICAgIHRoaXMudGltZWxpbmUub2Zmc2V0ID0gMDtcbiAgICAgIHRoaXMudGltZWxpbmUuem9vbSA9IDE7XG4gICAgICB0aGlzLnRyYWNrcy51cGRhdGUoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==