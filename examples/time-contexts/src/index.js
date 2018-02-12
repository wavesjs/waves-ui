import * as ui from 'waves-ui';
import * as controllers from '@ircam/basic-controllers';

const layerHeight = 120;
const colors = ['red', 'blue', 'green', 'yellow'];

const $timeline = document.querySelector('#track-1');
const $controls = document.querySelector('#controls');
const $top = $timeline.querySelector('.top');
const $bottom = $timeline.querySelector('.bottom');

const screenWidth = $timeline.getBoundingClientRect().width;
const pixelsPerSecond = screenWidth / 20;

const timeline = new ui.core.Timeline(pixelsPerSecond, screenWidth);

// create and register tracks
const viewTop = timeline.createTrack($top, layerHeight);
const viewBottom = timeline.createTrack($bottom, layerHeight);

const dataTop = [
  { start: 0, duration: 5, color: 'red' },
  { start: 10, duration: 5, color: 'blue' }
];

const dataBottom = [
  { start: 5, duration: 5, color: 'green' },
  { start: 15, duration: 5, color: 'yellow' }
];

// create and register layers
const layers = [];

[dataTop, dataBottom].forEach(function(data, index) {
  const view = index % 2 === 0 ? viewTop : viewBottom;
  const layer = new ui.core.Layer('collection', data, { height: layerHeight });

  layer.configureShape(ui.shapes.Segment, {
    x: function(d) { return d.start; },
    width: function(d) { return d.duration; },
  }, {
    displayHandlers: false
  });

  timeline.addLayer(layer, view);
  layers.push(layer);
});

// control layer 0
new controllers.Title({
  label: 'Layers[0] TimeContext',
  container: $controls
});

new controllers.Slider({
  label: 'start',
  min: 0,
  max: 15,
  step: 0.1,
  default: 0,
  unit: 's',
  container: $controls,
  callback: (value) => {
    layers[0].timeContext.start = value;
    layers[0].updateContainer();
  }
});

new controllers.Slider({
  label: 'duration',
  min: 0,
  max: 20,
  step: 0.1,
  default: 20,
  label: 's',
  container: $controls,
  callback: (value) => {
    layers[0].timeContext.duration = value;
    layers[0].updateContainer();
  }
});

new controllers.Slider({
  label: 'offset',
  min: -15,
  max: 0,
  step: 0.1,
  default: 0,
  unit: 's',
  container: $controls,
  callback: (value) => {
    layers[0].timeContext.offset = value;
    layers[0].updateContainer();
  }
});

new controllers.Slider({
  label: 'stretchRatio',
  min: 1,
  max: 2,
  step: 0.01,
  default: 1,
  container: $controls,
  callback: (value) => {
    layers[0].timeContext.stretchRatio = value;
    layers[0].update();
  }
});

// control layer 1
new controllers.Title({
  label: 'Layers[1] TimeContext',
  container: $controls,
});

new controllers.Slider({
  label: 'start',
  min: 0,
  max: 15,
  step: 0.1,
  default: 0,
  unit: 's',
  container: $controls,
  callback: (value) => {
    layers[1].timeContext.start = value;
    layers[1].updateContainer();
  }
});

new controllers.Slider({
  label: 'duration',
  min: 0,
  max: 20,
  step: 0.1,
  default: 20,
  unit: 's',
  container: $controls,
  callback: (value) => {
    layers[1].timeContext.duration = value;
    layers[1].updateContainer();
  }
});

new controllers.Slider({
  label: 'offset',
  min: 0,
  max: 15,
  step: 0.1,
  default: 0,
  unit: 's',
  container: $controls,
  callback: (value) => {
    layers[1].timeContext.offset = -value;
    layers[1].updateContainer();
  }
});

new controllers.Slider({
  label: 'stretchRatio',
  min: 1,
  max: 2,
  step: 0.01,
  default: 1,
  container: $controls,
  callback: (value) => {
    layers[1].timeContext.stretchRatio = value;
    layers[1].update();
  }
});

// timeline
new controllers.Title({
  label: 'Timeline TimeContext',
  container: $controls,
});

new controllers.Slider({
  label: 'offset',
  min: 0,
  max: 10,
  step: 0.1,
  default: 0,
  unit: 's',
  container: $controls,
  callback: (value) => {
    timeline.offset = -value;
    timeline.tracks.updateContainer();
  }
});

new controllers.Slider({
  label: 'zoom',
  min: 1,
  max: 2,
  step: 0.01,
  default: 1,
  container: $controls,
  callback: (value) => {
    timeline.zoom = value;
    timeline.tracks.update();
  }
});

const pixelsPerSecondController = new controllers.Slider({
  label: 'pixelsPerSecond',
  min: pixelsPerSecond / 2,
  max: pixelsPerSecond * 2,
  default: 1, pixelsPerSecond,
  container: $controls,
  callback: (value) => {
    timeline.pixelsPerSecond = value;
    timeline.tracks.update();
  }
});

new controllers.Slider({
  label: 'visibleWidth',
  min: 1,
  max: screenWidth,
  step: 1,
  default: screenWidth,
  unit: 'px',
  contaienr: $controls,
  callback: (value) => {
    timeline.maintainVisibleDuration = false;
    timeline.visibleWidth = value;
    timeline.tracks.update();
  }
});

new controllers.Slider({
  label: 'visibleWidth - maintainVisibleDuration',
  min: 1,
  max: screenWidth,
  step: 1,
  default: screenWidth,
  unit: 'px',
  container: $controls,
  callback: (value) => {
    timeline.maintainVisibleDuration = true;
    timeline.visibleWidth = value;
    timeline.tracks.update();

    pixelsPerSecondController.value = timeline.pixelsPerSecond;
  }
});
