"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _slicedToArray = require("babel-runtime/helpers/sliced-to-array")["default"];

var _core = require("babel-runtime/core-js")["default"];

var d3 = require("d3");
var ns = require("./namespace");

var Context = (function () {
  function Context() {
    var parent = arguments[0] === undefined ? null : arguments[0];
    var options = arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Context);

    this._parent = parent;
    this.params = _core.Object.assign({}, options);

    this._xScale = null; // inherits from parent context
    this._originalXScale = null;
    this._yScale = d3.scale.linear().domain([0, 1]).range([0, this.params.height]);

    // @NOTE maybe the context could maintain these values in pixel domain
    this.start = null;
    this.duration = null;
    this.offset = null;
    this._stretchRatio = 1;
    this._yDomain = [0, 1];
    this._opacity = 1;

    // DOM elements
    this.classList = ["context"];
    this.group = null; // main group
    this.boundingBox = null; // svg elements
    this.offsetGroup = null; // group to offset content

    // bind render method
    this._createDOM(); // create DOM in memory
    this.render = this.render.bind(this);

    // debug mode - draw a rect to visualize the context
    this.debug = false;
  }

  _createClass(Context, {
    xScale: {

      // getter for the xScale
      // returns the closest available xScale in the tree

      get: function () {
        var xScale = undefined;

        if (this._parent && !this._xScale) {
          xScale = this._parent.xScale;
        } else {
          xScale = this._xScale;
        }

        return xScale;
        // return function(val) {
        //   let ret = xScale(val);
        //   return Math.max(ret, 0);
        // }
        // @NOTE doesn't work cannot access invert if needed
        // create an invert accessor ?
      },
      set: function (xScale) {
        this._xScale = xScale;
      }
    },
    originalXScale: {

      // read only

      get: function () {
        var scale = undefined;

        // lazy bind originalXScale on top of the tree
        if (!this._parent && !this._originalXScale) {
          this._originalXScale = this._xScale;
        }

        // returns the closest available xScale in the tree
        if (this._parent) {
          scale = this._parent.originalXScale;
        } else {
          scale = this._originalXScale;
        }

        return scale;
      }
    },
    yScale: {

      //

      get: function () {
        return this._yScale;
      },

      // @NOTE: maybe remove this later
      set: function (scale) {
        this._yScale = scale;
        this._yScale.domain(this._yDomain);
      }
    },
    yDomain: {

      // allow to dynamically modify the yDomain of the context

      get: function () {
        return this._yDomain;
      },
      set: function (domain) {
        this._yDomain = domain;
        this.yScale.domain(domain);
      }
    },
    stretchRatio: {

      // stretch time ability

      get: function () {
        return this._stretchRatio;
      },
      set: function (ratio) {
        // don't remove xScale on top of the graph
        if (ratio === 1 && this._parent) {
          this._xScale = null;
        } else {
          var xScale = this.originalXScale.copy();

          var _xScale$domain = xScale.domain();

          var _xScale$domain2 = _slicedToArray(_xScale$domain, 2);

          var min = _xScale$domain2[0];
          var max = _xScale$domain2[1];

          var diff = (max - min) / ratio;
          xScale.domain([min, min + diff]);

          this._xScale = xScale;
        }

        this._stretchRatio = ratio;
      }
    },
    opacity: {
      get: function () {
        return this._opacity;
      },
      set: function (value) {
        this._opacity = Math.max(Math.min(value, 1), 0);
      }
    },
    addClass: {
      value: function addClass() {
        for (var _len = arguments.length, classList = Array(_len), _key = 0; _key < _len; _key++) {
          classList[_key] = arguments[_key];
        }

        this.classList = this.classList.concat(classList);
        return this;
      }
    },
    _createDOM: {
      value: function _createDOM() {
        var _this = this;

        // wrapper group for `start` translation
        this.group = document.createElementNS(ns, "g");
        this.classList.forEach(function (classname) {
          _this.group.classList.add(classname);
        });

        // append a svg to clip the context
        this.boundingBox = document.createElementNS(ns, "svg");

        // group to offset the whole context
        this.offsetGroup = document.createElementNS(ns, "g");
        this.offsetGroup.classList.add("offset");

        // draw a rect in context background to debug it's size
        if (this.params.debug) {
          this.debugRect = document.createElementNS(ns, "rect");
          this.boundingBox.appendChild(this.debugRect);
          this.debugRect.style.fill = "#ababab";
          this.debugRect.style.fillOpacity = 0.1;
        }

        this.group.appendChild(this.boundingBox);
        this.boundingBox.appendChild(this.offsetGroup);
      }
    },
    render: {
      // should be `update

      value: function render() {
        return this.group;
      }
    },
    update: {
      value: function update() {
        var start = this.originalXScale(this.start);
        var duration = this.xScale(this.duration);
        var offset = this.xScale(this.offset);
        var top = this.params.top;
        var height = this.params.height;
        // matrix to invert the coordinate system
        var translateMatrix = "matrix(1, 0, 0, 1, " + start + ", " + top + ")";

        this.group.setAttributeNS(null, "transform", translateMatrix);
        this.group.style.opacity = this._opacity;
        this.boundingBox.setAttributeNS(null, "width", duration);
        this.offsetGroup.setAttributeNS(null, "transform", "translate(" + offset + ", 0)");

        if (this.params.debug) {
          this.debugRect.setAttributeNS(null, "width", duration);
          this.debugRect.setAttributeNS(null, "height", height);
        }
      }

      // should have a `draw` method

    }
  });

  return Context;
})();

