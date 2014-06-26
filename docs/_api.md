## Usage

### Data
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
If your data doesn't match the expected structure you can pass in a dataView that lets the visualizer how to access and manipulate the data.

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

### Creating the Visualiser layer
```js
var seg = segmentVis()
  .data(collection.models)
  .dataView(view)
  .name('segments')  
  .opacity(0.5);
```

### Creating the timeLine layout
```js
var graph = timeLine()
  .width(800)
  .height(150)
  .xDomain([0, 100]);
```

### Adding the Visualiser layer and drawing everything

```js
// we add layers like this
graph.layer(seg);
// we pass in the drawing method from our timeline object
d3.select('.timeline').call(graph.draw);
```


<h2 id="deleting">Deleting segments</h2>
```js
// find selected segments and delete each of them from the collection
var selected = d3.selectAll('.layout .selected');
selected.each(function(segment){
  collection.remove(segment);
});
// pass again the modified data and call update
seg.data(collection.models);
graph.update();
```

## Adding segments

```js
// add one segment to the collection
collection.add({
  "begin": 40,
  "duration": 10,
  "color": "#174345"
});
// pass again the modified data and call update
seg.data(collection.models);
graph.update();
```