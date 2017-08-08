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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRpbWUtY29udGV4dC1iZWhhdmlvci5qcyJdLCJuYW1lcyI6WyJUaW1lQ29udGV4dEJlaGF2aW9yIiwibGF5ZXIiLCJkeCIsImR5IiwidGFyZ2V0IiwidGltZUNvbnRleHQiLCJjbGFzc0xpc3QiLCJjb250YWlucyIsIl9lZGl0TGVmdCIsIl9lZGl0UmlnaHQiLCJfbW92ZSIsIngiLCJwYXJlbnQiLCJ0aW1lVG9QaXhlbCIsInN0YXJ0Iiwib2Zmc2V0Iiwid2lkdGgiLCJkdXJhdGlvbiIsInRhcmdldFgiLCJ0YXJnZXRPZmZzZXQiLCJ0YXJnZXRXaWR0aCIsIk1hdGgiLCJtYXgiLCJpbnZlcnQiLCJsYXN0RHVyYXRpb24iLCJsYXN0T2Zmc2V0IiwiZWRpdCIsIm5ld0R1cmF0aW9uIiwicmF0aW8iLCJzdHJldGNoUmF0aW8iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7SUFLcUJBLG1COzs7Ozs7O3lCQUNkQyxLLEVBQU9DLEUsRUFBSUMsRSxFQUFJQyxNLEVBQVE7QUFDMUIsVUFBTUMsY0FBY0osTUFBTUksV0FBMUI7O0FBRUEsVUFBSUQsT0FBT0UsU0FBUCxDQUFpQkMsUUFBakIsQ0FBMEIsU0FBMUIsS0FBd0NILE9BQU9FLFNBQVAsQ0FBaUJDLFFBQWpCLENBQTBCLE1BQTFCLENBQTVDLEVBQStFO0FBQzdFLGFBQUtDLFNBQUwsQ0FBZUgsV0FBZixFQUE0QkgsRUFBNUI7QUFDRCxPQUZELE1BRU8sSUFBSUUsT0FBT0UsU0FBUCxDQUFpQkMsUUFBakIsQ0FBMEIsU0FBMUIsS0FBd0NILE9BQU9FLFNBQVAsQ0FBaUJDLFFBQWpCLENBQTBCLE9BQTFCLENBQTVDLEVBQWdGO0FBQ3JGLGFBQUtFLFVBQUwsQ0FBZ0JKLFdBQWhCLEVBQTZCSCxFQUE3QjtBQUNELE9BRk0sTUFFQSxJQUFJRSxPQUFPRSxTQUFQLENBQWlCQyxRQUFqQixDQUEwQixTQUExQixDQUFKLEVBQTBDO0FBQy9DLGFBQUtHLEtBQUwsQ0FBV0wsV0FBWCxFQUF3QkgsRUFBeEI7QUFDRDtBQUNGOzs7OEJBRVNHLFcsRUFBYUgsRSxFQUFJO0FBQ3pCO0FBQ0EsVUFBTVMsSUFBSU4sWUFBWU8sTUFBWixDQUFtQkMsV0FBbkIsQ0FBK0JSLFlBQVlTLEtBQTNDLENBQVY7QUFDQSxVQUFNQyxTQUFTVixZQUFZUSxXQUFaLENBQXdCUixZQUFZVSxNQUFwQyxDQUFmO0FBQ0EsVUFBTUMsUUFBUVgsWUFBWVEsV0FBWixDQUF3QlIsWUFBWVksUUFBcEMsQ0FBZDs7QUFFQSxVQUFNQyxVQUFVUCxJQUFJVCxFQUFwQjtBQUNBLFVBQU1pQixlQUFlSixTQUFTYixFQUE5QjtBQUNBLFVBQU1rQixjQUFjQyxLQUFLQyxHQUFMLENBQVNOLFFBQVFkLEVBQWpCLEVBQXFCLENBQXJCLENBQXBCOztBQUVBRyxrQkFBWVMsS0FBWixHQUFvQlQsWUFBWU8sTUFBWixDQUFtQkMsV0FBbkIsQ0FBK0JVLE1BQS9CLENBQXNDTCxPQUF0QyxDQUFwQjtBQUNBYixrQkFBWVUsTUFBWixHQUFxQlYsWUFBWVEsV0FBWixDQUF3QlUsTUFBeEIsQ0FBK0JKLFlBQS9CLENBQXJCO0FBQ0FkLGtCQUFZWSxRQUFaLEdBQXVCWixZQUFZUSxXQUFaLENBQXdCVSxNQUF4QixDQUErQkgsV0FBL0IsQ0FBdkI7QUFDRDs7OytCQUVVZixXLEVBQWFILEUsRUFBSTtBQUMxQixVQUFNYyxRQUFRWCxZQUFZUSxXQUFaLENBQXdCUixZQUFZWSxRQUFwQyxDQUFkO0FBQ0EsVUFBTUcsY0FBY0MsS0FBS0MsR0FBTCxDQUFTTixRQUFRZCxFQUFqQixFQUFxQixDQUFyQixDQUFwQjs7QUFFQUcsa0JBQVlZLFFBQVosR0FBdUJaLFlBQVlRLFdBQVosQ0FBd0JVLE1BQXhCLENBQStCSCxXQUEvQixDQUF2QjtBQUNEOzs7MEJBRUtmLFcsRUFBYUgsRSxFQUFJO0FBQ3JCLFVBQU1TLElBQUlOLFlBQVlPLE1BQVosQ0FBbUJDLFdBQW5CLENBQStCUixZQUFZUyxLQUEzQyxDQUFWO0FBQ0EsVUFBTUksVUFBVUcsS0FBS0MsR0FBTCxDQUFTWCxJQUFJVCxFQUFiLEVBQWlCLENBQWpCLENBQWhCOztBQUVBRyxrQkFBWVMsS0FBWixHQUFvQlQsWUFBWU8sTUFBWixDQUFtQkMsV0FBbkIsQ0FBK0JVLE1BQS9CLENBQXNDTCxPQUF0QyxDQUFwQjtBQUNEOzs7NEJBRU9qQixLLEVBQU9DLEUsRUFBSUMsRSxFQUFJQyxNLEVBQVE7QUFDN0IsVUFBTUMsY0FBY0osTUFBTUksV0FBMUI7QUFDQSxVQUFNbUIsZUFBZW5CLFlBQVlZLFFBQWpDO0FBQ0EsVUFBTVEsYUFBYXBCLFlBQVlVLE1BQS9COztBQUVBLFdBQUtXLElBQUwsQ0FBVXpCLEtBQVYsRUFBaUJDLEVBQWpCLEVBQXFCQyxFQUFyQixFQUF5QkMsTUFBekI7O0FBRUEsVUFBTXVCLGNBQWN0QixZQUFZWSxRQUFoQztBQUNBLFVBQU1XLFFBQVNELGNBQWNILFlBQTdCOztBQUVBbkIsa0JBQVl3QixZQUFaLElBQTRCRCxLQUE1QjtBQUNBdkIsa0JBQVlVLE1BQVosR0FBcUJVLFVBQXJCO0FBQ0FwQixrQkFBWVksUUFBWixHQUF1Qk8sWUFBdkI7QUFDRDs7Ozs7a0JBdkRrQnhCLG1CIiwiZmlsZSI6InRpbWUtY29udGV4dC1iZWhhdmlvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGltZUNvbnRleHRCZWhhdmlvciBpcyB1c2VkIGludGVybmFsbHkgaW4gTGF5ZXJzIHRvIG1vZGlmeSB0aGVpciBUaW1lQ29udGV4dC5cbiAqIFRoaXMgb2JqZWN0IGlzIGRpZmZlcmVudCBmcm9tIG90aGVyIFNoYXBlcyBCZWhhdmlvcnMgYW5kIGV4aXN0cyBtb3N0bHkgdG8gZGVjcmVhc2UgdGhlIHNpemUgb2YgdGhlIExheWVyLlxuICogQWxsIHRoZSBjb2RlIGhlcmUgY291bGQgYmUgY29uc2lkZXJlZCBhcyBwYXJ0IG9mIHRoZSBsYXllci5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZUNvbnRleHRCZWhhdmlvciB7XG4gIGVkaXQobGF5ZXIsIGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgY29uc3QgdGltZUNvbnRleHQgPSBsYXllci50aW1lQ29udGV4dDtcblxuICAgIGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdoYW5kbGVyJykgJiYgdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbGVmdCcpKSB7XG4gICAgICB0aGlzLl9lZGl0TGVmdCh0aW1lQ29udGV4dCwgZHgpO1xuICAgIH0gZWxzZSBpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnaGFuZGxlcicpICYmIHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3JpZ2h0JykpIHtcbiAgICAgIHRoaXMuX2VkaXRSaWdodCh0aW1lQ29udGV4dCwgZHgpO1xuICAgIH0gZWxzZSBpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnc2VnbWVudCcpKSB7XG4gICAgICB0aGlzLl9tb3ZlKHRpbWVDb250ZXh0LCBkeCk7XG4gICAgfVxuICB9XG5cbiAgX2VkaXRMZWZ0KHRpbWVDb250ZXh0LCBkeCkge1xuICAgIC8vIGVkaXQgYHN0YXJ0YCwgYG9mZnNldGAgYW5kIGBkdXJhdGlvbmBcbiAgICBjb25zdCB4ID0gdGltZUNvbnRleHQucGFyZW50LnRpbWVUb1BpeGVsKHRpbWVDb250ZXh0LnN0YXJ0KTtcbiAgICBjb25zdCBvZmZzZXQgPSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aW1lQ29udGV4dC5vZmZzZXQpO1xuICAgIGNvbnN0IHdpZHRoID0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwodGltZUNvbnRleHQuZHVyYXRpb24pO1xuXG4gICAgY29uc3QgdGFyZ2V0WCA9IHggKyBkeDtcbiAgICBjb25zdCB0YXJnZXRPZmZzZXQgPSBvZmZzZXQgLSBkeDtcbiAgICBjb25zdCB0YXJnZXRXaWR0aCA9IE1hdGgubWF4KHdpZHRoIC0gZHgsIDEpO1xuXG4gICAgdGltZUNvbnRleHQuc3RhcnQgPSB0aW1lQ29udGV4dC5wYXJlbnQudGltZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFgpO1xuICAgIHRpbWVDb250ZXh0Lm9mZnNldCA9IHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydCh0YXJnZXRPZmZzZXQpO1xuICAgIHRpbWVDb250ZXh0LmR1cmF0aW9uID0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFdpZHRoKTtcbiAgfVxuXG4gIF9lZGl0UmlnaHQodGltZUNvbnRleHQsIGR4KSB7XG4gICAgY29uc3Qgd2lkdGggPSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aW1lQ29udGV4dC5kdXJhdGlvbik7XG4gICAgY29uc3QgdGFyZ2V0V2lkdGggPSBNYXRoLm1heCh3aWR0aCArIGR4LCAxKTtcblxuICAgIHRpbWVDb250ZXh0LmR1cmF0aW9uID0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFdpZHRoKTtcbiAgfVxuXG4gIF9tb3ZlKHRpbWVDb250ZXh0LCBkeCkge1xuICAgIGNvbnN0IHggPSB0aW1lQ29udGV4dC5wYXJlbnQudGltZVRvUGl4ZWwodGltZUNvbnRleHQuc3RhcnQpO1xuICAgIGNvbnN0IHRhcmdldFggPSBNYXRoLm1heCh4ICsgZHgsIDApO1xuXG4gICAgdGltZUNvbnRleHQuc3RhcnQgPSB0aW1lQ29udGV4dC5wYXJlbnQudGltZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFgpO1xuICB9XG5cbiAgc3RyZXRjaChsYXllciwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICBjb25zdCB0aW1lQ29udGV4dCA9IGxheWVyLnRpbWVDb250ZXh0O1xuICAgIGNvbnN0IGxhc3REdXJhdGlvbiA9IHRpbWVDb250ZXh0LmR1cmF0aW9uO1xuICAgIGNvbnN0IGxhc3RPZmZzZXQgPSB0aW1lQ29udGV4dC5vZmZzZXQ7XG5cbiAgICB0aGlzLmVkaXQobGF5ZXIsIGR4LCBkeSwgdGFyZ2V0KTtcblxuICAgIGNvbnN0IG5ld0R1cmF0aW9uID0gdGltZUNvbnRleHQuZHVyYXRpb247XG4gICAgY29uc3QgcmF0aW8gPSAobmV3RHVyYXRpb24gLyBsYXN0RHVyYXRpb24pO1xuXG4gICAgdGltZUNvbnRleHQuc3RyZXRjaFJhdGlvICo9IHJhdGlvO1xuICAgIHRpbWVDb250ZXh0Lm9mZnNldCA9IGxhc3RPZmZzZXQ7XG4gICAgdGltZUNvbnRleHQuZHVyYXRpb24gPSBsYXN0RHVyYXRpb247XG4gIH1cbn1cbiJdfQ==