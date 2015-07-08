import assert from 'assert';

import Layer from '../../es6/core/layer';
import Dot from '../../es6/shapes/dot';
import LayerTimeContext from '../../es6/core/layer-time-context';
import BreakpointBehavior from '../../es6/behaviors/breakpoint-behavior';
import Timeline from '../../es6/core/timeline';


describe("BreakpointBehavior", function(){
  let titleDiv;
  let timeline;
  let timelineDiv;

  beforeEach(function(){
    titleDiv = document.createElement('div');
    titleDiv.innerHTML = this.currentTest.title;
    document.body.appendChild(titleDiv);
    timelineDiv = document.createElement("div");
    document.body.appendChild(timelineDiv);
  })

  describe("Edit Breakpoint Behavior", function(){
    it('should correctly edit breakpoint using breakpoint behavior', function(){
      timeline = new Timeline();
      timeline.registerContainer(timelineDiv, {}, 'foo');
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
      timeline.addLayer(layer, 'foo');
      timeline.drawLayersShapes();
      timeline.update();
      let item = layer.d3items.nodes()[0];
      layer.edit(item, 10, -10, undefined);

      // y -10 => +0.1 due to horizontal flip
      assert.equal(layer.data[0].cx, 0.1);
      assert.equal(layer.data[0].cy, 0.1);
    })
  })
})
