"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var Context = require("./context");
var ns = require("./namespace");

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
        if (this.dataType === "entity") {
          data = [data];
        }
        this._data = data;
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
        this.behavior = behavior;
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
       */

      get: function () {
        return this.behavior.selectedItems;
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
          _this.behavior.select(item, datum);
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
          _this.behavior.unselect(item, datum);
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
          _this.behavior.toggleSelection(item, datum);
        });
      }
    },
    edit: {
      value: function edit(item, dx, dy, target) {
        var datum = d3.select(item).datum();
        var shape = this._itemShapeMap.get(item);
        this.behavior.edit(shape, datum, dx, dy, target);
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

          group.appendChild(shape.render());
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
//# sourceMappingURL=data:application/json;base64,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QUksZ0NBQUcsSUFBSTs7QUFDdEIsWUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLFlBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDN0IsWUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLElBQUksR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7OztBQUc5RCxZQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFFLElBQUksRUFBSztBQUNoRCxlQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBSyxJQUFJLENBQUMsQ0FBQztTQUN4QyxDQUFDLENBQUM7OztBQUdILGFBQUssQ0FBQyxJQUFJLENBQUMsVUFBUyxLQUFLLEVBQUUsS0FBSyxFQUFFOztBQUVoQyxjQUFNLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbkIsY0FBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDNUMsZUFBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztTQUM1QyxDQUFDLENBQUM7OztBQUdILFlBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztpQkFBSyxLQUFLLENBQUMsWUFBWSxFQUFFO1NBQUEsQ0FBQyxDQUFDO09BQzNEOzs7O1NBblhHLEtBQUs7OztBQXNYWCxNQUFNLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyIsImZpbGUiOiJlczYvY29yZS9sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IENvbnRleHQgPSByZXF1aXJlKCcuL2NvbnRleHQnKTtcbmNvbnN0IG5zID0gcmVxdWlyZSgnLi9uYW1lc3BhY2UnKTtcblxuLy8gY3JlYXRlIGEgcHJpdmF0ZSBpdGVtIC0+IGlkIG1hcCB0byBmb3JjZSBkMyBiZWluZyBpbiBzeW5jIHdpdGggdGhlIERPTVxubGV0IF9jb3VudGVyID0gMDtcbmNvbnN0IF9kYXR1bUlkTWFwID0gbmV3IE1hcCgpO1xuXG5jbGFzcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKGRhdGFUeXBlID0gJ2NvbGxlY3Rpb24nLCBkYXRhID0gW10sIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuZGF0YVR5cGUgPSBkYXRhVHlwZTsgLy8gJ2VudGl0eScgfHwgJ2NvbGxlY3Rpb24nO1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGhlaWdodDogMTAwLCAvLyBzaG91bGQgaW5oZXJpdCBmcm9tIHBhcmVudFxuICAgICAgdG9wOiAwLFxuICAgICAgZGVidWdDb250ZXh0OiBmYWxzZSwgLy8gcGFzcyB0aGUgY29udGV4dCBpbiBkZWJ1ZyBtb2RlXG4gICAgfVxuXG4gICAgdGhpcy5wYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgICAvLyB0aGlzLmNvbnRhaW5lciA9IG51bGw7IC8vIG9mZnNldCBncm91cCBvZiB0aGUgcGFyZW50IGNvbnRleHRcbiAgICB0aGlzLmdyb3VwID0gbnVsbDsgLy8gZ3JvdXAgY3JlYXRlZCBieSB0aGUgbGF5ZXIgaW5zaWRlIHRoZSBjb250ZXh0XG4gICAgdGhpcy5pdGVtcyA9IG51bGw7IC8vIGQzIGNvbGxlY3Rpb24gb2YgdGhlIGxheWVyIGl0ZW1zXG5cbiAgICAvLyBATk9URSByZW1vdmUgaW4gZmF2b3Igb2YgTGF5ZXJHcm91cCA/XG4gICAgLy8gQHByaXZhdGUgP1xuICAgIHRoaXMuaW5uZXJMYXllcnMgPSBbXTtcblxuICAgIC8vIGN0b3IgPT4gYWNjZXNzb3JzXG4gICAgdGhpcy5fc2hhcGVDb25maWd1cmF0aW9uID0gbnVsbDsgLy8geyBjdG9yLCBhY2Nlc3NvcnMgfVxuICAgIHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbiA9IG51bGw7IC8vIHsgY3RvciwgYWNjZXNzb3JzIH1cbiAgICAvLyBpdGVtIGdyb3VwIDxET01FbGVtZW50PiA9PiBzaGFwZVxuICAgIHRoaXMuX2l0ZW1TaGFwZU1hcCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl9pdGVtQ29tbW9uU2hhcGVNYXAgPSBuZXcgTWFwKCk7IC8vIG9uZSBlbnRyeSBtYXggaW4gdGhpcyBtYXBcbiAgfVxuXG4gIGluaXRpYWxpemUocGFyZW50Q29udGV4dCkge1xuICAgIHRoaXMuY29udGV4dCA9IG5ldyBDb250ZXh0KHBhcmVudENvbnRleHQsIHtcbiAgICAgIGhlaWdodDogdGhpcy5wYXJhbXMuaGVpZ2h0LFxuICAgICAgdG9wOiB0aGlzLnBhcmFtcy50b3AsXG4gICAgICBkZWJ1ZzogdGhpcy5wYXJhbXMuZGVidWdDb250ZXh0XG4gICAgfSk7XG5cbiAgICB0aGlzLmNvbnRleHQuYWRkQ2xhc3MoJ2xheWVyJyk7XG4gIH1cblxuICBnZXQgZGF0YSgpIHsgcmV0dXJuIHRoaXMuX2RhdGE7IH1cblxuICBzZXQgZGF0YShkYXRhKSB7XG4gICAgaWYgKHRoaXMuZGF0YVR5cGUgPT09ICdlbnRpdHknKSB7IGRhdGEgPSBbZGF0YV07IH1cbiAgICB0aGlzLl9kYXRhID0gZGF0YTtcbiAgfVxuXG4gIC8vIEBOT1RFIHJlbW92ZSBpbiBmYXZvciBvZiBsYXllcidzIEdyb3VwID9cbiAgYWRkTGF5ZXIobGF5ZXIpIHtcbiAgICAvLyBAVE9ETyBpbnNlcnQgYSBsYXllciBpbnNpZGUgYW4gYWxyZWFkeSBleGlzdGluZyBsYXllcnNcbiAgICBsYXllci5pbml0aWFsaXplKHRoaXMuY29udGV4dCk7XG4gICAgdGhpcy5pbm5lckxheWVycy5wdXNoKGxheWVyKTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENvbmZpZ3VyZSBDb21wb25lbnRcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogIFJlZ2lzdGVyIHRoZSBzaGFwZSBhbmQgaXRzIGFjY2Vzc29ycyB0byB1c2UgaW4gb3JkZXIgdG8gcmVuZGVyXG4gICAqICB0aGUgZW50aXR5IG9yIGNvbGxlY3Rpb25cbiAgICogIEBwYXJhbSBjdG9yIDxGdW5jdGlvbjpCYXNlU2hhcGU+IHRoZSBjb25zdHJ1Y3RvciBvZiB0aGUgc2hhcGUgdG8gYmUgdXNlZFxuICAgKiAgQHBhcmFtIGFjY2Vzc29ycyA8T2JqZWN0PiBhY2Nlc3NvcnMgdG8gdXNlIGluIG9yZGVyIHRvIG1hcCB0aGUgZGF0YSBzdHJ1Y3R1cmVcbiAgICovXG4gIHNldFNoYXBlKGN0b3IsIGFjY2Vzc29ycyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLl9zaGFwZUNvbmZpZ3VyYXRpb24gPSB7IGN0b3IsIGFjY2Vzc29ycyB9O1xuICB9XG5cbiAgLyoqXG4gICAqICBSZWdpc3RlciB0aGUgc2hhcGUgdG8gdXNlIHdpdGggdGhlIGVudGlyZSBjb2xsZWN0aW9uXG4gICAqICBleGFtcGxlOiB0aGUgbGluZSBpbiBhIGJlYWtwb2ludCBmdW5jdGlvblxuICAgKiAgQHBhcmFtIGN0b3IgPEJhc2VTaGFwZT4gdGhlIGNvbnN0cnVjdG9yIG9mIHRoZSBzaGFwZSB0byB1c2UgdG8gcmVuZGVyIGRhdGFcbiAgICogIEBwYXJhbSBhY2Nlc3NvcnMgPE9iamVjdD4gYWNjZXNzb3JzIHRvIHVzZSBpbiBvcmRlciB0byBtYXAgdGhlIGRhdGEgc3RydWN0dXJlXG4gICAqL1xuICBzZXRDb21tb25TaGFwZShjdG9yLCBhY2Nlc3NvcnMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5fY29tbW9uU2hhcGVDb25maWd1cmF0aW9uID0geyBjdG9yLCBhY2Nlc3NvcnMgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgUmVnaXN0ZXIgdGhlIGJlaGF2aW9yIHRvIHVzZSB3aGVuIGludGVyYWN0aW5nIHdpdGggdGhlIHNoYXBlXG4gICAqICBAcGFyYW0gYmVoYXZpb3IgPEJhc2VCZWhhdmlvcj5cbiAgICovXG4gIHNldEJlaGF2aW9yKGJlaGF2aW9yKSB7XG4gICAgYmVoYXZpb3IuaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICB0aGlzLmJlaGF2aW9yID0gYmVoYXZpb3I7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBDb250ZXh0IEFjY2Vzc29yc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEBUT0RPIHNldENvbnRleHRQYXJhbWV0ZXJzXG4gIC8vIEBUT0RPIHVzZSBhbiBvYmplY3QgdG8gc2hhcmUgYSByZWZlcmVuY2Ugd2l0aCBhcHBsaWNhdGlvbiBjb2RlXG5cbiAgLy8gY29udGV4dCBhY2Nlc3NvcnMgLSB0aGVzZSBhcmUgb25seSBjb21tYW5kc1xuICBnZXQgY29udGV4dENvbmZpZ3VyYXRpb24oKSB7fVxuXG4gIC8vIHRoZXNlIHBhcmFtZXRlcnMgc2hvdWxkIGJlIGluIGFuIG9iamVjdCB0byB3b3JrIHdpdGggcmVmZXJlbmNlc1xuICBnZXQgc3RhcnQoKSB7IHJldHVybiB0aGlzLmNvbnRleHQuc3RhcnQ7IH1cbiAgc2V0IHN0YXJ0KHZhbHVlKSB7IHRoaXMuY29udGV4dC5zdGFydCA9IHZhbHVlOyB9XG5cbiAgZ2V0IGR1cmF0aW9uKCkgeyByZXR1cm4gdGhpcy5jb250ZXh0LmR1cmF0aW9uOyB9XG4gIHNldCBkdXJhdGlvbih2YWx1ZSkgeyB0aGlzLmNvbnRleHQuZHVyYXRpb24gPSB2YWx1ZTsgfVxuXG4gIGdldCBvZmZzZXQoKSB7IHJldHVybiB0aGlzLmNvbnRleHQub2Zmc2V0OyB9XG4gIHNldCBvZmZzZXQodmFsdWUpIHsgdGhpcy5jb250ZXh0Lm9mZnNldCA9IHZhbHVlOyB9XG5cbiAgZ2V0IHN0cmV0Y2hSYXRpbygpIHsgcmV0dXJuIHRoaXMuY29udGV4dC5zdHJldGNoUmF0aW87IH1cbiAgc2V0IHN0cmV0Y2hSYXRpbyh2YWx1ZSkgeyB0aGlzLmNvbnRleHQuc3RyZXRjaFJhdGlvID0gdmFsdWU7IH1cblxuICBnZXQgeURvbWFpbigpIHsgcmV0dXJuIHRoaXMuY29udGV4dC55RG9tYWluOyB9XG4gIHNldCB5RG9tYWluKHZhbHVlKSB7IHRoaXMuY29udGV4dC55RG9tYWluID0gdmFsdWU7IH1cblxuICBnZXQgb3BhY2l0eSgpIHsgcmV0dXJuIHRoaXMuY29udGV4dC5vcGFjaXR5OyB9XG4gIHNldCBvcGFjaXR5KHZhbHVlKSB7IHRoaXMuY29udGV4dC5vcGFjaXR5ID0gdmFsdWU7IH1cblxuICAvLyBATk9URSA6IG1vdmUgdGhpcyBpbiBoaWdoZXIgYWJzdHJhY3Rpb24gbGV2ZWwgPyA9PiBwcm9iYWJseSB5ZXNcbiAgLy8gYXBwbHkgdGhlIHN0cmV0Y2ggcmF0aW9uIG9uIHRoZSBkYXRhLCByZXNldCBzdHJldGNoIHRvIDFcbiAgLy8gYXBwbHlTdHJldGNoKCkge31cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBCZWhhdmlvciBBY2Nlc3NvcnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogIEJlaGF2aW9yIGVudHJ5IHBvaW50c1xuICAgKiAgQE5PVEUgQVBJIC0+IGNoYW5nZSBmb3IgYW4gQXJyYXkgYXMgZmlyc3QgYXJndW1lbnRcbiAgICovXG4gIGdldCBzZWxlY3RlZEl0ZW1zKCkgeyByZXR1cm4gdGhpcy5iZWhhdmlvci5zZWxlY3RlZEl0ZW1zOyB9XG5cbiAgc2VsZWN0KC4uLml0ZW1zKSB7XG4gICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgZGF0dW0gPSBkMy5zZWxlY3QoaXRlbSkuZGF0dW0oKTtcbiAgICAgIHRoaXMuYmVoYXZpb3Iuc2VsZWN0KGl0ZW0sIGRhdHVtKTtcbiAgICB9KTtcbiAgfVxuXG4gIHVuc2VsZWN0KC4uLml0ZW1zKSB7XG4gICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgZGF0dW0gPSBkMy5zZWxlY3QoaXRlbSkuZGF0dW0oKTtcbiAgICAgIHRoaXMuYmVoYXZpb3IudW5zZWxlY3QoaXRlbSwgZGF0dW0pO1xuICAgIH0pO1xuICB9XG4gIC8vIEBUT0RPIHRlc3RcbiAgc2VsZWN0QWxsKCkge1xuICAgIHRoaXMuaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4gdGhpcy5zZWxlY3QoaXRlbSkpO1xuICB9XG5cbiAgdW5zZWxlY3RBbGwoKSB7XG4gICAgdGhpcy5zZWxlY3RlZEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHRoaXMudW5zZWxlY3QoaXRlbSkpO1xuICB9XG5cbiAgdG9nZ2xlU2VsZWN0aW9uKC4uLml0ZW1zKSB7XG4gICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgZGF0dW0gPSBkMy5zZWxlY3QoaXRlbSkuZGF0dW0oKTtcbiAgICAgIHRoaXMuYmVoYXZpb3IudG9nZ2xlU2VsZWN0aW9uKGl0ZW0sIGRhdHVtKTtcbiAgICB9KTtcbiAgfVxuXG4gIGVkaXQoaXRlbSwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICBjb25zdCBkYXR1bSA9IGQzLnNlbGVjdChpdGVtKS5kYXR1bSgpO1xuICAgIGNvbnN0IHNoYXBlID0gdGhpcy5faXRlbVNoYXBlTWFwLmdldChpdGVtKTtcbiAgICB0aGlzLmJlaGF2aW9yLmVkaXQoc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBIZWxwZXJzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIEByZXR1cm4gPERPTUVsZW1lbnQ+IHRoZSBjbG9zZXN0IHBhcmVudCBgaXRlbWAgZ3JvdXAgZm9yIGEgZ2l2ZW4gRE9NIGVsZW1lbnRcbiAgICovXG4gIF9nZXRJdGVtRnJvbURPTUVsZW1lbnQoZWwpIHtcbiAgICBkbyB7XG4gICAgICBpZiAoZWwubm9kZU5hbWUgPT09ICdnJyAmJiBlbC5jbGFzc0xpc3QuY29udGFpbnMoJ2l0ZW0nKSkge1xuICAgICAgICByZXR1cm4gZWw7XG4gICAgICB9XG4gICAgfSB3aGlsZSAoZWwgPSBlbC5wYXJlbnROb2RlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgQHBhcmFtIDxET01FbGVtZW50PiB0aGUgZWxlbWVudCB3ZSB3YW50IHRvIGZpbmQgdGhlIGNsb3Nlc3QgYC5pdGVtYCBncm91cFxuICAgKiAgQHJldHVybiA8bWl4ZWQ+XG4gICAqICAgIDxET01FbGVtZW50PiBpdGVtIGdyb3VwIGNvbnRhaW5pbmcgdGhlIGVsIGlmIGJlbG9uZ3MgdG8gdGhpcyBsYXllclxuICAgKiAgICBudWxsIG90aGVyd2lzZVxuICAgKi9cbiAgaGFzSXRlbShlbCkge1xuICAgIGNvbnN0IGl0ZW0gPSB0aGlzLl9nZXRJdGVtRnJvbURPTUVsZW1lbnQoZWwpO1xuICAgIHJldHVybiAodGhpcy5pdGVtc1swXS5pbmRleE9mKGl0ZW0pICE9PSAtMSkgPyBpdGVtIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiAgQHBhcmFtIGFyZWEgPE9iamVjdD4gYXJlYSBpbiB3aGljaCB0byBmaW5kIHRoZSBlbGVtZW50c1xuICAgKiAgQHJldHVybiA8QXJyYXk+IGxpc3Qgb2YgdGhlIERPTSBlbGVtZW50cyBpbiB0aGUgZ2l2ZW4gYXJlYVxuICAgKi9cbiAgZ2V0SXRlbXNJbkFyZWEoYXJlYSkge1xuICAgIC8vIHdvcmsgaW4gcGl4ZWwgZG9tYWluXG4gICAgY29uc3Qgc3RhcnQgICAgPSB0aGlzLmNvbnRleHQueFNjYWxlKHRoaXMuY29udGV4dC5zdGFydCk7XG4gICAgY29uc3QgZHVyYXRpb24gPSB0aGlzLmNvbnRleHQueFNjYWxlKHRoaXMuY29udGV4dC5kdXJhdGlvbik7XG4gICAgY29uc3Qgb2Zmc2V0ICAgPSB0aGlzLmNvbnRleHQueFNjYWxlKHRoaXMuY29udGV4dC5vZmZzZXQpO1xuICAgIGNvbnN0IHRvcCAgICAgID0gdGhpcy5wYXJhbXMudG9wO1xuICAgIC8vIG11c3QgYmUgYXdhcmUgb2YgdGhlIGxheWVyJ3MgY29udGV4dCBtb2RpZmljYXRpb25zXG4gICAgLy8gY29uc3RyYWluIGluIHdvcmtpbmcgdmlld1xuICAgIGxldCB4MSA9IE1hdGgubWF4KGFyZWEubGVmdCwgc3RhcnQpO1xuICAgIGxldCB4MiA9IE1hdGgubWluKGFyZWEubGVmdCArIGFyZWEud2lkdGgsIHN0YXJ0ICsgZHVyYXRpb24pO1xuICAgIC8vIGFwcGx5IHN0YXJ0IGFuZCBvZmZzZXRcbiAgICB4MSAtPSAoc3RhcnQgKyBvZmZzZXQpO1xuICAgIHgyIC09IChzdGFydCArIG9mZnNldCk7XG4gICAgLy8gQEZJWE1FIHN0cmV0Y2hSYXRpbyBicmVha3Mgc2VsZWN0aW9uXG4gICAgLy8geDIgKj0gdGhpcy5jb250ZXh0LnN0cmV0Y2hSYXRpbztcbiAgICAvLyBiZSBjb25zaXN0ZW50IHdpdGggY29udGV4dCB5IGNvb3JkaW5hdGVzIHN5c3RlbVxuICAgIGxldCB5MSA9IHRoaXMucGFyYW1zLmhlaWdodCAtIChhcmVhLnRvcCArIGFyZWEuaGVpZ2h0KTtcbiAgICBsZXQgeTIgPSB0aGlzLnBhcmFtcy5oZWlnaHQgLSBhcmVhLnRvcDtcblxuICAgIHkxICs9IHRoaXMucGFyYW1zLnRvcDtcbiAgICB5MiArPSB0aGlzLnBhcmFtcy50b3A7XG5cbiAgICBjb25zdCBpdGVtU2hhcGVNYXAgPSB0aGlzLl9pdGVtU2hhcGVNYXA7XG4gICAgY29uc3QgY29udGV4dCA9IHRoaXMuY29udGV4dDtcblxuICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5pdGVtcy5maWx0ZXIoZnVuY3Rpb24oZGF0dW0sIGluZGV4KSB7XG4gICAgICBjb25zdCBncm91cCA9IHRoaXM7XG4gICAgICBjb25zdCBzaGFwZSA9IGl0ZW1TaGFwZU1hcC5nZXQoZ3JvdXApO1xuICAgICAgcmV0dXJuIHNoYXBlLmluQXJlYShjb250ZXh0LCBkYXR1bSwgeDEsIHkxLCB4MiwgeTIpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGl0ZW1zWzBdLnNsaWNlKDApO1xuICB9XG5cbiAgLy8gaGVscGVyIHRvIGFkZCBzb21lIGNsYXNzIG9yIHN0dWZmIG9uIGl0ZW1zXG4gIGVhY2goY2FsbGJhY2sgPSBudWxsKSB7fVxuXG4gIC8qKlxuICAgKiAgY3JlYXRlcyB0aGUgbGF5ZXIgZ3JvdXAgd2l0aCBhIHRyYW5zZm9ybWF0aW9uIG1hdHJpeCB0byBmbGlwIHRoZSBjb29yZGluYXRlIHN5c3RlbS5cbiAgICogIEBOT1RFOiBwdXQgdGhlIGNvbnRleHQgaW5zaWRlIHRoZSBsYXllciBncm91cCA/IHJldmVyc2UgdGhlIERPTSBvcmRlclxuICAgKi9cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcbiAgICBjb25zdCB0b3AgICAgPSB0aGlzLnBhcmFtcy50b3A7XG4gICAgLy8gbWF0cml4IHRvIGludmVydCB0aGUgY29vcmRpbmF0ZSBzeXN0ZW1cbiAgICBjb25zdCBpbnZlcnRNYXRyaXggPSBgbWF0cml4KDEsIDAsIDAsIC0xLCAwLCAke2hlaWdodH0pYDtcbiAgICAvLyBjcmVhdGUgdGhlIERPTSBvZiB0aGUgY29udGV4dFxuICAgIGNvbnN0IGVsID0gdGhpcy5jb250ZXh0LnJlbmRlcigpO1xuICAgIC8vIGNyZWF0ZSBhIGdyb3VwIHRvIGZsaXAgdGhlIGNvbnRleHQgb2YgdGhlIGxheWVyXG4gICAgdGhpcy5ncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICB0aGlzLmdyb3VwLmNsYXNzTGlzdC5hZGQoJ2l0ZW1zJyk7XG4gICAgdGhpcy5ncm91cC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgaW52ZXJ0TWF0cml4KTtcbiAgICAvLyBhcHBlbmQgdGhlIGdyb3VwIHRvIHRoZSBjb250ZXh0XG4gICAgdGhpcy5jb250ZXh0Lm9mZnNldEdyb3VwLmFwcGVuZENoaWxkKHRoaXMuZ3JvdXApO1xuICAgIGNvbnN0IGlubmVyR3JvdXAgPSB0aGlzLmNvbnRleHQub2Zmc2V0R3JvdXA7XG5cbiAgICB0aGlzLmlubmVyTGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB7XG4gICAgICBpbm5lckdyb3VwLmFwcGVuZENoaWxkKGxheWVyLnJlbmRlcigpKVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGVsO1xuICB9XG5cbiAgLyoqXG4gICAqIGNyZWF0ZSB0aGUgRE9NIGFjY29yZGluZyB0byBnaXZlbiBkYXRhIGFuZCBzaGFwZXNcbiAgICovXG4gIGRyYXcoKSB7XG4gICAgLy8gQE5PVEU6IGNyZWF0ZSBhIHVuaXF1ZSBpZCB0byBmb3JjZSBkMyB0byBrZWVwIGRhdGEgaW4gc3luYyB3aXRoIHRoZSBET01cbiAgICAvLyBAVE9ETzogcmVhZCBhZ2FpbiBodHRwOi8vYm9zdC5vY2tzLm9yZy9taWtlL3NlbGVjdGlvbi9cbiAgICB0aGlzLmRhdGEuZm9yRWFjaChmdW5jdGlvbihkYXR1bSkge1xuICAgICAgaWYgKF9kYXR1bUlkTWFwLmhhcyhkYXR1bSkpIHsgcmV0dXJuOyB9XG4gICAgICBfZGF0dW1JZE1hcC5zZXQoZGF0dW0sIF9jb3VudGVyKyspO1xuICAgIH0pO1xuXG4gICAgLy8gc2VsZWN0IGl0ZW1zXG4gICAgdGhpcy5pdGVtcyA9IGQzLnNlbGVjdCh0aGlzLmdyb3VwKVxuICAgICAgLnNlbGVjdEFsbCgnLml0ZW0nKVxuICAgICAgLmZpbHRlcihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmNsYXNzTGlzdC5jb250YWlucygnY29tbW9uJylcbiAgICAgIH0pXG4gICAgICAuZGF0YSh0aGlzLmRhdGEsIGZ1bmN0aW9uKGRhdHVtKSB7XG4gICAgICAgIHJldHVybiBfZGF0dW1JZE1hcC5nZXQoZGF0dW0pO1xuICAgICAgfSk7XG5cbiAgICAvLyBoYW5kbGUgY29tbW9uU2hhcGVzXG4gICAgaWYgKHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbiAhPT0gbnVsbCkge1xuICAgICAgY29uc3QgeyBjdG9yLCBhY2Nlc3NvcnMgfSA9IHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbjtcbiAgICAgIGNvbnN0IGdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgICAgY29uc3Qgc2hhcGUgPSBuZXcgY3Rvcihncm91cCk7XG5cbiAgICAgIHNoYXBlLmluc3RhbGwoYWNjZXNzb3JzKTtcbiAgICAgIGdyb3VwLmFwcGVuZENoaWxkKHNoYXBlLnJlbmRlcigpKTtcbiAgICAgIGdyb3VwLmNsYXNzTGlzdC5hZGQoJ2l0ZW0nLCAnY29tbW9uJywgc2hhcGUuZ2V0Q2xhc3NOYW1lKCkpO1xuXG4gICAgICB0aGlzLl9pdGVtQ29tbW9uU2hhcGVNYXAuc2V0KGdyb3VwLCBzaGFwZSk7XG4gICAgICB0aGlzLmdyb3VwLmFwcGVuZENoaWxkKGdyb3VwKTtcbiAgICB9XG5cbiAgICAvLyBlbnRlclxuICAgIHRoaXMuaXRlbXMuZW50ZXIoKVxuICAgICAgLmFwcGVuZCgoZGF0dW0sIGluZGV4KSA9PiB7XG4gICAgICAgIC8vIEBOT1RFOiBkMyBiaW5kcyBgdGhpc2AgdG8gdGhlIGNvbnRhaW5lciBncm91cFxuICAgICAgICAvLyBjcmVhdGUgYSBncm91cCBmb3IgdGhlIGl0ZW1cbiAgICAgICAgY29uc3QgZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgICAgIGNvbnN0IHsgY3RvciwgYWNjZXNzb3JzIH0gPSB0aGlzLl9zaGFwZUNvbmZpZ3VyYXRpb247XG4gICAgICAgIGNvbnN0IHNoYXBlID0gbmV3IGN0b3IoKTtcbiAgICAgICAgLy8gaW5zdGFsbCBhY2Nlc3NvcnMgb24gdGhlIG5ld2x5IGNyZWF0ZWQgc2hhcGVcbiAgICAgICAgc2hhcGUuaW5zdGFsbChhY2Nlc3NvcnMpO1xuXG4gICAgICAgIGdyb3VwLmFwcGVuZENoaWxkKHNoYXBlLnJlbmRlcigpKTtcbiAgICAgICAgZ3JvdXAuY2xhc3NMaXN0LmFkZCgnaXRlbScsIHNoYXBlLmdldENsYXNzTmFtZSgpKTtcblxuICAgICAgICB0aGlzLl9pdGVtU2hhcGVNYXAuc2V0KGdyb3VwLCBzaGFwZSk7XG5cbiAgICAgICAgcmV0dXJuIGdyb3VwO1xuICAgICAgfSk7XG5cbiAgICAvLyBleGl0XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG5cbiAgICB0aGlzLml0ZW1zLmV4aXQoKVxuICAgICAgLmVhY2goZnVuY3Rpb24oZGF0dW0sIGluZGV4KSB7XG4gICAgICAgIGNvbnN0IGdyb3VwID0gdGhpcztcbiAgICAgICAgY29uc3Qgc2hhcGUgPSB0aGF0Ll9pdGVtU2hhcGVzTWFwLmdldChncm91cCk7XG5cbiAgICAgICAgc2hhcGUuZGVzdHJveSgpOyAvLyBjbGVhbiBzaGFwZVxuICAgICAgICBfZGF0dW1JZE1hcC5kZWxldGUoZGF0dW0pOyAvLyBjbGVhbiByZWZlcmVuY2UgaW4gYGlkYCBtYXBcbiAgICAgICAgdGhhdC5faXRlbVNoYXBlTWFwLmRlbGV0ZShncm91cCk7IC8vIGRlc3Ryb3kgcmVmZXJlbmNlIGluIGl0ZW0gc2hhcGUgbWFwXG4gICAgICB9KVxuICAgICAgLnJlbW92ZSgpO1xuXG4gICAgLy8gcmVuZGVyIGlubmVyTGF5ZXJzXG4gICAgdGhpcy5pbm5lckxheWVycy5mb3JFYWNoKChsYXllcikgPT4gbGF5ZXIuZHJhdygpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgdXBkYXRlcyBET00gY29udGV4dCBhbmQgc2hhcGVzXG4gICAqL1xuICB1cGRhdGUoKSB7XG4gICAgdGhpcy51cGRhdGVDb250ZXh0KCk7XG4gICAgdGhpcy51cGRhdGVTaGFwZXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgdXBkYXRlcyBET00gY29udGV4dCBvbmx5XG4gICAqL1xuICB1cGRhdGVDb250ZXh0KCkge1xuICAgIC8vIHVwZGF0ZSBjb250ZXh0XG4gICAgdGhpcy5jb250ZXh0LnVwZGF0ZSgpO1xuICAgIC8vIHVwZGF0ZSBpbm5lckxheWVyc1xuICAgIHRoaXMuaW5uZXJMYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IGxheWVyLnVwZGF0ZUNvbnRleHQoKSk7XG4gIH1cblxuICAvKipcbiAgICogIHVwZGF0ZXMgRE9NIGNvbnRleHQgYW5kIFNoYXBlc1xuICAgKiAgQHBhcmFtXG4gICAqL1xuICB1cGRhdGVTaGFwZXMoaXRlbSA9IG51bGwpIHtcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5jb250ZXh0O1xuICAgIGNvbnN0IGl0ZW1zID0gaXRlbSAhPT0gbnVsbCA/IGQzLnNlbGVjdEFsbChpdGVtKSA6IHRoaXMuaXRlbXM7XG5cbiAgICAvLyB1cGRhdGUgY29tbW9uIHNoYXBlc1xuICAgIHRoaXMuX2l0ZW1Db21tb25TaGFwZU1hcC5mb3JFYWNoKChzaGFwZSwgaXRlbSkgPT4ge1xuICAgICAgc2hhcGUudXBkYXRlKGNvbnRleHQsIGl0ZW0sIHRoaXMuZGF0YSk7XG4gICAgfSk7XG5cbiAgICAvLyB1cGRhdGUgZW50aXR5IG9yIGNvbGxlY3Rpb24gc2hhcGVzXG4gICAgaXRlbXMuZWFjaChmdW5jdGlvbihkYXR1bSwgaW5kZXgpIHtcbiAgICAgIC8vIHVwZGF0ZSBhbGwgc2hhcGVzIHJlbGF0ZWQgdG8gdGhlIGN1cnJlbnQgaXRlbVxuICAgICAgY29uc3QgZ3JvdXAgPSB0aGlzOyAvLyBjdXJyZW50IGBnLml0ZW1gXG4gICAgICBjb25zdCBzaGFwZSA9IHRoYXQuX2l0ZW1TaGFwZU1hcC5nZXQoZ3JvdXApO1xuICAgICAgc2hhcGUudXBkYXRlKGNvbnRleHQsIGdyb3VwLCBkYXR1bSwgaW5kZXgpO1xuICAgIH0pO1xuXG4gICAgLy8gdXBkYXRlIGlubmVyTGF5ZXJzXG4gICAgdGhpcy5pbm5lckxheWVycy5mb3JFYWNoKChsYXllcikgPT4gbGF5ZXIudXBkYXRlU2hhcGVzKCkpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTGF5ZXI7XG4iXX0=