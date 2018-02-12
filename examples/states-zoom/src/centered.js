import * as ui from 'waves-ui';
import * as loaders from 'waves-loaders';

const loader = new loaders.AudioBufferLoader();

loader
  .load('./assets/drum-loop.wav')
  .then(buffer => {
    const $track = document.querySelector('#track-1');
    const width = $track.getBoundingClientRect().width;
    const height = 200;
    const duration = buffer.duration;
    // define the numbr of pixels per seconds the timeline should display
    const pixelsPerSecond = width / duration;
    // create a timeline
    const timeline = new ui.core.Timeline(pixelsPerSecond, width);
    // create a new track into the `track-1` element and give it a id ('main')
    timeline.createTrack($track, height, 'main');

    // create the layer
    const waveformLayer = new ui.helpers.WaveformLayer(buffer, {
      height: height
    });

    // insert the layer inside the 'main' track
    timeline.addLayer(waveformLayer, 'main');
    // set the timeline's state to `CenteredZoomState`
    timeline.state = new ui.states.CenteredZoomState(timeline);
  })
  .catch(err => console.error(err.stack));
