## Usage

### Data
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

## DataView
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

### Creating the Editor layer
```js
var bkp = breakpointEdit()
  .data(collection.models) // the data array
  .dataView(bkpView) // the corresponding dataView
  .name('breakpoints')
  .lineColor(color) // Color for the line (defaults to black)
  .color('red') // Color for the dot (defaults to black)
  .opacity(1); // global opacity
```

### Creating the timeLine layout
```js
var graph = timeLine()
  .width(750)
  .height(150)
  .xDomain([0, 350])
  .yDomain([0, 350]);
```

### Adding the layer and drawing the graph
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

<h3 id="adding">Adding items</h3>

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