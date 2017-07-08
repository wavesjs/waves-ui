const test = require('tape');

import Layer from '../../src/core/layer';
import LayerTimeContext from '../../src/core/layer-time-context';
import AnnotatedMarker from '../../src/shapes/annotated-marker';
import MarkerBehavior from '../../src/behaviors/marker-behavior';
import Timeline from '../../src/core/timeline';


test('Annotated Marker', (assert) => {
  let trackDiv = document.createElement("div");
  document.body.appendChild(trackDiv);
  const timeline = new Timeline();
  const track = timeline.createTrack(trackDiv);
  let timeContext = new LayerTimeContext(timeline.timeContext)
  let data = [{ x: 3, text:'foo' }, { x: 6, text:'bar' }];
  let layer = new Layer('collection', data);
  layer.setTimeContext(timeContext);
  layer.configureShape(AnnotatedMarker);
  layer.setBehavior(new MarkerBehavior());
  layer.timeContext.duration = 12;
  timeline.addLayer(layer, track);
  timeline.tracks.render();
  timeline.tracks.update();
  const item0 = layer.items[0]
  const item1 = layer.items[1]
  assert.equal(item0.childNodes[2].textContent, "foo", "should contain the right text");
  assert.equal(item1.childNodes[2].textContent, "bar", "should contain the right text");
  assert.end()
});
