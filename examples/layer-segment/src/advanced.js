import * as ui from 'waves-ui';

const $track = document.querySelector('#track-3');
const width = $track.getBoundingClientRect().width;
const height = 200;
const duration = 20;

const data = [
  { start: 2, duration: 4, color: 'steelblue', text: 'label 1' },
  { start: 10, duration: 5, color: 'orange', text: 'label 2' },
  { start: 14, duration: 3, color: 'green', text: 'label 3' },
];

const pixelsPerSecond = width / duration;

const timeline = new ui.core.Timeline(pixelsPerSecond, width);
const track = new ui.core.Track($track, height);

const segmentLayer = new ui.core.Layer('collection', data, {
  height: height
});

const timeContext = new ui.core.LayerTimeContext(timeline.timeContext);

segmentLayer.setTimeContext(timeContext);
segmentLayer.configureShape(ui.shapes.Segment, {
  x: function(d, v) {
    if (v !== undefined) { d.start = v; }
    return d.start;
  },
  width: function(d, v) {
    if (v !== undefined) { d.duration = v; }
    return d.duration;
  },
  label: function(d) {
    return d.text;
  }
}, {
  displayLabels: true,
});

segmentLayer.setBehavior(new ui.behaviors.SegmentBehavior());

timeline.state = new ui.states.SimpleEditionState(timeline);

track.add(segmentLayer);
timeline.add(track);

timeline.tracks.render();
timeline.tracks.update();
