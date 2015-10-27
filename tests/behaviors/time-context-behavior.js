const test = require('tape');

import Layer from '../../src/core/layer';
import LayerTimeContext from '../../src/core/layer-time-context';
import TimeContextBehavior from '../../src/behaviors/time-context-behavior';
import Timeline from '../../src/core/timeline';


test('TimeContextBehavior should edit shape accordingly', (assert) => {
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
  layer.editContext(10, 0, layer.contextShape.$segment);

  // Check that the timeContext.start has changed accordingly (10px becomes 0.6 sec)
  assert.equal(layer.timeContext.start, 0.1);
  assert.equal(layer.timeContext.duration, 12);
  assert.equal(layer.timeContext.offset, 0);

  layer.editContext(10, 0, layer.contextShape.$leftHandler);

  assert.equal(layer.timeContext.start, 0.2)
  assert.equal(layer.timeContext.duration, 11.9)
  assert.equal(layer.timeContext.offset, -0.1)

  layer.editContext(10, 0, layer.contextShape.$rightHandler);

  assert.equal(layer.timeContext.start, 0.2);
  assert.equal(layer.timeContext.duration, 12);
  assert.equal(layer.timeContext.offset, -0.1);

  layer.editContext(-20, 0, layer.contextShape.$segment);

  // Start can't be negative: -20 should give -0.1 start if not blocked, but it's blocked by the lib
  assert.equal(layer.timeContext.start, 0);
  assert.equal(layer.timeContext.duration, 12);
  assert.equal(layer.timeContext.offset, -0.1);

  layer.editContext(10, 0, layer.contextShape.$leftHandler);

  assert.equal(layer.timeContext.start, 0.1);
  assert.equal(layer.timeContext.duration, 11.9);
  assert.equal(layer.timeContext.offset, -0.2);
  assert.end();
})

test('TimeContextBehavior should edit shape accordingly v2', (assert) => {
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

  layer.editContext(10, 0, layer.contextShape.$leftHandler);
  assert.equal(layer.timeContext.start, 0.1);
  assert.equal(layer.timeContext.duration, 11.9);
  assert.equal(layer.timeContext.offset, -0.1);

  layer.editContext(10, 0, layer.contextShape.$rightHandler);

  assert.equal(layer.timeContext.start, 0.1);
  assert.equal(layer.timeContext.duration, 12);
  assert.equal(layer.timeContext.offset, -0.1);

  layer.editContext(-20, 0, layer.contextShape.$segment);
  // start can't be negative: -20 should give -0.6 start if not blocked
  assert.equal(layer.timeContext.start, 0);
  assert.equal(layer.timeContext.duration, 12);
  assert.equal(layer.timeContext.offset, -0.1);

  layer.editContext(10, 0, layer.contextShape.$leftHandler);

  assert.equal(layer.timeContext.start, 0.1);
  assert.equal(layer.timeContext.duration, 11.9);
  assert.equal(layer.timeContext.offset, -0.2);
  assert.end();
})


test('TimeContextBehavior should stretch behavior correctly', (assert) => {
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
  layer.stretchContext(10, 0, layer.contextShape.$segment);
  let sR = layer.timeContext.stretchRatio;

  // "Non-sense" it's just a move
  assert.equal(layer.timeContext.start, 0.1);
  assert.equal(layer.timeContext.duration, 12);
  assert.equal(layer.timeContext.offset, 0);

  layer.stretchContext(10, 0, layer.contextShape.$leftHandler);

  assert.equal(layer.timeContext.start, 0.2);
  assert.equal(layer.timeContext.duration, 12);
  assert.equal(layer.timeContext.offset, 0);
  assert.ok(layer.timeContext.stretchRatio - 11.9/12*sR < Number.EPSILON);

  sR = 11.9/12*sR;
  layer.stretchContext(-10, 0, layer.contextShape.$rightHandler);

  assert.equal(layer.timeContext.start, 0.2);
  assert.equal(layer.timeContext.duration, 12);
  assert.equal(layer.timeContext.offset, 0);
  assert.ok(layer.timeContext.stretchRatio - 11.8/11.9*sR < Number.EPSILON);
  assert.end();
})
