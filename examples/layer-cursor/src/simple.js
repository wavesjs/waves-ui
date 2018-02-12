import * as ui from 'waves-ui';

const $track = document.querySelector('#track-1');
const width = $track.getBoundingClientRect().width;
const height = 200;
const duration = 10;

// define the numbr of pixels per seconds the timeline should display
const pixelsPerSecond = width / duration;
// create a timeline
const timeline = new ui.core.Timeline(pixelsPerSecond, width);
// create a new track into the `track-1` element and give it a id ('main')
timeline.createTrack($track, height, 'main');

const cursorLayer = new ui.helpers.CursorLayer({
  height: height
});

timeline.addLayer(cursorLayer, 'main');

// listen for time passing...
(function loop() {
  const currentTime = new Date().getTime() / 1000;
  cursorLayer.currentPosition = currentTime % duration;
  cursorLayer.update();

  requestAnimationFrame(loop);
}());
