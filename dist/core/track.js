'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _Symbol$iterator = require('babel-runtime/core-js/symbol/iterator')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _namespace = require('./namespace');

/**
 * As a temporal representation, a track establishes a relation between *time* in seconds and *space* in pixels.
 *
 * A `Track` instance can have multiple `Layer` instances.
 *
 * ### Tracks inside a timeline
 *
 * A temporal representation can be rendered upon multiple DOM elements, the tracks (eg multiple `<li>` for a DAW like representation) that belong to the same timeline using the `add` method. These tracks are like windows on the overall and basically unending timeline.
 *
 * ### A timeline with 3 tracks:
 *
 * ```
 * +-----------------+-------------------------------+-- - -  -  -   -
 * |track 1          |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
 * +-----------------+-------------------------------+-- - -  -  -   -
 * |track 2          |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
 * +-----------------+-------------------------------+-- - -  -  -   -
 * |track 3          |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
 * +-------------------------------------------------+-- - -  -  -   -
 *
 * +----------------->
 * timeline.timeContext.timeToPixel(timeline.timeContext.offset)
 *
 *                   <------------------------------->
 *                   timeline's tracks defaults to 1000px
 *                   with a default pixelsPerSecond of 100px/s.
 *                   and a default `stretchRatio = 1`
 *                   track1 shows 10 seconds of the timeline
 * ```
 *
 * ### Layers inside a track
 *
 * Within a track, a `Layer` keeps up-to-date and renders the data. The track's `add` method adds a `Layer` instance to a track.
 *
 * ### The track renderingContext
 *
 * When one modify the timeline renderingContext:
 *
 * - timeline.renderingContext.offset (in seconds) modify the containers track x position
 * - timeline.renderingContext.stretchRatio modify timeline's zoom
 * Each time you set new value of offset or stretchRatio, you need to do `timeline.update()` to update the values.
 *
 * ### Track SVG structure
 *
 * ```html
 * <svg class="track" xmlns:xhtml="http://www.w3.org/1999/xhtml" height="100" shape-rendering="optimizeSpeed">
 *   <defs></defs> Unused for the moment, could be used to define custom shapes for use with layers
 *   <rect style="fill-opacity:0" width="100%" height="100%"></rect>
 *   <g class="offset">
 *     <g class="layout"></g> The layers are inserted here
 *   </g>
 *   <g class="interactions"></g> Placeholder to visualize interactions (eg. brush)
 * </svg>
 * ```
 */

var _namespace2 = _interopRequireDefault(_namespace);

