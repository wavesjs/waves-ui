"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _require = require("../helpers/utils");

var uniqueId = _require.uniqueId;
var accessors = _require.accessors;

var _require2 = require("../core/layer");

var Layer = _require2.Layer;

var Breakpoint = (function (_Layer) {
  function Breakpoint() {
    _classCallCheck(this, Breakpoint);

    _get(_core.Object.getPrototypeOf(Breakpoint.prototype), "constructor", this).call(this);

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

  _inherits(Breakpoint, _Layer);

  _createClass(Breakpoint, {
    sortData: {

      // keep breakpoints coherent in time axis

      value: function sortData() {
        var cx = this.cx();
        this.data().sort(function (a, b) {
          return cx(a) - cx(b);
        });
      }
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
      }
    },
    update: {
      value: function update(data) {
        _get(_core.Object.getPrototypeOf(Breakpoint.prototype), "update", this).call(this, data);

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
      }
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
      }
    },
    handleBrush: {

      // logic performed to select an item from the brush

      value: function handleBrush(extent, e) {}
    },
    handleDrag: {
      value: function handleDrag(item, e) {
        if (item === null) {
          return;
        }

        this.move(item, e.originalEvent.dx, e.originalEvent.dy);
      }
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
      }
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
//# sourceMappingURL=data:application/json;base64,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QUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOztBQUUxQixTQUFDLElBQUksRUFBRSxDQUFDOzs7QUFHUixZQUFJLE9BQU8sR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLFlBQUksT0FBTyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFPLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ2hELFdBQUMsR0FBRyxPQUFPLENBQUM7U0FDYjs7O0FBR0QsWUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5QixZQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUU5QixVQUFFLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ2xCLFVBQUUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7O0FBRWxCLFlBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDakI7Ozs7U0FwT0csVUFBVTtHQUFTLEtBQUs7OztBQXlPOUIsU0FBUyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQzFDLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQ3BDLENBQUMsQ0FBQzs7QUFFSCxTQUFTLE9BQU8sR0FBRztBQUFFLFNBQU8sSUFBSSxVQUFVLEVBQUUsQ0FBQztDQUFFO0FBQy9DLE9BQU8sQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDOztBQUVoQyxNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyIsImZpbGUiOiJlczYvaGVscGVycy96b29tZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciB7IHVuaXF1ZUlkLCBhY2Nlc3NvcnMgfSA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvdXRpbHMnKTtcbnZhciB7IExheWVyIH0gPSByZXF1aXJlKCcuLi9jb3JlL2xheWVyJyk7XG5cbmNsYXNzIEJyZWFrcG9pbnQgZXh0ZW5kcyBMYXllciB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgIHR5cGU6ICdicmVha3BvaW50JyxcbiAgICAgIGlkOiB1bmlxdWVJZChuYW1lKSxcbiAgICAgIG9wYWNpdHk6IDEsXG4gICAgICBjb2xvcjogJyMwMDAwMDAnLFxuICAgICAgbGluZUNvbG9yOiAnIzAwMDAwMCcsXG4gICAgICBkaXNwbGF5TGluZTogdHJ1ZSxcbiAgICAgIHJhZGl1czogMyxcbiAgICAgIGludGVycG9sYXRlOiAnbGluZWFyJ1xuICAgIH07XG5cbiAgICB0aGlzLnBhcmFtcyhkZWZhdWx0cyk7XG5cbiAgICB0aGlzLmN4KGZ1bmN0aW9uKGQsIHYgPSBudWxsKSB7XG4gICAgICBpZiAodiA9PT0gbnVsbCkgcmV0dXJuICtkLmN4O1xuICAgICAgZC5jeCA9ICgrdik7XG4gICAgfSk7XG5cbiAgICB0aGlzLmN5KGZ1bmN0aW9uKGQsIHYgPSBudWxsKSB7XG4gICAgICBpZiAodiA9PT0gbnVsbCkgcmV0dXJuICtkLmN5O1xuICAgICAgZC5jeSA9ICgrdik7XG4gICAgfSk7XG5cbiAgICB0aGlzLnIoZnVuY3Rpb24oZCwgdiA9IG51bGwpIHtcbiAgICAgIGlmICh2ID09PSBudWxsKSByZXR1cm4gK2QucjtcbiAgICAgIGQuciA9ICgrdik7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9wYWNpdHkoZnVuY3Rpb24oZCwgdiA9IG51bGwpIHtcbiAgICAgIGlmICh2ID09PSBudWxsKSByZXR1cm4gK2Qub3BhY2l0eTtcbiAgICAgIGQub3BhY2l0eSA9ICgrdik7XG4gICAgfSk7XG5cbiAgICB0aGlzLmNvbG9yKGZ1bmN0aW9uKGQsIHYgPSBudWxsKSB7XG4gICAgICBpZiAodiA9PT0gbnVsbCkgcmV0dXJuIGQuY29sb3I7XG4gICAgICBkLmNvbG9yID0gdiArICcnO1xuICAgIH0pO1xuICB9XG5cbiAgLy8ga2VlcCBicmVha3BvaW50cyBjb2hlcmVudCBpbiB0aW1lIGF4aXNcbiAgc29ydERhdGEoKSB7XG4gICAgdmFyIGN4ID0gdGhpcy5jeCgpO1xuICAgIHRoaXMuZGF0YSgpLnNvcnQoKGEsIGIpID0+IHsgcmV0dXJuIGN4KGEpIC0gY3goYik7IH0pO1xuICB9XG5cbiAgeFpvb20oKSB7XG4gICAgLy8gdmFyIHhTY2FsZSA9IHRoaXMuYmFzZS54U2NhbGU7XG4gICAgICAvLyB2YXIgbWluID0geFNjYWxlLmRvbWFpbigpWzBdLFxuICAgICAgLy8gICAgIG1heCA9IHhTY2FsZS5kb21haW4oKVsxXTtcblxuICAgICAgLy8gLy8gdmFyIG51RGF0YSA9IFtdO1xuICAgICAgLy8gdmFyIGR2ID0gZXh0ZW5kKHRoaXMuZGVmYXVsdERhdGFWaWV3KCksIHRoaXMuZGF0YVZpZXcoKSk7XG4gICAgICAvLyB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgIC8vIHRoaXMuZGF0YSgpLmZvckVhY2goZnVuY3Rpb24oZCwgaSkge1xuICAgICAgLy8gICB2YXIgc3RhcnQgPSBkdi54YyhkKTtcbiAgICAgIC8vICAgdmFyIGR1cmF0aW9uID0gZHYuZHVyYXRpb24oZCk7XG4gICAgICAvLyAgIHZhciBlbmQgPSBzdGFydCArIGR1cmF0aW9uO1xuXG4gICAgICAvLyAgIC8vIHJldGhpbmsgd2hlbiBmZWVsaW5nIHNtYXJ0ZXJcbiAgICAgIC8vICAgaWYoKHN0YXJ0ID4gbWluICYmIGVuZCA8IG1heCkgfHwgKHN0YXJ0IDwgbWluICYmIGVuZCA8IG1heCAmJiBlbmQgPiBtaW4pIHx8IChzdGFydCA+IG1pbiAmJiBzdGFydCA8IG1heCAmJiBlbmQgPiBtYXgpIHx8IChlbmQgPiBtYXggJiYgc3RhcnQgPCBtaW4pKSBudURhdGEucHVzaChkKTtcbiAgICAgIC8vIH0pO1xuICAgICAgdGhpcy51cGRhdGUoKTtcbiAgfVxuXG4gIHVwZGF0ZShkYXRhKSB7XG4gICAgc3VwZXIudXBkYXRlKGRhdGEpO1xuXG4gICAgdGhpcy5zb3J0RGF0YSgpO1xuXG4gICAgdGhpcy5pdGVtcyA9IHRoaXMuZy5zZWxlY3RBbGwoJy4nICsgdGhpcy5wYXJhbSgndW5pdENsYXNzJykpXG4gICAgICAuZGF0YSh0aGlzLmRhdGEoKSwgdGhpcy5kYXRhS2V5KCkpO1xuXG4gICAgLy8gY3JlYXRlIGxpbmVcbiAgICBpZiAodGhpcy5wYXJhbSgnZGlzcGxheUxpbmUnKSkge1xuICAgICAgdGhpcy5saW5lID0gdGhpcy5kMy5zdmcubGluZSgpLmludGVycG9sYXRlKHRoaXMucGFyYW0oJ2ludGVycG9sYXRlJykpO1xuXG4gICAgICB2YXIgcGF0aCA9IHRoaXMuZy5zZWxlY3QoJ3BhdGgnKTtcbiAgICAgIC8vIGNyZWF0ZSBwYXRoIGlmIG5vdCBleGlzdHNcbiAgICAgIGlmICghcGF0aFswXVswXSkgeyBwYXRoID0gdGhpcy5nLmFwcGVuZCgncGF0aCcpOyB9XG4gICAgICAvLyByZW1vdmUgbGluZSBpZiBubyBkYXRhXG4gICAgICBpZiAodGhpcy5kYXRhKCkubGVuZ3RoID09PSAwKSB7IHBhdGgucmVtb3ZlKCk7IH1cbiAgICB9XG5cbiAgICAvLyBjcmVhdGUgcG9pbnRzXG4gICAgdmFyIHNlbCA9IHRoaXMuaXRlbXMuZW50ZXIoKVxuICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAuY2xhc3NlZCgnaXRlbScsIHRydWUpXG4gICAgICAuY2xhc3NlZCh0aGlzLnBhcmFtKCd1bml0Q2xhc3MnKSwgdHJ1ZSk7XG5cbiAgICBzZWwuYXBwZW5kKCdjaXJjbGUnKTtcblxuICAgIHRoaXMuaXRlbXMuZXhpdCgpLnJlbW92ZSgpO1xuICB9XG5cbiAgZHJhdyhlbCkge1xuICAgIGVsID0gZWwgfHzCoHRoaXMuaXRlbXM7XG5cbiAgICB0aGlzLnNvcnREYXRhKCk7XG5cbiAgICB2YXIgX3hTY2FsZSA9IHRoaXMuYmFzZS54U2NhbGU7XG4gICAgdmFyIF95U2NhbGUgPSB0aGlzLnlTY2FsZTtcbiAgICB2YXIgX2N4ID0gdGhpcy5jeCgpO1xuICAgIHZhciBfY3kgPSB0aGlzLmN5KCk7XG4gICAgdmFyIF9yICA9IHRoaXMucigpO1xuICAgIHZhciBfY29sb3IgPSB0aGlzLmNvbG9yKCk7XG4gICAgdmFyIF9vcGFjaXR5ID0gdGhpcy5vcGFjaXR5KCk7XG5cbiAgICB2YXIgY3ggPSAoZCkgPT4geyByZXR1cm4gX3hTY2FsZShfY3goZCkpOyB9O1xuICAgIHZhciBjeSA9IChkKSA9PiB7IHJldHVybiBfeVNjYWxlKF9jeShkKSk7IH07XG4gICAgdmFyIHIgID0gKGQpID0+IHsgcmV0dXJuIF9yKGQpIHx8IHRoaXMucGFyYW0oJ3JhZGl1cycpOyB9O1xuICAgIHZhciBjb2xvciAgID0gKGQpID0+IHsgcmV0dXJuIF9jb2xvcihkKSB8fMKgdGhpcy5wYXJhbSgnY29sb3InKTsgfTtcbiAgICB2YXIgb3BhY2l0eSA9IChkKSA9PiB7IHJldHVybiBfb3BhY2l0eShkKSB8fCB0aGlzLnBhcmFtKCdvcGFjaXR5Jyk7IH07XG5cbiAgICAvLyBkcmF3IGxpbmVcbiAgICBpZiAodGhpcy5wYXJhbSgnZGlzcGxheUxpbmUnKSkge1xuICAgICAgdGhpcy5saW5lLngoY3gpLnkoY3kpO1xuXG4gICAgICB0aGlzLmcuc2VsZWN0KCdwYXRoJylcbiAgICAgICAgLmF0dHIoJ2QnLCB0aGlzLmxpbmUodGhpcy5kYXRhKCkpKVxuICAgICAgICAuYXR0cignc3Ryb2tlJywgdGhpcy5wYXJhbSgnbGluZUNvbG9yJykpXG4gICAgICAgIC5hdHRyKCdzdHJva2Utd2lkdGgnLCAxKVxuICAgICAgICAuYXR0cignc3Ryb2tlLW9wYWNpdHknLCB0aGlzLnBhcmFtKCdvcGFjaXR5JykpXG4gICAgICAgIC5hdHRyKCdmaWxsJywgJ25vbmUnKTtcbiAgICB9XG5cbiAgICAvLyBkcmF3IGNpcmNsZXNcbiAgICBlbC5zZWxlY3RBbGwoJ2NpcmNsZScpXG4gICAgICAuYXR0cignZmlsbCcsIGNvbG9yKVxuICAgICAgLmF0dHIoJ2ZpbGwtb3BhY2l0eScsIG9wYWNpdHkpXG4gICAgICAuYXR0cignY3gnLCAwKVxuICAgICAgLmF0dHIoJ2N5JywgMClcbiAgICAgIC5hdHRyKCdyJywgcilcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCkgPT4ge1xuICAgICAgICByZXR1cm4gJ3RyYW5zbGF0ZSgnICsgY3goZCkgKyAnLCAnICsgY3koZCkgKyAnKSc7XG4gICAgICB9KTtcblxuICAgIGlmICghIXRoaXMuZWFjaCgpKSB7IGVsLmVhY2godGhpcy5lYWNoKCkpOyB9XG4gIH1cblxuICAvLyBsb2dpYyBwZXJmb3JtZWQgdG8gc2VsZWN0IGFuIGl0ZW0gZnJvbSB0aGUgYnJ1c2hcbiAgaGFuZGxlQnJ1c2goZXh0ZW50LCBlKSB7XG5cbiAgICAvKlxuICAgIG1vZGUgPSBtb2RlIHx8ICd4eSc7IC8vIGRlZmF1bHQgdHJpZXMgdG8gbWF0Y2ggYm90aFxuXG4gICAgdmFyIG1vZGVYID0gbW9kZS5pbmRleE9mKCd4JykgPj0gMDtcbiAgICB2YXIgbW9kZVkgPSBtb2RlLmluZGV4T2YoJ3knKSA+PSAwO1xuICAgIHZhciBtYXRjaFggPSBmYWxzZTtcbiAgICB2YXIgbWF0Y2hZID0gZmFsc2U7XG5cbiAgICB2YXIgciAgPSB0aGlzLnIoKTtcbiAgICB2YXIgY3ggPSB0aGlzLmN4KCk7XG4gICAgdmFyIGN5ID0gdGhpcy5jeSgpO1xuXG4gICAgdGhpcy5nLnNlbGVjdEFsbCgnLnNlbGVjdGFibGUnKS5jbGFzc2VkKCdzZWxlY3RlZCcsIChkLCBpKSA9PiB7XG4gICAgICB2YXIgaGFsZlIgPSByKGQpICogMC41O1xuXG4gICAgICAvLyBYIG1hdGNoXG4gICAgICBpZiAobW9kZVgpIHtcbiAgICAgICAgdmFyIHgxID0gY3goZCkgLSBoYWxmUjtcbiAgICAgICAgdmFyIHgyID0gY3goZCkgKyBoYWxmUjtcbiAgICAgICAgLy8gICAgICAgICAgICBiZWdpbmluZyBzZWwgICAgICAgICAgICAgICBlbmQgc2VsXG4gICAgICAgIHZhciBtYXRjaFgxID0gZXh0ZW50WzBdWzBdIDw9IHgxICYmIHgyIDwgZXh0ZW50WzFdWzBdO1xuICAgICAgICB2YXIgbWF0Y2hYMiA9IGV4dGVudFswXVswXSA8PSB4MiAmJiB4MSA8IGV4dGVudFsxXVswXTtcblxuICAgICAgICBtYXRjaFggPSAobWF0Y2hYMSB8fCBtYXRjaFgyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1hdGNoWCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIFkgbWF0Y2hcbiAgICAgIGlmIChtb2RlWSkge1xuICAgICAgICB2YXIgeTEgPSBjeShkKSAtIGhhbGZSO1xuICAgICAgICB2YXIgeTIgPSBjeShkKSArIGhhbGZSO1xuICAgICAgICAvLyAgICAgICAgICAgIGJlZ2luaW5nIHNlbCAgICAgICAgICAgICAgIGVuZCBzZWxcbiAgICAgICAgdmFyIG1hdGNoWTEgPSBleHRlbnRbMF1bMV0gPD0geTEgJiYgeTIgPCBleHRlbnRbMV1bMV07XG4gICAgICAgIHZhciBtYXRjaFkyID0gZXh0ZW50WzBdWzFdIDw9IHkyICYmIHkxIDw9IGV4dGVudFsxXVsxXTtcbiAgICAgICAgbWF0Y2hZID0gKG1hdGNoWTEgfHwgbWF0Y2hZMik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtYXRjaFkgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbWF0Y2hYICYmIG1hdGNoWTtcbiAgICB9KTtcbiAgICAqL1xuICB9XG5cbiAgaGFuZGxlRHJhZyhpdGVtLCBlKSB7XG4gICAgaWYgKGl0ZW0gPT09IG51bGwpIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLm1vdmUoaXRlbSwgZS5vcmlnaW5hbEV2ZW50LmR4LCBlLm9yaWdpbmFsRXZlbnQuZHkpO1xuICB9XG5cbiAgbW92ZShpdGVtLCBkeCwgZHkpIHtcbiAgICBpdGVtID0gdGhpcy5kMy5zZWxlY3QoaXRlbSk7XG4gICAgdmFyIGRhdHVtID0gaXRlbS5kYXR1bSgpO1xuXG4gICAgdmFyIHhTY2FsZSA9IHRoaXMuYmFzZS54U2NhbGU7XG4gICAgdmFyIHlTY2FsZSA9IHRoaXMueVNjYWxlO1xuICAgIHZhciB5UmFuZ2UgPSB5U2NhbGUucmFuZ2UoKTtcblxuICAgIHZhciBjeCA9IHRoaXMuY3goKTtcbiAgICB2YXIgY3kgPSB0aGlzLmN5KCk7XG4gICAgdmFyIHggPSB4U2NhbGUoY3goZGF0dW0pKTtcbiAgICB2YXIgeSA9IHlTY2FsZShjeShkYXR1bSkpO1xuICAgIC8vIHVwZGF0ZSByYW5nZVxuICAgIHggKz0gZHg7XG5cbiAgICAvLyBjbGFtcCB5XG4gICAgdmFyIHRhcmdldFkgPSB5ICsgZHk7XG4gICAgaWYgKHRhcmdldFkgPD0geVJhbmdlWzBdICYmIHRhcmdldFkgPj0geVJhbmdlWzFdKSB7XG4gICAgICB5ID0gdGFyZ2V0WTtcbiAgICB9XG5cbiAgICAvLyByYW5nZSB0byBkb21haW5cbiAgICB2YXIgeFZhbHVlID0geFNjYWxlLmludmVydCh4KTtcbiAgICB2YXIgeVZhbHVlID0geVNjYWxlLmludmVydCh5KTtcbiAgICAvLyB1cGRhdGUgZGF0YVxuICAgIGN4KGRhdHVtLCB4VmFsdWUpO1xuICAgIGN5KGRhdHVtLCB5VmFsdWUpO1xuICAgIC8vIHJlZHJhdyB2aWV3XG4gICAgdGhpcy5kcmF3KGl0ZW0pO1xuICB9XG5cbn1cblxuLy8gYWRkIGRhdGEgYWNjZXNzb3JzXG5hY2Nlc3NvcnMuZ2V0RnVuY3Rpb24oQnJlYWtwb2ludC5wcm90b3R5cGUsIFtcbiAgJ2N4JywgJ2N5JywgJ3InLCAnb3BhY2l0eScsICdjb2xvcidcbl0pO1xuXG5mdW5jdGlvbiBmYWN0b3J5KCkgeyByZXR1cm4gbmV3IEJyZWFrcG9pbnQoKTsgfVxuZmFjdG9yeS5CcmVha3BvaW50ID0gQnJlYWtwb2ludDtcblxubW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5O1xuIl19