const assert = require('assert');
const TimeContext = require('../../es6/core/time-context');
const d3Scale = require('d3-scale');

describe('TimeContext', function(){
    describe('instanciation, getters and setters', function(){
        it('should get and set xScale correctly', function(){
            let parentTimeContext = new TimeContext();
            let childTimeContext1 = new TimeContext(parentTimeContext);
            let childTimeContext2 = new TimeContext(parentTimeContext);
            childTimeContext2.xScale = 'foo-function';
            assert.equal(parentTimeContext.xScale, null);
            assert.equal(childTimeContext1.xScale, null);
            assert.equal(childTimeContext2.xScale, 'foo-function');
            parentTimeContext.xScale = 'bar-function'
            assert.equal(parentTimeContext.xScale, 'bar-function');
            assert.equal(childTimeContext1.xScale, 'bar-function');
            assert.equal(childTimeContext2.xScale, 'foo-function');
        })
        it('should get correct stretchratio', function(){
            let parentTimeContext = new TimeContext();
            assert.equal(parentTimeContext.stretchRatio, 1);
        })
    })
})
