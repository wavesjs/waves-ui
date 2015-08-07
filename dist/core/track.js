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
* ```
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
* ``
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
*
* ```
* <svg class="track" xmlns:xhtml="http://www.w3.org/1999/xhtml" height="100" shape-rendering="optimizeSpeed">
*  <defs></defs> Unused for the moment, could be used to define custom shapes for use with layers
*  <rect style="fill-opacity:0" width="100%" height="100%"></rect>
*  <g class="offset">
*    <g class="layout"></g> The layers are inserted here
*  </g>
*  <g class="interactions"></g> Placeholder to visualize interactions (eg. brush)
* </svg>
* ```
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3RyYWNrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFBZSxhQUFhOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBeURQLEtBQUs7QUFDYixXQURRLEtBQUssQ0FDWixHQUFHLEVBQWdCO1FBQWQsTUFBTSx5REFBRyxHQUFHOzswQkFEVixLQUFLOztBQUV0QixRQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNmLFFBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDOzs7QUFHdEIsUUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQzs7QUFFN0IsUUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7R0FDekI7O2VBVmtCLEtBQUs7Ozs7Ozs7OztXQXlCZixtQkFBQyxnQkFBZ0IsRUFBRTtBQUMxQixVQUFJLENBQUMsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUM7S0FDMUM7Ozs7Ozs7O1dBTU0sbUJBQUc7Ozs7QUFFUixVQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEMsVUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLO2VBQUssTUFBSyxPQUFPLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7T0FBQSxDQUFDLENBQUM7O0FBRXBFLFVBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLFVBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7QUFDN0IsVUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0tBQ3hCOzs7Ozs7O1dBS2UsNEJBQUc7QUFDakIsVUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLGVBQWUseUJBQUssS0FBSyxDQUFDLENBQUM7QUFDakQsVUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsZUFBZSxDQUFDLENBQUM7QUFDOUQsVUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNqRCxVQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSw4QkFBOEIsQ0FBQyxDQUFDO0FBQ2pFLFVBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU1QixVQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsZUFBZSx5QkFBSyxNQUFNLENBQUMsQ0FBQztBQUN6RCxpQkFBVyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ25ELGlCQUFXLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDbEQsaUJBQVcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDOztBQUU1RCxVQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsZUFBZSx5QkFBSyxNQUFNLENBQUMsQ0FBQzs7QUFFbkQsVUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLGVBQWUseUJBQUssR0FBRyxDQUFDLENBQUM7QUFDdkQsa0JBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUVyQyxVQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsZUFBZSx5QkFBSyxHQUFHLENBQUMsQ0FBQztBQUN2RCxrQkFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRXJDLFVBQU0sa0JBQWtCLEdBQUcsUUFBUSxDQUFDLGVBQWUseUJBQUssR0FBRyxDQUFDLENBQUM7QUFDN0Qsd0JBQWtCLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQzs7QUFFakQsVUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4QixVQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzlCLGtCQUFZLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3ZDLFVBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDL0IsVUFBSSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOztBQUVyQyxVQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFM0IsVUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQzs7QUFFNUIsVUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLGVBQWUsQ0FBQzs7QUFFM0MsVUFBSSxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUM7QUFDNUIsVUFBSSxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUM7QUFDNUIsVUFBSSxDQUFDLGFBQWEsR0FBRyxrQkFBa0IsQ0FBQztBQUN4QyxVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixVQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztLQUNoQzs7Ozs7OztXQUtFLGFBQUMsS0FBSyxFQUFFO0FBQ1QsVUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRXhCLFVBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNyQzs7Ozs7OztXQUtLLGdCQUFDLEtBQUssRUFBRTtBQUNaLFVBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUVsRCxVQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDckM7Ozs7Ozs7V0FLSyxrQkFBRzs7Ozs7O0FBQ1AsMENBQWtCLElBQUksNEdBQUU7Y0FBZixLQUFLO0FBQVksZUFBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQUU7Ozs7Ozs7Ozs7Ozs7OztLQUM1Qzs7Ozs7OztXQUtLLGtCQUFnQjtVQUFmLE1BQU0seURBQUcsSUFBSTs7QUFDbEIsVUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQ3ZCLFVBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDM0I7OztXQUVjLDJCQUFHO0FBQ2hCLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDdkIsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQzs7QUFFN0IsVUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7QUFDL0MsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUMzQixVQUFNLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUM7QUFDNUMsVUFBTSxPQUFPLEdBQUcsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3RFLFVBQU0sU0FBUyxrQkFBZ0IsT0FBTyxTQUFNLENBQUM7O0FBRTdDLFVBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUM1QyxVQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDMUMsVUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxXQUFTLEtBQUssU0FBSSxNQUFNLENBQUcsQ0FBQzs7QUFFL0QsYUFBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0tBQ3REOzs7V0FFVyx3QkFBZ0I7OztVQUFmLE1BQU0seURBQUcsSUFBSTs7QUFDeEIsWUFBTSxHQUFHLEFBQUMsTUFBTSxLQUFLLElBQUksR0FBSSxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQzs7QUFFbEQsWUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUssRUFBSztBQUN4QixZQUFJLE9BQUssTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUFFLGlCQUFPO1NBQUU7QUFDbEQsYUFBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO09BQ2hCLENBQUMsQ0FBQztLQUNKOzs7b0NBRWlCOzs7OzBEQUNULElBQUksQ0FBQyxNQUFNOzs7Ozs7O0tBQ25COzs7U0F6SVMsZUFBRztBQUNYLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztLQUNyQjtTQUVTLGFBQUMsS0FBSyxFQUFFO0FBQ2hCLFVBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0tBRXRCOzs7U0FuQmtCLEtBQUs7OztxQkFBTCxLQUFLIiwiZmlsZSI6ImVzNi9jb3JlL3RyYWNrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG5zIGZyb20gJy4vbmFtZXNwYWNlJztcblxuXG4vKipcbiogQXMgYSB0ZW1wb3JhbCByZXByZXNlbnRhdGlvbiwgYSB0cmFjayBlc3RhYmxpc2hlcyBhIHJlbGF0aW9uIGJldHdlZW4gKnRpbWUqIGluIHNlY29uZHMgYW5kICpzcGFjZSogaW4gcGl4ZWxzLlxuKlxuKiBBIGBUcmFja2AgaW5zdGFuY2UgY2FuIGhhdmUgbXVsdGlwbGUgYExheWVyYCBpbnN0YW5jZXMuXG4qXG4qIFRyYWNrcyBpbnNpZGUgYSB0aW1lbGluZVxuKlxuKiBBIHRlbXBvcmFsIHJlcHJlc2VudGF0aW9uIGNhbiBiZSByZW5kZXJlZCB1cG9uIG11bHRpcGxlIERPTSBlbGVtZW50cywgdGhlIHRyYWNrcyAoZWcgbXVsdGlwbGUgPGxpPiBmb3IgYSBEQVcgbGlrZSByZXByZXNlbnRhdGlvbikgdGhhdCBiZWxvbmcgdG8gdGhlIHNhbWUgdGltZWxpbmUgdXNpbmcgdGhlIGBhZGRgIG1ldGhvZC4gVGhlc2UgdHJhY2tzIGFyZSBsaWtlIHdpbmRvd3Mgb24gdGhlIG92ZXJhbGwgYW5kIGJhc2ljYWxseSB1bmVuZGluZyB0aW1lbGluZS5cbipcbiogQSB0aW1lbGluZSB3aXRoIDMgdHJhY2tzOlxuKlxuKiBgYGBcbiogKy0tLS0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rLS0gLSAtICAtICAtICAgLVxuKiB8dHJhY2sgMSAgICAgICAgICB8eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHxcbiogKy0tLS0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rLS0gLSAtICAtICAtICAgLVxuKiB8dHJhY2sgMiAgICAgICAgICB8eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHxcbiogKy0tLS0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rLS0gLSAtICAtICAtICAgLVxuKiB8dHJhY2sgMyAgICAgICAgICB8eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHxcbiogKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rLS0gLSAtICAtICAtICAgLVxuKlxuKiArLS0tLS0tLS0tLS0tLS0tLS0+XG4qIHRpbWVsaW5lLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRpbWVsaW5lLnRpbWVDb250ZXh0Lm9mZnNldClcbipcbiogICAgICAgICAgICAgICAgICAgPC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0+XG4qICAgICAgICAgICAgICAgICAgIHRpbWVsaW5lJ3MgdHJhY2tzIGRlZmF1bHRzIHRvIDEwMDBweFxuKiAgICAgICAgICAgICAgICAgICB3aXRoIGEgZGVmYXVsdCBwaXhlbHNQZXJTZWNvbmQgb2YgMTAwcHgvcy5cbiogICAgICAgICAgICAgICAgICAgYW5kIGEgZGVmYXVsdCBgc3RyZXRjaFJhdGlvID0gMWBcbiogICAgICAgICAgICAgICAgICAgdHJhY2sxIHNob3dzIDEwIHNlY29uZHMgb2YgdGhlIHRpbWVsaW5lXG4qIGBgXG4qXG4qIExheWVycyBpbnNpZGUgYSB0cmFja1xuKlxuKiBXaXRoaW4gYSB0cmFjaywgYSBgTGF5ZXJgIGtlZXBzIHVwLXRvLWRhdGUgYW5kIHJlbmRlcnMgdGhlIGRhdGEuIFRoZSB0cmFjaydzIGBhZGRgIG1ldGhvZCBhZGRzIGEgYExheWVyYCBpbnN0YW5jZSB0byBhIHRyYWNrLiBBIExheWVyXG4qXG4qIFRoZSB0cmFjayByZW5kZXJpbmdDb250ZXh0XG4qXG4qIFdoZW4gb25lIG1vZGlmeSB0aGUgdGltZWxpbmUgcmVuZGVyaW5nQ29udGV4dDpcbiogLSB0aW1lbGluZS5yZW5kZXJpbmdDb250ZXh0Lm9mZnNldCAoaW4gc2Vjb25kcykgbW9kaWZ5IHRoZSBjb250YWluZXJzIHRyYWNrIHggcG9zaXRpb25cbiogLSB0aW1lbGluZS5yZW5kZXJpbmdDb250ZXh0LnN0cmV0Y2hSYXRpbyBtb2RpZnkgdGltZWxpbmUncyB6b29tXG4qIEVhY2ggdGltZSB5b3Ugc2V0IG5ldyB2YWx1ZSBvZiBvZmZzZXQgb3Igc3RyZXRjaFJhdGlvLCB5b3UgbmVlZCB0byBkbyBgdGltZWxpbmUudXBkYXRlKClgIHRvIHVwZGF0ZSB0aGUgdmFsdWVzLlxuKiBUcmFjayBTVkcgc3RydWN0dXJlXG4qXG4qIGBgYFxuKiA8c3ZnIGNsYXNzPVwidHJhY2tcIiB4bWxuczp4aHRtbD1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWxcIiBoZWlnaHQ9XCIxMDBcIiBzaGFwZS1yZW5kZXJpbmc9XCJvcHRpbWl6ZVNwZWVkXCI+XG4qICA8ZGVmcz48L2RlZnM+IFVudXNlZCBmb3IgdGhlIG1vbWVudCwgY291bGQgYmUgdXNlZCB0byBkZWZpbmUgY3VzdG9tIHNoYXBlcyBmb3IgdXNlIHdpdGggbGF5ZXJzXG4qICA8cmVjdCBzdHlsZT1cImZpbGwtb3BhY2l0eTowXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiPjwvcmVjdD5cbiogIDxnIGNsYXNzPVwib2Zmc2V0XCI+XG4qICAgIDxnIGNsYXNzPVwibGF5b3V0XCI+PC9nPiBUaGUgbGF5ZXJzIGFyZSBpbnNlcnRlZCBoZXJlXG4qICA8L2c+XG4qICA8ZyBjbGFzcz1cImludGVyYWN0aW9uc1wiPjwvZz4gUGxhY2Vob2xkZXIgdG8gdmlzdWFsaXplIGludGVyYWN0aW9ucyAoZWcuIGJydXNoKVxuKiA8L3N2Zz5cbiogYGBgXG4qL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmFjayB7XG4gIGNvbnN0cnVjdG9yKCRlbCwgaGVpZ2h0ID0gMTAwKSB7XG4gICAgdGhpcy4kZWwgPSAkZWw7XG4gICAgdGhpcy5sYXllcnMgPSBbXTtcbiAgICB0aGlzLl9oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICAvLyBhcmUgc2V0IHdoZW4gYWRkZWQgdG8gdGhlIHRpbWVsaW5lXG4gICAgdGhpcy5yZW5kZXJpbmdDb250ZXh0ID0gbnVsbDtcblxuICAgIHRoaXMuX2NyZWF0ZUNvbnRhaW5lcigpO1xuICB9XG5cbiAgZ2V0IGhlaWdodCgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xuICB9XG5cbiAgc2V0IGhlaWdodCh2YWx1ZSkge1xuICAgIHRoaXMuX2hlaWdodCA9IHZhbHVlO1xuICAgIC8vIEBOT1RFOiBwcm9wYWdhdGUgdG8gbGF5ZXJzLCBrZWVwaW5nIHJhdGlvID9cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgd2hlbiB0aGUgdHJhY2sgaXMgYWRkZWQgdG8gdGhlIHRpbWVsaW5lXG4gICAqIFRoZSB0cmFjayBjYW5ub3QgYmUgdXBkYXRlZCB3aXRob3V0IGJlaW5nIGFkZGVkIHRvIGEgdGltZWxpbmVcbiAgICovXG4gIGNvbmZpZ3VyZShyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgdGhpcy5yZW5kZXJpbmdDb250ZXh0ID0gcmVuZGVyaW5nQ29udGV4dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95IGEgdHJhY2tcbiAgICogVGhlIGxheWVycyBmcm9tIHRoaXMgdHJhY2sgY2FuIHN0aWxsIGJlIHJldXNlZCBlbHNld2hlcmVcbiAgICovXG4gIGRlc3Ryb3koKSB7XG4gICAgLy8gRGV0YWNoIGV2ZXJ5dGhpbmcgZnJvbSB0aGUgRE9NXG4gICAgdGhpcy4kZWwucmVtb3ZlQ2hpbGQodGhpcy4kc3ZnKTtcbiAgICB0aGlzLmxheWVycy5mb3JFYWNoKChsYXllcikgPT4gdGhpcy4kbGF5b3V0LnJlbW92ZUNoaWxkKGxheWVyLiRlbCkpO1xuICAgIC8vIGNsZWFuIHJlZmVyZW5jZXNcbiAgICB0aGlzLiRlbCA9IG51bGw7XG4gICAgdGhpcy5yZW5kZXJpbmdDb250ZXh0ID0gbnVsbDtcbiAgICB0aGlzLmxheWVycy5sZW5ndGggPSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgdGhlIGNvbnRhaW5lciBmb3IgdGhlIHRyYWNrXG4gICAqL1xuICBfY3JlYXRlQ29udGFpbmVyKCkge1xuICAgIGNvbnN0ICRzdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdzdmcnKTtcbiAgICAkc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnb3B0aW1pemVTcGVlZCcpO1xuICAgICRzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIHRoaXMuaGVpZ2h0KTtcbiAgICAkc3ZnLnNldEF0dHJpYnV0ZSgneG1sbnM6eGh0bWwnLCAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCcpO1xuICAgICRzdmcuY2xhc3NMaXN0LmFkZCgndHJhY2snKTtcblxuICAgIGNvbnN0ICRiYWNrZ3JvdW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAncmVjdCcpO1xuICAgICRiYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCAnMTAwJScpO1xuICAgICRiYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsICcxMDAlJyk7XG4gICAgJGJhY2tncm91bmQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0eWxlJywgJ2ZpbGwtb3BhY2l0eTowJyk7XG5cbiAgICBjb25zdCAkZGVmcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2RlZnMnKTtcblxuICAgIGNvbnN0ICRvZmZzZXRHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICAkb2Zmc2V0R3JvdXAuY2xhc3NMaXN0LmFkZCgnb2Zmc2V0Jyk7XG5cbiAgICBjb25zdCAkbGF5b3V0R3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgJGxheW91dEdyb3VwLmNsYXNzTGlzdC5hZGQoJ2xheW91dCcpO1xuXG4gICAgY29uc3QgJGludGVyYWN0aW9uc0dyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgICRpbnRlcmFjdGlvbnNHcm91cC5jbGFzc0xpc3QuYWRkKCdpbnRlcmFjdGlvbnMnKTtcblxuICAgICRzdmcuYXBwZW5kQ2hpbGQoJGRlZnMpO1xuICAgICRzdmcuYXBwZW5kQ2hpbGQoJGJhY2tncm91bmQpO1xuICAgICRvZmZzZXRHcm91cC5hcHBlbmRDaGlsZCgkbGF5b3V0R3JvdXApO1xuICAgICRzdmcuYXBwZW5kQ2hpbGQoJG9mZnNldEdyb3VwKTtcbiAgICAkc3ZnLmFwcGVuZENoaWxkKCRpbnRlcmFjdGlvbnNHcm91cCk7XG5cbiAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCgkc3ZnKTtcbiAgICAvLyByZW1vdmVzIGFkZGl0aW9ubmFsIGhlaWdodCBhZGRlZCB3aG8ga25vd3Mgd2h5Li4uXG4gICAgdGhpcy4kZWwuc3R5bGUuZm9udFNpemUgPSAwO1xuICAgIC8vIGZpeGVzIG9uZSBvZiB0aGUgKG1hbnkgPykgd2VpcmQgY2FudmFzIHJlbmRlcmluZyBidWdzIGluIENocm9tZVxuICAgIHRoaXMuJGVsLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVaKDApJztcblxuICAgIHRoaXMuJGxheW91dCA9ICRsYXlvdXRHcm91cDtcbiAgICB0aGlzLiRvZmZzZXQgPSAkb2Zmc2V0R3JvdXA7XG4gICAgdGhpcy4kaW50ZXJhY3Rpb25zID0gJGludGVyYWN0aW9uc0dyb3VwO1xuICAgIHRoaXMuJHN2ZyA9ICRzdmc7XG4gICAgdGhpcy4kYmFja2dyb3VuZCA9ICRiYWNrZ3JvdW5kO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBsYXllciB0byB0aGUgdHJhY2tcbiAgICovXG4gIGFkZChsYXllcikge1xuICAgIHRoaXMubGF5ZXJzLnB1c2gobGF5ZXIpO1xuICAgIC8vIENyZWF0ZSBhIGRlZmF1bHQgcmVuZGVyaW5nQ29udGV4dCBmb3IgdGhlIGxheWVyIGlmIG1pc3NpbmdcbiAgICB0aGlzLiRsYXlvdXQuYXBwZW5kQ2hpbGQobGF5ZXIuJGVsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgbGF5ZXJcbiAgICovXG4gIHJlbW92ZShsYXllcikge1xuICAgIHRoaXMubGF5ZXJzLnNwbGljZSh0aGlzLmxheWVycy5pbmRleE9mKGxheWVyKSwgMSk7XG4gICAgLy8gUmVtb3ZlcyBsYXllciBmcm9tIGl0cyBjb250YWluZXJcbiAgICB0aGlzLiRsYXlvdXQucmVtb3ZlQ2hpbGQobGF5ZXIuJGVsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEcmF3IHRyYWNrcywgYW5kIHRoZSBsYXllcnMgaW4gY2FzY2FkZVxuICAgKi9cbiAgcmVuZGVyKCkge1xuICAgIGZvciAobGV0IGxheWVyIG9mIHRoaXMpIHsgbGF5ZXIucmVuZGVyKCk7IH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdGhlIGxheWVyc1xuICAgKi9cbiAgdXBkYXRlKGxheWVycyA9IG51bGwpIHtcbiAgICB0aGlzLnVwZGF0ZUNvbnRhaW5lcigpO1xuICAgIHRoaXMudXBkYXRlTGF5ZXJzKGxheWVycyk7XG4gIH1cblxuICB1cGRhdGVDb250YWluZXIoKSB7XG4gICAgY29uc3QgJHN2ZyA9IHRoaXMuJHN2ZztcbiAgICBjb25zdCAkb2Zmc2V0ID0gdGhpcy4kb2Zmc2V0O1xuICAgIC8vIFNob3VsZCBiZSBpbiBzb21lIHVwZGF0ZSBsYXlvdXRcbiAgICBjb25zdCByZW5kZXJpbmdDb250ZXh0ID0gdGhpcy5yZW5kZXJpbmdDb250ZXh0O1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuICAgIGNvbnN0IHdpZHRoID0gcmVuZGVyaW5nQ29udGV4dC52aXNpYmxlV2lkdGg7XG4gICAgY29uc3Qgb2Zmc2V0WCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwocmVuZGVyaW5nQ29udGV4dC5vZmZzZXQpO1xuICAgIGNvbnN0IHRyYW5zbGF0ZSA9IGB0cmFuc2xhdGUoJHtvZmZzZXRYfSwgMClgO1xuXG4gICAgJHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgaGVpZ2h0KTtcbiAgICAkc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHdpZHRoKTtcbiAgICAkc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICd2aWV3Ym94JywgYDAgMCAke3dpZHRofSAke2hlaWdodH1gKTtcblxuICAgICRvZmZzZXQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIHRyYW5zbGF0ZSk7XG4gIH1cblxuICB1cGRhdGVMYXllcnMobGF5ZXJzID0gbnVsbCkge1xuICAgIGxheWVycyA9IChsYXllcnMgPT09IG51bGwpID8gdGhpcy5sYXllcnMgOiBsYXllcnM7XG5cbiAgICBsYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHtcbiAgICAgIGlmICh0aGlzLmxheWVycy5pbmRleE9mKGxheWVyKSA9PT0gLTEpIHsgcmV0dXJuOyB9XG4gICAgICBsYXllci51cGRhdGUoKTtcbiAgICB9KTtcbiAgfVxuXG4gICpbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICB5aWVsZCogdGhpcy5sYXllcnNbU3ltYm9sLml0ZXJhdG9yXSgpO1xuICB9XG59XG4iXX0=