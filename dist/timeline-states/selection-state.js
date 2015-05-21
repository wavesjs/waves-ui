"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var BaseState = require("./base-state");
var ns = require("../core/namespace");

/**
 *  @NOTE Buggy
 */

var SelectionState = (function (_BaseState) {
  function SelectionState(timeline) {
    _classCallCheck(this, SelectionState);

    _get(_core.Object.getPrototypeOf(SelectionState.prototype), "constructor", this).call(this, timeline);

    this.currentLayer = null;
    // need a cached
    this.selectedItems = null;
    this.mouseDown = false;
    this.shiftKey = false;
  }

  _inherits(SelectionState, _BaseState);

  _createClass(SelectionState, {
    enter: {
      value: function enter() {
        this.brush = document.createElementNS(ns, "rect");
        this.brush.style.backgroundColor = "#898989";
        this.brush.style.opacity = 0.08;
        this.interactionsGroup.appendChild(this.brush);
      }
    },
    exit: {
      value: function exit() {
        this._removeBrush();
        this.interactionsGroup.removeChild(this.brush);
      }
    },
    _removeBrush: {
      value: function _removeBrush() {
        // reset brush element
        this.brush.setAttributeNS(null, "transform", "translate(0, 0)");
        this.brush.setAttributeNS(null, "width", 0);
        this.brush.setAttributeNS(null, "height", 0);
      }
    },
    _updateBrush: {
      value: function _updateBrush(e) {
        var translate = "translate(" + e.area.left + ", " + e.area.top + ")";
        this.brush.setAttributeNS(null, "transform", translate);
        this.brush.setAttributeNS(null, "width", e.area.width);
        this.brush.setAttributeNS(null, "height", e.area.height);
      }
    },
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
          case "click":
            this.onClick(e);
            break;
          case "keydown":
            this.onKey(e);
            break;
          case "keyup":
            this.onKey(e);
            break;
        }
      }
    },
    onKey: {
      value: function onKey(e) {
        this.shiftKey = e.shiftKey;
      }
    },
    onMouseDown: {
      value: function onMouseDown(e) {
        this.mouseDown = true;
        var newLayer = undefined;
        // find the layer
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = _core.$for.getIterator(this.layers), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var layer = _step.value;

            if (layer.hasItem(e.target)) {
              newLayer = layer;
              break;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"]) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        if (this.currentLayer && newLayer && newLayer !== this.currentLayer) {
          this.currentLayer.unselectAll();
        }

        if (newLayer && newLayer !== this.currentLayer) {
          this.currentLayer = newLayer;
        }

        if (!this.currentLayer) {
          return;
        }

        this.previousSelection = this.currentLayer.selectedItems.slice(0);
        // create brush
        if (!this.shiftKey) {
          this.currentLayer.unselect();
        }
      }
    },
    onMouseMove: {
      value: function onMouseMove(e) {
        var _this = this;

        if (!this.mouseDown || !this.currentLayer) {
          return;
        }
        // update brush
        this._updateBrush(e);
        // select all dots in area
        var items = this.currentLayer.getItemsInArea(e.area);
        var currentSelection = this.currentLayer.selectedItems;
        // 1. select all items
        items.forEach(function (item) {
          return _this.currentLayer.select(item);
        });
        // handle shift key
        if (this.shiftKey) {
          this.previousSelection.forEach(function (item) {
            if (items.indexOf(item) !== -1) {
              // 2.1  if the item was is not in item, unselect it
              _this.currentLayer.unselect(item);
            } else {
              // 2.2  else select it
              _this.currentLayer.select(item);
            }
          });
        }

        // 3. if an item of the current selection is no more in the items
        //    and is not in previous selection, unselect it
        currentSelection.forEach(function (item) {
          if (items.indexOf(item) === -1 && _this.previousSelection.indexOf(item) === -1) {
            _this.currentLayer.unselect(item);
          }
        });
      }
    },
    onMouseUp: {
      value: function onMouseUp(e) {
        if (!this.mouseDown) {
          return;
        }
        this.mouseDown = false;
        // remove brush
        this._removeBrush();
      }
    },
    onClick: {

      // @NOTE: 'mousedown' and 'mouseup' are called before 'click'

      value: function onClick(e) {
        if (!this.currentLayer) {
          return;
        }

        var item = this.currentLayer.hasItem(e.target);
        // if no item - unselect all
        if (this.previousSelection.length !== 0 && !this.shiftKey) {
          this.currentLayer.unselectAll();
        }

        // toggle otherwise
        if (item) {
          if (this.previousSelection.indexOf(item) === -1) {
            this.currentLayer.select(item);
          } else {
            this.currentLayer.unselect(item);
          }
        }
      }
    }
  });

  return SelectionState;
})(BaseState);

