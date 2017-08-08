"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * OrthogonalData transforms an object of arrays `{foo: [1, 2], bar: [3, 4]}`
 * to or from an array of objects `[{foo: 1, bar: 3}, {foo: 2, bar: 4}]`
 */
var OrthogonalData = function () {
  function OrthogonalData() {
    (0, _classCallCheck3.default)(this, OrthogonalData);

    this._cols = null; // Object of arrays
    this._rows = null; // Array of objects
  }

  /**
   * Check the consistency of the data.
   */


  (0, _createClass3.default)(OrthogonalData, [{
    key: "_checkConsistency",
    value: function _checkConsistency() {
      var size = null;

      for (var key in this._cols) {
        var col = this._cols[key];
        var colLength = col.length;

        if (size !== null && size !== colLength) {
          throw new Error(this.prototype.constructor.name + ": inconsistent data");
        } else if (size === null) {
          size = colLength;
        }
      }
    }

    /**
     * Updates array of objects from object of arrays.
     */

  }, {
    key: "updateFromCols",
    value: function updateFromCols() {
      var _this = this;

      var keys = (0, _keys2.default)(this._cols);

      keys.forEach(function (key, i) {
        var col = _this._cols[key];

        col.forEach(function (value, index) {
          if (_this._rows[index] === undefined) _this._rows[index] = {};
          _this._rows[index][key] = value;
        });
      });

      this._checkConsistency();
    }

    /**
     * Updates object of arrays from array of objects.
     */

  }, {
    key: "updateFromRows",
    value: function updateFromRows() {
      var _this2 = this;

      this._rows.forEach(function (obj, index) {
        for (var key in obj) {
          if (index === 0) _this2._cols[key] = [];
          _this2._cols[key].push(obj[key]);
        }
      });

      this._checkConsistency();
    }

    /**
     * Sets an object of arrays.
     *
     * @type {Object<String, Array>}
     */

  }, {
    key: "cols",
    set: function set(obj) {
      this._cols = obj;
      this._rows = [];

      this.updateFromCols();
    }

    /**
     * Returns an object of arrays.
     *
     * @type {Object<String, Array>}
     */
    ,
    get: function get() {
      return this._cols;
    }

    /**
     * Sets an array of objects.
     *
     * @type {Array<Object>}
     */

  }, {
    key: "rows",
    set: function set(arr) {
      this._rows = arr;
      this._cols = {};

      this.updateFromRows();
    }

    /**
     * Returns an array of objects.
     *
     * @type {Array<Object>}
     */
    ,
    get: function get() {
      return this._rows;
    }
  }]);
  return OrthogonalData;
}();

