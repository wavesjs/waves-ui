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

var _BaseState2 = require('./BaseState');

var _BaseState3 = _interopRequireDefault(_BaseState2);

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
}(_BaseState3.default);

exports.default = BreakpointState;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJyZWFrcG9pbnRTdGF0ZS5qcyJdLCJuYW1lcyI6WyJCcmVha3BvaW50U3RhdGUiLCJ0aW1lbGluZSIsImRhdHVtR2VuZXJhdG9yIiwiY3VycmVudEVkaXRlZExheWVyIiwiY3VycmVudFRhcmdldCIsImUiLCJoaXRMYXllcnMiLCJ0eXBlIiwib25Nb3VzZURvd24iLCJvbk1vdXNlTW92ZSIsIm9uTW91c2VVcCIsIm1vdXNlRG93biIsInRhcmdldCIsInVwZGF0ZWRMYXllciIsImxheWVycyIsImZvckVhY2giLCJsYXllciIsInVuc2VsZWN0IiwiaXRlbSIsImdldEl0ZW1Gcm9tRE9NRWxlbWVudCIsInRpbWUiLCJ0aW1lVG9QaXhlbCIsImludmVydCIsIngiLCJvZmZzZXQiLCJ2YWx1ZSIsInZhbHVlVG9QaXhlbCIsInBhcmFtcyIsImhlaWdodCIsInkiLCJkYXR1bSIsImRhdGEiLCJwdXNoIiwib3JpZ2luYWxFdmVudCIsInNoaWZ0S2V5IiwiZ2V0RGF0dW1Gcm9tSXRlbSIsInNwbGljZSIsImluZGV4T2YiLCJzZWxlY3QiLCJ0cmFja3MiLCJyZW5kZXIiLCJ1cGRhdGUiLCJpdGVtcyIsInNlbGVjdGVkSXRlbXMiLCJlZGl0IiwiZHgiLCJkeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBR0E7Ozs7OztJQU1NQSxlOzs7QUFDSiwyQkFBWUMsUUFBWixFQUFzQkMsY0FBdEIsRUFBc0M7QUFBQTs7QUFBQSx3SkFDOUJELFFBRDhCOztBQUdwQyxVQUFLQyxjQUFMLEdBQXNCQSxjQUF0QjtBQUNBLFVBQUtDLGtCQUFMLEdBQTBCLElBQTFCO0FBQ0EsVUFBS0MsYUFBTCxHQUFxQixJQUFyQjtBQUxvQztBQU1yQzs7Ozs0QkFFTyxDQUFFOzs7MkJBQ0gsQ0FBRTs7O2dDQUVHQyxDLEVBQUdDLFMsRUFBVztBQUN4QixjQUFRRCxFQUFFRSxJQUFWO0FBQ0UsYUFBSyxXQUFMO0FBQ0UsZUFBS0MsV0FBTCxDQUFpQkgsQ0FBakIsRUFBb0JDLFNBQXBCO0FBQ0E7QUFDRixhQUFLLFdBQUw7QUFDRSxlQUFLRyxXQUFMLENBQWlCSixDQUFqQixFQUFvQkMsU0FBcEI7QUFDQTtBQUNGLGFBQUssU0FBTDtBQUNFLGVBQUtJLFNBQUwsQ0FBZUwsQ0FBZixFQUFrQkMsU0FBbEI7QUFDQTtBQVRKO0FBV0Q7OztnQ0FFV0QsQyxFQUFHQyxTLEVBQVc7QUFBQTs7QUFDeEIsV0FBS0ssU0FBTCxHQUFpQixJQUFqQjtBQUNBO0FBQ0EsV0FBS1AsYUFBTCxHQUFxQkMsRUFBRU8sTUFBdkI7QUFDQSxVQUFJQyxlQUFlLElBQW5COztBQUVBLFVBQU1DLFNBQVNSLFNBQWY7O0FBRUFRLGFBQU9DLE9BQVAsQ0FBZSxVQUFDQyxLQUFELEVBQVc7QUFDeEJBLGNBQU1DLFFBQU47QUFDQSxZQUFNQyxPQUFPRixNQUFNRyxxQkFBTixDQUE0QmQsRUFBRU8sTUFBOUIsQ0FBYjs7QUFFQSxZQUFJTSxTQUFTLElBQWIsRUFBbUI7QUFDakI7QUFDQSxjQUFNRSxPQUFPSixNQUFNSyxXQUFOLENBQWtCQyxNQUFsQixDQUF5QmpCLEVBQUVrQixDQUEzQixJQUFnQyxPQUFLdEIsUUFBTCxDQUFjdUIsTUFBM0Q7QUFDQSxjQUFNQyxRQUFRVCxNQUFNVSxZQUFOLENBQW1CSixNQUFuQixDQUEwQk4sTUFBTVcsTUFBTixDQUFhQyxNQUFiLEdBQXNCdkIsRUFBRXdCLENBQWxELENBQWQ7QUFDQSxjQUFNQyxRQUFRLE9BQUs1QixjQUFMLENBQW9Ca0IsSUFBcEIsRUFBMEJLLEtBQTFCLENBQWQ7O0FBRUFULGdCQUFNZSxJQUFOLENBQVdDLElBQVgsQ0FBZ0JGLEtBQWhCO0FBQ0FqQix5QkFBZUcsS0FBZjtBQUNELFNBUkQsTUFRTztBQUNMO0FBQ0EsY0FBSVgsRUFBRTRCLGFBQUYsQ0FBZ0JDLFFBQXBCLEVBQThCO0FBQzVCLGdCQUFNSCxPQUFPZixNQUFNZSxJQUFuQjtBQUNBLGdCQUFNRCxTQUFRZCxNQUFNbUIsZ0JBQU4sQ0FBdUJqQixJQUF2QixDQUFkO0FBQ0FhLGlCQUFLSyxNQUFMLENBQVlMLEtBQUtNLE9BQUwsQ0FBYVAsTUFBYixDQUFaLEVBQWlDLENBQWpDOztBQUVBakIsMkJBQWVHLEtBQWY7QUFDRCxXQU5ELE1BTU87QUFDTCxtQkFBS2Isa0JBQUwsR0FBMEJhLEtBQTFCO0FBQ0FBLGtCQUFNc0IsTUFBTixDQUFhcEIsSUFBYjtBQUNEO0FBQ0Y7QUFDRixPQXpCRDs7QUEyQkEsVUFBSUwsWUFBSixFQUFrQjtBQUNoQixhQUFLWixRQUFMLENBQWNzQyxNQUFkLENBQXFCQyxNQUFyQixDQUE0QjNCLFlBQTVCO0FBQ0EsYUFBS1osUUFBTCxDQUFjc0MsTUFBZCxDQUFxQkUsTUFBckIsQ0FBNEI1QixZQUE1QjtBQUNEO0FBQ0Y7OztnQ0FFV1IsQyxFQUFHO0FBQUE7O0FBQ2IsVUFBSSxDQUFDLEtBQUtNLFNBQU4sSUFBbUIsQ0FBQyxLQUFLUixrQkFBN0IsRUFBaUQ7QUFBRTtBQUFTOztBQUU1RCxVQUFNYSxRQUFRLEtBQUtiLGtCQUFuQjtBQUNBLFVBQU11QyxRQUFRMUIsTUFBTTJCLGFBQXBCO0FBQ0E7QUFDQUQsWUFBTTNCLE9BQU4sQ0FBYyxVQUFDRyxJQUFELEVBQVU7QUFDdEJGLGNBQU00QixJQUFOLENBQVcxQixJQUFYLEVBQWlCYixFQUFFd0MsRUFBbkIsRUFBdUJ4QyxFQUFFeUMsRUFBekIsRUFBNkIsT0FBSzFDLGFBQWxDO0FBQ0QsT0FGRDs7QUFJQVksWUFBTXlCLE1BQU4sQ0FBYUMsS0FBYjtBQUNEOzs7OEJBRVNyQyxDLEVBQUc7QUFDWCxXQUFLRixrQkFBTCxHQUEwQixJQUExQjtBQUNBLFdBQUtRLFNBQUwsR0FBaUIsS0FBakI7QUFDRDs7Ozs7a0JBR1lYLGUiLCJmaWxlIjoiQnJlYWtwb2ludFN0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTdGF0ZSBmcm9tICcuL0Jhc2VTdGF0ZSc7XG5cblxuLyoqXG4gKiBBIHN0YXRlIHRvIGludGVyYWN0IHdpdGggYSBicmVha3BvaW50IGZ1bmN0aW9uLCBtaW1pY2luZyBNYXgvTVNQJ3NcbiAqIGJyZWFrcG9pbnQgZnVuY3Rpb24gaW50ZXJhY3Rpb25zLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLWJyZWFrcGludC5odG1sKVxuICovXG5jbGFzcyBCcmVha3BvaW50U3RhdGUgZXh0ZW5kcyBCYXNlU3RhdGUge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSwgZGF0dW1HZW5lcmF0b3IpIHtcbiAgICBzdXBlcih0aW1lbGluZSk7XG5cbiAgICB0aGlzLmRhdHVtR2VuZXJhdG9yID0gZGF0dW1HZW5lcmF0b3I7XG4gICAgdGhpcy5jdXJyZW50RWRpdGVkTGF5ZXIgPSBudWxsO1xuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IG51bGw7XG4gIH1cblxuICBlbnRlcigpIHt9XG4gIGV4aXQoKSB7fVxuXG4gIGhhbmRsZUV2ZW50KGUsIGhpdExheWVycykge1xuICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICB0aGlzLm9uTW91c2VEb3duKGUsIGhpdExheWVycyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlTW92ZShlLCBoaXRMYXllcnMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICB0aGlzLm9uTW91c2VVcChlLCBoaXRMYXllcnMpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBvbk1vdXNlRG93bihlLCBoaXRMYXllcnMpIHtcbiAgICB0aGlzLm1vdXNlRG93biA9IHRydWU7XG4gICAgLy8ga2VlcCB0YXJnZXQgY29uc2lzdGVudCB3aXRoIG1vdXNlIGRvd25cbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBlLnRhcmdldDtcbiAgICBsZXQgdXBkYXRlZExheWVyID0gbnVsbDtcblxuICAgIGNvbnN0IGxheWVycyA9IGhpdExheWVycztcblxuICAgIGxheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgICAgbGF5ZXIudW5zZWxlY3QoKTtcbiAgICAgIGNvbnN0IGl0ZW0gPSBsYXllci5nZXRJdGVtRnJvbURPTUVsZW1lbnQoZS50YXJnZXQpO1xuXG4gICAgICBpZiAoaXRlbSA9PT0gbnVsbCkge1xuICAgICAgICAvLyBjcmVhdGUgYW4gaXRlbVxuICAgICAgICBjb25zdCB0aW1lID0gbGF5ZXIudGltZVRvUGl4ZWwuaW52ZXJ0KGUueCkgLSB0aGlzLnRpbWVsaW5lLm9mZnNldDtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBsYXllci52YWx1ZVRvUGl4ZWwuaW52ZXJ0KGxheWVyLnBhcmFtcy5oZWlnaHQgLSBlLnkpO1xuICAgICAgICBjb25zdCBkYXR1bSA9IHRoaXMuZGF0dW1HZW5lcmF0b3IodGltZSwgdmFsdWUpO1xuXG4gICAgICAgIGxheWVyLmRhdGEucHVzaChkYXR1bSk7XG4gICAgICAgIHVwZGF0ZWRMYXllciA9IGxheWVyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gaWYgc2hpZnQgaXMgcHJlc3NlZCwgcmVtb3ZlIHRoZSBpdGVtXG4gICAgICAgIGlmIChlLm9yaWdpbmFsRXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgICAgICBjb25zdCBkYXRhID0gbGF5ZXIuZGF0YTtcbiAgICAgICAgICBjb25zdCBkYXR1bSA9IGxheWVyLmdldERhdHVtRnJvbUl0ZW0oaXRlbSk7XG4gICAgICAgICAgZGF0YS5zcGxpY2UoZGF0YS5pbmRleE9mKGRhdHVtKSwgMSk7XG5cbiAgICAgICAgICB1cGRhdGVkTGF5ZXIgPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRFZGl0ZWRMYXllciA9IGxheWVyO1xuICAgICAgICAgIGxheWVyLnNlbGVjdChpdGVtKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHVwZGF0ZWRMYXllcikge1xuICAgICAgdGhpcy50aW1lbGluZS50cmFja3MucmVuZGVyKHVwZGF0ZWRMYXllcik7XG4gICAgICB0aGlzLnRpbWVsaW5lLnRyYWNrcy51cGRhdGUodXBkYXRlZExheWVyKTtcbiAgICB9XG4gIH1cblxuICBvbk1vdXNlTW92ZShlKSB7XG4gICAgaWYgKCF0aGlzLm1vdXNlRG93biB8fMKgIXRoaXMuY3VycmVudEVkaXRlZExheWVyKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgbGF5ZXIgPSB0aGlzLmN1cnJlbnRFZGl0ZWRMYXllcjtcbiAgICBjb25zdCBpdGVtcyA9IGxheWVyLnNlbGVjdGVkSXRlbXM7XG4gICAgLy8gdGhlIGxvb3Agc2hvdWxkIGJlIGluIGxheWVyIHRvIG1hdGNoIHNlbGVjdCAvIHVuc2VsZWN0IEFQSVxuICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGxheWVyLmVkaXQoaXRlbSwgZS5keCwgZS5keSwgdGhpcy5jdXJyZW50VGFyZ2V0KTtcbiAgICB9KTtcblxuICAgIGxheWVyLnVwZGF0ZShpdGVtcyk7XG4gIH1cblxuICBvbk1vdXNlVXAoZSkge1xuICAgIHRoaXMuY3VycmVudEVkaXRlZExheWVyID0gbnVsbDtcbiAgICB0aGlzLm1vdXNlRG93biA9IGZhbHNlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJyZWFrcG9pbnRTdGF0ZTtcbiJdfQ==