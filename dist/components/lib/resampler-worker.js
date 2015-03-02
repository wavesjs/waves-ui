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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9oZWxwZXJzL3pvb21lci5lczYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDaEIsSUFBSSxXQUFXLENBQUMiLCJmaWxlIjoic3JjL2hlbHBlcnMvem9vbWVyLmVzNi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gIEBPQlNPTEVURVxuKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIGJ1ZmZlciA9IFtdO1xudmFyIG1pbk1heFByb3h5O1xuXG4vKlxuc2VsZi5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24obWVzc2FnZSkge1xuXG4gIHZhciBkYXRhID0gbWVzc2FnZS5kYXRhO1xuXG4gIHN3aXRjaCAoZGF0YS5jbWQpIHtcbiAgICBjYXNlICdpbml0aWFsaXplJzpcbiAgICAgIGJ1ZmZlciA9IGRhdGEuYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIgP1xuICAgICAgICBuZXcgRmxvYXQzMkFycmF5KGRhdGEuYnVmZmVyKSA6IGRhdGEuYnVmZmVyO1xuXG4gICAgICBtaW5NYXhQcm94eSA9IG5ldyBGdW5jdGlvbigncmV0dXJuICcgKyBkYXRhLm1pbk1heCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdkb3duU2FtcGxlJzpcbiAgICAgIHZhciBtaW5NYXggPSBtaW5NYXhQcm94eSgpO1xuXG4gICAgICBkYXRhLmRvd25TYW1wbGVkVmlldyA9IG1pbk1heChcbiAgICAgICAgYnVmZmVyLFxuICAgICAgICBkYXRhLmV4dHJhY3RBdFRpbWVzLFxuICAgICAgICBkYXRhLnNhbXBsZVJhdGUsXG4gICAgICAgIGRhdGEud2luZG93U2l6ZSxcbiAgICAgICAgZGF0YS5kZWZhdWx0VmFsdWVcbiAgICAgICk7XG5cbiAgICAgIHNlbGYucG9zdE1lc3NhZ2UoZGF0YSk7XG4gICAgICBicmVhaztcbiAgfVxufSwgZmFsc2UpO1xuKi9cblxuIl19