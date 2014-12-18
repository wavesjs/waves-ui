
class UILoop {

  constructor(fps) {
    this.fps = fps || 60;
    this.__callbacks = [];
    this.__running = false;
    this.raf = null;
  }

  push(cb) {
    this.__callbacks.push(cb);
  }

  start() {
    this.__running = true;
    this.raf = requestAnimationFrame(()=> this.draw());
  }

  stop() {
    if(this.__running) {
     this.__running = false;
      requestAnimationFrame.cancel(this.draw);
    }
  }

  exec() {
    if(!this.__callbacks.length) return;
    var i, l = this.__callbacks.length;
    for (i = 0; i < l; i++) {
      this.__callbacks[i]();
    }
    this.__callbacks = [];
  }

  draw(e) {
    if(this.__running) {
      this.exec();
      requestAnimationFrame(()=> this.draw());
    }
  }
}

module.exports = UILoop;