exports.default = OrthogonalData;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9ydGhvZ29uYWwtZGF0YS5qcyJdLCJuYW1lcyI6WyJPcnRob2dvbmFsRGF0YSIsIl9jb2xzIiwiX3Jvd3MiLCJzaXplIiwia2V5IiwiY29sIiwiY29sTGVuZ3RoIiwibGVuZ3RoIiwiRXJyb3IiLCJwcm90b3R5cGUiLCJjb25zdHJ1Y3RvciIsIm5hbWUiLCJrZXlzIiwiZm9yRWFjaCIsImkiLCJ2YWx1ZSIsImluZGV4IiwidW5kZWZpbmVkIiwiX2NoZWNrQ29uc2lzdGVuY3kiLCJvYmoiLCJwdXNoIiwidXBkYXRlRnJvbUNvbHMiLCJhcnIiLCJ1cGRhdGVGcm9tUm93cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztJQUlxQkEsYztBQUNuQiw0QkFBYztBQUFBOztBQUNaLFNBQUtDLEtBQUwsR0FBYSxJQUFiLENBRFksQ0FDTztBQUNuQixTQUFLQyxLQUFMLEdBQWEsSUFBYixDQUZZLENBRU87QUFDcEI7O0FBRUQ7Ozs7Ozs7d0NBR29CO0FBQ2xCLFVBQUlDLE9BQU8sSUFBWDs7QUFFQSxXQUFLLElBQUlDLEdBQVQsSUFBZ0IsS0FBS0gsS0FBckIsRUFBNEI7QUFDMUIsWUFBTUksTUFBTSxLQUFLSixLQUFMLENBQVdHLEdBQVgsQ0FBWjtBQUNBLFlBQU1FLFlBQVlELElBQUlFLE1BQXRCOztBQUVBLFlBQUlKLFNBQVMsSUFBVCxJQUFpQkEsU0FBU0csU0FBOUIsRUFBeUM7QUFDdkMsZ0JBQU0sSUFBSUUsS0FBSixDQUFhLEtBQUtDLFNBQUwsQ0FBZUMsV0FBZixDQUEyQkMsSUFBeEMseUJBQU47QUFDRCxTQUZELE1BRU8sSUFBSVIsU0FBUyxJQUFiLEVBQW1CO0FBQ3hCQSxpQkFBT0csU0FBUDtBQUNEO0FBQ0Y7QUFDRjs7QUFFRDs7Ozs7O3FDQUdpQjtBQUFBOztBQUNmLFVBQUlNLE9BQU8sb0JBQVksS0FBS1gsS0FBakIsQ0FBWDs7QUFFQVcsV0FBS0MsT0FBTCxDQUFhLFVBQUNULEdBQUQsRUFBTVUsQ0FBTixFQUFZO0FBQ3ZCLFlBQU1ULE1BQU0sTUFBS0osS0FBTCxDQUFXRyxHQUFYLENBQVo7O0FBRUFDLFlBQUlRLE9BQUosQ0FBWSxVQUFDRSxLQUFELEVBQVFDLEtBQVIsRUFBa0I7QUFDNUIsY0FBSSxNQUFLZCxLQUFMLENBQVdjLEtBQVgsTUFBc0JDLFNBQTFCLEVBQXFDLE1BQUtmLEtBQUwsQ0FBV2MsS0FBWCxJQUFvQixFQUFwQjtBQUNyQyxnQkFBS2QsS0FBTCxDQUFXYyxLQUFYLEVBQWtCWixHQUFsQixJQUF5QlcsS0FBekI7QUFDRCxTQUhEO0FBSUQsT0FQRDs7QUFTQSxXQUFLRyxpQkFBTDtBQUNEOztBQUVEOzs7Ozs7cUNBR2lCO0FBQUE7O0FBQ2YsV0FBS2hCLEtBQUwsQ0FBV1csT0FBWCxDQUFtQixVQUFDTSxHQUFELEVBQU1ILEtBQU4sRUFBZ0I7QUFDakMsYUFBSyxJQUFJWixHQUFULElBQWdCZSxHQUFoQixFQUFxQjtBQUNuQixjQUFJSCxVQUFVLENBQWQsRUFBaUIsT0FBS2YsS0FBTCxDQUFXRyxHQUFYLElBQWtCLEVBQWxCO0FBQ2pCLGlCQUFLSCxLQUFMLENBQVdHLEdBQVgsRUFBZ0JnQixJQUFoQixDQUFxQkQsSUFBSWYsR0FBSixDQUFyQjtBQUNEO0FBQ0YsT0FMRDs7QUFPQSxXQUFLYyxpQkFBTDtBQUNEOztBQUVEOzs7Ozs7OztzQkFLU0MsRyxFQUFLO0FBQ1osV0FBS2xCLEtBQUwsR0FBYWtCLEdBQWI7QUFDQSxXQUFLakIsS0FBTCxHQUFhLEVBQWI7O0FBRUEsV0FBS21CLGNBQUw7QUFDRDs7QUFFRDs7Ozs7O3dCQUtXO0FBQ1QsYUFBTyxLQUFLcEIsS0FBWjtBQUNEOztBQUVEOzs7Ozs7OztzQkFLU3FCLEcsRUFBSztBQUNaLFdBQUtwQixLQUFMLEdBQWFvQixHQUFiO0FBQ0EsV0FBS3JCLEtBQUwsR0FBYSxFQUFiOztBQUVBLFdBQUtzQixjQUFMO0FBQ0Q7O0FBRUQ7Ozs7Ozt3QkFLVztBQUNULGFBQU8sS0FBS3JCLEtBQVo7QUFDRDs7Ozs7a0JBaEdrQkYsYyIsImZpbGUiOiJvcnRob2dvbmFsLWRhdGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIE9ydGhvZ29uYWxEYXRhIHRyYW5zZm9ybXMgYW4gb2JqZWN0IG9mIGFycmF5cyBge2ZvbzogWzEsIDJdLCBiYXI6IFszLCA0XX1gXG4gKiB0byBvciBmcm9tIGFuIGFycmF5IG9mIG9iamVjdHMgYFt7Zm9vOiAxLCBiYXI6IDN9LCB7Zm9vOiAyLCBiYXI6IDR9XWBcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT3J0aG9nb25hbERhdGEge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9jb2xzID0gbnVsbDsgLy8gT2JqZWN0IG9mIGFycmF5c1xuICAgIHRoaXMuX3Jvd3MgPSBudWxsOyAvLyBBcnJheSBvZiBvYmplY3RzXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgdGhlIGNvbnNpc3RlbmN5IG9mIHRoZSBkYXRhLlxuICAgKi9cbiAgX2NoZWNrQ29uc2lzdGVuY3koKSB7XG4gICAgbGV0IHNpemUgPSBudWxsO1xuXG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuX2NvbHMpIHtcbiAgICAgIGNvbnN0IGNvbCA9IHRoaXMuX2NvbHNba2V5XTtcbiAgICAgIGNvbnN0IGNvbExlbmd0aCA9IGNvbC5sZW5ndGg7XG5cbiAgICAgIGlmIChzaXplICE9PSBudWxsICYmIHNpemUgIT09IGNvbExlbmd0aCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dGhpcy5wcm90b3R5cGUuY29uc3RydWN0b3IubmFtZX06IGluY29uc2lzdGVudCBkYXRhYCk7XG4gICAgICB9IGVsc2UgaWYgKHNpemUgPT09IG51bGwpIHtcbiAgICAgICAgc2l6ZSA9IGNvbExlbmd0aDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyBhcnJheSBvZiBvYmplY3RzIGZyb20gb2JqZWN0IG9mIGFycmF5cy5cbiAgICovXG4gIHVwZGF0ZUZyb21Db2xzKCkge1xuICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXModGhpcy5fY29scyk7XG5cbiAgICBrZXlzLmZvckVhY2goKGtleSwgaSkgPT4ge1xuICAgICAgY29uc3QgY29sID0gdGhpcy5fY29sc1trZXldO1xuXG4gICAgICBjb2wuZm9yRWFjaCgodmFsdWUsIGluZGV4KSA9PiB7XG4gICAgICAgIGlmICh0aGlzLl9yb3dzW2luZGV4XSA9PT0gdW5kZWZpbmVkKSB0aGlzLl9yb3dzW2luZGV4XSA9IHt9O1xuICAgICAgICB0aGlzLl9yb3dzW2luZGV4XVtrZXldID0gdmFsdWU7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMuX2NoZWNrQ29uc2lzdGVuY3koKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIG9iamVjdCBvZiBhcnJheXMgZnJvbSBhcnJheSBvZiBvYmplY3RzLlxuICAgKi9cbiAgdXBkYXRlRnJvbVJvd3MoKSB7XG4gICAgdGhpcy5fcm93cy5mb3JFYWNoKChvYmosIGluZGV4KSA9PiB7XG4gICAgICBmb3IgKGxldCBrZXkgaW4gb2JqKSB7XG4gICAgICAgIGlmIChpbmRleCA9PT0gMCkgdGhpcy5fY29sc1trZXldID0gW107XG4gICAgICAgIHRoaXMuX2NvbHNba2V5XS5wdXNoKG9ialtrZXldKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuX2NoZWNrQ29uc2lzdGVuY3koKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGFuIG9iamVjdCBvZiBhcnJheXMuXG4gICAqXG4gICAqIEB0eXBlIHtPYmplY3Q8U3RyaW5nLCBBcnJheT59XG4gICAqL1xuICBzZXQgY29scyhvYmopIHtcbiAgICB0aGlzLl9jb2xzID0gb2JqO1xuICAgIHRoaXMuX3Jvd3MgPSBbXTtcblxuICAgIHRoaXMudXBkYXRlRnJvbUNvbHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIG9iamVjdCBvZiBhcnJheXMuXG4gICAqXG4gICAqIEB0eXBlIHtPYmplY3Q8U3RyaW5nLCBBcnJheT59XG4gICAqL1xuICBnZXQgY29scygpIHtcbiAgICByZXR1cm4gdGhpcy5fY29scztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGFuIGFycmF5IG9mIG9iamVjdHMuXG4gICAqXG4gICAqIEB0eXBlIHtBcnJheTxPYmplY3Q+fVxuICAgKi9cbiAgc2V0IHJvd3MoYXJyKSB7XG4gICAgdGhpcy5fcm93cyA9IGFycjtcbiAgICB0aGlzLl9jb2xzID0ge307XG5cbiAgICB0aGlzLnVwZGF0ZUZyb21Sb3dzKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBhcnJheSBvZiBvYmplY3RzLlxuICAgKlxuICAgKiBAdHlwZSB7QXJyYXk8T2JqZWN0Pn1cbiAgICovXG4gIGdldCByb3dzKCkge1xuICAgIHJldHVybiB0aGlzLl9yb3dzO1xuICB9XG59XG4iXX0=