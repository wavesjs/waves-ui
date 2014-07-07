## Zoomer module

> Zooming behaviour

This module is a simple zoom implementation that interacts with the internal zXoom behaviour of the `timeline`.  
The zoom values can be passed from any external source such as a slider or user interaction, this is just an implementation bases on vertical and horizontal dragging in a div.
###Demo

To see the zoomer in action you can visit this demo [here](https://ircam-rnd.github.io/waveform-vis) And click+scroll for zooming and panning on the waveform.
### Usage

#### Creating a brush layer
```js
var brush = brushVis().name('bruce');
```

#### Handling the brush events
```js
// Brush interaction
brush.on('brush', function(extent) {
  // we loop trhough layers
  for (var ly in graph.layers) {
    var layer = graph.layers[ly];
    // call the layer's brushItem implementation and pass it in the extent
    if(layer.brushItem) layer.brushItem(extent);
  }
})
.on('brushend', function(){
  // on release we clear the brush region
  this.clear();
});
```

#### Creating the timeLine layout
```js
var graph = timeLine()
  .width(750)
  .height(150);
```

#### Adding the layer and drawing the graph
```js
// add the layer
graph.layer(brush);
// Draw the layer
d3.select('.timeline').call(graph.draw);
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