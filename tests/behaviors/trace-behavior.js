const test = require('tape');

import Layer from '../../src/core/layer';
import LayerTimeContext from '../../src/core/layer-time-context';
import Timeline from '../../src/core/timeline';
import TraceBehavior from '../../src/behaviors/trace-behavior';
import TraceDots from '../../src/shapes/trace-dots';


test('TraceBehavior', (assert) => {
  const trackDiv = document.createElement("div");
  document.body.appendChild(trackDiv);
  const timeline = new Timeline();
  const track = timeline.createTrack(trackDiv);
  const timeContext = new LayerTimeContext(timeline.timeContext)
  const data = [
    { x: 0,  mean: 0 ,  range: 0.1},
    { x: 1,  mean: 0.1, range: 0.2},
    { x: 2,  mean: 0.2, range: 0.1},
    { x: 3,  mean: 0.3, range: 0.3},
    { x: 4,  mean: 0.4, range: 0.1},
    { x: 5,  mean: 0.5, range: 0.2},
    { x: 6,  mean: 0.6, range: 0.1},
    { x: 7,  mean: 0.7, range: 0.3},
    { x: 8,  mean: 0.8, range: 0.1},
    { x: 9,  mean: 0.9, range: 0.2},
    { x: 10, mean: 1.0, range: 0.1},
    { x: 11, mean: 0.9, range: 0.3},
    { x: 12, mean: 0.8, range: 0.1}
  ];
  const layer = new Layer('collection', data);
  layer.setTimeContext(timeContext);
  layer.configureShape(TraceDots);
  layer.setBehavior(new TraceBehavior());
  layer.timeContext.duration = 12;
  timeline.addLayer(layer, track);
  timeline.tracks.render();
  timeline.tracks.update();
  const item = layer.items[0];
  const shape = layer._$itemShapeMap.get(item);
  layer.edit(item, 10, 0, shape.$mean);

  assert.equal(layer.data[0].x, 0.1);
  assert.equal(layer.data[0].mean, 0.0);
  assert.equal(layer.data[0].range, 0.1);

  layer.edit(item, 10, -10, shape.$mean);

  assert.equal(layer.data[0].x, 0.2);
  assert.equal(layer.data[0].mean, 0.1);
  assert.equal(layer.data[0].range, 0.1);

  layer.edit(item, 10, -10, shape.$max);

  assert.equal(layer.data[0].x, 0.2);  // Don't move the x
  assert.equal(layer.data[0].mean, 0.1);  // Don't change mean
  assert.equal(layer.data[0].range, 0.3);  // But change range (2*dy)

  layer.edit(item, 10, -10, shape.$min);

  assert.equal(layer.data[0].x, 0.2);  // Don't move the x
  assert.equal(layer.data[0].mean, 0.1);  // Don't change mean
  assert.equal(layer.data[0].range, 0.1);  // But change range (2*dy)
  assert.end()
});
