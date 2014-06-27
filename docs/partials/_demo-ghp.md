##Demo

<div class="timeline"></div>

In this demo you can select one ( or multiple segments by holding shift) and move/resize them.  
You can <a class="keep-selection delete" name="delete">delete selected items</a> (<a href="#deleting">see below</a>).  
_Please not that the element that will call the delete action must have the css class of `.keep-selection` in order to keep the selection active_. 

<a class="keep-selection add" name="add">Adding elemts</a> is also easy (<a href="#deleting">see below</a>).  
_Note that this only adds one hardcoded segment to the timeline_.

<link rel="stylesheet" href="//rawgit.com/ircam-rnd/segment-edit/master/segment-edit.css">
<script src="//cdnjs.cloudflare.com/ajax/libs/d3/3.4.8/d3.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min.js"></script>
<script src="//rawgit.com/ircam-rnd/timeLine/master/timeLine.min.js"></script>
<script src="//rawgit.com/ircam-rnd/segment-edit/master/segment-edit.min.js"></script>
<script>
  var collection = new Backbone.Collection([{
    "begin": 0,
    "duration": 4,
    "color": "#414FBA"
  }, {
    "begin": 5,
    "duration": 7,
    "color": "#2A2E68"
  }, {
    "begin": 18,
    "duration": 9,
    "color": "#5A281E"
  }, {
    "begin": 30,
    "duration": 7,
    "color": "#BE7C7A"
  }, {
    "begin": 16,
    "duration": 6,
    "color": "#BE7C7A"
  }, {
    "begin": 8,
    "duration": 3,
    "color": "#2A2E68"
  }, {
    "begin": 1,
    "duration": 4,
    "color": "#C52599"
  }, {
    "begin": 63,
    "duration": 9,
    "color": "#CA56F4"
  }, {
    "begin": 90,
    "duration": 9,
    "color": "#5A281E"
  }, {
    "begin": 20,
    "duration": 6,
    "color": "#CA56F4"
  }]);

  // Sample dataView tells us how to access the data
  var view = {
    // tell d3 which is our key for sorting
    sortIndex: function(d) {
      return d.get('begin');
    },
     // how to retrieve or set the value used as the start of the segment
    start: function(d, v) {
      // no value, we retrieve
      if(!v) return +d.get('begin');
      // yesvalue we set :)
      d.set('begin', v);
    },
    // how to retrieve or set the value used as the duration of the segment
    duration: function(d, v) {
      if(!v) return +d.get('duration');
      d.set('duration', v);
    },
    // how to retrieve or set the value used for the color of the segment
    color: function(d, v) {
      if(!v) return d.get('color');
      d.set('color', v);
    }
  };

  document.addEventListener('DOMContentLoaded', function() {

    // Timeline
    // --------
    var graph = timeLine()
      .width(750)
      .height(150)
      .xDomain([0, 100]);

    // segments layer
    // --------------
    var seg = segmentEdit()
      .dataView(view)
      .data(collection.models)
      .name('segments')
      .opacity(0.5);

    graph.layer(seg);
    d3.select('.timeline').call(graph.draw);

    function deleteSelected() {
      // find selected segments and delete each of them from the collection
      var selected = d3.selectAll('.layout .selected');
      selected.each(function(segment){
        collection.remove(segment);
      });
      // pass again the modified data and call update
      seg.data(collection.models);
      graph.update();
    }

    function addSegment() {
      // add one segment to the collection
      collection.add({
        "begin": 40,
        "duration": 10,
        "color": "#174345"
      });
      // pass again the modified data and call update
      seg.data(collection.models);
      graph.update();
    }

    document.querySelector('.add').addEventListener('click', addSegment);
    document.querySelector('.delete').addEventListener('click', deleteSelected);
  });
</script>