"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var BaseState = _interopRequire(require("./base-state"));

var ns = _interopRequire(require("../core/namespace"));

var SelectionState = (function (_BaseState) {
  function SelectionState(timeline /*, options = {} */) {
    _classCallCheck(this, SelectionState);

    _get(_core.Object.getPrototypeOf(SelectionState.prototype), "constructor", this).call(this, timeline /*, options */);

    this.currentLayer = null;
    // need a cached
    this.selectedItems = null;
    this.mouseDown = false;
    this.shiftKey = false;

    this._layerSelectedItemsMap = new _core.Map();
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
      value: function _addBrush(track) {
        if (track.$brush) {
          return;
        }

        var brush = document.createElementNS(ns, "rect");
        brush.style.fill = "#686868";
        brush.style.opacity = 0.2;

        track.$interactions.appendChild(brush);
        track.$brush = brush;
      }
    },
    _removeBrush: {
      value: function _removeBrush(track) {
        if (track.$brush === null) {
          return;
        }

        this._resetBrush(track);
        track.$interactions.removeChild(track.$brush);
        delete track.$brush;
      }
    },
    _resetBrush: {
      value: function _resetBrush(track) {
        var $brush = track.$brush;
        // reset brush element
        $brush.setAttributeNS(null, "transform", "translate(0, 0)");
        $brush.setAttributeNS(null, "width", 0);
        $brush.setAttributeNS(null, "height", 0);
      }
    },
    _updateBrush: {
      value: function _updateBrush(e, track) {
        var $brush = track.$brush;
        var translate = "translate(" + e.area.left + ", " + e.area.top + ")";

        $brush.setAttributeNS(null, "transform", translate);
        $brush.setAttributeNS(null, "width", e.area.width);
        $brush.setAttributeNS(null, "height", e.area.height);
      }
    },
    onKey: {
      value: function onKey(e) {
        this.shiftKey = e.shiftKey;
      }
    },
    onMouseDown: {
      value: function onMouseDown(e) {
        var _this = this;

        this._currentTrack = this.timeline.getTrackFromDOMElement(e.target);
        if (!this._currentTrack) {
          return;
        }

        this._addBrush(this._currentTrack);

        // recreate the map
        this._layerSelectedItemsMap = new _core.Map();
        this._currentTrack.layers.forEach(function (layer) {
          _this._layerSelectedItemsMap.set(layer, layer.selectedItems.slice(0));
        });
      }
    },
    onMouseMove: {
      value: function onMouseMove(e) {
        var _this = this;

        this._updateBrush(e, this._currentTrack);

        this._currentTrack.layers.forEach(function (layer) {
          var currentSelection = layer.selectedItems;
          var currentItems = layer.getItemsInArea(e.area);

          // if is not pressed
          if (!e.originalEvent.shiftKey) {
            layer.unselect(currentSelection);
            layer.select(currentItems);
          } else {
            (function () {
              var toSelect = [];
              var toUnselect = [];
              // use the selection from the previous drag
              var previousSelection = _this._layerSelectedItemsMap.get(layer);
              // toUnselect = toUnselect.concat(previousSelectedItems);

              currentItems.forEach(function (item) {
                if (previousSelection.indexOf(item) === -1) {
                  toSelect.push(item);
                } else {
                  toUnselect.push(item);
                }
              });

              currentSelection.forEach(function (item) {
                if (currentItems.indexOf(item) === -1 && previousSelection.indexOf(item) === -1) {
                  toUnselect.push(item);
                }
              });

              layer.unselect(toUnselect);
              layer.select(toSelect);
            })();
          }
        });
      }
    },
    onMouseUp: {
      value: function onMouseUp(e) {
        this._removeBrush(this._currentTrack);
      }
    },
    onClick: {
      value: function onClick(e) {
        if (!this._currentTrack) {
          return;
        }

        this._currentTrack.layers.forEach(function (layer) {
          var item = layer.getItemFromDOMElement(e.target);

          if (!e.originalEvent.shiftKey) {
            layer.unselect();
          }

          if (item) {
            layer.toggleSelection(item);
          }
        });
      }
    }
  });

  return SelectionState;
})(BaseState);

