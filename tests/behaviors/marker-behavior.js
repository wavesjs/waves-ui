const test = require('tape');

import Layer from '../../es6/core/layer';
import Marker from '../../es6/shapes/marker';
import LayerTimeContext from '../../es6/core/layer-time-context';
import MarkerBehavior from '../../es6/behaviors/marker-behavior';
import Timeline from '../../es6/core/timeline';


test('MarkerBehavior', (assert) => {
  const trackDiv = document.createElement("div");
  document.body.appendChild(trackDiv);
  const timeline = new Timeline();
  const track = timeline.createTrack(trackDiv);
  const timeContext = new LayerTimeContext(timeline.timeContext)
  const data = [{ x: 3 }, { x: 6 }];
  const layer = new Layer('collection', data);
  layer.setTimeContext(timeContext);
  layer.configureShape(Marker);
  layer.setBehavior(new MarkerBehavior());
  layer.timeContext.duration = 12;
  timeline.addLayer(layer, track);
  timeline.tracks.render();
  timeline.tracks.update();
  const item = layer.d3items.nodes()[0];
  layer.edit(item, 10, 0, undefined);

  assert.equal(layer.data[0].x, 3.1);
  assert.end();
})
