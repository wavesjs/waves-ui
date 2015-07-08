import assert from 'assert';

import Layer from '../../es6/core/layer';
import Timeline from '../../es6/core/timeline';
import LayerTimeContext from '../../es6/core/layer-time-context';


describe('Timeline', function(){
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

    describe('Containers registration and manipulation', function(){
        it('should create a container with the rights default width and height', function(){
            timeline = new Timeline();
            timeline.registerContainer(timelineDiv, {}, 'foo');
            const boundingClientRect = timeline.containers.foo.svgElement.getBoundingClientRect();

            assert.equal(boundingClientRect.width, 1000);
            assert.equal(boundingClientRect.height, 120);
            assert.equal(timeline.params.pixelsPerSecond, 100);
        });

        it('should create a container with the rights specified width and height based on timeline instanciation params', function(){
            let [pixelsPerSecond, containersWidth] = [10, 10]
            timeline = new Timeline({pixelsPerSecond:pixelsPerSecond, containersWidth:containersWidth});
            timeline.registerContainer(timelineDiv, {}, 'foo');
            const boundingClientRect = timeline.containers.foo.svgElement.getBoundingClientRect();

            assert.equal(boundingClientRect.width, containersWidth);
            assert.equal(timeline.params.pixelsPerSecond, pixelsPerSecond);
        });

        it('should getContainerFromDOMElement from element', function(){
            timeline = new Timeline();
            timeline.registerContainer(timelineDiv, {}, 'foo');

            assert.equal(timeline.getContainerFromDOMElement(timelineDiv).id, 'foo')
        })
    });
    describe('Global Timeline rendering options', function(){
        it('should set width of the timeline correctly', function(){
            timeline = new Timeline();
            timeline.setContainersWidth(800)
            timeline.update();
            timeline.registerContainer(timelineDiv, {}, 'foo');
            const boundingClientRect = timeline.containers.foo.svgElement.getBoundingClientRect();

            assert.equal(boundingClientRect.width, 800);
        })
    })
    describe('Manipulate layers inside a timeline', function(){
        it('should get the layer from getLayersFromGroup', function(){
            timeline = new Timeline();
            timeline.registerContainer(timelineDiv, {}, 'foo');
            let layer1 = new Layer('collection', []);
            timeline.addLayer(layer1, 'foo', 'bar');

            assert.deepEqual(timeline.getLayersFromGroup('bar'), [layer1]);
        })

        it('should getContainer from layer', function(){
            timeline = new Timeline();
            timeline.registerContainer(timelineDiv, {}, 'foo');
            let layer1 = new Layer('collection', []);
            timeline.addLayer(layer1, 'foo');

            assert.equal(timeline.getLayerContainer(layer1).id, 'foo')
        })
    })
    describe('Update the timeline timeContext', function(){
        it('should offset accordingly its containers', function(){
            timeline = new Timeline();
            timeline.registerContainer(timelineDiv, {}, 'foo');
            timeline.timeContext.offset = 15;
            timeline.update();
            // Default timeline is 1000 pixels for 60 seconds duration
            // So 15 seconds offset containers should have 250 px offset
            let transform = timeline.containers.foo.offsetElement.transform.baseVal
            let translate = transform[0]
            let matrix = document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGMatrix();

            assert.equal(transform.length, 1) // Just a translate
            assert.equal(translate.type, 2) // To be sure it's a translate transformation
            assert.deepEqual(matrix, translate.matrix.translate(-250, 0)) // offset was 250
        })

        it('should stretch accordingly its containers', function(){
            timeline = new Timeline();
            timeline.registerContainer(timelineDiv, {}, 'foo');
            timeline.timeContext.stretchRatio = 2;
            timeline.update();
            let matrix = document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGMatrix();
            let transform = timeline.containers.foo.offsetElement.transform.baseVal
            let translate = transform[0]

            assert.equal(transform.length, 1)  // Just a translate
            assert.equal(translate.type, 2)  // To be sure it's a translate transformation
            assert.deepEqual(matrix, translate.matrix.translate(-500, 0))  // Offset was 500px : 250px (offset) * 2 (ratio)
        })

        it('should udpate the offset and stretch the layers', function(){
            timeline = new Timeline();
            timeline.registerContainer(timelineDiv, {}, 'foo');
            let timeContext = new LayerTimeContext(timeline.timeContext)
            let layer = new Layer('collection', []);
            layer.setTimeContext(timeContext);
            layer.timeContext.duration = 12;
            timeline.addLayer(layer, 'foo');
            timeline.drawLayersShapes();
            timeline.update();
            timeline.timeContext.stretchRatio = 2;
            timeline.timeContext.offset = 15;
            timeline.update();
            // What should be done on the layer with this transformation
            // The offset don't need to affect the Layer
            // The stretchRatio should be applied to the layer
            const boundingClientRect = layer.boundingBox.getBoundingClientRect();

            // 12 seconds is 1200 pixels and stretchRation of 2 => 2*1200
            assert.equal(boundingClientRect.width, 2400);
        })
    })
});
