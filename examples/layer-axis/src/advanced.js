import * as ui from 'waves-ui';
import * as loaders from 'waves-loaders';

const loader = new loaders.AudioBufferLoader();

loader.load('./assets/drum-loop.wav').then(function(buffer) {
  const $track = document.querySelector('#track-2');
  const width = $track.getBoundingClientRect().width;
  const timeAxisHeight = 18;
  const layerHeight = 200;

  const duration = buffer.duration;
  const pixelsPerSecond = width / duration;

  const timeline = new ui.core.Timeline(pixelsPerSecond, width);
  const track = new ui.core.Track($track, layerHeight + timeAxisHeight);
  timeline.add(track);

  // time axis
  const timeAxis = new ui.axis.AxisLayer(ui.axis.timeAxisGenerator(), {
   height: timeAxisHeight
  });

  // Axis layers use `timeline.TimeContext` directly,
  // they don't have their own timeContext
  timeAxis.setTimeContext(timeline.timeContext);
  timeAxis.configureShape(ui.shapes.Ticks, {}, { color: 'steelblue' });

  // bpm axis
  const grid = new ui.axis.AxisLayer(ui.axis.gridAxisGenerator(138, '4/4'), {
    height: layerHeight,
    top: timeAxisHeight
  });

  grid.setTimeContext(timeline.timeContext);
  grid.configureShape(ui.shapes.Ticks, {}, { color: 'green' });

  // wavesform layer
  const waveformLayer = new ui.helpers.WaveformLayer(buffer, {
    height: layerHeight,
    top: timeAxisHeight
  });

  waveformLayer.setTimeContext(new ui.core.LayerTimeContext(timeline.timeContext));

  track.add(timeAxis);
  track.add(grid);
  track.add(waveformLayer);

  track.render();
  track.update();

  timeline.tracks.render();
  timeline.tracks.update();

  timeline.state = new ui.states.CenteredZoomState(timeline);
});
