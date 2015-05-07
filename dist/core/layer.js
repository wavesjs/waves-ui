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

    // @NOTE remove in favor of LayerGroup ?
    // @private ?
    this.innerLayers = [];

    // ctor => accessors
    this._shapeConfiguration = null; // { ctor, accessors }
    this._commonShapeConfiguration = null;
    // d3 DOM group => shape
    this._itemShapeMap = new _core.Map();
    this._itemCommonShapeMap = new _core.Map();
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

        this._commonShapeConfiguration = { ctor: ctor, accessors: accessors };
      }
    },
    setBehavior: {

      // @RENAME to setBehavior(behavior)

      value: function setBehavior(behavior) {
        behavior.initialize(this);
        this.behavior = behavior;
      }
    },
    contextConfiguration: {

      // @TODO rename ?
      // configureShape(ctor, accessors) {}
      // configureCommonShape(ctor, accessors) {}

      // @TODO setParam

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
    each: {

      // @NOTE : move this in higher abstraction level ? => probably yes
      // apply the stretch ration on the data, reset stretch to 1
      // applyStretch() {}

      // helper to add some class or stuff on items

      value: function each() {
        var callback = arguments[0] === undefined ? null : arguments[0];
      }
    },
    _getItemFromDOMElement: {

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
        var shape = this._itemShapeMap.get(item);
        this.behavior.edit(shape, datum, dx, dy, target);
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
        if (this._commonShapeConfiguration) {
          // this.commonShapes.forEach((shape, ctor) => {
          // if (shape !== null) { return; }
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
          // });
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
//# sourceMappingURL=data:application/json;base64,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SUFBSSxDQUFDO0FBQ2xCLFlBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDN0IsWUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLElBQUksR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7OztBQUc5RCxZQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFFLElBQUksRUFBSztBQUNoRCxlQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBSyxJQUFJLENBQUMsQ0FBQztTQUN4QyxDQUFDLENBQUM7OztBQUdILGFBQUssQ0FBQyxJQUFJLENBQUMsVUFBUyxLQUFLLEVBQUUsS0FBSyxFQUFFOztBQUVoQyxjQUFNLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbkIsY0FBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDNUMsZUFBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztTQUM1QyxDQUFDLENBQUM7OztBQUdILFlBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztpQkFBSyxLQUFLLENBQUMsWUFBWSxFQUFFO1NBQUEsQ0FBQyxDQUFDO09BQzNEOzs7O1NBbllHLEtBQUs7OztBQXNZWCxNQUFNLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyIsImZpbGUiOiJlczYvY29yZS9sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IENvbnRleHQgPSByZXF1aXJlKCcuL2NvbnRleHQnKTtcbmNvbnN0IG5zID0gcmVxdWlyZSgnLi9uYW1lc3BhY2UnKTtcblxubGV0IF9jb3VudGVyID0gMDtcbmNvbnN0IF9kYXR1bUlkTWFwID0gbmV3IE1hcCgpO1xuXG5jbGFzcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKGRhdGFUeXBlID0gJ2NvbGxlY3Rpb24nLCBkYXRhID0gW10sIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuZGF0YVR5cGUgPSBkYXRhVHlwZTsgLy8gJ2VudGl0eScgfHwgJ2NvbGxlY3Rpb24nO1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGhlaWdodDogMTAwLCAvLyBzaG91bGQgaW5oZXJpdCBmcm9tIHBhcmVudFxuICAgICAgdG9wOiAwLFxuICAgICAgZGVidWdDb250ZXh0OiBmYWxzZSwgLy8gcGFzcyB0aGUgY29udGV4dCBpbiBkZWJ1ZyBtb2RlXG4gICAgfVxuXG4gICAgdGhpcy5wYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgICAvLyB0aGlzLmNvbnRhaW5lciA9IG51bGw7IC8vIG9mZnNldCBncm91cCBvZiB0aGUgcGFyZW50IGNvbnRleHRcbiAgICB0aGlzLmdyb3VwID0gbnVsbDsgLy8gZ3JvdXAgY3JlYXRlZCBieSB0aGUgbGF5ZXIgaW5zaWRlIHRoZSBjb250ZXh0XG4gICAgdGhpcy5pdGVtcyA9IG51bGw7IC8vIGQzIGNvbGxlY3Rpb24gb2YgdGhlIGxheWVyIGl0ZW1zXG5cbiAgICAvLyBATk9URSByZW1vdmUgaW4gZmF2b3Igb2YgTGF5ZXJHcm91cCA/XG4gICAgLy8gQHByaXZhdGUgP1xuICAgIHRoaXMuaW5uZXJMYXllcnMgPSBbXTtcblxuICAgIC8vIGN0b3IgPT4gYWNjZXNzb3JzXG4gICAgdGhpcy5fc2hhcGVDb25maWd1cmF0aW9uID0gbnVsbDsgLy8geyBjdG9yLCBhY2Nlc3NvcnMgfVxuICAgIHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbiA9IG51bGw7XG4gICAgLy8gZDMgRE9NIGdyb3VwID0+IHNoYXBlXG4gICAgdGhpcy5faXRlbVNoYXBlTWFwID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuX2l0ZW1Db21tb25TaGFwZU1hcCA9IG5ldyBNYXAoKTtcbiAgfVxuXG4gIGluaXRpYWxpemUocGFyZW50Q29udGV4dCkge1xuICAgIHRoaXMuY29udGV4dCA9IG5ldyBDb250ZXh0KHBhcmVudENvbnRleHQsIHtcbiAgICAgIGhlaWdodDogdGhpcy5wYXJhbXMuaGVpZ2h0LFxuICAgICAgdG9wOiB0aGlzLnBhcmFtcy50b3AsXG4gICAgICBkZWJ1ZzogdGhpcy5wYXJhbXMuZGVidWdDb250ZXh0XG4gICAgfSk7XG5cbiAgICB0aGlzLmNvbnRleHQuYWRkQ2xhc3MoJ2xheWVyJyk7XG4gIH1cblxuICBnZXQgZGF0YSgpIHsgcmV0dXJuIHRoaXMuX2RhdGE7IH1cblxuICBzZXQgZGF0YShkYXRhKSB7XG4gICAgaWYgKHRoaXMuZGF0YVR5cGUgPT09ICdlbnRpdHknKSB7IGRhdGEgPSBbZGF0YV07IH1cbiAgICB0aGlzLl9kYXRhID0gZGF0YTtcbiAgfVxuXG4gIC8vIEBOT1RFIHJlbW92ZSBpbiBmYXZvciBvZiBsYXllcidzIEdyb3VwID9cbiAgYWRkTGF5ZXIobGF5ZXIpIHtcbiAgICAvLyBAVE9ETyBpbnNlcnQgYSBsYXllciBpbnNpZGUgYW4gYWxyZWFkeSBleGlzdGluZyBsYXllcnNcbiAgICBsYXllci5pbml0aWFsaXplKHRoaXMuY29udGV4dCk7XG4gICAgdGhpcy5pbm5lckxheWVycy5wdXNoKGxheWVyKTtcbiAgfVxuXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQ29uZmlndXJlIENvbXBvbmVudFxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiAgUmVnaXN0ZXIgdGhlIHNoYXBlIGFuZCBpdHMgYWNjZXNzb3JzIHRvIHVzZSBpbiBvcmRlciB0byByZW5kZXJcbiAgICogIHRoZSBlbnRpdHkgb3IgY29sbGVjdGlvblxuICAgKiAgQHBhcmFtIGN0b3IgPEZ1bmN0aW9uOkJhc2VTaGFwZT4gdGhlIGNvbnN0cnVjdG9yIG9mIHRoZSBzaGFwZSB0byBiZSB1c2VkXG4gICAqICBAcGFyYW0gYWNjZXNzb3JzIDxPYmplY3Q+IGFjY2Vzc29ycyB0byB1c2UgaW4gb3JkZXIgdG8gbWFwIHRoZSBkYXRhIHN0cnVjdHVyZVxuICAgKi9cbiAgc2V0U2hhcGUoY3RvciwgYWNjZXNzb3JzID0ge30pIHtcbiAgICB0aGlzLl9zaGFwZUNvbmZpZ3VyYXRpb24gPSB7IGN0b3IsIGFjY2Vzc29ycyB9O1xuICB9XG5cbiAgLyoqXG4gICAqICBSZWdpc3RlciB0aGUgc2hhcGUgdG8gdXNlIHdpdGggdGhlIGVudGlyZSBjb2xsZWN0aW9uXG4gICAqICBleGFtcGxlOiB0aGUgbGluZSBpbiBhIGJlYWtwb2ludCBmdW5jdGlvblxuICAgKiAgQHBhcmFtIGN0b3IgPEJhc2VTaGFwZT4gdGhlIGNvbnN0cnVjdG9yIG9mIHRoZSBzaGFwZSB0byB1c2UgdG8gcmVuZGVyIGRhdGFcbiAgICogIEBwYXJhbSBhY2Nlc3NvcnMgPE9iamVjdD4gYWNjZXNzb3JzIHRvIHVzZSBpbiBvcmRlciB0byBtYXAgdGhlIGRhdGEgc3RydWN0dXJlXG4gICAqL1xuICBzZXRDb21tb25TaGFwZShjdG9yLCBhY2Nlc3NvcnMgPSB7fSkge1xuICAgIHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbiA9IHsgY3RvciwgYWNjZXNzb3JzIH07XG4gIH1cblxuICAvLyBAUkVOQU1FIHRvIHNldEJlaGF2aW9yKGJlaGF2aW9yKVxuICBzZXRCZWhhdmlvcihiZWhhdmlvcikge1xuICAgIGJlaGF2aW9yLmluaXRpYWxpemUodGhpcyk7XG4gICAgdGhpcy5iZWhhdmlvciA9IGJlaGF2aW9yO1xuICB9XG5cbiAgLy8gQFRPRE8gcmVuYW1lID9cbiAgLy8gY29uZmlndXJlU2hhcGUoY3RvciwgYWNjZXNzb3JzKSB7fVxuICAvLyBjb25maWd1cmVDb21tb25TaGFwZShjdG9yLCBhY2Nlc3NvcnMpIHt9XG5cbiAgLy8gQFRPRE8gc2V0UGFyYW1cblxuICAvLyBjb250ZXh0IGFjY2Vzc29ycyAtIHRoZXNlIGFyZSBvbmx5IGNvbW1hbmRzXG4gIGdldCBjb250ZXh0Q29uZmlndXJhdGlvbigpIHt9XG5cbiAgLy8gdGhlc2UgcGFyYW1ldGVycyBzaG91bGQgYmUgaW4gYW4gb2JqZWN0IHRvIHdvcmsgd2l0aCByZWZlcmVuY2VzXG4gIGdldCBzdGFydCgpIHsgcmV0dXJuIHRoaXMuY29udGV4dC5zdGFydDsgfVxuICBzZXQgc3RhcnQodmFsdWUpIHsgdGhpcy5jb250ZXh0LnN0YXJ0ID0gdmFsdWU7IH1cblxuICBnZXQgZHVyYXRpb24oKSB7IHJldHVybiB0aGlzLmNvbnRleHQuZHVyYXRpb247IH1cbiAgc2V0IGR1cmF0aW9uKHZhbHVlKSB7IHRoaXMuY29udGV4dC5kdXJhdGlvbiA9IHZhbHVlOyB9XG5cbiAgZ2V0IG9mZnNldCgpIHsgcmV0dXJuIHRoaXMuY29udGV4dC5vZmZzZXQ7IH1cbiAgc2V0IG9mZnNldCh2YWx1ZSkgeyB0aGlzLmNvbnRleHQub2Zmc2V0ID0gdmFsdWU7IH1cblxuICBnZXQgc3RyZXRjaFJhdGlvKCkgeyByZXR1cm4gdGhpcy5jb250ZXh0LnN0cmV0Y2hSYXRpbzsgfVxuICBzZXQgc3RyZXRjaFJhdGlvKHZhbHVlKSB7IHRoaXMuY29udGV4dC5zdHJldGNoUmF0aW8gPSB2YWx1ZTsgfVxuXG4gIGdldCB5RG9tYWluKCkgeyByZXR1cm4gdGhpcy5jb250ZXh0LnlEb21haW47IH1cbiAgc2V0IHlEb21haW4odmFsdWUpIHsgdGhpcy5jb250ZXh0LnlEb21haW4gPSB2YWx1ZTsgfVxuXG4gIGdldCBvcGFjaXR5KCkgeyByZXR1cm4gdGhpcy5jb250ZXh0Lm9wYWNpdHk7IH1cbiAgc2V0IG9wYWNpdHkodmFsdWUpIHsgdGhpcy5jb250ZXh0Lm9wYWNpdHkgPSB2YWx1ZTsgfVxuXG4gIC8vIEBOT1RFIDogbW92ZSB0aGlzIGluIGhpZ2hlciBhYnN0cmFjdGlvbiBsZXZlbCA/ID0+IHByb2JhYmx5IHllc1xuICAvLyBhcHBseSB0aGUgc3RyZXRjaCByYXRpb24gb24gdGhlIGRhdGEsIHJlc2V0IHN0cmV0Y2ggdG8gMVxuICAvLyBhcHBseVN0cmV0Y2goKSB7fVxuXG4gIC8vIGhlbHBlciB0byBhZGQgc29tZSBjbGFzcyBvciBzdHVmZiBvbiBpdGVtc1xuICBlYWNoKGNhbGxiYWNrID0gbnVsbCkge31cblxuICAvKipcbiAgICogQHJldHVybiA8RE9NRWxlbWVudD4gdGhlIGNsb3Nlc3QgcGFyZW50IGBpdGVtYCBncm91cCBmb3IgYSBnaXZlbiBET00gZWxlbWVudFxuICAgKi9cbiAgX2dldEl0ZW1Gcm9tRE9NRWxlbWVudChlbCkge1xuICAgIGRvIHtcbiAgICAgIGlmIChlbC5ub2RlTmFtZSA9PT0gJ2cnICYmIGVsLmNsYXNzTGlzdC5jb250YWlucygnaXRlbScpKSB7XG4gICAgICAgIHJldHVybiBlbDtcbiAgICAgIH1cbiAgICB9IHdoaWxlIChlbCA9IGVsLnBhcmVudE5vZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqICBAcGFyYW0gPERPTUVsZW1lbnQ+IHRoZSBlbGVtZW50IHdlIHdhbnQgdG8gZmluZCB0aGUgY2xvc2VzdCBgLml0ZW1gIGdyb3VwXG4gICAqICBAcmV0dXJuIDxtaXhlZD5cbiAgICogICAgPERPTUVsZW1lbnQ+IGl0ZW0gZ3JvdXAgY29udGFpbmluZyB0aGUgZWwgaWYgYmVsb25ncyB0byB0aGlzIGxheWVyXG4gICAqICAgIG51bGwgb3RoZXJ3aXNlXG4gICAqL1xuICBoYXNJdGVtKGVsKSB7XG4gICAgY29uc3QgaXRlbSA9IHRoaXMuX2dldEl0ZW1Gcm9tRE9NRWxlbWVudChlbCk7XG4gICAgcmV0dXJuICh0aGlzLml0ZW1zWzBdLmluZGV4T2YoaXRlbSkgIT09IC0xKSA/IGl0ZW0gOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqICBAcGFyYW0gYXJlYSA8T2JqZWN0PiBhcmVhIGluIHdoaWNoIHRvIGZpbmQgdGhlIGVsZW1lbnRzXG4gICAqICBAcmV0dXJuIDxBcnJheT4gbGlzdCBvZiB0aGUgRE9NIGVsZW1lbnRzIGluIHRoZSBnaXZlbiBhcmVhXG4gICAqL1xuICBnZXRJdGVtc0luQXJlYShhcmVhKSB7XG4gICAgLy8gd29yayBpbiBwaXhlbCBkb21haW5cbiAgICBjb25zdCBzdGFydCAgICA9IHRoaXMuY29udGV4dC54U2NhbGUodGhpcy5jb250ZXh0LnN0YXJ0KTtcbiAgICBjb25zdCBkdXJhdGlvbiA9IHRoaXMuY29udGV4dC54U2NhbGUodGhpcy5jb250ZXh0LmR1cmF0aW9uKTtcbiAgICBjb25zdCBvZmZzZXQgICA9IHRoaXMuY29udGV4dC54U2NhbGUodGhpcy5jb250ZXh0Lm9mZnNldCk7XG4gICAgY29uc3QgdG9wICAgICAgPSB0aGlzLnBhcmFtcy50b3A7XG4gICAgLy8gbXVzdCBiZSBhd2FyZSBvZiB0aGUgbGF5ZXIncyBjb250ZXh0IG1vZGlmaWNhdGlvbnNcbiAgICAvLyBjb25zdHJhaW4gaW4gd29ya2luZyB2aWV3XG4gICAgbGV0IHgxID0gTWF0aC5tYXgoYXJlYS5sZWZ0LCBzdGFydCk7XG4gICAgbGV0IHgyID0gTWF0aC5taW4oYXJlYS5sZWZ0ICsgYXJlYS53aWR0aCwgc3RhcnQgKyBkdXJhdGlvbik7XG4gICAgLy8gYXBwbHkgc3RhcnQgYW5kIG9mZnNldFxuICAgIHgxIC09IChzdGFydCArIG9mZnNldCk7XG4gICAgeDIgLT0gKHN0YXJ0ICsgb2Zmc2V0KTtcbiAgICAvLyBARklYTUUgc3RyZXRjaFJhdGlvIGJyZWFrcyBzZWxlY3Rpb25cbiAgICAvLyB4MiAqPSB0aGlzLmNvbnRleHQuc3RyZXRjaFJhdGlvO1xuICAgIC8vIGJlIGNvbnNpc3RlbnQgd2l0aCBjb250ZXh0IHkgY29vcmRpbmF0ZXMgc3lzdGVtXG4gICAgbGV0IHkxID0gdGhpcy5wYXJhbXMuaGVpZ2h0IC0gKGFyZWEudG9wICsgYXJlYS5oZWlnaHQpO1xuICAgIGxldCB5MiA9IHRoaXMucGFyYW1zLmhlaWdodCAtIGFyZWEudG9wO1xuXG4gICAgeTEgKz0gdGhpcy5wYXJhbXMudG9wO1xuICAgIHkyICs9IHRoaXMucGFyYW1zLnRvcDtcblxuICAgIGNvbnN0IGl0ZW1TaGFwZU1hcCA9IHRoaXMuX2l0ZW1TaGFwZU1hcDtcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5jb250ZXh0O1xuXG4gICAgY29uc3QgaXRlbXMgPSB0aGlzLml0ZW1zLmZpbHRlcihmdW5jdGlvbihkYXR1bSwgaW5kZXgpIHtcbiAgICAgIGNvbnN0IGdyb3VwID0gdGhpcztcbiAgICAgIGNvbnN0IHNoYXBlID0gaXRlbVNoYXBlTWFwLmdldChncm91cCk7XG4gICAgICByZXR1cm4gc2hhcGUuaW5BcmVhKGNvbnRleHQsIGRhdHVtLCB4MSwgeTEsIHgyLCB5Mik7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaXRlbXNbMF0uc2xpY2UoMCk7XG4gIH1cblxuICAvLyBleGVjdXRlKGNvbW1hbmQgLyosIHBhcmFtcywgZXZlbnQgPyAqLykge1xuICAvLyAgIHN3aXRjaChjb21tYW5kKSB7XG5cbiAgLy8gICB9XG5cbiAgLy8gICB0aGlzLmlubmVyTGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB7XG4gIC8vICAgICBsYXllci5leGVjdXRlKGNvbW1hbmQpO1xuICAvLyAgIH0pO1xuICAvLyB9XG5cbiAgLy8gQFRPRE8gbW92ZSBpbiBCYXNlQmVoYXZpb3JcblxuICAvLyBoYW5kbGVTZWxlY3Rpb25TaGFwZSA9XG4gIC8qKlxuICAgKiAgQmVoYXZpb3IgZW50cnkgcG9pbnRzXG4gICAqICBATk9URSBBUEkgLT4gY2hhbmdlIGZvciBhbiBBcnJheSBhcyBmaXJzdCBhcmd1bWVudFxuICAgKi9cbiAgc2VsZWN0KC4uLml0ZW1zKSB7XG4gICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgZGF0dW0gPSBkMy5zZWxlY3QoaXRlbSkuZGF0dW0oKTtcbiAgICAgIHRoaXMuYmVoYXZpb3Iuc2VsZWN0KGl0ZW0sIGRhdHVtKTtcbiAgICB9KTtcbiAgfVxuXG4gIHVuc2VsZWN0KC4uLml0ZW1zKSB7XG4gICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgZGF0dW0gPSBkMy5zZWxlY3QoaXRlbSkuZGF0dW0oKTtcbiAgICAgIHRoaXMuYmVoYXZpb3IudW5zZWxlY3QoaXRlbSwgZGF0dW0pO1xuICAgIH0pO1xuICB9XG4gIC8vIEBUT0RPIHRlc3RcbiAgc2VsZWN0QWxsKCkge1xuICAgIHRoaXMuaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4gdGhpcy5zZWxlY3QoaXRlbSkpO1xuICB9XG5cbiAgdW5zZWxlY3RBbGwoKSB7XG4gICAgdGhpcy5zZWxlY3RlZEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHRoaXMudW5zZWxlY3QoaXRlbSkpO1xuICB9XG5cbiAgdG9nZ2xlU2VsZWN0aW9uKC4uLml0ZW1zKSB7XG4gICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgZGF0dW0gPSBkMy5zZWxlY3QoaXRlbSkuZGF0dW0oKTtcbiAgICAgIHRoaXMuYmVoYXZpb3IudG9nZ2xlU2VsZWN0aW9uKGl0ZW0sIGRhdHVtKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldCBzZWxlY3RlZEl0ZW1zKCkgeyByZXR1cm4gdGhpcy5iZWhhdmlvci5zZWxlY3RlZEl0ZW1zOyB9XG5cbiAgLy8gLSBzaGFwZSBlZGl0aW9uXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBtb3ZlKGl0ZW0sIGR4LCBkeSwgdGFyZ2V0KSB7fVxuICAvLyByZXNpemUoaXRlbSwgZHgsIGR5LCB0YXJnZXQpIHt9XG4gIGVkaXQoaXRlbSwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICBjb25zdCBkYXR1bSA9IGQzLnNlbGVjdChpdGVtKS5kYXR1bSgpO1xuICAgIGNvbnN0IHNoYXBlID0gdGhpcy5faXRlbVNoYXBlTWFwLmdldChpdGVtKTtcbiAgICB0aGlzLmJlaGF2aW9yLmVkaXQoc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCk7XG4gIH1cblxuICAvLyBtb3ZlKGl0ZW0sIGR4LCBkeSwgdGFyZ2V0KSB7fVxuICAvLyByZXNpemUoaXRlbSwgZHgsIGR5LCB0YXJnZXQpIHt9XG5cbiAgLy8gRU5EIFJFV1JJVEVcblxuXG4gIC8qKlxuICAgKiAgY3JlYXRlcyB0aGUgbGF5ZXIgZ3JvdXAgd2l0aCBhIHRyYW5zZm9ybWF0aW9uIG1hdHJpeFxuICAgKiAgdG8gZmxpcCB0aGUgY29vcmRpbmF0ZSBzeXN0ZW0uXG4gICAqICBATk9URTogcHV0IHRoZSBjb250ZXh0IGluc2lkZSB0aGUgbGF5ZXIgZ3JvdXAgP1xuICAgKiAgICAgICAgIHJldmVyc2UgdGhlIERPTSBvcmRlclxuICAgKi9cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcbiAgICBjb25zdCB0b3AgICAgPSB0aGlzLnBhcmFtcy50b3A7XG4gICAgLy8gbWF0cml4IHRvIGludmVydCB0aGUgY29vcmRpbmF0ZSBzeXN0ZW1cbiAgICBjb25zdCBpbnZlcnRNYXRyaXggPSBgbWF0cml4KDEsIDAsIDAsIC0xLCAwLCAke2hlaWdodH0pYDtcbiAgICAvLyBjcmVhdGUgdGhlIERPTSBvZiB0aGUgY29udGV4dFxuICAgIGNvbnN0IGVsID0gdGhpcy5jb250ZXh0LnJlbmRlcigpO1xuICAgIC8vIGNyZWF0ZSBhIGdyb3VwIHRvIGZsaXAgdGhlIGNvbnRleHQgb2YgdGhlIGxheWVyXG4gICAgdGhpcy5ncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICB0aGlzLmdyb3VwLmNsYXNzTGlzdC5hZGQoJ2l0ZW1zJyk7XG4gICAgdGhpcy5ncm91cC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgaW52ZXJ0TWF0cml4KTtcbiAgICAvLyBhcHBlbmQgdGhlIGdyb3VwIHRvIHRoZSBjb250ZXh0XG4gICAgdGhpcy5jb250ZXh0Lm9mZnNldEdyb3VwLmFwcGVuZENoaWxkKHRoaXMuZ3JvdXApO1xuICAgIGNvbnN0IGlubmVyR3JvdXAgPSB0aGlzLmNvbnRleHQub2Zmc2V0R3JvdXA7XG5cbiAgICB0aGlzLmlubmVyTGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB7XG4gICAgICBpbm5lckdyb3VwLmFwcGVuZENoaWxkKGxheWVyLnJlbmRlcigpKVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGVsO1xuICB9XG5cbiAgLyoqXG4gICAqIGNyZWF0ZSB0aGUgRE9NIGFjY29yZGluZyB0byBnaXZlbiBkYXRhIGFuZCBzaGFwZXNcbiAgICovXG4gIGRyYXcoKSB7XG4gICAgLy8gQE5PVEU6IGNyZWF0ZSBhIHVuaXF1ZSBpZCB0byBmb3JjZSBkMyB0byBrZWVwIGRhdGEgaW4gc3luYyB3aXRoIHRoZSBET01cbiAgICAvLyBAVE9ETzogcmVhZCBhZ2FpbiBodHRwOi8vYm9zdC5vY2tzLm9yZy9taWtlL3NlbGVjdGlvbi9cbiAgICB0aGlzLmRhdGEuZm9yRWFjaChmdW5jdGlvbihkYXR1bSkge1xuICAgICAgaWYgKF9kYXR1bUlkTWFwLmhhcyhkYXR1bSkpIHsgcmV0dXJuOyB9XG4gICAgICBfZGF0dW1JZE1hcC5zZXQoZGF0dW0sIF9jb3VudGVyKyspO1xuICAgIH0pO1xuXG4gICAgLy8gc2VsZWN0IGl0ZW1zXG4gICAgdGhpcy5pdGVtcyA9IGQzLnNlbGVjdCh0aGlzLmdyb3VwKVxuICAgICAgLnNlbGVjdEFsbCgnLml0ZW0nKVxuICAgICAgLmZpbHRlcihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmNsYXNzTGlzdC5jb250YWlucygnY29tbW9uJylcbiAgICAgIH0pXG4gICAgICAuZGF0YSh0aGlzLmRhdGEsIGZ1bmN0aW9uKGRhdHVtKSB7XG4gICAgICAgIHJldHVybiBfZGF0dW1JZE1hcC5nZXQoZGF0dW0pO1xuICAgICAgfSk7XG5cbiAgICAvLyBoYW5kbGUgY29tbW9uU2hhcGVzXG4gICAgaWYgKHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbikge1xuICAgIC8vIHRoaXMuY29tbW9uU2hhcGVzLmZvckVhY2goKHNoYXBlLCBjdG9yKSA9PiB7XG4gICAgICAvLyBpZiAoc2hhcGUgIT09IG51bGwpIHsgcmV0dXJuOyB9XG4gICAgICBjb25zdCB7IGN0b3IsIGFjY2Vzc29ycyB9ID0gdGhpcy5fY29tbW9uU2hhcGVDb25maWd1cmF0aW9uO1xuICAgICAgY29uc3QgZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgICBjb25zdCBzaGFwZSA9IG5ldyBjdG9yKGdyb3VwKTtcblxuICAgICAgc2hhcGUuaW5zdGFsbChhY2Nlc3NvcnMpO1xuICAgICAgZ3JvdXAuYXBwZW5kQ2hpbGQoc2hhcGUucmVuZGVyKCkpO1xuICAgICAgZ3JvdXAuY2xhc3NMaXN0LmFkZCgnaXRlbScsICdjb21tb24nLCBzaGFwZS5nZXRDbGFzc05hbWUoKSk7XG5cbiAgICAgIHRoaXMuX2l0ZW1Db21tb25TaGFwZU1hcC5zZXQoZ3JvdXAsIHNoYXBlKTtcbiAgICAgIHRoaXMuZ3JvdXAuYXBwZW5kQ2hpbGQoZ3JvdXApO1xuICAgIC8vIH0pO1xuICAgIH1cblxuICAgIC8vIGVudGVyXG4gICAgdGhpcy5pdGVtcy5lbnRlcigpXG4gICAgICAuYXBwZW5kKChkYXR1bSwgaW5kZXgpID0+IHtcbiAgICAgICAgLy8gQE5PVEU6IGQzIGJpbmRzIGB0aGlzYCB0byB0aGUgY29udGFpbmVyIGdyb3VwXG4gICAgICAgIC8vIGNyZWF0ZSBhIGdyb3VwIGZvciB0aGUgaXRlbVxuICAgICAgICBjb25zdCBncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICAgICAgY29uc3QgeyBjdG9yLCBhY2Nlc3NvcnMgfSA9IHRoaXMuX3NoYXBlQ29uZmlndXJhdGlvbjtcbiAgICAgICAgY29uc3Qgc2hhcGUgPSBuZXcgY3RvcigpO1xuICAgICAgICAvLyBpbnN0YWxsIGFjY2Vzc29ycyBvbiB0aGUgbmV3bHkgY3JlYXRlZCBzaGFwZVxuICAgICAgICBzaGFwZS5pbnN0YWxsKGFjY2Vzc29ycyk7XG5cbiAgICAgICAgZ3JvdXAuYXBwZW5kQ2hpbGQoc2hhcGUucmVuZGVyKCkpO1xuICAgICAgICBncm91cC5jbGFzc0xpc3QuYWRkKCdpdGVtJywgc2hhcGUuZ2V0Q2xhc3NOYW1lKCkpO1xuXG4gICAgICAgIHRoaXMuX2l0ZW1TaGFwZU1hcC5zZXQoZ3JvdXAsIHNoYXBlKTtcblxuICAgICAgICByZXR1cm4gZ3JvdXA7XG4gICAgICB9KTtcblxuICAgIC8vIGV4aXRcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcblxuICAgIHRoaXMuaXRlbXMuZXhpdCgpXG4gICAgICAuZWFjaChmdW5jdGlvbihkYXR1bSwgaW5kZXgpIHtcbiAgICAgICAgY29uc3QgZ3JvdXAgPSB0aGlzO1xuICAgICAgICBjb25zdCBzaGFwZSA9IHRoYXQuX2l0ZW1TaGFwZXNNYXAuZ2V0KGdyb3VwKTtcblxuICAgICAgICBzaGFwZS5kZXN0cm95KCk7IC8vIGNsZWFuIHNoYXBlXG4gICAgICAgIF9kYXR1bUlkTWFwLmRlbGV0ZShkYXR1bSk7IC8vIGNsZWFuIHJlZmVyZW5jZSBpbiBgaWRgIG1hcFxuICAgICAgICB0aGF0Ll9pdGVtU2hhcGVNYXAuZGVsZXRlKGdyb3VwKTsgLy8gZGVzdHJveSByZWZlcmVuY2UgaW4gaXRlbSBzaGFwZSBtYXBcbiAgICAgIH0pXG4gICAgICAucmVtb3ZlKCk7XG5cbiAgICAvLyByZW5kZXIgaW5uZXJMYXllcnNcbiAgICB0aGlzLmlubmVyTGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiBsYXllci5kcmF3KCkpO1xuICB9XG5cbiAgLyoqXG4gICAqICB1cGRhdGVzIERPTSBjb250ZXh0IGFuZCBzaGFwZXNcbiAgICovXG4gIHVwZGF0ZSgpIHtcbiAgICB0aGlzLnVwZGF0ZUNvbnRleHQoKTtcbiAgICB0aGlzLnVwZGF0ZVNoYXBlcygpO1xuICB9XG5cbiAgLyoqXG4gICAqICB1cGRhdGVzIERPTSBjb250ZXh0IG9ubHlcbiAgICovXG4gIHVwZGF0ZUNvbnRleHQoKSB7XG4gICAgLy8gdXBkYXRlIGNvbnRleHRcbiAgICB0aGlzLmNvbnRleHQudXBkYXRlKCk7XG4gICAgLy8gdXBkYXRlIGlubmVyTGF5ZXJzXG4gICAgdGhpcy5pbm5lckxheWVycy5mb3JFYWNoKChsYXllcikgPT4gbGF5ZXIudXBkYXRlQ29udGV4dCgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgdXBkYXRlcyBET00gY29udGV4dCBhbmQgU2hhcGVzXG4gICAqL1xuICB1cGRhdGVTaGFwZXMoaXRlbSA9IG51bGwpIHtcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5jb250ZXh0O1xuICAgIGNvbnN0IGl0ZW1zID0gaXRlbSAhPT0gbnVsbCA/IGQzLnNlbGVjdEFsbChpdGVtKSA6IHRoaXMuaXRlbXM7XG5cbiAgICAvLyB1cGRhdGUgY29tbW9uIHNoYXBlc1xuICAgIHRoaXMuX2l0ZW1Db21tb25TaGFwZU1hcC5mb3JFYWNoKChzaGFwZSwgaXRlbSkgPT4ge1xuICAgICAgc2hhcGUudXBkYXRlKGNvbnRleHQsIGl0ZW0sIHRoaXMuZGF0YSk7XG4gICAgfSk7XG5cbiAgICAvLyB1cGRhdGUgZW50aXR5IG9yIGNvbGxlY3Rpb24gc2hhcGVzXG4gICAgaXRlbXMuZWFjaChmdW5jdGlvbihkYXR1bSwgaW5kZXgpIHtcbiAgICAgIC8vIHVwZGF0ZSBhbGwgc2hhcGVzIHJlbGF0ZWQgdG8gdGhlIGN1cnJlbnQgaXRlbVxuICAgICAgY29uc3QgZ3JvdXAgPSB0aGlzOyAvLyBjdXJyZW50IGBnLml0ZW1gXG4gICAgICBjb25zdCBzaGFwZSA9IHRoYXQuX2l0ZW1TaGFwZU1hcC5nZXQoZ3JvdXApO1xuICAgICAgc2hhcGUudXBkYXRlKGNvbnRleHQsIGdyb3VwLCBkYXR1bSwgaW5kZXgpO1xuICAgIH0pO1xuXG4gICAgLy8gdXBkYXRlIGlubmVyTGF5ZXJzXG4gICAgdGhpcy5pbm5lckxheWVycy5mb3JFYWNoKChsYXllcikgPT4gbGF5ZXIudXBkYXRlU2hhcGVzKCkpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTGF5ZXI7XG4iXX0=