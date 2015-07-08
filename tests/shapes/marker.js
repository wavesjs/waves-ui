import assert from 'assert';

import Layer from '../../es6/core/layer';
import LayerTimeContext from '../../es6/core/layer-time-context';
import Marker from '../../es6/shapes/marker';
import MarkerBehavior from '../../es6/behaviors/marker-behavior';
import Timeline from '../../es6/core/timeline';


describe('Marker', function(){
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

  describe('Marker instanciation', function(){
    it('should be placed a the convenient location', function(){
      timeline = new Timeline();
      timeline.registerContainer(timelineDiv, {}, 'foo');
      let timeContext = new LayerTimeContext(timeline.timeContext)
      let data = [{ x: 3 }, { x: 6 }];
      let layer = new Layer('collection', data);
      layer.setTimeContext(timeContext);
      layer.configureShape(Marker);
      layer.setBehavior(new MarkerBehavior());
      layer.timeContext.duration = 12;
      timeline.addLayer(layer, 'foo');
      timeline.drawLayersShapes();
      timeline.update();
      const item0 = layer.d3items._root[0][0].getBoundingClientRect()
      const item1 = layer.d3items._root[0][1].getBoundingClientRect()

      assert.equal(item0.left+item0.width/2, 300);
      assert.equal(item1.left+item0.width/2, 600);
    });
  });
});
