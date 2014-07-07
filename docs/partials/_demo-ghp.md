<link rel="stylesheet" href="css/style.css">
<div class="soom"></div>
<div class="timeline"></div>
<script src="//cdnjs.cloudflare.com/ajax/libs/d3/3.4.8/d3.min.js"></script>
<script src="//rawgit.com/Ircam-RnD/timeLine/master/timeLine.min.js"></script>
<script src="js/zoomer.min.js"></script>
<script src="//rawgit.com/Ircam-RnD/waveform-vis/master/buils/waveform-vis.min.js"></script>
<script>
  (function () {
  
  window.audioContext = window.audioContext || new AudioContext();

  // createBufferLoader()
  // .load('/'+ path + '/snd/mindbox.mp3').then(function(b) {
  //   loaded(b.getChannelData(0));
  // }, err, function(progress){});

  var request = new XMLHttpRequest();
  request.open("GET", 'snd/mindbox.mp3', true);
  request.responseType = "arraybuffer";
  request.addEventListener('load', function() {
     audioContext.decodeAudioData(this.response, function(b) {
        var bdata = b.getChannelData(0);
        bdata.sampleRate = b.sampleRate;
        bdata.duration = b.duration;
        loaded(bdata);
    }, function err(e){ console.error(e);});
  });
  request.send();

  function loaded(buffer) {

    var basexDomain = [0, buffer.duration * 1000];

    // Timeline
    // --------
    var graph = timeLine()
      .width(800)
      .height(150)
      // .data(model.data)
      .xDomain(basexDomain)
      .margin({top: 0, right: 0, bottom: 0, left: 0}); // segment editor layer

    // brush layer
    // ------------
    // var brush = brushVis().name('bruce');
    // graph.layer(brush);
    // // Brush interaction
    // brush.on('brush', function(extent) {
    //   // manually applying brush per layer
    //   // var ly = graph.layers['segments'];
    //   // if(ly.hasOwnProperty('brushItem')) ly.brushItem(extent, 'x');
    // })
    // .on('brushend', function(){
    //   this.clear();
    // });

    // segments layer
    // --------------
    // graph.layer(
    //   // segmentVis()
    //   segmentEdit()
    //   .xDomain(basexDomain)
    //   .dataView(model.view)
    //   .name('segments')
    //   // .top(15)
    //   .opacity(0.50));

    // waveform layer
    // --------------
    graph.layer(waveformVis()
      .name('waveform')
      .data(buffer)
      // .precision(2048)
      .precision(1024)
      // .precision(512) // samples per pixel
      // .precision(128)
      .xDomain(basexDomain)
      // .yDomain([-1, 1])
      .yDomain([1, -1])
      .color('#2980b9')
    );


    // Zoom behaviour/layer
    // ---------------------
    var zoomr = zoomer()
      .graph(graph)
      .on('mousemove', function(evt) {
        // sends evt {anchor: zx, factor: zFactor, delta: {x: deltaX, y: deltaY}}
        graph.xZoom(evt);
        d3.select('.xaxis').call(xAxis); // redraw axis
      })
      .on('mouseup', function(evt) {
        graph.xZoomSet();
        xAxis.scale(graph.xScale);
        d3.select('.xaxis').call(xAxis); // redraw axis
      });

    d3.select('.soom')
      .append('svg')
      .attr('width', 800)
      .attr('height', 30)
      .call(zoomr.draw);

    // draw
    // -----
    d3.select('.timeline').call(graph.draw);
  
    // axis for the zoom
    // ------------------
    var xAxis = d3.svg.axis()
      .scale(graph.xScale)
      .tickSize(1)
      .tickFormat(function(d){
        var date = new Date(d);
        var format = d3.time.format("%M:%S");
        return format(date);
      });

    d3.select('.soom svg')
      .append('g')
      .attr('class', 'xaxis')
      .attr("transform", "translate(0,0)")
      .attr('fill', '#555').call(xAxis);

    // // Data manipulation interactions
    // // ------------------------------

    // collection.on('add', function(e){
    //   seg.update();
    //   console.log('added', e.toJSON());
    // });

    // var rem;
    // collection.on('remove', function(e){
    //   console.log('rem');
    //   rem = e;
    //   seg.update();
    //   console.log('removed', e.toJSON());
    // });

  }

})();
</script>