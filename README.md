##Waveform visualiser

> Waveform drawing utility

Use this module to visualise waveform data over a shared timeline.  
The module relies on the [timeline](https://github.com/Ircam-RnD/timeLine) object.
###Demo

A working demo for this module can be found [here](https://github.com/Ircam-RnD/waveform-vis)

### Public API

* `params(parameters)`

  @param `parameters` _object_  
  inherited from LayerVis, allow to customize the timeline from a layer perspective. ex:  

  ```javascript
  waveform.params({
    id: 'my-timeline', // set a unique id, optionnal, if not defined a default unique id is generated
    yDomain: [-1, 1] // the y domain of the data - default to [-1, 1] according to the domain of an audio buffer
  })
  ```

* `data(data)`

  @param `data` ArrayBuffer  
  an ArrayBuffer to display

* `duration(duration)`

  @param `duration` _int_ (in second)  
  duration of the ArrayBuffer to display

* `sampleRate(sampleRate)`

  @param `sampleRate` _int_ (default 441000)  
  the sample rate of the ArrayBuffer to display

* `color(color)`

  @param `color` _string_  
  color of the waveform


#### Example Use

```javascript
var d3 = require('d3');
var timeline = require('timeline');
var waveformVis = require('waveform-vis');
var buffer = someAudioBuffer;

// create the graph
var graph = timeline()
  .xDomain([0, buffer.duration])
  .width(1000)
  .height(150)
  

// create the waveform layer
var waveform = waveformVis()
  .params({ id: 'my-waveform' })
  .data(buffer.getChannelData(0).buffer) // pass the raw ArrayBuffer from audio buffer
  .sampleRate(buffer.sampleRate)
  .duration(buffer.duration)
  .color('steelblue');

// add the waveform layer to the timeline
graph.layer(waveform);

// draw the timeline
d3.select('#timeline').call(graph.draw);
```

### Status

This library is under heavy development and subject to change.  
Evert new API breaking change we will be adding snapshots to the repository so you can always fetch a working copy.

For an in depth  explanation on the philosophy and usage of this library please refer to [this blog post](http://wave.ircam.fr/publications/visual-tools/).
## License
This module is released under the [BSD-3-Clause license](http://opensource.org/licenses/BSD-3-Clause).
## Acknowledgments
This code is part of the [WAVE project](http://wave.ircam.fr),  
funded by ANR (The French National Research Agency),  
_ContInt_ program,  
2012-2015.