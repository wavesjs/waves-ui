
export default {
  padLeft(input, sign, length) {
    input += '';
    while (input.length < length) {
      input = sign + input;
    }
    return input;
  }
};