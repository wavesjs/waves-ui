"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Lightweight scales mimicing the `d3.js` functionnal API.
 */
exports.default = {
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
      var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (arr === null) {
        return _domain;
      }

      _domain = arr;
      _updateCoefs();

      return scale;
    };

    scale.range = function () {
      var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNjYWxlcy5qcyJdLCJuYW1lcyI6WyJsaW5lYXIiLCJfZG9tYWluIiwiX3JhbmdlIiwiX3Nsb3BlIiwiX2ludGVyY2VwdCIsIl91cGRhdGVDb2VmcyIsInNjYWxlIiwidmFsdWUiLCJpbnZlcnQiLCJkb21haW4iLCJhcnIiLCJyYW5nZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTs7O2tCQUdlO0FBQ2I7Ozs7QUFJQUEsUUFMYSxvQkFLSjtBQUNQLFFBQUlDLFVBQVUsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFkO0FBQ0EsUUFBSUMsU0FBUyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWI7O0FBRUEsUUFBSUMsU0FBUyxDQUFiO0FBQ0EsUUFBSUMsYUFBYSxDQUFqQjs7QUFFQSxhQUFTQyxZQUFULEdBQXdCO0FBQ3RCRixlQUFTLENBQUNELE9BQU8sQ0FBUCxJQUFZQSxPQUFPLENBQVAsQ0FBYixLQUEyQkQsUUFBUSxDQUFSLElBQWFBLFFBQVEsQ0FBUixDQUF4QyxDQUFUO0FBQ0FHLG1CQUFhRixPQUFPLENBQVAsSUFBYUMsU0FBU0YsUUFBUSxDQUFSLENBQW5DO0FBQ0Q7O0FBRUQsYUFBU0ssS0FBVCxDQUFnQkMsS0FBaEIsRUFBdUI7QUFDckIsYUFBUUosU0FBU0ksS0FBVixHQUFtQkgsVUFBMUI7QUFDRDs7QUFFREUsVUFBTUUsTUFBTixHQUFlLFVBQVNELEtBQVQsRUFBZ0I7QUFDN0IsYUFBTyxDQUFDQSxRQUFRSCxVQUFULElBQXVCRCxNQUE5QjtBQUNELEtBRkQ7O0FBSUFHLFVBQU1HLE1BQU4sR0FBZSxZQUFxQjtBQUFBLFVBQVpDLEdBQVksdUVBQU4sSUFBTTs7QUFDbEMsVUFBSUEsUUFBUSxJQUFaLEVBQWtCO0FBQUUsZUFBT1QsT0FBUDtBQUFpQjs7QUFFckNBLGdCQUFVUyxHQUFWO0FBQ0FMOztBQUVBLGFBQU9DLEtBQVA7QUFDRCxLQVBEOztBQVNBQSxVQUFNSyxLQUFOLEdBQWMsWUFBcUI7QUFBQSxVQUFaRCxHQUFZLHVFQUFOLElBQU07O0FBQ2pDLFVBQUlBLFFBQVEsSUFBWixFQUFrQjtBQUFFLGVBQU9SLE1BQVA7QUFBZ0I7O0FBRXBDQSxlQUFTUSxHQUFUO0FBQ0FMOztBQUVBLGFBQU9DLEtBQVA7QUFDRCxLQVBEOztBQVNBLFdBQU9BLEtBQVA7QUFDRDtBQTVDWSxDIiwiZmlsZSI6InNjYWxlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogTGlnaHR3ZWlnaHQgc2NhbGVzIG1pbWljaW5nIHRoZSBgZDMuanNgIGZ1bmN0aW9ubmFsIEFQSS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuICAvKipcbiAgICogQSBsaW5lYXIgc2NhbGUgaW50ZXJwb2xhdGluZyB2YWx1ZXMgYmV0d2VlbiBhIGBkb21haW5gIGFuZCBhIGByYW5nZWAuXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICAgKi9cbiAgbGluZWFyKCkge1xuICAgIGxldCBfZG9tYWluID0gWzAsIDFdO1xuICAgIGxldCBfcmFuZ2UgPSBbMCwgMV07XG5cbiAgICBsZXQgX3Nsb3BlID0gMTtcbiAgICBsZXQgX2ludGVyY2VwdCA9IDA7XG5cbiAgICBmdW5jdGlvbiBfdXBkYXRlQ29lZnMoKSB7XG4gICAgICBfc2xvcGUgPSAoX3JhbmdlWzFdIC0gX3JhbmdlWzBdKSAvIChfZG9tYWluWzFdIC0gX2RvbWFpblswXSk7XG4gICAgICBfaW50ZXJjZXB0ID0gX3JhbmdlWzBdIC0gKF9zbG9wZSAqIF9kb21haW5bMF0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNjYWxlICh2YWx1ZSkge1xuICAgICAgcmV0dXJuIChfc2xvcGUgKiB2YWx1ZSkgKyBfaW50ZXJjZXB0O1xuICAgIH1cblxuICAgIHNjYWxlLmludmVydCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gKHZhbHVlIC0gX2ludGVyY2VwdCkgLyBfc2xvcGU7XG4gICAgfTtcblxuICAgIHNjYWxlLmRvbWFpbiA9IGZ1bmN0aW9uKGFyciA9IG51bGwpIHtcbiAgICAgIGlmIChhcnIgPT09IG51bGwpIHsgcmV0dXJuIF9kb21haW47IH1cblxuICAgICAgX2RvbWFpbiA9IGFycjtcbiAgICAgIF91cGRhdGVDb2VmcygpO1xuXG4gICAgICByZXR1cm4gc2NhbGU7XG4gICAgfTtcblxuICAgIHNjYWxlLnJhbmdlID0gZnVuY3Rpb24oYXJyID0gbnVsbCkge1xuICAgICAgaWYgKGFyciA9PT0gbnVsbCkgeyByZXR1cm4gX3JhbmdlOyB9XG5cbiAgICAgIF9yYW5nZSA9IGFycjtcbiAgICAgIF91cGRhdGVDb2VmcygpO1xuXG4gICAgICByZXR1cm4gc2NhbGU7XG4gICAgfTtcblxuICAgIHJldHVybiBzY2FsZTtcbiAgfVxufTtcbiJdfQ==