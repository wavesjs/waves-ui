import Layer from '../core/layer';
import Marker from '../shapes/marker';
import MarkerBehavior from '../behaviors/marker-behavior';


export default class MarkerLayer extends Layer {
  constructor(data, options = {}) {
    super('collection', data, options)
    this.configureShape(Marker, {}, {
      displayHandler: options.displayHandler
    });
    this.setBehavior(new MarkerBehavior());
  }
}
