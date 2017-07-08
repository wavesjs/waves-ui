/**
 * Lightweight scales mimicing the `d3.js` functionnal API.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = {
  /**
   * A linear scale interpolating values between a `domain` and a `range`.
   * @return {Function}
   */
  linear: function linear() {
    var _domain = [0, 1];
    var _range = [0, 1];

    var _slope = 1;
    var _intercept = 0;

    function _updateCoefs() {
      _slope = (_range[1] - _range[0]) / (_domain[1] - _domain[0]);
      _intercept = _range[0] - _slope * _domain[0];
    }

    function scale(value) {
      return _slope * value + _intercept;
    }

    scale.invert = function (value) {
      return (value - _intercept) / _slope;
    };

    scale.domain = function () {
      var arr = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (arr === null) {
        return _domain;
      }

      _domain = arr;
      _updateCoefs();

      return scale;
    };

    scale.range = function () {
      var arr = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (arr === null) {
        return _range;
      }

      _range = arr;
      _updateCoefs();

      return scale;
    };

    return scale;
  }
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy91dGlscy9zY2FsZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7cUJBR2U7Ozs7O0FBS2IsUUFBTSxFQUFBLGtCQUFHO0FBQ1AsUUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDckIsUUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRXBCLFFBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNmLFFBQUksVUFBVSxHQUFHLENBQUMsQ0FBQzs7QUFFbkIsYUFBUyxZQUFZLEdBQUc7QUFDdEIsWUFBTSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQSxJQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUEsQUFBQyxDQUFDO0FBQzdELGdCQUFVLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLEFBQUMsQ0FBQztLQUNoRDs7QUFFRCxhQUFTLEtBQUssQ0FBRSxLQUFLLEVBQUU7QUFDckIsYUFBTyxBQUFDLE1BQU0sR0FBRyxLQUFLLEdBQUksVUFBVSxDQUFDO0tBQ3RDOztBQUVELFNBQUssQ0FBQyxNQUFNLEdBQUcsVUFBUyxLQUFLLEVBQUU7QUFDN0IsYUFBTyxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUEsR0FBSSxNQUFNLENBQUM7S0FDdEMsQ0FBQzs7QUFFRixTQUFLLENBQUMsTUFBTSxHQUFHLFlBQXFCO1VBQVosR0FBRyx5REFBRyxJQUFJOztBQUNoQyxVQUFJLEdBQUcsS0FBSyxJQUFJLEVBQUU7QUFBRSxlQUFPLE9BQU8sQ0FBQztPQUFFOztBQUVyQyxhQUFPLEdBQUcsR0FBRyxDQUFDO0FBQ2Qsa0JBQVksRUFBRSxDQUFDOztBQUVmLGFBQU8sS0FBSyxDQUFDO0tBQ2QsQ0FBQzs7QUFFRixTQUFLLENBQUMsS0FBSyxHQUFHLFlBQXFCO1VBQVosR0FBRyx5REFBRyxJQUFJOztBQUMvQixVQUFJLEdBQUcsS0FBSyxJQUFJLEVBQUU7QUFBRSxlQUFPLE1BQU0sQ0FBQztPQUFFOztBQUVwQyxZQUFNLEdBQUcsR0FBRyxDQUFDO0FBQ2Isa0JBQVksRUFBRSxDQUFDOztBQUVmLGFBQU8sS0FBSyxDQUFDO0tBQ2QsQ0FBQzs7QUFFRixXQUFPLEtBQUssQ0FBQztHQUNkO0NBQ0YiLCJmaWxlIjoic3JjL3V0aWxzL3NjYWxlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogTGlnaHR3ZWlnaHQgc2NhbGVzIG1pbWljaW5nIHRoZSBgZDMuanNgIGZ1bmN0aW9ubmFsIEFQSS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuICAvKipcbiAgICogQSBsaW5lYXIgc2NhbGUgaW50ZXJwb2xhdGluZyB2YWx1ZXMgYmV0d2VlbiBhIGBkb21haW5gIGFuZCBhIGByYW5nZWAuXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICAgKi9cbiAgbGluZWFyKCkge1xuICAgIGxldCBfZG9tYWluID0gWzAsIDFdO1xuICAgIGxldCBfcmFuZ2UgPSBbMCwgMV07XG5cbiAgICBsZXQgX3Nsb3BlID0gMTtcbiAgICBsZXQgX2ludGVyY2VwdCA9IDA7XG5cbiAgICBmdW5jdGlvbiBfdXBkYXRlQ29lZnMoKSB7XG4gICAgICBfc2xvcGUgPSAoX3JhbmdlWzFdIC0gX3JhbmdlWzBdKSAvIChfZG9tYWluWzFdIC0gX2RvbWFpblswXSk7XG4gICAgICBfaW50ZXJjZXB0ID0gX3JhbmdlWzBdIC0gKF9zbG9wZSAqIF9kb21haW5bMF0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNjYWxlICh2YWx1ZSkge1xuICAgICAgcmV0dXJuIChfc2xvcGUgKiB2YWx1ZSkgKyBfaW50ZXJjZXB0O1xuICAgIH1cblxuICAgIHNjYWxlLmludmVydCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gKHZhbHVlIC0gX2ludGVyY2VwdCkgLyBfc2xvcGU7XG4gICAgfTtcblxuICAgIHNjYWxlLmRvbWFpbiA9IGZ1bmN0aW9uKGFyciA9IG51bGwpIHtcbiAgICAgIGlmIChhcnIgPT09IG51bGwpIHsgcmV0dXJuIF9kb21haW47IH1cblxuICAgICAgX2RvbWFpbiA9IGFycjtcbiAgICAgIF91cGRhdGVDb2VmcygpO1xuXG4gICAgICByZXR1cm4gc2NhbGU7XG4gICAgfTtcblxuICAgIHNjYWxlLnJhbmdlID0gZnVuY3Rpb24oYXJyID0gbnVsbCkge1xuICAgICAgaWYgKGFyciA9PT0gbnVsbCkgeyByZXR1cm4gX3JhbmdlOyB9XG5cbiAgICAgIF9yYW5nZSA9IGFycjtcbiAgICAgIF91cGRhdGVDb2VmcygpO1xuXG4gICAgICByZXR1cm4gc2NhbGU7XG4gICAgfTtcblxuICAgIHJldHVybiBzY2FsZTtcbiAgfVxufTtcbiJdfQ==