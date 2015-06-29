const assert = require('assert');
const Layer = require('../../es6/core/layer');
const TimeContext = require('../../es6/core/time-context');
const Timeline = require('../../es6/core/timeline');

describe('Layer', function(){
  describe('Layer instanciation', function(){
    it('should create a layer and attach it to a DOM element of a timeline instance', function(){
        // Holder element for the timeline
        let timelineDiv = document.createElement("div");
        document.body.appendChild(timelineDiv);

        // Create a timeline
        let timeline = new Timeline();
        timeline.registerContainer('foo', timelineDiv);

        // TimeContext
        let timeContext = new TimeContext(timeline.timeContext)

        // Layer instanciation
        let layer = new Layer('collection', []);
        layer.setTimeContext(timeContext);
        layer.timeContext.duration = 12;

        // Attach layer to the timeline
        timeline.addLayer(layer, 'foo');
        timeline.render();
        timeline.draw();
        timeline.update();

        // Check that elements are correctly positioned
        // Timeline default duration is 60s and default width is 1000px
        // Layer duration context attribute is set to 12s
        // Layer default start context attribute is 0
        // so Layer width should be 12*1000/60 = 200
        const boundingClientRect = layer.boundingBox.getBoundingClientRect();
        assert.equal(boundingClientRect.width, 200);
        assert.equal(boundingClientRect.height, 100); // default value

        // setTimeout(function() {
        //   layer.setContextAttribute('start', 12);
        //   timeline.update();
        // }, 1000);
      });
  });
});

/*
describe('Layer', function() {
  describe('#contructor', function() {
    it('should create an instance with default `dataType`', function(done) {});
    it('should be instanciated according to given params', function(done) {});
    it('should have public and private properties', function(done) {});
  });

  describe('#data', function() {
    it('should return the `data` if used as a getter', function(done) {});
    it('should wrap the datum into an Array if `dataType` is `entity` when used as a setter', function(done) {});
  });

  describe('#initialize', function() {
    it('should create a properly instanciated context', function(done) {});
    it('should receive the parentContext as argument', function(done) {});
  });

  describe('#addLayer', function() {
    it('should register an `innreLayer` and initialize it', function(done) {});
  });

  // COMPONENT CREATION
  describe('#setShape', function() {});
  describe('#setCommonShape', function() {});
  describe('#setBehavior', function() {});

  // CONTEXT COMMANDS
  describe('#start', function() {
    it('should return the context `start` value when used as a getter', function(done) {});
    it('should set the context `start` value when used as a setter', function(done) {});
  });

  describe('#duration', function() {
    it('should return the context `duration` value when used as a getter', function(done) {});
    it('should set the context `duration` value when used as a setter', function(done) {});
  });

  describe('#offset', function() {
    it('should return the context `offset` value when used as a getter', function(done) {});
    it('should set the context `offset` value when used as a setter', function(done) {});
  });

  describe('#stretchRatio', function() {
    it('should return the context `stretchRatio` value when used as a getter', function(done) {});
    it('should set the context `stretchRatio` value when used as a setter', function(done) {});
  });

  describe('#yDomain', function() {
    it('should return the context `yDomain` value when used as a getter', function(done) {});
    it('should set the context `yDomain` value when used as a setter', function(done) {});
  });

  describe('#opacity', function() {
    it('should return the context `opacity` value when used as a getter', function(done) {});
    it('should set the context `opacity` value when used as a setter', function(done) {});
  });

  // HELPERS
  describe('#each - not implemented', function() {
    it('should call d3 each on `this.items`', function() {});
  });

  // INTERACTIONS
  describe('#_getItemFromDOMElement', function() {
    it('should return the closest `item` given a DOM element', function(done) {});
  });

  describe('#hasItem', function() {
    it('should define in a given DOM element belongs to an item of the layer', function(done) {});
  });

  describe('#getItemsInArea', function() {
    it('should return a copy of the `items` DOM elements present in the given area', function(done) {});
  });

  describe('#select - bad design API', function() {
    it('should call `behavior.select` on each given items', function(done) {});
  });

  describe('#unselect - bad design API', function() {
    it('should call `behavior.unselect` on each given item', function(done) {});
  });

  describe('#toggleSelection - bad design API', function() {
    it('should call `behavior.toggleSelection` on each given item', function(done) {});
  });

  describe('#selectAll', function() {
    it('should call `behavior.select` on all items', function(done) {});
  });

  describe('#unselectAll', function() {
    it('should call `behavior.unselect` on all items', function(done) {});
  });

  describe('#get:selectedItems', function() {
    it('should return the `behavior.selectedItems` as an Array', function(done) {});
  });

  describe('#edit - bad design API', function() {
    it('should call `behavior.edit` with proper parameters', function(done) {});
  });

  // DISPLAY / RENDERING
  describe('#render', function(done) {
    it('should call `render` on the context', function(done) {});
    it('should create a group to flip system coordinates', function(done) {});
    it('should call `innerLayer.render` method - remove ?', function(done) {});
    it('should return the context DOM element', function(done) {});
  });

  describe('#draw', function(done) {
    it('should create a unique id for each new datum', function(done) {});
    it('should create a d3 selection binded to the data', function(done) {});
    it('should render the registered common shapes', function(done) {});
    it('should apply the d3 enter pattern and create all the shapes', function(done) {});
    it('should apply the d3 exit pattern and destroy all the shapes', function(done) {});
    it('shoudl call `draw` on innerLayers', function(done) {});
  });

  describe('#update', function(done) {
    it('should call `updateContext` then `updateShapes`', function(done) {});
  });

  describe('#updateContext', function(done) {
    it('should call `context.update`', function(done) {});
    it('should call `updateContext` on each innerLayers', function(done) {});
  });

  describe('#updateShapes', function(done) {
    it('should update `commonShapes`', function(done) {});
    it('should update each `shape`', function(done) {});
    it('should call `updateShapes` on each innerLayers', function(done) {});
  });
});
*/
