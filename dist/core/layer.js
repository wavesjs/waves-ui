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
    getItemFromDOMElement: {

      // --------------------------------------
      // Helpers
      // --------------------------------------

      /**
       * @return <DOMElement> the closest parent `item` group for a given DOM element
       */

      value: function getItemFromDOMElement(el) {
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
        var item = this.getItemFromDOMElement(el);
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
//# sourceMappingURL=data:application/json;base64,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QUM7T0FDM0Q7Ozs7U0FuWUcsS0FBSzs7O0FBc1lYLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDIiwiZmlsZSI6ImVzNi9jb3JlL2xheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQ29udGV4dCA9IHJlcXVpcmUoJy4vY29udGV4dCcpO1xuY29uc3QgbnMgPSByZXF1aXJlKCcuL25hbWVzcGFjZScpO1xuXG4vLyBjcmVhdGUgYSBwcml2YXRlIGl0ZW0gLT4gaWQgbWFwIHRvIGZvcmNlIGQzIGJlaW5nIGluIHN5bmMgd2l0aCB0aGUgRE9NXG5sZXQgX2NvdW50ZXIgPSAwO1xuY29uc3QgX2RhdHVtSWRNYXAgPSBuZXcgTWFwKCk7XG5cbmNsYXNzIExheWVyIHtcbiAgY29uc3RydWN0b3IoZGF0YVR5cGUgPSAnY29sbGVjdGlvbicsIGRhdGEgPSBbXSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5kYXRhVHlwZSA9IGRhdGFUeXBlOyAvLyAnZW50aXR5JyB8fCAnY29sbGVjdGlvbic7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgaGVpZ2h0OiAxMDAsIC8vIHNob3VsZCBpbmhlcml0IGZyb20gcGFyZW50XG4gICAgICB0b3A6IDAsXG4gICAgICBkZWJ1Z0NvbnRleHQ6IGZhbHNlLCAvLyBwYXNzIHRoZSBjb250ZXh0IGluIGRlYnVnIG1vZGVcbiAgICB9XG5cbiAgICB0aGlzLnBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcblxuICAgIC8vIHRoaXMuY29udGFpbmVyID0gbnVsbDsgLy8gb2Zmc2V0IGdyb3VwIG9mIHRoZSBwYXJlbnQgY29udGV4dFxuICAgIHRoaXMuZ3JvdXAgPSBudWxsOyAvLyBncm91cCBjcmVhdGVkIGJ5IHRoZSBsYXllciBpbnNpZGUgdGhlIGNvbnRleHRcbiAgICB0aGlzLml0ZW1zID0gbnVsbDsgLy8gZDMgY29sbGVjdGlvbiBvZiB0aGUgbGF5ZXIgaXRlbXNcblxuICAgIC8vIEBOT1RFIHJlbW92ZSBpbiBmYXZvciBvZiBMYXllckdyb3VwID9cbiAgICAvLyBAcHJpdmF0ZSA/XG4gICAgdGhpcy5pbm5lckxheWVycyA9IFtdO1xuXG4gICAgLy8gY3RvciA9PiBhY2Nlc3NvcnNcbiAgICB0aGlzLl9zaGFwZUNvbmZpZ3VyYXRpb24gPSBudWxsOyAvLyB7IGN0b3IsIGFjY2Vzc29ycyB9XG4gICAgdGhpcy5fY29tbW9uU2hhcGVDb25maWd1cmF0aW9uID0gbnVsbDsgLy8geyBjdG9yLCBhY2Nlc3NvcnMgfVxuICAgIC8vIGl0ZW0gZ3JvdXAgPERPTUVsZW1lbnQ+ID0+IHNoYXBlXG4gICAgdGhpcy5faXRlbVNoYXBlTWFwID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuX2l0ZW1Db21tb25TaGFwZU1hcCA9IG5ldyBNYXAoKTsgLy8gb25lIGVudHJ5IG1heCBpbiB0aGlzIG1hcFxuXG4gICAgdGhpcy5fYmVoYXZpb3IgPSBudWxsO1xuICB9XG5cbiAgaW5pdGlhbGl6ZShwYXJlbnRDb250ZXh0KSB7XG4gICAgdGhpcy5jb250ZXh0ID0gbmV3IENvbnRleHQocGFyZW50Q29udGV4dCwge1xuICAgICAgaGVpZ2h0OiB0aGlzLnBhcmFtcy5oZWlnaHQsXG4gICAgICB0b3A6IHRoaXMucGFyYW1zLnRvcCxcbiAgICAgIGRlYnVnOiB0aGlzLnBhcmFtcy5kZWJ1Z0NvbnRleHRcbiAgICB9KTtcblxuICAgIHRoaXMuY29udGV4dC5hZGRDbGFzcygnbGF5ZXInKTtcbiAgfVxuXG4gIGdldCBkYXRhKCkgeyByZXR1cm4gdGhpcy5fZGF0YTsgfVxuXG4gIHNldCBkYXRhKGRhdGEpIHtcbiAgICBzd2l0Y2ggKHRoaXMuZGF0YVR5cGUpIHtcbiAgICAgIGNhc2UgJ2VudGl0eSc6XG4gICAgICAgIGlmICh0aGlzLl9kYXRhKSB7IC8vIGlmIGRhdGEgYWxyZWFkeSBleGlzdHMsIHJldXNlIHRoZSByZWZlcmVuY2VcbiAgICAgICAgICB0aGlzLl9kYXRhWzBdID0gZGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9kYXRhID0gW2RhdGFdO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sbGVjdGlvbic6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLl9kYXRhID0gZGF0YTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLy8gQE5PVEUgcmVtb3ZlIGluIGZhdm9yIG9mIGxheWVyJ3MgR3JvdXAgP1xuICBhZGRMYXllcihsYXllcikge1xuICAgIC8vIEBUT0RPIGluc2VydCBhIGxheWVyIGluc2lkZSBhbiBhbHJlYWR5IGV4aXN0aW5nIGxheWVyc1xuICAgIGxheWVyLmluaXRpYWxpemUodGhpcy5jb250ZXh0KTtcbiAgICB0aGlzLmlubmVyTGF5ZXJzLnB1c2gobGF5ZXIpO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQ29uZmlndXJlIENvbXBvbmVudFxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiAgUmVnaXN0ZXIgdGhlIHNoYXBlIGFuZCBpdHMgYWNjZXNzb3JzIHRvIHVzZSBpbiBvcmRlciB0byByZW5kZXJcbiAgICogIHRoZSBlbnRpdHkgb3IgY29sbGVjdGlvblxuICAgKiAgQHBhcmFtIGN0b3IgPEZ1bmN0aW9uOkJhc2VTaGFwZT4gdGhlIGNvbnN0cnVjdG9yIG9mIHRoZSBzaGFwZSB0byBiZSB1c2VkXG4gICAqICBAcGFyYW0gYWNjZXNzb3JzIDxPYmplY3Q+IGFjY2Vzc29ycyB0byB1c2UgaW4gb3JkZXIgdG8gbWFwIHRoZSBkYXRhIHN0cnVjdHVyZVxuICAgKi9cbiAgc2V0U2hhcGUoY3RvciwgYWNjZXNzb3JzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuX3NoYXBlQ29uZmlndXJhdGlvbiA9IHsgY3RvciwgYWNjZXNzb3JzIH07XG4gIH1cblxuICAvKipcbiAgICogIFJlZ2lzdGVyIHRoZSBzaGFwZSB0byB1c2Ugd2l0aCB0aGUgZW50aXJlIGNvbGxlY3Rpb25cbiAgICogIGV4YW1wbGU6IHRoZSBsaW5lIGluIGEgYmVha3BvaW50IGZ1bmN0aW9uXG4gICAqICBAcGFyYW0gY3RvciA8QmFzZVNoYXBlPiB0aGUgY29uc3RydWN0b3Igb2YgdGhlIHNoYXBlIHRvIHVzZSB0byByZW5kZXIgZGF0YVxuICAgKiAgQHBhcmFtIGFjY2Vzc29ycyA8T2JqZWN0PiBhY2Nlc3NvcnMgdG8gdXNlIGluIG9yZGVyIHRvIG1hcCB0aGUgZGF0YSBzdHJ1Y3R1cmVcbiAgICovXG4gIHNldENvbW1vblNoYXBlKGN0b3IsIGFjY2Vzc29ycyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLl9jb21tb25TaGFwZUNvbmZpZ3VyYXRpb24gPSB7IGN0b3IsIGFjY2Vzc29ycyB9O1xuICB9XG5cbiAgLyoqXG4gICAqICBSZWdpc3RlciB0aGUgYmVoYXZpb3IgdG8gdXNlIHdoZW4gaW50ZXJhY3Rpbmcgd2l0aCB0aGUgc2hhcGVcbiAgICogIEBwYXJhbSBiZWhhdmlvciA8QmFzZUJlaGF2aW9yPlxuICAgKi9cbiAgc2V0QmVoYXZpb3IoYmVoYXZpb3IpIHtcbiAgICBiZWhhdmlvci5pbml0aWFsaXplKHRoaXMpO1xuICAgIHRoaXMuX2JlaGF2aW9yID0gYmVoYXZpb3I7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBDb250ZXh0IEFjY2Vzc29yc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEBUT0RPIHNldENvbnRleHRQYXJhbWV0ZXJzXG4gIC8vIEBUT0RPIHVzZSBhbiBvYmplY3QgdG8gc2hhcmUgYSByZWZlcmVuY2Ugd2l0aCBhcHBsaWNhdGlvbiBjb2RlXG5cbiAgLy8gY29udGV4dCBhY2Nlc3NvcnMgLSB0aGVzZSBhcmUgb25seSBjb21tYW5kc1xuICBnZXQgY29udGV4dENvbmZpZ3VyYXRpb24oKSB7fVxuXG4gIC8vIHRoZXNlIHBhcmFtZXRlcnMgc2hvdWxkIGJlIGluIGFuIG9iamVjdCB0byB3b3JrIHdpdGggcmVmZXJlbmNlc1xuICBnZXQgc3RhcnQoKSB7IHJldHVybiB0aGlzLmNvbnRleHQuc3RhcnQ7IH1cbiAgc2V0IHN0YXJ0KHZhbHVlKSB7IHRoaXMuY29udGV4dC5zdGFydCA9IHZhbHVlOyB9XG5cbiAgZ2V0IGR1cmF0aW9uKCkgeyByZXR1cm4gdGhpcy5jb250ZXh0LmR1cmF0aW9uOyB9XG4gIHNldCBkdXJhdGlvbih2YWx1ZSkgeyB0aGlzLmNvbnRleHQuZHVyYXRpb24gPSB2YWx1ZTsgfVxuXG4gIGdldCBvZmZzZXQoKSB7IHJldHVybiB0aGlzLmNvbnRleHQub2Zmc2V0OyB9XG4gIHNldCBvZmZzZXQodmFsdWUpIHsgdGhpcy5jb250ZXh0Lm9mZnNldCA9IHZhbHVlOyB9XG5cbiAgZ2V0IHN0cmV0Y2hSYXRpbygpIHsgcmV0dXJuIHRoaXMuY29udGV4dC5zdHJldGNoUmF0aW87IH1cbiAgc2V0IHN0cmV0Y2hSYXRpbyh2YWx1ZSkgeyB0aGlzLmNvbnRleHQuc3RyZXRjaFJhdGlvID0gdmFsdWU7IH1cblxuICBnZXQgeURvbWFpbigpIHsgcmV0dXJuIHRoaXMuY29udGV4dC55RG9tYWluOyB9XG4gIHNldCB5RG9tYWluKHZhbHVlKSB7IHRoaXMuY29udGV4dC55RG9tYWluID0gdmFsdWU7IH1cblxuICBnZXQgb3BhY2l0eSgpIHsgcmV0dXJuIHRoaXMuY29udGV4dC5vcGFjaXR5OyB9XG4gIHNldCBvcGFjaXR5KHZhbHVlKSB7IHRoaXMuY29udGV4dC5vcGFjaXR5ID0gdmFsdWU7IH1cblxuICAvLyBATk9URSA6IG1vdmUgdGhpcyBpbiBoaWdoZXIgYWJzdHJhY3Rpb24gbGV2ZWwgPyA9PiBwcm9iYWJseSB5ZXNcbiAgLy8gYXBwbHkgdGhlIHN0cmV0Y2ggcmF0aW9uIG9uIHRoZSBkYXRhLCByZXNldCBzdHJldGNoIHRvIDFcbiAgLy8gYXBwbHlTdHJldGNoKCkge31cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBCZWhhdmlvciBBY2Nlc3NvcnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogIEJlaGF2aW9yIGVudHJ5IHBvaW50c1xuICAgKiAgQE5PVEUgQVBJIC0+IGNoYW5nZSBmb3IgYW4gQXJyYXkgYXMgZmlyc3QgYXJndW1lbnRcbiAgICogIEBUT0RPICAgICAtPiBoYW5kbGUgaWYgbm8gYmVoYXZpb3IgaXMgcmVnaXN0ZXJlZFxuICAgKi9cbiAgZ2V0IHNlbGVjdGVkSXRlbXMoKSB7IHJldHVybiB0aGlzLl9iZWhhdmlvci5zZWxlY3RlZEl0ZW1zOyB9XG5cbiAgc2VsZWN0KC4uLml0ZW1zKSB7XG4gICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgZGF0dW0gPSBkMy5zZWxlY3QoaXRlbSkuZGF0dW0oKTtcbiAgICAgIHRoaXMuX2JlaGF2aW9yLnNlbGVjdChpdGVtLCBkYXR1bSk7XG4gICAgfSk7XG4gIH1cblxuICB1bnNlbGVjdCguLi5pdGVtcykge1xuICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGNvbnN0IGRhdHVtID0gZDMuc2VsZWN0KGl0ZW0pLmRhdHVtKCk7XG4gICAgICB0aGlzLl9iZWhhdmlvci51bnNlbGVjdChpdGVtLCBkYXR1bSk7XG4gICAgfSk7XG4gIH1cbiAgLy8gQFRPRE8gdGVzdFxuICBzZWxlY3RBbGwoKSB7XG4gICAgdGhpcy5pdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB0aGlzLnNlbGVjdChpdGVtKSk7XG4gIH1cblxuICB1bnNlbGVjdEFsbCgpIHtcbiAgICB0aGlzLnNlbGVjdGVkSXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4gdGhpcy51bnNlbGVjdChpdGVtKSk7XG4gIH1cblxuICB0b2dnbGVTZWxlY3Rpb24oLi4uaXRlbXMpIHtcbiAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBjb25zdCBkYXR1bSA9IGQzLnNlbGVjdChpdGVtKS5kYXR1bSgpO1xuICAgICAgdGhpcy5fYmVoYXZpb3IudG9nZ2xlU2VsZWN0aW9uKGl0ZW0sIGRhdHVtKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIEBUT0RPIGNoYW5nZSBzaWduYXR1cmUgZWRpdChpdGVtcyA9IFsuLi5dLCBkeCwgZHksIHRhcmdldCk7XG4gIC8vIC0+IGJlIGNvbnNpc3RlbnQgZm9yIGFsbCBiZWhhdmlvcnMgQVBJXG4gIGVkaXQoaXRlbSwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICBjb25zdCBkYXR1bSA9IGQzLnNlbGVjdChpdGVtKS5kYXR1bSgpO1xuICAgIGNvbnN0IHNoYXBlID0gdGhpcy5faXRlbVNoYXBlTWFwLmdldChpdGVtKTtcbiAgICB0aGlzLl9iZWhhdmlvci5lZGl0KHRoaXMuY29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBIZWxwZXJzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIEByZXR1cm4gPERPTUVsZW1lbnQ+IHRoZSBjbG9zZXN0IHBhcmVudCBgaXRlbWAgZ3JvdXAgZm9yIGEgZ2l2ZW4gRE9NIGVsZW1lbnRcbiAgICovXG4gIGdldEl0ZW1Gcm9tRE9NRWxlbWVudChlbCkge1xuICAgIGRvIHtcbiAgICAgIGlmIChlbC5ub2RlTmFtZSA9PT0gJ2cnICYmIGVsLmNsYXNzTGlzdC5jb250YWlucygnaXRlbScpKSB7XG4gICAgICAgIHJldHVybiBlbDtcbiAgICAgIH1cbiAgICB9IHdoaWxlIChlbCA9IGVsLnBhcmVudE5vZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqICBAcGFyYW0gPERPTUVsZW1lbnQ+IHRoZSBlbGVtZW50IHdlIHdhbnQgdG8gZmluZCB0aGUgY2xvc2VzdCBgLml0ZW1gIGdyb3VwXG4gICAqICBAcmV0dXJuIDxtaXhlZD5cbiAgICogICAgPERPTUVsZW1lbnQ+IGl0ZW0gZ3JvdXAgY29udGFpbmluZyB0aGUgZWwgaWYgYmVsb25ncyB0byB0aGlzIGxheWVyXG4gICAqICAgIG51bGwgb3RoZXJ3aXNlXG4gICAqL1xuICBoYXNJdGVtKGVsKSB7XG4gICAgY29uc3QgaXRlbSA9IHRoaXMuZ2V0SXRlbUZyb21ET01FbGVtZW50KGVsKTtcbiAgICByZXR1cm4gKHRoaXMuaXRlbXNbMF0uaW5kZXhPZihpdGVtKSAhPT0gLTEpID8gaXRlbSA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogIEBwYXJhbSBhcmVhIDxPYmplY3Q+IGFyZWEgaW4gd2hpY2ggdG8gZmluZCB0aGUgZWxlbWVudHNcbiAgICogIEByZXR1cm4gPEFycmF5PiBsaXN0IG9mIHRoZSBET00gZWxlbWVudHMgaW4gdGhlIGdpdmVuIGFyZWFcbiAgICovXG4gIGdldEl0ZW1zSW5BcmVhKGFyZWEpIHtcbiAgICAvLyB3b3JrIGluIHBpeGVsIGRvbWFpblxuICAgIGNvbnN0IHN0YXJ0ICAgID0gdGhpcy5jb250ZXh0LnhTY2FsZSh0aGlzLmNvbnRleHQuc3RhcnQpO1xuICAgIGNvbnN0IGR1cmF0aW9uID0gdGhpcy5jb250ZXh0LnhTY2FsZSh0aGlzLmNvbnRleHQuZHVyYXRpb24pO1xuICAgIGNvbnN0IG9mZnNldCAgID0gdGhpcy5jb250ZXh0LnhTY2FsZSh0aGlzLmNvbnRleHQub2Zmc2V0KTtcbiAgICBjb25zdCB0b3AgICAgICA9IHRoaXMucGFyYW1zLnRvcDtcbiAgICAvLyBtdXN0IGJlIGF3YXJlIG9mIHRoZSBsYXllcidzIGNvbnRleHQgbW9kaWZpY2F0aW9uc1xuICAgIC8vIGNvbnN0cmFpbiBpbiB3b3JraW5nIHZpZXdcbiAgICBsZXQgeDEgPSBNYXRoLm1heChhcmVhLmxlZnQsIHN0YXJ0KTtcbiAgICBsZXQgeDIgPSBNYXRoLm1pbihhcmVhLmxlZnQgKyBhcmVhLndpZHRoLCBzdGFydCArIGR1cmF0aW9uKTtcbiAgICAvLyBhcHBseSBzdGFydCBhbmQgb2Zmc2V0XG4gICAgeDEgLT0gKHN0YXJ0ICsgb2Zmc2V0KTtcbiAgICB4MiAtPSAoc3RhcnQgKyBvZmZzZXQpO1xuICAgIC8vIEBGSVhNRSBzdHJldGNoUmF0aW8gYnJlYWtzIHNlbGVjdGlvblxuICAgIC8vIHgyICo9IHRoaXMuY29udGV4dC5zdHJldGNoUmF0aW87XG4gICAgLy8gYmUgY29uc2lzdGVudCB3aXRoIGNvbnRleHQgeSBjb29yZGluYXRlcyBzeXN0ZW1cbiAgICBsZXQgeTEgPSB0aGlzLnBhcmFtcy5oZWlnaHQgLSAoYXJlYS50b3AgKyBhcmVhLmhlaWdodCk7XG4gICAgbGV0IHkyID0gdGhpcy5wYXJhbXMuaGVpZ2h0IC0gYXJlYS50b3A7XG5cbiAgICB5MSArPSB0aGlzLnBhcmFtcy50b3A7XG4gICAgeTIgKz0gdGhpcy5wYXJhbXMudG9wO1xuXG4gICAgY29uc3QgaXRlbVNoYXBlTWFwID0gdGhpcy5faXRlbVNoYXBlTWFwO1xuICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLmNvbnRleHQ7XG5cbiAgICBjb25zdCBpdGVtcyA9IHRoaXMuaXRlbXMuZmlsdGVyKGZ1bmN0aW9uKGRhdHVtLCBpbmRleCkge1xuICAgICAgY29uc3QgZ3JvdXAgPSB0aGlzO1xuICAgICAgY29uc3Qgc2hhcGUgPSBpdGVtU2hhcGVNYXAuZ2V0KGdyb3VwKTtcbiAgICAgIHJldHVybiBzaGFwZS5pbkFyZWEoY29udGV4dCwgZGF0dW0sIHgxLCB5MSwgeDIsIHkyKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBpdGVtc1swXS5zbGljZSgwKTtcbiAgfVxuXG4gIC8vIGhlbHBlciB0byBhZGQgc29tZSBjbGFzcyBvciBzdHVmZiBvbiBpdGVtc1xuICBlYWNoKGNhbGxiYWNrID0gbnVsbCkge31cblxuICAvKipcbiAgICogIGNyZWF0ZXMgdGhlIGxheWVyIGdyb3VwIHdpdGggYSB0cmFuc2Zvcm1hdGlvbiBtYXRyaXggdG8gZmxpcCB0aGUgY29vcmRpbmF0ZSBzeXN0ZW0uXG4gICAqICBATk9URTogcHV0IHRoZSBjb250ZXh0IGluc2lkZSB0aGUgbGF5ZXIgZ3JvdXAgPyByZXZlcnNlIHRoZSBET00gb3JkZXJcbiAgICovXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgY29uc3QgdG9wICAgID0gdGhpcy5wYXJhbXMudG9wO1xuICAgIC8vIG1hdHJpeCB0byBpbnZlcnQgdGhlIGNvb3JkaW5hdGUgc3lzdGVtXG4gICAgY29uc3QgaW52ZXJ0TWF0cml4ID0gYG1hdHJpeCgxLCAwLCAwLCAtMSwgMCwgJHtoZWlnaHR9KWA7XG4gICAgLy8gY3JlYXRlIHRoZSBET00gb2YgdGhlIGNvbnRleHRcbiAgICBjb25zdCBlbCA9IHRoaXMuY29udGV4dC5yZW5kZXIoKTtcbiAgICAvLyBjcmVhdGUgYSBncm91cCB0byBmbGlwIHRoZSBjb250ZXh0IG9mIHRoZSBsYXllclxuICAgIHRoaXMuZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgdGhpcy5ncm91cC5jbGFzc0xpc3QuYWRkKCdpdGVtcycpO1xuICAgIHRoaXMuZ3JvdXAuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGludmVydE1hdHJpeCk7XG4gICAgLy8gYXBwZW5kIHRoZSBncm91cCB0byB0aGUgY29udGV4dFxuICAgIHRoaXMuY29udGV4dC5vZmZzZXRHcm91cC5hcHBlbmRDaGlsZCh0aGlzLmdyb3VwKTtcbiAgICBjb25zdCBpbm5lckdyb3VwID0gdGhpcy5jb250ZXh0Lm9mZnNldEdyb3VwO1xuXG4gICAgdGhpcy5pbm5lckxheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgICAgaW5uZXJHcm91cC5hcHBlbmRDaGlsZChsYXllci5yZW5kZXIoKSlcbiAgICB9KTtcblxuICAgIHJldHVybiBlbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBjcmVhdGUgdGhlIERPTSBhY2NvcmRpbmcgdG8gZ2l2ZW4gZGF0YSBhbmQgc2hhcGVzXG4gICAqL1xuICBkcmF3KCkge1xuICAgIC8vIEBOT1RFOiBjcmVhdGUgYSB1bmlxdWUgaWQgdG8gZm9yY2UgZDMgdG8ga2VlcCBkYXRhIGluIHN5bmMgd2l0aCB0aGUgRE9NXG4gICAgLy8gQFRPRE86IHJlYWQgYWdhaW4gaHR0cDovL2Jvc3Qub2Nrcy5vcmcvbWlrZS9zZWxlY3Rpb24vXG4gICAgdGhpcy5kYXRhLmZvckVhY2goZnVuY3Rpb24oZGF0dW0pIHtcbiAgICAgIGlmIChfZGF0dW1JZE1hcC5oYXMoZGF0dW0pKSB7IHJldHVybjsgfVxuICAgICAgX2RhdHVtSWRNYXAuc2V0KGRhdHVtLCBfY291bnRlcisrKTtcbiAgICB9KTtcblxuICAgIC8vIHNlbGVjdCBpdGVtc1xuICAgIHRoaXMuaXRlbXMgPSBkMy5zZWxlY3QodGhpcy5ncm91cClcbiAgICAgIC5zZWxlY3RBbGwoJy5pdGVtJylcbiAgICAgIC5maWx0ZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5jbGFzc0xpc3QuY29udGFpbnMoJ2NvbW1vbicpXG4gICAgICB9KVxuICAgICAgLmRhdGEodGhpcy5kYXRhLCBmdW5jdGlvbihkYXR1bSkge1xuICAgICAgICByZXR1cm4gX2RhdHVtSWRNYXAuZ2V0KGRhdHVtKTtcbiAgICAgIH0pO1xuXG4gICAgLy8gaGFuZGxlIGNvbW1vblNoYXBlc1xuICAgIGlmICh0aGlzLl9jb21tb25TaGFwZUNvbmZpZ3VyYXRpb24gIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IHsgY3RvciwgYWNjZXNzb3JzIH0gPSB0aGlzLl9jb21tb25TaGFwZUNvbmZpZ3VyYXRpb247XG4gICAgICBjb25zdCBncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICAgIGNvbnN0IHNoYXBlID0gbmV3IGN0b3IoZ3JvdXApO1xuXG4gICAgICBzaGFwZS5pbnN0YWxsKGFjY2Vzc29ycyk7XG4gICAgICBncm91cC5hcHBlbmRDaGlsZChzaGFwZS5yZW5kZXIoKSk7XG4gICAgICBncm91cC5jbGFzc0xpc3QuYWRkKCdpdGVtJywgJ2NvbW1vbicsIHNoYXBlLmdldENsYXNzTmFtZSgpKTtcblxuICAgICAgdGhpcy5faXRlbUNvbW1vblNoYXBlTWFwLnNldChncm91cCwgc2hhcGUpO1xuICAgICAgdGhpcy5ncm91cC5hcHBlbmRDaGlsZChncm91cCk7XG4gICAgfVxuXG4gICAgLy8gZW50ZXJcbiAgICB0aGlzLml0ZW1zLmVudGVyKClcbiAgICAgIC5hcHBlbmQoKGRhdHVtLCBpbmRleCkgPT4ge1xuICAgICAgICAvLyBATk9URTogZDMgYmluZHMgYHRoaXNgIHRvIHRoZSBjb250YWluZXIgZ3JvdXBcbiAgICAgICAgLy8gY3JlYXRlIGEgZ3JvdXAgZm9yIHRoZSBpdGVtXG4gICAgICAgIGNvbnN0IGdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgICAgICBjb25zdCB7IGN0b3IsIGFjY2Vzc29ycyB9ID0gdGhpcy5fc2hhcGVDb25maWd1cmF0aW9uO1xuICAgICAgICBjb25zdCBzaGFwZSA9IG5ldyBjdG9yKCk7XG4gICAgICAgIC8vIGluc3RhbGwgYWNjZXNzb3JzIG9uIHRoZSBuZXdseSBjcmVhdGVkIHNoYXBlXG4gICAgICAgIHNoYXBlLmluc3RhbGwoYWNjZXNzb3JzKTtcblxuICAgICAgICBncm91cC5hcHBlbmRDaGlsZChzaGFwZS5yZW5kZXIodGhpcy5jb250ZXh0KSk7XG4gICAgICAgIGdyb3VwLmNsYXNzTGlzdC5hZGQoJ2l0ZW0nLCBzaGFwZS5nZXRDbGFzc05hbWUoKSk7XG5cbiAgICAgICAgdGhpcy5faXRlbVNoYXBlTWFwLnNldChncm91cCwgc2hhcGUpO1xuXG4gICAgICAgIHJldHVybiBncm91cDtcbiAgICAgIH0pO1xuXG4gICAgLy8gZXhpdFxuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuXG4gICAgdGhpcy5pdGVtcy5leGl0KClcbiAgICAgIC5lYWNoKGZ1bmN0aW9uKGRhdHVtLCBpbmRleCkge1xuICAgICAgICBjb25zdCBncm91cCA9IHRoaXM7XG4gICAgICAgIGNvbnN0IHNoYXBlID0gdGhhdC5faXRlbVNoYXBlc01hcC5nZXQoZ3JvdXApO1xuXG4gICAgICAgIHNoYXBlLmRlc3Ryb3koKTsgLy8gY2xlYW4gc2hhcGVcbiAgICAgICAgX2RhdHVtSWRNYXAuZGVsZXRlKGRhdHVtKTsgLy8gY2xlYW4gcmVmZXJlbmNlIGluIGBpZGAgbWFwXG4gICAgICAgIHRoYXQuX2l0ZW1TaGFwZU1hcC5kZWxldGUoZ3JvdXApOyAvLyBkZXN0cm95IHJlZmVyZW5jZSBpbiBpdGVtIHNoYXBlIG1hcFxuICAgICAgfSlcbiAgICAgIC5yZW1vdmUoKTtcblxuICAgIC8vIHJlbmRlciBpbm5lckxheWVyc1xuICAgIHRoaXMuaW5uZXJMYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IGxheWVyLmRyYXcoKSk7XG4gIH1cblxuICAvKipcbiAgICogIHVwZGF0ZXMgRE9NIGNvbnRleHQgYW5kIHNoYXBlc1xuICAgKi9cbiAgdXBkYXRlKCkge1xuICAgIHRoaXMudXBkYXRlQ29udGV4dCgpO1xuICAgIHRoaXMudXBkYXRlU2hhcGVzKCk7XG4gIH1cblxuICAvKipcbiAgICogIHVwZGF0ZXMgRE9NIGNvbnRleHQgb25seVxuICAgKi9cbiAgdXBkYXRlQ29udGV4dCgpIHtcbiAgICAvLyB1cGRhdGUgY29udGV4dFxuICAgIHRoaXMuY29udGV4dC51cGRhdGUoKTtcbiAgICAvLyB1cGRhdGUgaW5uZXJMYXllcnNcbiAgICB0aGlzLmlubmVyTGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiBsYXllci51cGRhdGVDb250ZXh0KCkpO1xuICB9XG5cbiAgLyoqXG4gICAqICB1cGRhdGVzIERPTSBjb250ZXh0IGFuZCBTaGFwZXNcbiAgICogIEBwYXJhbVxuICAgKi9cbiAgdXBkYXRlU2hhcGVzKGl0ZW0gPSBudWxsKSB7XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgY29uc3QgY29udGV4dCA9IHRoaXMuY29udGV4dDtcbiAgICBjb25zdCBpdGVtcyA9IGl0ZW0gIT09IG51bGwgPyBkMy5zZWxlY3RBbGwoaXRlbSkgOiB0aGlzLml0ZW1zO1xuXG4gICAgLy8gdXBkYXRlIGNvbW1vbiBzaGFwZXNcbiAgICB0aGlzLl9pdGVtQ29tbW9uU2hhcGVNYXAuZm9yRWFjaCgoc2hhcGUsIGl0ZW0pID0+IHtcbiAgICAgIHNoYXBlLnVwZGF0ZShjb250ZXh0LCBpdGVtLCB0aGlzLmRhdGEpO1xuICAgIH0pO1xuXG4gICAgLy8gdXBkYXRlIGVudGl0eSBvciBjb2xsZWN0aW9uIHNoYXBlc1xuICAgIGl0ZW1zLmVhY2goZnVuY3Rpb24oZGF0dW0sIGluZGV4KSB7XG4gICAgICAvLyB1cGRhdGUgYWxsIHNoYXBlcyByZWxhdGVkIHRvIHRoZSBjdXJyZW50IGl0ZW1cbiAgICAgIGNvbnN0IGdyb3VwID0gdGhpczsgLy8gY3VycmVudCBgZy5pdGVtYFxuICAgICAgY29uc3Qgc2hhcGUgPSB0aGF0Ll9pdGVtU2hhcGVNYXAuZ2V0KGdyb3VwKTtcbiAgICAgIHNoYXBlLnVwZGF0ZShjb250ZXh0LCBncm91cCwgZGF0dW0sIGluZGV4KTtcbiAgICB9KTtcblxuICAgIC8vIHVwZGF0ZSBpbm5lckxheWVyc1xuICAgIHRoaXMuaW5uZXJMYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IGxheWVyLnVwZGF0ZVNoYXBlcygpKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExheWVyO1xuIl19