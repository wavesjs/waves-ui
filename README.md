# Waveform visualiser

Use this module to visualise waveform data over a shared timeline.  
The module relies on the [timeline](https://github.com/Ircam-RnD/timeLine) object.

_A working demo for this module can be found [here](#)_

## Example usage

```javascript
var d3 = require('d3');
var timeline = require('timeline');
var waveform = require('waveform');
var buffer = someAudioBuffer;

// create the graph
var graph = timeline()
  .xDomain([0, buffer.duration])
  .width(1000)
  .height(150)
  
// create the waveform layer
var waveformLayer = waveform()
  .params({ name: 'my-waveform' })
  // pass the raw ArrayBuffer from our audio buffer
  .data(buffer.getChannelData(0).buffer)
  .sampleRate(buffer.sampleRate)
  .duration(buffer.duration)
  .color('steelblue');

// add the waveform layer to the timeline
graph.layer(waveformLayer);

// draw the timeline
d3.select('#timeline').call(graph.draw);
```


## Public API

### params
`.params({ yDomain, renderingStrategy, triggerUpdateZoomDelta,  triggerUpdateDragDelta, [name] })`   

> Sets the state on the layer level.

> * @key `yDomain`, @value `[int, int]`  
> Sets the layer's scale's domain to the specified array of numbers. The array must contain two or more numbers.

> * @key `renderingStrategy`, @value `'svg|canvas'`, @defaults `'svg'`  
> Sets the layer's rendering strategy.

> * @key `triggerUpdateZoomDelta`, @value `float`, @defaults `0.02`  
> Sets the minimum zoom delta level that will trigger an update call.

> * @key `triggerUpdateDragDelta`, @value `float`, @defaults `0.02`  
> Sets the minimum dragged delta (in pixels) dragged that will trigger an update call.


### data 
`.data(data)`

> Sets the data to be rendered
> * @param `data`, @value `array|ArrayBuffer`, @defaults `0.02`  

##### `duration(duration)`

> @param `duration` {int}  
> duration of the ArrayBuffer to display (in second)  

##### `sampleRate(sampleRate)`

> @param `sampleRate` {int}    
> the sample rate of the ArrayBuffer to display (default 441000)

##### `color(color)`

> @param `color` {string}  
> color of the waveform



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