'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * TimeContextBehavior is used internally in Layers to modify their TimeContext.
 * This object is different from other Shapes Behaviors and exists mostly to decrease the size of the Layer.
 * All the code here could be considered as part of the layer.
 */
var TimeContextBehavior = function () {
  function TimeContextBehavior() {
    (0, _classCallCheck3.default)(this, TimeContextBehavior);
  }

  (0, _createClass3.default)(TimeContextBehavior, [{
    key: 'edit',
    value: function edit(layer, dx, dy, target) {
      var timeContext = layer.timeContext;

      if (target.classList.contains('handler') && target.classList.contains('left')) {
        this._editLeft(timeContext, dx);
      } else if (target.classList.contains('handler') && target.classList.contains('right')) {
        this._editRight(timeContext, dx);
      } else if (target.classList.contains('segment')) {
        this._move(timeContext, dx);
      }
    }
  }, {
    key: '_editLeft',
    value: function _editLeft(timeContext, dx) {
      // edit `start`, `offset` and `duration`
      var x = timeContext.parent.timeToPixel(timeContext.start);
      var offset = timeContext.timeToPixel(timeContext.offset);
      var width = timeContext.timeToPixel(timeContext.duration);

      var targetX = x + dx;
      var targetOffset = offset - dx;
      var targetWidth = Math.max(width - dx, 1);

      timeContext.start = timeContext.parent.timeToPixel.invert(targetX);
      timeContext.offset = timeContext.timeToPixel.invert(targetOffset);
      timeContext.duration = timeContext.timeToPixel.invert(targetWidth);
    }
  }, {
    key: '_editRight',
    value: function _editRight(timeContext, dx) {
      var width = timeContext.timeToPixel(timeContext.duration);
      var targetWidth = Math.max(width + dx, 1);

      timeContext.duration = timeContext.timeToPixel.invert(targetWidth);
    }
  }, {
    key: '_move',
    value: function _move(timeContext, dx) {
      var x = timeContext.parent.timeToPixel(timeContext.start);
      var targetX = Math.max(x + dx, 0);

      timeContext.start = timeContext.parent.timeToPixel.invert(targetX);
    }
  }, {
    key: 'stretch',
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
  }]);
  return TimeContextBehavior;
}();

