/* global d3 */

"use strict";

var events = require('events');
var eventEmitter = new events.EventEmitter();
var getSet = require('get-set');
var anchorVis = require('./anchor');

var zoomer;

// property descriptor
var baseDesc = {

  // swapX: { enumerable: true, writable: true },
  // swapY: { enumerable: true, writable: true },

  on: { enumerable: true, writable: true },
  trigger: { writable: true },
  
  // init
  // ----

  init: {
    value: function(options) {
      options = options || {}; // fail safe
      
      // generic getters(setters) accessors and defaults
      var addGS = getSet(this)([
          'graph'
        ]);

      this.on = eventEmitter.on;
      this.trigger = eventEmitter.emit;

      return this;
    }
  },

  // draws the layers
  draw: {
    enumerable: true, value: function(sel){

      var that = zoomer; // binding fix when called from d3
      var graph = that.graph();
      var anch = anchorVis().name('anch');
      graph.layer(anch);
      // graph.draw(); // redraws

      sel.each(function() {
        var zx = 0;
        var zy = 0;
        var xponent = 1.005;
        var zoomerX;

        d3.select(this).on('mousedown', function() {
          zoomerX = this.getBoundingClientRect().left;
          zy = d3.event.pageY;
          // zx = d3.event.offsetX;
          zx = parseInt(d3.event.pageX - zoomerX, 10);
          
          // update position of the anchor on click
          graph.layers['anch'].position(zx);

          document.body.classList.add('zooming');

          // mouseMove
          function mmove(evt) {
            if(evt.which === 1) {

              var deltaY = zy - evt.pageY;
              var deltaX = zx - (parseInt(evt.pageX - zoomerX, 10));

              var zoomVal = Math.abs(deltaY);
              var zFactor = (deltaY > 0)? Math.pow(xponent, zoomVal) : 1 / Math.pow(xponent, zoomVal);
              var e = {anchor: zx, factor: zFactor, delta: {x: deltaX, y: deltaY}};
              that.trigger('mousemove', e);
            }
          }

          // mouseUp
          function mup() {
            document.body.removeEventListener('mousemove', mmove);
            document.body.removeEventListener('mouseup', mup);
            document.body.classList.remove('zooming');
            that.trigger('mouseup');
          }

          document.body.addEventListener('mousemove', mmove);
          document.body.addEventListener('mouseup', mup);

        });
      });
      
      return this;
    }
  }


};


// exported factory
// ----------------
module.exports = function(options) {
  zoomer = Object.create({}, baseDesc);
  return zoomer.init(options); // return initiated object
};