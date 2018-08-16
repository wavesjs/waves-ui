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

var _Layer2 = require('../core/Layer');

var _Layer3 = _interopRequireDefault(_Layer2);

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
}(_Layer3.default);

exports.default = AxisLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF4aXNMYXllci5qcyJdLCJuYW1lcyI6WyJBeGlzTGF5ZXIiLCJnZW5lcmF0b3IiLCJvcHRpb25zIiwiX2dlbmVyYXRvciIsImRhdGEiLCJ0aW1lQ29udGV4dCIsInVuc2hpZnQiLCJsZW5ndGgiLCJBcnJheSIsInByb3RvdHlwZSIsInNwbGljZSIsImFwcGx5IiwiX3JlbmRlcmluZ0NvbnRleHQiLCJ0aW1lVG9QaXhlbCIsInZhbHVlVG9QaXhlbCIsIl92YWx1ZVRvUGl4ZWwiLCJoZWlnaHQiLCJwYXJhbXMiLCJvZmZzZXRYIiwib2Zmc2V0IiwidmlzaWJsZVdpZHRoIiwiX2dlbmVyYXRlRGF0YSIsIiRlbCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudE5TIiwiY2xhc3NOYW1lIiwiY2xhc3NMaXN0IiwiYWRkIiwiJG9mZnNldCIsIiRiYWNrZ3JvdW5kIiwic3R5bGUiLCJmaWxsT3BhY2l0eSIsInBvaW50ZXJFdmVudHMiLCJhcHBlbmRDaGlsZCIsIl91cGRhdGVSZW5kZXJpbmdDb250ZXh0IiwidG9wIiwibGVmdCIsIk1hdGgiLCJtYXgiLCJ0cmFuc2xhdGVNYXRyaXgiLCJzZXRBdHRyaWJ1dGVOUyIsInZhbHVlIiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBR0E7Ozs7Ozs7Ozs7O0lBV01BLFM7OztBQUNKOzs7OztBQUtBLHFCQUFZQyxTQUFaLEVBQXVCQyxPQUF2QixFQUFnQztBQUFBOztBQUFBLDRJQUN4QixRQUR3QixFQUNkLEVBRGMsRUFDVkEsT0FEVTs7QUFFOUIsVUFBS0MsVUFBTCxHQUFrQkYsU0FBbEI7QUFGOEI7QUFHL0I7O0FBRUQ7Ozs7Ozs7QUFvQ0E7Ozs7b0NBSWdCO0FBQ2QsVUFBTUcsT0FBTyxLQUFLRCxVQUFMLENBQWdCLEtBQUtFLFdBQXJCLENBQWI7QUFDQTtBQUNBRCxXQUFLRSxPQUFMLENBQWEsQ0FBYixFQUFnQixLQUFLRixJQUFMLENBQVUs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Qjs7d0JBT2E7QUFBRTtBQUFTO0FBQ3hCOzs7O3NCQVBVQSxLLEVBQU87QUFBRTtBQUFTO0FBQzVCOzt3QkFPWTtBQUFFO0FBQVM7QUFDdkI7Ozs7c0JBUGFBLEssRUFBTztBQUFFO0FBQVMsSzt3QkFRaEI7QUFBRTtBQUFTOztBQUcxQjs7Ozs7Ozs7c0JBS2NDLEksRUFBTTtBQUNsQixXQUFLdkMsVUFBTCxHQUFrQnVDLElBQWxCO0FBQ0Q7O0FBRUQ7Ozs7Ozt3QkFLZ0I7QUFDZCxhQUFPLEtBQUt2QyxVQUFaO0FBQ0Q7Ozs7O2tCQWdGWUgsUyIsImZpbGUiOiJBeGlzTGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbnMgZnJvbSAnLi4vY29yZS9uYW1lc3BhY2UnO1xuaW1wb3J0IExheWVyIGZyb20gJy4uL2NvcmUvTGF5ZXInO1xuXG5cbi8qKlxuICogU2ltcGxpZmllZCBMYXllciBmb3IgQXhpcy4gVGhlIG1haW4gZGlmZmVyZW5jZSB3aXRoIGEgcmVndWxhciBsYXllciBpcyB0aGF0XG4gKiBhbiBheGlzIGxheWVyIHVzZSB0aGUgYFRpbWVsaW5lfnRpbWVDb250ZXh0YCBhdHRyaWJ1dGVzIHRvIHJlbmRlciBpdCdzIGxheW91dFxuICogYW5kIHN0YXkgc3luY2hyb25pemVkIHdpdGggdGhlIHRyYWNrcyB2aXNpYmxlIGFyZWEuIEFsbCBnZXR0ZXJzIGFuZCBzZXR0ZXJzXG4gKiB0byB0aGUgYFRpbWVsaW5lVGltZUNvbnRleHRgIGF0dHJpYnV0ZXMgYXJlIGJ5cGFzc2VkLlxuICpcbiAqIEl0IGFsc28gaGFuZGxlIGl0J3Mgb3duIGRhdGEgYW5kIGl0cyB1cGRhdGVzLiBUaGUgYF9nZW5lcmF0ZURhdGFgIG1ldGhvZCBpc1xuICogcmVzcG9uc2libGUgdG8gY3JlYXRlIHNvbWUgdXNlZnVsbCBkYXRhIHRvIHZpc3VhbGl6ZVxuICpcbiAqIFtleGFtcGxlIHVzYWdlIG9mIHRoZSBsYXllci1heGlzXSguL2V4YW1wbGVzL2xheWVyLWF4aXMuaHRtbClcbiAqL1xuY2xhc3MgQXhpc0xheWVyIGV4dGVuZHMgTGF5ZXIge1xuICAvKipcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZ2VuZXJhdG9yIC0gQSBmdW5jdGlvbiB0byBjcmVhdGUgZGF0YSBhY2NvcmRpbmcgdG9cbiAgICogICAgdGhlIGBUaW1lbGluZX50aW1lQ29udGV4dGAuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gTGF5ZXIgb3B0aW9ucywgY2YuIExheWVyIGZvciBhdmFpbGFibGUgb3B0aW9ucy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGdlbmVyYXRvciwgb3B0aW9ucykge1xuICAgIHN1cGVyKCdlbnRpdHknLCBbXSwgb3B0aW9ucyk7XG4gICAgdGhpcy5fZ2VuZXJhdG9yID0gZ2VuZXJhdG9yO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHNldCBzdHJldGNoUmF0aW8odmFsdWUpIHsgcmV0dXJuOyB9XG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzZXQgb2Zmc2V0KHZhbHVlKSB7IHJldHVybjsgfVxuICAvKiogQHByaXZhdGUgKi9cbiAgc2V0IHN0YXJ0KHZhbHVlKSB7IHJldHVybjsgfVxuICAvKiogQHByaXZhdGUgKi9cbiAgc2V0IGR1cmF0aW9uKHZhbHVlKSB7IHJldHVybjsgfVxuICAvKiogQHByaXZhdGUgKi9cbiAgZ2V0IHN0cmV0Y2hSYXRpbygpIHsgcmV0dXJuOyB9XG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBnZXQgb2Zmc2V0KCkgeyByZXR1cm47IH1cbiAgLyoqIEBwcml2YXRlICovXG4gIGdldCBzdGFydCgpIHsgcmV0dXJuOyB9XG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBnZXQgZHVyYXRpb24oKSB7IHJldHVybjsgfVxuXG5cbiAgLyoqXG4gICAqIFRoZSBnZW5lcmF0b3IgdGhhdCBjcmVhdGVzIHRoZSBkYXRhIHRvIGJlIHJlbmRlcmVkIHRvIGRpc3BsYXkgdGhlIGF4aXMuXG4gICAqXG4gICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICovXG4gIHNldCBnZW5lcmF0b3IoZnVuYykge1xuICAgIHRoaXMuX2dlbmVyYXRvciA9IGZ1bmM7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGdlbmVyYXRvciB0aGF0IGNyZWF0ZXMgdGhlIGRhdGEgdG8gYmUgcmVuZGVyZWQgdG8gZGlzcGxheSB0aGUgYXhpcy5cbiAgICpcbiAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgKi9cbiAgZ2V0IGdlbmVyYXRvcigpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2VuZXJhdG9yO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGlzIHRoZSBtYWluIGRpZmZlcmVuY2Ugd2l0aCBhIGNsYXNzaWNhbCBsYXllci4gQW4gYEF4aXNMYXllcmBcbiAgICogaW5zdGFuY2UgZ2VuZXJhdGVzIGFuZCBtYWludGFpbnMgaXQncyBvd24gZGF0YS5cbiAgICovXG4gIF9nZW5lcmF0ZURhdGEoKSB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuX2dlbmVyYXRvcih0aGlzLnRpbWVDb250ZXh0KTtcbiAgICAvLyBwcmVwZW5kIGZpcnN0IGFyZ3VtZW50cyBvZiBzcGxpY2UgZm9yIGFuIGFwcGx5XG4gICAgZGF0YS51bnNoaWZ0KDAsIHRoaXMuZGF0YVswXS5sZW5ndGgpO1xuICAgIC8vIG1ha2Ugc3VyZSB0byBrZWVwIHRoZSBzYW1lIHJlZmVyZW5jZVxuICAgIEFycmF5LnByb3RvdHlwZS5zcGxpY2UuYXBwbHkodGhpcy5kYXRhWzBdLCBkYXRhKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSByZW5kZXJpbmcgY29udGV4dCBmb3IgdGhlIHNoYXBlcy5cbiAgICovXG4gIF91cGRhdGVSZW5kZXJpbmdDb250ZXh0KCkge1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwgPSB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsO1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsID0gdGhpcy5fdmFsdWVUb1BpeGVsO1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQuaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuICAgIC8vIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQud2lkdGggID0gdGhpcy50aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLnRpbWVDb250ZXh0LmR1cmF0aW9uKTtcblxuICAgIC8vIGZvciBmb3JlaWduIG9iamVjdCBpc3N1ZSBpbiBjaHJvbWVcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0Lm9mZnNldFggPSB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMudGltZUNvbnRleHQub2Zmc2V0KTtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnZpc2libGVXaWR0aCA9IHRoaXMudGltZUNvbnRleHQudmlzaWJsZVdpZHRoO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyB0aGUgZGF0YSBhbmQgdXBkYXRlIHRoZSBsYXllci5cbiAgICovXG4gIHVwZGF0ZSgpIHtcbiAgICB0aGlzLl9nZW5lcmF0ZURhdGEoKTtcbiAgICBzdXBlci51cGRhdGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIERPTSBpbiBtZW1vcnkgb24gbGF5ZXIgY3JlYXRpb24gdG8gYmUgYWJsZSB0byB1c2UgaXQgYmVmb3JlXG4gICAqIHRoZSBsYXllciBpcyBhY3R1YWxseSBpbnNlcnRlZCBpbiB0aGUgRE9NXG4gICAqL1xuICBfcmVuZGVyQ29udGFpbmVyKCkge1xuICAgIC8vIHdyYXBwZXIgZ3JvdXAgZm9yIGBzdGFydCwgdG9wIGFuZCBjb250ZXh0IGZsaXAgbWF0cml4XG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgaWYgKHRoaXMucGFyYW1zLmNsYXNzTmFtZSAhPT0gbnVsbCkge1xuICAgICAgdGhpcy4kZWwuY2xhc3NMaXN0LmFkZCgnbGF5ZXInLCB0aGlzLnBhcmFtcy5jbGFzc05hbWUpO1xuICAgIH1cblxuICAgIC8vIGdyb3VwIHRvIGFwcGx5IG9mZnNldFxuICAgIHRoaXMuJG9mZnNldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICB0aGlzLiRvZmZzZXQuY2xhc3NMaXN0LmFkZCgnb2Zmc2V0JywgJ2l0ZW1zJyk7XG4gICAgLy8gbGF5ZXIgYmFja2dyb3VuZFxuICAgIHRoaXMuJGJhY2tncm91bmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdyZWN0Jyk7XG4gICAgdGhpcy4kYmFja2dyb3VuZC5jbGFzc0xpc3QuYWRkKCdiYWNrZ3JvdW5kJyk7XG4gICAgdGhpcy4kYmFja2dyb3VuZC5zdHlsZS5maWxsT3BhY2l0eSA9IDA7XG4gICAgdGhpcy4kYmFja2dyb3VuZC5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xuICAgIC8vIGNyZWF0ZSB0aGUgRE9NIHRyZWVcbiAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRvZmZzZXQpO1xuICAgIHRoaXMuJG9mZnNldC5hcHBlbmRDaGlsZCh0aGlzLiRiYWNrZ3JvdW5kKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBsYXlvdXQgb2YgdGhlIGxheWVyLlxuICAgKi9cbiAgdXBkYXRlQ29udGFpbmVyKCkge1xuICAgIHRoaXMuX3VwZGF0ZVJlbmRlcmluZ0NvbnRleHQoKTtcblxuICAgIGNvbnN0IHRvcCA9IHRoaXMucGFyYW1zLnRvcDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgY29uc3QgbGVmdCA9IE1hdGgubWF4KDAsIC10aGlzLl9yZW5kZXJpbmdDb250ZXh0Lm9mZnNldFgpO1xuICAgIC8vIG1hdHJpeCB0byBpbnZlcnQgdGhlIGNvb3JkaW5hdGUgc3lzdGVtXG4gICAgY29uc3QgdHJhbnNsYXRlTWF0cml4ID0gYG1hdHJpeCgxLCAwLCAwLCAtMSwgMCwgJHt0b3AgKyBoZWlnaHR9KWA7XG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIHRyYW5zbGF0ZU1hdHJpeCk7XG5cbiAgICAvLyBrZWVwIGJhY2tncm91bmQgb24gdGhlIHZpc2libGUgYXJlYVxuICAgIHRoaXMuJGJhY2tncm91bmQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgdGhpcy4kYmFja2dyb3VuZC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB0aGlzLnRpbWVDb250ZXh0LnZpc2libGVXaWR0aCk7XG4gICAgdGhpcy4kYmFja2dyb3VuZC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneCcsIGxlZnQpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEF4aXNMYXllcjtcbiJdfQ==