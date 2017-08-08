'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _iterator2 = require('babel-runtime/core-js/symbol/iterator');

var _iterator3 = _interopRequireDefault(_iterator2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _namespace = require('./namespace');

var _namespace2 = _interopRequireDefault(_namespace);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Acts as a placeholder to organize the vertical layout of the visualization
 * and the horizontal alignement to an abscissa that correspond to a common
 * time reference. It basically offer a view on the overall timeline.
 *
 * Tracks are inserted into a given DOM element, allowing to create DAW like
 * representations. Each `Track` instance can host multiple `Layer` instances.
 * A track must be added to a timeline before being updated.
 *
 * ### A timeline with 3 tracks:
 *
 * ```
 * 0                 6                               16
 * +- - - - - - - - -+-------------------------------+- - - - - - -
 * |                 |x track 1 xxxxxxxxxxxxxxxxxxxxx|
 * +- - - - - - - - -+-------------------------------+- - - - - - -
 * |                 |x track 2 xxxxxxxxxxxxxxxxxxxxx|
 * +- - - - - - - - -+-------------------------------+- - - - - - -
 * |                 |x track 3 xxxxxxxxxxxxxxxxxxxxx|
 * +- - - - - - - - ---------------------------------+- - - - - - -
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
 * ### Track DOM structure
 *
 * ```html
 * <svg width="${visibleWidth}">
 *   <!-- background -->
 *   <rect><rect>
 *   <!-- main view -->
 *   <g class="offset" transform="translate(${offset}, 0)">
 *     <g class="layout">
 *       <!-- layers -->
 *     </g>
 *   </g>
 *   <g class="interactions"><!-- for feedback --></g>
 * </svg>
 * ```
 */
var Track = function () {
  /**
   * @param {DOMElement} $el
   * @param {Number} [height = 100]
   */
  function Track($el) {
    var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
    (0, _classCallCheck3.default)(this, Track);

    this._height = height;

    /**
     * The DOM element in which the track is created.
     * @type {Element}
     */
    this.$el = $el;
    /**
     * A placeholder to add shapes for interactions feedback.
     * @type {Element}
     */
    this.$interactions = null;
    /** @type {Element} */
    this.$layout = null;
    /** @type {Element} */
    this.$offset = null;
    /** @type {Element} */
    this.$svg = null;
    /** @type {Element} */
    this.$background = null;

    /**
     * An array of all the layers belonging to the track.
     * @type {Array<Layer>}
     */
    this.layers = [];
    /**
     * The context used to maintain the DOM structure of the track.
     * @type {TimelineTimeContext}
     */
    this.renderingContext = null;

    this._createContainer();
  }

  /**
   * Returns the height of the track.
   *
   * @type {Number}
   */


  (0, _createClass3.default)(Track, [{
    key: 'configure',


    /**
     * This method is called when the track is added to the timeline. The
     * track cannot be updated without being added to a timeline.
     *
     * @private
     * @param {TimelineTimeContext} renderingContext
     */
    value: function configure(renderingContext) {
      this.renderingContext = renderingContext;
    }

    /**
     * Destroy the track. The layers from this track can still be reused elsewhere.
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
     * Creates the DOM structure of the track.
     */

  }, {
    key: '_createContainer',
    value: function _createContainer() {
      var $svg = document.createElementNS(_namespace2.default, 'svg');
      $svg.setAttributeNS(null, 'shape-rendering', 'optimizeSpeed');
      $svg.setAttributeNS(null, 'height', this.height);
      $svg.setAttribute('xmlns:xhtml', 'http://www.w3.org/1999/xhtml');
      $svg.classList.add('track');

      var $background = document.createElementNS(_namespace2.default, 'rect');
      $background.setAttributeNS(null, 'height', '100%');
      $background.setAttributeNS(null, 'width', '100%');
      $background.style.fillOpacity = 0;
      // $background.style.pointerEvents = 'none';

      var $defs = document.createElementNS(_namespace2.default, 'defs');

      var $offsetGroup = document.createElementNS(_namespace2.default, 'g');
      $offsetGroup.classList.add('offset');

      var $layoutGroup = document.createElementNS(_namespace2.default, 'g');
      $layoutGroup.classList.add('layout');

      var $interactionsGroup = document.createElementNS(_namespace2.default, 'g');
      $interactionsGroup.classList.add('interactions');

      $offsetGroup.appendChild($layoutGroup);
      $svg.appendChild($defs);
      $svg.appendChild($background);
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
     * Adds a layer to the track.
     *
     * @param {Layer} layer - the layer to add to the track.
     */

  }, {
    key: 'add',
    value: function add(layer) {
      this.layers.push(layer);
      // Create a default renderingContext for the layer if missing
      this.$layout.appendChild(layer.$el);
    }

    /**
     * Removes a layer from the track. The layer can be reused elsewhere.
     *
     * @param {Layer} layer - the layer to remove from the track.
     */

  }, {
    key: 'remove',
    value: function remove(layer) {
      this.layers.splice(this.layers.indexOf(layer), 1);
      // Removes layer from its container
      this.$layout.removeChild(layer.$el);
    }

    /**
     * Tests if a given element belongs to the track.
     *
     * @param {Element} $el
     * @return {bool}
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
     * Render all the layers added to the track.
     */

  }, {
    key: 'render',
    value: function render() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(this), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var layer = _step.value;
          layer.render();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    /**
     * Updates the track DOM structure and updates the layers.
     *
     * @param {Array<Layer>} [layers=null] - if not null, a subset of the layers to update.
     */

  }, {
    key: 'update',
    value: function update() {
      var layers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      this.updateContainer();
      this.updateLayers(layers);
    }

    /**
     * Updates the track DOM structure.
     */

  }, {
    key: 'updateContainer',
    value: function updateContainer() {
      var $svg = this.$svg;
      var $offset = this.$offset;
      // Should be in some update layout
      var renderingContext = this.renderingContext;
      var height = this.height;
      var width = Math.round(renderingContext.visibleWidth);
      var offsetX = Math.round(renderingContext.timeToPixel(renderingContext.offset));
      var translate = 'translate(' + offsetX + ', 0)';

      $svg.setAttributeNS(null, 'height', height);
      $svg.setAttributeNS(null, 'width', width);
      $svg.setAttributeNS(null, 'viewbox', '0 0 ' + width + ' ' + height);

      $offset.setAttributeNS(null, 'transform', translate);
    }

    /**
     * Updates the layers.
     *
     * @param {Array<Layer>} [layers=null] - if not null, a subset of the layers to update.
     */

  }, {
    key: 'updateLayers',
    value: function updateLayers() {
      var _this2 = this;

      var layers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      layers = layers === null ? this.layers : layers;

      layers.forEach(function (layer) {
        if (_this2.layers.indexOf(layer) === -1) {
          return;
        }
        layer.update();
      });
    }

    /**
     * Iterates through the added layers.
     */

  }, {
    key: _iterator3.default,
    value: _regenerator2.default.mark(function value() {
      return _regenerator2.default.wrap(function value$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.delegateYield((0, _getIterator3.default)(this.layers), 't0', 1);

            case 1:
            case 'end':
              return _context.stop();
          }
        }
      }, value, this);
    })
  }, {
    key: 'height',
    get: function get() {
      return this._height;
    }

    /**
     * Sets the height of the track.
     *
     * @type {Number}
     */
    ,
    set: function set(value) {
      var _this3 = this;

      var prevHeight = this._height;
      this._height = value;

      this.layers.forEach(function (layer) {
        return layer.updateHeight(prevHeight, _this3._height);
      });
    }
  }]);
  return Track;
}();

exports.default = Track;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRyYWNrLmpzIl0sIm5hbWVzIjpbIlRyYWNrIiwiJGVsIiwiaGVpZ2h0IiwiX2hlaWdodCIsIiRpbnRlcmFjdGlvbnMiLCIkbGF5b3V0IiwiJG9mZnNldCIsIiRzdmciLCIkYmFja2dyb3VuZCIsImxheWVycyIsInJlbmRlcmluZ0NvbnRleHQiLCJfY3JlYXRlQ29udGFpbmVyIiwicmVtb3ZlQ2hpbGQiLCJmb3JFYWNoIiwibGF5ZXIiLCJsZW5ndGgiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnROUyIsInNldEF0dHJpYnV0ZU5TIiwic2V0QXR0cmlidXRlIiwiY2xhc3NMaXN0IiwiYWRkIiwic3R5bGUiLCJmaWxsT3BhY2l0eSIsIiRkZWZzIiwiJG9mZnNldEdyb3VwIiwiJGxheW91dEdyb3VwIiwiJGludGVyYWN0aW9uc0dyb3VwIiwiYXBwZW5kQ2hpbGQiLCJmb250U2l6ZSIsInRyYW5zZm9ybSIsInB1c2giLCJzcGxpY2UiLCJpbmRleE9mIiwicGFyZW50Tm9kZSIsInJlbmRlciIsInVwZGF0ZUNvbnRhaW5lciIsInVwZGF0ZUxheWVycyIsIndpZHRoIiwiTWF0aCIsInJvdW5kIiwidmlzaWJsZVdpZHRoIiwib2Zmc2V0WCIsInRpbWVUb1BpeGVsIiwib2Zmc2V0IiwidHJhbnNsYXRlIiwidXBkYXRlIiwidmFsdWUiLCJwcmV2SGVpZ2h0IiwidXBkYXRlSGVpZ2h0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFHQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQThDcUJBLEs7QUFDbkI7Ozs7QUFJQSxpQkFBWUMsR0FBWixFQUErQjtBQUFBLFFBQWRDLE1BQWMsdUVBQUwsR0FBSztBQUFBOztBQUM3QixTQUFLQyxPQUFMLEdBQWVELE1BQWY7O0FBRUE7Ozs7QUFJQSxTQUFLRCxHQUFMLEdBQVdBLEdBQVg7QUFDQTs7OztBQUlBLFNBQUtHLGFBQUwsR0FBcUIsSUFB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QW9CO0FBQUEsZUFBU0MsTUFBTW1DLFlBQU4sQ0FBbUJELFVBQW5CLEVBQStCLE9BQUs3QyxPQUFwQyxDQUFUO0FBQUEsT0FBcEI7QUFDRDs7Ozs7a0JBNURrQkgsSyIsImZpbGUiOiJ0cmFjay5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBucyBmcm9tICcuL25hbWVzcGFjZSc7XG5cblxuLyoqXG4gKiBBY3RzIGFzIGEgcGxhY2Vob2xkZXIgdG8gb3JnYW5pemUgdGhlIHZlcnRpY2FsIGxheW91dCBvZiB0aGUgdmlzdWFsaXphdGlvblxuICogYW5kIHRoZSBob3Jpem9udGFsIGFsaWduZW1lbnQgdG8gYW4gYWJzY2lzc2EgdGhhdCBjb3JyZXNwb25kIHRvIGEgY29tbW9uXG4gKiB0aW1lIHJlZmVyZW5jZS4gSXQgYmFzaWNhbGx5IG9mZmVyIGEgdmlldyBvbiB0aGUgb3ZlcmFsbCB0aW1lbGluZS5cbiAqXG4gKiBUcmFja3MgYXJlIGluc2VydGVkIGludG8gYSBnaXZlbiBET00gZWxlbWVudCwgYWxsb3dpbmcgdG8gY3JlYXRlIERBVyBsaWtlXG4gKiByZXByZXNlbnRhdGlvbnMuIEVhY2ggYFRyYWNrYCBpbnN0YW5jZSBjYW4gaG9zdCBtdWx0aXBsZSBgTGF5ZXJgIGluc3RhbmNlcy5cbiAqIEEgdHJhY2sgbXVzdCBiZSBhZGRlZCB0byBhIHRpbWVsaW5lIGJlZm9yZSBiZWluZyB1cGRhdGVkLlxuICpcbiAqICMjIyBBIHRpbWVsaW5lIHdpdGggMyB0cmFja3M6XG4gKlxuICogYGBgXG4gKiAwICAgICAgICAgICAgICAgICA2ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDE2XG4gKiArLSAtIC0gLSAtIC0gLSAtIC0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSstIC0gLSAtIC0gLSAtXG4gKiB8ICAgICAgICAgICAgICAgICB8eCB0cmFjayAxIHh4eHh4eHh4eHh4eHh4eHh4eHh4eHxcbiAqICstIC0gLSAtIC0gLSAtIC0gLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKy0gLSAtIC0gLSAtIC1cbiAqIHwgICAgICAgICAgICAgICAgIHx4IHRyYWNrIDIgeHh4eHh4eHh4eHh4eHh4eHh4eHh4fFxuICogKy0gLSAtIC0gLSAtIC0gLSAtKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rLSAtIC0gLSAtIC0gLVxuICogfCAgICAgICAgICAgICAgICAgfHggdHJhY2sgMyB4eHh4eHh4eHh4eHh4eHh4eHh4eHh8XG4gKiArLSAtIC0gLSAtIC0gLSAtIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSstIC0gLSAtIC0gLSAtXG4gKiArLS0tLS0tLS0tLS0tLS0tLS0+XG4gKiB0aW1lbGluZS50aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aW1lbGluZS50aW1lQ29udGV4dC5vZmZzZXQpXG4gKlxuICogICAgICAgICAgICAgICAgICAgPC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0+XG4gKiAgICAgICAgICAgICAgICAgICB0aW1lbGluZSdzIHRyYWNrcyBkZWZhdWx0cyB0byAxMDAwcHhcbiAqICAgICAgICAgICAgICAgICAgIHdpdGggYSBkZWZhdWx0IHBpeGVsc1BlclNlY29uZCBvZiAxMDBweC9zLlxuICogICAgICAgICAgICAgICAgICAgYW5kIGEgZGVmYXVsdCBgc3RyZXRjaFJhdGlvID0gMWBcbiAqICAgICAgICAgICAgICAgICAgIHRyYWNrMSBzaG93cyAxMCBzZWNvbmRzIG9mIHRoZSB0aW1lbGluZVxuICogYGBgXG4gKlxuICogIyMjIFRyYWNrIERPTSBzdHJ1Y3R1cmVcbiAqXG4gKiBgYGBodG1sXG4gKiA8c3ZnIHdpZHRoPVwiJHt2aXNpYmxlV2lkdGh9XCI+XG4gKiAgIDwhLS0gYmFja2dyb3VuZCAtLT5cbiAqICAgPHJlY3Q+PHJlY3Q+XG4gKiAgIDwhLS0gbWFpbiB2aWV3IC0tPlxuICogICA8ZyBjbGFzcz1cIm9mZnNldFwiIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSgke29mZnNldH0sIDApXCI+XG4gKiAgICAgPGcgY2xhc3M9XCJsYXlvdXRcIj5cbiAqICAgICAgIDwhLS0gbGF5ZXJzIC0tPlxuICogICAgIDwvZz5cbiAqICAgPC9nPlxuICogICA8ZyBjbGFzcz1cImludGVyYWN0aW9uc1wiPjwhLS0gZm9yIGZlZWRiYWNrIC0tPjwvZz5cbiAqIDwvc3ZnPlxuICogYGBgXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyYWNrIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7RE9NRWxlbWVudH0gJGVsXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbaGVpZ2h0ID0gMTAwXVxuICAgKi9cbiAgY29uc3RydWN0b3IoJGVsLCBoZWlnaHQgPSAxMDApIHtcbiAgICB0aGlzLl9oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgRE9NIGVsZW1lbnQgaW4gd2hpY2ggdGhlIHRyYWNrIGlzIGNyZWF0ZWQuXG4gICAgICogQHR5cGUge0VsZW1lbnR9XG4gICAgICovXG4gICAgdGhpcy4kZWwgPSAkZWw7XG4gICAgLyoqXG4gICAgICogQSBwbGFjZWhvbGRlciB0byBhZGQgc2hhcGVzIGZvciBpbnRlcmFjdGlvbnMgZmVlZGJhY2suXG4gICAgICogQHR5cGUge0VsZW1lbnR9XG4gICAgICovXG4gICAgdGhpcy4kaW50ZXJhY3Rpb25zID0gbnVsbDtcbiAgICAvKiogQHR5cGUge0VsZW1lbnR9ICovXG4gICAgdGhpcy4kbGF5b3V0ID0gbnVsbDtcbiAgICAvKiogQHR5cGUge0VsZW1lbnR9ICovXG4gICAgdGhpcy4kb2Zmc2V0ID0gbnVsbDtcbiAgICAvKiogQHR5cGUge0VsZW1lbnR9ICovXG4gICAgdGhpcy4kc3ZnID0gbnVsbDtcbiAgICAvKiogQHR5cGUge0VsZW1lbnR9ICovXG4gICAgdGhpcy4kYmFja2dyb3VuZCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBBbiBhcnJheSBvZiBhbGwgdGhlIGxheWVycyBiZWxvbmdpbmcgdG8gdGhlIHRyYWNrLlxuICAgICAqIEB0eXBlIHtBcnJheTxMYXllcj59XG4gICAgICovXG4gICAgdGhpcy5sYXllcnMgPSBbXTtcbiAgICAvKipcbiAgICAgKiBUaGUgY29udGV4dCB1c2VkIHRvIG1haW50YWluIHRoZSBET00gc3RydWN0dXJlIG9mIHRoZSB0cmFjay5cbiAgICAgKiBAdHlwZSB7VGltZWxpbmVUaW1lQ29udGV4dH1cbiAgICAgKi9cbiAgICB0aGlzLnJlbmRlcmluZ0NvbnRleHQgPSBudWxsO1xuXG4gICAgdGhpcy5fY3JlYXRlQ29udGFpbmVyKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaGVpZ2h0IG9mIHRoZSB0cmFjay5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBoZWlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlaWdodDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBoZWlnaHQgb2YgdGhlIHRyYWNrLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgc2V0IGhlaWdodCh2YWx1ZSkge1xuICAgIGNvbnN0IHByZXZIZWlnaHQgPSB0aGlzLl9oZWlnaHQ7XG4gICAgdGhpcy5faGVpZ2h0ID0gdmFsdWU7XG5cbiAgICB0aGlzLmxheWVycy5mb3JFYWNoKGxheWVyID0+IGxheWVyLnVwZGF0ZUhlaWdodChwcmV2SGVpZ2h0LCB0aGlzLl9oZWlnaHQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgd2hlbiB0aGUgdHJhY2sgaXMgYWRkZWQgdG8gdGhlIHRpbWVsaW5lLiBUaGVcbiAgICogdHJhY2sgY2Fubm90IGJlIHVwZGF0ZWQgd2l0aG91dCBiZWluZyBhZGRlZCB0byBhIHRpbWVsaW5lLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge1RpbWVsaW5lVGltZUNvbnRleHR9IHJlbmRlcmluZ0NvbnRleHRcbiAgICovXG4gIGNvbmZpZ3VyZShyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgdGhpcy5yZW5kZXJpbmdDb250ZXh0ID0gcmVuZGVyaW5nQ29udGV4dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95IHRoZSB0cmFjay4gVGhlIGxheWVycyBmcm9tIHRoaXMgdHJhY2sgY2FuIHN0aWxsIGJlIHJldXNlZCBlbHNld2hlcmUuXG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIC8vIERldGFjaCBldmVyeXRoaW5nIGZyb20gdGhlIERPTVxuICAgIHRoaXMuJGVsLnJlbW92ZUNoaWxkKHRoaXMuJHN2Zyk7XG4gICAgdGhpcy5sYXllcnMuZm9yRWFjaChsYXllciA9PiB0aGlzLiRsYXlvdXQucmVtb3ZlQ2hpbGQobGF5ZXIuJGVsKSk7XG4gICAgLy8gY2xlYW4gcmVmZXJlbmNlc1xuICAgIHRoaXMuJGVsID0gbnVsbDtcbiAgICB0aGlzLnJlbmRlcmluZ0NvbnRleHQgPSBudWxsO1xuICAgIHRoaXMubGF5ZXJzLmxlbmd0aCA9IDA7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyB0aGUgRE9NIHN0cnVjdHVyZSBvZiB0aGUgdHJhY2suXG4gICAqL1xuICBfY3JlYXRlQ29udGFpbmVyKCkge1xuICAgIGNvbnN0ICRzdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdzdmcnKTtcbiAgICAkc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnb3B0aW1pemVTcGVlZCcpO1xuICAgICRzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIHRoaXMuaGVpZ2h0KTtcbiAgICAkc3ZnLnNldEF0dHJpYnV0ZSgneG1sbnM6eGh0bWwnLCAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCcpO1xuICAgICRzdmcuY2xhc3NMaXN0LmFkZCgndHJhY2snKTtcblxuICAgIGNvbnN0ICRiYWNrZ3JvdW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAncmVjdCcpO1xuICAgICRiYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCAnMTAwJScpO1xuICAgICRiYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsICcxMDAlJyk7XG4gICAgJGJhY2tncm91bmQuc3R5bGUuZmlsbE9wYWNpdHkgPSAwO1xuICAgIC8vICRiYWNrZ3JvdW5kLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XG5cbiAgICBjb25zdCAkZGVmcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2RlZnMnKTtcblxuICAgIGNvbnN0ICRvZmZzZXRHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICAkb2Zmc2V0R3JvdXAuY2xhc3NMaXN0LmFkZCgnb2Zmc2V0Jyk7XG5cbiAgICBjb25zdCAkbGF5b3V0R3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgJGxheW91dEdyb3VwLmNsYXNzTGlzdC5hZGQoJ2xheW91dCcpO1xuXG4gICAgY29uc3QgJGludGVyYWN0aW9uc0dyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgICRpbnRlcmFjdGlvbnNHcm91cC5jbGFzc0xpc3QuYWRkKCdpbnRlcmFjdGlvbnMnKTtcblxuICAgICRvZmZzZXRHcm91cC5hcHBlbmRDaGlsZCgkbGF5b3V0R3JvdXApO1xuICAgICRzdmcuYXBwZW5kQ2hpbGQoJGRlZnMpO1xuICAgICRzdmcuYXBwZW5kQ2hpbGQoJGJhY2tncm91bmQpO1xuICAgICRzdmcuYXBwZW5kQ2hpbGQoJG9mZnNldEdyb3VwKTtcbiAgICAkc3ZnLmFwcGVuZENoaWxkKCRpbnRlcmFjdGlvbnNHcm91cCk7XG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQoJHN2Zyk7XG4gICAgLy8gcmVtb3ZlcyBhZGRpdGlvbm5hbCBoZWlnaHQgYWRkZWQgd2hvIGtub3dzIHdoeS4uLlxuICAgIHRoaXMuJGVsLnN0eWxlLmZvbnRTaXplID0gMDtcbiAgICAvLyBmaXhlcyBvbmUgb2YgdGhlIChtYW55ID8pIHdlaXJkIGNhbnZhcyByZW5kZXJpbmcgYnVncyBpbiBDaHJvbWVcbiAgICB0aGlzLiRlbC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWigwKSc7XG5cbiAgICB0aGlzLiRsYXlvdXQgPSAkbGF5b3V0R3JvdXA7XG4gICAgdGhpcy4kb2Zmc2V0ID0gJG9mZnNldEdyb3VwO1xuICAgIHRoaXMuJGludGVyYWN0aW9ucyA9ICRpbnRlcmFjdGlvbnNHcm91cDtcbiAgICB0aGlzLiRzdmcgPSAkc3ZnO1xuICAgIHRoaXMuJGJhY2tncm91bmQgPSAkYmFja2dyb3VuZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgbGF5ZXIgdG8gdGhlIHRyYWNrLlxuICAgKlxuICAgKiBAcGFyYW0ge0xheWVyfSBsYXllciAtIHRoZSBsYXllciB0byBhZGQgdG8gdGhlIHRyYWNrLlxuICAgKi9cbiAgYWRkKGxheWVyKSB7XG4gICAgdGhpcy5sYXllcnMucHVzaChsYXllcik7XG4gICAgLy8gQ3JlYXRlIGEgZGVmYXVsdCByZW5kZXJpbmdDb250ZXh0IGZvciB0aGUgbGF5ZXIgaWYgbWlzc2luZ1xuICAgIHRoaXMuJGxheW91dC5hcHBlbmRDaGlsZChsYXllci4kZWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBsYXllciBmcm9tIHRoZSB0cmFjay4gVGhlIGxheWVyIGNhbiBiZSByZXVzZWQgZWxzZXdoZXJlLlxuICAgKlxuICAgKiBAcGFyYW0ge0xheWVyfSBsYXllciAtIHRoZSBsYXllciB0byByZW1vdmUgZnJvbSB0aGUgdHJhY2suXG4gICAqL1xuICByZW1vdmUobGF5ZXIpIHtcbiAgICB0aGlzLmxheWVycy5zcGxpY2UodGhpcy5sYXllcnMuaW5kZXhPZihsYXllciksIDEpO1xuICAgIC8vIFJlbW92ZXMgbGF5ZXIgZnJvbSBpdHMgY29udGFpbmVyXG4gICAgdGhpcy4kbGF5b3V0LnJlbW92ZUNoaWxkKGxheWVyLiRlbCk7XG4gIH1cblxuICAvKipcbiAgICogVGVzdHMgaWYgYSBnaXZlbiBlbGVtZW50IGJlbG9uZ3MgdG8gdGhlIHRyYWNrLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRlbFxuICAgKiBAcmV0dXJuIHtib29sfVxuICAgKi9cbiAgaGFzRWxlbWVudCgkZWwpIHtcbiAgICBkbyB7XG4gICAgICBpZiAoJGVsID09PSB0aGlzLiRlbCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgJGVsID0gJGVsLnBhcmVudE5vZGU7XG4gICAgfSB3aGlsZSAoJGVsICE9PSBudWxsKTtcblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgYWxsIHRoZSBsYXllcnMgYWRkZWQgdG8gdGhlIHRyYWNrLlxuICAgKi9cbiAgcmVuZGVyKCkge1xuICAgIGZvciAobGV0IGxheWVyIG9mIHRoaXMpIHsgbGF5ZXIucmVuZGVyKCk7IH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSB0cmFjayBET00gc3RydWN0dXJlIGFuZCB1cGRhdGVzIHRoZSBsYXllcnMuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXk8TGF5ZXI+fSBbbGF5ZXJzPW51bGxdIC0gaWYgbm90IG51bGwsIGEgc3Vic2V0IG9mIHRoZSBsYXllcnMgdG8gdXBkYXRlLlxuICAgKi9cbiAgdXBkYXRlKGxheWVycyA9IG51bGwpIHtcbiAgICB0aGlzLnVwZGF0ZUNvbnRhaW5lcigpO1xuICAgIHRoaXMudXBkYXRlTGF5ZXJzKGxheWVycyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgdHJhY2sgRE9NIHN0cnVjdHVyZS5cbiAgICovXG4gIHVwZGF0ZUNvbnRhaW5lcigpIHtcbiAgICBjb25zdCAkc3ZnID0gdGhpcy4kc3ZnO1xuICAgIGNvbnN0ICRvZmZzZXQgPSB0aGlzLiRvZmZzZXQ7XG4gICAgLy8gU2hvdWxkIGJlIGluIHNvbWUgdXBkYXRlIGxheW91dFxuICAgIGNvbnN0IHJlbmRlcmluZ0NvbnRleHQgPSB0aGlzLnJlbmRlcmluZ0NvbnRleHQ7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gICAgY29uc3Qgd2lkdGggPSBNYXRoLnJvdW5kKHJlbmRlcmluZ0NvbnRleHQudmlzaWJsZVdpZHRoKTtcbiAgICBjb25zdCBvZmZzZXRYID0gTWF0aC5yb3VuZChyZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHJlbmRlcmluZ0NvbnRleHQub2Zmc2V0KSk7XG4gICAgY29uc3QgdHJhbnNsYXRlID0gYHRyYW5zbGF0ZSgke29mZnNldFh9LCAwKWA7XG5cbiAgICAkc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBoZWlnaHQpO1xuICAgICRzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgd2lkdGgpO1xuICAgICRzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3ZpZXdib3gnLCBgMCAwICR7d2lkdGh9ICR7aGVpZ2h0fWApO1xuXG4gICAgJG9mZnNldC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgdHJhbnNsYXRlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBsYXllcnMuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXk8TGF5ZXI+fSBbbGF5ZXJzPW51bGxdIC0gaWYgbm90IG51bGwsIGEgc3Vic2V0IG9mIHRoZSBsYXllcnMgdG8gdXBkYXRlLlxuICAgKi9cbiAgdXBkYXRlTGF5ZXJzKGxheWVycyA9IG51bGwpIHtcbiAgICBsYXllcnMgPSAobGF5ZXJzID09PSBudWxsKSA/IHRoaXMubGF5ZXJzIDogbGF5ZXJzO1xuXG4gICAgbGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB7XG4gICAgICBpZiAodGhpcy5sYXllcnMuaW5kZXhPZihsYXllcikgPT09IC0xKSB7IHJldHVybjsgfVxuICAgICAgbGF5ZXIudXBkYXRlKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSXRlcmF0ZXMgdGhyb3VnaCB0aGUgYWRkZWQgbGF5ZXJzLlxuICAgKi9cbiAgKltTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgIHlpZWxkKiB0aGlzLmxheWVyc1tTeW1ib2wuaXRlcmF0b3JdKCk7XG4gIH1cbn1cbiJdfQ==