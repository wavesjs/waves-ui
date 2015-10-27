const test = require('tape');

import TimelineTimeContext from '../../src/core/timeline-time-context';


test("TimelineTimeContext get default values", (assert) => {
    const timeContext = new TimelineTimeContext(100, 1000);
    assert.equal(timeContext.offset, 0, "Initial offset is 0");
    assert.equal(timeContext.pixelsPerSecond, 100, "Initial pixelsPerSecond is 0");
    assert.equal(timeContext.zoom, 1, "Initial zoom is 1");
    assert.equal(timeContext.visibleWidth, 1000, "Initial visibleWidth is 1000 pixels");
    assert.equal(timeContext.visibleDuration, 10, "Initial visibleDuration is 10 seconds");
    assert.equal(timeContext.maintainVisibleDuration, false, "Initial maintainVisibleDuration is false");
    assert.end();
});

test("TimelineTimeContext set values", (assert) => {
    const timeContext = new TimelineTimeContext(100, 1000);
    timeContext.pixelsPerSecond = 1000;
    assert.equal(timeContext.visibleDuration, 1, "visibleDuration is 1 second");
    assert.equal(timeContext.zoom, 1, "zoom is unchanged");
    timeContext.zoom = 2;
    assert.equal(timeContext.pixelsPerSecond, 1000, "pps is unchanged");
    assert.equal(timeContext.visibleDuration, 0.5, "0.5 seconds");
    assert.end();
});
