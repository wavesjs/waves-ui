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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zdGF0ZXMvc2ltcGxlLWVkaXRpb24tc3RhdGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFBc0IsY0FBYzs7Ozs7Ozs7SUFNZixrQkFBa0I7WUFBbEIsa0JBQWtCOztBQUMxQixXQURRLGtCQUFrQixDQUN6QixRQUFRLEVBQUU7MEJBREgsa0JBQWtCOztBQUVuQywrQkFGaUIsa0JBQWtCLDZDQUU3QixRQUFRLEVBQUU7O0FBRWhCLFFBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7QUFDL0IsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7R0FDM0I7O2VBTmtCLGtCQUFrQjs7V0FRaEMsaUJBQUcsRUFBRTs7O1dBQ04sZ0JBQUcsRUFBRTs7O1dBRUUscUJBQUMsQ0FBQyxFQUFFO0FBQ2IsY0FBUSxDQUFDLENBQUMsSUFBSTtBQUNaLGFBQUssV0FBVztBQUNkLGNBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEIsZ0JBQU07QUFBQSxBQUNSLGFBQUssV0FBVztBQUNkLGNBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEIsZ0JBQU07QUFBQSxBQUNSLGFBQUssU0FBUztBQUNaLGNBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsZ0JBQU07QUFBQSxPQUNUO0tBQ0Y7OztXQUVVLHFCQUFDLENBQUMsRUFBRTs7OztBQUViLFVBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQzs7QUFFOUIsVUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLLEVBQUs7QUFDN0IsWUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBSyxhQUFhLENBQUMsRUFBRTtBQUFFLGlCQUFPO1NBQUU7O0FBRXRELFlBQUksQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRTtBQUM3QixlQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDbEI7O0FBRUQsWUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLHFCQUFxQixDQUFDLE1BQUssYUFBYSxDQUFDLENBQUM7O0FBRTdELFlBQUksSUFBSSxLQUFLLElBQUksRUFBRTtBQUFFLGlCQUFPO1NBQUU7O0FBRTlCLGNBQUssa0JBQWtCLEdBQUcsS0FBSyxDQUFDO0FBQ2hDLDZCQUFxQixDQUFDLFlBQVc7QUFBRSxlQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQUUsQ0FBQyxDQUFDO09BQzNELENBQUMsQ0FBQztLQUNKOzs7V0FFVSxxQkFBQyxDQUFDLEVBQUU7QUFDYixVQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFO0FBQUUsZUFBTztPQUFFOztBQUV6QyxVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUM7QUFDdEMsVUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQzs7QUFFbEMsV0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNsRCwyQkFBcUIsQ0FBQyxZQUFXO0FBQUUsYUFBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUFFLENBQUMsQ0FBQztLQUM1RDs7O1dBRVEsbUJBQUMsQ0FBQyxFQUFFO0FBQ1gsVUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztLQUNoQzs7O1NBekRrQixrQkFBa0I7OztxQkFBbEIsa0JBQWtCIiwiZmlsZSI6InNyYy9zdGF0ZXMvc2ltcGxlLWVkaXRpb24tc3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVN0YXRlIGZyb20gJy4vYmFzZS1zdGF0ZSc7XG5cblxuLyoqXG4gKiBBIHN0YXRlIHRvIHNlbGVjdCBhbmQgZWRpdCBzaGFwZXMgaW4gYSBzaW1wbGUgd2F5LiAoa2luZCBvZiBwbHVnIG4gcGxheSBzdGF0ZSlcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2ltcGxlRWRpdGlvblN0YXRlIGV4dGVuZHMgQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUpIHtcbiAgICBzdXBlcih0aW1lbGluZSk7XG5cbiAgICB0aGlzLmN1cnJlbnRFZGl0ZWRMYXllciA9IG51bGw7XG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gbnVsbDtcbiAgfVxuXG4gIGVudGVyKCkge31cbiAgZXhpdCgpIHt9XG5cbiAgaGFuZGxlRXZlbnQoZSkge1xuICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICB0aGlzLm9uTW91c2VEb3duKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XG4gICAgICAgIHRoaXMub25Nb3VzZU1vdmUoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIHRoaXMub25Nb3VzZVVwKGUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBvbk1vdXNlRG93bihlKSB7XG4gICAgLy8ga2VlcCB0YXJnZXQgY29uc2lzdGVudCB3aXRoIG1vdXNlIGRvd25cbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBlLnRhcmdldDtcblxuICAgIHRoaXMubGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB7XG4gICAgICBpZiAoIWxheWVyLmhhc0VsZW1lbnQodGhpcy5jdXJyZW50VGFyZ2V0KSkgeyByZXR1cm47IH1cblxuICAgICAgaWYgKCFlLm9yaWdpbmFsRXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgICAgbGF5ZXIudW5zZWxlY3QoKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgaXRlbSA9IGxheWVyLmdldEl0ZW1Gcm9tRE9NRWxlbWVudCh0aGlzLmN1cnJlbnRUYXJnZXQpO1xuXG4gICAgICBpZiAoaXRlbSA9PT0gbnVsbCkgeyByZXR1cm47IH1cblxuICAgICAgdGhpcy5jdXJyZW50RWRpdGVkTGF5ZXIgPSBsYXllcjtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpIHsgbGF5ZXIuc2VsZWN0KGl0ZW0pOyB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIG9uTW91c2VNb3ZlKGUpIHtcbiAgICBpZiAoIXRoaXMuY3VycmVudEVkaXRlZExheWVyKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgbGF5ZXIgPSB0aGlzLmN1cnJlbnRFZGl0ZWRMYXllcjtcbiAgICBjb25zdCBpdGVtcyA9IGxheWVyLnNlbGVjdGVkSXRlbXM7XG5cbiAgICBsYXllci5lZGl0KGl0ZW1zLCBlLmR4LCBlLmR5LCB0aGlzLmN1cnJlbnRUYXJnZXQpO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpIHsgbGF5ZXIudXBkYXRlKGl0ZW1zKTsgfSk7XG4gIH1cblxuICBvbk1vdXNlVXAoZSkge1xuICAgIHRoaXMuY3VycmVudEVkaXRlZExheWVyID0gbnVsbDtcbiAgfVxufVxuIl19