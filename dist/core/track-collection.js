'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _layer = require('./layer');

var _layer2 = _interopRequireDefault(_layer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Collection hosting all the `Track` instances registered into the timeline.
 * It provides shorcuts to trigger `render` / `update` methods on tracks or
 * layers. Extend built-in Array
 */
var TrackCollection = function () {
  function TrackCollection(timeline) {
    (0, _classCallCheck3.default)(this, TrackCollection);

    this._timeline = timeline;
    this._tracks = new _set2.default();
  }

  // @note - should be in the timeline ?
  // @todo - allow to pass an array of layers


  (0, _createClass3.default)(TrackCollection, [{
    key: '_getLayersOrGroups',
    value: function _getLayersOrGroups() {
      var layerOrGroup = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      var layers = null;

      if (typeof layerOrGroup === 'string') {
        layers = this._timeline.groupedLayers[layerOrGroup];
      } else if (layerOrGroup instanceof _layer2.default) {
        layers = [layerOrGroup];
      } else {
        layers = this.layers;
      }

      return layers;
    }

    /**
     * @type {Number} - Updates the height of all tracks at once.
     * @todo - Propagate to layers, not usefull for now.
     */

  }, {
    key: 'has',


    /**
     * Check if a given track belongs to the collection.
     *
     * @param {Track} track - Track to be tested
     * @returns {Boolean}
     */
    value: function has(track) {
      return this._tracks.has(track);
    }

    /**
     * Add a track to the collection.
     *
     * @param {Track} track - Track to add to the collection
     */

  }, {
    key: 'add',
    value: function add(track) {
      this._tracks.add(track);
    }

    // @todo

  }, {
    key: 'remove',
    value: function remove(track) {}
  }, {
    key: 'forEach',
    value: function forEach(callback) {
      this._tracks.forEach(callback);
    }

    /**
     * Render all tracks and layers. When done, the timeline triggers a `render` event.
     */

  }, {
    key: 'render',
    value: function render() {
      this._tracks.forEach(function (track) {
        return track.render();
      });
      this._timeline.emit('render');
    }

    /**
     * Updates all tracks and layers. When done, the timeline triggers a
     * `update` event.
     *
     * @todo - filtering is probably broken...
     * @param {Layer|String} layerOrGroup - Filter the layers to update by
     *    passing the `Layer` instance to update or a `groupId`
     */

  }, {
    key: 'update',
    value: function update(layerOrGroup) {
      var layers = this._getLayersOrGroups(layerOrGroup);
      this._tracks.forEach(function (track) {
        return track.update(layers);
      });
      this._timeline.emit('update', layers);
    }

    /**
     * Updates all `Track` containers, layers are not updated with this method.
     * When done, the timeline triggers a `update:containers` event.
     */

  }, {
    key: 'updateContainer',
    value: function updateContainer() /* trackOrTrackIds */{
      this._tracks.forEach(function (track) {
        return track.updateContainer();
      });
      this._timeline.emit('update:containers');
    }

    /**
     * Updates all layers. When done, the timeline triggers a `update:layers` event.
     *
     * @todo - filtering is probably broken...
     * @param {Layer|String} layerOrGroup - Filter the layers to update by
     *    passing the `Layer` instance to update or a `groupId`
     */

  }, {
    key: 'updateLayers',
    value: function updateLayers(layerOrGroup) {
      var layers = this._getLayersOrGroups(layerOrGroup);
      this._tracks.forEach(function (track) {
        return track.updateLayers(layers);
      });
      this._timeline.emit('update:layers', layers);
    }
  }, {
    key: 'height',
    set: function set(value) {
      this._tracks.forEach(function (track) {
        return track.height = value;
      });
    }

    /**
     * An array of all registered layers.
     *
     * @type {Array<Layer>}
     */

  }, {
    key: 'layers',
    get: function get() {
      var layers = [];
      this._tracks.forEach(function (track) {
        return layers = layers.concat(track.layers);
      });

      return layers;
    }
  }]);
  return TrackCollection;
}();

exports.default = TrackCollection;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRyYWNrLWNvbGxlY3Rpb24uanMiXSwibmFtZXMiOlsiVHJhY2tDb2xsZWN0aW9uIiwidGltZWxpbmUiLCJfdGltZWxpbmUiLCJfdHJhY2tzIiwibGF5ZXJPckdyb3VwIiwibGF5ZXJzIiwiZ3JvdXBlZExheWVycyIsInRyYWNrIiwiaGFzIiwiYWRkIiwiY2FsbGJhY2siLCJmb3JFYWNoIiwicmVuZGVyIiwiZW1pdCIsIl9nZXRMYXllcnNPckdyb3VwcyIsInVwZGF0ZSIsInVwZGF0ZUNvbnRhaW5lciIsInVwZGF0ZUxheWVycyIsInZhbHVlIiwiaGVpZ2h0IiwiY29uY2F0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBR0E7Ozs7O0lBS3FCQSxlO0FBQ25CLDJCQUFZQyxRQUFaLEVBQXNCO0FBQUE7O0FBQ3BCLFNBQUtDLFNBQUwsR0FBaUJELFFBQWpCO0FBQ0EsU0FBS0UsT0FBTCxHQUFlLG1CQUFmO0FBQ0Q7O0FBRUQ7QUFDQTs7Ozs7eUNBQ3dDO0FBQUEsVUFBckJDLFlBQXFCLHVFQUFOLElBQU07O0FBQ3RDLFVBQUlDLFNBQVMsSUFBYjs7QUFFQSxVQUFJLE9BQU9ELFlBQVAsS0FBd0IsUUFBNUIsRUFBc0M7QUFDcENDLGlCQUFTLEtBQUtILFNBQUwsQ0FBZUksYUFBZixDQUE2QkYsWUFBN0IsQ0FBVDtBQUNELE9BRkQsTUFFTyxJQUFJQSx1Q0FBSixFQUFtQztBQUN4Q0MsaUJBQVMsQ0FBQ0QsWUFBRCxDQUFUO0FBQ0QsT0FGTSxNQUVBO0FBQ0xDLGlCQUFTLEtBQUtBLE1BQWQ7QUFDRDs7QUFFRCxhQUFPQSxNQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OztBQW9CQTs7Ozs7O3dCQU1JRSxLLEVBQU87QUFDVCxhQUFPLEtBQUtKLE9BQUwsQ0FBYUssR0FBYixDQUFpQkQsS0FBakIsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozt3QkFLSUEsSyxFQUFPO0FBQ1QsV0FBS0osT0FBTCxDQUFhTSxHQUFiLENBQWlCRixLQUFqQjtBQUNEOztBQUVEOzs7OzJCQUNPQSxLLEVBQU8sQ0FBRTs7OzRCQUVSRyxRLEVBQVU7QUFDaEIsV0FBS1AsT0FBTCxDQUFhUSxPQUFiLENBQXFCRCxRQUFyQjtBQUNEOztBQUVEOzs7Ozs7NkJBR1M7QUFDUCxXQUFLUCxPQUFMLENBQWFRLE9BQWIsQ0FBcUI7QUFBQSxlQUFTSixNQUFNSyxNQUFOLEVBQVQ7QUFBQSxPQUFyQjtBQUNBLFdBQUtWLFNBQUwsQ0FBZVcsSUFBZixDQUFvQixRQUFwQjtBQUNEOztBQUVEOzs7Ozs7Ozs7OzsyQkFRT1QsWSxFQUFjO0FBQ25CLFVBQU1DLFNBQVMsS0FBS1Msa0JBQUwsQ0FBd0JWLFlBQXhCLENBQWY7QUFDQSxXQUFLRCxPQUFMLENBQWFRLE9BQWIsQ0FBcUI7QUFBQSxlQUFTSixNQUFNUSxNQUFOLENBQWFWLE1BQWIsQ0FBVDtBQUFBLE9BQXJCO0FBQ0EsV0FBS0gsU0FBTCxDQUFlVyxJQUFmLENBQW9CLFFBQXBCLEVBQThCUixNQUE5QjtBQUNEOztBQUVEOzs7Ozs7O3NDQUlnQixxQkFBdUI7QUFDckMsV0FBS0YsT0FBTCxDQUFhUSxPQUFiLENBQXFCO0FBQUEsZUFBU0osTUFBTVMsZUFBTixFQUFUO0FBQUEsT0FBckI7QUFDQSxXQUFLZCxTQUFMLENBQWVXLElBQWYsQ0FBb0IsbUJBQXBCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7aUNBT2FULFksRUFBYztBQUN6QixVQUFNQyxTQUFTLEtBQUtTLGtCQUFMLENBQXdCVixZQUF4QixDQUFmO0FBQ0EsV0FBS0QsT0FBTCxDQUFhUSxPQUFiLENBQXFCO0FBQUEsZUFBU0osTUFBTVUsWUFBTixDQUFtQlosTUFBbkIsQ0FBVDtBQUFBLE9BQXJCO0FBQ0EsV0FBS0gsU0FBTCxDQUFlVyxJQUFmLENBQW9CLGVBQXBCLEVBQXFDUixNQUFyQztBQUNEOzs7c0JBcEZVYSxLLEVBQU87QUFDaEIsV0FBS2YsT0FBTCxDQUFhUSxPQUFiLENBQXFCLFVBQUNKLEtBQUQ7QUFBQSxlQUFXQSxNQUFNWSxNQUFOLEdBQWVELEtBQTFCO0FBQUEsT0FBckI7QUFDRDs7QUFFRDs7Ozs7Ozs7d0JBS2E7QUFDWCxVQUFJYixTQUFTLEVBQWI7QUFDQSxXQUFLRixPQUFMLENBQWFRLE9BQWIsQ0FBcUI7QUFBQSxlQUFTTixTQUFTQSxPQUFPZSxNQUFQLENBQWNiLE1BQU1GLE1BQXBCLENBQWxCO0FBQUEsT0FBckI7O0FBRUEsYUFBT0EsTUFBUDtBQUNEOzs7OztrQkF4Q2tCTCxlIiwiZmlsZSI6InRyYWNrLWNvbGxlY3Rpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTGF5ZXIgZnJvbSAnLi9sYXllcic7XG5cblxuLyoqXG4gKiBDb2xsZWN0aW9uIGhvc3RpbmcgYWxsIHRoZSBgVHJhY2tgIGluc3RhbmNlcyByZWdpc3RlcmVkIGludG8gdGhlIHRpbWVsaW5lLlxuICogSXQgcHJvdmlkZXMgc2hvcmN1dHMgdG8gdHJpZ2dlciBgcmVuZGVyYCAvIGB1cGRhdGVgIG1ldGhvZHMgb24gdHJhY2tzIG9yXG4gKiBsYXllcnMuIEV4dGVuZCBidWlsdC1pbiBBcnJheVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmFja0NvbGxlY3Rpb24ge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSkge1xuICAgIHRoaXMuX3RpbWVsaW5lID0gdGltZWxpbmU7XG4gICAgdGhpcy5fdHJhY2tzID0gbmV3IFNldCgpO1xuICB9XG5cbiAgLy8gQG5vdGUgLSBzaG91bGQgYmUgaW4gdGhlIHRpbWVsaW5lID9cbiAgLy8gQHRvZG8gLSBhbGxvdyB0byBwYXNzIGFuIGFycmF5IG9mIGxheWVyc1xuICBfZ2V0TGF5ZXJzT3JHcm91cHMobGF5ZXJPckdyb3VwID0gbnVsbCkge1xuICAgIGxldCBsYXllcnMgPSBudWxsO1xuXG4gICAgaWYgKHR5cGVvZiBsYXllck9yR3JvdXAgPT09ICdzdHJpbmcnKSB7XG4gICAgICBsYXllcnMgPSB0aGlzLl90aW1lbGluZS5ncm91cGVkTGF5ZXJzW2xheWVyT3JHcm91cF07XG4gICAgfSBlbHNlIGlmIChsYXllck9yR3JvdXAgaW5zdGFuY2VvZiBMYXllcikge1xuICAgICAgbGF5ZXJzID0gW2xheWVyT3JHcm91cF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxheWVycyA9IHRoaXMubGF5ZXJzO1xuICAgIH1cblxuICAgIHJldHVybiBsYXllcnM7XG4gIH1cblxuICAvKipcbiAgICogQHR5cGUge051bWJlcn0gLSBVcGRhdGVzIHRoZSBoZWlnaHQgb2YgYWxsIHRyYWNrcyBhdCBvbmNlLlxuICAgKiBAdG9kbyAtIFByb3BhZ2F0ZSB0byBsYXllcnMsIG5vdCB1c2VmdWxsIGZvciBub3cuXG4gICAqL1xuICBzZXQgaGVpZ2h0KHZhbHVlKSB7XG4gICAgdGhpcy5fdHJhY2tzLmZvckVhY2goKHRyYWNrKSA9PiB0cmFjay5oZWlnaHQgPSB2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogQW4gYXJyYXkgb2YgYWxsIHJlZ2lzdGVyZWQgbGF5ZXJzLlxuICAgKlxuICAgKiBAdHlwZSB7QXJyYXk8TGF5ZXI+fVxuICAgKi9cbiAgZ2V0IGxheWVycygpIHtcbiAgICBsZXQgbGF5ZXJzID0gW107XG4gICAgdGhpcy5fdHJhY2tzLmZvckVhY2godHJhY2sgPT4gbGF5ZXJzID0gbGF5ZXJzLmNvbmNhdCh0cmFjay5sYXllcnMpKTtcblxuICAgIHJldHVybiBsYXllcnM7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgYSBnaXZlbiB0cmFjayBiZWxvbmdzIHRvIHRoZSBjb2xsZWN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge1RyYWNrfSB0cmFjayAtIFRyYWNrIHRvIGJlIHRlc3RlZFxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgICovXG4gIGhhcyh0cmFjaykge1xuICAgIHJldHVybiB0aGlzLl90cmFja3MuaGFzKHRyYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSB0cmFjayB0byB0aGUgY29sbGVjdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtUcmFja30gdHJhY2sgLSBUcmFjayB0byBhZGQgdG8gdGhlIGNvbGxlY3Rpb25cbiAgICovXG4gIGFkZCh0cmFjaykge1xuICAgIHRoaXMuX3RyYWNrcy5hZGQodHJhY2spO1xuICB9XG5cbiAgLy8gQHRvZG9cbiAgcmVtb3ZlKHRyYWNrKSB7fVxuXG4gIGZvckVhY2goY2FsbGJhY2spIHtcbiAgICB0aGlzLl90cmFja3MuZm9yRWFjaChjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIGFsbCB0cmFja3MgYW5kIGxheWVycy4gV2hlbiBkb25lLCB0aGUgdGltZWxpbmUgdHJpZ2dlcnMgYSBgcmVuZGVyYCBldmVudC5cbiAgICovXG4gIHJlbmRlcigpIHtcbiAgICB0aGlzLl90cmFja3MuZm9yRWFjaCh0cmFjayA9PiB0cmFjay5yZW5kZXIoKSk7XG4gICAgdGhpcy5fdGltZWxpbmUuZW1pdCgncmVuZGVyJyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyBhbGwgdHJhY2tzIGFuZCBsYXllcnMuIFdoZW4gZG9uZSwgdGhlIHRpbWVsaW5lIHRyaWdnZXJzIGFcbiAgICogYHVwZGF0ZWAgZXZlbnQuXG4gICAqXG4gICAqIEB0b2RvIC0gZmlsdGVyaW5nIGlzIHByb2JhYmx5IGJyb2tlbi4uLlxuICAgKiBAcGFyYW0ge0xheWVyfFN0cmluZ30gbGF5ZXJPckdyb3VwIC0gRmlsdGVyIHRoZSBsYXllcnMgdG8gdXBkYXRlIGJ5XG4gICAqICAgIHBhc3NpbmcgdGhlIGBMYXllcmAgaW5zdGFuY2UgdG8gdXBkYXRlIG9yIGEgYGdyb3VwSWRgXG4gICAqL1xuICB1cGRhdGUobGF5ZXJPckdyb3VwKSB7XG4gICAgY29uc3QgbGF5ZXJzID0gdGhpcy5fZ2V0TGF5ZXJzT3JHcm91cHMobGF5ZXJPckdyb3VwKTtcbiAgICB0aGlzLl90cmFja3MuZm9yRWFjaCh0cmFjayA9PiB0cmFjay51cGRhdGUobGF5ZXJzKSk7XG4gICAgdGhpcy5fdGltZWxpbmUuZW1pdCgndXBkYXRlJywgbGF5ZXJzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIGFsbCBgVHJhY2tgIGNvbnRhaW5lcnMsIGxheWVycyBhcmUgbm90IHVwZGF0ZWQgd2l0aCB0aGlzIG1ldGhvZC5cbiAgICogV2hlbiBkb25lLCB0aGUgdGltZWxpbmUgdHJpZ2dlcnMgYSBgdXBkYXRlOmNvbnRhaW5lcnNgIGV2ZW50LlxuICAgKi9cbiAgdXBkYXRlQ29udGFpbmVyKC8qIHRyYWNrT3JUcmFja0lkcyAqLykge1xuICAgIHRoaXMuX3RyYWNrcy5mb3JFYWNoKHRyYWNrID0+IHRyYWNrLnVwZGF0ZUNvbnRhaW5lcigpKTtcbiAgICB0aGlzLl90aW1lbGluZS5lbWl0KCd1cGRhdGU6Y29udGFpbmVycycpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgYWxsIGxheWVycy4gV2hlbiBkb25lLCB0aGUgdGltZWxpbmUgdHJpZ2dlcnMgYSBgdXBkYXRlOmxheWVyc2AgZXZlbnQuXG4gICAqXG4gICAqIEB0b2RvIC0gZmlsdGVyaW5nIGlzIHByb2JhYmx5IGJyb2tlbi4uLlxuICAgKiBAcGFyYW0ge0xheWVyfFN0cmluZ30gbGF5ZXJPckdyb3VwIC0gRmlsdGVyIHRoZSBsYXllcnMgdG8gdXBkYXRlIGJ5XG4gICAqICAgIHBhc3NpbmcgdGhlIGBMYXllcmAgaW5zdGFuY2UgdG8gdXBkYXRlIG9yIGEgYGdyb3VwSWRgXG4gICAqL1xuICB1cGRhdGVMYXllcnMobGF5ZXJPckdyb3VwKSB7XG4gICAgY29uc3QgbGF5ZXJzID0gdGhpcy5fZ2V0TGF5ZXJzT3JHcm91cHMobGF5ZXJPckdyb3VwKTtcbiAgICB0aGlzLl90cmFja3MuZm9yRWFjaCh0cmFjayA9PiB0cmFjay51cGRhdGVMYXllcnMobGF5ZXJzKSk7XG4gICAgdGhpcy5fdGltZWxpbmUuZW1pdCgndXBkYXRlOmxheWVycycsIGxheWVycyk7XG4gIH1cbn1cbiJdfQ==