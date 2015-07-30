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
      console.log(_slope, _intercept);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9zY2FsZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7cUJBQWU7QUFDYixRQUFNLEVBQUEsa0JBQUc7QUFDUCxRQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNyQixRQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFcEIsUUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2YsUUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDOztBQUVuQixhQUFTLFlBQVksR0FBRztBQUN0QixZQUFNLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBLElBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQSxBQUFDLENBQUM7QUFDN0QsZ0JBQVUsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQUFBQyxDQUFDO0FBQy9DLGFBQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0tBQ2pDOztBQUVELGFBQVMsS0FBSyxDQUFFLEtBQUssRUFBRTtBQUNyQixhQUFPLEFBQUMsTUFBTSxHQUFHLEtBQUssR0FBSSxVQUFVLENBQUM7S0FDdEM7O0FBRUQsU0FBSyxDQUFDLE1BQU0sR0FBRyxVQUFTLEtBQUssRUFBRTtBQUM3QixhQUFPLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQSxHQUFJLE1BQU0sQ0FBQztLQUN0QyxDQUFDOztBQUVGLFNBQUssQ0FBQyxNQUFNLEdBQUcsWUFBcUI7VUFBWixHQUFHLHlEQUFHLElBQUk7O0FBQ2hDLFVBQUksR0FBRyxLQUFLLElBQUksRUFBRTtBQUFFLGVBQU8sT0FBTyxDQUFDO09BQUU7O0FBRXJDLGFBQU8sR0FBRyxHQUFHLENBQUM7QUFDZCxrQkFBWSxFQUFFLENBQUM7O0FBRWYsYUFBTyxLQUFLLENBQUM7S0FDZCxDQUFDOztBQUVGLFNBQUssQ0FBQyxLQUFLLEdBQUcsWUFBcUI7VUFBWixHQUFHLHlEQUFHLElBQUk7O0FBQy9CLFVBQUksR0FBRyxLQUFLLElBQUksRUFBRTtBQUFFLGVBQU8sTUFBTSxDQUFDO09BQUU7O0FBRXBDLFlBQU0sR0FBRyxHQUFHLENBQUM7QUFDYixrQkFBWSxFQUFFLENBQUM7O0FBRWYsYUFBTyxLQUFLLENBQUM7S0FDZCxDQUFDOztBQUVGLFdBQU8sS0FBSyxDQUFDO0dBQ2Q7Q0FDRiIsImZpbGUiOiJlczYvdXRpbHMvc2NhbGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQge1xuICBsaW5lYXIoKSB7XG4gICAgbGV0IF9kb21haW4gPSBbMCwgMV07XG4gICAgbGV0IF9yYW5nZSA9IFswLCAxXTtcblxuICAgIGxldCBfc2xvcGUgPSAxO1xuICAgIGxldCBfaW50ZXJjZXB0ID0gMDtcblxuICAgIGZ1bmN0aW9uIF91cGRhdGVDb2VmcygpIHtcbiAgICAgIF9zbG9wZSA9IChfcmFuZ2VbMV0gLSBfcmFuZ2VbMF0pIC8gKF9kb21haW5bMV0gLSBfZG9tYWluWzBdKTtcbiAgICAgIF9pbnRlcmNlcHQgPSBfcmFuZ2VbMF0gLSAoX3Nsb3BlICogX2RvbWFpblswXSk7XG4gICAgICBjb25zb2xlLmxvZyhfc2xvcGUsIF9pbnRlcmNlcHQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNjYWxlICh2YWx1ZSkge1xuICAgICAgcmV0dXJuIChfc2xvcGUgKiB2YWx1ZSkgKyBfaW50ZXJjZXB0O1xuICAgIH1cblxuICAgIHNjYWxlLmludmVydCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gKHZhbHVlIC0gX2ludGVyY2VwdCkgLyBfc2xvcGU7XG4gICAgfTtcblxuICAgIHNjYWxlLmRvbWFpbiA9IGZ1bmN0aW9uKGFyciA9IG51bGwpIHtcbiAgICAgIGlmIChhcnIgPT09IG51bGwpIHsgcmV0dXJuIF9kb21haW47IH1cblxuICAgICAgX2RvbWFpbiA9IGFycjtcbiAgICAgIF91cGRhdGVDb2VmcygpO1xuXG4gICAgICByZXR1cm4gc2NhbGU7XG4gICAgfTtcblxuICAgIHNjYWxlLnJhbmdlID0gZnVuY3Rpb24oYXJyID0gbnVsbCkge1xuICAgICAgaWYgKGFyciA9PT0gbnVsbCkgeyByZXR1cm4gX3JhbmdlOyB9XG5cbiAgICAgIF9yYW5nZSA9IGFycjtcbiAgICAgIF91cGRhdGVDb2VmcygpO1xuXG4gICAgICByZXR1cm4gc2NhbGU7XG4gICAgfTtcblxuICAgIHJldHVybiBzY2FsZTtcbiAgfVxufTtcbiJdfQ==