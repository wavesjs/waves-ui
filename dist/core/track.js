'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _Symbol$iterator = require('babel-runtime/core-js/symbol/iterator')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _d3Scale = require('d3-scale');

var _d3Scale2 = _interopRequireDefault(_d3Scale);

var _namespace = require('./namespace');

/**
* As a temporal representation, a track establishes a relation between *time* in seconds and *space* in pixels.
*
* A `Track` instance can have multiple `Layer` instances.
*
* Tracks inside a timeline
*
* A temporal representation can be rendered upon multiple DOM elements, the tracks (eg multiple <li> for a DAW like representation) that belong to the same timeline using the `add` method. These tracks are like windows on the overall and basically unending timeline.
*
* A timeline with 3 tracks:
*
* +-----------------+-------------------------------+-- - -  -  -   -
* |track 1          |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
* +-----------------+-------------------------------+-- - -  -  -   -
* |track 2          |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
* +-----------------+-------------------------------+-- - -  -  -   -
* |track 3          |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
* +-------------------------------------------------+-- - -  -  -   -
*
* +----------------->
* timeline.timeContext.timeToPixel(timeline.timeContext.offset)
*
*                   <------------------------------->
*                   timeline's tracks defaults to 1000px
*                   with a default pixelsPerSecond of 100px/s.
*                   and a default `stretchRatio = 1`
*                   track1 shows 10 seconds of the timeline
*
* Layers inside a track
*
* Within a track, a `Layer` keeps up-to-date and renders the data. The track's `add` method adds a `Layer` instance to a track. A Layer
*
* The track renderingContext
*
* When one modify the timeline renderingContext:
* - timeline.renderingContext.offset (in seconds) modify the containers track x position
* - timeline.renderingContext.stretchRatio modify timeline's zoom
* Each time you set new value of offset or stretchRatio, you need to do `timeline.update()` to update the values.
* Track SVG structure
* <svg class="track" xmlns:xhtml="http://www.w3.org/1999/xhtml" height="100" shape-rendering="optimizeSpeed">
*  <defs></defs> Unused for the moment, could be used to define custom shapes for use with layers
*  <rect style="fill-opacity:0" width="100%" height="100%"></rect>
*  <g class="offset">
*    <g class="layout"></g> The layers are inserted here
*  </g>
*  <g class="interactions"></g> Placeholder to visualize interactions (eg. brush)
* </svg>
*/

var _namespace2 = _interopRequireDefault(_namespace);

