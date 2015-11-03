/**
 * OrthogonalData transforms an object of arrays `{foo: [1, 2], bar: [3, 4]}`
 * to or from an array of objects `[{foo: 1, bar: 3}, {foo: 2, bar: 4}]`
 */
"use strict";

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _Object$keys = require("babel-runtime/core-js/object/keys")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var OrthogonalData = (function () {
  function OrthogonalData() {
    _classCallCheck(this, OrthogonalData);

    this._cols = null; // Object of arrays
    this._rows = null; // Array of objects
  }

  // verify that data are consistents

  _createClass(OrthogonalData, [{
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
     * Update array of objects from object of arrays
     */
  }, {
    key: "updateFromCols",
    value: function updateFromCols() {
      var _this = this;

      var keys = _Object$keys(this._cols);

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
     * Update object of arrays from array of objects
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
     * Set an object of arrays
     */
  }, {
    key: "cols",
    set: function set(obj) {
      this._cols = obj;
      this._rows = [];

      this.updateFromCols();
    },

    /**
     * Set an array of objects
     */

    /**
     * Get an object of arrays
     */
    get: function get() {
      return this._cols;
    }

    /**
     * Get an array of objects
     */
  }, {
    key: "rows",
    set: function set(arr) {
      this._rows = arr;
      this._cols = {};

      this.updateFromRows();
    },
    get: function get() {
      return this._rows;
    }
  }]);

  return OrthogonalData;
})();

exports["default"] = OrthogonalData;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,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anMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIE9ydGhvZ29uYWxEYXRhIHRyYW5zZm9ybXMgYW4gb2JqZWN0IG9mIGFycmF5cyBge2ZvbzogWzEsIDJdLCBiYXI6IFszLCA0XX1gXG4gKiB0byBvciBmcm9tIGFuIGFycmF5IG9mIG9iamVjdHMgYFt7Zm9vOiAxLCBiYXI6IDN9LCB7Zm9vOiAyLCBiYXI6IDR9XWBcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT3J0aG9nb25hbERhdGEge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9jb2xzID0gbnVsbDsgLy8gT2JqZWN0IG9mIGFycmF5c1xuICAgIHRoaXMuX3Jvd3MgPSBudWxsOyAvLyBBcnJheSBvZiBvYmplY3RzXG4gIH1cblxuICAvLyB2ZXJpZnkgdGhhdCBkYXRhIGFyZSBjb25zaXN0ZW50c1xuICBfY2hlY2tDb25zaXN0ZW5jeSgpIHtcbiAgICBsZXQgc2l6ZSA9IG51bGw7XG5cbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5fY29scykge1xuICAgICAgY29uc3QgY29sID0gdGhpcy5fY29sc1trZXldO1xuICAgICAgY29uc3QgY29sTGVuZ3RoID0gY29sLmxlbmd0aDtcblxuICAgICAgaWYgKHNpemUgIT09IG51bGwgJiYgc2l6ZSAhPT0gY29sTGVuZ3RoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzLnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5uYW1lfTogaW5jb25zaXN0ZW50IGRhdGFgKTtcbiAgICAgIH0gZWxzZSBpZiAoc2l6ZSA9PT0gbnVsbCkge1xuICAgICAgICBzaXplID0gY29sTGVuZ3RoO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgYXJyYXkgb2Ygb2JqZWN0cyBmcm9tIG9iamVjdCBvZiBhcnJheXNcbiAgICovXG4gIHVwZGF0ZUZyb21Db2xzKCkge1xuICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXModGhpcy5fY29scyk7XG5cbiAgICBrZXlzLmZvckVhY2goKGtleSwgaSkgPT4ge1xuICAgICAgY29uc3QgY29sID0gdGhpcy5fY29sc1trZXldO1xuXG4gICAgICBjb2wuZm9yRWFjaCgodmFsdWUsIGluZGV4KSA9PiB7XG4gICAgICAgIGlmICh0aGlzLl9yb3dzW2luZGV4XSA9PT0gdW5kZWZpbmVkKSB0aGlzLl9yb3dzW2luZGV4XSA9IHt9O1xuICAgICAgICB0aGlzLl9yb3dzW2luZGV4XVtrZXldID0gdmFsdWU7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMuX2NoZWNrQ29uc2lzdGVuY3koKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgb2JqZWN0IG9mIGFycmF5cyBmcm9tIGFycmF5IG9mIG9iamVjdHNcbiAgICovXG4gIHVwZGF0ZUZyb21Sb3dzKCkge1xuICAgIHRoaXMuX3Jvd3MuZm9yRWFjaCgob2JqLCBpbmRleCkgPT4ge1xuICAgICAgZm9yIChsZXQga2V5IGluIG9iaikge1xuICAgICAgICBpZiAoaW5kZXggPT09IDApIHRoaXMuX2NvbHNba2V5XSA9IFtdO1xuICAgICAgICB0aGlzLl9jb2xzW2tleV0ucHVzaChvYmpba2V5XSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLl9jaGVja0NvbnNpc3RlbmN5KCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0IGFuIG9iamVjdCBvZiBhcnJheXNcbiAgICovXG4gIHNldCBjb2xzKG9iaikge1xuICAgIHRoaXMuX2NvbHMgPSBvYmo7XG4gICAgdGhpcy5fcm93cyA9IFtdO1xuXG4gICAgdGhpcy51cGRhdGVGcm9tQ29scygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCBhbiBhcnJheSBvZiBvYmplY3RzXG4gICAqL1xuICBzZXQgcm93cyhhcnIpIHtcbiAgICB0aGlzLl9yb3dzID0gYXJyO1xuICAgIHRoaXMuX2NvbHMgPSB7fTtcblxuICAgIHRoaXMudXBkYXRlRnJvbVJvd3MoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYW4gb2JqZWN0IG9mIGFycmF5c1xuICAgKi9cbiAgZ2V0IGNvbHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbHM7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGFuIGFycmF5IG9mIG9iamVjdHNcbiAgICovXG4gIGdldCByb3dzKCkge1xuICAgIHJldHVybiB0aGlzLl9yb3dzO1xuICB9XG59XG4iXX0=