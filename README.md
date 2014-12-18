## Waveform visualiser

> Waveform drawing utility

Use this module to visualise waveform data over a shared timeline.  
The module relies on the [timeline](https://github.com/Ircam-RnD/timeLine) object.

### Demo

A working demo for this module can be found [here](https://github.com/Ircam-RnD/waveform-vis)

### Public API

##### `params(parameters)`

> @param `parameters` {object}  
> inherited from LayerVis, allow to customize the waveform from a layer perspective. 

_example:_ 

```javascript
var waveform = waveformVis()
  .params({
    // set a unique id, optionnal, 
    // if not defined a default unique id is generated
    id: 'my-timeline',
    // the y domain of the data - default to [-1, 1] 
    // according to the domain of an audio buffer 
    yDomain: [-1, 1],
    // rendering strategy `canvas` or `svg`, 
    // defaults to svg
    renderingStrategy: 'svg',
    // use a web worker to parse data for visualization, 
    // may be usefull with many waveforms
    useWorker: false,
    // zoom delta before updating underlaying data
    triggerUpdateZoomDelta: 0.01
  });
```

##### `data(data)`

> @param `data` {ArrayBuffer|Array}  
> an ArrayBuffer to display

##### `duration(duration)`

> @param `duration` {int}  
> duration of the ArrayBuffer to display (in second)  

##### `sampleRate(sampleRate)`

> @param `sampleRate` {int}    
> the sample rate of the ArrayBuffer to display (default 441000)

##### `color(color)`

> @param `color` {string}  
> color of the waveform


#### Example use

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
  // pass the raw ArrayBuffer from audio buffer
  .data(buffer.getChannelData(0).buffer)
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