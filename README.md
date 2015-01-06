# timeline

This module is a layer/layout manager for time based visualisations written on top of [d3.js](http://d3js.org/).
The module by itself doesn't accomplish much as long as you don't pass it in some visualisation layer or component.
This illustrates how you could use with a [segment visualiser](https://github.com/ircam-rnd/segment-vis).

## Status

This library is under heavy development and subject to change.
Evert new API breaking change we will be adding snapshots to the repository so you can always fetch a working copy.

For an in depth  explanation on the philosophy and usage of this library please refer to [this blog post](http://wave.ircam.fr/publications/visual-tools/).

## Usage

### Public API

##### `constructor(options)`

> @param `options` {object}
> `options.name` a unique name to identify the timeline

##### `width(value)`

>  @param `value` {int}  
>  set the width of the timeline (in pixels)

##### `height(value)`

>  @param `value` {int}  
>  set the height of the timeline (in pixels)

##### `xDomain(dataDomain)`

>  @param `dataDomain` {array} [minValue, maxValue]  
>  set the data domain of the timeline (internally defines a d3 scale domain).

```javascript
// example
timeline.xDomain([0, buffer.duration]);
```

##### `layer(layerInstance)` _alias_ `add(layerInstance)`

>  @param `layerInstance` {object}  
>  add a visualization layer to the timeline the layer should inherit from LayerVis

##### `remove(layerInstance)`

>  @param `layerInstance` {object}  
>  remove a layer from the timeline

##### `draw(sel)`

>  @param `sel` {object} _some d3 selection given from d3.call_  
>  construct all layers registered in the timeline and initialize event delegation

```javascript
// example
d3.select('#timeline').call(timeline.draw)
```

##### `update(...layers)`

>  @params `...layers` {list} _optionnal_  
>  any number of layer to update, references to the layers to update,  
>  if no arguments given, update all registered layers


### Example use

```javascript
// import the package - assume a commonjs environment (aka browserify)
var timeline = require('timeline');
var buffer = someAudioBuffer;

// create the timeline
var graph = timeline()
  .width(1000)
  .height(150)
  .xDomain([0, buffer.duration])

// add some layers
graph.layer(segmentVis);
graph.layer(waveformVis);

// draw the timeline
d3.select('#timeline').call(graph.draw);

// ... later to render some data changes
graph.update();
```

<div class="only-readme">
<h2>License</h2>
<p>This module is released under the <a href="http://opensource.org/licenses/BSD-3-Clause">BSD-3-Clause license</a>.</p>

<h2>Acknowledgments</h2>
<p>This code is part of the <a href="http://wave.ircam.fr">WAVE project</a>, funded by ANR (The French National Research Agency), <em>ContInt</em> program, 2012-2015.</p>
</div>