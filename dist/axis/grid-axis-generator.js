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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdyaWQtYXhpcy1nZW5lcmF0b3IuanMiXSwibmFtZXMiOlsiZ3JpZEF4aXNHZW5lcmF0b3IiLCJicG0iLCJzaWduYXR1cmUiLCJfYnBzIiwiX3VuaXQiLCJwYXJzZUludCIsInNwbGl0IiwiX25iclVuaXRzUGVyTWVzdXJlIiwidGltZUNvbnRleHQiLCJkdXJhdGlvbiIsInZpc2libGVEdXJhdGlvbiIsIm9mZnNldCIsImRhdGEiLCJtaW4iLCJtYXgiLCJwaXhlbHNQZXJTZWNvbmQiLCJjb21wdXRlZFBpeGVsc1BlclNlY29uZCIsInVuaXRUaW1lIiwibW9kdWxvIiwibXVsdCIsImZpcnN0VGlja1RpbWUiLCJwb3NpdGlvbkluTWVzdXJlIiwicGl4ZWxzUGVyVGljayIsIm1pblN0ZXAiLCJ0aW1lIiwiZm9jdXNlZCIsInB1c2giXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7Ozs7Ozs7OztBQVNBLFNBQVNBLGlCQUFULENBQTJCQyxHQUEzQixFQUFnQ0MsU0FBaEMsRUFBMkM7QUFDekMsTUFBTUMsT0FBUUYsTUFBTSxFQUFwQixDQUR5QyxDQUNqQjtBQUN4QixNQUFNRyxRQUFRLElBQUlDLFNBQVNILFVBQVVJLEtBQVYsQ0FBZ0IsR0FBaEIsRUFBcUIsQ0FBckIsQ0FBVCxFQUFrQyxFQUFsQyxDQUFsQjtBQUNBLE1BQU1DLHFCQUFxQkYsU0FBU0gsVUFBVUksS0FBVixDQUFnQixHQUFoQixFQUFxQixDQUFyQixDQUFULEVBQWtDLEVBQWxDLENBQTNCOztBQUVBLFNBQU8sVUFBU0UsV0FBVCxFQUFzQjtBQUMzQixRQUFNQyxXQUFXRCxZQUFZRSxlQUE3QjtBQUNBLFFBQU1DLFNBQVNILFlBQVlHLE1BQTNCO0FBQ0EsUUFBTUMsT0FBTyxFQUFiOztBQUVBO0FBQ0EsUUFBTUMsTUFBTSxDQUFFRixNQUFkO0FBQ0E7QUFDQSxRQUFNRyxNQUFNTCxXQUFXRSxNQUF2Qjs7QUFFQTtBQUNBLFFBQU1JLGtCQUFrQlAsWUFBWVEsdUJBQXBDO0FBQ0E7QUFDQSxRQUFNQyxXQUFXLElBQUlkLElBQXJCO0FBQ0E7QUFDQSxRQUFNZSxTQUFTTCxNQUFNSSxRQUFyQjtBQUNBLFFBQU1FLE9BQU8sQ0FBQ04sTUFBTUssTUFBUCxJQUFpQkQsUUFBOUI7QUFDQSxRQUFNRyxnQkFBZ0JILFdBQVdFLElBQWpDO0FBQ0E7QUFDQSxRQUFJRSxtQkFBbUJGLE9BQU9aLGtCQUE5Qjs7QUFFQTtBQUNBLFFBQU1lLGdCQUFnQlAsa0JBQWtCWixJQUF4QztBQUNBLFFBQU1vQixVQUFVLENBQWhCOztBQUVBO0FBQ0EsU0FBSyxJQUFJQyxPQUFPSixhQUFoQixFQUErQkksT0FBT1YsR0FBdEMsRUFBMkNVLFFBQVFQLFFBQW5ELEVBQTZEO0FBQzNEO0FBQ0EsVUFBTVEsVUFBV0oscUJBQXFCZCxrQkFBckIsS0FBNEMsQ0FBN0Q7QUFDQTtBQUNBLFVBQUtlLGlCQUFpQkMsT0FBbEIsSUFBOEIsQ0FBQ0UsT0FBbkMsRUFBNEM7QUFBRTtBQUFXOztBQUV6RGIsV0FBS2MsSUFBTCxDQUFVLEVBQUVGLFVBQUYsRUFBUUMsZ0JBQVIsRUFBVjtBQUNEOztBQUVELFdBQU9iLElBQVA7QUFDRCxHQXBDRDtBQXFDRDs7a0JBRWNaLGlCIiwiZmlsZSI6ImdyaWQtYXhpcy1nZW5lcmF0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEEgZ2VuZXJhdG9yIHRvIGNyZWF0ZSBkYXRhIGZvciBncmlkIGF4aXMgYWNjb3JkaW5nIHRvIGEgYGJwbWAgYW5kIGEgYG1ldGVyYC5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1heGlzLmh0bWwpXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IGJwbSAtIE51bWJlciBvZiBiZWF0cyBwZXIgbWludXRlc1xuICogQHBhcmFtIHtTdHJpbmd9IHNpZ25hdHVyZSAtIE1ldGVyIG9mIHRoZSBtZXN1cmUgKGAnNC80J2AsIGAnMy84J2AsIC4uLilcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSAtIEZ1bmN0aW9uIHRoYXQgZ2VuZXJhdGUgZGF0YSB0byBiZSBkaXBsYXllZFxuICovXG5mdW5jdGlvbiBncmlkQXhpc0dlbmVyYXRvcihicG0sIHNpZ25hdHVyZSkge1xuICBjb25zdCBfYnBzID0gIGJwbSAvIDYwOyAvLyBzZWNcbiAgY29uc3QgX3VuaXQgPSAxIC8gcGFyc2VJbnQoc2lnbmF0dXJlLnNwbGl0KCcvJylbMV0sIDEwKTtcbiAgY29uc3QgX25iclVuaXRzUGVyTWVzdXJlID0gcGFyc2VJbnQoc2lnbmF0dXJlLnNwbGl0KCcvJylbMF0sIDEwKTtcblxuICByZXR1cm4gZnVuY3Rpb24odGltZUNvbnRleHQpIHtcbiAgICBjb25zdCBkdXJhdGlvbiA9IHRpbWVDb250ZXh0LnZpc2libGVEdXJhdGlvbjtcbiAgICBjb25zdCBvZmZzZXQgPSB0aW1lQ29udGV4dC5vZmZzZXQ7XG4gICAgY29uc3QgZGF0YSA9IFtdO1xuXG4gICAgLy8gY29uc3QgbWluID0gTWF0aC5taW4oLW9mZnNldCwgMCk7XG4gICAgY29uc3QgbWluID0gLSBvZmZzZXQ7XG4gICAgLy8gcmVtb3ZlIHRoZSB0aW1lbGluZSdzIG9mZnNldCB0byBrZWVwIHRoZSBsYXllciBjZW50ZXJlZFxuICAgIGNvbnN0IG1heCA9IGR1cmF0aW9uIC0gb2Zmc2V0O1xuXG4gICAgLy8gZGVmaW5lIHBpeGVscyBmb3IgMSBzZWNvbmRcbiAgICBjb25zdCBwaXhlbHNQZXJTZWNvbmQgPSB0aW1lQ29udGV4dC5jb21wdXRlZFBpeGVsc1BlclNlY29uZDtcbiAgICAvLyB0aW1lIGZvciBvbmUgX3VuaXRcbiAgICBjb25zdCB1bml0VGltZSA9IDEgLyBfYnBzO1xuICAgIC8vIGRlZmluZSB0aGUgZmlyc3QgdGljayA+IG1pblxuICAgIGNvbnN0IG1vZHVsbyA9IG1pbiAlIHVuaXRUaW1lO1xuICAgIGNvbnN0IG11bHQgPSAobWluIC0gbW9kdWxvKSAvIHVuaXRUaW1lO1xuICAgIGNvbnN0IGZpcnN0VGlja1RpbWUgPSB1bml0VGltZSAqIG11bHQ7XG4gICAgLy8gdHJhY2sgd2hpY2ggcG9zaXRpb24gb2YgY3VycmVudCBiZWF0IGluIHRoZSBtZXN1cmVcbiAgICBsZXQgcG9zaXRpb25Jbk1lc3VyZSA9IG11bHQgJSBfbmJyVW5pdHNQZXJNZXN1cmU7XG5cbiAgICAvLyByZW1vdmUgbm90IGZvY3VzZWQgYmVhdHMsIGlmIHpvb21lZCBvdXRcbiAgICBjb25zdCBwaXhlbHNQZXJUaWNrID0gcGl4ZWxzUGVyU2Vjb25kIC8gX2JwcztcbiAgICBjb25zdCBtaW5TdGVwID0gNTtcblxuICAgIC8vIHRpbWUgc2hvdWxkIGJlXG4gICAgZm9yIChsZXQgdGltZSA9IGZpcnN0VGlja1RpbWU7IHRpbWUgPCBtYXg7IHRpbWUgKz0gdW5pdFRpbWUpIHtcbiAgICAgIC8vIGZpbmQgZmlyc3QgYmVhdFxuICAgICAgY29uc3QgZm9jdXNlZCA9IChwb3NpdGlvbkluTWVzdXJlKysgJSBfbmJyVW5pdHNQZXJNZXN1cmUgPT09IDApO1xuICAgICAgLy8gaWdub3JlIGlmIHBpeGVscyBwZXIgdGlja3MgaXMgdG9vIHNtYWxsXG4gICAgICBpZiAoKHBpeGVsc1BlclRpY2sgPD0gbWluU3RlcCkgJiYgIWZvY3VzZWQpIHsgY29udGludWU7IH1cblxuICAgICAgZGF0YS5wdXNoKHsgdGltZSwgZm9jdXNlZCB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ3JpZEF4aXNHZW5lcmF0b3I7XG4iXX0=