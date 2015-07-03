const assert = require('assert');

const Layer = require('../../es6/core/layer');
const Timeline = require('../../es6/core/timeline');
const LayerTimeContext = require('../../es6/core/layer-time-context');


describe('Timeline', function(){
    describe('Container registration and manipulation', function(){
        it('should create a container with the rights default width and height', function(){
            let titleDiv = document.createElement('div');
            titleDiv.innerHTML = this.test.title;
            document.body.appendChild(titleDiv);
            let timelineDiv = document.createElement("div");
            document.body.appendChild(timelineDiv);
            let timeline = new Timeline();
            timeline.registerContainer('foo', timelineDiv);
            const boundingClientRect = timeline.containers.foo.svgElement.getBoundingClientRect();
            assert.equal(boundingClientRect.width, 1000);
            assert.equal(boundingClientRect.height, 120);
            assert.equal(timeline.params.pixelsPerSecond, 100);
        });
        it('should create a container with the rights specified width and height based on timeline instanciation params', function(){
            let titleDiv = document.createElement('div');
            titleDiv.innerHTML = this.test.title;
            document.body.appendChild(titleDiv);
            let timelineDiv = document.createElement("div");
            document.body.appendChild(timelineDiv);
            let [pixelsPerSecond, containersWidth] = [10, 10]
            let timeline = new Timeline({pixelsPerSecond:pixelsPerSecond, containersWidth:containersWidth});
            timeline.registerContainer('foo', timelineDiv);
            const boundingClientRect = timeline.containers.foo.svgElement.getBoundingClientRect();
            assert.equal(boundingClientRect.width, containersWidth);
            assert.equal(timeline.params.pixelsPerSecond, pixelsPerSecond);
        });
        it('should getContainerPerElement from element', function(){
            let titleDiv = document.createElement('div');
            titleDiv.innerHTML = this.test.title;
            document.body.appendChild(titleDiv);
            let timelineDiv = document.createElement("div");
            document.body.appendChild(timelineDiv);
            let timeline = new Timeline();
            timeline.registerContainer('foo', timelineDiv);
            assert.equal(timeline.getContainerPerElement(timelineDiv).id, 'foo')
        })
    });
    describe('Global Timeline rendering options', function(){
        it('should set width of the timeline correctly', function(){
            let titleDiv = document.createElement('div');
            titleDiv.innerHTML = this.test.title;
            document.body.appendChild(titleDiv);
            let timelineDiv = document.createElement("div");
            document.body.appendChild(timelineDiv);
            let timeline = new Timeline();
            timeline.setContainersWidth(800)
            timeline.update();
            timeline.registerContainer('foo', timelineDiv);
            const boundingClientRect = timeline.containers.foo.svgElement.getBoundingClientRect();
            assert.equal(boundingClientRect.width, 800);
        })
    })
    describe('Manipulate layers inside a timeline', function(){
        it('should get the layer from getLayersFromGroup', function(){
            let titleDiv = document.createElement('div');
            titleDiv.innerHTML = this.test.title;
            document.body.appendChild(titleDiv);
            let timelineDiv = document.createElement("div");
            document.body.appendChild(timelineDiv);
            let timeline = new Timeline();
            timeline.registerContainer('foo', timelineDiv);
            let layer1 = {'name': 'layer1'};
            timeline.addLayer(layer1, 'foo', 'bar');
            assert.deepEqual(timeline.getLayersFromGroup('bar'), [layer1]);
        })
        it('should getContainer from layer', function(){
            let titleDiv = document.createElement('div');
            titleDiv.innerHTML = this.test.title;
            document.body.appendChild(titleDiv);
            let timelineDiv = document.createElement("div");
            document.body.appendChild(timelineDiv);
            let timeline = new Timeline();
            timeline.registerContainer('foo', timelineDiv);
            let layer1 = {'name': 'layer1'};
            timeline.addLayer(layer1, 'foo');
            assert.equal(timeline.getLayerContainer(layer1).id, 'foo')
        })
    })
    describe('Update the timeline timeContext', function(){
        it('should offset and stretch accordingly on its containers', function(){
            let titleDiv = document.createElement('div');
            titleDiv.innerHTML = this.test.title;
            document.body.appendChild(titleDiv);
            let timelineDiv = document.createElement("div");
            document.body.appendChild(timelineDiv);
            let timeline = new Timeline();
            timeline.registerContainer('foo', timelineDiv);
            // Offset
            timeline.timeContext.offset = 15;
            timeline.update();
            // Default timeline is 1000 px for 60 seconds duration
            // So 15 seconds offset containers should have 250 px offset
            //assert.equal(timeline.containers.foo.offsetElement.getAttribute('transform'), "translate(250, 0)") // the ugly way to test
            let transform = timeline.containers.foo.offsetElement.transform.baseVal
            let translate = transform[0]
            assert.equal(transform.length, 1) // Just a translate
            assert.equal(translate.type, 2) // To be sure it's a translate transformation
            let matrix = document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGMatrix();
            assert.deepEqual(matrix, translate.matrix.translate(-250, 0)) // offset was 250
            // Stretch
            timeline.timeContext.stretchRatio = 2;
            timeline.update();
            assert.equal(transform.length, 1) // Just a translate
            assert.equal(translate.type, 2) // To be sure it's a translate transformation
            assert.deepEqual(matrix, translate.matrix.translate(-500, 0)) // offset was 500px : 250px (offset) * 2 (ratio)
        })
        it('should udpate the offset and stretch the layers', function(){
            let titleDiv = document.createElement('div');
            titleDiv.innerHTML = this.test.title;
            document.body.appendChild(titleDiv);

            let timelineDiv = document.createElement("div");
            document.body.appendChild(timelineDiv);
            let timeline = new Timeline();
            timeline.registerContainer('foo', timelineDiv);

            // TimeContext
            let timeContext = new LayerTimeContext(timeline.timeContext)

            // Layer instanciation
            let layer = new Layer('collection', []);
            layer.setTimeContext(timeContext);
            layer.timeContext.duration = 12;

            // Attach layer to the timeline
            timeline.addLayer(layer, 'foo');
            timeline.render();
            timeline.draw();
            timeline.update();

            // Modify timeline timeContext
            timeline.timeContext.stretchRatio = 2;
            timeline.timeContext.offset = 15;
            timeline.update();

            // What should be done on the layer with this transformation
            // The offset don't need to affect the Layer
            // The stretchRatio should be applied to the layer
            const boundingClientRect = layer.boundingBox.getBoundingClientRect();
            // 12 s is 1200 px, and stretchRation of 2 => 2*1200
            assert.equal(boundingClientRect.width, 2400);

        })
    })
});
