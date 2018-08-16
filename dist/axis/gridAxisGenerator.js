'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * A generator to create data for grid axis according to a `bpm` and a `meter`.
 *
 * [example usage](./examples/layer-axis.html)
 *
 * @param {Number} bpm - Number of beats per minutes
 * @param {String} signature - Meter of the mesure (`'4/4'`, `'3/8'`, ...)
 * @return {Function} - Function that generate data to be diplayed
 */
function gridAxisGenerator(bpm, signature) {
  var _bps = bpm / 60; // sec
  var _unit = 1 / parseInt(signature.split('/')[1], 10);
  var _nbrUnitsPerMesure = parseInt(signature.split('/')[0], 10);

  return function (timeContext) {
    var duration = timeContext.visibleDuration;
    var offset = timeContext.offset;
    var data = [];

    // const min = Math.min(-offset, 0);
    var min = -offset;
    // remove the timeline's offset to keep the layer centered
    var max = duration - offset;

    // define pixels for 1 second
    var pixelsPerSecond = timeContext.computedPixelsPerSecond;
    // time for one _unit
    var unitTime = 1 / _bps;
    // define the first tick > min
    var modulo = min % unitTime;
    var mult = (min - modulo) / unitTime;
    var firstTickTime = unitTime * mult;
    // track which position of current beat in the mesure
    var positionInMesure = mult % _nbrUnitsPerMesure;

    // remove not focused beats, if zoomed out
    var pixelsPerTick = pixelsPerSecond / _bps;
    var minStep = 5;

    // time should be
    for (var time = firstTickTime; time < max; time += unitTime) {
      // find first beat
      var focused = positionInMesure++ % _nbrUnitsPerMesure === 0;
      // ignore if pixels per ticks is too small
      if (pixelsPerTick <= minStep && !focused) {
        continue;
      }

      data.push({ time: time, focused: focused });
    }

    return data;
  };
}