var Track = (function () {
  /**
   * Create the track of the given `height` in the given `$el`
   * @param {DOMElement} $el
   * @param {Number} [height = 100]
   */

  function Track($el) {
    var height = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];

    _classCallCheck(this, Track);

    this.$el = $el;
    this.layers = [];
    this._height = height;

    // are set when added to the timeline
    this.renderingContext = null;

    this._createContainer();
  }

  /**
   * @type Number
   * @default 100
   */

  _createClass(Track, [{
    key: 'configure',

    // @NOTE: propagate to layers, keeping ratio ? could be handy for vertical resize

    /**
     * This method is called when the track is added to the timeline.
     * The track cannot be updated without being added to a timeline.
     * @param {TimelineTimeContext} renderingContext
     * @semi-private
     */
    value: function configure(renderingContext) {
      this.renderingContext = renderingContext;
    }

    /**
     * Destroy a track
     * The layers from this track can still be reused elsewhere
     */
  }, {
    key: 'destroy',
    value: function destroy() {
      var _this = this;

      // Detach everything from the DOM
      this.$el.removeChild(this.$svg);
      this.layers.forEach(function (layer) {
        return _this.$layout.removeChild(layer.$el);
      });
      // clean references
      this.$el = null;
      this.renderingContext = null;
      this.layers.length = 0;
    }

    /**
     * Creates the container for the track
     */
  }, {
    key: '_createContainer',
    value: function _createContainer() {
      var $svg = document.createElementNS(_namespace2['default'], 'svg');
      $svg.setAttributeNS(null, 'shape-rendering', 'optimizeSpeed');
      $svg.setAttributeNS(null, 'height', this.height);
      $svg.setAttribute('xmlns:xhtml', 'http://www.w3.org/1999/xhtml');
      $svg.classList.add('track');

      var $background = document.createElementNS(_namespace2['default'], 'rect');
      $background.setAttributeNS(null, 'height', '100%');
      $background.setAttributeNS(null, 'width', '100%');
      $background.style.fillOpacity = 0;
      // $background.style.pointerEvents = 'none';

      var $defs = document.createElementNS(_namespace2['default'], 'defs');

      var $offsetGroup = document.createElementNS(_namespace2['default'], 'g');
      $offsetGroup.classList.add('offset');

      var $layoutGroup = document.createElementNS(_namespace2['default'], 'g');
      $layoutGroup.classList.add('layout');

      var $interactionsGroup = document.createElementNS(_namespace2['default'], 'g');
      $interactionsGroup.classList.add('interactions');

      $svg.appendChild($defs);
      $svg.appendChild($background);
      $offsetGroup.appendChild($layoutGroup);
      $svg.appendChild($offsetGroup);
      $svg.appendChild($interactionsGroup);

      this.$el.appendChild($svg);
      // removes additionnal height added who knows why...
      this.$el.style.fontSize = 0;
      // fixes one of the (many ?) weird canvas rendering bugs in Chrome
      this.$el.style.transform = 'translateZ(0)';

      this.$layout = $layoutGroup;
      this.$offset = $offsetGroup;
      this.$interactions = $interactionsGroup;
      this.$svg = $svg;
      this.$background = $background;
    }

    /**
     * Adds a layer to the track
     */
  }, {
    key: 'add',
    value: function add(layer) {
      this.layers.push(layer);
      // Create a default renderingContext for the layer if missing
      this.$layout.appendChild(layer.$el);
    }

    /**
     * Removes a layer
     */
  }, {
    key: 'remove',
    value: function remove(layer) {
      this.layers.splice(this.layers.indexOf(layer), 1);
      // Removes layer from its container
      this.$layout.removeChild(layer.$el);
    }

    /**
     *  Defines if a given element belongs to the track
     *  @param {DOMElement} $el
     *  @return {bool}
     */
  }, {
    key: 'hasElement',
    value: function hasElement($el) {
      do {
        if ($el === this.$el) {
          return true;
        }

        $el = $el.parentNode;
      } while ($el !== null);

      return false;
    }

    /**
     * Draw tracks, and the layers in cascade
     */
  }, {
    key: 'render',
    value: function render() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _getIterator(this), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var layer = _step.value;
          layer.render();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    /**
     * Update the layers
     */
  }, {
    key: 'update',
    value: function update() {
      var layers = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      this.updateContainer();
      this.updateLayers(layers);
    }
  }, {
    key: 'updateContainer',
    value: function updateContainer() {
      var $svg = this.$svg;
      var $offset = this.$offset;
      // Should be in some update layout
      var renderingContext = this.renderingContext;
      var height = this.height;
      var width = renderingContext.visibleWidth;
      var offsetX = renderingContext.timeToPixel(renderingContext.offset);
      var translate = 'translate(' + offsetX + ', 0)';

      $svg.setAttributeNS(null, 'height', height);
      $svg.setAttributeNS(null, 'width', width);
      $svg.setAttributeNS(null, 'viewbox', '0 0 ' + width + ' ' + height);

      $offset.setAttributeNS(null, 'transform', translate);
    }
  }, {
    key: 'updateLayers',
    value: function updateLayers() {
      var _this2 = this;

      var layers = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      layers = layers === null ? this.layers : layers;

      layers.forEach(function (layer) {
        if (_this2.layers.indexOf(layer) === -1) {
          return;
        }
        layer.update();
      });
    }
  }, {
    key: _Symbol$iterator,
    value: _regeneratorRuntime.mark(function value() {
      return _regeneratorRuntime.wrap(function value$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            return context$2$0.delegateYield(_getIterator(this.layers), 't0', 1);

          case 1:
          case 'end':
            return context$2$0.stop();
        }
      }, value, this);
    })
  }, {
    key: 'height',
    get: function get() {
      return this._height;
    },
    set: function set(value) {
      this._height = value;
    }
  }]);

  return Track;
})();

