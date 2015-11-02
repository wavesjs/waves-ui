'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _layer = require('./layer');

var _layer2 = _interopRequireDefault(_layer);

/**
 * The `TrackCollection` class allow to update all timeline's tracks at once
 */

var TrackCollection = (function (_Array) {
  _inherits(TrackCollection, _Array);

  function TrackCollection(timeline) {
    _classCallCheck(this, TrackCollection);

    _get(Object.getPrototypeOf(TrackCollection.prototype), 'constructor', this).call(this);

    this._timeline = timeline;
  }

  // @note - should be in the timeline ?

  _createClass(TrackCollection, [{
    key: '_getLayersOrGroups',
    value: function _getLayersOrGroups() {
      var layerOrGroup = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

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

    // @NOTE keep this ?
    // could prepare some vertical resizing ability
    // this should be able to modify the layers yScale to be really usefull

  }, {
    key: 'render',
    value: function render() {
      this.forEach(function (track) {
        return track.render();
      });
      this._timeline.emit('render');
    }

    // should be update(...layersOrGroups)
  }, {
    key: 'update',
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
  }, {
    key: 'height',
    set: function set(value) {
      this.forEach(function (track) {
        return track.height = value;
      });
    }

    // access layers
  }, {
    key: 'layers',
    get: function get() {
      var layers = [];
      this.forEach(function (track) {
        return layers = layers.concat(track.layers);
      });

      return layers;
    }
  }]);

  return TrackCollection;
})(Array);

exports['default'] = TrackCollection;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jb3JlL3RyYWNrLWNvbGxlY3Rpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztxQkFBa0IsU0FBUzs7Ozs7Ozs7SUFNTixlQUFlO1lBQWYsZUFBZTs7QUFDdkIsV0FEUSxlQUFlLENBQ3RCLFFBQVEsRUFBRTswQkFESCxlQUFlOztBQUVoQywrQkFGaUIsZUFBZSw2Q0FFeEI7O0FBRVIsUUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7R0FDM0I7Ozs7ZUFMa0IsZUFBZTs7V0FRaEIsOEJBQXNCO1VBQXJCLFlBQVkseURBQUcsSUFBSTs7QUFDcEMsVUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDOztBQUVsQixVQUFJLE9BQU8sWUFBWSxLQUFLLFFBQVEsRUFBRTtBQUNwQyxjQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7T0FDckQsTUFBTSxJQUFJLFlBQVksOEJBQWlCLEVBQUU7QUFDeEMsY0FBTSxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7T0FDekIsTUFBTTtBQUNMLGNBQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO09BQ3RCOztBQUVELGFBQU8sTUFBTSxDQUFDO0tBQ2Y7Ozs7Ozs7O1dBa0JLLGtCQUFHO0FBQ1AsVUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUs7ZUFBSyxLQUFLLENBQUMsTUFBTSxFQUFFO09BQUEsQ0FBQyxDQUFDO0FBQ3hDLFVBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQy9COzs7OztXQUdLLGdCQUFDLFlBQVksRUFBRTtBQUNuQixVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDckQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUs7ZUFBSyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztPQUFBLENBQUMsQ0FBQztBQUM5QyxVQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDdkM7OztXQUVjLHlCQUFDLGVBQWUsRUFBRTtBQUMvQixVQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztlQUFLLEtBQUssQ0FBQyxlQUFlLEVBQUU7T0FBQSxDQUFDLENBQUM7QUFDakQsVUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztLQUMxQzs7O1dBRVcsc0JBQUMsWUFBWSxFQUFFO0FBQ3pCLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNyRCxVQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztlQUFLLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO09BQUEsQ0FBQyxDQUFDO0FBQ3BELFVBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxNQUFNLENBQUMsQ0FBQztLQUM5Qzs7O1NBakNTLGFBQUMsS0FBSyxFQUFFO0FBQ2hCLFVBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLO2VBQUssS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLO09BQUEsQ0FBQyxDQUFDO0tBQy9DOzs7OztTQUdTLGVBQUc7QUFDWCxVQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDaEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUs7ZUFBSyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO09BQUEsQ0FBQyxDQUFDOztBQUU5RCxhQUFPLE1BQU0sQ0FBQztLQUNmOzs7U0FwQ2tCLGVBQWU7R0FBUyxLQUFLOztxQkFBN0IsZUFBZSIsImZpbGUiOiJzcmMvY29yZS90cmFjay1jb2xsZWN0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExheWVyIGZyb20gJy4vbGF5ZXInO1xuXG5cbi8qKlxuICogVGhlIGBUcmFja0NvbGxlY3Rpb25gIGNsYXNzIGFsbG93IHRvIHVwZGF0ZSBhbGwgdGltZWxpbmUncyB0cmFja3MgYXQgb25jZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmFja0NvbGxlY3Rpb24gZXh0ZW5kcyBBcnJheSB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuX3RpbWVsaW5lID0gdGltZWxpbmU7XG4gIH1cblxuICAvLyBAbm90ZSAtIHNob3VsZCBiZSBpbiB0aGUgdGltZWxpbmUgP1xuICBfZ2V0TGF5ZXJzT3JHcm91cHMobGF5ZXJPckdyb3VwID0gbnVsbCkge1xuICAgIGxldCBsYXllcnMgPSBudWxsO1xuXG4gICAgaWYgKHR5cGVvZiBsYXllck9yR3JvdXAgPT09ICdzdHJpbmcnKSB7XG4gICAgICBsYXllcnMgPSB0aGlzLl90aW1lbGluZS5ncm91cGVkTGF5ZXJzW2xheWVyT3JHcm91cF07XG4gICAgfSBlbHNlIGlmIChsYXllck9yR3JvdXAgaW5zdGFuY2VvZiBMYXllcikge1xuICAgICAgbGF5ZXJzID0gW2xheWVyT3JHcm91cF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxheWVycyA9IHRoaXMubGF5ZXJzO1xuICAgIH1cblxuICAgIHJldHVybiBsYXllcnM7XG4gIH1cblxuICAvLyBATk9URSBrZWVwIHRoaXMgP1xuICAvLyBjb3VsZCBwcmVwYXJlIHNvbWUgdmVydGljYWwgcmVzaXppbmcgYWJpbGl0eVxuICAvLyB0aGlzIHNob3VsZCBiZSBhYmxlIHRvIG1vZGlmeSB0aGUgbGF5ZXJzIHlTY2FsZSB0byBiZSByZWFsbHkgdXNlZnVsbFxuXG4gIHNldCBoZWlnaHQodmFsdWUpIHtcbiAgICB0aGlzLmZvckVhY2goKHRyYWNrKSA9PiB0cmFjay5oZWlnaHQgPSB2YWx1ZSk7XG4gIH1cblxuICAvLyBhY2Nlc3MgbGF5ZXJzXG4gIGdldCBsYXllcnMoKSB7XG4gICAgbGV0IGxheWVycyA9IFtdO1xuICAgIHRoaXMuZm9yRWFjaCgodHJhY2spID0+IGxheWVycyA9IGxheWVycy5jb25jYXQodHJhY2subGF5ZXJzKSk7XG5cbiAgICByZXR1cm4gbGF5ZXJzO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHRoaXMuZm9yRWFjaCgodHJhY2spID0+IHRyYWNrLnJlbmRlcigpKTtcbiAgICB0aGlzLl90aW1lbGluZS5lbWl0KCdyZW5kZXInKTtcbiAgfVxuXG4gIC8vIHNob3VsZCBiZSB1cGRhdGUoLi4ubGF5ZXJzT3JHcm91cHMpXG4gIHVwZGF0ZShsYXllck9yR3JvdXApIHtcbiAgICBjb25zdCBsYXllcnMgPSB0aGlzLl9nZXRMYXllcnNPckdyb3VwcyhsYXllck9yR3JvdXApO1xuICAgIHRoaXMuZm9yRWFjaCgodHJhY2spID0+IHRyYWNrLnVwZGF0ZShsYXllcnMpKTtcbiAgICB0aGlzLl90aW1lbGluZS5lbWl0KCd1cGRhdGUnLCBsYXllcnMpO1xuICB9XG5cbiAgdXBkYXRlQ29udGFpbmVyKHRyYWNrT3JUcmFja0lkcykge1xuICAgIHRoaXMuZm9yRWFjaCgodHJhY2spID0+IHRyYWNrLnVwZGF0ZUNvbnRhaW5lcigpKTtcbiAgICB0aGlzLl90aW1lbGluZS5lbWl0KCd1cGRhdGU6Y29udGFpbmVycycpO1xuICB9XG5cbiAgdXBkYXRlTGF5ZXJzKGxheWVyT3JHcm91cCkge1xuICAgIGNvbnN0IGxheWVycyA9IHRoaXMuX2dldExheWVyc09yR3JvdXBzKGxheWVyT3JHcm91cCk7XG4gICAgdGhpcy5mb3JFYWNoKCh0cmFjaykgPT4gdHJhY2sudXBkYXRlTGF5ZXJzKGxheWVycykpO1xuICAgIHRoaXMuX3RpbWVsaW5lLmVtaXQoJ3VwZGF0ZTpsYXllcnMnLCBsYXllcnMpO1xuICB9XG59XG4iXX0=