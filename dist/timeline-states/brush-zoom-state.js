"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var ns = _interopRequire(require("../core/namespace"));

var BaseState = _interopRequire(require("./base-state"));

// works (maybe same problem as CenteredZoom)

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
        this.views.forEach(function (view) {
          var interactions = view.$interactions;

          var brush = document.createElementNS(ns, "rect");
          brush.setAttributeNS(null, "height", view.height);
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
        var _this = this;

        // remove brush
        this.brushes.forEach(function (brush) {
          brush.parentNode.removeChild(brush);
        });

        this.views.forEach(function (view) {
          var timeContext = view.timeContext;
          // update timeContext
          var startX = _this.startX;
          var endX = e.x;

          var minTime = timeContext.xScale.invert(Math.min(startX, endX));
          var maxTime = timeContext.xScale.invert(Math.max(startX, endX));
          var deltaDuration = maxTime - minTime;

          var stretchRatio = timeContext.duration / deltaDuration;

          view.offset = -minTime;
          view.zoom = stretchRatio;
        });

        this.views.update();
      }
    },
    onKeyDown: {
      value: function onKeyDown(e) {
        // reset on space bar
        if (e.originalEvent.keyCode === 32) {
          this.views.offset = 0;
          this.views.zoom = 1;
          this.views.update();
        }
      }
    }
  });

  return BrushZoomState;
})(BaseState);

