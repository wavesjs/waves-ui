import assert from 'assert';

import Layer from '../../es6/core/layer';
import LayerTimeContext from '../../es6/core/layer-time-context';
import TraceDots from '../../es6/shapes/trace-dots';
import TraceBehavior from '../../es6/behaviors/trace-behavior';
import Timeline from '../../es6/core/timeline';


describe('TraceDots', function(){
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

  describe('TraceDots instanciation', function(){
    it('should be placed a the convenient location', function(){
      timeline = new Timeline();
      timeline.registerContainer(timelineDiv, {}, 'foo');
      let timeContext = new LayerTimeContext(timeline.timeContext)
      var data = [
        { x: 0,  mean: 0 ,  range: 0.1},
        { x: 1,  mean: 0.1, range: 0.2},
        { x: 2,  mean: 0.2, range: 0.1},
        { x: 3,  mean: 0.3, range: 0.3},
        { x: 4,  mean: 0.4, range: 0.1},
        { x: 5,  mean: 0.5, range: 0.2},
        { x: 6,  mean: 0.6, range: 0.1},
        { x: 7,  mean: 0.7, range: 0.3},
        { x: 8,  mean: 0.8, range: 0.1},
        { x: 9,  mean: 0.9, range: 0.2},
        { x: 10, mean: 1.0, range: 0.1},
        { x: 11, mean: 0.9, range: 0.3},
        { x: 12, mean: 0.8, range: 0.1}
      ];
      let layer = new Layer('collection', data);
      layer.setTimeContext(timeContext);
      layer.configureShape(TraceDots);
      layer.setBehavior(new TraceBehavior());
      layer.timeContext.duration = 12;
      timeline.addLayer(layer, 'foo');
      timeline.drawLayersShapes();
      timeline.update();
      const item0 = layer.d3items._root[0][3].getBoundingClientRect()
      const item1 = layer.d3items._root[0][4].getBoundingClientRect()
      const item2 = layer.d3items._root[0][6].getBoundingClientRect()
      const item3 = layer.d3items._root[0][7].getBoundingClientRect()

      // Due to judicious data selection (as usual ...)
      // We can compare top of item0 and item1 and bottom of item2 and item3
      assert.equal(item0.top, item1.top);
      assert.equal(item2.bottom, item3.bottom);
    });
  });
});
