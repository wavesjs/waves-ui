function UILoop(fps) {
  this.fps = fps || 60;
  this.__callbacks = [];
  this.__running = false;
  this.raf = null;
}

UILoop.prototype.push = function(cb) {
  this.__callbacks.push(cb);
};

UILoop.prototype.start = function() {var this$0 = this;
  this.__running = true;
  this.raf = requestAnimationFrame(function() {return this$0.draw()});
};

UILoop.prototype.stop = function() {
  if(this.__running) {
   this.__running = false;
    cancelAnimationFrame(this.draw);
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

UILoop.prototype.draw = function(e) {var this$0 = this;
  if(this.__running) {
    this.exec();
    requestAnimationFrame(function() {return this$0.draw()});
  }
};

module.exports = UILoop;