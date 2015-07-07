"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var TimeContextBehavior = (function () {
  function TimeContextBehavior() {
    _classCallCheck(this, TimeContextBehavior);
  }

  _createClass(TimeContextBehavior, {
    setEditable: {
      /**
       *  draw the shape to interact with the context
       *  @params bool {Boolean} define if the layer's context is editable or not
       */

      value: function setEditable(layer) {
        var bool = arguments[1] === undefined ? true : arguments[1];

        var display = bool ? "block" : "none";
        layer.interactionsGroup.style.display = display;
        layer._isContextEditable = bool;
      }
    },
    edit: {
      value: function edit(layer, dx, dy, target) {
        var timeContext = layer.timeContext;

        if (target === layer.contextShape.leftHandler) {
          this._editLeft(timeContext, dx);
        } else if (target === layer.contextShape.rightHandler) {
          this._editRight(timeContext, dx);
        } else {
          this._move(timeContext, dx);
        }
      }
    },
    _editLeft: {
      value: function _editLeft(timeContext, dx) {
        // edit `start`, `offset` and `duration`
        var x = timeContext.parent.xScale(timeContext.start);
        var offset = timeContext.xScale(timeContext.offset);
        var width = timeContext.xScale(timeContext.duration);

        var targetX = x + dx;
        var targetOffset = offset - dx;
        var targetWidth = Math.max(width - dx, 1);

        timeContext.start = timeContext.parent.xScale.invert(targetX);
        timeContext.offset = timeContext.xScale.invert(targetOffset);
        timeContext.duration = timeContext.xScale.invert(targetWidth);
      }
    },
    _editRight: {
      value: function _editRight(timeContext, dx) {
        var width = timeContext.xScale(timeContext.duration);
        var targetWidth = Math.max(width + dx, 1);

        timeContext.duration = timeContext.xScale.invert(targetWidth);
      }
    },
    _move: {
      value: function _move(timeContext, dx) {
        var x = timeContext.parent.xScale(timeContext.start);
        var targetX = Math.max(x + dx, 0);

        timeContext.start = timeContext.parent.xScale.invert(targetX);
      }
    },
    stretch: {
      value: function stretch(layer, dx, dy, target) {
        var timeContext = layer.timeContext;
        var lastDuration = timeContext.duration;
        var lastOffset = timeContext.offset;

        if (target.classList.contains("handler") && target.classList.contains("left")) {
          this._editLeft(timeContext, dx);
        } else if (target.classList.contains("handler") && target.classList.contains("right")) {
          this._editRight(timeContext, dx);
        } else {
          this._move(timeContext, dx);
        }

        var newDuration = timeContext.duration;
        var ratio = newDuration / lastDuration;

        timeContext.stretchRatio *= ratio;
        timeContext.offset = lastOffset;
        timeContext.duration = lastDuration;
      }
    }
  });

  return TimeContextBehavior;
})();

