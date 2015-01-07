// return min and max values from the window defined by samplesPerPixel
function minMax(buffer, extractAtTimes, sampleRate, windowSize, defaultValue, downSampledAt) {
  // if the buffer comes from the `createSnapshot` function
  // `downSampledAt` is equivalent to the window size
  // of the snapshot
  downSampledAt = downSampledAt || 1;
  windowSize = windowSize / downSampledAt;
  sampleRate = sampleRate / downSampledAt;
  // console.log(windowSize);
  // console.time('minMax');

  var bufferLength = buffer.length;
  var data = [];
  var slice = (buffer instanceof Float32Array) ? 'subarray' : 'slice';

  for (var i = 0, length = extractAtTimes.length; i < length; i++) {
    var startTime = extractAtTimes[i];
    var sampleStart = startTime * sampleRate;

    if (sampleStart < 0 || sampleStart > bufferLength) {
      data = data.concat([defaultValue, defaultValue]);
      continue;
    }

    // get min and max value for each pixel
    // replace with `slice` if it's a raw object
    var extract = buffer[slice](sampleStart, sampleStart + windowSize);
    var min = Infinity, max = -Infinity;
    var extractLength = extract.length;

    for (var j = 0; j < extractLength; j++) {
      var value = extract[j];
      if (value < min) { min = value; }
      if (value > max) { max = value; }
    }

    data.push(min);
    data.push(max);
  }

  // console.timeEnd('minMax');
  return data;
}

// pick a value in each window
// alternate between min and max value
function createSnapshot(buffer, windowSize) {
  var snapshot = [];
  var bufferLength = buffer.length;
  var slice = (buffer instanceof Float32Array) ? 'subarray' : 'slice';
  var captureMin = true;
  // return;
  for (var i = 0; i < bufferLength; i += windowSize) {
    var extract = buffer[slice](i, i + windowSize);
    var min = Infinity, max = -Infinity;
    var extractLength = extract.length;

    for (var j = 0; j < extractLength; j++) {
      var value = extract[j];
      if (value < min) { min = value; }
      if (value > max) { max = value; }
    }

    if (captureMin) {
      snapshot.push(min);
    } else {
      snapshot.push(max);
    }

    captureMin = !captureMin;
  }

  return snapshot;
}

module.exports = {
  minMax: minMax,
  createSnapshot: createSnapshot
};