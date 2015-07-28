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
            var method = layer.selectedItems.indexOf(item) !== -1 ? "unselect" : "select";

            layer[method](item);
          }
        });
      }
    }
  });

  return SelectionState;
})(BaseState);

module.exports = SelectionState;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi90aW1lbGluZS1zdGF0ZXMvc2VsZWN0aW9uLXN0YXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0lBQU8sU0FBUywyQkFBTSxjQUFjOztJQUM3QixFQUFFLDJCQUFNLG1CQUFtQjs7SUFHYixjQUFjO0FBQ3RCLFdBRFEsY0FBYyxDQUNyQixRQUFRLHNCQUFzQjswQkFEdkIsY0FBYzs7QUFFL0IscUNBRmlCLGNBQWMsNkNBRXpCLFFBQVEsaUJBQWlCOztBQUUvQixRQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQzs7QUFFekIsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7QUFDMUIsUUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7QUFDdkIsUUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7O0FBRXRCLFFBQUksQ0FBQyxzQkFBc0IsR0FBRyxVQUFJLEdBQUcsRUFBRSxDQUFDO0dBQ3pDOztZQVhrQixjQUFjOztlQUFkLGNBQWM7QUFhakMsU0FBSzthQUFBLGlCQUFHLEVBRVA7O0FBRUQsUUFBSTthQUFBLGdCQUFHO0FBQ0wsWUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUM7O0FBRTVDLGFBQUssSUFBSSxFQUFFLElBQUksVUFBVSxFQUFFO0FBQ3pCLGNBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDbkM7T0FDRjs7QUFFRCxlQUFXO2FBQUEscUJBQUMsQ0FBQyxFQUFFO0FBQ2IsZ0JBQVEsQ0FBQyxDQUFDLElBQUk7QUFDWixlQUFLLFdBQVc7QUFDZCxnQkFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixrQkFBTTtBQUFBLEFBQ1IsZUFBSyxXQUFXO0FBQ2QsZ0JBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEIsa0JBQU07QUFBQSxBQUNSLGVBQUssU0FBUztBQUNaLGdCQUFJ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QUssQ0FBQyxDQUFDLEdBQ3JELFVBQVUsR0FBRyxRQUFRLENBQUM7O0FBRXhCLGlCQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7V0FDckI7U0FDRixDQUFDLENBQUM7T0FDSjs7OztTQXBLa0IsY0FBYztHQUFTLFNBQVM7O2lCQUFoQyxjQUFjIiwiZmlsZSI6ImVzNi90aW1lbGluZS1zdGF0ZXMvc2VsZWN0aW9uLXN0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTdGF0ZSBmcm9tICcuL2Jhc2Utc3RhdGUnO1xuaW1wb3J0IG5zIGZyb20gJy4uL2NvcmUvbmFtZXNwYWNlJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWxlY3Rpb25TdGF0ZSBleHRlbmRzIEJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lIC8qLCBvcHRpb25zID0ge30gKi8pIHtcbiAgICBzdXBlcih0aW1lbGluZSAvKiwgb3B0aW9ucyAqLyk7XG5cbiAgICB0aGlzLmN1cnJlbnRMYXllciA9IG51bGw7XG4gICAgLy8gbmVlZCBhIGNhY2hlZFxuICAgIHRoaXMuc2VsZWN0ZWRJdGVtcyA9IG51bGw7XG4gICAgdGhpcy5tb3VzZURvd24gPSBmYWxzZTtcbiAgICB0aGlzLnNoaWZ0S2V5ID0gZmFsc2U7XG5cbiAgICB0aGlzLl9sYXllclNlbGVjdGVkSXRlbXNNYXAgPSBuZXcgTWFwKCk7XG4gIH1cblxuICBlbnRlcigpIHtcblxuICB9XG5cbiAgZXhpdCgpIHtcbiAgICBjb25zdCBjb250YWluZXJzID0gdGhpcy50aW1lbGluZS5jb250YWluZXJzO1xuXG4gICAgZm9yIChsZXQgaWQgaW4gY29udGFpbmVycykge1xuICAgICAgdGhpcy5fcmVtb3ZlQnJ1c2goY29udGFpbmVyc1tpZF0pO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUV2ZW50KGUpIHtcbiAgICBzd2l0Y2ggKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlRG93bihlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxuICAgICAgICB0aGlzLm9uTW91c2VNb3ZlKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICB0aGlzLm9uTW91c2VVcChlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjbGljayc6XG4gICAgICAgIHRoaXMub25DbGljayhlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdrZXlkb3duJzpcbiAgICAgICAgdGhpcy5vbktleShlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdrZXl1cCc6XG4gICAgICAgIHRoaXMub25LZXkoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIF9hZGRCcnVzaCh0cmFjaykge1xuICAgIGlmICh0cmFjay4kYnJ1c2gpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBicnVzaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3JlY3QnKTtcbiAgICBicnVzaC5zdHlsZS5maWxsID0gJyM2ODY4NjgnO1xuICAgIGJydXNoLnN0eWxlLm9wYWNpdHkgPSAwLjI7XG5cbiAgICB0cmFjay4kaW50ZXJhY3Rpb25zLmFwcGVuZENoaWxkKGJydXNoKTtcbiAgICB0cmFjay4kYnJ1c2ggPSBicnVzaDtcbiAgfVxuXG4gIF9yZW1vdmVCcnVzaCh0cmFjaykge1xuICAgIGlmICh0cmFjay4kYnJ1c2ggPT09IG51bGwpIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLl9yZXNldEJydXNoKHRyYWNrKTtcbiAgICB0cmFjay4kaW50ZXJhY3Rpb25zLnJlbW92ZUNoaWxkKHRyYWNrLiRicnVzaCk7XG4gICAgZGVsZXRlIHRyYWNrLiRicnVzaDtcbiAgfVxuXG4gIF9yZXNldEJydXNoKHRyYWNrKSB7XG4gICAgY29uc3QgJGJydXNoID0gdHJhY2suJGJydXNoO1xuICAgIC8vIHJlc2V0IGJydXNoIGVsZW1lbnRcbiAgICAkYnJ1c2guc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwgMCknKTtcbiAgICAkYnJ1c2guc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgMCk7XG4gICAgJGJydXNoLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCAwKTtcbiAgfVxuXG4gIF91cGRhdGVCcnVzaChlLCB0cmFjaykge1xuICAgIGNvbnN0ICRicnVzaCA9IHRyYWNrLiRicnVzaDtcbiAgICBjb25zdCB0cmFuc2xhdGUgPSBgdHJhbnNsYXRlKCR7ZS5hcmVhLmxlZnR9LCAke2UuYXJlYS50b3B9KWA7XG5cbiAgICAkYnJ1c2guc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIHRyYW5zbGF0ZSk7XG4gICAgJGJydXNoLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIGUuYXJlYS53aWR0aCk7XG4gICAgJGJydXNoLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBlLmFyZWEuaGVpZ2h0KTtcbiAgfVxuXG4gIG9uS2V5KGUpIHtcbiAgICB0aGlzLnNoaWZ0S2V5ID0gZS5zaGlmdEtleTtcbiAgfVxuXG4gIG9uTW91c2VEb3duKGUpIHtcbiAgICB0aGlzLl9jdXJyZW50VHJhY2sgPSB0aGlzLnRpbWVsaW5lLmdldFRyYWNrRnJvbURPTUVsZW1lbnQoZS50YXJnZXQpO1xuICAgIGlmICghdGhpcy5fY3VycmVudFRyYWNrKSB7IHJldHVybjsgfVxuXG4gICAgdGhpcy5fYWRkQnJ1c2godGhpcy5fY3VycmVudFRyYWNrKTtcblxuICAgIC8vIHJlY3JlYXRlIHRoZSBtYXBcbiAgICB0aGlzLl9sYXllclNlbGVjdGVkSXRlbXNNYXAgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5fY3VycmVudFRyYWNrLmxheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgICAgdGhpcy5fbGF5ZXJTZWxlY3RlZEl0ZW1zTWFwLnNldChsYXllciwgbGF5ZXIuc2VsZWN0ZWRJdGVtcy5zbGljZSgwKSk7XG4gICAgfSk7XG4gIH1cblxuICBvbk1vdXNlTW92ZShlKSB7XG4gICAgdGhpcy5fdXBkYXRlQnJ1c2goZSwgdGhpcy5fY3VycmVudFRyYWNrKTtcblxuICAgIHRoaXMuX2N1cnJlbnRUcmFjay5sYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHtcbiAgICAgIGNvbnN0IGN1cnJlbnRTZWxlY3Rpb24gPSBsYXllci5zZWxlY3RlZEl0ZW1zO1xuICAgICAgY29uc3QgY3VycmVudEl0ZW1zID0gbGF5ZXIuZ2V0SXRlbXNJbkFyZWEoZS5hcmVhKTtcblxuICAgICAgLy8gaWYgaXMgbm90IHByZXNzZWRcbiAgICAgIGlmICghZS5vcmlnaW5hbEV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgIGxheWVyLnVuc2VsZWN0KGN1cnJlbnRTZWxlY3Rpb24pO1xuICAgICAgICBsYXllci5zZWxlY3QoY3VycmVudEl0ZW1zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHRvU2VsZWN0ID0gW107XG4gICAgICAgIGNvbnN0IHRvVW5zZWxlY3QgPSBbXTtcbiAgICAgICAgLy8gdXNlIHRoZSBzZWxlY3Rpb24gZnJvbSB0aGUgcHJldmlvdXMgZHJhZ1xuICAgICAgICBjb25zdCBwcmV2aW91c1NlbGVjdGlvbiA9IHRoaXMuX2xheWVyU2VsZWN0ZWRJdGVtc01hcC5nZXQobGF5ZXIpO1xuICAgICAgICAvLyB0b1Vuc2VsZWN0ID0gdG9VbnNlbGVjdC5jb25jYXQocHJldmlvdXNTZWxlY3RlZEl0ZW1zKTtcblxuICAgICAgICBjdXJyZW50SXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgIGlmIChwcmV2aW91c1NlbGVjdGlvbi5pbmRleE9mKGl0ZW0pID09PSAtMSkge1xuICAgICAgICAgICAgdG9TZWxlY3QucHVzaChpdGVtKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdG9VbnNlbGVjdC5wdXNoKGl0ZW0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgY3VycmVudFNlbGVjdGlvbi5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgY3VycmVudEl0ZW1zLmluZGV4T2YoaXRlbSkgPT09IC0xICYmXG4gICAgICAgICAgICBwcmV2aW91c1NlbGVjdGlvbi5pbmRleE9mKGl0ZW0pID09PSAtMVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgdG9VbnNlbGVjdC5wdXNoKGl0ZW0pXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBsYXllci51bnNlbGVjdCh0b1Vuc2VsZWN0KTtcbiAgICAgICAgbGF5ZXIuc2VsZWN0KHRvU2VsZWN0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG9uTW91c2VVcChlKSB7XG4gICAgdGhpcy5fcmVtb3ZlQnJ1c2godGhpcy5fY3VycmVudFRyYWNrKTtcblxuICB9XG5cbiAgb25DbGljayhlKSB7XG4gICAgaWYgKCF0aGlzLl9jdXJyZW50VHJhY2spIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLl9jdXJyZW50VHJhY2subGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB7XG4gICAgICBsZXQgaXRlbSA9IGxheWVyLmdldEl0ZW1Gcm9tRE9NRWxlbWVudChlLnRhcmdldCk7XG5cbiAgICAgIGlmICghZS5vcmlnaW5hbEV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgIGxheWVyLnVuc2VsZWN0KCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgIGNvbnN0IG1ldGhvZCA9IGxheWVyLnNlbGVjdGVkSXRlbXMuaW5kZXhPZihpdGVtKSAhPT0gLTEgP1xuICAgICAgICAgICd1bnNlbGVjdCcgOiAnc2VsZWN0JztcblxuICAgICAgICBsYXllclttZXRob2RdKGl0ZW0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iXX0=