var Track = (function () {
  function Track($el) {
    var height = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];

    _classCallCheck(this, Track);

    this.$el = $el;
    this.layers = [];
    this._height = height;

    // are set when added to the timeline
    this.renderingContext = null;

    this._createContainer();
  }

  _createClass(Track, [{
    key: 'configure',

    // @NOTE: propagate to layers, keeping ratio ?

    /**
     * This method is called when the track is added to the timeline
     * The track cannot be updated without being added to a timeline
     */
    value: function configure(renderingContext) {
      this.renderingContext = renderingContext;
    }

    /**
     * Destroy a track
     * The layers from this track can still be reused elsewhere
     */
  }, {
    key: 'destroy',
    value: function destroy() {
      var _this = this;

      // Detach everything from the DOM
      this.$el.removeChild(this.$svg);
      this.layers.forEach(function (layer) {
        return _this.$layout.removeChild(layer.$el);
      });
      // clean references
      this.$el = null;
      this.renderingContext = null;
      this.layers.length = 0;
    }

    /**
     * Creates the container for the track
     */
  }, {
    key: '_createContainer',
    value: function _createContainer() {
      var $svg = document.createElementNS(_namespace2['default'], 'svg');
      $svg.setAttributeNS(null, 'shape-rendering', 'optimizeSpeed');
      $svg.setAttributeNS(null, 'height', this.height);
      $svg.setAttribute('xmlns:xhtml', 'http://www.w3.org/1999/xhtml');
      $svg.classList.add('track');

      var $background = document.createElementNS(_namespace2['default'], 'rect');
      $background.setAttributeNS(null, 'height', '100%');
      $background.setAttributeNS(null, 'width', '100%');
      $background.setAttributeNS(null, 'style', 'fill-opacity:0');

      var $defs = document.createElementNS(_namespace2['default'], 'defs');

      var $offsetGroup = document.createElementNS(_namespace2['default'], 'g');
      $offsetGroup.classList.add('offset');

      var $layoutGroup = document.createElementNS(_namespace2['default'], 'g');
      $layoutGroup.classList.add('layout');

      var $interactionsGroup = document.createElementNS(_namespace2['default'], 'g');
      $interactionsGroup.classList.add('interactions');

      $svg.appendChild($defs);
      $svg.appendChild($background);
      $offsetGroup.appendChild($layoutGroup);
      $svg.appendChild($offsetGroup);
      $svg.appendChild($interactionsGroup);

      this.$el.appendChild($svg);
      // removes additionnal height added who knows why...
      this.$el.style.fontSize = 0;
      // fixes one of the (many ?) weird canvas rendering bugs in Chrome
      this.$el.style.transform = 'translateZ(0)';

      this.$layout = $layoutGroup;
      this.$offset = $offsetGroup;
      this.$interactions = $interactionsGroup;
      this.$svg = $svg;
      this.$background = $background;
    }

    /**
     * Adds a layer to the track
     */
  }, {
    key: 'add',
    value: function add(layer) {
      this.layers.push(layer);
      // Create a default renderingContext for the layer if missing
      this.$layout.appendChild(layer.$el);
    }

    /**
     * Removes a layer
     */
  }, {
    key: 'remove',
    value: function remove(layer) {
      this.layers.splice(this.layers.indexOf(layer), 1);
      // Removes layer from its container
      this.$layout.removeChild(layer.$el);
    }

    /**
     * Draw tracks, and the layers in cascade
     */
  }, {
    key: 'render',
    value: function render() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _getIterator(this), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var layer = _step.value;
          layer.render();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    /**
     * Update the layers
     */
  }, {
    key: 'update',
    value: function update() {
      var layers = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      this.updateContainer();
      this.updateLayers(layers);
    }
  }, {
    key: 'updateContainer',
    value: function updateContainer() {
      var $svg = this.$svg;
      var $offset = this.$offset;
      // Should be in some update layout
      var renderingContext = this.renderingContext;
      var height = this.height;
      var width = renderingContext.visibleWidth;
      var offsetX = renderingContext.timeToPixel(renderingContext.offset);
      var translate = 'translate(' + offsetX + ', 0)';

      $svg.setAttributeNS(null, 'height', height);
      $svg.setAttributeNS(null, 'width', width);
      $svg.setAttributeNS(null, 'viewbox', '0 0 ' + width + ' ' + height);

      $offset.setAttributeNS(null, 'transform', translate);
    }
  }, {
    key: 'updateLayers',
    value: function updateLayers() {
      var _this2 = this;

      var layers = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      layers = layers === null ? this.layers : layers;

      layers.forEach(function (layer) {
        if (_this2.layers.indexOf(layer) === -1) {
          return;
        }
        layer.update();
      });
    }
  }, {
    key: _Symbol$iterator,
    value: _regeneratorRuntime.mark(function value() {
      return _regeneratorRuntime.wrap(function value$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            return context$2$0.delegateYield(_getIterator(this.layers), 't0', 1);

          case 1:
          case 'end':
            return context$2$0.stop();
        }
      }, value, this);
    })
  }, {
    key: 'height',
    get: function get() {
      return this._height;
    },
    set: function set(value) {
      this._height = value;
    }
  }]);

  return Track;
})();

