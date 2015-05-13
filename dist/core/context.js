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
//# sourceMappingURL=data:application/json;base64,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QWMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxpQkFBZSxNQUFNLFVBQU8sQ0FBQzs7QUFFOUUsWUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRTtBQUNyQixjQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ3ZELGNBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDdkQ7T0FDRjs7O0FBQUE7Ozs7U0FuTEcsT0FBTzs7O0FBd0xiLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDIiwiZmlsZSI6ImVzNi9jb3JlL2NvbnRleHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBkMyA9IHJlcXVpcmUoJ2QzJyk7XG5jb25zdCBucyA9IHJlcXVpcmUoJy4vbmFtZXNwYWNlJyk7XG5cbmNsYXNzIENvbnRleHQge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQgPSBudWxsLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gICAgdGhpcy5wYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zKTtcblxuICAgIHRoaXMuX3hTY2FsZSA9IG51bGw7IC8vIGluaGVyaXRzIGZyb20gcGFyZW50IGNvbnRleHRcbiAgICB0aGlzLl9vcmlnaW5hbFhTY2FsZSA9IG51bGw7XG4gICAgdGhpcy5feVNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcbiAgICAgIC5kb21haW4oWzAsIDFdKVxuICAgICAgLnJhbmdlKFswLCB0aGlzLnBhcmFtcy5oZWlnaHRdKTtcblxuICAgIC8vIEBOT1RFIG1heWJlIHRoZSBjb250ZXh0IGNvdWxkIG1haW50YWluIHRoZXNlIHZhbHVlcyBpbiBwaXhlbCBkb21haW5cbiAgICB0aGlzLnN0YXJ0ID0gbnVsbDtcbiAgICB0aGlzLmR1cmF0aW9uID0gbnVsbDtcbiAgICB0aGlzLm9mZnNldCA9IG51bGw7XG4gICAgdGhpcy5fc3RyZXRjaFJhdGlvID0gMTtcbiAgICB0aGlzLl95RG9tYWluID0gWzAsIDFdO1xuICAgIHRoaXMuX29wYWNpdHkgPSAxO1xuXG4gICAgLy8gRE9NIGVsZW1lbnRzXG4gICAgdGhpcy5jbGFzc0xpc3QgPSBbJ2NvbnRleHQnXTtcbiAgICB0aGlzLmdyb3VwID0gbnVsbDsgLy8gbWFpbiBncm91cFxuICAgIHRoaXMuYm91bmRpbmdCb3ggPSBudWxsOyAvLyBzdmcgZWxlbWVudHNcbiAgICB0aGlzLm9mZnNldEdyb3VwID0gbnVsbDsgLy8gZ3JvdXAgdG8gb2Zmc2V0IGNvbnRlbnRcblxuICAgIC8vIGJpbmQgcmVuZGVyIG1ldGhvZFxuICAgIHRoaXMuX2NyZWF0ZURPTSgpOyAvLyBjcmVhdGUgRE9NIGluIG1lbW9yeVxuICAgIHRoaXMucmVuZGVyID0gdGhpcy5yZW5kZXIuYmluZCh0aGlzKTtcblxuICAgIC8vIGRlYnVnIG1vZGUgLSBkcmF3IGEgcmVjdCB0byB2aXN1YWxpemUgdGhlIGNvbnRleHRcbiAgICB0aGlzLmRlYnVnID0gZmFsc2U7XG4gIH1cblxuICAvLyBnZXR0ZXIgZm9yIHRoZSB4U2NhbGVcbiAgLy8gcmV0dXJucyB0aGUgY2xvc2VzdCBhdmFpbGFibGUgeFNjYWxlIGluIHRoZSB0cmVlXG4gIGdldCB4U2NhbGUoKSB7XG4gICAgbGV0IHhTY2FsZTtcblxuICAgIGlmICh0aGlzLl9wYXJlbnQgJiYgIXRoaXMuX3hTY2FsZSkge1xuICAgICAgeFNjYWxlID0gdGhpcy5fcGFyZW50LnhTY2FsZTtcbiAgICB9IGVsc2Uge1xuICAgICAgeFNjYWxlID0gdGhpcy5feFNjYWxlO1xuICAgIH1cblxuICAgIHJldHVybiB4U2NhbGU7XG4gICAgLy8gcmV0dXJuIGZ1bmN0aW9uKHZhbCkge1xuICAgIC8vICAgbGV0IHJldCA9IHhTY2FsZSh2YWwpO1xuICAgIC8vICAgcmV0dXJuIE1hdGgubWF4KHJldCwgMCk7XG4gICAgLy8gfVxuICAgIC8vIEBOT1RFIGRvZXNuJ3Qgd29yayBjYW5ub3QgYWNjZXNzIGludmVydCBpZiBuZWVkZWRcbiAgICAvLyBjcmVhdGUgYW4gaW52ZXJ0IGFjY2Vzc29yID9cbiAgfVxuXG4gIHNldCB4U2NhbGUoeFNjYWxlKSB7XG4gICAgdGhpcy5feFNjYWxlID0geFNjYWxlO1xuICB9XG5cbiAgLy8gcmVhZCBvbmx5XG4gIGdldCBvcmlnaW5hbFhTY2FsZSgpIHtcbiAgICBsZXQgc2NhbGU7XG5cbiAgICAvLyBsYXp5IGJpbmQgb3JpZ2luYWxYU2NhbGUgb24gdG9wIG9mIHRoZSB0cmVlXG4gICAgaWYgKCF0aGlzLl9wYXJlbnQgJiYgIXRoaXMuX29yaWdpbmFsWFNjYWxlKSB7XG4gICAgICB0aGlzLl9vcmlnaW5hbFhTY2FsZSA9IHRoaXMuX3hTY2FsZTtcbiAgICB9XG5cbiAgICAvLyByZXR1cm5zIHRoZSBjbG9zZXN0IGF2YWlsYWJsZSB4U2NhbGUgaW4gdGhlIHRyZWVcbiAgICBpZiAodGhpcy5fcGFyZW50KSB7XG4gICAgICBzY2FsZSA9IHRoaXMuX3BhcmVudC5vcmlnaW5hbFhTY2FsZTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2NhbGUgPSB0aGlzLl9vcmlnaW5hbFhTY2FsZTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2NhbGU7XG4gIH1cblxuICAvL1xuICBnZXQgeVNjYWxlKCkge1xuICAgIHJldHVybiB0aGlzLl95U2NhbGU7XG4gIH1cblxuICAvLyBATk9URTogbWF5YmUgcmVtb3ZlIHRoaXMgbGF0ZXJcbiAgc2V0IHlTY2FsZShzY2FsZSkge1xuICAgIHRoaXMuX3lTY2FsZSA9IHNjYWxlO1xuICAgIHRoaXMuX3lTY2FsZS5kb21haW4odGhpcy5feURvbWFpbik7XG4gIH1cblxuICAvLyBhbGxvdyB0byBkeW5hbWljYWxseSBtb2RpZnkgdGhlIHlEb21haW4gb2YgdGhlIGNvbnRleHRcbiAgZ2V0IHlEb21haW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3lEb21haW47XG4gIH1cblxuICBzZXQgeURvbWFpbihkb21haW4pIHtcbiAgICB0aGlzLl95RG9tYWluID0gZG9tYWluO1xuICAgIHRoaXMueVNjYWxlLmRvbWFpbihkb21haW4pO1xuICB9XG5cbiAgLy8gc3RyZXRjaCB0aW1lIGFiaWxpdHlcbiAgZ2V0IHN0cmV0Y2hSYXRpbygpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RyZXRjaFJhdGlvO1xuICB9XG5cbiAgc2V0IHN0cmV0Y2hSYXRpbyhyYXRpbykge1xuICAgIC8vIGRvbid0IHJlbW92ZSB4U2NhbGUgb24gdG9wIG9mIHRoZSBncmFwaFxuICAgIGlmIChyYXRpbyA9PT0gMSAmJiB0aGlzLl9wYXJlbnQpIHtcbiAgICAgIHRoaXMuX3hTY2FsZSA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHhTY2FsZSA9IHRoaXMub3JpZ2luYWxYU2NhbGUuY29weSgpO1xuICAgICAgY29uc3QgW21pbiwgbWF4XSA9IHhTY2FsZS5kb21haW4oKTtcbiAgICAgIGNvbnN0IGRpZmYgPSAobWF4IC0gbWluKSAvIHJhdGlvO1xuICAgICAgeFNjYWxlLmRvbWFpbihbbWluLCBtaW4gKyBkaWZmXSk7XG5cbiAgICAgIHRoaXMuX3hTY2FsZSA9IHhTY2FsZTtcbiAgICB9XG5cbiAgICB0aGlzLl9zdHJldGNoUmF0aW8gPSByYXRpbztcbiAgfVxuXG4gIGdldCBvcGFjaXR5KCkge1xuICAgIHJldHVybiB0aGlzLl9vcGFjaXR5O1xuICB9XG5cbiAgc2V0IG9wYWNpdHkodmFsdWUpIHtcbiAgICB0aGlzLl9vcGFjaXR5ID0gTWF0aC5tYXgoTWF0aC5taW4odmFsdWUsIDEpLCAwKTtcbiAgfVxuXG4gIGFkZENsYXNzKC4uLmNsYXNzTGlzdCkge1xuICAgIHRoaXMuY2xhc3NMaXN0ID0gdGhpcy5jbGFzc0xpc3QuY29uY2F0KGNsYXNzTGlzdCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBfY3JlYXRlRE9NKCkge1xuICAgIC8vIHdyYXBwZXIgZ3JvdXAgZm9yIGBzdGFydGAgdHJhbnNsYXRpb25cbiAgICB0aGlzLmdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIHRoaXMuY2xhc3NMaXN0LmZvckVhY2goKGNsYXNzbmFtZSkgPT4ge1xuICAgICAgdGhpcy5ncm91cC5jbGFzc0xpc3QuYWRkKGNsYXNzbmFtZSk7XG4gICAgfSk7XG5cbiAgICAvLyBhcHBlbmQgYSBzdmcgdG8gY2xpcCB0aGUgY29udGV4dFxuICAgIHRoaXMuYm91bmRpbmdCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdzdmcnKVxuXG4gICAgLy8gZ3JvdXAgdG8gb2Zmc2V0IHRoZSB3aG9sZSBjb250ZXh0XG4gICAgdGhpcy5vZmZzZXRHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICB0aGlzLm9mZnNldEdyb3VwLmNsYXNzTGlzdC5hZGQoJ29mZnNldCcpO1xuXG4gICAgLy8gZHJhdyBhIHJlY3QgaW4gY29udGV4dCBiYWNrZ3JvdW5kIHRvIGRlYnVnIGl0J3Mgc2l6ZVxuICAgIGlmICh0aGlzLnBhcmFtcy5kZWJ1Zykge1xuICAgICAgdGhpcy5kZWJ1Z1JlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdyZWN0Jyk7XG4gICAgICB0aGlzLmJvdW5kaW5nQm94LmFwcGVuZENoaWxkKHRoaXMuZGVidWdSZWN0KTtcbiAgICAgIHRoaXMuZGVidWdSZWN0LnN0eWxlLmZpbGwgPSAnI2FiYWJhYic7XG4gICAgICB0aGlzLmRlYnVnUmVjdC5zdHlsZS5maWxsT3BhY2l0eSA9IDAuMTtcbiAgICB9XG5cbiAgICB0aGlzLmdyb3VwLmFwcGVuZENoaWxkKHRoaXMuYm91bmRpbmdCb3gpO1xuICAgIHRoaXMuYm91bmRpbmdCb3guYXBwZW5kQ2hpbGQodGhpcy5vZmZzZXRHcm91cCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ3JvdXA7XG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLm9yaWdpbmFsWFNjYWxlKHRoaXMuc3RhcnQpO1xuICAgIGNvbnN0IGR1cmF0aW9uID0gdGhpcy54U2NhbGUodGhpcy5kdXJhdGlvbik7XG4gICAgY29uc3Qgb2Zmc2V0ID0gdGhpcy54U2NhbGUodGhpcy5vZmZzZXQpO1xuICAgIGNvbnN0IHRvcCAgICA9IHRoaXMucGFyYW1zLnRvcDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgLy8gbWF0cml4IHRvIGludmVydCB0aGUgY29vcmRpbmF0ZSBzeXN0ZW1cbiAgICBjb25zdCB0cmFuc2xhdGVNYXRyaXggPSBgbWF0cml4KDEsIDAsIDAsIDEsICR7c3RhcnR9LCAke3RvcH0pYDtcblxuICAgIHRoaXMuZ3JvdXAuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIHRyYW5zbGF0ZU1hdHJpeCk7XG4gICAgdGhpcy5ncm91cC5zdHlsZS5vcGFjaXR5ID0gdGhpcy5fb3BhY2l0eTtcbiAgICB0aGlzLmJvdW5kaW5nQm94LnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIGR1cmF0aW9uKTtcbiAgICB0aGlzLm9mZnNldEdyb3VwLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7b2Zmc2V0fSwgMClgKTtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5kZWJ1Zykge1xuICAgICAgdGhpcy5kZWJ1Z1JlY3Quc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgZHVyYXRpb24pO1xuICAgICAgdGhpcy5kZWJ1Z1JlY3Quc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgfVxuICB9XG5cbiAgLy8gc2hvdWxkIGhhdmUgYSBgZHJhd2AgbWV0aG9kXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29udGV4dDtcbiJdfQ==