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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9oZWxwZXJzL3pvb21lci5lczYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O2VBRW1CLE9BQU8sQ0FBQyxTQUFTLENBQUM7O0lBQS9CLFFBQVEsWUFBUixRQUFROztnQkFDUyxPQUFPLENBQUMsUUFBUSxDQUFDOztJQUFsQyxZQUFZLGFBQVosWUFBWTs7SUFFWixNQUFNLGNBQVMsWUFBWTtBQUVwQixXQUZQLE1BQU07dUNBQU4sTUFBTTs7QUFHUixrREFIRSxNQUFNLDZDQUdBOztBQUVSLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztHQUMxQjs7eUJBTkcsTUFBTSxFQUFTLFlBQVk7O29DQUEzQixNQUFNO0FBUVYsVUFBTTthQUFBLGdCQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7OztBQUNwQixXQUFHLEdBQUcsR0FBRyxJQUFJLFFBQVEsQ0FBQztBQUN0QixZQUFJLElBQUksR0FBRyxHQUFHLENBQUUsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDM0MsWUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxVQUFTLEdBQUcsRUFBRTtBQUFFLGlCQUFPLEdBQUcsQ0FBQztTQUFFLENBQUMsQ0FBQzs7QUFFeEQsWUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUFFLGdCQUFLLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUFFLENBQUMsQ0FBQzs7QUFFckQsZUFBTyxJQUFJLENBQUM7T0FDYjs7OztBQUdELGtCQUFjOzs7O2FBQUEsd0JBQUMsR0FBRyxFQUFFOzs7QUFDbEIsWUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ1gsWUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ1gsWUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDO0FBQ3BCLFlBQUksT0FBTyxDQUFDOzs7QUFHWixZQUFJLFdBQVcsR0FBRyxVQUFDLEdBQUcsRUFBSztBQUN6QixjQUFJLEdBQUcsQ0FBQyxLQUFLLEtBQUssQ0FBQyxFQUFFO0FBQUUsbUJBQU87V0FBRTs7QUFFaEMsY0FBSSxNQUFNLEdBQUcsRUFBRSxHQUFJLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLE9BQU8sRUFBRSxFQUFFLENBQUMsQUFBQyxDQUFDO0FBQ3RELGNBQUksTUFBTSxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO0FBQzVCLGNBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRS9CLGNBQUksT0FBTyxHQUFHLEFBQUMsTUFBTSxHQUFHLENBQUMsR0FDdkIsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUNwQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDOztBQUUzQyxjQUFJLENBQUMsR0FBRztBQUNOLGtCQUFNLEVBQUUsRUFBRTtBQUNWLGtCQUFNLEVBQUUsT0FBTztBQUNmLGlCQUFLLEVBQUUsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUU7QUFDL0IseUJBQWEsRUFBRSxHQUFHO0FBQUEsV0FDbkIsQ0FBQzs7QUFFRixnQkFBSyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQzlCLENBQUM7OztBQUdGLFlBQUksU0FBUyxHQUFHLFVBQUMsR0FBRyxFQUFLO0FBQ3ZCLGtCQUFRLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUM1RCxrQkFBUSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7OztBQUd4RCxnQkFBSyxPQUFPLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQzlCLENBQUM7OztBQUdGLFdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsVUFBQyxHQUFHLEVBQUs7QUFDekMsaUJBQU8sR0FBRyxHQUFHLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxJQUFJLENBQUM7QUFDM0MsWUFBRSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7QUFDZixZQUFFLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDOztBQUV2QyxjQUFJLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsYUFBYSxFQUFFLENBQUMsRUFBRSxDQUFDO0FBQ3pDLGdCQUFLLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRTdCLGtCQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUN6RCxrQkFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDckQsa0JBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1NBQ3pELENBQUMsQ0FBQztPQUNKOzs7Ozs7U0FyRUcsTUFBTTtHQUFTLFlBQVk7O0FBd0VqQyxTQUFTLE9BQU8sR0FBRztBQUFFLFNBQU8sSUFBSSxNQUFNLEVBQUUsQ0FBQztDQUFFO0FBQzNDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDOztBQUV4QixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyIsImZpbGUiOiJzcmMvaGVscGVycy96b29tZXIuZXM2LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgeyB1bmlxdWVJZCB9ID0gcmVxdWlyZSgnLi91dGlscycpO1xudmFyIHsgRXZlbnRFbWl0dGVyIH0gPSByZXF1aXJlKCdldmVudHMnKTtcblxuY2xhc3MgWm9vbWVyIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIC8vIGFsaWFzIGBlbWl0YCBtZXRob2RcbiAgICB0aGlzLnRyaWdnZXIgPSB0aGlzLmVtaXQ7XG4gIH1cblxuICBzZWxlY3Qoc2VsZWN0b3IsIGN0eCkge1xuICAgIGN0eCA9IGN0eCB8fMKgZG9jdW1lbnQ7XG4gICAgdmFyIGVsbXMgPSBjdHggLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuICAgIGVsbXMgPSBbXS5tYXAuY2FsbChlbG1zLCBmdW5jdGlvbihlbG0pIHsgcmV0dXJuIGVsbTsgfSk7XG5cbiAgICBlbG1zLmZvckVhY2goKGVsbSkgPT4geyB0aGlzLmRlbGVnYXRlRXZlbnRzKGVsbSk7IH0pO1xuICAgIC8vIGFsbG93IGNoYWlubmluZ1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gYmluZCBldmVudHMgb24gb25lIGVsZW1lbnRcbiAgZGVsZWdhdGVFdmVudHMoZWxtKSB7XG4gICAgdmFyIHp4ID0gMDtcbiAgICB2YXIgenkgPSAwO1xuICAgIHZhciB4cG9uZW50ID0gMS4wMDU7XG4gICAgdmFyIHpvb21lclg7XG5cbiAgICAvLyBtb3VzZU1vdmVcbiAgICB2YXIgb25Nb3VzZU1vdmUgPSAoZXZ0KSA9PiB7XG4gICAgICBpZiAoZXZ0LndoaWNoICE9PSAxKSB7IHJldHVybjsgfVxuXG4gICAgICB2YXIgZGVsdGFYID0genggLSAocGFyc2VJbnQoZXZ0LnBhZ2VYIC0gem9vbWVyWCwgMTApKTtcbiAgICAgIHZhciBkZWx0YVkgPSB6eSAtIGV2dC5wYWdlWTtcbiAgICAgIHZhciB6b29tVmFsID0gTWF0aC5hYnMoZGVsdGFZKTtcblxuICAgICAgdmFyIHpGYWN0b3IgPSAoZGVsdGFZID4gMCkgP1xuICAgICAgICB6RmFjdG9yID0gTWF0aC5wb3coeHBvbmVudCwgem9vbVZhbCkgOlxuICAgICAgICB6RmFjdG9yID0gMSAvIE1hdGgucG93KHhwb25lbnQsIHpvb21WYWwpO1xuXG4gICAgICB2YXIgZSA9IHtcbiAgICAgICAgYW5jaG9yOiB6eCxcbiAgICAgICAgZmFjdG9yOiB6RmFjdG9yLFxuICAgICAgICBkZWx0YTogeyB4OiBkZWx0YVgsIHk6IGRlbHRhWSB9LFxuICAgICAgICBvcmlnaW5hbEV2ZW50OiBldnQgLy8ga2VlcCB0cmFjayBvZiB0aGUgb3JpZ2luYWwgZXZlbnRcbiAgICAgIH07XG5cbiAgICAgIHRoaXMudHJpZ2dlcignbW91c2Vtb3ZlJywgZSk7XG4gICAgfTtcblxuICAgIC8vIG1vdXNlVXBcbiAgICB2YXIgb25Nb3VzZVVwID0gKGV2dCkgPT4ge1xuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSk7XG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk1vdXNlVXApO1xuICAgICAgLy8gZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCd6b29taW5nJyk7XG4gICAgICAvLyBldmVudCBzaG91bGQgYmUgdGhlIHNhbWUgYXMgaW4gbW91c2UgbW92ZVxuICAgICAgdGhpcy50cmlnZ2VyKCdtb3VzZXVwJywgZXZ0KTtcbiAgICB9O1xuXG4gICAgLy8gbW91c2VEb3duXG4gICAgZWxtLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIChldnQpID0+IHtcbiAgICAgIHpvb21lclggPSBlbG0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcbiAgICAgIHp5ID0gZXZ0LnBhZ2VZO1xuICAgICAgenggPSBwYXJzZUludChldnQucGFnZVggLSB6b29tZXJYLCAxMCk7XG5cbiAgICAgIHZhciBlID0geyBhbmNob3I6IHp4LCBvcmlnaW5hbEV2ZW50OiBlIH07XG4gICAgICB0aGlzLnRyaWdnZXIoJ21vdXNlZG93bicsIGUpO1xuICAgICAgLy8gZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCd6b29taW5nJyk7XG4gICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uTW91c2VNb3ZlKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCk7XG4gICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBvbk1vdXNlVXApO1xuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZhY3RvcnkoKSB7IHJldHVybiBuZXcgWm9vbWVyKCk7IH1cbmZhY3RvcnkuWm9vbWVyID0gWm9vbWVyO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnk7XG5cbiJdfQ==