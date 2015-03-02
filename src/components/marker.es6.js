'use strict';

var { uniqueId, accessors } = require('../helpers/utils');
var { Layer } = require('../core/layer');

class Marker extends Layer {

  constructor() {
    super();

    var defaults = {
      type: 'marker',
      id: uniqueId(name),
      displayHandle: true
    };

    this.params(defaults);
    this.width(1);
    this.color('#000000');
    this.opacity('0.7');
    this.data([{ x: 0 }]);

    this.x(function(d, v = null) {
      if (v === null) { return d.x; }
      d.x = parseFloat(v, 10);
    });
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
    var xAccessor = this.x();
    var x = xScale(xAccessor(datum));
    var targetX = x + dx;

    if (targetX >= xRange[0] && targetX <= xRange[1]) {
      x = targetX;
    }

    xAccessor(datum, xScale.invert(x));
    // redraw element
    this.draw(item);
  }

  update(data = null) {
    if (data !== null && !Array.isArray(data)) { data = [data]; }
    super.update(data);

    this.items = this.g.selectAll('.' + this.param('unitClass'))
      .data(this.data());

    var sel = this.items.enter()
      .append('g')
      .classed('item', true)
      .classed(this.param('unitClass'), true);

    var handleHeight = 8;
    var y = this.param('displayHandle') ? handleHeight : 0;

    sel.append('line')
      .style('stroke-width', this.width())
      .style('stroke', this.color())
      .style('opacity', this.opacity())
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', y)
      .attr('y2', this.param('height'));

    if (this.param('displayHandle')) {
      var area = this.d3.svg.area()
        .x(function(d) { return d; })
        .y0(0)
        .y1(handleHeight);

      sel.append('path')
        .attr('d', area([-4, 4]))
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

function factory() { return new Marker(); }
factory.Marker = Marker;

module.exports = factory;
