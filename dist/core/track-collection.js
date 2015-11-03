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
 * Collection hosting all the `Track` instances registered into the timeline.
 * It provides shorcuts to trigger `render` / `update` methods on tracks or
 * layers. Extend built-in Array
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
     * Updates all tracks and layers. When done, the timeline triggers a
     * `update` event.
     *
     * @param {Layer|String} layerOrGroup - Filter the layers to update by
     *    passing the `Layer` instance to update or a `groupId`
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
     * Updates all `Track` containers, layers are not updated with this method.
     * When done, the timeline triggers a `update:containers` event.
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
     *
     * @param {Layer|String} layerOrGroup - Filter the layers to update by
     *    passing the `Layer` instance to update or a `groupId`
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
     * An array of all registered layers.
     *
     * @type {Array<Layer>}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy93YXZlcy11aS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3FCQUFrQixTQUFTOzs7Ozs7Ozs7O0lBUU4sZUFBZTtZQUFmLGVBQWU7O0FBQ3ZCLFdBRFEsZUFBZSxDQUN0QixRQUFRLEVBQUU7MEJBREgsZUFBZTs7QUFFaEMsK0JBRmlCLGVBQWUsNkNBRXhCOztBQUVSLFFBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO0dBQzNCOzs7OztlQUxrQixlQUFlOztXQVNoQiw4QkFBc0I7VUFBckIsWUFBWSx5REFBRyxJQUFJOztBQUNwQyxVQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7O0FBRWxCLFVBQUksT0FBTyxZQUFZLEtBQUssUUFBUSxFQUFFO0FBQ3BDLGNBQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQztPQUNyRCxNQUFNLElBQUksWUFBWSw4QkFBaUIsRUFBRTtBQUN4QyxjQUFNLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztPQUN6QixNQUFNO0FBQ0wsY0FBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7T0FDdEI7O0FBRUQsYUFBTyxNQUFNLENBQUM7S0FDZjs7Ozs7Ozs7Ozs7Ozs7OztXQTZCSyxrQkFBRztBQUNQLFVBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLO2VBQUssS0FBSyxDQUFDLE1BQU0sRUFBRTtPQUFBLENBQUMsQ0FBQztBQUN4QyxVQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUMvQjs7Ozs7Ozs7Ozs7V0FTSyxnQkFBQyxZQUFZLEVBQUU7QUFDbkIsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3JELFVBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLO2VBQUssS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7T0FBQSxDQUFDLENBQUM7QUFDOUMsVUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQ3ZDOzs7Ozs7OztXQU1jLGdEQUF3QjtBQUNyQyxVQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztlQUFLLEtBQUssQ0FBQyxlQUFlLEVBQUU7T0FBQSxDQUFDLENBQUM7QUFDakQsVUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztLQUMxQzs7Ozs7Ozs7OztXQVFXLHNCQUFDLFlBQVksRUFBRTtBQUN6QixVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDckQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUs7ZUFBSyxLQUFLLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQztPQUFBLENBQUMsQ0FBQztBQUNwRCxVQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDOUM7OztTQXhEUyxhQUFDLEtBQUssRUFBRTtBQUNoQixVQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztlQUFLLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSztPQUFBLENBQUMsQ0FBQztLQUMvQzs7Ozs7Ozs7O1NBT1MsZUFBRztBQUNYLFVBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNoQixVQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztlQUFLLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7T0FBQSxDQUFDLENBQUM7O0FBRTlELGFBQU8sTUFBTSxDQUFDO0tBQ2Y7OztTQTdDa0IsZUFBZTtHQUFTLEtBQUs7O3FCQUE3QixlQUFlIiwiZmlsZSI6InNyYy93YXZlcy11aS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMYXllciBmcm9tICcuL2xheWVyJztcblxuXG4vKipcbiAqIENvbGxlY3Rpb24gaG9zdGluZyBhbGwgdGhlIGBUcmFja2AgaW5zdGFuY2VzIHJlZ2lzdGVyZWQgaW50byB0aGUgdGltZWxpbmUuXG4gKiBJdCBwcm92aWRlcyBzaG9yY3V0cyB0byB0cmlnZ2VyIGByZW5kZXJgIC8gYHVwZGF0ZWAgbWV0aG9kcyBvbiB0cmFja3Mgb3JcbiAqIGxheWVycy4gRXh0ZW5kIGJ1aWx0LWluIEFycmF5XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyYWNrQ29sbGVjdGlvbiBleHRlbmRzIEFycmF5IHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5fdGltZWxpbmUgPSB0aW1lbGluZTtcbiAgfVxuXG4gIC8vIEBub3RlIC0gc2hvdWxkIGJlIGluIHRoZSB0aW1lbGluZSA/XG4gIC8vIEB0b2RvIC0gYWxsb3cgdG8gcGFzcyBhbiBhcnJheSBvZiBsYXllcnNcbiAgX2dldExheWVyc09yR3JvdXBzKGxheWVyT3JHcm91cCA9IG51bGwpIHtcbiAgICBsZXQgbGF5ZXJzID0gbnVsbDtcblxuICAgIGlmICh0eXBlb2YgbGF5ZXJPckdyb3VwID09PSAnc3RyaW5nJykge1xuICAgICAgbGF5ZXJzID0gdGhpcy5fdGltZWxpbmUuZ3JvdXBlZExheWVyc1tsYXllck9yR3JvdXBdO1xuICAgIH0gZWxzZSBpZiAobGF5ZXJPckdyb3VwIGluc3RhbmNlb2YgTGF5ZXIpIHtcbiAgICAgIGxheWVycyA9IFtsYXllck9yR3JvdXBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsYXllcnMgPSB0aGlzLmxheWVycztcbiAgICB9XG5cbiAgICByZXR1cm4gbGF5ZXJzO1xuICB9XG5cbiAgLy8gQE5PVEUga2VlcCB0aGlzID9cbiAgLy8gY291bGQgcHJlcGFyZSBzb21lIHZlcnRpY2FsIHJlc2l6aW5nIGFiaWxpdHlcbiAgLy8gdGhpcyBzaG91bGQgYmUgYWJsZSB0byBtb2RpZnkgdGhlIGxheWVycyB5U2NhbGUgdG8gYmUgcmVhbGx5IHVzZWZ1bGxcblxuICAvKipcbiAgICogQHR5cGUge051bWJlcn0gLSBVcGRhdGVzIHRoZSBoZWlnaHQgb2YgYWxsIHRyYWNrcyBhdCBvbmNlLlxuICAgKiBAdG9kbyAtIFByb3BhZ2F0ZSB0byBsYXllcnMsIG5vdCB1c2VmdWxsIGZvciBub3cuXG4gICAqL1xuICBzZXQgaGVpZ2h0KHZhbHVlKSB7XG4gICAgdGhpcy5mb3JFYWNoKCh0cmFjaykgPT4gdHJhY2suaGVpZ2h0ID0gdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIGFycmF5IG9mIGFsbCByZWdpc3RlcmVkIGxheWVycy5cbiAgICpcbiAgICogQHR5cGUge0FycmF5PExheWVyPn1cbiAgICovXG4gIGdldCBsYXllcnMoKSB7XG4gICAgbGV0IGxheWVycyA9IFtdO1xuICAgIHRoaXMuZm9yRWFjaCgodHJhY2spID0+IGxheWVycyA9IGxheWVycy5jb25jYXQodHJhY2subGF5ZXJzKSk7XG5cbiAgICByZXR1cm4gbGF5ZXJzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciBhbGwgdHJhY2tzIGFuZCBsYXllcnMuIFdoZW4gZG9uZSwgdGhlIHRpbWVsaW5lIHRyaWdnZXJzIGEgYHJlbmRlcmAgZXZlbnQuXG4gICAqL1xuICByZW5kZXIoKSB7XG4gICAgdGhpcy5mb3JFYWNoKCh0cmFjaykgPT4gdHJhY2sucmVuZGVyKCkpO1xuICAgIHRoaXMuX3RpbWVsaW5lLmVtaXQoJ3JlbmRlcicpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgYWxsIHRyYWNrcyBhbmQgbGF5ZXJzLiBXaGVuIGRvbmUsIHRoZSB0aW1lbGluZSB0cmlnZ2VycyBhXG4gICAqIGB1cGRhdGVgIGV2ZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge0xheWVyfFN0cmluZ30gbGF5ZXJPckdyb3VwIC0gRmlsdGVyIHRoZSBsYXllcnMgdG8gdXBkYXRlIGJ5XG4gICAqICAgIHBhc3NpbmcgdGhlIGBMYXllcmAgaW5zdGFuY2UgdG8gdXBkYXRlIG9yIGEgYGdyb3VwSWRgXG4gICAqL1xuICB1cGRhdGUobGF5ZXJPckdyb3VwKSB7XG4gICAgY29uc3QgbGF5ZXJzID0gdGhpcy5fZ2V0TGF5ZXJzT3JHcm91cHMobGF5ZXJPckdyb3VwKTtcbiAgICB0aGlzLmZvckVhY2goKHRyYWNrKSA9PiB0cmFjay51cGRhdGUobGF5ZXJzKSk7XG4gICAgdGhpcy5fdGltZWxpbmUuZW1pdCgndXBkYXRlJywgbGF5ZXJzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIGFsbCBgVHJhY2tgIGNvbnRhaW5lcnMsIGxheWVycyBhcmUgbm90IHVwZGF0ZWQgd2l0aCB0aGlzIG1ldGhvZC5cbiAgICogV2hlbiBkb25lLCB0aGUgdGltZWxpbmUgdHJpZ2dlcnMgYSBgdXBkYXRlOmNvbnRhaW5lcnNgIGV2ZW50LlxuICAgKi9cbiAgdXBkYXRlQ29udGFpbmVyKC8qIHRyYWNrT3JUcmFja0lkcyAqLykge1xuICAgIHRoaXMuZm9yRWFjaCgodHJhY2spID0+IHRyYWNrLnVwZGF0ZUNvbnRhaW5lcigpKTtcbiAgICB0aGlzLl90aW1lbGluZS5lbWl0KCd1cGRhdGU6Y29udGFpbmVycycpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgYWxsIGxheWVycy4gV2hlbiBkb25lLCB0aGUgdGltZWxpbmUgdHJpZ2dlcnMgYSBgdXBkYXRlOmxheWVyc2AgZXZlbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7TGF5ZXJ8U3RyaW5nfSBsYXllck9yR3JvdXAgLSBGaWx0ZXIgdGhlIGxheWVycyB0byB1cGRhdGUgYnlcbiAgICogICAgcGFzc2luZyB0aGUgYExheWVyYCBpbnN0YW5jZSB0byB1cGRhdGUgb3IgYSBgZ3JvdXBJZGBcbiAgICovXG4gIHVwZGF0ZUxheWVycyhsYXllck9yR3JvdXApIHtcbiAgICBjb25zdCBsYXllcnMgPSB0aGlzLl9nZXRMYXllcnNPckdyb3VwcyhsYXllck9yR3JvdXApO1xuICAgIHRoaXMuZm9yRWFjaCgodHJhY2spID0+IHRyYWNrLnVwZGF0ZUxheWVycyhsYXllcnMpKTtcbiAgICB0aGlzLl90aW1lbGluZS5lbWl0KCd1cGRhdGU6bGF5ZXJzJywgbGF5ZXJzKTtcbiAgfVxufVxuIl19