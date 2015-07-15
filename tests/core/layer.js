import assert from 'assert';

import Layer from '../../es6/core/layer';
import LayerTimeContext from '../../es6/core/layer-time-context';
import Timeline from '../../es6/core/timeline';


describe('Layer', function(){
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

  describe('Layer instanciation', function(){
    it('should create a layer and attach it to a DOM element of a timeline instance width correct height and width', function(){
      timeline = new Timeline();
      timeline.registerContainer(timelineDiv, {}, 'foo');
      let timeContext = new LayerTimeContext(timeline.timeContext)
      let layer = new Layer('collection', []);
      layer.setTimeContext(timeContext);
      layer.timeContext.duration = 12;
      timeline.addLayer(layer, 'foo');
      timeline.drawLayersShapes();
      timeline.update();
      const boundingClientRect = layer.boundingBox.getBoundingClientRect();

      // 100 pps, and 12 second default layer => 1200 px
      assert.equal(boundingClientRect.width, 1200);
      assert.equal(boundingClientRect.height, 100);  // default value
    });
  });
});
