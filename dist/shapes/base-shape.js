'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreNamespace = require('../core/namespace');

var _coreNamespace2 = _interopRequireDefault(_coreNamespace);

/**
 * Is an abstract class or interface to be overriden in order to define new
 * shapes. Shapes define the way a given datum should be rendered, they are
 * the smallest unit of rendering into a timeline.
 *
 * All the life cycle of `Shape` instances is handled into the `Layer` instance
 * they are attach to. As a consequence, they should be mainly considered as
 * private objects. The only place they should be interacted with is in `Behavior`
 * definitions, to test which element of the shape is the target of the
 * interaction and define the interaction according to that test.
 *
 * Depending of its implementation a `Shape` can be used along with `entity` or
 * `collection` data type. Some shapes are then created to use data considered
 * as a single entity (Waveform, TracePath, Line), while others are defined to
 * be used with data seen as a collection, each shape rendering a single entry
 * of the collection. The shapes working with entity type data should therefore
 * be used in an `entity` configured `Layer`. Note that if they are registered
 * as "commonShape" in a `collection` type `Layer`, they will behave the exact
 * same way. These kind of shapes are noted: "entity shape".
 *
 * ### Available `collection` shapes:
 * - Marker / Annotated Marker
 * - Segment / Annotated Segment
 * - Dot
 * - TraceDots
 *
 * ### Available `entity` shapes:
 * - Line
 * - Tick (for axis)
 * - Waveform
 * - TracePath
 */

var BaseShape = (function () {
  /**
   * @param {Object} options - override default configuration
   */

  function BaseShape() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, BaseShape);

    /** @type {Element} - Svg element to be returned by the `render` method. */
    this.$el = null;
    /** @type {String} - Svg namespace. */
    this.ns = _coreNamespace2['default'];
    /** @type {Object} - Object containing the global parameters of the shape */
    this.params = _Object$assign({}, this._getDefaults(), options);
    // create accessors methods and set default accessor functions
    var accessors = this._getAccessorList();
    this._createAccessors(accessors);
    this._setDefaultAccessors(accessors);
  }

  /**
   * Destroy the shape and clean references. Interface method called from the `layer`.
   */

  _createClass(BaseShape, [{
    key: 'destroy',
    value: function destroy() {
      // this.group = null;
      this.$el = null;
    }

    /**
     * Interface method to override when extending this base class. The method
     * is called by the `Layer~render` method. Returns the name of the shape,
     * used as a class in the element group (defaults to `'shape'`).
     *
     * @return {String}
     */
  }, {
    key: 'getClassName',
    value: function getClassName() {
      return 'shape';
    }

    /**
     * @todo not implemented
     * allow to install defs in the track svg element. Should be called when
     * adding the `Layer` to the `Track`.
     */
    // setSvgDefinition(defs) {}

    /**
     * Returns the defaults for global configuration of the shape.
     * @protected
     * @return {Object}
     */
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {};
    }

    /**
     * Returns an object where keys are the accessors methods names to create
     * and values are the default values for each given accessor.
     *
     * @protected
     * @todo rename ?
     * @return {Object}
     */
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return {};
    }

    /**
     * Interface method called by Layer when creating a shape. Install the
     * given accessors on the shape, overriding the default accessors.
     *
     * @param {Object<String, function>} accessors
     */
  }, {
    key: 'install',
    value: function install(accessors) {
      for (var key in accessors) {
        this[key] = accessors[key];
      }
    }

    /**
     * Generic method to create accessors. Adds getters en setters to the
     * prototype if not already present.
     */
  }, {
    key: '_createAccessors',
    value: function _createAccessors(accessors) {
      this._accessors = {};
      // add it to the prototype
      var proto = Object.getPrototypeOf(this);
      // create a getter / setter for each accessors
      // setter : `this.x = callback`
      // getter : `this.x(datum)`
      _Object$keys(accessors).forEach(function (name) {
        if (proto.hasOwnProperty(name)) {
          return;
        }

        _Object$defineProperty(proto, name, {
          get: function get() {
            return this._accessors[name];
          },
          set: function set(func) {
            this._accessors[name] = func;
          }
        });
      });
    }

    /**
     * Create a function to be used as a default accessor for each accesors
     */
  }, {
    key: '_setDefaultAccessors',
    value: function _setDefaultAccessors(accessors) {
      var _this = this;

      _Object$keys(accessors).forEach(function (name) {
        var defaultValue = accessors[name];
        var accessor = function accessor(d) {
          var v = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

          if (v === null) {
            return d[name] || defaultValue;
          }
          d[name] = v;
        };
        // set accessor as the default one
        _this[name] = accessor;
      });
    }

    /**
     * Interface method called by `Layer~render`. Creates the DOM structure of
     * the shape.
     *
     * @param {Object} renderingContext - the renderingContext of the layer
     *    which owns this shape.
     * @return {Element} - the DOM element to insert in the item's group.
     */
  }, {
    key: 'render',
    value: function render(renderingContext) {}

    /**
     * Interface method called by `Layer~update`. Updates the DOM structure of the shape.
     *
     * @param {Object} renderingContext - The `renderingContext` of the layer
     *    which owns this shape.
     * @param {Object|Array} datum - The datum associated to the shape.
     */
  }, {
    key: 'update',
    value: function update(renderingContext, datum) {}

    /**
     * Interface method to override called by `Layer~getItemsInArea`. Defines if
     * the shape is considered to be the given area. Arguments are passed in pixel domain.
     *
     * @param {Object} renderingContext - the renderingContext of the layer which
     *    owns this shape.
     * @param {Object|Array} datum - The datum associated to the shape.
     * @param {Number} x1 - The x component of the top-left corner of the area to test.
     * @param {Number} y1 - The y component of the top-left corner of the area to test.
     * @param {Number} x2 - The x component of the bottom-right corner of the area to test.
     * @param {Number} y2 - The y component of the bottom-right corner of the area to test.
     * @return {Boolean} - Returns `true` if the is considered to be in the given area, `false` otherwise.
     */
  }, {
    key: 'inArea',
    value: function inArea(renderingContext, datum, x1, y1, x2, y2) {}
  }]);

  return BaseShape;
})();

