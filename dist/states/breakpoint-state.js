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
 * A state to interact with a breakpoint function, mimicing Max/MSP's
 * breakpoint function interactions.
 *
 * [example usage](./examples/layer-breakpint.html)
 */

var BreakpointState = (function (_BaseState) {
  _inherits(BreakpointState, _BaseState);

  function BreakpointState(timeline, datumGenerator) {
    _classCallCheck(this, BreakpointState);

    _get(Object.getPrototypeOf(BreakpointState.prototype), 'constructor', this).call(this, timeline);

    this.datumGenerator = datumGenerator;
    this.currentEditedLayer = null;
    this.currentTarget = null;
  }

  _createClass(BreakpointState, [{
    key: 'enter',
    value: function enter() {}
  }, {
    key: 'exit',
    value: function exit() {}
  }, {
    key: 'handleEvent',
    value: function handleEvent(e, hitLayers) {
      switch (e.type) {
        case 'mousedown':
          this.onMouseDown(e, hitLayers);
          break;
        case 'mousemove':
          this.onMouseMove(e, hitLayers);
          break;
        case 'mouseup':
          this.onMouseUp(e, hitLayers);
          break;
      }
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(e, hitLayers) {
      var _this = this;

      this.mouseDown = true;
      // keep target consistent with mouse down
      this.currentTarget = e.target;
      var updatedLayer = null;

      var layers = hitLayers;

      layers.forEach(function (layer) {
        layer.unselect();
        var item = layer.getItemFromDOMElement(e.target);

        if (item === null) {
          // create an item
          var time = layer.timeToPixel.invert(e.x) - _this.timeline.offset;
          var value = layer.valueToPixel.invert(layer.params.height - e.y);
          var datum = _this.datumGenerator(time, value);

          layer.data.push(datum);
          updatedLayer = layer;
        } else {
          // if shift is pressed, remove the item
          if (e.originalEvent.shiftKey) {
            var data = layer.data;
            var datum = layer.getDatumFromItem(item);
            data.splice(data.indexOf(datum), 1);

            updatedLayer = layer;
          } else {
            _this.currentEditedLayer = layer;
            layer.select(item);
          }
        }
      });

      if (updatedLayer) {
        this.timeline.tracks.render(updatedLayer);
        this.timeline.tracks.update(updatedLayer);
      }
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      var _this2 = this;

      if (!this.mouseDown || !this.currentEditedLayer) {
        return;
      }

      var layer = this.currentEditedLayer;
      var items = layer.selectedItems;
      // the loop should be in layer to match select / unselect API
      items.forEach(function (item) {
        layer.edit(item, e.dx, e.dy, _this2.currentTarget);
      });

      layer.update(items);
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(e) {
      this.currentEditedLayer = null;
      this.mouseDown = false;
    }
  }]);

  return BreakpointState;
})(_baseState2['default']);

exports['default'] = BreakpointState;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zdGF0ZXMvYnJlYWtwb2ludC1zdGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3lCQUFzQixjQUFjOzs7Ozs7Ozs7OztJQVNmLGVBQWU7WUFBZixlQUFlOztBQUN2QixXQURRLGVBQWUsQ0FDdEIsUUFBUSxFQUFFLGNBQWMsRUFBRTswQkFEbkIsZUFBZTs7QUFFaEMsK0JBRmlCLGVBQWUsNkNBRTFCLFFBQVEsRUFBRTs7QUFFaEIsUUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7QUFDckMsUUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztBQUMvQixRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztHQUMzQjs7ZUFQa0IsZUFBZTs7V0FTN0IsaUJBQUcsRUFBRTs7O1dBQ04sZ0JBQUcsRUFBRTs7O1dBRUUscUJBQUMsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUN4QixjQUFRLENBQUMsQ0FBQyxJQUFJO0FBQ1osYUFBSyxXQUFXO0FBQ2QsY0FBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDL0IsZ0JBQU07QUFBQSxBQUNSLGFBQUssV0FBVztBQUNkLGNBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQy9CLGdCQUFNO0FBQUEsQUFDUixhQUFLLFNBQVM7QUFDWixjQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUM3QixnQkFBTTtBQUFBLE9BQ1Q7S0FDRjs7O1dBRVUscUJBQUMsQ0FBQyxFQUFFLFNBQVMsRUFBRTs7O0FBQ3hCLFVBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDOztBQUV0QixVQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDOUIsVUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDOztBQUV4QixVQUFNLE1BQU0sR0FBRyxTQUFTLENBQUM7O0FBRXpCLFlBQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLLEVBQUs7QUFDeEIsYUFBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ2pCLFlBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRW5ELFlBQUksSUFBSSxLQUFLLElBQUksRUFBRTs7QUFFakIsY0FBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQUssUUFBUSxDQUFDLE1BQU0sQ0FBQztBQUNsRSxjQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkUsY0FBTSxLQUFLLEdBQUcsTUFBSyxjQUFjLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUUvQyxlQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN2QixzQkFBWSxHQUFHLEtBQUssQ0FBQztTQUN0QixNQUFNOztBQUVMLGNBQUksQ0FBQyxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUU7QUFDNUIsZ0JBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7QUFDeEIsZ0JBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMzQyxnQkFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUVwQyx3QkFBWSxHQUFHLEtBQUssQ0FBQztXQUN0QixNQUFNO0FBQ0wsa0JBQUssa0JBQWtCLEdBQUcsS0FBSyxDQUFDO0FBQ2hDLGlCQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1dBQ3BCO1NBQ0Y7T0FDRixDQUFDLENBQUM7O0FBRUgsVUFBSSxZQUFZLEVBQUU7QUFDaEIsWUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzFDLFlBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztPQUMzQztLQUNGOzs7V0FFVSxxQkFBQyxDQUFDLEVBQUU7OztBQUNiLFVBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFO0FBQUUsZUFBTztPQUFFOztBQUU1RCxVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUM7QUFDdEMsVUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQzs7QUFFbEMsV0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSztBQUN0QixhQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsT0FBSyxhQUFhLENBQUMsQ0FBQztPQUNsRCxDQUFDLENBQUM7O0FBRUgsV0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNyQjs7O1dBRVEsbUJBQUMsQ0FBQyxFQUFFO0FBQ1gsVUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztBQUMvQixVQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztLQUN4Qjs7O1NBbkZrQixlQUFlOzs7cUJBQWYsZUFBZSIsImZpbGUiOiJzcmMvc3RhdGVzL2JyZWFrcG9pbnQtc3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVN0YXRlIGZyb20gJy4vYmFzZS1zdGF0ZSc7XG5cblxuLyoqXG4gKiBBIHN0YXRlIHRvIGludGVyYWN0IHdpdGggYSBicmVha3BvaW50IGZ1bmN0aW9uLCBtaW1pY2luZyBNYXgvTVNQJ3NcbiAqIGJyZWFrcG9pbnQgZnVuY3Rpb24gaW50ZXJhY3Rpb25zLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLWJyZWFrcGludC5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCcmVha3BvaW50U3RhdGUgZXh0ZW5kcyBCYXNlU3RhdGUge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSwgZGF0dW1HZW5lcmF0b3IpIHtcbiAgICBzdXBlcih0aW1lbGluZSk7XG5cbiAgICB0aGlzLmRhdHVtR2VuZXJhdG9yID0gZGF0dW1HZW5lcmF0b3I7XG4gICAgdGhpcy5jdXJyZW50RWRpdGVkTGF5ZXIgPSBudWxsO1xuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IG51bGw7XG4gIH1cblxuICBlbnRlcigpIHt9XG4gIGV4aXQoKSB7fVxuXG4gIGhhbmRsZUV2ZW50KGUsIGhpdExheWVycykge1xuICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICB0aGlzLm9uTW91c2VEb3duKGUsIGhpdExheWVycyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlTW92ZShlLCBoaXRMYXllcnMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICB0aGlzLm9uTW91c2VVcChlLCBoaXRMYXllcnMpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBvbk1vdXNlRG93bihlLCBoaXRMYXllcnMpIHtcbiAgICB0aGlzLm1vdXNlRG93biA9IHRydWU7XG4gICAgLy8ga2VlcCB0YXJnZXQgY29uc2lzdGVudCB3aXRoIG1vdXNlIGRvd25cbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBlLnRhcmdldDtcbiAgICBsZXQgdXBkYXRlZExheWVyID0gbnVsbDtcblxuICAgIGNvbnN0IGxheWVycyA9IGhpdExheWVycztcblxuICAgIGxheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgICAgbGF5ZXIudW5zZWxlY3QoKTtcbiAgICAgIGNvbnN0IGl0ZW0gPSBsYXllci5nZXRJdGVtRnJvbURPTUVsZW1lbnQoZS50YXJnZXQpO1xuXG4gICAgICBpZiAoaXRlbSA9PT0gbnVsbCkge1xuICAgICAgICAvLyBjcmVhdGUgYW4gaXRlbVxuICAgICAgICBjb25zdCB0aW1lID0gbGF5ZXIudGltZVRvUGl4ZWwuaW52ZXJ0KGUueCkgLSB0aGlzLnRpbWVsaW5lLm9mZnNldDtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBsYXllci52YWx1ZVRvUGl4ZWwuaW52ZXJ0KGxheWVyLnBhcmFtcy5oZWlnaHQgLSBlLnkpO1xuICAgICAgICBjb25zdCBkYXR1bSA9IHRoaXMuZGF0dW1HZW5lcmF0b3IodGltZSwgdmFsdWUpO1xuXG4gICAgICAgIGxheWVyLmRhdGEucHVzaChkYXR1bSk7XG4gICAgICAgIHVwZGF0ZWRMYXllciA9IGxheWVyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gaWYgc2hpZnQgaXMgcHJlc3NlZCwgcmVtb3ZlIHRoZSBpdGVtXG4gICAgICAgIGlmIChlLm9yaWdpbmFsRXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgICAgICBjb25zdCBkYXRhID0gbGF5ZXIuZGF0YTtcbiAgICAgICAgICBjb25zdCBkYXR1bSA9IGxheWVyLmdldERhdHVtRnJvbUl0ZW0oaXRlbSk7XG4gICAgICAgICAgZGF0YS5zcGxpY2UoZGF0YS5pbmRleE9mKGRhdHVtKSwgMSk7XG5cbiAgICAgICAgICB1cGRhdGVkTGF5ZXIgPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRFZGl0ZWRMYXllciA9IGxheWVyO1xuICAgICAgICAgIGxheWVyLnNlbGVjdChpdGVtKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHVwZGF0ZWRMYXllcikge1xuICAgICAgdGhpcy50aW1lbGluZS50cmFja3MucmVuZGVyKHVwZGF0ZWRMYXllcik7XG4gICAgICB0aGlzLnRpbWVsaW5lLnRyYWNrcy51cGRhdGUodXBkYXRlZExheWVyKTtcbiAgICB9XG4gIH1cblxuICBvbk1vdXNlTW92ZShlKSB7XG4gICAgaWYgKCF0aGlzLm1vdXNlRG93biB8fMKgIXRoaXMuY3VycmVudEVkaXRlZExheWVyKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgbGF5ZXIgPSB0aGlzLmN1cnJlbnRFZGl0ZWRMYXllcjtcbiAgICBjb25zdCBpdGVtcyA9IGxheWVyLnNlbGVjdGVkSXRlbXM7XG4gICAgLy8gdGhlIGxvb3Agc2hvdWxkIGJlIGluIGxheWVyIHRvIG1hdGNoIHNlbGVjdCAvIHVuc2VsZWN0IEFQSVxuICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGxheWVyLmVkaXQoaXRlbSwgZS5keCwgZS5keSwgdGhpcy5jdXJyZW50VGFyZ2V0KTtcbiAgICB9KTtcblxuICAgIGxheWVyLnVwZGF0ZShpdGVtcyk7XG4gIH1cblxuICBvbk1vdXNlVXAoZSkge1xuICAgIHRoaXMuY3VycmVudEVkaXRlZExheWVyID0gbnVsbDtcbiAgICB0aGlzLm1vdXNlRG93biA9IGZhbHNlO1xuICB9XG59XG4iXX0=