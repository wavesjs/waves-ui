import AxisLayer from '../axis/AxisLayer';
import Ticks from '../shapes/Ticks';
import gridAxisGenerator from '../axis/gridAxisGenerator';


/**
 * Helper to create a grid layer
 *
 * [example usage](./examples/layer-axis.html)
 */
class GridAxisLayer extends AxisLayer {
  /**
   * @param {Object} options - An object to configure the layer.
   */
  constructor(options) {
    options = Object.assign({
      color: 'steelblue',
      bpm: 60,
      signature: '4/4'
    }, options);

    super(gridAxisGenerator(options.bpm, options.signature), options);

    this.configureShape(Ticks, {}, {
      color: options.color
    });
  }
}

export default GridAxisLayer;
