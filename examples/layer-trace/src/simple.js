import * as ui from 'waves-ui';

const $track = document.querySelector('#track-1');
const width = $track.getBoundingClientRect().width;
const height = 200;
const duration = 20;

// some data to visualize
const data = [
  { x: 0, mean: 0.5, range: 0.4 },
  { x: 4, mean: 0.3, range: 0.2 },
  { x: 8, mean: 0.7, range: 0.5 },
  { x: 12, mean: 0.6, range: 0.2 },
  { x: 16, mean: 0.4, range: 0.4 },
  { x: 20, mean: 0.5, range: 0.3 },
];

// define the numbr of pixels per seconds the timeline should display
const pixelsPerSecond = width / duration;
// create a timeline
const timeline = new ui.core.Timeline(pixelsPerSecond, width);
// create a new track into the `track-1` element and give it a id ('main')
timeline.createTrack($track, height, 'main');

// create the layer
const traceLayer = new ui.helpers.TraceLayer(data, {
  height: height,
  displayDots: false,
  meanColor: 'steelblue',
  rangeColor: 'steelblue'
});

// insert the layer inside the 'main' track
timeline.addLayer(traceLayer, 'main');
