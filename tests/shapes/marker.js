const assert = require('assert');
const Layer = require('../../es6/core/layer');
const TimeContext = require('../../es6/core/time-context');
const Marker = require('../../es6/shapes/marker');
const MarkerBehavior = require('../../es6/behaviors/marker-behavior');
const Timeline = require('../../es6/core/timeline');

describe('Marker', function(){
  describe('Marker instanciation', function(){
    it('should be placed a the convenient location', function(){
        // Holder element for the timeline
        let timelineDiv = document.createElement("div");
        document.body.appendChild(timelineDiv);

        // Create a timeline
        let timeline = new Timeline();
        timeline.registerContainer('foo', timelineDiv);

        // TimeContext
        let timeContext = new TimeContext(timeline.context)

        // Layer instanciation for a marker layer
        let data = [{ x: 3 }, { x: 6 }];
        let layer = new Layer('collection', data);
        layer.setContext(timeContext);
        layer.configureShape(Marker);
        layer.setBehavior(new MarkerBehavior());
        layer.setContextAttribute('duration', 12);

        // Attach layer to the timeline
        timeline.add(layer, 'foo');
        timeline.render();
        timeline.draw();
        timeline.update();

        const item0 = layer.items._root[0][0].getBoundingClientRect()
        const item1 = layer.items._root[0][1].getBoundingClientRect()

        assert.equal(item0.left+item0.width/2, 50);
        assert.equal(item1.left+item0.width/2, 100);

        // setTimeout(function() {
        //   layer.setContextAttribute('start', 12);
        //   timeline.update();
        // }, 1000);
      });
  });
});
