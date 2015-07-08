const assert = require('assert');

const Layer = require('../../es6/core/layer');
const Marker = require('../../es6/shapes/marker');
const LayerTimeContext = require('../../es6/core/layer-time-context');
const MarkerBehavior = require('../../es6/behaviors/marker-behavior');
const Timeline = require('../../es6/core/timeline');


describe('MarkerBehavior', function(){
    describe('Edit Marker Behavior', function(){
        it('should correctly edit marker using marker behavior', function(){
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
            ;
            timeline.drawLayersShapes();
            timeline.update();

            let item = layer.d3items.nodes()[0];
            layer.edit(item, 10, 0, undefined);

            assert.equal(layer.data[0].x, 3.1);

            layer.update();

        })
    })
})
