'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _namespace = require('../core/namespace');

var _namespace2 = _interopRequireDefault(_namespace);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
var BaseShape = function () {
  /**
   * @param {Object} options - override default configuration
   */
  function BaseShape() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, BaseShape);

    /** @type {Element} - Svg element to be returned by the `render` method. */
    this.$el = null;
    /** @type {String} - Svg namespace. */
    this.ns = _namespace2.default;
    /** @type {Object} - Object containing the global parameters of the shape */
    this.params = (0, _assign2.default)({}, this._getDefaults(), options);
    // create accessors methods and set default accessor functions
    var accessors = this._getAccessorList();
    this._createAccessors(accessors);
    this._setDefaultAccessors(accessors);
  }

  /**
   * Destroy the shape and clean references. Interface method called from the `layer`.
   */


  (0, _createClass3.default)(BaseShape, [{
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
      var proto = (0, _getPrototypeOf2.default)(this);
      // create a getter / setter for each accessors
      // setter : `this.x = callback`
      // getter : `this.x(datum)`
      (0, _keys2.default)(accessors).forEach(function (name) {
        if (proto.hasOwnProperty(name)) {
          return;
        }

        (0, _defineProperty2.default)(proto, name, {
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

      (0, _keys2.default)(accessors).forEach(function (name) {
        var defaultValue = accessors[name];
        var accessor = function accessor(d) {
          var v = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

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
}();

exports.default = BaseShape;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJhc2VTaGFwZS5qcyJdLCJuYW1lcyI6WyJCYXNlU2hhcGUiLCJvcHRpb25zIiwiJGVsIiwibnMiLCJwYXJhbXMiLCJfZ2V0RGVmYXVsdHMiLCJhY2Nlc3NvcnMiLCJfZ2V0QWNjZXNzb3JMaXN0IiwiX2NyZWF0ZUFjY2Vzc29ycyIsIl9zZXREZWZhdWx0QWNjZXNzb3JzIiwia2V5IiwiX2FjY2Vzc29ycyIsInByb3RvIiwiZm9yRWFjaCIsIm5hbWUiLCJoYXNPd25Qcm9wZXJ0eSIsImdldCIsInNldCIsImZ1bmMiLCJkZWZhdWx0VmFsdWUiLCJhY2Nlc3NvciIsImQiLCJ2IiwicmVuZGVyaW5nQ29udGV4dCIsImRhdHVtIiwieDEiLCJ5MSIsIngyIiwieTIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFHQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFnQ01BLFM7QUFDSjs7O0FBR0EsdUJBQTBCO0FBQUEsUUFBZEMsT0FBYyx1RUFBSixFQUFJO0FBQUE7O0FBQ3hCO0FBQ0EsU0FBS0MsR0FBTCxHQUFXLElBQVg7QUFDQTtBQUNBLFNBQUtDLEVBQUw7QUFDQTtBQUNBLFNBQUtDLE1BQUwsR0FBYyxzQkFBYyxFQUFkLEVBQWtCLEtBQUtDLFlBQUwsRUFBbEIsRUFBdUNKLE9BQXZDLENBQWQ7QUFDQTtBQUNBLFFBQU1LLFlBQVksS0FBS0MsZ0JBQUwsRUFBbEI7QUFDQSxTQUFLQyxnQkFBTCxDQUFzQkYsU0FBdEI7QUFDQSxTQUFLRyxvQkFBTCxDQUEwQkgsU0FBMUI7QUFDRDs7QUFFRDs7Ozs7Ozs4QkFHVTtBQUNSO0FBQ0EsV0FBS0osR0FBTCxHQUFXLElBQVg7QUFDRDs7QUFFRDs7Ozs7Ozs7OzttQ0FPZTtBQUFFLGFBQU8sT0FBUDtBQUFpQjs7QUFFbEM7Ozs7O0FBS0E7O0FBRUE7Ozs7Ozs7O21DQUtlO0FBQ2IsYUFBTyxFQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7O3VDQVFtQjtBQUFFLGFBQU8sRUFBUDtBQUFZOztBQUdqQzs7Ozs7Ozs7OzRCQU1RSSxTLEVBQVc7QUFDakIsV0FBSyxJQUFJSSxHQUFULElBQWdCSixTQUFoQixFQUEyQjtBQUFFLGFBQUtJLEdBQUwsSUFBWUosVUFBVUksR0FBVixDQUFaO0FBQTZCO0FBQzNEOztBQUVEOzs7Ozs7O3FDQUlpQkosUyxFQUFXO0FBQzFCLFdBQUtLLFVBQUwsR0FBa0IsRUFBbEI7QUFDQTtBQUNBLFVBQU1DLFFBQVEsOEJBQXNCLElBQXRCLENBQWQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBWU4sU0FBWixFQUF1Qk8sT0FBdkIsQ0FBK0IsVUFBQ0MsSUFBRCxFQUFVO0FBQ3ZDLFlBQUlGLE1BQU1HLGNBQU4sQ0FBcUJELElBQXJCLENBQUosRUFBZ0M7QUFBRTtBQUFTOztBQUUzQyxzQ0FBc0JGLEtBQXRCLEVBQTZCRSxJQUE3QixFQUFtQztBQUNqQ0UsZUFBSyxlQUFXO0FBQUUsbUJBQU8sS0FBS0wsVUFBTCxDQUFnQkcsSUFBaEIsQ0FBUDtBQUErQixXQURoQjtBQUVqQ0csZUFBSyxhQUFTQyxJQUFULEVBQWU7QUFDbEIsaUJBQUtQLFVBQUwsQ0FBZ0JHLElBQWhCLElBQXdCSSxJQUF4QjtBQUNEO0FBSmdDLFNBQW5DO0FBTUQsT0FURDtBQVVEOztBQUVEOzs7Ozs7eUNBR3FCWixTLEVBQVc7QUFBQTs7QUFDOUIsMEJBQVlBLFNBQVosRUFBdUJPLE9BQXZCLENBQStCLFVBQUNDLElBQUQsRUFBVTtBQUN2QyxZQUFNSyxlQUFlYixVQUFVUSxJQUFWLENBQXJCO0FBQ0EsWUFBSU0sV0FBVyxTQUFYQSxRQUFXLENBQVNDLENBQVQsRUFBc0I7QUFBQSxjQUFWQyxDQUFVLHVFQUFOLElBQU07O0FBQ25DLGNBQUlBLE1BQU0sSUFBVixFQUFnQjtBQUFFLG1CQUFPRCxFQUFFUCxJQUFGLEtBQVdLLFlBQWxCO0FBQWlDO0FBQ25ERSxZQUFFUCxJQUFGLElBQVVRLENBQVY7QUFDRCxTQUhEO0FBSUE7QUFDQSxjQUFLUixJQUFMLElBQWFNLFFBQWI7QUFDRCxPQVJEO0FBU0Q7O0FBRUQ7Ozs7Ozs7Ozs7OzJCQVFPRyxnQixFQUFrQixDQUFFOztBQUUzQjs7Ozs7Ozs7OzsyQkFPT0EsZ0IsRUFBa0JDLEssRUFBTyxDQUFFOztBQUVsQzs7Ozs7Ozs7Ozs7Ozs7OzsyQkFhT0QsZ0IsRUFBa0JDLEssRUFBT0MsRSxFQUFJQyxFLEVBQUlDLEUsRUFBSUMsRSxFQUFJLENBQUU7Ozs7O2tCQUdyQzVCLFMiLCJmaWxlIjoiQmFzZVNoYXBlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG5zIGZyb20gJy4uL2NvcmUvbmFtZXNwYWNlJztcblxuXG4vKipcbiAqIElzIGFuIGFic3RyYWN0IGNsYXNzIG9yIGludGVyZmFjZSB0byBiZSBvdmVycmlkZW4gaW4gb3JkZXIgdG8gZGVmaW5lIG5ld1xuICogc2hhcGVzLiBTaGFwZXMgZGVmaW5lIHRoZSB3YXkgYSBnaXZlbiBkYXR1bSBzaG91bGQgYmUgcmVuZGVyZWQsIHRoZXkgYXJlXG4gKiB0aGUgc21hbGxlc3QgdW5pdCBvZiByZW5kZXJpbmcgaW50byBhIHRpbWVsaW5lLlxuICpcbiAqIEFsbCB0aGUgbGlmZSBjeWNsZSBvZiBgU2hhcGVgIGluc3RhbmNlcyBpcyBoYW5kbGVkIGludG8gdGhlIGBMYXllcmAgaW5zdGFuY2VcbiAqIHRoZXkgYXJlIGF0dGFjaCB0by4gQXMgYSBjb25zZXF1ZW5jZSwgdGhleSBzaG91bGQgYmUgbWFpbmx5IGNvbnNpZGVyZWQgYXNcbiAqIHByaXZhdGUgb2JqZWN0cy4gVGhlIG9ubHkgcGxhY2UgdGhleSBzaG91bGQgYmUgaW50ZXJhY3RlZCB3aXRoIGlzIGluIGBCZWhhdmlvcmBcbiAqIGRlZmluaXRpb25zLCB0byB0ZXN0IHdoaWNoIGVsZW1lbnQgb2YgdGhlIHNoYXBlIGlzIHRoZSB0YXJnZXQgb2YgdGhlXG4gKiBpbnRlcmFjdGlvbiBhbmQgZGVmaW5lIHRoZSBpbnRlcmFjdGlvbiBhY2NvcmRpbmcgdG8gdGhhdCB0ZXN0LlxuICpcbiAqIERlcGVuZGluZyBvZiBpdHMgaW1wbGVtZW50YXRpb24gYSBgU2hhcGVgIGNhbiBiZSB1c2VkIGFsb25nIHdpdGggYGVudGl0eWAgb3JcbiAqIGBjb2xsZWN0aW9uYCBkYXRhIHR5cGUuIFNvbWUgc2hhcGVzIGFyZSB0aGVuIGNyZWF0ZWQgdG8gdXNlIGRhdGEgY29uc2lkZXJlZFxuICogYXMgYSBzaW5nbGUgZW50aXR5IChXYXZlZm9ybSwgVHJhY2VQYXRoLCBMaW5lKSwgd2hpbGUgb3RoZXJzIGFyZSBkZWZpbmVkIHRvXG4gKiBiZSB1c2VkIHdpdGggZGF0YSBzZWVuIGFzIGEgY29sbGVjdGlvbiwgZWFjaCBzaGFwZSByZW5kZXJpbmcgYSBzaW5nbGUgZW50cnlcbiAqIG9mIHRoZSBjb2xsZWN0aW9uLiBUaGUgc2hhcGVzIHdvcmtpbmcgd2l0aCBlbnRpdHkgdHlwZSBkYXRhIHNob3VsZCB0aGVyZWZvcmVcbiAqIGJlIHVzZWQgaW4gYW4gYGVudGl0eWAgY29uZmlndXJlZCBgTGF5ZXJgLiBOb3RlIHRoYXQgaWYgdGhleSBhcmUgcmVnaXN0ZXJlZFxuICogYXMgXCJjb21tb25TaGFwZVwiIGluIGEgYGNvbGxlY3Rpb25gIHR5cGUgYExheWVyYCwgdGhleSB3aWxsIGJlaGF2ZSB0aGUgZXhhY3RcbiAqIHNhbWUgd2F5LiBUaGVzZSBraW5kIG9mIHNoYXBlcyBhcmUgbm90ZWQ6IFwiZW50aXR5IHNoYXBlXCIuXG4gKlxuICogIyMjIEF2YWlsYWJsZSBgY29sbGVjdGlvbmAgc2hhcGVzOlxuICogLSBNYXJrZXIgLyBBbm5vdGF0ZWQgTWFya2VyXG4gKiAtIFNlZ21lbnQgLyBBbm5vdGF0ZWQgU2VnbWVudFxuICogLSBEb3RcbiAqIC0gVHJhY2VEb3RzXG4gKlxuICogIyMjIEF2YWlsYWJsZSBgZW50aXR5YCBzaGFwZXM6XG4gKiAtIExpbmVcbiAqIC0gVGljayAoZm9yIGF4aXMpXG4gKiAtIFdhdmVmb3JtXG4gKiAtIFRyYWNlUGF0aFxuICovXG5jbGFzcyBCYXNlU2hhcGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBvdmVycmlkZSBkZWZhdWx0IGNvbmZpZ3VyYXRpb25cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIC8qKiBAdHlwZSB7RWxlbWVudH0gLSBTdmcgZWxlbWVudCB0byBiZSByZXR1cm5lZCBieSB0aGUgYHJlbmRlcmAgbWV0aG9kLiAqL1xuICAgIHRoaXMuJGVsID0gbnVsbDtcbiAgICAvKiogQHR5cGUge1N0cmluZ30gLSBTdmcgbmFtZXNwYWNlLiAqL1xuICAgIHRoaXMubnMgPSBucztcbiAgICAvKiogQHR5cGUge09iamVjdH0gLSBPYmplY3QgY29udGFpbmluZyB0aGUgZ2xvYmFsIHBhcmFtZXRlcnMgb2YgdGhlIHNoYXBlICovXG4gICAgdGhpcy5wYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9nZXREZWZhdWx0cygpLCBvcHRpb25zKTtcbiAgICAvLyBjcmVhdGUgYWNjZXNzb3JzIG1ldGhvZHMgYW5kIHNldCBkZWZhdWx0IGFjY2Vzc29yIGZ1bmN0aW9uc1xuICAgIGNvbnN0IGFjY2Vzc29ycyA9IHRoaXMuX2dldEFjY2Vzc29yTGlzdCgpO1xuICAgIHRoaXMuX2NyZWF0ZUFjY2Vzc29ycyhhY2Nlc3NvcnMpO1xuICAgIHRoaXMuX3NldERlZmF1bHRBY2Nlc3NvcnMoYWNjZXNzb3JzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95IHRoZSBzaGFwZSBhbmQgY2xlYW4gcmVmZXJlbmNlcy4gSW50ZXJmYWNlIG1ldGhvZCBjYWxsZWQgZnJvbSB0aGUgYGxheWVyYC5cbiAgICovXG4gIGRlc3Ryb3koKSB7XG4gICAgLy8gdGhpcy5ncm91cCA9IG51bGw7XG4gICAgdGhpcy4kZWwgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgdG8gb3ZlcnJpZGUgd2hlbiBleHRlbmRpbmcgdGhpcyBiYXNlIGNsYXNzLiBUaGUgbWV0aG9kXG4gICAqIGlzIGNhbGxlZCBieSB0aGUgYExheWVyfnJlbmRlcmAgbWV0aG9kLiBSZXR1cm5zIHRoZSBuYW1lIG9mIHRoZSBzaGFwZSxcbiAgICogdXNlZCBhcyBhIGNsYXNzIGluIHRoZSBlbGVtZW50IGdyb3VwIChkZWZhdWx0cyB0byBgJ3NoYXBlJ2ApLlxuICAgKlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAnc2hhcGUnOyB9XG5cbiAgLyoqXG4gICAqIEB0b2RvIG5vdCBpbXBsZW1lbnRlZFxuICAgKiBhbGxvdyB0byBpbnN0YWxsIGRlZnMgaW4gdGhlIHRyYWNrIHN2ZyBlbGVtZW50LiBTaG91bGQgYmUgY2FsbGVkIHdoZW5cbiAgICogYWRkaW5nIHRoZSBgTGF5ZXJgIHRvIHRoZSBgVHJhY2tgLlxuICAgKi9cbiAgLy8gc2V0U3ZnRGVmaW5pdGlvbihkZWZzKSB7fVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBkZWZhdWx0cyBmb3IgZ2xvYmFsIGNvbmZpZ3VyYXRpb24gb2YgdGhlIHNoYXBlLlxuICAgKiBAcHJvdGVjdGVkXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBvYmplY3Qgd2hlcmUga2V5cyBhcmUgdGhlIGFjY2Vzc29ycyBtZXRob2RzIG5hbWVzIHRvIGNyZWF0ZVxuICAgKiBhbmQgdmFsdWVzIGFyZSB0aGUgZGVmYXVsdCB2YWx1ZXMgZm9yIGVhY2ggZ2l2ZW4gYWNjZXNzb3IuXG4gICAqXG4gICAqIEBwcm90ZWN0ZWRcbiAgICogQHRvZG8gcmVuYW1lID9cbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHsgcmV0dXJuIHt9OyB9XG5cblxuICAvKipcbiAgICogSW50ZXJmYWNlIG1ldGhvZCBjYWxsZWQgYnkgTGF5ZXIgd2hlbiBjcmVhdGluZyBhIHNoYXBlLiBJbnN0YWxsIHRoZVxuICAgKiBnaXZlbiBhY2Nlc3NvcnMgb24gdGhlIHNoYXBlLCBvdmVycmlkaW5nIHRoZSBkZWZhdWx0IGFjY2Vzc29ycy5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3Q8U3RyaW5nLCBmdW5jdGlvbj59IGFjY2Vzc29yc1xuICAgKi9cbiAgaW5zdGFsbChhY2Nlc3NvcnMpIHtcbiAgICBmb3IgKGxldCBrZXkgaW4gYWNjZXNzb3JzKSB7IHRoaXNba2V5XSA9IGFjY2Vzc29yc1trZXldOyB9XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJpYyBtZXRob2QgdG8gY3JlYXRlIGFjY2Vzc29ycy4gQWRkcyBnZXR0ZXJzIGVuIHNldHRlcnMgdG8gdGhlXG4gICAqIHByb3RvdHlwZSBpZiBub3QgYWxyZWFkeSBwcmVzZW50LlxuICAgKi9cbiAgX2NyZWF0ZUFjY2Vzc29ycyhhY2Nlc3NvcnMpIHtcbiAgICB0aGlzLl9hY2Nlc3NvcnMgPSB7fTtcbiAgICAvLyBhZGQgaXQgdG8gdGhlIHByb3RvdHlwZVxuICAgIGNvbnN0IHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMpO1xuICAgIC8vIGNyZWF0ZSBhIGdldHRlciAvIHNldHRlciBmb3IgZWFjaCBhY2Nlc3NvcnNcbiAgICAvLyBzZXR0ZXIgOiBgdGhpcy54ID0gY2FsbGJhY2tgXG4gICAgLy8gZ2V0dGVyIDogYHRoaXMueChkYXR1bSlgXG4gICAgT2JqZWN0LmtleXMoYWNjZXNzb3JzKS5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgICBpZiAocHJvdG8uaGFzT3duUHJvcGVydHkobmFtZSkpIHsgcmV0dXJuOyB9XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm90bywgbmFtZSwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fYWNjZXNzb3JzW25hbWVdOyB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICAgICAgICB0aGlzLl9hY2Nlc3NvcnNbbmFtZV0gPSBmdW5jO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBmdW5jdGlvbiB0byBiZSB1c2VkIGFzIGEgZGVmYXVsdCBhY2Nlc3NvciBmb3IgZWFjaCBhY2Nlc29yc1xuICAgKi9cbiAgX3NldERlZmF1bHRBY2Nlc3NvcnMoYWNjZXNzb3JzKSB7XG4gICAgT2JqZWN0LmtleXMoYWNjZXNzb3JzKS5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgICBjb25zdCBkZWZhdWx0VmFsdWUgPSBhY2Nlc3NvcnNbbmFtZV07XG4gICAgICBsZXQgYWNjZXNzb3IgPSBmdW5jdGlvbihkLCB2ID0gbnVsbCkge1xuICAgICAgICBpZiAodiA9PT0gbnVsbCkgeyByZXR1cm4gZFtuYW1lXSB8fCBkZWZhdWx0VmFsdWU7IH1cbiAgICAgICAgZFtuYW1lXSA9IHY7XG4gICAgICB9O1xuICAgICAgLy8gc2V0IGFjY2Vzc29yIGFzIHRoZSBkZWZhdWx0IG9uZVxuICAgICAgdGhpc1tuYW1lXSA9IGFjY2Vzc29yO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgY2FsbGVkIGJ5IGBMYXllcn5yZW5kZXJgLiBDcmVhdGVzIHRoZSBET00gc3RydWN0dXJlIG9mXG4gICAqIHRoZSBzaGFwZS5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHJlbmRlcmluZ0NvbnRleHQgLSB0aGUgcmVuZGVyaW5nQ29udGV4dCBvZiB0aGUgbGF5ZXJcbiAgICogICAgd2hpY2ggb3ducyB0aGlzIHNoYXBlLlxuICAgKiBAcmV0dXJuIHtFbGVtZW50fSAtIHRoZSBET00gZWxlbWVudCB0byBpbnNlcnQgaW4gdGhlIGl0ZW0ncyBncm91cC5cbiAgICovXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7fVxuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgbWV0aG9kIGNhbGxlZCBieSBgTGF5ZXJ+dXBkYXRlYC4gVXBkYXRlcyB0aGUgRE9NIHN0cnVjdHVyZSBvZiB0aGUgc2hhcGUuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByZW5kZXJpbmdDb250ZXh0IC0gVGhlIGByZW5kZXJpbmdDb250ZXh0YCBvZiB0aGUgbGF5ZXJcbiAgICogICAgd2hpY2ggb3ducyB0aGlzIHNoYXBlLlxuICAgKiBAcGFyYW0ge09iamVjdHxBcnJheX0gZGF0dW0gLSBUaGUgZGF0dW0gYXNzb2NpYXRlZCB0byB0aGUgc2hhcGUuXG4gICAqL1xuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0pIHt9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgdG8gb3ZlcnJpZGUgY2FsbGVkIGJ5IGBMYXllcn5nZXRJdGVtc0luQXJlYWAuIERlZmluZXMgaWZcbiAgICogdGhlIHNoYXBlIGlzIGNvbnNpZGVyZWQgdG8gYmUgdGhlIGdpdmVuIGFyZWEuIEFyZ3VtZW50cyBhcmUgcGFzc2VkIGluIHBpeGVsIGRvbWFpbi5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHJlbmRlcmluZ0NvbnRleHQgLSB0aGUgcmVuZGVyaW5nQ29udGV4dCBvZiB0aGUgbGF5ZXIgd2hpY2hcbiAgICogICAgb3ducyB0aGlzIHNoYXBlLlxuICAgKiBAcGFyYW0ge09iamVjdHxBcnJheX0gZGF0dW0gLSBUaGUgZGF0dW0gYXNzb2NpYXRlZCB0byB0aGUgc2hhcGUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB4MSAtIFRoZSB4IGNvbXBvbmVudCBvZiB0aGUgdG9wLWxlZnQgY29ybmVyIG9mIHRoZSBhcmVhIHRvIHRlc3QuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB5MSAtIFRoZSB5IGNvbXBvbmVudCBvZiB0aGUgdG9wLWxlZnQgY29ybmVyIG9mIHRoZSBhcmVhIHRvIHRlc3QuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB4MiAtIFRoZSB4IGNvbXBvbmVudCBvZiB0aGUgYm90dG9tLXJpZ2h0IGNvcm5lciBvZiB0aGUgYXJlYSB0byB0ZXN0LlxuICAgKiBAcGFyYW0ge051bWJlcn0geTIgLSBUaGUgeSBjb21wb25lbnQgb2YgdGhlIGJvdHRvbS1yaWdodCBjb3JuZXIgb2YgdGhlIGFyZWEgdG8gdGVzdC5cbiAgICogQHJldHVybiB7Qm9vbGVhbn0gLSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgaXMgY29uc2lkZXJlZCB0byBiZSBpbiB0aGUgZ2l2ZW4gYXJlYSwgYGZhbHNlYCBvdGhlcndpc2UuXG4gICAqL1xuICBpbkFyZWEocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0sIHgxLCB5MSwgeDIsIHkyKSB7fVxufVxuXG5leHBvcnQgZGVmYXVsdCBCYXNlU2hhcGU7XG4iXX0=