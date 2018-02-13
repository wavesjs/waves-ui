import * as ui from 'waves-ui';
import * as lfo from 'waves-lfo/client';
import * as loaders from 'waves-loaders';

const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

class CanvasShape extends ui.shapes.BaseShape {
  getClassName() { return 'canvas-shape'; }

  _getAccessorList() {
    return { x: 0, y: 0, width: 1, height: 0.5 };
  }

  _getDefaults() {
    return {
      color: 'steelblue',
    };
  }

  render(renderingContext) {
    this.$el = document.createElementNS(this.ns, 'g');
    this.$foreignObject = document.createElementNS(this.ns, 'foreignObject');
    this.$foreignObject.setAttributeNS(this.ns, 'requiredExtensions', 'http://www.w3.org/1999/xhtml');
    this.$canvas = document.createElement('canvas');
    this.$canvas.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');

    this.$el.appendChild(this.$foreignObject);
    this.$foreignObject.appendChild(this.$canvas);

    this.ctx = this.$canvas.getContext('2d');

    return this.$el;
  }

  update(renderingContext, stft) {
    console.log(renderingContext);

    const ctx = this.ctx;
    const { width, height } = renderingContext;

    this.$foreignObject.setAttribute('width', width);
    this.$foreignObject.setAttribute('height', height);
    this.$canvas.width = width; // `${width}px`;
    this.$canvas.height = height; // `${height}px`;

    const numFFTs = stft.length;
    const binWidth = width / numFFTs;
    console.log('binWidth', binWidth);

    for (let i = 0; i < stft.length; i++) {
      const dft = stft[i];
      const time = dft.time;
      const bins = dft.data;

      const x = renderingContext.timeToPixel(time);
      const binHeight = height / bins.length;

      // firefox does flip the canvas context as it should
      if (isFirefox) {
        let y = 0;

        for (let j = 0; j < bins.length; j++) {
          const bin = bins[j] * 1e4;
          const grey = 255 - (bin * 255);

          ctx.globalAlpha = Math.min(bin, 1);
          ctx.fillRect(x, y, binWidth, binHeight);

          y += binHeight;
        }
        // chrome and safari do not flip the canvas context
      } else {
        let y = height;

        for (let j = 0; j < bins.length; j++) {
          const bin = bins[j] * 1e4;
          const grey = 255 - (bin * 255);

          ctx.globalAlpha = Math.min(bin, 1);
          ctx.fillRect(x, y, binWidth, binHeight);

          y -= binHeight;
        }
      }
    }
  }
}

const loader = new loaders.AudioBufferLoader();

loader
  .load('./assets/drum-loop.wav')
  .then(buffer => {
    return new Promise((resolve, reject) => {
      // extract fft bins
      const source = new lfo.source.AudioInBuffer({ audioBuffer: buffer });

      const slicer = new lfo.operator.Slicer({
        frameSize: 4096,
        hopSize: 64,
      });

      const fft = new lfo.operator.Fft({
        mode: 'power',
        window: 'hann',
        norm: 'power',
        size: 256,
      });

      const recorder = new lfo.sink.DataRecorder({
        callback: bins => resolve([buffer, bins]),
      });

      const logger = new lfo.sink.Logger({ data: true });

      source.connect(slicer);
      slicer.connect(fft);
      fft.connect(recorder);

      recorder.start();
      source.start();
    });
  })
  .then(([buffer, bins]) => {
    const $trackCanvas = document.querySelector('#track-canvas');
    const width = $trackCanvas.getBoundingClientRect().width;
    const height = 400;
    const duration = buffer.duration;

    const pixelsPerSecond = width / duration;
    const timeline = new ui.core.Timeline(pixelsPerSecond, width);
    const track = new ui.core.Track($trackCanvas, height);

    const canvasLayer = new ui.core.Layer('entity', bins, {
      height: height / 2,
      yDomain: [0, 1],
    });

    const timeContext = new ui.core.LayerTimeContext(timeline.timeContext);

    canvasLayer.setTimeContext(timeContext);
    canvasLayer.configureShape(CanvasShape, {
      x: d => d.time,
    }, {});

    const waveformLayer = new ui.helpers.WaveformLayer(buffer, {
      height: height / 2,
      top: height / 2,
    });
    waveformLayer.setTimeContext(timeContext);

    track.add(canvasLayer);
    track.add(waveformLayer);
    timeline.add(track);

    timeline.tracks.render();
    timeline.tracks.update();

    timeline.state = new ui.states.BrushZoomState(timeline);
    // timeline.state = new ui.states.CenteredZoomState(timeline);
  });


