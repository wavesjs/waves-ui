var buffer = [];
var minMaxProxy;

'use strict';

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

