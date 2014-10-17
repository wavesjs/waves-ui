var SegmentVis   = require('segment-vis');
var makeEditable = require('make-editable');
// var getSet       = require('utils').getSet;
// problem when transpiling if not importing d3
var d3           = require('d3-browserify');


class SegmentEdit extends SegmentVis {

  constructor() {
    if (!(this instanceof SegmentEdit)) return new SegmentEdit;

    super();
    // define editable properties - in params
    // this.edits(['x', 'y', 'width', 'height']);
    this.param('edits', ['x', 'y', 'width', 'height']);
  }

  // logic performed to select an item from the brush
  brushItem(extent, mode) {
    mode = mode || 'xy'; // default tries to match both

    var modeX = mode.indexOf('x') >= 0;
    var modeY = mode.indexOf('y') >= 0;
    var matchX = false, matchY = false;

    // data mappers
    var _start = this.start();
    var _duration = this.duration();
    var _y = this.y();
    var _height = this.height();

    this.g.selectAll('.selectable').classed('selected', function(d, i) {

      // var offsetTop = (that.top() || 0) + (that.base.margin().top || 0);
      // var offsetLeft = (that.left || 0) + (that.base.margin().left || 0);

      // X match
      if (modeX) {
        var x1 = _start(d);
        var x2 = x1 + _duration(d);

        //            begining sel               end sel
        var matchX1 = extent[0][0] <= x1 && x2 < extent[1][0];
        var matchX2 = extent[0][0] <= x2 && x1 < extent[1][0];

        matchX = (matchX1 || matchX2);
      } else {
        matchX = true;
      }

      // Y match
      if (modeY) {
        var y1 = _y(d);
        var y2 = y1 + _height(d);
        //            begining sel               end sel
        var matchY1 = extent[0][1] <= y1 && y2 < extent[1][1];
        var matchY2 = extent[0][1] <= y2 && y1 <= extent[1][1];
        matchY = (matchY1 || matchY2);
      } else {
        matchY = true;
      }

      return matchX && matchY;
    });
  }

  // checks if the clicked item is one of our guys
  clicked(item) {
    return item.classList.contains('seg') || item.tagName === 'line';
  }

  // mouse drag ev switcher depending on drag (left|right|block) levels
  onDrag(e) {
    if (!this.base.brushing()) {
      var classes = e.dragged.classList;

      var mode = 'mv';
      if (classes.contains('left') > 0) mode = 'l';
      if (classes.contains('right') > 0) mode = 'r';
      this.handleDrag.call(this, mode, e);
    }
  }

  // handles all the dragging possibilities
  handleDrag(mode, res) {
    var d = res.d;
    var delta = res.event;
    var item = res.target;
    // var minDur = 0.001; // not used
    var xScale = this.base.xScale;

    // var constrains = this.edits();
    var constrains = this.param('edits');
    var canX = !!~constrains.indexOf('x');
    var canY = !!~constrains.indexOf('y');
    var canW = !!~constrains.indexOf('width');
    var canH = !!~constrains.indexOf('height');

    // data mappers
    var _start = this.start();
    var _duration = this.duration();
    var _y = this.y();

    // has to be the svg because the group is virtually not there :(
    if (mode === 'l' || mode === 'r') {
      this.base.svg.classed('handle-resize', true);
    } else {
      this.base.svg.classed('handle-drag', true);
    }

    var duration = xScale(_duration(d));
    var begin = xScale(_start(d));

    if (mode === 'l' && canW) duration -= delta.dx; // px
    if (mode === 'r' && canW) duration += delta.dx; // px

    // apply duration when editing through the handles
    if ((mode === 'l' || mode === 'r') && canW) {
        _duration(d, xScale.invert(duration));
    }

    // update positions
    if (mode === 'l' || mode === 'mv') {
      if (mode === 'l' && canW ||  mode === 'mv' && canX){
        begin += delta.dx;
        _start(d, xScale.invert(begin));
      }

      if (mode === 'mv' && canY) {
        var y = this.yScale(_y(d));
        y += delta.dy;
        _y(d, this.yScale.invert(y));
      }
    }

    // console.log(item);
    // redraw visualization
    this.draw(d3.select(item));
  }
}

// add a getter/setter for edition behavior - in params now ?
// getSet(SegmentEdit.prototype, ['edits']);
// make editable decorator/mixin
makeEditable(SegmentEdit.prototype);

module.exports = SegmentEdit;