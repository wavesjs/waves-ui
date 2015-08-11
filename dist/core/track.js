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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3RyYWNrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFBZSxhQUFhOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUEwRFAsS0FBSzs7Ozs7OztBQU1iLFdBTlEsS0FBSyxDQU1aLEdBQUcsRUFBZ0I7UUFBZCxNQUFNLHlEQUFHLEdBQUc7OzBCQU5WLEtBQUs7O0FBT3RCLFFBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ2YsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDakIsUUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7OztBQUd0QixRQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDOztBQUU3QixRQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztHQUN6Qjs7Ozs7OztlQWZrQixLQUFLOzs7Ozs7Ozs7OztXQW9DZixtQkFBQyxnQkFBZ0IsRUFBRTtBQUMxQixVQUFJLENBQUMsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUM7S0FDMUM7Ozs7Ozs7O1dBTU0sbUJBQUc7Ozs7QUFFUixVQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEMsVUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLO2VBQUssTUFBSyxPQUFPLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7T0FBQSxDQUFDLENBQUM7O0FBRXBFLFVBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLFVBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7QUFDN0IsVUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0tBQ3hCOzs7Ozs7O1dBS2UsNEJBQUc7QUFDakIsVUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLGVBQWUseUJBQUss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TUFBTSxHQUFHLE1BQU0sQ0FBQzs7QUFFbEQsWUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUssRUFBSztBQUN4QixZQUFJLE9BQUssTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUFFLGlCQUFPO1NBQUU7QUFDbEQsYUFBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO09BQ2hCLENBQUMsQ0FBQztLQUNKOzs7b0NBRWlCOzs7OzBEQUNULElBQUksQ0FBQyxNQUFNOzs7Ozs7O0tBQ25COzs7U0EzSVMsZUFBRztBQUNYLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztLQUNyQjtTQUVTLGFBQUMsS0FBSyxFQUFFO0FBQ2hCLFVBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0tBRXRCOzs7U0E1QmtCLEtBQUs7OztxQkFBTCxLQUFLIiwiZmlsZSI6ImVzNi9jb3JlL3RyYWNrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG5zIGZyb20gJy4vbmFtZXNwYWNlJztcblxuXG4vKipcbiAqIEFzIGEgdGVtcG9yYWwgcmVwcmVzZW50YXRpb24sIGEgdHJhY2sgZXN0YWJsaXNoZXMgYSByZWxhdGlvbiBiZXR3ZWVuICp0aW1lKiBpbiBzZWNvbmRzIGFuZCAqc3BhY2UqIGluIHBpeGVscy5cbiAqXG4gKiBBIGBUcmFja2AgaW5zdGFuY2UgY2FuIGhhdmUgbXVsdGlwbGUgYExheWVyYCBpbnN0YW5jZXMuXG4gKlxuICogIyMjIFRyYWNrcyBpbnNpZGUgYSB0aW1lbGluZVxuICpcbiAqIEEgdGVtcG9yYWwgcmVwcmVzZW50YXRpb24gY2FuIGJlIHJlbmRlcmVkIHVwb24gbXVsdGlwbGUgRE9NIGVsZW1lbnRzLCB0aGUgdHJhY2tzIChlZyBtdWx0aXBsZSBgPGxpPmAgZm9yIGEgREFXIGxpa2UgcmVwcmVzZW50YXRpb24pIHRoYXQgYmVsb25nIHRvIHRoZSBzYW1lIHRpbWVsaW5lIHVzaW5nIHRoZSBgYWRkYCBtZXRob2QuIFRoZXNlIHRyYWNrcyBhcmUgbGlrZSB3aW5kb3dzIG9uIHRoZSBvdmVyYWxsIGFuZCBiYXNpY2FsbHkgdW5lbmRpbmcgdGltZWxpbmUuXG4gKlxuICogIyMjIEEgdGltZWxpbmUgd2l0aCAzIHRyYWNrczpcbiAqXG4gKiBgYGBcbiAqICstLS0tLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKy0tIC0gLSAgLSAgLSAgIC1cbiAqIHx0cmFjayAxICAgICAgICAgIHx4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4fFxuICogKy0tLS0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rLS0gLSAtICAtICAtICAgLVxuICogfHRyYWNrIDIgICAgICAgICAgfHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh8XG4gKiArLS0tLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSstLSAtIC0gIC0gIC0gICAtXG4gKiB8dHJhY2sgMyAgICAgICAgICB8eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHxcbiAqICstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKy0tIC0gLSAgLSAgLSAgIC1cbiAqXG4gKiArLS0tLS0tLS0tLS0tLS0tLS0+XG4gKiB0aW1lbGluZS50aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aW1lbGluZS50aW1lQ29udGV4dC5vZmZzZXQpXG4gKlxuICogICAgICAgICAgICAgICAgICAgPC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0+XG4gKiAgICAgICAgICAgICAgICAgICB0aW1lbGluZSdzIHRyYWNrcyBkZWZhdWx0cyB0byAxMDAwcHhcbiAqICAgICAgICAgICAgICAgICAgIHdpdGggYSBkZWZhdWx0IHBpeGVsc1BlclNlY29uZCBvZiAxMDBweC9zLlxuICogICAgICAgICAgICAgICAgICAgYW5kIGEgZGVmYXVsdCBgc3RyZXRjaFJhdGlvID0gMWBcbiAqICAgICAgICAgICAgICAgICAgIHRyYWNrMSBzaG93cyAxMCBzZWNvbmRzIG9mIHRoZSB0aW1lbGluZVxuICogYGBgXG4gKlxuICogIyMjIExheWVycyBpbnNpZGUgYSB0cmFja1xuICpcbiAqIFdpdGhpbiBhIHRyYWNrLCBhIGBMYXllcmAga2VlcHMgdXAtdG8tZGF0ZSBhbmQgcmVuZGVycyB0aGUgZGF0YS4gVGhlIHRyYWNrJ3MgYGFkZGAgbWV0aG9kIGFkZHMgYSBgTGF5ZXJgIGluc3RhbmNlIHRvIGEgdHJhY2suXG4gKlxuICogIyMjIFRoZSB0cmFjayByZW5kZXJpbmdDb250ZXh0XG4gKlxuICogV2hlbiBvbmUgbW9kaWZ5IHRoZSB0aW1lbGluZSByZW5kZXJpbmdDb250ZXh0OlxuICpcbiAqIC0gdGltZWxpbmUucmVuZGVyaW5nQ29udGV4dC5vZmZzZXQgKGluIHNlY29uZHMpIG1vZGlmeSB0aGUgY29udGFpbmVycyB0cmFjayB4IHBvc2l0aW9uXG4gKiAtIHRpbWVsaW5lLnJlbmRlcmluZ0NvbnRleHQuc3RyZXRjaFJhdGlvIG1vZGlmeSB0aW1lbGluZSdzIHpvb21cbiAqIEVhY2ggdGltZSB5b3Ugc2V0IG5ldyB2YWx1ZSBvZiBvZmZzZXQgb3Igc3RyZXRjaFJhdGlvLCB5b3UgbmVlZCB0byBkbyBgdGltZWxpbmUudXBkYXRlKClgIHRvIHVwZGF0ZSB0aGUgdmFsdWVzLlxuICpcbiAqICMjIyBUcmFjayBTVkcgc3RydWN0dXJlXG4gKlxuICogYGBgaHRtbFxuICogPHN2ZyBjbGFzcz1cInRyYWNrXCIgeG1sbnM6eGh0bWw9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCIgaGVpZ2h0PVwiMTAwXCIgc2hhcGUtcmVuZGVyaW5nPVwib3B0aW1pemVTcGVlZFwiPlxuICogICA8ZGVmcz48L2RlZnM+IFVudXNlZCBmb3IgdGhlIG1vbWVudCwgY291bGQgYmUgdXNlZCB0byBkZWZpbmUgY3VzdG9tIHNoYXBlcyBmb3IgdXNlIHdpdGggbGF5ZXJzXG4gKiAgIDxyZWN0IHN0eWxlPVwiZmlsbC1vcGFjaXR5OjBcIiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCI+PC9yZWN0PlxuICogICA8ZyBjbGFzcz1cIm9mZnNldFwiPlxuICogICAgIDxnIGNsYXNzPVwibGF5b3V0XCI+PC9nPiBUaGUgbGF5ZXJzIGFyZSBpbnNlcnRlZCBoZXJlXG4gKiAgIDwvZz5cbiAqICAgPGcgY2xhc3M9XCJpbnRlcmFjdGlvbnNcIj48L2c+IFBsYWNlaG9sZGVyIHRvIHZpc3VhbGl6ZSBpbnRlcmFjdGlvbnMgKGVnLiBicnVzaClcbiAqIDwvc3ZnPlxuICogYGBgXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyYWNrIHtcbiAgLyoqXG4gICAqIENyZWF0ZSB0aGUgdHJhY2sgb2YgdGhlIGdpdmVuIGBoZWlnaHRgIGluIHRoZSBnaXZlbiBgJGVsYFxuICAgKiBAcGFyYW0ge0RPTUVsZW1lbnR9ICRlbFxuICAgKiBAcGFyYW0ge051bWJlcn0gW2hlaWdodCA9IDEwMF1cbiAgICovXG4gIGNvbnN0cnVjdG9yKCRlbCwgaGVpZ2h0ID0gMTAwKSB7XG4gICAgdGhpcy4kZWwgPSAkZWw7XG4gICAgdGhpcy5sYXllcnMgPSBbXTtcbiAgICB0aGlzLl9oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICAvLyBhcmUgc2V0IHdoZW4gYWRkZWQgdG8gdGhlIHRpbWVsaW5lXG4gICAgdGhpcy5yZW5kZXJpbmdDb250ZXh0ID0gbnVsbDtcblxuICAgIHRoaXMuX2NyZWF0ZUNvbnRhaW5lcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlIE51bWJlclxuICAgKiBAZGVmYXVsdCAxMDBcbiAgICovXG4gIGdldCBoZWlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlaWdodDtcbiAgfVxuXG4gIHNldCBoZWlnaHQodmFsdWUpIHtcbiAgICB0aGlzLl9oZWlnaHQgPSB2YWx1ZTtcbiAgICAvLyBATk9URTogcHJvcGFnYXRlIHRvIGxheWVycywga2VlcGluZyByYXRpbyA/IGNvdWxkIGJlIGhhbmR5IGZvciB2ZXJ0aWNhbCByZXNpemVcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgd2hlbiB0aGUgdHJhY2sgaXMgYWRkZWQgdG8gdGhlIHRpbWVsaW5lLlxuICAgKiBUaGUgdHJhY2sgY2Fubm90IGJlIHVwZGF0ZWQgd2l0aG91dCBiZWluZyBhZGRlZCB0byBhIHRpbWVsaW5lLlxuICAgKiBAcGFyYW0ge1RpbWVsaW5lVGltZUNvbnRleHR9IHJlbmRlcmluZ0NvbnRleHRcbiAgICogQHNlbWktcHJpdmF0ZVxuICAgKi9cbiAgY29uZmlndXJlKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICB0aGlzLnJlbmRlcmluZ0NvbnRleHQgPSByZW5kZXJpbmdDb250ZXh0O1xuICB9XG5cbiAgLyoqXG4gICAqIERlc3Ryb3kgYSB0cmFja1xuICAgKiBUaGUgbGF5ZXJzIGZyb20gdGhpcyB0cmFjayBjYW4gc3RpbGwgYmUgcmV1c2VkIGVsc2V3aGVyZVxuICAgKi9cbiAgZGVzdHJveSgpIHtcbiAgICAvLyBEZXRhY2ggZXZlcnl0aGluZyBmcm9tIHRoZSBET01cbiAgICB0aGlzLiRlbC5yZW1vdmVDaGlsZCh0aGlzLiRzdmcpO1xuICAgIHRoaXMubGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB0aGlzLiRsYXlvdXQucmVtb3ZlQ2hpbGQobGF5ZXIuJGVsKSk7XG4gICAgLy8gY2xlYW4gcmVmZXJlbmNlc1xuICAgIHRoaXMuJGVsID0gbnVsbDtcbiAgICB0aGlzLnJlbmRlcmluZ0NvbnRleHQgPSBudWxsO1xuICAgIHRoaXMubGF5ZXJzLmxlbmd0aCA9IDA7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyB0aGUgY29udGFpbmVyIGZvciB0aGUgdHJhY2tcbiAgICovXG4gIF9jcmVhdGVDb250YWluZXIoKSB7XG4gICAgY29uc3QgJHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3N2ZycpO1xuICAgICRzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdvcHRpbWl6ZVNwZWVkJyk7XG4gICAgJHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgdGhpcy5oZWlnaHQpO1xuICAgICRzdmcuc2V0QXR0cmlidXRlKCd4bWxuczp4aHRtbCcsICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJyk7XG4gICAgJHN2Zy5jbGFzc0xpc3QuYWRkKCd0cmFjaycpO1xuXG4gICAgY29uc3QgJGJhY2tncm91bmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdyZWN0Jyk7XG4gICAgJGJhY2tncm91bmQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsICcxMDAlJyk7XG4gICAgJGJhY2tncm91bmQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgJzEwMCUnKTtcbiAgICAkYmFja2dyb3VuZC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3R5bGUnLCAnZmlsbC1vcGFjaXR5OjAnKTtcblxuICAgIGNvbnN0ICRkZWZzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZGVmcycpO1xuXG4gICAgY29uc3QgJG9mZnNldEdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgICRvZmZzZXRHcm91cC5jbGFzc0xpc3QuYWRkKCdvZmZzZXQnKTtcblxuICAgIGNvbnN0ICRsYXlvdXRHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICAkbGF5b3V0R3JvdXAuY2xhc3NMaXN0LmFkZCgnbGF5b3V0Jyk7XG5cbiAgICBjb25zdCAkaW50ZXJhY3Rpb25zR3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgJGludGVyYWN0aW9uc0dyb3VwLmNsYXNzTGlzdC5hZGQoJ2ludGVyYWN0aW9ucycpO1xuXG4gICAgJHN2Zy5hcHBlbmRDaGlsZCgkZGVmcyk7XG4gICAgJHN2Zy5hcHBlbmRDaGlsZCgkYmFja2dyb3VuZCk7XG4gICAgJG9mZnNldEdyb3VwLmFwcGVuZENoaWxkKCRsYXlvdXRHcm91cCk7XG4gICAgJHN2Zy5hcHBlbmRDaGlsZCgkb2Zmc2V0R3JvdXApO1xuICAgICRzdmcuYXBwZW5kQ2hpbGQoJGludGVyYWN0aW9uc0dyb3VwKTtcblxuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKCRzdmcpO1xuICAgIC8vIHJlbW92ZXMgYWRkaXRpb25uYWwgaGVpZ2h0IGFkZGVkIHdobyBrbm93cyB3aHkuLi5cbiAgICB0aGlzLiRlbC5zdHlsZS5mb250U2l6ZSA9IDA7XG4gICAgLy8gZml4ZXMgb25lIG9mIHRoZSAobWFueSA/KSB3ZWlyZCBjYW52YXMgcmVuZGVyaW5nIGJ1Z3MgaW4gQ2hyb21lXG4gICAgdGhpcy4kZWwuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVooMCknO1xuXG4gICAgdGhpcy4kbGF5b3V0ID0gJGxheW91dEdyb3VwO1xuICAgIHRoaXMuJG9mZnNldCA9ICRvZmZzZXRHcm91cDtcbiAgICB0aGlzLiRpbnRlcmFjdGlvbnMgPSAkaW50ZXJhY3Rpb25zR3JvdXA7XG4gICAgdGhpcy4kc3ZnID0gJHN2ZztcbiAgICB0aGlzLiRiYWNrZ3JvdW5kID0gJGJhY2tncm91bmQ7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGxheWVyIHRvIHRoZSB0cmFja1xuICAgKi9cbiAgYWRkKGxheWVyKSB7XG4gICAgdGhpcy5sYXllcnMucHVzaChsYXllcik7XG4gICAgLy8gQ3JlYXRlIGEgZGVmYXVsdCByZW5kZXJpbmdDb250ZXh0IGZvciB0aGUgbGF5ZXIgaWYgbWlzc2luZ1xuICAgIHRoaXMuJGxheW91dC5hcHBlbmRDaGlsZChsYXllci4kZWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBsYXllclxuICAgKi9cbiAgcmVtb3ZlKGxheWVyKSB7XG4gICAgdGhpcy5sYXllcnMuc3BsaWNlKHRoaXMubGF5ZXJzLmluZGV4T2YobGF5ZXIpLCAxKTtcbiAgICAvLyBSZW1vdmVzIGxheWVyIGZyb20gaXRzIGNvbnRhaW5lclxuICAgIHRoaXMuJGxheW91dC5yZW1vdmVDaGlsZChsYXllci4kZWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIERyYXcgdHJhY2tzLCBhbmQgdGhlIGxheWVycyBpbiBjYXNjYWRlXG4gICAqL1xuICByZW5kZXIoKSB7XG4gICAgZm9yIChsZXQgbGF5ZXIgb2YgdGhpcykgeyBsYXllci5yZW5kZXIoKTsgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB0aGUgbGF5ZXJzXG4gICAqL1xuICB1cGRhdGUobGF5ZXJzID0gbnVsbCkge1xuICAgIHRoaXMudXBkYXRlQ29udGFpbmVyKCk7XG4gICAgdGhpcy51cGRhdGVMYXllcnMobGF5ZXJzKTtcbiAgfVxuXG4gIHVwZGF0ZUNvbnRhaW5lcigpIHtcbiAgICBjb25zdCAkc3ZnID0gdGhpcy4kc3ZnO1xuICAgIGNvbnN0ICRvZmZzZXQgPSB0aGlzLiRvZmZzZXQ7XG4gICAgLy8gU2hvdWxkIGJlIGluIHNvbWUgdXBkYXRlIGxheW91dFxuICAgIGNvbnN0IHJlbmRlcmluZ0NvbnRleHQgPSB0aGlzLnJlbmRlcmluZ0NvbnRleHQ7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gICAgY29uc3Qgd2lkdGggPSByZW5kZXJpbmdDb250ZXh0LnZpc2libGVXaWR0aDtcbiAgICBjb25zdCBvZmZzZXRYID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChyZW5kZXJpbmdDb250ZXh0Lm9mZnNldCk7XG4gICAgY29uc3QgdHJhbnNsYXRlID0gYHRyYW5zbGF0ZSgke29mZnNldFh9LCAwKWA7XG5cbiAgICAkc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBoZWlnaHQpO1xuICAgICRzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgd2lkdGgpO1xuICAgICRzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3ZpZXdib3gnLCBgMCAwICR7d2lkdGh9ICR7aGVpZ2h0fWApO1xuXG4gICAgJG9mZnNldC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgdHJhbnNsYXRlKTtcbiAgfVxuXG4gIHVwZGF0ZUxheWVycyhsYXllcnMgPSBudWxsKSB7XG4gICAgbGF5ZXJzID0gKGxheWVycyA9PT0gbnVsbCkgPyB0aGlzLmxheWVycyA6IGxheWVycztcblxuICAgIGxheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgICAgaWYgKHRoaXMubGF5ZXJzLmluZGV4T2YobGF5ZXIpID09PSAtMSkgeyByZXR1cm47IH1cbiAgICAgIGxheWVyLnVwZGF0ZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgKltTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgIHlpZWxkKiB0aGlzLmxheWVyc1tTeW1ib2wuaXRlcmF0b3JdKCk7XG4gIH1cbn1cbiJdfQ==