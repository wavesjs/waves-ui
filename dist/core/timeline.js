"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var ns = require("./namespace");
var TimeContext = require("./time-context");
var Surface = require("../interactions/surface");
var Keyboard = require("../interactions/keyboard");

var Timeline = (function () {
  function Timeline(params) {
    _classCallCheck(this, Timeline);

    this._defaults = {
      width: 1000,
      duration: 60
    };

    this.params = _core.Object.assign({}, this._defaults, params);
    this._createContext();
    this._state = null;

    this._containers = {};
    this._layerContainerMap = new _core.Map();

    this.layers = [];
    this._handleEvent = this._handleEvent.bind(this);

    this._createInteraction(Keyboard, "body");
  }

  _createClass(Timeline, {
    setState: {
      value: function setState(state) {
        if (this._state) {
          this._state.exit();
        }
        this._state = state;
        this._state.enter();
      }
    },
    _handleEvent: {

      /**
       *  Interactions
       */

      value: function _handleEvent(e) {
        if (!this._state) {
          return;
        }
        console.log(e);
        this._state.handleEvent(e);
      }
    },
    _createInteraction: {
      value: function _createInteraction(ctor, el) {
        var interaction = new ctor(el);
        interaction.on("event", this._handleEvent);
      }
    },
    _createContext: {
      value: function _createContext() {
        var duration = this.params.duration;
        var width = this.params.width;

        var xScale = d3.scale.linear().domain([0, duration]).range([0, width]);

        this.context = new TimeContext();
        this.context.duration = duration;
        this.context.xScale = xScale;
      }
    },
    xScale: {
      get: function () {
        return this.context.xScale;
      }
    },
    add: {
      value: function add(layer, containerId) {
        var context = arguments[2] === undefined ? null : arguments[2];

        var layerContext = context || new TimeContext(this.context);
        layer.setContext(layerContext);

        this._layerContainerMap.set(layer, containerId);
        this.layers.push(layer);
      }
    },
    remove: {
      value: function remove(layer) {}
    },
    registerContainer: {
      value: function registerContainer(id, el) {
        var options = arguments[2] === undefined ? {} : arguments[2];

        var width = this.params.width;
        var height = options.height || 120;

        var svg = document.createElementNS(ns, "svg");
        svg.setAttributeNS(null, "width", width);
        svg.setAttributeNS(null, "height", height);
        svg.setAttributeNS(null, "viewbox", "0 0 " + width + " " + height);

        var defs = document.createElementNS(ns, "defs");

        var layoutGroup = document.createElementNS(ns, "g");
        layoutGroup.classList.add("layout");

        var interactionsGroup = document.createElementNS(null, "g");
        interactionsGroup.classList.add("interactions");

        svg.appendChild(defs);
        svg.appendChild(layoutGroup);
        svg.appendChild(interactionsGroup);

        el.appendChild(svg);

        this._containers[id] = { layoutGroup: layoutGroup, interactionsGroup: interactionsGroup, DOMElement: el };
        this._createInteraction(Surface, svg);
      }
    },
    render: {
      value: function render() {
        var _this = this;

        this.layers.forEach(function (layer) {
          var containerId = _this._layerContainerMap.get(layer);
          var layout = _this._containers[containerId].layoutGroup;

          layout.appendChild(layer.render());
        });
      }
    },
    draw: {
      value: function draw() {
        this.layers.forEach(function (layer) {
          return layer.draw();
        });
      }
    },
    update: {
      value: function update() {
        this.layers.forEach(function (layer) {
          return layer.update();
        });
      }
    }
  });

  return Timeline;
})();