exports['default'] = Track;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3RyYWNrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFBZSxhQUFhOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUEwRFAsS0FBSzs7Ozs7OztBQU1iLFdBTlEsS0FBSyxDQU1aLEdBQUcsRUFBZ0I7UUFBZCxNQUFNLHlEQUFHLEdBQUc7OzBCQU5WLEtBQUs7O0FBT3RCLFFBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ2YsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDakIsUUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7OztBQUd0QixRQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDOztBQUU3QixRQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztHQUN6Qjs7Ozs7OztlQWZrQixLQUFLOzs7Ozs7Ozs7OztXQW9DZixtQkFBQyxnQkFBZ0IsRUFBRTtBQUMxQixVQUFJLENBQUMsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUM7S0FDMUM7Ozs7Ozs7O1dBTU0sbUJBQUc7Ozs7QUFFUixVQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEMsVUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLO2VBQUssTUFBSyxPQUFPLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7T0FBQSxDQUFDLENBQUM7O0FBRXBFLFVBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLFVBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7QUFDN0IsVUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0tBQ3hCOzs7Ozs7O1dBS2UsNEJBQUc7QUFDakIsVUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLGVBQWUseUJBQUss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UyxLQUFLLFNBQUksTUFBTSxDQUFHLENBQUM7O0FBRS9ELGFBQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztLQUN0RDs7O1dBRVcsd0JBQWdCOzs7VUFBZixNQUFNLHlEQUFHLElBQUk7O0FBQ3hCLFlBQU0sR0FBRyxBQUFDLE1BQU0sS0FBSyxJQUFJLEdBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7O0FBRWxELFlBQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLLEVBQUs7QUFDeEIsWUFBSSxPQUFLLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFBRSxpQkFBTztTQUFFO0FBQ2xELGFBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztPQUNoQixDQUFDLENBQUM7S0FDSjs7O29DQUVpQjs7OzswREFDVCxJQUFJLENBQUMsTUFBTTs7Ozs7OztLQUNuQjs7O1NBN0pTLGVBQUc7QUFDWCxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7S0FDckI7U0FFUyxhQUFDLEtBQUssRUFBRTtBQUNoQixVQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztLQUV0Qjs7O1NBNUJrQixLQUFLOzs7cUJBQUwsS0FBSyIsImZpbGUiOiJlczYvY29yZS90cmFjay5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBucyBmcm9tICcuL25hbWVzcGFjZSc7XG5cblxuLyoqXG4gKiBBcyBhIHRlbXBvcmFsIHJlcHJlc2VudGF0aW9uLCBhIHRyYWNrIGVzdGFibGlzaGVzIGEgcmVsYXRpb24gYmV0d2VlbiAqdGltZSogaW4gc2Vjb25kcyBhbmQgKnNwYWNlKiBpbiBwaXhlbHMuXG4gKlxuICogQSBgVHJhY2tgIGluc3RhbmNlIGNhbiBoYXZlIG11bHRpcGxlIGBMYXllcmAgaW5zdGFuY2VzLlxuICpcbiAqICMjIyBUcmFja3MgaW5zaWRlIGEgdGltZWxpbmVcbiAqXG4gKiBBIHRlbXBvcmFsIHJlcHJlc2VudGF0aW9uIGNhbiBiZSByZW5kZXJlZCB1cG9uIG11bHRpcGxlIERPTSBlbGVtZW50cywgdGhlIHRyYWNrcyAoZWcgbXVsdGlwbGUgYDxsaT5gIGZvciBhIERBVyBsaWtlIHJlcHJlc2VudGF0aW9uKSB0aGF0IGJlbG9uZyB0byB0aGUgc2FtZSB0aW1lbGluZSB1c2luZyB0aGUgYGFkZGAgbWV0aG9kLiBUaGVzZSB0cmFja3MgYXJlIGxpa2Ugd2luZG93cyBvbiB0aGUgb3ZlcmFsbCBhbmQgYmFzaWNhbGx5IHVuZW5kaW5nIHRpbWVsaW5lLlxuICpcbiAqICMjIyBBIHRpbWVsaW5lIHdpdGggMyB0cmFja3M6XG4gKlxuICogYGBgXG4gKiArLS0tLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSstLSAtIC0gIC0gIC0gICAtXG4gKiB8dHJhY2sgMSAgICAgICAgICB8eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHxcbiAqICstLS0tLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKy0tIC0gLSAgLSAgLSAgIC1cbiAqIHx0cmFjayAyICAgICAgICAgIHx4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4fFxuICogKy0tLS0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rLS0gLSAtICAtICAtICAgLVxuICogfHRyYWNrIDMgICAgICAgICAgfHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh8XG4gKiArLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSstLSAtIC0gIC0gIC0gICAtXG4gKlxuICogKy0tLS0tLS0tLS0tLS0tLS0tPlxuICogdGltZWxpbmUudGltZUNvbnRleHQudGltZVRvUGl4ZWwodGltZWxpbmUudGltZUNvbnRleHQub2Zmc2V0KVxuICpcbiAqICAgICAgICAgICAgICAgICAgIDwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tPlxuICogICAgICAgICAgICAgICAgICAgdGltZWxpbmUncyB0cmFja3MgZGVmYXVsdHMgdG8gMTAwMHB4XG4gKiAgICAgICAgICAgICAgICAgICB3aXRoIGEgZGVmYXVsdCBwaXhlbHNQZXJTZWNvbmQgb2YgMTAwcHgvcy5cbiAqICAgICAgICAgICAgICAgICAgIGFuZCBhIGRlZmF1bHQgYHN0cmV0Y2hSYXRpbyA9IDFgXG4gKiAgICAgICAgICAgICAgICAgICB0cmFjazEgc2hvd3MgMTAgc2Vjb25kcyBvZiB0aGUgdGltZWxpbmVcbiAqIGBgYFxuICpcbiAqICMjIyBMYXllcnMgaW5zaWRlIGEgdHJhY2tcbiAqXG4gKiBXaXRoaW4gYSB0cmFjaywgYSBgTGF5ZXJgIGtlZXBzIHVwLXRvLWRhdGUgYW5kIHJlbmRlcnMgdGhlIGRhdGEuIFRoZSB0cmFjaydzIGBhZGRgIG1ldGhvZCBhZGRzIGEgYExheWVyYCBpbnN0YW5jZSB0byBhIHRyYWNrLlxuICpcbiAqICMjIyBUaGUgdHJhY2sgcmVuZGVyaW5nQ29udGV4dFxuICpcbiAqIFdoZW4gb25lIG1vZGlmeSB0aGUgdGltZWxpbmUgcmVuZGVyaW5nQ29udGV4dDpcbiAqXG4gKiAtIHRpbWVsaW5lLnJlbmRlcmluZ0NvbnRleHQub2Zmc2V0IChpbiBzZWNvbmRzKSBtb2RpZnkgdGhlIGNvbnRhaW5lcnMgdHJhY2sgeCBwb3NpdGlvblxuICogLSB0aW1lbGluZS5yZW5kZXJpbmdDb250ZXh0LnN0cmV0Y2hSYXRpbyBtb2RpZnkgdGltZWxpbmUncyB6b29tXG4gKiBFYWNoIHRpbWUgeW91IHNldCBuZXcgdmFsdWUgb2Ygb2Zmc2V0IG9yIHN0cmV0Y2hSYXRpbywgeW91IG5lZWQgdG8gZG8gYHRpbWVsaW5lLnVwZGF0ZSgpYCB0byB1cGRhdGUgdGhlIHZhbHVlcy5cbiAqXG4gKiAjIyMgVHJhY2sgU1ZHIHN0cnVjdHVyZVxuICpcbiAqIGBgYGh0bWxcbiAqIDxzdmcgY2xhc3M9XCJ0cmFja1wiIHhtbG5zOnhodG1sPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwiIGhlaWdodD1cIjEwMFwiIHNoYXBlLXJlbmRlcmluZz1cIm9wdGltaXplU3BlZWRcIj5cbiAqICAgPGRlZnM+PC9kZWZzPiBVbnVzZWQgZm9yIHRoZSBtb21lbnQsIGNvdWxkIGJlIHVzZWQgdG8gZGVmaW5lIGN1c3RvbSBzaGFwZXMgZm9yIHVzZSB3aXRoIGxheWVyc1xuICogICA8cmVjdCBzdHlsZT1cImZpbGwtb3BhY2l0eTowXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiPjwvcmVjdD5cbiAqICAgPGcgY2xhc3M9XCJvZmZzZXRcIj5cbiAqICAgICA8ZyBjbGFzcz1cImxheW91dFwiPjwvZz4gVGhlIGxheWVycyBhcmUgaW5zZXJ0ZWQgaGVyZVxuICogICA8L2c+XG4gKiAgIDxnIGNsYXNzPVwiaW50ZXJhY3Rpb25zXCI+PC9nPiBQbGFjZWhvbGRlciB0byB2aXN1YWxpemUgaW50ZXJhY3Rpb25zIChlZy4gYnJ1c2gpXG4gKiA8L3N2Zz5cbiAqIGBgYFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmFjayB7XG4gIC8qKlxuICAgKiBDcmVhdGUgdGhlIHRyYWNrIG9mIHRoZSBnaXZlbiBgaGVpZ2h0YCBpbiB0aGUgZ2l2ZW4gYCRlbGBcbiAgICogQHBhcmFtIHtET01FbGVtZW50fSAkZWxcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtoZWlnaHQgPSAxMDBdXG4gICAqL1xuICBjb25zdHJ1Y3RvcigkZWwsIGhlaWdodCA9IDEwMCkge1xuICAgIHRoaXMuJGVsID0gJGVsO1xuICAgIHRoaXMubGF5ZXJzID0gW107XG4gICAgdGhpcy5faGVpZ2h0ID0gaGVpZ2h0O1xuXG4gICAgLy8gYXJlIHNldCB3aGVuIGFkZGVkIHRvIHRoZSB0aW1lbGluZVxuICAgIHRoaXMucmVuZGVyaW5nQ29udGV4dCA9IG51bGw7XG5cbiAgICB0aGlzLl9jcmVhdGVDb250YWluZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAdHlwZSBOdW1iZXJcbiAgICogQGRlZmF1bHQgMTAwXG4gICAqL1xuICBnZXQgaGVpZ2h0KCkge1xuICAgIHJldHVybiB0aGlzLl9oZWlnaHQ7XG4gIH1cblxuICBzZXQgaGVpZ2h0KHZhbHVlKSB7XG4gICAgdGhpcy5faGVpZ2h0ID0gdmFsdWU7XG4gICAgLy8gQE5PVEU6IHByb3BhZ2F0ZSB0byBsYXllcnMsIGtlZXBpbmcgcmF0aW8gPyBjb3VsZCBiZSBoYW5keSBmb3IgdmVydGljYWwgcmVzaXplXG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIHdoZW4gdGhlIHRyYWNrIGlzIGFkZGVkIHRvIHRoZSB0aW1lbGluZS5cbiAgICogVGhlIHRyYWNrIGNhbm5vdCBiZSB1cGRhdGVkIHdpdGhvdXQgYmVpbmcgYWRkZWQgdG8gYSB0aW1lbGluZS5cbiAgICogQHBhcmFtIHtUaW1lbGluZVRpbWVDb250ZXh0fSByZW5kZXJpbmdDb250ZXh0XG4gICAqIEBzZW1pLXByaXZhdGVcbiAgICovXG4gIGNvbmZpZ3VyZShyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgdGhpcy5yZW5kZXJpbmdDb250ZXh0ID0gcmVuZGVyaW5nQ29udGV4dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95IGEgdHJhY2tcbiAgICogVGhlIGxheWVycyBmcm9tIHRoaXMgdHJhY2sgY2FuIHN0aWxsIGJlIHJldXNlZCBlbHNld2hlcmVcbiAgICovXG4gIGRlc3Ryb3koKSB7XG4gICAgLy8gRGV0YWNoIGV2ZXJ5dGhpbmcgZnJvbSB0aGUgRE9NXG4gICAgdGhpcy4kZWwucmVtb3ZlQ2hpbGQodGhpcy4kc3ZnKTtcbiAgICB0aGlzLmxheWVycy5mb3JFYWNoKChsYXllcikgPT4gdGhpcy4kbGF5b3V0LnJlbW92ZUNoaWxkKGxheWVyLiRlbCkpO1xuICAgIC8vIGNsZWFuIHJlZmVyZW5jZXNcbiAgICB0aGlzLiRlbCA9IG51bGw7XG4gICAgdGhpcy5yZW5kZXJpbmdDb250ZXh0ID0gbnVsbDtcbiAgICB0aGlzLmxheWVycy5sZW5ndGggPSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgdGhlIGNvbnRhaW5lciBmb3IgdGhlIHRyYWNrXG4gICAqL1xuICBfY3JlYXRlQ29udGFpbmVyKCkge1xuICAgIGNvbnN0ICRzdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdzdmcnKTtcbiAgICAkc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnb3B0aW1pemVTcGVlZCcpO1xuICAgICRzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIHRoaXMuaGVpZ2h0KTtcbiAgICAkc3ZnLnNldEF0dHJpYnV0ZSgneG1sbnM6eGh0bWwnLCAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCcpO1xuICAgICRzdmcuY2xhc3NMaXN0LmFkZCgndHJhY2snKTtcblxuICAgIGNvbnN0ICRiYWNrZ3JvdW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAncmVjdCcpO1xuICAgICRiYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCAnMTAwJScpO1xuICAgICRiYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsICcxMDAlJyk7XG4gICAgJGJhY2tncm91bmQuc3R5bGUuZmlsbE9wYWNpdHkgPSAwO1xuICAgIC8vICRiYWNrZ3JvdW5kLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XG5cbiAgICBjb25zdCAkZGVmcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2RlZnMnKTtcblxuICAgIGNvbnN0ICRvZmZzZXRHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICAkb2Zmc2V0R3JvdXAuY2xhc3NMaXN0LmFkZCgnb2Zmc2V0Jyk7XG5cbiAgICBjb25zdCAkbGF5b3V0R3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgJGxheW91dEdyb3VwLmNsYXNzTGlzdC5hZGQoJ2xheW91dCcpO1xuXG4gICAgY29uc3QgJGludGVyYWN0aW9uc0dyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgICRpbnRlcmFjdGlvbnNHcm91cC5jbGFzc0xpc3QuYWRkKCdpbnRlcmFjdGlvbnMnKTtcblxuICAgICRzdmcuYXBwZW5kQ2hpbGQoJGRlZnMpO1xuICAgICRzdmcuYXBwZW5kQ2hpbGQoJGJhY2tncm91bmQpO1xuICAgICRvZmZzZXRHcm91cC5hcHBlbmRDaGlsZCgkbGF5b3V0R3JvdXApO1xuICAgICRzdmcuYXBwZW5kQ2hpbGQoJG9mZnNldEdyb3VwKTtcbiAgICAkc3ZnLmFwcGVuZENoaWxkKCRpbnRlcmFjdGlvbnNHcm91cCk7XG5cbiAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCgkc3ZnKTtcbiAgICAvLyByZW1vdmVzIGFkZGl0aW9ubmFsIGhlaWdodCBhZGRlZCB3aG8ga25vd3Mgd2h5Li4uXG4gICAgdGhpcy4kZWwuc3R5bGUuZm9udFNpemUgPSAwO1xuICAgIC8vIGZpeGVzIG9uZSBvZiB0aGUgKG1hbnkgPykgd2VpcmQgY2FudmFzIHJlbmRlcmluZyBidWdzIGluIENocm9tZVxuICAgIHRoaXMuJGVsLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVaKDApJztcblxuICAgIHRoaXMuJGxheW91dCA9ICRsYXlvdXRHcm91cDtcbiAgICB0aGlzLiRvZmZzZXQgPSAkb2Zmc2V0R3JvdXA7XG4gICAgdGhpcy4kaW50ZXJhY3Rpb25zID0gJGludGVyYWN0aW9uc0dyb3VwO1xuICAgIHRoaXMuJHN2ZyA9ICRzdmc7XG4gICAgdGhpcy4kYmFja2dyb3VuZCA9ICRiYWNrZ3JvdW5kO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBsYXllciB0byB0aGUgdHJhY2tcbiAgICovXG4gIGFkZChsYXllcikge1xuICAgIHRoaXMubGF5ZXJzLnB1c2gobGF5ZXIpO1xuICAgIC8vIENyZWF0ZSBhIGRlZmF1bHQgcmVuZGVyaW5nQ29udGV4dCBmb3IgdGhlIGxheWVyIGlmIG1pc3NpbmdcbiAgICB0aGlzLiRsYXlvdXQuYXBwZW5kQ2hpbGQobGF5ZXIuJGVsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgbGF5ZXJcbiAgICovXG4gIHJlbW92ZShsYXllcikge1xuICAgIHRoaXMubGF5ZXJzLnNwbGljZSh0aGlzLmxheWVycy5pbmRleE9mKGxheWVyKSwgMSk7XG4gICAgLy8gUmVtb3ZlcyBsYXllciBmcm9tIGl0cyBjb250YWluZXJcbiAgICB0aGlzLiRsYXlvdXQucmVtb3ZlQ2hpbGQobGF5ZXIuJGVsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgRGVmaW5lcyBpZiBhIGdpdmVuIGVsZW1lbnQgYmVsb25ncyB0byB0aGUgdHJhY2tcbiAgICogIEBwYXJhbSB7RE9NRWxlbWVudH0gJGVsXG4gICAqICBAcmV0dXJuIHtib29sfVxuICAgKi9cbiAgaGFzRWxlbWVudCgkZWwpIHtcbiAgICBkbyB7XG4gICAgICBpZiAoJGVsID09PSB0aGlzLiRlbCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgJGVsID0gJGVsLnBhcmVudE5vZGU7XG4gICAgfSB3aGlsZSAoJGVsICE9PSBudWxsKTtcblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEcmF3IHRyYWNrcywgYW5kIHRoZSBsYXllcnMgaW4gY2FzY2FkZVxuICAgKi9cbiAgcmVuZGVyKCkge1xuICAgIGZvciAobGV0IGxheWVyIG9mIHRoaXMpIHsgbGF5ZXIucmVuZGVyKCk7IH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdGhlIGxheWVyc1xuICAgKi9cbiAgdXBkYXRlKGxheWVycyA9IG51bGwpIHtcbiAgICB0aGlzLnVwZGF0ZUNvbnRhaW5lcigpO1xuICAgIHRoaXMudXBkYXRlTGF5ZXJzKGxheWVycyk7XG4gIH1cblxuICB1cGRhdGVDb250YWluZXIoKSB7XG4gICAgY29uc3QgJHN2ZyA9IHRoaXMuJHN2ZztcbiAgICBjb25zdCAkb2Zmc2V0ID0gdGhpcy4kb2Zmc2V0O1xuICAgIC8vIFNob3VsZCBiZSBpbiBzb21lIHVwZGF0ZSBsYXlvdXRcbiAgICBjb25zdCByZW5kZXJpbmdDb250ZXh0ID0gdGhpcy5yZW5kZXJpbmdDb250ZXh0O1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuICAgIGNvbnN0IHdpZHRoID0gcmVuZGVyaW5nQ29udGV4dC52aXNpYmxlV2lkdGg7XG4gICAgY29uc3Qgb2Zmc2V0WCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwocmVuZGVyaW5nQ29udGV4dC5vZmZzZXQpO1xuICAgIGNvbnN0IHRyYW5zbGF0ZSA9IGB0cmFuc2xhdGUoJHtvZmZzZXRYfSwgMClgO1xuXG4gICAgJHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgaGVpZ2h0KTtcbiAgICAkc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHdpZHRoKTtcbiAgICAkc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICd2aWV3Ym94JywgYDAgMCAke3dpZHRofSAke2hlaWdodH1gKTtcblxuICAgICRvZmZzZXQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIHRyYW5zbGF0ZSk7XG4gIH1cblxuICB1cGRhdGVMYXllcnMobGF5ZXJzID0gbnVsbCkge1xuICAgIGxheWVycyA9IChsYXllcnMgPT09IG51bGwpID8gdGhpcy5sYXllcnMgOiBsYXllcnM7XG5cbiAgICBsYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHtcbiAgICAgIGlmICh0aGlzLmxheWVycy5pbmRleE9mKGxheWVyKSA9PT0gLTEpIHsgcmV0dXJuOyB9XG4gICAgICBsYXllci51cGRhdGUoKTtcbiAgICB9KTtcbiAgfVxuXG4gICpbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICB5aWVsZCogdGhpcy5sYXllcnNbU3ltYm9sLml0ZXJhdG9yXSgpO1xuICB9XG59XG4iXX0=