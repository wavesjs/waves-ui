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

      // creates a copy of the data ordered in time axis to draw the line

      value: function sortData() {
        var cx = this.cx();
        var data = this.data().slice(0).sort(function (a, b) {
          return cx(a) - cx(b);
        });
        return data;
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

        // this.sortData();

        this.items = this.g.selectAll("." + this.param("unitClass")).data(this.data());

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

        var exit = this.items.exit();
        exit.remove();
      }
    },
    draw: {
      value: function draw(el) {
        var _this = this;

        el = el || this.items;

        // this.sortData();

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

          this.g.select("path").attr("d", this.line(this.sortData())).attr("stroke", this.param("lineColor")).attr("stroke-width", 1).attr("stroke-opacity", this.param("opacity")).attr("fill", "none");
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
//# sourceMappingURL=data:application/json;base64,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QUFNLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7O0FBRTFCLFNBQUMsSUFBSSxFQUFFLENBQUM7OztBQUdSLFlBQUksT0FBTyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDckIsWUFBSSxPQUFPLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLE9BQU8sSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDaEQsV0FBQyxHQUFHLE9BQU8sQ0FBQztTQUNiOzs7QUFHRCxZQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlCLFlBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRTlCLFVBQUUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDbEIsVUFBRSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQzs7QUFFbEIsWUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztPQUNqQjs7OztTQXRPRyxVQUFVO0dBQVMsS0FBSzs7O0FBMk85QixTQUFTLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FDMUMsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FDcEMsQ0FBQyxDQUFDOztBQUVILFNBQVMsT0FBTyxHQUFHO0FBQUUsU0FBTyxJQUFJLFVBQVUsRUFBRSxDQUFDO0NBQUU7QUFDL0MsT0FBTyxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7O0FBRWhDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDIiwiZmlsZSI6ImVzNi9oZWxwZXJzL3pvb21lci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIHsgdW5pcXVlSWQsIGFjY2Vzc29ycyB9ID0gcmVxdWlyZSgnLi4vaGVscGVycy91dGlscycpO1xudmFyIHsgTGF5ZXIgfSA9IHJlcXVpcmUoJy4uL2NvcmUvbGF5ZXInKTtcblxuY2xhc3MgQnJlYWtwb2ludCBleHRlbmRzIExheWVyIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgdHlwZTogJ2JyZWFrcG9pbnQnLFxuICAgICAgaWQ6IHVuaXF1ZUlkKG5hbWUpLFxuICAgICAgb3BhY2l0eTogMSxcbiAgICAgIGNvbG9yOiAnIzAwMDAwMCcsXG4gICAgICBsaW5lQ29sb3I6ICcjMDAwMDAwJyxcbiAgICAgIGRpc3BsYXlMaW5lOiB0cnVlLFxuICAgICAgcmFkaXVzOiAzLFxuICAgICAgaW50ZXJwb2xhdGU6ICdsaW5lYXInXG4gICAgfTtcblxuICAgIHRoaXMucGFyYW1zKGRlZmF1bHRzKTtcblxuICAgIHRoaXMuY3goZnVuY3Rpb24oZCwgdiA9IG51bGwpIHtcbiAgICAgIGlmICh2ID09PSBudWxsKSByZXR1cm4gK2QuY3g7XG4gICAgICBkLmN4ID0gKCt2KTtcbiAgICB9KTtcblxuICAgIHRoaXMuY3koZnVuY3Rpb24oZCwgdiA9IG51bGwpIHtcbiAgICAgIGlmICh2ID09PSBudWxsKSByZXR1cm4gK2QuY3k7XG4gICAgICBkLmN5ID0gKCt2KTtcbiAgICB9KTtcblxuICAgIHRoaXMucihmdW5jdGlvbihkLCB2ID0gbnVsbCkge1xuICAgICAgaWYgKHYgPT09IG51bGwpIHJldHVybiArZC5yO1xuICAgICAgZC5yID0gKCt2KTtcbiAgICB9KTtcblxuICAgIHRoaXMub3BhY2l0eShmdW5jdGlvbihkLCB2ID0gbnVsbCkge1xuICAgICAgaWYgKHYgPT09IG51bGwpIHJldHVybiArZC5vcGFjaXR5O1xuICAgICAgZC5vcGFjaXR5ID0gKCt2KTtcbiAgICB9KTtcblxuICAgIHRoaXMuY29sb3IoZnVuY3Rpb24oZCwgdiA9IG51bGwpIHtcbiAgICAgIGlmICh2ID09PSBudWxsKSByZXR1cm4gZC5jb2xvcjtcbiAgICAgIGQuY29sb3IgPSB2ICsgJyc7XG4gICAgfSk7XG4gIH1cblxuICAvLyBjcmVhdGVzIGEgY29weSBvZiB0aGUgZGF0YSBvcmRlcmVkIGluIHRpbWUgYXhpcyB0byBkcmF3IHRoZSBsaW5lXG4gIHNvcnREYXRhKCkge1xuICAgIHZhciBjeCA9IHRoaXMuY3goKTtcbiAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YSgpLnNsaWNlKDApLnNvcnQoKGEsIGIpID0+IHsgcmV0dXJuIGN4KGEpIC0gY3goYik7IH0pO1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgeFpvb20oKSB7XG4gICAgLy8gdmFyIHhTY2FsZSA9IHRoaXMuYmFzZS54U2NhbGU7XG4gICAgICAvLyB2YXIgbWluID0geFNjYWxlLmRvbWFpbigpWzBdLFxuICAgICAgLy8gICAgIG1heCA9IHhTY2FsZS5kb21haW4oKVsxXTtcblxuICAgICAgLy8gLy8gdmFyIG51RGF0YSA9IFtdO1xuICAgICAgLy8gdmFyIGR2ID0gZXh0ZW5kKHRoaXMuZGVmYXVsdERhdGFWaWV3KCksIHRoaXMuZGF0YVZpZXcoKSk7XG4gICAgICAvLyB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgIC8vIHRoaXMuZGF0YSgpLmZvckVhY2goZnVuY3Rpb24oZCwgaSkge1xuICAgICAgLy8gICB2YXIgc3RhcnQgPSBkdi54YyhkKTtcbiAgICAgIC8vICAgdmFyIGR1cmF0aW9uID0gZHYuZHVyYXRpb24oZCk7XG4gICAgICAvLyAgIHZhciBlbmQgPSBzdGFydCArIGR1cmF0aW9uO1xuXG4gICAgICAvLyAgIC8vIHJldGhpbmsgd2hlbiBmZWVsaW5nIHNtYXJ0ZXJcbiAgICAgIC8vICAgaWYoKHN0YXJ0ID4gbWluICYmIGVuZCA8IG1heCkgfHwgKHN0YXJ0IDwgbWluICYmIGVuZCA8IG1heCAmJiBlbmQgPiBtaW4pIHx8IChzdGFydCA+IG1pbiAmJiBzdGFydCA8IG1heCAmJiBlbmQgPiBtYXgpIHx8IChlbmQgPiBtYXggJiYgc3RhcnQgPCBtaW4pKSBudURhdGEucHVzaChkKTtcbiAgICAgIC8vIH0pO1xuICAgICAgdGhpcy51cGRhdGUoKTtcbiAgfVxuXG4gIHVwZGF0ZShkYXRhKSB7XG4gICAgc3VwZXIudXBkYXRlKGRhdGEpO1xuXG4gICAgLy8gdGhpcy5zb3J0RGF0YSgpO1xuXG4gICAgdGhpcy5pdGVtcyA9IHRoaXMuZy5zZWxlY3RBbGwoJy4nICsgdGhpcy5wYXJhbSgndW5pdENsYXNzJykpXG4gICAgICAuZGF0YSh0aGlzLmRhdGEoKSk7XG5cbiAgICAvLyBjcmVhdGUgbGluZVxuICAgIGlmICh0aGlzLnBhcmFtKCdkaXNwbGF5TGluZScpKSB7XG4gICAgICB0aGlzLmxpbmUgPSB0aGlzLmQzLnN2Zy5saW5lKCkuaW50ZXJwb2xhdGUodGhpcy5wYXJhbSgnaW50ZXJwb2xhdGUnKSk7XG5cbiAgICAgIHZhciBwYXRoID0gdGhpcy5nLnNlbGVjdCgncGF0aCcpO1xuICAgICAgLy8gY3JlYXRlIHBhdGggaWYgbm90IGV4aXN0c1xuICAgICAgaWYgKCFwYXRoWzBdWzBdKSB7IHBhdGggPSB0aGlzLmcuYXBwZW5kKCdwYXRoJyk7IH1cbiAgICAgIC8vIHJlbW92ZSBsaW5lIGlmIG5vIGRhdGFcbiAgICAgIGlmICh0aGlzLmRhdGEoKS5sZW5ndGggPT09IDApIHsgcGF0aC5yZW1vdmUoKTsgfVxuICAgIH1cblxuICAgIC8vIGNyZWF0ZSBwb2ludHNcbiAgICB2YXIgc2VsID0gdGhpcy5pdGVtcy5lbnRlcigpXG4gICAgICAuYXBwZW5kKCdnJylcbiAgICAgIC5jbGFzc2VkKCdpdGVtJywgdHJ1ZSlcbiAgICAgIC5jbGFzc2VkKHRoaXMucGFyYW0oJ3VuaXRDbGFzcycpLCB0cnVlKTtcblxuICAgIHNlbC5hcHBlbmQoJ2NpcmNsZScpO1xuXG4gICAgdmFyIGV4aXQgPSB0aGlzLml0ZW1zLmV4aXQoKTtcbiAgICBleGl0LnJlbW92ZSgpO1xuICB9XG5cbiAgZHJhdyhlbCkge1xuICAgIGVsID0gZWwgfHzCoHRoaXMuaXRlbXM7XG5cbiAgICAvLyB0aGlzLnNvcnREYXRhKCk7XG5cbiAgICB2YXIgX3hTY2FsZSA9IHRoaXMuYmFzZS54U2NhbGU7XG4gICAgdmFyIF95U2NhbGUgPSB0aGlzLnlTY2FsZTtcbiAgICB2YXIgX2N4ID0gdGhpcy5jeCgpO1xuICAgIHZhciBfY3kgPSB0aGlzLmN5KCk7XG4gICAgdmFyIF9yICA9IHRoaXMucigpO1xuICAgIHZhciBfY29sb3IgPSB0aGlzLmNvbG9yKCk7XG4gICAgdmFyIF9vcGFjaXR5ID0gdGhpcy5vcGFjaXR5KCk7XG5cbiAgICB2YXIgY3ggPSAoZCkgPT4geyByZXR1cm4gX3hTY2FsZShfY3goZCkpOyB9O1xuICAgIHZhciBjeSA9IChkKSA9PiB7IHJldHVybiBfeVNjYWxlKF9jeShkKSk7IH07XG4gICAgdmFyIHIgID0gKGQpID0+IHsgcmV0dXJuIF9yKGQpIHx8IHRoaXMucGFyYW0oJ3JhZGl1cycpOyB9O1xuICAgIHZhciBjb2xvciAgID0gKGQpID0+IHsgcmV0dXJuIF9jb2xvcihkKSB8fMKgdGhpcy5wYXJhbSgnY29sb3InKTsgfTtcbiAgICB2YXIgb3BhY2l0eSA9IChkKSA9PiB7IHJldHVybiBfb3BhY2l0eShkKSB8fCB0aGlzLnBhcmFtKCdvcGFjaXR5Jyk7IH07XG5cbiAgICAvLyBkcmF3IGxpbmVcbiAgICBpZiAodGhpcy5wYXJhbSgnZGlzcGxheUxpbmUnKSkge1xuICAgICAgdGhpcy5saW5lLngoY3gpLnkoY3kpO1xuXG4gICAgICB0aGlzLmcuc2VsZWN0KCdwYXRoJylcbiAgICAgICAgLmF0dHIoJ2QnLCB0aGlzLmxpbmUodGhpcy5zb3J0RGF0YSgpKSlcbiAgICAgICAgLmF0dHIoJ3N0cm9rZScsIHRoaXMucGFyYW0oJ2xpbmVDb2xvcicpKVxuICAgICAgICAuYXR0cignc3Ryb2tlLXdpZHRoJywgMSlcbiAgICAgICAgLmF0dHIoJ3N0cm9rZS1vcGFjaXR5JywgdGhpcy5wYXJhbSgnb3BhY2l0eScpKVxuICAgICAgICAuYXR0cignZmlsbCcsICdub25lJyk7XG4gICAgfVxuXG4gICAgLy8gZHJhdyBjaXJjbGVzXG4gICAgZWwuc2VsZWN0QWxsKCdjaXJjbGUnKVxuICAgICAgLmF0dHIoJ2ZpbGwnLCBjb2xvcilcbiAgICAgIC5hdHRyKCdmaWxsLW9wYWNpdHknLCBvcGFjaXR5KVxuICAgICAgLmF0dHIoJ2N4JywgMClcbiAgICAgIC5hdHRyKCdjeScsIDApXG4gICAgICAuYXR0cigncicsIHIpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQpID0+IHtcbiAgICAgICAgcmV0dXJuICd0cmFuc2xhdGUoJyArIGN4KGQpICsgJywgJyArIGN5KGQpICsgJyknO1xuICAgICAgfSk7XG5cbiAgICBpZiAoISF0aGlzLmVhY2goKSkgeyBlbC5lYWNoKHRoaXMuZWFjaCgpKTsgfVxuICB9XG5cbiAgLy8gbG9naWMgcGVyZm9ybWVkIHRvIHNlbGVjdCBhbiBpdGVtIGZyb20gdGhlIGJydXNoXG4gIGhhbmRsZUJydXNoKGV4dGVudCwgZSkge1xuXG4gICAgLypcbiAgICBtb2RlID0gbW9kZSB8fCAneHknOyAvLyBkZWZhdWx0IHRyaWVzIHRvIG1hdGNoIGJvdGhcblxuICAgIHZhciBtb2RlWCA9IG1vZGUuaW5kZXhPZigneCcpID49IDA7XG4gICAgdmFyIG1vZGVZID0gbW9kZS5pbmRleE9mKCd5JykgPj0gMDtcbiAgICB2YXIgbWF0Y2hYID0gZmFsc2U7XG4gICAgdmFyIG1hdGNoWSA9IGZhbHNlO1xuXG4gICAgdmFyIHIgID0gdGhpcy5yKCk7XG4gICAgdmFyIGN4ID0gdGhpcy5jeCgpO1xuICAgIHZhciBjeSA9IHRoaXMuY3koKTtcblxuICAgIHRoaXMuZy5zZWxlY3RBbGwoJy5zZWxlY3RhYmxlJykuY2xhc3NlZCgnc2VsZWN0ZWQnLCAoZCwgaSkgPT4ge1xuICAgICAgdmFyIGhhbGZSID0gcihkKSAqIDAuNTtcblxuICAgICAgLy8gWCBtYXRjaFxuICAgICAgaWYgKG1vZGVYKSB7XG4gICAgICAgIHZhciB4MSA9IGN4KGQpIC0gaGFsZlI7XG4gICAgICAgIHZhciB4MiA9IGN4KGQpICsgaGFsZlI7XG4gICAgICAgIC8vICAgICAgICAgICAgYmVnaW5pbmcgc2VsICAgICAgICAgICAgICAgZW5kIHNlbFxuICAgICAgICB2YXIgbWF0Y2hYMSA9IGV4dGVudFswXVswXSA8PSB4MSAmJiB4MiA8IGV4dGVudFsxXVswXTtcbiAgICAgICAgdmFyIG1hdGNoWDIgPSBleHRlbnRbMF1bMF0gPD0geDIgJiYgeDEgPCBleHRlbnRbMV1bMF07XG5cbiAgICAgICAgbWF0Y2hYID0gKG1hdGNoWDEgfHwgbWF0Y2hYMik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtYXRjaFggPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBZIG1hdGNoXG4gICAgICBpZiAobW9kZVkpIHtcbiAgICAgICAgdmFyIHkxID0gY3koZCkgLSBoYWxmUjtcbiAgICAgICAgdmFyIHkyID0gY3koZCkgKyBoYWxmUjtcbiAgICAgICAgLy8gICAgICAgICAgICBiZWdpbmluZyBzZWwgICAgICAgICAgICAgICBlbmQgc2VsXG4gICAgICAgIHZhciBtYXRjaFkxID0gZXh0ZW50WzBdWzFdIDw9IHkxICYmIHkyIDwgZXh0ZW50WzFdWzFdO1xuICAgICAgICB2YXIgbWF0Y2hZMiA9IGV4dGVudFswXVsxXSA8PSB5MiAmJiB5MSA8PSBleHRlbnRbMV1bMV07XG4gICAgICAgIG1hdGNoWSA9IChtYXRjaFkxIHx8IG1hdGNoWTIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWF0Y2hZID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG1hdGNoWCAmJiBtYXRjaFk7XG4gICAgfSk7XG4gICAgKi9cbiAgfVxuXG4gIGhhbmRsZURyYWcoaXRlbSwgZSkge1xuICAgIGlmIChpdGVtID09PSBudWxsKSB7IHJldHVybjsgfVxuXG4gICAgdGhpcy5tb3ZlKGl0ZW0sIGUub3JpZ2luYWxFdmVudC5keCwgZS5vcmlnaW5hbEV2ZW50LmR5KTtcbiAgfVxuXG4gIG1vdmUoaXRlbSwgZHgsIGR5KSB7XG4gICAgaXRlbSA9IHRoaXMuZDMuc2VsZWN0KGl0ZW0pO1xuICAgIHZhciBkYXR1bSA9IGl0ZW0uZGF0dW0oKTtcblxuICAgIHZhciB4U2NhbGUgPSB0aGlzLmJhc2UueFNjYWxlO1xuICAgIHZhciB5U2NhbGUgPSB0aGlzLnlTY2FsZTtcbiAgICB2YXIgeVJhbmdlID0geVNjYWxlLnJhbmdlKCk7XG5cbiAgICB2YXIgY3ggPSB0aGlzLmN4KCk7XG4gICAgdmFyIGN5ID0gdGhpcy5jeSgpO1xuICAgIHZhciB4ID0geFNjYWxlKGN4KGRhdHVtKSk7XG4gICAgdmFyIHkgPSB5U2NhbGUoY3koZGF0dW0pKTtcbiAgICAvLyB1cGRhdGUgcmFuZ2VcbiAgICB4ICs9IGR4O1xuXG4gICAgLy8gY2xhbXAgeVxuICAgIHZhciB0YXJnZXRZID0geSArIGR5O1xuICAgIGlmICh0YXJnZXRZIDw9IHlSYW5nZVswXSAmJiB0YXJnZXRZID49IHlSYW5nZVsxXSkge1xuICAgICAgeSA9IHRhcmdldFk7XG4gICAgfVxuXG4gICAgLy8gcmFuZ2UgdG8gZG9tYWluXG4gICAgdmFyIHhWYWx1ZSA9IHhTY2FsZS5pbnZlcnQoeCk7XG4gICAgdmFyIHlWYWx1ZSA9IHlTY2FsZS5pbnZlcnQoeSk7XG4gICAgLy8gdXBkYXRlIGRhdGFcbiAgICBjeChkYXR1bSwgeFZhbHVlKTtcbiAgICBjeShkYXR1bSwgeVZhbHVlKTtcbiAgICAvLyByZWRyYXcgdmlld1xuICAgIHRoaXMuZHJhdyhpdGVtKTtcbiAgfVxuXG59XG5cbi8vIGFkZCBkYXRhIGFjY2Vzc29yc1xuYWNjZXNzb3JzLmdldEZ1bmN0aW9uKEJyZWFrcG9pbnQucHJvdG90eXBlLCBbXG4gICdjeCcsICdjeScsICdyJywgJ29wYWNpdHknLCAnY29sb3InXG5dKTtcblxuZnVuY3Rpb24gZmFjdG9yeSgpIHsgcmV0dXJuIG5ldyBCcmVha3BvaW50KCk7IH1cbmZhY3RvcnkuQnJlYWtwb2ludCA9IEJyZWFrcG9pbnQ7XG5cbm1vZHVsZS5leHBvcnRzID0gZmFjdG9yeTtcbiJdfQ==