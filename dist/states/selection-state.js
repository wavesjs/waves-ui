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

var _baseState = require('./base-state');

var _baseState2 = _interopRequireDefault(_baseState);

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
}(_baseState2.default);

exports.default = SelectionState;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlbGVjdGlvbi1zdGF0ZS5qcyJdLCJuYW1lcyI6WyJTZWxlY3Rpb25TdGF0ZSIsInRpbWVsaW5lIiwiY3VycmVudExheWVyIiwic2VsZWN0ZWRJdGVtcyIsIm1vdXNlRG93biIsInNoaWZ0S2V5IiwiX2xheWVyU2VsZWN0ZWRJdGVtc01hcCIsImNvbnRhaW5lcnMiLCJpZCIsIl9yZW1vdmVCcnVzaCIsImUiLCJ0eXBlIiwib25Nb3VzZURvd24iLCJvbk1vdXNlTW92ZSIsIm9uTW91c2VVcCIsIm9uQ2xpY2siLCJvbktleSIsInRyYWNrIiwiJGJydXNoIiwiYnJ1c2giLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnROUyIsInN0eWxlIiwiZmlsbCIsIm9wYWNpdHkiLCIkaW50ZXJhY3Rpb25zIiwiYXBwZW5kQ2hpbGQiLCJfcmVzZXRCcnVzaCIsInJlbW92ZUNoaWxkIiwic2V0QXR0cmlidXRlTlMiLCJ0cmFuc2xhdGUiLCJhcmVhIiwibGVmdCIsInRvcCIsIndpZHRoIiwiaGVpZ2h0IiwiX2N1cnJlbnRUcmFjayIsImdldFRyYWNrRnJvbURPTUVsZW1lbnQiLCJ0YXJnZXQiLCJfYWRkQnJ1c2giLCJsYXllcnMiLCJmb3JFYWNoIiwibGF5ZXIiLCJzZXQiLCJzbGljZSIsIl91cGRhdGVCcnVzaCIsImN1cnJlbnRTZWxlY3Rpb24iLCJjdXJyZW50SXRlbXMiLCJnZXRJdGVtc0luQXJlYSIsIm9yaWdpbmFsRXZlbnQiLCJ1bnNlbGVjdCIsInNlbGVjdCIsInRvU2VsZWN0IiwidG9VbnNlbGVjdCIsInByZXZpb3VzU2VsZWN0aW9uIiwiZ2V0IiwiaXRlbSIsImluZGV4T2YiLCJwdXNoIiwiZ2V0SXRlbUZyb21ET01FbGVtZW50IiwidG9nZ2xlU2VsZWN0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFHQTs7O0lBR3FCQSxjOzs7QUFDbkIsMEJBQVlDLFFBQVosQ0FBcUIsbUJBQXJCLEVB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LEVBQTRDO0FBQzFDSix1QkFBU00sSUFBVCxDQUFjRixJQUFkO0FBQ0QsYUFGRCxNQUVPO0FBQ0xILHlCQUFXSyxJQUFYLENBQWdCRixJQUFoQjtBQUNEO0FBQ0YsV0FORDs7QUFRQVYsMkJBQWlCTCxPQUFqQixDQUF5QixVQUFDZSxJQUFELEVBQVU7QUFDakMsZ0JBQ0VULGFBQWFVLE9BQWIsQ0FBcUJELElBQXJCLE1BQStCLENBQUMsQ0FBaEMsSUFDQUYsa0JBQWtCRyxPQUFsQixDQUEwQkQsSUFBMUIsTUFBb0MsQ0FBQyxDQUZ2QyxFQUdFO0FBQ0FILHlCQUFXSyxJQUFYLENBQWdCRixJQUFoQjtBQUNEO0FBQ0YsV0FQRDs7QUFTQWQsZ0JBQU1RLFFBQU4sQ0FBZUcsVUFBZjtBQUNBWCxnQkFBTVMsTUFBTixDQUFhQyxRQUFiO0FBQ0Q7QUFDRixPQW5DRDtBQW9DRDs7OzhCQUVTMUMsQyxFQUFHO0FBQ1gsV0FBS0QsWUFBTCxDQUFrQixLQUFLMkIsYUFBdkI7QUFDRDs7OzRCQUVPMUIsQyxFQUFHO0FBQ1QsVUFBSSxDQUFDLEtBQUswQixhQUFWLEVBQXlCO0FBQUU7QUFBUzs7QUFFcEMsV0FBS0EsYUFBTCxDQUFtQkksTUFBbkIsQ0FBMEJDLE9BQTFCLENBQWtDLFVBQUNDLEtBQUQsRUFBVztBQUMzQyxZQUFJYyxPQUFPZCxNQUFNaUIscUJBQU4sQ0FBNEJqRCxFQUFFNEIsTUFBOUIsQ0FBWDs7QUFFQSxZQUFJLENBQUM1QixFQUFFdUMsYUFBRixDQUFnQjVDLFFBQXJCLEVBQStCO0FBQzdCcUMsZ0JBQU1RLFFBQU47QUFDRDs7QUFFRCxZQUFJTSxJQUFKLEVBQVU7QUFDUmQsZ0JBQU1rQixlQUFOLENBQXNCSixJQUF0QjtBQUNEO0FBQ0YsT0FWRDtBQVdEOzs7OztrQkFoS2tCeEQsYyIsImZpbGUiOiJzZWxlY3Rpb24tc3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVN0YXRlIGZyb20gJy4vYmFzZS1zdGF0ZSc7XG5pbXBvcnQgbnMgZnJvbSAnLi4vY29yZS9uYW1lc3BhY2UnO1xuXG5cbi8qKlxuICogQSBzdGF0ZSB0byBzZWxlY3Qgc2hhcGVzLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWxlY3Rpb25TdGF0ZSBleHRlbmRzIEJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lIC8qLCBvcHRpb25zID0ge30gKi8pIHtcbiAgICBzdXBlcih0aW1lbGluZSAvKiwgb3B0aW9ucyAqLyk7XG5cbiAgICB0aGlzLmN1cnJlbnRMYXllciA9IG51bGw7XG4gICAgLy8gbmVlZCBhIGNhY2hlZFxuICAgIHRoaXMuc2VsZWN0ZWRJdGVtcyA9IG51bGw7XG4gICAgdGhpcy5tb3VzZURvd24gPSBmYWxzZTtcbiAgICB0aGlzLnNoaWZ0S2V5ID0gZmFsc2U7XG5cbiAgICB0aGlzLl9sYXllclNlbGVjdGVkSXRlbXNNYXAgPSBuZXcgTWFwKCk7XG4gIH1cblxuICBlbnRlcigpIHtcblxuICB9XG5cbiAgZXhpdCgpIHtcbiAgICBjb25zdCBjb250YWluZXJzID0gdGhpcy50aW1lbGluZS5jb250YWluZXJzO1xuXG4gICAgZm9yIChsZXQgaWQgaW4gY29udGFpbmVycykge1xuICAgICAgdGhpcy5fcmVtb3ZlQnJ1c2goY29udGFpbmVyc1tpZF0pO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUV2ZW50KGUpIHtcbiAgICBzd2l0Y2ggKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlRG93bihlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxuICAgICAgICB0aGlzLm9uTW91c2VNb3ZlKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICB0aGlzLm9uTW91c2VVcChlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjbGljayc6XG4gICAgICAgIHRoaXMub25DbGljayhlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdrZXlkb3duJzpcbiAgICAgICAgdGhpcy5vbktleShlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdrZXl1cCc6XG4gICAgICAgIHRoaXMub25LZXkoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIF9hZGRCcnVzaCh0cmFjaykge1xuICAgIGlmICh0cmFjay4kYnJ1c2gpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBicnVzaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3JlY3QnKTtcbiAgICBicnVzaC5zdHlsZS5maWxsID0gJyM2ODY4NjgnO1xuICAgIGJydXNoLnN0eWxlLm9wYWNpdHkgPSAwLjI7XG5cbiAgICB0cmFjay4kaW50ZXJhY3Rpb25zLmFwcGVuZENoaWxkKGJydXNoKTtcbiAgICB0cmFjay4kYnJ1c2ggPSBicnVzaDtcbiAgfVxuXG4gIF9yZW1vdmVCcnVzaCh0cmFjaykge1xuICAgIGlmICh0cmFjay4kYnJ1c2ggPT09IG51bGwpIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLl9yZXNldEJydXNoKHRyYWNrKTtcbiAgICB0cmFjay4kaW50ZXJhY3Rpb25zLnJlbW92ZUNoaWxkKHRyYWNrLiRicnVzaCk7XG4gICAgZGVsZXRlIHRyYWNrLiRicnVzaDtcbiAgfVxuXG4gIF9yZXNldEJydXNoKHRyYWNrKSB7XG4gICAgY29uc3QgJGJydXNoID0gdHJhY2suJGJydXNoO1xuICAgIC8vIHJlc2V0IGJydXNoIGVsZW1lbnRcbiAgICAkYnJ1c2guc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwgMCknKTtcbiAgICAkYnJ1c2guc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgMCk7XG4gICAgJGJydXNoLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCAwKTtcbiAgfVxuXG4gIF91cGRhdGVCcnVzaChlLCB0cmFjaykge1xuICAgIGNvbnN0ICRicnVzaCA9IHRyYWNrLiRicnVzaDtcbiAgICBjb25zdCB0cmFuc2xhdGUgPSBgdHJhbnNsYXRlKCR7ZS5hcmVhLmxlZnR9LCAke2UuYXJlYS50b3B9KWA7XG5cbiAgICAkYnJ1c2guc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIHRyYW5zbGF0ZSk7XG4gICAgJGJydXNoLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIGUuYXJlYS53aWR0aCk7XG4gICAgJGJydXNoLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBlLmFyZWEuaGVpZ2h0KTtcbiAgfVxuXG4gIG9uS2V5KGUpIHtcbiAgICB0aGlzLnNoaWZ0S2V5ID0gZS5zaGlmdEtleTtcbiAgfVxuXG4gIG9uTW91c2VEb3duKGUpIHtcbiAgICB0aGlzLl9jdXJyZW50VHJhY2sgPSB0aGlzLnRpbWVsaW5lLmdldFRyYWNrRnJvbURPTUVsZW1lbnQoZS50YXJnZXQpO1xuICAgIGlmICghdGhpcy5fY3VycmVudFRyYWNrKSB7IHJldHVybjsgfVxuXG4gICAgdGhpcy5fYWRkQnJ1c2godGhpcy5fY3VycmVudFRyYWNrKTtcblxuICAgIC8vIHJlY3JlYXRlIHRoZSBtYXBcbiAgICB0aGlzLl9sYXllclNlbGVjdGVkSXRlbXNNYXAgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5fY3VycmVudFRyYWNrLmxheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgICAgdGhpcy5fbGF5ZXJTZWxlY3RlZEl0ZW1zTWFwLnNldChsYXllciwgbGF5ZXIuc2VsZWN0ZWRJdGVtcy5zbGljZSgwKSk7XG4gICAgfSk7XG4gIH1cblxuICBvbk1vdXNlTW92ZShlKSB7XG4gICAgdGhpcy5fdXBkYXRlQnJ1c2goZSwgdGhpcy5fY3VycmVudFRyYWNrKTtcblxuICAgIHRoaXMuX2N1cnJlbnRUcmFjay5sYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHtcbiAgICAgIGNvbnN0IGN1cnJlbnRTZWxlY3Rpb24gPSBsYXllci5zZWxlY3RlZEl0ZW1zO1xuICAgICAgY29uc3QgY3VycmVudEl0ZW1zID0gbGF5ZXIuZ2V0SXRlbXNJbkFyZWEoZS5hcmVhKTtcblxuICAgICAgLy8gaWYgaXMgbm90IHByZXNzZWRcbiAgICAgIGlmICghZS5vcmlnaW5hbEV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgIGxheWVyLnVuc2VsZWN0KGN1cnJlbnRTZWxlY3Rpb24pO1xuICAgICAgICBsYXllci5zZWxlY3QoY3VycmVudEl0ZW1zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHRvU2VsZWN0ID0gW107XG4gICAgICAgIGNvbnN0IHRvVW5zZWxlY3QgPSBbXTtcbiAgICAgICAgLy8gdXNlIHRoZSBzZWxlY3Rpb24gZnJvbSB0aGUgcHJldmlvdXMgZHJhZ1xuICAgICAgICBjb25zdCBwcmV2aW91c1NlbGVjdGlvbiA9IHRoaXMuX2xheWVyU2VsZWN0ZWRJdGVtc01hcC5nZXQobGF5ZXIpO1xuICAgICAgICAvLyB0b1Vuc2VsZWN0ID0gdG9VbnNlbGVjdC5jb25jYXQocHJldmlvdXNTZWxlY3RlZEl0ZW1zKTtcblxuICAgICAgICBjdXJyZW50SXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgIGlmIChwcmV2aW91c1NlbGVjdGlvbi5pbmRleE9mKGl0ZW0pID09PSAtMSkge1xuICAgICAgICAgICAgdG9TZWxlY3QucHVzaChpdGVtKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdG9VbnNlbGVjdC5wdXNoKGl0ZW0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgY3VycmVudFNlbGVjdGlvbi5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgY3VycmVudEl0ZW1zLmluZGV4T2YoaXRlbSkgPT09IC0xICYmXG4gICAgICAgICAgICBwcmV2aW91c1NlbGVjdGlvbi5pbmRleE9mKGl0ZW0pID09PSAtMVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgdG9VbnNlbGVjdC5wdXNoKGl0ZW0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGF5ZXIudW5zZWxlY3QodG9VbnNlbGVjdCk7XG4gICAgICAgIGxheWVyLnNlbGVjdCh0b1NlbGVjdCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBvbk1vdXNlVXAoZSkge1xuICAgIHRoaXMuX3JlbW92ZUJydXNoKHRoaXMuX2N1cnJlbnRUcmFjayk7XG4gIH1cblxuICBvbkNsaWNrKGUpIHtcbiAgICBpZiAoIXRoaXMuX2N1cnJlbnRUcmFjaykgeyByZXR1cm47IH1cblxuICAgIHRoaXMuX2N1cnJlbnRUcmFjay5sYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHtcbiAgICAgIGxldCBpdGVtID0gbGF5ZXIuZ2V0SXRlbUZyb21ET01FbGVtZW50KGUudGFyZ2V0KTtcblxuICAgICAgaWYgKCFlLm9yaWdpbmFsRXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgICAgbGF5ZXIudW5zZWxlY3QoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgbGF5ZXIudG9nZ2xlU2VsZWN0aW9uKGl0ZW0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iXX0=