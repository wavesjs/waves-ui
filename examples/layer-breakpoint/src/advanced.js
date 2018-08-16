import * as ui from 'waves-ui';

const $track = document.querySelector('#track-2');
const width = $track.getBoundingClientRect().width;
const height = 200;
const duration = 4;

// some data to visualize
const data = [
  { x: 0, y: 0.2 },
  { x: 1, y: 0.4 },
  { x: 2, y: 0.8 },
  { x: 3, y: 0.4 },
  { x: 4, y: 0.6 },
];

const pixelsPerSecond = width / duration;

const timeline = new ui.core.Timeline(pixelsPerSecond, width);
const track = new ui.core.Track($track, height);

const breakpointLayer = new ui.core.Layer('collection', data, {
  height: height
});

const accessors = {
  cx: function(d, v) {
    if (v !== undefined) { d.x = v; }
    return d.x;
  },
  cy: function(d, v) {
    if (v !== undefined) { d.y = v; }
    return d.y;
  },
  color: function(d) {
    return 'steelblue'
  }
};

const timeContext = new ui.core.LayerTimeContext(timeline.timeContext);

breakpointLayer.setTimeContext(timeContext);
breakpointLayer.configureCommonShape(ui.shapes.Line, accessors, { color: '#565656' });
breakpointLayer.configureShape(ui.shapes.Dot, accessors);
breakpointLayer.setBehavior(new ui.behaviors.BreakpointBehavior());

timeline.state = new ui.states.BreakpointState(timeline, (x, y) => {
  // create a datum from values represented by the new dot
  return { x, y };
});

track.add(breakpointLayer);
timeline.add(track);

timeline.tracks.render();
timeline.tracks.update();
