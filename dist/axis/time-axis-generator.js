'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = timeAxisGenerator;

var _utilsFormat = require('../utils/format');

/**
 * maybe create a factory to give some parameters
 * create time serie data, to visualize a time scale
 * @return {Array} - An array of objects `label, focused [, time]
 */

function timeAxisGenerator() {
  // add factory to share API with bpmGenerator
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
    var minStep = 7;

    // define all display information according to the pixelsPerSecond ratio
    var step = undefined,
        type = undefined,
        toFixed = undefined,
        markerModulo = undefined,
        includeModulo = undefined;

    if (pixelsPerSecond * 4 > minStep) {
      step = 1; // the step to use to compute time
      toFixed = 0;
      markerModulo = 60; // a timestamp every 5 stepixelsPerSecond
      includeModulo = 5; // a tick every 5 stepixelsPerSecond
      type = '60sec';
    }

    if (pixelsPerSecond * 2 > minStep) {
      step = 1;
      toFixed = 0;
      markerModulo = 30;
      includeModulo = 1;
      type = '30sec';
    }

    if (pixelsPerSecond > minStep) {
      step = 1;
      toFixed = 0;
      markerModulo = 10;
      includeModulo = 1;
      type = 'sec';
    }

    if (pixelsPerSecond / 10 > minStep) {
      step = 1 / 10;
      toFixed = 1;
      markerModulo = 10;
      includeModulo = 1;
      type = 'ds';
    }

    if (pixelsPerSecond / 100 > minStep) {
      step = 1 / 100;
      toFixed = 2;
      markerModulo = 10;
      includeModulo = 1;
      type = 'cs';
    }

    if (pixelsPerSecond / 1000 > minStep) {
      step = 1 / 1000;
      toFixed = 3;
      markerModulo = 10;
      includeModulo = 1;
      type = 'ms';
    }

    for (var time = min; time < max; time += step) {
      var formattedTime = time.toFixed(toFixed);

      if (Math.round(formattedTime / step) % includeModulo !== 0) {
        continue;
      }

      // avoid floating point errors
      var focused = Math.round(formattedTime / step) % markerModulo === 0 ? true : false;

      var datum = { time: formattedTime, focused: focused };

      if (focused === true) {
        var date = new Date(1000 * formattedTime);
        var _min = (0, _utilsFormat.padLeft)(date.getMinutes(), 0, 2);
        var sec = (0, _utilsFormat.padLeft)(date.getSeconds(), 0, 2);
        var milli = (0, _utilsFormat.padLeft)(date.getMilliseconds(), 0, 3);
        var label = _min + ':' + sec + ':' + milli;

        datum.label = label;
      }

      data.push(datum);
    }

    return data;
  };
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9heGlzL3RpbWUtYXhpcy1nZW5lcmF0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7cUJBTXdCLGlCQUFpQjs7MkJBTmpCLGlCQUFpQjs7Ozs7Ozs7QUFNMUIsU0FBUyxpQkFBaUIsR0FBRzs7QUFFMUMsU0FBTyxVQUFTLFdBQVcsRUFBRTtBQUMzQixRQUFNLFFBQVEsR0FBRyxXQUFXLENBQUMsZUFBZSxDQUFDO0FBQzdDLFFBQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7QUFDbEMsUUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDOzs7QUFHaEIsUUFBTSxHQUFHLEdBQUcsQ0FBRSxNQUFNLENBQUM7O0FBRXJCLFFBQU0sR0FBRyxHQUFHLFFBQVEsR0FBRyxNQUFNLENBQUM7OztBQUc5QixRQUFNLGVBQWUsR0FBRyxXQUFXLENBQUMsdUJBQXVCLENBQUM7QUFDNUQsUUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDOzs7QUFHbEIsUUFBSSxJQUFJLFlBQUE7UUFBRSxJQUFJLFlBQUE7UUFBRSxPQUFPLFlBQUE7UUFBRSxZQUFZLFlBQUE7UUFBRSxhQUFhLFlBQUEsQ0FBQzs7QUFFckQsUUFBSSxlQUFlLEdBQUcsQ0FBQyxHQUFHLE9BQU8sRUFBRTtBQUNqQyxVQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQ1QsYUFBTyxHQUFHLENBQUMsQ0FBQztBQUNaLGtCQUFZLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLG1CQUFhLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLFVBQUksR0FBRyxPQUFPLENBQUM7S0FDaEI7O0FBRUQsUUFBSSxlQUFlLEdBQUcsQ0FBQyxHQUFHLE9BQU8sRUFBRTtBQUNqQyxVQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQ1QsYUFBTyxHQUFHLENBQUMsQ0FBQztBQUNaLGtCQUFZLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLG1CQUFhLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLFVBQUksR0FBRyxPQUFPLENBQUM7S0FDaEI7O0FBRUQsUUFBSSxlQUFlLEdBQUcsT0FBTyxFQUFFO0FBQzdCLFVBQUksR0FBRyxDQUFDLENBQUM7QUFDVCxhQUFPLEdBQUcsQ0FBQyxDQUFDO0FBQ1osa0JBQVksR0FBRyxFQUFFLENBQUM7QUFDbEIsbUJBQWEsR0FBRyxDQUFDLENBQUM7QUFDbEIsVUFBSSxHQUFHLEtBQUssQ0FBQztLQUNkOztBQUVELFFBQUksZUFBZSxHQUFHLEVBQUUsR0FBRyxPQUFPLEVBQUU7QUFDbEMsVUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDZCxhQUFPLEdBQUcsQ0FBQyxDQUFDO0FBQ1osa0JBQVksR0FBRyxFQUFFLENBQUM7QUFDbEIsbUJBQWEsR0FBRyxDQUFDLENBQUM7QUFDbEIsVUFBSSxHQUFHLElBQUksQ0FBQztLQUNiOztBQUVELFFBQUksZUFBZSxHQUFHLEdBQUcsR0FBRyxPQUFPLEVBQUU7QUFDbkMsVUFBSSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDZixhQUFPLEdBQUcsQ0FBQyxDQUFDO0FBQ1osa0JBQVksR0FBRyxFQUFFLENBQUM7QUFDbEIsbUJBQWEsR0FBRyxDQUFDLENBQUM7QUFDbEIsVUFBSSxHQUFHLElBQUksQ0FBQztLQUNiOztBQUVELFFBQUksZUFBZSxHQUFHLElBQUksR0FBRyxPQUFPLEVBQUU7QUFDcEMsVUFBSSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDaEIsYUFBTyxHQUFHLENBQUMsQ0FBQztBQUNaLGtCQUFZLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLG1CQUFhLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLFVBQUksR0FBRyxJQUFJLENBQUM7S0FDYjs7QUFFRCxTQUFLLElBQUksSUFBSSxHQUFHLEdBQUcsRUFBRSxJQUFJLEdBQUcsR0FBRyxFQUFFLElBQUksSUFBSSxJQUFJLEVBQUU7QUFDN0MsVUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFNUMsVUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsR0FBRyxhQUFhLEtBQUssQ0FBQyxFQUFFO0FBQzFELGlCQUFTO09BQ1Y7OztBQUdELFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxHQUFHLFlBQVksS0FBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQzs7QUFFckYsVUFBTSxLQUFLLEdBQUcsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLE9BQU8sRUFBUCxPQUFPLEVBQUUsQ0FBQzs7QUFFL0MsVUFBSSxPQUFPLEtBQUssSUFBSSxFQUFFO0FBQ3BCLFlBQU0sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxhQUFhLENBQUMsQ0FBQztBQUM1QyxZQUFNLElBQUcsR0FBRywwQkFBUSxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzdDLFlBQU0sR0FBRyxHQUFHLDBCQUFRLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDN0MsWUFBTSxLQUFLLEdBQUcsMEJBQVEsSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNwRCxZQUFNLEtBQUssR0FBTSxJQUFHLFNBQUksR0FBRyxTQUFJLEtBQUssQUFBRSxDQUFDOztBQUV2QyxhQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztPQUNyQjs7QUFFRCxVQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ2xCOztBQUVELFdBQU8sSUFBSSxDQUFDO0dBQ2IsQ0FBQztDQUNIIiwiZmlsZSI6InNyYy9heGlzL3RpbWUtYXhpcy1nZW5lcmF0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBwYWRMZWZ0IH0gZnJvbSAnLi4vdXRpbHMvZm9ybWF0Jztcbi8qKlxuICogbWF5YmUgY3JlYXRlIGEgZmFjdG9yeSB0byBnaXZlIHNvbWUgcGFyYW1ldGVyc1xuICogY3JlYXRlIHRpbWUgc2VyaWUgZGF0YSwgdG8gdmlzdWFsaXplIGEgdGltZSBzY2FsZVxuICogQHJldHVybiB7QXJyYXl9IC0gQW4gYXJyYXkgb2Ygb2JqZWN0cyBgbGFiZWwsIGZvY3VzZWQgWywgdGltZV1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdGltZUF4aXNHZW5lcmF0b3IoKSB7XG4gIC8vIGFkZCBmYWN0b3J5IHRvIHNoYXJlIEFQSSB3aXRoIGJwbUdlbmVyYXRvclxuICByZXR1cm4gZnVuY3Rpb24odGltZUNvbnRleHQpIHtcbiAgICBjb25zdCBkdXJhdGlvbiA9IHRpbWVDb250ZXh0LnZpc2libGVEdXJhdGlvbjtcbiAgICBjb25zdCBvZmZzZXQgPSB0aW1lQ29udGV4dC5vZmZzZXQ7XG4gICAgY29uc3QgZGF0YSA9IFtdO1xuXG4gICAgLy8gY29uc3QgbWluID0gTWF0aC5taW4oLW9mZnNldCwgMCk7XG4gICAgY29uc3QgbWluID0gLSBvZmZzZXQ7XG4gICAgLy8gcmVtb3ZlIHRoZSB0aW1lbGluZSdzIG9mZnNldCB0byBrZWVwIHRoZSBsYXllciBjZW50ZXJlZFxuICAgIGNvbnN0IG1heCA9IGR1cmF0aW9uIC0gb2Zmc2V0O1xuXG4gICAgLy8gZGVmaW5lIHBpeGVscyBmb3IgMSBzZWNvbmRcbiAgICBjb25zdCBwaXhlbHNQZXJTZWNvbmQgPSB0aW1lQ29udGV4dC5jb21wdXRlZFBpeGVsc1BlclNlY29uZDtcbiAgICBjb25zdCBtaW5TdGVwID0gNztcblxuICAgIC8vIGRlZmluZSBhbGwgZGlzcGxheSBpbmZvcm1hdGlvbiBhY2NvcmRpbmcgdG8gdGhlIHBpeGVsc1BlclNlY29uZCByYXRpb1xuICAgIGxldCBzdGVwLCB0eXBlLCB0b0ZpeGVkLCBtYXJrZXJNb2R1bG8sIGluY2x1ZGVNb2R1bG87XG5cbiAgICBpZiAocGl4ZWxzUGVyU2Vjb25kICogNCA+IG1pblN0ZXApIHtcbiAgICAgIHN0ZXAgPSAxOyAvLyB0aGUgc3RlcCB0byB1c2UgdG8gY29tcHV0ZSB0aW1lXG4gICAgICB0b0ZpeGVkID0gMDtcbiAgICAgIG1hcmtlck1vZHVsbyA9IDYwOyAvLyBhIHRpbWVzdGFtcCBldmVyeSA1IHN0ZXBpeGVsc1BlclNlY29uZFxuICAgICAgaW5jbHVkZU1vZHVsbyA9IDU7IC8vIGEgdGljayBldmVyeSA1IHN0ZXBpeGVsc1BlclNlY29uZFxuICAgICAgdHlwZSA9ICc2MHNlYyc7XG4gICAgfVxuXG4gICAgaWYgKHBpeGVsc1BlclNlY29uZCAqIDIgPiBtaW5TdGVwKSB7XG4gICAgICBzdGVwID0gMTtcbiAgICAgIHRvRml4ZWQgPSAwO1xuICAgICAgbWFya2VyTW9kdWxvID0gMzA7XG4gICAgICBpbmNsdWRlTW9kdWxvID0gMTtcbiAgICAgIHR5cGUgPSAnMzBzZWMnO1xuICAgIH1cblxuICAgIGlmIChwaXhlbHNQZXJTZWNvbmQgPiBtaW5TdGVwKSB7XG4gICAgICBzdGVwID0gMTtcbiAgICAgIHRvRml4ZWQgPSAwO1xuICAgICAgbWFya2VyTW9kdWxvID0gMTA7XG4gICAgICBpbmNsdWRlTW9kdWxvID0gMTtcbiAgICAgIHR5cGUgPSAnc2VjJztcbiAgICB9XG5cbiAgICBpZiAocGl4ZWxzUGVyU2Vjb25kIC8gMTAgPiBtaW5TdGVwKSB7XG4gICAgICBzdGVwID0gMSAvIDEwO1xuICAgICAgdG9GaXhlZCA9IDE7XG4gICAgICBtYXJrZXJNb2R1bG8gPSAxMDtcbiAgICAgIGluY2x1ZGVNb2R1bG8gPSAxO1xuICAgICAgdHlwZSA9ICdkcyc7XG4gICAgfVxuXG4gICAgaWYgKHBpeGVsc1BlclNlY29uZCAvIDEwMCA+IG1pblN0ZXApIHtcbiAgICAgIHN0ZXAgPSAxIC8gMTAwO1xuICAgICAgdG9GaXhlZCA9IDI7XG4gICAgICBtYXJrZXJNb2R1bG8gPSAxMDtcbiAgICAgIGluY2x1ZGVNb2R1bG8gPSAxO1xuICAgICAgdHlwZSA9ICdjcyc7XG4gICAgfVxuXG4gICAgaWYgKHBpeGVsc1BlclNlY29uZCAvIDEwMDAgPiBtaW5TdGVwKSB7XG4gICAgICBzdGVwID0gMSAvIDEwMDA7XG4gICAgICB0b0ZpeGVkID0gMztcbiAgICAgIG1hcmtlck1vZHVsbyA9IDEwO1xuICAgICAgaW5jbHVkZU1vZHVsbyA9IDE7XG4gICAgICB0eXBlID0gJ21zJztcbiAgICB9XG5cbiAgICBmb3IgKGxldCB0aW1lID0gbWluOyB0aW1lIDwgbWF4OyB0aW1lICs9IHN0ZXApIHtcbiAgICAgIGNvbnN0IGZvcm1hdHRlZFRpbWUgPSB0aW1lLnRvRml4ZWQodG9GaXhlZCk7XG5cbiAgICAgIGlmIChNYXRoLnJvdW5kKGZvcm1hdHRlZFRpbWUgLyBzdGVwKSAlIGluY2x1ZGVNb2R1bG8gIT09IDApIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGF2b2lkIGZsb2F0aW5nIHBvaW50IGVycm9yc1xuICAgICAgY29uc3QgZm9jdXNlZCA9IE1hdGgucm91bmQoZm9ybWF0dGVkVGltZSAvIHN0ZXApICUgbWFya2VyTW9kdWxvID09PSAwID8gdHJ1ZSA6IGZhbHNlO1xuXG4gICAgICBjb25zdCBkYXR1bSA9IHsgdGltZTogZm9ybWF0dGVkVGltZSwgZm9jdXNlZCB9O1xuXG4gICAgICBpZiAoZm9jdXNlZCA9PT0gdHJ1ZSkge1xuICAgICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoMTAwMCAqIGZvcm1hdHRlZFRpbWUpO1xuICAgICAgICBjb25zdCBtaW4gPSBwYWRMZWZ0KGRhdGUuZ2V0TWludXRlcygpLCAwLCAyKTtcbiAgICAgICAgY29uc3Qgc2VjID0gcGFkTGVmdChkYXRlLmdldFNlY29uZHMoKSwgMCwgMik7XG4gICAgICAgIGNvbnN0IG1pbGxpID0gcGFkTGVmdChkYXRlLmdldE1pbGxpc2Vjb25kcygpLCAwLCAzKTtcbiAgICAgICAgY29uc3QgbGFiZWwgPSBgJHttaW59OiR7c2VjfToke21pbGxpfWA7XG5cbiAgICAgICAgZGF0dW0ubGFiZWwgPSBsYWJlbDtcbiAgICAgIH1cblxuICAgICAgZGF0YS5wdXNoKGRhdHVtKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfTtcbn0iXX0=