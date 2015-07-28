"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var BaseState = _interopRequire(require("./base-state"));

var ns = _interopRequire(require("../core/namespace"));

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUFBTyxTQUFTLDJCQUFNLGNBQWM7O0lBQzdCLEVBQUUsMkJBQU0sbUJBQW1COzs7Ozs7SUFNYixjQUFjO0FBQ3RCLFdBRFEsY0FBYyxDQUNyQixRQUFRLHNCQUFzQjswQkFEdkIsY0FBYzs7QUFFL0IscUNBRmlCLGNBQWMsNkNBRXpCLFFBQVEsaUJBQWlCOztBQUUvQixRQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQzs7QUFFekIsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7QUFDMUIsUUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7QUFDdkIsUUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7R0FDdkI7O1lBVGtCLGNBQWM7O2VBQWQsY0FBYztBQVdqQyxTQUFLO2FBQUEsaUJBQUcsRUFFUDs7QUFFRCxRQUFJO2FBQUEsZ0JBQUc7QUFDTCxZQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQzs7QUFFNUMsYUFBSyxJQUFJLEVBQUUsSUFBSSxVQUFVLEVBQUU7QUFDekIsY0FBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNuQztPQUNGOztBQUVELGVBQVc7YUFBQSxxQkFBQyxDQUFDLEVBQUU7QUFDYixnQkFBUSxDQUFDLENBQUMsSUFBSTtBQUNaLGVBQUssV0FBVztBQUNkLGdCQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLGtCQUFNO0FBQUEsQUFDUixlQUFLLFdBQVc7QUFDZCxnQkFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixrQkFBTTtBQUFBLEFBQ1IsZUFBSyxTQUFTO0FBQ1osZ0JBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsa0JBQU07QUFBQSxBQUNSLGVB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LFdBQU87Ozs7YUFBQSxpQkFBQyxDQUFDLEVBQUU7QUFDVCxZQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtBQUFFLGlCQUFPO1NBQUU7O0FBRW5DLFlBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFakQsWUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDekQsY0FBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNqQzs7O0FBR0QsWUFBSSxJQUFJLEVBQUU7QUFDUixjQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDL0MsZ0JBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1dBQ2hDLE1BQU07QUFDTCxnQkFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7V0FDbEM7U0FDRjtPQUNGOzs7O1NBckxrQixjQUFjO0dBQVMsU0FBUzs7aUJBQWhDLGNBQWMiLCJmaWxlIjoiZXM2L3V0aWxzL29ydGhvZ29uYWwtZGF0YS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU3RhdGUgZnJvbSAnLi9iYXNlLXN0YXRlJztcbmltcG9ydCBucyBmcm9tICcuLi9jb3JlL25hbWVzcGFjZSc7XG5cblxuLyoqXG4gKiAgQE5PVEUgQnJva2VuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlbGVjdGlvblN0YXRlIGV4dGVuZHMgQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUgLyosIG9wdGlvbnMgPSB7fSAqLykge1xuICAgIHN1cGVyKHRpbWVsaW5lIC8qLCBvcHRpb25zICovKTtcblxuICAgIHRoaXMuY3VycmVudExheWVyID0gbnVsbDtcbiAgICAvLyBuZWVkIGEgY2FjaGVkXG4gICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gbnVsbDtcbiAgICB0aGlzLm1vdXNlRG93biA9IGZhbHNlO1xuICAgIHRoaXMuc2hpZnRLZXkgPSBmYWxzZTtcbiAgfVxuXG4gIGVudGVyKCkge1xuXG4gIH1cblxuICBleGl0KCkge1xuICAgIGNvbnN0IGNvbnRhaW5lcnMgPSB0aGlzLnRpbWVsaW5lLmNvbnRhaW5lcnM7XG5cbiAgICBmb3IgKGxldCBpZCBpbiBjb250YWluZXJzKSB7XG4gICAgICB0aGlzLl9yZW1vdmVCcnVzaChjb250YWluZXJzW2lkXSk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlRXZlbnQoZSkge1xuICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICB0aGlzLm9uTW91c2VEb3duKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XG4gICAgICAgIHRoaXMub25Nb3VzZU1vdmUoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIHRoaXMub25Nb3VzZVVwKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NsaWNrJzpcbiAgICAgICAgdGhpcy5vbkNsaWNrKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2tleWRvd24nOlxuICAgICAgICB0aGlzLm9uS2V5KGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2tleXVwJzpcbiAgICAgICAgdGhpcy5vbktleShlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgX2FkZEJydXNoKGNvbnRhaW5lcikge1xuICAgIGlmIChjb250YWluZXIuYnJ1c2hFbGVtZW50ICE9PSBudWxsKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgYnJ1c2ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdyZWN0Jyk7XG4gICAgYnJ1c2guc3R5bGUuZmlsbCA9ICcjNjg2ODY4JztcbiAgICBicnVzaC5zdHlsZS5vcGFjaXR5ID0gMC4yO1xuXG4gICAgY29udGFpbmVyLmludGVyYWN0aW9uc0VsZW1lbnQuYXBwZW5kQ2hpbGQoYnJ1c2gpO1xuICAgIGNvbnRhaW5lci5icnVzaEVsZW1lbnQgPSBicnVzaDtcbiAgfVxuXG4gIF9yZW1vdmVCcnVzaChjb250YWluZXIpIHtcbiAgICBpZiAoY29udGFpbmVyLmJydXNoRWxlbWVudCA9PT0gbnVsbCkgeyByZXR1cm47IH1cblxuICAgIHRoaXMuX3Jlc2V0QnJ1c2goY29udGFpbmVyLmJydXNoRWxlbWVudCk7XG4gICAgY29udGFpbmVyLmludGVyYWN0aW9uc0VsZW1lbnQucmVtb3ZlQ2hpbGQoY29udGFpbmVyLmJydXNoRWxlbWVudCk7XG4gICAgY29udGFpbmVyLmJydXNoRWxlbWVudCA9IG51bGw7XG4gIH1cblxuICBfcmVzZXRCcnVzaChjb250YWluZXIpIHtcbiAgICBjb25zdCBicnVzaEVsZW1lbnQgPSBjb250YWluZXIuYnJ1c2hFbGVtZW50O1xuICAgIC8vIHJlc2V0IGJydXNoIGVsZW1lbnRcbiAgICBicnVzaEVsZW1lbnQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwgMCknKTtcbiAgICBicnVzaEVsZW1lbnQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgMCk7XG4gICAgYnJ1c2hFbGVtZW50LnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCAwKTtcbiAgfVxuXG4gIF91cGRhdGVCcnVzaChlLCBjb250YWluZXIpIHtcbiAgICBjb25zdCBicnVzaEVsZW1lbnQgPSBjb250YWluZXIuYnJ1c2hFbGVtZW50O1xuICAgIGNvbnN0IHRyYW5zbGF0ZSA9IGB0cmFuc2xhdGUoJHtlLmFyZWEubGVmdH0sICR7ZS5hcmVhLnRvcH0pYDtcblxuICAgIGJydXNoRWxlbWVudC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgdHJhbnNsYXRlKTtcbiAgICBicnVzaEVsZW1lbnQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgZS5hcmVhLndpZHRoKTtcbiAgICBicnVzaEVsZW1lbnQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIGUuYXJlYS5oZWlnaHQpO1xuICB9XG5cbiAgb25LZXkoZSkge1xuICAgIHRoaXMuc2hpZnRLZXkgPSBlLnNoaWZ0S2V5O1xuICB9XG5cbiAgb25Nb3VzZURvd24oZSkge1xuICAgIHRoaXMubW91c2VEb3duID0gdHJ1ZTtcblxuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMudGltZWxpbmUuZ2V0Q29udGFpbmVyRnJvbURPTUVsZW1lbnQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICB0aGlzLmN1cnJlbnRDb250YWluZXIgPSBjb250YWluZXI7XG4gICAgdGhpcy5fYWRkQnJ1c2goY29udGFpbmVyKTtcblxuICAgIGxldCBuZXdMYXllcjtcbiAgICAvLyBmaW5kIHRoZSBsYXllclxuICAgIGZvciAobGV0IGxheWVyIG9mIHRoaXMubGF5ZXJzKSB7XG4gICAgICBpZiAobGF5ZXIuaGFzSXRlbShlLnRhcmdldCkpIHtcbiAgICAgICAgbmV3TGF5ZXIgPSBsYXllcjtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY3VycmVudExheWVyICYmIG5ld0xheWVyICYmIG5ld0xheWVyICE9PSB0aGlzLmN1cnJlbnRMYXllcikge1xuICAgICAgdGhpcy5jdXJyZW50TGF5ZXIudW5zZWxlY3RBbGwoKTtcbiAgICB9XG5cbiAgICBpZiAobmV3TGF5ZXIgJiYgbmV3TGF5ZXIgIT09IHRoaXMuY3VycmVudExheWVyKSB7XG4gICAgICB0aGlzLmN1cnJlbnRMYXllciA9IG5ld0xheWVyO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5jdXJyZW50TGF5ZXIpIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLnByZXZpb3VzU2VsZWN0aW9uID0gdGhpcy5jdXJyZW50TGF5ZXIuc2VsZWN0ZWRJdGVtcy5zbGljZSgwKTtcbiAgICAvLyBjcmVhdGUgYnJ1c2hcbiAgICBpZiAoIXRoaXMuc2hpZnRLZXkpIHsgdGhpcy5jdXJyZW50TGF5ZXIudW5zZWxlY3QoKTsgfVxuICB9XG5cbiAgb25Nb3VzZU1vdmUoZSkge1xuICAgIGlmICghdGhpcy5tb3VzZURvd24pIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLnRpbWVsaW5lLmdldENvbnRhaW5lckZyb21ET01FbGVtZW50KHRoaXMuY3VycmVudExheWVyKTtcbiAgICAvLyB1cGRhdGUgYnJ1c2hcbiAgICB0aGlzLl91cGRhdGVCcnVzaChlLCB0aGlzLmN1cnJlbnRDb250YWluZXIpO1xuXG4gICAgaWYgKHRoaXMuY3VycmVudExheWVyKSB7XG4gICAgICAvLyBzZWxlY3QgYWxsIGRvdHMgaW4gYXJlYVxuICAgICAgY29uc3QgaXRlbXMgPSB0aGlzLmN1cnJlbnRMYXllci5nZXRJdGVtc0luQXJlYShlLmFyZWEpO1xuICAgICAgY29uc3QgY3VycmVudFNlbGVjdGlvbiA9IHRoaXMuY3VycmVudExheWVyLnNlbGVjdGVkSXRlbXM7XG4gICAgICAvLyAxLiBzZWxlY3QgYWxsIGl0ZW1zXG4gICAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB0aGlzLmN1cnJlbnRMYXllci5zZWxlY3QoaXRlbSkpO1xuICAgICAgLy8gaGFuZGxlIHNoaWZ0IGtleVxuICAgICAgaWYgKHRoaXMuc2hpZnRLZXkpIHtcbiAgICAgICAgdGhpcy5wcmV2aW91c1NlbGVjdGlvbi5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgaWYgKGl0ZW1zLmluZGV4T2YoaXRlbSkgIT09IC0xKSB7XG4gICAgICAgICAgICAvLyAyLjEgIGlmIHRoZSBpdGVtIHdhcyBpcyBub3QgaW4gaXRlbSwgdW5zZWxlY3QgaXRcbiAgICAgICAgICAgIHRoaXMuY3VycmVudExheWVyLnVuc2VsZWN0KGl0ZW0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyAyLjIgIGVsc2Ugc2VsZWN0IGl0XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRMYXllci5zZWxlY3QoaXRlbSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gMy4gaWYgYW4gaXRlbSBvZiB0aGUgY3VycmVudCBzZWxlY3Rpb24gaXMgbm8gbW9yZSBpbiB0aGUgaXRlbXNcbiAgICAgIC8vICAgIGFuZCBpcyBub3QgaW4gcHJldmlvdXMgc2VsZWN0aW9uLCB1bnNlbGVjdCBpdFxuICAgICAgY3VycmVudFNlbGVjdGlvbi5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBpdGVtcy5pbmRleE9mKGl0ZW0pID09PSAtMSAmJlxuICAgICAgICAgIHRoaXMucHJldmlvdXNTZWxlY3Rpb24uaW5kZXhPZihpdGVtKSA9PT0gLTFcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50TGF5ZXIudW5zZWxlY3QoaXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VVcChlKSB7XG4gICAgaWYgKCF0aGlzLm1vdXNlRG93bikgeyByZXR1cm47IH1cbiAgICB0aGlzLm1vdXNlRG93biA9IGZhbHNlO1xuICAgIC8vIHJlc2V0IGJydXNoRWxlbWVudFxuICAgIHRoaXMuX3Jlc2V0QnJ1c2godGhpcy5jdXJyZW50Q29udGFpbmVyKTtcbiAgfVxuXG4gIC8vIEBOT1RFOiAnbW91c2Vkb3duJyBhbmQgJ21vdXNldXAnIGFyZSBjYWxsZWQgYmVmb3JlICdjbGljaydcbiAgb25DbGljayhlKSB7XG4gICAgaWYgKCF0aGlzLmN1cnJlbnRMYXllcikgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmN1cnJlbnRMYXllci5oYXNJdGVtKGUudGFyZ2V0KTtcbiAgICAvLyBpZiBubyBpdGVtIC0gdW5zZWxlY3QgYWxsXG4gICAgaWYgKHRoaXMucHJldmlvdXNTZWxlY3Rpb24ubGVuZ3RoICE9PSAwICYmICF0aGlzLnNoaWZ0S2V5KSB7XG4gICAgICB0aGlzLmN1cnJlbnRMYXllci51bnNlbGVjdEFsbCgpO1xuICAgIH1cblxuICAgIC8vIHRvZ2dsZSBvdGhlcndpc2VcbiAgICBpZiAoaXRlbSkge1xuICAgICAgaWYgKHRoaXMucHJldmlvdXNTZWxlY3Rpb24uaW5kZXhPZihpdGVtKSA9PT0gLTEpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50TGF5ZXIuc2VsZWN0KGl0ZW0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jdXJyZW50TGF5ZXIudW5zZWxlY3QoaXRlbSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=