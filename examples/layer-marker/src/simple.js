import * as ui from 'waves-ui';

const $track = document.querySelector('#track-1');
const width = $track.getBoundingClientRect().width;
const height = 200;
const duration = 10;

// some data to visualize
const data = [{ x: 2 }, { x: 4 }, { x: 7 }, { x: 8 }];

// define the numbr of pixels per seconds the timeline should display
const pixelsPerSecond = width / duration;
// create a timeline
const timeline = new ui.core.Timeline(pixelsPerSecond, width);
// create a new track into the `$track` element and give it a id ('main')
timeline.createTrack($track, height, 'main');

// create the layer
const markerLayer = new ui.helpers.MarkerLayer(data, {
  height: height,
  displayHandlers: false,
  color: 'red',
});

// insert the layer inside the 'main' track
timeline.addLayer(markerLayer, 'main');
