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

        if (target.classList.contains("handler") && target.classList.contains("left")) {
          this._editLeft(timeContext, dx);
        } else if (target.classList.contains("handler") && target.classList.contains("right")) {
          this._editRight(timeContext, dx);
        } else if (target.classList.contains("segment")) {
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

        this.edit(layer, dx, dy, target);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9iZWhhdmlvcnMvdGltZS1jb250ZXh0LWJlaGF2aW9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztJQUFxQixtQkFBbUI7V0FBbkIsbUJBQW1COzBCQUFuQixtQkFBbUI7OztlQUFuQixtQkFBbUI7QUFLdEMsZUFBVzs7Ozs7O2FBQUEscUJBQUMsS0FBSyxFQUFlO1lBQWIsSUFBSSxnQ0FBRyxJQUFJOztBQUM1QixZQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsT0FBTyxHQUFHLE1BQU0sQ0FBQztBQUN4QyxhQUFLLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDaEQsYUFBSyxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztPQUNqQzs7QUFFRCxRQUFJO2FBQUEsY0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUU7QUFDMUIsWUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQzs7QUFFdEMsWUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUM3RSxjQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztTQUNqQyxNQUFNLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDckYsY0FBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDbEMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFO0FBQy9DLGNBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQzdCO09BQ0Y7O0FBRUQsYUFBUzthQUFBLG1CQUFDLFdBQVcsRUFBRSxFQUFFLEVBQUU7O0FBRXpCLFlBQU0sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN2RCxZQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN0RCxZQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFdkQsWUFBTSxPQUFPLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUN2QixZQUFNLFlBQVksR0FBRyxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2pDLFlBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFNUMsbUJBQVcsQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzlELG1CQUFXLENBQUMsTUFBTSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzdELG1CQUFXLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO09BQy9EOztBQUVELGNBQVU7YUFBQSxvQkFBQyxXQUFXLEVBQUUsRUFBRSxFQUFFO0FBQzFCLFlBQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3ZELFlBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFNUMsbUJBQVcsQ0FBQyxRQUFRLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7T0FDL0Q7O0FBRUQsU0FBSzthQUFBLGVBQUMsV0FBVyxFQUFFLEVBQUUsRUFBRTtBQUNyQixZQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkQsWUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUVwQyxtQkFBVyxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7T0FDL0Q7O0FBRUQsV0FBTzthQUFBLGlCQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTtBQUM3QixZQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDO0FBQ3RDLFlBQU0sWUFBWSxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUM7QUFDMUMsWUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQzs7QUFFdEMsWUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQzs7QUFFakMsWUFBTSxXQUFXLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQztBQUN6QyxZQUFNLEtBQUssR0FBSSxXQUFXLEdBQUcsWUFBWSxBQUFDLENBQUM7O0FBRTNDLG1CQUFXLENBQUMsWUFBWSxJQUFJLEtBQUssQ0FBQztBQUNsQyxtQkFBVyxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUM7QUFDaEMsbUJBQVcsQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFDO09BQ3JDOzs7O1NBakVrQixtQkFBbUI7OztpQkFBbkIsbUJBQW1CIiwiZmlsZSI6ImVzNi9iZWhhdmlvcnMvdGltZS1jb250ZXh0LWJlaGF2aW9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZUNvbnRleHRCZWhhdmlvciB7XG4gIC8qKlxuICAgKiAgZHJhdyB0aGUgc2hhcGUgdG8gaW50ZXJhY3Qgd2l0aCB0aGUgY29udGV4dFxuICAgKiAgQHBhcmFtcyBib29sIHtCb29sZWFufSBkZWZpbmUgaWYgdGhlIGxheWVyJ3MgY29udGV4dCBpcyBlZGl0YWJsZSBvciBub3RcbiAgICovXG4gIHNldEVkaXRhYmxlKGxheWVyLCBib29sID0gdHJ1ZSkge1xuICAgIGNvbnN0IGRpc3BsYXkgPSBib29sID8gJ2Jsb2NrJyA6ICdub25lJztcbiAgICBsYXllci5pbnRlcmFjdGlvbnNHcm91cC5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheTtcbiAgICBsYXllci5faXNDb250ZXh0RWRpdGFibGUgPSBib29sO1xuICB9XG5cbiAgZWRpdChsYXllciwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICBjb25zdCB0aW1lQ29udGV4dCA9IGxheWVyLnRpbWVDb250ZXh0O1xuXG4gICAgaWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2hhbmRsZXInKSAmJiB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdsZWZ0JykpIHtcbiAgICAgIHRoaXMuX2VkaXRMZWZ0KHRpbWVDb250ZXh0LCBkeCk7XG4gICAgfSBlbHNlIGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdoYW5kbGVyJykgJiYgdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygncmlnaHQnKSkge1xuICAgICAgdGhpcy5fZWRpdFJpZ2h0KHRpbWVDb250ZXh0LCBkeCk7XG4gICAgfSBlbHNlIGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWdtZW50JykpIHtcbiAgICAgIHRoaXMuX21vdmUodGltZUNvbnRleHQsIGR4KTtcbiAgICB9XG4gIH1cblxuICBfZWRpdExlZnQodGltZUNvbnRleHQsIGR4KSB7XG4gICAgLy8gZWRpdCBgc3RhcnRgLCBgb2Zmc2V0YCBhbmQgYGR1cmF0aW9uYFxuICAgIGNvbnN0IHggPSB0aW1lQ29udGV4dC5wYXJlbnQueFNjYWxlKHRpbWVDb250ZXh0LnN0YXJ0KTtcbiAgICBjb25zdCBvZmZzZXQgPSB0aW1lQ29udGV4dC54U2NhbGUodGltZUNvbnRleHQub2Zmc2V0KTtcbiAgICBjb25zdCB3aWR0aCA9IHRpbWVDb250ZXh0LnhTY2FsZSh0aW1lQ29udGV4dC5kdXJhdGlvbik7XG5cbiAgICBjb25zdCB0YXJnZXRYID0geCArIGR4O1xuICAgIGNvbnN0IHRhcmdldE9mZnNldCA9IG9mZnNldCAtIGR4O1xuICAgIGNvbnN0IHRhcmdldFdpZHRoID0gTWF0aC5tYXgod2lkdGggLSBkeCwgMSk7XG5cbiAgICB0aW1lQ29udGV4dC5zdGFydCA9IHRpbWVDb250ZXh0LnBhcmVudC54U2NhbGUuaW52ZXJ0KHRhcmdldFgpO1xuICAgIHRpbWVDb250ZXh0Lm9mZnNldCA9IHRpbWVDb250ZXh0LnhTY2FsZS5pbnZlcnQodGFyZ2V0T2Zmc2V0KTtcbiAgICB0aW1lQ29udGV4dC5kdXJhdGlvbiA9IHRpbWVDb250ZXh0LnhTY2FsZS5pbnZlcnQodGFyZ2V0V2lkdGgpO1xuICB9XG5cbiAgX2VkaXRSaWdodCh0aW1lQ29udGV4dCwgZHgpIHtcbiAgICBjb25zdCB3aWR0aCA9IHRpbWVDb250ZXh0LnhTY2FsZSh0aW1lQ29udGV4dC5kdXJhdGlvbik7XG4gICAgY29uc3QgdGFyZ2V0V2lkdGggPSBNYXRoLm1heCh3aWR0aCArIGR4LCAxKTtcblxuICAgIHRpbWVDb250ZXh0LmR1cmF0aW9uID0gdGltZUNvbnRleHQueFNjYWxlLmludmVydCh0YXJnZXRXaWR0aCk7XG4gIH1cblxuICBfbW92ZSh0aW1lQ29udGV4dCwgZHgpIHtcbiAgICBjb25zdCB4ID0gdGltZUNvbnRleHQucGFyZW50LnhTY2FsZSh0aW1lQ29udGV4dC5zdGFydCk7XG4gICAgY29uc3QgdGFyZ2V0WCA9IE1hdGgubWF4KHggKyBkeCwgMCk7XG5cbiAgICB0aW1lQ29udGV4dC5zdGFydCA9IHRpbWVDb250ZXh0LnBhcmVudC54U2NhbGUuaW52ZXJ0KHRhcmdldFgpO1xuICB9XG5cbiAgc3RyZXRjaChsYXllciwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICBjb25zdCB0aW1lQ29udGV4dCA9IGxheWVyLnRpbWVDb250ZXh0O1xuICAgIGNvbnN0IGxhc3REdXJhdGlvbiA9IHRpbWVDb250ZXh0LmR1cmF0aW9uO1xuICAgIGNvbnN0IGxhc3RPZmZzZXQgPSB0aW1lQ29udGV4dC5vZmZzZXQ7XG5cbiAgICB0aGlzLmVkaXQobGF5ZXIsIGR4LCBkeSwgdGFyZ2V0KTtcblxuICAgIGNvbnN0IG5ld0R1cmF0aW9uID0gdGltZUNvbnRleHQuZHVyYXRpb247XG4gICAgY29uc3QgcmF0aW8gPSAobmV3RHVyYXRpb24gLyBsYXN0RHVyYXRpb24pO1xuXG4gICAgdGltZUNvbnRleHQuc3RyZXRjaFJhdGlvICo9IHJhdGlvO1xuICAgIHRpbWVDb250ZXh0Lm9mZnNldCA9IGxhc3RPZmZzZXQ7XG4gICAgdGltZUNvbnRleHQuZHVyYXRpb24gPSBsYXN0RHVyYXRpb247XG4gIH1cbn1cbiJdfQ==