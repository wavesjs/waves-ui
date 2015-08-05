import Layer from '../core/layer';
import Waveform from '../shapes/waveform';


const defaults = {
  yDomain: [-1, 1],
  channel: 0,
  color: 'steelblue',
  renderingStrategy: 'svg'
};

export default class WaveformLayer extends Layer {
  constructor(buffer, options) {
    options = Object.assign({}, defaults, options);

    super('entity', buffer.getChannelData(options.channel), options);

    this.configureShape(Waveform, {
      y: function(d, v = null) {
        if (v !== null) { d = v; }
        return d;
      }
    }, {
      sampleRate: buffer.sampleRate,
      color: options.color,
      renderingStrategy: options.renderingStrategy
    });
  }
}
