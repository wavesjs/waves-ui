const assert = require('assert');
const Layer = require('../../es6/core/layer');
const TimeContext = require('../../es6/core/time-context');
const Segment = require('../../es6/shapes/segment');
const SegmentBehavior = require('../../es6/behaviors/segment-behavior');
const Timeline = require('../../es6/core/timeline');

describe.only('Segment', function(){
    describe('Segment instanciation', function(){
        it('should be placed a the convenient location', function(){
            let titleDiv = document.createElement('div');
            titleDiv.innerHTML = this.test.title;
            document.body.appendChild(titleDiv);
            // Holder element for the timeline
            let timelineDiv = document.createElement("div");
            document.body.appendChild(timelineDiv);

            // Create a timeline
            let timeline = new Timeline();
            timeline.registerContainer('foo', timelineDiv);

            // TimeContext
            let timeContext = new TimeContext(timeline.timeContext)

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
            timeline.render();
            timeline.draw();
            timeline.update();

            const item0 = layer.items._root[0][0].getBoundingClientRect()
            const item1 = layer.items._root[0][1].getBoundingClientRect()

            assert.equal(item0.left, 0);
            assert.equal(item0.width, 50);
            assert.equal(item1.left, 100);
            assert.equal(item1.width, 100);

        });
    });
    describe('Segment navigation zoom and move', function(){
        it('should be moved a zoomed accordingly', function(){
            let titleDiv = document.createElement('div');
            titleDiv.innerHTML = this.test.title;
            document.body.appendChild(titleDiv);
            // Holder element for the timeline
            let timelineDiv = document.createElement("div");
            document.body.appendChild(timelineDiv);

            // Create a timeline
            let timeline = new Timeline();
            timeline.registerContainer('foo', timelineDiv);

            // TimeContext
            let timeContext = new TimeContext(timeline.timeContext)

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
            timeline.render();
            timeline.draw();
            timeline.update();

            timeline.timeContext.stretchRatio = 0.5;
            timeline.timeContext.offset = 15; // 250 px

            timeline.update();

            // Check that segments are in the right place

            // Segment width

            const item0 = layer.items._root[0][0];
            const item1 = layer.items._root[0][1];

            const item0Width = item0.getBBox().width;
            const item1Width = item1.getBBox().width;
            assert.equal(item0Width, 25);
            assert.equal(item1Width, 50);

            const item0 = layer.items._root[0][0].getBoundingClientRect()
            const item1 = layer.items._root[0][1].getBoundingClientRect()

            console.log(layer.items._root[0][0].getBBox())
            console.log(layer.container.getBoundingClientRect());
            assert.equal(item0.left, 125);
            assert.equal(item1.left, 175);

        })
    })
});
