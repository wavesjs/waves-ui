import AxisLayer from '../axis/AxisLayer';
import Ticks from '../shapes/Ticks';
import timeAxisGenerator from '../axis/timeAxisGenerator';


/**
 * Helper to create a time axis layer
 *
 * [example usage](./examples/layer-axis.html)
 */
class TimeAxisLayer extends AxisLayer {
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

export default TimeAxisLayer;
