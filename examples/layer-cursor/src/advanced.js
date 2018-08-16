import * as ui from 'waves-ui';

const $track = document.querySelector('#track-2');
const width = $track.getBoundingClientRect().width;
const height = 200;
const duration = 5;

const pixelsPerSecond = width / duration;

const timeline = new ui.core.Timeline(pixelsPerSecond, width);
const track = new ui.core.Track($track, height);

const data = { currentPosition: 0 };

const cursorLayer = new ui.core.Layer('entity', data, {
  height: height
});

const timeContext = new ui.core.LayerTimeContext(timeline.timeContext);

cursorLayer.setTimeContext(timeContext);
cursorLayer.configureShape(ui.shapes.Cursor, {
  x: function(d) { return d.currentPosition; }
}, {
  color: 'red'
});

track.add(cursorLayer);
timeline.add(track);

timeline.tracks.render();
timeline.tracks.update();

// listen for time passing...
(function loop() {
  const currentTime = new Date().getTime() / 1000;
  data.currentPosition = currentTime % duration;
  timeline.tracks.update(cursorLayer);

  requestAnimationFrame(loop);
}());
