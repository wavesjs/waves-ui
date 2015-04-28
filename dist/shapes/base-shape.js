"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var ns = require("../core/namespace");

// @NOTE what about an `EntityShape` and a `CollectionShape`

var BaseShape = (function () {
  /*
    remove all references in constructor
    add all necessary arguments todraw and create
    rename:
      _getAccessorList
      create => render
      draw => update
  */
  /**
   *
   */

  function BaseShape() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, BaseShape);

    this.shape = null;
    this.ns = ns;
    this.params = _core.Object.assign({}, this._getDefaults(), options);

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
       *  clean references, is called from the `layer
       */

      value: function destroy() {
        // this.group = null;
        this.shape = null;
      }
    },
    getClassName: {

      /**
       * @return <String> the name of the shape, used as a class in the element group
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
       * @return <Object>
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

      value: function _createAccessors(names) {
        this._accessors = {};
        // add it to the prototype
        var proto = _core.Object.getPrototypeOf(this);
        // create a getter / setter for each accessors
        // setter : `this.x = callback`
        // getter : `this.x(datum)`
        _core.Object.keys(names).forEach(function (name) {
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

      value: function _setDefaultAccessors(names) {
        var _this = this;

        _core.Object.keys(names).forEach(function (name) {
          var defaultValue = names[name];
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
       * // @param  context <Context> the context the layer which owns this item
       * @return  <DOMElement> the DOM element to insert in the item's group
       */

      value: function render() {}
    },
    update: {

      /**
       * @param  group <DOMElement> group of the item in which the shape is drawn
       * @param  context <Context> the context the layer which owns this item
       * @param
       *    simpleShape : datum <Object> the datum related to this item's group
       *    commonShape : datum <Array> the associated to the Layer
       * @param
       *    simpleShape : index <Number> the current index of the datum
       *    commonShape : undefined
       * @return  void
       */

      value: function update(context, group, datum, index) {}
    },
    inArea: {

      // move(dx, dy, datum, context) {}

      /**
       *  define if the shape is considered to be the given area
       *  arguments are passed in domain unit (time, whatever)
       *  @return <Boolean>
       *  @FIXME shape shouldn't work in time domain, it should work in pixels domain
       */

      value: function inArea(context, datum, x1, x2, y1, y2) {}
    }
  });

  return BaseShape;
})();

module.exports = BaseShape;
//# sourceMappingURL=data:application/json;base64,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QVEsQ0FBQztTQUN2QixDQUFDLENBQUM7T0FDSjs7QUFNRCxVQUFNOzs7Ozs7O2FBQUEsa0JBQUcsRUFBRTs7QUFhWCxVQUFNOzs7Ozs7Ozs7Ozs7OzthQUFBLGdCQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFOztBQVV2QyxVQUFNOzs7Ozs7Ozs7OzthQUFBLGdCQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Ozs7U0E1SHJDLFNBQVM7OztBQStIZixNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQyIsImZpbGUiOiJlczYvc2hhcGVzL3JlY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBucyA9IHJlcXVpcmUoJy4uL2NvcmUvbmFtZXNwYWNlJyk7XG5cbi8vIEBOT1RFIHdoYXQgYWJvdXQgYW4gYEVudGl0eVNoYXBlYCBhbmQgYSBgQ29sbGVjdGlvblNoYXBlYFxuXG5jbGFzcyBCYXNlU2hhcGUge1xuICAvKlxuICAgIHJlbW92ZSBhbGwgcmVmZXJlbmNlcyBpbiBjb25zdHJ1Y3RvclxuICAgIGFkZCBhbGwgbmVjZXNzYXJ5IGFyZ3VtZW50cyB0b2RyYXcgYW5kIGNyZWF0ZVxuICAgIHJlbmFtZTpcbiAgICAgIF9nZXRBY2Nlc3Nvckxpc3RcbiAgICAgIGNyZWF0ZSA9PiByZW5kZXJcbiAgICAgIGRyYXcgPT4gdXBkYXRlXG4gICovXG4gIC8qKlxuICAgKlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5zaGFwZSA9IG51bGw7XG4gICAgdGhpcy5ucyA9IG5zO1xuICAgIHRoaXMucGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5fZ2V0RGVmYXVsdHMoKSwgb3B0aW9ucyk7XG5cbiAgICBjb25zdCBhY2Nlc3NvcnMgPSB0aGlzLl9nZXRBY2Nlc3Nvckxpc3QoKTtcbiAgICB0aGlzLl9jcmVhdGVBY2Nlc3NvcnMoYWNjZXNzb3JzKTtcbiAgICB0aGlzLl9zZXREZWZhdWx0QWNjZXNzb3JzKGFjY2Vzc29ycyk7XG4gIH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgLyoqXG4gICAqICBjbGVhbiByZWZlcmVuY2VzLCBpcyBjYWxsZWQgZnJvbSB0aGUgYGxheWVyXG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIC8vIHRoaXMuZ3JvdXAgPSBudWxsO1xuICAgIHRoaXMuc2hhcGUgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4gPFN0cmluZz4gdGhlIG5hbWUgb2YgdGhlIHNoYXBlLCB1c2VkIGFzIGEgY2xhc3MgaW4gdGhlIGVsZW1lbnQgZ3JvdXBcbiAgICovXG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICdzaGFwZSc7IH1cblxuICAvLyBzaG91bGQgb25seSBiZSBjYWxsZWQgb25jZVxuICAvLyBzZXRTdmdEZWZpbml0aW9uKGRlZnMpIHt9XG5cbiAgLyoqXG4gICAqIEBUT0RPIHJlbmFtZVxuICAgKiBAcmV0dXJuIDxPYmplY3Q+XG4gICAqICAgIGtleXMgYXJlIHRoZSBhY2Nlc3NvcnMgbWV0aG9kcyBuYW1lcyB0byBjcmVhdGVcbiAgICogICAgdmFsdWVzIGFyZSB0aGUgZGVmYXVsdCB2YWx1ZXMgZm9yIGVhY2ggZ2l2ZW4gYWNjZXNzb3JcbiAgICovXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7IHJldHVybiB7fTsgfVxuXG5cbiAgLyoqXG4gICAqICBpbnN0YWxsIHRoZSBnaXZlbiBhY2Nlc3NvcnMgb24gdGhlIHNoYXBlXG4gICAqL1xuICBpbnN0YWxsKGFjY2Vzc29ycykge1xuICAgIGZvciAobGV0IGtleSBpbiBhY2Nlc3NvcnMpIHsgdGhpc1trZXldID0gYWNjZXNzb3JzW2tleV07IH1cbiAgfVxuXG4gIC8qKlxuICAgKiBnZW5lcmljIG1ldGhvZCB0byBjcmVhdGUgYWNjZXNzb3JzXG4gICAqIGFkZHMgYWNjZXNzb3IgdG8gdGhlIHByb3RvdHlwZSBpZiBub3QgYWxyZWFkeSBwcmVzZW50XG4gICAqL1xuICBfY3JlYXRlQWNjZXNzb3JzKG5hbWVzKSB7XG4gICAgdGhpcy5fYWNjZXNzb3JzID0ge307XG4gICAgLy8gYWRkIGl0IHRvIHRoZSBwcm90b3R5cGVcbiAgICBjb25zdCBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzKTtcbiAgICAvLyBjcmVhdGUgYSBnZXR0ZXIgLyBzZXR0ZXIgZm9yIGVhY2ggYWNjZXNzb3JzXG4gICAgLy8gc2V0dGVyIDogYHRoaXMueCA9IGNhbGxiYWNrYFxuICAgIC8vIGdldHRlciA6IGB0aGlzLngoZGF0dW0pYFxuICAgIE9iamVjdC5rZXlzKG5hbWVzKS5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgICBpZiAocHJvdG8uaGFzT3duUHJvcGVydHkobmFtZSkpIHsgcmV0dXJuOyB9XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm90bywgbmFtZSwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fYWNjZXNzb3JzW25hbWVdOyB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICAgICAgICB0aGlzLl9hY2Nlc3NvcnNbbmFtZV0gPSBmdW5jO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjcmVhdGUgYSBmdW5jdGlvbiB0byBiZSB1c2VkIGFzIGEgZGVmYXVsdFxuICAgKiBhY2Nlc3NvciBmb3IgZWFjaCBhY2Nlc29yc1xuICAgKi9cbiAgX3NldERlZmF1bHRBY2Nlc3NvcnMobmFtZXMpIHtcbiAgICBPYmplY3Qua2V5cyhuYW1lcykuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgICAgY29uc3QgZGVmYXVsdFZhbHVlID0gbmFtZXNbbmFtZV07XG4gICAgICBsZXQgYWNjZXNzb3IgPSBmdW5jdGlvbihkLCB2ID0gbnVsbCkge1xuICAgICAgICBpZiAodiA9PT0gbnVsbCkgeyByZXR1cm4gZFtuYW1lXSB8fMKgZGVmYXVsdFZhbHVlOyB9XG4gICAgICAgIGRbbmFtZV0gPSB2O1xuICAgICAgfVxuICAgICAgLy8gc2V0IGFjY2Vzc29yIGFzIHRoZSBkZWZhdWx0IG9uZVxuICAgICAgdGhpc1tuYW1lXSA9IGFjY2Vzc29yO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIC8vIEBwYXJhbSAgY29udGV4dCA8Q29udGV4dD4gdGhlIGNvbnRleHQgdGhlIGxheWVyIHdoaWNoIG93bnMgdGhpcyBpdGVtXG4gICAqIEByZXR1cm4gIDxET01FbGVtZW50PiB0aGUgRE9NIGVsZW1lbnQgdG8gaW5zZXJ0IGluIHRoZSBpdGVtJ3MgZ3JvdXBcbiAgICovXG4gIHJlbmRlcigpIHt9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSAgZ3JvdXAgPERPTUVsZW1lbnQ+IGdyb3VwIG9mIHRoZSBpdGVtIGluIHdoaWNoIHRoZSBzaGFwZSBpcyBkcmF3blxuICAgKiBAcGFyYW0gIGNvbnRleHQgPENvbnRleHQ+IHRoZSBjb250ZXh0IHRoZSBsYXllciB3aGljaCBvd25zIHRoaXMgaXRlbVxuICAgKiBAcGFyYW1cbiAgICogICAgc2ltcGxlU2hhcGUgOiBkYXR1bSA8T2JqZWN0PiB0aGUgZGF0dW0gcmVsYXRlZCB0byB0aGlzIGl0ZW0ncyBncm91cFxuICAgKiAgICBjb21tb25TaGFwZSA6IGRhdHVtIDxBcnJheT4gdGhlIGFzc29jaWF0ZWQgdG8gdGhlIExheWVyXG4gICAqIEBwYXJhbVxuICAgKiAgICBzaW1wbGVTaGFwZSA6IGluZGV4IDxOdW1iZXI+IHRoZSBjdXJyZW50IGluZGV4IG9mIHRoZSBkYXR1bVxuICAgKiAgICBjb21tb25TaGFwZSA6IHVuZGVmaW5lZFxuICAgKiBAcmV0dXJuICB2b2lkXG4gICAqL1xuICB1cGRhdGUoY29udGV4dCwgZ3JvdXAsIGRhdHVtLCBpbmRleCkge31cblxuICAvLyBtb3ZlKGR4LCBkeSwgZGF0dW0sIGNvbnRleHQpIHt9XG5cbiAgLyoqXG4gICAqICBkZWZpbmUgaWYgdGhlIHNoYXBlIGlzIGNvbnNpZGVyZWQgdG8gYmUgdGhlIGdpdmVuIGFyZWFcbiAgICogIGFyZ3VtZW50cyBhcmUgcGFzc2VkIGluIGRvbWFpbiB1bml0ICh0aW1lLCB3aGF0ZXZlcilcbiAgICogIEByZXR1cm4gPEJvb2xlYW4+XG4gICAqICBARklYTUUgc2hhcGUgc2hvdWxkbid0IHdvcmsgaW4gdGltZSBkb21haW4sIGl0IHNob3VsZCB3b3JrIGluIHBpeGVscyBkb21haW5cbiAgICovXG4gIGluQXJlYShjb250ZXh0LCBkYXR1bSwgeDEsIHgyLCB5MSwgeTIpIHt9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZVNoYXBlO1xuIl19