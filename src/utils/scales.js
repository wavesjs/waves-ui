/**
 * Lightweight scales mimicing the `d3.js` functionnal API.
 */
export default {
  /**
   * A linear scale interpolating values between a `domain` and a `range`.
   * @return {Function}
   */
  linear() {
    let _domain = [0, 1];
    let _range = [0, 1];

    let _slope = 1;
    let _intercept = 0;

    function _updateCoefs() {
      _slope = (_range[1] - _range[0]) / (_domain[1] - _domain[0]);
      _intercept = _range[0] - (_slope * _domain[0]);
    }

    function scale (value) {
      return (_slope * value) + _intercept;
    }

    scale.invert = function(value) {
      return (value - _intercept) / _slope;
    };

    scale.domain = function(arr = null) {
      if (arr === null) { return _domain; }

      _domain = arr;
      _updateCoefs();

      return scale;
    };

    scale.range = function(arr = null) {
      if (arr === null) { return _range; }

      _range = arr;
      _updateCoefs();

      return scale;
    };

    return scale;
  }
};
