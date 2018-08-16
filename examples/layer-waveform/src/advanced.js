import * as ui from 'waves-ui';
import * as loaders from 'waves-loaders';

const loader = new loaders.AudioBufferLoader();

loader
  .load('./assets/drum-loop.wav')
  .then(buffer => {
    const $track = document.querySelector('#track-2');
    const width = $track.getBoundingClientRect().width;
    const height = 200;
    const duration = buffer.duration * 2;

    const pixelsPerSecond = width / duration;

    const timeline = new ui.core.Timeline(pixelsPerSecond, width);
    const track = new ui.core.Track($track, height);

    const waveformLayer = new ui.core.Layer('entity', buffer.getChannelData(0), {
      height: height,
      yDomain: [-1, 1]
    });

    const timeContext = new ui.core.LayerTimeContext(timeline.timeContext);
    timeContext.duration = buffer.duration;
    timeContext.start = 1;

    waveformLayer.setTimeContext(timeContext);
    waveformLayer.configureShape(ui.shapes.Waveform, {
      y: function(d) { return d; },
    }, {
      color: 'steelblue'
    });
    // as the waveform is an `entity` layer, we have to edit the context directly
    waveformLayer.setContextEditable(true);

    timeline.state = new ui.states.ContextEditionState(timeline);

    track.add(waveformLayer);
    timeline.add(track);

    timeline.tracks.render();
    timeline.tracks.update();
  })
  .catch(err => console.error(err.stack));
