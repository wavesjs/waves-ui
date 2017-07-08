const test = require('tape');

import Layer from '../../src/core/layer';
import Dot from '../../src/shapes/dot';
import LayerTimeContext from '../../src/core/layer-time-context';
import BreakpointBehavior from '../../src/behaviors/breakpoint-behavior';
import Timeline from '../../src/core/timeline';


test("Edit Breakpoint Behavior", (assert) => {
  const trackDiv = document.createElement("div");
  document.body.appendChild(trackDiv);
  const timeline = new Timeline();
  const track = timeline.createTrack(trackDiv);
  const timeContext = new LayerTimeContext(timeline.timeContext)
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
  const layer = new Layer('collection', data);
  layer.setTimeContext(timeContext);
  layer.configureShape(Dot);
  layer.setBehavior(new BreakpointBehavior());
  layer.timeContext.duration = 12;
  timeline.addLayer(layer, track);
  timeline.tracks.render();
  timeline.tracks.update();
  const item = layer.items[0];
  layer.edit(item, 10, -10, undefined);

  // y -10 => +0.1 due to horizontal flip
  assert.equal(layer.data[0].cx, 0.1);
  assert.equal(layer.data[0].cy, 0.1);
  assert.end();
})