module.exports = TimeContextBehavior;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9iZWhhdmlvcnMvdGltZS1jb250ZXh0LWJlaGF2aW9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztJQUFNLG1CQUFtQjtXQUFuQixtQkFBbUI7MEJBQW5CLG1CQUFtQjs7O2VBQW5CLG1CQUFtQjtBQUt2QixlQUFXOzs7Ozs7YUFBQSxxQkFBQyxLQUFLLEVBQWU7WUFBYixJQUFJLGdDQUFHLElBQUk7O0FBQzVCLFlBQU0sT0FBTyxHQUFHLElBQUksR0FBRyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQ3hDLGFBQUssQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUNoRCxhQUFLLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO09BQ2pDOztBQUVELFFBQUk7YUFBQSxjQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTtBQUMxQixZQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDOztBQUV0QyxZQUFJLE1BQU0sS0FBSyxLQUFLLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRTtBQUM3QyxjQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztTQUNqQyxNQUFNLElBQUksTUFBTSxLQUFLLEtBQUssQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFO0FBQ3JELGNBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQ2xDLE1BQU07QUFDTCxjQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztTQUM3QjtPQUNGOztBQUVELGFBQVM7YUFBQSxtQkFBQyxXQUFXLEVBQUUsRUFBRSxFQUFFOztBQUV6QixZQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkQsWUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLE1BQU0s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Ozs7U0F2RUcsbUJBQW1COzs7QUEwRXpCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsbUJBQW1CLENBQUMiLCJmaWxlIjoiZXM2L2JlaGF2aW9ycy90aW1lLWNvbnRleHQtYmVoYXZpb3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBUaW1lQ29udGV4dEJlaGF2aW9yIHtcbiAgLyoqXG4gICAqICBkcmF3IHRoZSBzaGFwZSB0byBpbnRlcmFjdCB3aXRoIHRoZSBjb250ZXh0XG4gICAqICBAcGFyYW1zIGJvb2wge0Jvb2xlYW59IGRlZmluZSBpZiB0aGUgbGF5ZXIncyBjb250ZXh0IGlzIGVkaXRhYmxlIG9yIG5vdFxuICAgKi9cbiAgc2V0RWRpdGFibGUobGF5ZXIsIGJvb2wgPSB0cnVlKSB7XG4gICAgY29uc3QgZGlzcGxheSA9IGJvb2wgPyAnYmxvY2snIDogJ25vbmUnO1xuICAgIGxheWVyLmludGVyYWN0aW9uc0dyb3VwLnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5O1xuICAgIGxheWVyLl9pc0NvbnRleHRFZGl0YWJsZSA9IGJvb2w7XG4gIH1cblxuICBlZGl0KGxheWVyLCBkeCwgZHksIHRhcmdldCkge1xuICAgIGNvbnN0IHRpbWVDb250ZXh0ID0gbGF5ZXIudGltZUNvbnRleHQ7XG5cbiAgICBpZiAodGFyZ2V0ID09PSBsYXllci5jb250ZXh0U2hhcGUubGVmdEhhbmRsZXIpIHtcbiAgICAgIHRoaXMuX2VkaXRMZWZ0KHRpbWVDb250ZXh0LCBkeCk7XG4gICAgfSBlbHNlIGlmICh0YXJnZXQgPT09IGxheWVyLmNvbnRleHRTaGFwZS5yaWdodEhhbmRsZXIpIHtcbiAgICAgIHRoaXMuX2VkaXRSaWdodCh0aW1lQ29udGV4dCwgZHgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9tb3ZlKHRpbWVDb250ZXh0LCBkeCk7XG4gICAgfVxuICB9XG5cbiAgX2VkaXRMZWZ0KHRpbWVDb250ZXh0LCBkeCkge1xuICAgIC8vIGVkaXQgYHN0YXJ0YCwgYG9mZnNldGAgYW5kIGBkdXJhdGlvbmBcbiAgICBjb25zdCB4ID0gdGltZUNvbnRleHQucGFyZW50LnhTY2FsZSh0aW1lQ29udGV4dC5zdGFydCk7XG4gICAgY29uc3Qgb2Zmc2V0ID0gdGltZUNvbnRleHQueFNjYWxlKHRpbWVDb250ZXh0Lm9mZnNldCk7XG4gICAgY29uc3Qgd2lkdGggPSB0aW1lQ29udGV4dC54U2NhbGUodGltZUNvbnRleHQuZHVyYXRpb24pO1xuXG4gICAgY29uc3QgdGFyZ2V0WCA9IHggKyBkeDtcbiAgICBjb25zdCB0YXJnZXRPZmZzZXQgPSBvZmZzZXQgLSBkeDtcbiAgICBjb25zdCB0YXJnZXRXaWR0aCA9IE1hdGgubWF4KHdpZHRoIC0gZHgsIDEpO1xuXG4gICAgdGltZUNvbnRleHQuc3RhcnQgPSB0aW1lQ29udGV4dC5wYXJlbnQueFNjYWxlLmludmVydCh0YXJnZXRYKTtcbiAgICB0aW1lQ29udGV4dC5vZmZzZXQgPSB0aW1lQ29udGV4dC54U2NhbGUuaW52ZXJ0KHRhcmdldE9mZnNldCk7XG4gICAgdGltZUNvbnRleHQuZHVyYXRpb24gPSB0aW1lQ29udGV4dC54U2NhbGUuaW52ZXJ0KHRhcmdldFdpZHRoKTtcbiAgfVxuXG4gIF9lZGl0UmlnaHQodGltZUNvbnRleHQsIGR4KSB7XG4gICAgY29uc3Qgd2lkdGggPSB0aW1lQ29udGV4dC54U2NhbGUodGltZUNvbnRleHQuZHVyYXRpb24pO1xuICAgIGNvbnN0IHRhcmdldFdpZHRoID0gTWF0aC5tYXgod2lkdGggKyBkeCwgMSk7XG5cbiAgICB0aW1lQ29udGV4dC5kdXJhdGlvbiA9IHRpbWVDb250ZXh0LnhTY2FsZS5pbnZlcnQodGFyZ2V0V2lkdGgpO1xuICB9XG5cbiAgX21vdmUodGltZUNvbnRleHQsIGR4KSB7XG4gICAgY29uc3QgeCA9IHRpbWVDb250ZXh0LnBhcmVudC54U2NhbGUodGltZUNvbnRleHQuc3RhcnQpO1xuICAgIGNvbnN0IHRhcmdldFggPSBNYXRoLm1heCh4ICsgZHgsIDApO1xuXG4gICAgdGltZUNvbnRleHQuc3RhcnQgPSB0aW1lQ29udGV4dC5wYXJlbnQueFNjYWxlLmludmVydCh0YXJnZXRYKTtcbiAgfVxuXG4gIHN0cmV0Y2gobGF5ZXIsIGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgY29uc3QgdGltZUNvbnRleHQgPSBsYXllci50aW1lQ29udGV4dDtcbiAgICBjb25zdCBsYXN0RHVyYXRpb24gPSB0aW1lQ29udGV4dC5kdXJhdGlvbjtcbiAgICBjb25zdCBsYXN0T2Zmc2V0ID0gdGltZUNvbnRleHQub2Zmc2V0O1xuXG4gICAgaWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2hhbmRsZXInKSAmJiB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdsZWZ0JykpIHtcbiAgICAgIHRoaXMuX2VkaXRMZWZ0KHRpbWVDb250ZXh0LCBkeCk7XG4gICAgfSBlbHNlIGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdoYW5kbGVyJykgJiYgdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygncmlnaHQnKSkge1xuICAgICAgdGhpcy5fZWRpdFJpZ2h0KHRpbWVDb250ZXh0LCBkeCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX21vdmUodGltZUNvbnRleHQsIGR4KTtcbiAgICB9XG5cbiAgICBjb25zdCBuZXdEdXJhdGlvbiA9IHRpbWVDb250ZXh0LmR1cmF0aW9uO1xuICAgIGNvbnN0IHJhdGlvID0gKG5ld0R1cmF0aW9uIC8gbGFzdER1cmF0aW9uKTtcblxuICAgIHRpbWVDb250ZXh0LnN0cmV0Y2hSYXRpbyAqPSByYXRpbztcbiAgICB0aW1lQ29udGV4dC5vZmZzZXQgPSBsYXN0T2Zmc2V0O1xuICAgIHRpbWVDb250ZXh0LmR1cmF0aW9uID0gbGFzdER1cmF0aW9uO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVGltZUNvbnRleHRCZWhhdmlvcjtcbiJdfQ==