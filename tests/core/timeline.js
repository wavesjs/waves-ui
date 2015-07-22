const test = require('tape');

import Timeline from '../../es6/core/timeline';


test('Create a track from the timeline', (assert) => {
    const timelineDiv = document.createElement("div");
    document.body.appendChild(timelineDiv);
    const timeline = new Timeline();
    const track = timeline.createTrack(timelineDiv);
    assert.end();
})

test('Timeline timecontext default values', (assert) => {
    const timeline = new Timeline();
    assert.equal(timeline.offset, 0, "Initial offset is 0");
    assert.equal(timeline.zoom, 1, "Initial zoom is 1");
    assert.equal(timeline.pixelsPerSecond, 100, "Initial offset is 100");
    assert.equal(timeline.visibleWidth, 1000, "Initial offset is 1000");
    assert.end();
})
