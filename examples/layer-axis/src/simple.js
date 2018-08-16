import * as ui from 'waves-ui';

const $track = document.querySelector('#track-1');
const width = $track.getBoundingClientRect().width;
const height = 20;
const duration = 40;
// define the numbr of pixels per seconds the timeline should display
const pixelsPerSecond = width / duration;
// create a timeline
const timeline = new ui.core.Timeline(pixelsPerSecond, width);
// create a new track into the `track-1` element and give it a id ('main')
timeline.createTrack($track, height * 2 + 20, 'main');
// time axis
const timeAxis = new ui.helpers.TimeAxisLayer({
  height: height,
  top: 10,
  color: 'steelblue'
});

// bpm axis
const gridAxis = new ui.helpers.GridAxisLayer({
  height: height,
  top: height + 10,
  bpm: 90,
  signature: '3/4',
  color: 'orange'
});

timeline.addLayer(timeAxis, 'main', 'default', true);
timeline.addLayer(gridAxis, 'main', 'default', true);

timeline.state = new ui.states.CenteredZoomState(timeline);
