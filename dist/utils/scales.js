"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy93YXZlcy11aS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztxQkFBZTtBQUNiLFFBQU0sRUFBQSxrQkFBRztBQUNQLFFBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3JCLFFBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUVwQixRQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDZixRQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7O0FBRW5CLGFBQVMsWUFBWSxHQUFHO0FBQ3RCLFlBQU0sR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUEsSUFBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQztBQUM3RCxnQkFBVSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxBQUFDLENBQUM7S0FDaEQ7O0FBRUQsYUFBUyxLQUFLLENBQUUsS0FBSyxFQUFFO0FBQ3JCLGFBQU8sQUFBQyxNQUFNLEdBQUcsS0FBSyxHQUFJLFVBQVUsQ0FBQztLQUN0Qzs7QUFFRCxTQUFLLENBQUMsTUFBTSxHQUFHLFVBQVMsS0FBSyxFQUFFO0FBQzdCLGFBQU8sQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFBLEdBQUksTUFBTSxDQUFDO0tBQ3RDLENBQUM7O0FBRUYsU0FBSyxDQUFDLE1BQU0sR0FBRyxZQUFxQjtVQUFaLEdBQUcseURBQUcsSUFBSTs7QUFDaEMsVUFBSSxHQUFHLEtBQUssSUFBSSxFQUFFO0FBQUUsZUFBTyxPQUFPLENBQUM7T0FBRTs7QUFFckMsYUFBTyxHQUFHLEdBQUcsQ0FBQztBQUNkLGtCQUFZLEVBQUUsQ0FBQzs7QUFFZixhQUFPLEtBQUssQ0FBQztLQUNkLENBQUM7O0FBRUYsU0FBSyxDQUFDLEtBQUssR0FBRyxZQUFxQjtVQUFaLEdBQUcseURBQUcsSUFBSTs7QUFDL0IsVUFBSSxHQUFHLEtBQUssSUFBSSxFQUFFO0FBQUUsZUFBTyxNQUFNLENBQUM7T0FBRTs7QUFFcEMsWUFBTSxHQUFHLEdBQUcsQ0FBQztBQUNiLGtCQUFZLEVBQUUsQ0FBQzs7QUFFZixhQUFPLEtBQUssQ0FBQztLQUNkLENBQUM7O0FBRUYsV0FBTyxLQUFLLENBQUM7R0FDZDtDQUNGIiwiZmlsZSI6InNyYy93YXZlcy11aS5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IHtcbiAgbGluZWFyKCkge1xuICAgIGxldCBfZG9tYWluID0gWzAsIDFdO1xuICAgIGxldCBfcmFuZ2UgPSBbMCwgMV07XG5cbiAgICBsZXQgX3Nsb3BlID0gMTtcbiAgICBsZXQgX2ludGVyY2VwdCA9IDA7XG5cbiAgICBmdW5jdGlvbiBfdXBkYXRlQ29lZnMoKSB7XG4gICAgICBfc2xvcGUgPSAoX3JhbmdlWzFdIC0gX3JhbmdlWzBdKSAvIChfZG9tYWluWzFdIC0gX2RvbWFpblswXSk7XG4gICAgICBfaW50ZXJjZXB0ID0gX3JhbmdlWzBdIC0gKF9zbG9wZSAqIF9kb21haW5bMF0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNjYWxlICh2YWx1ZSkge1xuICAgICAgcmV0dXJuIChfc2xvcGUgKiB2YWx1ZSkgKyBfaW50ZXJjZXB0O1xuICAgIH1cblxuICAgIHNjYWxlLmludmVydCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gKHZhbHVlIC0gX2ludGVyY2VwdCkgLyBfc2xvcGU7XG4gICAgfTtcblxuICAgIHNjYWxlLmRvbWFpbiA9IGZ1bmN0aW9uKGFyciA9IG51bGwpIHtcbiAgICAgIGlmIChhcnIgPT09IG51bGwpIHsgcmV0dXJuIF9kb21haW47IH1cblxuICAgICAgX2RvbWFpbiA9IGFycjtcbiAgICAgIF91cGRhdGVDb2VmcygpO1xuXG4gICAgICByZXR1cm4gc2NhbGU7XG4gICAgfTtcblxuICAgIHNjYWxlLnJhbmdlID0gZnVuY3Rpb24oYXJyID0gbnVsbCkge1xuICAgICAgaWYgKGFyciA9PT0gbnVsbCkgeyByZXR1cm4gX3JhbmdlOyB9XG5cbiAgICAgIF9yYW5nZSA9IGFycjtcbiAgICAgIF91cGRhdGVDb2VmcygpO1xuXG4gICAgICByZXR1cm4gc2NhbGU7XG4gICAgfTtcblxuICAgIHJldHVybiBzY2FsZTtcbiAgfVxufTtcbiJdfQ==