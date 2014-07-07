var getSet = require('get-set');

var anchor = {};

Object.defineProperty(anchor, 'dname', { writable: true });
Object.defineProperty(anchor, 'xBaseDomain', { writable: true });
Object.defineProperty(anchor, 'yScale', { writable: true });
Object.defineProperty(anchor, 'base', { writable: true });
Object.defineProperty(anchor, 'g', { writable: true });

Object.defineProperty(anchor, 'on', { enumerable: true, writable: true});
Object.defineProperty(anchor, 'trigger', {writable: true});

Object.defineProperty(anchor, 'init', {
  value: function(options) {

    getSet(this)(['name']);
    return this;
  }
});

Object.defineProperty(anchor, 'load', {
  enumerable: true, value: function(base){
    this.base = base; // bind the baseTimeLine
    this.on = base.on;
    this.trigger = base.trigger;
    this.unitClass = this.name() + '-item';
  }
});

Object.defineProperty(anchor, 'bind', {
  enumerable: true, value: function(g) {
    this.g = g;
    this.update();
  }
});

Object.defineProperty(anchor, 'position', {
  enumerable: true, value: function(pos) {
    if (!arguments.length) return this._position;
    this._position = this.base.xScale.invert(pos);
    this.update();
  }
});

Object.defineProperty(anchor, 'update', {
  enumerable: true, value: function() {
    var that = this;
    var el = this.base.el;
    var p = function(d) {
      return that.base.xScale(d) || 0;
    };

    var sel = this.g.selectAll('.' + this.unitClass)
      .data([this.position()]);
    
    sel.enter()
        .append("line")
        .classed(this.unitClass, true)
        .style("stroke-width", 1)
        .style("stroke", '#f00')
        .attr("x1", p)
        .attr("x2", p)
        .attr("y1", 0)
        .attr("y2", this.base.height());

    sel.exit().remove();
    this.draw();
  }
});


 Object.defineProperty(anchor, 'xZoom', {
  enumerable: true, value: function(val) {
    this.draw();
  }
});

Object.defineProperty(anchor, 'draw', {
  enumerable: true, configurable: true, value: function(el) {
    el = el || this.g.selectAll('.' + this.unitClass);
    var that = this;

    var p = function(d) {
      return that.base.xScale(d) || 0;
    };

    el
      .attr("x1", p)
      .attr("x2", p);
  }
});

module.exports = function(options) {
  return Object.create(anchor.init());
};