const test = require('tape');

// import {test} from 'tape';

import Layer from '../../src/core/layer';
import LayerTimeContext from '../../src/core/layer-time-context';
import Segment from '../../src/shapes/segment';
import SegmentBehavior from '../../src/behaviors/segment-behavior';
import Timeline from '../../src/core/timeline';


test('SegmentBehavior', (assert) => {
  const trackDiv = document.createElement("div");
  document.body.appendChild(trackDiv);

  const timeline = new Timeline();
  const track = timeline.createTrack(trackDiv);
  const timeContext = new LayerTimeContext(timeline.timeContext)
  const data = [
    { width: 3, x: 0 },
    { width: 6, x: 6}
  ];
  const layer = new Layer('collection', data);
  layer.setTimeContext(timeContext);
  layer.configureShape(Segment);
  layer.setBehavior(new SegmentBehavior());
  layer.timeContext.duration = 12;
  timeline.addLayer(layer, track);
  timeline.tracks.render();
  timeline.tracks.update();
  const item = layer.items[0];
  const shape = layer._$itemShapeMap.get(item);

  layer.edit(item, 10, 0, shape.$segment);

  // y -10 => +0.1 due to horizontal flip
  assert.equal(layer.data[0].x, 0.1);
  assert.equal(layer.data[0].width, 3);

  // move shape background
  layer.edit(item, 10, 0, shape.$segment);

  assert.equal(layer.data[0].x, 0.2);
  assert.equal(layer.data[0].width, 3);

  // move shape leftHandler
  layer.edit(item, 10, 0, shape.$leftHandler);

  assert.equal(layer.data[0].x, 0.3);
  assert.equal(layer.data[0].width, 2.9);

  // move shape leftHandler
  layer.edit(item, -10, 0, shape.$rightHandler);

  assert.equal(layer.data[0].x, 0.3);
  assert.equal(layer.data[0].width, 2.8);

  assert.end();
});
