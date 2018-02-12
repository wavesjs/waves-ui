import * as ui from 'waves-ui';

const $track = document.querySelector('#track-1');
const width = $track.getBoundingClientRect().width;
const height = 200;
const duration = 20;

// some data to visualize
const data = [
  { x: 2, width: 4, color: 'steelblue', opacity: 0.8 },
  { x: 10, width: 5, color: 'orange', opacity: 0.8 },
  { x: 14, width: 3, color: 'green', opacity: 0.8 },
];

// define the numbr of pixels per seconds the timeline should display
const pixelsPerSecond = width / duration;
// create a timeline
const timeline = new ui.core.Timeline(pixelsPerSecond, width);
// create a new track into the `track-1` element and give it a id ('main')
timeline.createTrack($track, height, 'main');

// create the layer
const segmentLayer = new ui.helpers.SegmentLayer(data, {
  height: height,
  displayHandlers: false,
});

// insert the layer inside the 'main' track
timeline.addLayer(segmentLayer, 'main');

// add an hover effect on the segments
timeline.on('event', function(e) {
  const eventType = e.type;

  if (eventType !== 'mouseover' && eventType !== 'mouseout')
    return;

  const segment = segmentLayer.getItemFromDOMElement(e.target);

  if (segment !== null) {
    const datum = segmentLayer.getDatumFromItem(segment);
    datum.opacity = eventType === 'mouseover' ? 1 : 0.8;
    segmentLayer.updateShapes();
  }
});
