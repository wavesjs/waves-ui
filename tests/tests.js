// require('./core/timeline');
// require('./core/layer');
// require('./core/time-context');

// require('./shapes/marker');
// require('./shapes/segment');
// require('./shapes/dot');
// require('./shapes/annotated-marker');
// require('./shapes/trace-dots');

// require('./behaviors/time-context-behavior');
// require('./behaviors/marker-behavior');
// require('./behaviors/breakpoint-behavior');
// require('./behaviors/segment-behavior');
// require('./behaviors/trace-behavior');

import assert from 'assert';

import AnnotatedMarkerLayer from '../es6/helpers/annotated-marker-layer';
import CenteredZoomState from '../es6/timeline-states/centered-zoom-state';
import CursorLayer from '../es6/helpers/cursor-layer';
import DotLayer from '../es6/helpers/dot-layer';
import LayerTimeContext from '../es6/core/layer-time-context';
import MarkerLayer from '../es6/helpers/marker-layer';
import SegmentLayer from '../es6/helpers/segment-layer';
import Surface from '../es6/interactions/surface';
import Timeline from '../es6/core/timeline';
import Track from '../es6/core/track';
import WaveformLayer from '../es6/helpers/waveform-layer';


describe("Simple test", function(){
  let titleDiv;
  let trackDiv;
  const audioContext = new AudioContext();

  beforeEach(function(){
    titleDiv = document.createElement('div');
    titleDiv.innerHTML = this.currentTest.title;
    document.body.appendChild(titleDiv);
    trackDiv = document.createElement("div");
    document.body.appendChild(trackDiv);
  })

  // Possible tests for the surface
  // it('should test the surface on a div', function(){
  //   const surfaceDiv = document.createElement('div');
  //   surfaceDiv.style.backgroundColor = "red";
  //   surfaceDiv.style.width = "500px";
  //   surfaceDiv.style.height = "300px";
  //   document.body.appendChild(surfaceDiv);
  //   const s = new Surface(surfaceDiv);
  // })

  // it('should test the surface on a svg', function(){
  //   const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  //   svg.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');
  //   svg.setAttribute('width','500');
  //   svg.setAttribute('height','300');
  //   document.body.appendChild(svg);
  //   const s = new Surface(svg);
  // })

  it('should just draw a simple timeline of segments, markers, waveform', function(){
    function loadSample(url){
        return new Promise(function(resolve, reject){
            fetch(url)
            .then((response) => {
                return response.arrayBuffer()
            })
            .then((buffer) =>{
                audioContext.decodeAudioData(buffer, (decodedAudioData) =>{
                    resolve(decodedAudioData);
                });
            });
        });
    };

    loadSample('./assets/drum-loop.mp3').then(function(buffer){

      // Build the timeline

      const bufferDuration = buffer.duration;
      const beatDuration = bufferDuration/4
      const segments = [{width: 0.350, x: 0, color:'green'}, {width: 0.300, x: beatDuration, color:'yellow'}];
      const markers = [{x: 0, color:'#32465a'}, {x: beatDuration, color:'#32465a'}, {x: 2*beatDuration, color:'#32465a'}, { x: 3*beatDuration, color:'#32465a'}];

      const bd = [0.001, 1.757, 2.021];
      const sd = [0.877, 1.604, 2.606];

      const bassDrum = [{x: 0.001, color:'pink'}, {x: 1.757, color:'pink'}, {x: 2.021, color:'pink'}, {x: 2.458, color:'pink'}];
      const snareDrum = [{x: 0.877, color:'yellow'}, {x: 1.458, color:'yellow'}, {x: 1.604, color:'yellow'}, {x: 2.606, color:'yellow'}];

      const timeline = new Timeline(1000/buffer.duration);
      timeline.state = new CenteredZoomState(timeline);
      const sharedContext = new LayerTimeContext(timeline.timeContext);
      sharedContext.duration = buffer.duration;

      const track = timeline.createTrack(trackDiv);
      track.$background.setAttributeNS(null, 'style', 'fill:#232323')

      const markerLayer = new MarkerLayer(markers);
      markerLayer.setTimeContext(sharedContext);
      markerLayer.$background.setAttributeNS(null, 'style', 'fill:#263a4e')
      timeline.addLayer(markerLayer, track);

      const bassDrumLayer = new MarkerLayer(bassDrum);
      bassDrumLayer.setTimeContext(sharedContext);
      timeline.addLayer(bassDrumLayer, track);

      const snareDrumLayer = new MarkerLayer(snareDrum);
      snareDrumLayer.setTimeContext(sharedContext);
      timeline.addLayer(snareDrumLayer, track);

      // const segmentLayer = new SegmentLayer(segments);
      // segmentLayer.setTimeContext(sharedContext);
      // timeline.addLayer(segmentLayer, track);

      const waveformLayer = new WaveformLayer(buffer, {color: '#cce4ff'});
      waveformLayer.setTimeContext(sharedContext);
      timeline.addLayer(waveformLayer, track);

      const data = { currentPosition: 0 }
      const cursorLayer = new CursorLayer(data, { color: 'red' })
      cursorLayer.setTimeContext(sharedContext);
      timeline.addLayer(cursorLayer, track);

      timeline.tracks.render();
      timeline.tracks.update();

      // Build a player

      const audio = document.createElement("audio");
      audio.setAttribute('src', './assets/drum-loop.mp3');
      audio.setAttribute('controls', 'controls');
      audio.setAttribute('loop', 'loop');

      //document.body.appendChild(audio);

      (function loop() {
        requestAnimationFrame(loop);
        data.currentPosition = audio.currentTime;
        timeline.tracks.update(cursorLayer);
      }());

    })


   })

  // it('should just draw a simple timeline of markers', function(){
  //   const data = [{ x: 1 }, { x: 6}];
  //   const timeline = new Timeline();
  //   const view = new View(viewDiv);
  //   const layer = new MarkerLayer(data);
  //   timeline.register(view);
  //   view.register(layer);
  //   timeline.render();
  //   timeline.update();
  // })

  // it('should just draw a simple timeline of annotated markers', function(){
  //   const data = [{ x: 3, text:'foo' }, { x: 6, text:'bar' }];
  //   const timeline = new Timeline();
  //   const view = new View(viewDiv);
  //   const layer = new AnnotatedMarkerLayer(data);
  //   timeline.register(view);
  //   view.register(layer);
  //   timeline.render();
  //   timeline.update();
  // })

  // it('should just draw a simple timeline of dots', function(){
  //   const data = [
  //       { cx: 0, cy: 0 },
  //       { cx: 1, cy: 0.1 },
  //       { cx: 2, cy: 0.2 },
  //       { cx: 3, cy: 0.3 },
  //       { cx: 4, cy: 0.4 },
  //       { cx: 5, cy: 0.5 },
  //       { cx: 6, cy: 0.6 },
  //       { cx: 7, cy: 0.7 },
  //       { cx: 8, cy: 0.8 },
  //       { cx: 9, cy: 0.9 },
  //       { cx: 10, cy: 1.0 },
  //       { cx: 11, cy: 0.9 },
  //       { cx: 12, cy: 0.8 }
  //     ];
  //   const timeline = new Timeline();
  //   const view = new View(viewDiv);
  //   const layer = new DotLayer(data);
  //   timeline.register(view);
  //   view.register(layer);
  //   timeline.render();
  //   timeline.update();
  // })

  // it('should just draw a simple timeline with a waveform', function(){
    // function loadSample(url){
    //     return new Promise(function(resolve, reject){
    //         fetch(url)
    //         .then((response) => {
    //             return response.arrayBuffer()
    //         })
    //         .then((buffer) =>{
    //             audioContext.decodeAudioData(buffer, (decodedAudioData) =>{
    //                 resolve(decodedAudioData);
    //             });
    //         });
    //     });
    // };
    // loadSample('./assets/drum-loop.mp3').then(function(buffer){
    //   const timeline = new Timeline();
    //   const view = new View(viewDiv);
    //   const layer = new WaveformLayer(buffer, {color: 'red'});
    //   timeline.register(view);
    //   view.register(layer);
    //   timeline.render();
    //   timeline.update();
    // })
  // })
})

