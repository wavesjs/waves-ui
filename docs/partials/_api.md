## Usage

### Data
Draw any array of data, even `ArrayBuffer`s!

```js
var buffer = […]; // some array || in this case an audio buffer
var basexDomain = [0, buffer.duration * 1000]; // to milliseconds
```

### The Visualiser layer
```js
var waveform = waveformVis()
      .name('wf')
      .data(buffer)
      .precision(1024) // data snapshot resoultion in samples per pixel
      .xDomain(basexDomain)
      .yDomain([1, -1])
      .color('#C0CFCF') // optional
```

### The timeLine layout
In order to do this you need the [timeLine](https://github.com/Ircam-RnD/timeLine) module.
```js
var graph = timeLine()
  .xDomain(basexDomain) // shared time domain
  .width(500)
  .height(80)
  .layer(waveform) // waveform visualiser layer
  .draw; // the callable endpoint

d3.select('.timeline').call(graph);
```