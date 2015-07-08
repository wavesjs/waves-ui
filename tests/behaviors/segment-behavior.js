import assert from 'assert';

import Layer from '../../es6/core/layer';
import LayerTimeContext from '../../es6/core/layer-time-context';
import Segment from '../../es6/shapes/segment';
import SegmentBehavior from '../../es6/behaviors/segment-behavior';
import Timeline from '../../es6/core/timeline';


describe('SegmentBehavior', function(){
    describe('Edit Segment Behavior', function(){
        it('should correctly edit a segment', function(){
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
            let data = [
              { width: 3, x: 0 },
              { width: 6, x: 6}
            ];

            let layer = new Layer('collection', data);
            layer.setTimeContext(timeContext);
            layer.configureShape(Segment);
            layer.setBehavior(new SegmentBehavior());
            layer.timeContext.duration = 12;

            // Attach layer to the timeline
            timeline.addLayer(layer, 'foo');
            ;
            timeline.drawLayersShapes();
            timeline.update();


            let item = layer.d3items.nodes()[0];
            const shape = layer._itemElShapeMap.get(item);

            layer.edit(item, 10, 0, shape.segment);

            // y -10 => +0.1 due to horizontal flip
            assert.equal(layer.data[0].x, 0.1);
            assert.equal(layer.data[0].width, 3);

            // move shape background
            layer.edit(item, 10, 0, shape.segment);
            assert.equal(layer.data[0].x, 0.2);
            assert.equal(layer.data[0].width, 3);

            // move shape leftHandler
            layer.edit(item, 10, 0, shape.leftHandler);
            assert.equal(layer.data[0].x, 0.3);
            assert.equal(layer.data[0].width, 2.9);

            // move shape leftHandler
            layer.edit(item, -10, 0, shape.rightHandler);
            assert.equal(layer.data[0].x, 0.3);
            assert.equal(layer.data[0].width, 2.8);

        });
    });
});
