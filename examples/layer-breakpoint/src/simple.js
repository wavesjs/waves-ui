import * as ui from 'waves-ui';

const $track = document.querySelector('#track-1');
const width = $track.getBoundingClientRect().width;
const height = 200;
const duration = 4;

// some data to visualize
const data = [
  { cx: 0, cy: 0.2 },
  { cx: 1, cy: 0.4 },
  { cx: 2, cy: 0.8 },
  { cx: 3, cy: 0.4 },
  { cx: 4, cy: 0.6 },
];

// define the numbr of pixels per seconds the timeline should display
const pixelsPerSecond = width / duration;
// create a timeline
const timeline = new ui.core.Timeline(pixelsPerSecond, width);
// create a new track into the `track-1` element and give it a id ('main')
timeline.createTrack($track, height, 'main');

// create the layer
const breakpointLayer = new ui.helpers.BreakpointLayer(data, {
  height: height,
  color: 'steelblue'
});

// uncomment the following to make it editable
// timeline.state = new ui.states.SimpleEditionState(timeline);
// insert the layer inside the 'main' track
timeline.addLayer(breakpointLayer, 'main');
