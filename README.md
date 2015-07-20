# waves.js - ui


## Basic Example

A timeline that displays a waveform and a segmentation over it.

```
// Create a timeline
const data = [{ width: 3, x: 0 }, { width: 6, x: 6}];
const timeline = new Timeline();
const track = new Track(trackDiv);
const layer = new SegmentLayer(data);

timeline.add(track);
track.add(layer);

timeline.tracks.render();
```


## Goals and Features

*waves.js - ui* is a library that proposes primitives to build interactive temporal visualizations of audio and timeseries data for in-browser rendering. It has been designed by abstracting common features required in both music production environments and analysis authoring tools. 
Its main goal is to ease the development of audio-based web applications requiring interactive temporal visualizations.

*ui* is part of the [waves.js](https://github.com/wavesjs/waves) library.


## Library Overview

Here is a synthetic view of objects that compose the library, and their interconnections:

`Timeline` 1..n `Track` 1..n `Layer` and its associated `Shape`: `Waveform`, `Marker`, `Segment` ...)

### Timeline

The `timeline` is the main entry point of a temporal visualization, it:
- contains factories to manage its `tracks` and `layers`,
- get or set the view window overs its `tracks` through `offset`, `zoom`, `pixelsPerSecond`, `visibleWidth`,
- is the central hub for all user interaction events (keyboard, mouse),
- holds the current interaction `state` which defines how the different timeline elements (tracks, layers, shapes) respond to those events.

### Track

The `tracks` organize the vertical arrangement of the `layers`.  

### Layer

The `layers`: 
- keep a reference to the audio data or timeserie, 
- get or set `start`, `offset`, `duration`, `stretchRatio`,
- configure a `Shape` to display the data, 
- set a `Behavior` to modify the data (both programmatically or based on user interaction dispatched from the `timeline` and its current `state`). 

### Shape

The library comes with usual shapes to display audio data and timeseries: 

- `waveform`
- `segment` and `annotated-segment`
- `marker` and `annotated-marker` 
- `dot` and `line`, for break point functions (aka automation curves)
- `trace`
- `cursor` 

The library also provides a template (`BaseShape`) to create new shapes.

### Interactions - Timeline-states

Specific interaction state upon the timeline allow you to:
- browse and zoom into the tracks
- modify layers time characteristics through it timeContext or data through shape edition

Internally the current interaction state call the relevant `behavior` associated to the view, the layer or the shape.

### Behavior

The behaviors give an entry point to modify a shape, a layer or a view. It allows you to programmatically move DOM elements associated to a shape, a layer or a view via a target element and a move, and modify accordingly the data associated to it. 

### Utils

Traditionally, timeseries data can be formated like an array of object or multiple arrays. An `OrthogonalData` instance can format the datas in one or another formats.

### Naming Conventions

- `constructor()`: create the DOM SVG container element for tracks and layers
- `add()`: add a view to a timeline or a layer to a view, so that a timeline keeps track of its tracks and a view keep track of its layers.
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
