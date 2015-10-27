const test = require('tape');

import LayerTimeContext from '../../src/core/layer-time-context';
import TimelineTimeContext from '../../src/core/timeline-time-context';


test("LayerTimeContext get default values", (assert) => {
    const timelineTimeContext = new TimelineTimeContext(100, 1000);
    const layerTimeContext = new LayerTimeContext(timelineTimeContext);
    assert.equal(layerTimeContext.start, 0, "Default layerTimeContext startis 0 second");
    assert.equal(layerTimeContext.duration, 10, "Default layerTimeContext start is 10 seconds");
    assert.equal(layerTimeContext.offset, 0, "Default layerTimeContext offset 0 seconds");
    assert.equal(layerTimeContext.stretchRatio , 1, "Default stretchRatio is 1");
    assert.end();
})
