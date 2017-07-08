const test = require('tape');

import Layer from '../../src/core/layer';
import LayerTimeContext from '../../src/core/layer-time-context';
import Segment from '../../src/shapes/segment';
import SegmentBehavior from '../../src/behaviors/segment-behavior';
import Timeline from '../../src/core/timeline';


test('Segment instanciation', (assert) => {
  const trackDiv = document.createElement("div");
  document.body.appendChild(trackDiv);
  const timeline = new Timeline();
  const track = timeline.createTrack(trackDiv);
  let timeContext = new LayerTimeContext(timeline.timeContext)
  let data = [
    { width: 3, x: 0 },
    { width: 6, x: 6}
  ];
  let layer = new Layer('collection', data);
  layer.setTimeContext(timeContext);
  layer.configureShape(Segment);
  layer.setBehavior(new SegmentBehavior());
  layer.timeContext.duration = 12;
  timeline.addLayer(layer, track);
  timeline.tracks.render();
  timeline.tracks.update();
  const item0 = layer.items[0].getBoundingClientRect()
  const item1 = layer.items[1].getBoundingClientRect()
  const bodyClientRect = document.body.getBoundingClientRect();

  assert.equal(item0.left - bodyClientRect.left, 0);
  assert.equal(item0.width, 300);
  assert.equal(item1.left - bodyClientRect.left, 600);
  assert.equal(item1.width, 600);
  assert.end();
});

test('Segment navigation zoom and move', (assert) => {
  const trackDiv = document.createElement("div");
  document.body.appendChild(trackDiv);
  const timeline = new Timeline();
  const track = timeline.createTrack(trackDiv);
  let timeContext = new LayerTimeContext(timeline.timeContext)
  let data = [
    { width: 3, x: 0 },
    { width: 6, x: 6}
  ];
  let layer = new Layer('collection', data);
  layer.setTimeContext(timeContext);
  layer.configureShape(Segment);
  layer.setBehavior(new SegmentBehavior());
  layer.timeContext.duration = 12;
  timeline.addLayer(layer, track);
  timeline.tracks.render();
  timeline.tracks.update();
  timeline.timeContext.zoom = 0.5;
  timeline.timeContext.offset = 15; //
  timeline.tracks.render();
  timeline.tracks.update();
  const item0 = layer.items[0];
  const item1 = layer.items[1];
  const item0Width = item0.getBBox().width;
  const item1Width = item1.getBBox().width;
  let ctm = item1.getCTM()

  assert.equal(item0Width, 150);
  assert.equal(item1Width, 300);
  // Segment position
  // We change the timeline.timeContext.offset
  // So the timeline Container is offseted accordingly (tested in tests/core/timeline.js)
  // The only thing to test is that the second item
  // is correctly set to 300 px from the Layer container
  // as it was before transformation 600 px, and zoom is 0.5
  assert.equal(ctm.e, 300);
  assert.end();
});

