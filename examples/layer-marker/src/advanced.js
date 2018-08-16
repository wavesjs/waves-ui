import * as ui from 'waves-ui';

const $track = document.querySelector('#track-2');
const width = $track.getBoundingClientRect().width;
const height = 200;
const duration = 10;

const data = [
  { time: 2, text: 'label 1' },
  { time: 5, text: 'label 2' },
  { time: 6, text: 'label 3' },
  { time: 8, text: 'label 4' },
];

const pixelsPerSecond = width / duration;

const timeline = new ui.core.Timeline(pixelsPerSecond, width);
const track = new ui.core.Track($track, height);

const markerLayer = new ui.core.Layer('collection', data, {
  height: height
});

const timeContext = new ui.core.LayerTimeContext(timeline.timeContext);

markerLayer.setTimeContext(timeContext);
markerLayer.configureShape(ui.shapes.Marker, {
  x: function(d, v) {
    if (v !== undefined) { d.time = v; }
    return d.time;
  },
  color: function() {
    return 'orange';
  },
  label: function(d) {
    return d.text;
  },
}, {
  displayLabels: true,
});

markerLayer.setBehavior(new ui.behaviors.MarkerBehavior());

timeline.state = new ui.states.SimpleEditionState(timeline);

track.add(markerLayer);
timeline.add(track);

timeline.tracks.render();
timeline.tracks.update();