module.exports = BrushZoomState;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi90aW1lbGluZS1zdGF0ZXMvYnJ1c2gtem9vbS1zdGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztJQUFPLEVBQUUsMkJBQU0sbUJBQW1COztJQUMzQixTQUFTLDJCQUFNLGNBQWM7Ozs7SUFHZixjQUFjO0FBQ3RCLFdBRFEsY0FBYyxDQUNyQixRQUFRLEVBQUU7MEJBREgsY0FBYzs7QUFFL0IscUNBRmlCLGNBQWMsNkNBRXpCLFFBQVEsRUFBRTtHQUNqQjs7WUFIa0IsY0FBYzs7ZUFBZCxjQUFjO0FBS2pDLGVBQVc7YUFBQSxxQkFBQyxDQUFDLEVBQUU7QUFDYixnQkFBTyxDQUFDLENBQUMsSUFBSTtBQUNYLGVBQUssV0FBVztBQUNkLGdCQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLGtCQUFNO0FBQUEsQUFDUixlQUFLLFdBQVc7QUFDZCxnQkFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixrQkFBTTtBQUFBLEFBQ1IsZUFBSyxTQUFTO0FBQ1osZ0JBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsa0JBQU07QUFBQSxBQUNSLGVBQUssU0FBUztBQUNaLGdCQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLGtCQUFNO0FBQUEsU0FDVDtPQUNGOztBQUVELGVBQVc7YUFBQSxxQkFBQyxDQUFDLEVBQUU7OztBQUNiLFlBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLFlBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFbEIsWUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDM0IsY0FBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQzs7QUFFeEMsY0FBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFD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em9vbS1zdGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBucyBmcm9tICcuLi9jb3JlL25hbWVzcGFjZSc7XG5pbXBvcnQgQmFzZVN0YXRlIGZyb20gJy4vYmFzZS1zdGF0ZSc7XG5cbi8vIHdvcmtzIChtYXliZSBzYW1lIHByb2JsZW0gYXMgQ2VudGVyZWRab29tKVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnJ1c2hab29tU3RhdGUgZXh0ZW5kcyBCYXNlU3RhdGUge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSkge1xuICAgIHN1cGVyKHRpbWVsaW5lKTtcbiAgfVxuXG4gIGhhbmRsZUV2ZW50KGUpIHtcbiAgICBzd2l0Y2goZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICB0aGlzLm9uTW91c2VEb3duKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XG4gICAgICAgIHRoaXMub25Nb3VzZU1vdmUoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIHRoaXMub25Nb3VzZVVwKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2tleWRvd24nOlxuICAgICAgICB0aGlzLm9uS2V5RG93bihlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZURvd24oZSkge1xuICAgIHRoaXMuYnJ1c2hlcyA9IFtdO1xuICAgIHRoaXMuc3RhcnRYID0gZS54O1xuICAgIC8vIGNyZWF0ZSBicnVzaCBpbiBlYWNoIGNvbnRhaW5lcnNcbiAgICB0aGlzLnZpZXdzLmZvckVhY2goKHZpZXcpID0+IHtcbiAgICAgIGNvbnN0IGludGVyYWN0aW9ucyA9IHZpZXcuJGludGVyYWN0aW9ucztcblxuICAgICAgY29uc3QgYnJ1c2ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdyZWN0Jyk7XG4gICAgICBicnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0Jywgdmlldy5oZWlnaHQpO1xuICAgICAgYnJ1c2guc2V0QXR0cmlidXRlTlMobnVsbCwgJ3knLCAwKTtcbiAgICAgIGJydXNoLnN0eWxlLmZpbGwgPSAnIzc4Nzg3OCc7XG4gICAgICBicnVzaC5zdHlsZS5vcGFjaXR5ID0gMC4yO1xuXG4gICAgICBpbnRlcmFjdGlvbnMuYXBwZW5kQ2hpbGQoYnJ1c2gpO1xuXG4gICAgICB0aGlzLmJydXNoZXMucHVzaChicnVzaCk7XG4gICAgfSk7XG4gIH1cblxuICBvbk1vdXNlTW92ZShlKSB7XG4gICAgLy8gdXBkYXRlIGJydXNoXG4gICAgY29uc3Qgd2lkdGggPSBNYXRoLmFicyhlLnggLSB0aGlzLnN0YXJ0WCk7XG4gICAgY29uc3QgeCA9IE1hdGgubWluKGUueCwgdGhpcy5zdGFydFgpO1xuXG4gICAgdGhpcy5icnVzaGVzLmZvckVhY2goKGJydXNoKSA9PiB7XG4gICAgICBicnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB3aWR0aCk7XG4gICAgICBicnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneCcsIHgpO1xuICAgIH0pO1xuICB9XG5cbiAgb25Nb3VzZVVwKGUpIHtcbiAgICAvLyByZW1vdmUgYnJ1c2hcbiAgICB0aGlzLmJydXNoZXMuZm9yRWFjaCgoYnJ1c2gpID0+IHtcbiAgICAgIGJydXNoLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoYnJ1c2gpO1xuICAgIH0pO1xuXG4gICAgdGhpcy52aWV3cy5mb3JFYWNoKCh2aWV3KSA9PiB7XG4gICAgICBjb25zdCB0aW1lQ29udGV4dCA9IHZpZXcudGltZUNvbnRleHQ7XG4gICAgICAvLyB1cGRhdGUgdGltZUNvbnRleHRcbiAgICAgIGNvbnN0IHN0YXJ0WCA9IHRoaXMuc3RhcnRYO1xuICAgICAgY29uc3QgZW5kWCA9IGUueDtcblxuICAgICAgY29uc3QgbWluVGltZSA9IHRpbWVDb250ZXh0LnhTY2FsZS5pbnZlcnQoTWF0aC5taW4oc3RhcnRYLCBlbmRYKSk7XG4gICAgICBjb25zdCBtYXhUaW1lID0gdGltZUNvbnRleHQueFNjYWxlLmludmVydChNYXRoLm1heChzdGFydFgsIGVuZFgpKTtcbiAgICAgIGNvbnN0IGRlbHRhRHVyYXRpb24gPSBtYXhUaW1lIC0gbWluVGltZTtcblxuICAgICAgY29uc3Qgc3RyZXRjaFJhdGlvID0gdGltZUNvbnRleHQuZHVyYXRpb24gLyBkZWx0YUR1cmF0aW9uO1xuXG4gICAgICB2aWV3Lm9mZnNldCA9IC1taW5UaW1lO1xuICAgICAgdmlldy56b29tID0gc3RyZXRjaFJhdGlvO1xuICAgIH0pO1xuXG4gICAgdGhpcy52aWV3cy51cGRhdGUoKTtcbiAgfVxuXG4gIG9uS2V5RG93bihlKSB7XG4gICAgLy8gcmVzZXQgb24gc3BhY2UgYmFyXG4gICAgaWYgKGUub3JpZ2luYWxFdmVudC5rZXlDb2RlID09PSAzMikge1xuICAgICAgdGhpcy52aWV3cy5vZmZzZXQgPSAwO1xuICAgICAgdGhpcy52aWV3cy56b29tID0gMTtcbiAgICAgIHRoaXMudmlld3MudXBkYXRlKCk7XG4gICAgfVxuICB9XG59XG4iXX0=