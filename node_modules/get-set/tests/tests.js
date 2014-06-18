
var assert = chai.assert;

var obj;

describe('getSet', function(){
  
  beforeEach(function(done){
    obj = {};
    var addAcc = getSet(obj);
    addAcc('width');

    done();
  });

  it('Should add a non enumerable variable', function(done) {
    assert(obj.hasOwnProperty('_width'), '_width is not set');
    assert(!obj.propertyIsEnumerable('_width'), '_width is enumerable');
    done();
  });

  it('Should add a public method', function(done) {
    assert(obj.hasOwnProperty('width'), 'property is not set');
    assert(obj.propertyIsEnumerable('width'), 'property is not enumerable');
    done();
  });

  it('Should manipulate the internal property', function(done) {
    obj.width(300);
    assert.equal(obj._width, 300, 'property is not set');
    done();
  });

  it('Should return the internal property', function(done) {
    obj.width(300);
    assert.equal(obj.width(), 300, 'property is not set');
    done();
  });

  it('Should work passing arrays too', function(done) {
    obj = {};
    var addAcc = getSet(obj);
    addAcc(['width','height']);

    assert(obj.hasOwnProperty('_width'), 'property is not set');
    assert(!obj.propertyIsEnumerable('_width'), 'property is enumerable');

    assert(obj.hasOwnProperty('_height'), 'property is not set');
    assert(!obj.propertyIsEnumerable('_height'), 'property is enumerable');
    done();
  });


});