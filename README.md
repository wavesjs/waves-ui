#Segment visualizer

Use this module to visualise data segments over a shared timeline.  
The module relies on a [timeline](https://github.com/Ircam-RnD/timeLine) instance, and requires data to visualise and a `dataView` that describes how to use the data.  

## Data
Will be passed to a timeLine later. In this case a Backbone collection.
```js
var collection = new Backbone.Collection([{
    "begin": "0",
    "duration": "16121",
    "end": "16121",
    "color": "#A9d"
  }, { "begin": "1" …},
  }, { "begin": "3" …},
]);
```

## DataView
```js
// Sample dataView tells us how to access the data
var view = {
  // tell d3 which is our key for sorting
  sortIndex: function(d) {
    return d.get('begin');
  },
   // how to retrieve or set the value used as the start of the segment
  start: function(d, v) {
    // no value, we retrieve
    if(!v) return +d.get('begin');
    // yesvalue we set :)
    d.set('begin', v);
  },
  // how to retrieve or set the value used as the duration of the segment
  duration: function(d, v) {
    if(!v) return +d.get('duration');
    d.set('duration', v);
  },
  // how to retrieve or set the value used for the color of the segment
  color: function(d, v) {
    if(!v) return d.get('color');
    d.set('color', v);
  }
};
```

## The Visualiser layer
```js
var seg = segmentVis()
  .dataView(view) // aforementioned dataView
  .name('segments') // layer name
  .top(0) // optional vertical offset
  .opacity(0.60); // optional opacity
```

## The timeLine layout
In order to do this you need the [timeLine](https://github.com/Ircam-RnD/timeLine) module.
```js
var graph = timeLine()
  .xDomain([0, max]) // computed last segment's end position
  .width(500)
  .height(80)
  .data(collection.models)
  .margin({top: 60, right: 60, bottom: 20, left: 0})
  .layer(seg) // segment visualiser layer
  .draw; // the callable endpoint

d3.select('.timeline').call(graph);
```

## Status

Currently subject to change, for a latest status explanation you can visit [this blogpost](http://wave.ircam.fr/publications/segment-components-updates/)
For an in depth  explanation on the philosophy and usage of this library please refer to [this blog post](http://wave.ircam.fr/publications/visual-tools/).

You can find a **broken demo blog post** [over here](http://wave.ircam.fr/publications/segment-components/).

work in progress, docs and tests to come.