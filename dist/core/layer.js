"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var Context = require("./context");
var ns = require("./namespace");
var d3 = require("d3");

// create a private item -> id map to force d3 being in sync with the DOM
var _counter = 0;
var _datumIdMap = new _core.Map();

var Layer = (function () {
  function Layer() {
    var dataType = arguments[0] === undefined ? "collection" : arguments[0];
    var data = arguments[1] === undefined ? [] : arguments[1];
    var options = arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, Layer);

    this.dataType = dataType; // 'entity' || 'collection';
    this.data = data;

    var defaults = {
      height: 100, // should inherit from parent
      top: 0,
      debugContext: false };

    this.params = _core.Object.assign({}, defaults, options);

    // this.container = null; // offset group of the parent context
    this.group = null; // group created by the layer inside the context
    this.items = null; // d3 collection of the layer items

    // @NOTE remove in favor of LayerGroup ?
    // @private ?
    this.innerLayers = [];

    // ctor => accessors
    this._shapeConfiguration = null; // { ctor, accessors }
    this._commonShapeConfiguration = null; // { ctor, accessors }
    // item group <DOMElement> => shape
    this._itemShapeMap = new _core.Map();
    this._itemCommonShapeMap = new _core.Map(); // one entry max in this map

    this._behavior = null;
  }

  _createClass(Layer, {
    initialize: {
      value: function initialize(parentContext) {
        this.context = new Context(parentContext, {
          height: this.params.height,
          top: this.params.top,
          debug: this.params.debugContext
        });

        this.context.addClass("layer");
      }
    },
    data: {
      get: function () {
        return this._data;
      },
      set: function (data) {
        switch (this.dataType) {
          case "entity":
            if (this._data) {
              // if data already exists, reuse the reference
              this._data[0] = data;
            } else {
              this._data = [data];
            }
            break;
          case "collection":
          default:
            this._data = data;
            break;
        }
      }
    },
    addLayer: {

      // @NOTE remove in favor of layer's Group ?

      value: function addLayer(layer) {
        // @TODO insert a layer inside an already existing layers
        layer.initialize(this.context);
        this.innerLayers.push(layer);
      }
    },
    setShape: {

      // --------------------------------------
      // Configure Component
      // --------------------------------------

      /**
       *  Register the shape and its accessors to use in order to render
       *  the entity or collection
       *  @param ctor <Function:BaseShape> the constructor of the shape to be used
       *  @param accessors <Object> accessors to use in order to map the data structure
       */

      value: function setShape(ctor) {
        var accessors = arguments[1] === undefined ? {} : arguments[1];
        var options = arguments[2] === undefined ? {} : arguments[2];

        this._shapeConfiguration = { ctor: ctor, accessors: accessors };
      }
    },
    setCommonShape: {

      /**
       *  Register the shape to use with the entire collection
       *  example: the line in a beakpoint function
       *  @param ctor <BaseShape> the constructor of the shape to use to render data
       *  @param accessors <Object> accessors to use in order to map the data structure
       */

      value: function setCommonShape(ctor) {
        var accessors = arguments[1] === undefined ? {} : arguments[1];
        var options = arguments[2] === undefined ? {} : arguments[2];

        this._commonShapeConfiguration = { ctor: ctor, accessors: accessors };
      }
    },
    setBehavior: {

      /**
       *  Register the behavior to use when interacting with the shape
       *  @param behavior <BaseBehavior>
       */

      value: function setBehavior(behavior) {
        behavior.initialize(this);
        this._behavior = behavior;
      }
    },
    contextConfiguration: {

      // --------------------------------------
      // Context Accessors
      // --------------------------------------

      // @TODO setContextParameters
      // @TODO use an object to share a reference with application code

      // context accessors - these are only commands

      get: function () {}
    },
    start: {

      // these parameters should be in an object to work with references

      get: function () {
        return this.context.start;
      },
      set: function (value) {
        this.context.start = value;
      }
    },
    duration: {
      get: function () {
        return this.context.duration;
      },
      set: function (value) {
        this.context.duration = value;
      }
    },
    offset: {
      get: function () {
        return this.context.offset;
      },
      set: function (value) {
        this.context.offset = value;
      }
    },
    stretchRatio: {
      get: function () {
        return this.context.stretchRatio;
      },
      set: function (value) {
        this.context.stretchRatio = value;
      }
    },
    yDomain: {
      get: function () {
        return this.context.yDomain;
      },
      set: function (value) {
        this.context.yDomain = value;
      }
    },
    opacity: {
      get: function () {
        return this.context.opacity;
      },
      set: function (value) {
        this.context.opacity = value;
      }
    },
    selectedItems: {

      // @NOTE : move this in higher abstraction level ? => probably yes
      // apply the stretch ration on the data, reset stretch to 1
      // applyStretch() {}

      // --------------------------------------
      // Behavior Accessors
      // --------------------------------------

      /**
       *  Behavior entry points
       *  @NOTE API -> change for an Array as first argument
       *  @TODO     -> handle if no behavior is registered
       */

      get: function () {
        return this._behavior.selectedItems;
      }
    },
    select: {
      value: function select() {
        var _this = this;

        for (var _len = arguments.length, items = Array(_len), _key = 0; _key < _len; _key++) {
          items[_key] = arguments[_key];
        }

        items.forEach(function (item) {
          var datum = d3.select(item).datum();
          _this._behavior.select(item, datum);
          _this._toFront(item);
        });
      }
    },
    unselect: {
      value: function unselect() {
        var _this = this;

        for (var _len = arguments.length, items = Array(_len), _key = 0; _key < _len; _key++) {
          items[_key] = arguments[_key];
        }

        items.forEach(function (item) {
          var datum = d3.select(item).datum();
          _this._behavior.unselect(item, datum);
        });
      }
    },
    selectAll: {
      // @TODO test

      value: function selectAll() {
        var _this = this;

        this.items.forEach(function (item) {
          return _this.select(item);
        });
      }
    },
    unselectAll: {
      value: function unselectAll() {
        var _this = this;

        this.selectedItems.forEach(function (item) {
          return _this.unselect(item);
        });
      }
    },
    toggleSelection: {
      value: function toggleSelection() {
        var _this = this;

        for (var _len = arguments.length, items = Array(_len), _key = 0; _key < _len; _key++) {
          items[_key] = arguments[_key];
        }

        items.forEach(function (item) {
          var datum = d3.select(item).datum();
          _this._behavior.toggleSelection(item, datum);
        });
      }
    },
    edit: {

      // @TODO change signature edit(items = [...], dx, dy, target);
      // -> be consistent for all behaviors API

      value: function edit(item, dx, dy, target) {
        var datum = d3.select(item).datum();
        var shape = this._itemShapeMap.get(item);
        this._behavior.edit(this.context, shape, datum, dx, dy, target);
      }
    },
    _getItemFromDOMElement: {

      // --------------------------------------
      // Helpers
      // --------------------------------------

      /**
       * @return <DOMElement> the closest parent `item` group for a given DOM element
       */

      value: function _getItemFromDOMElement(el) {
        do {
          if (el.nodeName === "g" && el.classList.contains("item")) {
            return el;
          }
        } while (el = el.parentNode);
      }
    },
    _toFront: {
      value: function _toFront(item) {
        this.group.appendChild(item);
      }
    },
    hasItem: {

      /**
       *  @param <DOMElement> the element we want to find the closest `.item` group
       *  @return <mixed>
       *    <DOMElement> item group containing the el if belongs to this layer
       *    null otherwise
       */

      value: function hasItem(el) {
        var item = this._getItemFromDOMElement(el);
        return this.items[0].indexOf(item) !== -1 ? item : null;
      }
    },
    getItemsInArea: {

      /**
       *  @param area <Object> area in which to find the elements
       *  @return <Array> list of the DOM elements in the given area
       */

      value: function getItemsInArea(area) {
        // work in pixel domain
        var start = this.context.xScale(this.context.start);
        var duration = this.context.xScale(this.context.duration);
        var offset = this.context.xScale(this.context.offset);
        var top = this.params.top;
        // must be aware of the layer's context modifications
        // constrain in working view
        var x1 = Math.max(area.left, start);
        var x2 = Math.min(area.left + area.width, start + duration);
        // apply start and offset
        x1 -= start + offset;
        x2 -= start + offset;
        // @FIXME stretchRatio breaks selection
        // x2 *= this.context.stretchRatio;
        // be consistent with context y coordinates system
        var y1 = this.params.height - (area.top + area.height);
        var y2 = this.params.height - area.top;

        y1 += this.params.top;
        y2 += this.params.top;

        var itemShapeMap = this._itemShapeMap;
        var context = this.context;

        var items = this.items.filter(function (datum, index) {
          var group = this;
          var shape = itemShapeMap.get(group);
          return shape.inArea(context, datum, x1, y1, x2, y2);
        });

        return items[0].slice(0);
      }
    },
    each: {

      // helper to add some class or stuff on items

      value: function each() {
        var callback = arguments[0] === undefined ? null : arguments[0];
      }
    },
    render: {

      /**
       *  creates the layer group with a transformation matrix to flip the coordinate system.
       *  @NOTE: put the context inside the layer group ? reverse the DOM order
       */

      value: function render() {
        var height = this.params.height;
        var top = this.params.top;
        // matrix to invert the coordinate system
        var invertMatrix = "matrix(1, 0, 0, -1, 0, " + height + ")";
        // create the DOM of the context
        var el = this.context.render();
        // create a group to flip the context of the layer
        this.group = document.createElementNS(ns, "g");
        this.group.classList.add("items");
        this.group.setAttributeNS(null, "transform", invertMatrix);
        // append the group to the context
        this.context.offsetGroup.appendChild(this.group);
        var innerGroup = this.context.offsetGroup;

        this.innerLayers.forEach(function (layer) {
          innerGroup.appendChild(layer.render());
        });

        return el;
      }
    },
    draw: {

      /**
       * create the DOM according to given data and shapes
       */

      value: function draw() {
        var _this = this;

        // @NOTE: create a unique id to force d3 to keep data in sync with the DOM
        // @TODO: read again http://bost.ocks.org/mike/selection/
        this.data.forEach(function (datum) {
          if (_datumIdMap.has(datum)) {
            return;
          }
          _datumIdMap.set(datum, _counter++);
        });

        // select items
        this.items = d3.select(this.group).selectAll(".item").filter(function () {
          return !this.classList.contains("common");
        }).data(this.data, function (datum) {
          return _datumIdMap.get(datum);
        });

        // handle commonShapes
        if (this._commonShapeConfiguration !== null) {
          var _commonShapeConfiguration = this._commonShapeConfiguration;
          var ctor = _commonShapeConfiguration.ctor;
          var accessors = _commonShapeConfiguration.accessors;

          var group = document.createElementNS(ns, "g");
          var shape = new ctor(group);

          shape.install(accessors);
          group.appendChild(shape.render());
          group.classList.add("item", "common", shape.getClassName());

          this._itemCommonShapeMap.set(group, shape);
          this.group.appendChild(group);
        }

        // enter
        this.items.enter().append(function (datum, index) {
          // @NOTE: d3 binds `this` to the container group
          // create a group for the item
          var group = document.createElementNS(ns, "g");
          var _shapeConfiguration = _this._shapeConfiguration;
          var ctor = _shapeConfiguration.ctor;
          var accessors = _shapeConfiguration.accessors;

          var shape = new ctor();
          // install accessors on the newly created shape
          shape.install(accessors);

          group.appendChild(shape.render(_this.context));
          group.classList.add("item", shape.getClassName());

          _this._itemShapeMap.set(group, shape);

          return group;
        });

        // exit
        var that = this;

        this.items.exit().each(function (datum, index) {
          var group = this;
          var shape = that._itemShapesMap.get(group);

          shape.destroy(); // clean shape
          _datumIdMap["delete"](datum); // clean reference in `id` map
          that._itemShapeMap["delete"](group); // destroy reference in item shape map
        }).remove();

        // render innerLayers
        this.innerLayers.forEach(function (layer) {
          return layer.draw();
        });
      }
    },
    update: {

      /**
       *  updates DOM context and shapes
       */

      value: function update() {
        this.updateContext();
        this.updateShapes();
      }
    },
    updateContext: {

      /**
       *  updates DOM context only
       */

      value: function updateContext() {
        // update context
        this.context.update();
        // update innerLayers
        this.innerLayers.forEach(function (layer) {
          return layer.updateContext();
        });
      }
    },
    updateShapes: {

      /**
       *  updates DOM context and Shapes
       *  @param
       */

      value: function updateShapes() {
        var _this = this;

        var item = arguments[0] === undefined ? null : arguments[0];

        var that = this;
        var context = this.context;
        var items = item !== null ? d3.selectAll(item) : this.items;

        // update common shapes
        this._itemCommonShapeMap.forEach(function (shape, item) {
          shape.update(context, item, _this.data);
        });

        // update entity or collection shapes
        items.each(function (datum, index) {
          // update all shapes related to the current item
          var group = this; // current `g.item`
          var shape = that._itemShapeMap.get(group);
          shape.update(context, group, datum, index);
        });

        // update innerLayers
        this.innerLayers.forEach(function (layer) {
          return layer.updateShapes();
        });
      }
    }
  });

  return Layer;
})();

