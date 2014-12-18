'use strict';

var renderingStrategies = {
  // canvas drawing strategy - performance isssues with foreign object 
  canvas: {
    update: function() {
      this.g.append('foreignObject')
        .attr('width', this.param('width'))
        .attr('height', this.param('height'))
        .append('xhtml:canvas')
          .attr('width', this.param('width'))
          .attr('height', this.param('height'))
          .classed(this.param('unitClass'), true);
    },

    draw: function(data) {
      var el = this.g.selectAll('.' + this.param('unitClass')).node();
      var ctx = this.ctx = this.ctx || el.getContext('2d');

      var width = ctx.canvas.width = this.param('width');
      var height = ctx.canvas.height = this.param('height');
      // var center = height / 2;
      var color = this.color();

      var length = data.length - 2;

      var _y = (d) => { return this.yScale(d) };
      var _x = (i) => { return this.base.xScale(this.xxScale(i)); }

      ctx.beginPath();
      ctx.strokeStyle = color();
      ctx.fillStyle   = color();
      // ctx.moveTo(0, center);

      for (var i = 0; i < length; i += 2) {
        var x = i / 2;
        var x1 = _x(i);
        var x2 = _x(i + 2);

        ctx.moveTo(x1, _y(data[i]));
        ctx.lineTo(x1, _y(data[i + 1]));
        ctx.lineTo(x2, _y(data[i + 3]));
        ctx.lineTo(x2, _y(data[i + 2]));
        ctx.lineTo(x1, _y(data[i]));
      }

      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  },

  svg: {
    update: function() {
      if (this.path) { return; }
      var color = this.color();

      this.path = this.g
        .append('path')
        .classed('item', true)
        .classed(this.param('unitClass'), true)
        .style('fill', color())
        .style('stroke', color())
        .style('shape-rendering', 'crispEdges');
    },

    draw: function(data) {
      var d3 = this.d3;
      var _y = (d) => { return this.yScale(d); }
      var _x = (i) => { return this.base.xScale(this.xxScale(i)); }

      var xRange = this.base.xScale.range();
      var currentX;

      this.area = d3.svg.area()
        .defined(function(d, i) {
          currentX = _x(i);
          return (currentX >= xRange[0] && currentX <= xRange[1]);
        })
        .x((d, i) => { return currentX; })
        .y0((d, i) => { return i % 2 === 0 ? _y(data[i]) : _y(data[i - 1]); })
        .y1((d, i) => { return i % 2 === 0 ? _y(data[i + 1]) : _y(data[i]); });

      var color = this.color();
      var pathStr = this.area(data);

      this.path.attr('d', pathStr);
      pathStr = undefined;
    }
  }
};

module.exports = renderingStrategies;
