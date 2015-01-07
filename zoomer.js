'use strict';

var uniqueId = (require('utils')).uniqueId;
var EventEmitter = (require('events')).EventEmitter;

var Zoomer = (function(super$0){var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(Zoomer, super$0);var proto$0={};

  function Zoomer() {
    if (!(this instanceof Zoomer)) { return new Zoomer; }

    super$0.call(this);
    // alias `emit` method
    this.trigger = this.emit;
  }if(super$0!==null)SP$0(Zoomer,super$0);Zoomer.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":Zoomer,"configurable":true,"writable":true}});DP$0(Zoomer,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.select = function(selector) {var this$0 = this;
    var elms = document.querySelectorAll(selector);
    elms = [].map.call(elms, function(elm) { return elm; });

    elms.forEach(function(elm)  { this$0.delegateEvents(elm); });

    // allow chainning
    return this;
  };

  // bind events on one element
  proto$0.delegateEvents = function(elm) {var this$0 = this;
    var zx = 0;
    var zy = 0;
    var xponent = 1.005;
    var zoomerX;

    // mouseMove
    var onMouseMove = function(evt)  {
      if (evt.which !== 1) { return; }

      var deltaX = zx - (parseInt(evt.pageX - zoomerX, 10));
      var deltaY = zy - evt.pageY;
      var zoomVal = Math.abs(deltaY);

      var zFactor = (deltaY > 0) ?
        zFactor = Math.pow(xponent, zoomVal) :
        zFactor = 1 / Math.pow(xponent, zoomVal);

      var e = {
        anchor: zx,
        factor: zFactor,
        delta: { x: deltaX, y: deltaY },
        originalEvent: evt // keep track of the original event
      }

      this$0.trigger('mousemove', e);
    }

    // mouseUp
    var onMouseUp = function(evt)  {
      document.body.removeEventListener('mousemove', onMouseMove);
      document.body.removeEventListener('mouseup', onMouseUp);
      // document.body.classList.remove('zooming');
      // event should be the same as in mouse move
      this$0.trigger('mouseup', evt);
    }

    // mouseDown
    elm.addEventListener('mousedown', function(evt)  {
      zoomerX = elm.getBoundingClientRect().left;
      zy = evt.pageY;
      zx = parseInt(evt.pageX - zoomerX, 10);

      var e = { anchor: zx, originalEvent: e };
      this$0.trigger('mousedown', e);
      // document.body.classList.add('zooming');
      document.body.addEventListener('mousemove', onMouseMove);
      document.body.addEventListener('mouseup', onMouseUp);
      document.body.addEventListener('mouseleave', onMouseUp);
    });
  };
MIXIN$0(Zoomer.prototype,proto$0);proto$0=void 0;return Zoomer;})(EventEmitter);;

module.exports = Zoomer;

