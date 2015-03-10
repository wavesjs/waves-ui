"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _require = require("./utils");

var uniqueId = _require.uniqueId;

var _require2 = require("events");

var EventEmitter = _require2.EventEmitter;

var Zoomer = (function (_EventEmitter) {
  function Zoomer() {
    _classCallCheck(this, Zoomer);

    _get(_core.Object.getPrototypeOf(Zoomer.prototype), "constructor", this).call(this);
    // alias `emit` method
    this.trigger = this.emit;
  }

  _inherits(Zoomer, _EventEmitter);

  _createClass(Zoomer, {
    select: {
      value: function select(selector, ctx) {
        var _this = this;

        ctx = ctx || document;
        var elms = ctx.querySelectorAll(selector);
        elms = [].map.call(elms, function (elm) {
          return elm;
        });

        elms.forEach(function (elm) {
          _this.delegateEvents(elm);
        });
        // allow chainning
        return this;
      }
    },
    delegateEvents: {

      // bind events on one element

      value: function delegateEvents(elm) {
        var _this = this;

        var zx = 0;
        var zy = 0;
        var xponent = 1.005;
        var zoomerX;

        // mouseMove
        var onMouseMove = function (evt) {
          if (evt.which !== 1) {
            return;
          }

          var deltaX = zx - parseInt(evt.pageX - zoomerX, 10);
          var deltaY = zy - evt.pageY;
          var zoomVal = Math.abs(deltaY);

          var zFactor = deltaY > 0 ? zFactor = Math.pow(xponent, zoomVal) : zFactor = 1 / Math.pow(xponent, zoomVal);

          var e = {
            anchor: zx,
            factor: zFactor,
            delta: { x: deltaX, y: deltaY },
            originalEvent: evt // keep track of the original event
          };

          _this.trigger("mousemove", e);
        };

        // mouseUp
        var onMouseUp = function (evt) {
          document.body.removeEventListener("mousemove", onMouseMove);
          document.body.removeEventListener("mouseup", onMouseUp);
          // document.body.classList.remove('zooming');
          // event should be the same as in mouse move
          _this.trigger("mouseup", evt);
        };

        // mouseDown
        elm.addEventListener("mousedown", function (evt) {
          zoomerX = elm.getBoundingClientRect().left;
          zy = evt.pageY;
          zx = parseInt(evt.pageX - zoomerX, 10);

          var e = { anchor: zx, originalEvent: e };
          _this.trigger("mousedown", e);
          // document.body.classList.add('zooming');
          document.body.addEventListener("mousemove", onMouseMove);
          document.body.addEventListener("mouseup", onMouseUp);
          document.body.addEventListener("mouseleave", onMouseUp);
        });
      }
    }
  });

  return Zoomer;
})(EventEmitter);

function factory() {
  return new Zoomer();
}
factory.Zoomer = Zoomer;

