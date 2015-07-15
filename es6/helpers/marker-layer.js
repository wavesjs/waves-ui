import Layer from '../core/layer';
import Marker from '../shapes/marker';
import MarkerBehavior from '../behaviors/marker-behavior';


export default class MarkerLayer extends Layer {
  constructor(dataType, data, options = {}) {
    super(dataType, data, options)
    this.configureShape(Marker);
    this.setBehavior(new MarkerBehavior());
  }
}
