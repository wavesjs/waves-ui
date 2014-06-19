# TimeLine

This module is a layer/layout manager for time based visualisations written on top of [d3.js](http://d3js.org/).  
The module by itself doesn't accomplish much as long as you don't pass it in some visualisation layer or component so for this example we used a [segment visualiser](https://github.com/ircam-rnd/segment-vis).

<div class="only-readme">
# Demo

You can find a demo [here](https://ircam-rnd.github.io/timeLine/)
</div>

<div class="timeline"></div>

## Data
Will be passed to a timeLine.
```js
var data = 
  [{
      "start": 37,
      "duration": 4,
      "color": "#414FBA" },
    { "start": …},
    { "start": …}
  ];
```

## Creating the timeLine layout
```js
var graph = timeLine()
  .width(800)
  .height(150)
  .xDomain([0, 100]);

```


## Creating the Visualiser layer
```js
var seg = segmentVis()
  .data(data)
  .name('segments')
  .opacity(0.5);
```

## Adding the Visualiser layer and drawing everything
```js
// we add layers like this
graph.layer(seg);
// we pass in the drawing method from our timeline object
d3.select('.timeline').call(graph.draw);

```

## Status

This library is under heavy development and subject to change.  
Evert new API breaking change we will be adding snapshots to the repository so you can always fetch a working copy.

For an in depth  explanation on the philosophy and usage of this library please refer to [this blog post](http://wave.ircam.fr/publications/visual-tools/).

<div class="only-readme">
## License

This module is released under the [BSD-3-Clause license](http://opensource.org/licenses/BSD-3-Clause).

## Acknowledgments

This code is part of the [WAVE project](http://wave.ircam.fr), funded by ANR (The French National Research Agency), *ContInt* program, 2012-2015.
</div>

<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script src="https://rawgit.com/ircam-rnd/segment-vis/master/segment-vis.min.js"></script>
<script src="https://rawgit.com/ircam-rnd/timeLine/master/timeLine.min.js"></script>
<script>

    var data = [{
                    "start": 0,
                    "duration": 4,
                    "color": "#414FBA"
                  }, {
                    "start": 5,
                    "duration": 7,
                    "color": "#2A2E68"
                  }, {
                    "start": 18,
                    "duration": 9,
                    "color": "#5A281E"
                  }, {
                    "start": 30,
                    "duration": 7,
                    "color": "#BE7C7A"
                  }, {
                    "start": 16,
                    "duration": 6,
                    "color": "#BE7C7A"
                  }, {
                    "start": 8,
                    "duration": 3,
                    "color": "#2A2E68"
                  }, {
                    "start": 1,
                    "duration": 4,
                    "color": "#C52599"
                  }, {
                    "start": 63,
                    "duration": 9,
                    "color": "#CA56F4"
                  }, {
                    "start": 90,
                    "duration": 9,
                    "color": "#5A281E"
                  }, {
                    "start": 20,
                    "duration": 6,
                    "color": "#CA56F4"
                  }];

    document.addEventListener('DOMContentLoaded', function() {
      
      document.querySelector('.timeline').innerHTML = '';
      
      // Timeline
      // --------
      var graph = timeLine()
        .width(750)
        .height(150)
        .xDomain([0, 100]);

      // segments layer
      // --------------
      graph.layer(
        segmentVis()
        .data(data)
        .name('segments')
        .opacity(0.5));

      d3.select('.timeline').call(graph.draw);

    });
  </script>