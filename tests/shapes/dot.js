const test = require('tape');

import Layer from '../../src/core/layer';
import LayerTimeContext from '../../src/core/layer-time-context';
import Dot from '../../src/shapes/dot';
import BreakpointBehavior from '../../src/behaviors/breakpoint-behavior';
import Timeline from '../../src/core/timeline';

test('Dot', (assert) => {
  const trackDiv = document.createElement("div");
  document.body.appendChild(trackDiv);
  const timeline = new Timeline();
  const track = timeline.createTrack(trackDiv);
  let timeContext = new LayerTimeContext(timeline.timeContext)
  var data = [
    { cx: 0, cy: 0 },
    { cx: 1, cy: 0.1 },
    { cx: 2, cy: 0.2 },
    { cx: 3, cy: 0.3 },
    { cx: 4, cy: 0.4 },
    { cx: 5, cy: 0.5 },
    { cx: 6, cy: 0.6 },
    { cx: 7, cy: 0.7 },
    { cx: 8, cy: 0.8 },
    { cx: 9, cy: 0.9 },
    { cx: 10, cy: 1.0 },
    { cx: 11, cy: 0.9 },
    { cx: 12, cy: 0.8 }
  ];
  let layer = new Layer('collection', data);
  layer.setTimeContext(timeContext);
  layer.configureShape(Dot);
  layer.setBehavior(new BreakpointBehavior());
  layer.timeContext.duration = 12;
  timeline.addLayer(layer, track);
  timeline.tracks.render();
  timeline.tracks.update();
  const item0 = layer.items[0].getBoundingClientRect()
  const item1 = layer.items[6].getBoundingClientRect()
  const bodyClientRect = document.body.getBoundingClientRect();

  assert.equal(item0.left+item0.width/2 - bodyClientRect.left, 0, "Dot is well positioned 1");
  assert.equal(item1.left+item1.width/2 - bodyClientRect.left, 600, "Dot is well positioned 2");
  assert.end();
});
