import * as ui from 'waves-ui';

const $track = document.querySelector('#track-2');
const width = $track.getBoundingClientRect().width;
const height = 200;
const duration = 20;

const data = [
  { timestamp: 0, mean: 0.5, range: 0.4 },
  { timestamp: 4, mean: 0.3, range: 0.2 },
  { timestamp: 8, mean: 0.7, range: 0.5 },
  { timestamp: 12, mean: 0.6, range: 0.2 },
  { timestamp: 16, mean: 0.4, range: 0.4 },
  { timestamp: 20, mean: 0.5, range: 0.3 },
];

const pixelsPerSecond = width / duration;

const timeline = new ui.core.Timeline(pixelsPerSecond, width);
const track = new ui.core.Track($track, height);

const traceLayer = new ui.core.Layer('collection', data, {
  height: height
});

const accessors = {
  x: function(d, v) {
    if (v !== undefined) { d.timestamp = v; }
    return d.timestamp;
  }
};

const shapesOptions = {
  meanColor: 'steelblue',
  rangeColor: 'steelblue'
};

const timeContext = new ui.core.LayerTimeContext(timeline.timeContext);

traceLayer.setTimeContext(timeContext);
traceLayer.configureCommonShape(ui.shapes.TracePath, accessors, shapesOptions);
// dots can be removed by setting the layer type to 'entity' and use `TracePath` as the shape
traceLayer.configureShape(ui.shapes.TraceDots, accessors, shapesOptions);
traceLayer.setBehavior(new ui.behaviors.TraceBehavior());

timeline.state = new ui.states.SimpleEditionState(timeline);

track.add(traceLayer);
timeline.add(track);

timeline.tracks.render();
timeline.tracks.update();
