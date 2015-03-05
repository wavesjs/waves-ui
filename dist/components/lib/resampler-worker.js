"use strict";

var buffer = [];
var minMaxProxy;

/*
self.addEventListener('message', function(message) {

  var data = message.data;

  switch (data.cmd) {
    case 'initialize':
      buffer = data.buffer instanceof ArrayBuffer ?
        new Float32Array(data.buffer) : data.buffer;

      minMaxProxy = new Function('return ' + data.minMax);
      break;
    case 'downSample':
      var minMax = minMaxProxy();

      data.downSampledView = minMax(
        buffer,
        data.extractAtTimes,
        data.sampleRate,
        data.windowSize,
        data.defaultValue
      );

      self.postMessage(data);
      break;
  }
}, false);
*/
/*
  @OBSOLETE
*/
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9oZWxwZXJzL3pvb21lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUtBLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNoQixJQUFJLFdBQVcsQ0FBQyIsImZpbGUiOiJlczYvaGVscGVycy96b29tZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICBAT0JTT0xFVEVcbiovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBidWZmZXIgPSBbXTtcbnZhciBtaW5NYXhQcm94eTtcblxuLypcbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uKG1lc3NhZ2UpIHtcblxuICB2YXIgZGF0YSA9IG1lc3NhZ2UuZGF0YTtcblxuICBzd2l0Y2ggKGRhdGEuY21kKSB7XG4gICAgY2FzZSAnaW5pdGlhbGl6ZSc6XG4gICAgICBidWZmZXIgPSBkYXRhLmJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyID9cbiAgICAgICAgbmV3IEZsb2F0MzJBcnJheShkYXRhLmJ1ZmZlcikgOiBkYXRhLmJ1ZmZlcjtcblxuICAgICAgbWluTWF4UHJveHkgPSBuZXcgRnVuY3Rpb24oJ3JldHVybiAnICsgZGF0YS5taW5NYXgpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnZG93blNhbXBsZSc6XG4gICAgICB2YXIgbWluTWF4ID0gbWluTWF4UHJveHkoKTtcblxuICAgICAgZGF0YS5kb3duU2FtcGxlZFZpZXcgPSBtaW5NYXgoXG4gICAgICAgIGJ1ZmZlcixcbiAgICAgICAgZGF0YS5leHRyYWN0QXRUaW1lcyxcbiAgICAgICAgZGF0YS5zYW1wbGVSYXRlLFxuICAgICAgICBkYXRhLndpbmRvd1NpemUsXG4gICAgICAgIGRhdGEuZGVmYXVsdFZhbHVlXG4gICAgICApO1xuXG4gICAgICBzZWxmLnBvc3RNZXNzYWdlKGRhdGEpO1xuICAgICAgYnJlYWs7XG4gIH1cbn0sIGZhbHNlKTtcbiovXG5cbiJdfQ==