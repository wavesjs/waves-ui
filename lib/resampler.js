self.addEventListener('message', function(e) {

  var data = e.data;
  var message = data.message;

  switch (data.cmd) {
    
    case 'downSample':
      downSample(message.data, message.width, message.step);
      break;
  }

}, false);

function downSample(data, width, step) {
  var ret = [];

  for (var i = 0; i < width; i++) {
    var o = {};
    var min = 1.0;
    var max = -1.0;
    
    for (var j = 0; j < step; j++) {
      var datum = data[(i * step) + j];
      if (datum < min) min = datum;
      if (datum > max) max = datum;
    }

    o.max = max;
    o.min = min;
    ret.push(o);
  }

  postMessage({cmd: 'downSample', message: ret});
}