module.exports = factory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9oZWxwZXJzL3pvb21lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7ZUFFbUIsT0FBTyxDQUFDLFNBQVMsQ0FBQzs7SUFBL0IsUUFBUSxZQUFSLFFBQVE7O2dCQUNTLE9BQU8sQ0FBQyxRQUFRLENBQUM7O0lBQWxDLFlBQVksYUFBWixZQUFZOztJQUVaLE1BQU07QUFFQyxXQUZQLE1BQU0sR0FFSTswQkFGVixNQUFNOztBQUdSLHFDQUhFLE1BQU0sNkNBR0E7O0FBRVIsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0dBQzFCOztZQU5HLE1BQU07O2VBQU4sTUFBTTtBQVFWLFVBQU07YUFBQSxnQkFBQyxRQUFRLEVBQUUsR0FBRyxFQUFFOzs7QUFDcEIsV0FBRyxHQUFHLEdBQUcsSUFBSSxRQUFRLENBQUM7QUFDdEIsWUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFFLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzNDLFlBQUksR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsVUFBUyxHQUFHLEVBQUU7QUFBRSxpQkFBTyxHQUFHLENBQUM7U0FBRSxDQUFDLENBQUM7O0FBRXhELFlBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHLEVBQUs7QUFBRSxnQkFBSyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7U0FBRSxDQUFDLENBQUM7O0FBRXJELGVBQU8sSUFBSSxDQUFDO09BQ2I7O0FBR0Qsa0JBQWM7Ozs7YUFBQSx3QkFBQyxHQUFHLEVBQUU7OztBQUNsQixZQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDWCxZQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDWCxZQUFJLE9BQU8sR0FBRyxLQUFLLENBQUM7QUFDcEIsWUFBSSxPQUFPLENBQUM7OztBQUdaLFlBQUksV0FBVyxHQUFHLFVBQUMsR0FBRyxFQUFLO0FBQ3pCLGNBQUksR0FBRyxDQUFDLEtBQUssS0FBSyxDQUFDLEVBQUU7QUFBRSxtQkFBTztXQUFFOztBQUVoQyxjQUFJLE1BQU0sR0FBRyxFQUFFLEdBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsT0FBTyxFQUFFLEVBQUUsQ0FBQyxBQUFDLENBQUM7QUFDdEQsY0FBSSxNQUFNLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7QUFDNUIsY0FBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFL0IsY0FBSSxPQUFPLEdBQUcsQUFBQyxNQUFNLEdBQUcsQ0FBQyxHQUN2QixPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEdBQ3BDLE9BQU8sR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRTNDLGNBQUksQ0FBQyxHQUFHO0FBQ04sa0JBQU0sRUFBRSxFQUFFO0FBQ1Ysa0JBQU0sRUFBRSxPQUFPO0FBQ2YsaUJBQUssRUFBRSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRTtBQUMvQix5QkFBYSxFQUFFLEdBQUc7QUFBQSxXQUNuQixDQUFDOztBQUVGLGdCQUFLLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDOUIsQ0FBQzs7O0FBR0YsWUFBSSxTQUFTLEdBQUcsVUFBQyxHQUFHLEVBQUs7QUFDdkIsa0JBQVEsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQzVELGtCQUFRLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQzs7O0FBR3hELGdCQUFLLE9BQU8sQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDOUIsQ0FBQzs7O0FBR0YsV0FBRyxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxVQUFDLEdBQUcsRUFBSztBQUN6QyxpQkFBTyxHQUFHLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLElBQUksQ0FBQztBQUMzQyxZQUFFLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztBQUNmLFlBQUUsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7O0FBRXZDLGNBQUksQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxhQUFhLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFDekMsZ0JBQUssT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFN0Isa0JBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ3pELGtCQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNyRCxrQkFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUM7U0FDekQsQ0FBQyxDQUFDO09BQ0o7Ozs7U0FyRUcsTUFBTTtHQUFTLFlBQVk7O0FBd0VqQyxTQUFTLE9BQU8sR0FBRztBQUFFLFNBQU8sSUFBSSxNQUFNLEVBQUUsQ0FBQztDQUFFO0FBQzNDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDOztBQUV4QixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyIsImZpbGUiOiJlczYvaGVscGVycy96b29tZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciB7IHVuaXF1ZUlkIH0gPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgeyBFdmVudEVtaXR0ZXIgfSA9IHJlcXVpcmUoJ2V2ZW50cycpO1xuXG5jbGFzcyBab29tZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgLy8gYWxpYXMgYGVtaXRgIG1ldGhvZFxuICAgIHRoaXMudHJpZ2dlciA9IHRoaXMuZW1pdDtcbiAgfVxuXG4gIHNlbGVjdChzZWxlY3RvciwgY3R4KSB7XG4gICAgY3R4ID0gY3R4IHx8wqBkb2N1bWVudDtcbiAgICB2YXIgZWxtcyA9IGN0eCAucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG4gICAgZWxtcyA9IFtdLm1hcC5jYWxsKGVsbXMsIGZ1bmN0aW9uKGVsbSkgeyByZXR1cm4gZWxtOyB9KTtcblxuICAgIGVsbXMuZm9yRWFjaCgoZWxtKSA9PiB7IHRoaXMuZGVsZWdhdGVFdmVudHMoZWxtKTsgfSk7XG4gICAgLy8gYWxsb3cgY2hhaW5uaW5nXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBiaW5kIGV2ZW50cyBvbiBvbmUgZWxlbWVudFxuICBkZWxlZ2F0ZUV2ZW50cyhlbG0pIHtcbiAgICB2YXIgenggPSAwO1xuICAgIHZhciB6eSA9IDA7XG4gICAgdmFyIHhwb25lbnQgPSAxLjAwNTtcbiAgICB2YXIgem9vbWVyWDtcblxuICAgIC8vIG1vdXNlTW92ZVxuICAgIHZhciBvbk1vdXNlTW92ZSA9IChldnQpID0+IHtcbiAgICAgIGlmIChldnQud2hpY2ggIT09IDEpIHsgcmV0dXJuOyB9XG5cbiAgICAgIHZhciBkZWx0YVggPSB6eCAtIChwYXJzZUludChldnQucGFnZVggLSB6b29tZXJYLCAxMCkpO1xuICAgICAgdmFyIGRlbHRhWSA9IHp5IC0gZXZ0LnBhZ2VZO1xuICAgICAgdmFyIHpvb21WYWwgPSBNYXRoLmFicyhkZWx0YVkpO1xuXG4gICAgICB2YXIgekZhY3RvciA9IChkZWx0YVkgPiAwKSA/XG4gICAgICAgIHpGYWN0b3IgPSBNYXRoLnBvdyh4cG9uZW50LCB6b29tVmFsKSA6XG4gICAgICAgIHpGYWN0b3IgPSAxIC8gTWF0aC5wb3coeHBvbmVudCwgem9vbVZhbCk7XG5cbiAgICAgIHZhciBlID0ge1xuICAgICAgICBhbmNob3I6IHp4LFxuICAgICAgICBmYWN0b3I6IHpGYWN0b3IsXG4gICAgICAgIGRlbHRhOiB7IHg6IGRlbHRhWCwgeTogZGVsdGFZIH0sXG4gICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2dCAvLyBrZWVwIHRyYWNrIG9mIHRoZSBvcmlnaW5hbCBldmVudFxuICAgICAgfTtcblxuICAgICAgdGhpcy50cmlnZ2VyKCdtb3VzZW1vdmUnLCBlKTtcbiAgICB9O1xuXG4gICAgLy8gbW91c2VVcFxuICAgIHZhciBvbk1vdXNlVXAgPSAoZXZ0KSA9PiB7XG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uTW91c2VNb3ZlKTtcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCk7XG4gICAgICAvLyBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ3pvb21pbmcnKTtcbiAgICAgIC8vIGV2ZW50IHNob3VsZCBiZSB0aGUgc2FtZSBhcyBpbiBtb3VzZSBtb3ZlXG4gICAgICB0aGlzLnRyaWdnZXIoJ21vdXNldXAnLCBldnQpO1xuICAgIH07XG5cbiAgICAvLyBtb3VzZURvd25cbiAgICBlbG0uYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKGV2dCkgPT4ge1xuICAgICAgem9vbWVyWCA9IGVsbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0O1xuICAgICAgenkgPSBldnQucGFnZVk7XG4gICAgICB6eCA9IHBhcnNlSW50KGV2dC5wYWdlWCAtIHpvb21lclgsIDEwKTtcblxuICAgICAgdmFyIGUgPSB7IGFuY2hvcjogengsIG9yaWdpbmFsRXZlbnQ6IGUgfTtcbiAgICAgIHRoaXMudHJpZ2dlcignbW91c2Vkb3duJywgZSk7XG4gICAgICAvLyBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ3pvb21pbmcnKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Nb3VzZU1vdmUpO1xuICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25Nb3VzZVVwKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIG9uTW91c2VVcCk7XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZmFjdG9yeSgpIHsgcmV0dXJuIG5ldyBab29tZXIoKTsgfVxuZmFjdG9yeS5ab29tZXIgPSBab29tZXI7XG5cbm1vZHVsZS5leHBvcnRzID0gZmFjdG9yeTtcblxuIl19