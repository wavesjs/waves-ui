"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var Layer = _interopRequire(require("./layer"));

var Timeline = _interopRequire(require("./timeline"));

// to be removed...

/**
 * The enhanced-timeline rendering methods
 *
 * The rendering process is distinct from adding or modifying data or their time-contexts.
 * `drawLayersShapes` will draw the shapes on all the layers (render dom element for newly created data)
 * `update` (and sub-methods `updateTimelineContainers`, `updateLayersContainers` and `updateLayersShapes`) will keep the display up-to-date with the data and the time-contexts (timeline timeContext and layers timeContext).
 */

var EnhancedTimeline = (function (_Timeline) {
  function EnhancedTimeline() {
    _classCallCheck(this, EnhancedTimeline);

    _get(_core.Object.getPrototypeOf(EnhancedTimeline.prototype), "constructor", this).call(this);
    this.layers = [];
    this.groupedLayers = {}; // group layer by categories
    this._layerContainerMap = new _core.Map();
  }

  _inherits(EnhancedTimeline, _Timeline);

  _createClass(EnhancedTimeline, {
    addLayer: {

      /**
       * Adds a `Layer` to the Timeline
       * @param layer {Layer} the layer to register
       * @param containerId {String} a valid id of a previsouly registered container
       * @param group {String} insert the layer into some user defined group of layers
       * @param timeContext {TimeContext} a `TimeContext` the layer is associated with
       *     if null given, a new `TimeContext` will be created for the layer
       */

      value: function addLayer(layer, view) {
        var group = arguments[2] === undefined ? "default" : arguments[2];

        this.views.set(view, this.views.get(view).push(layer));
        this._layerContainerMap.set(layer, view);
        this.layers.push(layer);
        this.view.add(layer);

        if (!this.groupedLayers[group]) {
          this.groupedLayers[group] = [];
        }
        this.groupedLayers[group].push(layer);
      }
    },
    removeLayer: {

      /**
       * Remove a layer from the timeline
       * @param layer {Layer} the layer to remove
       * @TODO test
       */

      value: function removeLayer(layer) {
        var container = this._layerContainerMap.get(layer);

        this.layers.splice(this.layers.indexOf(layer), 1);
        this._layerContainerMap["delete"](layer);

        // remove from groupedLayers
        for (var key in this.groupedLayers) {
          var group = this.groupedLayers[key];
          var index = group.indexOf(layer);

          if (index !== -1) {
            group.splice(index, 1);
          }
          // if group is empty, delete it
          if (group.length === 0) {
            delete this.groupedLayers[key];
          }
        }

        // remove layer from its container
        container.layoutElement.removeChild(layer.container);
      }
    },
    getContainerFromDOMElement: {

      // @NOTE change to `getContainer(el || id || layer)` ?

      value: function getContainerFromDOMElement(el) {
        for (var id in this.containers) {
          var container = this.containers[id];
          if (container.DOMElement === el) {
            return container;
          }
        }

        return null;
      }
    },
    getLayersFromGroup: {

      /**
       * Returns an array of layers given some group
       * @param group {String} name of the group
       * @return {Array} an array of layers which belongs to the group
       */

      value: function getLayersFromGroup() {
        var group = arguments[0] === undefined ? "default" : arguments[0];

        return this.groupedLayers[group] || [];
      }
    },
    getLayerContainer: {
      value: function getLayerContainer(layer) {
        return this._layerContainerMap.get(layer);
      }
    },
    _getLayers: {

      // getContainerPerId(id) {
      //   return this.containers[id];
      // }

      // -----------------------------------------------

      /**
       * @param layerOrGroup {mixed} defaults null
       * @return an array of layers
       */

      value: function _getLayers() {
        var layerOrGroup = arguments[0] === undefined ? null : arguments[0];

        var layers = null;

        if (typeof layerOrGroup === "string") {
          layers = this.groupedLayers[layerOrGroup];
        } else if (layerOrGroup instanceof Layer) {
          layers = [layerOrGroup];
        } else {
          layers = this.layers;
        }

        return layers;
      }
    },
    drawLayersShapes: {

      /**
       * Draw all the layers in the timeline
       */

      value: function drawLayersShapes() {
        var layerOrGroup = arguments[0] === undefined ? null : arguments[0];

        var layers = this._getLayers(layerOrGroup);
        layers.forEach(function (layer) {
          return layer.drawShapes();
        });
      }
    },
    update: {

      // updateLayersContainers(layerOrGroup = null) {
      //   const layers = this._getLayers(layerOrGroup);
      //   layers.forEach((layer) => layer.updateContainer());
      // }

      // updateLayersShapes(layerOrGroup = null) {
      //   const layers = this._getLayers(layerOrGroup);
      //   layers.forEach((layer) => layer.updateShapes());
      // }

      value: function update() {
        var layerOrGroup = arguments[0] === undefined ? null : arguments[0];

        var layers = this._getLayers(layerOrGroup);

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = _core.$for.getIterator(this), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var view = _step.value;

            view.update();
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"]) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        //this.updateLayersContainers(layerOrGroup);
        //this.updateLayersShapes(layerOrGroup);

        this.emit("update", layers);
      }
    }
  });

  return EnhancedTimeline;
})(Timeline);

