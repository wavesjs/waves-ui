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
 *  Simplified Layer for Axis
 *
 *  This layer should stay into the timeline's visibleArea (no offset)
 *  It also handle it's own data and its updates
 *  `_generateData` is responsible to create some usefull data to visualize
 */

var AxisLayer = (function (_Layer) {
  _inherits(AxisLayer, _Layer);

  /**
   *  @param {Function} generator - a function to create data according the a timeContext
   *  @param {Object} options - layer options
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
     *  This method is the main difference with a classical layer
     *  This one generates and maintains it's own data
     */
    value: function _generateData() {
      var data = this._generator(this.timeContext);
      // prepend first arguments of splice for an apply
      data.unshift(0, this.data[0].length);
      // make sure to keep the same reference
      Array.prototype.splice.apply(this.data[0], data);
    }

    /**
     *  update the values in `_renderingContext`
     *  is particulary needed when updating `stretchRatio` as the pointer
     *  to the `timeToPixel` scale may change
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
     *  render the DOM in memory on layer creation to be able to use it before
     *  the layer is actually inserted in the DOM
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
     *  updates the context of the layer
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
      console.log(value);return;
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
  }, {
    key: 'generator',
    set: function set(func) {
      this._generator = func;
    },
    get: function get() {
      return this._generator;
    }
  }]);

  return AxisLayer;
})(_coreLayer2['default']);

exports['default'] = AxisLayer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9heGlzL2F4aXMtbGF5ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs2QkFBZSxtQkFBbUI7Ozs7eUJBQ2hCLGVBQWU7Ozs7Ozs7Ozs7OztJQVVaLFNBQVM7WUFBVCxTQUFTOzs7Ozs7O0FBS2pCLFdBTFEsU0FBUyxDQUtoQixTQUFTLEVBQUUsT0FBTyxFQUFFOzBCQUxiLFNBQVM7O0FBTTFCLCtCQU5pQixTQUFTLDZDQU1wQixRQUFRLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRTtBQUM3QixRQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztHQUM3Qjs7OztlQVJrQixTQUFTOzs7Ozs7O1dBaUNmLHlCQUFHO0FBQ2QsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRS9DLFVBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRXJDLFdBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ2xEOzs7Ozs7Ozs7V0FPc0IsbUNBQUc7QUFDeEIsVUFBSSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQztBQUNsRSxVQUFJLENBQUMsaUJBQWlCLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7QUFDekQsVUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUNuRCxVQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxHQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxD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U0FIWCxhQUFDLEtBQUssRUFBRTtBQUFFLGFBQU87S0FBRTtTQUluQixlQUFHO0FBQUUsYUFBTztLQUFFOzs7U0FHYixhQUFDLElBQUksRUFBRTtBQUNsQixVQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztLQUN4QjtTQUVZLGVBQUc7QUFDZCxhQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7S0FDeEI7OztTQTNCa0IsU0FBUzs7O3FCQUFULFNBQVMiLCJmaWxlIjoic3JjL2F4aXMvYXhpcy1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBucyBmcm9tICcuLi9jb3JlL25hbWVzcGFjZSc7XG5pbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5cblxuLyoqXG4gKiAgU2ltcGxpZmllZCBMYXllciBmb3IgQXhpc1xuICpcbiAqICBUaGlzIGxheWVyIHNob3VsZCBzdGF5IGludG8gdGhlIHRpbWVsaW5lJ3MgdmlzaWJsZUFyZWEgKG5vIG9mZnNldClcbiAqICBJdCBhbHNvIGhhbmRsZSBpdCdzIG93biBkYXRhIGFuZCBpdHMgdXBkYXRlc1xuICogIGBfZ2VuZXJhdGVEYXRhYCBpcyByZXNwb25zaWJsZSB0byBjcmVhdGUgc29tZSB1c2VmdWxsIGRhdGEgdG8gdmlzdWFsaXplXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF4aXNMYXllciBleHRlbmRzIExheWVyIHtcbiAgLyoqXG4gICAqICBAcGFyYW0ge0Z1bmN0aW9ufSBnZW5lcmF0b3IgLSBhIGZ1bmN0aW9uIHRvIGNyZWF0ZSBkYXRhIGFjY29yZGluZyB0aGUgYSB0aW1lQ29udGV4dFxuICAgKiAgQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBsYXllciBvcHRpb25zXG4gICAqL1xuICBjb25zdHJ1Y3RvcihnZW5lcmF0b3IsIG9wdGlvbnMpIHtcbiAgICBzdXBlcignZW50aXR5JywgW10sIG9wdGlvbnMpO1xuICAgIHRoaXMuX2dlbmVyYXRvciA9IGdlbmVyYXRvcjtcbiAgfVxuXG4gIC8vIGNhbid0IGFjY2VzcyB0aW1lQ29udGV4dCBmcm9tIG91dHNpZGVcbiAgc2V0IHN0cmV0Y2hSYXRpbyh2YWx1ZSkgeyByZXR1cm47IH1cbiAgc2V0IG9mZnNldCh2YWx1ZSkgeyBjb25zb2xlLmxvZyh2YWx1ZSk7IHJldHVybjsgfVxuICBzZXQgc3RhcnQodmFsdWUpIHsgcmV0dXJuOyB9XG4gIHNldCBkdXJhdGlvbih2YWx1ZSkgeyByZXR1cm47IH1cbiAgZ2V0IHN0cmV0Y2hSYXRpbygpIHsgcmV0dXJuOyB9XG4gIGdldCBvZmZzZXQoKSB7IHJldHVybjsgfVxuICBnZXQgc3RhcnQoKSB7IHJldHVybjsgfVxuICBnZXQgZHVyYXRpb24oKSB7IHJldHVybjsgfVxuXG5cbiAgc2V0IGdlbmVyYXRvcihmdW5jKSB7XG4gICAgdGhpcy5fZ2VuZXJhdG9yID0gZnVuYztcbiAgfVxuXG4gIGdldCBnZW5lcmF0b3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dlbmVyYXRvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiAgVGhpcyBtZXRob2QgaXMgdGhlIG1haW4gZGlmZmVyZW5jZSB3aXRoIGEgY2xhc3NpY2FsIGxheWVyXG4gICAqICBUaGlzIG9uZSBnZW5lcmF0ZXMgYW5kIG1haW50YWlucyBpdCdzIG93biBkYXRhXG4gICAqL1xuICBfZ2VuZXJhdGVEYXRhKCkge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLl9nZW5lcmF0b3IodGhpcy50aW1lQ29udGV4dCk7XG4gICAgLy8gcHJlcGVuZCBmaXJzdCBhcmd1bWVudHMgb2Ygc3BsaWNlIGZvciBhbiBhcHBseVxuICAgIGRhdGEudW5zaGlmdCgwLCB0aGlzLmRhdGFbMF0ubGVuZ3RoKTtcbiAgICAvLyBtYWtlIHN1cmUgdG8ga2VlcCB0aGUgc2FtZSByZWZlcmVuY2VcbiAgICBBcnJheS5wcm90b3R5cGUuc3BsaWNlLmFwcGx5KHRoaXMuZGF0YVswXSwgZGF0YSk7XG4gIH1cblxuICAvKipcbiAgICogIHVwZGF0ZSB0aGUgdmFsdWVzIGluIGBfcmVuZGVyaW5nQ29udGV4dGBcbiAgICogIGlzIHBhcnRpY3VsYXJ5IG5lZWRlZCB3aGVuIHVwZGF0aW5nIGBzdHJldGNoUmF0aW9gIGFzIHRoZSBwb2ludGVyXG4gICAqICB0byB0aGUgYHRpbWVUb1BpeGVsYCBzY2FsZSBtYXkgY2hhbmdlXG4gICAqL1xuICBfdXBkYXRlUmVuZGVyaW5nQ29udGV4dCgpIHtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsID0gdGhpcy50aW1lQ29udGV4dC50aW1lVG9QaXhlbDtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCA9IHRoaXMuX3ZhbHVlVG9QaXhlbDtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LmhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LndpZHRoICA9IHRoaXMudGltZUNvbnRleHQudGltZVRvUGl4ZWwodGhpcy50aW1lQ29udGV4dC5kdXJhdGlvbik7XG5cbiAgICAvLyBmb3IgZm9yZWlnbiBvYmplY3QgaXNzdWUgaW4gY2hyb21lXG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC5vZmZzZXRYID0gdGhpcy50aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLnRpbWVDb250ZXh0Lm9mZnNldCk7XG5cbiAgICAvLyBleHBvc2Ugc29tZSB0aW1lbGluZSBhdHRyaWJ1dGVzIC0gYWxsb3cgdG8gaW1wcm92ZSBwZXJmIGluIHNvbWUgY2FzZXMgLSBjZi4gV2F2ZWZvcm1cbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnRyYWNrT2Zmc2V0WCA9IHRoaXMudGltZUNvbnRleHQudGltZVRvUGl4ZWwodGhpcy50aW1lQ29udGV4dC5vZmZzZXQpO1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudmlzaWJsZVdpZHRoID0gdGhpcy50aW1lQ29udGV4dC52aXNpYmxlV2lkdGg7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgc3VwZXIucmVuZGVyKCk7XG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgdGhpcy5fZ2VuZXJhdGVEYXRhKCk7XG4gICAgc3VwZXIudXBkYXRlKCk7XG4gIH1cblxuICAvKipcbiAgICogIHJlbmRlciB0aGUgRE9NIGluIG1lbW9yeSBvbiBsYXllciBjcmVhdGlvbiB0byBiZSBhYmxlIHRvIHVzZSBpdCBiZWZvcmVcbiAgICogIHRoZSBsYXllciBpcyBhY3R1YWxseSBpbnNlcnRlZCBpbiB0aGUgRE9NXG4gICAqL1xuICBfcmVuZGVyQ29udGFpbmVyKCkge1xuICAgIC8vIHdyYXBwZXIgZ3JvdXAgZm9yIGBzdGFydCwgdG9wIGFuZCBjb250ZXh0IGZsaXAgbWF0cml4XG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgaWYgKHRoaXMucGFyYW1zLmNsYXNzTmFtZSAhPT0gbnVsbCkge1xuICAgICAgdGhpcy4kZWwuY2xhc3NMaXN0LmFkZCgnbGF5ZXInLCB0aGlzLnBhcmFtcy5jbGFzc05hbWUpO1xuICAgIH1cblxuICAgIC8vIGdyb3VwIHRvIGFwcGx5IG9mZnNldFxuICAgIHRoaXMuJG9mZnNldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICB0aGlzLiRvZmZzZXQuY2xhc3NMaXN0LmFkZCgnb2Zmc2V0JywgJ2l0ZW1zJyk7XG4gICAgLy8gbGF5ZXIgYmFja2dyb3VuZFxuICAgIHRoaXMuJGJhY2tncm91bmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdyZWN0Jyk7XG4gICAgdGhpcy4kYmFja2dyb3VuZC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgJzEwMCUnKTtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLmNsYXNzTGlzdC5hZGQoJ2JhY2tncm91bmQnKTtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLnN0eWxlLmZpbGxPcGFjaXR5ID0gMDtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XG4gICAgLy8gY3JlYXRlIHRoZSBET00gdHJlZVxuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJG9mZnNldCk7XG4gICAgdGhpcy4kb2Zmc2V0LmFwcGVuZENoaWxkKHRoaXMuJGJhY2tncm91bmQpO1xuICB9XG5cbiAgLyoqXG4gICAqICB1cGRhdGVzIHRoZSBjb250ZXh0IG9mIHRoZSBsYXllclxuICAgKi9cbiAgdXBkYXRlQ29udGFpbmVyKCkge1xuICAgIHRoaXMuX3VwZGF0ZVJlbmRlcmluZ0NvbnRleHQoKTtcblxuICAgIGNvbnN0IHRvcCAgICA9IHRoaXMucGFyYW1zLnRvcDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgLy8gbWF0cml4IHRvIGludmVydCB0aGUgY29vcmRpbmF0ZSBzeXN0ZW1cbiAgICBjb25zdCB0cmFuc2xhdGVNYXRyaXggPSBgbWF0cml4KDEsIDAsIDAsIC0xLCAwLCAke3RvcCArIGhlaWdodH0pYDtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgdHJhbnNsYXRlTWF0cml4KTtcblxuICAgIHRoaXMuJGJhY2tncm91bmQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgaGVpZ2h0KTtcbiAgfVxufVxuIl19