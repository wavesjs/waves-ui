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

    this._shapeConfiguration = null; // { ctor, accessors, options }
    this._commonShapeConfiguration = null; // { ctor, accessors, options }

    this._itemShapeMap = new _core.Map(); // item group <DOMElement> => shape
    this._itemCommonShapeMap = new _core.Map(); // one entry max in this map

    // component configuration
    this._behavior = null;
    this._context = null;
    this._contextAttributes = null;
  }

  _createClass(Layer, {
    initialize: {
      value: function initialize(parentContext) {
        this._context = new Context(parentContext, {
          height: this.params.height,
          top: this.params.top,
          debug: this.params.debugContext
        });

        this._context.addClass("layer");

        // maintain a reference of the context state to be used in application
        this._contextAttributes = {
          start: this._context.start,
          duration: this._context.duration,
          offset: this._context.offset,
          stretchRatio: this._context.stretchRatio,
          yDomain: this._context.yDomain,
          opacity: this._context.opacity
        };
      }
    },
    data: {

      // --------------------------------------
      // Data
      // --------------------------------------

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
    setShape: {

      // --------------------------------------
      // Component Configuration
      // --------------------------------------

      // @TODO handle `options` parameter to configure the Shapes

      /**
       *  Register the shape and its accessors to use in order to render
       *  the entity or collection
       *  @param ctor <Function:BaseShape> the constructor of the shape to be used
       *  @param accessors <Object> accessors to use in order to map the data structure
       */

      value: function setShape(ctor) {
        var accessors = arguments[1] === undefined ? {} : arguments[1];
        var options = arguments[2] === undefined ? {} : arguments[2];

        this._shapeConfiguration = { ctor: ctor, accessors: accessors, options: options };
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

        this._commonShapeConfiguration = { ctor: ctor, accessors: accessors, options: options };
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
    contextAttributes: {

      // --------------------------------------
      // Context Attributes Accessors
      // --------------------------------------

      /**
       *  Use an external obj to use as the `contextAttribute` wrapper
       *  @param obj <Object>
       */

      set: function (obj) {
        this._contextAttributes = obj;
      },
      get: function () {
        return this._contextAttributes;
      }
    },
    setContextAttribute: {

      /**
       *  update a given attribute of the context
       *  @param name <String> the key of the attribute to update
       *  @param value <mixed>
       */

      value: function setContextAttribute(name, value) {
        this._contextAttributes[name] = value;
        this._context[name] = value;
      }
    },
    selectedItems: {

      // --------------------------------------
      // Behavior Accessors
      // --------------------------------------

      /**
       *  Behavior entry points
       *  @NOTE API -> change for an Array as first argument
       *  @TODO     -> handle if no behavior is registered
       */

      get: function () {
        return this._behavior ? this._behavior.selectedItems : [];
      }
    },
    select: {
      value: function select() {
        var _this = this;

        for (var _len = arguments.length, items = Array(_len), _key = 0; _key < _len; _key++) {
          items[_key] = arguments[_key];
        }

        if (!this._behavior) {
          return;
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

        if (!this._behavior) {
          return;
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

        if (!this._behavior) {
          return;
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
        this._behavior.edit(this._context, shape, datum, dx, dy, target);
      }
    },
    _getItemFromDOMElement: {

      // --------------------------------------
      // Helpers
      // --------------------------------------

      /**
       *  @return <DOMElement> the closest parent `item` group for a given DOM element
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

      /**
       *  moves an `item`'s group to the end of the layer (svg z-index...)
       *  @param `item` <DOMElement> the item to be moved
       */

      value: function _toFront(item) {
        this.group.appendChild(item);
      }
    },
    hasItem: {

      /**
       *  Define if an given DOM element belongs to one of the `items`
       *  @param `el` <DOMElement> the element to be tested
       *  @return <mixed>
       *    <DOMElement> item group containing the `el` if belongs to this layer
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
        var start = this._context.xScale(this._context.start);
        var duration = this._context.xScale(this._context.duration);
        var offset = this._context.xScale(this._context.offset);
        var top = this.params.top;
        // must be aware of the layer's context modifications
        // constrain in working view
        var x1 = Math.max(area.left, start);
        var x2 = Math.min(area.left + area.width, start + duration);
        // apply start and offset
        x1 -= start + offset;
        x2 -= start + offset;
        // @FIXME stretchRatio breaks selection
        // x2 *= this._context.stretchRatio;
        // be consistent with context y coordinates system
        var y1 = this.params.height - (area.top + area.height);
        var y2 = this.params.height - area.top;

        y1 += this.params.top;
        y2 += this.params.top;

        var itemShapeMap = this._itemShapeMap;
        var context = this._context;

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
        var el = this._context.render();
        // create a group to flip the context of the layer
        this.group = document.createElementNS(ns, "g");
        this.group.classList.add("items");
        this.group.setAttributeNS(null, "transform", invertMatrix);
        // append the group to the context
        this._context.offsetGroup.appendChild(this.group);
        var innerGroup = this._context.offsetGroup;

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
          var options = _commonShapeConfiguration.options;

          var group = document.createElementNS(ns, "g");
          var shape = new ctor(options);

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
          var options = _shapeConfiguration.options;

          var shape = new ctor(options);
          // install accessors on the newly created shape
          shape.install(accessors);

          group.appendChild(shape.render(_this._context));
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
        this._context.update();
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
        var context = this._context;
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
      }
    }
  });

  return Layer;
})();

module.exports = Layer;
// pass the context in debug mode
//# sourceMappingURL=data:application/json;base64,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LHdCQUFjOzs7WUFBYixJQUFJLGdDQUFHLElBQUk7O0FBQ3RCLFlBQU0sSUFBSSxHQUFHLElBQUksQ0FBQztBQUNsQixZQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQzlCLFlBQU0sS0FBSyxHQUFHLElBQUksS0FBSyxJQUFJLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDOzs7QUFHOUQsWUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUssRUFBRSxJQUFJLEVBQUs7QUFDaEQsZUFBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQUssSUFBSSxDQUFDLENBQUM7U0FDeEMsQ0FBQyxDQUFDOzs7QUFHSCxhQUFLLENBQUMsSUFBSSxDQUFDLFVBQVMsS0FBSyxFQUFFLEtBQUssRUFBRTs7QUFFaEMsY0FBTSxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ25CLGNBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzVDLGVBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDNUMsQ0FBQyxDQUFDO09BQ0o7Ozs7U0FwWUcsS0FBSzs7O0FBdVlYLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDIiwiZmlsZSI6ImVzNi9jb3JlL2xheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQ29udGV4dCA9IHJlcXVpcmUoJy4vY29udGV4dCcpO1xuY29uc3QgbnMgPSByZXF1aXJlKCcuL25hbWVzcGFjZScpO1xuY29uc3QgZDMgPSByZXF1aXJlKCdkMycpXG5cbi8vIGNyZWF0ZSBhIHByaXZhdGUgaXRlbSAtPiBpZCBtYXAgdG8gZm9yY2UgZDMgYmVpbmcgaW4gc3luYyB3aXRoIHRoZSBET01cbmxldCBfY291bnRlciA9IDA7XG5jb25zdCBfZGF0dW1JZE1hcCA9IG5ldyBNYXAoKTtcblxuY2xhc3MgTGF5ZXIge1xuICBjb25zdHJ1Y3RvcihkYXRhVHlwZSA9ICdjb2xsZWN0aW9uJywgZGF0YSA9IFtdLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLmRhdGFUeXBlID0gZGF0YVR5cGU7IC8vICdlbnRpdHknIHx8ICdjb2xsZWN0aW9uJztcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBoZWlnaHQ6IDEwMCwgLy8gc2hvdWxkIGluaGVyaXQgZnJvbSBwYXJlbnRcbiAgICAgIHRvcDogMCxcbiAgICAgIGRlYnVnQ29udGV4dDogZmFsc2UsIC8vIHBhc3MgdGhlIGNvbnRleHQgaW4gZGVidWcgbW9kZVxuICAgIH1cblxuICAgIHRoaXMucGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuXG4gICAgLy8gdGhpcy5jb250YWluZXIgPSBudWxsOyAvLyBvZmZzZXQgZ3JvdXAgb2YgdGhlIHBhcmVudCBjb250ZXh0XG4gICAgdGhpcy5ncm91cCA9IG51bGw7IC8vIGdyb3VwIGNyZWF0ZWQgYnkgdGhlIGxheWVyIGluc2lkZSB0aGUgY29udGV4dFxuICAgIHRoaXMuaXRlbXMgPSBudWxsOyAvLyBkMyBjb2xsZWN0aW9uIG9mIHRoZSBsYXllciBpdGVtc1xuXG4gICAgdGhpcy5fc2hhcGVDb25maWd1cmF0aW9uID0gbnVsbDsgLy8geyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfVxuICAgIHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbiA9IG51bGw7IC8vIHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH1cblxuICAgIHRoaXMuX2l0ZW1TaGFwZU1hcCA9IG5ldyBNYXAoKTsgLy8gaXRlbSBncm91cCA8RE9NRWxlbWVudD4gPT4gc2hhcGVcbiAgICB0aGlzLl9pdGVtQ29tbW9uU2hhcGVNYXAgPSBuZXcgTWFwKCk7IC8vIG9uZSBlbnRyeSBtYXggaW4gdGhpcyBtYXBcblxuICAgIC8vIGNvbXBvbmVudCBjb25maWd1cmF0aW9uXG4gICAgdGhpcy5fYmVoYXZpb3IgPSBudWxsO1xuICAgIHRoaXMuX2NvbnRleHQgPSBudWxsO1xuICAgIHRoaXMuX2NvbnRleHRBdHRyaWJ1dGVzID0gbnVsbDtcbiAgfVxuXG4gIGluaXRpYWxpemUocGFyZW50Q29udGV4dCkge1xuICAgIHRoaXMuX2NvbnRleHQgPSBuZXcgQ29udGV4dChwYXJlbnRDb250ZXh0LCB7XG4gICAgICBoZWlnaHQ6IHRoaXMucGFyYW1zLmhlaWdodCxcbiAgICAgIHRvcDogdGhpcy5wYXJhbXMudG9wLFxuICAgICAgZGVidWc6IHRoaXMucGFyYW1zLmRlYnVnQ29udGV4dFxuICAgIH0pO1xuXG4gICAgdGhpcy5fY29udGV4dC5hZGRDbGFzcygnbGF5ZXInKTtcblxuICAgIC8vIG1haW50YWluIGEgcmVmZXJlbmNlIG9mIHRoZSBjb250ZXh0IHN0YXRlIHRvIGJlIHVzZWQgaW4gYXBwbGljYXRpb25cbiAgICB0aGlzLl9jb250ZXh0QXR0cmlidXRlcyA9IHtcbiAgICAgIHN0YXJ0OiB0aGlzLl9jb250ZXh0LnN0YXJ0LFxuICAgICAgZHVyYXRpb246IHRoaXMuX2NvbnRleHQuZHVyYXRpb24sXG4gICAgICBvZmZzZXQ6IHRoaXMuX2NvbnRleHQub2Zmc2V0LFxuICAgICAgc3RyZXRjaFJhdGlvOiB0aGlzLl9jb250ZXh0LnN0cmV0Y2hSYXRpbyxcbiAgICAgIHlEb21haW46IHRoaXMuX2NvbnRleHQueURvbWFpbixcbiAgICAgIG9wYWNpdHk6IHRoaXMuX2NvbnRleHQub3BhY2l0eVxuICAgIH07XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBEYXRhXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgZ2V0IGRhdGEoKSB7IHJldHVybiB0aGlzLl9kYXRhOyB9XG5cbiAgc2V0IGRhdGEoZGF0YSkge1xuICAgIHN3aXRjaCAodGhpcy5kYXRhVHlwZSkge1xuICAgICAgY2FzZSAnZW50aXR5JzpcbiAgICAgICAgaWYgKHRoaXMuX2RhdGEpIHsgLy8gaWYgZGF0YSBhbHJlYWR5IGV4aXN0cywgcmV1c2UgdGhlIHJlZmVyZW5jZVxuICAgICAgICAgIHRoaXMuX2RhdGFbMF0gPSBkYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2RhdGEgPSBbZGF0YV07XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjb2xsZWN0aW9uJzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBDb21wb25lbnQgQ29uZmlndXJhdGlvblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEBUT0RPIGhhbmRsZSBgb3B0aW9uc2AgcGFyYW1ldGVyIHRvIGNvbmZpZ3VyZSB0aGUgU2hhcGVzXG5cbiAgLyoqXG4gICAqICBSZWdpc3RlciB0aGUgc2hhcGUgYW5kIGl0cyBhY2Nlc3NvcnMgdG8gdXNlIGluIG9yZGVyIHRvIHJlbmRlclxuICAgKiAgdGhlIGVudGl0eSBvciBjb2xsZWN0aW9uXG4gICAqICBAcGFyYW0gY3RvciA8RnVuY3Rpb246QmFzZVNoYXBlPiB0aGUgY29uc3RydWN0b3Igb2YgdGhlIHNoYXBlIHRvIGJlIHVzZWRcbiAgICogIEBwYXJhbSBhY2Nlc3NvcnMgPE9iamVjdD4gYWNjZXNzb3JzIHRvIHVzZSBpbiBvcmRlciB0byBtYXAgdGhlIGRhdGEgc3RydWN0dXJlXG4gICAqL1xuICBzZXRTaGFwZShjdG9yLCBhY2Nlc3NvcnMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5fc2hhcGVDb25maWd1cmF0aW9uID0geyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgUmVnaXN0ZXIgdGhlIHNoYXBlIHRvIHVzZSB3aXRoIHRoZSBlbnRpcmUgY29sbGVjdGlvblxuICAgKiAgZXhhbXBsZTogdGhlIGxpbmUgaW4gYSBiZWFrcG9pbnQgZnVuY3Rpb25cbiAgICogIEBwYXJhbSBjdG9yIDxCYXNlU2hhcGU+IHRoZSBjb25zdHJ1Y3RvciBvZiB0aGUgc2hhcGUgdG8gdXNlIHRvIHJlbmRlciBkYXRhXG4gICAqICBAcGFyYW0gYWNjZXNzb3JzIDxPYmplY3Q+IGFjY2Vzc29ycyB0byB1c2UgaW4gb3JkZXIgdG8gbWFwIHRoZSBkYXRhIHN0cnVjdHVyZVxuICAgKi9cbiAgc2V0Q29tbW9uU2hhcGUoY3RvciwgYWNjZXNzb3JzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbiA9IHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH07XG4gIH1cblxuICAvKipcbiAgICogIFJlZ2lzdGVyIHRoZSBiZWhhdmlvciB0byB1c2Ugd2hlbiBpbnRlcmFjdGluZyB3aXRoIHRoZSBzaGFwZVxuICAgKiAgQHBhcmFtIGJlaGF2aW9yIDxCYXNlQmVoYXZpb3I+XG4gICAqL1xuICBzZXRCZWhhdmlvcihiZWhhdmlvcikge1xuICAgIGJlaGF2aW9yLmluaXRpYWxpemUodGhpcyk7XG4gICAgdGhpcy5fYmVoYXZpb3IgPSBiZWhhdmlvcjtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENvbnRleHQgQXR0cmlidXRlcyBBY2Nlc3NvcnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogIFVzZSBhbiBleHRlcm5hbCBvYmogdG8gdXNlIGFzIHRoZSBgY29udGV4dEF0dHJpYnV0ZWAgd3JhcHBlclxuICAgKiAgQHBhcmFtIG9iaiA8T2JqZWN0PlxuICAgKi9cbiAgc2V0IGNvbnRleHRBdHRyaWJ1dGVzKG9iaikgeyB0aGlzLl9jb250ZXh0QXR0cmlidXRlcyA9IG9iajsgfVxuICBnZXQgY29udGV4dEF0dHJpYnV0ZXMoKSB7IHJldHVybiB0aGlzLl9jb250ZXh0QXR0cmlidXRlczsgfVxuXG4gIC8qKlxuICAgKiAgdXBkYXRlIGEgZ2l2ZW4gYXR0cmlidXRlIG9mIHRoZSBjb250ZXh0XG4gICAqICBAcGFyYW0gbmFtZSA8U3RyaW5nPiB0aGUga2V5IG9mIHRoZSBhdHRyaWJ1dGUgdG8gdXBkYXRlXG4gICAqICBAcGFyYW0gdmFsdWUgPG1peGVkPlxuICAgKi9cbiAgc2V0Q29udGV4dEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSkge1xuICAgIHRoaXMuX2NvbnRleHRBdHRyaWJ1dGVzW25hbWVdID0gdmFsdWU7XG4gICAgdGhpcy5fY29udGV4dFtuYW1lXSA9IHZhbHVlO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQmVoYXZpb3IgQWNjZXNzb3JzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqICBCZWhhdmlvciBlbnRyeSBwb2ludHNcbiAgICogIEBOT1RFIEFQSSAtPiBjaGFuZ2UgZm9yIGFuIEFycmF5IGFzIGZpcnN0IGFyZ3VtZW50XG4gICAqICBAVE9ETyAgICAgLT4gaGFuZGxlIGlmIG5vIGJlaGF2aW9yIGlzIHJlZ2lzdGVyZWRcbiAgICovXG4gIGdldCBzZWxlY3RlZEl0ZW1zKCkge1xuICAgIHJldHVybiB0aGlzLl9iZWhhdmlvciA/IHRoaXMuX2JlaGF2aW9yLnNlbGVjdGVkSXRlbXMgOiBbXTtcbiAgfVxuXG4gIHNlbGVjdCguLi5pdGVtcykge1xuICAgIGlmICghdGhpcy5fYmVoYXZpb3IpIHsgcmV0dXJuOyB9XG5cbiAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBjb25zdCBkYXR1bSA9IGQzLnNlbGVjdChpdGVtKS5kYXR1bSgpO1xuICAgICAgdGhpcy5fYmVoYXZpb3Iuc2VsZWN0KGl0ZW0sIGRhdHVtKTtcbiAgICAgIHRoaXMuX3RvRnJvbnQoaXRlbSk7XG4gICAgfSk7XG4gIH1cblxuICB1bnNlbGVjdCguLi5pdGVtcykge1xuICAgIGlmICghdGhpcy5fYmVoYXZpb3IpIHsgcmV0dXJuOyB9XG5cbiAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBjb25zdCBkYXR1bSA9IGQzLnNlbGVjdChpdGVtKS5kYXR1bSgpO1xuICAgICAgdGhpcy5fYmVoYXZpb3IudW5zZWxlY3QoaXRlbSwgZGF0dW0pO1xuICAgIH0pO1xuICB9XG4gIC8vIEBUT0RPIHRlc3RcbiAgc2VsZWN0QWxsKCkge1xuICAgIHRoaXMuaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4gdGhpcy5zZWxlY3QoaXRlbSkpO1xuICB9XG5cbiAgdW5zZWxlY3RBbGwoKSB7XG4gICAgdGhpcy5zZWxlY3RlZEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHRoaXMudW5zZWxlY3QoaXRlbSkpO1xuICB9XG5cbiAgdG9nZ2xlU2VsZWN0aW9uKC4uLml0ZW1zKSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcikgeyByZXR1cm47IH1cblxuICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGNvbnN0IGRhdHVtID0gZDMuc2VsZWN0KGl0ZW0pLmRhdHVtKCk7XG4gICAgICB0aGlzLl9iZWhhdmlvci50b2dnbGVTZWxlY3Rpb24oaXRlbSwgZGF0dW0pO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gQFRPRE8gY2hhbmdlIHNpZ25hdHVyZSBlZGl0KGl0ZW1zID0gWy4uLl0sIGR4LCBkeSwgdGFyZ2V0KTtcbiAgLy8gLT4gYmUgY29uc2lzdGVudCBmb3IgYWxsIGJlaGF2aW9ycyBBUElcbiAgZWRpdChpdGVtLCBkeCwgZHksIHRhcmdldCkge1xuICAgIGNvbnN0IGRhdHVtID0gZDMuc2VsZWN0KGl0ZW0pLmRhdHVtKCk7XG4gICAgY29uc3Qgc2hhcGUgPSB0aGlzLl9pdGVtU2hhcGVNYXAuZ2V0KGl0ZW0pO1xuICAgIHRoaXMuX2JlaGF2aW9yLmVkaXQodGhpcy5fY29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBIZWxwZXJzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqICBAcmV0dXJuIDxET01FbGVtZW50PiB0aGUgY2xvc2VzdCBwYXJlbnQgYGl0ZW1gIGdyb3VwIGZvciBhIGdpdmVuIERPTSBlbGVtZW50XG4gICAqL1xuICBfZ2V0SXRlbUZyb21ET01FbGVtZW50KGVsKSB7XG4gICAgZG8ge1xuICAgICAgaWYgKGVsLm5vZGVOYW1lID09PSAnZycgJiYgZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdpdGVtJykpIHtcbiAgICAgICAgcmV0dXJuIGVsO1xuICAgICAgfVxuICAgIH0gd2hpbGUgKGVsID0gZWwucGFyZW50Tm9kZSk7XG4gIH1cblxuICAvKipcbiAgICogIG1vdmVzIGFuIGBpdGVtYCdzIGdyb3VwIHRvIHRoZSBlbmQgb2YgdGhlIGxheWVyIChzdmcgei1pbmRleC4uLilcbiAgICogIEBwYXJhbSBgaXRlbWAgPERPTUVsZW1lbnQ+IHRoZSBpdGVtIHRvIGJlIG1vdmVkXG4gICAqL1xuICBfdG9Gcm9udChpdGVtKSB7XG4gICAgdGhpcy5ncm91cC5hcHBlbmRDaGlsZChpdGVtKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgRGVmaW5lIGlmIGFuIGdpdmVuIERPTSBlbGVtZW50IGJlbG9uZ3MgdG8gb25lIG9mIHRoZSBgaXRlbXNgXG4gICAqICBAcGFyYW0gYGVsYCA8RE9NRWxlbWVudD4gdGhlIGVsZW1lbnQgdG8gYmUgdGVzdGVkXG4gICAqICBAcmV0dXJuIDxtaXhlZD5cbiAgICogICAgPERPTUVsZW1lbnQ+IGl0ZW0gZ3JvdXAgY29udGFpbmluZyB0aGUgYGVsYCBpZiBiZWxvbmdzIHRvIHRoaXMgbGF5ZXJcbiAgICogICAgbnVsbCBvdGhlcndpc2VcbiAgICovXG4gIGhhc0l0ZW0oZWwpIHtcbiAgICBjb25zdCBpdGVtID0gdGhpcy5fZ2V0SXRlbUZyb21ET01FbGVtZW50KGVsKTtcbiAgICByZXR1cm4gKHRoaXMuaXRlbXNbMF0uaW5kZXhPZihpdGVtKSAhPT0gLTEpID8gaXRlbSA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogIEBwYXJhbSBhcmVhIDxPYmplY3Q+IGFyZWEgaW4gd2hpY2ggdG8gZmluZCB0aGUgZWxlbWVudHNcbiAgICogIEByZXR1cm4gPEFycmF5PiBsaXN0IG9mIHRoZSBET00gZWxlbWVudHMgaW4gdGhlIGdpdmVuIGFyZWFcbiAgICovXG4gIGdldEl0ZW1zSW5BcmVhKGFyZWEpIHtcbiAgICAvLyB3b3JrIGluIHBpeGVsIGRvbWFpblxuICAgIGNvbnN0IHN0YXJ0ICAgID0gdGhpcy5fY29udGV4dC54U2NhbGUodGhpcy5fY29udGV4dC5zdGFydCk7XG4gICAgY29uc3QgZHVyYXRpb24gPSB0aGlzLl9jb250ZXh0LnhTY2FsZSh0aGlzLl9jb250ZXh0LmR1cmF0aW9uKTtcbiAgICBjb25zdCBvZmZzZXQgICA9IHRoaXMuX2NvbnRleHQueFNjYWxlKHRoaXMuX2NvbnRleHQub2Zmc2V0KTtcbiAgICBjb25zdCB0b3AgICAgICA9IHRoaXMucGFyYW1zLnRvcDtcbiAgICAvLyBtdXN0IGJlIGF3YXJlIG9mIHRoZSBsYXllcidzIGNvbnRleHQgbW9kaWZpY2F0aW9uc1xuICAgIC8vIGNvbnN0cmFpbiBpbiB3b3JraW5nIHZpZXdcbiAgICBsZXQgeDEgPSBNYXRoLm1heChhcmVhLmxlZnQsIHN0YXJ0KTtcbiAgICBsZXQgeDIgPSBNYXRoLm1pbihhcmVhLmxlZnQgKyBhcmVhLndpZHRoLCBzdGFydCArIGR1cmF0aW9uKTtcbiAgICAvLyBhcHBseSBzdGFydCBhbmQgb2Zmc2V0XG4gICAgeDEgLT0gKHN0YXJ0ICsgb2Zmc2V0KTtcbiAgICB4MiAtPSAoc3RhcnQgKyBvZmZzZXQpO1xuICAgIC8vIEBGSVhNRSBzdHJldGNoUmF0aW8gYnJlYWtzIHNlbGVjdGlvblxuICAgIC8vIHgyICo9IHRoaXMuX2NvbnRleHQuc3RyZXRjaFJhdGlvO1xuICAgIC8vIGJlIGNvbnNpc3RlbnQgd2l0aCBjb250ZXh0IHkgY29vcmRpbmF0ZXMgc3lzdGVtXG4gICAgbGV0IHkxID0gdGhpcy5wYXJhbXMuaGVpZ2h0IC0gKGFyZWEudG9wICsgYXJlYS5oZWlnaHQpO1xuICAgIGxldCB5MiA9IHRoaXMucGFyYW1zLmhlaWdodCAtIGFyZWEudG9wO1xuXG4gICAgeTEgKz0gdGhpcy5wYXJhbXMudG9wO1xuICAgIHkyICs9IHRoaXMucGFyYW1zLnRvcDtcblxuICAgIGNvbnN0IGl0ZW1TaGFwZU1hcCA9IHRoaXMuX2l0ZW1TaGFwZU1hcDtcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5fY29udGV4dDtcblxuICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5pdGVtcy5maWx0ZXIoZnVuY3Rpb24oZGF0dW0sIGluZGV4KSB7XG4gICAgICBjb25zdCBncm91cCA9IHRoaXM7XG4gICAgICBjb25zdCBzaGFwZSA9IGl0ZW1TaGFwZU1hcC5nZXQoZ3JvdXApO1xuICAgICAgcmV0dXJuIHNoYXBlLmluQXJlYShjb250ZXh0LCBkYXR1bSwgeDEsIHkxLCB4MiwgeTIpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGl0ZW1zWzBdLnNsaWNlKDApO1xuICB9XG5cbiAgLy8gaGVscGVyIHRvIGFkZCBzb21lIGNsYXNzIG9yIHN0dWZmIG9uIGl0ZW1zXG4gIGVhY2goY2FsbGJhY2sgPSBudWxsKSB7fVxuXG4gIC8qKlxuICAgKiAgY3JlYXRlcyB0aGUgbGF5ZXIgZ3JvdXAgd2l0aCBhIHRyYW5zZm9ybWF0aW9uIG1hdHJpeCB0byBmbGlwIHRoZSBjb29yZGluYXRlIHN5c3RlbS5cbiAgICogIEBOT1RFOiBwdXQgdGhlIGNvbnRleHQgaW5zaWRlIHRoZSBsYXllciBncm91cCA/IHJldmVyc2UgdGhlIERPTSBvcmRlclxuICAgKi9cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcbiAgICBjb25zdCB0b3AgICAgPSB0aGlzLnBhcmFtcy50b3A7XG4gICAgLy8gbWF0cml4IHRvIGludmVydCB0aGUgY29vcmRpbmF0ZSBzeXN0ZW1cbiAgICBjb25zdCBpbnZlcnRNYXRyaXggPSBgbWF0cml4KDEsIDAsIDAsIC0xLCAwLCAke2hlaWdodH0pYDtcbiAgICAvLyBjcmVhdGUgdGhlIERPTSBvZiB0aGUgY29udGV4dFxuICAgIGNvbnN0IGVsID0gdGhpcy5fY29udGV4dC5yZW5kZXIoKTtcbiAgICAvLyBjcmVhdGUgYSBncm91cCB0byBmbGlwIHRoZSBjb250ZXh0IG9mIHRoZSBsYXllclxuICAgIHRoaXMuZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgdGhpcy5ncm91cC5jbGFzc0xpc3QuYWRkKCdpdGVtcycpO1xuICAgIHRoaXMuZ3JvdXAuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGludmVydE1hdHJpeCk7XG4gICAgLy8gYXBwZW5kIHRoZSBncm91cCB0byB0aGUgY29udGV4dFxuICAgIHRoaXMuX2NvbnRleHQub2Zmc2V0R3JvdXAuYXBwZW5kQ2hpbGQodGhpcy5ncm91cCk7XG4gICAgY29uc3QgaW5uZXJHcm91cCA9IHRoaXMuX2NvbnRleHQub2Zmc2V0R3JvdXA7XG5cbiAgICByZXR1cm4gZWw7XG4gIH1cblxuICAvKipcbiAgICogY3JlYXRlIHRoZSBET00gYWNjb3JkaW5nIHRvIGdpdmVuIGRhdGEgYW5kIHNoYXBlc1xuICAgKi9cbiAgZHJhdygpIHtcbiAgICAvLyBATk9URTogY3JlYXRlIGEgdW5pcXVlIGlkIHRvIGZvcmNlIGQzIHRvIGtlZXAgZGF0YSBpbiBzeW5jIHdpdGggdGhlIERPTVxuICAgIC8vIEBUT0RPOiByZWFkIGFnYWluIGh0dHA6Ly9ib3N0Lm9ja3Mub3JnL21pa2Uvc2VsZWN0aW9uL1xuICAgIHRoaXMuZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGRhdHVtKSB7XG4gICAgICBpZiAoX2RhdHVtSWRNYXAuaGFzKGRhdHVtKSkgeyByZXR1cm47IH1cbiAgICAgIF9kYXR1bUlkTWFwLnNldChkYXR1bSwgX2NvdW50ZXIrKyk7XG4gICAgfSk7XG5cbiAgICAvLyBzZWxlY3QgaXRlbXNcbiAgICB0aGlzLml0ZW1zID0gZDMuc2VsZWN0KHRoaXMuZ3JvdXApXG4gICAgICAuc2VsZWN0QWxsKCcuaXRlbScpXG4gICAgICAuZmlsdGVyKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKCdjb21tb24nKVxuICAgICAgfSlcbiAgICAgIC5kYXRhKHRoaXMuZGF0YSwgZnVuY3Rpb24oZGF0dW0pIHtcbiAgICAgICAgcmV0dXJuIF9kYXR1bUlkTWFwLmdldChkYXR1bSk7XG4gICAgICB9KTtcblxuICAgIC8vIGhhbmRsZSBjb21tb25TaGFwZXNcbiAgICBpZiAodGhpcy5fY29tbW9uU2hhcGVDb25maWd1cmF0aW9uICE9PSBudWxsKSB7XG4gICAgICBjb25zdCB7IGN0b3IsIGFjY2Vzc29ycywgb3B0aW9ucyB9ID0gdGhpcy5fY29tbW9uU2hhcGVDb25maWd1cmF0aW9uO1xuICAgICAgY29uc3QgZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgICBjb25zdCBzaGFwZSA9IG5ldyBjdG9yKG9wdGlvbnMpO1xuXG4gICAgICBzaGFwZS5pbnN0YWxsKGFjY2Vzc29ycyk7XG4gICAgICBncm91cC5hcHBlbmRDaGlsZChzaGFwZS5yZW5kZXIoKSk7XG4gICAgICBncm91cC5jbGFzc0xpc3QuYWRkKCdpdGVtJywgJ2NvbW1vbicsIHNoYXBlLmdldENsYXNzTmFtZSgpKTtcblxuICAgICAgdGhpcy5faXRlbUNvbW1vblNoYXBlTWFwLnNldChncm91cCwgc2hhcGUpO1xuICAgICAgdGhpcy5ncm91cC5hcHBlbmRDaGlsZChncm91cCk7XG4gICAgfVxuXG4gICAgLy8gZW50ZXJcbiAgICB0aGlzLml0ZW1zLmVudGVyKClcbiAgICAgIC5hcHBlbmQoKGRhdHVtLCBpbmRleCkgPT4ge1xuICAgICAgICAvLyBATk9URTogZDMgYmluZHMgYHRoaXNgIHRvIHRoZSBjb250YWluZXIgZ3JvdXBcbiAgICAgICAgLy8gY3JlYXRlIGEgZ3JvdXAgZm9yIHRoZSBpdGVtXG4gICAgICAgIGNvbnN0IGdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgICAgICBjb25zdCB7IGN0b3IsIGFjY2Vzc29ycywgb3B0aW9ucyB9ID0gdGhpcy5fc2hhcGVDb25maWd1cmF0aW9uO1xuICAgICAgICBjb25zdCBzaGFwZSA9IG5ldyBjdG9yKG9wdGlvbnMpO1xuICAgICAgICAvLyBpbnN0YWxsIGFjY2Vzc29ycyBvbiB0aGUgbmV3bHkgY3JlYXRlZCBzaGFwZVxuICAgICAgICBzaGFwZS5pbnN0YWxsKGFjY2Vzc29ycyk7XG5cbiAgICAgICAgZ3JvdXAuYXBwZW5kQ2hpbGQoc2hhcGUucmVuZGVyKHRoaXMuX2NvbnRleHQpKTtcbiAgICAgICAgZ3JvdXAuY2xhc3NMaXN0LmFkZCgnaXRlbScsIHNoYXBlLmdldENsYXNzTmFtZSgpKTtcblxuICAgICAgICB0aGlzLl9pdGVtU2hhcGVNYXAuc2V0KGdyb3VwLCBzaGFwZSk7XG5cbiAgICAgICAgcmV0dXJuIGdyb3VwO1xuICAgICAgfSk7XG5cbiAgICAvLyBleGl0XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG5cbiAgICB0aGlzLml0ZW1zLmV4aXQoKVxuICAgICAgLmVhY2goZnVuY3Rpb24oZGF0dW0sIGluZGV4KSB7XG4gICAgICAgIGNvbnN0IGdyb3VwID0gdGhpcztcbiAgICAgICAgY29uc3Qgc2hhcGUgPSB0aGF0Ll9pdGVtU2hhcGVzTWFwLmdldChncm91cCk7XG5cbiAgICAgICAgc2hhcGUuZGVzdHJveSgpOyAvLyBjbGVhbiBzaGFwZVxuICAgICAgICBfZGF0dW1JZE1hcC5kZWxldGUoZGF0dW0pOyAvLyBjbGVhbiByZWZlcmVuY2UgaW4gYGlkYCBtYXBcbiAgICAgICAgdGhhdC5faXRlbVNoYXBlTWFwLmRlbGV0ZShncm91cCk7IC8vIGRlc3Ryb3kgcmVmZXJlbmNlIGluIGl0ZW0gc2hhcGUgbWFwXG4gICAgICB9KVxuICAgICAgLnJlbW92ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqICB1cGRhdGVzIERPTSBjb250ZXh0IGFuZCBzaGFwZXNcbiAgICovXG4gIHVwZGF0ZSgpIHtcbiAgICB0aGlzLnVwZGF0ZUNvbnRleHQoKTtcbiAgICB0aGlzLnVwZGF0ZVNoYXBlcygpO1xuICB9XG5cbiAgLyoqXG4gICAqICB1cGRhdGVzIERPTSBjb250ZXh0IG9ubHlcbiAgICovXG4gIHVwZGF0ZUNvbnRleHQoKSB7XG4gICAgLy8gdXBkYXRlIGNvbnRleHRcbiAgICB0aGlzLl9jb250ZXh0LnVwZGF0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqICB1cGRhdGVzIERPTSBjb250ZXh0IGFuZCBTaGFwZXNcbiAgICogIEBwYXJhbVxuICAgKi9cbiAgdXBkYXRlU2hhcGVzKGl0ZW0gPSBudWxsKSB7XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgY29uc3QgY29udGV4dCA9IHRoaXMuX2NvbnRleHQ7XG4gICAgY29uc3QgaXRlbXMgPSBpdGVtICE9PSBudWxsID8gZDMuc2VsZWN0QWxsKGl0ZW0pIDogdGhpcy5pdGVtcztcblxuICAgIC8vIHVwZGF0ZSBjb21tb24gc2hhcGVzXG4gICAgdGhpcy5faXRlbUNvbW1vblNoYXBlTWFwLmZvckVhY2goKHNoYXBlLCBpdGVtKSA9PiB7XG4gICAgICBzaGFwZS51cGRhdGUoY29udGV4dCwgaXRlbSwgdGhpcy5kYXRhKTtcbiAgICB9KTtcblxuICAgIC8vIHVwZGF0ZSBlbnRpdHkgb3IgY29sbGVjdGlvbiBzaGFwZXNcbiAgICBpdGVtcy5lYWNoKGZ1bmN0aW9uKGRhdHVtLCBpbmRleCkge1xuICAgICAgLy8gdXBkYXRlIGFsbCBzaGFwZXMgcmVsYXRlZCB0byB0aGUgY3VycmVudCBpdGVtXG4gICAgICBjb25zdCBncm91cCA9IHRoaXM7IC8vIGN1cnJlbnQgYGcuaXRlbWBcbiAgICAgIGNvbnN0IHNoYXBlID0gdGhhdC5faXRlbVNoYXBlTWFwLmdldChncm91cCk7XG4gICAgICBzaGFwZS51cGRhdGUoY29udGV4dCwgZ3JvdXAsIGRhdHVtLCBpbmRleCk7XG4gICAgfSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBMYXllcjtcbiJdfQ==