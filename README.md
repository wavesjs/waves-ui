# Zoomer module

This module is a simple zoom implementation that interacts with the internal zXoom behaviour of the `timeline`. The zoom values can be passed from any external source such as a slider or user interaction, this is just an implementation based on vertical and horizontal dragging on a DOM element.
  
_A working demo for this module can be found [here](#)_

## Example usage

```javascript
// assume yuo created a timeline with some layers
var graph = timeline();
// draw the graph
d3.select('#timeline').call(graph.draw)

// create the zoomer and link it to the timeline
var zoom = zoomer()
  // select the element on which to apply the behavior
  .select('#zoomer')
  .on('mousemove', function(e) {
    // update graph xZoom
    graph.xZoom(e);
  })
  .on('mouseup', function(e) {
    // set the final xZoom value of the graph
    graph.xZoomSet();
  });
```

## Public API


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