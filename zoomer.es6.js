'use strict';

var { uniqueId } = require('utils');
var { EventEmitter } = require('events');

class Zoomer extends EventEmitter {

  constructor() {
    if (!(this instanceof Zoomer)) { return new Zoomer; }

    super();
    // alias `emit` method
    this.trigger = this.emit;
  }

  select(selector) {
    var elms = document.querySelectorAll(selector);
    elms = [].map.call(elms, function(elm) { return elm; });

    elms.forEach((elm) => { this.delegateEvents(elm); });

    // allow chainning
    return this;
  }

  // bind events on one element
  delegateEvents(elm) {
    var zx = 0;
    var zy = 0;
    var xponent = 1.005;
    var zoomerX;

    // mouseMove
    var onMouseMove = (evt) => {
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

      this.trigger('mousemove', e);
    }

    // mouseUp
    var onMouseUp = (evt) => {
      document.body.removeEventListener('mousemove', onMouseMove);
      document.body.removeEventListener('mouseup', onMouseUp);
      // document.body.classList.remove('zooming');
      // event should be the same as in mouse move
      this.trigger('mouseup', evt);
    }

    // mouseDown
    elm.addEventListener('mousedown', (evt) => {
      zoomerX = elm.getBoundingClientRect().left;
      zy = evt.pageY;
      zx = parseInt(evt.pageX - zoomerX, 10);

      var e = { anchor: zx, originalEvent: e };
      this.trigger('mousedown', e);
      // document.body.classList.add('zooming');
      document.body.addEventListener('mousemove', onMouseMove);
      document.body.addEventListener('mouseup', onMouseUp);
      document.body.addEventListener('mouseleave', onMouseUp);
    });
  }
};

module.exports = Zoomer;

