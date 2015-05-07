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

    this.parent = parent;
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

        if (this.parent && !this._xScale) {
          xScale = this.parent.xScale;
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
        if (!this.parent && !this._originalXScale) {
          this._originalXScale = this._xScale;
        }

        // returns the closest available xScale in the tree
        if (this.parent) {
          scale = this.parent.originalXScale;
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
        // @NOTE: what about negative ratios
        if (ratio === 1) {
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
        // const height = this.params.height;
        var top = this.params.top;
        // matrix to invert the coordinate system
        var translateMatrix = "matrix(1, 0, 0, 1, " + start + ", " + top + ")";

        this.group.setAttributeNS(null, "transform", translateMatrix);
        this.group.style.opacity = this._opacity;
        this.boundingBox.setAttributeNS(null, "width", duration);
        this.offsetGroup.setAttributeNS(null, "transform", "translate(" + offset + ", 0)");

        if (this.params.debug) {
          this.debugRect.setAttributeNS(null, "width", duration);
          this.debugRect.setAttributeNS(null, "height", this.params.height);
        }
      }

      // should have a `draw` method

    }
  });

  return Context;
})();

module.exports = Context;
//# sourceMappingURL=data:application/json;base64,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LENBQUMsS0FBSyxFQUFFO0FBQ3JCLGNBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDdkQsY0FBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ25FO09BQ0Y7OztBQUFBOzs7O1NBbkxHLE9BQU87OztBQXdMYixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyIsImZpbGUiOiJlczYvY29yZS9jb250ZXh0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZDMgPSByZXF1aXJlKCdkMycpO1xuY29uc3QgbnMgPSByZXF1aXJlKCcuL25hbWVzcGFjZScpO1xuXG5jbGFzcyBDb250ZXh0IHtcbiAgY29uc3RydWN0b3IocGFyZW50ID0gbnVsbCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgdGhpcy5wYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zKTtcblxuICAgIHRoaXMuX3hTY2FsZSA9IG51bGw7IC8vIGluaGVyaXRzIGZyb20gcGFyZW50IGNvbnRleHRcbiAgICB0aGlzLl9vcmlnaW5hbFhTY2FsZSA9IG51bGw7XG4gICAgdGhpcy5feVNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcbiAgICAgIC5kb21haW4oWzAsIDFdKVxuICAgICAgLnJhbmdlKFswLCB0aGlzLnBhcmFtcy5oZWlnaHRdKTtcblxuICAgIC8vIEBOT1RFIG1heWJlIHRoZSBjb250ZXh0IGNvdWxkIG1haW50YWluIHRoZXNlIHZhbHVlcyBpbiBwaXhlbCBkb21haW5cbiAgICB0aGlzLnN0YXJ0ID0gbnVsbDtcbiAgICB0aGlzLmR1cmF0aW9uID0gbnVsbDtcbiAgICB0aGlzLm9mZnNldCA9IG51bGw7XG4gICAgdGhpcy5fc3RyZXRjaFJhdGlvID0gMTtcbiAgICB0aGlzLl95RG9tYWluID0gWzAsIDFdO1xuICAgIHRoaXMuX29wYWNpdHkgPSAxO1xuXG4gICAgLy8gRE9NIGVsZW1lbnRzXG4gICAgdGhpcy5jbGFzc0xpc3QgPSBbJ2NvbnRleHQnXTtcbiAgICB0aGlzLmdyb3VwID0gbnVsbDsgLy8gbWFpbiBncm91cFxuICAgIHRoaXMuYm91bmRpbmdCb3ggPSBudWxsOyAvLyBzdmcgZWxlbWVudHNcbiAgICB0aGlzLm9mZnNldEdyb3VwID0gbnVsbDsgLy8gZ3JvdXAgdG8gb2Zmc2V0IGNvbnRlbnRcblxuICAgIC8vIGJpbmQgcmVuZGVyIG1ldGhvZFxuICAgIHRoaXMuX2NyZWF0ZURPTSgpOyAvLyBjcmVhdGUgRE9NIGluIG1lbW9yeVxuICAgIHRoaXMucmVuZGVyID0gdGhpcy5yZW5kZXIuYmluZCh0aGlzKTtcblxuICAgIC8vIGRlYnVnIG1vZGUgLSBkcmF3IGEgcmVjdCB0byB2aXN1YWxpemUgdGhlIGNvbnRleHRcbiAgICB0aGlzLmRlYnVnID0gZmFsc2U7XG4gIH1cblxuICAvLyBnZXR0ZXIgZm9yIHRoZSB4U2NhbGVcbiAgLy8gcmV0dXJucyB0aGUgY2xvc2VzdCBhdmFpbGFibGUgeFNjYWxlIGluIHRoZSB0cmVlXG4gIGdldCB4U2NhbGUoKSB7XG4gICAgbGV0IHhTY2FsZTtcblxuICAgIGlmICh0aGlzLnBhcmVudCAmJiAhdGhpcy5feFNjYWxlKSB7XG4gICAgICB4U2NhbGUgPSB0aGlzLnBhcmVudC54U2NhbGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHhTY2FsZSA9IHRoaXMuX3hTY2FsZTtcbiAgICB9XG5cbiAgICByZXR1cm4geFNjYWxlO1xuICAgIC8vIHJldHVybiBmdW5jdGlvbih2YWwpIHtcbiAgICAvLyAgIGxldCByZXQgPSB4U2NhbGUodmFsKTtcbiAgICAvLyAgIHJldHVybiBNYXRoLm1heChyZXQsIDApO1xuICAgIC8vIH1cbiAgICAvLyBATk9URSBkb2Vzbid0IHdvcmsgY2Fubm90IGFjY2VzcyBpbnZlcnQgaWYgbmVlZGVkXG4gICAgLy8gY3JlYXRlIGFuIGludmVydCBhY2Nlc3NvciA/XG4gIH1cblxuICBzZXQgeFNjYWxlKHhTY2FsZSkge1xuICAgIHRoaXMuX3hTY2FsZSA9IHhTY2FsZTtcbiAgfVxuXG4gIC8vIHJlYWQgb25seVxuICBnZXQgb3JpZ2luYWxYU2NhbGUoKSB7XG4gICAgbGV0IHNjYWxlO1xuXG4gICAgLy8gbGF6eSBiaW5kIG9yaWdpbmFsWFNjYWxlIG9uIHRvcCBvZiB0aGUgdHJlZVxuICAgIGlmICghdGhpcy5wYXJlbnQgJiYgIXRoaXMuX29yaWdpbmFsWFNjYWxlKSB7XG4gICAgICB0aGlzLl9vcmlnaW5hbFhTY2FsZSA9IHRoaXMuX3hTY2FsZTtcbiAgICB9XG5cbiAgICAvLyByZXR1cm5zIHRoZSBjbG9zZXN0IGF2YWlsYWJsZSB4U2NhbGUgaW4gdGhlIHRyZWVcbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgIHNjYWxlID0gdGhpcy5wYXJlbnQub3JpZ2luYWxYU2NhbGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNjYWxlID0gdGhpcy5fb3JpZ2luYWxYU2NhbGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNjYWxlO1xuICB9XG5cbiAgLy9cbiAgZ2V0IHlTY2FsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5feVNjYWxlO1xuICB9XG5cbiAgLy8gQE5PVEU6IG1heWJlIHJlbW92ZSB0aGlzIGxhdGVyXG4gIHNldCB5U2NhbGUoc2NhbGUpIHtcbiAgICB0aGlzLl95U2NhbGUgPSBzY2FsZTtcbiAgICB0aGlzLl95U2NhbGUuZG9tYWluKHRoaXMuX3lEb21haW4pO1xuICB9XG5cbiAgLy8gYWxsb3cgdG8gZHluYW1pY2FsbHkgbW9kaWZ5IHRoZSB5RG9tYWluIG9mIHRoZSBjb250ZXh0XG4gIGdldCB5RG9tYWluKCkge1xuICAgIHJldHVybiB0aGlzLl95RG9tYWluO1xuICB9XG5cbiAgc2V0IHlEb21haW4oZG9tYWluKSB7XG4gICAgdGhpcy5feURvbWFpbiA9IGRvbWFpbjtcbiAgICB0aGlzLnlTY2FsZS5kb21haW4oZG9tYWluKTtcbiAgfVxuXG4gIC8vIHN0cmV0Y2ggdGltZSBhYmlsaXR5XG4gIGdldCBzdHJldGNoUmF0aW8oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0cmV0Y2hSYXRpbztcbiAgfVxuXG4gIHNldCBzdHJldGNoUmF0aW8ocmF0aW8pIHtcbiAgICAvLyBATk9URTogd2hhdCBhYm91dCBuZWdhdGl2ZSByYXRpb3NcbiAgICBpZiAocmF0aW8gPT09IDEpIHtcbiAgICAgIHRoaXMuX3hTY2FsZSA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHhTY2FsZSA9IHRoaXMub3JpZ2luYWxYU2NhbGUuY29weSgpO1xuICAgICAgY29uc3QgW21pbiwgbWF4XSA9IHhTY2FsZS5kb21haW4oKTtcbiAgICAgIGNvbnN0IGRpZmYgPSAobWF4IC0gbWluKSAvIHJhdGlvO1xuICAgICAgeFNjYWxlLmRvbWFpbihbbWluLCBtaW4gKyBkaWZmXSk7XG5cbiAgICAgIHRoaXMuX3hTY2FsZSA9IHhTY2FsZTtcbiAgICB9XG5cbiAgICB0aGlzLl9zdHJldGNoUmF0aW8gPSByYXRpbztcbiAgfVxuXG4gIGdldCBvcGFjaXR5KCkge1xuICAgIHJldHVybiB0aGlzLl9vcGFjaXR5O1xuICB9XG5cbiAgc2V0IG9wYWNpdHkodmFsdWUpIHtcbiAgICB0aGlzLl9vcGFjaXR5ID0gTWF0aC5tYXgoTWF0aC5taW4odmFsdWUsIDEpLCAwKTtcbiAgfVxuXG4gIGFkZENsYXNzKC4uLmNsYXNzTGlzdCkge1xuICAgIHRoaXMuY2xhc3NMaXN0ID0gdGhpcy5jbGFzc0xpc3QuY29uY2F0KGNsYXNzTGlzdCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBfY3JlYXRlRE9NKCkge1xuICAgIC8vIHdyYXBwZXIgZ3JvdXAgZm9yIGBzdGFydGAgdHJhbnNsYXRpb25cbiAgICB0aGlzLmdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIHRoaXMuY2xhc3NMaXN0LmZvckVhY2goKGNsYXNzbmFtZSkgPT4ge1xuICAgICAgdGhpcy5ncm91cC5jbGFzc0xpc3QuYWRkKGNsYXNzbmFtZSk7XG4gICAgfSk7XG5cbiAgICAvLyBhcHBlbmQgYSBzdmcgdG8gY2xpcCB0aGUgY29udGV4dFxuICAgIHRoaXMuYm91bmRpbmdCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdzdmcnKVxuXG4gICAgLy8gZ3JvdXAgdG8gb2Zmc2V0IHRoZSB3aG9sZSBjb250ZXh0XG4gICAgdGhpcy5vZmZzZXRHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICB0aGlzLm9mZnNldEdyb3VwLmNsYXNzTGlzdC5hZGQoJ29mZnNldCcpO1xuXG4gICAgLy8gZHJhdyBhIHJlY3QgaW4gY29udGV4dCBiYWNrZ3JvdW5kIHRvIGRlYnVnIGl0J3Mgc2l6ZVxuICAgIGlmICh0aGlzLnBhcmFtcy5kZWJ1Zykge1xuICAgICAgdGhpcy5kZWJ1Z1JlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdyZWN0Jyk7XG4gICAgICB0aGlzLmJvdW5kaW5nQm94LmFwcGVuZENoaWxkKHRoaXMuZGVidWdSZWN0KTtcbiAgICAgIHRoaXMuZGVidWdSZWN0LnN0eWxlLmZpbGwgPSAnI2FiYWJhYic7XG4gICAgICB0aGlzLmRlYnVnUmVjdC5zdHlsZS5maWxsT3BhY2l0eSA9IDAuMTtcbiAgICB9XG5cbiAgICB0aGlzLmdyb3VwLmFwcGVuZENoaWxkKHRoaXMuYm91bmRpbmdCb3gpO1xuICAgIHRoaXMuYm91bmRpbmdCb3guYXBwZW5kQ2hpbGQodGhpcy5vZmZzZXRHcm91cCk7XG4gIH1cbiAgLy8gc2hvdWxkIGJlIGB1cGRhdGVcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiB0aGlzLmdyb3VwO1xuICB9XG5cbiAgdXBkYXRlKCkge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5vcmlnaW5hbFhTY2FsZSh0aGlzLnN0YXJ0KTtcbiAgICBjb25zdCBkdXJhdGlvbiA9IHRoaXMueFNjYWxlKHRoaXMuZHVyYXRpb24pO1xuICAgIGNvbnN0IG9mZnNldCA9IHRoaXMueFNjYWxlKHRoaXMub2Zmc2V0KTtcbiAgICAvLyBjb25zdCBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgY29uc3QgdG9wICAgID0gdGhpcy5wYXJhbXMudG9wO1xuICAgIC8vIG1hdHJpeCB0byBpbnZlcnQgdGhlIGNvb3JkaW5hdGUgc3lzdGVtXG4gICAgY29uc3QgdHJhbnNsYXRlTWF0cml4ID0gYG1hdHJpeCgxLCAwLCAwLCAxLCAke3N0YXJ0fSwgJHt0b3B9KWA7XG5cbiAgICB0aGlzLmdyb3VwLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCB0cmFuc2xhdGVNYXRyaXgpO1xuICAgIHRoaXMuZ3JvdXAuc3R5bGUub3BhY2l0eSA9IHRoaXMuX29wYWNpdHk7XG4gICAgdGhpcy5ib3VuZGluZ0JveC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCBkdXJhdGlvbik7XG4gICAgdGhpcy5vZmZzZXRHcm91cC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke29mZnNldH0sIDApYCk7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZGVidWcpIHtcbiAgICAgIHRoaXMuZGVidWdSZWN0LnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIGR1cmF0aW9uKTtcbiAgICAgIHRoaXMuZGVidWdSZWN0LnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCB0aGlzLnBhcmFtcy5oZWlnaHQpO1xuICAgIH1cbiAgfVxuXG4gIC8vIHNob3VsZCBoYXZlIGEgYGRyYXdgIG1ldGhvZFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRleHQ7XG4iXX0=