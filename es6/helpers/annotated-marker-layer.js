import Layer from '../core/layer';
import AnnotatedMarker from '../shapes/annotated-marker';
import MarkerBehavior from '../behaviors/marker-behavior';


export default class AnnotatedMarkerLayer extends Layer {
  constructor(dataType, data, options = {}) {
    super(dataType, data, options)
    this.configureShape(AnnotatedMarker);
    this.setBehavior(new MarkerBehavior());
  }
}
