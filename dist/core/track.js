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
      $background.setAttributeNS(null, 'style', 'fill-opacity:0');

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3RyYWNrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFBZSxhQUFhOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUEwRFAsS0FBSzs7Ozs7OztBQU1iLFdBTlEsS0FBSyxDQU1aLEdBQUcsRUFBZ0I7UUFBZCxNQUFNLHlEQUFHLEdBQUc7OzBCQU5WLEtBQUs7O0FBT3RCLFFBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ2YsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDakIsUUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7OztBQUd0QixRQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDOztBQUU3QixRQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztHQUN6Qjs7Ozs7OztlQWZrQixLQUFLOzs7Ozs7Ozs7OztXQW9DZixtQkFBQyxnQkFBZ0IsRUFBRTtBQUMxQixVQUFJLENBQUMsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUM7S0FDMUM7Ozs7Ozs7O1dBTU0sbUJBQUc7Ozs7QUFFUixVQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEMsVUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLO2VBQUssTUFBSyxPQUFPLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7T0FBQSxDQUFDLENBQUM7O0FBRXBFLFVBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLFVBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7QUFDN0IsVUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0tBQ3hCOzs7Ozs7O1dBS2UsNEJBQUc7QUFDakIsVUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLGVBQWUseUJBQUss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QUksRUFBRSxTQUFTLFdBQVMsS0FBSyxTQUFJLE1BQU0sQ0FBRyxDQUFDOztBQUUvRCxhQUFPLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7S0FDdEQ7OztXQUVXLHdCQUFnQjs7O1VBQWYsTUFBTSx5REFBRyxJQUFJOztBQUN4QixZQUFNLEdBQUcsQUFBQyxNQUFNLEtBQUssSUFBSSxHQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDOztBQUVsRCxZQUFNLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFLO0FBQ3hCLFlBQUksT0FBSyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQUUsaUJBQU87U0FBRTtBQUNsRCxhQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7T0FDaEIsQ0FBQyxDQUFDO0tBQ0o7OztvQ0FFaUI7Ozs7MERBQ1QsSUFBSSxDQUFDLE1BQU07Ozs7Ozs7S0FDbkI7OztTQTVKUyxlQUFHO0FBQ1gsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0tBQ3JCO1NBRVMsYUFBQyxLQUFLLEVBQUU7QUFDaEIsVUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7S0FFdEI7OztTQTVCa0IsS0FBSzs7O3FCQUFMLEtBQUsiLCJmaWxlIjoiZXM2L2NvcmUvdHJhY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbnMgZnJvbSAnLi9uYW1lc3BhY2UnO1xuXG5cbi8qKlxuICogQXMgYSB0ZW1wb3JhbCByZXByZXNlbnRhdGlvbiwgYSB0cmFjayBlc3RhYmxpc2hlcyBhIHJlbGF0aW9uIGJldHdlZW4gKnRpbWUqIGluIHNlY29uZHMgYW5kICpzcGFjZSogaW4gcGl4ZWxzLlxuICpcbiAqIEEgYFRyYWNrYCBpbnN0YW5jZSBjYW4gaGF2ZSBtdWx0aXBsZSBgTGF5ZXJgIGluc3RhbmNlcy5cbiAqXG4gKiAjIyMgVHJhY2tzIGluc2lkZSBhIHRpbWVsaW5lXG4gKlxuICogQSB0ZW1wb3JhbCByZXByZXNlbnRhdGlvbiBjYW4gYmUgcmVuZGVyZWQgdXBvbiBtdWx0aXBsZSBET00gZWxlbWVudHMsIHRoZSB0cmFja3MgKGVnIG11bHRpcGxlIGA8bGk+YCBmb3IgYSBEQVcgbGlrZSByZXByZXNlbnRhdGlvbikgdGhhdCBiZWxvbmcgdG8gdGhlIHNhbWUgdGltZWxpbmUgdXNpbmcgdGhlIGBhZGRgIG1ldGhvZC4gVGhlc2UgdHJhY2tzIGFyZSBsaWtlIHdpbmRvd3Mgb24gdGhlIG92ZXJhbGwgYW5kIGJhc2ljYWxseSB1bmVuZGluZyB0aW1lbGluZS5cbiAqXG4gKiAjIyMgQSB0aW1lbGluZSB3aXRoIDMgdHJhY2tzOlxuICpcbiAqIGBgYFxuICogKy0tLS0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rLS0gLSAtICAtICAtICAgLVxuICogfHRyYWNrIDEgICAgICAgICAgfHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh8XG4gKiArLS0tLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSstLSAtIC0gIC0gIC0gICAtXG4gKiB8dHJhY2sgMiAgICAgICAgICB8eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHxcbiAqICstLS0tLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKy0tIC0gLSAgLSAgLSAgIC1cbiAqIHx0cmFjayAzICAgICAgICAgIHx4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4fFxuICogKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rLS0gLSAtICAtICAtICAgLVxuICpcbiAqICstLS0tLS0tLS0tLS0tLS0tLT5cbiAqIHRpbWVsaW5lLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRpbWVsaW5lLnRpbWVDb250ZXh0Lm9mZnNldClcbiAqXG4gKiAgICAgICAgICAgICAgICAgICA8LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLT5cbiAqICAgICAgICAgICAgICAgICAgIHRpbWVsaW5lJ3MgdHJhY2tzIGRlZmF1bHRzIHRvIDEwMDBweFxuICogICAgICAgICAgICAgICAgICAgd2l0aCBhIGRlZmF1bHQgcGl4ZWxzUGVyU2Vjb25kIG9mIDEwMHB4L3MuXG4gKiAgICAgICAgICAgICAgICAgICBhbmQgYSBkZWZhdWx0IGBzdHJldGNoUmF0aW8gPSAxYFxuICogICAgICAgICAgICAgICAgICAgdHJhY2sxIHNob3dzIDEwIHNlY29uZHMgb2YgdGhlIHRpbWVsaW5lXG4gKiBgYGBcbiAqXG4gKiAjIyMgTGF5ZXJzIGluc2lkZSBhIHRyYWNrXG4gKlxuICogV2l0aGluIGEgdHJhY2ssIGEgYExheWVyYCBrZWVwcyB1cC10by1kYXRlIGFuZCByZW5kZXJzIHRoZSBkYXRhLiBUaGUgdHJhY2sncyBgYWRkYCBtZXRob2QgYWRkcyBhIGBMYXllcmAgaW5zdGFuY2UgdG8gYSB0cmFjay5cbiAqXG4gKiAjIyMgVGhlIHRyYWNrIHJlbmRlcmluZ0NvbnRleHRcbiAqXG4gKiBXaGVuIG9uZSBtb2RpZnkgdGhlIHRpbWVsaW5lIHJlbmRlcmluZ0NvbnRleHQ6XG4gKlxuICogLSB0aW1lbGluZS5yZW5kZXJpbmdDb250ZXh0Lm9mZnNldCAoaW4gc2Vjb25kcykgbW9kaWZ5IHRoZSBjb250YWluZXJzIHRyYWNrIHggcG9zaXRpb25cbiAqIC0gdGltZWxpbmUucmVuZGVyaW5nQ29udGV4dC5zdHJldGNoUmF0aW8gbW9kaWZ5IHRpbWVsaW5lJ3Mgem9vbVxuICogRWFjaCB0aW1lIHlvdSBzZXQgbmV3IHZhbHVlIG9mIG9mZnNldCBvciBzdHJldGNoUmF0aW8sIHlvdSBuZWVkIHRvIGRvIGB0aW1lbGluZS51cGRhdGUoKWAgdG8gdXBkYXRlIHRoZSB2YWx1ZXMuXG4gKlxuICogIyMjIFRyYWNrIFNWRyBzdHJ1Y3R1cmVcbiAqXG4gKiBgYGBodG1sXG4gKiA8c3ZnIGNsYXNzPVwidHJhY2tcIiB4bWxuczp4aHRtbD1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWxcIiBoZWlnaHQ9XCIxMDBcIiBzaGFwZS1yZW5kZXJpbmc9XCJvcHRpbWl6ZVNwZWVkXCI+XG4gKiAgIDxkZWZzPjwvZGVmcz4gVW51c2VkIGZvciB0aGUgbW9tZW50LCBjb3VsZCBiZSB1c2VkIHRvIGRlZmluZSBjdXN0b20gc2hhcGVzIGZvciB1c2Ugd2l0aCBsYXllcnNcbiAqICAgPHJlY3Qgc3R5bGU9XCJmaWxsLW9wYWNpdHk6MFwiIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIj48L3JlY3Q+XG4gKiAgIDxnIGNsYXNzPVwib2Zmc2V0XCI+XG4gKiAgICAgPGcgY2xhc3M9XCJsYXlvdXRcIj48L2c+IFRoZSBsYXllcnMgYXJlIGluc2VydGVkIGhlcmVcbiAqICAgPC9nPlxuICogICA8ZyBjbGFzcz1cImludGVyYWN0aW9uc1wiPjwvZz4gUGxhY2Vob2xkZXIgdG8gdmlzdWFsaXplIGludGVyYWN0aW9ucyAoZWcuIGJydXNoKVxuICogPC9zdmc+XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhY2sge1xuICAvKipcbiAgICogQ3JlYXRlIHRoZSB0cmFjayBvZiB0aGUgZ2l2ZW4gYGhlaWdodGAgaW4gdGhlIGdpdmVuIGAkZWxgXG4gICAqIEBwYXJhbSB7RE9NRWxlbWVudH0gJGVsXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbaGVpZ2h0ID0gMTAwXVxuICAgKi9cbiAgY29uc3RydWN0b3IoJGVsLCBoZWlnaHQgPSAxMDApIHtcbiAgICB0aGlzLiRlbCA9ICRlbDtcbiAgICB0aGlzLmxheWVycyA9IFtdO1xuICAgIHRoaXMuX2hlaWdodCA9IGhlaWdodDtcblxuICAgIC8vIGFyZSBzZXQgd2hlbiBhZGRlZCB0byB0aGUgdGltZWxpbmVcbiAgICB0aGlzLnJlbmRlcmluZ0NvbnRleHQgPSBudWxsO1xuXG4gICAgdGhpcy5fY3JlYXRlQ29udGFpbmVyKCk7XG4gIH1cblxuICAvKipcbiAgICogQHR5cGUgTnVtYmVyXG4gICAqIEBkZWZhdWx0IDEwMFxuICAgKi9cbiAgZ2V0IGhlaWdodCgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xuICB9XG5cbiAgc2V0IGhlaWdodCh2YWx1ZSkge1xuICAgIHRoaXMuX2hlaWdodCA9IHZhbHVlO1xuICAgIC8vIEBOT1RFOiBwcm9wYWdhdGUgdG8gbGF5ZXJzLCBrZWVwaW5nIHJhdGlvID8gY291bGQgYmUgaGFuZHkgZm9yIHZlcnRpY2FsIHJlc2l6ZVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCB3aGVuIHRoZSB0cmFjayBpcyBhZGRlZCB0byB0aGUgdGltZWxpbmUuXG4gICAqIFRoZSB0cmFjayBjYW5ub3QgYmUgdXBkYXRlZCB3aXRob3V0IGJlaW5nIGFkZGVkIHRvIGEgdGltZWxpbmUuXG4gICAqIEBwYXJhbSB7VGltZWxpbmVUaW1lQ29udGV4dH0gcmVuZGVyaW5nQ29udGV4dFxuICAgKiBAc2VtaS1wcml2YXRlXG4gICAqL1xuICBjb25maWd1cmUocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIHRoaXMucmVuZGVyaW5nQ29udGV4dCA9IHJlbmRlcmluZ0NvbnRleHQ7XG4gIH1cblxuICAvKipcbiAgICogRGVzdHJveSBhIHRyYWNrXG4gICAqIFRoZSBsYXllcnMgZnJvbSB0aGlzIHRyYWNrIGNhbiBzdGlsbCBiZSByZXVzZWQgZWxzZXdoZXJlXG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIC8vIERldGFjaCBldmVyeXRoaW5nIGZyb20gdGhlIERPTVxuICAgIHRoaXMuJGVsLnJlbW92ZUNoaWxkKHRoaXMuJHN2Zyk7XG4gICAgdGhpcy5sYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHRoaXMuJGxheW91dC5yZW1vdmVDaGlsZChsYXllci4kZWwpKTtcbiAgICAvLyBjbGVhbiByZWZlcmVuY2VzXG4gICAgdGhpcy4kZWwgPSBudWxsO1xuICAgIHRoaXMucmVuZGVyaW5nQ29udGV4dCA9IG51bGw7XG4gICAgdGhpcy5sYXllcnMubGVuZ3RoID0gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIHRoZSBjb250YWluZXIgZm9yIHRoZSB0cmFja1xuICAgKi9cbiAgX2NyZWF0ZUNvbnRhaW5lcigpIHtcbiAgICBjb25zdCAkc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnc3ZnJyk7XG4gICAgJHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ29wdGltaXplU3BlZWQnKTtcbiAgICAkc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCB0aGlzLmhlaWdodCk7XG4gICAgJHN2Zy5zZXRBdHRyaWJ1dGUoJ3htbG5zOnhodG1sJywgJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnKTtcbiAgICAkc3ZnLmNsYXNzTGlzdC5hZGQoJ3RyYWNrJyk7XG5cbiAgICBjb25zdCAkYmFja2dyb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3JlY3QnKTtcbiAgICAkYmFja2dyb3VuZC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgJzEwMCUnKTtcbiAgICAkYmFja2dyb3VuZC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCAnMTAwJScpO1xuICAgICRiYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHlsZScsICdmaWxsLW9wYWNpdHk6MCcpO1xuXG4gICAgY29uc3QgJGRlZnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdkZWZzJyk7XG5cbiAgICBjb25zdCAkb2Zmc2V0R3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgJG9mZnNldEdyb3VwLmNsYXNzTGlzdC5hZGQoJ29mZnNldCcpO1xuXG4gICAgY29uc3QgJGxheW91dEdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgICRsYXlvdXRHcm91cC5jbGFzc0xpc3QuYWRkKCdsYXlvdXQnKTtcblxuICAgIGNvbnN0ICRpbnRlcmFjdGlvbnNHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICAkaW50ZXJhY3Rpb25zR3JvdXAuY2xhc3NMaXN0LmFkZCgnaW50ZXJhY3Rpb25zJyk7XG5cbiAgICAkc3ZnLmFwcGVuZENoaWxkKCRkZWZzKTtcbiAgICAkc3ZnLmFwcGVuZENoaWxkKCRiYWNrZ3JvdW5kKTtcbiAgICAkb2Zmc2V0R3JvdXAuYXBwZW5kQ2hpbGQoJGxheW91dEdyb3VwKTtcbiAgICAkc3ZnLmFwcGVuZENoaWxkKCRvZmZzZXRHcm91cCk7XG4gICAgJHN2Zy5hcHBlbmRDaGlsZCgkaW50ZXJhY3Rpb25zR3JvdXApO1xuXG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQoJHN2Zyk7XG4gICAgLy8gcmVtb3ZlcyBhZGRpdGlvbm5hbCBoZWlnaHQgYWRkZWQgd2hvIGtub3dzIHdoeS4uLlxuICAgIHRoaXMuJGVsLnN0eWxlLmZvbnRTaXplID0gMDtcbiAgICAvLyBmaXhlcyBvbmUgb2YgdGhlIChtYW55ID8pIHdlaXJkIGNhbnZhcyByZW5kZXJpbmcgYnVncyBpbiBDaHJvbWVcbiAgICB0aGlzLiRlbC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWigwKSc7XG5cbiAgICB0aGlzLiRsYXlvdXQgPSAkbGF5b3V0R3JvdXA7XG4gICAgdGhpcy4kb2Zmc2V0ID0gJG9mZnNldEdyb3VwO1xuICAgIHRoaXMuJGludGVyYWN0aW9ucyA9ICRpbnRlcmFjdGlvbnNHcm91cDtcbiAgICB0aGlzLiRzdmcgPSAkc3ZnO1xuICAgIHRoaXMuJGJhY2tncm91bmQgPSAkYmFja2dyb3VuZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgbGF5ZXIgdG8gdGhlIHRyYWNrXG4gICAqL1xuICBhZGQobGF5ZXIpIHtcbiAgICB0aGlzLmxheWVycy5wdXNoKGxheWVyKTtcbiAgICAvLyBDcmVhdGUgYSBkZWZhdWx0IHJlbmRlcmluZ0NvbnRleHQgZm9yIHRoZSBsYXllciBpZiBtaXNzaW5nXG4gICAgdGhpcy4kbGF5b3V0LmFwcGVuZENoaWxkKGxheWVyLiRlbCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGxheWVyXG4gICAqL1xuICByZW1vdmUobGF5ZXIpIHtcbiAgICB0aGlzLmxheWVycy5zcGxpY2UodGhpcy5sYXllcnMuaW5kZXhPZihsYXllciksIDEpO1xuICAgIC8vIFJlbW92ZXMgbGF5ZXIgZnJvbSBpdHMgY29udGFpbmVyXG4gICAgdGhpcy4kbGF5b3V0LnJlbW92ZUNoaWxkKGxheWVyLiRlbCk7XG4gIH1cblxuICAvKipcbiAgICogIERlZmluZXMgaWYgYSBnaXZlbiBlbGVtZW50IGJlbG9uZ3MgdG8gdGhlIHRyYWNrXG4gICAqICBAcGFyYW0ge0RPTUVsZW1lbnR9ICRlbFxuICAgKiAgQHJldHVybiB7Ym9vbH1cbiAgICovXG4gIGhhc0VsZW1lbnQoJGVsKSB7XG4gICAgZG8ge1xuICAgICAgaWYgKCRlbCA9PT0gdGhpcy4kZWwpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgICRlbCA9ICRlbC5wYXJlbnROb2RlO1xuICAgIH0gd2hpbGUgKCRlbCAhPT0gbnVsbCk7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogRHJhdyB0cmFja3MsIGFuZCB0aGUgbGF5ZXJzIGluIGNhc2NhZGVcbiAgICovXG4gIHJlbmRlcigpIHtcbiAgICBmb3IgKGxldCBsYXllciBvZiB0aGlzKSB7IGxheWVyLnJlbmRlcigpOyB9XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIHRoZSBsYXllcnNcbiAgICovXG4gIHVwZGF0ZShsYXllcnMgPSBudWxsKSB7XG4gICAgdGhpcy51cGRhdGVDb250YWluZXIoKTtcbiAgICB0aGlzLnVwZGF0ZUxheWVycyhsYXllcnMpO1xuICB9XG5cbiAgdXBkYXRlQ29udGFpbmVyKCkge1xuICAgIGNvbnN0ICRzdmcgPSB0aGlzLiRzdmc7XG4gICAgY29uc3QgJG9mZnNldCA9IHRoaXMuJG9mZnNldDtcbiAgICAvLyBTaG91bGQgYmUgaW4gc29tZSB1cGRhdGUgbGF5b3V0XG4gICAgY29uc3QgcmVuZGVyaW5nQ29udGV4dCA9IHRoaXMucmVuZGVyaW5nQ29udGV4dDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmhlaWdodDtcbiAgICBjb25zdCB3aWR0aCA9IHJlbmRlcmluZ0NvbnRleHQudmlzaWJsZVdpZHRoO1xuICAgIGNvbnN0IG9mZnNldFggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHJlbmRlcmluZ0NvbnRleHQub2Zmc2V0KTtcbiAgICBjb25zdCB0cmFuc2xhdGUgPSBgdHJhbnNsYXRlKCR7b2Zmc2V0WH0sIDApYDtcblxuICAgICRzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgJHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB3aWR0aCk7XG4gICAgJHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndmlld2JveCcsIGAwIDAgJHt3aWR0aH0gJHtoZWlnaHR9YCk7XG5cbiAgICAkb2Zmc2V0LnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCB0cmFuc2xhdGUpO1xuICB9XG5cbiAgdXBkYXRlTGF5ZXJzKGxheWVycyA9IG51bGwpIHtcbiAgICBsYXllcnMgPSAobGF5ZXJzID09PSBudWxsKSA/IHRoaXMubGF5ZXJzIDogbGF5ZXJzO1xuXG4gICAgbGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB7XG4gICAgICBpZiAodGhpcy5sYXllcnMuaW5kZXhPZihsYXllcikgPT09IC0xKSB7IHJldHVybjsgfVxuICAgICAgbGF5ZXIudXBkYXRlKCk7XG4gICAgfSk7XG4gIH1cblxuICAqW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgeWllbGQqIHRoaXMubGF5ZXJzW1N5bWJvbC5pdGVyYXRvcl0oKTtcbiAgfVxufVxuIl19