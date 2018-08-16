'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _format = require('../utils/format');

/**
 * A generator to create data for time axis.
 *
 * [example usage](./examples/layer-axis.html)
 *
 * @return {Function} - The configured function returning the data when called.
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
    var step = void 0,
        type = void 0,
        toFixed = void 0,
        markerModulo = void 0,
        includeModulo = void 0;

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
        var _min = (0, _format.padLeft)(date.getMinutes(), 0, 2);
        var sec = (0, _format.padLeft)(date.getSeconds(), 0, 2);
        var milli = (0, _format.padLeft)(date.getMilliseconds(), 0, 3);
        var label = _min + ':' + sec + ':' + milli;

        datum.label = label;
      }

      data.push(datum);
    }

    return data;
  };
}

exports.default = timeAxisGenerator;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRpbWVBeGlzR2VuZXJhdG9yLmpzIl0sIm5hbWVzIjpbInRpbWVBeGlzR2VuZXJhdG9yIiwidGltZUNvbnRleHQiLCJkdXJhdGlvbiIsInZpc2libGVEdXJhdGlvbiIsIm9mZnNldCIsImRhdGEiLCJtaW4iLCJtYXgiLCJwaXhlbHNQZXJTZWNvbmQiLCJjb21wdXRlZFBpeGVsc1BlclNlY29uZCIsIm1pblN0ZXAiLCJzdGVwIiwidHlwZSIsInRvRml4ZWQiLCJtYXJrZXJNb2R1bG8iLCJpbmNsdWRlTW9kdWxvIiwidGltZSIsImZvcm1hdHRlZFRpbWUiLCJNYXRoIiwicm91bmQiLCJmb2N1c2VkIiwiZGF0dW0iLCJkYXRlIiwiRGF0ZSIsImdldE1pbnV0ZXMiLCJzZWMiLCJnZXRTZWNvbmRzIiwibWlsbGkiLCJnZXRNaWxsaXNlY29uZHMiLCJsYWJlbCIsInB1c2giXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOztBQUdBOzs7Ozs7O0FBT0EsU0FBU0EsaUJBQVQsR0FBNkI7QUFDM0I7QUFDQSxTQUFPLFVBQVNDLFdBQVQsRUFBc0I7QUFDM0IsUUFBTUMsV0FBV0QsWUFBWUUsZUFBN0I7QUFDQSxRQUFNQyxTQUFTSCxZQUFZRyxNQUEzQjtBQUNBLFFBQU1DLE9BQU8sRUFBYjs7QUFFQTtBQUNBLFFBQU1DLE1BQU0sQ0FBRUYsTUFBZDtBQUNBO0FBQ0EsUUFBTUcsTUFBTUwsV0FBV0UsTUFBdkI7O0FBRUE7QUFDQSxRQUFNSSxrQkFBa0JQLFlBQVlRLHVCQUFwQztBQUNBLFFBQU1DLFVBQVUsQ0FBaEI7O0FBRUE7QUFDQSxRQUFJQyxhQUFKO0FBQUEsUUFBVUMsYUFBVjtBQUFBLFFBQWdCQyxnQkFBaEI7QUFBQSxRQUF5QkMscUJBQXpCO0FBQUEsUUFBdUNDLHNCQUF2Qzs7QUFFQSxRQUFJUCxrQkFBa0IsQ0FBbEIsR0FBc0JFLE9BQTFCLEVBQW1DO0FBQ2pDQyxhQUFPLENBQVAsQ0FEaUMsQ0FDdkI7QUFDVkUsZ0JBQVUsQ0FBVjtBQUNBQyxxQkFBZSxFQUFmLENBSGlDLENBR2Q7QUFDbkJDLHNCQUFnQixDQUFoQixDQUppQyxDQUlkO0FBQ25CSCxhQUFPLE9BQVA7QUFDRDs7QUFFRCxRQUFJSixrQkFBa0IsQ0FBbEIsR0FBc0JFLE9BQTFCLEVBQW1DO0FBQ2pDQyxhQUFPLENBQVA7QUFDQUUsZ0JBQVUsQ0FBVjtBQUNBQyxxQkFBZSxFQUFmO0FBQ0FDLHNCQUFnQixDQUFoQjtBQUNBSCxhQUFPLE9BQVA7QUFDRDs7QUFFRCxRQUFJSixrQkFBa0JFLE9BQXRCLEVBQStCO0FBQzdCQyxhQUFPLENBQVA7QUFDQUUsZ0JBQVUsQ0FBVjtBQUNBQyxxQkFBZSxFQUFmO0FBQ0FDLHNCQUFnQixDQUFoQjtBQUNBSCxhQUFPLEtBQVA7QUFDRDs7QUFFRCxRQUFJSixrQkFBa0IsRUFBbEIsR0FBdUJFLE9BQTNCLEVBQW9DO0FBQ2xDQyxhQUFPLElBQUksRUFBWDtBQUNBRSxnQkFBVSxDQUFWO0FBQ0FDLHFCQUFlLEVBQWY7QUFDQUMsc0JBQWdCLENBQWhCO0FBQ0FILGFBQU8sSUFBUDtBQUNEOztBQUVELFFBQUlKLGtCQUFrQixHQUFsQixHQUF3QkUsT0FBNUIsRUFBcUM7QUFDbkNDLGFBQU8sSUFBSSxHQUFYO0FBQ0FFLGdCQUFVLENBQVY7QUFDQUMscUJBQWUsRUFBZjtBQUNBQyxzQkFBZ0IsQ0FBaEI7QUFDQUgsYUFBTyxJQUFQO0FBQ0Q7O0FBRUQsUUFBSUosa0JBQWtCLElBQWxCLEdBQXlCRSxPQUE3QixFQUFzQztBQUNwQ0MsYUFBTyxJQUFJLElBQVg7QUFDQUUsZ0JBQVUsQ0FBVjtBQUNBQyxxQkFBZSxFQUFmO0FBQ0FDLHNCQUFnQixDQUFoQjtBQUNBSCxhQUFPLElBQVA7QUFDRDs7QUFFRCxTQUFLLElBQUlJLE9BQU9WLEdBQWhCLEVBQXFCVSxPQUFPVCxHQUE1QixFQUFpQ1MsUUFBUUwsSUFBekMsRUFBK0M7QUFDN0MsVUFBTU0sZ0JBQWdCRCxLQUFLSCxPQUFMLENBQWFBLE9BQWIsQ0FBdEI7O0FBRUEsVUFBSUssS0FBS0MsS0FBTCxDQUFXRixnQkFBZ0JOLElBQTNCLElBQW1DSSxhQUFuQyxLQUFxRCxDQUF6RCxFQUE0RDtBQUMxRDtBQUNEOztBQUVEO0FBQ0EsVUFBTUssVUFBVUYsS0FBS0MsS0FBTCxDQUFXRixnQkFBZ0JOLElBQTNCLElBQW1DRyxZQUFuQyxLQUFvRCxDQUFwRCxHQUF3RCxJQUF4RCxHQUErRCxLQUEvRTs7QUFFQSxVQUFNTyxRQUFRLEVBQUVMLE1BQU1DLGFBQVIsRUFBdUJHLGdCQUF2QixFQUFkOztBQUVBLFVBQUlBLFlBQVksSUFBaEIsRUFBc0I7QUFDcEIsWUFBTUUsT0FBTyxJQUFJQyxJQUFKLENBQVMsT0FBT04sYUFBaEIsQ0FBYjtBQUNBLFlBQU1YLE9BQU0scUJBQVFnQixLQUFLRSxVQUFMLEVBQVIsRUFBMkIsQ0FBM0IsRUFBOEIsQ0FBOUIsQ0FBWjtBQUNBLFlBQU1DLE1BQU0scUJBQVFILEtBQUtJLFVBQUwsRUFBUixFQUEyQixDQUEzQixFQUE4QixDQUE5QixDQUFaO0FBQ0EsWUFBTUMsUUFBUSxxQkFBUUwsS0FBS00sZUFBTCxFQUFSLEVBQWdDLENBQWhDLEVBQW1DLENBQW5DLENBQWQ7QUFDQSxZQUFNQyxRQUFXdkIsSUFBWCxTQUFrQm1CLEdBQWxCLFNBQXlCRSxLQUEvQjs7QUFFQU4sY0FBTVEsS0FBTixHQUFjQSxLQUFkO0FBQ0Q7O0FBRUR4QixXQUFLeUIsSUFBTCxDQUFVVCxLQUFWO0FBQ0Q7O0FBRUQsV0FBT2hCLElBQVA7QUFDRCxHQTNGRDtBQTRGRDs7a0JBRWNMLGlCIiwiZmlsZSI6InRpbWVBeGlzR2VuZXJhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcGFkTGVmdCB9IGZyb20gJy4uL3V0aWxzL2Zvcm1hdCc7XG5cblxuLyoqXG4gKiBBIGdlbmVyYXRvciB0byBjcmVhdGUgZGF0YSBmb3IgdGltZSBheGlzLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLWF4aXMuaHRtbClcbiAqXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gLSBUaGUgY29uZmlndXJlZCBmdW5jdGlvbiByZXR1cm5pbmcgdGhlIGRhdGEgd2hlbiBjYWxsZWQuXG4gKi9cbmZ1bmN0aW9uIHRpbWVBeGlzR2VuZXJhdG9yKCkge1xuICAvLyBhZGQgZmFjdG9yeSB0byBzaGFyZSBBUEkgd2l0aCBicG1HZW5lcmF0b3JcbiAgcmV0dXJuIGZ1bmN0aW9uKHRpbWVDb250ZXh0KSB7XG4gICAgY29uc3QgZHVyYXRpb24gPSB0aW1lQ29udGV4dC52aXNpYmxlRHVyYXRpb247XG4gICAgY29uc3Qgb2Zmc2V0ID0gdGltZUNvbnRleHQub2Zmc2V0O1xuICAgIGNvbnN0IGRhdGEgPSBbXTtcblxuICAgIC8vIGNvbnN0IG1pbiA9IE1hdGgubWluKC1vZmZzZXQsIDApO1xuICAgIGNvbnN0IG1pbiA9IC0gb2Zmc2V0O1xuICAgIC8vIHJlbW92ZSB0aGUgdGltZWxpbmUncyBvZmZzZXQgdG8ga2VlcCB0aGUgbGF5ZXIgY2VudGVyZWRcbiAgICBjb25zdCBtYXggPSBkdXJhdGlvbiAtIG9mZnNldDtcblxuICAgIC8vIGRlZmluZSBwaXhlbHMgZm9yIDEgc2Vjb25kXG4gICAgY29uc3QgcGl4ZWxzUGVyU2Vjb25kID0gdGltZUNvbnRleHQuY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmQ7XG4gICAgY29uc3QgbWluU3RlcCA9IDc7XG5cbiAgICAvLyBkZWZpbmUgYWxsIGRpc3BsYXkgaW5mb3JtYXRpb24gYWNjb3JkaW5nIHRvIHRoZSBwaXhlbHNQZXJTZWNvbmQgcmF0aW9cbiAgICBsZXQgc3RlcCwgdHlwZSwgdG9GaXhlZCwgbWFya2VyTW9kdWxvLCBpbmNsdWRlTW9kdWxvO1xuXG4gICAgaWYgKHBpeGVsc1BlclNlY29uZCAqIDQgPiBtaW5TdGVwKSB7XG4gICAgICBzdGVwID0gMTsgLy8gdGhlIHN0ZXAgdG8gdXNlIHRvIGNvbXB1dGUgdGltZVxuICAgICAgdG9GaXhlZCA9IDA7XG4gICAgICBtYXJrZXJNb2R1bG8gPSA2MDsgLy8gYSB0aW1lc3RhbXAgZXZlcnkgNSBzdGVwaXhlbHNQZXJTZWNvbmRcbiAgICAgIGluY2x1ZGVNb2R1bG8gPSA1OyAvLyBhIHRpY2sgZXZlcnkgNSBzdGVwaXhlbHNQZXJTZWNvbmRcbiAgICAgIHR5cGUgPSAnNjBzZWMnO1xuICAgIH1cblxuICAgIGlmIChwaXhlbHNQZXJTZWNvbmQgKiAyID4gbWluU3RlcCkge1xuICAgICAgc3RlcCA9IDE7XG4gICAgICB0b0ZpeGVkID0gMDtcbiAgICAgIG1hcmtlck1vZHVsbyA9IDMwO1xuICAgICAgaW5jbHVkZU1vZHVsbyA9IDE7XG4gICAgICB0eXBlID0gJzMwc2VjJztcbiAgICB9XG5cbiAgICBpZiAocGl4ZWxzUGVyU2Vjb25kID4gbWluU3RlcCkge1xuICAgICAgc3RlcCA9IDE7XG4gICAgICB0b0ZpeGVkID0gMDtcbiAgICAgIG1hcmtlck1vZHVsbyA9IDEwO1xuICAgICAgaW5jbHVkZU1vZHVsbyA9IDE7XG4gICAgICB0eXBlID0gJ3NlYyc7XG4gICAgfVxuXG4gICAgaWYgKHBpeGVsc1BlclNlY29uZCAvIDEwID4gbWluU3RlcCkge1xuICAgICAgc3RlcCA9IDEgLyAxMDtcbiAgICAgIHRvRml4ZWQgPSAxO1xuICAgICAgbWFya2VyTW9kdWxvID0gMTA7XG4gICAgICBpbmNsdWRlTW9kdWxvID0gMTtcbiAgICAgIHR5cGUgPSAnZHMnO1xuICAgIH1cblxuICAgIGlmIChwaXhlbHNQZXJTZWNvbmQgLyAxMDAgPiBtaW5TdGVwKSB7XG4gICAgICBzdGVwID0gMSAvIDEwMDtcbiAgICAgIHRvRml4ZWQgPSAyO1xuICAgICAgbWFya2VyTW9kdWxvID0gMTA7XG4gICAgICBpbmNsdWRlTW9kdWxvID0gMTtcbiAgICAgIHR5cGUgPSAnY3MnO1xuICAgIH1cblxuICAgIGlmIChwaXhlbHNQZXJTZWNvbmQgLyAxMDAwID4gbWluU3RlcCkge1xuICAgICAgc3RlcCA9IDEgLyAxMDAwO1xuICAgICAgdG9GaXhlZCA9IDM7XG4gICAgICBtYXJrZXJNb2R1bG8gPSAxMDtcbiAgICAgIGluY2x1ZGVNb2R1bG8gPSAxO1xuICAgICAgdHlwZSA9ICdtcyc7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgdGltZSA9IG1pbjsgdGltZSA8IG1heDsgdGltZSArPSBzdGVwKSB7XG4gICAgICBjb25zdCBmb3JtYXR0ZWRUaW1lID0gdGltZS50b0ZpeGVkKHRvRml4ZWQpO1xuXG4gICAgICBpZiAoTWF0aC5yb3VuZChmb3JtYXR0ZWRUaW1lIC8gc3RlcCkgJSBpbmNsdWRlTW9kdWxvICE9PSAwKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBhdm9pZCBmbG9hdGluZyBwb2ludCBlcnJvcnNcbiAgICAgIGNvbnN0IGZvY3VzZWQgPSBNYXRoLnJvdW5kKGZvcm1hdHRlZFRpbWUgLyBzdGVwKSAlIG1hcmtlck1vZHVsbyA9PT0gMCA/IHRydWUgOiBmYWxzZTtcblxuICAgICAgY29uc3QgZGF0dW0gPSB7IHRpbWU6IGZvcm1hdHRlZFRpbWUsIGZvY3VzZWQgfTtcblxuICAgICAgaWYgKGZvY3VzZWQgPT09IHRydWUpIHtcbiAgICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKDEwMDAgKiBmb3JtYXR0ZWRUaW1lKTtcbiAgICAgICAgY29uc3QgbWluID0gcGFkTGVmdChkYXRlLmdldE1pbnV0ZXMoKSwgMCwgMik7XG4gICAgICAgIGNvbnN0IHNlYyA9IHBhZExlZnQoZGF0ZS5nZXRTZWNvbmRzKCksIDAsIDIpO1xuICAgICAgICBjb25zdCBtaWxsaSA9IHBhZExlZnQoZGF0ZS5nZXRNaWxsaXNlY29uZHMoKSwgMCwgMyk7XG4gICAgICAgIGNvbnN0IGxhYmVsID0gYCR7bWlufToke3NlY306JHttaWxsaX1gO1xuXG4gICAgICAgIGRhdHVtLmxhYmVsID0gbGFiZWw7XG4gICAgICB9XG5cbiAgICAgIGRhdGEucHVzaChkYXR1bSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IHRpbWVBeGlzR2VuZXJhdG9yO1xuIl19