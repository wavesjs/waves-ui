const test = require('tape');

import Layer from '../../es6/core/layer';
import LayerTimeContext from '../../es6/core/layer-time-context';
import Timeline from '../../es6/core/timeline';
import Track from '../../es6/core/track';


test('Track - instanciation', (assert) => {
  const trackDiv = document.createElement("div");
  document.body.appendChild(trackDiv);
  const track = new Track(trackDiv);
  assert.equal(track.height, 100, "Default height is 100");
  track.height = 200;
  assert.equal(track.height, 200, "When set to 200, height is 200px");
  assert.equal(track.$el.innerHTML,'<svg class="track" xmlns:xhtml="http://www.w3.org/1999/xhtml" height="100" shape-rendering="optimizeSpeed"><defs></defs><rect style="fill-opacity:0" width="100%" height="100%"></rect><g class="offset"><g class="layout"></g></g><g class="interactions"></g></svg>');
  assert.end();
});

test('Track - add/remove Layer', (assert) => {
  // Create a Track
  const trackDiv = document.createElement("div");
  document.body.appendChild(trackDiv);
  const track = new Track(trackDiv);

  // Create a Layer (need a timeContext, which comes from a timeline)
  const timeline = new Timeline();
  let timeContext = new LayerTimeContext(timeline.timeContext)
  const layer = new Layer('collection', []);
  layer.setTimeContext(timeContext);
  layer.timeContext.duration = 12;

  // Add it to the track
  track.add(layer);

  assert.equal(track.$layout.innerHTML, '<g><svg class="bounding-box"><g class="offset items"><rect style="fill-opacity: 0; pointer-events: none;" class="background" width="100%" height="100%"></rect></g><g style="display: none;" class="interactions"><g><rect shape-rendering="crispEdges" style="opacity: 0.6;" class="segment"></rect><rect style="opacity: 0.8; cursor: ew-resize;" shape-rendering="crispEdges" width="2" class="left handler"></rect><rect style="opacity: 0.8; cursor: ew-resize;" shape-rendering="crispEdges" width="2" class="right handler"></rect></g></g></svg></g>');

  // Remove it to the track
  track.remove(layer);

  assert.equal(track.$layout.innerHTML, '');

  // Destroy track

  track.destroy();

  assert.equal(track.$el, null);
  assert.equal(track.renderingContext, null);
  assert.deepEqual(track.layers, []);

  assert.end();
})

test('Track - update container', (assert) => {
  const timelineDiv = document.createElement("div");
  document.body.appendChild(timelineDiv);
  const timeline = new Timeline();
  const track = timeline.createTrack(timelineDiv);
  // Here we modify timeline view rendering
  // Then we update track container
  // And check that it's the right one
  timeline.visibleWidth = 500;
  timeline.offset = 2;
  track.updateContainer();
  assert.equal(track.$el.innerHTML, '<svg viewbox="0 0 500 100" width="500" class="track" xmlns:xhtml="http://www.w3.org/1999/xhtml" height="100" shape-rendering="optimizeSpeed"><defs></defs><rect style="fill-opacity:0" width="100%" height="100%"></rect><g transform="translate(200, 0)" class="offset"><g class="layout"></g></g><g class="interactions"></g></svg>');
  assert.end();
})
