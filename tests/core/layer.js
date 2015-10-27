const test = require('tape');

import Layer from '../../src/core/layer';
import LayerTimeContext from '../../src/core/layer-time-context';
import Timeline from '../../src/core/timeline';


test('Layer with default params', (assert) => {
  const trackDiv = document.createElement("div");
  document.body.appendChild(trackDiv);
  const timeline = new Timeline();
  const track = timeline.createTrack(trackDiv);
  let timeContext = new LayerTimeContext(timeline.timeContext)
  let layer = new Layer('collection', []);
  layer.setTimeContext(timeContext);
  layer.timeContext.duration = 12;
  timeline.addLayer(layer, track);
  timeline.tracks.render();
  timeline.tracks.update();
  const boundingClientRect = layer.$el.getBoundingClientRect();

  // 100 pps, and 12 second default layer => 1200 px
  assert.equal(boundingClientRect.width, 1200);
  assert.equal(boundingClientRect.height, 100);  // default value
  assert.end();
});