module.exports = Timeline;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3RpbWVsaW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ2xDLElBQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQzlDLElBQU0sT0FBTyxHQUFJLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQ3BELElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDOztJQUcvQyxRQUFRO0FBQ0QsV0FEUCxRQUFRLENBQ0EsTUFBTSxFQUFFOzBCQURoQixRQUFROztBQUVWLFFBQUksQ0FBQyxTQUFTLEdBQUc7QUFDZixXQUFLLEVBQUUsSUFBSTtBQUNYLGNBQVEsRUFBRSxFQUFFO0tBQ2IsQ0FBQzs7QUFFRixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN4RCxRQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDdEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7O0FBRW5CLFFBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLFFBQUksQ0FBQyxrQkFBa0IsR0FBRyxVQUFJLEdBQUcsRUFBRSxDQUFDOztBQUVwQyxRQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNqQixRQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVqRCxRQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0dBQzNDOztlQWxCRyxRQUFRO0FBb0JaLFlBQVE7YUFBQSxrQkFBQyxLQUFLLEVBQUU7QUFDZCxZQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFBRSxjQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQUU7QUFDeEMsWUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7QUFDcEIsWUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztPQUNyQjs7QUFLRCxnQkFBWTs7Ozs7O2FBQUEsc0JBQUMsQ0FBQyxFQUFFO0FBQ2QsWUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFBRSxpQkFBTztTQUFFO0FBQzdCLGVBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZixZQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUM1Qjs7QUFFRCxzQkFBa0I7YUFBQSw0QkFBQyxJQUFJLEVBQUUsRUFBRSxFQUFFO0FBQzNCLFlBQU0sV0FBVyxHQUFHLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2pDLG1CQUFXLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7T0FDNUM7O0FBRUQsa0JBQWM7YUFBQSwwQkFBRztBQUNmLFlBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO0FBQ3RDLFlBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDOztBQUVoQyxZQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUM3QixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FDckIsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7O0FBRXJCLFlBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQztBQUNqQyxZQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsR0FBSSxRQUFRLENBQUM7QUFDbEMsWUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO09BQzlCOztBQUVHLFVBQU07V0FBQSxZQUFHO0FBQ1gsZUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztPQUM1Qjs7QUFFRCxPQUFHO2FBQUEsYUFBQyxLQUFLLEVBQUUsV0FBVyxFQUFrQjtZQUFoQixPQUFPLGdDQUFHLElBQUk7O0FBQ3BDLFlBQU0sWUFBWSxHQUFHLE9BQU8sSUFBSSxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDOUQsYUFBSyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQzs7QUFFL0IsWUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDaEQsWUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDekI7O0FBRUQsVUFBTTthQUFBLGdCQUFDLEtBQUssRUFBRSxFQUViOztBQUVELHFCQUFpQjthQUFBLDJCQUFDLEVBQUUsRUFBRSxFQUFFLEVBQWdCO1lBQWQsT0FBTyxnQ0FBRyxFQUFFOztBQUNwQyxZQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNoQyxZQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQzs7QUFFckMsWUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDaEQsV0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3pDLFdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUMzQyxXQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxTQUFTLFdBQVMsS0FBSyxTQUFJLE1BQU0sQ0FBRyxDQUFDOztBQUU5RCxZQUFNLElBQUksR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQzs7QUFFbEQsWUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDdEQsbUJBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUVwQyxZQUFNLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzlELHlCQUFpQixDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7O0FBRWhELFdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDckIsV0FBRyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQTtBQUM1QixXQUFHLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLENBQUM7O0FBRW5DLFVBQUUsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRXBCLFlBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxXQUFXLEVBQVgsV0FBVyxFQUFFLGlCQUFpQixFQUFqQixpQkFBaUIsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLENBQUM7QUFDMUUsWUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztPQUN2Qzs7QUFFRCxVQUFNO2FBQUEsa0JBQUc7OztBQUNQLFlBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFLO0FBQzdCLGNBQU0sV0FBVyxHQUFHLE1BQUssa0JBQWtCLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3ZELGNBQU0sTUFBTSxHQUFHLE1BQUssV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFdBQVcsQ0FBQzs7QUFFekQsZ0JBQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7U0FDcEMsQ0FBQyxDQUFDO09BQ0o7O0FBRUQsUUFBSTthQUFBLGdCQUFHO0FBQ0wsWUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLO2lCQUFLLEtBQUssQ0FBQyxJQUFJLEVBQUU7U0FBQSxDQUFDLENBQUM7T0FDOUM7O0FBRUQsVUFBTTthQUFBLGtCQUFHO0FBQ1AsWUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLO2lCQUFLLEtBQUssQ0FBQyxNQUFNLEVBQUU7U0FBQSxDQUFDLENBQUM7T0FDaEQ7Ozs7U0EvR0csUUFBUTs7O0FBa0hkLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDIiwiZmlsZSI6ImVzNi9jb3JlL3RpbWVsaW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgbnMgPSByZXF1aXJlKCcuL25hbWVzcGFjZScpO1xuY29uc3QgVGltZUNvbnRleHQgPSByZXF1aXJlKCcuL3RpbWUtY29udGV4dCcpO1xuY29uc3QgU3VyZmFjZSAgPSByZXF1aXJlKCcuLi9pbnRlcmFjdGlvbnMvc3VyZmFjZScpO1xuY29uc3QgS2V5Ym9hcmQgPSByZXF1aXJlKCcuLi9pbnRlcmFjdGlvbnMva2V5Ym9hcmQnKTtcblxuXG5jbGFzcyBUaW1lbGluZSB7XG4gIGNvbnN0cnVjdG9yKHBhcmFtcykge1xuICAgIHRoaXMuX2RlZmF1bHRzID0ge1xuICAgICAgd2lkdGg6IDEwMDAsXG4gICAgICBkdXJhdGlvbjogNjBcbiAgICB9O1xuXG4gICAgdGhpcy5wYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9kZWZhdWx0cywgcGFyYW1zKTtcbiAgICB0aGlzLl9jcmVhdGVDb250ZXh0KCk7XG4gICAgdGhpcy5fc3RhdGUgPSBudWxsO1xuXG4gICAgdGhpcy5fY29udGFpbmVycyA9IHt9O1xuICAgIHRoaXMuX2xheWVyQ29udGFpbmVyTWFwID0gbmV3IE1hcCgpO1xuXG4gICAgdGhpcy5sYXllcnMgPSBbXTtcbiAgICB0aGlzLl9oYW5kbGVFdmVudCA9IHRoaXMuX2hhbmRsZUV2ZW50LmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLl9jcmVhdGVJbnRlcmFjdGlvbihLZXlib2FyZCwgJ2JvZHknKTtcbiAgfVxuXG4gIHNldFN0YXRlKHN0YXRlKSB7XG4gICAgaWYgKHRoaXMuX3N0YXRlKSB7IHRoaXMuX3N0YXRlLmV4aXQoKTsgfVxuICAgIHRoaXMuX3N0YXRlID0gc3RhdGU7XG4gICAgdGhpcy5fc3RhdGUuZW50ZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgSW50ZXJhY3Rpb25zXG4gICAqL1xuICBfaGFuZGxlRXZlbnQoZSkge1xuICAgIGlmICghdGhpcy5fc3RhdGUpIHsgcmV0dXJuOyB9XG4gICAgY29uc29sZS5sb2coZSk7XG4gICAgdGhpcy5fc3RhdGUuaGFuZGxlRXZlbnQoZSk7XG4gIH1cblxuICBfY3JlYXRlSW50ZXJhY3Rpb24oY3RvciwgZWwpIHtcbiAgICBjb25zdCBpbnRlcmFjdGlvbiA9IG5ldyBjdG9yKGVsKTtcbiAgICBpbnRlcmFjdGlvbi5vbignZXZlbnQnLCB0aGlzLl9oYW5kbGVFdmVudCk7XG4gIH1cblxuICBfY3JlYXRlQ29udGV4dCgpIHtcbiAgICBjb25zdCBkdXJhdGlvbiA9IHRoaXMucGFyYW1zLmR1cmF0aW9uO1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5wYXJhbXMud2lkdGg7XG5cbiAgICBjb25zdCB4U2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuICAgICAgLmRvbWFpbihbMCwgZHVyYXRpb25dKVxuICAgICAgLnJhbmdlKFswLCB3aWR0aF0pO1xuXG4gICAgdGhpcy5jb250ZXh0ID0gbmV3IFRpbWVDb250ZXh0KCk7XG4gICAgdGhpcy5jb250ZXh0LmR1cmF0aW9uID0gIGR1cmF0aW9uO1xuICAgIHRoaXMuY29udGV4dC54U2NhbGUgPSB4U2NhbGU7XG4gIH1cblxuICBnZXQgeFNjYWxlKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQueFNjYWxlO1xuICB9XG5cbiAgYWRkKGxheWVyLCBjb250YWluZXJJZCwgY29udGV4dCA9IG51bGwpIHtcbiAgICBjb25zdCBsYXllckNvbnRleHQgPSBjb250ZXh0IHx8wqBuZXcgVGltZUNvbnRleHQodGhpcy5jb250ZXh0KTtcbiAgICBsYXllci5zZXRDb250ZXh0KGxheWVyQ29udGV4dCk7XG5cbiAgICB0aGlzLl9sYXllckNvbnRhaW5lck1hcC5zZXQobGF5ZXIsIGNvbnRhaW5lcklkKTtcbiAgICB0aGlzLmxheWVycy5wdXNoKGxheWVyKTtcbiAgfVxuXG4gIHJlbW92ZShsYXllcikge1xuXG4gIH1cblxuICByZWdpc3RlckNvbnRhaW5lcihpZCwgZWwsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5wYXJhbXMud2lkdGg7XG4gICAgY29uc3QgaGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHQgfHwgMTIwO1xuXG4gICAgY29uc3Qgc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnc3ZnJyk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHdpZHRoKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICd2aWV3Ym94JywgYDAgMCAke3dpZHRofSAke2hlaWdodH1gKTtcblxuICAgIGNvbnN0IGRlZnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdkZWZzJyk7XG5cbiAgICBjb25zdCBsYXlvdXRHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICBsYXlvdXRHcm91cC5jbGFzc0xpc3QuYWRkKCdsYXlvdXQnKTtcblxuICAgIGNvbnN0IGludGVyYWN0aW9uc0dyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG51bGwsICdnJyk7XG4gICAgaW50ZXJhY3Rpb25zR3JvdXAuY2xhc3NMaXN0LmFkZCgnaW50ZXJhY3Rpb25zJyk7XG5cbiAgICBzdmcuYXBwZW5kQ2hpbGQoZGVmcylcbiAgICBzdmcuYXBwZW5kQ2hpbGQobGF5b3V0R3JvdXApXG4gICAgc3ZnLmFwcGVuZENoaWxkKGludGVyYWN0aW9uc0dyb3VwKTtcblxuICAgIGVsLmFwcGVuZENoaWxkKHN2Zyk7XG5cbiAgICB0aGlzLl9jb250YWluZXJzW2lkXSA9IHsgbGF5b3V0R3JvdXAsIGludGVyYWN0aW9uc0dyb3VwLCBET01FbGVtZW50OiBlbCB9O1xuICAgIHRoaXMuX2NyZWF0ZUludGVyYWN0aW9uKFN1cmZhY2UsIHN2Zyk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgdGhpcy5sYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lcklkID0gdGhpcy5fbGF5ZXJDb250YWluZXJNYXAuZ2V0KGxheWVyKTtcbiAgICAgIGNvbnN0IGxheW91dCA9IHRoaXMuX2NvbnRhaW5lcnNbY29udGFpbmVySWRdLmxheW91dEdyb3VwO1xuXG4gICAgICBsYXlvdXQuYXBwZW5kQ2hpbGQobGF5ZXIucmVuZGVyKCkpO1xuICAgIH0pO1xuICB9XG5cbiAgZHJhdygpIHtcbiAgICB0aGlzLmxheWVycy5mb3JFYWNoKChsYXllcikgPT4gbGF5ZXIuZHJhdygpKTtcbiAgfVxuXG4gIHVwZGF0ZSgpIHtcbiAgICB0aGlzLmxheWVycy5mb3JFYWNoKChsYXllcikgPT4gbGF5ZXIudXBkYXRlKCkpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVGltZWxpbmU7Il19