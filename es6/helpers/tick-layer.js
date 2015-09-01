import Layer from '../core/layer';
import Ticks from '../shapes/ticks';


export default class TickLayer extends Layer {
  constructor(data, options, accessors) {
    options = Object.assign({

    }, options);

    super('entity', data, options);

    const config = options.color ? { color: options.color } : undefined;
    this.configureShape(Ticks, accessors, config);
  }
}