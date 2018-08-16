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
      var insertIndex = null;

      if (layer.params.zIndex < 0) layer.params.zIndex = 0;

      for (var i = 0; i < this.layers.length; i++) {
        if (layer.params.zIndex < this.layers[i].params.zIndex) {
          insertIndex = i;
          break;
        }
      }

      if (insertIndex === null) insertIndex = this.layers.length;

      this.layers.splice(insertIndex, 0, layer);
      // append at the zIndex place
      this.$layout.insertBefore(layer.$el, this.$layout.children[insertIndex]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRyYWNrLmpzIl0sIm5hbWVzIjpbIlRyYWNrIiwiJGVsIiwiaGVpZ2h0IiwiX2hlaWdodCIsIiRpbnRlcmFjdGlvbnMiLCIkbGF5b3V0IiwiJG9mZnNldCIsIiRzdmciLCIkYmFja2dyb3VuZCIsImxheWVycyIsInJlbmRlcmluZ0NvbnRleHQiLCJfY3JlYXRlQ29udGFpbmVyIiwicmVtb3ZlQ2hpbGQiLCJmb3JFYWNoIiwibGF5ZXIiLCJsZW5ndGgiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnROUyIsInNldEF0dHJpYnV0ZU5TIiwic2V0QXR0cmlidXRlIiwiY2xhc3NMaXN0IiwiYWRkIiwic3R5bGUiLCJmaWxsT3BhY2l0eSIsIiRkZWZzIiwiJG9mZnNldEdyb3VwIiwiJGxheW91dEdyb3VwIiwiJGludGVyYWN0aW9uc0dyb3VwIiwiYXBwZW5kQ2hpbGQiLCJmb250U2l6ZSIsInRyYW5zZm9ybSIsImluc2VydEluZGV4IiwicGFyYW1zIiwiekluZGV4IiwiaSIsInNwbGljZSIsImluc2VydEJlZm9yZSIsImNoaWxkcmVuIiwiaW5kZXhPZiIsInBhcmVudE5vZGUiLCJyZW5kZXIiLCJ1cGRhdGVDb250YWluZXIiLCJ1cGRhdGVMYXllcnMiLCJ3aWR0aCIsIk1hdGgiLCJyb3VuZCIsInZpc2libGVXaWR0aCIsIm9mZnNldFgiLCJ0aW1lVG9QaXhlbCIsIm9mZnNldCIsInRyYW5zbGF0ZSIsInVwZGF0ZSIsInZhbHVlIiwicHJldkhlaWdodCIsInVwZGF0ZUhlaWdodCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBR0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUE4Q01BLEs7QUFDSjs7OztBQUlBLGlCQUFZQyxHQUFaLEVBQStCO0FBQUEsUUFBZEMsTUFBYyx1RUFBTCxHQUFLO0FBQUE7O0FBQzdCLFNBQUtDLE9BQUwsR0FBZUQsTUFBZjs7QUFFQTs7OztBQUlBLFNB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QUksY0FBUVksY0FBUixDQUF1QixJQUF2QixFQUE2QixXQUE3QixFQUEwQ2dDLFNBQTFDO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O21DQUs0QjtBQUFBOztBQUFBLFVBQWZ6QyxNQUFlLHVFQUFOLElBQU07O0FBQzFCQSxlQUFVQSxXQUFXLElBQVosR0FBb0IsS0FBS0EsTUFBekIsR0FBa0NBLE1BQTNDOztBQUVBQSxhQUFPSSxPQUFQLENBQWUsVUFBQ0MsS0FBRCxFQUFXO0FBQ3hCLFlBQUksT0FBS0wsTUFBTCxDQUFZNkIsT0FBWixDQUFvQnhCLEtBQXBCLE1BQStCLENBQUMsQ0FBcEMsRUFBdUM7QUFBRTtBQUFTO0FBQ2xEQSxjQUFNcUMsTUFBTjtBQUNELE9BSEQ7QUFJRDs7QUFFRDs7Ozs7Ozs7Ozs7dUVBSVMsS0FBSzFDLE07Ozs7Ozs7Ozs7O3dCQW5NRDtBQUNYLGFBQU8sS0FBS04sT0FBWjtBQUNEOztBQUVEOzs7Ozs7c0JBS1dpRCxLLEVBQU87QUFBQTs7QUFDaEIsVUFBTUMsYUFBYSxLQUFLbEQsT0FBeEI7QUFDQSxXQUFLQSxPQUFMLEdBQWVpRCxLQUFmOztBQUVBLFdBQUszQyxNQUFMLENBQVlJLE9BQVosQ0FBb0I7QUFBQSxlQUFTQyxNQUFNd0MsWUFBTixDQUFtQkQsVUFBbkIsRUFBK0IsT0FBS2xELE9BQXBDLENBQVQ7QUFBQSxPQUFwQjtBQUNEOzs7OztrQkF5TFlILEsiLCJmaWxlIjoidHJhY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbnMgZnJvbSAnLi9uYW1lc3BhY2UnO1xuXG5cbi8qKlxuICogQWN0cyBhcyBhIHBsYWNlaG9sZGVyIHRvIG9yZ2FuaXplIHRoZSB2ZXJ0aWNhbCBsYXlvdXQgb2YgdGhlIHZpc3VhbGl6YXRpb25cbiAqIGFuZCB0aGUgaG9yaXpvbnRhbCBhbGlnbmVtZW50IHRvIGFuIGFic2Npc3NhIHRoYXQgY29ycmVzcG9uZCB0byBhIGNvbW1vblxuICogdGltZSByZWZlcmVuY2UuIEl0IGJhc2ljYWxseSBvZmZlciBhIHZpZXcgb24gdGhlIG92ZXJhbGwgdGltZWxpbmUuXG4gKlxuICogVHJhY2tzIGFyZSBpbnNlcnRlZCBpbnRvIGEgZ2l2ZW4gRE9NIGVsZW1lbnQsIGFsbG93aW5nIHRvIGNyZWF0ZSBEQVcgbGlrZVxuICogcmVwcmVzZW50YXRpb25zLiBFYWNoIGBUcmFja2AgaW5zdGFuY2UgY2FuIGhvc3QgbXVsdGlwbGUgYExheWVyYCBpbnN0YW5jZXMuXG4gKiBBIHRyYWNrIG11c3QgYmUgYWRkZWQgdG8gYSB0aW1lbGluZSBiZWZvcmUgYmVpbmcgdXBkYXRlZC5cbiAqXG4gKiAjIyMgQSB0aW1lbGluZSB3aXRoIDMgdHJhY2tzOlxuICpcbiAqIGBgYFxuICogMCAgICAgICAgICAgICAgICAgNiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAxNlxuICogKy0gLSAtIC0gLSAtIC0gLSAtKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rLSAtIC0gLSAtIC0gLVxuICogfCAgICAgICAgICAgICAgICAgfHggdHJhY2sgMSB4eHh4eHh4eHh4eHh4eHh4eHh4eHh8XG4gKiArLSAtIC0gLSAtIC0gLSAtIC0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSstIC0gLSAtIC0gLSAtXG4gKiB8ICAgICAgICAgICAgICAgICB8eCB0cmFjayAyIHh4eHh4eHh4eHh4eHh4eHh4eHh4eHxcbiAqICstIC0gLSAtIC0gLSAtIC0gLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKy0gLSAtIC0gLSAtIC1cbiAqIHwgICAgICAgICAgICAgICAgIHx4IHRyYWNrIDMgeHh4eHh4eHh4eHh4eHh4eHh4eHh4fFxuICogKy0gLSAtIC0gLSAtIC0gLSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rLSAtIC0gLSAtIC0gLVxuICogKy0tLS0tLS0tLS0tLS0tLS0tPlxuICogdGltZWxpbmUudGltZUNvbnRleHQudGltZVRvUGl4ZWwodGltZWxpbmUudGltZUNvbnRleHQub2Zmc2V0KVxuICpcbiAqICAgICAgICAgICAgICAgICAgIDwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tPlxuICogICAgICAgICAgICAgICAgICAgdGltZWxpbmUncyB0cmFja3MgZGVmYXVsdHMgdG8gMTAwMHB4XG4gKiAgICAgICAgICAgICAgICAgICB3aXRoIGEgZGVmYXVsdCBwaXhlbHNQZXJTZWNvbmQgb2YgMTAwcHgvcy5cbiAqICAgICAgICAgICAgICAgICAgIGFuZCBhIGRlZmF1bHQgYHN0cmV0Y2hSYXRpbyA9IDFgXG4gKiAgICAgICAgICAgICAgICAgICB0cmFjazEgc2hvd3MgMTAgc2Vjb25kcyBvZiB0aGUgdGltZWxpbmVcbiAqIGBgYFxuICpcbiAqICMjIyBUcmFjayBET00gc3RydWN0dXJlXG4gKlxuICogYGBgaHRtbFxuICogPHN2ZyB3aWR0aD1cIiR7dmlzaWJsZVdpZHRofVwiPlxuICogICA8IS0tIGJhY2tncm91bmQgLS0+XG4gKiAgIDxyZWN0PjxyZWN0PlxuICogICA8IS0tIG1haW4gdmlldyAtLT5cbiAqICAgPGcgY2xhc3M9XCJvZmZzZXRcIiB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoJHtvZmZzZXR9LCAwKVwiPlxuICogICAgIDxnIGNsYXNzPVwibGF5b3V0XCI+XG4gKiAgICAgICA8IS0tIGxheWVycyAtLT5cbiAqICAgICA8L2c+XG4gKiAgIDwvZz5cbiAqICAgPGcgY2xhc3M9XCJpbnRlcmFjdGlvbnNcIj48IS0tIGZvciBmZWVkYmFjayAtLT48L2c+XG4gKiA8L3N2Zz5cbiAqIGBgYFxuICovXG5jbGFzcyBUcmFjayB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0RPTUVsZW1lbnR9ICRlbFxuICAgKiBAcGFyYW0ge051bWJlcn0gW2hlaWdodCA9IDEwMF1cbiAgICovXG4gIGNvbnN0cnVjdG9yKCRlbCwgaGVpZ2h0ID0gMTAwKSB7XG4gICAgdGhpcy5faGVpZ2h0ID0gaGVpZ2h0O1xuXG4gICAgLyoqXG4gICAgICogVGhlIERPTSBlbGVtZW50IGluIHdoaWNoIHRoZSB0cmFjayBpcyBjcmVhdGVkLlxuICAgICAqIEB0eXBlIHtFbGVtZW50fVxuICAgICAqL1xuICAgIHRoaXMuJGVsID0gJGVsO1xuICAgIC8qKlxuICAgICAqIEEgcGxhY2Vob2xkZXIgdG8gYWRkIHNoYXBlcyBmb3IgaW50ZXJhY3Rpb25zIGZlZWRiYWNrLlxuICAgICAqIEB0eXBlIHtFbGVtZW50fVxuICAgICAqL1xuICAgIHRoaXMuJGludGVyYWN0aW9ucyA9IG51bGw7XG4gICAgLyoqIEB0eXBlIHtFbGVtZW50fSAqL1xuICAgIHRoaXMuJGxheW91dCA9IG51bGw7XG4gICAgLyoqIEB0eXBlIHtFbGVtZW50fSAqL1xuICAgIHRoaXMuJG9mZnNldCA9IG51bGw7XG4gICAgLyoqIEB0eXBlIHtFbGVtZW50fSAqL1xuICAgIHRoaXMuJHN2ZyA9IG51bGw7XG4gICAgLyoqIEB0eXBlIHtFbGVtZW50fSAqL1xuICAgIHRoaXMuJGJhY2tncm91bmQgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogQW4gYXJyYXkgb2YgYWxsIHRoZSBsYXllcnMgYmVsb25naW5nIHRvIHRoZSB0cmFjay5cbiAgICAgKiBAdHlwZSB7QXJyYXk8TGF5ZXI+fVxuICAgICAqL1xuICAgIHRoaXMubGF5ZXJzID0gW107XG4gICAgLyoqXG4gICAgICogVGhlIGNvbnRleHQgdXNlZCB0byBtYWludGFpbiB0aGUgRE9NIHN0cnVjdHVyZSBvZiB0aGUgdHJhY2suXG4gICAgICogQHR5cGUge1RpbWVsaW5lVGltZUNvbnRleHR9XG4gICAgICovXG4gICAgdGhpcy5yZW5kZXJpbmdDb250ZXh0ID0gbnVsbDtcblxuICAgIHRoaXMuX2NyZWF0ZUNvbnRhaW5lcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGhlaWdodCBvZiB0aGUgdHJhY2suXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgaGVpZ2h0KCkge1xuICAgIHJldHVybiB0aGlzLl9oZWlnaHQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgaGVpZ2h0IG9mIHRoZSB0cmFjay5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHNldCBoZWlnaHQodmFsdWUpIHtcbiAgICBjb25zdCBwcmV2SGVpZ2h0ID0gdGhpcy5faGVpZ2h0O1xuICAgIHRoaXMuX2hlaWdodCA9IHZhbHVlO1xuXG4gICAgdGhpcy5sYXllcnMuZm9yRWFjaChsYXllciA9PiBsYXllci51cGRhdGVIZWlnaHQocHJldkhlaWdodCwgdGhpcy5faGVpZ2h0KSk7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIHdoZW4gdGhlIHRyYWNrIGlzIGFkZGVkIHRvIHRoZSB0aW1lbGluZS4gVGhlXG4gICAqIHRyYWNrIGNhbm5vdCBiZSB1cGRhdGVkIHdpdGhvdXQgYmVpbmcgYWRkZWQgdG8gYSB0aW1lbGluZS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtUaW1lbGluZVRpbWVDb250ZXh0fSByZW5kZXJpbmdDb250ZXh0XG4gICAqL1xuICBjb25maWd1cmUocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIHRoaXMucmVuZGVyaW5nQ29udGV4dCA9IHJlbmRlcmluZ0NvbnRleHQ7XG4gIH1cblxuICAvKipcbiAgICogRGVzdHJveSB0aGUgdHJhY2suIFRoZSBsYXllcnMgZnJvbSB0aGlzIHRyYWNrIGNhbiBzdGlsbCBiZSByZXVzZWQgZWxzZXdoZXJlLlxuICAgKi9cbiAgZGVzdHJveSgpIHtcbiAgICAvLyBEZXRhY2ggZXZlcnl0aGluZyBmcm9tIHRoZSBET01cbiAgICB0aGlzLiRlbC5yZW1vdmVDaGlsZCh0aGlzLiRzdmcpO1xuICAgIHRoaXMubGF5ZXJzLmZvckVhY2gobGF5ZXIgPT4gdGhpcy4kbGF5b3V0LnJlbW92ZUNoaWxkKGxheWVyLiRlbCkpO1xuICAgIC8vIGNsZWFuIHJlZmVyZW5jZXNcbiAgICB0aGlzLiRlbCA9IG51bGw7XG4gICAgdGhpcy5yZW5kZXJpbmdDb250ZXh0ID0gbnVsbDtcbiAgICB0aGlzLmxheWVycy5sZW5ndGggPSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgdGhlIERPTSBzdHJ1Y3R1cmUgb2YgdGhlIHRyYWNrLlxuICAgKi9cbiAgX2NyZWF0ZUNvbnRhaW5lcigpIHtcbiAgICBjb25zdCAkc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnc3ZnJyk7XG4gICAgJHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ29wdGltaXplU3BlZWQnKTtcbiAgICAkc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCB0aGlzLmhlaWdodCk7XG4gICAgJHN2Zy5zZXRBdHRyaWJ1dGUoJ3htbG5zOnhodG1sJywgJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnKTtcbiAgICAkc3ZnLmNsYXNzTGlzdC5hZGQoJ3RyYWNrJyk7XG5cbiAgICBjb25zdCAkYmFja2dyb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3JlY3QnKTtcbiAgICAkYmFja2dyb3VuZC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgJzEwMCUnKTtcbiAgICAkYmFja2dyb3VuZC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCAnMTAwJScpO1xuICAgICRiYWNrZ3JvdW5kLnN0eWxlLmZpbGxPcGFjaXR5ID0gMDtcbiAgICAvLyAkYmFja2dyb3VuZC5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xuXG4gICAgY29uc3QgJGRlZnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdkZWZzJyk7XG5cbiAgICBjb25zdCAkb2Zmc2V0R3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgJG9mZnNldEdyb3VwLmNsYXNzTGlzdC5hZGQoJ29mZnNldCcpO1xuXG4gICAgY29uc3QgJGxheW91dEdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgICRsYXlvdXRHcm91cC5jbGFzc0xpc3QuYWRkKCdsYXlvdXQnKTtcblxuICAgIGNvbnN0ICRpbnRlcmFjdGlvbnNHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICAkaW50ZXJhY3Rpb25zR3JvdXAuY2xhc3NMaXN0LmFkZCgnaW50ZXJhY3Rpb25zJyk7XG5cbiAgICAkb2Zmc2V0R3JvdXAuYXBwZW5kQ2hpbGQoJGxheW91dEdyb3VwKTtcbiAgICAkc3ZnLmFwcGVuZENoaWxkKCRkZWZzKTtcbiAgICAkc3ZnLmFwcGVuZENoaWxkKCRiYWNrZ3JvdW5kKTtcbiAgICAkc3ZnLmFwcGVuZENoaWxkKCRvZmZzZXRHcm91cCk7XG4gICAgJHN2Zy5hcHBlbmRDaGlsZCgkaW50ZXJhY3Rpb25zR3JvdXApO1xuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKCRzdmcpO1xuICAgIC8vIHJlbW92ZXMgYWRkaXRpb25uYWwgaGVpZ2h0IGFkZGVkIHdobyBrbm93cyB3aHkuLi5cbiAgICB0aGlzLiRlbC5zdHlsZS5mb250U2l6ZSA9IDA7XG4gICAgLy8gZml4ZXMgb25lIG9mIHRoZSAobWFueSA/KSB3ZWlyZCBjYW52YXMgcmVuZGVyaW5nIGJ1Z3MgaW4gQ2hyb21lXG4gICAgdGhpcy4kZWwuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVooMCknO1xuXG4gICAgdGhpcy4kbGF5b3V0ID0gJGxheW91dEdyb3VwO1xuICAgIHRoaXMuJG9mZnNldCA9ICRvZmZzZXRHcm91cDtcbiAgICB0aGlzLiRpbnRlcmFjdGlvbnMgPSAkaW50ZXJhY3Rpb25zR3JvdXA7XG4gICAgdGhpcy4kc3ZnID0gJHN2ZztcbiAgICB0aGlzLiRiYWNrZ3JvdW5kID0gJGJhY2tncm91bmQ7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGxheWVyIHRvIHRoZSB0cmFjay5cbiAgICpcbiAgICogQHBhcmFtIHtMYXllcn0gbGF5ZXIgLSB0aGUgbGF5ZXIgdG8gYWRkIHRvIHRoZSB0cmFjay5cbiAgICovXG4gIGFkZChsYXllcikge1xuICAgIGxldCBpbnNlcnRJbmRleCA9IG51bGw7XG5cbiAgICBpZiAobGF5ZXIucGFyYW1zLnpJbmRleCA8IDApXG4gICAgICBsYXllci5wYXJhbXMuekluZGV4ID0gMDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5sYXllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChsYXllci5wYXJhbXMuekluZGV4IDwgdGhpcy5sYXllcnNbaV0ucGFyYW1zLnpJbmRleCkge1xuICAgICAgICBpbnNlcnRJbmRleCA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpbnNlcnRJbmRleCA9PT0gbnVsbClcbiAgICAgIGluc2VydEluZGV4ID0gdGhpcy5sYXllcnMubGVuZ3RoO1xuXG4gICAgdGhpcy5sYXllcnMuc3BsaWNlKGluc2VydEluZGV4LCAwLCBsYXllcik7XG4gICAgLy8gYXBwZW5kIGF0IHRoZSB6SW5kZXggcGxhY2VcbiAgICB0aGlzLiRsYXlvdXQuaW5zZXJ0QmVmb3JlKGxheWVyLiRlbCwgdGhpcy4kbGF5b3V0LmNoaWxkcmVuW2luc2VydEluZGV4XSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGxheWVyIGZyb20gdGhlIHRyYWNrLiBUaGUgbGF5ZXIgY2FuIGJlIHJldXNlZCBlbHNld2hlcmUuXG4gICAqXG4gICAqIEBwYXJhbSB7TGF5ZXJ9IGxheWVyIC0gdGhlIGxheWVyIHRvIHJlbW92ZSBmcm9tIHRoZSB0cmFjay5cbiAgICovXG4gIHJlbW92ZShsYXllcikge1xuICAgIHRoaXMubGF5ZXJzLnNwbGljZSh0aGlzLmxheWVycy5pbmRleE9mKGxheWVyKSwgMSk7XG4gICAgLy8gUmVtb3ZlcyBsYXllciBmcm9tIGl0cyBjb250YWluZXJcbiAgICB0aGlzLiRsYXlvdXQucmVtb3ZlQ2hpbGQobGF5ZXIuJGVsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUZXN0cyBpZiBhIGdpdmVuIGVsZW1lbnQgYmVsb25ncyB0byB0aGUgdHJhY2suXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGVsXG4gICAqIEByZXR1cm4ge2Jvb2x9XG4gICAqL1xuICBoYXNFbGVtZW50KCRlbCkge1xuICAgIGRvIHtcbiAgICAgIGlmICgkZWwgPT09IHRoaXMuJGVsKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICAkZWwgPSAkZWwucGFyZW50Tm9kZTtcbiAgICB9IHdoaWxlICgkZWwgIT09IG51bGwpO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciBhbGwgdGhlIGxheWVycyBhZGRlZCB0byB0aGUgdHJhY2suXG4gICAqL1xuICByZW5kZXIoKSB7XG4gICAgZm9yIChsZXQgbGF5ZXIgb2YgdGhpcykgeyBsYXllci5yZW5kZXIoKTsgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHRyYWNrIERPTSBzdHJ1Y3R1cmUgYW5kIHVwZGF0ZXMgdGhlIGxheWVycy5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheTxMYXllcj59IFtsYXllcnM9bnVsbF0gLSBpZiBub3QgbnVsbCwgYSBzdWJzZXQgb2YgdGhlIGxheWVycyB0byB1cGRhdGUuXG4gICAqL1xuICB1cGRhdGUobGF5ZXJzID0gbnVsbCkge1xuICAgIHRoaXMudXBkYXRlQ29udGFpbmVyKCk7XG4gICAgdGhpcy51cGRhdGVMYXllcnMobGF5ZXJzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSB0cmFjayBET00gc3RydWN0dXJlLlxuICAgKi9cbiAgdXBkYXRlQ29udGFpbmVyKCkge1xuICAgIGNvbnN0ICRzdmcgPSB0aGlzLiRzdmc7XG4gICAgY29uc3QgJG9mZnNldCA9IHRoaXMuJG9mZnNldDtcbiAgICAvLyBTaG91bGQgYmUgaW4gc29tZSB1cGRhdGUgbGF5b3V0XG4gICAgY29uc3QgcmVuZGVyaW5nQ29udGV4dCA9IHRoaXMucmVuZGVyaW5nQ29udGV4dDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmhlaWdodDtcbiAgICBjb25zdCB3aWR0aCA9IE1hdGgucm91bmQocmVuZGVyaW5nQ29udGV4dC52aXNpYmxlV2lkdGgpO1xuICAgIGNvbnN0IG9mZnNldFggPSBNYXRoLnJvdW5kKHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwocmVuZGVyaW5nQ29udGV4dC5vZmZzZXQpKTtcbiAgICBjb25zdCB0cmFuc2xhdGUgPSBgdHJhbnNsYXRlKCR7b2Zmc2V0WH0sIDApYDtcblxuICAgICRzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgJHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB3aWR0aCk7XG4gICAgJHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndmlld2JveCcsIGAwIDAgJHt3aWR0aH0gJHtoZWlnaHR9YCk7XG5cbiAgICAkb2Zmc2V0LnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCB0cmFuc2xhdGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGxheWVycy5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheTxMYXllcj59IFtsYXllcnM9bnVsbF0gLSBpZiBub3QgbnVsbCwgYSBzdWJzZXQgb2YgdGhlIGxheWVycyB0byB1cGRhdGUuXG4gICAqL1xuICB1cGRhdGVMYXllcnMobGF5ZXJzID0gbnVsbCkge1xuICAgIGxheWVycyA9IChsYXllcnMgPT09IG51bGwpID8gdGhpcy5sYXllcnMgOiBsYXllcnM7XG5cbiAgICBsYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHtcbiAgICAgIGlmICh0aGlzLmxheWVycy5pbmRleE9mKGxheWVyKSA9PT0gLTEpIHsgcmV0dXJuOyB9XG4gICAgICBsYXllci51cGRhdGUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdGVyYXRlcyB0aHJvdWdoIHRoZSBhZGRlZCBsYXllcnMuXG4gICAqL1xuICAqW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgeWllbGQqIHRoaXMubGF5ZXJzW1N5bWJvbC5pdGVyYXRvcl0oKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUcmFjaztcbiJdfQ==