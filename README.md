# WAVES - UI

_visualisation part of the `wavesjs` library._

wavesUI is a set of low level audio visualisation components build on top of [d3](http://d3js.org/) 

## Documentation

[https://wavesjs.github.io/ui/](https://wavesjs.github.io/ui/)

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
