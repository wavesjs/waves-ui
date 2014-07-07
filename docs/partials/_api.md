## Usage

### Creating a brush layer
```js
var brush = brushVis().name('bruce');
```

### Handling the brush events
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

### Creating the timeLine layout
```js
var graph = timeLine()
  .width(750)
  .height(150);
```

### Adding the layer and drawing the graph
```js
// add the layer
graph.layer(brush);
// Draw the layer
d3.select('.timeline').call(graph.draw);
```