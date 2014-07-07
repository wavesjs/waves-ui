## Breakpoint function editor

> Breakpoint editor component

Use this module to edit breakpoints over a shared timeline.  
The module relies on a [timeline](https://github.com/Ircam-RnD/timeLine) instance.
###Demo

A woring demo for this module can be found [here](https://ircam-rnd.github.io/breakpoint-edit)
### Usage

#### Data
Will be passed to a timeLine later. In this case a Backbone collection.

```js
var collection = new Backbone.Collection([{
    cx: 43,
    cy: 67,
    r: 5,
    color: 'green' // optional
  }, { "cx": "23" …},
  }, { "cx": "64" …},
]);
```

### DataView
If your data doesn't match the expected structure you can pass in a dataView that lets the visualizer how to access and manipulate the data.

```js
// Sample dataView tells us how to access the data
var view = {
  cx: function(d, v) {
    if(!v) return +d.get('cx');
    d.set('cx', (+v));
  },
  cy: function(d, v) {
    if(!v) return +d.get('cy');
    d.set('cy', (+v));
  },
  r: function(d, v) {
    if(!v) return +d.get('r');
    d.set('r', (+v));
  }
};
```

#### Creating the Editor layer
```js
var bkp = breakpointEdit()
  .data(collection.models) // the data array
  .dataView(bkpView) // the corresponding dataView
  .name('breakpoints')
  .lineColor(color) // Color for the line (defaults to black)
  .color('red') // Color for the dot (defaults to black)
  .opacity(1); // global opacity
```

#### Creating the timeLine layout
```js
var graph = timeLine()
  .width(750)
  .height(150)
  .xDomain([0, 350])
  .yDomain([0, 350]);
```

#### Adding the layer and drawing the graph
```js
// add the layer
graph.layer(bkp);
// Draw the layer
d3.select('.timeline').call(graph.draw);
```

<h3 id="deleting">Deleting items</h3>
```js
// find selected items and delete each of them from the collection
var selected = d3.selectAll('.layout .selected');
selected.each(function(item){
  collection.remove(item);
});
// pass again the modified data and call update
seg.data(collection.models);
graph.update();
```

#### Adding items

```js
// add one item to the collection
collection.add({
  cx: 250,
  cy: 100,
  r: radius
});
// pass again the modified data and call update
seg.data(collection.models);
graph.update();
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