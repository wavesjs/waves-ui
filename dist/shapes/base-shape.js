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
 * Is an abstract class or interface to be overriden in order to define new shapes. Shapes define the way a given datum should be rendered, they are the smallest unit of rendering into a timeline.
 *
 * All the life cycle of `Shape` instances is handled into the `Layer` instance they are attach to. As a consequence, they should be mainly considered as private objects. The only place they should be interacted with is in `Behavior` definitions, to test which element of the shape is the target of the interaction and define the interaction according to that test.
 *
 * Depending of its implementation a `Shape` can be used along with `entity` or `collection` data type. Some shapes are then created to use data considered as a single entity (Waveform, TracePath, Line), while others are defined to be used with data seen as a collection, each shape rendering a single entry of the collection. The shapes working with entity type data should therefore be used in an `entity` configured `Layer`. Note that if they are registered as "commonShape" in a `collection` type `Layer`, they will behave the exact same way. These kind of shapes are noted: "entity shape".
 *
 * Available `collection` shapes:
 * - Marker / Annotated Marker
 * - Segment / Annotated Segment
 * - Dot
 * - TraceDots
 *
 * Available `entity` shapes:
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
     * Interface method to override when extending this base class. The method is called by the `Layer~render` method. Returns the name of the shape, used as a class in the element group (defaults to `'shape'`).
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
     * allow to install defs in the track svg element. Should be called when adding the `Layer` to the `Track`.
     *
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
     * Returns an object where keys are the accessors methods names to create and values are the default values for each given accessor.
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
     * Interface method called by Layer when creating a shape. Install the given accessors on the shape, overriding the default accessors.
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
     * Generic method to create accessors. Adds getters en setters to the prototype if not already present.
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
     * Interface method called by `Layer~render`. Creates the DOM structure of the shape.
     *
     * @param {Object} renderingContext - the renderingContext of the layer which owns this shape.
     * @return {Element} - the DOM element to insert in the item's group.
     */
  }, {
    key: 'render',
    value: function render(renderingContext) {}

    /**
     * Interface method called by `Layer~update`. Updates the DOM structure of the shape.
     *
     * @param {Object} renderingContext - The `renderingContext` of the layer which owns this shape.
     * @param {Object|Array} datum - The datum associated to the shape.
     */
  }, {
    key: 'update',
    value: function update(renderingContext, datum) {}

    /**
     * Interface method to override called by `Layer~getItemsInArea`. Defines if the shape is considered to be the given area. Arguments are passed in pixel domain.
     *
     * @param {Object} renderingContext - the renderingContext of the layer which owns this shape.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zaGFwZXMvYmFzZS1zaGFwZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7NkJBQWUsbUJBQW1COzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFzQmIsU0FBUzs7Ozs7QUFJakIsV0FKUSxTQUFTLEdBSUY7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQUpMLFNBQVM7OztBQU0xQixRQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQzs7QUFFaEIsUUFBSSxDQUFDLEVBQUUsNkJBQUssQ0FBQzs7QUFFYixRQUFJLENBQUMsTUFBTSxHQUFHLGVBQWMsRUFBRSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFOUQsUUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7QUFDMUMsUUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2pDLFFBQUksQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztHQUN0Qzs7Ozs7O2VBZmtCLFNBQVM7O1dBb0JyQixtQkFBRzs7QUFFUixVQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztLQUNqQjs7Ozs7Ozs7O1dBT1csd0JBQUc7QUFBRSxhQUFPLE9BQU8sQ0FBQztLQUFFOzs7Ozs7Ozs7Ozs7Ozs7O1dBY3RCLHdCQUFHO0FBQ2IsYUFBTyxFQUFFLENBQUM7S0FDWDs7Ozs7Ozs7Ozs7V0FTZSw0QkFBRztBQUFFLGFBQU8sRUFBRSxDQUFDO0tBQUU7Ozs7Ozs7OztXQVExQixpQkFBQyxTQUFTLEVBQUU7QUFDakIsV0FBSyxJQUFJLEdBQUcsSUFBSSxTQUFTLEVBQUU7QUFBRSxZQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQUU7S0FDM0Q7Ozs7Ozs7V0FLZSwwQkFBQyxTQUFTLEVBQUU7QUFDMUIsVUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7O0FBRXJCLFVBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7Ozs7QUFJMUMsbUJBQVksU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ3ZDLFlBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUFFLGlCQUFPO1NBQUU7O0FBRTNDLCtCQUFzQixLQUFLLEVBQUUsSUFBSSxFQUFFO0FBQ2pDLGFBQUcsRUFBRSxlQUFXO0FBQUUsbUJBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztXQUFFO0FBQ2pELGFBQUcsRUFBRSxhQUFTLElBQUksRUFBRTtBQUNsQixnQkFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7V0FDOUI7U0FDRixDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FDSjs7Ozs7OztXQUttQiw4QkFBQyxTQUFTLEVBQUU7OztBQUM5QixtQkFBWSxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDdkMsWUFBTSxZQUFZLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3JDLFlBQUksUUFBUSxHQUFHLFNBQVgsUUFBUSxDQUFZLENBQUMsRUFBWTtjQUFWLENBQUMseURBQUcsSUFBSTs7QUFDakMsY0FBSSxDQUFDLEtBQUssSUFBSSxFQUFFO0FBQUUsbUJBQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLFlBQVksQ0FBQztXQUFFO0FBQ25ELFdBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDYixDQUFDOztBQUVGLGNBQUssSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDO09BQ3ZCLENBQUMsQ0FBQztLQUNKOzs7Ozs7Ozs7O1dBUUssZ0JBQUMsZ0JBQWdCLEVBQUUsRUFBRTs7Ozs7Ozs7OztXQVFyQixnQkFBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsRUFBRTs7Ozs7Ozs7Ozs7Ozs7O1dBYTVCLGdCQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTs7O1NBbkkvQixTQUFTOzs7cUJBQVQsU0FBUyIsImZpbGUiOiJzcmMvc2hhcGVzL2Jhc2Utc2hhcGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbnMgZnJvbSAnLi4vY29yZS9uYW1lc3BhY2UnO1xuXG5cbi8qKlxuICogSXMgYW4gYWJzdHJhY3QgY2xhc3Mgb3IgaW50ZXJmYWNlIHRvIGJlIG92ZXJyaWRlbiBpbiBvcmRlciB0byBkZWZpbmUgbmV3IHNoYXBlcy4gU2hhcGVzIGRlZmluZSB0aGUgd2F5IGEgZ2l2ZW4gZGF0dW0gc2hvdWxkIGJlIHJlbmRlcmVkLCB0aGV5IGFyZSB0aGUgc21hbGxlc3QgdW5pdCBvZiByZW5kZXJpbmcgaW50byBhIHRpbWVsaW5lLlxuICpcbiAqIEFsbCB0aGUgbGlmZSBjeWNsZSBvZiBgU2hhcGVgIGluc3RhbmNlcyBpcyBoYW5kbGVkIGludG8gdGhlIGBMYXllcmAgaW5zdGFuY2UgdGhleSBhcmUgYXR0YWNoIHRvLiBBcyBhIGNvbnNlcXVlbmNlLCB0aGV5IHNob3VsZCBiZSBtYWlubHkgY29uc2lkZXJlZCBhcyBwcml2YXRlIG9iamVjdHMuIFRoZSBvbmx5IHBsYWNlIHRoZXkgc2hvdWxkIGJlIGludGVyYWN0ZWQgd2l0aCBpcyBpbiBgQmVoYXZpb3JgIGRlZmluaXRpb25zLCB0byB0ZXN0IHdoaWNoIGVsZW1lbnQgb2YgdGhlIHNoYXBlIGlzIHRoZSB0YXJnZXQgb2YgdGhlIGludGVyYWN0aW9uIGFuZCBkZWZpbmUgdGhlIGludGVyYWN0aW9uIGFjY29yZGluZyB0byB0aGF0IHRlc3QuXG4gKlxuICogRGVwZW5kaW5nIG9mIGl0cyBpbXBsZW1lbnRhdGlvbiBhIGBTaGFwZWAgY2FuIGJlIHVzZWQgYWxvbmcgd2l0aCBgZW50aXR5YCBvciBgY29sbGVjdGlvbmAgZGF0YSB0eXBlLiBTb21lIHNoYXBlcyBhcmUgdGhlbiBjcmVhdGVkIHRvIHVzZSBkYXRhIGNvbnNpZGVyZWQgYXMgYSBzaW5nbGUgZW50aXR5IChXYXZlZm9ybSwgVHJhY2VQYXRoLCBMaW5lKSwgd2hpbGUgb3RoZXJzIGFyZSBkZWZpbmVkIHRvIGJlIHVzZWQgd2l0aCBkYXRhIHNlZW4gYXMgYSBjb2xsZWN0aW9uLCBlYWNoIHNoYXBlIHJlbmRlcmluZyBhIHNpbmdsZSBlbnRyeSBvZiB0aGUgY29sbGVjdGlvbi4gVGhlIHNoYXBlcyB3b3JraW5nIHdpdGggZW50aXR5IHR5cGUgZGF0YSBzaG91bGQgdGhlcmVmb3JlIGJlIHVzZWQgaW4gYW4gYGVudGl0eWAgY29uZmlndXJlZCBgTGF5ZXJgLiBOb3RlIHRoYXQgaWYgdGhleSBhcmUgcmVnaXN0ZXJlZCBhcyBcImNvbW1vblNoYXBlXCIgaW4gYSBgY29sbGVjdGlvbmAgdHlwZSBgTGF5ZXJgLCB0aGV5IHdpbGwgYmVoYXZlIHRoZSBleGFjdCBzYW1lIHdheS4gVGhlc2Uga2luZCBvZiBzaGFwZXMgYXJlIG5vdGVkOiBcImVudGl0eSBzaGFwZVwiLlxuICpcbiAqIEF2YWlsYWJsZSBgY29sbGVjdGlvbmAgc2hhcGVzOlxuICogLSBNYXJrZXIgLyBBbm5vdGF0ZWQgTWFya2VyXG4gKiAtIFNlZ21lbnQgLyBBbm5vdGF0ZWQgU2VnbWVudFxuICogLSBEb3RcbiAqIC0gVHJhY2VEb3RzXG4gKlxuICogQXZhaWxhYmxlIGBlbnRpdHlgIHNoYXBlczpcbiAqIC0gTGluZVxuICogLSBUaWNrIChmb3IgYXhpcylcbiAqIC0gV2F2ZWZvcm1cbiAqIC0gVHJhY2VQYXRoXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VTaGFwZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIG92ZXJyaWRlIGRlZmF1bHQgY29uZmlndXJhdGlvblxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgLyoqIEB0eXBlIHtFbGVtZW50fSAtIFN2ZyBlbGVtZW50IHRvIGJlIHJldHVybmVkIGJ5IHRoZSBgcmVuZGVyYCBtZXRob2QuICovXG4gICAgdGhpcy4kZWwgPSBudWxsO1xuICAgIC8qKiBAdHlwZSB7U3RyaW5nfSAtIFN2ZyBuYW1lc3BhY2UuICovXG4gICAgdGhpcy5ucyA9IG5zO1xuICAgIC8qKiBAdHlwZSB7T2JqZWN0fSAtIE9iamVjdCBjb250YWluaW5nIHRoZSBnbG9iYWwgcGFyYW1ldGVycyBvZiB0aGUgc2hhcGUgKi9cbiAgICB0aGlzLnBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuX2dldERlZmF1bHRzKCksIG9wdGlvbnMpO1xuICAgIC8vIGNyZWF0ZSBhY2Nlc3NvcnMgbWV0aG9kcyBhbmQgc2V0IGRlZmF1bHQgYWNjZXNzb3IgZnVuY3Rpb25zXG4gICAgY29uc3QgYWNjZXNzb3JzID0gdGhpcy5fZ2V0QWNjZXNzb3JMaXN0KCk7XG4gICAgdGhpcy5fY3JlYXRlQWNjZXNzb3JzKGFjY2Vzc29ycyk7XG4gICAgdGhpcy5fc2V0RGVmYXVsdEFjY2Vzc29ycyhhY2Nlc3NvcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlc3Ryb3kgdGhlIHNoYXBlIGFuZCBjbGVhbiByZWZlcmVuY2VzLiBJbnRlcmZhY2UgbWV0aG9kIGNhbGxlZCBmcm9tIHRoZSBgbGF5ZXJgLlxuICAgKi9cbiAgZGVzdHJveSgpIHtcbiAgICAvLyB0aGlzLmdyb3VwID0gbnVsbDtcbiAgICB0aGlzLiRlbCA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogSW50ZXJmYWNlIG1ldGhvZCB0byBvdmVycmlkZSB3aGVuIGV4dGVuZGluZyB0aGlzIGJhc2UgY2xhc3MuIFRoZSBtZXRob2QgaXMgY2FsbGVkIGJ5IHRoZSBgTGF5ZXJ+cmVuZGVyYCBtZXRob2QuIFJldHVybnMgdGhlIG5hbWUgb2YgdGhlIHNoYXBlLCB1c2VkIGFzIGEgY2xhc3MgaW4gdGhlIGVsZW1lbnQgZ3JvdXAgKGRlZmF1bHRzIHRvIGAnc2hhcGUnYCkuXG4gICAqXG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICovXG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICdzaGFwZSc7IH1cblxuICAvKipcbiAgICogQHRvZG8gbm90IGltcGxlbWVudGVkXG4gICAqIGFsbG93IHRvIGluc3RhbGwgZGVmcyBpbiB0aGUgdHJhY2sgc3ZnIGVsZW1lbnQuIFNob3VsZCBiZSBjYWxsZWQgd2hlbiBhZGRpbmcgdGhlIGBMYXllcmAgdG8gdGhlIGBUcmFja2AuXG4gICAqXG4gICAqL1xuICAvLyBzZXRTdmdEZWZpbml0aW9uKGRlZnMpIHt9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGRlZmF1bHRzIGZvciBnbG9iYWwgY29uZmlndXJhdGlvbiBvZiB0aGUgc2hhcGUuXG4gICAqIEBwcm90ZWN0ZWRcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIG9iamVjdCB3aGVyZSBrZXlzIGFyZSB0aGUgYWNjZXNzb3JzIG1ldGhvZHMgbmFtZXMgdG8gY3JlYXRlIGFuZCB2YWx1ZXMgYXJlIHRoZSBkZWZhdWx0IHZhbHVlcyBmb3IgZWFjaCBnaXZlbiBhY2Nlc3Nvci5cbiAgICpcbiAgICogQHByb3RlY3RlZFxuICAgKiBAdG9kbyByZW5hbWUgP1xuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqL1xuICBfZ2V0QWNjZXNzb3JMaXN0KCkgeyByZXR1cm4ge307IH1cblxuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgbWV0aG9kIGNhbGxlZCBieSBMYXllciB3aGVuIGNyZWF0aW5nIGEgc2hhcGUuIEluc3RhbGwgdGhlIGdpdmVuIGFjY2Vzc29ycyBvbiB0aGUgc2hhcGUsIG92ZXJyaWRpbmcgdGhlIGRlZmF1bHQgYWNjZXNzb3JzLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdDxTdHJpbmcsIGZ1bmN0aW9uPn0gYWNjZXNzb3JzXG4gICAqL1xuICBpbnN0YWxsKGFjY2Vzc29ycykge1xuICAgIGZvciAobGV0IGtleSBpbiBhY2Nlc3NvcnMpIHsgdGhpc1trZXldID0gYWNjZXNzb3JzW2tleV07IH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmljIG1ldGhvZCB0byBjcmVhdGUgYWNjZXNzb3JzLiBBZGRzIGdldHRlcnMgZW4gc2V0dGVycyB0byB0aGUgcHJvdG90eXBlIGlmIG5vdCBhbHJlYWR5IHByZXNlbnQuXG4gICAqL1xuICBfY3JlYXRlQWNjZXNzb3JzKGFjY2Vzc29ycykge1xuICAgIHRoaXMuX2FjY2Vzc29ycyA9IHt9O1xuICAgIC8vIGFkZCBpdCB0byB0aGUgcHJvdG90eXBlXG4gICAgY29uc3QgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpcyk7XG4gICAgLy8gY3JlYXRlIGEgZ2V0dGVyIC8gc2V0dGVyIGZvciBlYWNoIGFjY2Vzc29yc1xuICAgIC8vIHNldHRlciA6IGB0aGlzLnggPSBjYWxsYmFja2BcbiAgICAvLyBnZXR0ZXIgOiBgdGhpcy54KGRhdHVtKWBcbiAgICBPYmplY3Qua2V5cyhhY2Nlc3NvcnMpLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgIGlmIChwcm90by5oYXNPd25Qcm9wZXJ0eShuYW1lKSkgeyByZXR1cm47IH1cblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3RvLCBuYW1lLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9hY2Nlc3NvcnNbbmFtZV07IH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24oZnVuYykge1xuICAgICAgICAgIHRoaXMuX2FjY2Vzc29yc1tuYW1lXSA9IGZ1bmM7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIGZ1bmN0aW9uIHRvIGJlIHVzZWQgYXMgYSBkZWZhdWx0IGFjY2Vzc29yIGZvciBlYWNoIGFjY2Vzb3JzXG4gICAqL1xuICBfc2V0RGVmYXVsdEFjY2Vzc29ycyhhY2Nlc3NvcnMpIHtcbiAgICBPYmplY3Qua2V5cyhhY2Nlc3NvcnMpLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgIGNvbnN0IGRlZmF1bHRWYWx1ZSA9IGFjY2Vzc29yc1tuYW1lXTtcbiAgICAgIGxldCBhY2Nlc3NvciA9IGZ1bmN0aW9uKGQsIHYgPSBudWxsKSB7XG4gICAgICAgIGlmICh2ID09PSBudWxsKSB7IHJldHVybiBkW25hbWVdIHx8IGRlZmF1bHRWYWx1ZTsgfVxuICAgICAgICBkW25hbWVdID0gdjtcbiAgICAgIH07XG4gICAgICAvLyBzZXQgYWNjZXNzb3IgYXMgdGhlIGRlZmF1bHQgb25lXG4gICAgICB0aGlzW25hbWVdID0gYWNjZXNzb3I7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSW50ZXJmYWNlIG1ldGhvZCBjYWxsZWQgYnkgYExheWVyfnJlbmRlcmAuIENyZWF0ZXMgdGhlIERPTSBzdHJ1Y3R1cmUgb2YgdGhlIHNoYXBlLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcmVuZGVyaW5nQ29udGV4dCAtIHRoZSByZW5kZXJpbmdDb250ZXh0IG9mIHRoZSBsYXllciB3aGljaCBvd25zIHRoaXMgc2hhcGUuXG4gICAqIEByZXR1cm4ge0VsZW1lbnR9IC0gdGhlIERPTSBlbGVtZW50IHRvIGluc2VydCBpbiB0aGUgaXRlbSdzIGdyb3VwLlxuICAgKi9cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHt9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgY2FsbGVkIGJ5IGBMYXllcn51cGRhdGVgLiBVcGRhdGVzIHRoZSBET00gc3RydWN0dXJlIG9mIHRoZSBzaGFwZS5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHJlbmRlcmluZ0NvbnRleHQgLSBUaGUgYHJlbmRlcmluZ0NvbnRleHRgIG9mIHRoZSBsYXllciB3aGljaCBvd25zIHRoaXMgc2hhcGUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBkYXR1bSAtIFRoZSBkYXR1bSBhc3NvY2lhdGVkIHRvIHRoZSBzaGFwZS5cbiAgICovXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSkge31cblxuICAvKipcbiAgICogSW50ZXJmYWNlIG1ldGhvZCB0byBvdmVycmlkZSBjYWxsZWQgYnkgYExheWVyfmdldEl0ZW1zSW5BcmVhYC4gRGVmaW5lcyBpZiB0aGUgc2hhcGUgaXMgY29uc2lkZXJlZCB0byBiZSB0aGUgZ2l2ZW4gYXJlYS4gQXJndW1lbnRzIGFyZSBwYXNzZWQgaW4gcGl4ZWwgZG9tYWluLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcmVuZGVyaW5nQ29udGV4dCAtIHRoZSByZW5kZXJpbmdDb250ZXh0IG9mIHRoZSBsYXllciB3aGljaCBvd25zIHRoaXMgc2hhcGUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBkYXR1bSAtIFRoZSBkYXR1bSBhc3NvY2lhdGVkIHRvIHRoZSBzaGFwZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHgxIC0gVGhlIHggY29tcG9uZW50IG9mIHRoZSB0b3AtbGVmdCBjb3JuZXIgb2YgdGhlIGFyZWEgdG8gdGVzdC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHkxIC0gVGhlIHkgY29tcG9uZW50IG9mIHRoZSB0b3AtbGVmdCBjb3JuZXIgb2YgdGhlIGFyZWEgdG8gdGVzdC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHgyIC0gVGhlIHggY29tcG9uZW50IG9mIHRoZSBib3R0b20tcmlnaHQgY29ybmVyIG9mIHRoZSBhcmVhIHRvIHRlc3QuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB5MiAtIFRoZSB5IGNvbXBvbmVudCBvZiB0aGUgYm90dG9tLXJpZ2h0IGNvcm5lciBvZiB0aGUgYXJlYSB0byB0ZXN0LlxuICAgKiBAcmV0dXJuIHtCb29sZWFufSAtIFJldHVybnMgYHRydWVgIGlmIHRoZSBpcyBjb25zaWRlcmVkIHRvIGJlIGluIHRoZSBnaXZlbiBhcmVhLCBgZmFsc2VgIG90aGVyd2lzZS5cbiAgICovXG4gIGluQXJlYShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSwgeDEsIHkxLCB4MiwgeTIpIHt9XG59XG4iXX0=