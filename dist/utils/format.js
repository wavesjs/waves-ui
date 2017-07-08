/**
 * Formatting helpers functions.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  /**
   * Add a `sign` to the left of a given `input` to match `length`
   *
   * @param {String} input - The string to format.
   * @param {String} sign - The character to add to the left.
   * @param {Number} length - The length of the output string.
   */
  padLeft: function padLeft(input, sign, length) {
    input += '';
    while (input.length < length) {
      input = sign + input;
    }
    return input;
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy91dGlscy9mb3JtYXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7cUJBR2U7Ozs7Ozs7O0FBUWIsU0FBTyxFQUFBLGlCQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO0FBQzNCLFNBQUssSUFBSSxFQUFFLENBQUM7QUFDWixXQUFPLEtBQUssQ0FBQyxNQUFNLEdBQUcsTUFBTSxFQUFFO0FBQzVCLFdBQUssR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO0tBQ3RCO0FBQ0QsV0FBTyxLQUFLLENBQUM7R0FDZDtDQUNGIiwiZmlsZSI6InNyYy91dGlscy9mb3JtYXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEZvcm1hdHRpbmcgaGVscGVycyBmdW5jdGlvbnMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IHtcbiAgLyoqXG4gICAqIEFkZCBhIGBzaWduYCB0byB0aGUgbGVmdCBvZiBhIGdpdmVuIGBpbnB1dGAgdG8gbWF0Y2ggYGxlbmd0aGBcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGlucHV0IC0gVGhlIHN0cmluZyB0byBmb3JtYXQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzaWduIC0gVGhlIGNoYXJhY3RlciB0byBhZGQgdG8gdGhlIGxlZnQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBsZW5ndGggLSBUaGUgbGVuZ3RoIG9mIHRoZSBvdXRwdXQgc3RyaW5nLlxuICAgKi9cbiAgcGFkTGVmdChpbnB1dCwgc2lnbiwgbGVuZ3RoKSB7XG4gICAgaW5wdXQgKz0gJyc7XG4gICAgd2hpbGUgKGlucHV0Lmxlbmd0aCA8IGxlbmd0aCkge1xuICAgICAgaW5wdXQgPSBzaWduICsgaW5wdXQ7XG4gICAgfVxuICAgIHJldHVybiBpbnB1dDtcbiAgfVxufTtcbiJdfQ==