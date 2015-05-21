var assert = chai.assert;

function triggerMouseEvent(target, type, dx, dy, btnPressed){
  var event = document.createEvent("MouseEvent");
  dx = dx || 0;
  dy = dy || 0;
  btnPressed = btnPressed || false;
  // initMouseEvent(type, bubbles, cancelable, windowObject, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget)
  event.initMouseEvent(type, true, true, window, 0, 0, 0, dx, dy, false, false, btnPressed, false, 0, null);
  target.dispatchEvent(event);
}

describe("Test timeLine", function() {

    it('should keep graph id when passed to the factory', function(){
        // This is not only part of the get-set dependancy
        // as we are not forced to provide an id.
        var graph = timeLine({id:42});
        assert.equal(graph.id(), 42);
    });

    it('should add layers', function(){
        var graph = timeLine();
        var layer1 = {
            name: function(){
                return 'layer1';
            }
        };
        var layer2 = {
            name: function(){
                return 'layer2';
            }
        };
        graph.layer(layer1);
        graph.layer(layer2);
        assert.deepEqual(graph.layers, {'layer1': layer1, 'layer2': layer2});
    });

    it('should correctly add the <svg>, add mouse event on it, and add the layout group <g> just below <svg>', function(){
        var graph = timeLine().width(300).height(400);
        d3.selectAll('.timeline').call(graph.draw);
        var target = graph.svg[0][0];
        assert.equal(document.getElementsByClassName('timeline').length, 2);
        assert.equal(target.tagName, "svg");
        assert.equal(target.getAttribute('width'), 300);
        assert.equal(target.getAttribute('height'), 400);

        graph.trigger = sinon.spy();
        console.log(graph.trigger);
        triggerMouseEvent(target, "mousedown");
        // graph.trigger.getCall(0); Could give more info about the trigger method called if needed
        assert.equal(graph.trigger.callCount, 1);
        triggerMouseEvent(target, "mouseup");
        assert.equal(graph.trigger.callCount, 2);

        var g = graph.svg[0][0].childNodes[0];
        assert.equal(g.tagName, 'g');
        assert.equal(g.getAttribute('class'), "layout");
        assert.equal(g.getAttribute('transform'), "translate(0,0)");
    });
});


describe('Timeline', function(){
    it('should create a Timeline instance with dom elements targets', function(){
        // domElements = document.querySelectorAll('.timelineElement');
        // timeline = new Timeline(domElements);
        // assert whatever this instance should create: svg and public variables.
    });
});

describe('Layer', function(){
    it('should create a layer and attach it to a DOM element of a timeline instance', function(){
        // Here we have to mock a timeline instance
        // domElementOfTimelineInstance = document.querySelector('.domElementOfTimelineInstance');
        // layer = new Layer(domElementOfTimelineInstance);
        // assert whatever this instance should create as svg and public variables.
    });
    it('should modify svg when modify xDomain', function(){
        // layer.xDomain = [3, 4]
        // assert that svg is rigth
        // Public variables remain unchanged right? as audio rendering should compute itself values
    });
    // Same for other public variables: xScale, yDomain, yRange
});

describe('Segment', function(){
    it('should render a segment item or collection', function(){
        // mock a layer instance (svg + variables)
        // segment = new Segment(datas);
        // layer.add(segment);
        // assert that segments are rendered in the DOM and public variables for segment are fine too.
    });
    // And programmatically move segments: left anchor, right anchor, all shape
    // on one or more segment (one or more may be abstracted)
});

describe('Waveform', function(){
    // Same as Segment
});

describe('Marker', function(){
    // Same as Segment
});

describe('Label', function(){
    // Same as Segment
});

describe('Breakpoint', function(){
    // Same as Segment + curve rendering?
});

describe('Cursor', function(){

});

describe('Zoom', function(){
    // Programmatically set a zoom property and check svg is well rendered.
});




