import AxisLayer from '../axis/axis-layer';
import Ticks from '../shapes/ticks';
import timeAxisGenerator from '../axis/time-axis-generator';


/**
 * Helper to create a time axis layer
 *
 * [example usage](./examples/layer-axis.html)
 */
export default class TimeAxisLayer extends AxisLayer {
  /**
   * @param {Object} options - An object to configure the layer.
   */
  constructor(options) {
    options = Object.assign({ color: 'steelblue' }, options);
    super(timeAxisGenerator(), options);

    this.configureShape(Ticks, {}, {
      color: options.color
    });
  }
}