exports.default = TimeContextBehavior;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRpbWVDb250ZXh0QmVoYXZpb3IuanMiXSwibmFtZXMiOlsiVGltZUNvbnRleHRCZWhhdmlvciIsImxheWVyIiwiZHgiLCJkeSIsInRhcmdldCIsInRpbWVDb250ZXh0IiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJfZWRpdExlZnQiLCJfZWRpdFJpZ2h0IiwiX21vdmUiLCJ4IiwicGFyZW50IiwidGltZVRvUGl4ZWwiLCJzdGFydCIsIm9mZnNldCIsIndpZHRoIiwiZHVyYXRpb24iLCJ0YXJnZXRYIiwidGFyZ2V0T2Zmc2V0IiwidGFyZ2V0V2lkdGgiLCJNYXRoIiwibWF4IiwiaW52ZXJ0IiwibGFzdER1cmF0aW9uIiwibGFzdE9mZnNldCIsImVkaXQiLCJuZXdEdXJhdGlvbiIsInJhdGlvIiwic3RyZXRjaFJhdGlvIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7O0lBS01BLG1COzs7Ozs7O3lCQUNDQyxLLEVBQU9DLEUsRUFBSUMsRSxFQUFJQyxNLEVBQVE7QUFDMUIsVUFBTUMsY0FBY0osTUFBTUksV0FBMUI7O0FBRUEsVUFBSUQsT0FBT0UsU0FBUCxDQUFpQkMsUUFBakIsQ0FBMEIsU0FBMUIsS0FBd0NILE9BQU9FLFNBQVAsQ0FBaUJDLFFBQWpCLENBQTBCLE1BQTFCLENBQTVDLEVBQStFO0FBQzdFLGFBQUtDLFNBQUwsQ0FBZUgsV0FBZixFQUE0QkgsRUFBNUI7QUFDRCxPQUZELE1BRU8sSUFBSUUsT0FBT0UsU0FBUCxDQUFpQkMsUUFBakIsQ0FBMEIsU0FBMUIsS0FBd0NILE9BQU9FLFNBQVAsQ0FBaUJDLFFBQWpCLENBQTBCLE9BQTFCLENBQTVDLEVBQWdGO0FBQ3JGLGFBQUtFLFVBQUwsQ0FBZ0JKLFdBQWhCLEVBQTZCSCxFQUE3QjtBQUNELE9BRk0sTUFFQSxJQUFJRSxPQUFPRSxTQUFQLENBQWlCQyxRQUFqQixDQUEwQixTQUExQixDQUFKLEVBQTBDO0FBQy9DLGFBQUtHLEtBQUwsQ0FBV0wsV0FBWCxFQUF3QkgsRUFBeEI7QUFDRDtBQUNGOzs7OEJBRVNHLFcsRUFBYUgsRSxFQUFJO0FBQ3pCO0FBQ0EsVUFBTVMsSUFBSU4sWUFBWU8sTUFBWixDQUFtQkMsV0FBbkIsQ0FBK0JSLFlBQVlTLEtBQTNDLENBQVY7QUFDQSxVQUFNQyxTQUFTVixZQUFZUSxXQUFaLENBQXdCUixZQUFZVSxNQUFwQyxDQUFmO0FBQ0EsVUFBTUMsUUFBUVgsWUFBWVEsV0FBWixDQUF3QlIsWUFBWVksUUFBcEMsQ0FBZDs7QUFFQSxVQUFNQyxVQUFVUCxJQUFJVCxFQUFwQjtBQUNBLFVBQU1pQixlQUFlSixTQUFTYixFQUE5QjtBQUNBLFVBQU1rQixjQUFjQyxLQUFLQyxHQUFMLENBQVNOLFFBQVFkLEVBQWpCLEVBQXFCLENBQXJCLENBQXBCOztBQUVBRyxrQkFBWVMsS0FBWixHQUFvQlQsWUFBWU8sTUFBWixDQUFtQkMsV0FBbkIsQ0FBK0JVLE1BQS9CLENBQXNDTCxPQUF0QyxDQUFwQjtBQUNBYixrQkFBWVUsTUFBWixHQUFxQlYsWUFBWVEsV0FBWixDQUF3QlUsTUFBeEIsQ0FBK0JKLFlBQS9CLENBQXJCO0FBQ0FkLGtCQUFZWSxRQUFaLEdBQXVCWixZQUFZUSxXQUFaLENBQXdCVSxNQUF4QixDQUErQkgsV0FBL0IsQ0FBdkI7QUFDRDs7OytCQUVVZixXLEVBQWFILEUsRUFBSTtBQUMxQixVQUFNYyxRQUFRWCxZQUFZUSxXQUFaLENBQXdCUixZQUFZWSxRQUFwQyxDQUFkO0FBQ0EsVUFBTUcsY0FBY0MsS0FBS0MsR0FBTCxDQUFTTixRQUFRZCxFQUFqQixFQUFxQixDQUFyQixDQUFwQjs7QUFFQUcsa0JBQVlZLFFBQVosR0FBdUJaLFlBQVlRLFdBQVosQ0FBd0JVLE1BQXhCLENBQStCSCxXQUEvQixDQUF2QjtBQUNEOzs7MEJBRUtmLFcsRUFBYUgsRSxFQUFJO0FBQ3JCLFVBQU1TLElBQUlOLFlBQVlPLE1BQVosQ0FBbUJDLFdBQW5CLENBQStCUixZQUFZUyxLQUEzQyxDQUFWO0FBQ0EsVUFBTUksVUFBVUcsS0FBS0MsR0FBTCxDQUFTWCxJQUFJVCxFQUFiLEVBQWlCLENBQWpCLENBQWhCOztBQUVBRyxrQkFBWVMsS0FBWixHQUFvQlQsWUFBWU8sTUFBWixDQUFtQkMsV0FBbkIsQ0FBK0JVLE1BQS9CLENBQXNDTCxPQUF0QyxDQUFwQjtBQUNEOzs7NEJBRU9qQixLLEVBQU9DLEUsRUFBSUMsRSxFQUFJQyxNLEVBQVE7QUFDN0IsVUFBTUMsY0FBY0osTUFBTUksV0FBMUI7QUFDQSxVQUFNbUIsZUFBZW5CLFlBQVlZLFFBQWpDO0FBQ0EsVUFBTVEsYUFBYXBCLFlBQVlVLE1BQS9COztBQUVBLFdBQUtXLElBQUwsQ0FBVXpCLEtBQVYsRUFBaUJDLEVBQWpCLEVBQXFCQyxFQUFyQixFQUF5QkMsTUFBekI7O0FBRUEsVUFBTXVCLGNBQWN0QixZQUFZWSxRQUFoQztBQUNBLFVBQU1XLFFBQVNELGNBQWNILFlBQTdCOztBQUVBbkIsa0JBQVl3QixZQUFaLElBQTRCRCxLQUE1QjtBQUNBdkIsa0JBQVlVLE1BQVosR0FBcUJVLFVBQXJCO0FBQ0FwQixrQkFBWVksUUFBWixHQUF1Qk8sWUFBdkI7QUFDRDs7Ozs7a0JBR1l4QixtQiIsImZpbGUiOiJUaW1lQ29udGV4dEJlaGF2aW9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaW1lQ29udGV4dEJlaGF2aW9yIGlzIHVzZWQgaW50ZXJuYWxseSBpbiBMYXllcnMgdG8gbW9kaWZ5IHRoZWlyIFRpbWVDb250ZXh0LlxuICogVGhpcyBvYmplY3QgaXMgZGlmZmVyZW50IGZyb20gb3RoZXIgU2hhcGVzIEJlaGF2aW9ycyBhbmQgZXhpc3RzIG1vc3RseSB0byBkZWNyZWFzZSB0aGUgc2l6ZSBvZiB0aGUgTGF5ZXIuXG4gKiBBbGwgdGhlIGNvZGUgaGVyZSBjb3VsZCBiZSBjb25zaWRlcmVkIGFzIHBhcnQgb2YgdGhlIGxheWVyLlxuICovXG5jbGFzcyBUaW1lQ29udGV4dEJlaGF2aW9yIHtcbiAgZWRpdChsYXllciwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICBjb25zdCB0aW1lQ29udGV4dCA9IGxheWVyLnRpbWVDb250ZXh0O1xuXG4gICAgaWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2hhbmRsZXInKSAmJiB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdsZWZ0JykpIHtcbiAgICAgIHRoaXMuX2VkaXRMZWZ0KHRpbWVDb250ZXh0LCBkeCk7XG4gICAgfSBlbHNlIGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdoYW5kbGVyJykgJiYgdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygncmlnaHQnKSkge1xuICAgICAgdGhpcy5fZWRpdFJpZ2h0KHRpbWVDb250ZXh0LCBkeCk7XG4gICAgfSBlbHNlIGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWdtZW50JykpIHtcbiAgICAgIHRoaXMuX21vdmUodGltZUNvbnRleHQsIGR4KTtcbiAgICB9XG4gIH1cblxuICBfZWRpdExlZnQodGltZUNvbnRleHQsIGR4KSB7XG4gICAgLy8gZWRpdCBgc3RhcnRgLCBgb2Zmc2V0YCBhbmQgYGR1cmF0aW9uYFxuICAgIGNvbnN0IHggPSB0aW1lQ29udGV4dC5wYXJlbnQudGltZVRvUGl4ZWwodGltZUNvbnRleHQuc3RhcnQpO1xuICAgIGNvbnN0IG9mZnNldCA9IHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRpbWVDb250ZXh0Lm9mZnNldCk7XG4gICAgY29uc3Qgd2lkdGggPSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aW1lQ29udGV4dC5kdXJhdGlvbik7XG5cbiAgICBjb25zdCB0YXJnZXRYID0geCArIGR4O1xuICAgIGNvbnN0IHRhcmdldE9mZnNldCA9IG9mZnNldCAtIGR4O1xuICAgIGNvbnN0IHRhcmdldFdpZHRoID0gTWF0aC5tYXgod2lkdGggLSBkeCwgMSk7XG5cbiAgICB0aW1lQ29udGV4dC5zdGFydCA9IHRpbWVDb250ZXh0LnBhcmVudC50aW1lVG9QaXhlbC5pbnZlcnQodGFyZ2V0WCk7XG4gICAgdGltZUNvbnRleHQub2Zmc2V0ID0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldE9mZnNldCk7XG4gICAgdGltZUNvbnRleHQuZHVyYXRpb24gPSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQodGFyZ2V0V2lkdGgpO1xuICB9XG5cbiAgX2VkaXRSaWdodCh0aW1lQ29udGV4dCwgZHgpIHtcbiAgICBjb25zdCB3aWR0aCA9IHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRpbWVDb250ZXh0LmR1cmF0aW9uKTtcbiAgICBjb25zdCB0YXJnZXRXaWR0aCA9IE1hdGgubWF4KHdpZHRoICsgZHgsIDEpO1xuXG4gICAgdGltZUNvbnRleHQuZHVyYXRpb24gPSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQodGFyZ2V0V2lkdGgpO1xuICB9XG5cbiAgX21vdmUodGltZUNvbnRleHQsIGR4KSB7XG4gICAgY29uc3QgeCA9IHRpbWVDb250ZXh0LnBhcmVudC50aW1lVG9QaXhlbCh0aW1lQ29udGV4dC5zdGFydCk7XG4gICAgY29uc3QgdGFyZ2V0WCA9IE1hdGgubWF4KHggKyBkeCwgMCk7XG5cbiAgICB0aW1lQ29udGV4dC5zdGFydCA9IHRpbWVDb250ZXh0LnBhcmVudC50aW1lVG9QaXhlbC5pbnZlcnQodGFyZ2V0WCk7XG4gIH1cblxuICBzdHJldGNoKGxheWVyLCBkeCwgZHksIHRhcmdldCkge1xuICAgIGNvbnN0IHRpbWVDb250ZXh0ID0gbGF5ZXIudGltZUNvbnRleHQ7XG4gICAgY29uc3QgbGFzdER1cmF0aW9uID0gdGltZUNvbnRleHQuZHVyYXRpb247XG4gICAgY29uc3QgbGFzdE9mZnNldCA9IHRpbWVDb250ZXh0Lm9mZnNldDtcblxuICAgIHRoaXMuZWRpdChsYXllciwgZHgsIGR5LCB0YXJnZXQpO1xuXG4gICAgY29uc3QgbmV3RHVyYXRpb24gPSB0aW1lQ29udGV4dC5kdXJhdGlvbjtcbiAgICBjb25zdCByYXRpbyA9IChuZXdEdXJhdGlvbiAvIGxhc3REdXJhdGlvbik7XG5cbiAgICB0aW1lQ29udGV4dC5zdHJldGNoUmF0aW8gKj0gcmF0aW87XG4gICAgdGltZUNvbnRleHQub2Zmc2V0ID0gbGFzdE9mZnNldDtcbiAgICB0aW1lQ29udGV4dC5kdXJhdGlvbiA9IGxhc3REdXJhdGlvbjtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUaW1lQ29udGV4dEJlaGF2aW9yO1xuIl19