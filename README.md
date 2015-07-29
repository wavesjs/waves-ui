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

`Timeline` 1..n `Track` 1..n `Layer` and its associated `Shape`: `Waveform`, `Marker`, `Segment` ...

### Timeline

The `timeline` is the main entry point of a temporal visualization, it:
- contains factories to manage its `tracks` and `layers`,
- get or set the view window overs its `tracks` through `offset`, `zoom`, `pixelsPerSecond`, `visibleWidth`,
- is the central hub for all user interaction events (keyboard, mouse),
- holds the current interaction `state` which defines how the different timeline elements (tracks, layers, shapes) respond to those events.

### Track

The `tracks` simply organize the vertical arrangement of the `layers`. They are similar to the tracks of a common Digital Audio Workstation. 

Each `track` is associated to a DOM element.

### Layer

The `layers`: 
- contain a reference to the audio data or timeserie, 
- have `start`, `offset`, `duration`, `stretchRatio` getters/setters to position it on the overall timeline,
- configure a `Shape` to display the data, 
- set a `Behavior` to modify the data (both programmatically or based on user interaction dispatched from the `timeline` and its current `state`). 

Each `layer` is associated to a DOM element.

### Shape

The library comes with usual shapes to display audio data and timeseries: 

- `waveform`
- `segment` and `annotated-segment`
- `marker` and `annotated-marker` 
- `dot` and `line`, for break point functions (aka automation curves)
- `trace`
- `cursor` 

The library also provides a template (`BaseShape`) to create new kind of shapes.

### Interactions - Timeline-states

The `timeline` registers events to listen to from: 
- the keyboard,
- the mouse upon each of its tracks. 

A `timeline-state` sorts these events and call the appropriate methods to:
- browse and zoom into the tracks (`BrushZoomState`, `CenteredZoomState`)
- modify layers time characteristics (`ContextEditionState`)
- modify layers data (`EditionState`)

### Behavior

The `behaviors` give an entry point to modify a shape or a layer directly from its rendering. It allows you to programmatically move DOM elements associated to a shape or a layer and modify accordingly the data associated to it. 

### Utils

Traditionally, timeseries data can be formated like an array of object or multiple arrays. An `OrthogonalData` instance can format the datas in one or another formats.

## Examples

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

## Pull-Request, Tests and Coverage

To work with us (!), you need to install the following dependencies

- "babel": "^4.5.0"
- "babelify": "^6.1.3"
- "browserify": "^9.0.3"
- "testling": "^1.7.1"
- "coverify": "^1.4.0"

so that `npm run test`, `npm run coverage` will correctly run.
We didn't put this dependencies in the package.json because you have probably already installed this one globally, and because they are huge.

PR are reviewed as long as they provide test and a good code coverage.

## License

This module is released under the BSD-3-Clause license.

Acknowledgments

This code is part of the WAVE project, funded by ANR (The French National Research Agency).
