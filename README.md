# WAVES - UI

## Develop branch - this code introduce many breaking changes
## DO NOT USE

_parts of d3 in use: selections, scales_  
(could be replaced, the most tricky part would be the element <=> datum binding)

_visualisation part of the `wavesjs` library._

wavesUI is a set of low level audio visualisation components build on top of [d3](http://d3js.org/) 


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

to create your own custom build, you need to
remove/comment all the component you don't need in `waves-ui.js`, then run

```bash
npm run bundle
```

_`core/timeline`, `core/layer`, and `helpers/utils` are mandatory_

## List of components

- `timeline`
- `layer`
- `waveform`
- `segment`
- `marker`
- `breakpoint`
- `label`
- `zoomer`
- `utils`

## License

This module is released under the BSD-3-Clause license.

Acknowledgments

This code is part of the WAVE project, funded by ANR (The French National Research Agency).
