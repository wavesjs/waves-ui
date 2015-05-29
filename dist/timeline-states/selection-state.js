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
  function SelectionState(timeline /*, options = {} */) {
    _classCallCheck(this, SelectionState);

    _get(_core.Object.getPrototypeOf(SelectionState.prototype), "constructor", this).call(this, timeline /*, options */);

    this.currentLayer = null;
    // need a cached
    this.selectedItems = null;
    this.mouseDown = false;
    this.shiftKey = false;
  }

  _inherits(SelectionState, _BaseState);

  _createClass(SelectionState, {
    enter: {
      value: function enter() {}
    },
    exit: {
      value: function exit() {
        var containers = this.timeline.containers;

        for (var id in containers) {
          this._removebrush(containers[id]);
        }
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
    _addBrush: {
      value: function _addBrush(container) {
        if (container.brushElement !== null) {
          return;
        }

        var brush = document.createElementNS(ns, "rect");
        brush.style.fill = "#686868";
        brush.style.opacity = 0.2;

        container.interactionsElement.appendChild(brush);
        container.brushElement = brush;
      }
    },
    _removeBrush: {
      value: function _removeBrush(container) {
        if (container.brushElement === null) {
          return;
        }

        this._resetBrush(container.brushElement);
        container.interactionsElement.removeChild(container.brushElement);
        container.brushElement = null;
      }
    },
    _resetBrush: {
      value: function _resetBrush(container) {
        var brushElement = container.brushElement;
        // reset brush element
        brushElement.setAttributeNS(null, "transform", "translate(0, 0)");
        brushElement.setAttributeNS(null, "width", 0);
        brushElement.setAttributeNS(null, "height", 0);
      }
    },
    _updateBrush: {
      value: function _updateBrush(e, container) {
        var brushElement = container.brushElement;
        var translate = "translate(" + e.area.left + ", " + e.area.top + ")";

        brushElement.setAttributeNS(null, "transform", translate);
        brushElement.setAttributeNS(null, "width", e.area.width);
        brushElement.setAttributeNS(null, "height", e.area.height);
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

        var container = this.timeline.getContainerPerElement(e.currentTarget);
        this.currentContainer = container;
        this._addBrush(container);

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

        // console.log(e);
        // if (!this.mouseDown || !this.currentLayer) { return; }
        if (!this.mouseDown) {
          return;
        }

        var container = this.timeline.getContainerPerElement(this.currentLayer);
        // update brush
        this._updateBrush(e, this.currentContainer);

        if (this.currentLayer) {
          (function () {
            // select all dots in area
            var items = _this.currentLayer.getItemsInArea(e.area);
            var currentSelection = _this.currentLayer.selectedItems;
            // 1. select all items
            items.forEach(function (item) {
              return _this.currentLayer.select(item);
            });
            // handle shift key
            if (_this.shiftKey) {
              _this.previousSelection.forEach(function (item) {
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
          })();
        }
      }
    },
    onMouseUp: {
      value: function onMouseUp(e) {
        if (!this.mouseDown) {
          return;
        }
        this.mouseDown = false;
        // reset brushElement
        this._resetBrush(this.currentContainer);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi90aW1lbGluZS1zdGF0ZXMvc2VsZWN0aW9uLXN0YXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUMxQyxJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQzs7Ozs7O0lBS2xDLGNBQWM7QUFDUCxXQURQLGNBQWMsQ0FDTixRQUFRLHNCQUFzQjswQkFEdEMsY0FBYzs7QUFFaEIscUNBRkUsY0FBYyw2Q0FFVixRQUFRLGlCQUFpQjs7QUFFL0IsUUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7O0FBRXpCLFFBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO0FBQzFCLFFBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0FBQ3ZCLFFBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0dBQ3ZCOztZQVRHLGNBQWM7O2VBQWQsY0FBYztBQVdsQixTQUFLO2FBQUEsaUJBQUcsRUFFUDs7QUFFRCxRQUFJO2FBQUEsZ0JBQUc7QUFDTCxZQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQzs7QUFFNUMsYUFBSyxJQUFJLEVBQUUsSUFBSSxVQUFVLEVBQUU7QUFDekIsY0FBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNuQztPQUNGOztBQUVELGVBQVc7YUFBQSxxQkFBQyxDQUFDLEVBQUU7QUFDYixnQkFBUSxDQUFDLENBQUMsSUFBSTtBQUNaLGVBQUssV0FBVztBQUNkLGdCQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLGtCQUFNO0FBQUEsQUFDUixlQUFLLFdBQVc7QUFDZCxnQkFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixrQkFBTTtBQUFBLEFBQ1IsZUFBSyxTQUFTO0FBQ1osZ0JBQUksQ0FB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Q0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7T0FDekM7O0FBR0QsV0FBTzs7OzthQUFBLGlCQUFDLENBQUMsRUFBRTtBQUNULFlBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO0FBQUUsaUJBQU87U0FBRTs7QUFFbkMsWUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUVqRCxZQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUN6RCxjQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ2pDOzs7QUFHRCxZQUFJLElBQUksRUFBRTtBQUNSLGNBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUMvQyxnQkFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7V0FDaEMsTUFBTTtBQUNMLGdCQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztXQUNsQztTQUNGO09BQ0Y7Ozs7U0F2TEcsY0FBYztHQUFTLFNBQVM7O0FBMEx0QyxNQUFNLENBQUMsT0FBTyxHQUFHLGNBQWMsQ0FBQyIsImZpbGUiOiJlczYvdGltZWxpbmUtc3RhdGVzL3NlbGVjdGlvbi1zdGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEJhc2VTdGF0ZSA9IHJlcXVpcmUoJy4vYmFzZS1zdGF0ZScpO1xuY29uc3QgbnMgPSByZXF1aXJlKCcuLi9jb3JlL25hbWVzcGFjZScpO1xuXG4vKipcbiAqICBATk9URSBCdWdneVxuICovXG5jbGFzcyBTZWxlY3Rpb25TdGF0ZSBleHRlbmRzIEJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lIC8qLCBvcHRpb25zID0ge30gKi8pIHtcbiAgICBzdXBlcih0aW1lbGluZSAvKiwgb3B0aW9ucyAqLyk7XG5cbiAgICB0aGlzLmN1cnJlbnRMYXllciA9IG51bGw7XG4gICAgLy8gbmVlZCBhIGNhY2hlZFxuICAgIHRoaXMuc2VsZWN0ZWRJdGVtcyA9IG51bGw7XG4gICAgdGhpcy5tb3VzZURvd24gPSBmYWxzZTtcbiAgICB0aGlzLnNoaWZ0S2V5ID0gZmFsc2U7XG4gIH1cblxuICBlbnRlcigpIHtcblxuICB9XG5cbiAgZXhpdCgpIHtcbiAgICBjb25zdCBjb250YWluZXJzID0gdGhpcy50aW1lbGluZS5jb250YWluZXJzO1xuXG4gICAgZm9yIChsZXQgaWQgaW4gY29udGFpbmVycykge1xuICAgICAgdGhpcy5fcmVtb3ZlYnJ1c2goY29udGFpbmVyc1tpZF0pO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUV2ZW50KGUpIHtcbiAgICBzd2l0Y2ggKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlRG93bihlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxuICAgICAgICB0aGlzLm9uTW91c2VNb3ZlKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICB0aGlzLm9uTW91c2VVcChlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjbGljayc6XG4gICAgICAgIHRoaXMub25DbGljayhlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdrZXlkb3duJzpcbiAgICAgICAgdGhpcy5vbktleShlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdrZXl1cCc6XG4gICAgICAgIHRoaXMub25LZXkoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIF9hZGRCcnVzaChjb250YWluZXIpIHtcbiAgICBpZiAoY29udGFpbmVyLmJydXNoRWxlbWVudCAhPT0gbnVsbCkgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IGJydXNoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAncmVjdCcpO1xuICAgIGJydXNoLnN0eWxlLmZpbGwgPSAnIzY4Njg2OCc7XG4gICAgYnJ1c2guc3R5bGUub3BhY2l0eSA9IDAuMjtcblxuICAgIGNvbnRhaW5lci5pbnRlcmFjdGlvbnNFbGVtZW50LmFwcGVuZENoaWxkKGJydXNoKTtcbiAgICBjb250YWluZXIuYnJ1c2hFbGVtZW50ID0gYnJ1c2g7XG4gIH1cblxuICBfcmVtb3ZlQnJ1c2goY29udGFpbmVyKSB7XG4gICAgaWYgKGNvbnRhaW5lci5icnVzaEVsZW1lbnQgPT09IG51bGwpIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLl9yZXNldEJydXNoKGNvbnRhaW5lci5icnVzaEVsZW1lbnQpO1xuICAgIGNvbnRhaW5lci5pbnRlcmFjdGlvbnNFbGVtZW50LnJlbW92ZUNoaWxkKGNvbnRhaW5lci5icnVzaEVsZW1lbnQpO1xuICAgIGNvbnRhaW5lci5icnVzaEVsZW1lbnQgPSBudWxsO1xuICB9XG5cbiAgX3Jlc2V0QnJ1c2goY29udGFpbmVyKSB7XG4gICAgY29uc3QgYnJ1c2hFbGVtZW50ID0gY29udGFpbmVyLmJydXNoRWxlbWVudDtcbiAgICAvLyByZXNldCBicnVzaCBlbGVtZW50XG4gICAgYnJ1c2hFbGVtZW50LnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsIDApJyk7XG4gICAgYnJ1c2hFbGVtZW50LnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIDApO1xuICAgIGJydXNoRWxlbWVudC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgMCk7XG4gIH1cblxuICBfdXBkYXRlQnJ1c2goZSwgY29udGFpbmVyKSB7XG4gICAgY29uc3QgYnJ1c2hFbGVtZW50ID0gY29udGFpbmVyLmJydXNoRWxlbWVudDtcbiAgICBjb25zdCB0cmFuc2xhdGUgPSBgdHJhbnNsYXRlKCR7ZS5hcmVhLmxlZnR9LCAke2UuYXJlYS50b3B9KWA7XG5cbiAgICBicnVzaEVsZW1lbnQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIHRyYW5zbGF0ZSk7XG4gICAgYnJ1c2hFbGVtZW50LnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIGUuYXJlYS53aWR0aCk7XG4gICAgYnJ1c2hFbGVtZW50LnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBlLmFyZWEuaGVpZ2h0KTtcbiAgfVxuXG4gIG9uS2V5KGUpIHtcbiAgICB0aGlzLnNoaWZ0S2V5ID0gZS5zaGlmdEtleTtcbiAgfVxuXG4gIG9uTW91c2VEb3duKGUpIHtcbiAgICB0aGlzLm1vdXNlRG93biA9IHRydWU7XG5cbiAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLnRpbWVsaW5lLmdldENvbnRhaW5lclBlckVsZW1lbnQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICB0aGlzLmN1cnJlbnRDb250YWluZXIgPSBjb250YWluZXI7XG4gICAgdGhpcy5fYWRkQnJ1c2goY29udGFpbmVyKTtcblxuICAgIGxldCBuZXdMYXllcjtcbiAgICAvLyBmaW5kIHRoZSBsYXllclxuICAgIGZvciAobGV0IGxheWVyIG9mIHRoaXMubGF5ZXJzKSB7XG4gICAgICBpZiAobGF5ZXIuaGFzSXRlbShlLnRhcmdldCkpIHtcbiAgICAgICAgbmV3TGF5ZXIgPSBsYXllcjtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY3VycmVudExheWVyICYmIG5ld0xheWVyICYmIG5ld0xheWVyICE9PSB0aGlzLmN1cnJlbnRMYXllcikge1xuICAgICAgdGhpcy5jdXJyZW50TGF5ZXIudW5zZWxlY3RBbGwoKTtcbiAgICB9XG5cbiAgICBpZiAobmV3TGF5ZXIgJiYgbmV3TGF5ZXIgIT09IHRoaXMuY3VycmVudExheWVyKSB7XG4gICAgICB0aGlzLmN1cnJlbnRMYXllciA9IG5ld0xheWVyO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5jdXJyZW50TGF5ZXIpIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLnByZXZpb3VzU2VsZWN0aW9uID0gdGhpcy5jdXJyZW50TGF5ZXIuc2VsZWN0ZWRJdGVtcy5zbGljZSgwKTtcbiAgICAvLyBjcmVhdGUgYnJ1c2hcbiAgICBpZiAoIXRoaXMuc2hpZnRLZXkpIHsgdGhpcy5jdXJyZW50TGF5ZXIudW5zZWxlY3QoKTsgfVxuICB9XG5cbiAgb25Nb3VzZU1vdmUoZSkge1xuICAgIC8vIGNvbnNvbGUubG9nKGUpO1xuICAgIC8vIGlmICghdGhpcy5tb3VzZURvd24gfHzCoCF0aGlzLmN1cnJlbnRMYXllcikgeyByZXR1cm47IH1cbiAgICBpZiAoIXRoaXMubW91c2VEb3duKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgY29udGFpbmVyID0gdGhpcy50aW1lbGluZS5nZXRDb250YWluZXJQZXJFbGVtZW50KHRoaXMuY3VycmVudExheWVyKTtcbiAgICAvLyB1cGRhdGUgYnJ1c2hcbiAgICB0aGlzLl91cGRhdGVCcnVzaChlLCB0aGlzLmN1cnJlbnRDb250YWluZXIpO1xuXG4gICAgaWYgKHRoaXMuY3VycmVudExheWVyKSB7XG4gICAgICAvLyBzZWxlY3QgYWxsIGRvdHMgaW4gYXJlYVxuICAgICAgY29uc3QgaXRlbXMgPSB0aGlzLmN1cnJlbnRMYXllci5nZXRJdGVtc0luQXJlYShlLmFyZWEpO1xuICAgICAgY29uc3QgY3VycmVudFNlbGVjdGlvbiA9IHRoaXMuY3VycmVudExheWVyLnNlbGVjdGVkSXRlbXM7XG4gICAgICAvLyAxLiBzZWxlY3QgYWxsIGl0ZW1zXG4gICAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB0aGlzLmN1cnJlbnRMYXllci5zZWxlY3QoaXRlbSkpO1xuICAgICAgLy8gaGFuZGxlIHNoaWZ0IGtleVxuICAgICAgaWYgKHRoaXMuc2hpZnRLZXkpIHtcbiAgICAgICAgdGhpcy5wcmV2aW91c1NlbGVjdGlvbi5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgaWYgKGl0ZW1zLmluZGV4T2YoaXRlbSkgIT09IC0xKSB7XG4gICAgICAgICAgICAvLyAyLjEgIGlmIHRoZSBpdGVtIHdhcyBpcyBub3QgaW4gaXRlbSwgdW5zZWxlY3QgaXRcbiAgICAgICAgICAgIHRoaXMuY3VycmVudExheWVyLnVuc2VsZWN0KGl0ZW0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyAyLjIgIGVsc2Ugc2VsZWN0IGl0XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRMYXllci5zZWxlY3QoaXRlbSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gMy4gaWYgYW4gaXRlbSBvZiB0aGUgY3VycmVudCBzZWxlY3Rpb24gaXMgbm8gbW9yZSBpbiB0aGUgaXRlbXNcbiAgICAgIC8vICAgIGFuZCBpcyBub3QgaW4gcHJldmlvdXMgc2VsZWN0aW9uLCB1bnNlbGVjdCBpdFxuICAgICAgY3VycmVudFNlbGVjdGlvbi5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBpdGVtcy5pbmRleE9mKGl0ZW0pID09PSAtMSAmJlxuICAgICAgICAgIHRoaXMucHJldmlvdXNTZWxlY3Rpb24uaW5kZXhPZihpdGVtKSA9PT0gLTFcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50TGF5ZXIudW5zZWxlY3QoaXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VVcChlKSB7XG4gICAgaWYgKCF0aGlzLm1vdXNlRG93bikgeyByZXR1cm47IH1cbiAgICB0aGlzLm1vdXNlRG93biA9IGZhbHNlO1xuICAgIC8vIHJlc2V0IGJydXNoRWxlbWVudFxuICAgIHRoaXMuX3Jlc2V0QnJ1c2godGhpcy5jdXJyZW50Q29udGFpbmVyKTtcbiAgfVxuXG4gIC8vIEBOT1RFOiAnbW91c2Vkb3duJyBhbmQgJ21vdXNldXAnIGFyZSBjYWxsZWQgYmVmb3JlICdjbGljaydcbiAgb25DbGljayhlKSB7XG4gICAgaWYgKCF0aGlzLmN1cnJlbnRMYXllcikgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmN1cnJlbnRMYXllci5oYXNJdGVtKGUudGFyZ2V0KTtcbiAgICAvLyBpZiBubyBpdGVtIC0gdW5zZWxlY3QgYWxsXG4gICAgaWYgKHRoaXMucHJldmlvdXNTZWxlY3Rpb24ubGVuZ3RoICE9PSAwICYmICF0aGlzLnNoaWZ0S2V5KSB7XG4gICAgICB0aGlzLmN1cnJlbnRMYXllci51bnNlbGVjdEFsbCgpO1xuICAgIH1cblxuICAgIC8vIHRvZ2dsZSBvdGhlcndpc2VcbiAgICBpZiAoaXRlbSkge1xuICAgICAgaWYgKHRoaXMucHJldmlvdXNTZWxlY3Rpb24uaW5kZXhPZihpdGVtKSA9PT0gLTEpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50TGF5ZXIuc2VsZWN0KGl0ZW0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jdXJyZW50TGF5ZXIudW5zZWxlY3QoaXRlbSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2VsZWN0aW9uU3RhdGU7XG4iXX0=