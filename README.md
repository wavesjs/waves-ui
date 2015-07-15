# waves.js - ui

Within the web context, lot of libraries deal with live audio vizualisations, usually on top of Web Audio API AnalyserNode, but outside of time-based representations. Other libraries try to solve specific temporal vizualisation use cases (for instance http://www.wavesurfer.fm/). On the other hand, some web applications reinvent the wheel to propose online collaborative DAW (Digital Audio Workstation) or all-in-one temporal visualization tools.

*waves.js - ui* is a library that proposes primitives to build interactive temporal visualizations of audio and timeseries data for in-browser display. It has been designed by abstracting common features required in both music production environment and analysis authoring tools.

*ui* is part of the [waves.js](https://github.com/wavesjs/waves) library.


Here is a synthetic view of objects that compose the library, and their interconnections:

**`Timeline`** and its current `State`
1..n 
**`View`** and its related `ViewTimeContext` and `Behavior`
1..n 
**`Layer`** and its related `LayerTimeContext`,  `Behavior` and `Shape` - `Marker`, `Segment` ...


The `timeline` is the main entry point of a temporal visualization. It is the central hub for all user interaction events (keyboard, mouse), and it holds the current interaction `state` which defines how the different timeline elements (views, layers, shapes) respond to those events. 
The `timeline` also contains factories to instantiate the `views` and `layers` elements.

The `views` are like windows on the overall `timeline`. The main attributes `width`, `pixelsPerSecond`, `offset` and `zoom` define the characteristics of a view over the `timeline`.

The `layers` (1) keep a reference to the data, (2) configure a `Shape` to display the data, and (3) set a `Behavior` to modify the data (both programmatically or based on user interaction dispatched from the `timeline` and its current `state`). `layer.timeContext` defines the layer time characteristics: `offset`, `stretchRatio`, `duration`, and `start`. These attributes have repercussions on the audio rendering contrary to the views one, which only affect the representation.


Specific interaction state upon the timeline allow you to:
- browse and zoom into the views
- modify layers time characteristics through it timeContext or data through shape edition


## Default example

A timeline that displays a waveform and a segmentation upon the waveform.

```
// Create a timeline
const data = [{ width: 3, x: 0 }, { width: 6, x: 6}];
const timeline = new Timeline();
const view = new View(viewDiv);
const layer = new SegmentLayer(data);
timeline.register(view);
view.register(layer);
timeline.render();
timeline.update();
```

## Conventions
- `constructor()`: create the DOM SVG container element for views and layers
- `register()`: register a view to a timeline or a layer to a view, so that a timeline keeps track of its views and a view keep track of its layers.
- `render()`: method for an object to render its child DOM SVG element
- `update()`: method for an object to update its previously created DOM according to data or time-context


## Examples


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
