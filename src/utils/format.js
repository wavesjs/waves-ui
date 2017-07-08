/**
 * Formatting helpers functions.
 */
export default {
  /**
   * Add a `sign` to the left of a given `input` to match `length`
   *
   * @param {String} input - The string to format.
   * @param {String} sign - The character to add to the left.
   * @param {Number} length - The length of the output string.
   */
  padLeft(input, sign, length) {
    input += '';
    while (input.length < length) {
      input = sign + input;
    }
    return input;
  }
};
