"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var BaseState = require("./base-state");
var ns = require("../core/namespace");

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi90aW1lbGluZS1zdGF0ZXMvc2VsZWN0aW9uLXN0YXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUMxQyxJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQzs7SUFFbEMsY0FBYztBQUNQLFdBRFAsY0FBYyxDQUNOLFFBQVEsRUFBRTswQkFEbEIsY0FBYzs7QUFFaEIscUNBRkUsY0FBYyw2Q0FFVixRQUFRLEVBQUU7O0FBRWhCLFFBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDOztBQUV6QixRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztBQUMxQixRQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztBQUN2QixRQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztHQUN2Qjs7WUFURyxjQUFjOztlQUFkLGNBQWM7QUFXbEIsU0FBSzthQUFBLGlCQUFHO0FBQ04sWUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNsRCxZQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsU0FBUyxDQUFDO0FBQzdDLFlBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDaEMsWUFBSSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDaEQ7O0FBRUQsUUFBSTthQUFBLGdCQUFHO0FBQ0wsWUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQ3BCLFlBQUksQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQ2hEOztBQUVELGdCQUFZO2FBQUEsd0JBQUc7O0FBRWIsWUFBSSxDQUFDLEtBQUssQ0FBQyxj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QyxJQUFJLENBQUMsQ0FBQztXQUNsQztTQUNGLENBQUMsQ0FBQztPQUNKOztBQUVELGFBQVM7YUFBQSxtQkFBQyxDQUFDLEVBQUU7QUFDWCxZQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUFFLGlCQUFPO1NBQUU7QUFDaEMsWUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7O0FBRXZCLFlBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztPQUNyQjs7QUFHRCxXQUFPOzs7O2FBQUEsaUJBQUMsQ0FBQyxFQUFFO0FBQ1QsWUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7QUFBRSxpQkFBTztTQUFFOztBQUVuQyxZQUFNLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRWpELFlBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ3pELGNBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDakM7OztBQUdELFlBQUksSUFBSSxFQUFFO0FBQ1IsY0FBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQy9DLGdCQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztXQUNoQyxNQUFNO0FBQ0wsZ0JBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1dBQ2xDO1NBQ0Y7T0FDRjs7OztTQXJKRyxjQUFjO0dBQVMsU0FBUzs7QUF3SnRDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsY0FBYyxDQUFDIiwiZmlsZSI6ImVzNi90aW1lbGluZS1zdGF0ZXMvc2VsZWN0aW9uLXN0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQmFzZVN0YXRlID0gcmVxdWlyZSgnLi9iYXNlLXN0YXRlJyk7XG5jb25zdCBucyA9IHJlcXVpcmUoJy4uL2NvcmUvbmFtZXNwYWNlJyk7XG5cbmNsYXNzIFNlbGVjdGlvblN0YXRlIGV4dGVuZHMgQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUpIHtcbiAgICBzdXBlcih0aW1lbGluZSk7XG5cbiAgICB0aGlzLmN1cnJlbnRMYXllciA9IG51bGw7XG4gICAgLy8gbmVlZCBhIGNhY2hlZFxuICAgIHRoaXMuc2VsZWN0ZWRJdGVtcyA9IG51bGw7XG4gICAgdGhpcy5tb3VzZURvd24gPSBmYWxzZTtcbiAgICB0aGlzLnNoaWZ0S2V5ID0gZmFsc2U7XG4gIH1cblxuICBlbnRlcigpIHtcbiAgICB0aGlzLmJydXNoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAncmVjdCcpO1xuICAgIHRoaXMuYnJ1c2guc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyM4OTg5ODknO1xuICAgIHRoaXMuYnJ1c2guc3R5bGUub3BhY2l0eSA9IDAuMDg7XG4gICAgdGhpcy5pbnRlcmFjdGlvbnNHcm91cC5hcHBlbmRDaGlsZCh0aGlzLmJydXNoKTtcbiAgfVxuXG4gIGV4aXQoKSB7XG4gICAgdGhpcy5fcmVtb3ZlQnJ1c2goKTtcbiAgICB0aGlzLmludGVyYWN0aW9uc0dyb3VwLnJlbW92ZUNoaWxkKHRoaXMuYnJ1c2gpO1xuICB9XG5cbiAgX3JlbW92ZUJydXNoKCkge1xuICAgIC8vIHJlc2V0IGJydXNoIGVsZW1lbnRcbiAgICB0aGlzLmJydXNoLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsIDApJyk7XG4gICAgdGhpcy5icnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCAwKTtcbiAgICB0aGlzLmJydXNoLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCAwKTtcbiAgfVxuXG4gIF91cGRhdGVCcnVzaChlKSB7XG4gICAgY29uc3QgdHJhbnNsYXRlID0gYHRyYW5zbGF0ZSgke2UuYXJlYS5sZWZ0fSwgJHtlLmFyZWEudG9wfSlgO1xuICAgIHRoaXMuYnJ1c2guc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIHRyYW5zbGF0ZSk7XG4gICAgdGhpcy5icnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCBlLmFyZWEud2lkdGgpO1xuICAgIHRoaXMuYnJ1c2guc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIGUuYXJlYS5oZWlnaHQpO1xuICB9XG5cbiAgaGFuZGxlRXZlbnQoZSkge1xuICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICB0aGlzLm9uTW91c2VEb3duKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XG4gICAgICAgIHRoaXMub25Nb3VzZU1vdmUoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIHRoaXMub25Nb3VzZVVwKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NsaWNrJzpcbiAgICAgICAgdGhpcy5vbkNsaWNrKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2tleWRvd24nOlxuICAgICAgICB0aGlzLm9uS2V5KGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2tleXVwJzpcbiAgICAgICAgdGhpcy5vbktleShlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgb25LZXkoZSkge1xuICAgIHRoaXMuc2hpZnRLZXkgPSBlLnNoaWZ0S2V5O1xuICB9XG5cbiAgb25Nb3VzZURvd24oZSkge1xuICAgIHRoaXMubW91c2VEb3duID0gdHJ1ZTtcbiAgICBsZXQgbmV3TGF5ZXI7XG4gICAgLy8gZmluZCB0aGUgbGF5ZXJcbiAgICBmb3IgKGxldCBsYXllciBvZiB0aGlzLmxheWVycykge1xuICAgICAgaWYgKGxheWVyLmhhc0l0ZW0oZS50YXJnZXQpKSB7XG4gICAgICAgIG5ld0xheWVyID0gbGF5ZXI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmN1cnJlbnRMYXllciAmJiBuZXdMYXllciAmJiBuZXdMYXllciAhPT0gdGhpcy5jdXJyZW50TGF5ZXIpIHtcbiAgICAgIHRoaXMuY3VycmVudExheWVyLnVuc2VsZWN0QWxsKCk7XG4gICAgfVxuXG4gICAgaWYgKG5ld0xheWVyICYmIG5ld0xheWVyICE9PSB0aGlzLmN1cnJlbnRMYXllcikge1xuICAgICAgdGhpcy5jdXJyZW50TGF5ZXIgPSBuZXdMYXllcjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuY3VycmVudExheWVyKSB7IHJldHVybjsgfVxuXG4gICAgdGhpcy5wcmV2aW91c1NlbGVjdGlvbiA9IHRoaXMuY3VycmVudExheWVyLnNlbGVjdGVkSXRlbXMuc2xpY2UoMCk7XG4gICAgLy8gY3JlYXRlIGJydXNoXG4gICAgaWYgKCF0aGlzLnNoaWZ0S2V5KSB7IHRoaXMuY3VycmVudExheWVyLnVuc2VsZWN0KCk7IH1cbiAgfVxuXG4gIG9uTW91c2VNb3ZlKGUpIHtcbiAgICBpZiAoIXRoaXMubW91c2VEb3duIHx8wqAhdGhpcy5jdXJyZW50TGF5ZXIpIHsgcmV0dXJuOyB9XG4gICAgLy8gdXBkYXRlIGJydXNoXG4gICAgdGhpcy5fdXBkYXRlQnJ1c2goZSk7XG4gICAgLy8gc2VsZWN0IGFsbCBkb3RzIGluIGFyZWFcbiAgICBjb25zdCBpdGVtcyA9IHRoaXMuY3VycmVudExheWVyLmdldEl0ZW1zSW5BcmVhKGUuYXJlYSk7XG4gICAgY29uc3QgY3VycmVudFNlbGVjdGlvbiA9IHRoaXMuY3VycmVudExheWVyLnNlbGVjdGVkSXRlbXM7XG4gICAgLy8gMS4gc2VsZWN0IGFsbCBpdGVtc1xuICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHRoaXMuY3VycmVudExheWVyLnNlbGVjdChpdGVtKSk7XG4gICAgLy8gaGFuZGxlIHNoaWZ0IGtleVxuICAgIGlmICh0aGlzLnNoaWZ0S2V5KSB7XG4gICAgICB0aGlzLnByZXZpb3VzU2VsZWN0aW9uLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgaWYgKGl0ZW1zLmluZGV4T2YoaXRlbSkgIT09IC0xKSB7XG4gICAgICAgICAgLy8gMi4xICBpZiB0aGUgaXRlbSB3YXMgaXMgbm90IGluIGl0ZW0sIHVuc2VsZWN0IGl0XG4gICAgICAgICAgdGhpcy5jdXJyZW50TGF5ZXIudW5zZWxlY3QoaXRlbSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gMi4yICBlbHNlIHNlbGVjdCBpdFxuICAgICAgICAgIHRoaXMuY3VycmVudExheWVyLnNlbGVjdChpdGVtKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gMy4gaWYgYW4gaXRlbSBvZiB0aGUgY3VycmVudCBzZWxlY3Rpb24gaXMgbm8gbW9yZSBpbiB0aGUgaXRlbXNcbiAgICAvLyAgICBhbmQgaXMgbm90IGluIHByZXZpb3VzIHNlbGVjdGlvbiwgdW5zZWxlY3QgaXRcbiAgICBjdXJyZW50U2VsZWN0aW9uLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGlmIChcbiAgICAgICAgaXRlbXMuaW5kZXhPZihpdGVtKSA9PT0gLTEgJiZcbiAgICAgICAgdGhpcy5wcmV2aW91c1NlbGVjdGlvbi5pbmRleE9mKGl0ZW0pID09PSAtMVxuICAgICAgKSB7XG4gICAgICAgIHRoaXMuY3VycmVudExheWVyLnVuc2VsZWN0KGl0ZW0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgb25Nb3VzZVVwKGUpIHtcbiAgICBpZiAoIXRoaXMubW91c2VEb3duKSB7IHJldHVybjsgfVxuICAgIHRoaXMubW91c2VEb3duID0gZmFsc2U7XG4gICAgLy8gcmVtb3ZlIGJydXNoXG4gICAgdGhpcy5fcmVtb3ZlQnJ1c2goKTtcbiAgfVxuXG4gIC8vIEBOT1RFOiAnbW91c2Vkb3duJyBhbmQgJ21vdXNldXAnIGFyZSBjYWxsZWQgYmVmb3JlICdjbGljaydcbiAgb25DbGljayhlKSB7XG4gICAgaWYgKCF0aGlzLmN1cnJlbnRMYXllcikgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmN1cnJlbnRMYXllci5oYXNJdGVtKGUudGFyZ2V0KTtcbiAgICAvLyBpZiBubyBpdGVtIC0gdW5zZWxlY3QgYWxsXG4gICAgaWYgKHRoaXMucHJldmlvdXNTZWxlY3Rpb24ubGVuZ3RoICE9PSAwICYmICF0aGlzLnNoaWZ0S2V5KSB7XG4gICAgICB0aGlzLmN1cnJlbnRMYXllci51bnNlbGVjdEFsbCgpO1xuICAgIH1cblxuICAgIC8vIHRvZ2dsZSBvdGhlcndpc2VcbiAgICBpZiAoaXRlbSkge1xuICAgICAgaWYgKHRoaXMucHJldmlvdXNTZWxlY3Rpb24uaW5kZXhPZihpdGVtKSA9PT0gLTEpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50TGF5ZXIuc2VsZWN0KGl0ZW0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jdXJyZW50TGF5ZXIudW5zZWxlY3QoaXRlbSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2VsZWN0aW9uU3RhdGU7XG4iXX0=