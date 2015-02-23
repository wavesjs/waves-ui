"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];
var _core = require("babel-runtime/core-js")["default"];
var _require = require("utils");

var uniqueId = _require.uniqueId;
var _require2 = require("events");

var EventEmitter = _require2.EventEmitter;
var Zoomer = (function (EventEmitter) {
  function Zoomer() {
    _babelHelpers.classCallCheck(this, Zoomer);

    _babelHelpers.get(_core.Object.getPrototypeOf(Zoomer.prototype), "constructor", this).call(this);
    // alias `emit` method
    this.trigger = this.emit;
  }

  _babelHelpers.inherits(Zoomer, EventEmitter);

  _babelHelpers.prototypeProperties(Zoomer, null, {
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
      },
      writable: true,
      configurable: true
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
      },
      writable: true,
      configurable: true
    }
  });

  return Zoomer;
})(EventEmitter);

;

function factory() {
  return new Zoomer();
}
factory.Zoomer = Zoomer;

module.exports = factory;

//# sourceMappingURL=data:application/json;base64,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LEdBQUcsRUFBSztBQUN6QyxpQkFBTyxHQUFHLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLElBQUksQ0FBQztBQUMzQyxZQUFFLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztBQUNmLFlBQUUsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7O0FBRXZDLGNBQUksQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxhQUFhLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFDekMsZ0JBQUssT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFN0Isa0JBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ3pELGtCQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNyRCxrQkFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUM7U0FDekQsQ0FBQyxDQUFDO09BQ0o7Ozs7OztTQXJFRyxNQUFNO0dBQVMsWUFBWTs7QUFzRWhDLENBQUM7O0FBRUYsU0FBUyxPQUFPLEdBQUc7QUFBRSxTQUFPLElBQUksTUFBTSxFQUFFLENBQUM7Q0FBRTtBQUMzQyxPQUFPLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQzs7QUFFeEIsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMiLCJmaWxlIjoiLi96b29tZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciB7IHVuaXF1ZUlkIH0gPSByZXF1aXJlKCd1dGlscycpO1xudmFyIHsgRXZlbnRFbWl0dGVyIH0gPSByZXF1aXJlKCdldmVudHMnKTtcblxuY2xhc3MgWm9vbWVyIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIC8vIGFsaWFzIGBlbWl0YCBtZXRob2RcbiAgICB0aGlzLnRyaWdnZXIgPSB0aGlzLmVtaXQ7XG4gIH1cblxuICBzZWxlY3Qoc2VsZWN0b3IsIGN0eCkge1xuICAgIGN0eCA9IGN0eCB8fMKgZG9jdW1lbnQ7XG4gICAgdmFyIGVsbXMgPSBjdHggLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuICAgIGVsbXMgPSBbXS5tYXAuY2FsbChlbG1zLCBmdW5jdGlvbihlbG0pIHsgcmV0dXJuIGVsbTsgfSk7XG5cbiAgICBlbG1zLmZvckVhY2goKGVsbSkgPT4geyB0aGlzLmRlbGVnYXRlRXZlbnRzKGVsbSk7IH0pO1xuICAgIC8vIGFsbG93IGNoYWlubmluZ1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gYmluZCBldmVudHMgb24gb25lIGVsZW1lbnRcbiAgZGVsZWdhdGVFdmVudHMoZWxtKSB7XG4gICAgdmFyIHp4ID0gMDtcbiAgICB2YXIgenkgPSAwO1xuICAgIHZhciB4cG9uZW50ID0gMS4wMDU7XG4gICAgdmFyIHpvb21lclg7XG5cbiAgICAvLyBtb3VzZU1vdmVcbiAgICB2YXIgb25Nb3VzZU1vdmUgPSAoZXZ0KSA9PiB7XG4gICAgICBpZiAoZXZ0LndoaWNoICE9PSAxKSB7IHJldHVybjsgfVxuXG4gICAgICB2YXIgZGVsdGFYID0genggLSAocGFyc2VJbnQoZXZ0LnBhZ2VYIC0gem9vbWVyWCwgMTApKTtcbiAgICAgIHZhciBkZWx0YVkgPSB6eSAtIGV2dC5wYWdlWTtcbiAgICAgIHZhciB6b29tVmFsID0gTWF0aC5hYnMoZGVsdGFZKTtcblxuICAgICAgdmFyIHpGYWN0b3IgPSAoZGVsdGFZID4gMCkgP1xuICAgICAgICB6RmFjdG9yID0gTWF0aC5wb3coeHBvbmVudCwgem9vbVZhbCkgOlxuICAgICAgICB6RmFjdG9yID0gMSAvIE1hdGgucG93KHhwb25lbnQsIHpvb21WYWwpO1xuXG4gICAgICB2YXIgZSA9IHtcbiAgICAgICAgYW5jaG9yOiB6eCxcbiAgICAgICAgZmFjdG9yOiB6RmFjdG9yLFxuICAgICAgICBkZWx0YTogeyB4OiBkZWx0YVgsIHk6IGRlbHRhWSB9LFxuICAgICAgICBvcmlnaW5hbEV2ZW50OiBldnQgLy8ga2VlcCB0cmFjayBvZiB0aGUgb3JpZ2luYWwgZXZlbnRcbiAgICAgIH1cblxuICAgICAgdGhpcy50cmlnZ2VyKCdtb3VzZW1vdmUnLCBlKTtcbiAgICB9XG5cbiAgICAvLyBtb3VzZVVwXG4gICAgdmFyIG9uTW91c2VVcCA9IChldnQpID0+IHtcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Nb3VzZU1vdmUpO1xuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25Nb3VzZVVwKTtcbiAgICAgIC8vIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnem9vbWluZycpO1xuICAgICAgLy8gZXZlbnQgc2hvdWxkIGJlIHRoZSBzYW1lIGFzIGluIG1vdXNlIG1vdmVcbiAgICAgIHRoaXMudHJpZ2dlcignbW91c2V1cCcsIGV2dCk7XG4gICAgfVxuXG4gICAgLy8gbW91c2VEb3duXG4gICAgZWxtLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIChldnQpID0+IHtcbiAgICAgIHpvb21lclggPSBlbG0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcbiAgICAgIHp5ID0gZXZ0LnBhZ2VZO1xuICAgICAgenggPSBwYXJzZUludChldnQucGFnZVggLSB6b29tZXJYLCAxMCk7XG5cbiAgICAgIHZhciBlID0geyBhbmNob3I6IHp4LCBvcmlnaW5hbEV2ZW50OiBlIH07XG4gICAgICB0aGlzLnRyaWdnZXIoJ21vdXNlZG93bicsIGUpO1xuICAgICAgLy8gZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCd6b29taW5nJyk7XG4gICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uTW91c2VNb3ZlKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCk7XG4gICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBvbk1vdXNlVXApO1xuICAgIH0pO1xuICB9XG59O1xuXG5mdW5jdGlvbiBmYWN0b3J5KCkgeyByZXR1cm4gbmV3IFpvb21lcigpOyB9XG5mYWN0b3J5Llpvb21lciA9IFpvb21lcjtcblxubW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5O1xuXG4iXX0=