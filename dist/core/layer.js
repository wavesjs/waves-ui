"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var Context = require("./context");
var ns = require("./namespace");

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

    this.innerLayers = []; // not used yet

    this.commonShapes = new _core.Map(); // { ctor: [instance], ... }

    this._shapes = new _core.Map();
    this._itemShapesMap = new _core.Map();

    // @TODO
    this.shapeAccessorsMap = new _core.Map();

    // maintain a list of the layers selected items
    // @TODO change for a raw array - easier to consume outside
    // this.selectedItems = new Set();
  }

  _createClass(Layer, {
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
    addLayer: {

      // @NOTE remove in favor of layer's Group ?

      value: function addLayer(layer) {
        // @TODO insert a layer inside an already existing layers
        layer.initialize(this.context);
        this.innerLayers.push(layer);
      }
    },
    useShape: {

      // register the shape(s) and its accessors to use in order to render the entity or collection

      value: function useShape(ctor) {
        var accessors = arguments[1] === undefined ? {} : arguments[1];

        this._shapes = this._shapes.set(ctor, accessors);
      }
    },
    useCommonShape: {

      // register the shape(s) to use that is common to the entire collection
      // example: the line in a beakpoint function

      value: function useCommonShape() {
        var _this = this;

        for (var _len = arguments.length, shapes /*, accessors */ = Array(_len), _key = 0; _key < _len; _key++) {
          shapes[_key] = arguments[_key];
        }

        shapes.forEach(function (ctor) {
          // initialize the value to null, is used to test
          // if the common shape must be rendered (if null) or not
          _this.commonShapes.set(ctor, null);
        });
      }
    },
    configureBehavior: {
      value: function configureBehavior(behavior) {
        behavior.initialize(this);
        this.behavior = behavior;
      }
    },
    start: {

      // @TODO rename ?
      // configureShape(ctor, accessors) {}
      // configureCommonShape(ctor, accessors) {}

      // @TODO setParam

      // context accessors - these are only commands

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
    each: {

      // @WARNING: be careful with method profusion

      // @NOTE : move this in higher abstraction level ? => probably yes
      // apply the stretch ration on the data, reset stretch to 1
      // applyStretch() {}

      // store key/function pairs to set accessors for one shape
      // setShapeAccessors(ctor, accessors = {}) {}

      // helper to add some class or stuff on items

      value: function each() {
        var callback = arguments[0] === undefined ? null : arguments[0];
      }
    },
    _getItemFromDOMElement: {

      /**
       * returns the closest `item` form a given DOM element
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
       *  @return
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

        var itemShapesMap = this._itemShapesMap;
        var context = this.context;

        var items = this.items.filter(function (datum, index) {
          var group = this;
          var shapes = itemShapesMap.get(group);

          var inArea = shapes.map(function (shape) {
            return shape.inArea(context, datum, x1, x2, y1, y2);
          });

          return inArea.indexOf(true) !== -1;
        });

        return items[0].slice(0);
      }
    },
    select: {

      // execute(command /*, params, event ? */) {
      //   switch(command) {

      //   }

      //   this.innerLayers.forEach((layer) => {
      //     layer.execute(command);
      //   });
      // }

      // @TODO move in BaseBehavior

      // handleSelectionShape =
      /**
       *  Behavior entry points
       *  @NOTE API -> change for an Array as first argument
       */

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
    selectedItems: {
      get: function () {
        return this.behavior.selectedItems;
      }
    },
    edit: {

      // - shape edition
      // ------------------------------------------------
      // move(item, dx, dy, target) {}
      // resize(item, dx, dy, target) {}

      value: function edit(item, dx, dy, target) {
        var datum = d3.select(item).datum();
        this.behavior.edit(item, datum, dx, dy, target);
      }
    },
    render: {

      // move(item, dx, dy, target) {}
      // resize(item, dx, dy, target) {}

      // END REWRITE

      /**
       *  creates the layer group with a transformation matrix
       *  to flip the coordinate system.
       *  @NOTE: put the context inside the layer group ?
       *         reverse the DOM order
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
        this.commonShapes.forEach(function (shape, ctor) {
          if (shape !== null) {
            return;
          }

          var group = document.createElementNS(ns, "g");
          var shape = new ctor(group);

          group.appendChild(shape.render());
          group.classList.add("item", "common", shape.getClassName());
          // store instance inside the commonShapes Map
          _this.commonShapes.set(ctor, { group: group, shape: shape });
          _this.group.appendChild(group);
        });

        // enter
        this.items.enter().append(function (datum, index) {
          // @NOTE: d3 binds `this` to the container group
          // create a group for the item
          var group = document.createElementNS(ns, "g");
          group.classList.add("item");

          // create all the shapes related to the current item
          var shapes = [];

          _this._shapes.forEach(function (accessors, ctor, map) {
            var shape = new ctor();
            // install accessors on the newly created shape
            shape.install(accessors);

            group.appendChild(shape.render());
            group.classList.add(shape.getClassName());
            shapes.push(shape);
          });

          _this._itemShapesMap.set(group, shapes);

          return group;
        });

        // exit
        var that = this;

        this.items.exit().each(function (datum, index) {
          var group = this;
          var shapes = that._itemShapesMap.get(group);
          // clean shapes
          shapes.forEach(function (shape) {
            return shape.destroy();
          });
          // delete reference in `id` map
          _datumIdMap["delete"](datum);
          // destroy references in item shapes map
          that._itemShapesMap["delete"](group);
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
       */

      value: function updateShapes() {
        var _this = this;

        var item = arguments[0] === undefined ? null : arguments[0];

        var that = this;
        var context = this.context;
        var items = item !== null ? d3.selectAll(item) : this.items;

        // update common shapes
        this.commonShapes.forEach(function (details, ctor) {
          details.shape.update(context, details.group, _this.data);
        });

        // update entity or collection shapes
        this.items.each(function (datum, index) {
          // update all shapes related to the current item
          var group = this; // current `g.item`
          var shapes = that._itemShapesMap.get(group);
          shapes.forEach(function (shape) {
            return shape.update(context, group, datum, index);
          });
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
//# sourceMappingURL=data:application/json;base64,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V0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUs7aUJBQUssS0FBSyxDQUFDLFlBQVksRUFBRTtTQUFBLENBQUMsQ0FBQztPQUMzRDs7OztTQXZZRyxLQUFLOzs7QUEwWVgsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMiLCJmaWxlIjoiZXM2L3NoYXBlcy9yZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQ29udGV4dCA9IHJlcXVpcmUoJy4vY29udGV4dCcpO1xuY29uc3QgbnMgPSByZXF1aXJlKCcuL25hbWVzcGFjZScpO1xuXG5sZXQgX2NvdW50ZXIgPSAwO1xuY29uc3QgX2RhdHVtSWRNYXAgPSBuZXcgTWFwKCk7XG5cbmNsYXNzIExheWVyIHtcbiAgY29uc3RydWN0b3IoZGF0YVR5cGUgPSAnY29sbGVjdGlvbicsIGRhdGEgPSBbXSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5kYXRhVHlwZSA9IGRhdGFUeXBlOyAvLyAnZW50aXR5JyB8fCAnY29sbGVjdGlvbic7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgaGVpZ2h0OiAxMDAsIC8vIHNob3VsZCBpbmhlcml0IGZyb20gcGFyZW50XG4gICAgICB0b3A6IDAsXG4gICAgICBkZWJ1Z0NvbnRleHQ6IGZhbHNlLCAvLyBwYXNzIHRoZSBjb250ZXh0IGluIGRlYnVnIG1vZGVcbiAgICB9XG5cbiAgICB0aGlzLnBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcblxuICAgIC8vIHRoaXMuY29udGFpbmVyID0gbnVsbDsgLy8gb2Zmc2V0IGdyb3VwIG9mIHRoZSBwYXJlbnQgY29udGV4dFxuICAgIHRoaXMuZ3JvdXAgPSBudWxsOyAvLyBncm91cCBjcmVhdGVkIGJ5IHRoZSBsYXllciBpbnNpZGUgdGhlIGNvbnRleHRcbiAgICB0aGlzLml0ZW1zID0gbnVsbDsgLy8gZDMgY29sbGVjdGlvbiBvZiB0aGUgbGF5ZXIgaXRlbXNcblxuICAgIHRoaXMuaW5uZXJMYXllcnMgPSBbXTsgLy8gbm90IHVzZWQgeWV0XG5cbiAgICB0aGlzLmNvbW1vblNoYXBlcyA9IG5ldyBNYXA7IC8vIHsgY3RvcjogW2luc3RhbmNlXSwgLi4uIH1cblxuICAgIHRoaXMuX3NoYXBlcyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl9pdGVtU2hhcGVzTWFwID0gbmV3IE1hcCgpO1xuXG4gICAgLy8gQFRPRE9cbiAgICB0aGlzLnNoYXBlQWNjZXNzb3JzTWFwID0gbmV3IE1hcCgpO1xuXG4gICAgLy8gbWFpbnRhaW4gYSBsaXN0IG9mIHRoZSBsYXllcnMgc2VsZWN0ZWQgaXRlbXNcbiAgICAvLyBAVE9ETyBjaGFuZ2UgZm9yIGEgcmF3IGFycmF5IC0gZWFzaWVyIHRvIGNvbnN1bWUgb3V0c2lkZVxuICAgIC8vIHRoaXMuc2VsZWN0ZWRJdGVtcyA9IG5ldyBTZXQoKTtcbiAgfVxuXG4gIGdldCBkYXRhKCkgeyByZXR1cm4gdGhpcy5fZGF0YTsgfVxuXG4gIHNldCBkYXRhKGRhdGEpIHtcbiAgICBpZiAodGhpcy5kYXRhVHlwZSA9PT0gJ2VudGl0eScpIHsgZGF0YSA9IFtkYXRhXTsgfVxuICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xuICB9XG5cbiAgaW5pdGlhbGl6ZShwYXJlbnRDb250ZXh0KSB7XG4gICAgdGhpcy5jb250ZXh0ID0gbmV3IENvbnRleHQocGFyZW50Q29udGV4dCwge1xuICAgICAgaGVpZ2h0OiB0aGlzLnBhcmFtcy5oZWlnaHQsXG4gICAgICB0b3A6IHRoaXMucGFyYW1zLnRvcCxcbiAgICAgIGRlYnVnOiB0aGlzLnBhcmFtcy5kZWJ1Z0NvbnRleHRcbiAgICB9KTtcblxuICAgIHRoaXMuY29udGV4dC5hZGRDbGFzcygnbGF5ZXInKTtcbiAgfVxuXG4gIC8vIEBOT1RFIHJlbW92ZSBpbiBmYXZvciBvZiBsYXllcidzIEdyb3VwID9cbiAgYWRkTGF5ZXIobGF5ZXIpIHtcbiAgICAvLyBAVE9ETyBpbnNlcnQgYSBsYXllciBpbnNpZGUgYW4gYWxyZWFkeSBleGlzdGluZyBsYXllcnNcbiAgICBsYXllci5pbml0aWFsaXplKHRoaXMuY29udGV4dCk7XG4gICAgdGhpcy5pbm5lckxheWVycy5wdXNoKGxheWVyKTtcbiAgfVxuXG4gIC8vIHJlZ2lzdGVyIHRoZSBzaGFwZShzKSBhbmQgaXRzIGFjY2Vzc29ycyB0byB1c2UgaW4gb3JkZXIgdG8gcmVuZGVyIHRoZSBlbnRpdHkgb3IgY29sbGVjdGlvblxuICB1c2VTaGFwZShjdG9yLCBhY2Nlc3NvcnMgPSB7fSkge1xuICAgIHRoaXMuX3NoYXBlcyA9IHRoaXMuX3NoYXBlcy5zZXQoY3RvciwgYWNjZXNzb3JzKTtcbiAgfVxuXG4gIC8vIHJlZ2lzdGVyIHRoZSBzaGFwZShzKSB0byB1c2UgdGhhdCBpcyBjb21tb24gdG8gdGhlIGVudGlyZSBjb2xsZWN0aW9uXG4gIC8vIGV4YW1wbGU6IHRoZSBsaW5lIGluIGEgYmVha3BvaW50IGZ1bmN0aW9uXG4gIHVzZUNvbW1vblNoYXBlKC4uLnNoYXBlcyAvKiwgYWNjZXNzb3JzICovKSB7XG4gICAgc2hhcGVzLmZvckVhY2goKGN0b3IpID0+IHtcbiAgICAgIC8vIGluaXRpYWxpemUgdGhlIHZhbHVlIHRvIG51bGwsIGlzIHVzZWQgdG8gdGVzdFxuICAgICAgLy8gaWYgdGhlIGNvbW1vbiBzaGFwZSBtdXN0IGJlIHJlbmRlcmVkIChpZiBudWxsKSBvciBub3RcbiAgICAgIHRoaXMuY29tbW9uU2hhcGVzLnNldChjdG9yLCBudWxsKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNvbmZpZ3VyZUJlaGF2aW9yKGJlaGF2aW9yKSB7XG4gICAgYmVoYXZpb3IuaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICB0aGlzLmJlaGF2aW9yID0gYmVoYXZpb3I7XG4gIH1cblxuICAvLyBAVE9ETyByZW5hbWUgP1xuICAvLyBjb25maWd1cmVTaGFwZShjdG9yLCBhY2Nlc3NvcnMpIHt9XG4gIC8vIGNvbmZpZ3VyZUNvbW1vblNoYXBlKGN0b3IsIGFjY2Vzc29ycykge31cblxuICAvLyBAVE9ETyBzZXRQYXJhbVxuXG4gIC8vIGNvbnRleHQgYWNjZXNzb3JzIC0gdGhlc2UgYXJlIG9ubHkgY29tbWFuZHNcbiAgZ2V0IHN0YXJ0KCkgeyByZXR1cm4gdGhpcy5jb250ZXh0LnN0YXJ0OyB9XG4gIHNldCBzdGFydCh2YWx1ZSkgeyB0aGlzLmNvbnRleHQuc3RhcnQgPSB2YWx1ZTsgfVxuXG4gIGdldCBkdXJhdGlvbigpIHsgcmV0dXJuIHRoaXMuY29udGV4dC5kdXJhdGlvbjsgfVxuICBzZXQgZHVyYXRpb24odmFsdWUpIHsgdGhpcy5jb250ZXh0LmR1cmF0aW9uID0gdmFsdWU7IH1cblxuICBnZXQgb2Zmc2V0KCkgeyByZXR1cm4gdGhpcy5jb250ZXh0Lm9mZnNldDsgfVxuICBzZXQgb2Zmc2V0KHZhbHVlKSB7IHRoaXMuY29udGV4dC5vZmZzZXQgPSB2YWx1ZTsgfVxuXG4gIGdldCBzdHJldGNoUmF0aW8oKSB7IHJldHVybiB0aGlzLmNvbnRleHQuc3RyZXRjaFJhdGlvOyB9XG4gIHNldCBzdHJldGNoUmF0aW8odmFsdWUpIHsgdGhpcy5jb250ZXh0LnN0cmV0Y2hSYXRpbyA9IHZhbHVlOyB9XG5cbiAgZ2V0IHlEb21haW4oKSB7IHJldHVybiB0aGlzLmNvbnRleHQueURvbWFpbjsgfVxuICBzZXQgeURvbWFpbih2YWx1ZSkgeyB0aGlzLmNvbnRleHQueURvbWFpbiA9IHZhbHVlOyB9XG5cbiAgZ2V0IG9wYWNpdHkoKSB7IHJldHVybiB0aGlzLmNvbnRleHQub3BhY2l0eTsgfVxuICBzZXQgb3BhY2l0eSh2YWx1ZSkgeyB0aGlzLmNvbnRleHQub3BhY2l0eSA9IHZhbHVlOyB9XG5cbiAgLy8gQFdBUk5JTkc6IGJlIGNhcmVmdWwgd2l0aCBtZXRob2QgcHJvZnVzaW9uXG5cbiAgLy8gQE5PVEUgOiBtb3ZlIHRoaXMgaW4gaGlnaGVyIGFic3RyYWN0aW9uIGxldmVsID8gPT4gcHJvYmFibHkgeWVzXG4gIC8vIGFwcGx5IHRoZSBzdHJldGNoIHJhdGlvbiBvbiB0aGUgZGF0YSwgcmVzZXQgc3RyZXRjaCB0byAxXG4gIC8vIGFwcGx5U3RyZXRjaCgpIHt9XG5cbiAgLy8gc3RvcmUga2V5L2Z1bmN0aW9uIHBhaXJzIHRvIHNldCBhY2Nlc3NvcnMgZm9yIG9uZSBzaGFwZVxuICAvLyBzZXRTaGFwZUFjY2Vzc29ycyhjdG9yLCBhY2Nlc3NvcnMgPSB7fSkge31cblxuICAvLyBoZWxwZXIgdG8gYWRkIHNvbWUgY2xhc3Mgb3Igc3R1ZmYgb24gaXRlbXNcbiAgZWFjaChjYWxsYmFjayA9IG51bGwpIHt9XG5cbiAgLyoqXG4gICAqIHJldHVybnMgdGhlIGNsb3Nlc3QgYGl0ZW1gIGZvcm0gYSBnaXZlbiBET00gZWxlbWVudFxuICAgKi9cbiAgX2dldEl0ZW1Gcm9tRE9NRWxlbWVudChlbCkge1xuICAgIGRvIHtcbiAgICAgIGlmIChlbC5ub2RlTmFtZSA9PT0gJ2cnICYmIGVsLmNsYXNzTGlzdC5jb250YWlucygnaXRlbScpKSB7XG4gICAgICAgIHJldHVybiBlbDtcbiAgICAgIH1cbiAgICB9IHdoaWxlIChlbCA9IGVsLnBhcmVudE5vZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqICBAcGFyYW0gPERPTUVsZW1lbnQ+IHRoZSBlbGVtZW50IHdlIHdhbnQgdG8gZmluZCB0aGUgY2xvc2VzdCBgLml0ZW1gIGdyb3VwXG4gICAqICBAcmV0dXJuXG4gICAqICAgIDxET01FbGVtZW50PiBpdGVtIGdyb3VwIGNvbnRhaW5pbmcgdGhlIGVsIGlmIGJlbG9uZ3MgdG8gdGhpcyBsYXllclxuICAgKiAgICBudWxsIG90aGVyd2lzZVxuICAgKi9cbiAgaGFzSXRlbShlbCkge1xuICAgIGNvbnN0IGl0ZW0gPSB0aGlzLl9nZXRJdGVtRnJvbURPTUVsZW1lbnQoZWwpO1xuICAgIHJldHVybiAodGhpcy5pdGVtc1swXS5pbmRleE9mKGl0ZW0pICE9PSAtMSkgPyBpdGVtIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiAgQHBhcmFtIGFyZWEgPE9iamVjdD4gYXJlYSBpbiB3aGljaCB0byBmaW5kIHRoZSBlbGVtZW50c1xuICAgKiAgQHJldHVybiA8QXJyYXk+IGxpc3Qgb2YgdGhlIERPTSBlbGVtZW50cyBpbiB0aGUgZ2l2ZW4gYXJlYVxuICAgKi9cbiAgZ2V0SXRlbXNJbkFyZWEoYXJlYSkge1xuICAgIC8vIHdvcmsgaW4gcGl4ZWwgZG9tYWluXG4gICAgY29uc3Qgc3RhcnQgICAgPSB0aGlzLmNvbnRleHQueFNjYWxlKHRoaXMuY29udGV4dC5zdGFydCk7XG4gICAgY29uc3QgZHVyYXRpb24gPSB0aGlzLmNvbnRleHQueFNjYWxlKHRoaXMuY29udGV4dC5kdXJhdGlvbik7XG4gICAgY29uc3Qgb2Zmc2V0ICAgPSB0aGlzLmNvbnRleHQueFNjYWxlKHRoaXMuY29udGV4dC5vZmZzZXQpO1xuICAgIGNvbnN0IHRvcCAgICAgID0gdGhpcy5wYXJhbXMudG9wO1xuICAgIC8vIG11c3QgYmUgYXdhcmUgb2YgdGhlIGxheWVyJ3MgY29udGV4dCBtb2RpZmljYXRpb25zXG4gICAgLy8gY29uc3RyYWluIGluIHdvcmtpbmcgdmlld1xuICAgIGxldCB4MSA9IE1hdGgubWF4KGFyZWEubGVmdCwgc3RhcnQpO1xuICAgIGxldCB4MiA9IE1hdGgubWluKGFyZWEubGVmdCArIGFyZWEud2lkdGgsIHN0YXJ0ICsgZHVyYXRpb24pO1xuICAgIC8vIGFwcGx5IHN0YXJ0IGFuZCBvZmZzZXRcbiAgICB4MSAtPSAoc3RhcnQgKyBvZmZzZXQpO1xuICAgIHgyIC09IChzdGFydCArIG9mZnNldCk7XG4gICAgLy8gQEZJWE1FIHN0cmV0Y2hSYXRpbyBicmVha3Mgc2VsZWN0aW9uXG4gICAgLy8geDIgKj0gdGhpcy5jb250ZXh0LnN0cmV0Y2hSYXRpbztcbiAgICAvLyBiZSBjb25zaXN0ZW50IHdpdGggY29udGV4dCB5IGNvb3JkaW5hdGVzIHN5c3RlbVxuICAgIGxldCB5MSA9IHRoaXMucGFyYW1zLmhlaWdodCAtIChhcmVhLnRvcCArIGFyZWEuaGVpZ2h0KTtcbiAgICBsZXQgeTIgPSB0aGlzLnBhcmFtcy5oZWlnaHQgLSBhcmVhLnRvcDtcblxuICAgIHkxICs9IHRoaXMucGFyYW1zLnRvcDtcbiAgICB5MiArPSB0aGlzLnBhcmFtcy50b3A7XG5cbiAgICBjb25zdCBpdGVtU2hhcGVzTWFwID0gdGhpcy5faXRlbVNoYXBlc01hcDtcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5jb250ZXh0O1xuXG4gICAgY29uc3QgaXRlbXMgPSB0aGlzLml0ZW1zLmZpbHRlcihmdW5jdGlvbihkYXR1bSwgaW5kZXgpIHtcbiAgICAgIGNvbnN0IGdyb3VwID0gdGhpcztcbiAgICAgIGNvbnN0IHNoYXBlcyA9IGl0ZW1TaGFwZXNNYXAuZ2V0KGdyb3VwKTtcblxuICAgICAgY29uc3QgaW5BcmVhID0gc2hhcGVzLm1hcChmdW5jdGlvbihzaGFwZSkge1xuICAgICAgICByZXR1cm4gc2hhcGUuaW5BcmVhKGNvbnRleHQsIGRhdHVtLCB4MSwgeDIsIHkxLCB5Mik7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGluQXJlYS5pbmRleE9mKHRydWUpICE9PSAtMTtcbiAgICB9KTtcblxuICAgIHJldHVybiBpdGVtc1swXS5zbGljZSgwKTtcbiAgfVxuXG4gIC8vIGV4ZWN1dGUoY29tbWFuZCAvKiwgcGFyYW1zLCBldmVudCA/ICovKSB7XG4gIC8vICAgc3dpdGNoKGNvbW1hbmQpIHtcblxuICAvLyAgIH1cblxuICAvLyAgIHRoaXMuaW5uZXJMYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHtcbiAgLy8gICAgIGxheWVyLmV4ZWN1dGUoY29tbWFuZCk7XG4gIC8vICAgfSk7XG4gIC8vIH1cblxuICAvLyBAVE9ETyBtb3ZlIGluIEJhc2VCZWhhdmlvclxuXG4gIC8vIGhhbmRsZVNlbGVjdGlvblNoYXBlID1cbiAgLyoqXG4gICAqICBCZWhhdmlvciBlbnRyeSBwb2ludHNcbiAgICogIEBOT1RFIEFQSSAtPiBjaGFuZ2UgZm9yIGFuIEFycmF5IGFzIGZpcnN0IGFyZ3VtZW50XG4gICAqL1xuICBzZWxlY3QoLi4uaXRlbXMpIHtcbiAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBjb25zdCBkYXR1bSA9IGQzLnNlbGVjdChpdGVtKS5kYXR1bSgpO1xuICAgICAgdGhpcy5iZWhhdmlvci5zZWxlY3QoaXRlbSwgZGF0dW0pO1xuICAgIH0pO1xuICB9XG5cbiAgdW5zZWxlY3QoLi4uaXRlbXMpIHtcbiAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBjb25zdCBkYXR1bSA9IGQzLnNlbGVjdChpdGVtKS5kYXR1bSgpO1xuICAgICAgdGhpcy5iZWhhdmlvci51bnNlbGVjdChpdGVtLCBkYXR1bSk7XG4gICAgfSk7XG4gIH1cbiAgLy8gQFRPRE8gdGVzdFxuICBzZWxlY3RBbGwoKSB7XG4gICAgdGhpcy5pdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB0aGlzLnNlbGVjdChpdGVtKSk7XG4gIH1cblxuICB1bnNlbGVjdEFsbCgpIHtcbiAgICB0aGlzLnNlbGVjdGVkSXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4gdGhpcy51bnNlbGVjdChpdGVtKSk7XG4gIH1cblxuICB0b2dnbGVTZWxlY3Rpb24oLi4uaXRlbXMpIHtcbiAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBjb25zdCBkYXR1bSA9IGQzLnNlbGVjdChpdGVtKS5kYXR1bSgpO1xuICAgICAgdGhpcy5iZWhhdmlvci50b2dnbGVTZWxlY3Rpb24oaXRlbSwgZGF0dW0pO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0IHNlbGVjdGVkSXRlbXMoKSB7IHJldHVybiB0aGlzLmJlaGF2aW9yLnNlbGVjdGVkSXRlbXM7IH1cblxuICAvLyAtIHNoYXBlIGVkaXRpb25cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIG1vdmUoaXRlbSwgZHgsIGR5LCB0YXJnZXQpIHt9XG4gIC8vIHJlc2l6ZShpdGVtLCBkeCwgZHksIHRhcmdldCkge31cbiAgZWRpdChpdGVtLCBkeCwgZHksIHRhcmdldCkge1xuICAgIGNvbnN0IGRhdHVtID0gZDMuc2VsZWN0KGl0ZW0pLmRhdHVtKCk7XG4gICAgdGhpcy5iZWhhdmlvci5lZGl0KGl0ZW0sIGRhdHVtLCBkeCwgZHksIHRhcmdldCk7XG4gIH1cblxuICAvLyBtb3ZlKGl0ZW0sIGR4LCBkeSwgdGFyZ2V0KSB7fVxuICAvLyByZXNpemUoaXRlbSwgZHgsIGR5LCB0YXJnZXQpIHt9XG5cbiAgLy8gRU5EIFJFV1JJVEVcblxuXG4gIC8qKlxuICAgKiAgY3JlYXRlcyB0aGUgbGF5ZXIgZ3JvdXAgd2l0aCBhIHRyYW5zZm9ybWF0aW9uIG1hdHJpeFxuICAgKiAgdG8gZmxpcCB0aGUgY29vcmRpbmF0ZSBzeXN0ZW0uXG4gICAqICBATk9URTogcHV0IHRoZSBjb250ZXh0IGluc2lkZSB0aGUgbGF5ZXIgZ3JvdXAgP1xuICAgKiAgICAgICAgIHJldmVyc2UgdGhlIERPTSBvcmRlclxuICAgKi9cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcbiAgICBjb25zdCB0b3AgICAgPSB0aGlzLnBhcmFtcy50b3A7XG4gICAgLy8gbWF0cml4IHRvIGludmVydCB0aGUgY29vcmRpbmF0ZSBzeXN0ZW1cbiAgICBjb25zdCBpbnZlcnRNYXRyaXggPSBgbWF0cml4KDEsIDAsIDAsIC0xLCAwLCAke2hlaWdodH0pYDtcbiAgICAvLyBjcmVhdGUgdGhlIERPTSBvZiB0aGUgY29udGV4dFxuICAgIGNvbnN0IGVsID0gdGhpcy5jb250ZXh0LnJlbmRlcigpO1xuICAgIC8vIGNyZWF0ZSBhIGdyb3VwIHRvIGZsaXAgdGhlIGNvbnRleHQgb2YgdGhlIGxheWVyXG4gICAgdGhpcy5ncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICB0aGlzLmdyb3VwLmNsYXNzTGlzdC5hZGQoJ2l0ZW1zJyk7XG4gICAgdGhpcy5ncm91cC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgaW52ZXJ0TWF0cml4KTtcbiAgICAvLyBhcHBlbmQgdGhlIGdyb3VwIHRvIHRoZSBjb250ZXh0XG4gICAgdGhpcy5jb250ZXh0Lm9mZnNldEdyb3VwLmFwcGVuZENoaWxkKHRoaXMuZ3JvdXApO1xuICAgIGNvbnN0IGlubmVyR3JvdXAgPSB0aGlzLmNvbnRleHQub2Zmc2V0R3JvdXA7XG5cbiAgICB0aGlzLmlubmVyTGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB7XG4gICAgICBpbm5lckdyb3VwLmFwcGVuZENoaWxkKGxheWVyLnJlbmRlcigpKVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGVsO1xuICB9XG5cbiAgLyoqXG4gICAqIGNyZWF0ZSB0aGUgRE9NIGFjY29yZGluZyB0byBnaXZlbiBkYXRhIGFuZCBzaGFwZXNcbiAgICovXG4gIGRyYXcoKSB7XG4gICAgLy8gQE5PVEU6IGNyZWF0ZSBhIHVuaXF1ZSBpZCB0byBmb3JjZSBkMyB0byBrZWVwIGRhdGEgaW4gc3luYyB3aXRoIHRoZSBET01cbiAgICAvLyBAVE9ETzogcmVhZCBhZ2FpbiBodHRwOi8vYm9zdC5vY2tzLm9yZy9taWtlL3NlbGVjdGlvbi9cbiAgICB0aGlzLmRhdGEuZm9yRWFjaChmdW5jdGlvbihkYXR1bSkge1xuICAgICAgaWYgKF9kYXR1bUlkTWFwLmhhcyhkYXR1bSkpIHsgcmV0dXJuOyB9XG4gICAgICBfZGF0dW1JZE1hcC5zZXQoZGF0dW0sIF9jb3VudGVyKyspO1xuICAgIH0pO1xuXG4gICAgLy8gc2VsZWN0IGl0ZW1zXG4gICAgdGhpcy5pdGVtcyA9IGQzLnNlbGVjdCh0aGlzLmdyb3VwKVxuICAgICAgLnNlbGVjdEFsbCgnLml0ZW0nKVxuICAgICAgLmZpbHRlcihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmNsYXNzTGlzdC5jb250YWlucygnY29tbW9uJylcbiAgICAgIH0pXG4gICAgICAuZGF0YSh0aGlzLmRhdGEsIGZ1bmN0aW9uKGRhdHVtKSB7XG4gICAgICAgIHJldHVybiBfZGF0dW1JZE1hcC5nZXQoZGF0dW0pO1xuICAgICAgfSk7XG5cbiAgICAvLyBoYW5kbGUgY29tbW9uU2hhcGVzXG4gICAgdGhpcy5jb21tb25TaGFwZXMuZm9yRWFjaCgoc2hhcGUsIGN0b3IpID0+IHtcbiAgICAgIGlmIChzaGFwZSAhPT0gbnVsbCkgeyByZXR1cm47IH1cblxuICAgICAgY29uc3QgZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgICBjb25zdCBzaGFwZSA9IG5ldyBjdG9yKGdyb3VwKTtcblxuICAgICAgZ3JvdXAuYXBwZW5kQ2hpbGQoc2hhcGUucmVuZGVyKCkpO1xuICAgICAgZ3JvdXAuY2xhc3NMaXN0LmFkZCgnaXRlbScsICdjb21tb24nLCBzaGFwZS5nZXRDbGFzc05hbWUoKSk7XG4gICAgICAvLyBzdG9yZSBpbnN0YW5jZSBpbnNpZGUgdGhlIGNvbW1vblNoYXBlcyBNYXBcbiAgICAgIHRoaXMuY29tbW9uU2hhcGVzLnNldChjdG9yLCB7IGdyb3VwLCBzaGFwZSB9KTtcbiAgICAgIHRoaXMuZ3JvdXAuYXBwZW5kQ2hpbGQoZ3JvdXApO1xuICAgIH0pO1xuXG4gICAgLy8gZW50ZXJcbiAgICB0aGlzLml0ZW1zLmVudGVyKClcbiAgICAgIC5hcHBlbmQoKGRhdHVtLCBpbmRleCkgPT4ge1xuICAgICAgICAvLyBATk9URTogZDMgYmluZHMgYHRoaXNgIHRvIHRoZSBjb250YWluZXIgZ3JvdXBcbiAgICAgICAgLy8gY3JlYXRlIGEgZ3JvdXAgZm9yIHRoZSBpdGVtXG4gICAgICAgIGNvbnN0IGdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgICAgICBncm91cC5jbGFzc0xpc3QuYWRkKCdpdGVtJyk7XG5cbiAgICAgICAgLy8gY3JlYXRlIGFsbCB0aGUgc2hhcGVzIHJlbGF0ZWQgdG8gdGhlIGN1cnJlbnQgaXRlbVxuICAgICAgICBsZXQgc2hhcGVzID0gW107XG5cbiAgICAgICAgdGhpcy5fc2hhcGVzLmZvckVhY2goKGFjY2Vzc29ycywgY3RvciwgbWFwKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc2hhcGUgPSBuZXcgY3RvcigpO1xuICAgICAgICAgIC8vIGluc3RhbGwgYWNjZXNzb3JzIG9uIHRoZSBuZXdseSBjcmVhdGVkIHNoYXBlXG4gICAgICAgICAgc2hhcGUuaW5zdGFsbChhY2Nlc3NvcnMpO1xuXG4gICAgICAgICAgZ3JvdXAuYXBwZW5kQ2hpbGQoc2hhcGUucmVuZGVyKCkpO1xuICAgICAgICAgIGdyb3VwLmNsYXNzTGlzdC5hZGQoc2hhcGUuZ2V0Q2xhc3NOYW1lKCkpO1xuICAgICAgICAgIHNoYXBlcy5wdXNoKHNoYXBlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5faXRlbVNoYXBlc01hcC5zZXQoZ3JvdXAsIHNoYXBlcyk7XG5cbiAgICAgICAgcmV0dXJuIGdyb3VwO1xuICAgICAgfSk7XG5cbiAgICAvLyBleGl0XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG5cbiAgICB0aGlzLml0ZW1zLmV4aXQoKVxuICAgICAgLmVhY2goZnVuY3Rpb24oZGF0dW0sIGluZGV4KSB7XG4gICAgICAgIGNvbnN0IGdyb3VwID0gdGhpcztcbiAgICAgICAgY29uc3Qgc2hhcGVzID0gdGhhdC5faXRlbVNoYXBlc01hcC5nZXQoZ3JvdXApO1xuICAgICAgICAvLyBjbGVhbiBzaGFwZXNcbiAgICAgICAgc2hhcGVzLmZvckVhY2goKHNoYXBlKSA9PiBzaGFwZS5kZXN0cm95KCkpO1xuICAgICAgICAvLyBkZWxldGUgcmVmZXJlbmNlIGluIGBpZGAgbWFwXG4gICAgICAgIF9kYXR1bUlkTWFwLmRlbGV0ZShkYXR1bSk7XG4gICAgICAgIC8vIGRlc3Ryb3kgcmVmZXJlbmNlcyBpbiBpdGVtIHNoYXBlcyBtYXBcbiAgICAgICAgdGhhdC5faXRlbVNoYXBlc01hcC5kZWxldGUoZ3JvdXApXG4gICAgICB9KVxuICAgICAgLnJlbW92ZSgpO1xuXG4gICAgLy8gcmVuZGVyIGlubmVyTGF5ZXJzXG4gICAgdGhpcy5pbm5lckxheWVycy5mb3JFYWNoKChsYXllcikgPT4gbGF5ZXIuZHJhdygpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgdXBkYXRlcyBET00gY29udGV4dCBhbmQgc2hhcGVzXG4gICAqL1xuICB1cGRhdGUoKSB7XG4gICAgdGhpcy51cGRhdGVDb250ZXh0KCk7XG4gICAgdGhpcy51cGRhdGVTaGFwZXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgdXBkYXRlcyBET00gY29udGV4dCBvbmx5XG4gICAqL1xuICB1cGRhdGVDb250ZXh0KCkge1xuICAgIC8vIHVwZGF0ZSBjb250ZXh0XG4gICAgdGhpcy5jb250ZXh0LnVwZGF0ZSgpO1xuICAgIC8vIHVwZGF0ZSBpbm5lckxheWVyc1xuICAgIHRoaXMuaW5uZXJMYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IGxheWVyLnVwZGF0ZUNvbnRleHQoKSk7XG4gIH1cblxuICAvKipcbiAgICogIHVwZGF0ZXMgRE9NIGNvbnRleHQgYW5kIFNoYXBlc1xuICAgKi9cbiAgdXBkYXRlU2hhcGVzKGl0ZW0gPSBudWxsKSB7XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgY29uc3QgY29udGV4dCA9IHRoaXMuY29udGV4dDtcbiAgICBjb25zdCBpdGVtcyA9IGl0ZW0gIT09IG51bGwgPyBkMy5zZWxlY3RBbGwoaXRlbSkgOiB0aGlzLml0ZW1zO1xuXG4gICAgLy8gdXBkYXRlIGNvbW1vbiBzaGFwZXNcbiAgICB0aGlzLmNvbW1vblNoYXBlcy5mb3JFYWNoKChkZXRhaWxzLCBjdG9yKSA9PiB7XG4gICAgICBkZXRhaWxzLnNoYXBlLnVwZGF0ZShjb250ZXh0LCBkZXRhaWxzLmdyb3VwLCB0aGlzLmRhdGEpO1xuICAgIH0pO1xuXG4gICAgLy8gdXBkYXRlIGVudGl0eSBvciBjb2xsZWN0aW9uIHNoYXBlc1xuICAgIHRoaXMuaXRlbXMuZWFjaChmdW5jdGlvbihkYXR1bSwgaW5kZXgpIHtcbiAgICAgIC8vIHVwZGF0ZSBhbGwgc2hhcGVzIHJlbGF0ZWQgdG8gdGhlIGN1cnJlbnQgaXRlbVxuICAgICAgY29uc3QgZ3JvdXAgPSB0aGlzOyAvLyBjdXJyZW50IGBnLml0ZW1gXG4gICAgICBjb25zdCBzaGFwZXMgPSB0aGF0Ll9pdGVtU2hhcGVzTWFwLmdldChncm91cCk7XG4gICAgICBzaGFwZXMuZm9yRWFjaCgoc2hhcGUpID0+IHNoYXBlLnVwZGF0ZShjb250ZXh0LCBncm91cCwgZGF0dW0sIGluZGV4KSk7XG4gICAgfSk7XG5cbiAgICAvLyB1cGRhdGUgaW5uZXJMYXllcnNcbiAgICB0aGlzLmlubmVyTGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiBsYXllci51cGRhdGVTaGFwZXMoKSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBMYXllcjtcbiJdfQ==