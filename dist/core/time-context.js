// @FIXME there is a problem with the stretch:
// how does it must be applyed ?
// should we maintain some `absoluteStart`, `absoluteDuration`, etc... values ?

// @NOTE: separate timeline's with from the scale,
// => only define #pixels for one seconds (kind of real scale) ?

"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _slicedToArray = require("babel-runtime/helpers/sliced-to-array")["default"];

var TimeContext = (function () {
  function TimeContext() {
    var parent = arguments[0] === undefined ? null : arguments[0];

    _classCallCheck(this, TimeContext);

    this.parent = parent;
    this._children = [];

    this._xScale = null; // inherits from parent context
    this._originalXScale = null;

    this.start = 0;
    this.duration = parent !== null ? parent.duration : 1;
    this.offset = 0;
    this._stretchRatio = 1;
    // @NOTE: need an `absoluteStretchRatio` ?

    if (this.parent) {
      this.parent._children.push(this);
    }
  }

  _createClass(TimeContext, {
    xScale: {

      // attempt to get a solution to the stretch problem
      // get normalizedStart() {
      //   return this.start / this.stretchRatio;
      // }

      /**
       * @return {Function} the closest available xScale in the tree
       */

      get: function () {
        if (this.parent && !this._xScale) {
          return this.parent.xScale;
        } else {
          return this._xScale;
        }
      },
      set: function (xScale) {
        this._xScale = xScale;
      }
    },
    originalXScale: {

      // read only
      // @NOTE not used anymore outside this object, was used to have a proper start
      // from an inner context with it's own `stretchRatio` but creates many bad side effects
      // => find another strategy => use _context.parent.xScale

      get: function () {
        // lazy bind originalXScale on top of the tree
        if (!this.parent && !this._originalXScale) {
          this._originalXScale = this._xScale;
        }

        // returns the closest available xScale in the tree
        if (this.parent) {
          return this.parent.originalXScale;
        } else {
          return this._originalXScale;
        }
      }
    },
    stretchRatio: {
      get: function () {
        return this._stretchRatio;
      },

      // @FIXME: inconsistencies occur
      // when stretching parent and when child.stretchRatio != 1
      set: function (ratio) {
        // do not remove xScale on top of the graph
        if (ratio === 1 && this.parent && this.parent.stretchRatio === 1) {
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

        var ratioChange = ratio / this._stretchRatio;
        this._stretchRatio = ratio;

        // propagate change to children who have their own stretchRatio
        this._children.forEach(function (child) {
          if (child._xScale) {
            child.stretchRatio = child.stretchRatio * ratioChange;
          }
        });
      }
    }
  });

  return TimeContext;
})();

module.exports = TimeContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3RpbWUtY29udGV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7SUFPTSxXQUFXO0FBQ0osV0FEUCxXQUFXLEdBQ1k7UUFBZixNQUFNLGdDQUFHLElBQUk7OzBCQURyQixXQUFXOztBQUViLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLFFBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDOztBQUVwQixRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztBQUNwQixRQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQzs7QUFFNUIsUUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDZixRQUFJLENBQUMsUUFBUSxHQUFHLEFBQUMsTUFBTSxLQUFLLElBQUksR0FBSSxNQUFNLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztBQUN4RCxRQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNoQixRQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQzs7O0FBR3ZCLFFBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNmLFVBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNsQztHQUNGOztlQWpCRyxXQUFXO0FBbUNYLFVBQU07Ozs7Ozs7Ozs7O1dBUkEsWUFBRztBQUNYLFlBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDaEMsaUJBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7U0FDM0IsTUFBTTtBQUNMLGlCQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDckI7T0FDRjtXQUVTLFVBQUMsTUFBTSxFQUFFO0FBQ2pCLFlBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO09BQ3ZCOztBQU1HLGtCQUFjOzs7Ozs7O1dBQUEsWUFBRzs7QUFFbkIsWUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFO0FBQ3pDLGNBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztTQUNyQzs7O0FBR0QsWUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2YsaUJBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUM7U0FDbkMsTUFBTTtBQUNMLGlCQUFPLElBQUksQ0FBQyxlQUFlLENBQUM7U0FDN0I7T0FDRjs7QUFRRyxnQkFBWTtXQU5BLFlBQUc7QUFDakIsZUFBTyxJQUFJLENBQUMsYUFBYSxDQUFDO09BQzNCOzs7O1dBSWUsVUFBQyxLQUFLLEVBQUU7O0FBRXRCLFlBQ0UsS0FBSyxLQUFLLENBQUMsSUFDWCxJQUFJLENBQUMsTUFBTSxJQUNYLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxLQUFLLENBQUMsRUFDOUI7QUFDQSxjQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztTQUNyQixNQUFNO0FBQ0wsY0FBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7K0JBQ3ZCLE1BQU0sQ0FBQyxNQUFNLEVBQUU7Ozs7Y0FBM0IsR0FBRztjQUFFLEdBQUc7O0FBQ2YsY0FBTSxJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFBLEdBQUksS0FBSyxDQUFDO0FBQ2pDLGdCQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDOztBQUVqQyxjQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztTQUN2Qjs7QUFFRCxZQUFNLFdBQVcsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztBQUMvQyxZQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQzs7O0FBRzNCLFlBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVMsS0FBSyxFQUFFO0FBQ3JDLGNBQUksS0FBSyxDQUFDLE9BQU8sRUFBRTtBQUNqQixpQkFBSyxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQztXQUN2RDtTQUNGLENBQUMsQ0FBQztPQUNKOzs7O1NBekZHLFdBQVc7OztBQTRGakIsTUFBTSxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUMiLCJmaWxlIjoiZXM2L2NvcmUvdGltZS1jb250ZXh0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQEZJWE1FIHRoZXJlIGlzIGEgcHJvYmxlbSB3aXRoIHRoZSBzdHJldGNoOlxuLy8gaG93IGRvZXMgaXQgbXVzdCBiZSBhcHBseWVkID9cbi8vIHNob3VsZCB3ZSBtYWludGFpbiBzb21lIGBhYnNvbHV0ZVN0YXJ0YCwgYGFic29sdXRlRHVyYXRpb25gLCBldGMuLi4gdmFsdWVzID9cblxuLy8gQE5PVEU6IHNlcGFyYXRlIHRpbWVsaW5lJ3Mgd2l0aCBmcm9tIHRoZSBzY2FsZSxcbi8vID0+IG9ubHkgZGVmaW5lICNwaXhlbHMgZm9yIG9uZSBzZWNvbmRzIChraW5kIG9mIHJlYWwgc2NhbGUpID9cblxuY2xhc3MgVGltZUNvbnRleHQge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQgPSBudWxsKSB7XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgdGhpcy5fY2hpbGRyZW4gPSBbXTtcblxuICAgIHRoaXMuX3hTY2FsZSA9IG51bGw7IC8vIGluaGVyaXRzIGZyb20gcGFyZW50IGNvbnRleHRcbiAgICB0aGlzLl9vcmlnaW5hbFhTY2FsZSA9IG51bGw7XG5cbiAgICB0aGlzLnN0YXJ0ID0gMDtcbiAgICB0aGlzLmR1cmF0aW9uID0gKHBhcmVudCAhPT0gbnVsbCkgPyBwYXJlbnQuZHVyYXRpb24gOsKgMTtcbiAgICB0aGlzLm9mZnNldCA9IDA7XG4gICAgdGhpcy5fc3RyZXRjaFJhdGlvID0gMTtcbiAgICAvLyBATk9URTogbmVlZCBhbiBgYWJzb2x1dGVTdHJldGNoUmF0aW9gID9cblxuICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgdGhpcy5wYXJlbnQuX2NoaWxkcmVuLnB1c2godGhpcyk7XG4gICAgfVxuICB9XG5cbiAgLy8gYXR0ZW1wdCB0byBnZXQgYSBzb2x1dGlvbiB0byB0aGUgc3RyZXRjaCBwcm9ibGVtXG4gIC8vIGdldCBub3JtYWxpemVkU3RhcnQoKSB7XG4gIC8vICAgcmV0dXJuIHRoaXMuc3RhcnQgLyB0aGlzLnN0cmV0Y2hSYXRpbztcbiAgLy8gfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gdGhlIGNsb3Nlc3QgYXZhaWxhYmxlIHhTY2FsZSBpbiB0aGUgdHJlZVxuICAgKi9cbiAgZ2V0IHhTY2FsZSgpIHtcbiAgICBpZiAodGhpcy5wYXJlbnQgJiYgIXRoaXMuX3hTY2FsZSkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyZW50LnhTY2FsZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX3hTY2FsZTtcbiAgICB9XG4gIH1cblxuICBzZXQgeFNjYWxlKHhTY2FsZSkge1xuICAgIHRoaXMuX3hTY2FsZSA9IHhTY2FsZTtcbiAgfVxuXG4gIC8vIHJlYWQgb25seVxuICAvLyBATk9URSBub3QgdXNlZCBhbnltb3JlIG91dHNpZGUgdGhpcyBvYmplY3QsIHdhcyB1c2VkIHRvIGhhdmUgYSBwcm9wZXIgc3RhcnRcbiAgLy8gZnJvbSBhbiBpbm5lciBjb250ZXh0IHdpdGggaXQncyBvd24gYHN0cmV0Y2hSYXRpb2AgYnV0IGNyZWF0ZXMgbWFueSBiYWQgc2lkZSBlZmZlY3RzXG4gIC8vID0+IGZpbmQgYW5vdGhlciBzdHJhdGVneSA9PiB1c2UgX2NvbnRleHQucGFyZW50LnhTY2FsZVxuICBnZXQgb3JpZ2luYWxYU2NhbGUoKSB7XG4gICAgLy8gbGF6eSBiaW5kIG9yaWdpbmFsWFNjYWxlIG9uIHRvcCBvZiB0aGUgdHJlZVxuICAgIGlmICghdGhpcy5wYXJlbnQgJiYgIXRoaXMuX29yaWdpbmFsWFNjYWxlKSB7XG4gICAgICB0aGlzLl9vcmlnaW5hbFhTY2FsZSA9IHRoaXMuX3hTY2FsZTtcbiAgICB9XG5cbiAgICAvLyByZXR1cm5zIHRoZSBjbG9zZXN0IGF2YWlsYWJsZSB4U2NhbGUgaW4gdGhlIHRyZWVcbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudC5vcmlnaW5hbFhTY2FsZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX29yaWdpbmFsWFNjYWxlO1xuICAgIH1cbiAgfVxuXG4gIGdldCBzdHJldGNoUmF0aW8oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0cmV0Y2hSYXRpbztcbiAgfVxuXG4gIC8vIEBGSVhNRTogaW5jb25zaXN0ZW5jaWVzIG9jY3VyXG4gIC8vIHdoZW4gc3RyZXRjaGluZyBwYXJlbnQgYW5kIHdoZW4gY2hpbGQuc3RyZXRjaFJhdGlvICE9IDFcbiAgc2V0IHN0cmV0Y2hSYXRpbyhyYXRpbykge1xuICAgIC8vIGRvIG5vdCByZW1vdmUgeFNjYWxlIG9uIHRvcCBvZiB0aGUgZ3JhcGhcbiAgICBpZiAoXG4gICAgICByYXRpbyA9PT0gMSAmJlxuICAgICAgdGhpcy5wYXJlbnQgJiZcbiAgICAgIHRoaXMucGFyZW50LnN0cmV0Y2hSYXRpbyA9PT0gMVxuICAgICkge1xuICAgICAgdGhpcy5feFNjYWxlID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgeFNjYWxlID0gdGhpcy5vcmlnaW5hbFhTY2FsZS5jb3B5KCk7XG4gICAgICBjb25zdCBbbWluLCBtYXhdID0geFNjYWxlLmRvbWFpbigpO1xuICAgICAgY29uc3QgZGlmZiA9IChtYXggLSBtaW4pIC8gcmF0aW87XG4gICAgICB4U2NhbGUuZG9tYWluKFttaW4sIG1pbiArIGRpZmZdKTtcblxuICAgICAgdGhpcy5feFNjYWxlID0geFNjYWxlO1xuICAgIH1cblxuICAgIGNvbnN0IHJhdGlvQ2hhbmdlID0gcmF0aW8gLyB0aGlzLl9zdHJldGNoUmF0aW87XG4gICAgdGhpcy5fc3RyZXRjaFJhdGlvID0gcmF0aW87XG5cbiAgICAvLyBwcm9wYWdhdGUgY2hhbmdlIHRvIGNoaWxkcmVuIHdobyBoYXZlIHRoZWlyIG93biBzdHJldGNoUmF0aW9cbiAgICB0aGlzLl9jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICBpZiAoY2hpbGQuX3hTY2FsZSkge1xuICAgICAgICBjaGlsZC5zdHJldGNoUmF0aW8gPSBjaGlsZC5zdHJldGNoUmF0aW8gKiByYXRpb0NoYW5nZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRpbWVDb250ZXh0O1xuIl19