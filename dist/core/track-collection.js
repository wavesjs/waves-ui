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
 * Collection hosting all the `Track` instances registered into the timeline. It provides shorcuts to trigger `render` / `update` methods on tracks or layers. Extend built-in Array
 */

var TrackCollection = (function (_Array) {
  _inherits(TrackCollection, _Array);

  function TrackCollection(timeline) {
    _classCallCheck(this, TrackCollection);

    _get(Object.getPrototypeOf(TrackCollection.prototype), 'constructor', this).call(this);

    this._timeline = timeline;
  }

  // @note - should be in the timeline ?
  // @todo - allow to pass an array of layers

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

    /**
     * @type {Number} - Updates the height of all tracks at once.
     * @todo - Propagate to layers, not usefull for now.
     */
  }, {
    key: 'render',

    /**
     * Render all tracks and layers. When done, the timeline triggers a `render` event.
     */
    value: function render() {
      this.forEach(function (track) {
        return track.render();
      });
      this._timeline.emit('render');
    }

    /**
     * Updates all tracks and layers. When done, the timeline triggers a `update` event.
     * @param {Layer|String} layerOrGroup - Filter the layers to update by passing the `Layer` instance to update or a `groupId`
     */
  }, {
    key: 'update',
    value: function update(layerOrGroup) {
      var layers = this._getLayersOrGroups(layerOrGroup);
      this.forEach(function (track) {
        return track.update(layers);
      });
      this._timeline.emit('update', layers);
    }

    /**
     * Updates all `Track` containers, layers are not updated with this method. When done, the timeline triggers a `update:containers` event.
     */
  }, {
    key: 'updateContainer',
    value: function updateContainer() /* trackOrTrackIds */{
      this.forEach(function (track) {
        return track.updateContainer();
      });
      this._timeline.emit('update:containers');
    }

    /**
     * Updates all layers. When done, the timeline triggers a `update:layers` event.
     * @param {Layer|String} layerOrGroup - Filter the layers to update by passing the `Layer` instance to update or a `groupId`
     */
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

    /**
     * @type {Array<Layer>} - An array of all registered layers.
     */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jb3JlL3RyYWNrLWNvbGxlY3Rpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztxQkFBa0IsU0FBUzs7Ozs7Ozs7SUFNTixlQUFlO1lBQWYsZUFBZTs7QUFDdkIsV0FEUSxlQUFlLENBQ3RCLFFBQVEsRUFBRTswQkFESCxlQUFlOztBQUVoQywrQkFGaUIsZUFBZSw2Q0FFeEI7O0FBRVIsUUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7R0FDM0I7Ozs7O2VBTGtCLGVBQWU7O1dBU2hCLDhCQUFzQjtVQUFyQixZQUFZLHlEQUFHLElBQUk7O0FBQ3BDLFVBQUksTUFBTSxHQUFHLElBQUksQ0FBQzs7QUFFbEIsVUFBSSxPQUFPLFlBQVksS0FBSyxRQUFRLEVBQUU7QUFDcEMsY0FBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO09BQ3JELE1BQU0sSUFBSSxZQUFZLDhCQUFpQixFQUFFO0FBQ3hDLGNBQU0sR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO09BQ3pCLE1BQU07QUFDTCxjQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztPQUN0Qjs7QUFFRCxhQUFPLE1BQU0sQ0FBQztLQUNmOzs7Ozs7Ozs7Ozs7Ozs7O1dBMkJLLGtCQUFHO0FBQ1AsVUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUs7ZUFBSyxLQUFLLENBQUMsTUFBTSxFQUFFO09BQUEsQ0FBQyxDQUFDO0FBQ3hDLFVBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQy9COzs7Ozs7OztXQU1LLGdCQUFDLFlBQVksRUFBRTtBQUNuQixVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDckQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUs7ZUFBSyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztPQUFBLENBQUMsQ0FBQztBQUM5QyxVQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDdkM7Ozs7Ozs7V0FLYyxnREFBd0I7QUFDckMsVUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUs7ZUFBSyxLQUFLLENBQUMsZUFBZSxFQUFFO09BQUEsQ0FBQyxDQUFDO0FBQ2pELFVBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7S0FDMUM7Ozs7Ozs7O1dBTVcsc0JBQUMsWUFBWSxFQUFFO0FBQ3pCLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNyRCxVQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztlQUFLLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO09BQUEsQ0FBQyxDQUFDO0FBQ3BELFVBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxNQUFNLENBQUMsQ0FBQztLQUM5Qzs7O1NBaERTLGFBQUMsS0FBSyxFQUFFO0FBQ2hCLFVBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLO2VBQUssS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLO09BQUEsQ0FBQyxDQUFDO0tBQy9DOzs7Ozs7O1NBS1MsZUFBRztBQUNYLFVBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNoQixVQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztlQUFLLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7T0FBQSxDQUFDLENBQUM7O0FBRTlELGFBQU8sTUFBTSxDQUFDO0tBQ2Y7OztTQTNDa0IsZUFBZTtHQUFTLEtBQUs7O3FCQUE3QixlQUFlIiwiZmlsZSI6InNyYy9jb3JlL3RyYWNrLWNvbGxlY3Rpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTGF5ZXIgZnJvbSAnLi9sYXllcic7XG5cblxuLyoqXG4gKiBDb2xsZWN0aW9uIGhvc3RpbmcgYWxsIHRoZSBgVHJhY2tgIGluc3RhbmNlcyByZWdpc3RlcmVkIGludG8gdGhlIHRpbWVsaW5lLiBJdCBwcm92aWRlcyBzaG9yY3V0cyB0byB0cmlnZ2VyIGByZW5kZXJgIC8gYHVwZGF0ZWAgbWV0aG9kcyBvbiB0cmFja3Mgb3IgbGF5ZXJzLiBFeHRlbmQgYnVpbHQtaW4gQXJyYXlcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhY2tDb2xsZWN0aW9uIGV4dGVuZHMgQXJyYXkge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLl90aW1lbGluZSA9IHRpbWVsaW5lO1xuICB9XG5cbiAgLy8gQG5vdGUgLSBzaG91bGQgYmUgaW4gdGhlIHRpbWVsaW5lID9cbiAgLy8gQHRvZG8gLSBhbGxvdyB0byBwYXNzIGFuIGFycmF5IG9mIGxheWVyc1xuICBfZ2V0TGF5ZXJzT3JHcm91cHMobGF5ZXJPckdyb3VwID0gbnVsbCkge1xuICAgIGxldCBsYXllcnMgPSBudWxsO1xuXG4gICAgaWYgKHR5cGVvZiBsYXllck9yR3JvdXAgPT09ICdzdHJpbmcnKSB7XG4gICAgICBsYXllcnMgPSB0aGlzLl90aW1lbGluZS5ncm91cGVkTGF5ZXJzW2xheWVyT3JHcm91cF07XG4gICAgfSBlbHNlIGlmIChsYXllck9yR3JvdXAgaW5zdGFuY2VvZiBMYXllcikge1xuICAgICAgbGF5ZXJzID0gW2xheWVyT3JHcm91cF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxheWVycyA9IHRoaXMubGF5ZXJzO1xuICAgIH1cblxuICAgIHJldHVybiBsYXllcnM7XG4gIH1cblxuICAvLyBATk9URSBrZWVwIHRoaXMgP1xuICAvLyBjb3VsZCBwcmVwYXJlIHNvbWUgdmVydGljYWwgcmVzaXppbmcgYWJpbGl0eVxuICAvLyB0aGlzIHNob3VsZCBiZSBhYmxlIHRvIG1vZGlmeSB0aGUgbGF5ZXJzIHlTY2FsZSB0byBiZSByZWFsbHkgdXNlZnVsbFxuXG4gIC8qKlxuICAgKiBAdHlwZSB7TnVtYmVyfSAtIFVwZGF0ZXMgdGhlIGhlaWdodCBvZiBhbGwgdHJhY2tzIGF0IG9uY2UuXG4gICAqIEB0b2RvIC0gUHJvcGFnYXRlIHRvIGxheWVycywgbm90IHVzZWZ1bGwgZm9yIG5vdy5cbiAgICovXG4gIHNldCBoZWlnaHQodmFsdWUpIHtcbiAgICB0aGlzLmZvckVhY2goKHRyYWNrKSA9PiB0cmFjay5oZWlnaHQgPSB2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogQHR5cGUge0FycmF5PExheWVyPn0gLSBBbiBhcnJheSBvZiBhbGwgcmVnaXN0ZXJlZCBsYXllcnMuXG4gICAqL1xuICBnZXQgbGF5ZXJzKCkge1xuICAgIGxldCBsYXllcnMgPSBbXTtcbiAgICB0aGlzLmZvckVhY2goKHRyYWNrKSA9PiBsYXllcnMgPSBsYXllcnMuY29uY2F0KHRyYWNrLmxheWVycykpO1xuXG4gICAgcmV0dXJuIGxheWVycztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgYWxsIHRyYWNrcyBhbmQgbGF5ZXJzLiBXaGVuIGRvbmUsIHRoZSB0aW1lbGluZSB0cmlnZ2VycyBhIGByZW5kZXJgIGV2ZW50LlxuICAgKi9cbiAgcmVuZGVyKCkge1xuICAgIHRoaXMuZm9yRWFjaCgodHJhY2spID0+IHRyYWNrLnJlbmRlcigpKTtcbiAgICB0aGlzLl90aW1lbGluZS5lbWl0KCdyZW5kZXInKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIGFsbCB0cmFja3MgYW5kIGxheWVycy4gV2hlbiBkb25lLCB0aGUgdGltZWxpbmUgdHJpZ2dlcnMgYSBgdXBkYXRlYCBldmVudC5cbiAgICogQHBhcmFtIHtMYXllcnxTdHJpbmd9IGxheWVyT3JHcm91cCAtIEZpbHRlciB0aGUgbGF5ZXJzIHRvIHVwZGF0ZSBieSBwYXNzaW5nIHRoZSBgTGF5ZXJgIGluc3RhbmNlIHRvIHVwZGF0ZSBvciBhIGBncm91cElkYFxuICAgKi9cbiAgdXBkYXRlKGxheWVyT3JHcm91cCkge1xuICAgIGNvbnN0IGxheWVycyA9IHRoaXMuX2dldExheWVyc09yR3JvdXBzKGxheWVyT3JHcm91cCk7XG4gICAgdGhpcy5mb3JFYWNoKCh0cmFjaykgPT4gdHJhY2sudXBkYXRlKGxheWVycykpO1xuICAgIHRoaXMuX3RpbWVsaW5lLmVtaXQoJ3VwZGF0ZScsIGxheWVycyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyBhbGwgYFRyYWNrYCBjb250YWluZXJzLCBsYXllcnMgYXJlIG5vdCB1cGRhdGVkIHdpdGggdGhpcyBtZXRob2QuIFdoZW4gZG9uZSwgdGhlIHRpbWVsaW5lIHRyaWdnZXJzIGEgYHVwZGF0ZTpjb250YWluZXJzYCBldmVudC5cbiAgICovXG4gIHVwZGF0ZUNvbnRhaW5lcigvKiB0cmFja09yVHJhY2tJZHMgKi8pIHtcbiAgICB0aGlzLmZvckVhY2goKHRyYWNrKSA9PiB0cmFjay51cGRhdGVDb250YWluZXIoKSk7XG4gICAgdGhpcy5fdGltZWxpbmUuZW1pdCgndXBkYXRlOmNvbnRhaW5lcnMnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIGFsbCBsYXllcnMuIFdoZW4gZG9uZSwgdGhlIHRpbWVsaW5lIHRyaWdnZXJzIGEgYHVwZGF0ZTpsYXllcnNgIGV2ZW50LlxuICAgKiBAcGFyYW0ge0xheWVyfFN0cmluZ30gbGF5ZXJPckdyb3VwIC0gRmlsdGVyIHRoZSBsYXllcnMgdG8gdXBkYXRlIGJ5IHBhc3NpbmcgdGhlIGBMYXllcmAgaW5zdGFuY2UgdG8gdXBkYXRlIG9yIGEgYGdyb3VwSWRgXG4gICAqL1xuICB1cGRhdGVMYXllcnMobGF5ZXJPckdyb3VwKSB7XG4gICAgY29uc3QgbGF5ZXJzID0gdGhpcy5fZ2V0TGF5ZXJzT3JHcm91cHMobGF5ZXJPckdyb3VwKTtcbiAgICB0aGlzLmZvckVhY2goKHRyYWNrKSA9PiB0cmFjay51cGRhdGVMYXllcnMobGF5ZXJzKSk7XG4gICAgdGhpcy5fdGltZWxpbmUuZW1pdCgndXBkYXRlOmxheWVycycsIGxheWVycyk7XG4gIH1cbn1cbiJdfQ==