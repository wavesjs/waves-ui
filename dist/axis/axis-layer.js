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
 * [example usage for the layer-axis](./examples/layer-axis.html)
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

    /** @type {Element} */
    this.$el = null;
    /** @type {Element} */
    this.$offset = null;
    /** @type {Element} */
    this.$background = null;
  }

  /** @private */

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

    /**
     * Generates the data and update the layer.
     */
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

    /** @private */

    /** @private */
    get: function get() {
      return;
    }

    /** @private */
  }, {
    key: 'offset',
    set: function set(value) {
      return;
    },

    /** @private */
    get: function get() {
      return;
    }

    /** @private */
  }, {
    key: 'start',
    set: function set(value) {
      return;
    },

    /** @private */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9heGlzL2F4aXMtbGF5ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs2QkFBZSxtQkFBbUI7Ozs7eUJBQ2hCLGVBQWU7Ozs7Ozs7Ozs7Ozs7Ozs7SUFjWixTQUFTO1lBQVQsU0FBUzs7Ozs7Ozs7QUFNakIsV0FOUSxTQUFTLENBTWhCLFNBQVMsRUFBRSxPQUFPLEVBQUU7MEJBTmIsU0FBUzs7QUFPMUIsK0JBUGlCLFNBQVMsNkNBT3BCLFFBQVEsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFO0FBQzdCLFFBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDOzs7QUFHNUIsUUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7O0FBRWhCLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDOztBQUVwQixRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztHQUN6Qjs7OztlQWhCa0IsU0FBUzs7Ozs7OztXQTBEZix5QkFBRztBQUNkLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUUvQyxVQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUVyQyxXQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUNsRDs7Ozs7OztXQUtzQixtQ0FBRztBQUN4QixVQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDO0FBQ2xFLFVBQUksQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztBQUN6RCxVQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ25ELFVBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEdBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7O0FBR3hGLFVBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7O0FBR3ZGLFVBQUksQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM1RixVQUFJLENBQUMsaUJBQWlCLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDO0tBQ3JFOzs7Ozs7O1dBS0ssa0JBQUc7QUFDUCxVQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7QUFDckIsaUNBeEZpQixTQUFTLHdDQXdGWDtLQUNoQjs7Ozs7Ozs7V0FNZSw0QkFBRzs7QUFFakIsVUFBSSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsZUFBZSw2QkFBSyxHQUFHLENBQUMsQ0FBQztBQUM3QyxVQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxLQUFLLElBQUksRUFBRTtBQUNsQyxZQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7T0FDeEQ7OztBQUdELFVBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGVBQWUsNkJBQUssR0FBRyxDQUFDLENBQUM7QUFDakQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFOUMsVUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsZUFBZSw2QkFBSyxNQUFNLENBQUMsQ0FBQztBQUN4RCxVQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3hELFVBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUM3QyxVQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZDLFVBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUM7O0FBRTlDLFVBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNuQyxVQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7S0FDNUM7Ozs7Ozs7V0FLYywyQkFBRztBQUNoQixVQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQzs7QUFFL0IsVUFBTSxHQUFHLEdBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7QUFDL0IsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7O0FBRWxDLFVBQU0sZUFBZSxnQ0FBNkIsR0FBRyxHQUFHLE1BQU0sQ0FBQSxNQUFHLENBQUM7QUFDbEUsVUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxlQUFlLENBQUMsQ0FBQzs7QUFFNUQsVUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztLQUN4RDs7O1NBOUdlLGFBQUMsS0FBSyxFQUFFO0FBQUUsYUFBTztLQUFFOzs7OztTQVFuQixlQUFHO0FBQUUsYUFBTztLQUFFOzs7OztTQU5wQixhQUFDLEtBQUssRUFBRTtBQUFFLGFBQU87S0FBRTs7O1NBUW5CLGVBQUc7QUFBRSxhQUFPO0tBQUU7Ozs7O1NBTmYsYUFBQyxLQUFLLEVBQUU7QUFBRSxhQUFPO0tBQUU7OztTQVFuQixlQUFHO0FBQUUsYUFBTztLQUFFOzs7OztTQU5YLGFBQUMsS0FBSyxFQUFFO0FBQUUsYUFBTztLQUFFO1NBUW5CLGVBQUc7QUFBRSxhQUFPO0tBQUU7Ozs7Ozs7OztTQVFiLGFBQUMsSUFBSSxFQUFFO0FBQ2xCLFVBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0tBQ3hCOzs7Ozs7O1NBT1ksZUFBRztBQUNkLGFBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztLQUN4Qjs7O1NBcERrQixTQUFTOzs7cUJBQVQsU0FBUyIsImZpbGUiOiJzcmMvYXhpcy9heGlzLWxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG5zIGZyb20gJy4uL2NvcmUvbmFtZXNwYWNlJztcbmltcG9ydCBMYXllciBmcm9tICcuLi9jb3JlL2xheWVyJztcblxuXG4vKipcbiAqIFNpbXBsaWZpZWQgTGF5ZXIgZm9yIEF4aXMuIFRoZSBtYWluIGRpZmZlcmVuY2Ugd2l0aCBhIHJlZ3VsYXIgbGF5ZXIgaXMgdGhhdFxuICogYW4gYXhpcyBsYXllciB1c2UgdGhlIGBUaW1lbGluZX50aW1lQ29udGV4dGAgYXR0cmlidXRlcyB0byByZW5kZXIgaXQncyBsYXlvdXRcbiAqIGFuZCBzdGF5IHN5bmNocm9uaXplZCB3aXRoIHRoZSB0cmFja3MgdmlzaWJsZSBhcmVhLiBBbGwgZ2V0dGVycyBhbmQgc2V0dGVyc1xuICogdG8gdGhlIGBUaW1lbGluZVRpbWVDb250ZXh0YCBhdHRyaWJ1dGVzIGFyZSBieXBhc3NlZC5cbiAqXG4gKiBJdCBhbHNvIGhhbmRsZSBpdCdzIG93biBkYXRhIGFuZCBpdHMgdXBkYXRlcy4gVGhlIGBfZ2VuZXJhdGVEYXRhYCBtZXRob2QgaXNcbiAqIHJlc3BvbnNpYmxlIHRvIGNyZWF0ZSBzb21lIHVzZWZ1bGwgZGF0YSB0byB2aXN1YWxpemVcbiAqXG4gKiBbZXhhbXBsZSB1c2FnZSBmb3IgdGhlIGxheWVyLWF4aXNdKC4vZXhhbXBsZXMvbGF5ZXItYXhpcy5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBeGlzTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBnZW5lcmF0b3IgLSBBIGZ1bmN0aW9uIHRvIGNyZWF0ZSBkYXRhIGFjY29yZGluZyB0b1xuICAgKiAgICB0aGUgYFRpbWVsaW5lfnRpbWVDb250ZXh0YC5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBMYXllciBvcHRpb25zLCBjZi4gTGF5ZXIgZm9yIGF2YWlsYWJsZSBvcHRpb25zLlxuICAgKi9cbiAgY29uc3RydWN0b3IoZ2VuZXJhdG9yLCBvcHRpb25zKSB7XG4gICAgc3VwZXIoJ2VudGl0eScsIFtdLCBvcHRpb25zKTtcbiAgICB0aGlzLl9nZW5lcmF0b3IgPSBnZW5lcmF0b3I7XG5cbiAgICAvKiogQHR5cGUge0VsZW1lbnR9ICovXG4gICAgdGhpcy4kZWwgPSBudWxsO1xuICAgIC8qKiBAdHlwZSB7RWxlbWVudH0gKi9cbiAgICB0aGlzLiRvZmZzZXQgPSBudWxsO1xuICAgIC8qKiBAdHlwZSB7RWxlbWVudH0gKi9cbiAgICB0aGlzLiRiYWNrZ3JvdW5kID0gbnVsbDtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzZXQgc3RyZXRjaFJhdGlvKHZhbHVlKSB7IHJldHVybjsgfVxuICAvKiogQHByaXZhdGUgKi9cbiAgc2V0IG9mZnNldCh2YWx1ZSkgeyByZXR1cm47IH1cbiAgLyoqIEBwcml2YXRlICovXG4gIHNldCBzdGFydCh2YWx1ZSkgeyByZXR1cm47IH1cbiAgLyoqIEBwcml2YXRlICovXG4gIHNldCBkdXJhdGlvbih2YWx1ZSkgeyByZXR1cm47IH1cbiAgLyoqIEBwcml2YXRlICovXG4gIGdldCBzdHJldGNoUmF0aW8oKSB7IHJldHVybjsgfVxuICAvKiogQHByaXZhdGUgKi9cbiAgZ2V0IG9mZnNldCgpIHsgcmV0dXJuOyB9XG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBnZXQgc3RhcnQoKSB7IHJldHVybjsgfVxuICAvKiogQHByaXZhdGUgKi9cbiAgZ2V0IGR1cmF0aW9uKCkgeyByZXR1cm47IH1cblxuXG4gIC8qKlxuICAgKiBUaGUgZ2VuZXJhdG9yIHRoYXQgY3JlYXRlcyB0aGUgZGF0YSB0byBiZSByZW5kZXJlZCB0byBkaXNwbGF5IHRoZSBheGlzLlxuICAgKlxuICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAqL1xuICBzZXQgZ2VuZXJhdG9yKGZ1bmMpIHtcbiAgICB0aGlzLl9nZW5lcmF0b3IgPSBmdW5jO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBnZW5lcmF0b3IgdGhhdCBjcmVhdGVzIHRoZSBkYXRhIHRvIGJlIHJlbmRlcmVkIHRvIGRpc3BsYXkgdGhlIGF4aXMuXG4gICAqXG4gICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICovXG4gIGdldCBnZW5lcmF0b3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dlbmVyYXRvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBpcyB0aGUgbWFpbiBkaWZmZXJlbmNlIHdpdGggYSBjbGFzc2ljYWwgbGF5ZXIuIEFuIGBBeGlzTGF5ZXJgXG4gICAqIGluc3RhbmNlIGdlbmVyYXRlcyBhbmQgbWFpbnRhaW5zIGl0J3Mgb3duIGRhdGEuXG4gICAqL1xuICBfZ2VuZXJhdGVEYXRhKCkge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLl9nZW5lcmF0b3IodGhpcy50aW1lQ29udGV4dCk7XG4gICAgLy8gcHJlcGVuZCBmaXJzdCBhcmd1bWVudHMgb2Ygc3BsaWNlIGZvciBhbiBhcHBseVxuICAgIGRhdGEudW5zaGlmdCgwLCB0aGlzLmRhdGFbMF0ubGVuZ3RoKTtcbiAgICAvLyBtYWtlIHN1cmUgdG8ga2VlcCB0aGUgc2FtZSByZWZlcmVuY2VcbiAgICBBcnJheS5wcm90b3R5cGUuc3BsaWNlLmFwcGx5KHRoaXMuZGF0YVswXSwgZGF0YSk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgcmVuZGVyaW5nIGNvbnRleHQgZm9yIHRoZSBzaGFwZXMuXG4gICAqL1xuICBfdXBkYXRlUmVuZGVyaW5nQ29udGV4dCgpIHtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsID0gdGhpcy50aW1lQ29udGV4dC50aW1lVG9QaXhlbDtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCA9IHRoaXMuX3ZhbHVlVG9QaXhlbDtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LmhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LndpZHRoICA9IHRoaXMudGltZUNvbnRleHQudGltZVRvUGl4ZWwodGhpcy50aW1lQ29udGV4dC5kdXJhdGlvbik7XG5cbiAgICAvLyBmb3IgZm9yZWlnbiBvYmplY3QgaXNzdWUgaW4gY2hyb21lXG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC5vZmZzZXRYID0gdGhpcy50aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLnRpbWVDb250ZXh0Lm9mZnNldCk7XG5cbiAgICAvLyBleHBvc2Ugc29tZSB0aW1lbGluZSBhdHRyaWJ1dGVzIC0gYWxsb3cgdG8gaW1wcm92ZSBwZXJmIGluIHNvbWUgY2FzZXMgLSBjZi4gV2F2ZWZvcm1cbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnRyYWNrT2Zmc2V0WCA9IHRoaXMudGltZUNvbnRleHQudGltZVRvUGl4ZWwodGhpcy50aW1lQ29udGV4dC5vZmZzZXQpO1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudmlzaWJsZVdpZHRoID0gdGhpcy50aW1lQ29udGV4dC52aXNpYmxlV2lkdGg7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGVzIHRoZSBkYXRhIGFuZCB1cGRhdGUgdGhlIGxheWVyLlxuICAgKi9cbiAgdXBkYXRlKCkge1xuICAgIHRoaXMuX2dlbmVyYXRlRGF0YSgpO1xuICAgIHN1cGVyLnVwZGF0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgRE9NIGluIG1lbW9yeSBvbiBsYXllciBjcmVhdGlvbiB0byBiZSBhYmxlIHRvIHVzZSBpdCBiZWZvcmVcbiAgICogdGhlIGxheWVyIGlzIGFjdHVhbGx5IGluc2VydGVkIGluIHRoZSBET01cbiAgICovXG4gIF9yZW5kZXJDb250YWluZXIoKSB7XG4gICAgLy8gd3JhcHBlciBncm91cCBmb3IgYHN0YXJ0LCB0b3AgYW5kIGNvbnRleHQgZmxpcCBtYXRyaXhcbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICBpZiAodGhpcy5wYXJhbXMuY2xhc3NOYW1lICE9PSBudWxsKSB7XG4gICAgICB0aGlzLiRlbC5jbGFzc0xpc3QuYWRkKCdsYXllcicsIHRoaXMucGFyYW1zLmNsYXNzTmFtZSk7XG4gICAgfVxuXG4gICAgLy8gZ3JvdXAgdG8gYXBwbHkgb2Zmc2V0XG4gICAgdGhpcy4kb2Zmc2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIHRoaXMuJG9mZnNldC5jbGFzc0xpc3QuYWRkKCdvZmZzZXQnLCAnaXRlbXMnKTtcbiAgICAvLyBsYXllciBiYWNrZ3JvdW5kXG4gICAgdGhpcy4kYmFja2dyb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3JlY3QnKTtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCAnMTAwJScpO1xuICAgIHRoaXMuJGJhY2tncm91bmQuY2xhc3NMaXN0LmFkZCgnYmFja2dyb3VuZCcpO1xuICAgIHRoaXMuJGJhY2tncm91bmQuc3R5bGUuZmlsbE9wYWNpdHkgPSAwO1xuICAgIHRoaXMuJGJhY2tncm91bmQuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcbiAgICAvLyBjcmVhdGUgdGhlIERPTSB0cmVlXG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kb2Zmc2V0KTtcbiAgICB0aGlzLiRvZmZzZXQuYXBwZW5kQ2hpbGQodGhpcy4kYmFja2dyb3VuZCk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgbGF5b3V0IG9mIHRoZSBsYXllci5cbiAgICovXG4gIHVwZGF0ZUNvbnRhaW5lcigpIHtcbiAgICB0aGlzLl91cGRhdGVSZW5kZXJpbmdDb250ZXh0KCk7XG5cbiAgICBjb25zdCB0b3AgICAgPSB0aGlzLnBhcmFtcy50b3A7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuICAgIC8vIG1hdHJpeCB0byBpbnZlcnQgdGhlIGNvb3JkaW5hdGUgc3lzdGVtXG4gICAgY29uc3QgdHJhbnNsYXRlTWF0cml4ID0gYG1hdHJpeCgxLCAwLCAwLCAtMSwgMCwgJHt0b3AgKyBoZWlnaHR9KWA7XG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIHRyYW5zbGF0ZU1hdHJpeCk7XG5cbiAgICB0aGlzLiRiYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIGhlaWdodCk7XG4gIH1cbn1cbiJdfQ==