'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _namespace = require('../core/namespace');

var _namespace2 = _interopRequireDefault(_namespace);

var _layer = require('../core/layer');

var _layer2 = _interopRequireDefault(_layer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Simplified Layer for Axis. The main difference with a regular layer is that
 * an axis layer use the `Timeline~timeContext` attributes to render it's layout
 * and stay synchronized with the tracks visible area. All getters and setters
 * to the `TimelineTimeContext` attributes are bypassed.
 *
 * It also handle it's own data and its updates. The `_generateData` method is
 * responsible to create some usefull data to visualize
 *
 * [example usage of the layer-axis](./examples/layer-axis.html)
 */
var AxisLayer = function (_Layer) {
  (0, _inherits3.default)(AxisLayer, _Layer);

  /**
   * @param {Function} generator - A function to create data according to
   *    the `Timeline~timeContext`.
   * @param {Object} options - Layer options, cf. Layer for available options.
   */
  function AxisLayer(generator, options) {
    (0, _classCallCheck3.default)(this, AxisLayer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (AxisLayer.__proto__ || (0, _getPrototypeOf2.default)(AxisLayer)).call(this, 'entity', [], options));

    _this._generator = generator;
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(AxisLayer, [{
    key: '_generateData',


    /**
     * This method is the main difference with a classical layer. An `AxisLayer`
     * instance generates and maintains it's own data.
     */
    value: function _generateData() {
      var data = this._generator(this.timeContext);
      // prepend first arguments of splice for an apply
      data.unshift(0, this.data[0].length);
      // make sure to keep the same reference
      Array.prototype.splice.apply(this.data[0], data);
    }

    /**
     * Updates the rendering context for the shapes.
     */

  }, {
    key: '_updateRenderingContext',
    value: function _updateRenderingContext() {
      this._renderingContext.timeToPixel = this.timeContext.timeToPixel;
      this._renderingContext.valueToPixel = this._valueToPixel;
      this._renderingContext.height = this.params.height;
      // this._renderingContext.width  = this.timeContext.timeToPixel(this.timeContext.duration);

      // for foreign object issue in chrome
      this._renderingContext.offsetX = this.timeContext.timeToPixel(this.timeContext.offset);
      this._renderingContext.visibleWidth = this.timeContext.visibleWidth;
    }

    /**
     * Generates the data and update the layer.
     */

  }, {
    key: 'update',
    value: function update() {
      this._generateData();
      (0, _get3.default)(AxisLayer.prototype.__proto__ || (0, _getPrototypeOf2.default)(AxisLayer.prototype), 'update', this).call(this);
    }

    /**
     * Render the DOM in memory on layer creation to be able to use it before
     * the layer is actually inserted in the DOM
     */

  }, {
    key: '_renderContainer',
    value: function _renderContainer() {
      // wrapper group for `start, top and context flip matrix
      this.$el = document.createElementNS(_namespace2.default, 'g');
      if (this.params.className !== null) {
        this.$el.classList.add('layer', this.params.className);
      }

      // group to apply offset
      this.$offset = document.createElementNS(_namespace2.default, 'g');
      this.$offset.classList.add('offset', 'items');
      // layer background
      this.$background = document.createElementNS(_namespace2.default, 'rect');
      this.$background.classList.add('background');
      this.$background.style.fillOpacity = 0;
      this.$background.style.pointerEvents = 'none';
      // create the DOM tree
      this.$el.appendChild(this.$offset);
      this.$offset.appendChild(this.$background);
    }

    /**
     * Updates the layout of the layer.
     */

  }, {
    key: 'updateContainer',
    value: function updateContainer() {
      this._updateRenderingContext();

      var top = this.params.top;
      var height = this.params.height;
      var left = Math.max(0, -this._renderingContext.offsetX);
      // matrix to invert the coordinate system
      var translateMatrix = 'matrix(1, 0, 0, -1, 0, ' + (top + height) + ')';
      this.$el.setAttributeNS(null, 'transform', translateMatrix);

      // keep background on the visible area
      this.$background.setAttributeNS(null, 'height', height);
      this.$background.setAttributeNS(null, 'width', this.timeContext.visibleWidth);
      this.$background.setAttributeNS(null, 'x', left);
    }
  }, {
    key: 'stretchRatio',
    set: function set(value) {
      return;
    }
    /** @private */
    ,

    /** @private */
    get: function get() {
      return;
    }
    /** @private */

  }, {
    key: 'offset',
    set: function set(value) {
      return;
    }
    /** @private */
    ,
    get: function get() {
      return;
    }
    /** @private */

  }, {
    key: 'start',
    set: function set(value) {
      return;
    }
    /** @private */
    ,
    get: function get() {
      return;
    }
    /** @private */

  }, {
    key: 'duration',
    set: function set(value) {
      return;
    },
    get: function get() {
      return;
    }

    /**
     * The generator that creates the data to be rendered to display the axis.
     *
     * @type {Function}
     */

  }, {
    key: 'generator',
    set: function set(func) {
      this._generator = func;
    }

    /**
     * The generator that creates the data to be rendered to display the axis.
     *
     * @type {Function}
     */
    ,
    get: function get() {
      return this._generator;
    }
  }]);
  return AxisLayer;
}(_layer2.default);

exports.default = AxisLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF4aXMtbGF5ZXIuanMiXSwibmFtZXMiOlsiQXhpc0xheWVyIiwiZ2VuZXJhdG9yIiwib3B0aW9ucyIsIl9nZW5lcmF0b3IiLCJkYXRhIiwidGltZUNvbnRleHQiLCJ1bnNoaWZ0IiwibGVuZ3RoIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJzcGxpY2UiLCJhcHBseSIsIl9yZW5kZXJpbmdDb250ZXh0IiwidGltZVRvUGl4ZWwiLCJ2YWx1ZVRvUGl4ZWwiLCJfdmFsdWVUb1BpeGVsIiwiaGVpZ2h0IiwicGFyYW1zIiwib2Zmc2V0WCIsIm9mZnNldCIsInZpc2libGVXaWR0aCIsIl9nZW5lcmF0ZURhdGEiLCIkZWwiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnROUyIsImNsYXNzTmFtZSIsImNsYXNzTGlzdCIsImFkZCIsIiRvZmZzZXQiLCIkYmFja2dyb3VuZCIsInN0eWxlIiwiZmlsbE9wYWNpdHkiLCJwb2ludGVyRXZlbnRzIiwiYXBwZW5kQ2hpbGQiLCJfdXBkYXRlUmVuZGVyaW5nQ29udGV4dCIsInRvcCIsImxlZnQiLCJNYXRoIiwibWF4IiwidHJhbnNsYXRlTWF0cml4Iiwic2V0QXR0cmlidXRlTlMiLCJ2YWx1ZSIsImZ1bmMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUdBOzs7Ozs7Ozs7OztJQVdxQkEsUzs7O0FBQ25COzs7OztBQUtBLHFCQUFZQyxTQUFaLEVBQXVCQyxPQUF2QixFQUFnQztBQUFBOztBQUFBLDRJQUN4QixRQUR3QixFQUNkLEVBRGMsRUFDVkEsT0FEVTs7QUFFOUIsVUFBS0MsVUFBTCxHQUFrQkYsU0FBbEI7QUFGOEI7QUFHL0I7O0FBRUQ7Ozs7Ozs7QUFvQ0E7Ozs7b0NBSWdCO0FBQ2QsVUFBTUcsT0FBTyxLQUFLRCxVQUFMLENBQWdCLEtBQUtFLFdBQXJCLENBQWI7QUFDQTtBQUNBRCxXQUFLRSxPQUFMLENBQWEsQ0FBYixFQUFnQixLQUFLRixJQUFMLENB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QUM3Qjs7d0JBT2E7QUFBRTtBQUFTO0FBQ3hCOzs7O3NCQVBVQSxLLEVBQU87QUFBRTtBQUFTO0FBQzVCOzt3QkFPWTtBQUFFO0FBQVM7QUFDdkI7Ozs7c0JBUGFBLEssRUFBTztBQUFFO0FBQVMsSzt3QkFRaEI7QUFBRTtBQUFTOztBQUcxQjs7Ozs7Ozs7c0JBS2NDLEksRUFBTTtBQUNsQixXQUFLdkMsVUFBTCxHQUFrQnVDLElBQWxCO0FBQ0Q7O0FBRUQ7Ozs7Ozt3QkFLZ0I7QUFDZCxhQUFPLEtBQUt2QyxVQUFaO0FBQ0Q7Ozs7O2tCQTdDa0JILFMiLCJmaWxlIjoiYXhpcy1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBucyBmcm9tICcuLi9jb3JlL25hbWVzcGFjZSc7XG5pbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5cblxuLyoqXG4gKiBTaW1wbGlmaWVkIExheWVyIGZvciBBeGlzLiBUaGUgbWFpbiBkaWZmZXJlbmNlIHdpdGggYSByZWd1bGFyIGxheWVyIGlzIHRoYXRcbiAqIGFuIGF4aXMgbGF5ZXIgdXNlIHRoZSBgVGltZWxpbmV+dGltZUNvbnRleHRgIGF0dHJpYnV0ZXMgdG8gcmVuZGVyIGl0J3MgbGF5b3V0XG4gKiBhbmQgc3RheSBzeW5jaHJvbml6ZWQgd2l0aCB0aGUgdHJhY2tzIHZpc2libGUgYXJlYS4gQWxsIGdldHRlcnMgYW5kIHNldHRlcnNcbiAqIHRvIHRoZSBgVGltZWxpbmVUaW1lQ29udGV4dGAgYXR0cmlidXRlcyBhcmUgYnlwYXNzZWQuXG4gKlxuICogSXQgYWxzbyBoYW5kbGUgaXQncyBvd24gZGF0YSBhbmQgaXRzIHVwZGF0ZXMuIFRoZSBgX2dlbmVyYXRlRGF0YWAgbWV0aG9kIGlzXG4gKiByZXNwb25zaWJsZSB0byBjcmVhdGUgc29tZSB1c2VmdWxsIGRhdGEgdG8gdmlzdWFsaXplXG4gKlxuICogW2V4YW1wbGUgdXNhZ2Ugb2YgdGhlIGxheWVyLWF4aXNdKC4vZXhhbXBsZXMvbGF5ZXItYXhpcy5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBeGlzTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBnZW5lcmF0b3IgLSBBIGZ1bmN0aW9uIHRvIGNyZWF0ZSBkYXRhIGFjY29yZGluZyB0b1xuICAgKiAgICB0aGUgYFRpbWVsaW5lfnRpbWVDb250ZXh0YC5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBMYXllciBvcHRpb25zLCBjZi4gTGF5ZXIgZm9yIGF2YWlsYWJsZSBvcHRpb25zLlxuICAgKi9cbiAgY29uc3RydWN0b3IoZ2VuZXJhdG9yLCBvcHRpb25zKSB7XG4gICAgc3VwZXIoJ2VudGl0eScsIFtdLCBvcHRpb25zKTtcbiAgICB0aGlzLl9nZW5lcmF0b3IgPSBnZW5lcmF0b3I7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc2V0IHN0cmV0Y2hSYXRpbyh2YWx1ZSkgeyByZXR1cm47IH1cbiAgLyoqIEBwcml2YXRlICovXG4gIHNldCBvZmZzZXQodmFsdWUpIHsgcmV0dXJuOyB9XG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzZXQgc3RhcnQodmFsdWUpIHsgcmV0dXJuOyB9XG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzZXQgZHVyYXRpb24odmFsdWUpIHsgcmV0dXJuOyB9XG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBnZXQgc3RyZXRjaFJhdGlvKCkgeyByZXR1cm47IH1cbiAgLyoqIEBwcml2YXRlICovXG4gIGdldCBvZmZzZXQoKSB7IHJldHVybjsgfVxuICAvKiogQHByaXZhdGUgKi9cbiAgZ2V0IHN0YXJ0KCkgeyByZXR1cm47IH1cbiAgLyoqIEBwcml2YXRlICovXG4gIGdldCBkdXJhdGlvbigpIHsgcmV0dXJuOyB9XG5cblxuICAvKipcbiAgICogVGhlIGdlbmVyYXRvciB0aGF0IGNyZWF0ZXMgdGhlIGRhdGEgdG8gYmUgcmVuZGVyZWQgdG8gZGlzcGxheSB0aGUgYXhpcy5cbiAgICpcbiAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgKi9cbiAgc2V0IGdlbmVyYXRvcihmdW5jKSB7XG4gICAgdGhpcy5fZ2VuZXJhdG9yID0gZnVuYztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgZ2VuZXJhdG9yIHRoYXQgY3JlYXRlcyB0aGUgZGF0YSB0byBiZSByZW5kZXJlZCB0byBkaXNwbGF5IHRoZSBheGlzLlxuICAgKlxuICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAqL1xuICBnZXQgZ2VuZXJhdG9yKCkge1xuICAgIHJldHVybiB0aGlzLl9nZW5lcmF0b3I7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgaXMgdGhlIG1haW4gZGlmZmVyZW5jZSB3aXRoIGEgY2xhc3NpY2FsIGxheWVyLiBBbiBgQXhpc0xheWVyYFxuICAgKiBpbnN0YW5jZSBnZW5lcmF0ZXMgYW5kIG1haW50YWlucyBpdCdzIG93biBkYXRhLlxuICAgKi9cbiAgX2dlbmVyYXRlRGF0YSgpIHtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5fZ2VuZXJhdG9yKHRoaXMudGltZUNvbnRleHQpO1xuICAgIC8vIHByZXBlbmQgZmlyc3QgYXJndW1lbnRzIG9mIHNwbGljZSBmb3IgYW4gYXBwbHlcbiAgICBkYXRhLnVuc2hpZnQoMCwgdGhpcy5kYXRhWzBdLmxlbmd0aCk7XG4gICAgLy8gbWFrZSBzdXJlIHRvIGtlZXAgdGhlIHNhbWUgcmVmZXJlbmNlXG4gICAgQXJyYXkucHJvdG90eXBlLnNwbGljZS5hcHBseSh0aGlzLmRhdGFbMF0sIGRhdGEpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHJlbmRlcmluZyBjb250ZXh0IGZvciB0aGUgc2hhcGVzLlxuICAgKi9cbiAgX3VwZGF0ZVJlbmRlcmluZ0NvbnRleHQoKSB7XG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCA9IHRoaXMudGltZUNvbnRleHQudGltZVRvUGl4ZWw7XG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwgPSB0aGlzLl92YWx1ZVRvUGl4ZWw7XG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgLy8gdGhpcy5fcmVuZGVyaW5nQ29udGV4dC53aWR0aCAgPSB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMudGltZUNvbnRleHQuZHVyYXRpb24pO1xuXG4gICAgLy8gZm9yIGZvcmVpZ24gb2JqZWN0IGlzc3VlIGluIGNocm9tZVxuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQub2Zmc2V0WCA9IHRoaXMudGltZUNvbnRleHQudGltZVRvUGl4ZWwodGhpcy50aW1lQ29udGV4dC5vZmZzZXQpO1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudmlzaWJsZVdpZHRoID0gdGhpcy50aW1lQ29udGV4dC52aXNpYmxlV2lkdGg7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGVzIHRoZSBkYXRhIGFuZCB1cGRhdGUgdGhlIGxheWVyLlxuICAgKi9cbiAgdXBkYXRlKCkge1xuICAgIHRoaXMuX2dlbmVyYXRlRGF0YSgpO1xuICAgIHN1cGVyLnVwZGF0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgRE9NIGluIG1lbW9yeSBvbiBsYXllciBjcmVhdGlvbiB0byBiZSBhYmxlIHRvIHVzZSBpdCBiZWZvcmVcbiAgICogdGhlIGxheWVyIGlzIGFjdHVhbGx5IGluc2VydGVkIGluIHRoZSBET01cbiAgICovXG4gIF9yZW5kZXJDb250YWluZXIoKSB7XG4gICAgLy8gd3JhcHBlciBncm91cCBmb3IgYHN0YXJ0LCB0b3AgYW5kIGNvbnRleHQgZmxpcCBtYXRyaXhcbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICBpZiAodGhpcy5wYXJhbXMuY2xhc3NOYW1lICE9PSBudWxsKSB7XG4gICAgICB0aGlzLiRlbC5jbGFzc0xpc3QuYWRkKCdsYXllcicsIHRoaXMucGFyYW1zLmNsYXNzTmFtZSk7XG4gICAgfVxuXG4gICAgLy8gZ3JvdXAgdG8gYXBwbHkgb2Zmc2V0XG4gICAgdGhpcy4kb2Zmc2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIHRoaXMuJG9mZnNldC5jbGFzc0xpc3QuYWRkKCdvZmZzZXQnLCAnaXRlbXMnKTtcbiAgICAvLyBsYXllciBiYWNrZ3JvdW5kXG4gICAgdGhpcy4kYmFja2dyb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3JlY3QnKTtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLmNsYXNzTGlzdC5hZGQoJ2JhY2tncm91bmQnKTtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLnN0eWxlLmZpbGxPcGFjaXR5ID0gMDtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XG4gICAgLy8gY3JlYXRlIHRoZSBET00gdHJlZVxuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJG9mZnNldCk7XG4gICAgdGhpcy4kb2Zmc2V0LmFwcGVuZENoaWxkKHRoaXMuJGJhY2tncm91bmQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGxheW91dCBvZiB0aGUgbGF5ZXIuXG4gICAqL1xuICB1cGRhdGVDb250YWluZXIoKSB7XG4gICAgdGhpcy5fdXBkYXRlUmVuZGVyaW5nQ29udGV4dCgpO1xuXG4gICAgY29uc3QgdG9wID0gdGhpcy5wYXJhbXMudG9wO1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcbiAgICBjb25zdCBsZWZ0ID0gTWF0aC5tYXgoMCwgLXRoaXMuX3JlbmRlcmluZ0NvbnRleHQub2Zmc2V0WCk7XG4gICAgLy8gbWF0cml4IHRvIGludmVydCB0aGUgY29vcmRpbmF0ZSBzeXN0ZW1cbiAgICBjb25zdCB0cmFuc2xhdGVNYXRyaXggPSBgbWF0cml4KDEsIDAsIDAsIC0xLCAwLCAke3RvcCArIGhlaWdodH0pYDtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgdHJhbnNsYXRlTWF0cml4KTtcblxuICAgIC8vIGtlZXAgYmFja2dyb3VuZCBvbiB0aGUgdmlzaWJsZSBhcmVhXG4gICAgdGhpcy4kYmFja2dyb3VuZC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgaGVpZ2h0KTtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHRoaXMudGltZUNvbnRleHQudmlzaWJsZVdpZHRoKTtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZU5TKG51bGwsICd4JywgbGVmdCk7XG4gIH1cbn1cbiJdfQ==