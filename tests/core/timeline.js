const test = require('tape');

import Layer from '../../src/core/layer';
import Timeline from '../../src/core/timeline';
import Track from '../../src/core/track';


test('Timeline get default window view values over tracks', (assert) => {
    const timeline = new Timeline();
    assert.equal(timeline.offset, 0, "Initial offset is 0");
    assert.equal(timeline.zoom, 1, "Initial zoom is 1");
    assert.equal(timeline.pixelsPerSecond, 100, "Initial pixelsPerSecond is 100");
    assert.equal(timeline.visibleWidth, 1000, "Initial visibleWidth is 1000");
    assert.equal(timeline.visibleDuration, 10, "Initial visibleDuration is 10 seconds");
    assert.end();
});

test('Timeline set window view values over tracks', (assert) => {
    const timeline = new Timeline();
    timeline.offset = 10;
    timeline.zoom = 2;
    timeline.pixelsPerSecond = 200;
    timeline.visibleWidth = 2000;
    assert.equal(timeline.offset, 10, "Offset is set to 10 seconds");
    assert.equal(timeline.zoom, 2, "Zoom is set to 1");
    assert.equal(timeline.pixelsPerSecond, 200, "pixelsPerSecond is set to 200");
    assert.equal(timeline.visibleWidth, 2000, "visibleWidth is set to 2000");
    assert.end();
});

test('Create a track from the timeline', (assert) => {
    const timelineDiv = document.createElement("div");
    document.body.appendChild(timelineDiv);
    const timeline = new Timeline();
    const track = timeline.createTrack(timelineDiv);
    assert.equal(timeline.tracks.length, 1, "Timeline has one track")
    assert.deepEqual(track, timeline.tracks[0], "The timeline track is the one just added");
    timeline.tracks.update();  // Needed to update the timeline with the added track
    const boundingClientRect = track.$svg.getBoundingClientRect();
    assert.equal(boundingClientRect.width, timeline.visibleWidth);
    assert.equal(boundingClientRect.height, 100);
    assert.end();
});

test('Add a track from the timeline', (assert) => {
    const timelineDiv = document.createElement("div");
    document.body.appendChild(timelineDiv);
    const timeline = new Timeline();
    const track = timeline.createTrack(timelineDiv);
    assert.throws(()=>{timeline.add(track)}, "Can't add a track already added to the timeline");
    const timelineDiv2 = document.createElement("div");
    document.body.appendChild(timelineDiv2);
    const track2 = new Track(timelineDiv2);
    timeline.add(track2);
    assert.equal(timeline.tracks.length, 2, "Timeline has two tracks")
    assert.deepEqual(track2, timeline.tracks[1], "The timeline second track is the one just added");
    assert.end();
});

test('Add a layer to a track from the timeline, and remove it', (assert) => {
    const timelineDiv = document.createElement("div");
    document.body.appendChild(timelineDiv);
    const timeline = new Timeline();
    const track = timeline.createTrack(timelineDiv);
    const layer = new Layer('collection', []);
    timeline.addLayer(layer, track);
    assert.deepEqual(timeline.layers, timeline.tracks.layers);
    assert.equal(timeline.tracks.layers.length, 1, "The entire timeline has one, and just one layer");
    assert.equal(timeline.tracks[0].layers.length, 1, "The track we created contains one layer");
    assert.deepEqual(timeline.tracks[0].layers[0], layer, "The track layer is the right one");
    timeline.removeLayer(layer);
    assert.equal(timeline.tracks.layers.length, 0, "The entire timeline has no more layers");
    assert.equal(timeline.tracks[0].layers.length, 0, "The track we created doesn't contain any layer");

    const timelineDiv2 = document.createElement("div");
    document.body.appendChild(timelineDiv2);
    const trackWithId = timeline.createTrack(timelineDiv2, 100, 'trackId');
    const layerOnTrackWithId = new Layer('collection', []);
    const layerOnTrackWithId2 = new Layer('collection', []);
    timeline.addLayer(layerOnTrackWithId, 'trackId', 'layerGroup');
    timeline.addLayer(layerOnTrackWithId2, 'trackId', 'layerGroup');
    assert.deepEqual(trackWithId, timeline.getTrackById('trackId'), 'We can retrieve a track with a specific id');
    assert.deepEqual([layerOnTrackWithId, layerOnTrackWithId2], timeline.getLayersByGroup('layerGroup'), "We can get all the layers that belong to a certain group")
    assert.deepEqual({'layerGroup': [layerOnTrackWithId, layerOnTrackWithId2]}, timeline.groupedLayers, "We can get all groupedLayers");

    const timelineDiv3 = document.createElement("div");
    document.body.appendChild(timelineDiv3);
    assert.throws(()=>{timeline.createTrack(timelineDiv, 100, 'trackId')}, "Can't add a track with a trackId already added");
    assert.end();
});
