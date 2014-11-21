var events    = require('events');
var getSet    = require('utils').getSet;
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
    // var anch = anchorVis().name('anch');
    // graph.layer(anch);
    // graph.draw(); // redraws

    sel.each(function() {
      var zx = 0;
      var zy = 0;
      var xponent = 1.005;
      var zoomerX;

      d3.select(this).on('mousedown', function() {
        zoomerX = this.getBoundingClientRect().left;
        zy = d3.event.pageY;
        // zx = d3.event.offsetX;
        zx = parseInt(d3.event.pageX - zoomerX, 10);

        // update position of the anchor on click
        // graph.layers['anch'].position(zx);

        document.body.classList.add('zooming');

        // mouseMove
        function mmove(evt) {
          if (evt.which === 1) {
            evt.preventDefault();

            var deltaY = zy - evt.pageY;
            var deltaX = zx - (parseInt(evt.pageX - zoomerX, 10));

            var zoomVal = Math.abs(deltaY);
            var zFactor = (deltaY > 0)? Math.pow(xponent, zoomVal) : 1 / Math.pow(xponent, zoomVal);
            var e = {anchor: zx, factor: zFactor, delta: {x: deltaX, y: deltaY}};
            that.trigger('mousemove', e);
          }
        }

        // mouseUp
        function mup() {
          document.body.removeEventListener('mousemove', mmove);
          document.body.removeEventListener('mouseup', mup);
          document.body.classList.remove('zooming');
          that.trigger('mouseup');
        }

        document.body.addEventListener('mousemove', mmove);
        document.body.addEventListener('mouseup', mup);

      });
    });

    return this;
  }
};

module.exports = Zoomer;

