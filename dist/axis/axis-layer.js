'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreNamespace = require('../core/namespace');

var _coreNamespace2 = _interopRequireDefault(_coreNamespace);

var _coreLayer = require('../core/layer');

var _coreLayer2 = _interopRequireDefault(_coreLayer);

/**
 * Simplified Layer for Axis. The main difference with a regular layer is that
 * an axis layer use the `Timeline~timeContext` attributes to render it's layout
 * and stay synchronized with the tracks visible area. All getters and setters
 * to the `TimelineTimeContext` attributes are bypassed.
 *
 * It also handle it's own data and its updates. The `_generateData` method is
 * responsible to create some usefull data to visualize
 *
 * [example usage for the layer-axis](../../../examples/layer-axis.html)
 */

var AxisLayer = (function (_Layer) {
  _inherits(AxisLayer, _Layer);

  /**
   * @param {Function} generator - A function to create data according to
   *    the `Timeline~timeContext`.
   * @param {Object} options - Layer options, cf. Layer for available options.
   */

  function AxisLayer(generator, options) {
    _classCallCheck(this, AxisLayer);

    _get(Object.getPrototypeOf(AxisLayer.prototype), 'constructor', this).call(this, 'entity', [], options);
    this._generator = generator;
  }

  // can't access timeContext from outside

  _createClass(AxisLayer, [{
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
      this._renderingContext.width = this.timeContext.timeToPixel(this.timeContext.duration);

      // for foreign object issue in chrome
      this._renderingContext.offsetX = this.timeContext.timeToPixel(this.timeContext.offset);

      // expose some timeline attributes - allow to improve perf in some cases - cf. Waveform
      this._renderingContext.trackOffsetX = this.timeContext.timeToPixel(this.timeContext.offset);
      this._renderingContext.visibleWidth = this.timeContext.visibleWidth;
    }
  }, {
    key: 'render',
    value: function render() {
      _get(Object.getPrototypeOf(AxisLayer.prototype), 'render', this).call(this);
    }
  }, {
    key: 'update',
    value: function update() {
      this._generateData();
      _get(Object.getPrototypeOf(AxisLayer.prototype), 'update', this).call(this);
    }

    /**
     * Render the DOM in memory on layer creation to be able to use it before
     * the layer is actually inserted in the DOM
     */
  }, {
    key: '_renderContainer',
    value: function _renderContainer() {
      // wrapper group for `start, top and context flip matrix
      this.$el = document.createElementNS(_coreNamespace2['default'], 'g');
      if (this.params.className !== null) {
        this.$el.classList.add('layer', this.params.className);
      }

      // group to apply offset
      this.$offset = document.createElementNS(_coreNamespace2['default'], 'g');
      this.$offset.classList.add('offset', 'items');
      // layer background
      this.$background = document.createElementNS(_coreNamespace2['default'], 'rect');
      this.$background.setAttributeNS(null, 'height', '100%');
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
      // matrix to invert the coordinate system
      var translateMatrix = 'matrix(1, 0, 0, -1, 0, ' + (top + height) + ')';
      this.$el.setAttributeNS(null, 'transform', translateMatrix);

      this.$background.setAttributeNS(null, 'width', height);
    }
  }, {
    key: 'stretchRatio',
    set: function set(value) {
      return;
    },
    get: function get() {
      return;
    }
  }, {
    key: 'offset',
    set: function set(value) {
      return;
    },
    get: function get() {
      return;
    }
  }, {
    key: 'start',
    set: function set(value) {
      return;
    },
    get: function get() {
      return;
    }
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
    },

    /**
     * The generator that creates the data to be rendered to display the axis.
     *
     * @type {Function}
     */
    get: function get() {
      return this._generator;
    }
  }]);

  return AxisLayer;
})(_coreLayer2['default']);