module.exports = EnhancedTimeline;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL2VuaGFuY2VkLXRpbWVsaW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0lBQU8sS0FBSywyQkFBTSxTQUFTOztJQUNwQixRQUFRLDJCQUFNLFlBQVk7Ozs7Ozs7Ozs7OztJQVlaLGdCQUFnQjtBQUN4QixXQURRLGdCQUFnQixHQUN0QjswQkFETSxnQkFBZ0I7O0FBRWpDLHFDQUZpQixnQkFBZ0IsNkNBRXpCO0FBQ1IsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDakIsUUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7QUFDeEIsUUFBSSxDQUFDLGtCQUFrQixHQUFHLFVBQUksR0FBRyxFQUFFLENBQUM7R0FDckM7O1lBTmtCLGdCQUFnQjs7ZUFBaEIsZ0JBQWdCO0FBZ0JuQyxZQUFROzs7Ozs7Ozs7OzthQUFBLGtCQUFDLEtBQUssRUFBRSxJQUFJLEVBQXFCO1lBQW5CLEtBQUssZ0NBQUcsU0FBUzs7QUFDckMsWUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3ZELFlBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3pDLFlBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3hCLFlBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVyQixZQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUM5QixjQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztTQUNoQztBQUNELFlBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFD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QWdCLElBQUk7Z0JBQVosSUFBSTs7QUFDVixnQkFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBO1dBQ2Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJRCxZQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztPQUM3Qjs7OztTQW5Ja0IsZ0JBQWdCO0dBQVMsUUFBUTs7aUJBQWpDLGdCQUFnQiIsImZpbGUiOiJlczYvY29yZS9lbmhhbmNlZC10aW1lbGluZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMYXllciBmcm9tICcuL2xheWVyJztcbmltcG9ydCBUaW1lbGluZSBmcm9tICcuL3RpbWVsaW5lJztcblxuLy8gdG8gYmUgcmVtb3ZlZC4uLlxuXG4vKipcbiAqIFRoZSBlbmhhbmNlZC10aW1lbGluZSByZW5kZXJpbmcgbWV0aG9kc1xuICpcbiAqIFRoZSByZW5kZXJpbmcgcHJvY2VzcyBpcyBkaXN0aW5jdCBmcm9tIGFkZGluZyBvciBtb2RpZnlpbmcgZGF0YSBvciB0aGVpciB0aW1lLWNvbnRleHRzLlxuICogYGRyYXdMYXllcnNTaGFwZXNgIHdpbGwgZHJhdyB0aGUgc2hhcGVzIG9uIGFsbCB0aGUgbGF5ZXJzIChyZW5kZXIgZG9tIGVsZW1lbnQgZm9yIG5ld2x5IGNyZWF0ZWQgZGF0YSlcbiAqIGB1cGRhdGVgIChhbmQgc3ViLW1ldGhvZHMgYHVwZGF0ZVRpbWVsaW5lQ29udGFpbmVyc2AsIGB1cGRhdGVMYXllcnNDb250YWluZXJzYCBhbmQgYHVwZGF0ZUxheWVyc1NoYXBlc2ApIHdpbGwga2VlcCB0aGUgZGlzcGxheSB1cC10by1kYXRlIHdpdGggdGhlIGRhdGEgYW5kIHRoZSB0aW1lLWNvbnRleHRzICh0aW1lbGluZSB0aW1lQ29udGV4dCBhbmQgbGF5ZXJzIHRpbWVDb250ZXh0KS5cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbmhhbmNlZFRpbWVsaW5lIGV4dGVuZHMgVGltZWxpbmUge1xuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5sYXllcnMgPSBbXTtcbiAgICB0aGlzLmdyb3VwZWRMYXllcnMgPSB7fTsgLy8gZ3JvdXAgbGF5ZXIgYnkgY2F0ZWdvcmllc1xuICAgIHRoaXMuX2xheWVyQ29udGFpbmVyTWFwID0gbmV3IE1hcCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBgTGF5ZXJgIHRvIHRoZSBUaW1lbGluZVxuICAgKiBAcGFyYW0gbGF5ZXIge0xheWVyfSB0aGUgbGF5ZXIgdG8gcmVnaXN0ZXJcbiAgICogQHBhcmFtIGNvbnRhaW5lcklkIHtTdHJpbmd9IGEgdmFsaWQgaWQgb2YgYSBwcmV2aXNvdWx5IHJlZ2lzdGVyZWQgY29udGFpbmVyXG4gICAqIEBwYXJhbSBncm91cCB7U3RyaW5nfSBpbnNlcnQgdGhlIGxheWVyIGludG8gc29tZSB1c2VyIGRlZmluZWQgZ3JvdXAgb2YgbGF5ZXJzXG4gICAqIEBwYXJhbSB0aW1lQ29udGV4dCB7VGltZUNvbnRleHR9IGEgYFRpbWVDb250ZXh0YCB0aGUgbGF5ZXIgaXMgYXNzb2NpYXRlZCB3aXRoXG4gICAqICAgICBpZiBudWxsIGdpdmVuLCBhIG5ldyBgVGltZUNvbnRleHRgIHdpbGwgYmUgY3JlYXRlZCBmb3IgdGhlIGxheWVyXG4gICAqL1xuICBhZGRMYXllcihsYXllciwgdmlldywgZ3JvdXAgPSAnZGVmYXVsdCcpIHtcbiAgICB0aGlzLnZpZXdzLnNldCh2aWV3LCB0aGlzLnZpZXdzLmdldCh2aWV3KS5wdXNoKGxheWVyKSk7XG4gICAgdGhpcy5fbGF5ZXJDb250YWluZXJNYXAuc2V0KGxheWVyLCB2aWV3KTtcbiAgICB0aGlzLmxheWVycy5wdXNoKGxheWVyKTtcbiAgICB0aGlzLnZpZXcuYWRkKGxheWVyKTtcblxuICAgIGlmICghdGhpcy5ncm91cGVkTGF5ZXJzW2dyb3VwXSkge1xuICAgICAgdGhpcy5ncm91cGVkTGF5ZXJzW2dyb3VwXSA9IFtdO1xuICAgIH1cbiAgICB0aGlzLmdyb3VwZWRMYXllcnNbZ3JvdXBdLnB1c2gobGF5ZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGxheWVyIGZyb20gdGhlIHRpbWVsaW5lXG4gICAqIEBwYXJhbSBsYXllciB7TGF5ZXJ9IHRoZSBsYXllciB0byByZW1vdmVcbiAgICogQFRPRE8gdGVzdFxuICAgKi9cbiAgcmVtb3ZlTGF5ZXIobGF5ZXIpIHtcbiAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLl9sYXllckNvbnRhaW5lck1hcC5nZXQobGF5ZXIpO1xuXG4gICAgdGhpcy5sYXllcnMuc3BsaWNlKHRoaXMubGF5ZXJzLmluZGV4T2YobGF5ZXIpLCAxKTtcbiAgICB0aGlzLl9sYXllckNvbnRhaW5lck1hcC5kZWxldGUobGF5ZXIpO1xuXG4gICAgLy8gcmVtb3ZlIGZyb20gZ3JvdXBlZExheWVyc1xuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmdyb3VwZWRMYXllcnMpIHtcbiAgICAgIGNvbnN0IGdyb3VwID0gdGhpcy5ncm91cGVkTGF5ZXJzW2tleV07XG4gICAgICBjb25zdCBpbmRleCA9IGdyb3VwLmluZGV4T2YobGF5ZXIpO1xuXG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgIGdyb3VwLnNwbGljZShpbmRleCwgMSk7XG4gICAgICB9XG4gICAgICAvLyBpZiBncm91cCBpcyBlbXB0eSwgZGVsZXRlIGl0XG4gICAgICBpZiAoZ3JvdXAubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmdyb3VwZWRMYXllcnNba2V5XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyByZW1vdmUgbGF5ZXIgZnJvbSBpdHMgY29udGFpbmVyXG4gICAgY29udGFpbmVyLmxheW91dEVsZW1lbnQucmVtb3ZlQ2hpbGQobGF5ZXIuY29udGFpbmVyKTtcbiAgfVxuXG4gIC8vIEBOT1RFIGNoYW5nZSB0byBgZ2V0Q29udGFpbmVyKGVsIHx8IGlkIHx8IGxheWVyKWAgP1xuICBnZXRDb250YWluZXJGcm9tRE9NRWxlbWVudChlbCkge1xuICAgIGZvciAobGV0IGlkIGluIHRoaXMuY29udGFpbmVycykge1xuICAgICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5jb250YWluZXJzW2lkXTtcbiAgICAgIGlmIChjb250YWluZXIuRE9NRWxlbWVudCA9PT0gZWwpIHsgcmV0dXJuIGNvbnRhaW5lcjsgfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2YgbGF5ZXJzIGdpdmVuIHNvbWUgZ3JvdXBcbiAgICogQHBhcmFtIGdyb3VwIHtTdHJpbmd9IG5hbWUgb2YgdGhlIGdyb3VwXG4gICAqIEByZXR1cm4ge0FycmF5fSBhbiBhcnJheSBvZiBsYXllcnMgd2hpY2ggYmVsb25ncyB0byB0aGUgZ3JvdXBcbiAgICovXG4gIGdldExheWVyc0Zyb21Hcm91cChncm91cCA9ICdkZWZhdWx0Jykge1xuICAgIHJldHVybiB0aGlzLmdyb3VwZWRMYXllcnNbZ3JvdXBdIHx8wqBbXTtcbiAgfVxuXG4gIGdldExheWVyQ29udGFpbmVyKGxheWVyKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xheWVyQ29udGFpbmVyTWFwLmdldChsYXllcik7XG4gIH1cblxuICAvLyBnZXRDb250YWluZXJQZXJJZChpZCkge1xuICAvLyAgIHJldHVybiB0aGlzLmNvbnRhaW5lcnNbaWRdO1xuICAvLyB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogQHBhcmFtIGxheWVyT3JHcm91cCB7bWl4ZWR9IGRlZmF1bHRzIG51bGxcbiAgICogQHJldHVybiBhbiBhcnJheSBvZiBsYXllcnNcbiAgICovXG4gIF9nZXRMYXllcnMobGF5ZXJPckdyb3VwID0gbnVsbCkge1xuICAgIGxldCBsYXllcnMgPSBudWxsO1xuXG4gICAgaWYgKHR5cGVvZiBsYXllck9yR3JvdXAgPT09ICdzdHJpbmcnKSB7XG4gICAgICBsYXllcnMgPSB0aGlzLmdyb3VwZWRMYXllcnNbbGF5ZXJPckdyb3VwXTtcbiAgICB9IGVsc2UgaWYgKGxheWVyT3JHcm91cCBpbnN0YW5jZW9mIExheWVyKSB7XG4gICAgICBsYXllcnMgPSBbbGF5ZXJPckdyb3VwXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGF5ZXJzID0gdGhpcy5sYXllcnM7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxheWVycztcbiAgfVxuXG4gIC8qKlxuICAgKiBEcmF3IGFsbCB0aGUgbGF5ZXJzIGluIHRoZSB0aW1lbGluZVxuICAgKi9cbiAgZHJhd0xheWVyc1NoYXBlcyhsYXllck9yR3JvdXAgPSBudWxsKSB7XG4gICAgY29uc3QgbGF5ZXJzID0gdGhpcy5fZ2V0TGF5ZXJzKGxheWVyT3JHcm91cCk7XG4gICAgbGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiBsYXllci5kcmF3U2hhcGVzKCkpO1xuICB9XG5cbiAgLy8gdXBkYXRlTGF5ZXJzQ29udGFpbmVycyhsYXllck9yR3JvdXAgPSBudWxsKSB7XG4gIC8vICAgY29uc3QgbGF5ZXJzID0gdGhpcy5fZ2V0TGF5ZXJzKGxheWVyT3JHcm91cCk7XG4gIC8vICAgbGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiBsYXllci51cGRhdGVDb250YWluZXIoKSk7XG4gIC8vIH1cblxuICAvLyB1cGRhdGVMYXllcnNTaGFwZXMobGF5ZXJPckdyb3VwID0gbnVsbCkge1xuICAvLyAgIGNvbnN0IGxheWVycyA9IHRoaXMuX2dldExheWVycyhsYXllck9yR3JvdXApO1xuICAvLyAgIGxheWVycy5mb3JFYWNoKChsYXllcikgPT4gbGF5ZXIudXBkYXRlU2hhcGVzKCkpO1xuICAvLyB9XG4gIHVwZGF0ZShsYXllck9yR3JvdXAgPSBudWxsKSB7XG4gICAgY29uc3QgbGF5ZXJzID0gdGhpcy5fZ2V0TGF5ZXJzKGxheWVyT3JHcm91cCk7XG5cbiAgICBmb3IobGV0IHZpZXcgb2YgdGhpcyl7XG4gICAgICB2aWV3LnVwZGF0ZSgpXG4gICAgfVxuICAgIC8vdGhpcy51cGRhdGVMYXllcnNDb250YWluZXJzKGxheWVyT3JHcm91cCk7XG4gICAgLy90aGlzLnVwZGF0ZUxheWVyc1NoYXBlcyhsYXllck9yR3JvdXApO1xuXG4gICAgdGhpcy5lbWl0KCd1cGRhdGUnLCBsYXllcnMpO1xuICB9XG59XG4iXX0=