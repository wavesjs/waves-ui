'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Add `sign` to the left of a given `input` until it matches match `length`
 *
 * @param {String} input - String to format
 * @param {String} sign - Character to add to the left
 * @param {Number} length - Length of the output string
 */
var padLeft = exports.padLeft = function padLeft(input, sign, length) {
  input += ''; // make sure we deal with a string

  while (input.length < length) {
    input = sign + input;
  }return input;
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvcm1hdC5qcyJdLCJuYW1lcyI6WyJwYWRMZWZ0IiwiaW5wdXQiLCJzaWduIiwibGVuZ3RoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQTs7Ozs7OztBQU9PLElBQU1BLDRCQUFVLFNBQVZBLE9BQVUsQ0FBQ0MsS0FBRCxFQUFRQyxJQUFSLEVBQWNDLE1BQWQsRUFBeUI7QUFDOUNGLFdBQVMsRUFBVCxDQUQ4QyxDQUNqQzs7QUFFYixTQUFPQSxNQUFNRSxNQUFOLEdBQWVBLE1BQXRCO0FBQ0VGLFlBQVFDLE9BQU9ELEtBQWY7QUFERixHQUdBLE9BQU9BLEtBQVA7QUFDRCxDQVBNIiwiZmlsZSI6ImZvcm1hdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLyoqXG4gKiBBZGQgYHNpZ25gIHRvIHRoZSBsZWZ0IG9mIGEgZ2l2ZW4gYGlucHV0YCB1bnRpbCBpdCBtYXRjaGVzIG1hdGNoIGBsZW5ndGhgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGlucHV0IC0gU3RyaW5nIHRvIGZvcm1hdFxuICogQHBhcmFtIHtTdHJpbmd9IHNpZ24gLSBDaGFyYWN0ZXIgdG8gYWRkIHRvIHRoZSBsZWZ0XG4gKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoIC0gTGVuZ3RoIG9mIHRoZSBvdXRwdXQgc3RyaW5nXG4gKi9cbmV4cG9ydCBjb25zdCBwYWRMZWZ0ID0gKGlucHV0LCBzaWduLCBsZW5ndGgpID0+IHtcbiAgaW5wdXQgKz0gJyc7IC8vIG1ha2Ugc3VyZSB3ZSBkZWFsIHdpdGggYSBzdHJpbmdcblxuICB3aGlsZSAoaW5wdXQubGVuZ3RoIDwgbGVuZ3RoKVxuICAgIGlucHV0ID0gc2lnbiArIGlucHV0O1xuXG4gIHJldHVybiBpbnB1dDtcbn1cbiJdfQ==