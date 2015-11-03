'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseState = require('./base-state');

var _baseState2 = _interopRequireDefault(_baseState);

/**
 * A state to select and edit shapes in a simple way. (kind of plug n play state)
 */

var SimpleEditionState = (function (_BaseState) {
  _inherits(SimpleEditionState, _BaseState);

  function SimpleEditionState(timeline) {
    _classCallCheck(this, SimpleEditionState);

    _get(Object.getPrototypeOf(SimpleEditionState.prototype), 'constructor', this).call(this, timeline);

    this.currentEditedLayer = null;
    this.currentTarget = null;
  }

  _createClass(SimpleEditionState, [{
    key: 'enter',
    value: function enter() {}
  }, {
    key: 'exit',
    value: function exit() {}
  }, {
    key: 'handleEvent',
    value: function handleEvent(e) {
      switch (e.type) {
        case 'mousedown':
          this.onMouseDown(e);
          break;
        case 'mousemove':
          this.onMouseMove(e);
          break;
        case 'mouseup':
          this.onMouseUp(e);
          break;
      }
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(e) {
      var _this = this;

      // keep target consistent with mouse down
      this.currentTarget = e.target;

      this.layers.forEach(function (layer) {
        if (!layer.hasElement(_this.currentTarget)) {
          return;
        }

        if (!e.originalEvent.shiftKey) {
          layer.unselect();
        }

        var item = layer.getItemFromDOMElement(_this.currentTarget);

        if (item === null) {
          return;
        }

        _this.currentEditedLayer = layer;
        requestAnimationFrame(function () {
          layer.select(item);
        });
      });
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      if (!this.currentEditedLayer) {
        return;
      }

      var layer = this.currentEditedLayer;
      var items = layer.selectedItems;

      layer.edit(items, e.dx, e.dy, this.currentTarget);
      requestAnimationFrame(function () {
        layer.update(items);
      });
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(e) {
      this.currentEditedLayer = null;
    }
  }]);

  return SimpleEditionState;
})(_baseState2['default']);

exports['default'] = SimpleEditionState;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy93YXZlcy11aS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3lCQUFzQixjQUFjOzs7Ozs7OztJQU1mLGtCQUFrQjtZQUFsQixrQkFBa0I7O0FBQzFCLFdBRFEsa0JBQWtCLENBQ3pCLFFBQVEsRUFBRTswQkFESCxrQkFBa0I7O0FBRW5DLCtCQUZpQixrQkFBa0IsNkNBRTdCLFFBQVEsRUFBRTs7QUFFaEIsUUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztBQUMvQixRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztHQUMzQjs7ZUFOa0Isa0JBQWtCOztXQVFoQyxpQkFBRyxFQUFFOzs7V0FDTixnQkFBRyxFQUFFOzs7V0FFRSxxQkFBQyxDQUFDLEVBQUU7QUFDYixjQUFRLENBQUMsQ0FBQyxJQUFJO0FBQ1osYUFBSyxXQUFXO0FBQ2QsY0FBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixnQkFBTTtBQUFBLEFBQ1IsYUFBSyxXQUFXO0FBQ2QsY0FBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixnQkFBTTtBQUFBLEFBQ1IsYUFBSyxTQUFTO0FBQ1osY0FBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixnQkFBTTtBQUFBLE9BQ1Q7S0FDRjs7O1dBRVUscUJBQUMsQ0FBQyxFQUFFOzs7O0FBRWIsVUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDOztBQUU5QixVQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUssRUFBSztBQUM3QixZQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFLLGFBQWEsQ0FBQyxFQUFFO0FBQUUsaUJBQU87U0FBRTs7QUFFdEQsWUFBSSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFO0FBQzdCLGVBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUNsQjs7QUFFRCxZQUFNLElBQUksR0FBRyxLQUFLLENBQUMscUJBQXFCLENBQUMsTUFBSyxhQUFhLENBQUMsQ0FBQzs7QUFFN0QsWUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFO0FBQUUsaUJBQU87U0FBRTs7QUFFOUIsY0FBSyxrQkFBa0IsR0FBRyxLQUFLLENBQUM7QUFDaEMsNkJBQXFCLENBQUMsWUFBVztBQUFFLGVBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7U0FBRSxDQUFDLENBQUM7T0FDM0QsQ0FBQyxDQUFDO0tBQ0o7OztXQUVVLHFCQUFDLENBQUMsRUFBRTtBQUNiLFVBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUU7QUFBRSxlQUFPO09BQUU7O0FBRXpDLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztBQUN0QyxVQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDOztBQUVsQyxXQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ2xELDJCQUFxQixDQUFDLFlBQVc7QUFBRSxhQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQUUsQ0FBQyxDQUFDO0tBQzVEOzs7V0FFUSxtQkFBQyxDQUFDLEVBQUU7QUFDWCxVQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO0tBQ2hDOzs7U0F6RGtCLGtCQUFrQjs7O3FCQUFsQixrQkFBa0IiLCJmaWxlIjoic3JjL3dhdmVzLXVpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTdGF0ZSBmcm9tICcuL2Jhc2Utc3RhdGUnO1xuXG5cbi8qKlxuICogQSBzdGF0ZSB0byBzZWxlY3QgYW5kIGVkaXQgc2hhcGVzIGluIGEgc2ltcGxlIHdheS4gKGtpbmQgb2YgcGx1ZyBuIHBsYXkgc3RhdGUpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpbXBsZUVkaXRpb25TdGF0ZSBleHRlbmRzIEJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lKSB7XG4gICAgc3VwZXIodGltZWxpbmUpO1xuXG4gICAgdGhpcy5jdXJyZW50RWRpdGVkTGF5ZXIgPSBudWxsO1xuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IG51bGw7XG4gIH1cblxuICBlbnRlcigpIHt9XG4gIGV4aXQoKSB7fVxuXG4gIGhhbmRsZUV2ZW50KGUpIHtcbiAgICBzd2l0Y2ggKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlRG93bihlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxuICAgICAgICB0aGlzLm9uTW91c2VNb3ZlKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICB0aGlzLm9uTW91c2VVcChlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZURvd24oZSkge1xuICAgIC8vIGtlZXAgdGFyZ2V0IGNvbnNpc3RlbnQgd2l0aCBtb3VzZSBkb3duXG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gZS50YXJnZXQ7XG5cbiAgICB0aGlzLmxheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgICAgaWYgKCFsYXllci5oYXNFbGVtZW50KHRoaXMuY3VycmVudFRhcmdldCkpIHsgcmV0dXJuOyB9XG5cbiAgICAgIGlmICghZS5vcmlnaW5hbEV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgIGxheWVyLnVuc2VsZWN0KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGl0ZW0gPSBsYXllci5nZXRJdGVtRnJvbURPTUVsZW1lbnQodGhpcy5jdXJyZW50VGFyZ2V0KTtcblxuICAgICAgaWYgKGl0ZW0gPT09IG51bGwpIHsgcmV0dXJuOyB9XG5cbiAgICAgIHRoaXMuY3VycmVudEVkaXRlZExheWVyID0gbGF5ZXI7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7IGxheWVyLnNlbGVjdChpdGVtKTsgfSk7XG4gICAgfSk7XG4gIH1cblxuICBvbk1vdXNlTW92ZShlKSB7XG4gICAgaWYgKCF0aGlzLmN1cnJlbnRFZGl0ZWRMYXllcikgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IGxheWVyID0gdGhpcy5jdXJyZW50RWRpdGVkTGF5ZXI7XG4gICAgY29uc3QgaXRlbXMgPSBsYXllci5zZWxlY3RlZEl0ZW1zO1xuXG4gICAgbGF5ZXIuZWRpdChpdGVtcywgZS5keCwgZS5keSwgdGhpcy5jdXJyZW50VGFyZ2V0KTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7IGxheWVyLnVwZGF0ZShpdGVtcyk7IH0pO1xuICB9XG5cbiAgb25Nb3VzZVVwKGUpIHtcbiAgICB0aGlzLmN1cnJlbnRFZGl0ZWRMYXllciA9IG51bGw7XG4gIH1cbn1cbiJdfQ==