const assert = require('assert');
const Layer = require('../../es6/core/layer');
const LayerTimeContext = require('../../es6/core/layer-time-context');
const Marker = require('../../es6/shapes/marker');
const MarkerBehavior = require('../../es6/behaviors/marker-behavior');
const Timeline = require('../../es6/core/timeline');

describe('Marker', function(){
  describe('Marker instanciation', function(){
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
        let data = [{ x: 3 }, { x: 6 }];
        let layer = new Layer('collection', data);
        layer.setTimeContext(timeContext);
        layer.configureShape(Marker);
        layer.setBehavior(new MarkerBehavior());
        layer.timeContext.duration = 12;

        // Attach layer to the timeline
        timeline.addLayer(layer, 'foo');
        timeline.drawLayerShapes();
        timeline.update();

        const item0 = layer.d3items._root[0][0].getBoundingClientRect()
        const item1 = layer.d3items._root[0][1].getBoundingClientRect()

        assert.equal(item0.left+item0.width/2, 300);
        assert.equal(item1.left+item0.width/2, 600);

        // setTimeout(function() {
        //   layer.setContextAttribute('start', 12);
        //   timeline.update();
        // }, 1000);
      });
  });
});
