##Waveform visualiser

> Waveform drawing utility

Use this module to visualise waveform data over a shared timeline.  
The module relies on the [timeline](https://github.com/Ircam-RnD/timeLine) object.
###Demo

A woring demo for this module can be found [here](https://github.com/Ircam-RnD/waveform-vis)
### Usage

#### Data
Draw any array of data, even `ArrayBuffer`s!

```js
var buffer = […]; // some array || in this case an audio buffer
var basexDomain = [0, buffer.duration * 1000]; // to milliseconds
```

#### The Visualiser layer
```js
var waveform = waveformVis()
      .name('wf')
      .data(buffer)
      .precision(1024) // data snapshot resoultion in samples per pixel
      .xDomain(basexDomain)
      .yDomain([1, -1])
      .color('#C0CFCF') // optional
```

#### The timeLine layout
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