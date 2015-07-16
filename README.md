# waves.js - ui


## Basic Example

A timeline that displays a waveform and a segmentation over it.

```
// Create a timeline
const data = [{ width: 3, x: 0 }, { width: 6, x: 6}];
const timeline = new Timeline();
const view = new View(viewDiv);
const layer = new SegmentLayer(data);
timeline.add(view);
view.add(layer);
timeline.views.render();
```


## Goals and Features

*waves.js - ui* is a library that proposes primitives to build interactive temporal visualizations of audio and timeseries data for in-browser rendering. It has been designed by abstracting common features required in both music production environments and analysis authoring tools. 
It main goal is to ease the development of audio-based web applications requiring interactive temporal visualizations.

*ui* is part of the [waves.js](https://github.com/wavesjs/waves) library.


## Library Overview

Here is a synthetic view of objects that compose the library, and their interconnections:

**`Timeline`** and its current `State`

1..n 

**`View`** and its related `ViewTimeContext` and `Behavior`

1..n 

**`Layer`** and its related `LayerTimeContext`,  `Behavior` and `Shape` - `Marker`, `Segment` ...

### Timeline

The `timeline` is the main entry point of a temporal visualization. It is the central hub for all user interaction events (keyboard, mouse), and it holds the current interaction `state` which defines how the different timeline elements (views, layers, shapes) respond to those events. 
The `timeline` also contains factories to manage its `views` and `layers`.

### View

The `views` are like windows on the overall `timeline`. The main attributes `width`, `pixelsPerSecond`, `offset` and `zoom` define the characteristics of a view over the `timeline`.

### Layer

The `layers` 1. keep a reference to the data, 2. configure a `Shape` to display the data, and 3. set a `Behavior` to modify the data (both programmatically or based on user interaction dispatched from the `timeline` and its current `state`). 
The layer `timeContext` defines its time characteristics: `offset`, `stretchRatio`, `duration`, and `start`.

### Shape

The library comes with usual shapes to display audio data and timeseries: 
- `waveform`
- `segment` and `annotated-segment`
- `marker` and `annotated-marker` 
- `dot` and `line`, for break point functions (aka automation curves)
- `trace`
- `cursor`  
The library provides a template to create new shapes.

### Interactions - Timeline-states

Specific interaction state upon the timeline allow you to:
- browse and zoom into the views
- modify layers time characteristics through it timeContext or data through shape edition

Internally they call the relevant `behavior` associated to the view, the layer or the shape.

### Behavior

The behaviors give an entry point to modify a shape, a layer or a view. It allows you to programmatically move DOM elements associated to a shape, a layer or a view via a target element and a move, and modify accordingly the data associated to it. 

### Utils

Traditionally, timeseries data can be formated like an array of object or multiple arrays. An `OrthogonalData` instance can format the datas in one or another formats.

### Naming Conventions

- `constructor()`: create the DOM SVG container element for views and layers
- `add()`: add a view to a timeline or a layer to a view, so that a timeline keeps track of its views and a view keep track of its layers.
- `render()`: method for an object to render its child DOM SVG element
- `update()`: method for an object to update its previously created DOM according to data or time-context


## Other Examples

- Waveform
- Segments
- Markers
- Annotated Markers
- BreakPointFunction
- Trace
- Cursor
- Zoom
- Scales
- Edition
- Live input
- With Audio engine
- With Analysis engine (LFO)

## Full Documentation

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


## License

This module is released under the BSD-3-Clause license.

Acknowledgments

This code is part of the WAVE project, funded by ANR (The French National Research Agency).