exports['default'] = Track;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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R0FBRyxNQUFNLENBQUM7O0FBRWxELFlBQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLLEVBQUs7QUFDeEIsWUFBSSxPQUFLLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFBRSxpQkFBTztTQUFFO0FBQ2xELGFBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztPQUNoQixDQUFDLENBQUM7S0FDSjs7O29DQUVpQjs7OzswREFDVCxJQUFJLENBQUMsTUFBTTs7Ozs7OztLQUNuQjs7O1NBeklTLGVBQUc7QUFDWCxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7S0FDckI7U0FFUyxhQUFDLEtBQUssRUFBRTtBQUNoQixVQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztLQUV0Qjs7O1NBbkJrQixLQUFLOzs7cUJBQUwsS0FBSyIsImZpbGUiOiJlczYvY29yZS90cmFjay5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkM1NjYWxlIGZyb20gJ2QzLXNjYWxlJztcbmltcG9ydCBucyBmcm9tICcuL25hbWVzcGFjZSc7XG5cblxuLyoqXG4qIEFzIGEgdGVtcG9yYWwgcmVwcmVzZW50YXRpb24sIGEgdHJhY2sgZXN0YWJsaXNoZXMgYSByZWxhdGlvbiBiZXR3ZWVuICp0aW1lKiBpbiBzZWNvbmRzIGFuZCAqc3BhY2UqIGluIHBpeGVscy5cbipcbiogQSBgVHJhY2tgIGluc3RhbmNlIGNhbiBoYXZlIG11bHRpcGxlIGBMYXllcmAgaW5zdGFuY2VzLlxuKlxuKiBUcmFja3MgaW5zaWRlIGEgdGltZWxpbmVcbipcbiogQSB0ZW1wb3JhbCByZXByZXNlbnRhdGlvbiBjYW4gYmUgcmVuZGVyZWQgdXBvbiBtdWx0aXBsZSBET00gZWxlbWVudHMsIHRoZSB0cmFja3MgKGVnIG11bHRpcGxlIDxsaT4gZm9yIGEgREFXIGxpa2UgcmVwcmVzZW50YXRpb24pIHRoYXQgYmVsb25nIHRvIHRoZSBzYW1lIHRpbWVsaW5lIHVzaW5nIHRoZSBgYWRkYCBtZXRob2QuIFRoZXNlIHRyYWNrcyBhcmUgbGlrZSB3aW5kb3dzIG9uIHRoZSBvdmVyYWxsIGFuZCBiYXNpY2FsbHkgdW5lbmRpbmcgdGltZWxpbmUuXG4qXG4qIEEgdGltZWxpbmUgd2l0aCAzIHRyYWNrczpcbipcbiogKy0tLS0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rLS0gLSAtICAtICAtICAgLVxuKiB8dHJhY2sgMSAgICAgICAgICB8eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHxcbiogKy0tLS0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rLS0gLSAtICAtICAtICAgLVxuKiB8dHJhY2sgMiAgICAgICAgICB8eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHxcbiogKy0tLS0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rLS0gLSAtICAtICAtICAgLVxuKiB8dHJhY2sgMyAgICAgICAgICB8eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHxcbiogKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rLS0gLSAtICAtICAtICAgLVxuKlxuKiArLS0tLS0tLS0tLS0tLS0tLS0+XG4qIHRpbWVsaW5lLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRpbWVsaW5lLnRpbWVDb250ZXh0Lm9mZnNldClcbipcbiogICAgICAgICAgICAgICAgICAgPC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0+XG4qICAgICAgICAgICAgICAgICAgIHRpbWVsaW5lJ3MgdHJhY2tzIGRlZmF1bHRzIHRvIDEwMDBweFxuKiAgICAgICAgICAgICAgICAgICB3aXRoIGEgZGVmYXVsdCBwaXhlbHNQZXJTZWNvbmQgb2YgMTAwcHgvcy5cbiogICAgICAgICAgICAgICAgICAgYW5kIGEgZGVmYXVsdCBgc3RyZXRjaFJhdGlvID0gMWBcbiogICAgICAgICAgICAgICAgICAgdHJhY2sxIHNob3dzIDEwIHNlY29uZHMgb2YgdGhlIHRpbWVsaW5lXG4qXG4qIExheWVycyBpbnNpZGUgYSB0cmFja1xuKlxuKiBXaXRoaW4gYSB0cmFjaywgYSBgTGF5ZXJgIGtlZXBzIHVwLXRvLWRhdGUgYW5kIHJlbmRlcnMgdGhlIGRhdGEuIFRoZSB0cmFjaydzIGBhZGRgIG1ldGhvZCBhZGRzIGEgYExheWVyYCBpbnN0YW5jZSB0byBhIHRyYWNrLiBBIExheWVyXG4qXG4qIFRoZSB0cmFjayByZW5kZXJpbmdDb250ZXh0XG4qXG4qIFdoZW4gb25lIG1vZGlmeSB0aGUgdGltZWxpbmUgcmVuZGVyaW5nQ29udGV4dDpcbiogLSB0aW1lbGluZS5yZW5kZXJpbmdDb250ZXh0Lm9mZnNldCAoaW4gc2Vjb25kcykgbW9kaWZ5IHRoZSBjb250YWluZXJzIHRyYWNrIHggcG9zaXRpb25cbiogLSB0aW1lbGluZS5yZW5kZXJpbmdDb250ZXh0LnN0cmV0Y2hSYXRpbyBtb2RpZnkgdGltZWxpbmUncyB6b29tXG4qIEVhY2ggdGltZSB5b3Ugc2V0IG5ldyB2YWx1ZSBvZiBvZmZzZXQgb3Igc3RyZXRjaFJhdGlvLCB5b3UgbmVlZCB0byBkbyBgdGltZWxpbmUudXBkYXRlKClgIHRvIHVwZGF0ZSB0aGUgdmFsdWVzLlxuKiBUcmFjayBTVkcgc3RydWN0dXJlXG4qIDxzdmcgY2xhc3M9XCJ0cmFja1wiIHhtbG5zOnhodG1sPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwiIGhlaWdodD1cIjEwMFwiIHNoYXBlLXJlbmRlcmluZz1cIm9wdGltaXplU3BlZWRcIj5cbiogIDxkZWZzPjwvZGVmcz4gVW51c2VkIGZvciB0aGUgbW9tZW50LCBjb3VsZCBiZSB1c2VkIHRvIGRlZmluZSBjdXN0b20gc2hhcGVzIGZvciB1c2Ugd2l0aCBsYXllcnNcbiogIDxyZWN0IHN0eWxlPVwiZmlsbC1vcGFjaXR5OjBcIiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCI+PC9yZWN0PlxuKiAgPGcgY2xhc3M9XCJvZmZzZXRcIj5cbiogICAgPGcgY2xhc3M9XCJsYXlvdXRcIj48L2c+IFRoZSBsYXllcnMgYXJlIGluc2VydGVkIGhlcmVcbiogIDwvZz5cbiogIDxnIGNsYXNzPVwiaW50ZXJhY3Rpb25zXCI+PC9nPiBQbGFjZWhvbGRlciB0byB2aXN1YWxpemUgaW50ZXJhY3Rpb25zIChlZy4gYnJ1c2gpXG4qIDwvc3ZnPlxuKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhY2sge1xuICBjb25zdHJ1Y3RvcigkZWwsIGhlaWdodCA9IDEwMCkge1xuICAgIHRoaXMuJGVsID0gJGVsO1xuICAgIHRoaXMubGF5ZXJzID0gW107XG4gICAgdGhpcy5faGVpZ2h0ID0gaGVpZ2h0O1xuXG4gICAgLy8gYXJlIHNldCB3aGVuIGFkZGVkIHRvIHRoZSB0aW1lbGluZVxuICAgIHRoaXMucmVuZGVyaW5nQ29udGV4dCA9IG51bGw7XG5cbiAgICB0aGlzLl9jcmVhdGVDb250YWluZXIoKTtcbiAgfVxuXG4gIGdldCBoZWlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlaWdodDtcbiAgfVxuXG4gIHNldCBoZWlnaHQodmFsdWUpIHtcbiAgICB0aGlzLl9oZWlnaHQgPSB2YWx1ZTtcbiAgICAvLyBATk9URTogcHJvcGFnYXRlIHRvIGxheWVycywga2VlcGluZyByYXRpbyA/XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIHdoZW4gdGhlIHRyYWNrIGlzIGFkZGVkIHRvIHRoZSB0aW1lbGluZVxuICAgKiBUaGUgdHJhY2sgY2Fubm90IGJlIHVwZGF0ZWQgd2l0aG91dCBiZWluZyBhZGRlZCB0byBhIHRpbWVsaW5lXG4gICAqL1xuICBjb25maWd1cmUocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIHRoaXMucmVuZGVyaW5nQ29udGV4dCA9IHJlbmRlcmluZ0NvbnRleHQ7XG4gIH1cblxuICAvKipcbiAgICogRGVzdHJveSBhIHRyYWNrXG4gICAqIFRoZSBsYXllcnMgZnJvbSB0aGlzIHRyYWNrIGNhbiBzdGlsbCBiZSByZXVzZWQgZWxzZXdoZXJlXG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIC8vIERldGFjaCBldmVyeXRoaW5nIGZyb20gdGhlIERPTVxuICAgIHRoaXMuJGVsLnJlbW92ZUNoaWxkKHRoaXMuJHN2Zyk7XG4gICAgdGhpcy5sYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHRoaXMuJGxheW91dC5yZW1vdmVDaGlsZChsYXllci4kZWwpKTtcbiAgICAvLyBjbGVhbiByZWZlcmVuY2VzXG4gICAgdGhpcy4kZWwgPSBudWxsO1xuICAgIHRoaXMucmVuZGVyaW5nQ29udGV4dCA9IG51bGw7XG4gICAgdGhpcy5sYXllcnMubGVuZ3RoID0gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIHRoZSBjb250YWluZXIgZm9yIHRoZSB0cmFja1xuICAgKi9cbiAgX2NyZWF0ZUNvbnRhaW5lcigpIHtcbiAgICBjb25zdCAkc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnc3ZnJyk7XG4gICAgJHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ29wdGltaXplU3BlZWQnKTtcbiAgICAkc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCB0aGlzLmhlaWdodCk7XG4gICAgJHN2Zy5zZXRBdHRyaWJ1dGUoJ3htbG5zOnhodG1sJywgJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnKTtcbiAgICAkc3ZnLmNsYXNzTGlzdC5hZGQoJ3RyYWNrJyk7XG5cbiAgICBjb25zdCAkYmFja2dyb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3JlY3QnKTtcbiAgICAkYmFja2dyb3VuZC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgJzEwMCUnKTtcbiAgICAkYmFja2dyb3VuZC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCAnMTAwJScpO1xuICAgICRiYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHlsZScsICdmaWxsLW9wYWNpdHk6MCcpO1xuXG4gICAgY29uc3QgJGRlZnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdkZWZzJyk7XG5cbiAgICBjb25zdCAkb2Zmc2V0R3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgJG9mZnNldEdyb3VwLmNsYXNzTGlzdC5hZGQoJ29mZnNldCcpO1xuXG4gICAgY29uc3QgJGxheW91dEdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgICRsYXlvdXRHcm91cC5jbGFzc0xpc3QuYWRkKCdsYXlvdXQnKTtcblxuICAgIGNvbnN0ICRpbnRlcmFjdGlvbnNHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICAkaW50ZXJhY3Rpb25zR3JvdXAuY2xhc3NMaXN0LmFkZCgnaW50ZXJhY3Rpb25zJyk7XG5cbiAgICAkc3ZnLmFwcGVuZENoaWxkKCRkZWZzKTtcbiAgICAkc3ZnLmFwcGVuZENoaWxkKCRiYWNrZ3JvdW5kKTtcbiAgICAkb2Zmc2V0R3JvdXAuYXBwZW5kQ2hpbGQoJGxheW91dEdyb3VwKTtcbiAgICAkc3ZnLmFwcGVuZENoaWxkKCRvZmZzZXRHcm91cCk7XG4gICAgJHN2Zy5hcHBlbmRDaGlsZCgkaW50ZXJhY3Rpb25zR3JvdXApO1xuXG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQoJHN2Zyk7XG4gICAgLy8gcmVtb3ZlcyBhZGRpdGlvbm5hbCBoZWlnaHQgYWRkZWQgd2hvIGtub3dzIHdoeS4uLlxuICAgIHRoaXMuJGVsLnN0eWxlLmZvbnRTaXplID0gMDtcbiAgICAvLyBmaXhlcyBvbmUgb2YgdGhlIChtYW55ID8pIHdlaXJkIGNhbnZhcyByZW5kZXJpbmcgYnVncyBpbiBDaHJvbWVcbiAgICB0aGlzLiRlbC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWigwKSc7XG5cbiAgICB0aGlzLiRsYXlvdXQgPSAkbGF5b3V0R3JvdXA7XG4gICAgdGhpcy4kb2Zmc2V0ID0gJG9mZnNldEdyb3VwO1xuICAgIHRoaXMuJGludGVyYWN0aW9ucyA9ICRpbnRlcmFjdGlvbnNHcm91cDtcbiAgICB0aGlzLiRzdmcgPSAkc3ZnO1xuICAgIHRoaXMuJGJhY2tncm91bmQgPSAkYmFja2dyb3VuZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgbGF5ZXIgdG8gdGhlIHRyYWNrXG4gICAqL1xuICBhZGQobGF5ZXIpIHtcbiAgICB0aGlzLmxheWVycy5wdXNoKGxheWVyKTtcbiAgICAvLyBDcmVhdGUgYSBkZWZhdWx0IHJlbmRlcmluZ0NvbnRleHQgZm9yIHRoZSBsYXllciBpZiBtaXNzaW5nXG4gICAgdGhpcy4kbGF5b3V0LmFwcGVuZENoaWxkKGxheWVyLiRlbCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGxheWVyXG4gICAqL1xuICByZW1vdmUobGF5ZXIpIHtcbiAgICB0aGlzLmxheWVycy5zcGxpY2UodGhpcy5sYXllcnMuaW5kZXhPZihsYXllciksIDEpO1xuICAgIC8vIFJlbW92ZXMgbGF5ZXIgZnJvbSBpdHMgY29udGFpbmVyXG4gICAgdGhpcy4kbGF5b3V0LnJlbW92ZUNoaWxkKGxheWVyLiRlbCk7XG4gIH1cblxuICAvKipcbiAgICogRHJhdyB0cmFja3MsIGFuZCB0aGUgbGF5ZXJzIGluIGNhc2NhZGVcbiAgICovXG4gIHJlbmRlcigpIHtcbiAgICBmb3IgKGxldCBsYXllciBvZiB0aGlzKSB7IGxheWVyLnJlbmRlcigpOyB9XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIHRoZSBsYXllcnNcbiAgICovXG4gIHVwZGF0ZShsYXllcnMgPSBudWxsKSB7XG4gICAgdGhpcy51cGRhdGVDb250YWluZXIoKTtcbiAgICB0aGlzLnVwZGF0ZUxheWVycyhsYXllcnMpO1xuICB9XG5cbiAgdXBkYXRlQ29udGFpbmVyKCkge1xuICAgIGNvbnN0ICRzdmcgPSB0aGlzLiRzdmc7XG4gICAgY29uc3QgJG9mZnNldCA9IHRoaXMuJG9mZnNldDtcbiAgICAvLyBTaG91bGQgYmUgaW4gc29tZSB1cGRhdGUgbGF5b3V0XG4gICAgY29uc3QgcmVuZGVyaW5nQ29udGV4dCA9IHRoaXMucmVuZGVyaW5nQ29udGV4dDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmhlaWdodDtcbiAgICBjb25zdCB3aWR0aCA9IHJlbmRlcmluZ0NvbnRleHQudmlzaWJsZVdpZHRoO1xuICAgIGNvbnN0IG9mZnNldFggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHJlbmRlcmluZ0NvbnRleHQub2Zmc2V0KTtcbiAgICBjb25zdCB0cmFuc2xhdGUgPSBgdHJhbnNsYXRlKCR7b2Zmc2V0WH0sIDApYDtcblxuICAgICRzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgJHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB3aWR0aCk7XG4gICAgJHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndmlld2JveCcsIGAwIDAgJHt3aWR0aH0gJHtoZWlnaHR9YCk7XG5cbiAgICAkb2Zmc2V0LnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCB0cmFuc2xhdGUpO1xuICB9XG5cbiAgdXBkYXRlTGF5ZXJzKGxheWVycyA9IG51bGwpIHtcbiAgICBsYXllcnMgPSAobGF5ZXJzID09PSBudWxsKSA/IHRoaXMubGF5ZXJzIDogbGF5ZXJzO1xuXG4gICAgbGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB7XG4gICAgICBpZiAodGhpcy5sYXllcnMuaW5kZXhPZihsYXllcikgPT09IC0xKSB7IHJldHVybjsgfVxuICAgICAgbGF5ZXIudXBkYXRlKCk7XG4gICAgfSk7XG4gIH1cblxuICAqW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgeWllbGQqIHRoaXMubGF5ZXJzW1N5bWJvbC5pdGVyYXRvcl0oKTtcbiAgfVxufVxuIl19