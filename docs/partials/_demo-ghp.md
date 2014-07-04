##Demo

<div class="timeline"></div>

This demo shows a simple segmented data visualization.

<script src="//cdnjs.cloudflare.com/ajax/libs/d3/3.4.8/d3.min.js"></script>
<script src="//rawgit.com/ircam-rnd/segment-vis/master/segment-vis.min.js"></script>
<script src="//rawgit.com/ircam-rnd/timeLine/master/timeLine.min.js"></script>
<script>
  var data = [{
                  "start": 0,
                  "duration": 4,
                  "color": "#414FBA"
                }, {
                  "start": 5,
                  "duration": 7,
                  "color": "#2A2E68"
                }, {
                  "start": 18,
                  "duration": 9,
                  "color": "#5A281E"
                }, {
                  "start": 30,
                  "duration": 7,
                  "color": "#BE7C7A"
                }, {
                  "start": 16,
                  "duration": 6,
                  "color": "#BE7C7A"
                }, {
                  "start": 8,
                  "duration": 3,
                  "color": "#2A2E68"
                }, {
                  "start": 1,
                  "duration": 4,
                  "color": "#C52599"
                }, {
                  "start": 63,
                  "duration": 9,
                  "color": "#CA56F4"
                }, {
                  "start": 90,
                  "duration": 9,
                  "color": "#5A281E"
                }, {
                  "start": 20,
                  "duration": 6,
                  "color": "#CA56F4"
                }];

  document.addEventListener('DOMContentLoaded', function() {
    
    document.querySelector('.timeline').innerHTML = '';
    
    // Timeline
    // --------
    var graph = timeLine()
      .width(750)
      .height(150)
      .xDomain([0, 100]);

    // segments layer
    // --------------
    graph.layer(
      segmentVis()
      .data(data)
      .name('segments')
      .opacity(0.5));

    d3.select('.timeline').call(graph.draw);

    });
</script>