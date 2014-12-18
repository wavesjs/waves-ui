## Breakpoint function visualiser

> Breakpoint visualiser component

Use this module to visualise breakpoints over a shared timeline.  
The module relies on a [timeline](https://github.com/Ircam-RnD/timeLine) instance.

### Status

This library is under heavy development and subject to change.  
Evert new API breaking change we will be adding snapshots to the repository so you can always fetch a working copy.

For an in depth  explanation on the philosophy and usage of this library please refer to [this blog post](http://wave.ircam.fr/publications/visual-tools/).

###Demo

A working demo for this module can be found [here](https://ircam-rnd.github.io/breakpoint-vis)

### Public API

##### `params(paramters)`

> @param `parameters` {object}  
> inherited from LayerVis, allow to customize the breakpoint-vis from a layer perspective.  

_example:_

```javascript
var breakpoints = breakpointVis()
  .params({
    // the data domain in the y axis
    // inherits yDomain of the timeline if not defined
    yDomain: [0, 1]
    // opacity of the line and fallback opacity of the dots
    // defaults to 1
    opacity: 1, 
    // fallback color of the dots
    // defaults to '#000000'
    color: 'red',
    // color of the line 
    // defaults to '#000000'
    lineColor: '#242424',
    // display the line between the dots
    // defaults to true
    displayLine: true,
    // type of interpolation between dots
    // cf. https://github.com/mbostock/d3/wiki/SVG-Shapes#line_interpolate
    interpolate: 'monotone'
  });
```

##### `data(data)`

> @param `data` {ArrayBuffer|Array}  
> pass a reference of the data to visualize to the layer

##### `cx(func)`
##### `cy(func)`
##### `r(func)`
##### `opacity(func)`
##### `color(func)`

> @param `func` {function}  
> accessors: function defining how to map your data with the breakpoint representation,   
> the default accessors match the method name.

_example:_ 

```javascript
var data = [
  {
    timecode: 1.2,
    pitch: 64
  },
  // ...
];

var breakpoints = breakpointVis()
  .cx(function(d) { return d.timecode; })
  .cy(function(d) { return d.pitch; });
```

### Example use

```javascript
var d3 = require('d3');
var timeline = require('timeline');
var breakpointVis = require('breakpoint-vis');

// some data to visualize
// as the data match the structure required by the breakpointVis layer
// there is no need to define accessors during the breakpointVis creation
var data = [
  {
    cx: 20,
    cy: 0.5,
    color: 'green',
    opacity: 0.3
  }, {
    cx: 40,
    cy: 0.3,
    color: 'green',
    opacity: 0.5
  }, {
    cx: 60,
    cy: 0.7,
    color: 'green',
    opacity: 0.7
  }, {
    cx: 80,
    cy: 0.5,
    color: 'green',
    opacity: 0.9
  }
];

// create the timeline
var graph = timeline()
  .width(width)
  .height(height)
  .xDomain([0, 100])
  .yDomain([0, 1]);

// create the layer and pass it a reference to the graph
var breakpoints = breakpointVis()
  .params({
    opacity: 1,
    color: 'red',
    lineColor: '#242424',
    displayLine: true,
    interpolate: 'monotone'
  })
  .data(data);

graph.add(breakpoints);
d3.select('#timeline').call(graph.draw);

// add entries in the array
data.splice(2, 0, { cx: 1, cy: 0.9 });
data.splice(4, 0, { cx: 99, cy: 0.1 });
// update the layer
graph.update();
```

## License
This module is released under the [BSD-3-Clause license](http://opensource.org/licenses/BSD-3-Clause).
## Acknowledgments
This code is part of the [WAVE project](http://wave.ircam.fr),  
funded by ANR (The French National Research Agency),  
_ContInt_ program,  
2012-2015.