import Layer from '../core/Layer';
import Waveform from '../shapes/Waveform';


const defaults = {
  yDomain: [-1, 1],
  channel: 0,
  color: 'steelblue',
  renderingStrategy: 'svg'
};

/**
 * Helper to create a waveform layer.
 *
 * [example usage](./examples/layer-waveform.html)
 */
class WaveformLayer extends Layer {
  /**
   * @param {AudioBuffer} buffer - The audio buffer to display.
   * @param {Object} options - An object to configure the layer.
   */
  constructor(buffer, options) {
    options = Object.assign({}, defaults, options);

    super('entity', buffer.getChannelData(options.channel), options);

    this.configureShape(Waveform, {}, {
      sampleRate: buffer.sampleRate,
      color: options.color,
      renderingStrategy: options.renderingStrategy
    });
  }
}

export default WaveformLayer;
