const assert = require('assert');
const Timeline = require('../../es6/core/timeline');

describe('Timeline', function(){
    describe('Container registration', function(){
        it('should create a container with the rights width and height', function(){
            let timelineDiv = document.createElement("div");
            document.body.appendChild(timelineDiv);
            let timeline = new Timeline();
            timeline.registerContainer('foo', timelineDiv);
            const boundingClientRect = timeline.containers.foo.svgElement.getBoundingClientRect();
            assert.equal(boundingClientRect.width, 1000);
            assert.equal(boundingClientRect.height, 120);
        });
    });
});
