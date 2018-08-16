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

var _Layer = require('./Layer');

var _Layer2 = _interopRequireDefault(_Layer);

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
      } else if (layerOrGroup instanceof _Layer2.default) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRyYWNrQ29sbGVjdGlvbi5qcyJdLCJuYW1lcyI6WyJUcmFja0NvbGxlY3Rpb24iLCJ0aW1lbGluZSIsIl90aW1lbGluZSIsIl90cmFja3MiLCJsYXllck9yR3JvdXAiLCJsYXllcnMiLCJncm91cGVkTGF5ZXJzIiwidHJhY2siLCJoYXMiLCJhZGQiLCJjYWxsYmFjayIsImZvckVhY2giLCJyZW5kZXIiLCJlbWl0IiwiX2dldExheWVyc09yR3JvdXBzIiwidXBkYXRlIiwidXBkYXRlQ29udGFpbmVyIiwidXBkYXRlTGF5ZXJzIiwidmFsdWUiLCJoZWlnaHQiLCJjb25jYXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFHQTs7Ozs7SUFLTUEsZTtBQUNKLDJCQUFZQyxRQUFaLEVBQXNCO0FBQUE7O0FBQ3BCLFNBQUtDLFNBQUwsR0FBaUJELFFBQWpCO0FBQ0EsU0FBS0UsT0FBTCxHQUFlLG1CQUFmO0FBQ0Q7O0FBRUQ7QUFDQTs7Ozs7eUNBQ3dDO0FBQUEsVUFBckJDLFlBQXFCLHVFQUFOLElBQU07O0FBQ3RDLFVBQUlDLFNBQVMsSUFBYjs7QUFFQSxVQUFJLE9BQU9ELFlBQVAsS0FBd0IsUUFBNUIsRUFBc0M7QUFDcENDLGlCQUFTLEtBQUtILFNBQUwsQ0FBZUksYUFBZixDQUE2QkYsWUFBN0IsQ0FBVDtBQUNELE9BRkQsTUFFTyxJQUFJQSx1Q0FBSixFQUFtQztBQUN4Q0MsaUJBQVMsQ0FBQ0QsWUFBRCxDQUFUO0FBQ0QsT0FGTSxNQUVBO0FBQ0xDLGlCQUFTLEtBQUtBLE1BQWQ7QUFDRDs7QUFFRCxhQUFPQSxNQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OztBQW9CQTs7Ozs7O3dCQU1JRSxLLEVBQU87QUFDVCxhQUFPLEtBQUtKLE9BQUwsQ0FBYUssR0FBYixDQUFpQkQsS0FBakIsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozt3QkFLSUEsSyxFQUFPO0FBQ1QsV0FBS0osT0FBTCxDQUFhTSxHQUFiLENBQWlCRixLQUFqQjtBQUNEOztBQUVEOzs7OzJCQUNPQSxLLEVBQU8sQ0FBRTs7OzRCQUVSRyxRLEVBQVU7QUFDaEIsV0FBS1AsT0FBTCxDQUFhUSxPQUFiLENBQXFCRCxRQUFyQjtBQUNEOztBQUVEOzs7Ozs7NkJBR1M7QUFDUCxXQUFLUCxPQUFMLENBQWFRLE9BQWIsQ0FBcUI7QUFBQSxlQUFTSixNQUFNSyxNQUFOLEVBQVQ7QUFBQSxPQUFyQjtBQUNBLFdBQUtWLFNBQUwsQ0FBZVcsSUFBZixDQUFvQixRQUFwQjtBQUNEOztBQUVEOzs7Ozs7Ozs7OzsyQkFRT1QsWSxFQUFjO0FBQ25CLFVBQU1DLFNBQVMsS0FBS1Msa0JBQUwsQ0FBd0JWLFlBQXhCLENBQWY7QUFDQSxXQUFLRCxPQUFMLENBQWFRLE9BQWIsQ0FBcUI7QUFBQSxlQUFTSixNQUFNUSxNQUFOLENBQWFWLE1BQWIsQ0FBVDtBQUFBLE9BQXJCO0FBQ0EsV0FBS0gsU0FBTCxDQUFlVyxJQUFmLENBQW9CLFFBQXBCLEVBQThCUixNQUE5QjtBQUNEOztBQUVEOzs7Ozs7O3NDQUlnQixxQkFBdUI7QUFDckMsV0FBS0YsT0FBTCxDQUFhUSxPQUFiLENBQXFCO0FBQUEsZUFBU0osTUFBTVMsZUFBTixFQUFUO0FBQUEsT0FBckI7QUFDQSxXQUFLZCxTQUFMLENBQWVXLElBQWYsQ0FBb0IsbUJBQXBCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7aUNBT2FULFksRUFBYztBQUN6QixVQUFNQyxTQUFTLEtBQUtTLGtCQUFMLENBQXdCVixZQUF4QixDQUFmO0FBQ0EsV0FBS0QsT0FBTCxDQUFhUSxPQUFiLENBQXFCO0FBQUEsZUFBU0osTUFBTVUsWUFBTixDQUFtQlosTUFBbkIsQ0FBVDtBQUFBLE9BQXJCO0FBQ0EsV0FBS0gsU0FBTCxDQUFlVyxJQUFmLENBQW9CLGVBQXBCLEVBQXFDUixNQUFyQztBQUNEOzs7c0JBcEZVYSxLLEVBQU87QUFDaEIsV0FBS2YsT0FBTCxDQUFhUSxPQUFiLENBQXFCLFVBQUNKLEtBQUQ7QUFBQSxlQUFXQSxNQUFNWSxNQUFOLEdBQWVELEtBQTFCO0FBQUEsT0FBckI7QUFDRDs7QUFFRDs7Ozs7Ozs7d0JBS2E7QUFDWCxVQUFJYixTQUFTLEVBQWI7QUFDQSxXQUFLRixPQUFMLENBQWFRLE9BQWIsQ0FBcUI7QUFBQSxlQUFTTixTQUFTQSxPQUFPZSxNQUFQLENBQWNiLE1BQU1GLE1BQXBCLENBQWxCO0FBQUEsT0FBckI7O0FBRUEsYUFBT0EsTUFBUDtBQUNEOzs7OztrQkF5RVlMLGUiLCJmaWxlIjoiVHJhY2tDb2xsZWN0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExheWVyIGZyb20gJy4vTGF5ZXInO1xuXG5cbi8qKlxuICogQ29sbGVjdGlvbiBob3N0aW5nIGFsbCB0aGUgYFRyYWNrYCBpbnN0YW5jZXMgcmVnaXN0ZXJlZCBpbnRvIHRoZSB0aW1lbGluZS5cbiAqIEl0IHByb3ZpZGVzIHNob3JjdXRzIHRvIHRyaWdnZXIgYHJlbmRlcmAgLyBgdXBkYXRlYCBtZXRob2RzIG9uIHRyYWNrcyBvclxuICogbGF5ZXJzLiBFeHRlbmQgYnVpbHQtaW4gQXJyYXlcbiAqL1xuY2xhc3MgVHJhY2tDb2xsZWN0aW9uIHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUpIHtcbiAgICB0aGlzLl90aW1lbGluZSA9IHRpbWVsaW5lO1xuICAgIHRoaXMuX3RyYWNrcyA9IG5ldyBTZXQoKTtcbiAgfVxuXG4gIC8vIEBub3RlIC0gc2hvdWxkIGJlIGluIHRoZSB0aW1lbGluZSA/XG4gIC8vIEB0b2RvIC0gYWxsb3cgdG8gcGFzcyBhbiBhcnJheSBvZiBsYXllcnNcbiAgX2dldExheWVyc09yR3JvdXBzKGxheWVyT3JHcm91cCA9IG51bGwpIHtcbiAgICBsZXQgbGF5ZXJzID0gbnVsbDtcblxuICAgIGlmICh0eXBlb2YgbGF5ZXJPckdyb3VwID09PSAnc3RyaW5nJykge1xuICAgICAgbGF5ZXJzID0gdGhpcy5fdGltZWxpbmUuZ3JvdXBlZExheWVyc1tsYXllck9yR3JvdXBdO1xuICAgIH0gZWxzZSBpZiAobGF5ZXJPckdyb3VwIGluc3RhbmNlb2YgTGF5ZXIpIHtcbiAgICAgIGxheWVycyA9IFtsYXllck9yR3JvdXBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsYXllcnMgPSB0aGlzLmxheWVycztcbiAgICB9XG5cbiAgICByZXR1cm4gbGF5ZXJzO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtOdW1iZXJ9IC0gVXBkYXRlcyB0aGUgaGVpZ2h0IG9mIGFsbCB0cmFja3MgYXQgb25jZS5cbiAgICogQHRvZG8gLSBQcm9wYWdhdGUgdG8gbGF5ZXJzLCBub3QgdXNlZnVsbCBmb3Igbm93LlxuICAgKi9cbiAgc2V0IGhlaWdodCh2YWx1ZSkge1xuICAgIHRoaXMuX3RyYWNrcy5mb3JFYWNoKCh0cmFjaykgPT4gdHJhY2suaGVpZ2h0ID0gdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIGFycmF5IG9mIGFsbCByZWdpc3RlcmVkIGxheWVycy5cbiAgICpcbiAgICogQHR5cGUge0FycmF5PExheWVyPn1cbiAgICovXG4gIGdldCBsYXllcnMoKSB7XG4gICAgbGV0IGxheWVycyA9IFtdO1xuICAgIHRoaXMuX3RyYWNrcy5mb3JFYWNoKHRyYWNrID0+IGxheWVycyA9IGxheWVycy5jb25jYXQodHJhY2subGF5ZXJzKSk7XG5cbiAgICByZXR1cm4gbGF5ZXJzO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGEgZ2l2ZW4gdHJhY2sgYmVsb25ncyB0byB0aGUgY29sbGVjdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtUcmFja30gdHJhY2sgLSBUcmFjayB0byBiZSB0ZXN0ZWRcbiAgICogQHJldHVybnMge0Jvb2xlYW59XG4gICAqL1xuICBoYXModHJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5fdHJhY2tzLmhhcyh0cmFjayk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgdHJhY2sgdG8gdGhlIGNvbGxlY3Rpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7VHJhY2t9IHRyYWNrIC0gVHJhY2sgdG8gYWRkIHRvIHRoZSBjb2xsZWN0aW9uXG4gICAqL1xuICBhZGQodHJhY2spIHtcbiAgICB0aGlzLl90cmFja3MuYWRkKHRyYWNrKTtcbiAgfVxuXG4gIC8vIEB0b2RvXG4gIHJlbW92ZSh0cmFjaykge31cblxuICBmb3JFYWNoKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fdHJhY2tzLmZvckVhY2goY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciBhbGwgdHJhY2tzIGFuZCBsYXllcnMuIFdoZW4gZG9uZSwgdGhlIHRpbWVsaW5lIHRyaWdnZXJzIGEgYHJlbmRlcmAgZXZlbnQuXG4gICAqL1xuICByZW5kZXIoKSB7XG4gICAgdGhpcy5fdHJhY2tzLmZvckVhY2godHJhY2sgPT4gdHJhY2sucmVuZGVyKCkpO1xuICAgIHRoaXMuX3RpbWVsaW5lLmVtaXQoJ3JlbmRlcicpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgYWxsIHRyYWNrcyBhbmQgbGF5ZXJzLiBXaGVuIGRvbmUsIHRoZSB0aW1lbGluZSB0cmlnZ2VycyBhXG4gICAqIGB1cGRhdGVgIGV2ZW50LlxuICAgKlxuICAgKiBAdG9kbyAtIGZpbHRlcmluZyBpcyBwcm9iYWJseSBicm9rZW4uLi5cbiAgICogQHBhcmFtIHtMYXllcnxTdHJpbmd9IGxheWVyT3JHcm91cCAtIEZpbHRlciB0aGUgbGF5ZXJzIHRvIHVwZGF0ZSBieVxuICAgKiAgICBwYXNzaW5nIHRoZSBgTGF5ZXJgIGluc3RhbmNlIHRvIHVwZGF0ZSBvciBhIGBncm91cElkYFxuICAgKi9cbiAgdXBkYXRlKGxheWVyT3JHcm91cCkge1xuICAgIGNvbnN0IGxheWVycyA9IHRoaXMuX2dldExheWVyc09yR3JvdXBzKGxheWVyT3JHcm91cCk7XG4gICAgdGhpcy5fdHJhY2tzLmZvckVhY2godHJhY2sgPT4gdHJhY2sudXBkYXRlKGxheWVycykpO1xuICAgIHRoaXMuX3RpbWVsaW5lLmVtaXQoJ3VwZGF0ZScsIGxheWVycyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyBhbGwgYFRyYWNrYCBjb250YWluZXJzLCBsYXllcnMgYXJlIG5vdCB1cGRhdGVkIHdpdGggdGhpcyBtZXRob2QuXG4gICAqIFdoZW4gZG9uZSwgdGhlIHRpbWVsaW5lIHRyaWdnZXJzIGEgYHVwZGF0ZTpjb250YWluZXJzYCBldmVudC5cbiAgICovXG4gIHVwZGF0ZUNvbnRhaW5lcigvKiB0cmFja09yVHJhY2tJZHMgKi8pIHtcbiAgICB0aGlzLl90cmFja3MuZm9yRWFjaCh0cmFjayA9PiB0cmFjay51cGRhdGVDb250YWluZXIoKSk7XG4gICAgdGhpcy5fdGltZWxpbmUuZW1pdCgndXBkYXRlOmNvbnRhaW5lcnMnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIGFsbCBsYXllcnMuIFdoZW4gZG9uZSwgdGhlIHRpbWVsaW5lIHRyaWdnZXJzIGEgYHVwZGF0ZTpsYXllcnNgIGV2ZW50LlxuICAgKlxuICAgKiBAdG9kbyAtIGZpbHRlcmluZyBpcyBwcm9iYWJseSBicm9rZW4uLi5cbiAgICogQHBhcmFtIHtMYXllcnxTdHJpbmd9IGxheWVyT3JHcm91cCAtIEZpbHRlciB0aGUgbGF5ZXJzIHRvIHVwZGF0ZSBieVxuICAgKiAgICBwYXNzaW5nIHRoZSBgTGF5ZXJgIGluc3RhbmNlIHRvIHVwZGF0ZSBvciBhIGBncm91cElkYFxuICAgKi9cbiAgdXBkYXRlTGF5ZXJzKGxheWVyT3JHcm91cCkge1xuICAgIGNvbnN0IGxheWVycyA9IHRoaXMuX2dldExheWVyc09yR3JvdXBzKGxheWVyT3JHcm91cCk7XG4gICAgdGhpcy5fdHJhY2tzLmZvckVhY2godHJhY2sgPT4gdHJhY2sudXBkYXRlTGF5ZXJzKGxheWVycykpO1xuICAgIHRoaXMuX3RpbWVsaW5lLmVtaXQoJ3VwZGF0ZTpsYXllcnMnLCBsYXllcnMpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRyYWNrQ29sbGVjdGlvbjtcbiJdfQ==