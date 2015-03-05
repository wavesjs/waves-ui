"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _require = require("./utils");

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

function factory() {
  return new Zoomer();
}
factory.Zoomer = Zoomer;

module.exports = factory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9oZWxwZXJzL3pvb21lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7ZUFFbUIsT0FBTyxDQUFDLFNBQVMsQ0FBQzs7SUFBL0IsUUFBUSxZQUFSLFFBQVE7O2dCQUNTLE9BQU8sQ0FBQyxRQUFRLENBQUM7O0lBQWxDLFlBQVksYUFBWixZQUFZOztJQUVaLE1BQU0sY0FBUyxZQUFZO0FBRXBCLFdBRlAsTUFBTTt1Q0FBTixNQUFNOztBQUdSLGtEQUhFLE1BQU0sNkNBR0E7O0FBRVIsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0dBQzFCOzt5QkFORyxNQUFNLEVBQVMsWUFBWTs7b0NBQTNCLE1BQU07QUFRVixVQUFNO2FBQUEsZ0JBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTs7O0FBQ3BCLFdBQUcsR0FBRyxHQUFHLElBQUksUUFBUSxDQUFDO0FBQ3RCLFlBQUksSUFBSSxHQUFHLEdBQUcsQ0FBRSxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMzQyxZQUFJLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFVBQVMsR0FBRyxFQUFFO0FBQUUsaUJBQU8sR0FBRyxDQUFDO1NBQUUsQ0FBQyxDQUFDOztBQUV4RCxZQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRyxFQUFLO0FBQUUsZ0JBQUssY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQUUsQ0FBQyxDQUFDOztBQUVyRCxlQUFPLElBQUksQ0FBQztPQUNiOzs7O0FBR0Qsa0JBQWM7Ozs7YUFBQSx3QkFBQyxHQUFHLEVBQUU7OztBQUNsQixZQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDWCxZQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDWCxZQUFJLE9BQU8sR0FBRyxLQUFLLENBQUM7QUFDcEIsWUFBSSxPQUFPLENBQUM7OztBQUdaLFlBQUksV0FBVyxHQUFHLFVBQUMsR0FBRyxFQUFLO0FBQ3pCLGNBQUksR0FBRyxDQUFDLEtBQUssS0FBSyxDQUFDLEVBQUU7QUFBRSxtQkFBTztXQUFFOztBQUVoQyxjQUFJLE1BQU0sR0FBRyxFQUFFLEdBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsT0FBTyxFQUFFLEVBQUUsQ0FBQyxBQUFDLENBQUM7QUFDdEQsY0FBSSxNQUFNLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7QUFDNUIsY0FBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFL0IsY0FBSSxPQUFPLEdBQUcsQUFBQyxNQUFNLEdBQUcsQ0FBQyxHQUN2QixPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEdBQ3BDLE9BQU8sR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRTNDLGNBQUksQ0FBQyxHQUFHO0FBQ04sa0JBQU0sRUFBRSxFQUFFO0FBQ1Ysa0JBQU0sRUFBRSxPQUFPO0FBQ2YsaUJBQUssRUFBRSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRTtBQUMvQix5QkFBYSxFQUFFLEdBQUc7QUFBQSxXQUNuQixDQUFDOztBQUVGLGdCQUFLLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDOUIsQ0FBQzs7O0FBR0YsWUFBSSxTQUFTLEdBQUcsVUFBQyxHQUFHLEVBQUs7QUFDdkIsa0JBQVEsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQzVELGtCQUFRLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQzs7O0FBR3hELGdCQUFLLE9BQU8sQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDOUIsQ0FBQzs7O0FBR0YsV0FBRyxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxVQUFDLEdBQUcsRUFBSztBQUN6QyxpQkFBTyxHQUFHLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLElBQUksQ0FBQztBQUMzQyxZQUFFLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztBQUNmLFlBQUUsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7O0FBRXZDLGNBQUksQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxhQUFhLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFDekMsZ0JBQUssT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFN0Isa0JBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ3pELGtCQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNyRCxrQkFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUM7U0FDekQsQ0FBQyxDQUFDO09BQ0o7Ozs7OztTQXJFRyxNQUFNO0dBQVMsWUFBWTs7QUF3RWpDLFNBQVMsT0FBTyxHQUFHO0FBQUUsU0FBTyxJQUFJLE1BQU0sRUFBRSxDQUFDO0NBQUU7QUFDM0MsT0FBTyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7O0FBRXhCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDIiwiZmlsZSI6ImVzNi9oZWxwZXJzL3pvb21lci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIHsgdW5pcXVlSWQgfSA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbnZhciB7IEV2ZW50RW1pdHRlciB9ID0gcmVxdWlyZSgnZXZlbnRzJyk7XG5cbmNsYXNzIFpvb21lciBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICAvLyBhbGlhcyBgZW1pdGAgbWV0aG9kXG4gICAgdGhpcy50cmlnZ2VyID0gdGhpcy5lbWl0O1xuICB9XG5cbiAgc2VsZWN0KHNlbGVjdG9yLCBjdHgpIHtcbiAgICBjdHggPSBjdHggfHzCoGRvY3VtZW50O1xuICAgIHZhciBlbG1zID0gY3R4IC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcbiAgICBlbG1zID0gW10ubWFwLmNhbGwoZWxtcywgZnVuY3Rpb24oZWxtKSB7IHJldHVybiBlbG07IH0pO1xuXG4gICAgZWxtcy5mb3JFYWNoKChlbG0pID0+IHsgdGhpcy5kZWxlZ2F0ZUV2ZW50cyhlbG0pOyB9KTtcbiAgICAvLyBhbGxvdyBjaGFpbm5pbmdcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGJpbmQgZXZlbnRzIG9uIG9uZSBlbGVtZW50XG4gIGRlbGVnYXRlRXZlbnRzKGVsbSkge1xuICAgIHZhciB6eCA9IDA7XG4gICAgdmFyIHp5ID0gMDtcbiAgICB2YXIgeHBvbmVudCA9IDEuMDA1O1xuICAgIHZhciB6b29tZXJYO1xuXG4gICAgLy8gbW91c2VNb3ZlXG4gICAgdmFyIG9uTW91c2VNb3ZlID0gKGV2dCkgPT4ge1xuICAgICAgaWYgKGV2dC53aGljaCAhPT0gMSkgeyByZXR1cm47IH1cblxuICAgICAgdmFyIGRlbHRhWCA9IHp4IC0gKHBhcnNlSW50KGV2dC5wYWdlWCAtIHpvb21lclgsIDEwKSk7XG4gICAgICB2YXIgZGVsdGFZID0genkgLSBldnQucGFnZVk7XG4gICAgICB2YXIgem9vbVZhbCA9IE1hdGguYWJzKGRlbHRhWSk7XG5cbiAgICAgIHZhciB6RmFjdG9yID0gKGRlbHRhWSA+IDApID9cbiAgICAgICAgekZhY3RvciA9IE1hdGgucG93KHhwb25lbnQsIHpvb21WYWwpIDpcbiAgICAgICAgekZhY3RvciA9IDEgLyBNYXRoLnBvdyh4cG9uZW50LCB6b29tVmFsKTtcblxuICAgICAgdmFyIGUgPSB7XG4gICAgICAgIGFuY2hvcjogengsXG4gICAgICAgIGZhY3RvcjogekZhY3RvcixcbiAgICAgICAgZGVsdGE6IHsgeDogZGVsdGFYLCB5OiBkZWx0YVkgfSxcbiAgICAgICAgb3JpZ2luYWxFdmVudDogZXZ0IC8vIGtlZXAgdHJhY2sgb2YgdGhlIG9yaWdpbmFsIGV2ZW50XG4gICAgICB9O1xuXG4gICAgICB0aGlzLnRyaWdnZXIoJ21vdXNlbW92ZScsIGUpO1xuICAgIH07XG5cbiAgICAvLyBtb3VzZVVwXG4gICAgdmFyIG9uTW91c2VVcCA9IChldnQpID0+IHtcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Nb3VzZU1vdmUpO1xuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25Nb3VzZVVwKTtcbiAgICAgIC8vIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnem9vbWluZycpO1xuICAgICAgLy8gZXZlbnQgc2hvdWxkIGJlIHRoZSBzYW1lIGFzIGluIG1vdXNlIG1vdmVcbiAgICAgIHRoaXMudHJpZ2dlcignbW91c2V1cCcsIGV2dCk7XG4gICAgfTtcblxuICAgIC8vIG1vdXNlRG93blxuICAgIGVsbS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoZXZ0KSA9PiB7XG4gICAgICB6b29tZXJYID0gZWxtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQ7XG4gICAgICB6eSA9IGV2dC5wYWdlWTtcbiAgICAgIHp4ID0gcGFyc2VJbnQoZXZ0LnBhZ2VYIC0gem9vbWVyWCwgMTApO1xuXG4gICAgICB2YXIgZSA9IHsgYW5jaG9yOiB6eCwgb3JpZ2luYWxFdmVudDogZSB9O1xuICAgICAgdGhpcy50cmlnZ2VyKCdtb3VzZWRvd24nLCBlKTtcbiAgICAgIC8vIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnem9vbWluZycpO1xuICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSk7XG4gICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk1vdXNlVXApO1xuICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgb25Nb3VzZVVwKTtcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBmYWN0b3J5KCkgeyByZXR1cm4gbmV3IFpvb21lcigpOyB9XG5mYWN0b3J5Llpvb21lciA9IFpvb21lcjtcblxubW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5O1xuXG4iXX0=