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
import DotLayer from '../es6/helpers/dot-layer';
import MarkerLayer from '../es6/helpers/marker-layer';
import SegmentLayer from '../es6/helpers/segment-layer';
import Timeline from '../es6/core/timeline';
import View from '../es6/core/view';
import WaveformLayer from '../es6/helpers/waveform-layer';


describe("Simple test", function(){
  let titleDiv;
  let viewDiv;
  const audioContext = new AudioContext();

  beforeEach(function(){
    titleDiv = document.createElement('div');
    titleDiv.innerHTML = this.currentTest.title;
    document.body.appendChild(titleDiv);
    viewDiv = document.createElement("div");
    document.body.appendChild(viewDiv);
  })

  it('should just draw a simple timeline of segments', function(){
    const data = [{ width: 3, x: 0}, { width: 6, x: 6}];
    const timeline = new Timeline();
    const view = new View(viewDiv);
    const layer = new SegmentLayer(data);
    timeline.register(view);
    view.register(layer);
    timeline.render();
    timeline.update();
  })

  it('should just draw a simple timeline of markers', function(){
    const data = [{ x: 1 }, { x: 6}];
    const timeline = new Timeline();
    const view = new View(viewDiv);
    const layer = new MarkerLayer(data);
    timeline.register(view);
    view.register(layer);
    timeline.render();
    timeline.update();
  })

  it('should just draw a simple timeline of annotated markers', function(){
    const data = [{ x: 3, text:'foo' }, { x: 6, text:'bar' }];
    const timeline = new Timeline();
    const view = new View(viewDiv);
    const layer = new AnnotatedMarkerLayer(data);
    timeline.register(view);
    view.register(layer);
    timeline.render();
    timeline.update();
  })

  it('should just draw a simple timeline of dots', function(){
    const data = [
        { cx: 0, cy: 0 },
        { cx: 1, cy: 0.1 },
        { cx: 2, cy: 0.2 },
        { cx: 3, cy: 0.3 },
        { cx: 4, cy: 0.4 },
        { cx: 5, cy: 0.5 },
        { cx: 6, cy: 0.6 },
        { cx: 7, cy: 0.7 },
        { cx: 8, cy: 0.8 },
        { cx: 9, cy: 0.9 },
        { cx: 10, cy: 1.0 },
        { cx: 11, cy: 0.9 },
        { cx: 12, cy: 0.8 }
      ];
    const timeline = new Timeline();
    const view = new View(viewDiv);
    const layer = new DotLayer(data);
    timeline.register(view);
    view.register(layer);
    timeline.render();
    timeline.update();
  })

  it('should just draw a simple timeline with a waveform', function(){
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
      const timeline = new Timeline();
      const view = new View(viewDiv);
      const layer = new WaveformLayer(buffer, {color: 'red'});
      timeline.register(view);
      view.register(layer);
      timeline.render();
      timeline.update();
    })
  })
})

describe('Extended test', function(){
  let titleDiv;
  let viewDiv1;
  let viewDiv2;
  const audioContext = new AudioContext();

  beforeEach(function(){
    titleDiv = document.createElement('div');
    titleDiv.innerHTML = this.currentTest.title;
    document.body.appendChild(titleDiv);
    viewDiv1 = document.createElement("div");
    document.body.appendChild(viewDiv1);
    viewDiv2 = document.createElement("div");
    document.body.appendChild(viewDiv2);
  })

  it('should render a timeline with multiple views', function(){
    const timeline = new Timeline();

    const data1 = [{ width: 3, x: 0 }, { width: 6, x: 6}];
    const view1 = new View(viewDiv1);
    const layer1 = new SegmentLayer('collection', data1);

    const data2 = [{ x: 1 }, { x: 6}];
    const view2 = new View(viewDiv2);
    const layer2 = new MarkerLayer('collection', data2);

    timeline.register(view1);
    view1.register(layer1);

    timeline.register(view2);
    view2.register(layer2);

    timeline.render();
    timeline.update();

    view2.timeContext.stretchRatio = 2;
    view1.timeContext.stretchRatio = 0.5;
    view2.width = 2000;

    timeline.update();

  })
})
