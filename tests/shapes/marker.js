const test = require('tape');

import Layer from '../../src/core/layer';
import LayerTimeContext from '../../src/core/layer-time-context';
import Marker from '../../src/shapes/marker';
import MarkerBehavior from '../../src/behaviors/marker-behavior';
import Timeline from '../../src/core/timeline';


test('Marker', (assert) => {
  const trackDiv = document.createElement("div");
  document.body.appendChild(trackDiv);
  const timeline = new Timeline();
  const track = timeline.createTrack(trackDiv);
  let timeContext = new LayerTimeContext(timeline.timeContext)
  let data = [{ x: 3 }, { x: 6 }];
  let layer = new Layer('collection', data);
  layer.setTimeContext(timeContext);
  layer.configureShape(Marker);
  layer.setBehavior(new MarkerBehavior());
  layer.timeContext.duration = 12;
  timeline.addLayer(layer, track);
  timeline.tracks.render();
  timeline.tracks.update();
  const item0 = layer.items[0].getBoundingClientRect()
  const item1 = layer.items[1].getBoundingClientRect()
  const bodyClientRect = document.body.getBoundingClientRect();

  assert.equal(item0.left+item0.width/2 - bodyClientRect.left, 299.5);
  assert.equal(item1.left+item0.width/2 - bodyClientRect.left, 599.5);
  assert.end();
});
