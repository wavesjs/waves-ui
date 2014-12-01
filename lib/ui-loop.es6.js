var raf = window.requestAnimationFrame;

function UILoop(fps) {
  this.fps = fps || 60;
  this.__callbacks = [];
  this.__running = false;
  this.raf = null;
}

UILoop.prototype.push = function(cb) {
  this.__callbacks.push(cb);
};

UILoop.prototype.start = function() {
  this.__running = true;
  this.raf = raf(()=> this.draw());
};

UILoop.prototype.stop = function() {
  if(this.__running) {
   this.__running = false;
    raf.cancel(this.draw);
  }
};

UILoop.prototype.exec = function() {
  if(!this.__callbacks.length) return;
  var i, l = this.__callbacks.length;
  for (i = 0; i < l; i++) {
    this.__callbacks[i]();
  }
  this.__callbacks = [];
};

UILoop.prototype.draw = function(e) {
  if(this.__running) {
    this.exec();
    raf(()=> this.draw());
  }
};

module.exports = UILoop;