module.exports = SelectionState;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUFBTyxTQUFTLDJCQUFNLGNBQWM7O0lBQzdCLEVBQUUsMkJBQU0sbUJBQW1COztJQUdiLGNBQWM7QUFDdEIsV0FEUSxjQUFjLENBQ3JCLFFBQVEsc0JBQXNCOzBCQUR2QixjQUFjOztBQUUvQixxQ0FGaUIsY0FBYyw2Q0FFekIsUUFBUSxpQkFBaUI7O0FBRS9CLFFBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDOztBQUV6QixRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztBQUMxQixRQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztBQUN2QixRQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQzs7QUFFdEIsUUFBSSxDQUFDLHNCQUFzQixHQUFHLFVBQUksR0FBRyxFQUFFLENBQUM7R0FDekM7O1lBWGtCLGNBQWM7O2VBQWQsY0FBYztBQWFqQyxTQUFLO2FBQUEsaUJBQUcsRUFFUDs7QUFFRCxRQUFJO2FBQUEsZ0JBQUc7QUFDTCxZQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQzs7QUFFNUMsYUFBSyxJQUFJLEVBQUUsSUFBSSxVQUFVLEVBQUU7QUFDekIsY0FBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNuQztPQUNGOztBQUVELGVBQVc7YUFBQSxxQkFBQyxDQUFDLEVBQUU7QUFDYixnQkFBUSxDQUFDLENBQUMsSUFBSTtBQUNaLGVBQUssV0FBVztBQUNkLGdCQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLGtCQUFNO0FBQUEsQUFDUixlQUFLLFdBQVc7QUFDZCxnQkFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixrQkFBTTtBQUFBLEFBQ1IsZUFBSyxTQUFTO0FBQ1osZ0JBQUksQ0FBQyxTQUFT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S2tCLGNBQWM7R0FBUyxTQUFTOztpQkFBaEMsY0FBYyIsImZpbGUiOiJlczYvdXRpbHMvb3J0aG9nb25hbC1kYXRhLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTdGF0ZSBmcm9tICcuL2Jhc2Utc3RhdGUnO1xuaW1wb3J0IG5zIGZyb20gJy4uL2NvcmUvbmFtZXNwYWNlJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWxlY3Rpb25TdGF0ZSBleHRlbmRzIEJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lIC8qLCBvcHRpb25zID0ge30gKi8pIHtcbiAgICBzdXBlcih0aW1lbGluZSAvKiwgb3B0aW9ucyAqLyk7XG5cbiAgICB0aGlzLmN1cnJlbnRMYXllciA9IG51bGw7XG4gICAgLy8gbmVlZCBhIGNhY2hlZFxuICAgIHRoaXMuc2VsZWN0ZWRJdGVtcyA9IG51bGw7XG4gICAgdGhpcy5tb3VzZURvd24gPSBmYWxzZTtcbiAgICB0aGlzLnNoaWZ0S2V5ID0gZmFsc2U7XG5cbiAgICB0aGlzLl9sYXllclNlbGVjdGVkSXRlbXNNYXAgPSBuZXcgTWFwKCk7XG4gIH1cblxuICBlbnRlcigpIHtcblxuICB9XG5cbiAgZXhpdCgpIHtcbiAgICBjb25zdCBjb250YWluZXJzID0gdGhpcy50aW1lbGluZS5jb250YWluZXJzO1xuXG4gICAgZm9yIChsZXQgaWQgaW4gY29udGFpbmVycykge1xuICAgICAgdGhpcy5fcmVtb3ZlQnJ1c2goY29udGFpbmVyc1tpZF0pO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUV2ZW50KGUpIHtcbiAgICBzd2l0Y2ggKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlRG93bihlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxuICAgICAgICB0aGlzLm9uTW91c2VNb3ZlKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICB0aGlzLm9uTW91c2VVcChlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjbGljayc6XG4gICAgICAgIHRoaXMub25DbGljayhlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdrZXlkb3duJzpcbiAgICAgICAgdGhpcy5vbktleShlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdrZXl1cCc6XG4gICAgICAgIHRoaXMub25LZXkoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIF9hZGRCcnVzaCh0cmFjaykge1xuICAgIGlmICh0cmFjay4kYnJ1c2gpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBicnVzaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3JlY3QnKTtcbiAgICBicnVzaC5zdHlsZS5maWxsID0gJyM2ODY4NjgnO1xuICAgIGJydXNoLnN0eWxlLm9wYWNpdHkgPSAwLjI7XG5cbiAgICB0cmFjay4kaW50ZXJhY3Rpb25zLmFwcGVuZENoaWxkKGJydXNoKTtcbiAgICB0cmFjay4kYnJ1c2ggPSBicnVzaDtcbiAgfVxuXG4gIF9yZW1vdmVCcnVzaCh0cmFjaykge1xuICAgIGlmICh0cmFjay4kYnJ1c2ggPT09IG51bGwpIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLl9yZXNldEJydXNoKHRyYWNrKTtcbiAgICB0cmFjay4kaW50ZXJhY3Rpb25zLnJlbW92ZUNoaWxkKHRyYWNrLiRicnVzaCk7XG4gICAgZGVsZXRlIHRyYWNrLiRicnVzaDtcbiAgfVxuXG4gIF9yZXNldEJydXNoKHRyYWNrKSB7XG4gICAgY29uc3QgJGJydXNoID0gdHJhY2suJGJydXNoO1xuICAgIC8vIHJlc2V0IGJydXNoIGVsZW1lbnRcbiAgICAkYnJ1c2guc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwgMCknKTtcbiAgICAkYnJ1c2guc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgMCk7XG4gICAgJGJydXNoLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCAwKTtcbiAgfVxuXG4gIF91cGRhdGVCcnVzaChlLCB0cmFjaykge1xuICAgIGNvbnN0ICRicnVzaCA9IHRyYWNrLiRicnVzaDtcbiAgICBjb25zdCB0cmFuc2xhdGUgPSBgdHJhbnNsYXRlKCR7ZS5hcmVhLmxlZnR9LCAke2UuYXJlYS50b3B9KWA7XG5cbiAgICAkYnJ1c2guc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIHRyYW5zbGF0ZSk7XG4gICAgJGJydXNoLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIGUuYXJlYS53aWR0aCk7XG4gICAgJGJydXNoLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBlLmFyZWEuaGVpZ2h0KTtcbiAgfVxuXG4gIG9uS2V5KGUpIHtcbiAgICB0aGlzLnNoaWZ0S2V5ID0gZS5zaGlmdEtleTtcbiAgfVxuXG4gIG9uTW91c2VEb3duKGUpIHtcbiAgICB0aGlzLl9jdXJyZW50VHJhY2sgPSB0aGlzLnRpbWVsaW5lLmdldFRyYWNrRnJvbURPTUVsZW1lbnQoZS50YXJnZXQpO1xuICAgIGlmICghdGhpcy5fY3VycmVudFRyYWNrKSB7IHJldHVybjsgfVxuXG4gICAgdGhpcy5fYWRkQnJ1c2godGhpcy5fY3VycmVudFRyYWNrKTtcblxuICAgIC8vIHJlY3JlYXRlIHRoZSBtYXBcbiAgICB0aGlzLl9sYXllclNlbGVjdGVkSXRlbXNNYXAgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5fY3VycmVudFRyYWNrLmxheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgICAgdGhpcy5fbGF5ZXJTZWxlY3RlZEl0ZW1zTWFwLnNldChsYXllciwgbGF5ZXIuc2VsZWN0ZWRJdGVtcy5zbGljZSgwKSk7XG4gICAgfSk7XG4gIH1cblxuICBvbk1vdXNlTW92ZShlKSB7XG4gICAgdGhpcy5fdXBkYXRlQnJ1c2goZSwgdGhpcy5fY3VycmVudFRyYWNrKTtcblxuICAgIHRoaXMuX2N1cnJlbnRUcmFjay5sYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHtcbiAgICAgIGNvbnN0IGN1cnJlbnRTZWxlY3Rpb24gPSBsYXllci5zZWxlY3RlZEl0ZW1zO1xuICAgICAgY29uc3QgY3VycmVudEl0ZW1zID0gbGF5ZXIuZ2V0SXRlbXNJbkFyZWEoZS5hcmVhKTtcblxuICAgICAgLy8gaWYgaXMgbm90IHByZXNzZWRcbiAgICAgIGlmICghZS5vcmlnaW5hbEV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgIGxheWVyLnVuc2VsZWN0KGN1cnJlbnRTZWxlY3Rpb24pO1xuICAgICAgICBsYXllci5zZWxlY3QoY3VycmVudEl0ZW1zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHRvU2VsZWN0ID0gW107XG4gICAgICAgIGNvbnN0IHRvVW5zZWxlY3QgPSBbXTtcbiAgICAgICAgLy8gdXNlIHRoZSBzZWxlY3Rpb24gZnJvbSB0aGUgcHJldmlvdXMgZHJhZ1xuICAgICAgICBjb25zdCBwcmV2aW91c1NlbGVjdGlvbiA9IHRoaXMuX2xheWVyU2VsZWN0ZWRJdGVtc01hcC5nZXQobGF5ZXIpO1xuICAgICAgICAvLyB0b1Vuc2VsZWN0ID0gdG9VbnNlbGVjdC5jb25jYXQocHJldmlvdXNTZWxlY3RlZEl0ZW1zKTtcblxuICAgICAgICBjdXJyZW50SXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgIGlmIChwcmV2aW91c1NlbGVjdGlvbi5pbmRleE9mKGl0ZW0pID09PSAtMSkge1xuICAgICAgICAgICAgdG9TZWxlY3QucHVzaChpdGVtKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdG9VbnNlbGVjdC5wdXNoKGl0ZW0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgY3VycmVudFNlbGVjdGlvbi5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgY3VycmVudEl0ZW1zLmluZGV4T2YoaXRlbSkgPT09IC0xICYmXG4gICAgICAgICAgICBwcmV2aW91c1NlbGVjdGlvbi5pbmRleE9mKGl0ZW0pID09PSAtMVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgdG9VbnNlbGVjdC5wdXNoKGl0ZW0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGF5ZXIudW5zZWxlY3QodG9VbnNlbGVjdCk7XG4gICAgICAgIGxheWVyLnNlbGVjdCh0b1NlbGVjdCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBvbk1vdXNlVXAoZSkge1xuICAgIHRoaXMuX3JlbW92ZUJydXNoKHRoaXMuX2N1cnJlbnRUcmFjayk7XG4gIH1cblxuICBvbkNsaWNrKGUpIHtcbiAgICBpZiAoIXRoaXMuX2N1cnJlbnRUcmFjaykgeyByZXR1cm47IH1cblxuICAgIHRoaXMuX2N1cnJlbnRUcmFjay5sYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHtcbiAgICAgIGxldCBpdGVtID0gbGF5ZXIuZ2V0SXRlbUZyb21ET01FbGVtZW50KGUudGFyZ2V0KTtcblxuICAgICAgaWYgKCFlLm9yaWdpbmFsRXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgICAgbGF5ZXIudW5zZWxlY3QoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgbGF5ZXIudG9nZ2xlU2VsZWN0aW9uKGl0ZW0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iXX0=