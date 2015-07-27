import AnnotatedMarker from '../shapes/annotated-marker';
import Layer from '../core/layer';
import MarkerBehavior from '../behaviors/marker-behavior';


export default class AnnotatedMarkerLayer extends Layer {
  constructor(data, options = {}) {
    super('collection', data, options);

    this.configureShape(AnnotatedMarker);
    this.setBehavior(new MarkerBehavior());
  }
}
