'use strict';

var Layer = require('layer');
var { accessors, uniqueId } = require('utils');

class Marker extends Layer {

  constructor() {
    if (!(this instanceof Marker)) return new Marker();

    super();

    var defaults = {
      type: 'cursor',
      id: uniqueId(name),
      displayMark: true
    };

    this.params(defaults);
    this.width(1);
    this.color('#000000');
    this.opacity('0.7');
    this.data([{ x: 0 }]);

    this.x(function(d, v = null) {
      if (v !== null) { return d.x = parseFloat(v, 10); }
      return d.x
    })
  }

  xZoom() {
    this.update();
  }

  setCurrentTime(currentTime) {
    var x = this.x();

    if (!Array.isArray(currentTime)) {
      x(this.data()[0], currentTime);
    } else {
      this.data(currentTime);
    }

    // this.update();
    // this.draw();
    return this;
  }

  handleDrag(el, e) {
    this.move(el, e.originalEvent.dx, e.originalEvent.dy);
  }

  move(item, dx, dy) {
    item = this.d3.select(item);
    var datum = item.datum();

    var xScale = this.base.xScale;
    var xRange = xScale.range();
    var x = xScale(datum);
    var targetX = x + dx;

    if (targetX >= xRange[0] && targetX <= xRange[1]) {
      x = targetX;
    }

    datum = xScale.invert(x);
    item.datum(datum);
    // redraw element
    this.draw(item);
  }

  update(data = null) {
    if (data !== null && !Array.isArray(data)) { data = [data]; }
    super.update(data);

    this.items = this.g.selectAll('.' + this.param('unitClass'))
      .data(this.data());

    this.items.enter()
      .append('g')
      .classed('item', true)
      .classed(this.param('unitClass'), true);

    // console.log(this.items.data());
    var markHeight = 8;
    var height, y;

    if (this.param('displayMark')) {
      height = this.param('height') - markHeight;
      y = markHeight;
    } else {
      height = this.param('height');
      y = 0;
    }

    this.items.append('line')
      .style('stroke-width', this.width())
      .style('stroke', this.color())
      .style('opacity', this.opacity())
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', y)
      .attr('y2', height)

    if (this.param('displayMark')) {
      var area = this.d3.svg.area()
        .x(function(d) { return d; })
        .y0(0)
        .y1(markHeight);

      this.items.append('path')
        .attr('d', area([-3, 4]))
        .style('opacity', this.opacity())
        .style('fill', this.color());
    }

    this.items.exit().remove();
  }

  draw(el = null) {
    el = el || this.items;

    var xScale = this.base.xScale;
    var xAccessor = this.x();
    var x = (d) => { return xScale(xAccessor(d)); };

    el.attr('transform', (d) => {
      return 'translate(' + x(d) + ', 0)';
    });
  }
}

accessors.getFunction(Marker.prototype,
  ['color', 'opacity', 'width', 'x']
);

module.exports = Marker;
