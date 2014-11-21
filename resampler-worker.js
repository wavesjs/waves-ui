self.addEventListener('message', function(message) {

  var data = message.data;
  // create a view of the binary ArrayBuffer
  var buffer = new Float32Array(message.data.buffer);
  var downSampledView;

  switch (data.cmd) {
    // case 'minMax': // @FIXME: broken due to API changes
    //   var downSampledView = minMax(message.data, message.width, message.step);
    //   break;
    case 'median':
      var downSampledView = median(buffer, data.samplesPerPixel);
      break;
    case 'minMax':
      var downSampledView = minMax(buffer, data.samplesPerPixel);
      break;
  }

  data.downSampledView = downSampledView;
  self.postMessage(data, [data.buffer]);
}, false);

// function median
function median(data, samplesPerPixel) {
  var downSampledView = [];
  var length = data.length;
  var start = 0, end;

  while (start < length) {
    var median;
    var end = start + samplesPerPixel;
    var extract = data.subarray(start, end);
    // convert to Array and sort values
    extract = Array.prototype.slice.call(extract);
    extract.sort(function(a, b) { return a - b; });

    var extractLength = extract.length;
    var half = Math.floor(extractLength / 2);

    if (extractLength % 2 !== 0) {
      median = extract[half];
    } else {
      median = (extract[half - 1] + extract[half]) / 2;
    }

    downSampledView.push(median);
    // prepare start for next step
    start = end;
  }

  return downSampledView;
}

// return min and max values from the window defined by samplesPerPixel
function minMax(data, samplesPerPixels) {
  var downSampledView = [];
  var length = data.length;
  var start = 0, end;
  var min = Math.min;
  var max = Math.max;

  while (start < length) {
    var end = start + samplesPerPixels;
    var extract = data.subarray(start, end);

    var minVal = min.apply(null, extract);
    var maxVal = max.apply(null, extract);

    downSampledView.push(minVal);
    downSampledView.push(maxVal);

    start = end;
  }

  return downSampledView;
}

// function minMax(data, width, step) {
//   var ret = [];

//   for (var i = 0; i < width; i++) {
//     var o = {};
//     var min = 1.0;
//     var max = -1.0;

//     for (var j = 0; j < step; j++) {
//       var datum = data[(i * step) + j];
//       if (datum < min) min = datum;
//       if (datum > max) max = datum;
//     }

//     o.max = max;
//     o.min = min;
//     ret.push(o);
//   }

//   postMessage({cmd: 'downSample', message: ret});
// }

