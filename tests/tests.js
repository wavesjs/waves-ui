var assert = chai.assert;

describe("Test timeLine", function() {

    it('should keep graph id when passed to the factory', function(){
        // This is not only part of the get-set dependancy
        // as we are not forced to provide an id.
        var graph = timeLine({id:34});
        assert.equal(graph.id(), 34);
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

    it('should correctly draw', function(){
        var graph = timeLine().draw;
        d3.select('.timeline').call(graph);
        console.log(document.getElementsByClassName('timeline'));
    });
});
