'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _baseState = require('./base-state');

var _baseState2 = _interopRequireDefault(_baseState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A state to interact with a breakpoint function, mimicing Max/MSP's
 * breakpoint function interactions.
 *
 * [example usage](./examples/layer-breakpint.html)
 */
var BreakpointState = function (_BaseState) {
  (0, _inherits3.default)(BreakpointState, _BaseState);

  function BreakpointState(timeline, datumGenerator) {
    (0, _classCallCheck3.default)(this, BreakpointState);

    var _this = (0, _possibleConstructorReturn3.default)(this, (BreakpointState.__proto__ || (0, _getPrototypeOf2.default)(BreakpointState)).call(this, timeline));

    _this.datumGenerator = datumGenerator;
    _this.currentEditedLayer = null;
    _this.currentTarget = null;
    return _this;
  }

  (0, _createClass3.default)(BreakpointState, [{
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
      var _this2 = this;

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
          var time = layer.timeToPixel.invert(e.x) - _this2.timeline.offset;
          var value = layer.valueToPixel.invert(layer.params.height - e.y);
          var datum = _this2.datumGenerator(time, value);

          layer.data.push(datum);
          updatedLayer = layer;
        } else {
          // if shift is pressed, remove the item
          if (e.originalEvent.shiftKey) {
            var data = layer.data;
            var _datum = layer.getDatumFromItem(item);
            data.splice(data.indexOf(_datum), 1);

            updatedLayer = layer;
          } else {
            _this2.currentEditedLayer = layer;
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
      var _this3 = this;

      if (!this.mouseDown || !this.currentEditedLayer) {
        return;
      }

      var layer = this.currentEditedLayer;
      var items = layer.selectedItems;
      // the loop should be in layer to match select / unselect API
      items.forEach(function (item) {
        layer.edit(item, e.dx, e.dy, _this3.currentTarget);
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
}(_baseState2.default);

exports.default = BreakpointState;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJyZWFrcG9pbnQtc3RhdGUuanMiXSwibmFtZXMiOlsiQnJlYWtwb2ludFN0YXRlIiwidGltZWxpbmUiLCJkYXR1bUdlbmVyYXRvciIsImN1cnJlbnRFZGl0ZWRMYXllciIsImN1cnJlbnRUYXJnZXQiLCJlIiwiaGl0TGF5ZXJzIiwidHlwZSIsIm9uTW91c2VEb3duIiwib25Nb3VzZU1vdmUiLCJvbk1vdXNlVXAiLCJtb3VzZURvd24iLCJ0YXJnZXQiLCJ1cGRhdGVkTGF5ZXIiLCJsYXllcnMiLCJmb3JFYWNoIiwibGF5ZXIiLCJ1bnNlbGVjdCIsIml0ZW0iLCJnZXRJdGVtRnJvbURPTUVsZW1lbnQiLCJ0aW1lIiwidGltZVRvUGl4ZWwiLCJpbnZlcnQiLCJ4Iiwib2Zmc2V0IiwidmFsdWUiLCJ2YWx1ZVRvUGl4ZWwiLCJwYXJhbXMiLCJoZWlnaHQiLCJ5IiwiZGF0dW0iLCJkYXRhIiwicHVzaCIsIm9yaWdpbmFsRXZlbnQiLCJzaGlmdEtleSIsImdldERhdHVtRnJvbUl0ZW0iLCJzcGxpY2UiLCJpbmRleE9mIiwic2VsZWN0IiwidHJhY2tzIiwicmVuZGVyIiwidXBkYXRlIiwiaXRlbXMiLCJzZWxlY3RlZEl0ZW1zIiwiZWRpdCIsImR4IiwiZHkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztBQUdBOzs7Ozs7SUFNcUJBLGU7OztBQUNuQiwyQkFBWUMsUUFBWixFQUFzQkMsY0FBdEIsRUFBc0M7QUFBQTs7QUFBQSx3SkFDOUJELFFBRDhCOztBQUdwQyxVQUFLQyxjQUFMLEdBQXNCQSxjQUF0QjtBQUNBLFVBQUtDLGtCQUFMLEdBQTBCLElBQTFCO0FBQ0EsVUFBS0MsYUFBTCxHQUFxQixJQUFyQjtBQUxvQztBQU1yQzs7Ozs0QkFFTyxDQUFFOzs7MkJBQ0gsQ0FBRTs7O2dDQUVHQyxDLEVBQUdDLFMsRUFBVztBQUN4QixjQUFRRCxFQUFFRSxJQUFWO0FBQ0UsYUFBSyxXQUFMO0FBQ0UsZUFBS0MsV0FBTCxDQUFpQkgsQ0FBakIsRUFBb0JDLFNBQXBCO0FBQ0E7QUFDRixhQUFLLFdBQUw7QUFDRSxlQUFLRyxXQUFMLENBQWlCSixDQUFqQixFQUFvQkMsU0FBcEI7QUFDQTtBQUNGLGFBQUssU0FBTDtBQUNFLGVBQUtJLFNBQUwsQ0FBZUwsQ0FBZixFQUFrQkMsU0FBbEI7QUFDQTtBQVRKO0FBV0Q7OztnQ0FFV0QsQyxFQUFHQyxTLEVBQVc7QUFBQTs7QUFDeEIsV0FBS0ssU0FBTCxHQUFpQixJQUFqQjtBQUNBO0FBQ0EsV0FBS1AsYUFBTCxHQUFxQkMsRUFBRU8sTUFBdkI7QUFDQSxVQUFJQyxlQUFlLElBQW5COztBQUVBLFVBQU1DLFNBQVNSLFNBQWY7O0FBRUFRLGFBQU9DLE9BQVAsQ0FBZSxVQUFDQyxLQUFELEVBQVc7QUFDeEJBLGNBQU1DLFFBQU47QUFDQSxZQUFNQyxPQUFPRixNQUFNRyxxQkFBTixDQUE0QmQsRUFBRU8sTUFBOUIsQ0FBYjs7QUFFQSxZQUFJTSxTQUFTLElBQWIsRUFBbUI7QUFDakI7QUFDQSxjQUFNRSxPQUFPSixNQUFNSyxXQUFOLENBQWtCQyxNQUFsQixDQUF5QmpCLEVBQUVrQixDQUEzQixJQUFnQyxPQUFLdEIsUUFBTCxDQUFjdUIsTUFBM0Q7QUFDQSxjQUFNQyxRQUFRVCxNQUFNVSxZQUFOLENBQW1CSixNQUFuQixDQUEwQk4sTUFBTVcsTUFBTixDQUFhQyxNQUFiLEdBQXNCdkIsRUFBRXdCLENBQWxELENBQWQ7QUFDQSxjQUFNQyxRQUFRLE9BQUs1QixjQUFMLENBQW9Ca0IsSUFBcEIsRUFBMEJLLEtBQTFCLENBQWQ7O0FBRUFULGdCQUFNZSxJQUFOLENBQVdDLElBQVgsQ0FBZ0JGLEtBQWhCO0FBQ0FqQix5QkFBZUcsS0FBZjtBQUNELFNBUkQsTUFRTztBQUNMO0FBQ0EsY0FBSVgsRUFBRTRCLGFBQUYsQ0FBZ0JDLFFBQXBCLEVBQThCO0FBQzVCLGdCQUFNSCxPQUFPZixNQUFNZSxJQUFuQjtBQUNBLGdCQUFNRCxTQUFRZCxNQUFNbUIsZ0JBQU4sQ0FBdUJqQixJQUF2QixDQUFkO0FBQ0FhLGlCQUFLSyxNQUFMLENBQVlMLEtBQUtNLE9BQUwsQ0FBYVAsTUFBYixDQUFaLEVBQWlDLENBQWpDOztBQUVBakIsMkJBQWVHLEtBQWY7QUFDRCxXQU5ELE1BTU87QUFDTCxtQkFBS2Isa0JBQUwsR0FBMEJhLEtBQTFCO0FBQ0FBLGtCQUFNc0IsTUFBTixDQUFhcEIsSUFBYjtBQUNEO0FBQ0Y7QUFDRixPQXpCRDs7QUEyQkEsVUFBSUwsWUFBSixFQUFrQjtBQUNoQixhQUFLWixRQUFMLENBQWNzQyxNQUFkLENBQXFCQyxNQUFyQixDQUE0QjNCLFlBQTVCO0FBQ0EsYUFBS1osUUFBTCxDQUFjc0MsTUFBZCxDQUFxQkUsTUFBckIsQ0FBNEI1QixZQUE1QjtBQUNEO0FBQ0Y7OztnQ0FFV1IsQyxFQUFHO0FBQUE7O0FBQ2IsVUFBSSxDQUFDLEtBQUtNLFNBQU4sSUFBbUIsQ0FBQyxLQUFLUixrQkFBN0IsRUFBaUQ7QUFBRTtBQUFTOztBQUU1RCxVQUFNYSxRQUFRLEtBQUtiLGtCQUFuQjtBQUNBLFVBQU11QyxRQUFRMUIsTUFBTTJCLGFBQXBCO0FBQ0E7QUFDQUQsWUFBTTNCLE9BQU4sQ0FBYyxVQUFDRyxJQUFELEVBQVU7QUFDdEJGLGNBQU00QixJQUFOLENBQVcxQixJQUFYLEVBQWlCYixFQUFFd0MsRUFBbkIsRUFBdUJ4QyxFQUFFeUMsRUFBekIsRUFBNkIsT0FBSzFDLGFBQWxDO0FBQ0QsT0FGRDs7QUFJQVksWUFBTXlCLE1BQU4sQ0FBYUMsS0FBYjtBQUNEOzs7OEJBRVNyQyxDLEVBQUc7QUFDWCxXQUFLRixrQkFBTCxHQUEwQixJQUExQjtBQUNBLFdBQUtRLFNBQUwsR0FBaUIsS0FBakI7QUFDRDs7Ozs7a0JBbkZrQlgsZSIsImZpbGUiOiJicmVha3BvaW50LXN0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTdGF0ZSBmcm9tICcuL2Jhc2Utc3RhdGUnO1xuXG5cbi8qKlxuICogQSBzdGF0ZSB0byBpbnRlcmFjdCB3aXRoIGEgYnJlYWtwb2ludCBmdW5jdGlvbiwgbWltaWNpbmcgTWF4L01TUCdzXG4gKiBicmVha3BvaW50IGZ1bmN0aW9uIGludGVyYWN0aW9ucy5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1icmVha3BpbnQuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnJlYWtwb2ludFN0YXRlIGV4dGVuZHMgQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUsIGRhdHVtR2VuZXJhdG9yKSB7XG4gICAgc3VwZXIodGltZWxpbmUpO1xuXG4gICAgdGhpcy5kYXR1bUdlbmVyYXRvciA9IGRhdHVtR2VuZXJhdG9yO1xuICAgIHRoaXMuY3VycmVudEVkaXRlZExheWVyID0gbnVsbDtcbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBudWxsO1xuICB9XG5cbiAgZW50ZXIoKSB7fVxuICBleGl0KCkge31cblxuICBoYW5kbGVFdmVudChlLCBoaXRMYXllcnMpIHtcbiAgICBzd2l0Y2ggKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlRG93bihlLCBoaXRMYXllcnMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XG4gICAgICAgIHRoaXMub25Nb3VzZU1vdmUoZSwgaGl0TGF5ZXJzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZXVwJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlVXAoZSwgaGl0TGF5ZXJzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZURvd24oZSwgaGl0TGF5ZXJzKSB7XG4gICAgdGhpcy5tb3VzZURvd24gPSB0cnVlO1xuICAgIC8vIGtlZXAgdGFyZ2V0IGNvbnNpc3RlbnQgd2l0aCBtb3VzZSBkb3duXG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gZS50YXJnZXQ7XG4gICAgbGV0IHVwZGF0ZWRMYXllciA9IG51bGw7XG5cbiAgICBjb25zdCBsYXllcnMgPSBoaXRMYXllcnM7XG5cbiAgICBsYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHtcbiAgICAgIGxheWVyLnVuc2VsZWN0KCk7XG4gICAgICBjb25zdCBpdGVtID0gbGF5ZXIuZ2V0SXRlbUZyb21ET01FbGVtZW50KGUudGFyZ2V0KTtcblxuICAgICAgaWYgKGl0ZW0gPT09IG51bGwpIHtcbiAgICAgICAgLy8gY3JlYXRlIGFuIGl0ZW1cbiAgICAgICAgY29uc3QgdGltZSA9IGxheWVyLnRpbWVUb1BpeGVsLmludmVydChlLngpIC0gdGhpcy50aW1lbGluZS5vZmZzZXQ7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gbGF5ZXIudmFsdWVUb1BpeGVsLmludmVydChsYXllci5wYXJhbXMuaGVpZ2h0IC0gZS55KTtcbiAgICAgICAgY29uc3QgZGF0dW0gPSB0aGlzLmRhdHVtR2VuZXJhdG9yKHRpbWUsIHZhbHVlKTtcblxuICAgICAgICBsYXllci5kYXRhLnB1c2goZGF0dW0pO1xuICAgICAgICB1cGRhdGVkTGF5ZXIgPSBsYXllcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGlmIHNoaWZ0IGlzIHByZXNzZWQsIHJlbW92ZSB0aGUgaXRlbVxuICAgICAgICBpZiAoZS5vcmlnaW5hbEV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgICAgY29uc3QgZGF0YSA9IGxheWVyLmRhdGE7XG4gICAgICAgICAgY29uc3QgZGF0dW0gPSBsYXllci5nZXREYXR1bUZyb21JdGVtKGl0ZW0pO1xuICAgICAgICAgIGRhdGEuc3BsaWNlKGRhdGEuaW5kZXhPZihkYXR1bSksIDEpO1xuXG4gICAgICAgICAgdXBkYXRlZExheWVyID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50RWRpdGVkTGF5ZXIgPSBsYXllcjtcbiAgICAgICAgICBsYXllci5zZWxlY3QoaXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh1cGRhdGVkTGF5ZXIpIHtcbiAgICAgIHRoaXMudGltZWxpbmUudHJhY2tzLnJlbmRlcih1cGRhdGVkTGF5ZXIpO1xuICAgICAgdGhpcy50aW1lbGluZS50cmFja3MudXBkYXRlKHVwZGF0ZWRMYXllcik7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZU1vdmUoZSkge1xuICAgIGlmICghdGhpcy5tb3VzZURvd24gfHzCoCF0aGlzLmN1cnJlbnRFZGl0ZWRMYXllcikgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IGxheWVyID0gdGhpcy5jdXJyZW50RWRpdGVkTGF5ZXI7XG4gICAgY29uc3QgaXRlbXMgPSBsYXllci5zZWxlY3RlZEl0ZW1zO1xuICAgIC8vIHRoZSBsb29wIHNob3VsZCBiZSBpbiBsYXllciB0byBtYXRjaCBzZWxlY3QgLyB1bnNlbGVjdCBBUElcbiAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBsYXllci5lZGl0KGl0ZW0sIGUuZHgsIGUuZHksIHRoaXMuY3VycmVudFRhcmdldCk7XG4gICAgfSk7XG5cbiAgICBsYXllci51cGRhdGUoaXRlbXMpO1xuICB9XG5cbiAgb25Nb3VzZVVwKGUpIHtcbiAgICB0aGlzLmN1cnJlbnRFZGl0ZWRMYXllciA9IG51bGw7XG4gICAgdGhpcy5tb3VzZURvd24gPSBmYWxzZTtcbiAgfVxufVxuIl19