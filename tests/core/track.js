const test = require('tape');

import Layer from '../../src/core/layer';
import LayerTimeContext from '../../src/core/layer-time-context';
import Timeline from '../../src/core/timeline';
import Track from '../../src/core/track';


test('Track - instanciation', (assert) => {
  const trackDiv = document.createElement("div");
  document.body.appendChild(trackDiv);
  const track = new Track(trackDiv);
  assert.equal(track.height, 100, "Default height is 100");
  //<svg class="track" xmlns:xhtml="http://www.w3.org/1999/xhtml" height="100" shape-rendering="optimizeSpeed"><defs></defs><rect style="fill-opacity:0" width="100%" height="100%"></rect><g class="offset"><g class="layout"></g></g><g class="interactions"></g></svg>
  assert.equal(track.$el.childNodes.length, 1)
  assert.equal(track.$el.firstChild.nodeName, 'svg')
  assert.equal(track.$el.firstChild.getAttribute('class'), 'track')
  assert.equal(track.$el.firstChild.getAttribute('xmlns:xhtml'), 'http://www.w3.org/1999/xhtml')
  assert.equal(track.$el.firstChild.getAttribute('height'), '100')
  assert.equal(track.$el.firstChild.getAttribute('shape-rendering'), 'optimizeSpeed');
  const tg = track.$el.firstChild.childNodes
  assert.equal(tg.length, 4);
  assert.equal(tg[0].nodeName, "defs");
  assert.equal(tg[1].nodeName, "rect");
  assert.equal(tg[1].getAttribute('style'), "fill-opacity: 0;");
  assert.equal(tg[1].getAttribute('width'), "100%");
  assert.equal(tg[1].getAttribute('height'), "100%");
  assert.equal(tg[2].nodeName, "g");
  assert.equal(tg[2].getAttribute('class'), "offset");
  assert.equal(tg[2].childNodes.length, 1);
  assert.equal(tg[2].childNodes[0].nodeName, "g");
  assert.equal(tg[2].childNodes[0].getAttribute('class'), "layout");
  assert.equal(tg[3].nodeName, "g");
  assert.equal(tg[3].getAttribute('class'), "interactions");

  track.height = 200;
  assert.equal(track.height, 200, "When set to 200, height is 200px");
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

  // <g>
  //  <svg class="bounding-box">
  //    <g class="offset items">
  //      <rect style="fill-opacity: 0; pointer-events: none;" class="background" width="100%" height="100%"></rect>
  //    </g>
  //    <g style="display: none;" class="interactions">
  //      <g>
  //        <rect shape-rendering="crispEdges" style="opacity: 0.6;" class="segment"></rect>
  //        <rect style="opacity: 0.8; cursor: ew-resize;" shape-rendering="crispEdges" width="2" class="left handler"></rect>
  //        <rect style="opacity: 0.8; cursor: ew-resize;" shape-rendering="crispEdges" width="2" class="right handler"></rect>
  //      </g>
  //    </g>
  //  </svg>
  // </g>
  assert.equal(track.$layout.childNodes.length, 1)
  assert.equal(track.$layout.firstChild.nodeName, 'g')
  assert.equal(track.$layout.firstChild.childNodes.length, 1);
  assert.equal(track.$layout.firstChild.firstChild.nodeName, 'svg');
  assert.equal(track.$layout.firstChild.firstChild.getAttribute('class'), 'bounding-box');
  assert.equal(track.$layout.firstChild.firstChild.childNodes.length, 2);
  assert.equal(track.$layout.firstChild.firstChild.childNodes[0].nodeName, 'g');
  assert.equal(track.$layout.firstChild.firstChild.childNodes[0].getAttribute('class'), 'offset items');
  assert.equal(track.$layout.firstChild.firstChild.childNodes[1].nodeName, 'g');
  assert.equal(track.$layout.firstChild.firstChild.childNodes[1].getAttribute('class'), 'interactions');
  assert.equal(track.$layout.firstChild.firstChild.childNodes[1].getAttribute('style'), 'display: none;');
  assert.equal(track.$layout.firstChild.firstChild.childNodes[1].childNodes.length, 1);
  assert.equal(track.$layout.firstChild.firstChild.childNodes[1].firstChild.nodeName, "g");
  assert.equal(track.$layout.firstChild.firstChild.childNodes[1].firstChild.childNodes.length, 3)
  assert.equal(track.$layout.firstChild.firstChild.childNodes[1].firstChild.childNodes[0].nodeName, "rect")
  assert.equal(track.$layout.firstChild.firstChild.childNodes[1].firstChild.childNodes[0].getAttribute('shape-rendering'), "crispEdges")
  assert.equal(track.$layout.firstChild.firstChild.childNodes[1].firstChild.childNodes[0].getAttribute('style'), "opacity: 0.6;")
  assert.equal(track.$layout.firstChild.firstChild.childNodes[1].firstChild.childNodes[0].getAttribute('class'), "segment")
  assert.equal(track.$layout.firstChild.firstChild.childNodes[1].firstChild.childNodes[1].nodeName, "rect")
  assert.equal(track.$layout.firstChild.firstChild.childNodes[1].firstChild.childNodes[1].getAttribute('class'), "left handler")
  assert.equal(track.$layout.firstChild.firstChild.childNodes[1].firstChild.childNodes[1].getAttribute('width'), "2")
  assert.equal(track.$layout.firstChild.firstChild.childNodes[1].firstChild.childNodes[1].getAttribute('shape-rendering'), "crispEdges")
  assert.equal(track.$layout.firstChild.firstChild.childNodes[1].firstChild.childNodes[1].getAttribute('style'), "opacity: 0.8; cursor: ew-resize;")
  assert.equal(track.$layout.firstChild.firstChild.childNodes[1].firstChild.childNodes[2].nodeName, "rect")
  assert.equal(track.$layout.firstChild.firstChild.childNodes[1].firstChild.childNodes[2].getAttribute('class'), "right handler")
  assert.equal(track.$layout.firstChild.firstChild.childNodes[1].firstChild.childNodes[2].getAttribute('width'), "2")
  assert.equal(track.$layout.firstChild.firstChild.childNodes[1].firstChild.childNodes[2].getAttribute('shape-rendering'), "crispEdges")
  assert.equal(track.$layout.firstChild.firstChild.childNodes[1].firstChild.childNodes[2].getAttribute('style'), "opacity: 0.8; cursor: ew-resize;")
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
  // <svg viewbox="0 0 500 100" width="500" class="track" xmlns:xhtml="http://www.w3.org/1999/xhtml" height="100" shape-rendering="optimizeSpeed">
  //  <defs></defs>
  //  <rect style="fill-opacity:0" width="100%" height="100%"></rect>
  //  <g transform="translate(200, 0)" class="offset">
  //    <g class="layout"></g>
  //  </g>
  //  <g class="interactions"></g>
  // </svg>
  assert.equal(track.$el.firstChild.getAttribute('viewbox'), "0 0 500 100");
  assert.equal(track.$el.firstChild.getAttribute('width'), "500");
  assert.equal(track.$el.firstChild.childNodes[2].getAttribute('transform'), "translate(200, 0)");
  assert.end();
})
