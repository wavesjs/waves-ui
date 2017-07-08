const test = require('tape');

import Layer from '../../src/core/layer';
import TrackCollection from '../../src/core/track-collection';
import Timeline from '../../src/core/timeline';


test('TrackCollection methods', (assert) => {
    // Miss test for layerOrGroup in functions call
    const trackDiv = document.createElement("div");
    document.body.appendChild(trackDiv);
    const timeline = new Timeline();
    const track = timeline.createTrack(trackDiv);
    const layer = new Layer('collection', []);
    timeline.addLayer(layer, track);

    const trackCollection = timeline.tracks
    trackCollection.height = 150;
    for (let track of timeline){
        assert.equal(track.height, 150)
    }
    assert.deepEqual(trackCollection.layers, [layer])

    timeline.once('update', (e) => {
        assert.ok(true, 'update event is emitted')
    })
    trackCollection.update()

    timeline.once('update:containers', (e) => {
        assert.ok(true, 'update:containers event is emitted')
    })
    trackCollection.updateContainer()

    timeline.once('update:layers', (e) => {
        assert.ok(true, 'update:layers event is emitted')
    })
    trackCollection.updateLayers()

    timeline.once('render', (e) => {
        assert.ok(true, 'render event is emitted')
    })
    trackCollection.render()

    assert.end()
})
