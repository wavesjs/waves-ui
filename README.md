# Segment editor

Use this module to visualise data segments over a shared timeline.  
The module relies on a [timeline](https://github.com/Ircam-RnD/timeLine) instance.

<div class="only-demo" style="visibillity:hidden">
  <link rel="stylesheet" href="//rawgit.com/ircam-rnd/segment-edit/master/segment-edit.css">
  <h2>Demo</h2>
  <p>In this demo you can select one ( or multiple segments by holding shift) and move/resize them.</p>
  <p>You can also <span class="keep-selection" name="delete">delete selected items</span>.</p>
</div>

<div class="only-readme">
<h2>Demo</h2>
<p>A woring demo for this module can be found here <a href="https://ircam-rnd.github.io/segment-edit/">here</a></p>
</div>

<div class="timeline"></div>

## Status

This library is under heavy development and subject to change.  
Evert new API breaking change we will be adding snapshots to the repository so you can always fetch a working copy.

For an in depth  explanation on the philosophy and usage of this library please refer to [this blog post](http://wave.ircam.fr/publications/visual-tools/).

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
If your data doesn't match the spected structure you can pass in a dataView that lets the visualizer how to access and manipulate the data.

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

<div class="only-readme">
<h2>License</h2>
<p>This module is released under the <a href="http://opensource.org/licenses/BSD-3-Clause">BSD-3-Clause license</a>.</p>

<h2>Acknowledgments</h2>
<p>This code is part of the <a href="http://wave.ircam.fr">WAVE project</a>, funded by ANR (The French National Research Agency), <em>ContInt</em> program, 2012-2015.</p>
</div>

<script src="//cdnjs.cloudflare.com/ajax/libs/d3/3.4.8/d3.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js"></script>
<script src="//rawgit.com/ircam-rnd/segment-edit/master/segment-edit.min.js"></script>
<script src="//rawgit.com/ircam-rnd/timeLine/master/timeLine.min.js"></script>
<script>
  var data = [{
                  "start": 0,
                  "id": 'segment-' + 0,
                  "duration": 4,
                  "color": "#414FBA"
                }, {
                  "start": 5,
                  "id": 'segment-' + 5,
                  "duration": 7,
                  "color": "#2A2E68"
                }, {
                  "start": 18,
                  "id": 'segment-' + 18,
                  "duration": 9,
                  "color": "#5A281E"
                }, {
                  "start": 30,
                  "id": 'segment-' + 30,
                  "duration": 7,
                  "color": "#BE7C7A"
                }, {
                  "start": 16,
                  "id": 'segment-' + 16,
                  "duration": 6,
                  "color": "#BE7C7A"
                }, {
                  "start": 8,
                  "id": 'segment-' + 8,
                  "duration": 3,
                  "color": "#2A2E68"
                }, {
                  "start": 1,
                  "id": 'segment-' + 1,
                  "duration": 4,
                  "color": "#C52599"
                }, {
                  "start": 63,
                  "id": 'segment-' + 63,
                  "duration": 9,
                  "color": "#CA56F4"
                }, {
                  "start": 90,
                  "id": 'segment-' + 90,
                  "duration": 9,
                  "color": "#5A281E"
                }, {
                  "start": 20,
                  "id": 'segment-' + 20,
                  "duration": 6,
                  "color": "#CA56F4"
                }];

  document.addEventListener('DOMContentLoaded', function() {
    
    document.querySelector('.only-demo').style.visibility = 'inherit';
    
    // Timeline
    // --------
    var graph = timeLine()
      .width(750)
      .height(150)
      .xDomain([0, 100]);

    // segments layer
    // --------------
    var seg = segmentEdit()
      .data(data)
      .name('segments')
      .opacity(0.5);

    graph.layer(seg);
    d3.select('.timeline').call(graph.draw);

    document.querySelector('.keep-selection').addEventListener('click', function(){
        var selected = d3.selectAll('.layout .selected');
        var ids = _.pluck(selected.data(), 'id');
        data = _.reject(data, function(d){ return ids.indexOf(d.id) != -1; });
        
        seg.data(data);
        seg.update();
      });


    });
</script>