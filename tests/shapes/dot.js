import assert from 'assert';

import Layer from '../../es6/core/layer';
import LayerTimeContext from '../../es6/core/layer-time-context';
import Dot from '../../es6/shapes/dot';
import BreakpointBehavior from '../../es6/behaviors/breakpoint-behavior';
import Timeline from '../../es6/core/timeline';

describe('Dot', function(){
  describe('Dot instanciation', function(){
    it('should be placed a the convenient location', function(){
        let titleDiv = document.createElement('div');
        titleDiv.innerHTML = this.test.title;
        document.body.appendChild(titleDiv);
        // Holder element for the timeline
        let timelineDiv = document.createElement("div");
        document.body.appendChild(timelineDiv);

        // Create a timeline
        let timeline = new Timeline();
        timeline.registerContainer(timelineDiv, {}, 'foo');

        // TimeContext
        let timeContext = new LayerTimeContext(timeline.timeContext)

        // Layer instanciation for a marker layer
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

        // Attach layer to the timeline
        timeline.addLayer(layer, 'foo');
        ;
        timeline.drawLayersShapes();
        timeline.update();

        const item0 = layer.d3items._root[0][0].getBoundingClientRect()
        const item1 = layer.d3items._root[0][6].getBoundingClientRect()

        assert.equal(item0.left+item0.width/2, 0);
        assert.equal(item1.left+item1.width/2, 600);

      });
  });
});
