# Segment editor

Component built on top of the [segment visualiser](https://github.com/Ircam-RnD/seg-vis).
Turns your simple visualizer into a segment editor!

```js
var seg = createSegEdit({name: 'segedit', data: collection.models});
var myGraph2 = createBaseTimeline();
  myGraph2.xDomain([0, max])
  .width(500)
  .height(80)
  .model(collection.models)
  .margin({top: 60, right: 60, bottom: 20, left: 0})
  .layer(seg) // segment editor layer
  .draw(d3.select('.edit'));
```

## Status

You can [find a demo blog post over here](http://wave.ircam.fr/publications/segment-components/).
More docs and tests to come!