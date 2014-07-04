##Demo

In this demo you can select one ( or multiple points by holding shift) and move them across the timeline.

<div class="soom"></div>
<div class="timeline"></div>

<script src="//cdnjs.cloudflare.com/ajax/libs/d3/3.4.8/d3.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.backbone.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min.js"></script>
<script src="//rawgit.com/ircam-rnd/timeLine/master/timeLine.min.js"></script>
<script src="//rawgit.com/ircam-rnd/breakpoint-edit/master/build/breakpoint-edit.js"></script>
<script src="js/zoomer.min.js"></script>
<link rel="stylesheet" href="css/style.css">
<script>
  var radius = 5;
  var color = 'lightblue';
  var data = [
    {
      cx: 43,
      cy: 67,
      r: radius,
      color: 'green'
    },
    {
      cx: 50,
      cy: 250,
      r: radius,
      // color: color
    },
    {
      cx: 90,
      cy: 170,
      r: radius,
      // color: color
    },
    {
      cx: 200,
      cy: 250,
      r: radius,
      // color: color
    },
    {
      cx: 300,
      cy: 320,
      r: radius,
      // color: color
    },
    {
      cx: 340,
      cy: 150,
      r: radius,
      // color: color
    }
  ];

  var collection = new Backbone.Collection(data);

  var bkpView = {
    cx: function(d, v) {
      if(!v) return +d.get('cx') || 0;
      d.set('cx', (+v));
    },
    cy: function(d, v) {
      if(!v) return +d.get('cy') || 1;
      d.set('cy', (+v));
    },
    r: function(d, v) {
      if(!v) return +d.get('r') || 5;
      d.set('r', (+v));
    }
  };

  document.addEventListener('DOMContentLoaded', function() {
  
    // Timeline
    // --------
    var graph = timeLine()
      .width(750)
      .height(150)
      .xDomain([0, 350])
      .yDomain([0, 350]);

    // breakpoints layer
    // ----------------
    var bkp = breakpointEdit()
      .data(collection.models)
      .dataView(bkpView)
      .name('breakpoints')
      .lineColor(color)
      .color('red')
      .interpolate('linear')
      .opacity(1);

    // we add layers
    graph.layer(bkp);
  
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
    // we pass in the drawing method from our timeline object
    d3.select('.timeline').call(graph.draw);

    // axis for the zoom
    // ------------------
    var xAxis = d3.svg.axis()
      .scale(graph.xScale)
      .tickSize(1)
      // .tickFormat(function(d){
      //   var date = new Date(d);
      //   var format = d3.time.format("%M:%S");
      //   return format(date);
      // });

    d3.select('.soom svg')
      .append('g')
      .attr('class', 'xaxis')
      .attr("transform", "translate(0,0)")
      .attr('fill', '#555').call(xAxis);

  });
</script>