exports['default'] = AxisLayer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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RztBQUFFLGFBQU87S0FBRTs7Ozs7Ozs7O1NBUWIsYUFBQyxJQUFJLEVBQUU7QUFDbEIsVUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7S0FDeEI7Ozs7Ozs7U0FPWSxlQUFHO0FBQ2QsYUFBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0tBQ3hCOzs7U0F0Q2tCLFNBQVM7OztxQkFBVCxTQUFTIiwiZmlsZSI6InNyYy93YXZlcy11aS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBucyBmcm9tICcuLi9jb3JlL25hbWVzcGFjZSc7XG5pbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5cblxuLyoqXG4gKiBTaW1wbGlmaWVkIExheWVyIGZvciBBeGlzLiBUaGUgbWFpbiBkaWZmZXJlbmNlIHdpdGggYSByZWd1bGFyIGxheWVyIGlzIHRoYXRcbiAqIGFuIGF4aXMgbGF5ZXIgdXNlIHRoZSBgVGltZWxpbmV+dGltZUNvbnRleHRgIGF0dHJpYnV0ZXMgdG8gcmVuZGVyIGl0J3MgbGF5b3V0XG4gKiBhbmQgc3RheSBzeW5jaHJvbml6ZWQgd2l0aCB0aGUgdHJhY2tzIHZpc2libGUgYXJlYS4gQWxsIGdldHRlcnMgYW5kIHNldHRlcnNcbiAqIHRvIHRoZSBgVGltZWxpbmVUaW1lQ29udGV4dGAgYXR0cmlidXRlcyBhcmUgYnlwYXNzZWQuXG4gKlxuICogSXQgYWxzbyBoYW5kbGUgaXQncyBvd24gZGF0YSBhbmQgaXRzIHVwZGF0ZXMuIFRoZSBgX2dlbmVyYXRlRGF0YWAgbWV0aG9kIGlzXG4gKiByZXNwb25zaWJsZSB0byBjcmVhdGUgc29tZSB1c2VmdWxsIGRhdGEgdG8gdmlzdWFsaXplXG4gKlxuICogW2V4YW1wbGUgdXNhZ2UgZm9yIHRoZSBsYXllci1heGlzXSguLi8uLi8uLi9leGFtcGxlcy9sYXllci1heGlzLmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF4aXNMYXllciBleHRlbmRzIExheWVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGdlbmVyYXRvciAtIEEgZnVuY3Rpb24gdG8gY3JlYXRlIGRhdGEgYWNjb3JkaW5nIHRvXG4gICAqICAgIHRoZSBgVGltZWxpbmV+dGltZUNvbnRleHRgLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIExheWVyIG9wdGlvbnMsIGNmLiBMYXllciBmb3IgYXZhaWxhYmxlIG9wdGlvbnMuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihnZW5lcmF0b3IsIG9wdGlvbnMpIHtcbiAgICBzdXBlcignZW50aXR5JywgW10sIG9wdGlvbnMpO1xuICAgIHRoaXMuX2dlbmVyYXRvciA9IGdlbmVyYXRvcjtcbiAgfVxuXG4gIC8vIGNhbid0IGFjY2VzcyB0aW1lQ29udGV4dCBmcm9tIG91dHNpZGVcbiAgc2V0IHN0cmV0Y2hSYXRpbyh2YWx1ZSkgeyByZXR1cm47IH1cbiAgc2V0IG9mZnNldCh2YWx1ZSkgeyByZXR1cm47IH1cbiAgc2V0IHN0YXJ0KHZhbHVlKSB7IHJldHVybjsgfVxuICBzZXQgZHVyYXRpb24odmFsdWUpIHsgcmV0dXJuOyB9XG4gIGdldCBzdHJldGNoUmF0aW8oKSB7IHJldHVybjsgfVxuICBnZXQgb2Zmc2V0KCkgeyByZXR1cm47IH1cbiAgZ2V0IHN0YXJ0KCkgeyByZXR1cm47IH1cbiAgZ2V0IGR1cmF0aW9uKCkgeyByZXR1cm47IH1cblxuXG4gIC8qKlxuICAgKiBUaGUgZ2VuZXJhdG9yIHRoYXQgY3JlYXRlcyB0aGUgZGF0YSB0byBiZSByZW5kZXJlZCB0byBkaXNwbGF5IHRoZSBheGlzLlxuICAgKlxuICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAqL1xuICBzZXQgZ2VuZXJhdG9yKGZ1bmMpIHtcbiAgICB0aGlzLl9nZW5lcmF0b3IgPSBmdW5jO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBnZW5lcmF0b3IgdGhhdCBjcmVhdGVzIHRoZSBkYXRhIHRvIGJlIHJlbmRlcmVkIHRvIGRpc3BsYXkgdGhlIGF4aXMuXG4gICAqXG4gICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICovXG4gIGdldCBnZW5lcmF0b3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dlbmVyYXRvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBpcyB0aGUgbWFpbiBkaWZmZXJlbmNlIHdpdGggYSBjbGFzc2ljYWwgbGF5ZXIuIEFuIGBBeGlzTGF5ZXJgXG4gICAqIGluc3RhbmNlIGdlbmVyYXRlcyBhbmQgbWFpbnRhaW5zIGl0J3Mgb3duIGRhdGEuXG4gICAqL1xuICBfZ2VuZXJhdGVEYXRhKCkge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLl9nZW5lcmF0b3IodGhpcy50aW1lQ29udGV4dCk7XG4gICAgLy8gcHJlcGVuZCBmaXJzdCBhcmd1bWVudHMgb2Ygc3BsaWNlIGZvciBhbiBhcHBseVxuICAgIGRhdGEudW5zaGlmdCgwLCB0aGlzLmRhdGFbMF0ubGVuZ3RoKTtcbiAgICAvLyBtYWtlIHN1cmUgdG8ga2VlcCB0aGUgc2FtZSByZWZlcmVuY2VcbiAgICBBcnJheS5wcm90b3R5cGUuc3BsaWNlLmFwcGx5KHRoaXMuZGF0YVswXSwgZGF0YSk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgcmVuZGVyaW5nIGNvbnRleHQgZm9yIHRoZSBzaGFwZXMuXG4gICAqL1xuICBfdXBkYXRlUmVuZGVyaW5nQ29udGV4dCgpIHtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsID0gdGhpcy50aW1lQ29udGV4dC50aW1lVG9QaXhlbDtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCA9IHRoaXMuX3ZhbHVlVG9QaXhlbDtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LmhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LndpZHRoICA9IHRoaXMudGltZUNvbnRleHQudGltZVRvUGl4ZWwodGhpcy50aW1lQ29udGV4dC5kdXJhdGlvbik7XG5cbiAgICAvLyBmb3IgZm9yZWlnbiBvYmplY3QgaXNzdWUgaW4gY2hyb21lXG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC5vZmZzZXRYID0gdGhpcy50aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLnRpbWVDb250ZXh0Lm9mZnNldCk7XG5cbiAgICAvLyBleHBvc2Ugc29tZSB0aW1lbGluZSBhdHRyaWJ1dGVzIC0gYWxsb3cgdG8gaW1wcm92ZSBwZXJmIGluIHNvbWUgY2FzZXMgLSBjZi4gV2F2ZWZvcm1cbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnRyYWNrT2Zmc2V0WCA9IHRoaXMudGltZUNvbnRleHQudGltZVRvUGl4ZWwodGhpcy50aW1lQ29udGV4dC5vZmZzZXQpO1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudmlzaWJsZVdpZHRoID0gdGhpcy50aW1lQ29udGV4dC52aXNpYmxlV2lkdGg7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgc3VwZXIucmVuZGVyKCk7XG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgdGhpcy5fZ2VuZXJhdGVEYXRhKCk7XG4gICAgc3VwZXIudXBkYXRlKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSBET00gaW4gbWVtb3J5IG9uIGxheWVyIGNyZWF0aW9uIHRvIGJlIGFibGUgdG8gdXNlIGl0IGJlZm9yZVxuICAgKiB0aGUgbGF5ZXIgaXMgYWN0dWFsbHkgaW5zZXJ0ZWQgaW4gdGhlIERPTVxuICAgKi9cbiAgX3JlbmRlckNvbnRhaW5lcigpIHtcbiAgICAvLyB3cmFwcGVyIGdyb3VwIGZvciBgc3RhcnQsIHRvcCBhbmQgY29udGV4dCBmbGlwIG1hdHJpeFxuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIGlmICh0aGlzLnBhcmFtcy5jbGFzc05hbWUgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuJGVsLmNsYXNzTGlzdC5hZGQoJ2xheWVyJywgdGhpcy5wYXJhbXMuY2xhc3NOYW1lKTtcbiAgICB9XG5cbiAgICAvLyBncm91cCB0byBhcHBseSBvZmZzZXRcbiAgICB0aGlzLiRvZmZzZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgdGhpcy4kb2Zmc2V0LmNsYXNzTGlzdC5hZGQoJ29mZnNldCcsICdpdGVtcycpO1xuICAgIC8vIGxheWVyIGJhY2tncm91bmRcbiAgICB0aGlzLiRiYWNrZ3JvdW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAncmVjdCcpO1xuICAgIHRoaXMuJGJhY2tncm91bmQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsICcxMDAlJyk7XG4gICAgdGhpcy4kYmFja2dyb3VuZC5jbGFzc0xpc3QuYWRkKCdiYWNrZ3JvdW5kJyk7XG4gICAgdGhpcy4kYmFja2dyb3VuZC5zdHlsZS5maWxsT3BhY2l0eSA9IDA7XG4gICAgdGhpcy4kYmFja2dyb3VuZC5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xuICAgIC8vIGNyZWF0ZSB0aGUgRE9NIHRyZWVcbiAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRvZmZzZXQpO1xuICAgIHRoaXMuJG9mZnNldC5hcHBlbmRDaGlsZCh0aGlzLiRiYWNrZ3JvdW5kKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBsYXlvdXQgb2YgdGhlIGxheWVyLlxuICAgKi9cbiAgdXBkYXRlQ29udGFpbmVyKCkge1xuICAgIHRoaXMuX3VwZGF0ZVJlbmRlcmluZ0NvbnRleHQoKTtcblxuICAgIGNvbnN0IHRvcCAgICA9IHRoaXMucGFyYW1zLnRvcDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgLy8gbWF0cml4IHRvIGludmVydCB0aGUgY29vcmRpbmF0ZSBzeXN0ZW1cbiAgICBjb25zdCB0cmFuc2xhdGVNYXRyaXggPSBgbWF0cml4KDEsIDAsIDAsIC0xLCAwLCAke3RvcCArIGhlaWdodH0pYDtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgdHJhbnNsYXRlTWF0cml4KTtcblxuICAgIHRoaXMuJGJhY2tncm91bmQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgaGVpZ2h0KTtcbiAgfVxufVxuIl19