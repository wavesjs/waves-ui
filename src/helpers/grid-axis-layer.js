import AxisLayer from '../axis/axis-layer';
import Ticks from '../shapes/ticks';
import gridAxisGenerator from '../axis/grid-axis-generator';


export default class GridAxisLayer extends AxisLayer {
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