module.exports = SelectionState;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi90aW1lbGluZS1zdGF0ZXMvc2VsZWN0aW9uLXN0YXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUMxQyxJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQzs7Ozs7O0lBS2xDLGNBQWM7QUFDUCxXQURQLGNBQWMsQ0FDTixRQUFRLEVBQUU7MEJBRGxCLGNBQWM7O0FBRWhCLHFDQUZFLGNBQWMsNkNBRVYsUUFBUSxFQUFFOztBQUVoQixRQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQzs7QUFFekIsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7QUFDMUIsUUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7QUFDdkIsUUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7R0FDdkI7O1lBVEcsY0FBYzs7ZUFBZCxjQUFjO0FBV2xCLFNBQUs7YUFBQSxpQkFBRztBQUNOLFlBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDbEQsWUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLFNBQVMsQ0FBQztBQUM3QyxZQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQ2hDLFlBQUksQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQ2hEOztBQUVELFFBQUk7YUFBQSxnQkFBRztBQUNMLFlBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUNwQixZQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUNoRDs7QUFFRCxnQkFBWTthQUFBLHdCQUFHOztBQUViLFlBQUksQ0FBQyxLQUFLLENB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LENBQUMsSUFBSSxDQUFDLENBQUM7V0FDbEM7U0FDRixDQUFDLENBQUM7T0FDSjs7QUFFRCxhQUFTO2FBQUEsbUJBQUMsQ0FBQyxFQUFFO0FBQ1gsWUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFBRSxpQkFBTztTQUFFO0FBQ2hDLFlBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDOztBQUV2QixZQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7T0FDckI7O0FBR0QsV0FBTzs7OzthQUFBLGlCQUFDLENBQUMsRUFBRTtBQUNULFlBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO0FBQUUsaUJBQU87U0FBRTs7QUFFbkMsWUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUVqRCxZQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUN6RCxjQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ2pDOzs7QUFHRCxZQUFJLElBQUksRUFBRTtBQUNSLGNBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUMvQyxnQkFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7V0FDaEMsTUFBTTtBQUNMLGdCQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztXQUNsQztTQUNGO09BQ0Y7Ozs7U0FySkcsY0FBYztHQUFTLFNBQVM7O0FBd0p0QyxNQUFNLENBQUMsT0FBTyxHQUFHLGNBQWMsQ0FBQyIsImZpbGUiOiJlczYvdGltZWxpbmUtc3RhdGVzL3NlbGVjdGlvbi1zdGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEJhc2VTdGF0ZSA9IHJlcXVpcmUoJy4vYmFzZS1zdGF0ZScpO1xuY29uc3QgbnMgPSByZXF1aXJlKCcuLi9jb3JlL25hbWVzcGFjZScpO1xuXG4vKipcbiAqICBATk9URSBCdWdneVxuICovXG5jbGFzcyBTZWxlY3Rpb25TdGF0ZSBleHRlbmRzIEJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lKSB7XG4gICAgc3VwZXIodGltZWxpbmUpO1xuXG4gICAgdGhpcy5jdXJyZW50TGF5ZXIgPSBudWxsO1xuICAgIC8vIG5lZWQgYSBjYWNoZWRcbiAgICB0aGlzLnNlbGVjdGVkSXRlbXMgPSBudWxsO1xuICAgIHRoaXMubW91c2VEb3duID0gZmFsc2U7XG4gICAgdGhpcy5zaGlmdEtleSA9IGZhbHNlO1xuICB9XG5cbiAgZW50ZXIoKSB7XG4gICAgdGhpcy5icnVzaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3JlY3QnKTtcbiAgICB0aGlzLmJydXNoLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjODk4OTg5JztcbiAgICB0aGlzLmJydXNoLnN0eWxlLm9wYWNpdHkgPSAwLjA4O1xuICAgIHRoaXMuaW50ZXJhY3Rpb25zR3JvdXAuYXBwZW5kQ2hpbGQodGhpcy5icnVzaCk7XG4gIH1cblxuICBleGl0KCkge1xuICAgIHRoaXMuX3JlbW92ZUJydXNoKCk7XG4gICAgdGhpcy5pbnRlcmFjdGlvbnNHcm91cC5yZW1vdmVDaGlsZCh0aGlzLmJydXNoKTtcbiAgfVxuXG4gIF9yZW1vdmVCcnVzaCgpIHtcbiAgICAvLyByZXNldCBicnVzaCBlbGVtZW50XG4gICAgdGhpcy5icnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLCAwKScpO1xuICAgIHRoaXMuYnJ1c2guc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgMCk7XG4gICAgdGhpcy5icnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgMCk7XG4gIH1cblxuICBfdXBkYXRlQnJ1c2goZSkge1xuICAgIGNvbnN0IHRyYW5zbGF0ZSA9IGB0cmFuc2xhdGUoJHtlLmFyZWEubGVmdH0sICR7ZS5hcmVhLnRvcH0pYDtcbiAgICB0aGlzLmJydXNoLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCB0cmFuc2xhdGUpO1xuICAgIHRoaXMuYnJ1c2guc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgZS5hcmVhLndpZHRoKTtcbiAgICB0aGlzLmJydXNoLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBlLmFyZWEuaGVpZ2h0KTtcbiAgfVxuXG4gIGhhbmRsZUV2ZW50KGUpIHtcbiAgICBzd2l0Y2ggKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlRG93bihlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxuICAgICAgICB0aGlzLm9uTW91c2VNb3ZlKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICB0aGlzLm9uTW91c2VVcChlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjbGljayc6XG4gICAgICAgIHRoaXMub25DbGljayhlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdrZXlkb3duJzpcbiAgICAgICAgdGhpcy5vbktleShlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdrZXl1cCc6XG4gICAgICAgIHRoaXMub25LZXkoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIG9uS2V5KGUpIHtcbiAgICB0aGlzLnNoaWZ0S2V5ID0gZS5zaGlmdEtleTtcbiAgfVxuXG4gIG9uTW91c2VEb3duKGUpIHtcbiAgICB0aGlzLm1vdXNlRG93biA9IHRydWU7XG4gICAgbGV0IG5ld0xheWVyO1xuICAgIC8vIGZpbmQgdGhlIGxheWVyXG4gICAgZm9yIChsZXQgbGF5ZXIgb2YgdGhpcy5sYXllcnMpIHtcbiAgICAgIGlmIChsYXllci5oYXNJdGVtKGUudGFyZ2V0KSkge1xuICAgICAgICBuZXdMYXllciA9IGxheWVyO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5jdXJyZW50TGF5ZXIgJiYgbmV3TGF5ZXIgJiYgbmV3TGF5ZXIgIT09IHRoaXMuY3VycmVudExheWVyKSB7XG4gICAgICB0aGlzLmN1cnJlbnRMYXllci51bnNlbGVjdEFsbCgpO1xuICAgIH1cblxuICAgIGlmIChuZXdMYXllciAmJiBuZXdMYXllciAhPT0gdGhpcy5jdXJyZW50TGF5ZXIpIHtcbiAgICAgIHRoaXMuY3VycmVudExheWVyID0gbmV3TGF5ZXI7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmN1cnJlbnRMYXllcikgeyByZXR1cm47IH1cblxuICAgIHRoaXMucHJldmlvdXNTZWxlY3Rpb24gPSB0aGlzLmN1cnJlbnRMYXllci5zZWxlY3RlZEl0ZW1zLnNsaWNlKDApO1xuICAgIC8vIGNyZWF0ZSBicnVzaFxuICAgIGlmICghdGhpcy5zaGlmdEtleSkgeyB0aGlzLmN1cnJlbnRMYXllci51bnNlbGVjdCgpOyB9XG4gIH1cblxuICBvbk1vdXNlTW92ZShlKSB7XG4gICAgaWYgKCF0aGlzLm1vdXNlRG93biB8fMKgIXRoaXMuY3VycmVudExheWVyKSB7IHJldHVybjsgfVxuICAgIC8vIHVwZGF0ZSBicnVzaFxuICAgIHRoaXMuX3VwZGF0ZUJydXNoKGUpO1xuICAgIC8vIHNlbGVjdCBhbGwgZG90cyBpbiBhcmVhXG4gICAgY29uc3QgaXRlbXMgPSB0aGlzLmN1cnJlbnRMYXllci5nZXRJdGVtc0luQXJlYShlLmFyZWEpO1xuICAgIGNvbnN0IGN1cnJlbnRTZWxlY3Rpb24gPSB0aGlzLmN1cnJlbnRMYXllci5zZWxlY3RlZEl0ZW1zO1xuICAgIC8vIDEuIHNlbGVjdCBhbGwgaXRlbXNcbiAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB0aGlzLmN1cnJlbnRMYXllci5zZWxlY3QoaXRlbSkpO1xuICAgIC8vIGhhbmRsZSBzaGlmdCBrZXlcbiAgICBpZiAodGhpcy5zaGlmdEtleSkge1xuICAgICAgdGhpcy5wcmV2aW91c1NlbGVjdGlvbi5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgIGlmIChpdGVtcy5pbmRleE9mKGl0ZW0pICE9PSAtMSkge1xuICAgICAgICAgIC8vIDIuMSAgaWYgdGhlIGl0ZW0gd2FzIGlzIG5vdCBpbiBpdGVtLCB1bnNlbGVjdCBpdFxuICAgICAgICAgIHRoaXMuY3VycmVudExheWVyLnVuc2VsZWN0KGl0ZW0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIDIuMiAgZWxzZSBzZWxlY3QgaXRcbiAgICAgICAgICB0aGlzLmN1cnJlbnRMYXllci5zZWxlY3QoaXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIDMuIGlmIGFuIGl0ZW0gb2YgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGlzIG5vIG1vcmUgaW4gdGhlIGl0ZW1zXG4gICAgLy8gICAgYW5kIGlzIG5vdCBpbiBwcmV2aW91cyBzZWxlY3Rpb24sIHVuc2VsZWN0IGl0XG4gICAgY3VycmVudFNlbGVjdGlvbi5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBpZiAoXG4gICAgICAgIGl0ZW1zLmluZGV4T2YoaXRlbSkgPT09IC0xICYmXG4gICAgICAgIHRoaXMucHJldmlvdXNTZWxlY3Rpb24uaW5kZXhPZihpdGVtKSA9PT0gLTFcbiAgICAgICkge1xuICAgICAgICB0aGlzLmN1cnJlbnRMYXllci51bnNlbGVjdChpdGVtKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG9uTW91c2VVcChlKSB7XG4gICAgaWYgKCF0aGlzLm1vdXNlRG93bikgeyByZXR1cm47IH1cbiAgICB0aGlzLm1vdXNlRG93biA9IGZhbHNlO1xuICAgIC8vIHJlbW92ZSBicnVzaFxuICAgIHRoaXMuX3JlbW92ZUJydXNoKCk7XG4gIH1cblxuICAvLyBATk9URTogJ21vdXNlZG93bicgYW5kICdtb3VzZXVwJyBhcmUgY2FsbGVkIGJlZm9yZSAnY2xpY2snXG4gIG9uQ2xpY2soZSkge1xuICAgIGlmICghdGhpcy5jdXJyZW50TGF5ZXIpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBpdGVtID0gdGhpcy5jdXJyZW50TGF5ZXIuaGFzSXRlbShlLnRhcmdldCk7XG4gICAgLy8gaWYgbm8gaXRlbSAtIHVuc2VsZWN0IGFsbFxuICAgIGlmICh0aGlzLnByZXZpb3VzU2VsZWN0aW9uLmxlbmd0aCAhPT0gMCAmJiAhdGhpcy5zaGlmdEtleSkge1xuICAgICAgdGhpcy5jdXJyZW50TGF5ZXIudW5zZWxlY3RBbGwoKTtcbiAgICB9XG5cbiAgICAvLyB0b2dnbGUgb3RoZXJ3aXNlXG4gICAgaWYgKGl0ZW0pIHtcbiAgICAgIGlmICh0aGlzLnByZXZpb3VzU2VsZWN0aW9uLmluZGV4T2YoaXRlbSkgPT09IC0xKSB7XG4gICAgICAgIHRoaXMuY3VycmVudExheWVyLnNlbGVjdChpdGVtKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY3VycmVudExheWVyLnVuc2VsZWN0KGl0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNlbGVjdGlvblN0YXRlO1xuIl19