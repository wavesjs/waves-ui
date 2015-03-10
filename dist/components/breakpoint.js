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
//# sourceMappingURL=data:application/json;base64,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QUFNLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7O0FBRTFCLFNBQUMsSUFBSSxFQUFFLENBQUM7OztBQUdSLFlBQUksT0FBTyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDckIsWUFBSSxPQUFPLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLE9BQU8sSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDaEQsV0FBQyxHQUFHLE9BQU8sQ0FBQztTQUNiOzs7QUFHRCxZQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlCLFlBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRTlCLFVBQUUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDbEIsVUFBRSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQzs7QUFFbEIsWUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztPQUNqQjs7OztTQXJPRyxVQUFVO0dBQVMsS0FBSzs7O0FBME85QixTQUFTLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FDMUMsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FDcEMsQ0FBQyxDQUFDOztBQUVILFNBQVMsT0FBTyxHQUFHO0FBQUUsU0FBTyxJQUFJLFVBQVUsRUFBRSxDQUFDO0NBQUU7QUFDL0MsT0FBTyxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7O0FBRWhDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDIiwiZmlsZSI6ImVzNi9oZWxwZXJzL3pvb21lci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIHsgdW5pcXVlSWQsIGFjY2Vzc29ycyB9ID0gcmVxdWlyZSgnLi4vaGVscGVycy91dGlscycpO1xudmFyIHsgTGF5ZXIgfSA9IHJlcXVpcmUoJy4uL2NvcmUvbGF5ZXInKTtcblxuY2xhc3MgQnJlYWtwb2ludCBleHRlbmRzIExheWVyIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgdHlwZTogJ2JyZWFrcG9pbnQnLFxuICAgICAgaWQ6IHVuaXF1ZUlkKG5hbWUpLFxuICAgICAgb3BhY2l0eTogMSxcbiAgICAgIGNvbG9yOiAnIzAwMDAwMCcsXG4gICAgICBsaW5lQ29sb3I6ICcjMDAwMDAwJyxcbiAgICAgIGRpc3BsYXlMaW5lOiB0cnVlLFxuICAgICAgcmFkaXVzOiAzLFxuICAgICAgaW50ZXJwb2xhdGU6ICdsaW5lYXInXG4gICAgfTtcblxuICAgIHRoaXMucGFyYW1zKGRlZmF1bHRzKTtcblxuICAgIHRoaXMuY3goZnVuY3Rpb24oZCwgdiA9IG51bGwpIHtcbiAgICAgIGlmICh2ID09PSBudWxsKSByZXR1cm4gK2QuY3g7XG4gICAgICBkLmN4ID0gKCt2KTtcbiAgICB9KTtcblxuICAgIHRoaXMuY3koZnVuY3Rpb24oZCwgdiA9IG51bGwpIHtcbiAgICAgIGlmICh2ID09PSBudWxsKSByZXR1cm4gK2QuY3k7XG4gICAgICBkLmN5ID0gKCt2KTtcbiAgICB9KTtcblxuICAgIHRoaXMucihmdW5jdGlvbihkLCB2ID0gbnVsbCkge1xuICAgICAgaWYgKHYgPT09IG51bGwpIHJldHVybiArZC5yO1xuICAgICAgZC5yID0gKCt2KTtcbiAgICB9KTtcblxuICAgIHRoaXMub3BhY2l0eShmdW5jdGlvbihkLCB2ID0gbnVsbCkge1xuICAgICAgaWYgKHYgPT09IG51bGwpIHJldHVybiArZC5vcGFjaXR5O1xuICAgICAgZC5vcGFjaXR5ID0gKCt2KTtcbiAgICB9KTtcblxuICAgIHRoaXMuY29sb3IoZnVuY3Rpb24oZCwgdiA9IG51bGwpIHtcbiAgICAgIGlmICh2ID09PSBudWxsKSByZXR1cm4gZC5jb2xvcjtcbiAgICAgIGQuY29sb3IgPSB2ICsgJyc7XG4gICAgfSk7XG4gIH1cblxuICAvLyBrZWVwIGJyZWFrcG9pbnRzIGNvaGVyZW50IGluIHRpbWUgYXhpc1xuICBzb3J0RGF0YSgpIHtcbiAgICB2YXIgY3ggPSB0aGlzLmN4KCk7XG4gICAgdGhpcy5kYXRhKCkuc29ydCgoYSwgYikgPT4geyByZXR1cm4gY3goYSkgLSBjeChiKTsgfSk7XG4gIH1cblxuICB4Wm9vbSgpIHtcbiAgICAvLyB2YXIgeFNjYWxlID0gdGhpcy5iYXNlLnhTY2FsZTtcbiAgICAgIC8vIHZhciBtaW4gPSB4U2NhbGUuZG9tYWluKClbMF0sXG4gICAgICAvLyAgICAgbWF4ID0geFNjYWxlLmRvbWFpbigpWzFdO1xuXG4gICAgICAvLyAvLyB2YXIgbnVEYXRhID0gW107XG4gICAgICAvLyB2YXIgZHYgPSBleHRlbmQodGhpcy5kZWZhdWx0RGF0YVZpZXcoKSwgdGhpcy5kYXRhVmlldygpKTtcbiAgICAgIC8vIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgLy8gdGhpcy5kYXRhKCkuZm9yRWFjaChmdW5jdGlvbihkLCBpKSB7XG4gICAgICAvLyAgIHZhciBzdGFydCA9IGR2LnhjKGQpO1xuICAgICAgLy8gICB2YXIgZHVyYXRpb24gPSBkdi5kdXJhdGlvbihkKTtcbiAgICAgIC8vICAgdmFyIGVuZCA9IHN0YXJ0ICsgZHVyYXRpb247XG5cbiAgICAgIC8vICAgLy8gcmV0aGluayB3aGVuIGZlZWxpbmcgc21hcnRlclxuICAgICAgLy8gICBpZigoc3RhcnQgPiBtaW4gJiYgZW5kIDwgbWF4KSB8fCAoc3RhcnQgPCBtaW4gJiYgZW5kIDwgbWF4ICYmIGVuZCA+IG1pbikgfHwgKHN0YXJ0ID4gbWluICYmIHN0YXJ0IDwgbWF4ICYmIGVuZCA+IG1heCkgfHwgKGVuZCA+IG1heCAmJiBzdGFydCA8IG1pbikpIG51RGF0YS5wdXNoKGQpO1xuICAgICAgLy8gfSk7XG4gICAgICB0aGlzLnVwZGF0ZSgpO1xuICB9XG5cbiAgdXBkYXRlKGRhdGEpIHtcbiAgICBzdXBlci51cGRhdGUoZGF0YSk7XG5cbiAgICB0aGlzLnNvcnREYXRhKCk7XG5cbiAgICB0aGlzLml0ZW1zID0gdGhpcy5nLnNlbGVjdEFsbCgnLicgKyB0aGlzLnBhcmFtKCd1bml0Q2xhc3MnKSlcbiAgICAgIC5kYXRhKHRoaXMuZGF0YSgpKTtcblxuICAgIC8vIGNyZWF0ZSBsaW5lXG4gICAgaWYgKHRoaXMucGFyYW0oJ2Rpc3BsYXlMaW5lJykpIHtcbiAgICAgIHRoaXMubGluZSA9IHRoaXMuZDMuc3ZnLmxpbmUoKS5pbnRlcnBvbGF0ZSh0aGlzLnBhcmFtKCdpbnRlcnBvbGF0ZScpKTtcblxuICAgICAgdmFyIHBhdGggPSB0aGlzLmcuc2VsZWN0KCdwYXRoJyk7XG4gICAgICAvLyBjcmVhdGUgcGF0aCBpZiBub3QgZXhpc3RzXG4gICAgICBpZiAoIXBhdGhbMF1bMF0pIHsgcGF0aCA9IHRoaXMuZy5hcHBlbmQoJ3BhdGgnKTsgfVxuICAgICAgLy8gcmVtb3ZlIGxpbmUgaWYgbm8gZGF0YVxuICAgICAgaWYgKHRoaXMuZGF0YSgpLmxlbmd0aCA9PT0gMCkgeyBwYXRoLnJlbW92ZSgpOyB9XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlIHBvaW50c1xuICAgIHZhciBzZWwgPSB0aGlzLml0ZW1zLmVudGVyKClcbiAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgLmNsYXNzZWQoJ2l0ZW0nLCB0cnVlKVxuICAgICAgLmNsYXNzZWQodGhpcy5wYXJhbSgndW5pdENsYXNzJyksIHRydWUpO1xuXG4gICAgc2VsLmFwcGVuZCgnY2lyY2xlJyk7XG5cbiAgICB2YXIgZXhpdCA9IHRoaXMuaXRlbXMuZXhpdCgpO1xuICAgIGV4aXQucmVtb3ZlKCk7XG4gIH1cblxuICBkcmF3KGVsKSB7XG4gICAgZWwgPSBlbCB8fMKgdGhpcy5pdGVtcztcblxuICAgIHRoaXMuc29ydERhdGEoKTtcblxuICAgIHZhciBfeFNjYWxlID0gdGhpcy5iYXNlLnhTY2FsZTtcbiAgICB2YXIgX3lTY2FsZSA9IHRoaXMueVNjYWxlO1xuICAgIHZhciBfY3ggPSB0aGlzLmN4KCk7XG4gICAgdmFyIF9jeSA9IHRoaXMuY3koKTtcbiAgICB2YXIgX3IgID0gdGhpcy5yKCk7XG4gICAgdmFyIF9jb2xvciA9IHRoaXMuY29sb3IoKTtcbiAgICB2YXIgX29wYWNpdHkgPSB0aGlzLm9wYWNpdHkoKTtcblxuICAgIHZhciBjeCA9IChkKSA9PiB7IHJldHVybiBfeFNjYWxlKF9jeChkKSk7IH07XG4gICAgdmFyIGN5ID0gKGQpID0+IHsgcmV0dXJuIF95U2NhbGUoX2N5KGQpKTsgfTtcbiAgICB2YXIgciAgPSAoZCkgPT4geyByZXR1cm4gX3IoZCkgfHwgdGhpcy5wYXJhbSgncmFkaXVzJyk7IH07XG4gICAgdmFyIGNvbG9yICAgPSAoZCkgPT4geyByZXR1cm4gX2NvbG9yKGQpIHx8wqB0aGlzLnBhcmFtKCdjb2xvcicpOyB9O1xuICAgIHZhciBvcGFjaXR5ID0gKGQpID0+IHsgcmV0dXJuIF9vcGFjaXR5KGQpIHx8IHRoaXMucGFyYW0oJ29wYWNpdHknKTsgfTtcblxuICAgIC8vIGRyYXcgbGluZVxuICAgIGlmICh0aGlzLnBhcmFtKCdkaXNwbGF5TGluZScpKSB7XG4gICAgICB0aGlzLmxpbmUueChjeCkueShjeSk7XG5cbiAgICAgIHRoaXMuZy5zZWxlY3QoJ3BhdGgnKVxuICAgICAgICAuYXR0cignZCcsIHRoaXMubGluZSh0aGlzLmRhdGEoKSkpXG4gICAgICAgIC5hdHRyKCdzdHJva2UnLCB0aGlzLnBhcmFtKCdsaW5lQ29sb3InKSlcbiAgICAgICAgLmF0dHIoJ3N0cm9rZS13aWR0aCcsIDEpXG4gICAgICAgIC5hdHRyKCdzdHJva2Utb3BhY2l0eScsIHRoaXMucGFyYW0oJ29wYWNpdHknKSlcbiAgICAgICAgLmF0dHIoJ2ZpbGwnLCAnbm9uZScpO1xuICAgIH1cblxuICAgIC8vIGRyYXcgY2lyY2xlc1xuICAgIGVsLnNlbGVjdEFsbCgnY2lyY2xlJylcbiAgICAgIC5hdHRyKCdmaWxsJywgY29sb3IpXG4gICAgICAuYXR0cignZmlsbC1vcGFjaXR5Jywgb3BhY2l0eSlcbiAgICAgIC5hdHRyKCdjeCcsIDApXG4gICAgICAuYXR0cignY3knLCAwKVxuICAgICAgLmF0dHIoJ3InLCByKVxuICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkKSA9PiB7XG4gICAgICAgIHJldHVybiAndHJhbnNsYXRlKCcgKyBjeChkKSArICcsICcgKyBjeShkKSArICcpJztcbiAgICAgIH0pO1xuXG4gICAgaWYgKCEhdGhpcy5lYWNoKCkpIHsgZWwuZWFjaCh0aGlzLmVhY2goKSk7IH1cbiAgfVxuXG4gIC8vIGxvZ2ljIHBlcmZvcm1lZCB0byBzZWxlY3QgYW4gaXRlbSBmcm9tIHRoZSBicnVzaFxuICBoYW5kbGVCcnVzaChleHRlbnQsIGUpIHtcblxuICAgIC8qXG4gICAgbW9kZSA9IG1vZGUgfHwgJ3h5JzsgLy8gZGVmYXVsdCB0cmllcyB0byBtYXRjaCBib3RoXG5cbiAgICB2YXIgbW9kZVggPSBtb2RlLmluZGV4T2YoJ3gnKSA+PSAwO1xuICAgIHZhciBtb2RlWSA9IG1vZGUuaW5kZXhPZigneScpID49IDA7XG4gICAgdmFyIG1hdGNoWCA9IGZhbHNlO1xuICAgIHZhciBtYXRjaFkgPSBmYWxzZTtcblxuICAgIHZhciByICA9IHRoaXMucigpO1xuICAgIHZhciBjeCA9IHRoaXMuY3goKTtcbiAgICB2YXIgY3kgPSB0aGlzLmN5KCk7XG5cbiAgICB0aGlzLmcuc2VsZWN0QWxsKCcuc2VsZWN0YWJsZScpLmNsYXNzZWQoJ3NlbGVjdGVkJywgKGQsIGkpID0+IHtcbiAgICAgIHZhciBoYWxmUiA9IHIoZCkgKiAwLjU7XG5cbiAgICAgIC8vIFggbWF0Y2hcbiAgICAgIGlmIChtb2RlWCkge1xuICAgICAgICB2YXIgeDEgPSBjeChkKSAtIGhhbGZSO1xuICAgICAgICB2YXIgeDIgPSBjeChkKSArIGhhbGZSO1xuICAgICAgICAvLyAgICAgICAgICAgIGJlZ2luaW5nIHNlbCAgICAgICAgICAgICAgIGVuZCBzZWxcbiAgICAgICAgdmFyIG1hdGNoWDEgPSBleHRlbnRbMF1bMF0gPD0geDEgJiYgeDIgPCBleHRlbnRbMV1bMF07XG4gICAgICAgIHZhciBtYXRjaFgyID0gZXh0ZW50WzBdWzBdIDw9IHgyICYmIHgxIDwgZXh0ZW50WzFdWzBdO1xuXG4gICAgICAgIG1hdGNoWCA9IChtYXRjaFgxIHx8IG1hdGNoWDIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWF0Y2hYID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLy8gWSBtYXRjaFxuICAgICAgaWYgKG1vZGVZKSB7XG4gICAgICAgIHZhciB5MSA9IGN5KGQpIC0gaGFsZlI7XG4gICAgICAgIHZhciB5MiA9IGN5KGQpICsgaGFsZlI7XG4gICAgICAgIC8vICAgICAgICAgICAgYmVnaW5pbmcgc2VsICAgICAgICAgICAgICAgZW5kIHNlbFxuICAgICAgICB2YXIgbWF0Y2hZMSA9IGV4dGVudFswXVsxXSA8PSB5MSAmJiB5MiA8IGV4dGVudFsxXVsxXTtcbiAgICAgICAgdmFyIG1hdGNoWTIgPSBleHRlbnRbMF1bMV0gPD0geTIgJiYgeTEgPD0gZXh0ZW50WzFdWzFdO1xuICAgICAgICBtYXRjaFkgPSAobWF0Y2hZMSB8fCBtYXRjaFkyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1hdGNoWSA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBtYXRjaFggJiYgbWF0Y2hZO1xuICAgIH0pO1xuICAgICovXG4gIH1cblxuICBoYW5kbGVEcmFnKGl0ZW0sIGUpIHtcbiAgICBpZiAoaXRlbSA9PT0gbnVsbCkgeyByZXR1cm47IH1cblxuICAgIHRoaXMubW92ZShpdGVtLCBlLm9yaWdpbmFsRXZlbnQuZHgsIGUub3JpZ2luYWxFdmVudC5keSk7XG4gIH1cblxuICBtb3ZlKGl0ZW0sIGR4LCBkeSkge1xuICAgIGl0ZW0gPSB0aGlzLmQzLnNlbGVjdChpdGVtKTtcbiAgICB2YXIgZGF0dW0gPSBpdGVtLmRhdHVtKCk7XG5cbiAgICB2YXIgeFNjYWxlID0gdGhpcy5iYXNlLnhTY2FsZTtcbiAgICB2YXIgeVNjYWxlID0gdGhpcy55U2NhbGU7XG4gICAgdmFyIHlSYW5nZSA9IHlTY2FsZS5yYW5nZSgpO1xuXG4gICAgdmFyIGN4ID0gdGhpcy5jeCgpO1xuICAgIHZhciBjeSA9IHRoaXMuY3koKTtcbiAgICB2YXIgeCA9IHhTY2FsZShjeChkYXR1bSkpO1xuICAgIHZhciB5ID0geVNjYWxlKGN5KGRhdHVtKSk7XG4gICAgLy8gdXBkYXRlIHJhbmdlXG4gICAgeCArPSBkeDtcblxuICAgIC8vIGNsYW1wIHlcbiAgICB2YXIgdGFyZ2V0WSA9IHkgKyBkeTtcbiAgICBpZiAodGFyZ2V0WSA8PSB5UmFuZ2VbMF0gJiYgdGFyZ2V0WSA+PSB5UmFuZ2VbMV0pIHtcbiAgICAgIHkgPSB0YXJnZXRZO1xuICAgIH1cblxuICAgIC8vIHJhbmdlIHRvIGRvbWFpblxuICAgIHZhciB4VmFsdWUgPSB4U2NhbGUuaW52ZXJ0KHgpO1xuICAgIHZhciB5VmFsdWUgPSB5U2NhbGUuaW52ZXJ0KHkpO1xuICAgIC8vIHVwZGF0ZSBkYXRhXG4gICAgY3goZGF0dW0sIHhWYWx1ZSk7XG4gICAgY3koZGF0dW0sIHlWYWx1ZSk7XG4gICAgLy8gcmVkcmF3IHZpZXdcbiAgICB0aGlzLmRyYXcoaXRlbSk7XG4gIH1cblxufVxuXG4vLyBhZGQgZGF0YSBhY2Nlc3NvcnNcbmFjY2Vzc29ycy5nZXRGdW5jdGlvbihCcmVha3BvaW50LnByb3RvdHlwZSwgW1xuICAnY3gnLCAnY3knLCAncicsICdvcGFjaXR5JywgJ2NvbG9yJ1xuXSk7XG5cbmZ1bmN0aW9uIGZhY3RvcnkoKSB7IHJldHVybiBuZXcgQnJlYWtwb2ludCgpOyB9XG5mYWN0b3J5LkJyZWFrcG9pbnQgPSBCcmVha3BvaW50O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnk7XG4iXX0=