exports.default = gridAxisGenerator;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdyaWRBeGlzR2VuZXJhdG9yLmpzIl0sIm5hbWVzIjpbImdyaWRBeGlzR2VuZXJhdG9yIiwiYnBtIiwic2lnbmF0dXJlIiwiX2JwcyIsIl91bml0IiwicGFyc2VJbnQiLCJzcGxpdCIsIl9uYnJVbml0c1Blck1lc3VyZSIsInRpbWVDb250ZXh0IiwiZHVyYXRpb24iLCJ2aXNpYmxlRHVyYXRpb24iLCJvZmZzZXQiLCJkYXRhIiwibWluIiwibWF4IiwicGl4ZWxzUGVyU2Vjb25kIiwiY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmQiLCJ1bml0VGltZSIsIm1vZHVsbyIsIm11bHQiLCJmaXJzdFRpY2tUaW1lIiwicG9zaXRpb25Jbk1lc3VyZSIsInBpeGVsc1BlclRpY2siLCJtaW5TdGVwIiwidGltZSIsImZvY3VzZWQiLCJwdXNoIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFBOzs7Ozs7Ozs7QUFTQSxTQUFTQSxpQkFBVCxDQUEyQkMsR0FBM0IsRUFBZ0NDLFNBQWhDLEVBQTJDO0FBQ3pDLE1BQU1DLE9BQVFGLE1BQU0sRUFBcEIsQ0FEeUMsQ0FDakI7QUFDeEIsTUFBTUcsUUFBUSxJQUFJQyxTQUFTSCxVQUFVSSxLQUFWLENBQWdCLEdBQWhCLEVBQXFCLENBQXJCLENBQVQsRUFBa0MsRUFBbEMsQ0FBbEI7QUFDQSxNQUFNQyxxQkFBcUJGLFNBQVNILFVBQVVJLEtBQVYsQ0FBZ0IsR0FBaEIsRUFBcUIsQ0FBckIsQ0FBVCxFQUFrQyxFQUFsQyxDQUEzQjs7QUFFQSxTQUFPLFVBQVNFLFdBQVQsRUFBc0I7QUFDM0IsUUFBTUMsV0FBV0QsWUFBWUUsZUFBN0I7QUFDQSxRQUFNQyxTQUFTSCxZQUFZRyxNQUEzQjtBQUNBLFFBQU1DLE9BQU8sRUFBYjs7QUFFQTtBQUNBLFFBQU1DLE1BQU0sQ0FBRUYsTUFBZDtBQUNBO0FBQ0EsUUFBTUcsTUFBTUwsV0FBV0UsTUFBdkI7O0FBRUE7QUFDQSxRQUFNSSxrQkFBa0JQLFlBQVlRLHVCQUFwQztBQUNBO0FBQ0EsUUFBTUMsV0FBVyxJQUFJZCxJQUFyQjtBQUNBO0FBQ0EsUUFBTWUsU0FBU0wsTUFBTUksUUFBckI7QUFDQSxRQUFNRSxPQUFPLENBQUNOLE1BQU1LLE1BQVAsSUFBaUJELFFBQTlCO0FBQ0EsUUFBTUcsZ0JBQWdCSCxXQUFXRSxJQUFqQztBQUNBO0FBQ0EsUUFBSUUsbUJBQW1CRixPQUFPWixrQkFBOUI7O0FBRUE7QUFDQSxRQUFNZSxnQkFBZ0JQLGtCQUFrQlosSUFBeEM7QUFDQSxRQUFNb0IsVUFBVSxDQUFoQjs7QUFFQTtBQUNBLFNBQUssSUFBSUMsT0FBT0osYUFBaEIsRUFBK0JJLE9BQU9WLEdBQXRDLEVBQTJDVSxRQUFRUCxRQUFuRCxFQUE2RDtBQUMzRDtBQUNBLFVBQU1RLFVBQVdKLHFCQUFxQmQsa0JBQXJCLEtBQTRDLENBQTdEO0FBQ0E7QUFDQSxVQUFLZSxpQkFBaUJDLE9BQWxCLElBQThCLENBQUNFLE9BQW5DLEVBQTRDO0FBQUU7QUFBVzs7QUFFekRiLFdBQUtjLElBQUwsQ0FBVSxFQUFFRixVQUFGLEVBQVFDLGdCQUFSLEVBQVY7QUFDRDs7QUFFRCxXQUFPYixJQUFQO0FBQ0QsR0FwQ0Q7QUFxQ0Q7O2tCQUVjWixpQiIsImZpbGUiOiJncmlkQXhpc0dlbmVyYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQSBnZW5lcmF0b3IgdG8gY3JlYXRlIGRhdGEgZm9yIGdyaWQgYXhpcyBhY2NvcmRpbmcgdG8gYSBgYnBtYCBhbmQgYSBgbWV0ZXJgLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLWF4aXMuaHRtbClcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gYnBtIC0gTnVtYmVyIG9mIGJlYXRzIHBlciBtaW51dGVzXG4gKiBAcGFyYW0ge1N0cmluZ30gc2lnbmF0dXJlIC0gTWV0ZXIgb2YgdGhlIG1lc3VyZSAoYCc0LzQnYCwgYCczLzgnYCwgLi4uKVxuICogQHJldHVybiB7RnVuY3Rpb259IC0gRnVuY3Rpb24gdGhhdCBnZW5lcmF0ZSBkYXRhIHRvIGJlIGRpcGxheWVkXG4gKi9cbmZ1bmN0aW9uIGdyaWRBeGlzR2VuZXJhdG9yKGJwbSwgc2lnbmF0dXJlKSB7XG4gIGNvbnN0IF9icHMgPSAgYnBtIC8gNjA7IC8vIHNlY1xuICBjb25zdCBfdW5pdCA9IDEgLyBwYXJzZUludChzaWduYXR1cmUuc3BsaXQoJy8nKVsxXSwgMTApO1xuICBjb25zdCBfbmJyVW5pdHNQZXJNZXN1cmUgPSBwYXJzZUludChzaWduYXR1cmUuc3BsaXQoJy8nKVswXSwgMTApO1xuXG4gIHJldHVybiBmdW5jdGlvbih0aW1lQ29udGV4dCkge1xuICAgIGNvbnN0IGR1cmF0aW9uID0gdGltZUNvbnRleHQudmlzaWJsZUR1cmF0aW9uO1xuICAgIGNvbnN0IG9mZnNldCA9IHRpbWVDb250ZXh0Lm9mZnNldDtcbiAgICBjb25zdCBkYXRhID0gW107XG5cbiAgICAvLyBjb25zdCBtaW4gPSBNYXRoLm1pbigtb2Zmc2V0LCAwKTtcbiAgICBjb25zdCBtaW4gPSAtIG9mZnNldDtcbiAgICAvLyByZW1vdmUgdGhlIHRpbWVsaW5lJ3Mgb2Zmc2V0IHRvIGtlZXAgdGhlIGxheWVyIGNlbnRlcmVkXG4gICAgY29uc3QgbWF4ID0gZHVyYXRpb24gLSBvZmZzZXQ7XG5cbiAgICAvLyBkZWZpbmUgcGl4ZWxzIGZvciAxIHNlY29uZFxuICAgIGNvbnN0IHBpeGVsc1BlclNlY29uZCA9IHRpbWVDb250ZXh0LmNvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kO1xuICAgIC8vIHRpbWUgZm9yIG9uZSBfdW5pdFxuICAgIGNvbnN0IHVuaXRUaW1lID0gMSAvIF9icHM7XG4gICAgLy8gZGVmaW5lIHRoZSBmaXJzdCB0aWNrID4gbWluXG4gICAgY29uc3QgbW9kdWxvID0gbWluICUgdW5pdFRpbWU7XG4gICAgY29uc3QgbXVsdCA9IChtaW4gLSBtb2R1bG8pIC8gdW5pdFRpbWU7XG4gICAgY29uc3QgZmlyc3RUaWNrVGltZSA9IHVuaXRUaW1lICogbXVsdDtcbiAgICAvLyB0cmFjayB3aGljaCBwb3NpdGlvbiBvZiBjdXJyZW50IGJlYXQgaW4gdGhlIG1lc3VyZVxuICAgIGxldCBwb3NpdGlvbkluTWVzdXJlID0gbXVsdCAlIF9uYnJVbml0c1Blck1lc3VyZTtcblxuICAgIC8vIHJlbW92ZSBub3QgZm9jdXNlZCBiZWF0cywgaWYgem9vbWVkIG91dFxuICAgIGNvbnN0IHBpeGVsc1BlclRpY2sgPSBwaXhlbHNQZXJTZWNvbmQgLyBfYnBzO1xuICAgIGNvbnN0IG1pblN0ZXAgPSA1O1xuXG4gICAgLy8gdGltZSBzaG91bGQgYmVcbiAgICBmb3IgKGxldCB0aW1lID0gZmlyc3RUaWNrVGltZTsgdGltZSA8IG1heDsgdGltZSArPSB1bml0VGltZSkge1xuICAgICAgLy8gZmluZCBmaXJzdCBiZWF0XG4gICAgICBjb25zdCBmb2N1c2VkID0gKHBvc2l0aW9uSW5NZXN1cmUrKyAlIF9uYnJVbml0c1Blck1lc3VyZSA9PT0gMCk7XG4gICAgICAvLyBpZ25vcmUgaWYgcGl4ZWxzIHBlciB0aWNrcyBpcyB0b28gc21hbGxcbiAgICAgIGlmICgocGl4ZWxzUGVyVGljayA8PSBtaW5TdGVwKSAmJiAhZm9jdXNlZCkgeyBjb250aW51ZTsgfVxuXG4gICAgICBkYXRhLnB1c2goeyB0aW1lLCBmb2N1c2VkIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBncmlkQXhpc0dlbmVyYXRvcjtcbiJdfQ==