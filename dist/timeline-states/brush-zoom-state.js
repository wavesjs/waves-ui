"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var ns = _interopRequire(require("../core/namespace"));

var BaseState = _interopRequire(require("./base-state"));

// broken

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

        var minPixel = Math.max(0, Math.min(startX, endX));
        var maxPixel = Math.max(startX, endX);
        var minTime = timeline.timeToPixel.invert(minPixel);
        var maxTime = timeline.timeToPixel.invert(maxPixel);

        var deltaDuration = maxTime - minTime;
        var stretchRatio = timeline.duration / deltaDuration;

        view.offset = -minTime;
        view.zoom = stretchRatio;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi90aW1lbGluZS1zdGF0ZXMvYnJ1c2gtem9vbS1zdGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztJQUFPLEVBQUUsMkJBQU0sbUJBQW1COztJQUMzQixTQUFTLDJCQUFNLGNBQWM7Ozs7SUFHZixjQUFjO0FBQ3RCLFdBRFEsY0FBYyxDQUNyQixRQUFRLEVBQUU7MEJBREgsY0FBYzs7QUFFL0IscUNBRmlCLGNBQWMsNkNBRXpCLFFBQVEsRUFBRTtHQUNqQjs7WUFIa0IsY0FBYzs7ZUFBZCxjQUFjO0FBS2pDLGVBQVc7YUFBQSxxQkFBQyxDQUFDLEVBQUU7QUFDYixnQkFBTyxDQUFDLENBQUMsSUFBSTtBQUNYLGVBQUssV0FBVztBQUNkLGdCQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLGtCQUFNO0FBQUEsQUFDUixlQUFLLFdBQVc7QUFDZCxnQkFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixrQkFBTTtBQUFBLEFBQ1IsZUFBSyxTQUFTO0FBQ1osZ0JBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsa0JBQU07QUFBQSxBQUNSLGVBQUssU0FBUztBQUNaLGdCQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLGtCQUFNO0FBQUEsU0FDVDtPQUNGOztBQUVELGVBQVc7YUFBQSxxQkFBQyxDQUFDLEVBQUU7OztBQUNiLFlBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLFlBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFbEIsWUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLLEVBQUs7QUFDN0IsY0FBTSxZQUFZLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQzs7QUFFekMsY0FBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFD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YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG5zIGZyb20gJy4uL2NvcmUvbmFtZXNwYWNlJztcbmltcG9ydCBCYXNlU3RhdGUgZnJvbSAnLi9iYXNlLXN0YXRlJztcblxuLy8gYnJva2VuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCcnVzaFpvb21TdGF0ZSBleHRlbmRzIEJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lKSB7XG4gICAgc3VwZXIodGltZWxpbmUpO1xuICB9XG5cbiAgaGFuZGxlRXZlbnQoZSkge1xuICAgIHN3aXRjaChlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ21vdXNlZG93bic6XG4gICAgICAgIHRoaXMub25Nb3VzZURvd24oZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlTW92ZShlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZXVwJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlVXAoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAna2V5ZG93bic6XG4gICAgICAgIHRoaXMub25LZXlEb3duKGUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBvbk1vdXNlRG93bihlKSB7XG4gICAgdGhpcy5icnVzaGVzID0gW107XG4gICAgdGhpcy5zdGFydFggPSBlLng7XG4gICAgLy8gY3JlYXRlIGJydXNoIGluIGVhY2ggY29udGFpbmVyc1xuICAgIHRoaXMudHJhY2tzLmZvckVhY2goKHRyYWNrKSA9PiB7XG4gICAgICBjb25zdCBpbnRlcmFjdGlvbnMgPSB0cmFjay4kaW50ZXJhY3Rpb25zO1xuXG4gICAgICBjb25zdCBicnVzaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3JlY3QnKTtcbiAgICAgIGJydXNoLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCB0cmFjay5oZWlnaHQpO1xuICAgICAgYnJ1c2guc2V0QXR0cmlidXRlTlMobnVsbCwgJ3knLCAwKTtcbiAgICAgIGJydXNoLnN0eWxlLmZpbGwgPSAnIzc4Nzg3OCc7XG4gICAgICBicnVzaC5zdHlsZS5vcGFjaXR5ID0gMC4yO1xuXG4gICAgICBpbnRlcmFjdGlvbnMuYXBwZW5kQ2hpbGQoYnJ1c2gpO1xuXG4gICAgICB0aGlzLmJydXNoZXMucHVzaChicnVzaCk7XG4gICAgfSk7XG4gIH1cblxuICBvbk1vdXNlTW92ZShlKSB7XG4gICAgLy8gdXBkYXRlIGJydXNoXG4gICAgY29uc3Qgd2lkdGggPSBNYXRoLmFicyhlLnggLSB0aGlzLnN0YXJ0WCk7XG4gICAgY29uc3QgeCA9IE1hdGgubWluKGUueCwgdGhpcy5zdGFydFgpO1xuXG4gICAgdGhpcy5icnVzaGVzLmZvckVhY2goKGJydXNoKSA9PiB7XG4gICAgICBicnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB3aWR0aCk7XG4gICAgICBicnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneCcsIHgpO1xuICAgIH0pO1xuICB9XG5cbiAgb25Nb3VzZVVwKGUpIHtcbiAgICAvLyByZW1vdmUgYnJ1c2hcbiAgICB0aGlzLmJydXNoZXMuZm9yRWFjaCgoYnJ1c2gpID0+IHtcbiAgICAgIGJydXNoLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoYnJ1c2gpO1xuICAgIH0pO1xuXG4gICAgLy8gdXBkYXRlIHRpbWVDb250ZXh0XG4gICAgY29uc3Qgc3RhcnRYID0gdGhpcy5zdGFydFg7XG4gICAgY29uc3QgZW5kWCA9IGUueDtcblxuICAgIGNvbnN0IG1pblBpeGVsID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oc3RhcnRYLCBlbmRYKSk7XG4gICAgY29uc3QgbWF4UGl4ZWwgPSBNYXRoLm1heChzdGFydFgsIGVuZFgpO1xuICAgIGNvbnN0IG1pblRpbWUgPSB0aW1lbGluZS50aW1lVG9QaXhlbC5pbnZlcnQobWluUGl4ZWwpO1xuICAgIGNvbnN0IG1heFRpbWUgPSB0aW1lbGluZS50aW1lVG9QaXhlbC5pbnZlcnQobWF4UGl4ZWwpO1xuXG4gICAgY29uc3QgZGVsdGFEdXJhdGlvbiA9IG1heFRpbWUgLSBtaW5UaW1lO1xuICAgIGNvbnN0IHN0cmV0Y2hSYXRpbyA9IHRpbWVsaW5lLmR1cmF0aW9uIC8gZGVsdGFEdXJhdGlvbjtcblxuICAgIHZpZXcub2Zmc2V0ID0gLW1pblRpbWU7XG4gICAgdmlldy56b29tID0gc3RyZXRjaFJhdGlvO1xuXG4gICAgdGhpcy50cmFja3MudXBkYXRlKCk7XG4gIH1cblxuICBvbktleURvd24oZSkge1xuICAgIC8vIHJlc2V0IG9uIHNwYWNlIGJhclxuICAgIGlmIChlLm9yaWdpbmFsRXZlbnQua2V5Q29kZSA9PT0gMzIpIHtcbiAgICAgIHRoaXMudGltZWxpbmUub2Zmc2V0ID0gMDtcbiAgICAgIHRoaXMudGltZWxpbmUuem9vbSA9IDE7XG4gICAgICB0aGlzLnRyYWNrcy51cGRhdGUoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==