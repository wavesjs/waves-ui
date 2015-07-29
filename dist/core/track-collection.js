'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _get = require('babel-runtime/helpers/get')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

var _layer = require('./layer');

var _layer2 = _interopRequireDefault(_layer);

/**
 * The `TrackCollection` class allow to update all timeline's tracks at once
 */

var TrackCollection = (function (_Array) {
  function TrackCollection(timeline) {
    _classCallCheck(this, TrackCollection);

    _get(Object.getPrototypeOf(TrackCollection.prototype), 'constructor', this).call(this);

    this._timeline = timeline;
  }

  _inherits(TrackCollection, _Array);

  _createClass(TrackCollection, [{
    key: '_getLayersOrGroups',

    // @TODO
    // this should be in the timeline
    value: function _getLayersOrGroups() {
      var layerOrGroup = arguments[0] === undefined ? null : arguments[0];

      var layers = null;

      if (typeof layerOrGroup === 'string') {
        layers = this._timeline.groupedLayers[layerOrGroup];
      } else if (layerOrGroup instanceof _layer2['default']) {
        layers = [layerOrGroup];
      } else {
        layers = this.layers;
      }

      return layers;
    }
  }, {
    key: 'height',

    // @NOTE keep this ?
    // could prepare some vertical resizing ability
    // this should be able to modify the layers yScale to be really usefull

    set: function (value) {
      this.forEach(function (track) {
        return track.height = value;
      });
    }
  }, {
    key: 'layers',

    // access layers
    get: function () {
      var layers = [];
      this.forEach(function (track) {
        return layers = layers.concat(track.layers);
      });

      return layers;
    }
  }, {
    key: 'render',
    value: function render() {
      this.forEach(function (track) {
        return track.render();
      });
      this._timeline.emit('render');
    }
  }, {
    key: 'update',

    // should be update(...layersOrGroups)
    value: function update(layerOrGroup) {
      var layers = this._getLayersOrGroups(layerOrGroup);
      this.forEach(function (track) {
        return track.update(layers);
      });
      this._timeline.emit('update', layers);
    }
  }, {
    key: 'updateContainer',
    value: function updateContainer(trackOrTrackIds) {
      this.forEach(function (track) {
        return track.updateContainer();
      });
      this._timeline.emit('update:containers');
    }
  }, {
    key: 'updateLayers',
    value: function updateLayers(layerOrGroup) {
      var layers = this._getLayersOrGroups(layerOrGroup);
      this.forEach(function (track) {
        return track.updateLayers(layers);
      });
      this._timeline.emit('update:layers', layers);
    }
  }]);

  return TrackCollection;
})(Array);