exports['default'] = BaseShape;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zaGFwZXMvYmFzZS1zaGFwZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7NkJBQWUsbUJBQW1COzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBbUNiLFNBQVM7Ozs7O0FBSWpCLFdBSlEsU0FBUyxHQUlGO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFKTCxTQUFTOzs7QUFNMUIsUUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7O0FBRWhCLFFBQUksQ0FBQyxFQUFFLDZCQUFLLENBQUM7O0FBRWIsUUFBSSxDQUFDLE1BQU0sR0FBRyxlQUFjLEVBQUUsRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRTlELFFBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0FBQzFDLFFBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNqQyxRQUFJLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUM7R0FDdEM7Ozs7OztlQWZrQixTQUFTOztXQW9CckIsbUJBQUc7O0FBRVIsVUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7S0FDakI7Ozs7Ozs7Ozs7O1dBU1csd0JBQUc7QUFBRSxhQUFPLE9BQU8sQ0FBQztLQUFFOzs7Ozs7Ozs7Ozs7Ozs7O1dBY3RCLHdCQUFHO0FBQ2IsYUFBTyxFQUFFLENBQUM7S0FDWDs7Ozs7Ozs7Ozs7O1dBVWUsNEJBQUc7QUFBRSxhQUFPLEVBQUUsQ0FBQztLQUFFOzs7Ozs7Ozs7O1dBUzFCLGlCQUFDLFNBQVMsRUFBRTtBQUNqQixXQUFLLElBQUksR0FBRyxJQUFJLFNBQVMsRUFBRTtBQUFFLFlBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7T0FBRTtLQUMzRDs7Ozs7Ozs7V0FNZSwwQkFBQyxTQUFTLEVBQUU7QUFDMUIsVUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7O0FBRXJCLFVBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7Ozs7QUFJMUMsbUJBQVksU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ3ZDLFlBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUFFLGlCQUFPO1NBQUU7O0FBRTNDLCtCQUFzQixLQUFLLEVBQUUsSUFBSSxFQUFFO0FBQ2pDLGFBQUcsRUFBRSxlQUFXO0FBQUUsbUJBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztXQUFFO0FBQ2pELGFBQUcsRUFBRSxhQUFTLElBQUksRUFBRTtBQUNsQixnQkFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7V0FDOUI7U0FDRixDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FDSjs7Ozs7OztXQUttQiw4QkFBQyxTQUFTLEVBQUU7OztBQUM5QixtQkFBWSxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDdkMsWUFBTSxZQUFZLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3JDLFlBQUksUUFBUSxHQUFHLFNBQVgsUUFBUSxDQUFZLENBQUMsRUFBWTtjQUFWLENBQUMseURBQUcsSUFBSTs7QUFDakMsY0FBSSxDQUFDLEtBQUssSUFBSSxFQUFFO0FBQUUsbUJBQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLFlBQVksQ0FBQztXQUFFO0FBQ25ELFdBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDYixDQUFDOztBQUVGLGNBQUssSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDO09BQ3ZCLENBQUMsQ0FBQztLQUNKOzs7Ozs7Ozs7Ozs7V0FVSyxnQkFBQyxnQkFBZ0IsRUFBRSxFQUFFOzs7Ozs7Ozs7OztXQVNyQixnQkFBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7V0FlNUIsZ0JBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFOzs7U0E3SS9CLFNBQVM7OztxQkFBVCxTQUFTIiwiZmlsZSI6InNyYy9zaGFwZXMvYmFzZS1zaGFwZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBucyBmcm9tICcuLi9jb3JlL25hbWVzcGFjZSc7XG5cblxuLyoqXG4gKiBJcyBhbiBhYnN0cmFjdCBjbGFzcyBvciBpbnRlcmZhY2UgdG8gYmUgb3ZlcnJpZGVuIGluIG9yZGVyIHRvIGRlZmluZSBuZXdcbiAqIHNoYXBlcy4gU2hhcGVzIGRlZmluZSB0aGUgd2F5IGEgZ2l2ZW4gZGF0dW0gc2hvdWxkIGJlIHJlbmRlcmVkLCB0aGV5IGFyZVxuICogdGhlIHNtYWxsZXN0IHVuaXQgb2YgcmVuZGVyaW5nIGludG8gYSB0aW1lbGluZS5cbiAqXG4gKiBBbGwgdGhlIGxpZmUgY3ljbGUgb2YgYFNoYXBlYCBpbnN0YW5jZXMgaXMgaGFuZGxlZCBpbnRvIHRoZSBgTGF5ZXJgIGluc3RhbmNlXG4gKiB0aGV5IGFyZSBhdHRhY2ggdG8uIEFzIGEgY29uc2VxdWVuY2UsIHRoZXkgc2hvdWxkIGJlIG1haW5seSBjb25zaWRlcmVkIGFzXG4gKiBwcml2YXRlIG9iamVjdHMuIFRoZSBvbmx5IHBsYWNlIHRoZXkgc2hvdWxkIGJlIGludGVyYWN0ZWQgd2l0aCBpcyBpbiBgQmVoYXZpb3JgXG4gKiBkZWZpbml0aW9ucywgdG8gdGVzdCB3aGljaCBlbGVtZW50IG9mIHRoZSBzaGFwZSBpcyB0aGUgdGFyZ2V0IG9mIHRoZVxuICogaW50ZXJhY3Rpb24gYW5kIGRlZmluZSB0aGUgaW50ZXJhY3Rpb24gYWNjb3JkaW5nIHRvIHRoYXQgdGVzdC5cbiAqXG4gKiBEZXBlbmRpbmcgb2YgaXRzIGltcGxlbWVudGF0aW9uIGEgYFNoYXBlYCBjYW4gYmUgdXNlZCBhbG9uZyB3aXRoIGBlbnRpdHlgIG9yXG4gKiBgY29sbGVjdGlvbmAgZGF0YSB0eXBlLiBTb21lIHNoYXBlcyBhcmUgdGhlbiBjcmVhdGVkIHRvIHVzZSBkYXRhIGNvbnNpZGVyZWRcbiAqIGFzIGEgc2luZ2xlIGVudGl0eSAoV2F2ZWZvcm0sIFRyYWNlUGF0aCwgTGluZSksIHdoaWxlIG90aGVycyBhcmUgZGVmaW5lZCB0b1xuICogYmUgdXNlZCB3aXRoIGRhdGEgc2VlbiBhcyBhIGNvbGxlY3Rpb24sIGVhY2ggc2hhcGUgcmVuZGVyaW5nIGEgc2luZ2xlIGVudHJ5XG4gKiBvZiB0aGUgY29sbGVjdGlvbi4gVGhlIHNoYXBlcyB3b3JraW5nIHdpdGggZW50aXR5IHR5cGUgZGF0YSBzaG91bGQgdGhlcmVmb3JlXG4gKiBiZSB1c2VkIGluIGFuIGBlbnRpdHlgIGNvbmZpZ3VyZWQgYExheWVyYC4gTm90ZSB0aGF0IGlmIHRoZXkgYXJlIHJlZ2lzdGVyZWRcbiAqIGFzIFwiY29tbW9uU2hhcGVcIiBpbiBhIGBjb2xsZWN0aW9uYCB0eXBlIGBMYXllcmAsIHRoZXkgd2lsbCBiZWhhdmUgdGhlIGV4YWN0XG4gKiBzYW1lIHdheS4gVGhlc2Uga2luZCBvZiBzaGFwZXMgYXJlIG5vdGVkOiBcImVudGl0eSBzaGFwZVwiLlxuICpcbiAqICMjIyBBdmFpbGFibGUgYGNvbGxlY3Rpb25gIHNoYXBlczpcbiAqIC0gTWFya2VyIC8gQW5ub3RhdGVkIE1hcmtlclxuICogLSBTZWdtZW50IC8gQW5ub3RhdGVkIFNlZ21lbnRcbiAqIC0gRG90XG4gKiAtIFRyYWNlRG90c1xuICpcbiAqICMjIyBBdmFpbGFibGUgYGVudGl0eWAgc2hhcGVzOlxuICogLSBMaW5lXG4gKiAtIFRpY2sgKGZvciBheGlzKVxuICogLSBXYXZlZm9ybVxuICogLSBUcmFjZVBhdGhcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZVNoYXBlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gb3ZlcnJpZGUgZGVmYXVsdCBjb25maWd1cmF0aW9uXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAvKiogQHR5cGUge0VsZW1lbnR9IC0gU3ZnIGVsZW1lbnQgdG8gYmUgcmV0dXJuZWQgYnkgdGhlIGByZW5kZXJgIG1ldGhvZC4gKi9cbiAgICB0aGlzLiRlbCA9IG51bGw7XG4gICAgLyoqIEB0eXBlIHtTdHJpbmd9IC0gU3ZnIG5hbWVzcGFjZS4gKi9cbiAgICB0aGlzLm5zID0gbnM7XG4gICAgLyoqIEB0eXBlIHtPYmplY3R9IC0gT2JqZWN0IGNvbnRhaW5pbmcgdGhlIGdsb2JhbCBwYXJhbWV0ZXJzIG9mIHRoZSBzaGFwZSAqL1xuICAgIHRoaXMucGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5fZ2V0RGVmYXVsdHMoKSwgb3B0aW9ucyk7XG4gICAgLy8gY3JlYXRlIGFjY2Vzc29ycyBtZXRob2RzIGFuZCBzZXQgZGVmYXVsdCBhY2Nlc3NvciBmdW5jdGlvbnNcbiAgICBjb25zdCBhY2Nlc3NvcnMgPSB0aGlzLl9nZXRBY2Nlc3Nvckxpc3QoKTtcbiAgICB0aGlzLl9jcmVhdGVBY2Nlc3NvcnMoYWNjZXNzb3JzKTtcbiAgICB0aGlzLl9zZXREZWZhdWx0QWNjZXNzb3JzKGFjY2Vzc29ycyk7XG4gIH1cblxuICAvKipcbiAgICogRGVzdHJveSB0aGUgc2hhcGUgYW5kIGNsZWFuIHJlZmVyZW5jZXMuIEludGVyZmFjZSBtZXRob2QgY2FsbGVkIGZyb20gdGhlIGBsYXllcmAuXG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIC8vIHRoaXMuZ3JvdXAgPSBudWxsO1xuICAgIHRoaXMuJGVsID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgbWV0aG9kIHRvIG92ZXJyaWRlIHdoZW4gZXh0ZW5kaW5nIHRoaXMgYmFzZSBjbGFzcy4gVGhlIG1ldGhvZFxuICAgKiBpcyBjYWxsZWQgYnkgdGhlIGBMYXllcn5yZW5kZXJgIG1ldGhvZC4gUmV0dXJucyB0aGUgbmFtZSBvZiB0aGUgc2hhcGUsXG4gICAqIHVzZWQgYXMgYSBjbGFzcyBpbiB0aGUgZWxlbWVudCBncm91cCAoZGVmYXVsdHMgdG8gYCdzaGFwZSdgKS5cbiAgICpcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKi9cbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ3NoYXBlJzsgfVxuXG4gIC8qKlxuICAgKiBAdG9kbyBub3QgaW1wbGVtZW50ZWRcbiAgICogYWxsb3cgdG8gaW5zdGFsbCBkZWZzIGluIHRoZSB0cmFjayBzdmcgZWxlbWVudC4gU2hvdWxkIGJlIGNhbGxlZCB3aGVuXG4gICAqIGFkZGluZyB0aGUgYExheWVyYCB0byB0aGUgYFRyYWNrYC5cbiAgICovXG4gIC8vIHNldFN2Z0RlZmluaXRpb24oZGVmcykge31cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZGVmYXVsdHMgZm9yIGdsb2JhbCBjb25maWd1cmF0aW9uIG9mIHRoZSBzaGFwZS5cbiAgICogQHByb3RlY3RlZFxuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqL1xuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gb2JqZWN0IHdoZXJlIGtleXMgYXJlIHRoZSBhY2Nlc3NvcnMgbWV0aG9kcyBuYW1lcyB0byBjcmVhdGVcbiAgICogYW5kIHZhbHVlcyBhcmUgdGhlIGRlZmF1bHQgdmFsdWVzIGZvciBlYWNoIGdpdmVuIGFjY2Vzc29yLlxuICAgKlxuICAgKiBAcHJvdGVjdGVkXG4gICAqIEB0b2RvIHJlbmFtZSA/XG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7IHJldHVybiB7fTsgfVxuXG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgY2FsbGVkIGJ5IExheWVyIHdoZW4gY3JlYXRpbmcgYSBzaGFwZS4gSW5zdGFsbCB0aGVcbiAgICogZ2l2ZW4gYWNjZXNzb3JzIG9uIHRoZSBzaGFwZSwgb3ZlcnJpZGluZyB0aGUgZGVmYXVsdCBhY2Nlc3NvcnMuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0PFN0cmluZywgZnVuY3Rpb24+fSBhY2Nlc3NvcnNcbiAgICovXG4gIGluc3RhbGwoYWNjZXNzb3JzKSB7XG4gICAgZm9yIChsZXQga2V5IGluIGFjY2Vzc29ycykgeyB0aGlzW2tleV0gPSBhY2Nlc3NvcnNba2V5XTsgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyaWMgbWV0aG9kIHRvIGNyZWF0ZSBhY2Nlc3NvcnMuIEFkZHMgZ2V0dGVycyBlbiBzZXR0ZXJzIHRvIHRoZVxuICAgKiBwcm90b3R5cGUgaWYgbm90IGFscmVhZHkgcHJlc2VudC5cbiAgICovXG4gIF9jcmVhdGVBY2Nlc3NvcnMoYWNjZXNzb3JzKSB7XG4gICAgdGhpcy5fYWNjZXNzb3JzID0ge307XG4gICAgLy8gYWRkIGl0IHRvIHRoZSBwcm90b3R5cGVcbiAgICBjb25zdCBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzKTtcbiAgICAvLyBjcmVhdGUgYSBnZXR0ZXIgLyBzZXR0ZXIgZm9yIGVhY2ggYWNjZXNzb3JzXG4gICAgLy8gc2V0dGVyIDogYHRoaXMueCA9IGNhbGxiYWNrYFxuICAgIC8vIGdldHRlciA6IGB0aGlzLngoZGF0dW0pYFxuICAgIE9iamVjdC5rZXlzKGFjY2Vzc29ycykuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgICAgaWYgKHByb3RvLmhhc093blByb3BlcnR5KG5hbWUpKSB7IHJldHVybjsgfVxuXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvdG8sIG5hbWUsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX2FjY2Vzc29yc1tuYW1lXTsgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbihmdW5jKSB7XG4gICAgICAgICAgdGhpcy5fYWNjZXNzb3JzW25hbWVdID0gZnVuYztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgZnVuY3Rpb24gdG8gYmUgdXNlZCBhcyBhIGRlZmF1bHQgYWNjZXNzb3IgZm9yIGVhY2ggYWNjZXNvcnNcbiAgICovXG4gIF9zZXREZWZhdWx0QWNjZXNzb3JzKGFjY2Vzc29ycykge1xuICAgIE9iamVjdC5rZXlzKGFjY2Vzc29ycykuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgICAgY29uc3QgZGVmYXVsdFZhbHVlID0gYWNjZXNzb3JzW25hbWVdO1xuICAgICAgbGV0IGFjY2Vzc29yID0gZnVuY3Rpb24oZCwgdiA9IG51bGwpIHtcbiAgICAgICAgaWYgKHYgPT09IG51bGwpIHsgcmV0dXJuIGRbbmFtZV0gfHwgZGVmYXVsdFZhbHVlOyB9XG4gICAgICAgIGRbbmFtZV0gPSB2O1xuICAgICAgfTtcbiAgICAgIC8vIHNldCBhY2Nlc3NvciBhcyB0aGUgZGVmYXVsdCBvbmVcbiAgICAgIHRoaXNbbmFtZV0gPSBhY2Nlc3NvcjtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgbWV0aG9kIGNhbGxlZCBieSBgTGF5ZXJ+cmVuZGVyYC4gQ3JlYXRlcyB0aGUgRE9NIHN0cnVjdHVyZSBvZlxuICAgKiB0aGUgc2hhcGUuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByZW5kZXJpbmdDb250ZXh0IC0gdGhlIHJlbmRlcmluZ0NvbnRleHQgb2YgdGhlIGxheWVyXG4gICAqICAgIHdoaWNoIG93bnMgdGhpcyBzaGFwZS5cbiAgICogQHJldHVybiB7RWxlbWVudH0gLSB0aGUgRE9NIGVsZW1lbnQgdG8gaW5zZXJ0IGluIHRoZSBpdGVtJ3MgZ3JvdXAuXG4gICAqL1xuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge31cblxuICAvKipcbiAgICogSW50ZXJmYWNlIG1ldGhvZCBjYWxsZWQgYnkgYExheWVyfnVwZGF0ZWAuIFVwZGF0ZXMgdGhlIERPTSBzdHJ1Y3R1cmUgb2YgdGhlIHNoYXBlLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcmVuZGVyaW5nQ29udGV4dCAtIFRoZSBgcmVuZGVyaW5nQ29udGV4dGAgb2YgdGhlIGxheWVyXG4gICAqICAgIHdoaWNoIG93bnMgdGhpcyBzaGFwZS5cbiAgICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IGRhdHVtIC0gVGhlIGRhdHVtIGFzc29jaWF0ZWQgdG8gdGhlIHNoYXBlLlxuICAgKi9cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtKSB7fVxuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgbWV0aG9kIHRvIG92ZXJyaWRlIGNhbGxlZCBieSBgTGF5ZXJ+Z2V0SXRlbXNJbkFyZWFgLiBEZWZpbmVzIGlmXG4gICAqIHRoZSBzaGFwZSBpcyBjb25zaWRlcmVkIHRvIGJlIHRoZSBnaXZlbiBhcmVhLiBBcmd1bWVudHMgYXJlIHBhc3NlZCBpbiBwaXhlbCBkb21haW4uXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByZW5kZXJpbmdDb250ZXh0IC0gdGhlIHJlbmRlcmluZ0NvbnRleHQgb2YgdGhlIGxheWVyIHdoaWNoXG4gICAqICAgIG93bnMgdGhpcyBzaGFwZS5cbiAgICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IGRhdHVtIC0gVGhlIGRhdHVtIGFzc29jaWF0ZWQgdG8gdGhlIHNoYXBlLlxuICAgKiBAcGFyYW0ge051bWJlcn0geDEgLSBUaGUgeCBjb21wb25lbnQgb2YgdGhlIHRvcC1sZWZ0IGNvcm5lciBvZiB0aGUgYXJlYSB0byB0ZXN0LlxuICAgKiBAcGFyYW0ge051bWJlcn0geTEgLSBUaGUgeSBjb21wb25lbnQgb2YgdGhlIHRvcC1sZWZ0IGNvcm5lciBvZiB0aGUgYXJlYSB0byB0ZXN0LlxuICAgKiBAcGFyYW0ge051bWJlcn0geDIgLSBUaGUgeCBjb21wb25lbnQgb2YgdGhlIGJvdHRvbS1yaWdodCBjb3JuZXIgb2YgdGhlIGFyZWEgdG8gdGVzdC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHkyIC0gVGhlIHkgY29tcG9uZW50IG9mIHRoZSBib3R0b20tcmlnaHQgY29ybmVyIG9mIHRoZSBhcmVhIHRvIHRlc3QuXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IC0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGlzIGNvbnNpZGVyZWQgdG8gYmUgaW4gdGhlIGdpdmVuIGFyZWEsIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICAgKi9cbiAgaW5BcmVhKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtLCB4MSwgeTEsIHgyLCB5Mikge31cbn1cbiJdfQ==