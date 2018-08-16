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
      hopSize: 512,
      sampleRate: 44100,
    };
  }

  render(renderingContext) {
    this.$el = document.createElementNS(this.ns, 'g');
    this.$foreignObject = document.createElementNS(this.ns, 'foreignObject');
    this.$foreignObject.setAttributeNS(this.ns, 'requiredExtensions', 'http://www.w3.org/1999/xhtml');
    this.$canvas = document.createElement('canvas');
    this.$canvas.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
    this.$canvas.style.position = 'absolute';

    this.$el.appendChild(this.$foreignObject);
    this.$foreignObject.appendChild(this.$canvas);

    this.ctx = this.$canvas.getContext('2d');

    return this.$el;
  }

  update(renderingContext, stft) {
    const ctx = this.ctx;
    const { width, height } = renderingContext;

    this.$foreignObject.setAttribute('width', width);
    this.$foreignObject.setAttribute('height', height);
    this.$canvas.width = width;
    this.$canvas.height = height;
    // fix translate bug in chrome and safari
    if (!isFirefox)
      this.$canvas.style.left = `${renderingContext.trackOffsetX}px`;

    const binDuration = this.params.frameSize / this.params.sampleRate;
    const binWidth = renderingContext.timeToPixel(binDuration);
    const interBinDuration = this.params.hopSize / this.params.sampleRate;
    const interBinWidth = Math.max(1, Math.floor(renderingContext.timeToPixel(interBinDuration)));
    console.log(interBinWidth, binWidth);

    // loop over pixels for (or at least consistant) better performance
    for (let i = renderingContext.minX; i < renderingContext.maxX; i += interBinWidth) {
      // console.log('what the fuck');
      // get closest stft for each pixel
      const time = renderingContext.timeToPixel.invert(i);
      const binIndex = Math.floor(time / interBinDuration);

      const dft = stft[binIndex];
      const bins = dft.data;

      const x = i;
      const binHeight = height / bins.length;

      // firefox does flip the canvas context as it should
      if (isFirefox) {
        let y = 0;

        for (let j = 0; j < bins.length; j++) {
          const bin = bins[j]; //  * 1e4;
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

          // if (j === Math.floor(bins.length / 2))
          //   console.log(grey);

          ctx.globalAlpha = Math.min(bin, 1);
          ctx.fillRect(x, y, binWidth, binHeight);

          y -= binHeight;
        }
      }
    }
  }
}

const loader = new loaders.AudioBufferLoader();

const frameSize = 1024;
const hopSize = 256;
const fftSize = 2048;

function computeFft(buffer) {
  return new Promise((resolve, reject) => {
    console.log(buffer.duration * 44100);
    // extract fft bins
    const source = new lfo.source.AudioInBuffer({
      audioBuffer: buffer,
      // async: true,
      frameSize: 2048 * 16,
    });

    const slicer = new lfo.operator.Slicer({
      frameSize: frameSize,
      hopSize: hopSize,
    });

    const fft = new lfo.operator.Fft({
      mode: 'power',
      window: 'hann',
      norm: 'power',
      size: fftSize,
    });

    const recorder = new lfo.sink.DataRecorder({
      callback: bins => resolve(bins),
    });

    // const logger = new lfo.sink.Logger({ data: true });

    source.connect(slicer);
    slicer.connect(fft);
    fft.connect(recorder);

    recorder.start();
    source.start();
  });
}

async function init() {
  // const buffer = await loader.load('./assets/bach.mp3');
  const buffer = await loader.load('./assets/drum-loop.wav');
  const bins = await computeFft(buffer);

  const $trackCanvas = document.querySelector('#track-canvas');
  const width = $trackCanvas.getBoundingClientRect().width;
  const height = 400;
  const duration = buffer.duration;

  const pixelsPerSecond = width / duration;
  const timeline = new ui.core.Timeline(pixelsPerSecond, width);
  const track = new ui.core.Track($trackCanvas, height);

  const sonogramLayer = new ui.core.Layer('entity', bins, {
    height: height / 2,
    yDomain: [0, 1],
  });

  const timeContext = new ui.core.LayerTimeContext(timeline.timeContext);

  sonogramLayer.setTimeContext(timeContext);
  sonogramLayer.configureShape(CanvasShape, {
    x: d => d.time,
  }, {
    hopSize: hopSize,
    sampleRate: buffer.sampleRate,
    frameSize: frameSize,
    // fftSize: fftSize,
  });

  const waveformLayer = new ui.helpers.WaveformLayer(buffer, {
    height: height / 2,
    top: height / 2,
  });
  waveformLayer.setTimeContext(timeContext);

  track.add(sonogramLayer);
  track.add(waveformLayer);
  timeline.add(track);

  timeline.tracks.render();
  timeline.tracks.update();

  timeline.state = new ui.states.BrushZoomState(timeline);
  // timeline.state = new ui.states.CenteredZoomState(timeline);
}

window.addEventListener('load', init);


