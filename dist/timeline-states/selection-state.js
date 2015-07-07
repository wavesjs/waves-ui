"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var BaseState = require("./base-state");
var ns = require("../core/namespace");

/**
 *  @NOTE Broken
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
          this._removeBrush(containers[id]);
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

        var container = this.timeline.getContainerFromDOMElement(e.currentTarget);
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

        if (!this.mouseDown) {
          return;
        }

        var container = this.timeline.getContainerFromDOMElement(this.currentLayer);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi90aW1lbGluZS1zdGF0ZXMvc2VsZWN0aW9uLXN0YXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUMxQyxJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQzs7Ozs7O0lBTWxDLGNBQWM7QUFDUCxXQURQLGNBQWMsQ0FDTixRQUFRLHNCQUFzQjswQkFEdEMsY0FBYzs7QUFFaEIscUNBRkUsY0FBYyw2Q0FFVixRQUFRLGlCQUFpQjs7QUFFL0IsUUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7O0FBRXpCLFFBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO0FBQzFCLFFBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0FBQ3ZCLFFBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0dBQ3ZCOztZQVRHLGNBQWM7O2VBQWQsY0FBYztBQVdsQixTQUFLO2FBQUEsaUJBQUcsRUFFUDs7QUFFRCxRQUFJO2FBQUEsZ0JBQUc7QUFDTCxZQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQzs7QUFFNUMsYUFBSyxJQUFJLEVBQUUsSUFBSSxVQUFVLEVBQUU7QUFDekIsY0FBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNuQztPQUNGOztBQUVELGVBQVc7YUFBQSxxQkFBQyxDQUFDLEVBQUU7QUFDYixnQkFBUSxDQUFDLENBQUMsSUFBSTtBQUNaLGVBQUssV0FBVztBQUNkLGdCQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLGtCQUFNO0FBQUEsQUFDUixlQUFLLFdBQVc7QUFDZCxnQkFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixrQkFBTTtBQUFBLEFBQ1IsZUFBSyxTQUFTO0FBQ1osZ0JBQUksQ0FB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QUMsV0FBVyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO09BQ3pDOztBQUdELFdBQU87Ozs7YUFBQSxpQkFBQyxDQUFDLEVBQUU7QUFDVCxZQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtBQUFFLGlCQUFPO1NBQUU7O0FBRW5DLFlBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFakQsWUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDekQsY0FBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNqQzs7O0FBR0QsWUFBSSxJQUFJLEVBQUU7QUFDUixjQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDL0MsZ0JBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1dBQ2hDLE1BQU07QUFDTCxnQkFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7V0FDbEM7U0FDRjtPQUNGOzs7O1NBckxHLGNBQWM7R0FBUyxTQUFTOztBQXdMdEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxjQUFjLENBQUMiLCJmaWxlIjoiZXM2L3RpbWVsaW5lLXN0YXRlcy9zZWxlY3Rpb24tc3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBCYXNlU3RhdGUgPSByZXF1aXJlKCcuL2Jhc2Utc3RhdGUnKTtcbmNvbnN0IG5zID0gcmVxdWlyZSgnLi4vY29yZS9uYW1lc3BhY2UnKTtcblxuXG4vKipcbiAqICBATk9URSBCcm9rZW5cbiAqL1xuY2xhc3MgU2VsZWN0aW9uU3RhdGUgZXh0ZW5kcyBCYXNlU3RhdGUge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSAvKiwgb3B0aW9ucyA9IHt9ICovKSB7XG4gICAgc3VwZXIodGltZWxpbmUgLyosIG9wdGlvbnMgKi8pO1xuXG4gICAgdGhpcy5jdXJyZW50TGF5ZXIgPSBudWxsO1xuICAgIC8vIG5lZWQgYSBjYWNoZWRcbiAgICB0aGlzLnNlbGVjdGVkSXRlbXMgPSBudWxsO1xuICAgIHRoaXMubW91c2VEb3duID0gZmFsc2U7XG4gICAgdGhpcy5zaGlmdEtleSA9IGZhbHNlO1xuICB9XG5cbiAgZW50ZXIoKSB7XG5cbiAgfVxuXG4gIGV4aXQoKSB7XG4gICAgY29uc3QgY29udGFpbmVycyA9IHRoaXMudGltZWxpbmUuY29udGFpbmVycztcblxuICAgIGZvciAobGV0IGlkIGluIGNvbnRhaW5lcnMpIHtcbiAgICAgIHRoaXMuX3JlbW92ZUJydXNoKGNvbnRhaW5lcnNbaWRdKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVFdmVudChlKSB7XG4gICAgc3dpdGNoIChlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ21vdXNlZG93bic6XG4gICAgICAgIHRoaXMub25Nb3VzZURvd24oZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlTW92ZShlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZXVwJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlVXAoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY2xpY2snOlxuICAgICAgICB0aGlzLm9uQ2xpY2soZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAna2V5ZG93bic6XG4gICAgICAgIHRoaXMub25LZXkoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAna2V5dXAnOlxuICAgICAgICB0aGlzLm9uS2V5KGUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBfYWRkQnJ1c2goY29udGFpbmVyKSB7XG4gICAgaWYgKGNvbnRhaW5lci5icnVzaEVsZW1lbnQgIT09IG51bGwpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBicnVzaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3JlY3QnKTtcbiAgICBicnVzaC5zdHlsZS5maWxsID0gJyM2ODY4NjgnO1xuICAgIGJydXNoLnN0eWxlLm9wYWNpdHkgPSAwLjI7XG5cbiAgICBjb250YWluZXIuaW50ZXJhY3Rpb25zRWxlbWVudC5hcHBlbmRDaGlsZChicnVzaCk7XG4gICAgY29udGFpbmVyLmJydXNoRWxlbWVudCA9IGJydXNoO1xuICB9XG5cbiAgX3JlbW92ZUJydXNoKGNvbnRhaW5lcikge1xuICAgIGlmIChjb250YWluZXIuYnJ1c2hFbGVtZW50ID09PSBudWxsKSB7IHJldHVybjsgfVxuXG4gICAgdGhpcy5fcmVzZXRCcnVzaChjb250YWluZXIuYnJ1c2hFbGVtZW50KTtcbiAgICBjb250YWluZXIuaW50ZXJhY3Rpb25zRWxlbWVudC5yZW1vdmVDaGlsZChjb250YWluZXIuYnJ1c2hFbGVtZW50KTtcbiAgICBjb250YWluZXIuYnJ1c2hFbGVtZW50ID0gbnVsbDtcbiAgfVxuXG4gIF9yZXNldEJydXNoKGNvbnRhaW5lcikge1xuICAgIGNvbnN0IGJydXNoRWxlbWVudCA9IGNvbnRhaW5lci5icnVzaEVsZW1lbnQ7XG4gICAgLy8gcmVzZXQgYnJ1c2ggZWxlbWVudFxuICAgIGJydXNoRWxlbWVudC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLCAwKScpO1xuICAgIGJydXNoRWxlbWVudC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCAwKTtcbiAgICBicnVzaEVsZW1lbnQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIDApO1xuICB9XG5cbiAgX3VwZGF0ZUJydXNoKGUsIGNvbnRhaW5lcikge1xuICAgIGNvbnN0IGJydXNoRWxlbWVudCA9IGNvbnRhaW5lci5icnVzaEVsZW1lbnQ7XG4gICAgY29uc3QgdHJhbnNsYXRlID0gYHRyYW5zbGF0ZSgke2UuYXJlYS5sZWZ0fSwgJHtlLmFyZWEudG9wfSlgO1xuXG4gICAgYnJ1c2hFbGVtZW50LnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCB0cmFuc2xhdGUpO1xuICAgIGJydXNoRWxlbWVudC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCBlLmFyZWEud2lkdGgpO1xuICAgIGJydXNoRWxlbWVudC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgZS5hcmVhLmhlaWdodCk7XG4gIH1cblxuICBvbktleShlKSB7XG4gICAgdGhpcy5zaGlmdEtleSA9IGUuc2hpZnRLZXk7XG4gIH1cblxuICBvbk1vdXNlRG93bihlKSB7XG4gICAgdGhpcy5tb3VzZURvd24gPSB0cnVlO1xuXG4gICAgY29uc3QgY29udGFpbmVyID0gdGhpcy50aW1lbGluZS5nZXRDb250YWluZXJGcm9tRE9NRWxlbWVudChlLmN1cnJlbnRUYXJnZXQpO1xuICAgIHRoaXMuY3VycmVudENvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgICB0aGlzLl9hZGRCcnVzaChjb250YWluZXIpO1xuXG4gICAgbGV0IG5ld0xheWVyO1xuICAgIC8vIGZpbmQgdGhlIGxheWVyXG4gICAgZm9yIChsZXQgbGF5ZXIgb2YgdGhpcy5sYXllcnMpIHtcbiAgICAgIGlmIChsYXllci5oYXNJdGVtKGUudGFyZ2V0KSkge1xuICAgICAgICBuZXdMYXllciA9IGxheWVyO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5jdXJyZW50TGF5ZXIgJiYgbmV3TGF5ZXIgJiYgbmV3TGF5ZXIgIT09IHRoaXMuY3VycmVudExheWVyKSB7XG4gICAgICB0aGlzLmN1cnJlbnRMYXllci51bnNlbGVjdEFsbCgpO1xuICAgIH1cblxuICAgIGlmIChuZXdMYXllciAmJiBuZXdMYXllciAhPT0gdGhpcy5jdXJyZW50TGF5ZXIpIHtcbiAgICAgIHRoaXMuY3VycmVudExheWVyID0gbmV3TGF5ZXI7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmN1cnJlbnRMYXllcikgeyByZXR1cm47IH1cblxuICAgIHRoaXMucHJldmlvdXNTZWxlY3Rpb24gPSB0aGlzLmN1cnJlbnRMYXllci5zZWxlY3RlZEl0ZW1zLnNsaWNlKDApO1xuICAgIC8vIGNyZWF0ZSBicnVzaFxuICAgIGlmICghdGhpcy5zaGlmdEtleSkgeyB0aGlzLmN1cnJlbnRMYXllci51bnNlbGVjdCgpOyB9XG4gIH1cblxuICBvbk1vdXNlTW92ZShlKSB7XG4gICAgaWYgKCF0aGlzLm1vdXNlRG93bikgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMudGltZWxpbmUuZ2V0Q29udGFpbmVyRnJvbURPTUVsZW1lbnQodGhpcy5jdXJyZW50TGF5ZXIpO1xuICAgIC8vIHVwZGF0ZSBicnVzaFxuICAgIHRoaXMuX3VwZGF0ZUJydXNoKGUsIHRoaXMuY3VycmVudENvbnRhaW5lcik7XG5cbiAgICBpZiAodGhpcy5jdXJyZW50TGF5ZXIpIHtcbiAgICAgIC8vIHNlbGVjdCBhbGwgZG90cyBpbiBhcmVhXG4gICAgICBjb25zdCBpdGVtcyA9IHRoaXMuY3VycmVudExheWVyLmdldEl0ZW1zSW5BcmVhKGUuYXJlYSk7XG4gICAgICBjb25zdCBjdXJyZW50U2VsZWN0aW9uID0gdGhpcy5jdXJyZW50TGF5ZXIuc2VsZWN0ZWRJdGVtcztcbiAgICAgIC8vIDEuIHNlbGVjdCBhbGwgaXRlbXNcbiAgICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHRoaXMuY3VycmVudExheWVyLnNlbGVjdChpdGVtKSk7XG4gICAgICAvLyBoYW5kbGUgc2hpZnQga2V5XG4gICAgICBpZiAodGhpcy5zaGlmdEtleSkge1xuICAgICAgICB0aGlzLnByZXZpb3VzU2VsZWN0aW9uLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICBpZiAoaXRlbXMuaW5kZXhPZihpdGVtKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIC8vIDIuMSAgaWYgdGhlIGl0ZW0gd2FzIGlzIG5vdCBpbiBpdGVtLCB1bnNlbGVjdCBpdFxuICAgICAgICAgICAgdGhpcy5jdXJyZW50TGF5ZXIudW5zZWxlY3QoaXRlbSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIDIuMiAgZWxzZSBzZWxlY3QgaXRcbiAgICAgICAgICAgIHRoaXMuY3VycmVudExheWVyLnNlbGVjdChpdGVtKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAvLyAzLiBpZiBhbiBpdGVtIG9mIHRoZSBjdXJyZW50IHNlbGVjdGlvbiBpcyBubyBtb3JlIGluIHRoZSBpdGVtc1xuICAgICAgLy8gICAgYW5kIGlzIG5vdCBpbiBwcmV2aW91cyBzZWxlY3Rpb24sIHVuc2VsZWN0IGl0XG4gICAgICBjdXJyZW50U2VsZWN0aW9uLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGl0ZW1zLmluZGV4T2YoaXRlbSkgPT09IC0xICYmXG4gICAgICAgICAgdGhpcy5wcmV2aW91c1NlbGVjdGlvbi5pbmRleE9mKGl0ZW0pID09PSAtMVxuICAgICAgICApIHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRMYXllci51bnNlbGVjdChpdGVtKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZVVwKGUpIHtcbiAgICBpZiAoIXRoaXMubW91c2VEb3duKSB7IHJldHVybjsgfVxuICAgIHRoaXMubW91c2VEb3duID0gZmFsc2U7XG4gICAgLy8gcmVzZXQgYnJ1c2hFbGVtZW50XG4gICAgdGhpcy5fcmVzZXRCcnVzaCh0aGlzLmN1cnJlbnRDb250YWluZXIpO1xuICB9XG5cbiAgLy8gQE5PVEU6ICdtb3VzZWRvd24nIGFuZCAnbW91c2V1cCcgYXJlIGNhbGxlZCBiZWZvcmUgJ2NsaWNrJ1xuICBvbkNsaWNrKGUpIHtcbiAgICBpZiAoIXRoaXMuY3VycmVudExheWVyKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgaXRlbSA9IHRoaXMuY3VycmVudExheWVyLmhhc0l0ZW0oZS50YXJnZXQpO1xuICAgIC8vIGlmIG5vIGl0ZW0gLSB1bnNlbGVjdCBhbGxcbiAgICBpZiAodGhpcy5wcmV2aW91c1NlbGVjdGlvbi5sZW5ndGggIT09IDAgJiYgIXRoaXMuc2hpZnRLZXkpIHtcbiAgICAgIHRoaXMuY3VycmVudExheWVyLnVuc2VsZWN0QWxsKCk7XG4gICAgfVxuXG4gICAgLy8gdG9nZ2xlIG90aGVyd2lzZVxuICAgIGlmIChpdGVtKSB7XG4gICAgICBpZiAodGhpcy5wcmV2aW91c1NlbGVjdGlvbi5pbmRleE9mKGl0ZW0pID09PSAtMSkge1xuICAgICAgICB0aGlzLmN1cnJlbnRMYXllci5zZWxlY3QoaXRlbSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmN1cnJlbnRMYXllci51bnNlbGVjdChpdGVtKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZWxlY3Rpb25TdGF0ZTtcbiJdfQ==