// describe('Extended test', function(){
//   let titleDiv;
//   let viewDiv1;
//   let viewDiv2;
//   const audioContext = new AudioContext();

//   beforeEach(function(){
//     titleDiv = document.createElement('div');
//     titleDiv.innerHTML = this.currentTest.title;
//     document.body.appendChild(titleDiv);
//     viewDiv1 = document.createElement("div");
//     document.body.appendChild(viewDiv1);
//     viewDiv2 = document.createElement("div");
//     document.body.appendChild(viewDiv2);
//   })

//   it('should render a timeline with multiple views', function(){
//     const timeline = new Timeline();

//     const data1 = [{ width: 3, x: 0 }, { width: 6, x: 6}];
//     const view1 = new View(viewDiv1);
//     const layer1 = new SegmentLayer('collection', data1);

//     const data2 = [{ x: 1 }, { x: 6}];
//     const view2 = new View(viewDiv2);
//     const layer2 = new MarkerLayer('collection', data2);

//     timeline.register(view1);
//     view1.register(layer1);

//     timeline.register(view2);
//     view2.register(layer2);

//     timeline.render();
//     timeline.update();

//     view2.timeContext.stretchRatio = 2;
//     view1.timeContext.stretchRatio = 0.5;
//     view2.width = 2000;

//     timeline.update();

//   })
// })
