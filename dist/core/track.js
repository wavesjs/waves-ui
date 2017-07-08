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

var _namespace2 = _interopRequireDefault(_namespace);

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

var Track = (function () {
  /**
   * @param {DOMElement} $el
   * @param {Number} [height = 100]
   */

  function Track($el) {
    var height = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];

    _classCallCheck(this, Track);

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

  _createClass(Track, [{
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
     * Updates the track DOM structure and updates the layers.
     *
     * @param {Array<Layer>} [layers=null] - if not null, a subset of the layers to update.
     */
  }, {
    key: 'update',
    value: function update() {
      var layers = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

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

      var layers = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

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

    /**
     * Sets the height of the track.
     *
     * @todo propagate to layers, keeping ratio? could be handy for vertical
     *    resize. This is why a set/get is implemented here.
     * @type {Number}
     */
    set: function set(value) {
      this._height = value;
    }
  }]);

  return Track;
})();

exports['default'] = Track;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jb3JlL3RyYWNrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFBZSxhQUFhOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFpRFAsS0FBSzs7Ozs7O0FBS2IsV0FMUSxLQUFLLENBS1osR0FBRyxFQUFnQjtRQUFkLE1BQU0seURBQUcsR0FBRzs7MEJBTFYsS0FBSzs7QUFNdEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7Ozs7OztBQU10QixRQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQzs7Ozs7QUFLZixRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQzs7QUFFMUIsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7O0FBRXBCLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDOztBQUVwQixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFakIsUUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7Ozs7OztBQU14QixRQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQzs7Ozs7QUFLakIsUUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQzs7QUFFN0IsUUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7R0FDekI7Ozs7Ozs7O2VBdkNrQixLQUFLOzs7Ozs7Ozs7O1dBb0VmLG1CQUFDLGdCQUFnQixFQUFFO0FBQzFCLFVBQUksQ0FBQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQztLQUMxQzs7Ozs7OztXQUtNLG1CQUFHOzs7O0FBRVIsVUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hDLFVBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztlQUFLLE1BQUssT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO09BQUEsQ0FBQyxDQUFDOztBQUVwRSxVQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztBQUNoQixVQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBQzdCLFVBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztLQUN4Qjs7Ozs7OztXQUtlLDRCQUFHO0FBQ2pCLFVBQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxlQUFlLHlCQUFLLEtBQUssQ0FBQyxDQUFDO0FBQ2pELFVBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBQzlELFVBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDakQsVUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsOEJBQThCLENBQUMsQ0FBQztBQUNqRSxVQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFNUIsVUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLGVBQWUseUJBQUssTUFBTSxDQUFDLENBQUM7QUFDekQsaUJBQVcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNuRCxpQkFBVyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ2xELGlCQUFXLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7OztBQUdsQyxVQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsZUFBZSx5QkFBSyxNQUFNLENBQUMsQ0FBQzs7QUFFbkQsVUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLGVBQWUseUJBQUssR0FBRyxDQUFDLENBQUM7QUFDdkQsa0JBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUVyQyxVQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsZUFBZSx5QkFBSyxHQUFHLENBQUMsQ0FBQztBQUN2RCxrQkFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRXJDLFVBQU0sa0JBQWtCLEdBQUcsUUFBUSxDQUFDLGVBQWUseUJBQUssR0FBRyxDQUFDLENBQUM7QUFDN0Qsd0JBQWtCLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQzs7QUFFakQsa0JBQVksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDdkMsVUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4QixVQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzlCLFVBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDL0IsVUFBSSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3JDLFVBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUUzQixVQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDOztBQUU1QixVQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsZUFBZSxDQUFDOztBQUUzQyxVQUFJLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQztBQUM1QixVQUFJLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQztBQUM1QixVQUFJLENBQUMsYUFBYSxHQUFHLGtCQUFrQixDQUFDO0FBQ3hDLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFVBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO0tBQ2hDOzs7Ozs7Ozs7V0FPRSxhQUFDLEtBQUssRUFBRTtBQUNULFVBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUV4QixVQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDckM7Ozs7Ozs7OztXQU9LLGdCQUFDLEtBQUssRUFBRTtBQUNaLFVBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUVsRCxVQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDckM7Ozs7Ozs7Ozs7V0FRUyxvQkFBQyxHQUFHLEVBQUU7QUFDZCxTQUFHO0FBQ0QsWUFBSSxHQUFHLEtBQUssSUFBSSxDQUFDLEdBQUcsRUFBRTtBQUNwQixpQkFBTyxJQUFJLENBQUM7U0FDYjs7QUFFRCxXQUFHLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQztPQUN0QixRQUFRLEdBQUcsS0FBSyxJQUFJLEVBQUU7O0FBRXZCLGFBQU8sS0FBSyxDQUFDO0tBQ2Q7Ozs7Ozs7V0FLSyxrQkFBRzs7Ozs7O0FBQ1AsMENBQWtCLElBQUksNEdBQUU7Y0FBZixLQUFLO0FBQVksZUFBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQUU7Ozs7Ozs7Ozs7Ozs7OztLQUM1Qzs7Ozs7Ozs7O1dBT0ssa0JBQWdCO1VBQWYsTUFBTSx5REFBRyxJQUFJOztBQUNsQixVQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7QUFDdkIsVUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUMzQjs7Ozs7OztXQUtjLDJCQUFHO0FBQ2hCLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDdkIsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQzs7QUFFN0IsVUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7QUFDL0MsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUMzQixVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3hELFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDbEYsVUFBTSxTQUFTLGtCQUFnQixPQUFPLFNBQU0sQ0FBQzs7QUFFN0MsVUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzVDLFVBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMxQyxVQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxTQUFTLFdBQVMsS0FBSyxTQUFJLE1BQU0sQ0FBRyxDQUFDOztBQUUvRCxhQUFPLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7S0FDdEQ7Ozs7Ozs7OztXQU9XLHdCQUFnQjs7O1VBQWYsTUFBTSx5REFBRyxJQUFJOztBQUN4QixZQUFNLEdBQUcsQUFBQyxNQUFNLEtBQUssSUFBSSxHQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDOztBQUVsRCxZQUFNLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFLO0FBQ3hCLFlBQUksT0FBSyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQUUsaUJBQU87U0FBRTtBQUNsRCxhQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7T0FDaEIsQ0FBQyxDQUFDO0tBQ0o7Ozs7Ozs7b0NBS2lCOzs7OzBEQUNULElBQUksQ0FBQyxNQUFNOzs7Ozs7O0tBQ25COzs7U0FwTFMsZUFBRztBQUNYLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztLQUNyQjs7Ozs7Ozs7O1NBU1MsYUFBQyxLQUFLLEVBQUU7QUFDaEIsVUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7S0FDdEI7OztTQTNEa0IsS0FBSzs7O3FCQUFMLEtBQUsiLCJmaWxlIjoic3JjL2NvcmUvdHJhY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbnMgZnJvbSAnLi9uYW1lc3BhY2UnO1xuXG5cbi8qKlxuICogQWN0cyBhcyBhIHBsYWNlaG9sZGVyIHRvIG9yZ2FuaXplIHRoZSB2ZXJ0aWNhbCBsYXlvdXQgb2YgdGhlIHZpc3VhbGl6YXRpb25cbiAqIGFuZCB0aGUgaG9yaXpvbnRhbCBhbGlnbmVtZW50IHRvIGFuIGFic2Npc3NhIHRoYXQgY29ycmVzcG9uZCB0byBhIGNvbW1vblxuICogdGltZSByZWZlcmVuY2UuIEl0IGJhc2ljYWxseSBvZmZlciBhIHZpZXcgb24gdGhlIG92ZXJhbGwgdGltZWxpbmUuXG4gKlxuICogVHJhY2tzIGFyZSBpbnNlcnRlZCBpbnRvIGEgZ2l2ZW4gRE9NIGVsZW1lbnQsIGFsbG93aW5nIHRvIGNyZWF0ZSBEQVcgbGlrZVxuICogcmVwcmVzZW50YXRpb25zLiBFYWNoIGBUcmFja2AgaW5zdGFuY2UgY2FuIGhvc3QgbXVsdGlwbGUgYExheWVyYCBpbnN0YW5jZXMuXG4gKiBBIHRyYWNrIG11c3QgYmUgYWRkZWQgdG8gYSB0aW1lbGluZSBiZWZvcmUgYmVpbmcgdXBkYXRlZC5cbiAqXG4gKiAjIyMgQSB0aW1lbGluZSB3aXRoIDMgdHJhY2tzOlxuICpcbiAqIGBgYFxuICogMCAgICAgICAgICAgICAgICAgNiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAxNlxuICogKy0gLSAtIC0gLSAtIC0gLSAtKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rLSAtIC0gLSAtIC0gLVxuICogfCAgICAgICAgICAgICAgICAgfHggdHJhY2sgMSB4eHh4eHh4eHh4eHh4eHh4eHh4eHh8XG4gKiArLSAtIC0gLSAtIC0gLSAtIC0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSstIC0gLSAtIC0gLSAtXG4gKiB8ICAgICAgICAgICAgICAgICB8eCB0cmFjayAyIHh4eHh4eHh4eHh4eHh4eHh4eHh4eHxcbiAqICstIC0gLSAtIC0gLSAtIC0gLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKy0gLSAtIC0gLSAtIC1cbiAqIHwgICAgICAgICAgICAgICAgIHx4IHRyYWNrIDMgeHh4eHh4eHh4eHh4eHh4eHh4eHh4fFxuICogKy0gLSAtIC0gLSAtIC0gLSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rLSAtIC0gLSAtIC0gLVxuICogKy0tLS0tLS0tLS0tLS0tLS0tPlxuICogdGltZWxpbmUudGltZUNvbnRleHQudGltZVRvUGl4ZWwodGltZWxpbmUudGltZUNvbnRleHQub2Zmc2V0KVxuICpcbiAqICAgICAgICAgICAgICAgICAgIDwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tPlxuICogICAgICAgICAgICAgICAgICAgdGltZWxpbmUncyB0cmFja3MgZGVmYXVsdHMgdG8gMTAwMHB4XG4gKiAgICAgICAgICAgICAgICAgICB3aXRoIGEgZGVmYXVsdCBwaXhlbHNQZXJTZWNvbmQgb2YgMTAwcHgvcy5cbiAqICAgICAgICAgICAgICAgICAgIGFuZCBhIGRlZmF1bHQgYHN0cmV0Y2hSYXRpbyA9IDFgXG4gKiAgICAgICAgICAgICAgICAgICB0cmFjazEgc2hvd3MgMTAgc2Vjb25kcyBvZiB0aGUgdGltZWxpbmVcbiAqIGBgYFxuICpcbiAqICMjIyBUcmFjayBET00gc3RydWN0dXJlXG4gKlxuICogYGBgaHRtbFxuICogPHN2ZyB3aWR0aD1cIiR7dmlzaWJsZVdpZHRofVwiPlxuICogICA8IS0tIGJhY2tncm91bmQgLS0+XG4gKiAgIDxyZWN0PjxyZWN0PlxuICogICA8IS0tIG1haW4gdmlldyAtLT5cbiAqICAgPGcgY2xhc3M9XCJvZmZzZXRcIiB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoJHtvZmZzZXR9LCAwKVwiPlxuICogICAgIDxnIGNsYXNzPVwibGF5b3V0XCI+XG4gKiAgICAgICA8IS0tIGxheWVycyAtLT5cbiAqICAgICA8L2c+XG4gKiAgIDwvZz5cbiAqICAgPGcgY2xhc3M9XCJpbnRlcmFjdGlvbnNcIj48IS0tIGZvciBmZWVkYmFjayAtLT48L2c+XG4gKiA8L3N2Zz5cbiAqIGBgYFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmFjayB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0RPTUVsZW1lbnR9ICRlbFxuICAgKiBAcGFyYW0ge051bWJlcn0gW2hlaWdodCA9IDEwMF1cbiAgICovXG4gIGNvbnN0cnVjdG9yKCRlbCwgaGVpZ2h0ID0gMTAwKSB7XG4gICAgdGhpcy5faGVpZ2h0ID0gaGVpZ2h0O1xuXG4gICAgLyoqXG4gICAgICogVGhlIERPTSBlbGVtZW50IGluIHdoaWNoIHRoZSB0cmFjayBpcyBjcmVhdGVkLlxuICAgICAqIEB0eXBlIHtFbGVtZW50fVxuICAgICAqL1xuICAgIHRoaXMuJGVsID0gJGVsO1xuICAgIC8qKlxuICAgICAqIEEgcGxhY2Vob2xkZXIgdG8gYWRkIHNoYXBlcyBmb3IgaW50ZXJhY3Rpb25zIGZlZWRiYWNrLlxuICAgICAqIEB0eXBlIHtFbGVtZW50fVxuICAgICAqL1xuICAgIHRoaXMuJGludGVyYWN0aW9ucyA9IG51bGw7XG4gICAgLyoqIEB0eXBlIHtFbGVtZW50fSAqL1xuICAgIHRoaXMuJGxheW91dCA9IG51bGw7XG4gICAgLyoqIEB0eXBlIHtFbGVtZW50fSAqL1xuICAgIHRoaXMuJG9mZnNldCA9IG51bGw7XG4gICAgLyoqIEB0eXBlIHtFbGVtZW50fSAqL1xuICAgIHRoaXMuJHN2ZyA9IG51bGw7XG4gICAgLyoqIEB0eXBlIHtFbGVtZW50fSAqL1xuICAgIHRoaXMuJGJhY2tncm91bmQgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogQW4gYXJyYXkgb2YgYWxsIHRoZSBsYXllcnMgYmVsb25naW5nIHRvIHRoZSB0cmFjay5cbiAgICAgKiBAdHlwZSB7QXJyYXk8TGF5ZXI+fVxuICAgICAqL1xuICAgIHRoaXMubGF5ZXJzID0gW107XG4gICAgLyoqXG4gICAgICogVGhlIGNvbnRleHQgdXNlZCB0byBtYWludGFpbiB0aGUgRE9NIHN0cnVjdHVyZSBvZiB0aGUgdHJhY2suXG4gICAgICogQHR5cGUge1RpbWVsaW5lVGltZUNvbnRleHR9XG4gICAgICovXG4gICAgdGhpcy5yZW5kZXJpbmdDb250ZXh0ID0gbnVsbDtcblxuICAgIHRoaXMuX2NyZWF0ZUNvbnRhaW5lcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGhlaWdodCBvZiB0aGUgdHJhY2suXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgaGVpZ2h0KCkge1xuICAgIHJldHVybiB0aGlzLl9oZWlnaHQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgaGVpZ2h0IG9mIHRoZSB0cmFjay5cbiAgICpcbiAgICogQHRvZG8gcHJvcGFnYXRlIHRvIGxheWVycywga2VlcGluZyByYXRpbz8gY291bGQgYmUgaGFuZHkgZm9yIHZlcnRpY2FsXG4gICAqICAgIHJlc2l6ZS4gVGhpcyBpcyB3aHkgYSBzZXQvZ2V0IGlzIGltcGxlbWVudGVkIGhlcmUuXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZXQgaGVpZ2h0KHZhbHVlKSB7XG4gICAgdGhpcy5faGVpZ2h0ID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIHdoZW4gdGhlIHRyYWNrIGlzIGFkZGVkIHRvIHRoZSB0aW1lbGluZS4gVGhlXG4gICAqIHRyYWNrIGNhbm5vdCBiZSB1cGRhdGVkIHdpdGhvdXQgYmVpbmcgYWRkZWQgdG8gYSB0aW1lbGluZS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtUaW1lbGluZVRpbWVDb250ZXh0fSByZW5kZXJpbmdDb250ZXh0XG4gICAqL1xuICBjb25maWd1cmUocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIHRoaXMucmVuZGVyaW5nQ29udGV4dCA9IHJlbmRlcmluZ0NvbnRleHQ7XG4gIH1cblxuICAvKipcbiAgICogRGVzdHJveSB0aGUgdHJhY2suIFRoZSBsYXllcnMgZnJvbSB0aGlzIHRyYWNrIGNhbiBzdGlsbCBiZSByZXVzZWQgZWxzZXdoZXJlLlxuICAgKi9cbiAgZGVzdHJveSgpIHtcbiAgICAvLyBEZXRhY2ggZXZlcnl0aGluZyBmcm9tIHRoZSBET01cbiAgICB0aGlzLiRlbC5yZW1vdmVDaGlsZCh0aGlzLiRzdmcpO1xuICAgIHRoaXMubGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB0aGlzLiRsYXlvdXQucmVtb3ZlQ2hpbGQobGF5ZXIuJGVsKSk7XG4gICAgLy8gY2xlYW4gcmVmZXJlbmNlc1xuICAgIHRoaXMuJGVsID0gbnVsbDtcbiAgICB0aGlzLnJlbmRlcmluZ0NvbnRleHQgPSBudWxsO1xuICAgIHRoaXMubGF5ZXJzLmxlbmd0aCA9IDA7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyB0aGUgRE9NIHN0cnVjdHVyZSBvZiB0aGUgdHJhY2suXG4gICAqL1xuICBfY3JlYXRlQ29udGFpbmVyKCkge1xuICAgIGNvbnN0ICRzdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdzdmcnKTtcbiAgICAkc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnb3B0aW1pemVTcGVlZCcpO1xuICAgICRzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIHRoaXMuaGVpZ2h0KTtcbiAgICAkc3ZnLnNldEF0dHJpYnV0ZSgneG1sbnM6eGh0bWwnLCAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCcpO1xuICAgICRzdmcuY2xhc3NMaXN0LmFkZCgndHJhY2snKTtcblxuICAgIGNvbnN0ICRiYWNrZ3JvdW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAncmVjdCcpO1xuICAgICRiYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCAnMTAwJScpO1xuICAgICRiYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsICcxMDAlJyk7XG4gICAgJGJhY2tncm91bmQuc3R5bGUuZmlsbE9wYWNpdHkgPSAwO1xuICAgIC8vICRiYWNrZ3JvdW5kLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XG5cbiAgICBjb25zdCAkZGVmcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2RlZnMnKTtcblxuICAgIGNvbnN0ICRvZmZzZXRHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICAkb2Zmc2V0R3JvdXAuY2xhc3NMaXN0LmFkZCgnb2Zmc2V0Jyk7XG5cbiAgICBjb25zdCAkbGF5b3V0R3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgJGxheW91dEdyb3VwLmNsYXNzTGlzdC5hZGQoJ2xheW91dCcpO1xuXG4gICAgY29uc3QgJGludGVyYWN0aW9uc0dyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgICRpbnRlcmFjdGlvbnNHcm91cC5jbGFzc0xpc3QuYWRkKCdpbnRlcmFjdGlvbnMnKTtcblxuICAgICRvZmZzZXRHcm91cC5hcHBlbmRDaGlsZCgkbGF5b3V0R3JvdXApO1xuICAgICRzdmcuYXBwZW5kQ2hpbGQoJGRlZnMpO1xuICAgICRzdmcuYXBwZW5kQ2hpbGQoJGJhY2tncm91bmQpO1xuICAgICRzdmcuYXBwZW5kQ2hpbGQoJG9mZnNldEdyb3VwKTtcbiAgICAkc3ZnLmFwcGVuZENoaWxkKCRpbnRlcmFjdGlvbnNHcm91cCk7XG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQoJHN2Zyk7XG4gICAgLy8gcmVtb3ZlcyBhZGRpdGlvbm5hbCBoZWlnaHQgYWRkZWQgd2hvIGtub3dzIHdoeS4uLlxuICAgIHRoaXMuJGVsLnN0eWxlLmZvbnRTaXplID0gMDtcbiAgICAvLyBmaXhlcyBvbmUgb2YgdGhlIChtYW55ID8pIHdlaXJkIGNhbnZhcyByZW5kZXJpbmcgYnVncyBpbiBDaHJvbWVcbiAgICB0aGlzLiRlbC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWigwKSc7XG5cbiAgICB0aGlzLiRsYXlvdXQgPSAkbGF5b3V0R3JvdXA7XG4gICAgdGhpcy4kb2Zmc2V0ID0gJG9mZnNldEdyb3VwO1xuICAgIHRoaXMuJGludGVyYWN0aW9ucyA9ICRpbnRlcmFjdGlvbnNHcm91cDtcbiAgICB0aGlzLiRzdmcgPSAkc3ZnO1xuICAgIHRoaXMuJGJhY2tncm91bmQgPSAkYmFja2dyb3VuZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgbGF5ZXIgdG8gdGhlIHRyYWNrLlxuICAgKlxuICAgKiBAcGFyYW0ge0xheWVyfSBsYXllciAtIHRoZSBsYXllciB0byBhZGQgdG8gdGhlIHRyYWNrLlxuICAgKi9cbiAgYWRkKGxheWVyKSB7XG4gICAgdGhpcy5sYXllcnMucHVzaChsYXllcik7XG4gICAgLy8gQ3JlYXRlIGEgZGVmYXVsdCByZW5kZXJpbmdDb250ZXh0IGZvciB0aGUgbGF5ZXIgaWYgbWlzc2luZ1xuICAgIHRoaXMuJGxheW91dC5hcHBlbmRDaGlsZChsYXllci4kZWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBsYXllciBmcm9tIHRoZSB0cmFjay4gVGhlIGxheWVyIGNhbiBiZSByZXVzZWQgZWxzZXdoZXJlLlxuICAgKlxuICAgKiBAcGFyYW0ge0xheWVyfSBsYXllciAtIHRoZSBsYXllciB0byByZW1vdmUgZnJvbSB0aGUgdHJhY2suXG4gICAqL1xuICByZW1vdmUobGF5ZXIpIHtcbiAgICB0aGlzLmxheWVycy5zcGxpY2UodGhpcy5sYXllcnMuaW5kZXhPZihsYXllciksIDEpO1xuICAgIC8vIFJlbW92ZXMgbGF5ZXIgZnJvbSBpdHMgY29udGFpbmVyXG4gICAgdGhpcy4kbGF5b3V0LnJlbW92ZUNoaWxkKGxheWVyLiRlbCk7XG4gIH1cblxuICAvKipcbiAgICogVGVzdHMgaWYgYSBnaXZlbiBlbGVtZW50IGJlbG9uZ3MgdG8gdGhlIHRyYWNrLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRlbFxuICAgKiBAcmV0dXJuIHtib29sfVxuICAgKi9cbiAgaGFzRWxlbWVudCgkZWwpIHtcbiAgICBkbyB7XG4gICAgICBpZiAoJGVsID09PSB0aGlzLiRlbCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgJGVsID0gJGVsLnBhcmVudE5vZGU7XG4gICAgfSB3aGlsZSAoJGVsICE9PSBudWxsKTtcblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgYWxsIHRoZSBsYXllcnMgYWRkZWQgdG8gdGhlIHRyYWNrLlxuICAgKi9cbiAgcmVuZGVyKCkge1xuICAgIGZvciAobGV0IGxheWVyIG9mIHRoaXMpIHsgbGF5ZXIucmVuZGVyKCk7IH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSB0cmFjayBET00gc3RydWN0dXJlIGFuZCB1cGRhdGVzIHRoZSBsYXllcnMuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXk8TGF5ZXI+fSBbbGF5ZXJzPW51bGxdIC0gaWYgbm90IG51bGwsIGEgc3Vic2V0IG9mIHRoZSBsYXllcnMgdG8gdXBkYXRlLlxuICAgKi9cbiAgdXBkYXRlKGxheWVycyA9IG51bGwpIHtcbiAgICB0aGlzLnVwZGF0ZUNvbnRhaW5lcigpO1xuICAgIHRoaXMudXBkYXRlTGF5ZXJzKGxheWVycyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgdHJhY2sgRE9NIHN0cnVjdHVyZS5cbiAgICovXG4gIHVwZGF0ZUNvbnRhaW5lcigpIHtcbiAgICBjb25zdCAkc3ZnID0gdGhpcy4kc3ZnO1xuICAgIGNvbnN0ICRvZmZzZXQgPSB0aGlzLiRvZmZzZXQ7XG4gICAgLy8gU2hvdWxkIGJlIGluIHNvbWUgdXBkYXRlIGxheW91dFxuICAgIGNvbnN0IHJlbmRlcmluZ0NvbnRleHQgPSB0aGlzLnJlbmRlcmluZ0NvbnRleHQ7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gICAgY29uc3Qgd2lkdGggPSBNYXRoLnJvdW5kKHJlbmRlcmluZ0NvbnRleHQudmlzaWJsZVdpZHRoKTtcbiAgICBjb25zdCBvZmZzZXRYID0gTWF0aC5yb3VuZChyZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHJlbmRlcmluZ0NvbnRleHQub2Zmc2V0KSk7XG4gICAgY29uc3QgdHJhbnNsYXRlID0gYHRyYW5zbGF0ZSgke29mZnNldFh9LCAwKWA7XG5cbiAgICAkc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBoZWlnaHQpO1xuICAgICRzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgd2lkdGgpO1xuICAgICRzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3ZpZXdib3gnLCBgMCAwICR7d2lkdGh9ICR7aGVpZ2h0fWApO1xuXG4gICAgJG9mZnNldC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgdHJhbnNsYXRlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBsYXllcnMuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXk8TGF5ZXI+fSBbbGF5ZXJzPW51bGxdIC0gaWYgbm90IG51bGwsIGEgc3Vic2V0IG9mIHRoZSBsYXllcnMgdG8gdXBkYXRlLlxuICAgKi9cbiAgdXBkYXRlTGF5ZXJzKGxheWVycyA9IG51bGwpIHtcbiAgICBsYXllcnMgPSAobGF5ZXJzID09PSBudWxsKSA/IHRoaXMubGF5ZXJzIDogbGF5ZXJzO1xuXG4gICAgbGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB7XG4gICAgICBpZiAodGhpcy5sYXllcnMuaW5kZXhPZihsYXllcikgPT09IC0xKSB7IHJldHVybjsgfVxuICAgICAgbGF5ZXIudXBkYXRlKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSXRlcmF0ZXMgdGhyb3VnaCB0aGUgYWRkZWQgbGF5ZXJzLlxuICAgKi9cbiAgKltTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgIHlpZWxkKiB0aGlzLmxheWVyc1tTeW1ib2wuaXRlcmF0b3JdKCk7XG4gIH1cbn1cbiJdfQ==