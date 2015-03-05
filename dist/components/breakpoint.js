"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _require = require("../helpers/utils");

var uniqueId = _require.uniqueId;
var accessors = _require.accessors;

var _require2 = require("../core/layer");

var Layer = _require2.Layer;

var Breakpoint = (function (Layer) {
  function Breakpoint() {
    _babelHelpers.classCallCheck(this, Breakpoint);

    _babelHelpers.get(_core.Object.getPrototypeOf(Breakpoint.prototype), "constructor", this).call(this);

    var defaults = {
      type: "breakpoint",
      id: uniqueId(name),
      opacity: 1,
      color: "#000000",
      lineColor: "#000000",
      displayLine: true,
      radius: 3,
      interpolate: "linear"
    };

    this.params(defaults);

    this.cx(function (d) {
      var v = arguments[1] === undefined ? null : arguments[1];

      if (v === null) return +d.cx;
      d.cx = +v;
    });

    this.cy(function (d) {
      var v = arguments[1] === undefined ? null : arguments[1];

      if (v === null) return +d.cy;
      d.cy = +v;
    });

    this.r(function (d) {
      var v = arguments[1] === undefined ? null : arguments[1];

      if (v === null) return +d.r;
      d.r = +v;
    });

    this.opacity(function (d) {
      var v = arguments[1] === undefined ? null : arguments[1];

      if (v === null) return +d.opacity;
      d.opacity = +v;
    });

    this.color(function (d) {
      var v = arguments[1] === undefined ? null : arguments[1];

      if (v === null) return d.color;
      d.color = v + "";
    });
  }

  _babelHelpers.inherits(Breakpoint, Layer);

  _babelHelpers.prototypeProperties(Breakpoint, null, {
    sortData: {

      // keep breakpoints coherent in time axis

      value: function sortData() {
        var cx = this.cx();
        this.data().sort(function (a, b) {
          return cx(a) - cx(b);
        });
      },
      writable: true,
      configurable: true
    },
    xZoom: {
      value: function xZoom() {
        // var xScale = this.base.xScale;
        // var min = xScale.domain()[0],
        //     max = xScale.domain()[1];

        // // var nuData = [];
        // var dv = extend(this.defaultDataView(), this.dataView());
        // var that = this;

        // this.data().forEach(function(d, i) {
        //   var start = dv.xc(d);
        //   var duration = dv.duration(d);
        //   var end = start + duration;

        //   // rethink when feeling smarter
        //   if((start > min && end < max) || (start < min && end < max && end > min) || (start > min && start < max && end > max) || (end > max && start < min)) nuData.push(d);
        // });
        this.update();
      },
      writable: true,
      configurable: true
    },
    update: {
      value: function update(data) {
        _babelHelpers.get(_core.Object.getPrototypeOf(Breakpoint.prototype), "update", this).call(this, data);

        this.sortData();

        this.items = this.g.selectAll("." + this.param("unitClass")).data(this.data(), this.dataKey());

        // create line
        if (this.param("displayLine")) {
          this.line = this.d3.svg.line().interpolate(this.param("interpolate"));

          var path = this.g.select("path");
          // create path if not exists
          if (!path[0][0]) {
            path = this.g.append("path");
          }
          // remove line if no data
          if (this.data().length === 0) {
            path.remove();
          }
        }

        // create points
        var sel = this.items.enter().append("g").classed("item", true).classed(this.param("unitClass"), true);

        sel.append("circle");

        this.items.exit().remove();
      },
      writable: true,
      configurable: true
    },
    draw: {
      value: function draw(el) {
        var _this = this;

        el = el || this.items;

        this.sortData();

        var _xScale = this.base.xScale;
        var _yScale = this.yScale;
        var _cx = this.cx();
        var _cy = this.cy();
        var _r = this.r();
        var _color = this.color();
        var _opacity = this.opacity();

        var cx = function (d) {
          return _xScale(_cx(d));
        };
        var cy = function (d) {
          return _yScale(_cy(d));
        };
        var r = function (d) {
          return _r(d) || _this.param("radius");
        };
        var color = function (d) {
          return _color(d) || _this.param("color");
        };
        var opacity = function (d) {
          return _opacity(d) || _this.param("opacity");
        };

        // draw line
        if (this.param("displayLine")) {
          this.line.x(cx).y(cy);

          this.g.select("path").attr("d", this.line(this.data())).attr("stroke", this.param("lineColor")).attr("stroke-width", 1).attr("stroke-opacity", this.param("opacity")).attr("fill", "none");
        }

        // draw circles
        el.selectAll("circle").attr("fill", color).attr("fill-opacity", opacity).attr("cx", 0).attr("cy", 0).attr("r", r).attr("transform", function (d) {
          return "translate(" + cx(d) + ", " + cy(d) + ")";
        });

        if (!!this.each()) {
          el.each(this.each());
        }
      },
      writable: true,
      configurable: true
    },
    handleBrush: {

      // logic performed to select an item from the brush

      value: function handleBrush(extent, e) {},
      writable: true,
      configurable: true
    },
    handleDrag: {
      value: function handleDrag(item, e) {
        if (item === null) {
          return;
        }

        this.move(item, e.originalEvent.dx, e.originalEvent.dy);
      },
      writable: true,
      configurable: true
    },
    move: {
      value: function move(item, dx, dy) {
        item = this.d3.select(item);
        var datum = item.datum();

        var xScale = this.base.xScale;
        var yScale = this.yScale;
        var yRange = yScale.range();

        var cx = this.cx();
        var cy = this.cy();
        var x = xScale(cx(datum));
        var y = yScale(cy(datum));
        // update range
        x += dx;

        // clamp y
        var targetY = y + dy;
        if (targetY <= yRange[0] && targetY >= yRange[1]) {
          y = targetY;
        }

        // range to domain
        var xValue = xScale.invert(x);
        var yValue = yScale.invert(y);
        // update data
        cx(datum, xValue);
        cy(datum, yValue);
        // redraw view
        this.draw(item);
      },
      writable: true,
      configurable: true
    }
  });

  return Breakpoint;
})(Layer);

// add data accessors
accessors.getFunction(Breakpoint.prototype, ["cx", "cy", "r", "opacity", "color"]);

function factory() {
  return new Breakpoint();
}
factory.Breakpoint = Breakpoint;

module.exports = factory;

/*
mode = mode || 'xy'; // default tries to match both
 var modeX = mode.indexOf('x') >= 0;
var modeY = mode.indexOf('y') >= 0;
var matchX = false;
var matchY = false;
 var r  = this.r();
var cx = this.cx();
var cy = this.cy();
 this.g.selectAll('.selectable').classed('selected', (d, i) => {
  var halfR = r(d) * 0.5;
   // X match
  if (modeX) {
    var x1 = cx(d) - halfR;
    var x2 = cx(d) + halfR;
    //            begining sel               end sel
    var matchX1 = extent[0][0] <= x1 && x2 < extent[1][0];
    var matchX2 = extent[0][0] <= x2 && x1 < extent[1][0];
     matchX = (matchX1 || matchX2);
  } else {
    matchX = true;
  }
   // Y match
  if (modeY) {
    var y1 = cy(d) - halfR;
    var y2 = cy(d) + halfR;
    //            begining sel               end sel
    var matchY1 = extent[0][1] <= y1 && y2 < extent[1][1];
    var matchY2 = extent[0][1] <= y2 && y1 <= extent[1][1];
    matchY = (matchY1 || matchY2);
  } else {
    matchY = true;
  }
   return matchX && matchY;
});
*/
//# sourceMappingURL=data:application/json;base64,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QzFCLFlBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7QUFFMUIsU0FBQyxJQUFJLEVBQUUsQ0FBQzs7O0FBR1IsWUFBSSxPQUFPLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNyQixZQUFJLE9BQU8sSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksT0FBTyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUNoRCxXQUFDLEdBQUcsT0FBTyxDQUFDO1NBQ2I7OztBQUdELFlBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUIsWUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFOUIsVUFBRSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNsQixVQUFFLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDOztBQUVsQixZQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO09BQ2pCOzs7Ozs7U0FwT0csVUFBVTtHQUFTLEtBQUs7OztBQXlPOUIsU0FBUyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQzFDLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQ3BDLENBQUMsQ0FBQzs7QUFFSCxTQUFTLE9BQU8sR0FBRztBQUFFLFNBQU8sSUFBSSxVQUFVLEVBQUUsQ0FBQztDQUFFO0FBQy9DLE9BQU8sQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDOztBQUVoQyxNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyIsImZpbGUiOiJlczYvaGVscGVycy96b29tZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciB7IHVuaXF1ZUlkLCBhY2Nlc3NvcnMgfSA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvdXRpbHMnKTtcbnZhciB7IExheWVyIH0gPSByZXF1aXJlKCcuLi9jb3JlL2xheWVyJyk7XG5cbmNsYXNzIEJyZWFrcG9pbnQgZXh0ZW5kcyBMYXllciB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgIHR5cGU6ICdicmVha3BvaW50JyxcbiAgICAgIGlkOiB1bmlxdWVJZChuYW1lKSxcbiAgICAgIG9wYWNpdHk6IDEsXG4gICAgICBjb2xvcjogJyMwMDAwMDAnLFxuICAgICAgbGluZUNvbG9yOiAnIzAwMDAwMCcsXG4gICAgICBkaXNwbGF5TGluZTogdHJ1ZSxcbiAgICAgIHJhZGl1czogMyxcbiAgICAgIGludGVycG9sYXRlOiAnbGluZWFyJ1xuICAgIH07XG5cbiAgICB0aGlzLnBhcmFtcyhkZWZhdWx0cyk7XG5cbiAgICB0aGlzLmN4KGZ1bmN0aW9uKGQsIHYgPSBudWxsKSB7XG4gICAgICBpZiAodiA9PT0gbnVsbCkgcmV0dXJuICtkLmN4O1xuICAgICAgZC5jeCA9ICgrdik7XG4gICAgfSk7XG5cbiAgICB0aGlzLmN5KGZ1bmN0aW9uKGQsIHYgPSBudWxsKSB7XG4gICAgICBpZiAodiA9PT0gbnVsbCkgcmV0dXJuICtkLmN5O1xuICAgICAgZC5jeSA9ICgrdik7XG4gICAgfSk7XG5cbiAgICB0aGlzLnIoZnVuY3Rpb24oZCwgdiA9IG51bGwpIHtcbiAgICAgIGlmICh2ID09PSBudWxsKSByZXR1cm4gK2QucjtcbiAgICAgIGQuciA9ICgrdik7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9wYWNpdHkoZnVuY3Rpb24oZCwgdiA9IG51bGwpIHtcbiAgICAgIGlmICh2ID09PSBudWxsKSByZXR1cm4gK2Qub3BhY2l0eTtcbiAgICAgIGQub3BhY2l0eSA9ICgrdik7XG4gICAgfSk7XG5cbiAgICB0aGlzLmNvbG9yKGZ1bmN0aW9uKGQsIHYgPSBudWxsKSB7XG4gICAgICBpZiAodiA9PT0gbnVsbCkgcmV0dXJuIGQuY29sb3I7XG4gICAgICBkLmNvbG9yID0gdiArICcnO1xuICAgIH0pO1xuICB9XG5cbiAgLy8ga2VlcCBicmVha3BvaW50cyBjb2hlcmVudCBpbiB0aW1lIGF4aXNcbiAgc29ydERhdGEoKSB7XG4gICAgdmFyIGN4ID0gdGhpcy5jeCgpO1xuICAgIHRoaXMuZGF0YSgpLnNvcnQoKGEsIGIpID0+IHsgcmV0dXJuIGN4KGEpIC0gY3goYik7IH0pO1xuICB9XG5cbiAgeFpvb20oKSB7XG4gICAgLy8gdmFyIHhTY2FsZSA9IHRoaXMuYmFzZS54U2NhbGU7XG4gICAgICAvLyB2YXIgbWluID0geFNjYWxlLmRvbWFpbigpWzBdLFxuICAgICAgLy8gICAgIG1heCA9IHhTY2FsZS5kb21haW4oKVsxXTtcblxuICAgICAgLy8gLy8gdmFyIG51RGF0YSA9IFtdO1xuICAgICAgLy8gdmFyIGR2ID0gZXh0ZW5kKHRoaXMuZGVmYXVsdERhdGFWaWV3KCksIHRoaXMuZGF0YVZpZXcoKSk7XG4gICAgICAvLyB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgIC8vIHRoaXMuZGF0YSgpLmZvckVhY2goZnVuY3Rpb24oZCwgaSkge1xuICAgICAgLy8gICB2YXIgc3RhcnQgPSBkdi54YyhkKTtcbiAgICAgIC8vICAgdmFyIGR1cmF0aW9uID0gZHYuZHVyYXRpb24oZCk7XG4gICAgICAvLyAgIHZhciBlbmQgPSBzdGFydCArIGR1cmF0aW9uO1xuXG4gICAgICAvLyAgIC8vIHJldGhpbmsgd2hlbiBmZWVsaW5nIHNtYXJ0ZXJcbiAgICAgIC8vICAgaWYoKHN0YXJ0ID4gbWluICYmIGVuZCA8IG1heCkgfHwgKHN0YXJ0IDwgbWluICYmIGVuZCA8IG1heCAmJiBlbmQgPiBtaW4pIHx8IChzdGFydCA+IG1pbiAmJiBzdGFydCA8IG1heCAmJiBlbmQgPiBtYXgpIHx8IChlbmQgPiBtYXggJiYgc3RhcnQgPCBtaW4pKSBudURhdGEucHVzaChkKTtcbiAgICAgIC8vIH0pO1xuICAgICAgdGhpcy51cGRhdGUoKTtcbiAgfVxuXG4gIHVwZGF0ZShkYXRhKSB7XG4gICAgc3VwZXIudXBkYXRlKGRhdGEpO1xuXG4gICAgdGhpcy5zb3J0RGF0YSgpO1xuXG4gICAgdGhpcy5pdGVtcyA9IHRoaXMuZy5zZWxlY3RBbGwoJy4nICsgdGhpcy5wYXJhbSgndW5pdENsYXNzJykpXG4gICAgICAuZGF0YSh0aGlzLmRhdGEoKSwgdGhpcy5kYXRhS2V5KCkpO1xuXG4gICAgLy8gY3JlYXRlIGxpbmVcbiAgICBpZiAodGhpcy5wYXJhbSgnZGlzcGxheUxpbmUnKSkge1xuICAgICAgdGhpcy5saW5lID0gdGhpcy5kMy5zdmcubGluZSgpLmludGVycG9sYXRlKHRoaXMucGFyYW0oJ2ludGVycG9sYXRlJykpO1xuXG4gICAgICB2YXIgcGF0aCA9IHRoaXMuZy5zZWxlY3QoJ3BhdGgnKTtcbiAgICAgIC8vIGNyZWF0ZSBwYXRoIGlmIG5vdCBleGlzdHNcbiAgICAgIGlmICghcGF0aFswXVswXSkgeyBwYXRoID0gdGhpcy5nLmFwcGVuZCgncGF0aCcpOyB9XG4gICAgICAvLyByZW1vdmUgbGluZSBpZiBubyBkYXRhXG4gICAgICBpZiAodGhpcy5kYXRhKCkubGVuZ3RoID09PSAwKSB7IHBhdGgucmVtb3ZlKCk7IH1cbiAgICB9XG5cbiAgICAvLyBjcmVhdGUgcG9pbnRzXG4gICAgdmFyIHNlbCA9IHRoaXMuaXRlbXMuZW50ZXIoKVxuICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAuY2xhc3NlZCgnaXRlbScsIHRydWUpXG4gICAgICAuY2xhc3NlZCh0aGlzLnBhcmFtKCd1bml0Q2xhc3MnKSwgdHJ1ZSk7XG5cbiAgICBzZWwuYXBwZW5kKCdjaXJjbGUnKTtcblxuICAgIHRoaXMuaXRlbXMuZXhpdCgpLnJlbW92ZSgpO1xuICB9XG5cbiAgZHJhdyhlbCkge1xuICAgIGVsID0gZWwgfHzCoHRoaXMuaXRlbXM7XG5cbiAgICB0aGlzLnNvcnREYXRhKCk7XG5cbiAgICB2YXIgX3hTY2FsZSA9IHRoaXMuYmFzZS54U2NhbGU7XG4gICAgdmFyIF95U2NhbGUgPSB0aGlzLnlTY2FsZTtcbiAgICB2YXIgX2N4ID0gdGhpcy5jeCgpO1xuICAgIHZhciBfY3kgPSB0aGlzLmN5KCk7XG4gICAgdmFyIF9yICA9IHRoaXMucigpO1xuICAgIHZhciBfY29sb3IgPSB0aGlzLmNvbG9yKCk7XG4gICAgdmFyIF9vcGFjaXR5ID0gdGhpcy5vcGFjaXR5KCk7XG5cbiAgICB2YXIgY3ggPSAoZCkgPT4geyByZXR1cm4gX3hTY2FsZShfY3goZCkpOyB9O1xuICAgIHZhciBjeSA9IChkKSA9PiB7IHJldHVybiBfeVNjYWxlKF9jeShkKSk7IH07XG4gICAgdmFyIHIgID0gKGQpID0+IHsgcmV0dXJuIF9yKGQpIHx8IHRoaXMucGFyYW0oJ3JhZGl1cycpOyB9O1xuICAgIHZhciBjb2xvciAgID0gKGQpID0+IHsgcmV0dXJuIF9jb2xvcihkKSB8fMKgdGhpcy5wYXJhbSgnY29sb3InKTsgfTtcbiAgICB2YXIgb3BhY2l0eSA9IChkKSA9PiB7IHJldHVybiBfb3BhY2l0eShkKSB8fCB0aGlzLnBhcmFtKCdvcGFjaXR5Jyk7IH07XG5cbiAgICAvLyBkcmF3IGxpbmVcbiAgICBpZiAodGhpcy5wYXJhbSgnZGlzcGxheUxpbmUnKSkge1xuICAgICAgdGhpcy5saW5lLngoY3gpLnkoY3kpO1xuXG4gICAgICB0aGlzLmcuc2VsZWN0KCdwYXRoJylcbiAgICAgICAgLmF0dHIoJ2QnLCB0aGlzLmxpbmUodGhpcy5kYXRhKCkpKVxuICAgICAgICAuYXR0cignc3Ryb2tlJywgdGhpcy5wYXJhbSgnbGluZUNvbG9yJykpXG4gICAgICAgIC5hdHRyKCdzdHJva2Utd2lkdGgnLCAxKVxuICAgICAgICAuYXR0cignc3Ryb2tlLW9wYWNpdHknLCB0aGlzLnBhcmFtKCdvcGFjaXR5JykpXG4gICAgICAgIC5hdHRyKCdmaWxsJywgJ25vbmUnKTtcbiAgICB9XG5cbiAgICAvLyBkcmF3IGNpcmNsZXNcbiAgICBlbC5zZWxlY3RBbGwoJ2NpcmNsZScpXG4gICAgICAuYXR0cignZmlsbCcsIGNvbG9yKVxuICAgICAgLmF0dHIoJ2ZpbGwtb3BhY2l0eScsIG9wYWNpdHkpXG4gICAgICAuYXR0cignY3gnLCAwKVxuICAgICAgLmF0dHIoJ2N5JywgMClcbiAgICAgIC5hdHRyKCdyJywgcilcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCkgPT4ge1xuICAgICAgICByZXR1cm4gJ3RyYW5zbGF0ZSgnICsgY3goZCkgKyAnLCAnICsgY3koZCkgKyAnKSc7XG4gICAgICB9KTtcblxuICAgIGlmICghIXRoaXMuZWFjaCgpKSB7IGVsLmVhY2godGhpcy5lYWNoKCkpOyB9XG4gIH1cblxuICAvLyBsb2dpYyBwZXJmb3JtZWQgdG8gc2VsZWN0IGFuIGl0ZW0gZnJvbSB0aGUgYnJ1c2hcbiAgaGFuZGxlQnJ1c2goZXh0ZW50LCBlKSB7XG5cbiAgICAvKlxuICAgIG1vZGUgPSBtb2RlIHx8ICd4eSc7IC8vIGRlZmF1bHQgdHJpZXMgdG8gbWF0Y2ggYm90aFxuXG4gICAgdmFyIG1vZGVYID0gbW9kZS5pbmRleE9mKCd4JykgPj0gMDtcbiAgICB2YXIgbW9kZVkgPSBtb2RlLmluZGV4T2YoJ3knKSA+PSAwO1xuICAgIHZhciBtYXRjaFggPSBmYWxzZTtcbiAgICB2YXIgbWF0Y2hZID0gZmFsc2U7XG5cbiAgICB2YXIgciAgPSB0aGlzLnIoKTtcbiAgICB2YXIgY3ggPSB0aGlzLmN4KCk7XG4gICAgdmFyIGN5ID0gdGhpcy5jeSgpO1xuXG4gICAgdGhpcy5nLnNlbGVjdEFsbCgnLnNlbGVjdGFibGUnKS5jbGFzc2VkKCdzZWxlY3RlZCcsIChkLCBpKSA9PiB7XG4gICAgICB2YXIgaGFsZlIgPSByKGQpICogMC41O1xuXG4gICAgICAvLyBYIG1hdGNoXG4gICAgICBpZiAobW9kZVgpIHtcbiAgICAgICAgdmFyIHgxID0gY3goZCkgLSBoYWxmUjtcbiAgICAgICAgdmFyIHgyID0gY3goZCkgKyBoYWxmUjtcbiAgICAgICAgLy8gICAgICAgICAgICBiZWdpbmluZyBzZWwgICAgICAgICAgICAgICBlbmQgc2VsXG4gICAgICAgIHZhciBtYXRjaFgxID0gZXh0ZW50WzBdWzBdIDw9IHgxICYmIHgyIDwgZXh0ZW50WzFdWzBdO1xuICAgICAgICB2YXIgbWF0Y2hYMiA9IGV4dGVudFswXVswXSA8PSB4MiAmJiB4MSA8IGV4dGVudFsxXVswXTtcblxuICAgICAgICBtYXRjaFggPSAobWF0Y2hYMSB8fCBtYXRjaFgyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1hdGNoWCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIFkgbWF0Y2hcbiAgICAgIGlmIChtb2RlWSkge1xuICAgICAgICB2YXIgeTEgPSBjeShkKSAtIGhhbGZSO1xuICAgICAgICB2YXIgeTIgPSBjeShkKSArIGhhbGZSO1xuICAgICAgICAvLyAgICAgICAgICAgIGJlZ2luaW5nIHNlbCAgICAgICAgICAgICAgIGVuZCBzZWxcbiAgICAgICAgdmFyIG1hdGNoWTEgPSBleHRlbnRbMF1bMV0gPD0geTEgJiYgeTIgPCBleHRlbnRbMV1bMV07XG4gICAgICAgIHZhciBtYXRjaFkyID0gZXh0ZW50WzBdWzFdIDw9IHkyICYmIHkxIDw9IGV4dGVudFsxXVsxXTtcbiAgICAgICAgbWF0Y2hZID0gKG1hdGNoWTEgfHwgbWF0Y2hZMik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtYXRjaFkgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbWF0Y2hYICYmIG1hdGNoWTtcbiAgICB9KTtcbiAgICAqL1xuICB9XG5cbiAgaGFuZGxlRHJhZyhpdGVtLCBlKSB7XG4gICAgaWYgKGl0ZW0gPT09IG51bGwpIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLm1vdmUoaXRlbSwgZS5vcmlnaW5hbEV2ZW50LmR4LCBlLm9yaWdpbmFsRXZlbnQuZHkpO1xuICB9XG5cbiAgbW92ZShpdGVtLCBkeCwgZHkpIHtcbiAgICBpdGVtID0gdGhpcy5kMy5zZWxlY3QoaXRlbSk7XG4gICAgdmFyIGRhdHVtID0gaXRlbS5kYXR1bSgpO1xuXG4gICAgdmFyIHhTY2FsZSA9IHRoaXMuYmFzZS54U2NhbGU7XG4gICAgdmFyIHlTY2FsZSA9IHRoaXMueVNjYWxlO1xuICAgIHZhciB5UmFuZ2UgPSB5U2NhbGUucmFuZ2UoKTtcblxuICAgIHZhciBjeCA9IHRoaXMuY3goKTtcbiAgICB2YXIgY3kgPSB0aGlzLmN5KCk7XG4gICAgdmFyIHggPSB4U2NhbGUoY3goZGF0dW0pKTtcbiAgICB2YXIgeSA9IHlTY2FsZShjeShkYXR1bSkpO1xuICAgIC8vIHVwZGF0ZSByYW5nZVxuICAgIHggKz0gZHg7XG5cbiAgICAvLyBjbGFtcCB5XG4gICAgdmFyIHRhcmdldFkgPSB5ICsgZHk7XG4gICAgaWYgKHRhcmdldFkgPD0geVJhbmdlWzBdICYmIHRhcmdldFkgPj0geVJhbmdlWzFdKSB7XG4gICAgICB5ID0gdGFyZ2V0WTtcbiAgICB9XG5cbiAgICAvLyByYW5nZSB0byBkb21haW5cbiAgICB2YXIgeFZhbHVlID0geFNjYWxlLmludmVydCh4KTtcbiAgICB2YXIgeVZhbHVlID0geVNjYWxlLmludmVydCh5KTtcbiAgICAvLyB1cGRhdGUgZGF0YVxuICAgIGN4KGRhdHVtLCB4VmFsdWUpO1xuICAgIGN5KGRhdHVtLCB5VmFsdWUpO1xuICAgIC8vIHJlZHJhdyB2aWV3XG4gICAgdGhpcy5kcmF3KGl0ZW0pO1xuICB9XG5cbn1cblxuLy8gYWRkIGRhdGEgYWNjZXNzb3JzXG5hY2Nlc3NvcnMuZ2V0RnVuY3Rpb24oQnJlYWtwb2ludC5wcm90b3R5cGUsIFtcbiAgJ2N4JywgJ2N5JywgJ3InLCAnb3BhY2l0eScsICdjb2xvcidcbl0pO1xuXG5mdW5jdGlvbiBmYWN0b3J5KCkgeyByZXR1cm4gbmV3IEJyZWFrcG9pbnQoKTsgfVxuZmFjdG9yeS5CcmVha3BvaW50ID0gQnJlYWtwb2ludDtcblxubW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5O1xuIl19