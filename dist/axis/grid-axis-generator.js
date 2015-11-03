/**
 * A generator to create data for grid axis according to a `bpm` and a `meter`.
 *
 * [example usage](./examples/layer-axis.html)
 *
 * @param {Number} bpm - The number of beats per minutes.
 * @param {String} signature - The meter of the mesure (`'4/4'`, `'3/8'`, ...).
 * @return {Function} - The configured function returning the data when called.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = gridAxisGenerator;

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

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9heGlzL2dyaWQtYXhpcy1nZW5lcmF0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7cUJBU3dCLGlCQUFpQjs7QUFBMUIsU0FBUyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsU0FBUyxFQUFFO0FBQ3hELE1BQU0sSUFBSSxHQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDdkIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3hELE1BQU0sa0JBQWtCLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7O0FBRWpFLFNBQU8sVUFBUyxXQUFXLEVBQUU7QUFDM0IsUUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLGVBQWUsQ0FBQztBQUM3QyxRQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO0FBQ2xDLFFBQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQzs7O0FBR2hCLFFBQU0sR0FBRyxHQUFHLENBQUUsTUFBTSxDQUFDOztBQUVyQixRQUFNLEdBQUcsR0FBRyxRQUFRLEdBQUcsTUFBTSxDQUFDOzs7QUFHOUIsUUFBTSxlQUFlLEdBQUcsV0FBVyxDQUFDLHVCQUF1QixDQUFDOztBQUU1RCxRQUFNLFFBQVEsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDOztBQUUxQixRQUFNLE1BQU0sR0FBRyxHQUFHLEdBQUcsUUFBUSxDQUFDO0FBQzlCLFFBQU0sSUFBSSxHQUFHLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQSxHQUFJLFFBQVEsQ0FBQztBQUN2QyxRQUFNLGFBQWEsR0FBRyxRQUFRLEdBQUcsSUFBSSxDQUFDOztBQUV0QyxRQUFJLGdCQUFnQixHQUFHLElBQUksR0FBRyxrQkFBa0IsQ0FBQzs7O0FBR2pELFFBQU0sYUFBYSxHQUFHLGVBQWUsR0FBRyxJQUFJLENBQUM7QUFDN0MsUUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDOzs7QUFHbEIsU0FBSyxJQUFJLElBQUksR0FBRyxhQUFhLEVBQUUsSUFBSSxHQUFHLEdBQUcsRUFBRSxJQUFJLElBQUksUUFBUSxFQUFFOztBQUUzRCxVQUFNLE9BQU8sR0FBSSxnQkFBZ0IsRUFBRSxHQUFHLGtCQUFrQixLQUFLLENBQUMsQUFBQyxDQUFDOztBQUVoRSxVQUFJLEFBQUMsYUFBYSxJQUFJLE9BQU8sSUFBSyxDQUFDLE9BQU8sRUFBRTtBQUFFLGlCQUFTO09BQUU7O0FBRXpELFVBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLE9BQU8sRUFBUCxPQUFPLEVBQUUsQ0FBQyxDQUFDO0tBQzlCOztBQUVELFdBQU8sSUFBSSxDQUFDO0dBQ2IsQ0FBQztDQUNIIiwiZmlsZSI6InNyYy9heGlzL2dyaWQtYXhpcy1nZW5lcmF0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEEgZ2VuZXJhdG9yIHRvIGNyZWF0ZSBkYXRhIGZvciBncmlkIGF4aXMgYWNjb3JkaW5nIHRvIGEgYGJwbWAgYW5kIGEgYG1ldGVyYC5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1heGlzLmh0bWwpXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IGJwbSAtIFRoZSBudW1iZXIgb2YgYmVhdHMgcGVyIG1pbnV0ZXMuXG4gKiBAcGFyYW0ge1N0cmluZ30gc2lnbmF0dXJlIC0gVGhlIG1ldGVyIG9mIHRoZSBtZXN1cmUgKGAnNC80J2AsIGAnMy84J2AsIC4uLikuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gLSBUaGUgY29uZmlndXJlZCBmdW5jdGlvbiByZXR1cm5pbmcgdGhlIGRhdGEgd2hlbiBjYWxsZWQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdyaWRBeGlzR2VuZXJhdG9yKGJwbSwgc2lnbmF0dXJlKSB7XG4gIGNvbnN0IF9icHMgPSAgYnBtIC8gNjA7IC8vIHNlY1xuICBjb25zdCBfdW5pdCA9IDEgLyBwYXJzZUludChzaWduYXR1cmUuc3BsaXQoJy8nKVsxXSwgMTApO1xuICBjb25zdCBfbmJyVW5pdHNQZXJNZXN1cmUgPSBwYXJzZUludChzaWduYXR1cmUuc3BsaXQoJy8nKVswXSwgMTApO1xuXG4gIHJldHVybiBmdW5jdGlvbih0aW1lQ29udGV4dCkge1xuICAgIGNvbnN0IGR1cmF0aW9uID0gdGltZUNvbnRleHQudmlzaWJsZUR1cmF0aW9uO1xuICAgIGNvbnN0IG9mZnNldCA9IHRpbWVDb250ZXh0Lm9mZnNldDtcbiAgICBjb25zdCBkYXRhID0gW107XG5cbiAgICAvLyBjb25zdCBtaW4gPSBNYXRoLm1pbigtb2Zmc2V0LCAwKTtcbiAgICBjb25zdCBtaW4gPSAtIG9mZnNldDtcbiAgICAvLyByZW1vdmUgdGhlIHRpbWVsaW5lJ3Mgb2Zmc2V0IHRvIGtlZXAgdGhlIGxheWVyIGNlbnRlcmVkXG4gICAgY29uc3QgbWF4ID0gZHVyYXRpb24gLSBvZmZzZXQ7XG5cbiAgICAvLyBkZWZpbmUgcGl4ZWxzIGZvciAxIHNlY29uZFxuICAgIGNvbnN0IHBpeGVsc1BlclNlY29uZCA9IHRpbWVDb250ZXh0LmNvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kO1xuICAgIC8vIHRpbWUgZm9yIG9uZSBfdW5pdFxuICAgIGNvbnN0IHVuaXRUaW1lID0gMSAvIF9icHM7XG4gICAgLy8gZGVmaW5lIHRoZSBmaXJzdCB0aWNrID4gbWluXG4gICAgY29uc3QgbW9kdWxvID0gbWluICUgdW5pdFRpbWU7XG4gICAgY29uc3QgbXVsdCA9IChtaW4gLSBtb2R1bG8pIC8gdW5pdFRpbWU7XG4gICAgY29uc3QgZmlyc3RUaWNrVGltZSA9IHVuaXRUaW1lICogbXVsdDtcbiAgICAvLyB0cmFjayB3aGljaCBwb3NpdGlvbiBvZiBjdXJyZW50IGJlYXQgaW4gdGhlIG1lc3VyZVxuICAgIGxldCBwb3NpdGlvbkluTWVzdXJlID0gbXVsdCAlIF9uYnJVbml0c1Blck1lc3VyZTtcblxuICAgIC8vIHJlbW92ZSBub3QgZm9jdXNlZCBiZWF0cywgaWYgem9vbWVkIG91dFxuICAgIGNvbnN0IHBpeGVsc1BlclRpY2sgPSBwaXhlbHNQZXJTZWNvbmQgLyBfYnBzO1xuICAgIGNvbnN0IG1pblN0ZXAgPSA1O1xuXG4gICAgLy8gdGltZSBzaG91bGQgYmVcbiAgICBmb3IgKGxldCB0aW1lID0gZmlyc3RUaWNrVGltZTsgdGltZSA8IG1heDsgdGltZSArPSB1bml0VGltZSkge1xuICAgICAgLy8gZmluZCBmaXJzdCBiZWF0XG4gICAgICBjb25zdCBmb2N1c2VkID0gKHBvc2l0aW9uSW5NZXN1cmUrKyAlIF9uYnJVbml0c1Blck1lc3VyZSA9PT0gMCk7XG4gICAgICAvLyBpZ25vcmUgaWYgcGl4ZWxzIHBlciB0aWNrcyBpcyB0b28gc21hbGxcbiAgICAgIGlmICgocGl4ZWxzUGVyVGljayA8PSBtaW5TdGVwKSAmJiAhZm9jdXNlZCkgeyBjb250aW51ZTsgfVxuXG4gICAgICBkYXRhLnB1c2goeyB0aW1lLCBmb2N1c2VkIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9O1xufSJdfQ==