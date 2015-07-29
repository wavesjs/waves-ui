'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

var _coreNamespace = require('../core/namespace');

var _coreNamespace2 = _interopRequireDefault(_coreNamespace);

// @NOTE: accessors should receive datum index as argument
// to allow the use of sampleRate to define x position

var BaseShape = (function () {
  /**
   *  @param options {Object} override default configuration
   */

  function BaseShape() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, BaseShape);

    this.$el = null;
    this.ns = _coreNamespace2['default'];
    this.params = _Object$assign({}, this._getDefaults(), options);
    // create accessors methods and set default accessor functions
    var accessors = this._getAccessorList();
    this._createAccessors(accessors);
    this._setDefaultAccessors(accessors);
  }

  _createClass(BaseShape, [{
    key: '_getDefaults',
    value: function _getDefaults() {
      return {};
    }
  }, {
    key: 'destroy',

    /**
     *  clean references, is called from the `layer`
     */
    value: function destroy() {
      // this.group = null;
      this.$el = null;
    }
  }, {
    key: 'getClassName',

    /**
     * @return {String} the name of the shape, used as a class in the element group
     */
    value: function getClassName() {
      return 'shape';
    }
  }, {
    key: '_getAccessorList',

    // should only be called once
    // setSvgDefinition(defs) {}

    /**
     * @TODO rename
     * @return {Object}
     *    keys are the accessors methods names to create
     *    values are the default values for each given accessor
     */
    value: function _getAccessorList() {
      return {};
    }
  }, {
    key: 'install',

    /**
     *  install the given accessors on the shape
     */
    value: function install(accessors) {
      for (var key in accessors) {
        this[key] = accessors[key];
      }
    }
  }, {
    key: '_createAccessors',

    /**
     * generic method to create accessors
     * adds accessor to the prototype if not already present
     */
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
  }, {
    key: '_setDefaultAccessors',

    /**
     * create a function to be used as a default
     * accessor for each accesors
     */
    value: function _setDefaultAccessors(accessors) {
      var _this = this;

      _Object$keys(accessors).forEach(function (name) {
        var defaultValue = accessors[name];
        var accessor = function accessor(d) {
          var v = arguments[1] === undefined ? null : arguments[1];

          if (v === null) {
            return d[name] || defaultValue;
          }
          d[name] = v;
        };
        // set accessor as the default one
        _this[name] = accessor;
      });
    }
  }, {
    key: 'render',

    /**
     * @param  renderingContext {Context} the renderingContext the layer which owns this item
     * @return  {DOMElement} the DOM element to insert in the item's group
     */
    value: function render(renderingContext) {}
  }, {
    key: 'update',

    /**
     * @param  group {DOMElement} group of the item in which the shape is drawn
     * @param  renderingContext {Context} the renderingContext the layer which owns this item
     * @param
     *    simpleShape : datum {Object} the datum related to this item's group
     *    commonShape : datum {Array} the associated to the Layer
     * @param
     *    simpleShape : index {Number} the current index of the datum
     *    commonShape : undefined
     * @return  void
     */
    value: function update(renderingContext, datum, index) {}
  }, {
    key: 'inArea',

    /**
     *  define if the shape is considered to be the given area
     *  arguments are passed in domain unit (time, whatever)
     *  @return {Boolean}
     */
    value: function inArea(renderingContext, datum, x1, y1, x2, y2) {}
  }]);

  return BaseShape;
})();

