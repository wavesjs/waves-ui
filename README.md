# WAVES - UI

*waves.ui* is a library that proposes primitives to build interactive temporal visualisation of audio data and metadata for the browser. It is part of the `wavesjs` library.

## Default example

A timeline that displays a waveform and a segmentation upon the waveform.

```
// Create a timeline
const timeline = new Timeline();
// Add a container, which is a view on the timeline
timeline.registerContainer(timelineDiv, {}, 'foo');
// Create and configure a layer
const timeContext = new LayerTimeContext(timeline.timeContext)
const layer = new Layer('collection', []);
layer.configureShape(Segments);
layer.setTimeContext(timeContext);
layer.timeContext.duration = 12;

// Add the layer
timeline.addLayer(layer, 'foo')

// Render the timeline and its registered layer
timeline.render();
timeline.draw();
timeline.update();
```

## Conventions

- `render()`  
  is the method by which a object renders its own DOM - return a DOM element 
- `draw()`  
  is the method by which a component creates its content by calling `render` on its children and appening the returned DOM to its own DOM element. This method is symetric with `render` from the container point of view
- `update()`  
  is the method by which an object updates its previously created DOM according to data or configuration


## Demonstrators ideas


## Documentation

[http://wavesjs.github.io/ui/](http://wavesjs.github.io/ui/)

## Use

#### CommonJS (browserify)

install with npm

```bash
npm install --save wavesjs/ui
```

consume in your modules

```javascript
var wavesUI = require('waves-ui');
```

#### AMD (requireJS)

add the waves library to your config

```javascript
requirejs.config({
  paths: {
    waves: 'path/to/waves-ui.umd'
  }
});
```

consume in your modules

```javascript
define(['waves-ui'], function(wavesUI) {
  var timeline = wavesUI.timeline();
  // ...
});
```

#### Global

add the script tag in your at the bottom of the `<body>`

```html
<script scr="/path/to/waves-ui.umd.js"></script>
```

the library is exposed in the `window.wavesUI` namespace.


## Custom build

In order to create your own custom build, you need to
remove/comment all the component you don't need from `waves-ui.js`, then run

```bash
npm run bundle
```

_`core/timeline`, `core/layer`, and `helpers/utils` are mandatory_

## List of components

Core components
- `timeline`
- `layer`
- `time-context`

Shapes and behaviors
- `waveform`
- `segment` and `annotated-segment`
- `marker` and `annotated-marker` 
- `cursor` 
- `dot` and `line` 

Timeline-states and interactions
- 
-

Utils
- `orthogonal-data`

## Miscellaneous

_parts of d3 in use: selections, scales_  
(could be replaced, the most tricky part would be the element <=> datum binding)



## License

This module is released under the BSD-3-Clause license.

Acknowledgments

This code is part of the WAVE project, funded by ANR (The French National Research Agency).
