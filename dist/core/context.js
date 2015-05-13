"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _slicedToArray = require("babel-runtime/helpers/sliced-to-array")["default"];

var d3 = require("d3");
var ns = require("./namespace");

// @NOTE: rename to TimeContext

var Context = (function () {
  function Context() {
    var parent = arguments[0] === undefined ? null : arguments[0];

    _classCallCheck(this, Context);

    this._parent = parent;

    this._xScale = null; // inherits from parent context
    this._originalXScale = null;

    this.start = 0;
    this.duration = 1;
    this.offset = 0;
    this._stretchRatio = 1;
  }

  _createClass(Context, {
    xScale: {

      /**
       * @return <Function> the closest available xScale in the tree
       */

      get: function () {
        var xScale = undefined;

        if (this._parent && !this._xScale) {
          xScale = this._parent.xScale;
        } else {
          xScale = this._xScale;
        }

        return xScale;
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
    stretchRatio: {
      get: function () {
        return this._stretchRatio;
      },
      set: function (ratio) {
        // do not remove xScale on top of the graph
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
    }
  });

  return Context;
})();

module.exports = Context;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL2NvbnRleHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekIsSUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDOzs7O0lBSTVCLE9BQU87QUFDQSxXQURQLE9BQU8sR0FDZ0I7UUFBZixNQUFNLGdDQUFHLElBQUk7OzBCQURyQixPQUFPOztBQUVULFFBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDOztBQUV0QixRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztBQUNwQixRQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQzs7QUFFNUIsUUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDZixRQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztBQUNsQixRQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNoQixRQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztHQUN4Qjs7ZUFYRyxPQUFPO0FBNEJQLFVBQU07Ozs7OztXQVpBLFlBQUc7QUFDWCxZQUFJLE1BQU0sWUFBQSxDQUFDOztBQUVYLFlBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDakMsZ0JBQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztTQUM5QixNQUFNO0FBQ0wsZ0JBQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1NBQ3ZCOztBQUVELGVBQU8sTUFBTSxDQUFDO09BQ2Y7V0FFUyxVQUFDLE1BQU0sRUFBRTtBQUNqQixZQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztPQUN2Qjs7QUFHRyxrQkFBYzs7OztXQUFBLFlBQUc7QUFDbkIsWUFBSSxLQUFLLFlBQUEsQ0FBQzs7O0FBR1YsWUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFO0FBQzFDLGNBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztTQUNyQzs7O0FBR0QsWUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ2hCLGVBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQztTQUNyQyxNQUFNO0FBQ0wsZUFBSyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7U0FDOUI7O0FBRUQsZUFBTyxLQUFLLENBQUM7T0FDZDs7QUFNRyxnQkFBWTtXQUpBLFlBQUc7QUFDakIsZUFBTyxJQUFJLENBQUMsYUFBYSxDQUFDO09BQzNCO1dBRWUsVUFBQyxLQUFLLEVBQUU7O0FBRXRCLFlBQUksS0FBSyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQy9CLGNBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1NBQ3JCLE1BQU07QUFDTCxjQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDOzsrQkFDdkIsTUFBTSxDQUFDLE1BQU0sRUFBRTs7OztjQUEzQixHQUFHO2NBQUUsR0FBRzs7QUFDZixjQUFNLElBQUksR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUEsR0FBSSxLQUFLLENBQUM7QUFDakMsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7O0FBRWpDLGNBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1NBQ3ZCOztBQUVELFlBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO09BQzVCOzs7O1NBckVHLE9BQU87OztBQXdFYixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyIsImZpbGUiOiJlczYvY29yZS9jb250ZXh0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZDMgPSByZXF1aXJlKCdkMycpO1xuY29uc3QgbnMgPSByZXF1aXJlKCcuL25hbWVzcGFjZScpO1xuXG4vLyBATk9URTogcmVuYW1lIHRvIFRpbWVDb250ZXh0XG5cbmNsYXNzIENvbnRleHQge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQgPSBudWxsKSB7XG4gICAgdGhpcy5fcGFyZW50ID0gcGFyZW50O1xuXG4gICAgdGhpcy5feFNjYWxlID0gbnVsbDsgLy8gaW5oZXJpdHMgZnJvbSBwYXJlbnQgY29udGV4dFxuICAgIHRoaXMuX29yaWdpbmFsWFNjYWxlID0gbnVsbDtcblxuICAgIHRoaXMuc3RhcnQgPSAwO1xuICAgIHRoaXMuZHVyYXRpb24gPSAxO1xuICAgIHRoaXMub2Zmc2V0ID0gMDtcbiAgICB0aGlzLl9zdHJldGNoUmF0aW8gPSAxO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4gPEZ1bmN0aW9uPiB0aGUgY2xvc2VzdCBhdmFpbGFibGUgeFNjYWxlIGluIHRoZSB0cmVlXG4gICAqL1xuICBnZXQgeFNjYWxlKCkge1xuICAgIGxldCB4U2NhbGU7XG5cbiAgICBpZiAodGhpcy5fcGFyZW50ICYmICF0aGlzLl94U2NhbGUpIHtcbiAgICAgIHhTY2FsZSA9IHRoaXMuX3BhcmVudC54U2NhbGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHhTY2FsZSA9IHRoaXMuX3hTY2FsZTtcbiAgICB9XG5cbiAgICByZXR1cm4geFNjYWxlO1xuICB9XG5cbiAgc2V0IHhTY2FsZSh4U2NhbGUpIHtcbiAgICB0aGlzLl94U2NhbGUgPSB4U2NhbGU7XG4gIH1cblxuICAvLyByZWFkIG9ubHlcbiAgZ2V0IG9yaWdpbmFsWFNjYWxlKCkge1xuICAgIGxldCBzY2FsZTtcblxuICAgIC8vIGxhenkgYmluZCBvcmlnaW5hbFhTY2FsZSBvbiB0b3Agb2YgdGhlIHRyZWVcbiAgICBpZiAoIXRoaXMuX3BhcmVudCAmJiAhdGhpcy5fb3JpZ2luYWxYU2NhbGUpIHtcbiAgICAgIHRoaXMuX29yaWdpbmFsWFNjYWxlID0gdGhpcy5feFNjYWxlO1xuICAgIH1cblxuICAgIC8vIHJldHVybnMgdGhlIGNsb3Nlc3QgYXZhaWxhYmxlIHhTY2FsZSBpbiB0aGUgdHJlZVxuICAgIGlmICh0aGlzLl9wYXJlbnQpIHtcbiAgICAgIHNjYWxlID0gdGhpcy5fcGFyZW50Lm9yaWdpbmFsWFNjYWxlO1xuICAgIH0gZWxzZSB7XG4gICAgICBzY2FsZSA9IHRoaXMuX29yaWdpbmFsWFNjYWxlO1xuICAgIH1cblxuICAgIHJldHVybiBzY2FsZTtcbiAgfVxuXG4gIGdldCBzdHJldGNoUmF0aW8oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0cmV0Y2hSYXRpbztcbiAgfVxuXG4gIHNldCBzdHJldGNoUmF0aW8ocmF0aW8pIHtcbiAgICAvLyBkbyBub3QgcmVtb3ZlIHhTY2FsZSBvbiB0b3Agb2YgdGhlIGdyYXBoXG4gICAgaWYgKHJhdGlvID09PSAxICYmIHRoaXMuX3BhcmVudCkge1xuICAgICAgdGhpcy5feFNjYWxlID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgeFNjYWxlID0gdGhpcy5vcmlnaW5hbFhTY2FsZS5jb3B5KCk7XG4gICAgICBjb25zdCBbbWluLCBtYXhdID0geFNjYWxlLmRvbWFpbigpO1xuICAgICAgY29uc3QgZGlmZiA9IChtYXggLSBtaW4pIC8gcmF0aW87XG4gICAgICB4U2NhbGUuZG9tYWluKFttaW4sIG1pbiArIGRpZmZdKTtcblxuICAgICAgdGhpcy5feFNjYWxlID0geFNjYWxlO1xuICAgIH1cblxuICAgIHRoaXMuX3N0cmV0Y2hSYXRpbyA9IHJhdGlvO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29udGV4dDtcbiJdfQ==