exports['default'] = TrackCollection;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O3FCQUFrQixTQUFTOzs7Ozs7OztJQUlOLGVBQWU7QUFDdkIsV0FEUSxlQUFlLENBQ3RCLFFBQVEsRUFBRTswQkFESCxlQUFlOztBQUVoQywrQkFGaUIsZUFBZSw2Q0FFeEI7O0FBRVIsUUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7R0FDM0I7O1lBTGtCLGVBQWU7O2VBQWYsZUFBZTs7Ozs7V0FTaEIsOEJBQXNCO1VBQXJCLFlBQVksZ0NBQUcsSUFBSTs7QUFDcEMsVUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDOztBQUVsQixVQUFJLE9BQU8sWUFBWSxLQUFLLFFBQVEsRUFBRTtBQUNwQyxjQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7T0FDckQsTUFBTSxJQUFJLFlBQVksOEJBQWlCLEVBQUU7QUFDeEMsY0FBTSxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7T0FDekIsTUFBTTtBQUNMLGNBQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO09BQ3RCOztBQUVELGFBQU8sTUFBTSxDQUFDO0tBQ2Y7Ozs7Ozs7O1NBTVMsVUFBQyxLQUFLLEVBQUU7QUFDaEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUs7ZUFBSyxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUs7T0FBQSxDQUFDLENBQUM7S0FDL0M7Ozs7O1NBR1MsWUFBRztBQUNYLFVBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNoQixVQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztlQUFLLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7T0FBQSxDQUFDLENBQUM7O0FBRTlELGFBQU8sTUFBTSxDQUFDO0tBQ2Y7OztXQUVLLGtCQUFHO0FBQ1AsVUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUs7ZUFBSyxLQUFLLENBQUMsTUFBTSxFQUFFO09BQUEsQ0FBQyxDQUFDO0FBQ3hDLFVBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQy9COzs7OztXQUdLLGdCQUFDLFlBQVksRUFBRTtBQUNuQixVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDckQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUs7ZUFBSyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztPQUFBLENBQUMsQ0FBQztBQUM5QyxVQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDdkM7OztXQUVjLHlCQUFDLGVBQWUsRUFBRTtBQUMvQixVQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztlQUFLLEtBQUssQ0FBQyxlQUFlLEVBQUU7T0FBQSxDQUFDLENBQUM7QUFDakQsVUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztLQUMxQzs7O1dBRVcsc0JBQUMsWUFBWSxFQUFFO0FBQ3pCLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNyRCxVQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztlQUFLLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO09BQUEsQ0FBQyxDQUFDO0FBQ3BELFVBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxNQUFNLENBQUMsQ0FBQztLQUM5Qzs7O1NBNURrQixlQUFlO0dBQVMsS0FBSzs7cUJBQTdCLGVBQWUiLCJmaWxlIjoiZXM2L3V0aWxzL29ydGhvZ29uYWwtZGF0YS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMYXllciBmcm9tICcuL2xheWVyJztcbi8qKlxuICogVGhlIGBUcmFja0NvbGxlY3Rpb25gIGNsYXNzIGFsbG93IHRvIHVwZGF0ZSBhbGwgdGltZWxpbmUncyB0cmFja3MgYXQgb25jZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmFja0NvbGxlY3Rpb24gZXh0ZW5kcyBBcnJheSB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuX3RpbWVsaW5lID0gdGltZWxpbmU7XG4gIH1cblxuICAvLyBAVE9ET1xuICAvLyB0aGlzIHNob3VsZCBiZSBpbiB0aGUgdGltZWxpbmVcbiAgX2dldExheWVyc09yR3JvdXBzKGxheWVyT3JHcm91cCA9IG51bGwpIHtcbiAgICBsZXQgbGF5ZXJzID0gbnVsbDtcblxuICAgIGlmICh0eXBlb2YgbGF5ZXJPckdyb3VwID09PSAnc3RyaW5nJykge1xuICAgICAgbGF5ZXJzID0gdGhpcy5fdGltZWxpbmUuZ3JvdXBlZExheWVyc1tsYXllck9yR3JvdXBdO1xuICAgIH0gZWxzZSBpZiAobGF5ZXJPckdyb3VwIGluc3RhbmNlb2YgTGF5ZXIpIHtcbiAgICAgIGxheWVycyA9IFtsYXllck9yR3JvdXBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsYXllcnMgPSB0aGlzLmxheWVycztcbiAgICB9XG5cbiAgICByZXR1cm4gbGF5ZXJzO1xuICB9XG5cbiAgLy8gQE5PVEUga2VlcCB0aGlzID9cbiAgLy8gY291bGQgcHJlcGFyZSBzb21lIHZlcnRpY2FsIHJlc2l6aW5nIGFiaWxpdHlcbiAgLy8gdGhpcyBzaG91bGQgYmUgYWJsZSB0byBtb2RpZnkgdGhlIGxheWVycyB5U2NhbGUgdG8gYmUgcmVhbGx5IHVzZWZ1bGxcblxuICBzZXQgaGVpZ2h0KHZhbHVlKSB7XG4gICAgdGhpcy5mb3JFYWNoKCh0cmFjaykgPT4gdHJhY2suaGVpZ2h0ID0gdmFsdWUpO1xuICB9XG5cbiAgLy8gYWNjZXNzIGxheWVyc1xuICBnZXQgbGF5ZXJzKCkge1xuICAgIGxldCBsYXllcnMgPSBbXTtcbiAgICB0aGlzLmZvckVhY2goKHRyYWNrKSA9PiBsYXllcnMgPSBsYXllcnMuY29uY2F0KHRyYWNrLmxheWVycykpO1xuXG4gICAgcmV0dXJuIGxheWVycztcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICB0aGlzLmZvckVhY2goKHRyYWNrKSA9PiB0cmFjay5yZW5kZXIoKSk7XG4gICAgdGhpcy5fdGltZWxpbmUuZW1pdCgncmVuZGVyJyk7XG4gIH1cblxuICAvLyBzaG91bGQgYmUgdXBkYXRlKC4uLmxheWVyc09yR3JvdXBzKVxuICB1cGRhdGUobGF5ZXJPckdyb3VwKSB7XG4gICAgY29uc3QgbGF5ZXJzID0gdGhpcy5fZ2V0TGF5ZXJzT3JHcm91cHMobGF5ZXJPckdyb3VwKTtcbiAgICB0aGlzLmZvckVhY2goKHRyYWNrKSA9PiB0cmFjay51cGRhdGUobGF5ZXJzKSk7XG4gICAgdGhpcy5fdGltZWxpbmUuZW1pdCgndXBkYXRlJywgbGF5ZXJzKTtcbiAgfVxuXG4gIHVwZGF0ZUNvbnRhaW5lcih0cmFja09yVHJhY2tJZHMpIHtcbiAgICB0aGlzLmZvckVhY2goKHRyYWNrKSA9PiB0cmFjay51cGRhdGVDb250YWluZXIoKSk7XG4gICAgdGhpcy5fdGltZWxpbmUuZW1pdCgndXBkYXRlOmNvbnRhaW5lcnMnKTtcbiAgfVxuXG4gIHVwZGF0ZUxheWVycyhsYXllck9yR3JvdXApIHtcbiAgICBjb25zdCBsYXllcnMgPSB0aGlzLl9nZXRMYXllcnNPckdyb3VwcyhsYXllck9yR3JvdXApO1xuICAgIHRoaXMuZm9yRWFjaCgodHJhY2spID0+IHRyYWNrLnVwZGF0ZUxheWVycyhsYXllcnMpKTtcbiAgICB0aGlzLl90aW1lbGluZS5lbWl0KCd1cGRhdGU6bGF5ZXJzJywgbGF5ZXJzKTtcbiAgfVxufVxuIl19