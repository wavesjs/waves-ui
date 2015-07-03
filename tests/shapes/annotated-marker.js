const assert = require('assert');

const Layer = require('../../es6/core/layer');
const LayerTimeContext = require('../../es6/core/layer-time-context');
const AnnotatedMarker = require('../../es6/shapes/annotated-marker');
const MarkerBehavior = require('../../es6/behaviors/marker-behavior');
const Timeline = require('../../es6/core/timeline');

describe('Annotated Marker', function(){
  describe('Annotated Marker instanciation', function(){
    it('should contain the right text', function(){
        // Holder element for the timeline
        let titleDiv = document.createElement('div');
        titleDiv.innerHTML = this.test.title;
        document.body.appendChild(titleDiv);
        let timelineDiv = document.createElement("div");
        document.body.appendChild(timelineDiv);

        // Create a timeline
        let timeline = new Timeline();
        timeline.registerContainer('foo', timelineDiv);

        // TimeContext
        let timeContext = new LayerTimeContext(timeline.timeContext)

        // Layer instanciation for a marker layer
        let data = [{ x: 3, text:'foo' }, { x: 6, text:'bar' }];
        let layer = new Layer('collection', data);
        layer.setTimeContext(timeContext);
        layer.configureShape(AnnotatedMarker);
        layer.setBehavior(new MarkerBehavior());
        layer.timeContext.duration = 12;

        // Attach layer to the timeline
        timeline.addLayer(layer, 'foo');
        timeline.render();
        timeline.draw();
        timeline.update();

        const item0 = layer.d3items._root[0][0]
        const item1 = layer.d3items._root[0][1]

        assert.equal(item0.childNodes[1].textContent, "foo");
        assert.equal(item1.childNodes[1].textContent, "bar");

      });
  });
});
