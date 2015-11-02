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
 * Acts as a placeholder to organize the vertical layout of the visualization and the horizontal alignement to an abscissa that correspond to a common time reference. It basically offer a view on the overall timeline.
 *
 * Tracks are inserted into a given DOM element, allowing to create DAW like representations. Each `Track` instance can host multiple `Layer` instances. A track must be added to a timeline before being updated.
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
   * Create the track of the given `height` in the given `$el`
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
   * @type {Number}
   */

  _createClass(Track, [{
    key: 'configure',

    /**
     * This method is called when the track is added to the timeline. The track cannot be updated without being added to a timeline.
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
     * @todo propagate to layers, keeping ratio? could be handy for vertical resize. This is why a set/get is implemented here.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jb3JlL3RyYWNrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFBZSxhQUFhOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTZDUCxLQUFLOzs7Ozs7O0FBTWIsV0FOUSxLQUFLLENBTVosR0FBRyxFQUFnQjtRQUFkLE1BQU0seURBQUcsR0FBRzs7MEJBTlYsS0FBSzs7QUFPdEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7Ozs7OztBQU10QixRQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQzs7Ozs7QUFLZixRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQzs7QUFFMUIsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7O0FBRXBCLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDOztBQUVwQixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFakIsUUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7Ozs7OztBQU14QixRQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQzs7Ozs7QUFLakIsUUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQzs7QUFFN0IsUUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7R0FDekI7Ozs7Ozs7ZUF4Q2tCLEtBQUs7Ozs7Ozs7O1dBZ0VmLG1CQUFDLGdCQUFnQixFQUFFO0FBQzFCLFVBQUksQ0FBQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQztLQUMxQzs7Ozs7OztXQUtNLG1CQUFHOzs7O0FBRVIsVUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hDLFVBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztlQUFLLE1BQUssT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO09BQUEsQ0FBQyxDQUFDOztB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QUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUNsRixVQUFNLFNBQVMsa0JBQWdCLE9BQU8sU0FBTSxDQUFDOztBQUU3QyxVQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDNUMsVUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzFDLFVBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFNBQVMsV0FBUyxLQUFLLFNBQUksTUFBTSxDQUFHLENBQUM7O0FBRS9ELGFBQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztLQUN0RDs7Ozs7Ozs7V0FNVyx3QkFBZ0I7OztVQUFmLE1BQU0seURBQUcsSUFBSTs7QUFDeEIsWUFBTSxHQUFHLEFBQUMsTUFBTSxLQUFLLElBQUksR0FBSSxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQzs7QUFFbEQsWUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUssRUFBSztBQUN4QixZQUFJLE9BQUssTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUFFLGlCQUFPO1NBQUU7QUFDbEQsYUFBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO09BQ2hCLENBQUMsQ0FBQztLQUNKOzs7Ozs7O29DQUtpQjs7OzswREFDVCxJQUFJLENBQUMsTUFBTTs7Ozs7OztLQUNuQjs7O1NBM0tTLGVBQUc7QUFDWCxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7S0FDckI7Ozs7Ozs7U0FPUyxhQUFDLEtBQUssRUFBRTtBQUNoQixVQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztLQUN0Qjs7O1NBekRrQixLQUFLOzs7cUJBQUwsS0FBSyIsImZpbGUiOiJzcmMvY29yZS90cmFjay5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBucyBmcm9tICcuL25hbWVzcGFjZSc7XG5cblxuLyoqXG4gKiBBY3RzIGFzIGEgcGxhY2Vob2xkZXIgdG8gb3JnYW5pemUgdGhlIHZlcnRpY2FsIGxheW91dCBvZiB0aGUgdmlzdWFsaXphdGlvbiBhbmQgdGhlIGhvcml6b250YWwgYWxpZ25lbWVudCB0byBhbiBhYnNjaXNzYSB0aGF0IGNvcnJlc3BvbmQgdG8gYSBjb21tb24gdGltZSByZWZlcmVuY2UuIEl0IGJhc2ljYWxseSBvZmZlciBhIHZpZXcgb24gdGhlIG92ZXJhbGwgdGltZWxpbmUuXG4gKlxuICogVHJhY2tzIGFyZSBpbnNlcnRlZCBpbnRvIGEgZ2l2ZW4gRE9NIGVsZW1lbnQsIGFsbG93aW5nIHRvIGNyZWF0ZSBEQVcgbGlrZSByZXByZXNlbnRhdGlvbnMuIEVhY2ggYFRyYWNrYCBpbnN0YW5jZSBjYW4gaG9zdCBtdWx0aXBsZSBgTGF5ZXJgIGluc3RhbmNlcy4gQSB0cmFjayBtdXN0IGJlIGFkZGVkIHRvIGEgdGltZWxpbmUgYmVmb3JlIGJlaW5nIHVwZGF0ZWQuXG4gKlxuICogIyMjIEEgdGltZWxpbmUgd2l0aCAzIHRyYWNrczpcbiAqXG4gKiBgYGBcbiAqIDAgICAgICAgICAgICAgICAgIDYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMTZcbiAqICstIC0gLSAtIC0gLSAtIC0gLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKy0gLSAtIC0gLSAtIC1cbiAqIHwgICAgICAgICAgICAgICAgIHx4IHRyYWNrIDEgeHh4eHh4eHh4eHh4eHh4eHh4eHh4fFxuICogKy0gLSAtIC0gLSAtIC0gLSAtKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rLSAtIC0gLSAtIC0gLVxuICogfCAgICAgICAgICAgICAgICAgfHggdHJhY2sgMiB4eHh4eHh4eHh4eHh4eHh4eHh4eHh8XG4gKiArLSAtIC0gLSAtIC0gLSAtIC0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSstIC0gLSAtIC0gLSAtXG4gKiB8ICAgICAgICAgICAgICAgICB8eCB0cmFjayAzIHh4eHh4eHh4eHh4eHh4eHh4eHh4eHxcbiAqICstIC0gLSAtIC0gLSAtIC0gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKy0gLSAtIC0gLSAtIC1cbiAqICstLS0tLS0tLS0tLS0tLS0tLT5cbiAqIHRpbWVsaW5lLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRpbWVsaW5lLnRpbWVDb250ZXh0Lm9mZnNldClcbiAqXG4gKiAgICAgICAgICAgICAgICAgICA8LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLT5cbiAqICAgICAgICAgICAgICAgICAgIHRpbWVsaW5lJ3MgdHJhY2tzIGRlZmF1bHRzIHRvIDEwMDBweFxuICogICAgICAgICAgICAgICAgICAgd2l0aCBhIGRlZmF1bHQgcGl4ZWxzUGVyU2Vjb25kIG9mIDEwMHB4L3MuXG4gKiAgICAgICAgICAgICAgICAgICBhbmQgYSBkZWZhdWx0IGBzdHJldGNoUmF0aW8gPSAxYFxuICogICAgICAgICAgICAgICAgICAgdHJhY2sxIHNob3dzIDEwIHNlY29uZHMgb2YgdGhlIHRpbWVsaW5lXG4gKiBgYGBcbiAqXG4gKiAjIyMgVHJhY2sgRE9NIHN0cnVjdHVyZVxuICpcbiAqIGBgYGh0bWxcbiAqIDxzdmcgd2lkdGg9XCIke3Zpc2libGVXaWR0aH1cIj5cbiAqICAgPCEtLSBiYWNrZ3JvdW5kIC0tPlxuICogICA8cmVjdD48cmVjdD5cbiAqICAgPCEtLSBtYWluIHZpZXcgLS0+XG4gKiAgIDxnIGNsYXNzPVwib2Zmc2V0XCIgdHJhbnNmb3JtPVwidHJhbnNsYXRlKCR7b2Zmc2V0fSwgMClcIj5cbiAqICAgICA8ZyBjbGFzcz1cImxheW91dFwiPlxuICogICAgICAgPCEtLSBsYXllcnMgLS0+XG4gKiAgICAgPC9nPlxuICogICA8L2c+XG4gKiAgIDxnIGNsYXNzPVwiaW50ZXJhY3Rpb25zXCI+PCEtLSBmb3IgZmVlZGJhY2sgLS0+PC9nPlxuICogPC9zdmc+XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhY2sge1xuICAvKipcbiAgICogQ3JlYXRlIHRoZSB0cmFjayBvZiB0aGUgZ2l2ZW4gYGhlaWdodGAgaW4gdGhlIGdpdmVuIGAkZWxgXG4gICAqIEBwYXJhbSB7RE9NRWxlbWVudH0gJGVsXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbaGVpZ2h0ID0gMTAwXVxuICAgKi9cbiAgY29uc3RydWN0b3IoJGVsLCBoZWlnaHQgPSAxMDApIHtcbiAgICB0aGlzLl9oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgRE9NIGVsZW1lbnQgaW4gd2hpY2ggdGhlIHRyYWNrIGlzIGNyZWF0ZWQuXG4gICAgICogQHR5cGUge0VsZW1lbnR9XG4gICAgICovXG4gICAgdGhpcy4kZWwgPSAkZWw7XG4gICAgLyoqXG4gICAgICogQSBwbGFjZWhvbGRlciB0byBhZGQgc2hhcGVzIGZvciBpbnRlcmFjdGlvbnMgZmVlZGJhY2suXG4gICAgICogQHR5cGUge0VsZW1lbnR9XG4gICAgICovXG4gICAgdGhpcy4kaW50ZXJhY3Rpb25zID0gbnVsbDtcbiAgICAvKiogQHR5cGUge0VsZW1lbnR9ICovXG4gICAgdGhpcy4kbGF5b3V0ID0gbnVsbDtcbiAgICAvKiogQHR5cGUge0VsZW1lbnR9ICovXG4gICAgdGhpcy4kb2Zmc2V0ID0gbnVsbDtcbiAgICAvKiogQHR5cGUge0VsZW1lbnR9ICovXG4gICAgdGhpcy4kc3ZnID0gbnVsbDtcbiAgICAvKiogQHR5cGUge0VsZW1lbnR9ICovXG4gICAgdGhpcy4kYmFja2dyb3VuZCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBBbiBhcnJheSBvZiBhbGwgdGhlIGxheWVycyBiZWxvbmdpbmcgdG8gdGhlIHRyYWNrLlxuICAgICAqIEB0eXBlIHtBcnJheTxMYXllcj59XG4gICAgICovXG4gICAgdGhpcy5sYXllcnMgPSBbXTtcbiAgICAvKipcbiAgICAgKiBUaGUgY29udGV4dCB1c2VkIHRvIG1haW50YWluIHRoZSBET00gc3RydWN0dXJlIG9mIHRoZSB0cmFjay5cbiAgICAgKiBAdHlwZSB7VGltZWxpbmVUaW1lQ29udGV4dH1cbiAgICAgKi9cbiAgICB0aGlzLnJlbmRlcmluZ0NvbnRleHQgPSBudWxsO1xuXG4gICAgdGhpcy5fY3JlYXRlQ29udGFpbmVyKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaGVpZ2h0IG9mIHRoZSB0cmFjay5cbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBoZWlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlaWdodDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBoZWlnaHQgb2YgdGhlIHRyYWNrLlxuICAgKiBAdG9kbyBwcm9wYWdhdGUgdG8gbGF5ZXJzLCBrZWVwaW5nIHJhdGlvPyBjb3VsZCBiZSBoYW5keSBmb3IgdmVydGljYWwgcmVzaXplLiBUaGlzIGlzIHdoeSBhIHNldC9nZXQgaXMgaW1wbGVtZW50ZWQgaGVyZS5cbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHNldCBoZWlnaHQodmFsdWUpIHtcbiAgICB0aGlzLl9oZWlnaHQgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgd2hlbiB0aGUgdHJhY2sgaXMgYWRkZWQgdG8gdGhlIHRpbWVsaW5lLiBUaGUgdHJhY2sgY2Fubm90IGJlIHVwZGF0ZWQgd2l0aG91dCBiZWluZyBhZGRlZCB0byBhIHRpbWVsaW5lLlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge1RpbWVsaW5lVGltZUNvbnRleHR9IHJlbmRlcmluZ0NvbnRleHRcbiAgICovXG4gIGNvbmZpZ3VyZShyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgdGhpcy5yZW5kZXJpbmdDb250ZXh0ID0gcmVuZGVyaW5nQ29udGV4dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95IHRoZSB0cmFjay4gVGhlIGxheWVycyBmcm9tIHRoaXMgdHJhY2sgY2FuIHN0aWxsIGJlIHJldXNlZCBlbHNld2hlcmUuXG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIC8vIERldGFjaCBldmVyeXRoaW5nIGZyb20gdGhlIERPTVxuICAgIHRoaXMuJGVsLnJlbW92ZUNoaWxkKHRoaXMuJHN2Zyk7XG4gICAgdGhpcy5sYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHRoaXMuJGxheW91dC5yZW1vdmVDaGlsZChsYXllci4kZWwpKTtcbiAgICAvLyBjbGVhbiByZWZlcmVuY2VzXG4gICAgdGhpcy4kZWwgPSBudWxsO1xuICAgIHRoaXMucmVuZGVyaW5nQ29udGV4dCA9IG51bGw7XG4gICAgdGhpcy5sYXllcnMubGVuZ3RoID0gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIHRoZSBET00gc3RydWN0dXJlIG9mIHRoZSB0cmFjay5cbiAgICovXG4gIF9jcmVhdGVDb250YWluZXIoKSB7XG4gICAgY29uc3QgJHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3N2ZycpO1xuICAgICRzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdvcHRpbWl6ZVNwZWVkJyk7XG4gICAgJHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgdGhpcy5oZWlnaHQpO1xuICAgICRzdmcuc2V0QXR0cmlidXRlKCd4bWxuczp4aHRtbCcsICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJyk7XG4gICAgJHN2Zy5jbGFzc0xpc3QuYWRkKCd0cmFjaycpO1xuXG4gICAgY29uc3QgJGJhY2tncm91bmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdyZWN0Jyk7XG4gICAgJGJhY2tncm91bmQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsICcxMDAlJyk7XG4gICAgJGJhY2tncm91bmQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgJzEwMCUnKTtcbiAgICAkYmFja2dyb3VuZC5zdHlsZS5maWxsT3BhY2l0eSA9IDA7XG4gICAgLy8gJGJhY2tncm91bmQuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcblxuICAgIGNvbnN0ICRkZWZzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZGVmcycpO1xuXG4gICAgY29uc3QgJG9mZnNldEdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgICRvZmZzZXRHcm91cC5jbGFzc0xpc3QuYWRkKCdvZmZzZXQnKTtcblxuICAgIGNvbnN0ICRsYXlvdXRHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICAkbGF5b3V0R3JvdXAuY2xhc3NMaXN0LmFkZCgnbGF5b3V0Jyk7XG5cbiAgICBjb25zdCAkaW50ZXJhY3Rpb25zR3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgJGludGVyYWN0aW9uc0dyb3VwLmNsYXNzTGlzdC5hZGQoJ2ludGVyYWN0aW9ucycpO1xuXG4gICAgJG9mZnNldEdyb3VwLmFwcGVuZENoaWxkKCRsYXlvdXRHcm91cCk7XG4gICAgJHN2Zy5hcHBlbmRDaGlsZCgkZGVmcyk7XG4gICAgJHN2Zy5hcHBlbmRDaGlsZCgkYmFja2dyb3VuZCk7XG4gICAgJHN2Zy5hcHBlbmRDaGlsZCgkb2Zmc2V0R3JvdXApO1xuICAgICRzdmcuYXBwZW5kQ2hpbGQoJGludGVyYWN0aW9uc0dyb3VwKTtcbiAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCgkc3ZnKTtcbiAgICAvLyByZW1vdmVzIGFkZGl0aW9ubmFsIGhlaWdodCBhZGRlZCB3aG8ga25vd3Mgd2h5Li4uXG4gICAgdGhpcy4kZWwuc3R5bGUuZm9udFNpemUgPSAwO1xuICAgIC8vIGZpeGVzIG9uZSBvZiB0aGUgKG1hbnkgPykgd2VpcmQgY2FudmFzIHJlbmRlcmluZyBidWdzIGluIENocm9tZVxuICAgIHRoaXMuJGVsLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVaKDApJztcblxuICAgIHRoaXMuJGxheW91dCA9ICRsYXlvdXRHcm91cDtcbiAgICB0aGlzLiRvZmZzZXQgPSAkb2Zmc2V0R3JvdXA7XG4gICAgdGhpcy4kaW50ZXJhY3Rpb25zID0gJGludGVyYWN0aW9uc0dyb3VwO1xuICAgIHRoaXMuJHN2ZyA9ICRzdmc7XG4gICAgdGhpcy4kYmFja2dyb3VuZCA9ICRiYWNrZ3JvdW5kO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBsYXllciB0byB0aGUgdHJhY2suXG4gICAqIEBwYXJhbSB7TGF5ZXJ9IGxheWVyIC0gdGhlIGxheWVyIHRvIGFkZCB0byB0aGUgdHJhY2suXG4gICAqL1xuICBhZGQobGF5ZXIpIHtcbiAgICB0aGlzLmxheWVycy5wdXNoKGxheWVyKTtcbiAgICAvLyBDcmVhdGUgYSBkZWZhdWx0IHJlbmRlcmluZ0NvbnRleHQgZm9yIHRoZSBsYXllciBpZiBtaXNzaW5nXG4gICAgdGhpcy4kbGF5b3V0LmFwcGVuZENoaWxkKGxheWVyLiRlbCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGxheWVyIGZyb20gdGhlIHRyYWNrLiBUaGUgbGF5ZXIgY2FuIGJlIHJldXNlZCBlbHNld2hlcmUuXG4gICAqIEBwYXJhbSB7TGF5ZXJ9IGxheWVyIC0gdGhlIGxheWVyIHRvIHJlbW92ZSBmcm9tIHRoZSB0cmFjay5cbiAgICovXG4gIHJlbW92ZShsYXllcikge1xuICAgIHRoaXMubGF5ZXJzLnNwbGljZSh0aGlzLmxheWVycy5pbmRleE9mKGxheWVyKSwgMSk7XG4gICAgLy8gUmVtb3ZlcyBsYXllciBmcm9tIGl0cyBjb250YWluZXJcbiAgICB0aGlzLiRsYXlvdXQucmVtb3ZlQ2hpbGQobGF5ZXIuJGVsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUZXN0cyBpZiBhIGdpdmVuIGVsZW1lbnQgYmVsb25ncyB0byB0aGUgdHJhY2suXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGVsXG4gICAqIEByZXR1cm4ge2Jvb2x9XG4gICAqL1xuICBoYXNFbGVtZW50KCRlbCkge1xuICAgIGRvIHtcbiAgICAgIGlmICgkZWwgPT09IHRoaXMuJGVsKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICAkZWwgPSAkZWwucGFyZW50Tm9kZTtcbiAgICB9IHdoaWxlICgkZWwgIT09IG51bGwpO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciBhbGwgdGhlIGxheWVycyBhZGRlZCB0byB0aGUgdHJhY2suXG4gICAqL1xuICByZW5kZXIoKSB7XG4gICAgZm9yIChsZXQgbGF5ZXIgb2YgdGhpcykgeyBsYXllci5yZW5kZXIoKTsgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHRyYWNrIERPTSBzdHJ1Y3R1cmUgYW5kIHVwZGF0ZXMgdGhlIGxheWVycy5cbiAgICogQHBhcmFtIHtBcnJheTxMYXllcj59IFtsYXllcnM9bnVsbF0gLSBpZiBub3QgbnVsbCwgYSBzdWJzZXQgb2YgdGhlIGxheWVycyB0byB1cGRhdGUuXG4gICAqL1xuICB1cGRhdGUobGF5ZXJzID0gbnVsbCkge1xuICAgIHRoaXMudXBkYXRlQ29udGFpbmVyKCk7XG4gICAgdGhpcy51cGRhdGVMYXllcnMobGF5ZXJzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSB0cmFjayBET00gc3RydWN0dXJlLlxuICAgKi9cbiAgdXBkYXRlQ29udGFpbmVyKCkge1xuICAgIGNvbnN0ICRzdmcgPSB0aGlzLiRzdmc7XG4gICAgY29uc3QgJG9mZnNldCA9IHRoaXMuJG9mZnNldDtcbiAgICAvLyBTaG91bGQgYmUgaW4gc29tZSB1cGRhdGUgbGF5b3V0XG4gICAgY29uc3QgcmVuZGVyaW5nQ29udGV4dCA9IHRoaXMucmVuZGVyaW5nQ29udGV4dDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmhlaWdodDtcbiAgICBjb25zdCB3aWR0aCA9IE1hdGgucm91bmQocmVuZGVyaW5nQ29udGV4dC52aXNpYmxlV2lkdGgpO1xuICAgIGNvbnN0IG9mZnNldFggPSBNYXRoLnJvdW5kKHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwocmVuZGVyaW5nQ29udGV4dC5vZmZzZXQpKTtcbiAgICBjb25zdCB0cmFuc2xhdGUgPSBgdHJhbnNsYXRlKCR7b2Zmc2V0WH0sIDApYDtcblxuICAgICRzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgJHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB3aWR0aCk7XG4gICAgJHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndmlld2JveCcsIGAwIDAgJHt3aWR0aH0gJHtoZWlnaHR9YCk7XG5cbiAgICAkb2Zmc2V0LnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCB0cmFuc2xhdGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGxheWVycy5cbiAgICogQHBhcmFtIHtBcnJheTxMYXllcj59IFtsYXllcnM9bnVsbF0gLSBpZiBub3QgbnVsbCwgYSBzdWJzZXQgb2YgdGhlIGxheWVycyB0byB1cGRhdGUuXG4gICAqL1xuICB1cGRhdGVMYXllcnMobGF5ZXJzID0gbnVsbCkge1xuICAgIGxheWVycyA9IChsYXllcnMgPT09IG51bGwpID8gdGhpcy5sYXllcnMgOiBsYXllcnM7XG5cbiAgICBsYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHtcbiAgICAgIGlmICh0aGlzLmxheWVycy5pbmRleE9mKGxheWVyKSA9PT0gLTEpIHsgcmV0dXJuOyB9XG4gICAgICBsYXllci51cGRhdGUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdGVyYXRlcyB0aHJvdWdoIHRoZSBhZGRlZCBsYXllcnMuXG4gICAqL1xuICAqW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgeWllbGQqIHRoaXMubGF5ZXJzW1N5bWJvbC5pdGVyYXRvcl0oKTtcbiAgfVxufVxuIl19