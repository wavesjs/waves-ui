const assert = require('assert');
const Timeline = require('../../es6/core/timeline');

describe('Timeline', function(){
    describe('Container registration and manipulation', function(){
        it('should create a container with the rights default width and height', function(){
            let timelineDiv = document.createElement("div");
            document.body.appendChild(timelineDiv);
            let timeline = new Timeline();
            timeline.registerContainer('foo', timelineDiv);
            const boundingClientRect = timeline.containers.foo.svgElement.getBoundingClientRect();
            assert.equal(boundingClientRect.width, 1000);
            assert.equal(boundingClientRect.height, 120);
            assert.equal(timeline.params.duration, 60);
        });
        it('should create a container with the rights specified width and height based on timeline instanciation params', function(){
            let timelineDiv = document.createElement("div");
            document.body.appendChild(timelineDiv);
            let [width, duration] = [10, 10]
            let timeline = new Timeline({width:width, duration:duration});
            timeline.registerContainer('foo', timelineDiv);
            const boundingClientRect = timeline.containers.foo.svgElement.getBoundingClientRect();
            assert.equal(boundingClientRect.width, width);
            assert.equal(timeline.params.duration, duration);
        });
        it('should getContainerPerElement from element', function(){
            let timelineDiv = document.createElement("div");
            document.body.appendChild(timelineDiv);
            let timeline = new Timeline();
            timeline.registerContainer('foo', timelineDiv);
            assert.equal(timeline.getContainerPerElement(timelineDiv).id, 'foo')
        })
    });
    describe('Global Timeline rendering options', function(){
        it('should set width of the timeline correctly', function(){
            let timelineDiv = document.createElement("div");
            document.body.appendChild(timelineDiv);
            let timeline = new Timeline();
            timeline.width = 800
            timeline.update();
            timeline.registerContainer('foo', timelineDiv);
            const boundingClientRect = timeline.containers.foo.svgElement.getBoundingClientRect();
            assert.equal(boundingClientRect.width, 800);
        })
    })
    describe('Manipulate layers inside a timeline', function(){
        it('should get the layer from getGroup', function(){
            let timelineDiv = document.createElement("div");
            document.body.appendChild(timelineDiv);
            let timeline = new Timeline();
            timeline.registerContainer('foo', timelineDiv);
            let layer1 = {'name': 'layer1'};
            timeline.addLayer(layer1, 'foo', 'bar');
            assert.deepEqual(timeline.getGroup('bar'), [layer1]);
        })
        it('should getContainer from layer', function(){
            let timelineDiv = document.createElement("div");
            document.body.appendChild(timelineDiv);
            let timeline = new Timeline();
            timeline.registerContainer('foo', timelineDiv);
            let layer1 = {'name': 'layer1'};
            timeline.addLayer(layer1, 'foo');
            assert.equal(timeline.getLayerContainer(layer1).id, 'foo')
        })
    })
});
