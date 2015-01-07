# Waveform visualiser

Use this module to visualise waveform data over a shared timeline.  
The module relies on the [timeline](https://github.com/Ircam-RnD/timeLine) object.

<!-- _A working demo for this module can be found [here](#)_ -->

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
  .params({ name: 'my-waveform', renderingStrategy: 'svg' })
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

### #params( _[params]_ )

<!-- ```javascript
// Usage
.params({
  yDomain: [0, 100],
  renderingStrategy: 'svg',
  // ...
})
``` -->

> @param _`params`_, @value `Object`

If _`params`_ is present sets the layer's parameters via the passed in _`params`_`Object`, otherwise returns the layer's internal parameters.  


> * @key `yDomain`, @value `[int, int]`  
> Sets the layer's scale's domain to the specified array of numbers. The array must contain two or more numbers.

> * @key `renderingStrategy`, @value `'svg|canvas'`, @defaults `'svg'`  
> Sets the layer's rendering strategy.

> * @key `triggerUpdateZoomDelta`, @value `float`, @defaults `0.02`  
> Sets the minimum zoom delta level that will trigger an update call.

> * @key `triggerUpdateDragDelta`, @value `float`, @defaults `0.02`  
> Sets the minimum dragged delta (in pixels) dragged that will trigger an update call.


### #data( _[data]_ )

> @param _`data`_, @value `Array|ArrayBuffer`, @optional  

If _`data`_ is present sets the data to be rendered via the passed in _`data`_`Array{Buffer}`, otherwise returns the _`data`_`Array{Buffer}`.

### #duration( _[duration]_ )

> @param _`duration`_, @value `Number`, @optional  

If _`duration`_ is present sets the duration of the data to be rendered via the passed in _`duration`_`Number`, otherwise returns the _`duration`_`Number`. Must be specified in the same unit as the `timeline`'s xDomain.


### #sampleRate( _[sampleRate]_ )

> @param _`sampleRate`_, @value `Number`, @optional    

If _`sampleRate`_ is present sets the sampleRate of the _`data`_ array via the passed in _`sampleRate`_`Number`, otherwise returns the _`sampleRate`_`Number`.

### #color( _[color]_ )

> @param _`color`_, @value `String`, @optional  

If _`color`_ is present sets the color to be use for the rendering via the passed in _`color`_`(hex)String`, otherwise returns the _`color`_`(hex)String`.

## Status
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