module.exports = Layer;
// pass the context in debug mode
//# sourceMappingURL=data:application/json;base64,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QUM1QyxlQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQzVDLENBQUMsQ0FBQzs7O0FBR0gsWUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLO2lCQUFLLEtBQUssQ0FBQyxZQUFZLEVBQUU7U0FBQSxDQUFDLENBQUM7T0FDM0Q7Ozs7U0F4WUcsS0FBSzs7O0FBMllYLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDIiwiZmlsZSI6ImVzNi9jb3JlL2xheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQ29udGV4dCA9IHJlcXVpcmUoJy4vY29udGV4dCcpO1xuY29uc3QgbnMgPSByZXF1aXJlKCcuL25hbWVzcGFjZScpO1xuY29uc3QgZDMgPSByZXF1aXJlKCdkMycpXG5cbi8vIGNyZWF0ZSBhIHByaXZhdGUgaXRlbSAtPiBpZCBtYXAgdG8gZm9yY2UgZDMgYmVpbmcgaW4gc3luYyB3aXRoIHRoZSBET01cbmxldCBfY291bnRlciA9IDA7XG5jb25zdCBfZGF0dW1JZE1hcCA9IG5ldyBNYXAoKTtcblxuY2xhc3MgTGF5ZXIge1xuICBjb25zdHJ1Y3RvcihkYXRhVHlwZSA9ICdjb2xsZWN0aW9uJywgZGF0YSA9IFtdLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLmRhdGFUeXBlID0gZGF0YVR5cGU7IC8vICdlbnRpdHknIHx8ICdjb2xsZWN0aW9uJztcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBoZWlnaHQ6IDEwMCwgLy8gc2hvdWxkIGluaGVyaXQgZnJvbSBwYXJlbnRcbiAgICAgIHRvcDogMCxcbiAgICAgIGRlYnVnQ29udGV4dDogZmFsc2UsIC8vIHBhc3MgdGhlIGNvbnRleHQgaW4gZGVidWcgbW9kZVxuICAgIH1cblxuICAgIHRoaXMucGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuXG4gICAgLy8gdGhpcy5jb250YWluZXIgPSBudWxsOyAvLyBvZmZzZXQgZ3JvdXAgb2YgdGhlIHBhcmVudCBjb250ZXh0XG4gICAgdGhpcy5ncm91cCA9IG51bGw7IC8vIGdyb3VwIGNyZWF0ZWQgYnkgdGhlIGxheWVyIGluc2lkZSB0aGUgY29udGV4dFxuICAgIHRoaXMuaXRlbXMgPSBudWxsOyAvLyBkMyBjb2xsZWN0aW9uIG9mIHRoZSBsYXllciBpdGVtc1xuXG4gICAgLy8gQE5PVEUgcmVtb3ZlIGluIGZhdm9yIG9mIExheWVyR3JvdXAgP1xuICAgIC8vIEBwcml2YXRlID9cbiAgICB0aGlzLmlubmVyTGF5ZXJzID0gW107XG5cbiAgICAvLyBjdG9yID0+IGFjY2Vzc29yc1xuICAgIHRoaXMuX3NoYXBlQ29uZmlndXJhdGlvbiA9IG51bGw7IC8vIHsgY3RvciwgYWNjZXNzb3JzIH1cbiAgICB0aGlzLl9jb21tb25TaGFwZUNvbmZpZ3VyYXRpb24gPSBudWxsOyAvLyB7IGN0b3IsIGFjY2Vzc29ycyB9XG4gICAgLy8gaXRlbSBncm91cCA8RE9NRWxlbWVudD4gPT4gc2hhcGVcbiAgICB0aGlzLl9pdGVtU2hhcGVNYXAgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5faXRlbUNvbW1vblNoYXBlTWFwID0gbmV3IE1hcCgpOyAvLyBvbmUgZW50cnkgbWF4IGluIHRoaXMgbWFwXG5cbiAgICB0aGlzLl9iZWhhdmlvciA9IG51bGw7XG4gIH1cblxuICBpbml0aWFsaXplKHBhcmVudENvbnRleHQpIHtcbiAgICB0aGlzLmNvbnRleHQgPSBuZXcgQ29udGV4dChwYXJlbnRDb250ZXh0LCB7XG4gICAgICBoZWlnaHQ6IHRoaXMucGFyYW1zLmhlaWdodCxcbiAgICAgIHRvcDogdGhpcy5wYXJhbXMudG9wLFxuICAgICAgZGVidWc6IHRoaXMucGFyYW1zLmRlYnVnQ29udGV4dFxuICAgIH0pO1xuXG4gICAgdGhpcy5jb250ZXh0LmFkZENsYXNzKCdsYXllcicpO1xuICB9XG5cbiAgZ2V0IGRhdGEoKSB7IHJldHVybiB0aGlzLl9kYXRhOyB9XG5cbiAgc2V0IGRhdGEoZGF0YSkge1xuICAgIHN3aXRjaCAodGhpcy5kYXRhVHlwZSkge1xuICAgICAgY2FzZSAnZW50aXR5JzpcbiAgICAgICAgaWYgKHRoaXMuX2RhdGEpIHsgLy8gaWYgZGF0YSBhbHJlYWR5IGV4aXN0cywgcmV1c2UgdGhlIHJlZmVyZW5jZVxuICAgICAgICAgIHRoaXMuX2RhdGFbMF0gPSBkYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2RhdGEgPSBbZGF0YV07XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjb2xsZWN0aW9uJzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvLyBATk9URSByZW1vdmUgaW4gZmF2b3Igb2YgbGF5ZXIncyBHcm91cCA/XG4gIGFkZExheWVyKGxheWVyKSB7XG4gICAgLy8gQFRPRE8gaW5zZXJ0IGEgbGF5ZXIgaW5zaWRlIGFuIGFscmVhZHkgZXhpc3RpbmcgbGF5ZXJzXG4gICAgbGF5ZXIuaW5pdGlhbGl6ZSh0aGlzLmNvbnRleHQpO1xuICAgIHRoaXMuaW5uZXJMYXllcnMucHVzaChsYXllcik7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBDb25maWd1cmUgQ29tcG9uZW50XG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqICBSZWdpc3RlciB0aGUgc2hhcGUgYW5kIGl0cyBhY2Nlc3NvcnMgdG8gdXNlIGluIG9yZGVyIHRvIHJlbmRlclxuICAgKiAgdGhlIGVudGl0eSBvciBjb2xsZWN0aW9uXG4gICAqICBAcGFyYW0gY3RvciA8RnVuY3Rpb246QmFzZVNoYXBlPiB0aGUgY29uc3RydWN0b3Igb2YgdGhlIHNoYXBlIHRvIGJlIHVzZWRcbiAgICogIEBwYXJhbSBhY2Nlc3NvcnMgPE9iamVjdD4gYWNjZXNzb3JzIHRvIHVzZSBpbiBvcmRlciB0byBtYXAgdGhlIGRhdGEgc3RydWN0dXJlXG4gICAqL1xuICBzZXRTaGFwZShjdG9yLCBhY2Nlc3NvcnMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5fc2hhcGVDb25maWd1cmF0aW9uID0geyBjdG9yLCBhY2Nlc3NvcnMgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgUmVnaXN0ZXIgdGhlIHNoYXBlIHRvIHVzZSB3aXRoIHRoZSBlbnRpcmUgY29sbGVjdGlvblxuICAgKiAgZXhhbXBsZTogdGhlIGxpbmUgaW4gYSBiZWFrcG9pbnQgZnVuY3Rpb25cbiAgICogIEBwYXJhbSBjdG9yIDxCYXNlU2hhcGU+IHRoZSBjb25zdHJ1Y3RvciBvZiB0aGUgc2hhcGUgdG8gdXNlIHRvIHJlbmRlciBkYXRhXG4gICAqICBAcGFyYW0gYWNjZXNzb3JzIDxPYmplY3Q+IGFjY2Vzc29ycyB0byB1c2UgaW4gb3JkZXIgdG8gbWFwIHRoZSBkYXRhIHN0cnVjdHVyZVxuICAgKi9cbiAgc2V0Q29tbW9uU2hhcGUoY3RvciwgYWNjZXNzb3JzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbiA9IHsgY3RvciwgYWNjZXNzb3JzIH07XG4gIH1cblxuICAvKipcbiAgICogIFJlZ2lzdGVyIHRoZSBiZWhhdmlvciB0byB1c2Ugd2hlbiBpbnRlcmFjdGluZyB3aXRoIHRoZSBzaGFwZVxuICAgKiAgQHBhcmFtIGJlaGF2aW9yIDxCYXNlQmVoYXZpb3I+XG4gICAqL1xuICBzZXRCZWhhdmlvcihiZWhhdmlvcikge1xuICAgIGJlaGF2aW9yLmluaXRpYWxpemUodGhpcyk7XG4gICAgdGhpcy5fYmVoYXZpb3IgPSBiZWhhdmlvcjtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENvbnRleHQgQWNjZXNzb3JzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gQFRPRE8gc2V0Q29udGV4dFBhcmFtZXRlcnNcbiAgLy8gQFRPRE8gdXNlIGFuIG9iamVjdCB0byBzaGFyZSBhIHJlZmVyZW5jZSB3aXRoIGFwcGxpY2F0aW9uIGNvZGVcblxuICAvLyBjb250ZXh0IGFjY2Vzc29ycyAtIHRoZXNlIGFyZSBvbmx5IGNvbW1hbmRzXG4gIGdldCBjb250ZXh0Q29uZmlndXJhdGlvbigpIHt9XG5cbiAgLy8gdGhlc2UgcGFyYW1ldGVycyBzaG91bGQgYmUgaW4gYW4gb2JqZWN0IHRvIHdvcmsgd2l0aCByZWZlcmVuY2VzXG4gIGdldCBzdGFydCgpIHsgcmV0dXJuIHRoaXMuY29udGV4dC5zdGFydDsgfVxuICBzZXQgc3RhcnQodmFsdWUpIHsgdGhpcy5jb250ZXh0LnN0YXJ0ID0gdmFsdWU7IH1cblxuICBnZXQgZHVyYXRpb24oKSB7IHJldHVybiB0aGlzLmNvbnRleHQuZHVyYXRpb247IH1cbiAgc2V0IGR1cmF0aW9uKHZhbHVlKSB7IHRoaXMuY29udGV4dC5kdXJhdGlvbiA9IHZhbHVlOyB9XG5cbiAgZ2V0IG9mZnNldCgpIHsgcmV0dXJuIHRoaXMuY29udGV4dC5vZmZzZXQ7IH1cbiAgc2V0IG9mZnNldCh2YWx1ZSkgeyB0aGlzLmNvbnRleHQub2Zmc2V0ID0gdmFsdWU7IH1cblxuICBnZXQgc3RyZXRjaFJhdGlvKCkgeyByZXR1cm4gdGhpcy5jb250ZXh0LnN0cmV0Y2hSYXRpbzsgfVxuICBzZXQgc3RyZXRjaFJhdGlvKHZhbHVlKSB7IHRoaXMuY29udGV4dC5zdHJldGNoUmF0aW8gPSB2YWx1ZTsgfVxuXG4gIGdldCB5RG9tYWluKCkgeyByZXR1cm4gdGhpcy5jb250ZXh0LnlEb21haW47IH1cbiAgc2V0IHlEb21haW4odmFsdWUpIHsgdGhpcy5jb250ZXh0LnlEb21haW4gPSB2YWx1ZTsgfVxuXG4gIGdldCBvcGFjaXR5KCkgeyByZXR1cm4gdGhpcy5jb250ZXh0Lm9wYWNpdHk7IH1cbiAgc2V0IG9wYWNpdHkodmFsdWUpIHsgdGhpcy5jb250ZXh0Lm9wYWNpdHkgPSB2YWx1ZTsgfVxuXG4gIC8vIEBOT1RFIDogbW92ZSB0aGlzIGluIGhpZ2hlciBhYnN0cmFjdGlvbiBsZXZlbCA/ID0+IHByb2JhYmx5IHllc1xuICAvLyBhcHBseSB0aGUgc3RyZXRjaCByYXRpb24gb24gdGhlIGRhdGEsIHJlc2V0IHN0cmV0Y2ggdG8gMVxuICAvLyBhcHBseVN0cmV0Y2goKSB7fVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEJlaGF2aW9yIEFjY2Vzc29yc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiAgQmVoYXZpb3IgZW50cnkgcG9pbnRzXG4gICAqICBATk9URSBBUEkgLT4gY2hhbmdlIGZvciBhbiBBcnJheSBhcyBmaXJzdCBhcmd1bWVudFxuICAgKiAgQFRPRE8gICAgIC0+IGhhbmRsZSBpZiBubyBiZWhhdmlvciBpcyByZWdpc3RlcmVkXG4gICAqL1xuICBnZXQgc2VsZWN0ZWRJdGVtcygpIHsgcmV0dXJuIHRoaXMuX2JlaGF2aW9yLnNlbGVjdGVkSXRlbXM7IH1cblxuICBzZWxlY3QoLi4uaXRlbXMpIHtcbiAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBjb25zdCBkYXR1bSA9IGQzLnNlbGVjdChpdGVtKS5kYXR1bSgpO1xuICAgICAgdGhpcy5fYmVoYXZpb3Iuc2VsZWN0KGl0ZW0sIGRhdHVtKTtcbiAgICAgIHRoaXMuX3RvRnJvbnQoaXRlbSk7XG4gICAgfSk7XG4gIH1cblxuICB1bnNlbGVjdCguLi5pdGVtcykge1xuICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGNvbnN0IGRhdHVtID0gZDMuc2VsZWN0KGl0ZW0pLmRhdHVtKCk7XG4gICAgICB0aGlzLl9iZWhhdmlvci51bnNlbGVjdChpdGVtLCBkYXR1bSk7XG4gICAgfSk7XG4gIH1cbiAgLy8gQFRPRE8gdGVzdFxuICBzZWxlY3RBbGwoKSB7XG4gICAgdGhpcy5pdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB0aGlzLnNlbGVjdChpdGVtKSk7XG4gIH1cblxuICB1bnNlbGVjdEFsbCgpIHtcbiAgICB0aGlzLnNlbGVjdGVkSXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4gdGhpcy51bnNlbGVjdChpdGVtKSk7XG4gIH1cblxuICB0b2dnbGVTZWxlY3Rpb24oLi4uaXRlbXMpIHtcbiAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBjb25zdCBkYXR1bSA9IGQzLnNlbGVjdChpdGVtKS5kYXR1bSgpO1xuICAgICAgdGhpcy5fYmVoYXZpb3IudG9nZ2xlU2VsZWN0aW9uKGl0ZW0sIGRhdHVtKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIEBUT0RPIGNoYW5nZSBzaWduYXR1cmUgZWRpdChpdGVtcyA9IFsuLi5dLCBkeCwgZHksIHRhcmdldCk7XG4gIC8vIC0+IGJlIGNvbnNpc3RlbnQgZm9yIGFsbCBiZWhhdmlvcnMgQVBJXG4gIGVkaXQoaXRlbSwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICBjb25zdCBkYXR1bSA9IGQzLnNlbGVjdChpdGVtKS5kYXR1bSgpO1xuICAgIGNvbnN0IHNoYXBlID0gdGhpcy5faXRlbVNoYXBlTWFwLmdldChpdGVtKTtcbiAgICB0aGlzLl9iZWhhdmlvci5lZGl0KHRoaXMuY29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBIZWxwZXJzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIEByZXR1cm4gPERPTUVsZW1lbnQ+IHRoZSBjbG9zZXN0IHBhcmVudCBgaXRlbWAgZ3JvdXAgZm9yIGEgZ2l2ZW4gRE9NIGVsZW1lbnRcbiAgICovXG4gIF9nZXRJdGVtRnJvbURPTUVsZW1lbnQoZWwpIHtcbiAgICBkbyB7XG4gICAgICBpZiAoZWwubm9kZU5hbWUgPT09ICdnJyAmJiBlbC5jbGFzc0xpc3QuY29udGFpbnMoJ2l0ZW0nKSkge1xuICAgICAgICByZXR1cm4gZWw7XG4gICAgICB9XG4gICAgfSB3aGlsZSAoZWwgPSBlbC5wYXJlbnROb2RlKTtcbiAgfVxuXG4gIF90b0Zyb250KGl0ZW0pIHtcbiAgICB0aGlzLmdyb3VwLmFwcGVuZENoaWxkKGl0ZW0pO1xuICB9XG5cbiAgLyoqXG4gICAqICBAcGFyYW0gPERPTUVsZW1lbnQ+IHRoZSBlbGVtZW50IHdlIHdhbnQgdG8gZmluZCB0aGUgY2xvc2VzdCBgLml0ZW1gIGdyb3VwXG4gICAqICBAcmV0dXJuIDxtaXhlZD5cbiAgICogICAgPERPTUVsZW1lbnQ+IGl0ZW0gZ3JvdXAgY29udGFpbmluZyB0aGUgZWwgaWYgYmVsb25ncyB0byB0aGlzIGxheWVyXG4gICAqICAgIG51bGwgb3RoZXJ3aXNlXG4gICAqL1xuICBoYXNJdGVtKGVsKSB7XG4gICAgY29uc3QgaXRlbSA9IHRoaXMuX2dldEl0ZW1Gcm9tRE9NRWxlbWVudChlbCk7XG4gICAgcmV0dXJuICh0aGlzLml0ZW1zWzBdLmluZGV4T2YoaXRlbSkgIT09IC0xKSA/IGl0ZW0gOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqICBAcGFyYW0gYXJlYSA8T2JqZWN0PiBhcmVhIGluIHdoaWNoIHRvIGZpbmQgdGhlIGVsZW1lbnRzXG4gICAqICBAcmV0dXJuIDxBcnJheT4gbGlzdCBvZiB0aGUgRE9NIGVsZW1lbnRzIGluIHRoZSBnaXZlbiBhcmVhXG4gICAqL1xuICBnZXRJdGVtc0luQXJlYShhcmVhKSB7XG4gICAgLy8gd29yayBpbiBwaXhlbCBkb21haW5cbiAgICBjb25zdCBzdGFydCAgICA9IHRoaXMuY29udGV4dC54U2NhbGUodGhpcy5jb250ZXh0LnN0YXJ0KTtcbiAgICBjb25zdCBkdXJhdGlvbiA9IHRoaXMuY29udGV4dC54U2NhbGUodGhpcy5jb250ZXh0LmR1cmF0aW9uKTtcbiAgICBjb25zdCBvZmZzZXQgICA9IHRoaXMuY29udGV4dC54U2NhbGUodGhpcy5jb250ZXh0Lm9mZnNldCk7XG4gICAgY29uc3QgdG9wICAgICAgPSB0aGlzLnBhcmFtcy50b3A7XG4gICAgLy8gbXVzdCBiZSBhd2FyZSBvZiB0aGUgbGF5ZXIncyBjb250ZXh0IG1vZGlmaWNhdGlvbnNcbiAgICAvLyBjb25zdHJhaW4gaW4gd29ya2luZyB2aWV3XG4gICAgbGV0IHgxID0gTWF0aC5tYXgoYXJlYS5sZWZ0LCBzdGFydCk7XG4gICAgbGV0IHgyID0gTWF0aC5taW4oYXJlYS5sZWZ0ICsgYXJlYS53aWR0aCwgc3RhcnQgKyBkdXJhdGlvbik7XG4gICAgLy8gYXBwbHkgc3RhcnQgYW5kIG9mZnNldFxuICAgIHgxIC09IChzdGFydCArIG9mZnNldCk7XG4gICAgeDIgLT0gKHN0YXJ0ICsgb2Zmc2V0KTtcbiAgICAvLyBARklYTUUgc3RyZXRjaFJhdGlvIGJyZWFrcyBzZWxlY3Rpb25cbiAgICAvLyB4MiAqPSB0aGlzLmNvbnRleHQuc3RyZXRjaFJhdGlvO1xuICAgIC8vIGJlIGNvbnNpc3RlbnQgd2l0aCBjb250ZXh0IHkgY29vcmRpbmF0ZXMgc3lzdGVtXG4gICAgbGV0IHkxID0gdGhpcy5wYXJhbXMuaGVpZ2h0IC0gKGFyZWEudG9wICsgYXJlYS5oZWlnaHQpO1xuICAgIGxldCB5MiA9IHRoaXMucGFyYW1zLmhlaWdodCAtIGFyZWEudG9wO1xuXG4gICAgeTEgKz0gdGhpcy5wYXJhbXMudG9wO1xuICAgIHkyICs9IHRoaXMucGFyYW1zLnRvcDtcblxuICAgIGNvbnN0IGl0ZW1TaGFwZU1hcCA9IHRoaXMuX2l0ZW1TaGFwZU1hcDtcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5jb250ZXh0O1xuXG4gICAgY29uc3QgaXRlbXMgPSB0aGlzLml0ZW1zLmZpbHRlcihmdW5jdGlvbihkYXR1bSwgaW5kZXgpIHtcbiAgICAgIGNvbnN0IGdyb3VwID0gdGhpcztcbiAgICAgIGNvbnN0IHNoYXBlID0gaXRlbVNoYXBlTWFwLmdldChncm91cCk7XG4gICAgICByZXR1cm4gc2hhcGUuaW5BcmVhKGNvbnRleHQsIGRhdHVtLCB4MSwgeTEsIHgyLCB5Mik7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaXRlbXNbMF0uc2xpY2UoMCk7XG4gIH1cblxuICAvLyBoZWxwZXIgdG8gYWRkIHNvbWUgY2xhc3Mgb3Igc3R1ZmYgb24gaXRlbXNcbiAgZWFjaChjYWxsYmFjayA9IG51bGwpIHt9XG5cbiAgLyoqXG4gICAqICBjcmVhdGVzIHRoZSBsYXllciBncm91cCB3aXRoIGEgdHJhbnNmb3JtYXRpb24gbWF0cml4IHRvIGZsaXAgdGhlIGNvb3JkaW5hdGUgc3lzdGVtLlxuICAgKiAgQE5PVEU6IHB1dCB0aGUgY29udGV4dCBpbnNpZGUgdGhlIGxheWVyIGdyb3VwID8gcmV2ZXJzZSB0aGUgRE9NIG9yZGVyXG4gICAqL1xuICByZW5kZXIoKSB7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuICAgIGNvbnN0IHRvcCAgICA9IHRoaXMucGFyYW1zLnRvcDtcbiAgICAvLyBtYXRyaXggdG8gaW52ZXJ0IHRoZSBjb29yZGluYXRlIHN5c3RlbVxuICAgIGNvbnN0IGludmVydE1hdHJpeCA9IGBtYXRyaXgoMSwgMCwgMCwgLTEsIDAsICR7aGVpZ2h0fSlgO1xuICAgIC8vIGNyZWF0ZSB0aGUgRE9NIG9mIHRoZSBjb250ZXh0XG4gICAgY29uc3QgZWwgPSB0aGlzLmNvbnRleHQucmVuZGVyKCk7XG4gICAgLy8gY3JlYXRlIGEgZ3JvdXAgdG8gZmxpcCB0aGUgY29udGV4dCBvZiB0aGUgbGF5ZXJcbiAgICB0aGlzLmdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIHRoaXMuZ3JvdXAuY2xhc3NMaXN0LmFkZCgnaXRlbXMnKTtcbiAgICB0aGlzLmdyb3VwLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBpbnZlcnRNYXRyaXgpO1xuICAgIC8vIGFwcGVuZCB0aGUgZ3JvdXAgdG8gdGhlIGNvbnRleHRcbiAgICB0aGlzLmNvbnRleHQub2Zmc2V0R3JvdXAuYXBwZW5kQ2hpbGQodGhpcy5ncm91cCk7XG4gICAgY29uc3QgaW5uZXJHcm91cCA9IHRoaXMuY29udGV4dC5vZmZzZXRHcm91cDtcblxuICAgIHRoaXMuaW5uZXJMYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHtcbiAgICAgIGlubmVyR3JvdXAuYXBwZW5kQ2hpbGQobGF5ZXIucmVuZGVyKCkpXG4gICAgfSk7XG5cbiAgICByZXR1cm4gZWw7XG4gIH1cblxuICAvKipcbiAgICogY3JlYXRlIHRoZSBET00gYWNjb3JkaW5nIHRvIGdpdmVuIGRhdGEgYW5kIHNoYXBlc1xuICAgKi9cbiAgZHJhdygpIHtcbiAgICAvLyBATk9URTogY3JlYXRlIGEgdW5pcXVlIGlkIHRvIGZvcmNlIGQzIHRvIGtlZXAgZGF0YSBpbiBzeW5jIHdpdGggdGhlIERPTVxuICAgIC8vIEBUT0RPOiByZWFkIGFnYWluIGh0dHA6Ly9ib3N0Lm9ja3Mub3JnL21pa2Uvc2VsZWN0aW9uL1xuICAgIHRoaXMuZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGRhdHVtKSB7XG4gICAgICBpZiAoX2RhdHVtSWRNYXAuaGFzKGRhdHVtKSkgeyByZXR1cm47IH1cbiAgICAgIF9kYXR1bUlkTWFwLnNldChkYXR1bSwgX2NvdW50ZXIrKyk7XG4gICAgfSk7XG5cbiAgICAvLyBzZWxlY3QgaXRlbXNcbiAgICB0aGlzLml0ZW1zID0gZDMuc2VsZWN0KHRoaXMuZ3JvdXApXG4gICAgICAuc2VsZWN0QWxsKCcuaXRlbScpXG4gICAgICAuZmlsdGVyKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKCdjb21tb24nKVxuICAgICAgfSlcbiAgICAgIC5kYXRhKHRoaXMuZGF0YSwgZnVuY3Rpb24oZGF0dW0pIHtcbiAgICAgICAgcmV0dXJuIF9kYXR1bUlkTWFwLmdldChkYXR1bSk7XG4gICAgICB9KTtcblxuICAgIC8vIGhhbmRsZSBjb21tb25TaGFwZXNcbiAgICBpZiAodGhpcy5fY29tbW9uU2hhcGVDb25maWd1cmF0aW9uICE9PSBudWxsKSB7XG4gICAgICBjb25zdCB7IGN0b3IsIGFjY2Vzc29ycyB9ID0gdGhpcy5fY29tbW9uU2hhcGVDb25maWd1cmF0aW9uO1xuICAgICAgY29uc3QgZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgICBjb25zdCBzaGFwZSA9IG5ldyBjdG9yKGdyb3VwKTtcblxuICAgICAgc2hhcGUuaW5zdGFsbChhY2Nlc3NvcnMpO1xuICAgICAgZ3JvdXAuYXBwZW5kQ2hpbGQoc2hhcGUucmVuZGVyKCkpO1xuICAgICAgZ3JvdXAuY2xhc3NMaXN0LmFkZCgnaXRlbScsICdjb21tb24nLCBzaGFwZS5nZXRDbGFzc05hbWUoKSk7XG5cbiAgICAgIHRoaXMuX2l0ZW1Db21tb25TaGFwZU1hcC5zZXQoZ3JvdXAsIHNoYXBlKTtcbiAgICAgIHRoaXMuZ3JvdXAuYXBwZW5kQ2hpbGQoZ3JvdXApO1xuICAgIH1cblxuICAgIC8vIGVudGVyXG4gICAgdGhpcy5pdGVtcy5lbnRlcigpXG4gICAgICAuYXBwZW5kKChkYXR1bSwgaW5kZXgpID0+IHtcbiAgICAgICAgLy8gQE5PVEU6IGQzIGJpbmRzIGB0aGlzYCB0byB0aGUgY29udGFpbmVyIGdyb3VwXG4gICAgICAgIC8vIGNyZWF0ZSBhIGdyb3VwIGZvciB0aGUgaXRlbVxuICAgICAgICBjb25zdCBncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICAgICAgY29uc3QgeyBjdG9yLCBhY2Nlc3NvcnMgfSA9IHRoaXMuX3NoYXBlQ29uZmlndXJhdGlvbjtcbiAgICAgICAgY29uc3Qgc2hhcGUgPSBuZXcgY3RvcigpO1xuICAgICAgICAvLyBpbnN0YWxsIGFjY2Vzc29ycyBvbiB0aGUgbmV3bHkgY3JlYXRlZCBzaGFwZVxuICAgICAgICBzaGFwZS5pbnN0YWxsKGFjY2Vzc29ycyk7XG5cbiAgICAgICAgZ3JvdXAuYXBwZW5kQ2hpbGQoc2hhcGUucmVuZGVyKHRoaXMuY29udGV4dCkpO1xuICAgICAgICBncm91cC5jbGFzc0xpc3QuYWRkKCdpdGVtJywgc2hhcGUuZ2V0Q2xhc3NOYW1lKCkpO1xuXG4gICAgICAgIHRoaXMuX2l0ZW1TaGFwZU1hcC5zZXQoZ3JvdXAsIHNoYXBlKTtcblxuICAgICAgICByZXR1cm4gZ3JvdXA7XG4gICAgICB9KTtcblxuICAgIC8vIGV4aXRcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcblxuICAgIHRoaXMuaXRlbXMuZXhpdCgpXG4gICAgICAuZWFjaChmdW5jdGlvbihkYXR1bSwgaW5kZXgpIHtcbiAgICAgICAgY29uc3QgZ3JvdXAgPSB0aGlzO1xuICAgICAgICBjb25zdCBzaGFwZSA9IHRoYXQuX2l0ZW1TaGFwZXNNYXAuZ2V0KGdyb3VwKTtcblxuICAgICAgICBzaGFwZS5kZXN0cm95KCk7IC8vIGNsZWFuIHNoYXBlXG4gICAgICAgIF9kYXR1bUlkTWFwLmRlbGV0ZShkYXR1bSk7IC8vIGNsZWFuIHJlZmVyZW5jZSBpbiBgaWRgIG1hcFxuICAgICAgICB0aGF0Ll9pdGVtU2hhcGVNYXAuZGVsZXRlKGdyb3VwKTsgLy8gZGVzdHJveSByZWZlcmVuY2UgaW4gaXRlbSBzaGFwZSBtYXBcbiAgICAgIH0pXG4gICAgICAucmVtb3ZlKCk7XG5cbiAgICAvLyByZW5kZXIgaW5uZXJMYXllcnNcbiAgICB0aGlzLmlubmVyTGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiBsYXllci5kcmF3KCkpO1xuICB9XG5cbiAgLyoqXG4gICAqICB1cGRhdGVzIERPTSBjb250ZXh0IGFuZCBzaGFwZXNcbiAgICovXG4gIHVwZGF0ZSgpIHtcbiAgICB0aGlzLnVwZGF0ZUNvbnRleHQoKTtcbiAgICB0aGlzLnVwZGF0ZVNoYXBlcygpO1xuICB9XG5cbiAgLyoqXG4gICAqICB1cGRhdGVzIERPTSBjb250ZXh0IG9ubHlcbiAgICovXG4gIHVwZGF0ZUNvbnRleHQoKSB7XG4gICAgLy8gdXBkYXRlIGNvbnRleHRcbiAgICB0aGlzLmNvbnRleHQudXBkYXRlKCk7XG4gICAgLy8gdXBkYXRlIGlubmVyTGF5ZXJzXG4gICAgdGhpcy5pbm5lckxheWVycy5mb3JFYWNoKChsYXllcikgPT4gbGF5ZXIudXBkYXRlQ29udGV4dCgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgdXBkYXRlcyBET00gY29udGV4dCBhbmQgU2hhcGVzXG4gICAqICBAcGFyYW1cbiAgICovXG4gIHVwZGF0ZVNoYXBlcyhpdGVtID0gbnVsbCkge1xuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLmNvbnRleHQ7XG4gICAgY29uc3QgaXRlbXMgPSBpdGVtICE9PSBudWxsID8gZDMuc2VsZWN0QWxsKGl0ZW0pIDogdGhpcy5pdGVtcztcblxuICAgIC8vIHVwZGF0ZSBjb21tb24gc2hhcGVzXG4gICAgdGhpcy5faXRlbUNvbW1vblNoYXBlTWFwLmZvckVhY2goKHNoYXBlLCBpdGVtKSA9PiB7XG4gICAgICBzaGFwZS51cGRhdGUoY29udGV4dCwgaXRlbSwgdGhpcy5kYXRhKTtcbiAgICB9KTtcblxuICAgIC8vIHVwZGF0ZSBlbnRpdHkgb3IgY29sbGVjdGlvbiBzaGFwZXNcbiAgICBpdGVtcy5lYWNoKGZ1bmN0aW9uKGRhdHVtLCBpbmRleCkge1xuICAgICAgLy8gdXBkYXRlIGFsbCBzaGFwZXMgcmVsYXRlZCB0byB0aGUgY3VycmVudCBpdGVtXG4gICAgICBjb25zdCBncm91cCA9IHRoaXM7IC8vIGN1cnJlbnQgYGcuaXRlbWBcbiAgICAgIGNvbnN0IHNoYXBlID0gdGhhdC5faXRlbVNoYXBlTWFwLmdldChncm91cCk7XG4gICAgICBzaGFwZS51cGRhdGUoY29udGV4dCwgZ3JvdXAsIGRhdHVtLCBpbmRleCk7XG4gICAgfSk7XG5cbiAgICAvLyB1cGRhdGUgaW5uZXJMYXllcnNcbiAgICB0aGlzLmlubmVyTGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiBsYXllci51cGRhdGVTaGFwZXMoKSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBMYXllcjtcbiJdfQ==