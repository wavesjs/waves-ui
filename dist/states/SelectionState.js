'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

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

var _namespace = require('../core/namespace');

var _namespace2 = _interopRequireDefault(_namespace);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A state to select shapes.
 */
var SelectionState = function (_BaseState) {
  (0, _inherits3.default)(SelectionState, _BaseState);

  function SelectionState(timeline /*, options = {} */) {
    (0, _classCallCheck3.default)(this, SelectionState);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SelectionState.__proto__ || (0, _getPrototypeOf2.default)(SelectionState)).call(this, timeline /*, options */));

    _this.currentLayer = null;
    // need a cached
    _this.selectedItems = null;
    _this.mouseDown = false;
    _this.shiftKey = false;

    _this._layerSelectedItemsMap = new _map2.default();
    return _this;
  }

  (0, _createClass3.default)(SelectionState, [{
    key: 'enter',
    value: function enter() {}
  }, {
    key: 'exit',
    value: function exit() {
      var containers = this.timeline.containers;

      for (var id in containers) {
        this._removeBrush(containers[id]);
      }
    }
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
        case 'click':
          this.onClick(e);
          break;
        case 'keydown':
          this.onKey(e);
          break;
        case 'keyup':
          this.onKey(e);
          break;
      }
    }
  }, {
    key: '_addBrush',
    value: function _addBrush(track) {
      if (track.$brush) {
        return;
      }

      var brush = document.createElementNS(_namespace2.default, 'rect');
      brush.style.fill = '#686868';
      brush.style.opacity = 0.2;

      track.$interactions.appendChild(brush);
      track.$brush = brush;
    }
  }, {
    key: '_removeBrush',
    value: function _removeBrush(track) {
      if (track.$brush === null) {
        return;
      }

      this._resetBrush(track);
      track.$interactions.removeChild(track.$brush);
      delete track.$brush;
    }
  }, {
    key: '_resetBrush',
    value: function _resetBrush(track) {
      var $brush = track.$brush;
      // reset brush element
      $brush.setAttributeNS(null, 'transform', 'translate(0, 0)');
      $brush.setAttributeNS(null, 'width', 0);
      $brush.setAttributeNS(null, 'height', 0);
    }
  }, {
    key: '_updateBrush',
    value: function _updateBrush(e, track) {
      var $brush = track.$brush;
      var translate = 'translate(' + e.area.left + ', ' + e.area.top + ')';

      $brush.setAttributeNS(null, 'transform', translate);
      $brush.setAttributeNS(null, 'width', e.area.width);
      $brush.setAttributeNS(null, 'height', e.area.height);
    }
  }, {
    key: 'onKey',
    value: function onKey(e) {
      this.shiftKey = e.shiftKey;
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(e) {
      var _this2 = this;

      this._currentTrack = this.timeline.getTrackFromDOMElement(e.target);
      if (!this._currentTrack) {
        return;
      }

      this._addBrush(this._currentTrack);

      // recreate the map
      this._layerSelectedItemsMap = new _map2.default();
      this._currentTrack.layers.forEach(function (layer) {
        _this2._layerSelectedItemsMap.set(layer, layer.selectedItems.slice(0));
      });
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      var _this3 = this;

      this._updateBrush(e, this._currentTrack);

      this._currentTrack.layers.forEach(function (layer) {
        var currentSelection = layer.selectedItems;
        var currentItems = layer.getItemsInArea(e.area);

        // if is not pressed
        if (!e.originalEvent.shiftKey) {
          layer.unselect(currentSelection);
          layer.select(currentItems);
        } else {
          var toSelect = [];
          var toUnselect = [];
          // use the selection from the previous drag
          var previousSelection = _this3._layerSelectedItemsMap.get(layer);
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
        }
      });
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(e) {
      this._removeBrush(this._currentTrack);
    }
  }, {
    key: 'onClick',
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
  }]);
  return SelectionState;
}(_BaseState3.default);

exports.default = SelectionState;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlbGVjdGlvblN0YXRlLmpzIl0sIm5hbWVzIjpbIlNlbGVjdGlvblN0YXRlIiwidGltZWxpbmUiLCJjdXJyZW50TGF5ZXIiLCJzZWxlY3RlZEl0ZW1zIiwibW91c2VEb3duIiwic2hpZnRLZXkiLCJfbGF5ZXJTZWxlY3RlZEl0ZW1zTWFwIiwiY29udGFpbmVycyIsImlkIiwiX3JlbW92ZUJydXNoIiwiZSIsInR5cGUiLCJvbk1vdXNlRG93biIsIm9uTW91c2VNb3ZlIiwib25Nb3VzZVVwIiwib25DbGljayIsIm9uS2V5IiwidHJhY2siLCIkYnJ1c2giLCJicnVzaCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudE5TIiwic3R5bGUiLCJmaWxsIiwib3BhY2l0eSIsIiRpbnRlcmFjdGlvbnMiLCJhcHBlbmRDaGlsZCIsIl9yZXNldEJydXNoIiwicmVtb3ZlQ2hpbGQiLCJzZXRBdHRyaWJ1dGVOUyIsInRyYW5zbGF0ZSIsImFyZWEiLCJsZWZ0IiwidG9wIiwid2lkdGgiLCJoZWlnaHQiLCJfY3VycmVudFRyYWNrIiwiZ2V0VHJhY2tGcm9tRE9NRWxlbWVudCIsInRhcmdldCIsIl9hZGRCcnVzaCIsImxheWVycyIsImZvckVhY2giLCJsYXllciIsInNldCIsInNsaWNlIiwiX3VwZGF0ZUJydXNoIiwiY3VycmVudFNlbGVjdGlvbiIsImN1cnJlbnRJdGVtcyIsImdldEl0ZW1zSW5BcmVhIiwib3JpZ2luYWxFdmVudCIsInVuc2VsZWN0Iiwic2VsZWN0IiwidG9TZWxlY3QiLCJ0b1Vuc2VsZWN0IiwicHJldmlvdXNTZWxlY3Rpb24iLCJnZXQiLCJpdGVtIiwiaW5kZXhPZiIsInB1c2giLCJnZXRJdGVtRnJvbURPTUVsZW1lbnQiLCJ0b2dnbGVTZWxlY3Rpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUdBOzs7SUFHTUEsYzs7O0FBQ0osMEJBQVlDLFFBQVosQ0FBcUIsbUJBQXJCLEVBQTBDO0FBQUE7O0FBQUEsc0pBQ2xDQSxRQURrQyxDQUN6QixjQUR5Qjs7QUFHeEMsVUFBS0MsWUFBTCxHQUFvQixJQUFwQjtBQUNBO0FBQ0EsVUFBS0MsYUFBTCxHQUFxQixJQUFyQjtBQUNBLFVBQUtDLFNBQUwsR0FBaUIsS0FBakI7QUFDQSxVQUFLQyxRQUFMLEdBQWdCLEtBQWhCOztBQUVBLFVBQUtDLHNCQUFMLEdBQThCLG1CQUE5QjtBQVR3QztBQVV6Qzs7Ozs0QkFFTyxDQUVQOzs7MkJBRU07QUFDTCxVQUFNQyxhQUFhLEtBQUtOLFFBQUwsQ0FBY00sVUFBakM7O0FBRUEsV0FBSyxJQUFJQyxFQUFULElBQWVELFVBQWYsRUFBMkI7QUFDekIsYUFBS0UsWUFBTCxDQUFrQkYsV0FBV0MsRUFBWCxDQUFsQjtBQUNEO0FBQ0Y7OztnQ0FFV0UsQyxFQUFHO0FBQ2IsY0FBUUEsRUFBRUMsSUFBVjtBQUNFLGFBQUssV0FBTDtBQUNFLGVBQUtDLFdBQUwsQ0FBaUJGLENBQWpCO0FBQ0E7QUFDRixhQUFLLFdBQUw7QUFDRSxlQUFLRyxXQUFMLENBQWlCSCxDQUFqQjtBQUNBO0FBQ0YsYUFBSyxTQUFMO0FBQ0UsZUFBS0ksU0FBTCxDQUFlSixDQUFmO0FBQ0E7QUFDRixhQUFLLE9BQUw7QUFDRSxlQUFLSyxPQUFMLENBQWFMLENBQWI7QUFDQTtBQUNGLGFBQUssU0FBTDtBQUNFLGVBQUtNLEtBQUwsQ0FBV04sQ0FBWDtBQUNBO0FBQ0YsYUFBSyxPQUFMO0FBQ0UsZUFBS00sS0FBTCxDQUFXTixDQUFYO0FBQ0E7QUFsQko7QUFvQkQ7Ozs4QkFFU08sSyxFQUFPO0FBQ2YsVUFBSUEsTUFBTUMsTUFBVixFQUFrQjtBQUFFO0FBQVM7O0FBRTdCLFVBQU1DLFFBQVFDLFNBQVNDLGVBQVQsc0JBQTZCLE1BQTdCLENBQWQ7QUFDQUYsWUFBTUcsS0FBTixDQUFZQyxJQUFaLEdBQW1CLFNBQW5CO0FBQ0FKLFlBQU1HLEtBQU4sQ0FBWUUsT0FBWixHQUFzQixHQUF0Qjs7QUFFQVAsWUFBTVEsYUFBTixDQUFvQkMsV0FBcEIsQ0FBZ0NQLEtBQWhDO0FBQ0FGLFlBQU1DLE1BQU4sR0FBZUMsS0FBZjtBQUNEOzs7aUNBRVlGLEssRUFBTztBQUNsQixVQUFJQSxNQUFNQyxNQUFOLEtBQWlCLElBQXJCLEVBQTJCO0FBQUU7QUFBUzs7QUFFdEMsV0FBS1MsV0FBTCxDQUFpQlYsS0FBakI7QUFDQUEsWUFBTVEsYUFBTixDQUFvQkcsV0FBcEIsQ0FBZ0NYLE1BQU1DLE1BQXRDO0FBQ0EsYUFBT0QsTUFBTUMsTUFBYjtBQUNEOzs7Z0NBRVdELEssRUFBTztBQUNqQixVQUFNQyxTQUFTRCxNQUFNQyxNQUFyQjtBQUNBO0FBQ0FBLGFBQU9XLGNBQVAsQ0FBc0IsSUFBdEIsRUFBNEIsV0FBNUIsRUFBeUMsaUJBQXpDO0FBQ0FYLGFBQU9XLGNBQVAsQ0FBc0IsSUFBdEIsRUFBNEIsT0FBNUIsRUFBcUMsQ0FBckM7QUFDQVgsYUFBT1csY0FBUCxDQUFzQixJQUF0QixFQUE0QixRQUE1QixFQUFzQyxDQUF0QztBQUNEOzs7aUNBRVluQixDLEVBQUdPLEssRUFBTztBQUNyQixVQUFNQyxTQUFTRCxNQUFNQyxNQUFyQjtBQUNBLFVBQU1ZLDJCQUF5QnBCLEVBQUVxQixJQUFGLENBQU9DLElBQWhDLFVBQXlDdEIsRUFBRXFCLElBQUYsQ0FBT0UsR0FBaEQsTUFBTjs7QUFFQWYsYUFBT1csY0FBUCxDQUFzQixJQUF0QixFQUE0QixXQUE1QixFQUF5Q0MsU0FBekM7QUFDQVosYUFBT1csY0FBUCxDQUFzQixJQUF0QixFQUE0QixPQUE1QixFQUFxQ25CLEVBQUVxQixJQUFGLENBQU9HLEtBQTVDO0FBQ0FoQixhQUFPVyxjQUFQLENBQXNCLElBQXRCLEVBQTRCLFFBQTVCLEVBQXNDbkIsRUFBRXFCLElBQUYsQ0FBT0ksTUFBN0M7QUFDRDs7OzBCQUVLekIsQyxFQUFHO0FBQ1AsV0FBS0wsUUFBTCxHQUFnQkssRUFBRUwsUUFBbEI7QUFDRDs7O2dDQUVXSyxDLEVBQUc7QUFBQTs7QUFDYixXQUFLMEIsYUFBTCxHQUFxQixLQUFLbkMsUUFBTCxDQUFjb0Msc0JBQWQsQ0FBcUMzQixFQUFFNEIsTUFBdkMsQ0FBckI7QUFDQSxVQUFJLENBQUMsS0FBS0YsYUFBVixFQUF5QjtBQUFFO0FBQVM7O0FBRXBDLFdBQUtHLFNBQUwsQ0FBZSxLQUFLSCxhQUFwQjs7QUFFQTtBQUNBLFdBQUs5QixzQkFBTCxHQUE4QixtQkFBOUI7QUFDQSxXQUFLOEIsYUFBTCxDQUFtQkksTUFBbkIsQ0FBMEJDLE9BQTFCLENBQWtDLFVBQUNDLEtBQUQsRUFBVztBQUMzQyxlQUFLcEMsc0JBQUwsQ0FBNEJxQyxHQUE1QixDQUFnQ0QsS0FBaEMsRUFBdUNBLE1BQU12QyxhQUFOLENBQW9CeUMsS0FBcEIsQ0FBMEIsQ0FBMUIsQ0FBdkM7QUFDRCxPQUZEO0FBR0Q7OztnQ0FFV2xDLEMsRUFBRztBQUFBOztBQUNiLFdBQUttQyxZQUFMLENBQWtCbkMsQ0FBbEIsRUFBcUIsS0FBSzBCLGFBQTFCOztBQUVBLFdBQUtBLGFBQUwsQ0FBbUJJLE1BQW5CLENBQTBCQyxPQUExQixDQUFrQyxVQUFDQyxLQUFELEVBQVc7QUFDM0MsWUFBTUksbUJBQW1CSixNQUFNdkMsYUFBL0I7QUFDQSxZQUFNNEMsZUFBZUwsTUFBTU0sY0FBTixDQUFxQnRDLEVBQUVxQixJQUF2QixDQUFyQjs7QUFFQTtBQUNBLFlBQUksQ0FBQ3JCLEVBQUV1QyxhQUFGLENBQWdCNUMsUUFBckIsRUFBK0I7QUFDN0JxQyxnQkFBTVEsUUFBTixDQUFlSixnQkFBZjtBQUNBSixnQkFBTVMsTUFBTixDQUFhSixZQUFiO0FBQ0QsU0FIRCxNQUdPO0FBQ0wsY0FBTUssV0FBVyxFQUFqQjtBQUNBLGNBQU1DLGFBQWEsRUFBbkI7QUFDQTtBQUNBLGNBQU1DLG9CQUFvQixPQUFLaEQsc0JBQUwsQ0FBNEJpRCxHQUE1QixDQUFnQ2IsS0FBaEMsQ0FBMUI7QUFDQTs7QUFFQUssdUJBQWFOLE9BQWIsQ0FBcUIsVUFBQ2UsSUFBRCxFQUFVO0FBQzdCLGdCQUFJRixrQkFBa0JHLE9BQWxCLENBQTBCRCxJQUExQixNQUFvQyxDQUFDLENBQXpDLEVBQTRDO0FBQzFDSix1QkFBU00sSUFBVCxDQUFjRixJQUFkO0FBQ0QsYUFGRCxNQUVPO0FBQ0xILHlCQUFXSyxJQUFYLENBQWdCRixJQUFoQjtBQUNEO0FBQ0YsV0FORDs7QUFRQVYsMkJBQWlCTCxPQUFqQixDQUF5QixVQUFDZSxJQUFELEVBQVU7QUFDakMsZ0JBQ0VULGFBQWFVLE9BQWIsQ0FBcUJELElBQXJCLE1BQStCLENBQUMsQ0FBaEMsSUFDQUYsa0JBQWtCRyxPQUFsQixDQUEwQkQsSUFBMUIsTUFBb0MsQ0FBQyxDQUZ2QyxFQUdFO0FBQ0FILHlCQUFXSyxJQUFYLENBQWdCRixJQUFoQjtBQUNEO0FBQ0YsV0FQRDs7QUFTQWQsZ0JBQU1RLFFBQU4sQ0FBZUcsVUFBZjtBQUNBWCxnQkFBTVMsTUFBTixDQUFhQyxRQUFiO0FBQ0Q7QUFDRixPQW5DRDtBQW9DRDs7OzhCQUVTMUMsQyxFQUFHO0FBQ1gsV0FBS0QsWUFBTCxDQUFrQixLQUFLMkIsYUFBdkI7QUFDRDs7OzRCQUVPMUIsQyxFQUFHO0FBQ1QsVUFBSSxDQUFDLEtBQUswQixhQUFWLEVBQXlCO0FBQUU7QUFBUzs7QUFFcEMsV0FBS0EsYUFBTCxDQUFtQkksTUFBbkIsQ0FBMEJDLE9BQTFCLENBQWtDLFVBQUNDLEtBQUQsRUFBVztBQUMzQyxZQUFJYyxPQUFPZCxNQUFNaUIscUJBQU4sQ0FBNEJqRCxFQUFFNEIsTUFBOUIsQ0FBWDs7QUFFQSxZQUFJLENBQUM1QixFQUFFdUMsYUFBRixDQUFnQjVDLFFBQXJCLEVBQStCO0FBQzdCcUMsZ0JBQU1RLFFBQU47QUFDRDs7QUFFRCxZQUFJTSxJQUFKLEVBQVU7QUFDUmQsZ0JBQU1rQixlQUFOLENBQXNCSixJQUF0QjtBQUNEO0FBQ0YsT0FWRDtBQVdEOzs7OztrQkFHWXhELGMiLCJmaWxlIjoiU2VsZWN0aW9uU3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVN0YXRlIGZyb20gJy4vQmFzZVN0YXRlJztcbmltcG9ydCBucyBmcm9tICcuLi9jb3JlL25hbWVzcGFjZSc7XG5cblxuLyoqXG4gKiBBIHN0YXRlIHRvIHNlbGVjdCBzaGFwZXMuXG4gKi9cbmNsYXNzIFNlbGVjdGlvblN0YXRlIGV4dGVuZHMgQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUgLyosIG9wdGlvbnMgPSB7fSAqLykge1xuICAgIHN1cGVyKHRpbWVsaW5lIC8qLCBvcHRpb25zICovKTtcblxuICAgIHRoaXMuY3VycmVudExheWVyID0gbnVsbDtcbiAgICAvLyBuZWVkIGEgY2FjaGVkXG4gICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gbnVsbDtcbiAgICB0aGlzLm1vdXNlRG93biA9IGZhbHNlO1xuICAgIHRoaXMuc2hpZnRLZXkgPSBmYWxzZTtcblxuICAgIHRoaXMuX2xheWVyU2VsZWN0ZWRJdGVtc01hcCA9IG5ldyBNYXAoKTtcbiAgfVxuXG4gIGVudGVyKCkge1xuXG4gIH1cblxuICBleGl0KCkge1xuICAgIGNvbnN0IGNvbnRhaW5lcnMgPSB0aGlzLnRpbWVsaW5lLmNvbnRhaW5lcnM7XG5cbiAgICBmb3IgKGxldCBpZCBpbiBjb250YWluZXJzKSB7XG4gICAgICB0aGlzLl9yZW1vdmVCcnVzaChjb250YWluZXJzW2lkXSk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlRXZlbnQoZSkge1xuICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICB0aGlzLm9uTW91c2VEb3duKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XG4gICAgICAgIHRoaXMub25Nb3VzZU1vdmUoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIHRoaXMub25Nb3VzZVVwKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NsaWNrJzpcbiAgICAgICAgdGhpcy5vbkNsaWNrKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2tleWRvd24nOlxuICAgICAgICB0aGlzLm9uS2V5KGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2tleXVwJzpcbiAgICAgICAgdGhpcy5vbktleShlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgX2FkZEJydXNoKHRyYWNrKSB7XG4gICAgaWYgKHRyYWNrLiRicnVzaCkgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IGJydXNoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAncmVjdCcpO1xuICAgIGJydXNoLnN0eWxlLmZpbGwgPSAnIzY4Njg2OCc7XG4gICAgYnJ1c2guc3R5bGUub3BhY2l0eSA9IDAuMjtcblxuICAgIHRyYWNrLiRpbnRlcmFjdGlvbnMuYXBwZW5kQ2hpbGQoYnJ1c2gpO1xuICAgIHRyYWNrLiRicnVzaCA9IGJydXNoO1xuICB9XG5cbiAgX3JlbW92ZUJydXNoKHRyYWNrKSB7XG4gICAgaWYgKHRyYWNrLiRicnVzaCA9PT0gbnVsbCkgeyByZXR1cm47IH1cblxuICAgIHRoaXMuX3Jlc2V0QnJ1c2godHJhY2spO1xuICAgIHRyYWNrLiRpbnRlcmFjdGlvbnMucmVtb3ZlQ2hpbGQodHJhY2suJGJydXNoKTtcbiAgICBkZWxldGUgdHJhY2suJGJydXNoO1xuICB9XG5cbiAgX3Jlc2V0QnJ1c2godHJhY2spIHtcbiAgICBjb25zdCAkYnJ1c2ggPSB0cmFjay4kYnJ1c2g7XG4gICAgLy8gcmVzZXQgYnJ1c2ggZWxlbWVudFxuICAgICRicnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLCAwKScpO1xuICAgICRicnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCAwKTtcbiAgICAkYnJ1c2guc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIDApO1xuICB9XG5cbiAgX3VwZGF0ZUJydXNoKGUsIHRyYWNrKSB7XG4gICAgY29uc3QgJGJydXNoID0gdHJhY2suJGJydXNoO1xuICAgIGNvbnN0IHRyYW5zbGF0ZSA9IGB0cmFuc2xhdGUoJHtlLmFyZWEubGVmdH0sICR7ZS5hcmVhLnRvcH0pYDtcblxuICAgICRicnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgdHJhbnNsYXRlKTtcbiAgICAkYnJ1c2guc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgZS5hcmVhLndpZHRoKTtcbiAgICAkYnJ1c2guc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIGUuYXJlYS5oZWlnaHQpO1xuICB9XG5cbiAgb25LZXkoZSkge1xuICAgIHRoaXMuc2hpZnRLZXkgPSBlLnNoaWZ0S2V5O1xuICB9XG5cbiAgb25Nb3VzZURvd24oZSkge1xuICAgIHRoaXMuX2N1cnJlbnRUcmFjayA9IHRoaXMudGltZWxpbmUuZ2V0VHJhY2tGcm9tRE9NRWxlbWVudChlLnRhcmdldCk7XG4gICAgaWYgKCF0aGlzLl9jdXJyZW50VHJhY2spIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLl9hZGRCcnVzaCh0aGlzLl9jdXJyZW50VHJhY2spO1xuXG4gICAgLy8gcmVjcmVhdGUgdGhlIG1hcFxuICAgIHRoaXMuX2xheWVyU2VsZWN0ZWRJdGVtc01hcCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl9jdXJyZW50VHJhY2subGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB7XG4gICAgICB0aGlzLl9sYXllclNlbGVjdGVkSXRlbXNNYXAuc2V0KGxheWVyLCBsYXllci5zZWxlY3RlZEl0ZW1zLnNsaWNlKDApKTtcbiAgICB9KTtcbiAgfVxuXG4gIG9uTW91c2VNb3ZlKGUpIHtcbiAgICB0aGlzLl91cGRhdGVCcnVzaChlLCB0aGlzLl9jdXJyZW50VHJhY2spO1xuXG4gICAgdGhpcy5fY3VycmVudFRyYWNrLmxheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgICAgY29uc3QgY3VycmVudFNlbGVjdGlvbiA9IGxheWVyLnNlbGVjdGVkSXRlbXM7XG4gICAgICBjb25zdCBjdXJyZW50SXRlbXMgPSBsYXllci5nZXRJdGVtc0luQXJlYShlLmFyZWEpO1xuXG4gICAgICAvLyBpZiBpcyBub3QgcHJlc3NlZFxuICAgICAgaWYgKCFlLm9yaWdpbmFsRXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgICAgbGF5ZXIudW5zZWxlY3QoY3VycmVudFNlbGVjdGlvbik7XG4gICAgICAgIGxheWVyLnNlbGVjdChjdXJyZW50SXRlbXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgdG9TZWxlY3QgPSBbXTtcbiAgICAgICAgY29uc3QgdG9VbnNlbGVjdCA9IFtdO1xuICAgICAgICAvLyB1c2UgdGhlIHNlbGVjdGlvbiBmcm9tIHRoZSBwcmV2aW91cyBkcmFnXG4gICAgICAgIGNvbnN0IHByZXZpb3VzU2VsZWN0aW9uID0gdGhpcy5fbGF5ZXJTZWxlY3RlZEl0ZW1zTWFwLmdldChsYXllcik7XG4gICAgICAgIC8vIHRvVW5zZWxlY3QgPSB0b1Vuc2VsZWN0LmNvbmNhdChwcmV2aW91c1NlbGVjdGVkSXRlbXMpO1xuXG4gICAgICAgIGN1cnJlbnRJdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgaWYgKHByZXZpb3VzU2VsZWN0aW9uLmluZGV4T2YoaXRlbSkgPT09IC0xKSB7XG4gICAgICAgICAgICB0b1NlbGVjdC5wdXNoKGl0ZW0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0b1Vuc2VsZWN0LnB1c2goaXRlbSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBjdXJyZW50U2VsZWN0aW9uLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBjdXJyZW50SXRlbXMuaW5kZXhPZihpdGVtKSA9PT0gLTEgJiZcbiAgICAgICAgICAgIHByZXZpb3VzU2VsZWN0aW9uLmluZGV4T2YoaXRlbSkgPT09IC0xXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB0b1Vuc2VsZWN0LnB1c2goaXRlbSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBsYXllci51bnNlbGVjdCh0b1Vuc2VsZWN0KTtcbiAgICAgICAgbGF5ZXIuc2VsZWN0KHRvU2VsZWN0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG9uTW91c2VVcChlKSB7XG4gICAgdGhpcy5fcmVtb3ZlQnJ1c2godGhpcy5fY3VycmVudFRyYWNrKTtcbiAgfVxuXG4gIG9uQ2xpY2soZSkge1xuICAgIGlmICghdGhpcy5fY3VycmVudFRyYWNrKSB7IHJldHVybjsgfVxuXG4gICAgdGhpcy5fY3VycmVudFRyYWNrLmxheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgICAgbGV0IGl0ZW0gPSBsYXllci5nZXRJdGVtRnJvbURPTUVsZW1lbnQoZS50YXJnZXQpO1xuXG4gICAgICBpZiAoIWUub3JpZ2luYWxFdmVudC5zaGlmdEtleSkge1xuICAgICAgICBsYXllci51bnNlbGVjdCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbSkge1xuICAgICAgICBsYXllci50b2dnbGVTZWxlY3Rpb24oaXRlbSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2VsZWN0aW9uU3RhdGU7XG4iXX0=