
/**
 * Add `sign` to the left of a given `input` until it matches match `length`
 *
 * @param {String} input - String to format
 * @param {String} sign - Character to add to the left
 * @param {Number} length - Length of the output string
 */
export const padLeft = (input, sign, length) => {
  input += ''; // make sure we deal with a string

  while (input.length < length)
    input = sign + input;

  return input;
}
