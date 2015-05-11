"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var BaseState = require("./base-state");
var ns = require("../core/namespace");

var SelectionState = (function (_BaseState) {
  function SelectionState(timeline) {
    _classCallCheck(this, SelectionState);

    this.timeline = timeline;
    this.layers = timeline.layers;

    this.interactionsGroup = timeline.interactionsGroup;
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

        if (newLayer) {
          this.currentLayer = newLayer;
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

        if (!this.mouseDown) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi90aW1lbGluZS1zdGF0ZXMvc2VsZWN0aW9uLXN0YXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDMUMsSUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7O0lBRWxDLGNBQWM7QUFDUCxXQURQLGNBQWMsQ0FDTixRQUFRLEVBQUU7MEJBRGxCLGNBQWM7O0FBRWhCLFFBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQzs7QUFFOUIsUUFBSSxDQUFDLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQztBQUNwRCxRQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQzs7QUFFekIsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7QUFDMUIsUUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7QUFDdkIsUUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7R0FDdkI7O1lBWEcsY0FBYzs7ZUFBZCxjQUFjO0FBYWxCLFNBQUs7YUFBQSxpQkFBRztBQUNOLFlBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDbEQsWUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLFNBQVMsQ0FBQztBQUM3QyxZQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQ2hDLFlBQUksQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQ2hEOztBQUVELFFBQUk7YUFBQSxnQkFBRztBQUNMLFlBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUNwQixZQUFJLENBQUMsaUJBQWlC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Q0FBQztXQUNsQztTQUNGLENBQUMsQ0FBQztPQUNKOztBQUVELGFBQVM7YUFBQSxtQkFBQyxDQUFDLEVBQUU7QUFDWCxZQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUFFLGlCQUFPO1NBQUU7QUFDaEMsWUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7O0FBRXZCLFlBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztPQUNyQjs7QUFHRCxXQUFPOzs7O2FBQUEsaUJBQUMsQ0FBQyxFQUFFO0FBQ1QsWUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUVqRCxZQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUN6RCxjQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ2pDOzs7QUFHRCxZQUFJLElBQUksRUFBRTtBQUNSLGNBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUMvQyxnQkFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7V0FDaEMsTUFBTTtBQUNMLGdCQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztXQUNsQztTQUNGO09BQ0Y7Ozs7U0FuSkcsY0FBYztHQUFTLFNBQVM7O0FBc0p0QyxNQUFNLENBQUMsT0FBTyxHQUFHLGNBQWMsQ0FBQyIsImZpbGUiOiJlczYvdGltZWxpbmUtc3RhdGVzL3NlbGVjdGlvbi1zdGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEJhc2VTdGF0ZSA9IHJlcXVpcmUoJy4vYmFzZS1zdGF0ZScpO1xuY29uc3QgbnMgPSByZXF1aXJlKCcuLi9jb3JlL25hbWVzcGFjZScpO1xuXG5jbGFzcyBTZWxlY3Rpb25TdGF0ZSBleHRlbmRzIEJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lKSB7XG4gICAgdGhpcy50aW1lbGluZSA9IHRpbWVsaW5lO1xuICAgIHRoaXMubGF5ZXJzID0gdGltZWxpbmUubGF5ZXJzO1xuXG4gICAgdGhpcy5pbnRlcmFjdGlvbnNHcm91cCA9IHRpbWVsaW5lLmludGVyYWN0aW9uc0dyb3VwO1xuICAgIHRoaXMuY3VycmVudExheWVyID0gbnVsbDtcbiAgICAvLyBuZWVkIGEgY2FjaGVkXG4gICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gbnVsbDtcbiAgICB0aGlzLm1vdXNlRG93biA9IGZhbHNlO1xuICAgIHRoaXMuc2hpZnRLZXkgPSBmYWxzZTtcbiAgfVxuXG4gIGVudGVyKCkge1xuICAgIHRoaXMuYnJ1c2ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdyZWN0Jyk7XG4gICAgdGhpcy5icnVzaC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnIzg5ODk4OSc7XG4gICAgdGhpcy5icnVzaC5zdHlsZS5vcGFjaXR5ID0gMC4wODtcbiAgICB0aGlzLmludGVyYWN0aW9uc0dyb3VwLmFwcGVuZENoaWxkKHRoaXMuYnJ1c2gpO1xuICB9XG5cbiAgZXhpdCgpIHtcbiAgICB0aGlzLl9yZW1vdmVCcnVzaCgpO1xuICAgIHRoaXMuaW50ZXJhY3Rpb25zR3JvdXAucmVtb3ZlQ2hpbGQodGhpcy5icnVzaCk7XG4gIH1cblxuICBfcmVtb3ZlQnJ1c2goKSB7XG4gICAgLy8gcmVzZXQgYnJ1c2ggZWxlbWVudFxuICAgIHRoaXMuYnJ1c2guc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwgMCknKTtcbiAgICB0aGlzLmJydXNoLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIDApO1xuICAgIHRoaXMuYnJ1c2guc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIDApO1xuICB9XG5cbiAgX3VwZGF0ZUJydXNoKGUpIHtcbiAgICBjb25zdCB0cmFuc2xhdGUgPSBgdHJhbnNsYXRlKCR7ZS5hcmVhLmxlZnR9LCAke2UuYXJlYS50b3B9KWA7XG4gICAgdGhpcy5icnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgdHJhbnNsYXRlKTtcbiAgICB0aGlzLmJydXNoLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIGUuYXJlYS53aWR0aCk7XG4gICAgdGhpcy5icnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgZS5hcmVhLmhlaWdodCk7XG4gIH1cblxuICBoYW5kbGVFdmVudChlKSB7XG4gICAgc3dpdGNoIChlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ21vdXNlZG93bic6XG4gICAgICAgIHRoaXMub25Nb3VzZURvd24oZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlTW92ZShlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZXVwJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlVXAoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY2xpY2snOlxuICAgICAgICB0aGlzLm9uQ2xpY2soZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAna2V5ZG93bic6XG4gICAgICAgIHRoaXMub25LZXkoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAna2V5dXAnOlxuICAgICAgICB0aGlzLm9uS2V5KGUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBvbktleShlKSB7XG4gICAgdGhpcy5zaGlmdEtleSA9IGUuc2hpZnRLZXk7XG4gIH1cblxuICBvbk1vdXNlRG93bihlKSB7XG4gICAgdGhpcy5tb3VzZURvd24gPSB0cnVlO1xuICAgIGxldCBuZXdMYXllcjtcbiAgICAvLyBmaW5kIHRoZSBsYXllclxuICAgIGZvciAobGV0IGxheWVyIG9mIHRoaXMubGF5ZXJzKSB7XG4gICAgICBpZiAobGF5ZXIuaGFzSXRlbShlLnRhcmdldCkpIHtcbiAgICAgICAgbmV3TGF5ZXIgPSBsYXllcjtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY3VycmVudExheWVyICYmIG5ld0xheWVyICYmIG5ld0xheWVyICE9PSB0aGlzLmN1cnJlbnRMYXllcikge1xuICAgICAgdGhpcy5jdXJyZW50TGF5ZXIudW5zZWxlY3RBbGwoKTtcbiAgICB9XG5cbiAgICBpZiAobmV3TGF5ZXIpIHtcbiAgICAgIHRoaXMuY3VycmVudExheWVyID0gbmV3TGF5ZXI7XG4gICAgfVxuXG4gICAgdGhpcy5wcmV2aW91c1NlbGVjdGlvbiA9IHRoaXMuY3VycmVudExheWVyLnNlbGVjdGVkSXRlbXMuc2xpY2UoMCk7XG4gICAgLy8gY3JlYXRlIGJydXNoXG4gICAgaWYgKCF0aGlzLnNoaWZ0S2V5KSB7IHRoaXMuY3VycmVudExheWVyLnVuc2VsZWN0KCk7IH1cbiAgfVxuXG4gIG9uTW91c2VNb3ZlKGUpIHtcbiAgICBpZiAoIXRoaXMubW91c2VEb3duKSB7IHJldHVybjsgfVxuICAgIC8vIHVwZGF0ZSBicnVzaFxuICAgIHRoaXMuX3VwZGF0ZUJydXNoKGUpO1xuICAgIC8vIHNlbGVjdCBhbGwgZG90cyBpbiBhcmVhXG4gICAgY29uc3QgaXRlbXMgPSB0aGlzLmN1cnJlbnRMYXllci5nZXRJdGVtc0luQXJlYShlLmFyZWEpO1xuICAgIGNvbnN0IGN1cnJlbnRTZWxlY3Rpb24gPSB0aGlzLmN1cnJlbnRMYXllci5zZWxlY3RlZEl0ZW1zO1xuICAgIC8vIDEuIHNlbGVjdCBhbGwgaXRlbXNcbiAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB0aGlzLmN1cnJlbnRMYXllci5zZWxlY3QoaXRlbSkpO1xuICAgIC8vIGhhbmRsZSBzaGlmdCBrZXlcbiAgICBpZiAodGhpcy5zaGlmdEtleSkge1xuICAgICAgdGhpcy5wcmV2aW91c1NlbGVjdGlvbi5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgIGlmIChpdGVtcy5pbmRleE9mKGl0ZW0pICE9PSAtMSkge1xuICAgICAgICAgIC8vIDIuMSAgaWYgdGhlIGl0ZW0gd2FzIGlzIG5vdCBpbiBpdGVtLCB1bnNlbGVjdCBpdFxuICAgICAgICAgIHRoaXMuY3VycmVudExheWVyLnVuc2VsZWN0KGl0ZW0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIDIuMiAgZWxzZSBzZWxlY3QgaXRcbiAgICAgICAgICB0aGlzLmN1cnJlbnRMYXllci5zZWxlY3QoaXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIDMuIGlmIGFuIGl0ZW0gb2YgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGlzIG5vIG1vcmUgaW4gdGhlIGl0ZW1zXG4gICAgLy8gICAgYW5kIGlzIG5vdCBpbiBwcmV2aW91cyBzZWxlY3Rpb24sIHVuc2VsZWN0IGl0XG4gICAgY3VycmVudFNlbGVjdGlvbi5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBpZiAoXG4gICAgICAgIGl0ZW1zLmluZGV4T2YoaXRlbSkgPT09IC0xICYmXG4gICAgICAgIHRoaXMucHJldmlvdXNTZWxlY3Rpb24uaW5kZXhPZihpdGVtKSA9PT0gLTFcbiAgICAgICkge1xuICAgICAgICB0aGlzLmN1cnJlbnRMYXllci51bnNlbGVjdChpdGVtKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG9uTW91c2VVcChlKSB7XG4gICAgaWYgKCF0aGlzLm1vdXNlRG93bikgeyByZXR1cm47IH1cbiAgICB0aGlzLm1vdXNlRG93biA9IGZhbHNlO1xuICAgIC8vIHJlbW92ZSBicnVzaFxuICAgIHRoaXMuX3JlbW92ZUJydXNoKCk7XG4gIH1cblxuICAvLyBATk9URTogJ21vdXNlZG93bicgYW5kICdtb3VzZXVwJyBhcmUgY2FsbGVkIGJlZm9yZSAnY2xpY2snXG4gIG9uQ2xpY2soZSkge1xuICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmN1cnJlbnRMYXllci5oYXNJdGVtKGUudGFyZ2V0KTtcbiAgICAvLyBpZiBubyBpdGVtIC0gdW5zZWxlY3QgYWxsXG4gICAgaWYgKHRoaXMucHJldmlvdXNTZWxlY3Rpb24ubGVuZ3RoICE9PSAwICYmICF0aGlzLnNoaWZ0S2V5KSB7XG4gICAgICB0aGlzLmN1cnJlbnRMYXllci51bnNlbGVjdEFsbCgpO1xuICAgIH1cblxuICAgIC8vIHRvZ2dsZSBvdGhlcndpc2VcbiAgICBpZiAoaXRlbSkge1xuICAgICAgaWYgKHRoaXMucHJldmlvdXNTZWxlY3Rpb24uaW5kZXhPZihpdGVtKSA9PT0gLTEpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50TGF5ZXIuc2VsZWN0KGl0ZW0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jdXJyZW50TGF5ZXIudW5zZWxlY3QoaXRlbSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2VsZWN0aW9uU3RhdGU7XG4iXX0=