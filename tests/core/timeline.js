const assert = require('assert');
const Timeline = require('../../es6/core/timeline');

describe('Timeline', function(){
    describe('Container registration', function(){
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
});
