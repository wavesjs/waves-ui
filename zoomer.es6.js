var events    = require('events');
var uniqueId  = require('utils').uniqueId;
var LayerVis  = require('layer-vis');
// var anchorVis = require('./anchor');
var pck       = require('./package.json');

class Zoomer extends LayerVis {

  constructor() {
    if (!(this instanceof Zoomer)) { return new Zoomer; }

    super();

    var name = pck.name.replace('-vis', '');

    var defaults = {
      type: name,
      id: uniqueId(name),
    };

    this.params(defaults);
    // add events ability
    var emitter = new events.EventEmitter();
    this.on = emitter.on;
    this.trigger = emitter.emit;
    // bind draw to `this`
    this.draw = this.draw.bind(this);
  }

  graph(timeline) {
    timeline.layer(this);
    return this;
  }

  draw(sel) {
    var graph = this.base; // that.graph();
    var d3 = this.d3;
    var that = this; // binding fix when called from d3

    sel.each(function() {
      var zx = 0;
      var zy = 0;
      var xponent = 1.005;
      var zoomerX;

      // mouseMove
      function onMouseMove(evt) {
        if (evt.which !== 1) { return; } 

        var deltaY = zy - evt.pageY;
        var deltaX = zx - (parseInt(evt.pageX - zoomerX, 10));

        var zoomVal = Math.abs(deltaY);
        var zFactor = (deltaY > 0)? Math.pow(xponent, zoomVal) : 1 / Math.pow(xponent, zoomVal);
        // update event object
        var e = {
          anchor: zx,
          factor: zFactor,
          delta: { x: deltaX, y: deltaY },
          originalEvent: evt // keep track of the original event
        }

        that.trigger('mousemove', e);
      }

      // mouseUp
      function onMouseUp(evt) {
        document.body.removeEventListener('mousemove', onMouseMove);
        document.body.removeEventListener('mouseup', onMouseUp);
        document.body.classList.remove('zooming');
        that.trigger('mouseup', evt);
      }

      d3.select(this).on('mousedown', function(evt) {
        zoomerX = this.getBoundingClientRect().left;
        zy = d3.event.pageY;
        zx = parseInt(d3.event.pageX - zoomerX, 10);

        // update position of the anchor on click
        // graph.layers['anch'].position(zx);
        var e = {
          anchor: zx,
          originalEvent: d3.event
        };
        
        that.trigger('mousedown', e);

        document.body.classList.add('zooming');
        document.body.addEventListener('mousemove', onMouseMove);
        document.body.addEventListener('mouseup', onMouseUp);
        document.body.addEventListener('mouseleave', onMouseUp);
      });
    });

    return this;
  }
};

module.exports = Zoomer;

