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
        this._currentTrack = this.timeline.getTrackFromDOMElement(e.target);
        if (!this._currentTrack) {
          return;
        }

        this._addBrush(this._currentTrack);
        // const container = this.timeline.getContainerFromDOMElement(e.currentTarget);
        // this.currentContainer = container;

        // let newLayer;
        // find the layer
        // for (let layer of this.layers) {
        //   if (layer.hasItem(e.target)) {
        //     newLayer = layer;
        //     break;
        //   }
        // }

        // if (this.currentLayer && newLayer && newLayer !== this.currentLayer) {
        //   this.currentLayer.unselectAll();
        // }

        // if (newLayer && newLayer !== this.currentLayer) {
        //   this.currentLayer = newLayer;
        // }

        // if (!this.currentLayer) { return; }

        // this.previousSelection = this.currentLayer.selectedItems.slice(0);
        // // create brush
        // if (!this.shiftKey) { this.currentLayer.unselect(); }
      }
    },
    onMouseMove: {
      value: function onMouseMove(e) {
        this._updateBrush(e, this._currentTrack);

        this._currentTrack.layers.forEach(function (layer) {
          var previousSelectedItems = layer.selectedItems;
          var newSelectedItems = layer.getItemsInArea(e.area);

          // if is not pressed
          if (!e.originalEvent.shiftKey) {
            layer.unselect(previousSelectedItems);
            layer.select(newSelectedItems);
          } else {
            var toSelect = [];
            var toUnselect = [];
          }
        });

        // if (this.currentLayer) {
        //   // select all dots in area
        //   const items = this.currentLayer.getItemsInArea(e.area);
        //   const currentSelection = this.currentLayer.selectedItems;
        //   // 1. select all items
        //   items.forEach((item) => this.currentLayer.select(item));
        //   // handle shift key
        //   if (this.shiftKey) {
        //     this.previousSelection.forEach((item) => {
        //       if (items.indexOf(item) !== -1) {
        //         // 2.1  if the item was is not in item, unselect it
        //         this.currentLayer.unselect(item);
        //       } else {
        //         // 2.2  else select it
        //         this.currentLayer.select(item);
        //       }
        //     });
        //   }

        //   // 3. if an item of the current selection is no more in the items
        //   //    and is not in previous selection, unselect it
        //   currentSelection.forEach((item) => {
        //     if (
        //       items.indexOf(item) === -1 &&
        //       this.previousSelection.indexOf(item) === -1
        //     ) {
        //       this.currentLayer.unselect(item);
        //     }
        //   });
        // }
      }
    },
    onMouseUp: {
      value: function onMouseUp(e) {
        this._removeBrush(this._currentTrack);
      }
    },
    onClick: {

      // @NOTE: 'mousedown' and 'mouseup' are called before 'click'

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi90aW1lbGluZS1zdGF0ZXMvc2VsZWN0aW9uLXN0YXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0lBQU8sU0FBUywyQkFBTSxjQUFjOztJQUM3QixFQUFFLDJCQUFNLG1CQUFtQjs7Ozs7O0lBTWIsY0FBYztBQUN0QixXQURRLGNBQWMsQ0FDckIsUUFBUSxzQkFBc0I7MEJBRHZCLGNBQWM7O0FBRS9CLHFDQUZpQixjQUFjLDZDQUV6QixRQUFRLGlCQUFpQjs7QUFFL0IsUUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7O0FBRXpCLFFBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO0FBQzFCLFFBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0FBQ3ZCLFFBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0dBQ3ZCOztZQVRrQixjQUFjOztlQUFkLGNBQWM7QUFXakMsU0FBSzthQUFBLGlCQUFHLEVBRVA7O0FBRUQsUUFBSTthQUFBLGdCQUFHO0FBQ0wsWUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUM7O0FBRTVDLGFBQUssSUFBSSxFQUFFLElBQUksVUFBVSxFQUFFO0FBQ3pCLGNBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDbkM7T0FDRjs7QUFFRCxlQUFXO2FBQUEscUJBQUMsQ0FBQyxFQUFFO0FBQ2IsZ0JBQVEsQ0FBQyxDQUFDLElBQUk7QUFDWixlQUFLLFdBQVc7QUFDZCxnQkFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixrQkFBTTtBQUFBLEFBQ1IsZUFBSyxXQUFXO0FBQ2QsZ0JBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEIsa0JBQU07QUFBQSxBQUNSLGVBQUssU0FBUztBQUNaLGdCQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLGtCQUFNO0FB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LENBQUM7V0FDbEI7O0FBRUQsY0FBSSxJQUFJLEVBQUU7QUFDUixnQkFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsVUFBVSxHQUFHLFFBQVEsQ0FBQztBQUNoRixpQkFBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1dBQ3JCO1NBQ0YsQ0FBQyxDQUFDO09BQ0o7Ozs7U0E3TGtCLGNBQWM7R0FBUyxTQUFTOztpQkFBaEMsY0FBYyIsImZpbGUiOiJlczYvdGltZWxpbmUtc3RhdGVzL3NlbGVjdGlvbi1zdGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU3RhdGUgZnJvbSAnLi9iYXNlLXN0YXRlJztcbmltcG9ydCBucyBmcm9tICcuLi9jb3JlL25hbWVzcGFjZSc7XG5cblxuLyoqXG4gKiAgQE5PVEUgQnJva2VuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlbGVjdGlvblN0YXRlIGV4dGVuZHMgQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUgLyosIG9wdGlvbnMgPSB7fSAqLykge1xuICAgIHN1cGVyKHRpbWVsaW5lIC8qLCBvcHRpb25zICovKTtcblxuICAgIHRoaXMuY3VycmVudExheWVyID0gbnVsbDtcbiAgICAvLyBuZWVkIGEgY2FjaGVkXG4gICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gbnVsbDtcbiAgICB0aGlzLm1vdXNlRG93biA9IGZhbHNlO1xuICAgIHRoaXMuc2hpZnRLZXkgPSBmYWxzZTtcbiAgfVxuXG4gIGVudGVyKCkge1xuXG4gIH1cblxuICBleGl0KCkge1xuICAgIGNvbnN0IGNvbnRhaW5lcnMgPSB0aGlzLnRpbWVsaW5lLmNvbnRhaW5lcnM7XG5cbiAgICBmb3IgKGxldCBpZCBpbiBjb250YWluZXJzKSB7XG4gICAgICB0aGlzLl9yZW1vdmVCcnVzaChjb250YWluZXJzW2lkXSk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlRXZlbnQoZSkge1xuICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICB0aGlzLm9uTW91c2VEb3duKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XG4gICAgICAgIHRoaXMub25Nb3VzZU1vdmUoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIHRoaXMub25Nb3VzZVVwKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NsaWNrJzpcbiAgICAgICAgdGhpcy5vbkNsaWNrKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2tleWRvd24nOlxuICAgICAgICB0aGlzLm9uS2V5KGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2tleXVwJzpcbiAgICAgICAgdGhpcy5vbktleShlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgX2FkZEJydXNoKHRyYWNrKSB7XG4gICAgaWYgKHRyYWNrLiRicnVzaCkgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IGJydXNoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAncmVjdCcpO1xuICAgIGJydXNoLnN0eWxlLmZpbGwgPSAnIzY4Njg2OCc7XG4gICAgYnJ1c2guc3R5bGUub3BhY2l0eSA9IDAuMjtcblxuICAgIHRyYWNrLiRpbnRlcmFjdGlvbnMuYXBwZW5kQ2hpbGQoYnJ1c2gpO1xuICAgIHRyYWNrLiRicnVzaCA9IGJydXNoO1xuICB9XG5cbiAgX3JlbW92ZUJydXNoKHRyYWNrKSB7XG4gICAgaWYgKHRyYWNrLiRicnVzaCA9PT0gbnVsbCkgeyByZXR1cm47IH1cblxuICAgIHRoaXMuX3Jlc2V0QnJ1c2godHJhY2spO1xuICAgIHRyYWNrLiRpbnRlcmFjdGlvbnMucmVtb3ZlQ2hpbGQodHJhY2suJGJydXNoKTtcbiAgICBkZWxldGUgdHJhY2suJGJydXNoO1xuICB9XG5cbiAgX3Jlc2V0QnJ1c2godHJhY2spIHtcbiAgICBjb25zdCAkYnJ1c2ggPSB0cmFjay4kYnJ1c2g7XG4gICAgLy8gcmVzZXQgYnJ1c2ggZWxlbWVudFxuICAgICRicnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLCAwKScpO1xuICAgICRicnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCAwKTtcbiAgICAkYnJ1c2guc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIDApO1xuICB9XG5cbiAgX3VwZGF0ZUJydXNoKGUsIHRyYWNrKSB7XG4gICAgY29uc3QgJGJydXNoID0gdHJhY2suJGJydXNoO1xuICAgIGNvbnN0IHRyYW5zbGF0ZSA9IGB0cmFuc2xhdGUoJHtlLmFyZWEubGVmdH0sICR7ZS5hcmVhLnRvcH0pYDtcblxuICAgICRicnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgdHJhbnNsYXRlKTtcbiAgICAkYnJ1c2guc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgZS5hcmVhLndpZHRoKTtcbiAgICAkYnJ1c2guc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIGUuYXJlYS5oZWlnaHQpO1xuICB9XG5cbiAgb25LZXkoZSkge1xuICAgIHRoaXMuc2hpZnRLZXkgPSBlLnNoaWZ0S2V5O1xuICB9XG5cbiAgb25Nb3VzZURvd24oZSkge1xuICAgIHRoaXMuX2N1cnJlbnRUcmFjayA9IHRoaXMudGltZWxpbmUuZ2V0VHJhY2tGcm9tRE9NRWxlbWVudChlLnRhcmdldCk7XG4gICAgaWYgKCF0aGlzLl9jdXJyZW50VHJhY2spIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLl9hZGRCcnVzaCh0aGlzLl9jdXJyZW50VHJhY2spO1xuICAgIC8vIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMudGltZWxpbmUuZ2V0Q29udGFpbmVyRnJvbURPTUVsZW1lbnQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICAvLyB0aGlzLmN1cnJlbnRDb250YWluZXIgPSBjb250YWluZXI7XG5cblxuICAgIC8vIGxldCBuZXdMYXllcjtcbiAgICAvLyBmaW5kIHRoZSBsYXllclxuICAgIC8vIGZvciAobGV0IGxheWVyIG9mIHRoaXMubGF5ZXJzKSB7XG4gICAgLy8gICBpZiAobGF5ZXIuaGFzSXRlbShlLnRhcmdldCkpIHtcbiAgICAvLyAgICAgbmV3TGF5ZXIgPSBsYXllcjtcbiAgICAvLyAgICAgYnJlYWs7XG4gICAgLy8gICB9XG4gICAgLy8gfVxuXG4gICAgLy8gaWYgKHRoaXMuY3VycmVudExheWVyICYmIG5ld0xheWVyICYmIG5ld0xheWVyICE9PSB0aGlzLmN1cnJlbnRMYXllcikge1xuICAgIC8vICAgdGhpcy5jdXJyZW50TGF5ZXIudW5zZWxlY3RBbGwoKTtcbiAgICAvLyB9XG5cbiAgICAvLyBpZiAobmV3TGF5ZXIgJiYgbmV3TGF5ZXIgIT09IHRoaXMuY3VycmVudExheWVyKSB7XG4gICAgLy8gICB0aGlzLmN1cnJlbnRMYXllciA9IG5ld0xheWVyO1xuICAgIC8vIH1cblxuICAgIC8vIGlmICghdGhpcy5jdXJyZW50TGF5ZXIpIHsgcmV0dXJuOyB9XG5cbiAgICAvLyB0aGlzLnByZXZpb3VzU2VsZWN0aW9uID0gdGhpcy5jdXJyZW50TGF5ZXIuc2VsZWN0ZWRJdGVtcy5zbGljZSgwKTtcbiAgICAvLyAvLyBjcmVhdGUgYnJ1c2hcbiAgICAvLyBpZiAoIXRoaXMuc2hpZnRLZXkpIHsgdGhpcy5jdXJyZW50TGF5ZXIudW5zZWxlY3QoKTsgfVxuICB9XG5cbiAgb25Nb3VzZU1vdmUoZSkge1xuICAgIHRoaXMuX3VwZGF0ZUJydXNoKGUsIHRoaXMuX2N1cnJlbnRUcmFjayk7XG5cbiAgICB0aGlzLl9jdXJyZW50VHJhY2subGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB7XG4gICAgICBjb25zdCBwcmV2aW91c1NlbGVjdGVkSXRlbXMgPSBsYXllci5zZWxlY3RlZEl0ZW1zO1xuICAgICAgY29uc3QgbmV3U2VsZWN0ZWRJdGVtcyA9IGxheWVyLmdldEl0ZW1zSW5BcmVhKGUuYXJlYSk7XG5cbiAgICAgIC8vIGlmIGlzIG5vdCBwcmVzc2VkXG4gICAgICBpZiAoIWUub3JpZ2luYWxFdmVudC5zaGlmdEtleSkge1xuICAgICAgICBsYXllci51bnNlbGVjdChwcmV2aW91c1NlbGVjdGVkSXRlbXMpO1xuICAgICAgICBsYXllci5zZWxlY3QobmV3U2VsZWN0ZWRJdGVtcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB0b1NlbGVjdCA9IFtdO1xuICAgICAgICBjb25zdCB0b1Vuc2VsZWN0ID0gW107XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBpZiAodGhpcy5jdXJyZW50TGF5ZXIpIHtcbiAgICAvLyAgIC8vIHNlbGVjdCBhbGwgZG90cyBpbiBhcmVhXG4gICAgLy8gICBjb25zdCBpdGVtcyA9IHRoaXMuY3VycmVudExheWVyLmdldEl0ZW1zSW5BcmVhKGUuYXJlYSk7XG4gICAgLy8gICBjb25zdCBjdXJyZW50U2VsZWN0aW9uID0gdGhpcy5jdXJyZW50TGF5ZXIuc2VsZWN0ZWRJdGVtcztcbiAgICAvLyAgIC8vIDEuIHNlbGVjdCBhbGwgaXRlbXNcbiAgICAvLyAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHRoaXMuY3VycmVudExheWVyLnNlbGVjdChpdGVtKSk7XG4gICAgLy8gICAvLyBoYW5kbGUgc2hpZnQga2V5XG4gICAgLy8gICBpZiAodGhpcy5zaGlmdEtleSkge1xuICAgIC8vICAgICB0aGlzLnByZXZpb3VzU2VsZWN0aW9uLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAvLyAgICAgICBpZiAoaXRlbXMuaW5kZXhPZihpdGVtKSAhPT0gLTEpIHtcbiAgICAvLyAgICAgICAgIC8vIDIuMSAgaWYgdGhlIGl0ZW0gd2FzIGlzIG5vdCBpbiBpdGVtLCB1bnNlbGVjdCBpdFxuICAgIC8vICAgICAgICAgdGhpcy5jdXJyZW50TGF5ZXIudW5zZWxlY3QoaXRlbSk7XG4gICAgLy8gICAgICAgfSBlbHNlIHtcbiAgICAvLyAgICAgICAgIC8vIDIuMiAgZWxzZSBzZWxlY3QgaXRcbiAgICAvLyAgICAgICAgIHRoaXMuY3VycmVudExheWVyLnNlbGVjdChpdGVtKTtcbiAgICAvLyAgICAgICB9XG4gICAgLy8gICAgIH0pO1xuICAgIC8vICAgfVxuXG4gICAgLy8gICAvLyAzLiBpZiBhbiBpdGVtIG9mIHRoZSBjdXJyZW50IHNlbGVjdGlvbiBpcyBubyBtb3JlIGluIHRoZSBpdGVtc1xuICAgIC8vICAgLy8gICAgYW5kIGlzIG5vdCBpbiBwcmV2aW91cyBzZWxlY3Rpb24sIHVuc2VsZWN0IGl0XG4gICAgLy8gICBjdXJyZW50U2VsZWN0aW9uLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAvLyAgICAgaWYgKFxuICAgIC8vICAgICAgIGl0ZW1zLmluZGV4T2YoaXRlbSkgPT09IC0xICYmXG4gICAgLy8gICAgICAgdGhpcy5wcmV2aW91c1NlbGVjdGlvbi5pbmRleE9mKGl0ZW0pID09PSAtMVxuICAgIC8vICAgICApIHtcbiAgICAvLyAgICAgICB0aGlzLmN1cnJlbnRMYXllci51bnNlbGVjdChpdGVtKTtcbiAgICAvLyAgICAgfVxuICAgIC8vICAgfSk7XG4gICAgLy8gfVxuICB9XG5cbiAgb25Nb3VzZVVwKGUpIHtcbiAgICB0aGlzLl9yZW1vdmVCcnVzaCh0aGlzLl9jdXJyZW50VHJhY2spO1xuXG4gIH1cblxuICAvLyBATk9URTogJ21vdXNlZG93bicgYW5kICdtb3VzZXVwJyBhcmUgY2FsbGVkIGJlZm9yZSAnY2xpY2snXG4gIG9uQ2xpY2soZSkge1xuICAgIGlmICghdGhpcy5fY3VycmVudFRyYWNrKSB7IHJldHVybjsgfVxuXG4gICAgdGhpcy5fY3VycmVudFRyYWNrLmxheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgICAgbGV0IGl0ZW0gPSBsYXllci5nZXRJdGVtRnJvbURPTUVsZW1lbnQoZS50YXJnZXQpO1xuXG4gICAgICBpZiAoIWUub3JpZ2luYWxFdmVudC5zaGlmdEtleSkge1xuICAgICAgICBsYXllci51bnNlbGVjdCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbSkge1xuICAgICAgICBjb25zdCBtZXRob2QgPSBsYXllci5zZWxlY3RlZEl0ZW1zLmluZGV4T2YoaXRlbSkgIT09IC0xID8gJ3Vuc2VsZWN0JyA6ICdzZWxlY3QnO1xuICAgICAgICBsYXllclttZXRob2RdKGl0ZW0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iXX0=