exports['default'] = BaseShape;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OzZCQUFlLG1CQUFtQjs7Ozs7OztJQU1iLFNBQVM7Ozs7O0FBSWpCLFdBSlEsU0FBUyxHQUlGO1FBQWQsT0FBTyxnQ0FBRyxFQUFFOzswQkFKTCxTQUFTOztBQUsxQixRQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztBQUNoQixRQUFJLENBQUMsRUFBRSw2QkFBSyxDQUFDO0FBQ2IsUUFBSSxDQUFDLE1BQU0sR0FBRyxlQUFjLEVBQUUsRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRTlELFFBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0FBQzFDLFFBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNqQyxRQUFJLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUM7R0FDdEM7O2VBWmtCLFNBQVM7O1dBY2hCLHdCQUFHO0FBQ2IsYUFBTyxFQUFFLENBQUM7S0FDWDs7Ozs7OztXQUtNLG1CQUFHOztBQUVSLFVBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO0tBQ2pCOzs7Ozs7O1dBS1csd0JBQUc7QUFBRSxhQUFPLE9BQU8sQ0FBQztLQUFFOzs7Ozs7Ozs7Ozs7O1dBV2xCLDRCQUFHO0FBQUUsYUFBTyxFQUFFLENBQUM7S0FBRTs7Ozs7OztXQU0xQixpQkFBQyxTQUFTLEVBQUU7QUFDakIsV0FBSyxJQUFJLEdBQUcsSUFBSSxTQUFTLEVBQUU7QUFBRSxZQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQUU7S0FDM0Q7Ozs7Ozs7O1dBTWUsMEJBQUMsU0FBUyxFQUFFO0FBQzFCLFVBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDOztBQUVyQixVQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDOzs7O0FBSTFDLG1CQUFZLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSztBQUN2QyxZQUFJLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFBRSxpQkFBTztTQUFFOztBQUUzQywrQkFBc0IsS0FBSyxFQUFFLElBQUksRUFBRTtBQUNqQyxhQUFHLEVBQUUsZUFBVztBQUFFLG1CQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7V0FBRTtBQUNqRCxhQUFHLEVBQUUsYUFBUyxJQUFJLEVBQUU7QUFDbEIsZ0JBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO1dBQzlCO1NBQ0YsQ0FBQyxDQUFDO09BQ0osQ0FBQyxDQUFDO0tBQ0o7Ozs7Ozs7O1dBTW1CLDhCQUFDLFNBQVMsRUFBRTs7O0FBQzlCLG1CQUFZLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSztBQUN2QyxZQUFNLFlBQVksR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDckMsWUFBSSxRQUFRLEdBQUcsU0FBWCxRQUFRLENBQVksQ0FBQyxFQUFZO2NBQVYsQ0FBQyxnQ0FBRyxJQUFJOztBQUNqQyxjQUFJLENBQUMsS0FBSyxJQUFJLEVBQUU7QUFBRSxtQkFBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksWUFBWSxDQUFDO1dBQUU7QUFDbkQsV0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNiLENBQUM7O0FBRUYsY0FBSyxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUM7T0FDdkIsQ0FBQyxDQUFDO0tBQ0o7Ozs7Ozs7O1dBTUssZ0JBQUMsZ0JBQWdCLEVBQUUsRUFBRTs7Ozs7Ozs7Ozs7Ozs7O1dBYXJCLGdCQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRTs7Ozs7Ozs7O1dBT25DLGdCQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTs7O1NBakgvQixTQUFTOzs7cUJBQVQsU0FBUyIsImZpbGUiOiJlczYvdXRpbHMvb3J0aG9nb25hbC1kYXRhLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG5zIGZyb20gJy4uL2NvcmUvbmFtZXNwYWNlJztcblxuXG4vLyBATk9URTogYWNjZXNzb3JzIHNob3VsZCByZWNlaXZlIGRhdHVtIGluZGV4IGFzIGFyZ3VtZW50XG4vLyB0byBhbGxvdyB0aGUgdXNlIG9mIHNhbXBsZVJhdGUgdG8gZGVmaW5lIHggcG9zaXRpb25cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZVNoYXBlIHtcbiAgLyoqXG4gICAqICBAcGFyYW0gb3B0aW9ucyB7T2JqZWN0fSBvdmVycmlkZSBkZWZhdWx0IGNvbmZpZ3VyYXRpb25cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuJGVsID0gbnVsbDtcbiAgICB0aGlzLm5zID0gbnM7XG4gICAgdGhpcy5wYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9nZXREZWZhdWx0cygpLCBvcHRpb25zKTtcbiAgICAvLyBjcmVhdGUgYWNjZXNzb3JzIG1ldGhvZHMgYW5kIHNldCBkZWZhdWx0IGFjY2Vzc29yIGZ1bmN0aW9uc1xuICAgIGNvbnN0IGFjY2Vzc29ycyA9IHRoaXMuX2dldEFjY2Vzc29yTGlzdCgpO1xuICAgIHRoaXMuX2NyZWF0ZUFjY2Vzc29ycyhhY2Nlc3NvcnMpO1xuICAgIHRoaXMuX3NldERlZmF1bHRBY2Nlc3NvcnMoYWNjZXNzb3JzKTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICAvKipcbiAgICogIGNsZWFuIHJlZmVyZW5jZXMsIGlzIGNhbGxlZCBmcm9tIHRoZSBgbGF5ZXJgXG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIC8vIHRoaXMuZ3JvdXAgPSBudWxsO1xuICAgIHRoaXMuJGVsID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IHRoZSBuYW1lIG9mIHRoZSBzaGFwZSwgdXNlZCBhcyBhIGNsYXNzIGluIHRoZSBlbGVtZW50IGdyb3VwXG4gICAqL1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAnc2hhcGUnOyB9XG5cbiAgLy8gc2hvdWxkIG9ubHkgYmUgY2FsbGVkIG9uY2VcbiAgLy8gc2V0U3ZnRGVmaW5pdGlvbihkZWZzKSB7fVxuXG4gIC8qKlxuICAgKiBAVE9ETyByZW5hbWVcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKiAgICBrZXlzIGFyZSB0aGUgYWNjZXNzb3JzIG1ldGhvZHMgbmFtZXMgdG8gY3JlYXRlXG4gICAqICAgIHZhbHVlcyBhcmUgdGhlIGRlZmF1bHQgdmFsdWVzIGZvciBlYWNoIGdpdmVuIGFjY2Vzc29yXG4gICAqL1xuICBfZ2V0QWNjZXNzb3JMaXN0KCkgeyByZXR1cm4ge307IH1cblxuXG4gIC8qKlxuICAgKiAgaW5zdGFsbCB0aGUgZ2l2ZW4gYWNjZXNzb3JzIG9uIHRoZSBzaGFwZVxuICAgKi9cbiAgaW5zdGFsbChhY2Nlc3NvcnMpIHtcbiAgICBmb3IgKGxldCBrZXkgaW4gYWNjZXNzb3JzKSB7IHRoaXNba2V5XSA9IGFjY2Vzc29yc1trZXldOyB9XG4gIH1cblxuICAvKipcbiAgICogZ2VuZXJpYyBtZXRob2QgdG8gY3JlYXRlIGFjY2Vzc29yc1xuICAgKiBhZGRzIGFjY2Vzc29yIHRvIHRoZSBwcm90b3R5cGUgaWYgbm90IGFscmVhZHkgcHJlc2VudFxuICAgKi9cbiAgX2NyZWF0ZUFjY2Vzc29ycyhhY2Nlc3NvcnMpIHtcbiAgICB0aGlzLl9hY2Nlc3NvcnMgPSB7fTtcbiAgICAvLyBhZGQgaXQgdG8gdGhlIHByb3RvdHlwZVxuICAgIGNvbnN0IHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMpO1xuICAgIC8vIGNyZWF0ZSBhIGdldHRlciAvIHNldHRlciBmb3IgZWFjaCBhY2Nlc3NvcnNcbiAgICAvLyBzZXR0ZXIgOiBgdGhpcy54ID0gY2FsbGJhY2tgXG4gICAgLy8gZ2V0dGVyIDogYHRoaXMueChkYXR1bSlgXG4gICAgT2JqZWN0LmtleXMoYWNjZXNzb3JzKS5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgICBpZiAocHJvdG8uaGFzT3duUHJvcGVydHkobmFtZSkpIHsgcmV0dXJuOyB9XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm90bywgbmFtZSwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fYWNjZXNzb3JzW25hbWVdOyB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICAgICAgICB0aGlzLl9hY2Nlc3NvcnNbbmFtZV0gPSBmdW5jO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjcmVhdGUgYSBmdW5jdGlvbiB0byBiZSB1c2VkIGFzIGEgZGVmYXVsdFxuICAgKiBhY2Nlc3NvciBmb3IgZWFjaCBhY2Nlc29yc1xuICAgKi9cbiAgX3NldERlZmF1bHRBY2Nlc3NvcnMoYWNjZXNzb3JzKSB7XG4gICAgT2JqZWN0LmtleXMoYWNjZXNzb3JzKS5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgICBjb25zdCBkZWZhdWx0VmFsdWUgPSBhY2Nlc3NvcnNbbmFtZV07XG4gICAgICBsZXQgYWNjZXNzb3IgPSBmdW5jdGlvbihkLCB2ID0gbnVsbCkge1xuICAgICAgICBpZiAodiA9PT0gbnVsbCkgeyByZXR1cm4gZFtuYW1lXSB8fCBkZWZhdWx0VmFsdWU7IH1cbiAgICAgICAgZFtuYW1lXSA9IHY7XG4gICAgICB9O1xuICAgICAgLy8gc2V0IGFjY2Vzc29yIGFzIHRoZSBkZWZhdWx0IG9uZVxuICAgICAgdGhpc1tuYW1lXSA9IGFjY2Vzc29yO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSAgcmVuZGVyaW5nQ29udGV4dCB7Q29udGV4dH0gdGhlIHJlbmRlcmluZ0NvbnRleHQgdGhlIGxheWVyIHdoaWNoIG93bnMgdGhpcyBpdGVtXG4gICAqIEByZXR1cm4gIHtET01FbGVtZW50fSB0aGUgRE9NIGVsZW1lbnQgdG8gaW5zZXJ0IGluIHRoZSBpdGVtJ3MgZ3JvdXBcbiAgICovXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7fVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gIGdyb3VwIHtET01FbGVtZW50fSBncm91cCBvZiB0aGUgaXRlbSBpbiB3aGljaCB0aGUgc2hhcGUgaXMgZHJhd25cbiAgICogQHBhcmFtICByZW5kZXJpbmdDb250ZXh0IHtDb250ZXh0fSB0aGUgcmVuZGVyaW5nQ29udGV4dCB0aGUgbGF5ZXIgd2hpY2ggb3ducyB0aGlzIGl0ZW1cbiAgICogQHBhcmFtXG4gICAqICAgIHNpbXBsZVNoYXBlIDogZGF0dW0ge09iamVjdH0gdGhlIGRhdHVtIHJlbGF0ZWQgdG8gdGhpcyBpdGVtJ3MgZ3JvdXBcbiAgICogICAgY29tbW9uU2hhcGUgOiBkYXR1bSB7QXJyYXl9IHRoZSBhc3NvY2lhdGVkIHRvIHRoZSBMYXllclxuICAgKiBAcGFyYW1cbiAgICogICAgc2ltcGxlU2hhcGUgOiBpbmRleCB7TnVtYmVyfSB0aGUgY3VycmVudCBpbmRleCBvZiB0aGUgZGF0dW1cbiAgICogICAgY29tbW9uU2hhcGUgOiB1bmRlZmluZWRcbiAgICogQHJldHVybiAgdm9pZFxuICAgKi9cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtLCBpbmRleCkge31cblxuICAvKipcbiAgICogIGRlZmluZSBpZiB0aGUgc2hhcGUgaXMgY29uc2lkZXJlZCB0byBiZSB0aGUgZ2l2ZW4gYXJlYVxuICAgKiAgYXJndW1lbnRzIGFyZSBwYXNzZWQgaW4gZG9tYWluIHVuaXQgKHRpbWUsIHdoYXRldmVyKVxuICAgKiAgQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG4gIGluQXJlYShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSwgeDEsIHkxLCB4MiwgeTIpIHt9XG59XG4iXX0=