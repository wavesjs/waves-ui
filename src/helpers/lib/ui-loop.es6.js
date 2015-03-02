class UILoop {

  constructor(fps) {
    this.fps = fps || 60;

    this.__queue = [];
    this.__isRunning = false;
    this.__rAFId = null;

    this.then = Date.now();
    this.interval = 1000 / fps;
  }

  register(func, args = [], ctx = null) {
    var ticket = { func, args, ctx };
    this.__queue.push(ticket);
  }

  hasRegisteredCallbacks() {
    return !!this.__queue.length;
  }

  start() {
    if (this.__isRunning) { return; }

    this.__isRunning = true;
    this.__rAFId = window.requestAnimationFrame(() => this.draw());
  }

  stop() {
    if (!this.__isRunning) { return; }

    this.__isRunning = false;
    window.cancelAnimationFrame(this.__rAFId);
  }

  exec() {
    if (!this.__queue.length) { return; }

    // callbacks must be called in the same order they were registered FIFO
    for (var i = 0; i < this.__queue.length; i++) {
      var ticket = this.__queue[i];
      ticket.func.apply(ticket.ctx, ticket.args);
      this.__queue.splice(i, 1);
      // decrement to keep in sync with callbacks length
      i = i - 1;
    }
  }

  draw(e) {
    if (!this.__isRunning) { return; }

    this.__rAFId = window.requestAnimationFrame(() => this.draw());

    this.now = Date.now();
    this.delta = this.now - this.then;

    if (this.delta > this.interval) {
      this.then = this.now - (this.delta % this.interval);
      this.exec();
    }
  }
}

module.exports = UILoop;