module.exports = Context;
//# sourceMappingURL=data:application/json;base64,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Y0FBYyxDQUFDLElBQUksRUFBRSxXQUFXLGlCQUFlLE1BQU0sVUFBTyxDQUFDOztBQUU5RSxZQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFO0FBQ3JCLGNBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDdkQsY0FBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztTQUN2RDtPQUNGOzs7QUFBQTs7OztTQW5MRyxPQUFPOzs7QUF3TGIsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMiLCJmaWxlIjoiZXM2L2NvcmUvY29udGV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGQzID0gcmVxdWlyZSgnZDMnKTtcbmNvbnN0IG5zID0gcmVxdWlyZSgnLi9uYW1lc3BhY2UnKTtcblxuY2xhc3MgQ29udGV4dCB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCA9IG51bGwsIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuX3BhcmVudCA9IHBhcmVudDtcbiAgICB0aGlzLnBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5feFNjYWxlID0gbnVsbDsgLy8gaW5oZXJpdHMgZnJvbSBwYXJlbnQgY29udGV4dFxuICAgIHRoaXMuX29yaWdpbmFsWFNjYWxlID0gbnVsbDtcbiAgICB0aGlzLl95U2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuICAgICAgLmRvbWFpbihbMCwgMV0pXG4gICAgICAucmFuZ2UoWzAsIHRoaXMucGFyYW1zLmhlaWdodF0pO1xuXG4gICAgLy8gQE5PVEUgbWF5YmUgdGhlIGNvbnRleHQgY291bGQgbWFpbnRhaW4gdGhlc2UgdmFsdWVzIGluIHBpeGVsIGRvbWFpblxuICAgIHRoaXMuc3RhcnQgPSBudWxsO1xuICAgIHRoaXMuZHVyYXRpb24gPSBudWxsO1xuICAgIHRoaXMub2Zmc2V0ID0gbnVsbDtcbiAgICB0aGlzLl9zdHJldGNoUmF0aW8gPSAxO1xuICAgIHRoaXMuX3lEb21haW4gPSBbMCwgMV07XG4gICAgdGhpcy5fb3BhY2l0eSA9IDE7XG5cbiAgICAvLyBET00gZWxlbWVudHNcbiAgICB0aGlzLmNsYXNzTGlzdCA9IFsnY29udGV4dCddO1xuICAgIHRoaXMuZ3JvdXAgPSBudWxsOyAvLyBtYWluIGdyb3VwXG4gICAgdGhpcy5ib3VuZGluZ0JveCA9IG51bGw7IC8vIHN2ZyBlbGVtZW50c1xuICAgIHRoaXMub2Zmc2V0R3JvdXAgPSBudWxsOyAvLyBncm91cCB0byBvZmZzZXQgY29udGVudFxuXG4gICAgLy8gYmluZCByZW5kZXIgbWV0aG9kXG4gICAgdGhpcy5fY3JlYXRlRE9NKCk7IC8vIGNyZWF0ZSBET00gaW4gbWVtb3J5XG4gICAgdGhpcy5yZW5kZXIgPSB0aGlzLnJlbmRlci5iaW5kKHRoaXMpO1xuXG4gICAgLy8gZGVidWcgbW9kZSAtIGRyYXcgYSByZWN0IHRvIHZpc3VhbGl6ZSB0aGUgY29udGV4dFxuICAgIHRoaXMuZGVidWcgPSBmYWxzZTtcbiAgfVxuXG4gIC8vIGdldHRlciBmb3IgdGhlIHhTY2FsZVxuICAvLyByZXR1cm5zIHRoZSBjbG9zZXN0IGF2YWlsYWJsZSB4U2NhbGUgaW4gdGhlIHRyZWVcbiAgZ2V0IHhTY2FsZSgpIHtcbiAgICBsZXQgeFNjYWxlO1xuXG4gICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhdGhpcy5feFNjYWxlKSB7XG4gICAgICB4U2NhbGUgPSB0aGlzLl9wYXJlbnQueFNjYWxlO1xuICAgIH0gZWxzZSB7XG4gICAgICB4U2NhbGUgPSB0aGlzLl94U2NhbGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHhTY2FsZTtcbiAgICAvLyByZXR1cm4gZnVuY3Rpb24odmFsKSB7XG4gICAgLy8gICBsZXQgcmV0ID0geFNjYWxlKHZhbCk7XG4gICAgLy8gICByZXR1cm4gTWF0aC5tYXgocmV0LCAwKTtcbiAgICAvLyB9XG4gICAgLy8gQE5PVEUgZG9lc24ndCB3b3JrIGNhbm5vdCBhY2Nlc3MgaW52ZXJ0IGlmIG5lZWRlZFxuICAgIC8vIGNyZWF0ZSBhbiBpbnZlcnQgYWNjZXNzb3IgP1xuICB9XG5cbiAgc2V0IHhTY2FsZSh4U2NhbGUpIHtcbiAgICB0aGlzLl94U2NhbGUgPSB4U2NhbGU7XG4gIH1cblxuICAvLyByZWFkIG9ubHlcbiAgZ2V0IG9yaWdpbmFsWFNjYWxlKCkge1xuICAgIGxldCBzY2FsZTtcblxuICAgIC8vIGxhenkgYmluZCBvcmlnaW5hbFhTY2FsZSBvbiB0b3Agb2YgdGhlIHRyZWVcbiAgICBpZiAoIXRoaXMuX3BhcmVudCAmJiAhdGhpcy5fb3JpZ2luYWxYU2NhbGUpIHtcbiAgICAgIHRoaXMuX29yaWdpbmFsWFNjYWxlID0gdGhpcy5feFNjYWxlO1xuICAgIH1cblxuICAgIC8vIHJldHVybnMgdGhlIGNsb3Nlc3QgYXZhaWxhYmxlIHhTY2FsZSBpbiB0aGUgdHJlZVxuICAgIGlmICh0aGlzLl9wYXJlbnQpIHtcbiAgICAgIHNjYWxlID0gdGhpcy5fcGFyZW50Lm9yaWdpbmFsWFNjYWxlO1xuICAgIH0gZWxzZSB7XG4gICAgICBzY2FsZSA9IHRoaXMuX29yaWdpbmFsWFNjYWxlO1xuICAgIH1cblxuICAgIHJldHVybiBzY2FsZTtcbiAgfVxuXG4gIC8vXG4gIGdldCB5U2NhbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3lTY2FsZTtcbiAgfVxuXG4gIC8vIEBOT1RFOiBtYXliZSByZW1vdmUgdGhpcyBsYXRlclxuICBzZXQgeVNjYWxlKHNjYWxlKSB7XG4gICAgdGhpcy5feVNjYWxlID0gc2NhbGU7XG4gICAgdGhpcy5feVNjYWxlLmRvbWFpbih0aGlzLl95RG9tYWluKTtcbiAgfVxuXG4gIC8vIGFsbG93IHRvIGR5bmFtaWNhbGx5IG1vZGlmeSB0aGUgeURvbWFpbiBvZiB0aGUgY29udGV4dFxuICBnZXQgeURvbWFpbigpIHtcbiAgICByZXR1cm4gdGhpcy5feURvbWFpbjtcbiAgfVxuXG4gIHNldCB5RG9tYWluKGRvbWFpbikge1xuICAgIHRoaXMuX3lEb21haW4gPSBkb21haW47XG4gICAgdGhpcy55U2NhbGUuZG9tYWluKGRvbWFpbik7XG4gIH1cblxuICAvLyBzdHJldGNoIHRpbWUgYWJpbGl0eVxuICBnZXQgc3RyZXRjaFJhdGlvKCkge1xuICAgIHJldHVybiB0aGlzLl9zdHJldGNoUmF0aW87XG4gIH1cblxuICBzZXQgc3RyZXRjaFJhdGlvKHJhdGlvKSB7XG4gICAgLy8gZG9uJ3QgcmVtb3ZlIHhTY2FsZSBvbiB0b3Agb2YgdGhlIGdyYXBoXG4gICAgaWYgKHJhdGlvID09PSAxICYmIHRoaXMuX3BhcmVudCkge1xuICAgICAgdGhpcy5feFNjYWxlID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgeFNjYWxlID0gdGhpcy5vcmlnaW5hbFhTY2FsZS5jb3B5KCk7XG4gICAgICBjb25zdCBbbWluLCBtYXhdID0geFNjYWxlLmRvbWFpbigpO1xuICAgICAgY29uc3QgZGlmZiA9IChtYXggLSBtaW4pIC8gcmF0aW87XG4gICAgICB4U2NhbGUuZG9tYWluKFttaW4sIG1pbiArIGRpZmZdKTtcblxuICAgICAgdGhpcy5feFNjYWxlID0geFNjYWxlO1xuICAgIH1cblxuICAgIHRoaXMuX3N0cmV0Y2hSYXRpbyA9IHJhdGlvO1xuICB9XG5cbiAgZ2V0IG9wYWNpdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX29wYWNpdHk7XG4gIH1cblxuICBzZXQgb3BhY2l0eSh2YWx1ZSkge1xuICAgIHRoaXMuX29wYWNpdHkgPSBNYXRoLm1heChNYXRoLm1pbih2YWx1ZSwgMSksIDApO1xuICB9XG5cbiAgYWRkQ2xhc3MoLi4uY2xhc3NMaXN0KSB7XG4gICAgdGhpcy5jbGFzc0xpc3QgPSB0aGlzLmNsYXNzTGlzdC5jb25jYXQoY2xhc3NMaXN0KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIF9jcmVhdGVET00oKSB7XG4gICAgLy8gd3JhcHBlciBncm91cCBmb3IgYHN0YXJ0YCB0cmFuc2xhdGlvblxuICAgIHRoaXMuZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgdGhpcy5jbGFzc0xpc3QuZm9yRWFjaCgoY2xhc3NuYW1lKSA9PiB7XG4gICAgICB0aGlzLmdyb3VwLmNsYXNzTGlzdC5hZGQoY2xhc3NuYW1lKTtcbiAgICB9KTtcblxuICAgIC8vIGFwcGVuZCBhIHN2ZyB0byBjbGlwIHRoZSBjb250ZXh0XG4gICAgdGhpcy5ib3VuZGluZ0JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3N2ZycpXG5cbiAgICAvLyBncm91cCB0byBvZmZzZXQgdGhlIHdob2xlIGNvbnRleHRcbiAgICB0aGlzLm9mZnNldEdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIHRoaXMub2Zmc2V0R3JvdXAuY2xhc3NMaXN0LmFkZCgnb2Zmc2V0Jyk7XG5cbiAgICAvLyBkcmF3IGEgcmVjdCBpbiBjb250ZXh0IGJhY2tncm91bmQgdG8gZGVidWcgaXQncyBzaXplXG4gICAgaWYgKHRoaXMucGFyYW1zLmRlYnVnKSB7XG4gICAgICB0aGlzLmRlYnVnUmVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3JlY3QnKTtcbiAgICAgIHRoaXMuYm91bmRpbmdCb3guYXBwZW5kQ2hpbGQodGhpcy5kZWJ1Z1JlY3QpO1xuICAgICAgdGhpcy5kZWJ1Z1JlY3Quc3R5bGUuZmlsbCA9ICcjYWJhYmFiJztcbiAgICAgIHRoaXMuZGVidWdSZWN0LnN0eWxlLmZpbGxPcGFjaXR5ID0gMC4xO1xuICAgIH1cblxuICAgIHRoaXMuZ3JvdXAuYXBwZW5kQ2hpbGQodGhpcy5ib3VuZGluZ0JveCk7XG4gICAgdGhpcy5ib3VuZGluZ0JveC5hcHBlbmRDaGlsZCh0aGlzLm9mZnNldEdyb3VwKTtcbiAgfVxuICAvLyBzaG91bGQgYmUgYHVwZGF0ZVxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ3JvdXA7XG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLm9yaWdpbmFsWFNjYWxlKHRoaXMuc3RhcnQpO1xuICAgIGNvbnN0IGR1cmF0aW9uID0gdGhpcy54U2NhbGUodGhpcy5kdXJhdGlvbik7XG4gICAgY29uc3Qgb2Zmc2V0ID0gdGhpcy54U2NhbGUodGhpcy5vZmZzZXQpO1xuICAgIGNvbnN0IHRvcCAgICA9IHRoaXMucGFyYW1zLnRvcDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgLy8gbWF0cml4IHRvIGludmVydCB0aGUgY29vcmRpbmF0ZSBzeXN0ZW1cbiAgICBjb25zdCB0cmFuc2xhdGVNYXRyaXggPSBgbWF0cml4KDEsIDAsIDAsIDEsICR7c3RhcnR9LCAke3RvcH0pYDtcblxuICAgIHRoaXMuZ3JvdXAuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIHRyYW5zbGF0ZU1hdHJpeCk7XG4gICAgdGhpcy5ncm91cC5zdHlsZS5vcGFjaXR5ID0gdGhpcy5fb3BhY2l0eTtcbiAgICB0aGlzLmJvdW5kaW5nQm94LnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIGR1cmF0aW9uKTtcbiAgICB0aGlzLm9mZnNldEdyb3VwLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7b2Zmc2V0fSwgMClgKTtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5kZWJ1Zykge1xuICAgICAgdGhpcy5kZWJ1Z1JlY3Quc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgZHVyYXRpb24pO1xuICAgICAgdGhpcy5kZWJ1Z1JlY3Quc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgfVxuICB9XG5cbiAgLy8gc2hvdWxkIGhhdmUgYSBgZHJhd2AgbWV0aG9kXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29udGV4dDtcbiJdfQ==