import assert from 'assert';

import Layer from '../../es6/core/layer';
import LayerTimeContext from '../../es6/core/layer-time-context';
import Segment from '../../es6/shapes/segment';
import SegmentBehavior from '../../es6/behaviors/segment-behavior';
import Timeline from '../../es6/core/timeline';


describe('Segment', function(){
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
    describe('Segment instanciation', function(){
        it('should be placed a the convenient location', function(){
            timeline = new Timeline();
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

            const item0 = layer.d3items._root[0][0].getBoundingClientRect()
            const item1 = layer.d3items._root[0][1].getBoundingClientRect()

            assert.equal(item0.left, 0);
            assert.equal(item0.width, 300);
            assert.equal(item1.left, 600);
            assert.equal(item1.width, 600);

        });
    });
    describe('Segment navigation zoom and move', function(){
        it('should be moved a zoomed accordingly', function(){
            timeline = new Timeline();
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

            timeline.timeContext.stretchRatio = 0.5;
            timeline.timeContext.offset = 15; //

            timeline.update();

            // Check that segments are in the right place

            // Segment width after zoom

            const item0 = layer.d3items._root[0][0];
            const item1 = layer.d3items._root[0][1];

            const item0Width = item0.getBBox().width;
            const item1Width = item1.getBBox().width;
            assert.equal(item0Width, 150);
            assert.equal(item1Width, 300);

            // Segment position

            // We change the timeline.timeContext.offset
            // So the timeline Container is offseted accordingly (tested in tests/core/timeline.js)
            // The only thing to test is that the second item
            // is correctly set to 300 px from the Layer container
            // as it was before transformation 600 px, and zoom is 0.5

            let ctm = item1.getCTM()
            assert.equal(ctm.e, 300)

        })
    })
});
