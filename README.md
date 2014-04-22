#Segment visualizer

Visualization module to be used with [baseTimeline](https://github.com/Ircam-RnD/baseTimeline).  
Visualizes segmented data over a timeline.

For a detailed explanation on the philosophy and usage of this library please refer to [this blog post](http://wave.ircam.fr/publications/visual-tools/).

```js
// example use with backbone models

var collection = new Backbone.Collection(data);
var seg = createSegVis({name: 'segments', data: collection.models});
var myGraph = createBaseTimeline()
  .xDomain([0, max])
  .width(500)
  .height(80)
  .model(collection.models)
  .margin({top: 60, right: 60, bottom: 20, left: 0})
  .layer(seg) // segment viewer layer
  .draw(d3.select('.timeline'));
```

## Status

work in progress, docs and tests to come.