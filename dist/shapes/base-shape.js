"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var ns = require("../core/namespace");

// @NOTE: accessors should receive datum index as argument
// to allow the use of sampleRate to define x position

var BaseShape = (function () {
  /**
   *  @param options {Object} override default configuration
   */

  function BaseShape() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, BaseShape);

    this.shape = null;
    this.ns = ns;
    this.params = _core.Object.assign({}, this._getDefaults(), options);
    // create accessors methods and set default accessor functions
    var accessors = this._getAccessorList();
    this._createAccessors(accessors);
    this._setDefaultAccessors(accessors);
  }

  _createClass(BaseShape, {
    _getDefaults: {
      value: function _getDefaults() {
        return {};
      }
    },
    destroy: {

      /**
       *  clean references, is called from the `layer`
       */

      value: function destroy() {
        // this.group = null;
        this.shape = null;
      }
    },
    getClassName: {

      /**
       * @return {String} the name of the shape, used as a class in the element group
       */

      value: function getClassName() {
        return "shape";
      }
    },
    _getAccessorList: {

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
    },
    install: {

      /**
       *  install the given accessors on the shape
       */

      value: function install(accessors) {
        for (var key in accessors) {
          this[key] = accessors[key];
        }
      }
    },
    _createAccessors: {

      /**
       * generic method to create accessors
       * adds accessor to the prototype if not already present
       */

      value: function _createAccessors(accessors) {
        this._accessors = {};
        // add it to the prototype
        var proto = _core.Object.getPrototypeOf(this);
        // create a getter / setter for each accessors
        // setter : `this.x = callback`
        // getter : `this.x(datum)`
        _core.Object.keys(accessors).forEach(function (name) {
          if (proto.hasOwnProperty(name)) {
            return;
          }

          Object.defineProperty(proto, name, {
            get: function get() {
              return this._accessors[name];
            },
            set: function set(func) {
              this._accessors[name] = func;
            }
          });
        });
      }
    },
    _setDefaultAccessors: {

      /**
       * create a function to be used as a default
       * accessor for each accesors
       */

      value: function _setDefaultAccessors(accessors) {
        var _this = this;

        _core.Object.keys(accessors).forEach(function (name) {
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
    },
    render: {

      /**
       * @param  renderingContext {Context} the renderingContext the layer which owns this item
       * @return  {DOMElement} the DOM element to insert in the item's group
       */

      value: function render(renderingContext) {}
    },
    update: {

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

      value: function update(renderingContext, group, datum, index) {}
    },
    inArea: {

      /**
       *  define if the shape is considered to be the given area
       *  arguments are passed in domain unit (time, whatever)
       *  @return {Boolean}
       */

      value: function inArea(renderingContext, datum, x1, y1, x2, y2) {}
    }
  });

  return BaseShape;
})();

module.exports = BaseShape;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaGFwZXMvYmFzZS1zaGFwZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOzs7OztJQU1sQyxTQUFTOzs7OztBQUlGLFdBSlAsU0FBUyxHQUlhO1FBQWQsT0FBTyxnQ0FBRyxFQUFFOzswQkFKcEIsU0FBUzs7QUFLWCxRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNsQixRQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNiLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBQSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRTlELFFBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0FBQzFDLFFBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNqQyxRQUFJLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUM7R0FDdEM7O2VBWkcsU0FBUztBQWNiLGdCQUFZO2FBQUEsd0JBQUc7QUFDYixlQUFPLEVBQUUsQ0FBQztPQUNYOztBQUtELFdBQU87Ozs7OzthQUFBLG1CQUFHOztBQUVSLFlBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO09BQ25COztBQUtELGdCQUFZOzs7Ozs7YUFBQSx3QkFBRztBQUFFLGVBQU8sT0FBTyxDQUFDO09BQUU7O0FBV2xDLG9CQUFnQjs7Ozs7Ozs7Ozs7O2FBQUEsNEJBQUc7QUFBRSxlQUFPLEVBQUUsQ0FBQztPQUFFOztBQU1qQyxXQUFPOzs7Ozs7YUFBQSxpQkFBQyxTQUFTLEVBQUU7QUFDakIsYUFBSyxJQUFJLEdBQUcsSUFBSSxTQUFTLEVBQUU7QUFBRSxjQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQUU7T0FDM0Q7O0FBTUQsb0JBQWdCOzs7Ozs7O2FBQUEsMEJBQUMsU0FBUyxFQUFFO0FBQzFCLFlBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDOztBQUVyQixZQUFNLEtBQUssR0FBRyxNQUFBLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7Ozs7QUFJMUMsY0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSztBQUN2QyxjQUFJLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFBRSxtQkFBTztXQUFFOztBQUUzQyxnQkFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFO0FBQ2pDLGVBQUcsRUFBRSxlQUFXO0FBQUUscUJBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUFFO0FBQ2pELGVBQUcsRUFBRSxhQUFTLElBQUksRUFBRTtBQUNsQixrQkFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7YUFDOUI7V0FDRixDQUFDLENBQUM7U0FDSixDQUFDLENBQUM7T0FDSjs7QUFNRCx3QkFBb0I7Ozs7Ozs7YUFBQSw4QkFBQyxTQUFTLEVBQUU7OztBQUM5QixjQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ3ZDLGNBQU0sWUFBWSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNyQyxjQUFJLFFBQVEsR0FBRyxrQkFBUyxDQUFDLEVBQVk7Z0JBQVYsQ0FBQyxnQ0FBRyxJQUFJOztBQUNqQyxnQkFBSSxDQUFDLEtBQUssSUFBSSxFQUFFO0FBQUUscUJBQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLFlBQVksQ0FBQzthQUFFO0FBQ25ELGFBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7V0FDYixDQUFBOztBQUVELGdCQUFLLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQztTQUN2QixDQUFDLENBQUM7T0FDSjs7QUFNRCxVQUFNOzs7Ozs7O2FBQUEsZ0JBQUMsZ0JBQWdCLEVBQUUsRUFBRTs7QUFhM0IsVUFBTTs7Ozs7Ozs7Ozs7Ozs7YUFBQSxnQkFBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFOztBQU9oRCxVQUFNOzs7Ozs7OzthQUFBLGdCQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTs7OztTQWpIOUMsU0FBUzs7O0FBb0hmLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDIiwiZmlsZSI6ImVzNi9zaGFwZXMvYmFzZS1zaGFwZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IG5zID0gcmVxdWlyZSgnLi4vY29yZS9uYW1lc3BhY2UnKTtcblxuXG4vLyBATk9URTogYWNjZXNzb3JzIHNob3VsZCByZWNlaXZlIGRhdHVtIGluZGV4IGFzIGFyZ3VtZW50XG4vLyB0byBhbGxvdyB0aGUgdXNlIG9mIHNhbXBsZVJhdGUgdG8gZGVmaW5lIHggcG9zaXRpb25cblxuY2xhc3MgQmFzZVNoYXBlIHtcbiAgLyoqXG4gICAqICBAcGFyYW0gb3B0aW9ucyB7T2JqZWN0fSBvdmVycmlkZSBkZWZhdWx0IGNvbmZpZ3VyYXRpb25cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuc2hhcGUgPSBudWxsO1xuICAgIHRoaXMubnMgPSBucztcbiAgICB0aGlzLnBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuX2dldERlZmF1bHRzKCksIG9wdGlvbnMpO1xuICAgIC8vIGNyZWF0ZSBhY2Nlc3NvcnMgbWV0aG9kcyBhbmQgc2V0IGRlZmF1bHQgYWNjZXNzb3IgZnVuY3Rpb25zXG4gICAgY29uc3QgYWNjZXNzb3JzID0gdGhpcy5fZ2V0QWNjZXNzb3JMaXN0KCk7XG4gICAgdGhpcy5fY3JlYXRlQWNjZXNzb3JzKGFjY2Vzc29ycyk7XG4gICAgdGhpcy5fc2V0RGVmYXVsdEFjY2Vzc29ycyhhY2Nlc3NvcnMpO1xuICB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgY2xlYW4gcmVmZXJlbmNlcywgaXMgY2FsbGVkIGZyb20gdGhlIGBsYXllcmBcbiAgICovXG4gIGRlc3Ryb3koKSB7XG4gICAgLy8gdGhpcy5ncm91cCA9IG51bGw7XG4gICAgdGhpcy5zaGFwZSA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7U3RyaW5nfSB0aGUgbmFtZSBvZiB0aGUgc2hhcGUsIHVzZWQgYXMgYSBjbGFzcyBpbiB0aGUgZWxlbWVudCBncm91cFxuICAgKi9cbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ3NoYXBlJzsgfVxuXG4gIC8vIHNob3VsZCBvbmx5IGJlIGNhbGxlZCBvbmNlXG4gIC8vIHNldFN2Z0RlZmluaXRpb24oZGVmcykge31cblxuICAvKipcbiAgICogQFRPRE8gcmVuYW1lXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICogICAga2V5cyBhcmUgdGhlIGFjY2Vzc29ycyBtZXRob2RzIG5hbWVzIHRvIGNyZWF0ZVxuICAgKiAgICB2YWx1ZXMgYXJlIHRoZSBkZWZhdWx0IHZhbHVlcyBmb3IgZWFjaCBnaXZlbiBhY2Nlc3NvclxuICAgKi9cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHsgcmV0dXJuIHt9OyB9XG5cblxuICAvKipcbiAgICogIGluc3RhbGwgdGhlIGdpdmVuIGFjY2Vzc29ycyBvbiB0aGUgc2hhcGVcbiAgICovXG4gIGluc3RhbGwoYWNjZXNzb3JzKSB7XG4gICAgZm9yIChsZXQga2V5IGluIGFjY2Vzc29ycykgeyB0aGlzW2tleV0gPSBhY2Nlc3NvcnNba2V5XTsgfVxuICB9XG5cbiAgLyoqXG4gICAqIGdlbmVyaWMgbWV0aG9kIHRvIGNyZWF0ZSBhY2Nlc3NvcnNcbiAgICogYWRkcyBhY2Nlc3NvciB0byB0aGUgcHJvdG90eXBlIGlmIG5vdCBhbHJlYWR5IHByZXNlbnRcbiAgICovXG4gIF9jcmVhdGVBY2Nlc3NvcnMoYWNjZXNzb3JzKSB7XG4gICAgdGhpcy5fYWNjZXNzb3JzID0ge307XG4gICAgLy8gYWRkIGl0IHRvIHRoZSBwcm90b3R5cGVcbiAgICBjb25zdCBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzKTtcbiAgICAvLyBjcmVhdGUgYSBnZXR0ZXIgLyBzZXR0ZXIgZm9yIGVhY2ggYWNjZXNzb3JzXG4gICAgLy8gc2V0dGVyIDogYHRoaXMueCA9IGNhbGxiYWNrYFxuICAgIC8vIGdldHRlciA6IGB0aGlzLngoZGF0dW0pYFxuICAgIE9iamVjdC5rZXlzKGFjY2Vzc29ycykuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgICAgaWYgKHByb3RvLmhhc093blByb3BlcnR5KG5hbWUpKSB7IHJldHVybjsgfVxuXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvdG8sIG5hbWUsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX2FjY2Vzc29yc1tuYW1lXTsgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbihmdW5jKSB7XG4gICAgICAgICAgdGhpcy5fYWNjZXNzb3JzW25hbWVdID0gZnVuYztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogY3JlYXRlIGEgZnVuY3Rpb24gdG8gYmUgdXNlZCBhcyBhIGRlZmF1bHRcbiAgICogYWNjZXNzb3IgZm9yIGVhY2ggYWNjZXNvcnNcbiAgICovXG4gIF9zZXREZWZhdWx0QWNjZXNzb3JzKGFjY2Vzc29ycykge1xuICAgIE9iamVjdC5rZXlzKGFjY2Vzc29ycykuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgICAgY29uc3QgZGVmYXVsdFZhbHVlID0gYWNjZXNzb3JzW25hbWVdO1xuICAgICAgbGV0IGFjY2Vzc29yID0gZnVuY3Rpb24oZCwgdiA9IG51bGwpIHtcbiAgICAgICAgaWYgKHYgPT09IG51bGwpIHsgcmV0dXJuIGRbbmFtZV0gfHzCoGRlZmF1bHRWYWx1ZTsgfVxuICAgICAgICBkW25hbWVdID0gdjtcbiAgICAgIH1cbiAgICAgIC8vIHNldCBhY2Nlc3NvciBhcyB0aGUgZGVmYXVsdCBvbmVcbiAgICAgIHRoaXNbbmFtZV0gPSBhY2Nlc3NvcjtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gIHJlbmRlcmluZ0NvbnRleHQge0NvbnRleHR9IHRoZSByZW5kZXJpbmdDb250ZXh0IHRoZSBsYXllciB3aGljaCBvd25zIHRoaXMgaXRlbVxuICAgKiBAcmV0dXJuICB7RE9NRWxlbWVudH0gdGhlIERPTSBlbGVtZW50IHRvIGluc2VydCBpbiB0aGUgaXRlbSdzIGdyb3VwXG4gICAqL1xuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge31cblxuICAvKipcbiAgICogQHBhcmFtICBncm91cCB7RE9NRWxlbWVudH0gZ3JvdXAgb2YgdGhlIGl0ZW0gaW4gd2hpY2ggdGhlIHNoYXBlIGlzIGRyYXduXG4gICAqIEBwYXJhbSAgcmVuZGVyaW5nQ29udGV4dCB7Q29udGV4dH0gdGhlIHJlbmRlcmluZ0NvbnRleHQgdGhlIGxheWVyIHdoaWNoIG93bnMgdGhpcyBpdGVtXG4gICAqIEBwYXJhbVxuICAgKiAgICBzaW1wbGVTaGFwZSA6IGRhdHVtIHtPYmplY3R9IHRoZSBkYXR1bSByZWxhdGVkIHRvIHRoaXMgaXRlbSdzIGdyb3VwXG4gICAqICAgIGNvbW1vblNoYXBlIDogZGF0dW0ge0FycmF5fSB0aGUgYXNzb2NpYXRlZCB0byB0aGUgTGF5ZXJcbiAgICogQHBhcmFtXG4gICAqICAgIHNpbXBsZVNoYXBlIDogaW5kZXgge051bWJlcn0gdGhlIGN1cnJlbnQgaW5kZXggb2YgdGhlIGRhdHVtXG4gICAqICAgIGNvbW1vblNoYXBlIDogdW5kZWZpbmVkXG4gICAqIEByZXR1cm4gIHZvaWRcbiAgICovXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBncm91cCwgZGF0dW0sIGluZGV4KSB7fVxuXG4gIC8qKlxuICAgKiAgZGVmaW5lIGlmIHRoZSBzaGFwZSBpcyBjb25zaWRlcmVkIHRvIGJlIHRoZSBnaXZlbiBhcmVhXG4gICAqICBhcmd1bWVudHMgYXJlIHBhc3NlZCBpbiBkb21haW4gdW5pdCAodGltZSwgd2hhdGV2ZXIpXG4gICAqICBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cbiAgaW5BcmVhKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtLCB4MSwgeTEsIHgyLCB5Mikge31cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCYXNlU2hhcGU7XG4iXX0=